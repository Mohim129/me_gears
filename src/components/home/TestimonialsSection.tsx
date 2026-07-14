import Image from 'next/image';
import { Testimonial } from '@/types';

const TESTIMONIALS: Testimonial[] = [
  {
    quote: '"ME GEARS has redefined my wardrobe. The quality of the Apex Shell is unlike anything I\'ve owned before. Truly industrial chic."',
    name: 'Marcus Thorne',
    role: 'Architect, London',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1W3aC-2ZkDgIdZuOOZdU6FWovh7-RLo0dxpT1Z7vd0Z8jrX0pqJVSLoZ0r6ADZTUKW_05iomqbVeoja-IJBXyXmEzfZyVWXGK66mMqR8PFf1-QP_6yJs_6_wMW1DZrVewWTrecJ51pJAnrJGjhevV7-jFA1sUvO58I3fzHh_XanczcVtVUh0p24zyelTUnVIqlPM2kx9aCc-L5NW60EdLAB5rfrrIUCMCXzxTJWaCZFAwHDlexH8P7Q',
  },
  {
    quote: '"Sustainability and style finally meet. I love knowing exactly where my clothes come from without sacrificing the edgy look I want."',
    name: 'Elena Vance',
    role: 'Creative Director, NYC',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdpJaDlMRWHudT6vKvuqpw9d8c58eVTyM6hXvsB6Iw565NEL1f-XukyxpeLQuz4-OIUmzeLygts5srNmywJdRX56mHvx45OzwLspdNJLJi5SyP99MTaU4hB3Z1bw2yvKqEfBk6DoCjqnsftpnFYcYQhfTshOv0qitHJc3JyrOb8H4OOMGQnMLMCLWTkCUxDlEsTOJarbarbgMW_tFzgBse_E0VrRI0HpS8phWBmD-lOT90glmRVnyHcQ',
  },
  {
    quote: '"The attention to detail in the packaging alone was impressive. The modular joggers are my new daily uniform."',
    name: 'Jordan Park',
    role: 'Tech Consultant, Seoul',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_8366gp6kBWV4iT-KA-gADukXy69O7ookm8Vj7465Sd9cuXfzOigQjzlknEp0zFCkvwzKValIqtIrZ5gXpfDJouoo5D6HBmEHyGFbyPjRjpCgTu6I_VBB_qbkxZyZSt2nHq69GQUF_ImOt4tdSxwfsiIx7GEud_EdR63Mn38JFIDUIvDIBLANbbPY5b4oZwvkEyVfwcGOx51g1rfjEZOGJLzdOZ-YnqerAdN9U0GD11Ie-_CjOQkmkQ',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-headline-lg text-[32px] font-bold mb-16 text-center text-primary">
          The Community Speaks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {TESTIMONIALS.map((testimonial, idx) => {
            const isMiddle = idx === 1;
            return (
              <div
                key={testimonial.name}
                className={`bg-surface-container p-8 rounded-2xl border border-outline/5 transition-all duration-500 ${
                  isMiddle
                    ? 'md:scale-105 shadow-xl relative z-10 bg-surface-container-lowest md:py-10'
                    : 'shadow-card'
                }`}
              >
                <p className="font-body-lg text-[18px] text-on-surface mb-8 italic leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-4">
                  {/* Circular Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-container">
                    <Image
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-label-bold text-[14px] text-primary font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-[12px] text-on-surface-variant">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
