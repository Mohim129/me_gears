export default function StatsBar() {
  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '24/7', label: 'Expert Support' },
    { value: 'Free', label: 'Worldwide Shipping' },
    { value: '100%', label: 'Ethical Sourcing' },
  ];

  return (
    <section className="bg-primary text-on-primary py-12">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col gap-1">
            <p className="font-headline-md text-[24px] font-semibold text-secondary-fixed-dim">
              {stat.value}
            </p>
            <p className="font-label-bold text-[14px] text-on-primary-container">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
