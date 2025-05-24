import express from 'express';
import Document from '../models/document.model.js';

const router = express.Router();

/**
 * @route   GET /api/documents
 * @desc    Get all documents
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        // Get all documents, excluding the data field for performance
        const documents = await Document.find({}, { data: 0 })
            .sort({ updatedAt: -1 });

        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/documents/:id
 * @desc    Get a document by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Parse the data field if it exists
        const response = {
            _id: document._id,
            title: document.title,
            data: document.data ? JSON.parse(document.data) : '',
            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/documents
 * @desc    Create a new document
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        const { title } = req.body;

        const newDocument = await Document.create({
            _id: Math.random().toString(36).substring(2, 10),
            title: title || 'Untitled Document',
            data: ''
        });

        res.status(201).json(newDocument);
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PATCH /api/documents/:id/title
 * @desc    Update document title
 * @access  Public
 */
router.patch('/:id/title', async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const document = await Document.findByIdAndUpdate(
            req.params.id,
            { title },
            { new: true }
        );

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json(document);
    } catch (error) {
        console.error('Error updating document title:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete a document
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;