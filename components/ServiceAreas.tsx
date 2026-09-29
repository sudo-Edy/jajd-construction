import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CONFIG } from '../config';
import { analytics } from '../utils/analytics';

// Phones show the closest metro cities first; the full list stays in the DOM
// (hidden until expanded) so every city is still crawlable for local SEO.
const MOBILE_PREVIEW = 8;

const ServiceAreas: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
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
    <section id="service-areas" className="py-14 md:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-10">
          <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">
            Where we work
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Based in Omaha. Serving all of Nebraska.
          </h2>
          <p className="text-stone-600 font-medium max-w-2xl mx-auto">
            Homes and businesses from the metro to across the state.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 md:gap-3 text-center">
          {cities.map((city, index) => (
            <div
              key={city}
              className={`${!showAll && index >= MOBILE_PREVIEW ? 'hidden sm:block' : ''} rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700`}
            >
              {city}
            </div>
          ))}
        </div>

        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="sm:hidden mt-4 w-full flex items-center justify-center gap-2 min-h-[44px] text-sm font-bold text-slate-700"
          >
            Show all {cities.length} cities <ChevronDown className="w-4 h-4" />
          </button>
        )}

        <p className="mt-6 text-center text-sm text-stone-500">
          Town not listed?{' '}
          <a
            href={`tel:${CONFIG.PHONE_RAW}`}
            onClick={() => analytics.phoneClick('service_areas')}
            className="font-semibold text-slate-900 underline underline-offset-2"
          >
            Give us a call
          </a>
          , we likely cover it.

        </p>
      </div>
    </section>
  );
};

export default ServiceAreas;
