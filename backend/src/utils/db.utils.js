import Document from "../models/document.model.js";

// Updated to handle title
export async function saveDocument(id, data, title) {
    try {
        // Convert the Quill delta object to a JSON string for storage
        const stringifiedData = JSON.stringify(data);

        // Create update object with data and optional title
        const updateObj = { data: stringifiedData };

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

export async function findOrCreateDocument(id, title) {
    try {
        const document = await Document.findById(id);

        if (document) {
            // Return document data and title
            return {
                data: document.data ? JSON.parse(document.data) : '',
                title: document.title
            };
        }

        // Create a new document if not found
        const newTitle = title || 'Untitled Document';
        const newDocument = await Document.create({
            _id: id,
            data: '',
            title: newTitle
        });

        return {
            data: '',
            title: newTitle
        };
    } catch (error) {
        console.error('Database error finding document:', error);
        throw error;
    }
}