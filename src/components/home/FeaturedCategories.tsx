import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    name: 'Men',
    linkText: 'Explore Collection',
    href: '#',
    gridSpan: 'md:col-span-8',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwy4ioCzx7Pjb4BwnlE8TjiUblQavlbgbU1pWpVMnoUrIU-AK7xnwYXAe-IFG-Bqwk2P3bRNLmVVeaj5Awm2Jg_m7DR3I4BbhryXoZiE-KngDurM2ck4fGnGbPTOZihx4eZq0R0-6bRVp5rAwoJXi8RRyboW9ijvPTC1uEJ4JqiWOLEfgH4CuWzzb482UEprSSzHmll-XrR0XkmwOpeeYbG1ncQQ4RhnFOqxmJFhgC7e3MvMYx-V2uFg',
    alt: 'Avant-garde menswear look featuring structured utility vest and slate gray trousers.'
  },
  {
    name: 'Women',
    linkText: 'Shop Women',
    href: '#',
    gridSpan: 'md:col-span-4',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDElaiYY9DZW6qX_ILplpAbfrmMyC4RyAb6nvY_SIHZFwQT1mhlE2_0Ucbk72Kiae6QgauoBypNM_BcXctSOWpv8u9jS5ua4Hmu-cJ3_siqQ1EHguzsyOuIYAMcBPgcEv6luFB05m5AIguEgc3bbGU0qNzmh9mQVV7HYcanBhq4fx9XcArHsqHGLkzrtSsDGkp_1nOtLrukmYzeuTmgbtF4NUsSrWL7Ttj5jp1YBr8Rb3b-H8VJl-rmnQ',
    alt: 'High-end minimalist olive knitwear draped on a warm background.'
  },
  {
    name: 'Accessories',
    linkText: 'View All',
    href: '#',
    gridSpan: 'md:col-span-4',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVzglWOsL4F9yONQWGUU4y2R_NgwoUMKlDnFawv0CeMGzRsg8QowtOA2l8JlXtm4GSJV7ezYewSwJWz6k0IhEAXPYE_AzD6YaDAllFGIRw_SK2CEaSbf36mLsahAwQirRe8vnz_tzNjxsEygVzvyF36o_oGnRF-uSwjjhLRTreOW_I1jyjw6q3jJsUJQiWHPfj7WQrlUuB2qSqT4TQGoaUEjOleq7IfGsG2-yWLLbIGSR7CdLQM4lCUQ',
    alt: 'Premium slate gray leather bag with gunmetal hardware detail.'
  },
  {
    name: 'Shoes',
    linkText: 'Discover More',
    href: '#',
    gridSpan: 'md:col-span-8',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCB2FHf7TF7_wk1X3z2uRpI1L9KSmBKg-a05Omf2fNVOT6bz6YQxtrJo-5IrWNCCHM7b7su-XoupRwphLtD9nT4Zlke5D4C-juQJio_LtyFy-Duv12OOc8i_OkCl1fOHYe0P8f7AdwlR7h8u55LgKdx3zBVOTbZ6C0uCWnUkbgMlEeyyxeGrxraz24X2xgsVJYNYL7s-4AtApN_-ceqmBye-4LCfXSiSGpKARNjTM7mqxu3OZB1HYTSg',
    alt: 'Technical grayscale sneakers on a concrete texture.'
  }
];

export default function FeaturedCategories() {
  return (
    <section className="py-20 max-w-[1280px] mx-auto px-6">
      <h2 className="font-headline-lg text-[32px] font-bold mb-12 text-center text-primary">
        Curated Collections
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[700px]">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`${category.gridSpan} group relative overflow-hidden rounded-xl h-[300px] md:h-auto min-h-[250px] shadow-card transition-all duration-300`}
          >
            {/* Background Image using next/image */}
            <Image
              src={category.image}
              alt={category.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/45 transition-all duration-500" />
            
            {/* Content overlay */}
            <div className="absolute bottom-8 left-8 z-10">
              <h3 className="font-headline-md text-[24px] font-semibold text-white mb-2">
                {category.name}
              </h3>
              <Link
                href={category.href}
                className="text-white font-label-bold text-[14px] border-b border-white pb-1 hover:text-secondary-fixed-dim hover:border-secondary-fixed-dim transition-colors"
              >
                {category.linkText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
