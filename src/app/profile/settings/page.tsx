'use client';

import { useState } from 'react';
import { Camera, Settings, User } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/AccountSidebar';
import BentoCard from '@/components/ui/BentoCard';

export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState({
    fullName: 'Julian Thorne',
    email: 'julian.thorne@megears.com',
    phone: '+1 (555) 892-4410',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Changes saved successfully (demo)!');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-secondary/30 selection:text-secondary">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Sidebar - Highlighting Settings as active */}
          <AccountSidebar 
            name="Julian Thorne" 
            initials="JT" 
            memberSince="November 2023" 
          />

          {/* Main Content Area */}
          <section className="flex-1 w-full space-y-8">
            {/* Profile Header Card */}
            <BentoCard className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md relative">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNvZcZ9b-OCPqECkczJ151qHak2WtFaswV7URCu__9bQQx-sQuqX9zrHXrFgSGO2PJND2RDRGTvGLr8kIMZNR2_xWVxAPohG6isYhS5WNPcoGfmJXwXFNzB6zgI5wTdQq5mbALUXOaUukslxUeH7WRLkGT3p1Ip-n_qD6cD8HsI8-kdGwmf7of2MM0vz5UejVmE8wF9mJGnhpqwk9ncQcS2WMCldKtNKVNnUahsq6aFZyj5IME_9RhTA"
                      alt="Julian Thorne"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <button 
                    onClick={() => alert('Profile picture edit triggered!')}
                    className="absolute bottom-0 right-0 bg-secondary text-on-secondary p-1.5 rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center"
                    aria-label="Upload profile picture"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h1 className="font-headline-lg text-xl md:text-2xl text-primary font-bold">
                    Julian Thorne
                  </h1>
                  <p className="text-sm text-on-surface-variant font-body-md">
                    Customer Account • Member since November 2023
                  </p>
                </div>
              </div>
              <button 
                onClick={() => alert('Profile editing activated!')}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-bold text-sm hover:bg-primary-container transition-all active:scale-95 shadow-md flex items-center gap-2"
              >
                <User size={14} />
                <span>Edit Profile</span>
              </button>
            </BentoCard>

            {/* Account Settings Form Card */}
            <BentoCard>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline/10">
                <h3 className="font-headline-md text-xl text-primary font-bold">
                  Account Settings
                </h3>
                <Settings size={20} className="text-outline/60 animate-spin-slow" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block font-label-bold text-[11px] text-outline uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border border-outline/10 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg py-3 px-4 text-primary text-sm font-body-md outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-label-bold text-[11px] text-outline uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border border-outline/10 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg py-3 px-4 text-primary text-sm font-body-md outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="phone" className="block font-label-bold text-[11px] text-outline uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full md:w-1/2 bg-surface-container-low border border-outline/10 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg py-3 px-4 text-primary text-sm font-body-md outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <hr className="border-outline/10" />

                {/* Password Fields */}
                <div className="space-y-6">
                  <h4 className="font-label-bold text-primary uppercase tracking-widest text-xs font-bold">
                    Change Password
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="currentPassword" className="block font-label-bold text-[11px] text-outline uppercase tracking-wider">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-surface-container-low border border-outline/10 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg py-3 px-4 text-primary text-sm font-body-md outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="newPassword" className="block font-label-bold text-[11px] text-outline uppercase tracking-wider">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        className="w-full bg-surface-container-low border border-outline/10 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg py-3 px-4 text-primary text-sm font-body-md outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Save CTA */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-secondary text-on-secondary px-8 py-3.5 rounded-lg font-label-bold text-sm hover:opacity-95 active:scale-95 transition-all shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </BentoCard>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
