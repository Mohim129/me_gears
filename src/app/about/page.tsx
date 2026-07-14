'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Building2, ArrowRight, Wrench, ShieldCheck, Leaf } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-secondary/30 selection:text-secondary">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtoty_becyudnQfUSP-sLDmwWdQS1dyjgSSQUBfMKLCvAgnV4lVYFn0v9CYC3ncTjYZaVeQpVuHhs7dBfa_iFkyTXuH9E5wptmxuIMAUd0hUkkNdoBDV8UfgZf_TSe4IKl4eeqEC24JGyyE-JYmOlE9e_dYNg9uIOexj6B715zGmNynY5uFzfzUCDtleRCvTIz9dDm8dgbnM9YgxB50ITNUqYSIGGOKej1wrhq5tOzappS6RNmYSILvg"
              alt="Massive industrial foundry floor"
              fill
              priority
              sizes="100vw"
              className="object-cover brightness-75 grayscale-[0.3]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent"></div>
          </div>
          <div className="relative z-10 px-6 max-w-[1280px] mx-auto w-full">
            <div className="max-w-2xl">
              <span className="font-label-bold text-secondary uppercase tracking-[0.2em] block mb-4">
                Established 1984
              </span>
              <h1 className="font-headline-xl text-[44px] sm:text-[56px] text-on-primary mb-6 leading-tight">
                Our Story: <br />
                <span className="text-secondary italic">Industrial Excellence</span>
              </h1>
              <p className="font-body-lg text-surface-container-lowest max-w-lg mb-8 text-[18px]">
                Born from the grit of the manufacturing floor, ME Gears redefines performance apparel through the lens of heavy-duty engineering.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#heritage"
                  className="bg-primary text-on-primary px-8 py-4 font-label-bold hover:opacity-95 active:scale-95 transition-all text-center"
                >
                  Explore Heritage
                </Link>
                <Link
                  href="#vision"
                  className="border border-on-primary text-on-primary px-8 py-4 font-label-bold hover:bg-on-primary hover:text-primary active:scale-95 transition-all text-center"
                >
                  The Vision
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Vision Section */}
        <section id="vision" className="py-24 px-6 max-w-[1280px] mx-auto">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="font-headline-lg text-[32px] text-primary mb-4">The Vision</h2>
            <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
            <p className="mt-6 font-body-lg text-on-surface-variant text-[18px] leading-relaxed">
              We bridge the gap between technical workwear and high-end lifestyle apparel, creating tools for the modern explorer who values precision and durability above all else.
            </p>
          </div>

          {/* Bento Grid */}
          <div id="heritage" className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Image Card */}
            <div className="col-span-12 md:col-span-7 h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-sm relative group">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx9Vp1JB3RRwbiVY4-6AcEB7gO_rZm5L9wtiwjCq78oki9VyJjFT_z1qv4Be2nCq9pEd0mndiKFZ2ZDbNnWCYFXLJ9w_feOamFlS27w8meJqTkfmqciZUU9RZ-S6XHaU0EDwivxM8sc9yWbLQKvqO-6L9G8R-tl6oEj8tTUs2Nsf0ZfSRv_vD2NI2PWZFjk6xKuHHMG8pMAp0G1Ea62eKdQgpGCHBlOpiM7Xb9FkK_DHr45pEaJ4u36Q"
                alt="High-performance rugged fabric detail"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="font-headline-md text-[24px] text-on-primary mb-2">
                  Premium Ruggedness
                </h3>
                <p className="text-surface-container-lowest font-body-md text-sm opacity-90">
                  Every seam is a testament to our commitment to structural integrity.
                </p>
              </div>
            </div>

            {/* Feature Text Card */}
            <div className="col-span-12 md:col-span-5 bg-surface-container-high p-8 md:p-12 rounded-xl flex flex-col justify-center shadow-sm border border-outline-variant/15">
              <Building2 className="text-secondary w-12 h-12 mb-6" />
              <h3 className="font-headline-md text-[24px] text-primary mb-4 font-bold">
                Precision Engineering
              </h3>
              <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
                Our design process mimics the mechanical assembly of aerospace components. We don't just 'sew'; we build. Every garment undergoes rigorous testing in extreme conditions before it reaches your hands.
              </p>
              <Link
                href="#"
                className="font-label-bold text-secondary flex items-center gap-2 group text-sm hover:underline"
              >
                <span>Learn about our testing protocols</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Secondary Small Cards */}
            <div className="col-span-12 md:col-span-4 bg-primary text-on-primary p-10 rounded-xl shadow-sm flex flex-col justify-between min-h-[250px]">
              <h4 className="font-headline-md text-[22px] font-bold">01. Heritage</h4>
              <p className="opacity-80 font-body-md text-sm leading-relaxed mt-4">
                Rooted in four decades of industrial tool manufacturing, we bring that same uncompromising grit to apparel.
              </p>
            </div>

            <div className="col-span-12 md:col-span-4 rounded-xl overflow-hidden h-[300px] md:h-auto min-h-[250px] relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAncIMyTrirZiB7MXPorsTmvfiLqtV55AE0P4mdh5DImnYBEQHUXhK6gpsUhglYXIjwE4MNI5kNhBDPasDoMQh4XA_0KBK2rcVTWfnJtIXbwLDmfD78T-HMQe6CHapnsJ6LnhHTomE2SDmJFS0clGGWx1-cRKrkr6GVrhSbFDYL4HgiFmhK6jB9qL17MKX0bx92K2r97jhv6Cri9hR4wXQpx1DiCUwT1PvTt7c-BDDT2qO8g1ZqrWjktA"
                alt="Artisan sewing heavy fabric"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="col-span-12 md:col-span-4 bg-secondary text-on-secondary p-10 rounded-xl shadow-sm flex flex-col justify-between min-h-[250px]">
              <h4 className="font-headline-md text-[22px] font-bold">02. Modernity</h4>
              <p className="opacity-90 font-body-md text-sm leading-relaxed mt-4">
                We integrate smart fibers and weather-reactive coatings to ensure your gear evolves with your environment.
              </p>
            </div>
          </div>
        </section>

        {/* Manufacturing Section */}
        <section className="bg-primary text-on-primary py-24">
          <div className="px-6 max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <span className="font-label-bold text-secondary-fixed-dim uppercase tracking-widest text-secondary text-sm">
                    The Workshop
                  </span>
                  <h2 className="font-headline-xl text-[36px] sm:text-[48px] text-on-primary mt-3 mb-6 leading-tight">
                    Craftsmanship & <br />
                    Durability
                  </h2>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-secondary/15 flex items-center justify-center rounded-lg border border-secondary/30 shrink-0">
                      <Wrench className="text-secondary w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-headline-md text-[20px] text-on-primary mb-2 font-bold">
                        Human-Led Assembly
                      </h4>
                      <p className="text-on-primary-container font-body-md text-sm leading-relaxed">
                        While we use advanced machinery, the final fit and finish of every ME Gears product is performed by master technicians with over 20 years of experience.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-secondary/15 flex items-center justify-center rounded-lg border border-secondary/30 shrink-0">
                      <ShieldCheck className="text-secondary w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-headline-md text-[20px] text-on-primary mb-2 font-bold">
                        Lifetime Warranty
                      </h4>
                      <p className="text-on-primary-container font-body-md text-sm leading-relaxed">
                        We believe in the longevity of our creations. If a gear fails due to manufacturing defects, we repair or replace it—no questions asked.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aspect Ratio Image Container */}
              <div className="w-full">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative border border-on-primary/10">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXXmPg5hhAjgjKDFQdSgD-2RqoBLfuHCHRrsZC6n4xBg6A8qUtLElq_1DgLnelGln-sIeFDxnL1dsxsJvqAxMoKBp2Lvtg_qnR8MpLfswA5m1zi8LBO9815Hrd17O8saT_SYHW7rpAB6Y5UOiejCapPk-syGeywnV_wuL1mtXpQhWBceZU7Rtep8OffE4MK1pP1gaxQBs-RK8V4RTxuptmJ8rYAkdmIpjYBpagGTPVFaRRTbvw8TqzwQ"
                    alt="Precision industrial robotic welding arm"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 border-[24px] border-on-primary/5 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability Section */}
        <section className="py-24 px-6 max-w-[1280px] mx-auto">
          <div className="bg-surface-container/70 backdrop-blur-[12px] border border-outline/10 p-8 md:p-20 rounded-[2rem] overflow-hidden relative shadow-sm">
            {/* Decorative Ornaments */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-1/3">
                <div className="bg-surface-container-highest p-4 rounded-2xl inline-block mb-6 shadow-sm border border-outline-variant/10">
                  <Leaf className="text-secondary w-8 h-8" />
                </div>
                <h2 className="font-headline-lg text-[32px] text-primary font-bold">
                  Our Legacy is Green
                </h2>
              </div>
              <div className="w-full md:w-2/3">
                <p className="font-body-lg text-on-surface-variant mb-10 leading-relaxed text-[18px]">
                  Industrial excellence doesn't have to come at the cost of the environment. At ME Gears, sustainability is integrated into our core engineering. From using recycled materials to eco-friendly waterproof membranes, we are committed to reducing our footprint without sacrificing a single ounce of durability.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-label-bold text-secondary text-[16px] mb-2 uppercase tracking-wide">
                      95% Recycled
                    </h5>
                    <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">
                      Of our packaging materials are fully biodegradable and plastic-free.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-label-bold text-secondary text-[16px] mb-2 uppercase tracking-wide">
                      Closed Loop
                    </h5>
                    <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">
                      We reclaim 80% of water used in our fabric treatment processes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-surface-container border-t border-outline-variant/10">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h3 className="font-headline-lg text-[32px] text-primary mb-6 font-bold">
              Gear Up for the Challenge
            </h3>
            <p className="font-body-lg text-on-surface-variant mb-10 text-[18px]">
              Discover the full collection designed for the rugged world.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-secondary text-on-secondary px-12 py-5 font-label-bold rounded-full shadow-lg hover:shadow-secondary/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              Shop the Collection
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
