import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Package, Layers, DollarSign, Image } from 'lucide-react';

export const ManageProducts = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        name,
        description,
        price: parseFloat(price),
        stock_quantity: parseInt(stockQuantity),
        category_id: parseInt(categoryId), // В PostgreSQL ID является INTEGER
        image_url: imageUrl || null
      };

      const response = await axios.post('http://localhost:5000/api/products', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setSuccess(true);
        // Очищаем форму после успешного добавления
        setName('');
        setDescription('');
        setPrice('');
        setStockQuantity('');
        setCategoryId('');
        setImageUrl('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при добавлении товара на сервер');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border rounded-2xl shadow-sm mt-6">
      <div className="flex items-center space-x-2 border-b pb-4 mb-6">
        <PlusCircle className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Добавить новый товар в магазин</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Название товара</label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Например: Смартфон Galaxy S26"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Описание товара</label>
          <textarea
            placeholder="Подробно опишите характеристики и состояние товара..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Цена (сум)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                placeholder="Цена"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Количество на складе</label>
            <input
              type="number"
              placeholder="Штук"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
              min="0"
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">ID Категории</label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                placeholder="ID (например: 1)"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">Ссылка на изображение товара (Необязательно)</label>
          <div className="relative">
            <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="url"
              placeholder="https://example.com"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center font-medium bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}
        {success && <p className="text-sm text-green-500 text-center font-medium bg-green-50 py-2 rounded-xl border border-green-100">Товар успешно добавлен на маркетплейс!</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:bg-emerald-400 cursor-pointer mt-4"
        >
          {loading ? 'Добавление товара...' : 'Выставить товар на продажу'}
        </button>
      </form>
    </div>
  );
};
