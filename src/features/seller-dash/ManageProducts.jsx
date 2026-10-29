import React, { useState } from 'react';
import axios from 'axios';
import { useUiStore } from '../../core/store/uiStore';
import { PlusCircle, Package, Layers, DollarSign, Image } from 'lucide-react';

const translations = {
  ru: {
    title: 'Добавить новый товар в магазин',
    productName: 'Название товара',
    productNamePlaceholder: 'Например: Смартфон Galaxy S26',
    description: 'Описание товара',
    descriptionPlaceholder: 'Подробно опишите характеристики и состояние товара...',
    price: 'Цена (сум)',
    pricePlaceholder: 'Цена',
    stock: 'Количество на складе',
    stockPlaceholder: 'Штук',
    category: 'ID Категории',
    categoryPlaceholder: 'ID (например: 1)',
    image: 'Ссылка на изображение товара (Необязательно)',
    imagePlaceholder: 'https://example.com',
    submit: 'Выставить товар на продажу',
    submitting: 'Добавление товара...',
    success: 'Товар успешно добавлен на маркетплейс!',
  },
  en: {
    title: 'Add a new product to the store',
    productName: 'Product name',
    productNamePlaceholder: 'Example: Galaxy S26 smartphone',
    description: 'Product description',
    descriptionPlaceholder: 'Describe the product features and condition in detail...',
    price: 'Price (sum)',
    pricePlaceholder: 'Price',
    stock: 'Stock quantity',
    stockPlaceholder: 'Pieces',
    category: 'Category ID',
    categoryPlaceholder: 'ID (for example: 1)',
    image: 'Product image URL (optional)',
    imagePlaceholder: 'https://example.com',
    submit: 'List product for sale',
    submitting: 'Adding product...',
    success: 'Product successfully added to the marketplace!',
  },
  kk: {
    title: 'Дүкенге жаңа тауар қосу',
    productName: 'Тауардың атауы',
    productNamePlaceholder: 'Мысалы: Galaxy S26 смартфоны',
    description: 'Тауар сипаттамасы',
    descriptionPlaceholder: 'Тауардың ерекшеліктері мен жай-күйін егжей-тегжейлі сипаттаңыз...',
    price: 'Баға (сом)',
    pricePlaceholder: 'Баға',
    stock: 'Қоймадағы саны',
    stockPlaceholder: 'Дана',
    category: 'Санат ID',
    categoryPlaceholder: 'ID (мысалы: 1)',
    image: 'Тауар суретінің сілтемесі (міндетті емес)',
    imagePlaceholder: 'https://example.com',
    submit: 'Тауарды сатуға шығару',
    submitting: 'Тауар қосылуда...',
    success: 'Тауар маркетплейске сәтті қосылды!',
  },
  uz: {
    title: 'Do‘konga yangi mahsulot qo‘shish',
    productName: 'Mahsulot nomi',
    productNamePlaceholder: 'Masalan: Galaxy S26 smartfoni',
    description: 'Mahsulot tavsifi',
    descriptionPlaceholder: 'Mahsulot xususiyatlari va holatini batafsil yozing...',
    price: 'Narx (so‘m)',
    pricePlaceholder: 'Narx',
    stock: 'Skladdagi soni',
    stockPlaceholder: 'Dona',
    category: 'Kategoriya ID',
    categoryPlaceholder: 'ID (masalan: 1)',
    image: 'Mahsulot rasmining havolasi (ixtiyoriy)',
    imagePlaceholder: 'https://example.com',
    submit: 'Mahsulotni sotuvga qo‘yish',
    submitting: 'Mahsulot qo‘shilmoqda...',
    success: 'Mahsulot marketplacega muvaffaqiyatli qo‘shildi!',
  },
};

export const ManageProducts = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { language } = useUiStore();
  const t = translations[language] || translations.ru;

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
        category_id: parseInt(categoryId),
        image_url: imageUrl || null
      };

      const response = await axios.post('http://localhost:5000/api/products', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setSuccess(true);
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
        <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">{t.productName}</label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={t.productNamePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">{t.description}</label>
          <textarea
            placeholder={t.descriptionPlaceholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">{t.price}</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                placeholder={t.pricePlaceholder}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">{t.stock}</label>
            <input
              type="number"
              placeholder={t.stockPlaceholder}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
              min="0"
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">{t.category}</label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                placeholder={t.categoryPlaceholder}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600">{t.image}</label>
          <div className="relative">
            <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="url"
              placeholder={t.imagePlaceholder}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center font-medium bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}
        {success && <p className="text-sm text-green-500 text-center font-medium bg-green-50 py-2 rounded-xl border border-green-100">{t.success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:bg-emerald-400 cursor-pointer mt-4"
        >
          {loading ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
};
