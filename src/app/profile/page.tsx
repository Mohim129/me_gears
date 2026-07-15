'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, ShieldCheck, Plus, Check, X, Shield, Loader2, Lock, Camera } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/AccountSidebar';
import BentoCard from '@/components/ui/BentoCard';
import ImageUpload from '@/components/ImageUpload';

interface Address {
  id: string;
  tag: string;
  street: string;
  cityStateZip: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();

  // ── Loading & Error ──
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ── Personal Details ──
  const [isEditing, setIsEditing] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
  });
  const [tempDetails, setTempDetails] = useState({ ...personalDetails });

  // ── 2FA (local toggle, no API) ──
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // ── Change Password ──
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // ── Avatar Upload ──
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // ── Addresses ──
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [newAddressTag, setNewAddressTag] = useState('');
  const [newAddressStreet, setNewAddressStreet] = useState('');
  const [newAddressCity, setNewAddressCity] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // ── Fetch profile from API ──
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/profile');
      const json = await res.json();
      if (json.success) {
        const d = json.data;
        const details = {
          name: d.name || '',
          email: d.email || '',
          phone: d.phone || '',
          birthday: d.birthday || '',
        };
        setPersonalDetails(details);
        setTempDetails(details);
      }
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch addresses from API ──
  const fetchAddresses = useCallback(async () => {
    try {
      setAddressesLoading(true);
      const res = await fetch('/api/user/addresses');
      const json = await res.json();
      if (json.success) {
        setAddresses(json.data);
      }
    } catch {
      // silently fail — addresses section will show empty
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
      fetchAddresses();
    }
  }, [session, fetchProfile, fetchAddresses]);

  // ── Save profile edits ──
  const handleSaveClick = async () => {
    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempDetails),
      });
      const json = await res.json();
      if (json.success) {
        setPersonalDetails({ ...tempDetails });
        setIsEditing(false);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(json.error || 'Failed to save profile');
      }
    } catch {
      setError('Network error — could not save');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = () => {
    setTempDetails({ ...personalDetails });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  // ── Change Password ──
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMsg('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (json.success) {
        setPasswordMsg('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMsg(''), 3000);
      } else {
        setPasswordError(json.error || 'Failed to change password');
      }
    } catch {
      setPasswordError('Network error — could not change password');
    } finally {
      setChangingPassword(false);
    }
  };

  // ── Avatar Upload ──
  const handleAvatarUpload = async (url: string) => {
    setUploadingAvatar(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...personalDetails, image: url }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg('Avatar updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        // Reload to refresh session image
        window.location.reload();
      } else {
        setError(json.error || 'Failed to update avatar');
      }
    } catch {
      setError('Network error — could not update avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ── Address CRUD ──
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressTag || !newAddressStreet || !newAddressCity) return;
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tag: newAddressTag,
          street: newAddressStreet,
          cityStateZip: newAddressCity,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAddresses((prev) => [...prev, json.data]);
        setNewAddressTag('');
        setNewAddressStreet('');
        setNewAddressCity('');
        setShowAddAddress(false);
      }
    } catch {
      setError('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      }
    } catch {
      setError('Failed to delete address');
    }
  };

  const handleEditAddress = async (addr: Address) => {
    const updatedStreet = prompt('Edit street address:', addr.street);
    if (!updatedStreet) return;
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: addr.id, tag: addr.tag, street: updatedStreet, cityStateZip: addr.cityStateZip }),
      });
      const json = await res.json();
      if (json.success) {
        setAddresses((prev) =>
          prev.map((item) =>
            item.id === addr.id ? { ...item, street: updatedStreet } : item
          )
        );
      }
    } catch {
      setError('Failed to update address');
    }
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <AccountSidebar />
            <section className="flex-1 w-full space-y-8">
              <BentoCard className="animate-pulse h-24" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7"><BentoCard className="animate-pulse h-64" /></div>
                <div className="lg:col-span-5"><BentoCard className="animate-pulse h-64" /></div>
              </div>
              <BentoCard className="animate-pulse h-48" />
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Sidebar */}
          <AccountSidebar />

          {/* Main Profile Area */}
          <section className="flex-1 w-full space-y-8">
            {/* Feedback messages */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-body-md">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-body-md">
                {successMsg}
              </div>
            )}

            {/* Profile Header */}
            <BentoCard className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                {session?.user?.image ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md">
                    <Image
                      src={session.user.image}
                      alt={personalDetails.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-lg text-xl shadow-md">
                    {personalDetails.name
                      ? personalDetails.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : 'U'}
                  </div>
                )}
                <div>
                  <h1 className="font-headline-lg text-xl md:text-2xl text-primary">{personalDetails.name}</h1>
                  <p className="text-sm text-on-surface-variant font-body-md">
                    Customer Account
                  </p>
                </div>
              </div>
              {!isEditing ? (
                <div className="flex items-center gap-3">
                  {/* Avatar Upload Button */}
                  <div className="relative">
                    <ImageUpload
                      value={session?.user?.image || null}
                      onUploadComplete={handleAvatarUpload}
                      onRemove={() => {}}
                    />
                    {uploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                        <Loader2 size={20} className="animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-bold text-label-bold transition-all duration-300 active:scale-95 shadow-md"
                  >
                    <Pencil size={14} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveClick}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-label-bold text-label-bold transition-all duration-300 active:scale-95 shadow-sm disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>{saving ? 'Saving…' : 'Save'}</span>
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
                      <span className="text-sm font-body-md text-primary font-medium">{personalDetails.name || '—'}</span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="flex justify-between items-center py-1 border-b border-outline/5">
                    <span className="text-sm font-label-bold text-on-surface-variant">Email Address</span>
                    {isEditing ? (
                      <div className="flex items-center gap-2 w-2/3 justify-end">
                        <input
                          type="email"
                          value={tempDetails.email}
                          readOnly
                          className="bg-surface-container-low border border-outline/20 rounded-lg px-3 py-1.5 text-sm font-body-md text-on-surface-variant w-full cursor-not-allowed"
                        />
                        <Lock size={16} className="text-on-surface-variant" />
                      </div>
                    ) : (
                      <span className="text-sm font-body-md text-primary font-medium">{personalDetails.email || '—'}</span>
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
                      <span className="text-sm font-body-md text-primary font-medium">{personalDetails.phone || '—'}</span>
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
                      <span className="text-sm font-body-md text-primary font-medium">{personalDetails.birthday || '—'}</span>
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
                          <h4 className="font-label-bold text-sm text-rose-600">Security Warning</h4>
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

            {/* Change Password Section */}
            <BentoCard>
              <h2 className="font-headline-md text-headline-md text-primary mb-6 pb-2 border-b border-outline/10 flex items-center gap-2">
                <Lock size={18} />
                Change Password
              </h2>

              {passwordMsg && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-body-md mb-4">
                  {passwordMsg}
                </div>
              )}
              {passwordError && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-body-md mb-4">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-label-bold text-on-surface-variant">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full bg-background border border-outline/20 rounded-lg px-3 py-2 text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-label-bold text-on-surface-variant">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Min. 6 characters"
                      className="w-full bg-background border border-outline/20 rounded-lg px-3 py-2 text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-label-bold text-on-surface-variant">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Re-enter new password"
                      className="w-full bg-background border border-outline/20 rounded-lg px-3 py-2 text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-label-bold text-label-bold transition-all duration-300 active:scale-95 shadow-sm disabled:opacity-50"
                  >
                    {changingPassword ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                    <span>{changingPassword ? 'Updating…' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </BentoCard>

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

              {/* Add Address Form */}
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
                {addressesLoading ? (
                  <>
                    <div className="p-5 border border-outline/10 rounded-xl animate-pulse h-28 bg-surface-container-low" />
                    <div className="p-5 border border-outline/10 rounded-xl animate-pulse h-28 bg-surface-container-low" />
                  </>
                ) : addresses.length === 0 ? (
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
                          onClick={() => handleEditAddress(addr)}
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
