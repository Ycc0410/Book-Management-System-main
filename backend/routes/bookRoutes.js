import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    // 根據用戶角色取得書籍
    let books;
    if (req.user.role === 'admin') {
      books = await Book.find().populate('userId', 'username');
    } else {
      books = await Book.find({ userId: req.user.userId }).populate('userId', 'username');
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new book
router.post('/', async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      userId: req.user.userId  // 添加當前用戶ID
    });
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    // 檢查書籍是否存在
    if (!book) {
      return res.status(404).json({ message: '找不到此書籍' });
    }

    // 檢查權限
    if (req.user.role !== 'admin' && book.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: '無權編輯此書籍' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    // 檢查書籍是否存在
    if (!book) {
      return res.status(404).json({ message: '找不到此書籍' });
    }

    // 檢查權限
    if (req.user.role !== 'admin' && book.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: '無權刪除此書籍' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: '書籍已刪除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;