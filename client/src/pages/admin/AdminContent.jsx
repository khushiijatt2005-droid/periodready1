import React, { useState, useEffect } from 'react';
import { Save, ExternalLink, Globe, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminContent() {
  const { adminToken } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    seoTitle: '',
    seoDescription: '',
    problemSection: {
      badge: '',
      title: '',
      paragraph: ''
    },
    whatIsSection: {
      badge: '',
      title: '',
      paragraph: ''
    },
    whyItMatters: [],
    ourPromise: {
      title: '',
      statement: '',
      tagline: ''
    }
  });

  const fetchContent = () => {
    setLoading(true);
    fetch('/api/content/about')
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          problemSection: data.problemSection || { badge: '', title: '', paragraph: '' },
          whatIsSection: data.whatIsSection || { badge: '', title: '', paragraph: '' },
          whyItMatters: data.whyItMatters || [],
          ourPromise: data.ourPromise || { title: '', statement: '', tagline: '' }
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        addToast('Failed to load content', 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to update content');
      addToast('About page content saved live!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleWhyChange = (index, field, value) => {
    const updated = [...formData.whyItMatters];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, whyItMatters: updated });
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-gray-900">
            Pages / Content Editor
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit text blocks, claims, and SEO meta descriptions for the "About PeriodReady" page.
          </p>
        </div>

        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition shadow-2xs"
        >
          <span>Preview Live About Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SEO Metadata Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-brand-purple">
            <Globe className="w-4 h-4 text-brand-accent" />
            <span>SEO & Social Sharing Metadata</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Page Title Tag (SEO Title)</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Meta Description</label>
              <textarea
                rows={2}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>
        </div>

        {/* Section A: The Problem */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-soft space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-brand-accent block">
            Section A: The Problem
          </span>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.problemSection.badge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      problemSection: { ...formData.problemSection, badge: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={formData.problemSection.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      problemSection: { ...formData.problemSection, title: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Problem Description</label>
              <textarea
                rows={3}
                value={formData.problemSection.paragraph}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    problemSection: { ...formData.problemSection, paragraph: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section B: What PeriodReady Is */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-soft space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-brand-purple block">
            Section B: What PeriodReady Is
          </span>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.whatIsSection.badge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatIsSection: { ...formData.whatIsSection, badge: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={formData.whatIsSection.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatIsSection: { ...formData.whatIsSection, title: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Solution Description</label>
              <textarea
                rows={3}
                value={formData.whatIsSection.paragraph}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatIsSection: { ...formData.whatIsSection, paragraph: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section D: Why It Matters / Customer Gains */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-soft space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-brand-purple block">
            Section D: Why It Matters (5 Benefits)
          </span>
          <div className="space-y-4">
            {formData.whyItMatters.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-brand-purple">Benefit #{idx + 1}</label>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleWhyChange(idx, 'title', e.target.value)}
                  placeholder="Benefit Title"
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white"
                />
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleWhyChange(idx, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section F: Our Promise */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-soft space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-brand-accent block">
            Section F: Our Promise & Tagline
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Promise Statement</label>
              <input
                type="text"
                value={formData.ourPromise.statement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ourPromise: { ...formData.ourPromise, statement: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Official Brand Tagline</label>
              <input
                type="text"
                value={formData.ourPromise.tagline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ourPromise: { ...formData.ourPromise, tagline: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-brand-purple"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-2xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition shadow-soft flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
