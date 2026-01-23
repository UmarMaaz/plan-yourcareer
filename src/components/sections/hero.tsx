'use client';

import React from 'react';
import { templates } from '@/lib/templates';
import { TemplatePreview } from '@/components/resume-templates/TemplatePreview';

const HeroSection = () => {
  const mainTemplate = templates[0];

  return (
    <section className="mx-auto max-w-[1440px] px-6 pt-14 pb-20 lg:pb-32">
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] lg:grid-cols-[57%_42%] items-center lg:gap-[1%]">
        {/* Left Content Area */}
        <div className="mt-16 md:mt-4 2xl:mt-6 w-full xl:mt-8 4xl:mt-5 order-2 md:order-1">
          <h1 className="uppercase font-semibold text-[15px] lg:text-lg xl:text-xl 2xl:text-2xl text-[#4B5563] tracking-[-0.1px] lg:tracking-[-0.2px] xl:tracking-[-0.3px] 2xl:tracking-[-0.4px] mb-3 lg:mb-4">
            Free Online Resume Builder
          </h1>
          
          <h2 className="font-black text-[#1B1431] text-4xl 500:text-5xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-[80px] 4xl:text-[92px] leading-[1.05] tracking-[-1.5px] lg:tracking-[-2.5px] 2xl:tracking-[-3.5px] 4xl:tracking-[-5px] mt-3 lg:mt-4 xl:mt-5 2xl:mt-6 4xl:mt-5.5">
            Build a job-winning resume&nbsp;for&nbsp;free
          </h2>

          <p className="mt-4 lg:mt-6 text-lg text-gray-600 leading-[1.6] max-w-[400px] lg:max-w-[500px] lg:text-[20px] xl:text-[22px] lg:leading-[1.8] 2xl:text-[24px] 4xl:text-[28px] 4xl:leading-[1.8] 4xl:max-w-[560px] 4xl:mt-8">
            Your first resume is 100% free forever. Unlimited&nbsp;downloads. No
            hidden fees.
            <span className="block mt-1">Yes,&nbsp;really 🚀</span>
          </p>

              <a 
                href="/dashboard/resumes" 
                className="mt-7 lg:mt-10 inline-flex items-center justify-center bg-[#1B1431] text-white h-15 lg:h-20 px-8 rounded-xl text-base mq9:text-lg lg:text-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Get started – it&apos;s free ✨
              </a>
            </div>

        {/* Right Preview Image & Floating Cards Area */}
          <div className="flex justify-center md:order-2 w-full order-1 mb-12 md:mb-0">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[460px] xl:max-w-[480px] 2xl:max-w-[520px] 3xl:max-w-[560px]">
                {/* Main Resume Preview */}
                <div className="w-full aspect-[1/1.41] relative rounded-lg border border-gray-200 shadow-hero md:rounded-xl overflow-hidden bg-white">
                  <TemplatePreview templateId={mainTemplate.id} />
                </div>

            </div>
          </div>
      </div>


    </section>
  );
};

export default HeroSection;