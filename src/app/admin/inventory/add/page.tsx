'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  UploadCloud,
  Plus,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Code,
  Check,
  X,
  Save,
  Trash2,
} from 'lucide-react';
import BentoCard from '@/components/ui/BentoCard';
import Breadcrumb from '@/components/Breadcrumb';

interface ColorSwatch {
  name: string;
  hex: string;
}

const DEFAULT_SWATCHES: ColorSwatch[] = [
  { name: 'Slate Gray', hex: '#2c3e50' },
  { name: 'Industrial Rust', hex: '#a23f00' },
  { name: 'Matt Black', hex: '#1b1c1a' },
  { name: 'Steel White', hex: '#e4e2de' },
];

export default function AdminAddProductPage() {
  const router = useRouter();

  // Form states
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Outerwear');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');

  // Variants states
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L']);
  const [swatches, setSwatches] = useState<ColorSwatch[]>(DEFAULT_SWATCHES);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Slate Gray']);

  // Pricing & Stock states
  const [basePrice, setBasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [status, setStatus] = useState<'Draft' | 'Active'>('Active');

  // Media states
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Toggle size selection
  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Toggle color selection
  const handleColorToggle = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  // Add new color swatch dynamically
  const handleAddColorSwatch = () => {
    const name = prompt('Enter color name (e.g. Desert Sand):');
    if (!name) return;
    const hex = prompt('Enter hex color code (e.g. #d2b48c):');
    if (!hex) return;

    const newSwatch: ColorSwatch = { name, hex };
    setSwatches((prev) => [...prev, newSwatch]);
    setSelectedColors((prev) => [...prev, name]);
  };

  // Simulate file upload
  const handleSimulateUpload = () => {
    // Generate a premium random product image from assets to simulate upload success
    const mockImages = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0fCXkIYg5St9iTFglInWkRDAdTiV2HjpmeE-L5iAVITEHSP-dAQlgNNzxeuWfOCnabWx6WENkQgbfpwUo8eeSmhq9SY1mope63UZii3oMTNbiWGg-NvFC-vo8RdHRoo4Kzmcywjb56OynXQDr_D7ruK1m2sMtvtg1AXDzRkE7cdu1ZLU99R4xqqPwDVePCszxe493Rk6efYDtwFP27JojSeY7UosRKxqMs0nXI4dHp0al6qdb0tP1Pg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8yVInvAM1nk_qOEa5qvZZBSk-0n_LaWYGFgwCOTDrxi3ZKw4zGINSKw2f_hEOxu_NQ57OEwbujFVDoVsOWNeoUjHzzP0BLhjKEtFqH2GAQLbwv0jVO9kRNpxLOhCJcspGZYS_8CI3wtzdg6WPzJ7a-PdX2YbZc_V7dsoCmQBkt3uWOFeRSmlYIE06SkNlYA0BoiKddCWezYVOAtJPeLrVRoCGTYNMUGdOrINPYi4OZ5MT2mtEtepzcg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4OcK5fXQxhIu4mIZUjFdYmz3zJkj_uF8-his9E9pW8WRNcX-U5bl2WQj6GiFMCz1QZg55nFdKbBawAoENxbQSeMi-zCMn9wZJiOUzzpLo5HmNs_XP3MIBbrFRi-EXAO6VCsNb_SMgS8gwR19WrH9fvfr6CCp3yjhNE_WIxNZb-M5Pa2_zRB8URufxdZPk9XTbhprk0cca3uMG17HHxYZzofTHJizOWU0rZsALFzo782nqwOLXhFQ5_A',
    ];
    const chosen = mockImages[Math.floor(Math.random() * mockImages.length)];

    if (!primaryImage) {
      setPrimaryImage(chosen);
    } else {
      if (additionalImages.length < 3) {
        setAdditionalImages((prev) => [...prev, chosen]);
      } else {
        alert('Maximum of 4 images total (1 primary + 3 additional) for this demo.');
      }
    }
  };

  // Form submission simulated
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !sku || !basePrice || !stockQty) {
      alert('Please fill out all required fields (Product Name, SKU, Base Price, Stock Qty).');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Product created and added to inventory list!');
      router.push('/admin/inventory');
    }, 2000);
  };

  return (
    <div className="pb-32 w-full">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <h1 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold">Add New Product</h1>
        <div className="mt-2">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/admin' },
              { label: 'Inventory', href: '/admin/inventory' },
              { label: 'Add New Product' },
            ]}
          />
        </div>
      </div>

      {/* Main Form container */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: General Info & Variants */}
          <div className="lg:col-span-8 space-y-8">
            {/* General Info */}
            <BentoCard>
              <h2 className="font-headline-md text-[18px] text-primary mb-6 pb-2 border-b border-outline/10 font-semibold">
                General Information
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      placeholder="e.g. Expedition Parka v3"
                      className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      required
                      placeholder="e.g. EXP-PRK-V3"
                      className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Pants">Pants</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Provide a quick 1-2 sentence overview of the product..."
                    className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                    Full Description
                  </label>
                  {/* Text Editor Fake Toolbar */}
                  <div className="border border-outline/20 rounded-xl overflow-hidden bg-background">
                    <div className="flex items-center gap-1 p-2 bg-surface-container-low border-b border-outline/15">
                      <button
                        type="button"
                        onClick={() => alert('Bold text')}
                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-all"
                        title="Bold"
                      >
                        <Bold size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('Italic text')}
                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-all"
                        title="Italic"
                      >
                        <Italic size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('Bulleted list')}
                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-all"
                        title="List"
                      >
                        <List size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('Insert link')}
                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-all"
                        title="Link"
                      >
                        <LinkIcon size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('Insert code snippet')}
                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-all"
                        title="Code"
                      >
                        <Code size={16} />
                      </button>
                    </div>
                    <textarea
                      rows={6}
                      value={fullDesc}
                      onChange={(e) => setFullDesc(e.target.value)}
                      placeholder="Write full product specifications, design details, and fabric properties..."
                      className="w-full bg-transparent border-0 px-4 py-3 font-body-md text-sm outline-none focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* Product Variants (Sizes & Colors) */}
            <BentoCard>
              <h2 className="font-headline-md text-[18px] text-primary mb-6 pb-2 border-b border-outline/10 font-semibold">
                Product Variants
              </h2>
              <div className="space-y-8">
                {/* Sizes Variant */}
                <div className="space-y-3">
                  <span className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                    Available Sizes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-label-bold text-xs tracking-wider transition-all border ${
                            isSelected
                              ? 'bg-primary text-on-primary border-primary shadow-sm'
                              : 'bg-background hover:bg-surface-container text-on-surface-variant border-outline/20'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors Swatches Variant */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                      Color Swatches
                    </span>
                    <button
                      type="button"
                      onClick={handleAddColorSwatch}
                      className="flex items-center gap-1 text-xs font-label-bold text-secondary hover:text-secondary-container transition-colors uppercase tracking-wider"
                    >
                      <Plus size={14} />
                      <span>Custom Swatch</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {swatches.map((swatch) => {
                      const isSelected = selectedColors.includes(swatch.name);
                      return (
                        <button
                          key={swatch.name}
                          type="button"
                          onClick={() => handleColorToggle(swatch.name)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-xs font-label-bold ${
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-outline/20 bg-background hover:bg-surface-container-low'
                          }`}
                          title={swatch.name}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-outline/20 shrink-0"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="text-primary">{swatch.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </BentoCard>
          </div>

          {/* Right Column: Pricing & Media */}
          <div className="lg:col-span-4 space-y-8">
            {/* Pricing & Stock levels */}
            <BentoCard>
              <h2 className="font-headline-md text-[18px] text-primary mb-6 pb-2 border-b border-outline/10 font-semibold">
                Stock & Pricing
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                    Base Price (৳) *
                  </label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    required
                    min="0"
                    placeholder="0.00"
                    className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                    Sale Price (৳)
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    min="0"
                    placeholder="0.00"
                    className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                      Stock Qty *
                    </label>
                    <input
                      type="number"
                      value={stockQty}
                      onChange={(e) => setStockQty(e.target.value)}
                      required
                      min="0"
                      placeholder="0"
                      className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="pcs">Pcs (Items)</option>
                      <option value="pairs">Pairs</option>
                      <option value="sets">Sets</option>
                    </select>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* Media Gallery */}
            <BentoCard>
              <h2 className="font-headline-md text-[18px] text-primary mb-6 pb-2 border-b border-outline/10 font-semibold">
                Media Gallery
              </h2>
              <div className="space-y-4">
                {/* Primary Upload Area */}
                <div
                  onClick={handleSimulateUpload}
                  className="cursor-pointer border-2 border-dashed border-outline/25 hover:border-primary/50 transition-all rounded-xl p-6 bg-background/50 flex flex-col items-center justify-center text-center gap-2 group"
                >
                  {primaryImage ? (
                    <div className="relative w-full aspect-[4/5] rounded overflow-hidden shadow-sm">
                      <img
                        src={primaryImage}
                        alt="Primary Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrimaryImage(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-lg transition-colors"
                        title="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="text-outline group-hover:text-primary transition-colors" size={32} />
                      <p className="text-xs font-label-bold text-primary">Simulate Media Upload</p>
                      <p className="text-[10px] text-outline font-body-md">
                        Drag and drop or click to pick mock image.
                      </p>
                    </>
                  )}
                </div>

                {/* Additional slot grid */}
                <div className="grid grid-cols-4 gap-2">
                  {additionalImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg border border-outline/10 overflow-hidden bg-surface-container"
                    >
                      <img src={img} alt="Preview slot" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute bottom-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-md transition-colors"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}

                  {/* Empty slots placeholders */}
                  {Array.from({ length: Math.max(0, 4 - additionalImages.length) }).map((_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      onClick={handleSimulateUpload}
                      className="aspect-square border border-dashed border-outline/20 hover:border-primary/40 rounded-lg flex items-center justify-center bg-background/30 cursor-pointer text-outline transition-all"
                    >
                      <Plus size={16} />
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>
          </div>
        </div>

        {/* Fixed bottom bar */}
        <div className="fixed bottom-0 right-0 left-64 bg-surface/90 backdrop-blur-md border-t border-outline/10 p-4 flex items-center justify-between z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-label-bold text-on-surface-variant uppercase tracking-wider">
              Product Status:
            </span>
            <div className="flex rounded-lg overflow-hidden border border-outline/20 bg-background p-0.5">
              <button
                type="button"
                onClick={() => setStatus('Draft')}
                className={`px-3 py-1 rounded text-xs font-label-bold transition-all ${
                  status === 'Draft' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus('Active')}
                className={`px-3 py-1 rounded text-xs font-label-bold transition-all ${
                  status === 'Active' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                Active
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/inventory"
              className="px-5 py-2.5 rounded-xl border border-outline/10 hover:bg-surface-container font-label-bold text-sm text-primary transition-all duration-300 active:scale-95 shadow-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl font-label-bold text-sm transition-all duration-300 shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
