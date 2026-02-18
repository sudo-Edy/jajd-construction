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
    <section id="service-areas" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-10">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
            Nebraska Coverage
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Serving Nebraska Homeowners and Businesses
          </h2>
          <p className="text-slate-600 font-medium">
            Our team supports painting, roofing, siding, remodeling, and general contracting across Nebraska.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
          {cities.map((city) => (
            <div
              key={city}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {city}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          <a href="#services" className="hover:text-slate-900 transition-colors">Services</a>
          <a href="#reviews" className="hover:text-slate-900 transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
