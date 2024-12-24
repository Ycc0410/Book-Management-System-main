// middleware/authMiddleware.js
const checkRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: '沒有權限執行此操作' });
      }
      next();
    };
  };
  
  export const adminOnly = checkRole(['admin']);
  export const userAndAdmin = checkRole(['user', 'admin']);