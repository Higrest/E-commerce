import { useEffect, useState } from 'react';
import apiClient from '../../core/api/apiClient';

export default function ProductApprovals() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await apiClient.get('/admin/products', {
        params: { status: 'pending' },
      });
      setItems(data);
    } catch (e) {
      setError('Не удалось загрузить заявки');
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await apiClient.patch(`/admin/products/${id}/approve`);
    load();
  };

  const reject = async (id) => {
    const reason = prompt('Причина отказа?');
    if (reason === null) return;
    await apiClient.patch(`/admin/products/${id}/reject`, { reason });
    load();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Заявки продавцов</h1>
      {error && <p className="text-red-600">{error}</p>}
      {!error && items.length === 0 && <p>Новых заявок нет</p>}
      {items.map((p) => (
        <div key={p.id} className="border rounded-lg p-4 mb-3 flex justify-between items-center">
          <div>
            <h2 className="font-semibold">{p.name} — ${p.price}</h2>
            <p className="text-sm text-gray-500">{p.description}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => approve(p.id)} className="bg-green-600 text-white px-3 py-1 rounded">
              Одобрить
            </button>
            <button onClick={() => reject(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">
              Отклонить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}