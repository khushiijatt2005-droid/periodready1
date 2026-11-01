import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');

      setSubmitted(true);
      addToast('Message sent! Our support team will get back to you shortly.', 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      addToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent">
          We're Here For You
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-brand-purple">
          Contact PeriodReady
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Have questions about our discreet kits or an existing order? Reach out anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-brand-purple text-white rounded-3xl p-8 sm:p-10 shadow-soft space-y-8">
          <div>
            <h3 className="font-heading font-black text-2xl text-brand-yellow">Get in Touch</h3>
            <p className="text-xs sm:text-sm text-purple-200 mt-2 leading-relaxed">
              We respond to all customer questions within 24 hours on business days.
            </p>
          </div>

          <div className="space-y-6 text-sm text-purple-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-brand-yellow" />
              </div>
              <div>
                <span className="text-xs text-purple-300 block font-semibold">Email Us</span>
                <a href="mailto:Periodready1@gmail.com" className="font-bold hover:text-brand-yellow transition">
                  Periodready1@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-brand-yellow" />
              </div>
              <div>
                <span className="text-xs text-purple-300 block font-semibold">Customer Helpline</span>
                <span className="font-bold">+91 98765 43210</span>
                <span className="text-[11px] text-purple-300 block">Mon - Sat: 9:00 AM - 7:00 PM IST</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-brand-yellow" />
              </div>
              <div>
                <span className="text-xs text-purple-300 block font-semibold">Headquarters</span>
                <span className="font-bold block">PeriodReady Wellness Pvt Ltd</span>
                <span>Vijay Nagar, Indore, M.P. - 452001</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-purple-800 text-xs text-purple-300">
            For general brand queries or partner distribution, our support team typically responds within 24 hours.
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-soft border border-rose-100">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-heading font-black text-2xl text-gray-900">Message Received!</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Thank you for contacting PeriodReady. A member of our support team will get in touch with you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-heading font-black text-2xl text-brand-purple">Send Us a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-brand-blush/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-brand-blush/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-brand-blush/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  How can we help you? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-brand-blush/30"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-brand-purple text-white font-bold text-sm hover:bg-brand-purpleDark transition shadow-soft flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
