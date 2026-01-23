import React from 'react';
import Image from 'next/image';

const steps = [
  {
    number: "1",
    title: "Add content",
    description: "Build your resume — we'll guide you every step of the\u00A0way to ensure it's professional and\u00A0polished.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c520a239-6b49-4a76-aaa1-a6c287b44be9-flowcv-com/assets/images/step1-content-1000-3.webp",
    alt: "Quickly add your resume content",
  },
  {
    number: "2",
    title: "Design effortlessly",
    description: "Choose from over 50 templates and customize every detail to suit your style and career.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c520a239-6b49-4a76-aaa1-a6c287b44be9-flowcv-com/assets/images/step2-design-1000-4.webp",
    alt: "Design effortlessly",
  },
  {
    number: "3",
    title: "Download & Share",
    description: "Download your resume as a PDF or share it\u00A0online\u00A0with your unique link.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c520a239-6b49-4a76-aaa1-a6c287b44be9-flowcv-com/assets/images/step3-download-1000-5.webp",
    alt: "Download and share",
  },
];

const HowItWorks = () => {
  return (
    <section className="mx-auto max-w-[1440px] px-6 mt-20 md:mt-24 lg:mt-28 xl:mt-32 2xl:mt-36 4xl:mt-40">
      <div>
        {/* Section Heading */}
        <h2 className="text-center font-black text-[#1B1431] text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] tracking-[-1.5px] lg:tracking-[-2.5px]">
          <span>How</span>{" "}
          <span className="px-[2px] sm:px-[3px] md:px-[4px] lg:px-[5px]">Plan Your Career</span>{" "}
          <span>works</span>
        </h2>

        {/* Steps Grid */}
        <div className="mt-8 grid grid-cols-1 gap-12 md:mt-12 lg:mt-16 xl:mt-20 2xl:gap-14">
          {steps.map((step) => (
            <div
              key={step.number}
              className="mx-auto grid w-full max-w-[440px] grid-cols-1 items-center gap-5 md:max-w-none md:grid-cols-[4fr_5fr] lg:grid-cols-[1fr_1fr] md:gap-8 lg:gap-16 2xl:gap-20"
            >
              {/* Image side - Alternates only if logic were complex, but standard layout uses consistent ordering for visual stability or alternating if desired. Original layout shows image-text consistently. */}
              <div className="flex w-full items-center justify-center md:justify-end">
                <div className="relative w-full md:max-w-[480px] 2xl:max-w-[500px]">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    width={2320}
                    height={1344}
                    className="h-auto w-full rounded-lg md:rounded-xl shadow-lg"
                    style={{ maxWidth: '500px', width: '100%' }}
                  />
                </div>
              </div>

              {/* Text side */}
              <div className="pl-3 sm:pl-5 lg:px-0">
                <h3 className="text-2xl font-black text-[#1B1431] sm:text-3xl lg:text-4xl xl:text-5xl lg:tracking-[-0.5px] xl:tracking-[-1px]">
                  {step.number}. {step.title}
                </h3>
                <p className="mt-2 max-w-[380px] text-base leading-[1.6] text-[#4B5563] sm:max-w-[460px] sm:text-lg sm:mt-3 lg:mt-5 lg:text-xl lg:leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;