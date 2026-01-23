import React from 'react';
import { Gift, Smile, CloudDownload, Layout, Upload, ShieldCheck } from 'lucide-react';

const FreePlanDetails = () => {
  const planFeatures = [
    {
      icon: <Gift className="w-5 h-5 text-white" />,
      title: "Your First Resume Is Free Forever",
      description: "Create, edit, and save one resume for free for life. No trial period. No credit card. No auto-upgrade."
    },
    {
      icon: <Smile className="w-5 h-5 text-white" />,
        title: "Just You on Your Resume",
        description: "We never brand your resume. No Plan Your Career logo and no watermarks. Your resume is your place to shine."
      },
      {
        icon: <CloudDownload className="w-5 h-5 text-white" />,
        title: "Unlimited PDF Downloads",
        description: "Update, edit, and download your one free resume as often as you like. There are no download limits."
      },
      {
        icon: <Layout className="w-5 h-5 text-white" />,
        title: "50+ Customizable Templates",
        description: "Choose from professional, ATS-friendly templates and fully customize structure, layout, and design."
      },
      {
        icon: <Upload className="w-5 h-5 text-white" />,
        title: "Import Content or Start From Scratch",
        description: "Upload content from an existing resume file (PDF/ DOCX/PNG/JPG), or start from a blank page."
      },
      {
        icon: <ShieldCheck className="w-5 h-5 text-white" />,
        title: "We Respect Your Privacy",
        description: "Plan Your Career is privacy-first and GDPR-compliant. We don't share your personal data, and you can delete it anytime."
      }
    ];
  
    return (
      <section className="w-full flex flex-col items-center py-20 md:py-24 lg:py-32 xl:py-36 2xl:py-40 px-6 sm:px-10 lg:px-24">
        <div className="max-w-[1440px] w-full">
          {/* Header Section */}
          <div className="text-left mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[60px] font-black text-[#1B1130] leading-[1.1] tracking-[-1.5px] md:tracking-[-2.5px]">
              What&apos;s included in Plan Your Career&apos;s Free Plan
            </h2>
            <p className="mt-4 text-[#4B5563] text-base sm:text-lg lg:text-xl max-w-[800px]">
              You won&apos;t find a more generous free plan among resume builders. Here&apos;s what you get with Plan Your Career&apos;s free plan.
            </p>
          </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 lg:gap-x-12 xl:gap-x-16">
          {planFeatures.map((feature, index) => (
            <div key={index} className="flex flex-col items-start text-left">
              {/* Icon Container */}
              <div className="mb-5 flex items-center justify-center w-10 h-10 bg-[#1B1130] rounded-lg">
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-lg md:text-xl font-bold text-[#1B1130] leading-tight mb-3">
                {feature.title}
              </h3>
              <p className="text-[#4B5563] text-sm md:text-base leading-relaxed opacity-90">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreePlanDetails;