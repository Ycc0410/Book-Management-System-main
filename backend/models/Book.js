// models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  published_year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['unread', 'reading', 'completed'],
    default: 'unread'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export default mongoose.model('Book', bookSchema);