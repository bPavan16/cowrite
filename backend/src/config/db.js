import mongoose from 'mongoose';

const connectToDb = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/cowrite-db')
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectToDb;