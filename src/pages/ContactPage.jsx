import React, { useState } from 'react';
import { MapPin, Mail, Send, CheckCircle2, Phone, Clock, ShieldCheck } from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';

export default function ContactPage() {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose">
          Always Here For You
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-indigo tracking-tight">
          Get in Touch With PeriodReady
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Have an urgent question regarding a 10-minute gate delivery, college hostel tie-up, or bulk PG stocking? We’re ready to assist.
        </p>
      </div>

      {/* 3 Core Contact Cards as requested */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Address with Open in Maps */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-lavender-border shadow-soft flex flex-col justify-between space-y-4 hover:shadow-lift transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lavender text-indigo flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Operations Hub
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Vijay Nagar, Indore, Madhya Pradesh 452001
            </p>
            <p className="text-[11px] text-slate-400">
              Dispatching 10-minute riders to colleges, hostels, IT parks and PGs across Indore.
            </p>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Vijay+Nagar,+Indore,+Madhya+Pradesh+452001"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-lavender hover:bg-lavender-alt text-indigo font-bold text-xs border border-lavender-border transition-colors"
          >
            <span>Open in Maps</span>
            <span className="text-rose">↗</span>
          </a>
        </div>

        {/* Card 2: Email */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-lavender-border shadow-soft flex flex-col justify-between space-y-4 hover:shadow-lift transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blush text-rose flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Official Email
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
              periodready1@gmail.com
            </p>
            <p className="text-[11px] text-slate-400">
              For customer support, partnerships, media inquiries &amp; corporate collaborations.
            </p>
          </div>

          <a
            href="mailto:periodready1@gmail.com"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo hover:bg-indigo-dark text-white font-bold text-xs shadow-sm transition-colors"
          >
            <span>Send Email</span>
            <span>✉</span>
          </a>
        </div>

        {/* Card 3: Instagram */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-lavender-border shadow-soft flex flex-col justify-between space-y-4 hover:shadow-lift transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose to-purple-600 text-white flex items-center justify-center shadow-xs">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Instagram
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
              @periodready_1
            </p>
            <p className="text-[11px] text-slate-400">
              Follow our community of empowered college students, wellness guides &amp; daily updates.
            </p>
          </div>

          <a
            href="https://www.instagram.com/periodready_1/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-lavender hover:bg-lavender-alt text-indigo font-bold text-xs border border-lavender-border transition-colors"
          >
            <span>Visit @periodready_1</span>
            <span className="text-rose">↗</span>
          </a>
        </div>

      </div>

      {/* College & PG Campus Support Message Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-serif font-bold text-2xl text-indigo">
            Hostel, College &amp; PG Bulk Partnerships
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Are you a college council representative, PG warden, or HR administrator? We install dedicated PeriodReady emergency relief boxes with auto-refilling options right at your reception or dispensary.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose shrink-0" />
              <span>Dedicated dispatch team available 24/7 across Indore</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Complete discretion and respectful handling on every drop</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-lavender-border shadow-soft">
          {formSent ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-xl text-slate-900">Message Received</h4>
              <p className="text-xs text-slate-600">
                Thank you! Our Indore team will review your inquiry and reply to your email promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-indigo mb-2">
                Send Us a Note
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aditi Patel"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aditi@example.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-indigo hover:bg-indigo-dark text-white font-semibold text-xs shadow-md shadow-indigo/20 flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
