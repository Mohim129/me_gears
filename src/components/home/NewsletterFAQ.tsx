'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@heroui/react';

const FAQS = [
  {
    question: 'What is the shipping timeframe?',
    answer: 'Orders are typically processed within 24 hours. Standard shipping takes 3-5 business days, while express takes 1-2 days.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order ships, you will receive a confirmation email with a unique tracking number and a link to our tracking portal.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer free returns within 30 days of purchase for all unused items in their original packaging.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.',
  },
];

export default function NewsletterFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const handleToggle = (idx: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent standard details toggle behavior
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing to ME GEARS!');
  };

  return (
    <section className="py-24 max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
      {/* Left Column: Newsletter Card */}
      <div className="bg-primary p-12 rounded-3xl text-on-primary shadow-lg">
        <h2 className="font-headline-lg text-[32px] font-bold mb-4">Join the Inner Circle</h2>
        <p className="text-on-primary-container font-body-md text-[16px] mb-8 leading-relaxed">
          Receive early access to limited drops and exclusive editorial content.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            aria-label="Email Address"
            className="w-full bg-[#2c3e50] border-none text-white rounded-xl px-6 py-4 h-14 focus:ring-2 focus:ring-secondary placeholder:text-on-primary-container/80 text-[16px] outline-none transition-all hover:bg-[#34495e]"
          />
          <Button
            type="submit"
            size="lg"
            className="w-full bg-secondary text-white font-label-bold text-[14px] h-14 rounded-xl hover:bg-on-secondary-fixed-variant transition-all font-semibold"
          >
            Subscribe
          </Button>
        </form>
        <p className="mt-6 text-[12px] text-on-primary-container/60 leading-normal">
          By subscribing, you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>

      {/* Right Column: FAQ Accordion */}
      <div>
        <h2 className="font-headline-lg text-[32px] font-bold mb-8 text-primary">Frequently Asked</h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <details
                key={idx}
                open={isOpen}
                className="group border-b border-outline/20 pb-4 list-none"
              >
                <summary
                  onClick={(e) => handleToggle(idx, e)}
                  className="flex justify-between items-center cursor-pointer list-none select-none outline-none"
                >
                  <span className="font-label-bold text-lg text-primary hover:text-secondary transition-colors font-medium">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-primary transition-transform duration-300 ease-in-out ${
                      isOpen ? 'rotate-180 text-secondary' : ''
                    }`}
                  />
                </summary>
                <div
                  className={`mt-4 text-on-surface-variant font-body-md text-[16px] leading-relaxed transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'max-h-[150px] opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="pb-2">{faq.answer}</p>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
