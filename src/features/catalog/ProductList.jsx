import React, { useState, useMemo, useEffect } from 'react';
import { useCartStore } from '../../core/store/cartStore';
import { useUiStore } from '../../core/store/uiStore';
import { Search, SlidersHorizontal, ShoppingCart, Star } from 'lucide-react';
import keyboard from '../../assets/rgb клава.webp';
import watch from '../../assets/часы.JPG';
import headphones from '../../assets/Наушники.jpg';
import backpack from '../../assets/рюкзак кожанный.jpg';
import bottle from '../../assets/супер шейкер.jpg';

const translations = {
  ru: {
    search: 'Поиск товаров на маркетплейсе...',
    sortDefault: 'Сортировка по умолчанию',
    sortPriceAsc: 'Сначала дешевые',
    sortPriceDesc: 'Сначала дорогие',
    all: 'Все',
    electronics: 'Электроника',
    accessories: 'Аксессуары',
    sport: 'Спорт',
    empty: 'Ничего не найдено',
    emptySub: 'Попробуйте изменить поисковый запрос или категорию.',
    stock: 'Осталось',
    sum: 'сум',
    addToCart: 'Добавить в корзину',
  },
  en: {
    search: 'Search products on the marketplace...',
    sortDefault: 'Default sort',
    sortPriceAsc: 'Cheapest first',
    sortPriceDesc: 'Most expensive first',
    all: 'All',
    electronics: 'Electronics',
    accessories: 'Accessories',
    sport: 'Sport',
    empty: 'No results found',
    emptySub: 'Try changing the search query or category.',
    stock: 'Left',
    sum: 'sum',
    addToCart: 'Add to cart',
  },
  kk: {
    search: 'Маркетплейстен тауар іздеу...',
    sortDefault: 'Әдепкі сұрыптау',
    sortPriceAsc: 'Арзандылары бірінші',
    sortPriceDesc: 'Қымбаттары бірінші',
    all: 'Барлығы',
    electronics: 'Электроника',
    accessories: 'Аксессуарлар',
    sport: 'Спорт',
    empty: 'Ештеңе табылмады',
    emptySub: 'Іздеу сұрауын немесе санаттарды өзгертіп көріңіз.',
    stock: 'Қалды',
    sum: 'сом',
    addToCart: 'Кошикке қосу',
  },
  uz: {
    search: 'Marketplace bo‘yicha mahsulot qidirish...',
    sortDefault: 'Standart tartiblash',
    sortPriceAsc: 'Avval arzonlari',
    sortPriceDesc: 'Avval qimmatlilari',
    all: 'Barchasi',
    electronics: 'Elektronika',
    accessories: 'Aksessuarlar',
    sport: 'Sport',
    empty: 'Hech narsa topilmadi',
    emptySub: 'Qidiruv so‘zini yoki toifani o‘zgartirib ko‘ring.',
    stock: 'Qoldi',
    sum: 'so‘m',
    addToCart: 'Savatga qo‘shish',
  },
};

