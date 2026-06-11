import React from 'react';

const ServiceAreas: React.FC = () => {
  const cities = [
    'Omaha',
    'Lincoln',
    'Bellevue',
    'Papillion',
    'La Vista',
    'Gretna',
    'Fremont',
    'Norfolk',
    'South Sioux City',
    'Grand Island',
    'Kearney',
    'Hastings',
    'Columbus',
    'York',
    'Seward',
    'Nebraska City',
    'Plattsmouth',
    'Lexington',
    'Cozad',
    'Holdrege',
    'North Platte',
    'McCook',
    'Scottsbluff',
    'Alliance',
    'Sidney',
    'Chadron',
    'Beatrice',
    'Blair',
  ];

  return (
    <section id="service-areas" className="py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-10">
          <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">
            Where we work
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Based in Omaha. Serving all of Nebraska.
          </h2>
          <p className="text-stone-600 font-medium max-w-2xl mx-auto">
            Painting, siding, and roofing for homeowners and businesses, from the Omaha metro
            to communities across the state.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
          {cities.map((city) => (
            <div
              key={city}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {city}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-500">
          <a href="#services" className="hover:text-slate-900 transition-colors">Services</a>
          <a href="#reviews" className="hover:text-slate-900 transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
