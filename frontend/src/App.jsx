import React, { useState, useEffect } from 'react';
import BookManagement from './components/BookManagement';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // 檢查 token 是否存在
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div>
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <button
            onClick={handleLogout}
            className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            登出
          </button>
          <BookManagement token={token} />
        </div>
      )}
    </div>
  );
}

export default App;