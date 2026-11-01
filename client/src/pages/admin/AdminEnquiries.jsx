import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Mail, Phone, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminEnquiries() {
  const { adminToken } = useAuth();
  const { addToast } = useToast();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      setEnquiries(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [adminToken]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      addToast(`Status updated to ${newStatus}`, 'success');
      fetchEnquiries();
    } catch (err) {
      addToast('Update failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-gray-900">Contact Messages</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Review customer inquiries submitted via the website contact form.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No customer contact messages submitted yet.</p>
          </div>
        ) : (
          enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/80 space-y-4 transition hover:border-purple-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 bg-rose-100 text-rose-800">
                    <User className="w-3.5 h-3.5" />
                    <span>Customer Message</span>
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">Status:</span>
                  <select
                    value={enq.status}
                    onChange={(e) => handleUpdateStatus(enq._id, e.target.value)}
                    className="px-3 py-1 rounded-xl text-xs font-bold border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-brand-purple"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-gray-50 p-3.5 rounded-2xl">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Sender</span>
                  <span className="font-bold text-gray-800">{enq.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Email</span>
                  <a href={`mailto:${enq.email}`} className="font-semibold text-brand-purple hover:underline">
                    {enq.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Phone</span>
                  <span className="text-gray-700">{enq.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="text-xs text-gray-700 bg-white border border-gray-100 p-4 rounded-2xl leading-relaxed">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Message</span>
                {enq.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
