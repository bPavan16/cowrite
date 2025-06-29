import Document from '../models/document.model.js';

/**
 * Check if a user has permission to access a document
 * @param {string} documentId - The document ID
 * @param {Object} user - The user object (can be null for unauthenticated users)
 * @param {string} requiredPermission - 'read', 'write', or 'admin'
 * @returns {Promise<{hasPermission: boolean, document: Object|null}>}
 */
export async function checkDocumentPermission(documentId, user, requiredPermission = 'read') {
    try {
        const document = await Document.findById(documentId)
            .populate('owner', 'username email firstName lastName')
            .populate('collaborators.user', 'username email firstName lastName');

        if (!document) {
            return { hasPermission: false, document: null };
        }

        // If document has no owner (legacy document), allow access
        if (!document.owner) {
            return { hasPermission: true, document };
        }

        // If document is public and only read access is required
        if (document.isPublic && requiredPermission === 'read') {
            return { hasPermission: true, document };
        }

        // If user is not authenticated, only allow access to public documents for reading
        if (!user) {
            return { 
                hasPermission: document.isPublic && requiredPermission === 'read', 
                document 
            };
        }

        // If user is the owner, they have all permissions
        if (document.owner._id.toString() === user._id.toString()) {
            return { hasPermission: true, document };
        }

        // If user is admin, they have all permissions
        if (user.role === 'admin') {
            return { hasPermission: true, document };
        }

        // Check if user is a collaborator with sufficient permission
        const collaborator = document.collaborators.find(
            collab => collab.user._id.toString() === user._id.toString()
        );

        if (collaborator) {
            const permissionLevels = {
                'read': 1,
                'write': 2,
                'admin': 3
            };

            const userPermissionLevel = permissionLevels[collaborator.permission] || 0;
            const requiredPermissionLevel = permissionLevels[requiredPermission] || 0;

            return { 
                hasPermission: userPermissionLevel >= requiredPermissionLevel, 
                document 
            };
        }

        // If document is public and user is authenticated, allow read access
        if (document.isPublic && requiredPermission === 'read') {
            return { hasPermission: true, document };
        }

        return { hasPermission: false, document };
    } catch (error) {
        console.error('Error checking document permission:', error);
        return { hasPermission: false, document: null };
    }
}

/**
 * Get user's role in a document
 * @param {Object} document - The document object
 * @param {Object} user - The user object
 * @returns {string} - 'owner', 'collaborator', 'public', or 'none'
 */
export function getUserDocumentRole(document, user) {
    if (!document) return 'none';
    
    // If no user, check if document is public
    if (!user) {
        return document.isPublic ? 'public' : 'none';
    }

    // If user is admin
    if (user.role === 'admin') {
        return 'admin';
    }

    // If user is owner
    if (document.owner && document.owner._id.toString() === user._id.toString()) {
        return 'owner';
    }

    // If user is collaborator
    const collaborator = document.collaborators.find(
        collab => collab.user._id.toString() === user._id.toString()
    );

    if (collaborator) {
        return 'collaborator';
    }

    // If document is public
    if (document.isPublic) {
        return 'public';
    }

    return 'none';
}
