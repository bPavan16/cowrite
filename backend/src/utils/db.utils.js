import Document from "../models/document.model.js";
import { checkDocumentPermission } from "./auth.utils.js";

// Updated to handle title and user permissions
export async function saveDocument(id, data, title, user = null) {
    try {
        // Check if user has write permission (skip for legacy support)
        if (user) {
            const { hasPermission } = await checkDocumentPermission(id, user, 'write');
            if (!hasPermission) {
                throw new Error('Access denied: insufficient permissions to save document');
            }
        }

        // Convert the Quill delta object to a JSON string for storage
        const stringifiedData = data ? JSON.stringify(data) : undefined;

        // Create update object with data and optional title
        const updateObj = {};
        
        if (stringifiedData !== undefined) {
            updateObj.data = stringifiedData;
        }

        // Add title to update if provided
        if (title) {
            updateObj.title = title;
        }

        // Update the document with the stringified data and title
        const result = await Document.findByIdAndUpdate(
            id,
            updateObj,
            { upsert: true, new: true }
        );

        return result;
    } catch (error) {
        console.error('Database error saving document:', error);
        throw error;
    }
}

export async function findOrCreateDocument(id, title, user = null) {
    try {
        // First, try to find the document
        let document = await Document.findById(id)
            .populate('owner', 'username email firstName lastName')
            .populate('collaborators.user', 'username email firstName lastName');

        if (document) {
            // Check if user has read permission (allow legacy documents without owners)
            if (document.owner) {
                const { hasPermission } = await checkDocumentPermission(id, user, 'read');
                if (!hasPermission) {
                    throw new Error('Access denied: insufficient permissions to access document');
                }
            }

            // Return document data and title
            return {
                data: document.data ? JSON.parse(document.data) : '',
                title: document.title,
                owner: document.owner,
                collaborators: document.collaborators,
                isPublic: document.isPublic
            };
        }

        // Create a new document if not found
        // For backward compatibility, allow creation without user (legacy mode)
        const newTitle = title || 'Untitled Document';
        const newDocumentData = {
            _id: id,
            data: '',
            title: newTitle
        };

        // Add owner if user is provided
        if (user) {
            newDocumentData.owner = user._id;
            newDocumentData.isPublic = false;
        }

        const newDocument = await Document.create(newDocumentData);

        // Populate the owner information if exists
        if (newDocument.owner) {
            await newDocument.populate('owner', 'username email firstName lastName');
        }

        return {
            data: '',
            title: newDocument.title,
            owner: newDocument.owner || null,
            collaborators: [],
            isPublic: newDocument.isPublic || false
        };
    } catch (error) {
        console.error('Database error finding document:', error);
        throw error;
    }
}