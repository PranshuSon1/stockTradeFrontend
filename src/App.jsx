import axios from 'axios';
import { useEffect, useState } from 'react';

export default function App() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({
    stock_name: '',
    trade_type: 'CREDIT',
    quantity: '',
    price: '',
    broker_name: '',
    sale_type: 'fifo'
  });
  const [summary, setSummary] = useState([]);
  const [fifoLots, setFifoLots] = useState([]);
  // const [lifoLots, setLifoLots] = useState([]);

  const API = 'https://stocktradebackend.onrender.com/api'; // Change this to your actual API

  const fetchTrades = async () => {
    const res = await axios.get(`${API}/trade`);
    setTrades(res.data);
  };

  const fetchSummary = async () => {
    const res = await axios.get(`${API}/trade/getStockSummary`);
    setSummary(res.data);
  };

  const fetchLots = async () => {
    const fifoRes = await axios.get(`${API}/lot`);
    // const lifoRes = await axios.get(`${API}/lot`);
    setFifoLots(fifoRes.data);
    // setLifoLots(lifoRes.data);
  };

  useEffect(() => {
    fetchTrades();
    fetchSummary();
    fetchLots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/trade`, form);
      fetchTrades();
      fetchSummary();
      fetchLots();
      setForm({
        stock_name: '',
        trade_type: 'CREDIT',
        quantity: '',
        price: '',
        broker_name: '',
        sale_type: 'fifo'
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Trade failed');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stock Trade Portal</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input value={form.stock_name} onChange={e => setForm({ ...form, stock_name: e.target.value })} placeholder="Stock Name" className="border p-2" required />
        <select value={form.trade_type} onChange={e => setForm({ ...form, trade_type: e.target.value })} className="border p-2">
          <option value="CREDIT">BUY</option>
          <option value="DEBIT">SELL</option>
        </select>
        <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="Quantity" className="border p-2" required />
        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price" className="border p-2" required />
        <input value={form.broker_name} onChange={e => setForm({ ...form, broker_name: e.target.value })} placeholder="Broker Name" className="border p-2" required />
        <select value={form.sale_type} onChange={e => setForm({ ...form, sale_type: e.target.value })} className="border p-2">
          <option value="fifo">FIFO</option>
          <option value="lifo">LIFO</option>
        </select>
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded">Submit Trade</button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Trades</h2>
      <table className="w-full mb-8 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2">Stock</th>
            <th className="border px-2">Type</th>
            <th className="border px-2">Qty</th>
            <th className="border px-2">Price</th>
            <th className="border px-2">Broker</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i} className="text-center">
              <td className="border px-2">{t.stock_name}</td>
              <td className="border px-2">{t.trade_type}</td>
              <td className="border px-2">{t.quantity}</td>
              <td className="border px-2">{t.price}</td>
              <td className="border px-2">{t.broker_name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Stock Summary</h2>
      <table className="w-full border mb-8">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2">Stock</th>
            <th className="border px-2">Net Qty</th>
            <th className="border px-2">Available</th>
            <th className="border px-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((s, i) => (
            <tr key={i} className="text-center">
              <td className="border px-2">{s.stock_name}</td>
              <td className="border px-2">{s.net_quantity}</td>
              <td className="border px-2">{s.total_available_quantity}</td>
              <td className="border px-2 text-sm text-gray-600">{s.warning}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Lots</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2">Stock</th>
                <th className="border px-2">Qty</th>
                <th className="border px-2">Realized</th>
                <th className="border px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {fifoLots.map((lot, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-2">{lot.stock_name}</td>
                  <td className="border px-2">{lot.lot_quantity}</td>
                  <td className="border px-2">{lot.realized_quantity}</td>
                  <td className="border px-2">{lot.lot_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
