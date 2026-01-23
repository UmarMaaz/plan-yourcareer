import React from 'react';
import { ArrowRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "I absolutely love this site. It has made a huge difference in my and so many of my friends' career paths. Super easy to edit and customize.",
    author: "Siobhan K.",
    platform: "Google Review",
    logo: "https://assets.flowcvassets.com/landing/google-logo.svg",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.4-1.92 4.41-1.2 1.2-3.08 2.48-5.92 2.48-4.74 0-8.42-3.87-8.42-8.58s3.68-8.58 8.42-8.58c2.51 0 4.43 1 5.85 2.37l2.31-2.31C18.61 1.95 15.86 1 12.48 1c-6.08 0-11 4.92-11 11s4.92 11 11 11c3.28 0 5.76-1.08 7.67-3.08 1.97-1.97 2.6-4.72 2.6-7 0-.67-.05-1.34-.17-2h-10.1z" />
      </svg>
    )
  },
  {
    id: 2,
    content: "Great option totally free of cost and without watermarks even for the basic service. [...] Easy format, looks clean and clear.",
    author: "Isabel R.",
    platform: "Trustpilot Review",
    logo: "https://assets.flowcvassets.com/landing/trustpilot-logo.svg",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#00b67a]" fill="currentColor">
        <path d="M17.427 9.214l3.573-2.592-4.419-.001L15.2 2.25l-1.381 4.371h-4.419l3.573 2.593-1.365 4.372 3.573-2.592 3.573 2.592-1.365-4.372z" />
      </svg>
    )
  },
  {
    id: 3,
    content: "[...] I recently tried Plan Your Career, and I'm amazed at how quickly it lets you craft a polished, modern CV - literally in just minutes. [...]",
    author: "Vaibhavi R.",
    platform: "LinkedIn Post",
    logo: "https://assets.flowcvassets.com/landing/linkedin-logo.svg",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#0077b5]" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    )
  },
  {
    id: 4,
    content: "Have used it for a couple of resumes now. It's super neat and simple. I love the customization options, and overall, just works smoothly.",
    author: "Abhinav C.",
    platform: "Product Hunt Review",
    logo: "https://assets.flowcvassets.com/landing/producthunt-logo.svg",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#da552f]" fill="currentColor">
        <path d="M13.56 19.752a.272.272 0 0 1-.272.248h-2.184a.272.272 0 0 1-.272-.248v-4.52h2.728v4.52zM11.104 4.248h2.184c2.84 0 5.144 2.304 5.144 5.144 0 2.84-2.304 5.144-5.144 5.144h-5.144a.272.272 0 0 1-.272-.272v-9.744a.272.272 0 0 1 .272-.272z" />
      </svg>
    )
  }
];

const Testimonials = () => {
  return (
    <section className="w-full bg-[#F1EFE9] pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-32 lg:pb-28">
      <div className="container mx-auto px-6 max-w-[1440px]">
        {/* Header Content */}
          <div className="text-center md:text-left mb-12 md:mb-14 lg:mb-16">
            <h2 className="text-[40px] leading-[1.1] md:text-5xl lg:text-[64px] font-black tracking-[-1.5px] md:tracking-[-2.5px] text-[#1B1431]">
              Loved & Trusted
            </h2>
          </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="shrink-0 w-full xs:w-[320px] md:w-[360px] lg:w-[400px] bg-white rounded-[20px] p-6 md:p-8 shadow-floating transition-transform duration-300 hover:-translate-y-1 snap-start"
              >
                <div className="min-h-[140px] md:min-h-[160px]">
                  <p className="text-sm md:text-base lg:text-[17px] leading-relaxed text-[#4B5563] italic">
                    {testimonial.content}
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                      {testimonial.icon || (
                         <div className="w-full h-full bg-gray-100 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-bold text-[#1B1431]">
                      {testimonial.author}
                    </div>
                    <a 
                      href="#" 
                      className="text-xs md:text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                    >
                      {testimonial.platform}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Controls (Simplified representation) */}
          <button 
            className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-10 hidden md:flex w-12 h-12 items-center justify-center bg-white rounded-full shadow-hero hover:scale-105 transition-transform border border-gray-100"
            aria-label="Next testimonials"
          >
            <ArrowRight className="w-6 h-6 text-[#1B1431]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;