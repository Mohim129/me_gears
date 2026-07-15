'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Download, Eye, Pencil, Trash2, TrendingUp, AlertTriangle, Grid, Search, X, Loader2 } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import BentoCard from '@/components/ui/BentoCard';
import { Skeleton } from '@heroui/react';
import ImageUpload from '@/components/ImageUpload';

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

export default function AdminInventoryPage() {
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'All' | 'Men' | 'Women' | 'Accessories'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/inventory');
      if (!res.ok) {
        throw new Error('Failed to fetch inventory');
      }
      const json = await res.json();
      if (json.success) {
        const mapped = (json.data || []).map((p: any) => ({
          id: p.id || p._id,
          name: p.name,
          sku: p.sku || 'N/A',
          category: p.category || 'Gear',
          price: p.price || 0,
          stock: p.stock !== undefined ? p.stock : 0,
          image: p.image || '',
        }));
        setProductsList(mapped);
      } else {
        throw new Error(json.error || 'Failed to load products');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Deletion logic
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product from the inventory?')) {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/inventory?id=${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Failed to delete product from database');
        }
        const json = await res.json();
        if (json.success) {
          alert('Product deleted successfully.');
          fetchInventory();
        } else {
          throw new Error(json.error || 'Failed to delete product');
        }
      } catch (err: any) {
        alert(err.message || 'Error deleting product.');
        setIsLoading(false);
      }
    }
  };

  // CSV Export simulation
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      alert('CSV Inventory Data exported successfully!');
      setExporting(false);
    }, 1000);
  };

  // ── Edit Modal State ──
  interface EditFormData {
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image: string;
    sizes: string[];
    colors: { name: string; hex: string }[];
    isNew: boolean;
    isLimited: boolean;
  }

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleEditProduct = async (product: ProductItem) => {
    // Fetch full product details from the API
    try {
      const res = await fetch('/api/admin/inventory');
      const json = await res.json();
      if (json.success) {
        const full = (json.data || []).find(
          (p: any) => (p.id || p._id) === product.id
        );
        setEditForm({
          id: product.id,
          name: full?.name || product.name,
          sku: full?.sku || product.sku,
          category: full?.category || product.category,
          price: full?.price ?? product.price,
          stock: Number(full?.stock ?? product.stock ?? 0),
          description: full?.description || '',
          image: full?.image || product.image,
          sizes: Array.isArray(full?.sizes) ? full.sizes : [],
          colors: Array.isArray(full?.colors) ? full.colors : [],
          isNew: full?.isNew ?? false,
          isLimited: full?.isLimited ?? false,
        });
        setEditError(null);
        setEditModalOpen(true);
      }
    } catch {
      alert('Failed to load product details.');
    }
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    setIsSaving(true);
    setEditError(null);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, stock: Number(editForm.stock) }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to update product');
      }
      setEditModalOpen(false);
      setEditForm(null);
      fetchInventory(); // Refresh list
    } catch (err: any) {
      setEditError(err.message || 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  // Category & search logic
  const filteredProducts = productsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'Men') {
      matchesTab = ['Outerwear', 'Pants', 'Performance Tops', 'Tactical Bottoms'].includes(p.category);
    } else if (activeTab === 'Women') {
      matchesTab = ['Outerwear', 'Footwear'].includes(p.category);
    } else if (activeTab === 'Accessories') {
      matchesTab = p.category === 'Accessories';
    }

    return matchesSearch && matchesTab;
  });

  // Calculate stock status labels
  const getStockStatus = (qty: number) => {
    if (qty === 0) return 'Out of Stock';
    if (qty <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const totalVal = productsList.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = productsList.filter((p) => p.stock <= 10).length;

  return (
    <div className="space-y-8 w-full">
      {/* Product Directory Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold">Product Directory</h1>
          <p className="text-sm text-on-surface-variant font-body-md mt-1">
            Manage your physical inventory, pricing, and stock levels.
          </p>
        </div>
        <Link
          href="/admin/inventory/add"
          className="flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl font-label-bold text-label-bold transition-all duration-300 shadow-md active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Quick stats cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatsCard
          icon={TrendingUp}
          label="Total Inventory Value"
          value={`৳ ${totalVal.toLocaleString('en-IN')}`}
        />
        <StatsCard
          icon={AlertTriangle}
          label="Low Stock Alerts"
          value={`${lowStockCount} Items`}
          alert={lowStockCount > 0}
        />
        <StatsCard
          icon={Grid}
          label="Total Catalog Items"
          value={productsList.length.toString()}
        />
      </section>

      {/* Filter and search toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-surface-container-lowest p-6 rounded-xl border border-outline/10 shadow-card">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {(['All', 'Men', 'Women', 'Accessories'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-label-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-background hover:bg-surface-container text-on-surface-variant border border-outline/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search, filters, export actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search SKU or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-outline/20 rounded-xl py-2.5 pl-10 pr-4 text-sm font-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          </div>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-low hover:bg-surface-container border border-outline/10 rounded-xl text-xs font-label-bold uppercase tracking-wider text-primary transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            <Download size={14} />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Inventory Table inside Bento Card */}
      <BentoCard className="overflow-hidden p-0 md:p-0">
        {error ? (
          <div className="text-center py-12 text-error bg-rose-50 dark:bg-rose-950/20 border border-outline/10 m-6 rounded-xl">
            {error}
          </div>
        ) : isLoading && productsList.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="animate-spin h-8 w-8 text-secondary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-on-surface-variant font-label-bold">Loading inventory items...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline/10 text-outline text-[11px] font-label-bold uppercase tracking-wider bg-surface-container-low/40">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/5 font-body-md">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-on-surface-variant italic">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const status = getStockStatus(p.stock);
                    return (
                      <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors">
                        {/* Product image, name, SKU */}
                        <td className="py-4 px-6 flex items-center gap-4">
                          <div className="relative w-12 h-16 rounded overflow-hidden bg-surface-variant shrink-0">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <p className="font-label-bold text-sm text-primary">{p.name}</p>
                            <p className="text-xs text-outline font-body-md mt-0.5">SKU: {p.sku}</p>
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-label-bold">
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 font-semibold text-primary text-sm">
                          ৳ {p.price.toLocaleString('en-IN')}
                        </td>

                        {/* Stock Status Badge & counts */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col items-start gap-1">
                            <StatusBadge status={status} />
                            <span className="text-[11px] text-outline font-body-md">
                              {p.stock} units
                            </span>
                          </div>
                        </td>

                        {/* Row actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/products/${p.id}`}
                              target="_blank"
                              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                              title="Preview on shop"
                            >
                              <Eye size={16} />
                            </Link>
                            <button
                              onClick={() => handleEditProduct(p)}
                              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                              title="Edit metadata"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 text-on-surface-variant hover:text-error hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Pagination */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between py-5 px-6 border-t border-outline/10">
            <span className="text-xs text-on-surface-variant font-body-md">
              Showing 1-{filteredProducts.length} of {productsList.length} items
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-outline/10 rounded-lg text-xs font-label-bold text-outline hover:bg-surface-container transition-colors disabled:opacity-40" disabled>
                Previous
              </button>
              <button className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-label-bold">
                1
              </button>
              <button className="px-3 py-1.5 border border-outline/10 rounded-lg text-xs font-label-bold text-outline hover:bg-surface-container transition-colors disabled:opacity-40" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </BentoCard>

      {/* ── Edit Product Modal ── */}
      {editModalOpen && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setEditModalOpen(false); setEditForm(null); }}
          />

          {/* Modal Panel */}
          <div className="relative bg-surface-container rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-outline-variant/20 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="sticky top-0 bg-surface-container z-10 flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
              <h2 className="font-headline-md text-xl text-primary">Edit Product</h2>
              <button
                onClick={() => { setEditModalOpen(false); setEditForm(null); }}
                className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {editError && (
                <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm font-label-bold">
                  {editError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-label-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                />
              </div>

              {/* SKU + Category row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-bold text-on-surface-variant uppercase tracking-wider mb-1.5">SKU</label>
                  <input
                    type="text"
                    value={editForm.sku}
                    onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Category</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                </div>
              </div>

              {/* Price + Stock row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Price (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-label-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all resize-none"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-label-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Sizes</label>
                <input
                  type="text"
                  value={editForm.sizes.join(', ')}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      sizes: e.target.value
                        .split(',')
                        .map((size) => size.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="XS, S, M, L"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-label-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Colors</label>
                <textarea
                  rows={3}
                  value={editForm.colors.map((color) => `${color.name}:${color.hex}`).join('\n')}
                  onChange={(e) => {
                    const parsed = e.target.value
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [name, hex] = line.split(':');
                        return { name: name?.trim() || 'Color', hex: hex?.trim() || '#888888' };
                      });
                    setEditForm({ ...editForm, colors: parsed });
                  }}
                  placeholder="Slate Gray:#2c3e50"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-label-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Product Image</label>
                <ImageUpload
                  value={editForm.image}
                  onUploadComplete={(url) => setEditForm({ ...editForm, image: url })}
                  onRemove={() => setEditForm({ ...editForm, image: '' })}
                />
              </div>

              {/* Flags */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isNew}
                    onChange={(e) => setEditForm({ ...editForm, isNew: e.target.checked })}
                    className="w-4 h-4 accent-secondary"
                  />
                  <span className="text-sm font-label-bold text-on-surface">New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isLimited}
                    onChange={(e) => setEditForm({ ...editForm, isLimited: e.target.checked })}
                    className="w-4 h-4 accent-secondary"
                  />
                  <span className="text-sm font-label-bold text-on-surface">Limited Edition</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-surface-container px-6 py-4 border-t border-outline-variant/20 flex items-center justify-end gap-3">
              <button
                onClick={() => { setEditModalOpen(false); setEditForm(null); }}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface-variant font-label-bold hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving || !editForm.name}
                className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-label-bold hover:bg-secondary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
