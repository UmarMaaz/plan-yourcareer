import React from 'react';
import { Gift, Smile, Download, Layout, Upload, ShieldCheck } from 'lucide-react';

const features = [
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
      icon: <Download className="w-5 h-5 text-white" />,
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
  
  const FeaturesGrid = () => {
    return (
      <section className="w-full py-20 md:py-32 flex flex-col items-center bg-[#F1EFE9]">
        <div className="mx-auto max-w-[1440px] px-6">
          {/* Header Section */}
          <div className="mb-16 md:mb-24 text-left">
            <h2 className="text-[32px] md:text-[48px] lg:text-[64px] font-black text-[#1B1431] leading-[1.1] tracking-[-0.03em] mb-4">
              What&apos;s included in Plan Your Career&apos;s Free Plan
            </h2>
            <p className="text-[#4B5563] text-base md:text-lg lg:text-xl font-medium opacity-80">
              You won&apos;t find a more generous free plan among resume builders. Here&apos;s what you get with Plan Your Career&apos;s free plan.
            </p>
          </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start group">
              {/* Icon Container */}
              <div className="w-10 h-10 rounded-lg bg-[#1B1431] flex items-center justify-center mb-6 shadow-sm">
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#1B1431] leading-tight mb-4 tracking-[-0.01em]">
                {feature.title}
              </h3>
              <p className="text-[#4B5563] text-sm md:text-[15px] leading-[1.6] opacity-90">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;