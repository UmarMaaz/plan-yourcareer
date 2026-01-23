'use client';

import React from 'react';
import { templates } from '@/lib/templates';
import { TemplatePreview } from '@/components/resume-templates/TemplatePreview';

const TemplatesCarousel = () => {
  return (
    <section className="mt-20 md:mt-24 lg:mt-32 xl:mt-36 2xl:mt-40 w-full flex flex-col items-center 4xl:mt-44 font-sans">
      <div className="w-full mx-auto max-w-[1440px] px-6">
          <h2 className="text-[32px] md:text-[48px] lg:text-[56px] 2xl:text-[64px] font-black text-foreground tracking-[-1.5px] lg:tracking-[-2.5px] leading-[1.1]">
            Choose from our Resume Templates
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#4B5563] mt-2 sm:mt-3 lg:mt-5 leading-relaxed">
            Our <a href="/resume-templates" className="underline font-semibold hover:opacity-80">free resume templates</a> help you create a professional resume that stands out.
          </p>
      </div>

      {/* Carousel Container */}
      <div className="w-full overflow-hidden mt-8 md:mt-12 2xl:mt-14">
        <div 
          className="flex gap-4 md:gap-6 w-full pb-8 overflow-x-auto no-scrollbar px-[max(1.5rem,calc((100vw-1440px)/2+1.5rem))]"
          id="templates-carousel"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {templates.map((template, index) => (
            <a 
              key={template.id}
              href={`/dashboard/new?template=${template.id}`}
              className="carousel-item shrink-0 w-[70vw] sm:w-[50vw] md:w-[30vw] lg:w-[24vw] 2xl:w-[calc(25%-1.25rem)] max-w-[450px] relative group block"
            >
                <div className="w-full aspect-[1/1.41] relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 bg-white">
                  <TemplatePreview templateId={template.id} />
                  {/* Hover Overlay Button */}

                <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-[#1B1431] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg">
                    See Template
                  </span>
                </div>
              </div>
            </a>
          ))}
          {/* Spacer for horizontal scroll ending */}
          <div className="shrink-0 w-6 lg:w-14 xl:w-20" aria-hidden="true" />
        </div>
      </div>

      <div className="flex gap-2.5 mt-2 mb-10">
        {templates.map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-[#E5E7EB]'}`}
          />
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-8">
        <a 
          href="/dashboard/new"
          className="flex h-12 px-8 items-center justify-center rounded-xl border-2 border-solid border-[#1B1431] text-lg font-bold text-[#1B1431] hover:bg-[#1B1431] hover:text-white transition-colors duration-200"
        >
          All Resume Templates
        </a>
      </div>
    </section>
  );
};

export default TemplatesCarousel;
