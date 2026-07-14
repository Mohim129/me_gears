'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@heroui/react';

const slides = [
  {
    subtitle: 'Fall / Winter 2024',
    title: 'New Season Essentials',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsFimoxAf0BPdu_XMTGLLAmCyjdsQi-4TpC_oSIb099MB8m6xr-tFPuJ0OpE0bfvN0UKiV-Mx3H0wrsOHf2WR3tHOPDx4BVygpiuycXumSXn_Vushy969G7QvD8JNkThfm1snP_-VxBXgx_sKrkH0rbkn5tUwZxyzQV0WP2TcYuJxmUfPOFKGyBLBvyyWtRO0CWfQPYnrxlOtbdk6gGCps2P8T57hBjsipyaxzwVQd2iYv1mkGJ4IbBA',
    alt: 'A high-fashion editorial portrait of a model in a minimalist urban setting, wearing a sophisticated industrial-chic trench coat.'
  },
  {
    subtitle: 'Modern Outerwear',
    title: 'Authority in Design',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsFimoxAf0BPdu_XMTGLLAmCyjdsQi-4TpC_oSIb099MB8m6xr-tFPuJ0OpE0bfvN0UKiV-Mx3H0wrsOHf2WR3tHOPDx4BVygpiuycXumSXn_Vushy969G7QvD8JNkThfm1snP_-VxBXgx_sKrkH0rbkn5tUwZxyzQV0WP2TcYuJxmUfPOFKGyBLBvyyWtRO0CWfQPYnrxlOtbdk6gGCps2P8T57hBjsipyaxzwVQd2iYv1mkGJ4IbBA',
    alt: 'ME Gears modern technical outerwear collection'
  },
  {
    subtitle: 'Street Silhouette',
    title: 'Edgy Confidence',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsFimoxAf0BPdu_XMTGLLAmCyjdsQi-4TpC_oSIb099MB8m6xr-tFPuJ0OpE0bfvN0UKiV-Mx3H0wrsOHf2WR3tHOPDx4BVygpiuycXumSXn_Vushy969G7QvD8JNkThfm1snP_-VxBXgx_sKrkH0rbkn5tUwZxyzQV0WP2TcYuJxmUfPOFKGyBLBvyyWtRO0CWfQPYnrxlOtbdk6gGCps2P8T57hBjsipyaxzwVQd2iYv1mkGJ4IbBA',
    alt: 'ME Gears street collection showing edgy urban styles'
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[65vh] min-h-[500px] overflow-hidden group">
      {/* Background Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover object-center transition-transform duration-10000 scale-105 group-hover:scale-100"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/45 to-transparent" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 h-full max-w-[1280px] mx-auto px-6 flex flex-col justify-center items-start text-white">
        <div className="overflow-hidden mb-2">
          <span className="inline-block font-label-bold text-secondary-fixed uppercase tracking-widest text-[14px] animate-fade-in-up">
            {slides[currentSlide].subtitle}
          </span>
        </div>
        <div className="overflow-hidden mb-8">
          <h1 className="font-headline-xl text-4xl sm:text-5xl md:text-[48px] md:leading-[56px] font-extrabold max-w-2xl text-shadow-sm">
            {slides[currentSlide].title}
          </h1>
        </div>
        <Button
          size="lg"
          className="bg-secondary text-white font-label-bold text-[14px] px-10 py-6 tracking-wide hover:bg-on-secondary-fixed-variant transition-all active:scale-95 shadow-lg rounded-none"
        >
          Shop Now
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === currentSlide 
                ? 'bg-secondary w-8' 
                : 'bg-white/40 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
