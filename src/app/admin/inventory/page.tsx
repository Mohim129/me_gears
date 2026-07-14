'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, SlidersHorizontal, Download, Eye, Pencil, Trash2, TrendingUp, AlertTriangle, Grid, Search } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import BentoCard from '@/components/ui/BentoCard';

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    name: 'Apex Shell v2',
    sku: 'APX-SHL-V2',
    category: 'Outerwear',
    price: 60400,
    stock: 24,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0fCXkIYg5St9iTFglInWkRDAdTiV2HjpmeE-L5iAVITEHSP-dAQlgNNzxeuWfOCnabWx6WENkQgbfpwUo8eeSmhq9SY1mope63UZii3oMTNbiWGg-NvFC-vo8RdHRoo4Kzmcywjb56OynXQDr_D7ruK1m2sMtvtg1AXDzRkE7cdu1ZLU99R4xqqPwDVePCszxe493Rk6efYDtwFP27JojSeY7UosRKxqMs0nXI4dHp0al6qdb0tP1Pg',
  },
  {
    id: '2',
    name: 'Titan Boots',
    sku: 'TTN-BTS-01',
    category: 'Footwear',
    price: 34800,
    stock: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpC73givMwBXIB-9v8kqf1JKu0tXAMxfo21CNe-TSwONmcfNHhAFHdODZdIljCcaCLZOBFzNPZKvzY6HBNBVkIP9-852u9DCMMsAKYKW-JeOXDDNOU0qXgRTdzNTiOW9sMi8_jHL-NZ-AjYnoch3u9ok0VmC4QOkoDN6HLz0xE1_sa1_a0-L0U2IarVmNzw2TIsTTQUtPSWJTnhe4iyStf3rp83orum1qEbuLtP3BD_ok-5hiJw1m8Wg',
  },
  {
    id: '3',
    name: 'Nomad Pack 30L',
    sku: 'NMD-PCK-30',
    category: 'Accessories',
    price: 23800,
    stock: 0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLf-ZnXwTsytBdtgP5YU2VzTOWP-RGG1Mcx36LtlWg9Uu8L5YP4vdyZ44T84J1aba0OfL8um_W4bc7QtPNCP0V-b1ywlCL-rtIy0FnmmjQqpg1LR1orSAg9B65KCLSHSQK75y36N0aUHrJBxIcjbh_6D3Plg2H8criyFOroGcSn-2oiwbMhUfTDo8nzLK3nfJpYSDROgVK0Eap7Gy4yzpaceSlEqmDNjrsWbgpzPeU0cLH6sE9EQdDwg',
  },
  {
    id: '4',
    name: 'Garrison Utility Shell',
    sku: 'GRS-UTL-SHL',
    category: 'Outerwear',
    price: 29280,
    stock: 85,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8yVInvAM1nk_qOEa5qvZZBSk-0n_LaWYGFgwCOTDrxi3ZKw4zGINSKw2f_hEOxu_NQ57OEwbujFVDoVsOWNeoUjHzzP0BLhjKEtFqH2GAQLbwv0jVO9kRNpxLOhCJcspGZYS_8CI3wtzdg6WPzJ7a-PdX2YbZc_V7dsoCmQBkt3uWOFeRSmlYIE06SkNlYA0BoiKddCWezYVOAtJPeLrVRoCGTYNMUGdOrINPYi4OZ5MT2mtEtepzcg',
  },
  {
    id: '5',
    name: 'Vanguard Cargo Pant',
    sku: 'VNG-CRG-PNT',
    category: 'Pants',
    price: 15490,
    stock: 8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe9vbQesLzQ2dD9j3AF3gbzMDsLizI9EsfIUbmyTjEMJyLBaui4rAc7WqiatFwnygnY9gf9ZgAm62qINkPs5jFgaE_dJk4gpz3LYbksZacO1wpP_V8IbrAMWZW-_bjzTe_1ZmrRM_WCqEuHA3IVqPEyGCmgo1UW_tawPAczlr0qglB2LiVy1VnPuBXG6qtChC9UXhr8kWyEYAv5ZoyMNJLl1IrB99EHh8V54xP-o3mtU0hOWBWZ6Fd5Q',
  },
];

export default function AdminInventoryPage() {
  const [productsList, setProductsList] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<'All' | 'Men' | 'Women' | 'Accessories'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [exporting, setExporting] = useState(false);

  // Deletion logic
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product from the inventory?')) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
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

  // Category & search logic
  const filteredProducts = productsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'Men') {
      matchesTab = ['Outerwear', 'Pants'].includes(p.category);
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
          className="flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl font-label-bold text-label-bold transition-all duration-300 shadow-md active:scale-95 shrink-0"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Quick stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatsCard
          icon={TrendingUp}
          label="Total Inventory Value"
          value="৳ 15,22,92,600"
          trend="+4.2%"
        />
        <StatsCard
          icon={AlertTriangle}
          label="Low Stock Alerts"
          value="12 Items"
          alert
        />
        <StatsCard
          icon={Grid}
          label="Top Category"
          value="Outerwear"
        />
      </div>

      {/* Filter and search toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-surface-container-lowest p-6 rounded-xl border border-outline/10 shadow-card">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {(['All', 'Men', 'Women', 'Accessories'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-label-bold uppercase tracking-wider transition-all ${
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
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-low hover:bg-surface-container border border-outline/10 rounded-xl text-xs font-label-bold uppercase tracking-wider text-primary transition-all duration-300 disabled:opacity-50"
          >
            <Download size={14} />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Inventory Table inside Bento Card */}
      <BentoCard className="overflow-hidden p-0 md:p-0">
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
                    No products found matching your search.
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
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                            title="Preview on shop"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => alert(`Edit dialog for product ID ${p.id}`)}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                            title="Edit metadata"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 text-on-surface-variant hover:text-error hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
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

        {/* Table Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between py-5 px-6 border-t border-outline/10">
            <span className="text-xs text-on-surface-variant font-body-md">
              Showing 1-{filteredProducts.length} of {filteredProducts.length} items
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
    </div>
  );
}
