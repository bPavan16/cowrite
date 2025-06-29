import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Search, Trash2, Users, Globe, Lock } from 'lucide-react';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Share Document
          </DialogTitle>
          <DialogDescription>{documentTitle}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-modal px-1">
          <div className="space-y-6 pr-1">
          {/* Visibility Toggle */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isPublic ? (
                      <Globe className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-600" />
                    )}
                    <h3 className="font-medium">Document Visibility</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isPublic ? 'Anyone can view this document' : 'Only collaborators can access this document'}
                  </p>
                </div>
                <Switch checked={isPublic} onCheckedChange={toggleVisibility} />
              </div>
            </CardContent>
          </Card>

          {/* Add Collaborators */}
          <div className="space-y-3">
            <h3 className="font-medium">Add People</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by email, username, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="max-h-32 overflow-y-auto scrollbar-modal rounded-md">
                    {searchResults.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-sm">
                              {getUserDisplayName(user).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{getUserDisplayName(user)}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareWithUser(user, 'read')}
                            disabled={loading}
                            className="text-xs"
                          >
                            Read
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareWithUser(user, 'write')}
                            disabled={loading}
                            className="text-xs"
                          >
                            Write
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareWithUser(user, 'admin')}
                            disabled={loading}
                            className="text-xs"
                          >
                            Admin
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Current Collaborators */}
          <div className="space-y-3">
            <h3 className="font-medium">People with access</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-modal rounded-md pr-1">
              {/* Owner */}
              {owner && (
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {getUserDisplayName(owner).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{getUserDisplayName(owner)} (You)</p>
                          <p className="text-xs text-muted-foreground">{owner.email}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        Owner
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Collaborators */}
              {collaborators.map((collaborator) => (
                <Card key={collaborator.user._id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm">
                            {getUserDisplayName(collaborator.user).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{getUserDisplayName(collaborator.user)}</p>
                          <p className="text-xs text-muted-foreground">{collaborator.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={collaborator.permission}
                          onValueChange={(value) => updatePermission(collaborator.user._id, value as 'read' | 'write' | 'admin')}
                        >
                          <SelectTrigger className="w-20 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="write">Write</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCollaborator(collaborator.user._id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {collaborators.length === 0 && (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground text-center">
                      No collaborators yet. Search for users above to share this document.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