const mockCatalogProductsByLanguage = {
  ru: [
    { id: '1', name: 'Беспроводные наушники Pro', price: 450000, category: 'Электроника', rating: 4.8, stock_quantity: 25, image_url: headphones },
    { id: '2', name: 'Смарт-часы X-Check', price: 980000, category: 'Электроника', rating: 4.5, stock_quantity: 7, image_url: watch },
    { id: '3', name: 'Кожаный городской рюкзак', price: 320000, category: 'Аксессуары', rating: 4.9, stock_quantity: 15, image_url: backpack },
    { id: '4', name: 'Спортивная бутылка для воды', price: 85000, category: 'Спорт', rating: 4.2, stock_quantity: 50, image_url: bottle },
    { id: '5', name: 'Механическая клавиатура RGB', price: 670000, category: 'Электроника', rating: 4.7, stock_quantity: 12, image_url: keyboard },
  ],
  en: [
    { id: '1', name: 'Wireless Headphones Pro', price: 450000, category: 'Electronics', rating: 4.8, stock_quantity: 25, image_url: headphones },
    { id: '2', name: 'Smart Watch X-Check', price: 980000, category: 'Electronics', rating: 4.5, stock_quantity: 7, image_url: watch },
    { id: '3', name: 'Leather City Backpack', price: 320000, category: 'Accessories', rating: 4.9, stock_quantity: 15, image_url: backpack },
    { id: '4', name: 'Sport Water Bottle', price: 85000, category: 'Sport', rating: 4.2, stock_quantity: 50, image_url: bottle },
    { id: '5', name: 'RGB Mechanical Keyboard', price: 670000, category: 'Electronics', rating: 4.7, stock_quantity: 12, image_url: keyboard },
  ],
  kk: [
    { id: '1', name: 'Сымсыз құлаққап Pro', price: 450000, category: 'Электроника', rating: 4.8, stock_quantity: 25, image_url: headphones },
    { id: '2', name: 'Smart Watch X-Check', price: 980000, category: 'Электроника', rating: 4.5, stock_quantity: 7, image_url: watch },
    { id: '3', name: 'Жақсы қалалық рюкзак', price: 320000, category: 'Аксессуарлар', rating: 4.9, stock_quantity: 15, image_url: backpack },
    { id: '4', name: 'Спорттық су бөтелкесі', price: 85000, category: 'Спорт', rating: 4.2, stock_quantity: 50, image_url: bottle },
    { id: '5', name: 'RGB механикалық пернетақта', price: 670000, category: 'Электроника', rating: 4.7, stock_quantity: 12, image_url: keyboard },
  ],
  uz: [
    { id: '1', name: 'Simsiz quloqchin Pro', price: 450000, category: 'Elektronika', rating: 4.8, stock_quantity: 25, image_url: headphones },
    { id: '2', name: 'Smart Watch X-Check', price: 980000, category: 'Elektronika', rating: 4.5, stock_quantity: 7, image_url: watch },
    { id: '3', name: 'Yakkama ko‘ylik sumka', price: 320000, category: 'Aksessuarlar', rating: 4.9, stock_quantity: 15, image_url: backpack },
    { id: '4', name: 'Sport suv shishasi', price: 85000, category: 'Sport', rating: 4.2, stock_quantity: 50, image_url: bottle },
    { id: '5', name: 'RGB mexanik klaviatura', price: 670000, category: 'Elektronika', rating: 4.7, stock_quantity: 12, image_url: keyboard },
  ],
};

export const ProductList = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { language } = useUiStore();
  const t = translations[language] || translations.ru;
  const catalogProducts = mockCatalogProductsByLanguage[language] || mockCatalogProductsByLanguage.ru;
  const categories = [t.all, t.electronics, t.accessories, t.sport];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(t.all);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setSelectedCategory(t.all);
  }, [language, t.all]);

  const filteredProducts = useMemo(() => {
    return catalogProducts
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === t.all || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [catalogProducts, searchQuery, selectedCategory, sortBy, t.all]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center space-x-2">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="default">{t.sortDefault}</option>
            <option value="price-asc">{t.sortPriceAsc}</option>
            <option value="price-desc">{t.sortPriceDesc}</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border
              ${selectedCategory === category
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white border rounded-2xl shadow-sm">
          <p className="text-lg font-medium">{t.empty}</p>
          <p className="text-sm mt-1">{t.emptySub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/95 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                  {product.category}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <div className="flex items-center space-x-1 text-amber-500 font-medium">
                    <Star size={14} fill="currentColor" />
                    <span>{product.rating}</span>
                  </div>
                  <span>{t.stock}: {product.stock_quantity} шт.</span>
                </div>

                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between pt-2 mt-auto">
                  <span className="text-base font-bold text-gray-900">
                    {product.price.toLocaleString()} {t.sum}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                    title={t.addToCart}
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
