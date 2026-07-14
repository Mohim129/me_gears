'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Globe, Camera, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BentoCard from '@/components/ui/BentoCard';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitStatus !== 'idle') return;

    setSubmitStatus('sending');
    setTimeout(() => {
      setSubmitStatus('sent');
      // Reset form after a small delay
      setTimeout(() => {
        setForm({ name: '', email: '', subject: '', message: '' });
        setSubmitStatus('idle');
      }, 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
        {/* Hero Header */}
        <header className="mb-16 text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-label-bold uppercase tracking-wider rounded-full">
            Contact Us
          </span>
          <h1 className="font-headline-xl text-4xl md:text-5xl text-primary font-bold">Get in Touch</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Have questions about our technical gear or sizing? Reach out and our support crew will get you sorted.
          </p>
        </header>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Glassmorphic Contact Form */}
          <section className="lg:col-span-7">
            <BentoCard className="glass-panel h-full border border-outline/10 p-8 shadow-card rounded-xl">
              <h2 className="font-headline-md text-headline-md text-primary mb-6">Send a Message</h2>

              {/* Toast banner simulation */}
              {submitStatus === 'sent' && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-3 animate-fade-in font-body-md text-sm">
                  <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="font-semibold block">Message Sent!</span>
                    Thank you, {form.name || 'Explorer'}. We will get back to you within 24 hours.
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Marcus Sterling"
                      className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. marcus@sterling.co"
                      className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Size Exchange Inquiry"
                    className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us details about your request..."
                    className="w-full bg-background border border-outline/20 rounded-xl px-4 py-3 font-body-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitStatus === 'sending'}
                  className={`w-full py-4 rounded-xl font-label-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg ${
                    submitStatus === 'sent'
                      ? 'bg-emerald-600 text-white shadow-emerald-600/10'
                      : submitStatus === 'sending'
                      ? 'bg-secondary/70 text-white cursor-not-allowed shadow-secondary/5'
                      : 'bg-secondary text-white hover:bg-secondary-container active:scale-[0.98] shadow-secondary/10'
                  }`}
                >
                  {submitStatus === 'idle' && (
                    <>
                      <span>Send Message</span>
                      <Send size={16} />
                    </>
                  )}
                  {submitStatus === 'sending' && (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                      <span>Sending...</span>
                    </>
                  )}
                  {submitStatus === 'sent' && (
                    <>
                      <CheckCircle2 size={18} />
                      <span>Message Sent</span>
                    </>
                  )}
                </button>
              </form>
            </BentoCard>
          </section>

          {/* Right Column: Company Info Cards */}
          <aside className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Info details */}
            <BentoCard className="glass-panel border border-outline/10 p-8 shadow-card rounded-xl space-y-8 flex-1">
              <h2 className="font-headline-md text-headline-md text-primary pb-2 border-b border-outline/10">
                Contact Details
              </h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 border border-outline/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-label-bold text-xs uppercase tracking-wider text-outline mb-1">Office Location</h4>
                    <p className="font-body-md text-sm text-primary leading-relaxed">
                      492 Industrial Way, Suite 12B
                      <br />
                      Brooklyn, NY 11205
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 border border-outline/10 flex items-center justify-center text-primary shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-label-bold text-xs uppercase tracking-wider text-outline mb-1">Hotline Phone</h4>
                    <p className="font-body-md text-sm text-primary leading-relaxed">+1 (888) GEAR-UP</p>
                  </div>
                </div>

                {/* Mail */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 border border-outline/10 flex items-center justify-center text-primary shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-label-bold text-xs uppercase tracking-wider text-outline mb-1">Support Email</h4>
                    <p className="font-body-md text-sm text-primary leading-relaxed">support@megears.com</p>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 border border-outline/10 flex items-center justify-center text-primary shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-label-bold text-xs uppercase tracking-wider text-outline mb-1">Crew Hours</h4>
                    <p className="font-body-md text-sm text-primary leading-relaxed">
                      Mon - Fri: 9:00 AM - 6:00 PM EST
                      <br />
                      Sat - Sun: 10:00 AM - 4:00 PM EST
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-outline/15 space-y-4">
                <span className="block font-label-bold text-xs uppercase tracking-wider text-outline">
                  Follow the Channel
                </span>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/5 hover:bg-secondary text-primary hover:text-on-secondary transition-all shadow-sm border border-outline/10"
                    aria-label="Facebook"
                  >
                    <Globe size={18} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/5 hover:bg-secondary text-primary hover:text-on-secondary transition-all shadow-sm border border-outline/10"
                    aria-label="Instagram"
                  >
                    <Camera size={18} />
                  </a>
                </div>
              </div>
            </BentoCard>

            {/* Static Map Image Placeholder */}
            <div className="relative h-44 rounded-xl overflow-hidden shadow-card border border-outline/10 bg-surface-variant flex items-center justify-center group shrink-0">
              <div className="absolute inset-0 z-0 bg-primary/10 select-none pointer-events-none">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0fCXkIYg5St9iTFglInWkRDAdTiV2HjpmeE-L5iAVITEHSP-dAQlgNNzxeuWfOCnabWx6WENkQgbfpwUo8eeSmhq9SY1mope63UZii3oMTNbiWGg-NvFC-vo8RdHRoo4Kzmcywjb56OynXQDr_D7ruK1m2sMtvtg1AXDzRkE7cdu1ZLU99R4xqqPwDVePCszxe493Rk6efYDtwFP27JojSeY7UosRKxqMs0nXI4dHp0al6qdb0tP1Pg"
                  alt="Static map placeholder"
                  className="w-full h-full object-cover grayscale opacity-55 contrast-125 filter transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="relative z-10 text-center space-y-1 bg-white/95 px-5 py-3 rounded-lg shadow border border-outline/10 max-w-[80%]">
                <span className="block font-label-bold text-xs text-primary uppercase tracking-wider">Brooklyn Warehouse</span>
                <span className="block font-body-md text-[10px] text-outline leading-tight">Click to navigate on Google Maps</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
