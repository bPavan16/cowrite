import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'Untitled Document'
    },
    data: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the 'updatedAt' field on every save
documentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Update the 'updatedAt' field on every update
documentSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const Document = mongoose.model('Document', documentSchema);

export default Document;