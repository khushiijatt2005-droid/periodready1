import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, ShoppingBag, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminCustomers() {
  const { adminToken } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/customers', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [adminToken]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-gray-900">Customer Directory</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          View all registered customer accounts, order counts, and lifetime value.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-4">Orders Placed</th>
                <th className="py-4 px-6 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.id || c.email} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-brand-purple font-bold text-xs flex items-center justify-center uppercase">
                        {c.name ? c.name[0] : 'U'}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 text-sm block">{c.name}</span>
                        <span className="text-[11px] text-gray-400">D2C Customer</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-gray-800 font-medium block">{c.email}</span>
                    <span className="text-[11px] text-gray-400">{c.phone || 'No phone'}</span>
                  </td>

                  <td className="py-4 px-4 text-gray-500">
                    {c.joinedDate ? new Date(c.joinedDate).toLocaleDateString() : 'N/A'}
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-brand-purple">
                      {c.ordersCount} Orders
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right font-black text-gray-900 text-sm">
                    ₹{c.totalSpent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
