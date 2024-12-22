import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const BookManagement = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_year: '',
    status: 'unread'
  });

  // 添加通用的 headers 配置
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/books', {
        headers
      });
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentBook) {
        await fetch(`http://localhost:5001/api/books/${currentBook._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('http://localhost:5001/api/books', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData),
        });
      }
      fetchBooks();
      resetForm();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/books/${id}`, {
        method: 'DELETE',
        headers
      });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const fetchSingleBook = async () => {
    if (!searchId) return;
    try {
      const response = await fetch('http://localhost:5001/api/books', {
        headers
      });
      const data = await response.json();
      const filteredBooks = data.filter(book => 
        book.title.toLowerCase().includes(searchId.toLowerCase())
      );
      setBooks(filteredBooks);
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  };
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      published_year: '',
      status: 'unread'
    });
    setIsEditing(false);
    setCurrentBook(null);
  };

  return (
    <div className="min-h-screen bg-[#e8f4f2] p-8">
      <div className="w-full min-h-screen">
        <div className="flex gap-8">
          <div className="w-1/3 h-fit">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h1 className="text-2xl font-bold mb-6">私人書籍管理系統</h1>
              
              <div className="mb-6 flex gap-2">
                <input
                  type="text"
                  placeholder="輸入書名查詢"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={fetchSingleBook}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  查詢
                </button>
                <button
                  onClick={fetchBooks}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  全部
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 表單內容保持不變 */}
                <div>
                  <input
                    type="text"
                    placeholder="書名"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="作者"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="number"
                    placeholder="出版年份"
                    value={formData.published_year}
                    onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                    className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="unread">未讀</option>
                    <option value="reading">閱讀中</option>
                    <option value="completed">已讀完</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-2"
                >
                  {isEditing ? <Pencil className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  {isEditing ? '更新書籍' : '新增書籍'}
                </button>
              </form>
            </div>
          </div>

          <div className="w-2/3">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">所有書籍</h2>
              <div className="space-y-6">
                {books.map((book) => (
                  <div
                    key={book._id}
                    className="p-6 border border-gray-200 rounded-xl hover:border-blue-500 transition duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{book.title}</h3>
                        <p className="text-lg text-gray-600">作者：{book.author}</p>
                        <p className="text-lg text-gray-600">出版年份：{book.published_year}</p>
                        <span
                          className={`inline-block px-4 py-1 rounded-full text-lg
                            ${book.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            book.status === 'reading' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {book.status === 'completed' ? '已讀完' : 
                           book.status === 'reading' ? '閱讀中' : '未讀'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setCurrentBook(book);
                            setFormData({
                              title: book.title,
                              author: book.author,
                              published_year: book.published_year,
                              status: book.status
                            });
                          }}
                          className="p-3 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        >
                          <Pencil className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="p-3 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookManagement;