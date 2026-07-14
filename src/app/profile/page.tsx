'use client';

import { useState } from 'react';
import { Pencil, Trash2, ShieldCheck, Plus, Check, X, Shield, Bell } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/AccountSidebar';
import BentoCard from '@/components/ui/BentoCard';

interface Address {
  id: string;
  tag: string;
  street: string;
  cityStateZip: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    name: 'Marcus Sterling',
    email: 'marcus.sterling@design.co',
    phone: '+1 (555) 230-4921',
    birthday: 'October 14, 1992',
  });
  const [tempDetails, setTempDetails] = useState({ ...personalDetails });

  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      tag: 'Primary Home',
      street: '492 Industrial Way, Suite 12B',
      cityStateZip: 'Brooklyn, NY 11205',
    },
    {
      id: '2',
      tag: 'Design Studio',
      street: '88 Workbench Blvd, Floor 4',
      cityStateZip: 'Queens, NY 11101',
    },
  ]);

  const [newAddressTag, setNewAddressTag] = useState('');
  const [newAddressStreet, setNewAddressStreet] = useState('');
  const [newAddressCity, setNewAddressCity] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const handleEditClick = () => {
    setTempDetails({ ...personalDetails });
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setPersonalDetails({ ...tempDetails });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressTag || !newAddressStreet || !newAddressCity) return;
    const newAddr: Address = {
      id: Date.now().toString(),
      tag: newAddressTag,
      street: newAddressStreet,
      cityStateZip: newAddressCity,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setNewAddressTag('');
    setNewAddressStreet('');
    setNewAddressCity('');
    setShowAddAddress(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Sidebar */}
          <AccountSidebar />

          {/* Main Profile Area */}
          <section className="flex-1 w-full space-y-8">
            {/* Profile Header */}
            <BentoCard className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-lg text-xl shadow-md">
                  MS
                </div>
                <div>
                  <h1 className="font-headline-lg text-xl md:text-2xl text-primary">{personalDetails.name}</h1>
                  <p className="text-sm text-on-surface-variant font-body-md">
                    Customer Account • Member since Nov 2024
                  </p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-bold text-label-bold transition-all duration-300 active:scale-95 shadow-md"
                >
                  <Pencil size={14} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveClick}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-label-bold text-label-bold transition-all duration-300 active:scale-95 shadow-sm"
                  >
                    <Check size={14} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="flex items-center gap-1.5 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-label-bold text-label-bold transition-all duration-300 active:scale-95 border border-outline/10 shadow-sm"
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </BentoCard>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Personal Details Card */}
              <BentoCard className="lg:col-span-7">
                <h2 className="font-headline-md text-headline-md text-primary mb-6 pb-2 border-b border-outline/10">
                  Personal Details
                </h2>

                <div className="space-y-6">
                  {/* Name field */}
                  <div className="flex justify-between items-center py-1 border-b border-outline/5">
                    <span className="text-sm font-label-bold text-on-surface-variant">Full Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempDetails.name}
                        onChange={(e) => setTempDetails({ ...tempDetails, name: e.target.value })}
                        className="bg-background border border-outline/20 rounded-lg px-3 py-1.5 text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary w-2/3"
                      />
                    ) : (
                      <span className="text-sm font-body-md text-primary font-medium">{personalDetails.name}</span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="flex justify-between items-center py-1 border-b border-outline/5">
                    <span className="text-sm font-label-bold text-on-surface-variant">Email Address</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={tempDetails.email}
                        onChange={(e) => setTempDetails({ ...tempDetails, email: e.target.value })}
                        className="bg-background border border-outline/20 rounded-lg px-3 py-1.5 text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary w-2/3"
                      />
                    ) : (
                      <span className="text-sm font-body-md text-primary font-medium">{personalDetails.email}</span>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="flex justify-between items-center py-1 border-b border-outline/5">
                    <span className="text-sm font-label-bold text-on-surface-variant">Phone Number</span>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={tempDetails.phone}
                        onChange={(e) => setTempDetails({ ...tempDetails, phone: e.target.value })}
                        className="bg-background border border-outline/20 rounded-lg px-3 py-1.5 text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary w-2/3"
                      />
                    ) : (
                      <span className="text-sm font-body-md text-primary font-medium">{personalDetails.phone}</span>
                    )}
                  </div>

                  {/* Birthday field */}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-label-bold text-on-surface-variant">Date of Birth</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempDetails.birthday}
                        onChange={(e) => setTempDetails({ ...tempDetails, birthday: e.target.value })}
                        className="bg-background border border-outline/20 rounded-lg px-3 py-1.5 text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary w-2/3"
                      />
                    ) : (
                      <span className="text-sm font-body-md text-primary font-medium">{personalDetails.birthday}</span>
                    )}
                  </div>
                </div>
              </BentoCard>

              {/* Security Status Card */}
              <BentoCard className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <h2 className="font-headline-md text-headline-md text-primary mb-6 pb-2 border-b border-outline/10">
                    Security Status
                  </h2>

                  <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg border border-outline/5">
                    {is2FAEnabled ? (
                      <>
                        <ShieldCheck className="text-emerald-600 shrink-0" size={24} />
                        <div>
                          <h4 className="font-label-bold text-sm text-primary">Two-Factor Auth Active</h4>
                          <p className="text-xs text-on-surface-variant font-body-md mt-1">
                            Your account is fully secured. Code confirmation required on new logins.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Shield className="text-rose-500 shrink-0 animate-pulse" size={24} />
                        <div>
                          <h4 className="font-label-bold text-sm text-primary text-rose-500">Security Warning</h4>
                          <p className="text-xs text-on-surface-variant font-body-md mt-1">
                            2-Factor Authentication is currently disabled. Enable to secure your orders.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  className="w-full mt-6 px-4 py-3 bg-surface-container-low hover:bg-surface-container border border-outline/10 rounded-xl font-label-bold text-sm text-primary transition-all duration-300 shadow-sm"
                >
                  {is2FAEnabled ? 'Disable 2FA' : 'Activate 2FA'}
                </button>
              </BentoCard>
            </div>

            {/* Saved Addresses Section */}
            <BentoCard>
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline/10">
                <h2 className="font-headline-md text-headline-md text-primary">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="flex items-center gap-1.5 text-sm font-label-bold text-secondary hover:text-secondary-container transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Address</span>
                </button>
              </div>

              {/* Add Address Form overlay or toggled block */}
              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="mb-8 p-6 bg-surface-container-low rounded-xl border border-outline/15 space-y-4"
                >
                  <h3 className="font-label-bold text-primary text-sm">Add New Delivery Location</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Label (e.g. Office, Cabin)"
                      value={newAddressTag}
                      onChange={(e) => setNewAddressTag(e.target.value)}
                      required
                      className="bg-background border border-outline/20 rounded-lg px-3 py-2 text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={newAddressStreet}
                      onChange={(e) => setNewAddressStreet(e.target.value)}
                      required
                      className="bg-background border border-outline/20 rounded-lg px-3 py-2 text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="City, State ZIP"
                      value={newAddressCity}
                      onChange={(e) => setNewAddressCity(e.target.value)}
                      required
                      className="bg-background border border-outline/20 rounded-lg px-3 py-2 text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-secondary text-on-secondary rounded-lg font-label-bold text-xs uppercase hover:bg-secondary-container transition-all"
                    >
                      Save Location
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2 bg-surface-container text-on-surface rounded-lg font-label-bold text-xs uppercase hover:bg-surface-container-high transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.length === 0 ? (
                  <p className="text-sm font-body-md text-on-surface-variant italic col-span-2">
                    No saved addresses found. Add a new address above.
                  </p>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 border border-outline/10 rounded-xl bg-background/30 flex justify-between items-start hover:border-primary/20 hover:shadow-sm transition-all"
                    >
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-label-bold uppercase tracking-wider mb-3">
                          {addr.tag}
                        </span>
                        <p className="font-body-md text-sm text-primary leading-relaxed">{addr.street}</p>
                        <p className="font-body-md text-sm text-on-surface-variant mt-1">{addr.cityStateZip}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            // Quick simulation of edit address by changing it to something customized
                            const updatedStreet = prompt('Edit street address:', addr.street);
                            if (updatedStreet) {
                              setAddresses((prev) =>
                                prev.map((item) =>
                                  item.id === addr.id ? { ...item, street: updatedStreet } : item
                                )
                              );
                            }
                          }}
                          className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container rounded-lg"
                          aria-label={`Edit address ${addr.tag}`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-2 text-on-surface-variant hover:text-error transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg"
                          aria-label={`Delete address ${addr.tag}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </BentoCard>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
