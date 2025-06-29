import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface Collaborator {
  user: User;
  permission: 'read' | 'write' | 'admin';
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  onUpdate?: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  documentId,
  documentTitle,
  onUpdate
}) => {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [owner, setOwner] = useState<User | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchCollaborators = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/documents/${documentId}/collaborators`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCollaborators(response.data.collaborators || []);
      setOwner(response.data.owner);
      setIsPublic(response.data.isPublic || false);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast.error('Failed to load collaborators');
    }
  }, [documentId, token]);

  const searchUsers = useCallback(async () => {
    try {
      setSearchLoading(true);
      const response = await axios.get(
        `http://localhost:3001/api/auth/users/search?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery, token]);

  useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
    }
  }, [isOpen, documentId, fetchCollaborators]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchUsers]);

  const shareWithUser = async (user: User, permission: 'read' | 'write' | 'admin' = 'write') => {
    try {
      setLoading(true);
      await axios.post(
        `http://localhost:3001/api/documents/${documentId}/share`,
        {
          email: user.email,
          permission
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success(`Document shared with ${user.username}`);
      setSearchQuery('');
      setSearchResults([]);
      fetchCollaborators();
      onUpdate?.();
    } catch (error) {
      console.error('Error sharing document:', error);
      const message = axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to share document';
      toast.error(message || 'Failed to share document');
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (userId: string, permission: 'read' | 'write' | 'admin') => {
    try {
      await axios.put(
        `http://localhost:3001/api/documents/${documentId}/collaborators/${userId}`,
        { permission },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success('Permissions updated');
      fetchCollaborators();
      onUpdate?.();
    } catch (error) {
      console.error('Error updating permissions:', error);
      const message = axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to update permissions';
      toast.error(message || 'Failed to update permissions');
    }
  };

  const removeCollaborator = async (userId: string) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/documents/${documentId}/collaborators/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success('Collaborator removed');
      fetchCollaborators();
      onUpdate?.();
    } catch (error) {
      console.error('Error removing collaborator:', error);
      const message = axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to remove collaborator';
      toast.error(message || 'Failed to remove collaborator');
    }
  };

  const toggleVisibility = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/documents/${documentId}/visibility`,
        { isPublic: !isPublic },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setIsPublic(!isPublic);
      toast.success(`Document is now ${!isPublic ? 'public' : 'private'}`);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating visibility:', error);
      const message = axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to update visibility';
      toast.error(message || 'Failed to update visibility');
    }
  };

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Share Document</h2>
              <p className="text-sm text-gray-600 mt-1">{documentTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Visibility Toggle */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Document Visibility</h3>
                <p className="text-sm text-gray-600">
                  {isPublic ? 'Anyone can view this document' : 'Only collaborators can access this document'}
                </p>
              </div>
              <button
                onClick={toggleVisibility}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isPublic ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Add Collaborators */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Add People</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by email, username, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchLoading && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{getUserDisplayName(user)}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => shareWithUser(user, 'read')}
                        disabled={loading}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        Read
                      </button>
                      <button
                        onClick={() => shareWithUser(user, 'write')}
                        disabled={loading}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Write
                      </button>
                      <button
                        onClick={() => shareWithUser(user, 'admin')}
                        disabled={loading}
                        className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                      >
                        Admin
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Collaborators */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">People with access</h3>
            <div className="space-y-3">
              {/* Owner */}
              {owner && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {getUserDisplayName(owner).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{getUserDisplayName(owner)} (You)</p>
                      <p className="text-sm text-gray-600">{owner.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs rounded-md bg-yellow-100 text-yellow-700">
                      Owner
                    </span>
                  </div>
                </div>
              )}

              {/* Collaborators */}
              {collaborators.map((collaborator) => (
                <div key={collaborator.user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {getUserDisplayName(collaborator.user).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{getUserDisplayName(collaborator.user)}</p>
                      <p className="text-sm text-gray-600">{collaborator.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={collaborator.permission}
                      onChange={(e) => updatePermission(collaborator.user._id, e.target.value as 'read' | 'write' | 'admin')}
                      className="text-xs px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="read">Read</option>
                      <option value="write">Write</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => removeCollaborator(collaborator.user._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remove collaborator"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {collaborators.length === 0 && (
                <p className="text-sm text-gray-600 text-center py-4">
                  No collaborators yet. Search for users above to share this document.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
