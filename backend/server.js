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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username }); // 調試日誌

    // 查找用戶
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username); // 調試日誌
      return res.status(400).json({ message: '用戶名或密碼錯誤' });
    }

    // 驗證密碼
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Attempting password match:', { isMatch }); // 調試日誌

    if (!isMatch) {
      return res.status(400).json({ message: '用戶名或密碼錯誤' });
    }

    // 生成 token，包含更多用戶資訊
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', username); // 調試日誌
    res.json({
      token,
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error); // 調試日誌
    res.status(500).json({ message: '服務器錯誤' });
  }
});
// 註冊路由
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 檢查用戶名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '用戶名已存在' });
    }

    // 創建新用戶
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      role: 'user'  // 預設為一般用戶
    });

    await user.save();
    res.status(201).json({ message: '註冊成功' });
  } catch (error) {
    res.status(500).json({ message: '註冊失敗' });
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