'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Bold,
  Italic,
  List,
  Plus,
  X,
  Save,
  Trash2,
} from 'lucide-react';
import BentoCard from '@/components/ui/BentoCard';
import Breadcrumb from '@/components/Breadcrumb';
import ImageUpload from '@/components/ImageUpload';

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

const AdminAddProductPage = () => {
  const router = useRouter();
  const additionalInputRef = useRef<HTMLInputElement>(null);

  // Dynamic categories from DB
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const refreshCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const json = await res.json();
      if (json.success) setDbCategories(json.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      await refreshCategories();
    };
    void loadCategories();
  }, []);

  // Form states
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
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
  const [uploadingAdditional, setUploadingAdditional] = useState(false);

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

  const handleRemoveColorSwatch = (swatchName: string) => {
    setSwatches((prev) => prev.filter((swatch) => swatch.name !== swatchName));
    setSelectedColors((prev) => prev.filter((color) => color !== swatchName));
  };

  const handleAdditionalUploadClick = () => {
    additionalInputRef.current?.click();
  };

  const handleAdditionalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingAdditional(true);

      try {
        const formData = new FormData();
        formData.append('image', file);

        const apiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API || 'd5a7aedab2c861ca5dec9ae71691ace7';
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();

        if (data.success && data.data?.url) {
          setAdditionalImages((prev) => [...prev, data.data.url]);
        } else {
          throw new Error('No URL returned');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to upload additional image.');
      } finally {
        setUploadingAdditional(false);
      }
    }
  };

  // Form submission
  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    setIsAddingCategory(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      const json = await res.json();
      if (json.success) {
        setCategory(trimmed);
        setNewCategory('');
        await refreshCategories();
      } else {
        throw new Error(json.error || 'Failed to create category');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create category';
      alert(message);
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !sku || !basePrice || !stockQty) {
      alert('Please fill out all required fields (Product Name, SKU, Base Price, Stock Qty).');
      return;
    }

    setIsSaving(true);

    try {
      // Map colors to hex swatches
      const mappedColors = swatches
        .filter((s) => selectedColors.includes(s.name))
        .map((s) => ({ name: s.name, hex: s.hex }));

      const productPayload = {
        name: productName,
        price: Number(basePrice),
        sku,
        category,
        stock: Number(stockQty),
        description: shortDesc || fullDesc || 'No description provided.',
        image: primaryImage || '',
        images: [primaryImage || '', ...additionalImages].filter(Boolean),
        sizes: selectedSizes,
        colors: mappedColors,
        specs: [
          'High-performance design architecture',
          'Premium durable composition',
          'Sleek industrial finish',
        ],
        isNew: status === 'Active',
        isLimited: false,
      };

      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });

      if (!res.ok) {
        throw new Error('Failed to create product in inventory');
      }

      const json = await res.json();
      if (json.success) {
        alert('Product created and saved successfully!');
        router.push('/admin/inventory');
      } else {
        throw new Error(json.error || 'Failed to save product details');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error processing request.';
      alert(message);
    } finally {
      setIsSaving(false);
    }
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
                  <input
                    type="text"
                    list="category-options"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Select or type a category"
                    className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <datalist id="category-options">
                    {dbCategories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add new category"
                      className="flex-1 bg-background border border-outline/20 rounded-xl px-3 py-2 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={isAddingCategory}
                      className="px-3 py-2 rounded-xl bg-secondary text-on-secondary text-sm font-label-bold disabled:opacity-60"
                    >
                      {isAddingCategory ? 'Adding...' : 'Add'}
                    </button>
                  </div>
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
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-label-bold text-xs tracking-wider transition-all border cursor-pointer ${isSelected
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
                      className="flex items-center gap-1 text-xs font-label-bold text-secondary hover:text-secondary-container transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Custom Swatch</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {swatches.map((swatch) => {
                      const isSelected = selectedColors.includes(swatch.name);
                      return (
                        <div
                          key={swatch.name}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-xs font-label-bold ${isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-outline/20 bg-background hover:bg-surface-container-low'
                            }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleColorToggle(swatch.name)}
                            className="flex items-center gap-2.5 cursor-pointer"
                            title={swatch.name}
                          >
                            <span
                              className="w-5 h-5 rounded-full border border-outline/20 shrink-0"
                              style={{ backgroundColor: swatch.hex }}
                            />
                            <span className="text-primary">{swatch.name}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveColorSwatch(swatch.name)}
                            className="p-1 rounded-md text-outline hover:text-error hover:bg-rose-50 transition-colors cursor-pointer"
                            title={`Remove ${swatch.name}`}
                          >
                            <X size={12} />
                          </button>
                        </div>
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
                <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                  Primary Image *
                </label>
                <ImageUpload
                  value={primaryImage}
                  onUploadComplete={(url) => setPrimaryImage(url)}
                  onRemove={() => setPrimaryImage(null)}
                />

                <div className="pt-2">
                  <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Additional Images ({additionalImages.length}/3)
                  </label>
                  <input
                    ref={additionalInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAdditionalUpload}
                    disabled={uploadingAdditional || additionalImages.length >= 3}
                  />

                  {/* Additional slot grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {additionalImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg border border-outline/10 overflow-hidden bg-surface-container"
                      >
                        <Image src={img} alt="Preview slot" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
                          }}
                          className="absolute bottom-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}

                    {/* Empty slots placeholders */}
                    {additionalImages.length < 3 && (
                      <button
                        type="button"
                        onClick={handleAdditionalUploadClick}
                        disabled={uploadingAdditional}
                        className="aspect-square border border-dashed border-outline/20 hover:border-primary/40 rounded-lg flex flex-col items-center justify-center bg-background/30 cursor-pointer text-outline transition-all"
                      >
                        {uploadingAdditional ? (
                          <span className="text-[9px] animate-pulse">...</span>
                        ) : (
                          <Plus size={16} />
                        )}
                      </button>
                    )}
                  </div>
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
                className={`px-3 py-1 rounded text-xs font-label-bold transition-all cursor-pointer ${status === 'Draft' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface-variant'
                  }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus('Active')}
                className={`px-3 py-1 rounded text-xs font-label-bold transition-all cursor-pointer ${status === 'Active' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface-variant'
                  }`}
              >
                Active
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/inventory"
              className="px-5 py-2.5 rounded-xl border border-outline/10 hover:bg-surface-container font-label-bold text-sm text-primary transition-all duration-300 active:scale-95 shadow-sm cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving || uploadingAdditional}
              className="flex items-center gap-2 px-6 py-2.5 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl font-label-bold text-sm transition-all duration-300 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
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
};

export default AdminAddProductPage;
