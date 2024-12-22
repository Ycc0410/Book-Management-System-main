import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data.token);
      } else {
        alert(data.message || '登入失敗');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('登入失敗');
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#e8f4f2]">
      <div className="w-[400px] bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">登入</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="用戶名"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="密碼"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;