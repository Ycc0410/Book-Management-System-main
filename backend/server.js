import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import User from './models/User.js';  // 改用 import

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 認證中間件
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: '請先登入' });
  }
};

// 登入路由
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: '用戶名或密碼錯誤' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '用戶名或密碼錯誤' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '服務器錯誤' });
  }
});

// 使用認證中間件保護路由
app.use('/api/books', auth, bookRoutes);

// MongoDB 連接
mongoose.connect('mongodb://127.0.0.1:27017/bookmanagement')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      const existingUser = await User.findOne({ username: 'admin' });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const defaultUser = new User({
          username: 'admin',
          password: hashedPassword,
          role: 'admin'
        });
        await defaultUser.save();
        console.log('Default user created successfully');
      }
    } catch (error) {
      console.error('Error creating default user:', error);
    }
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});