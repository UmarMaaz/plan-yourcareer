import React from 'react';

const FeaturesIcons = () => {
  return (
    <section className="mt-20 md:mt-28 lg:mt-32 xl:mt-36 2xl:mt-40 w-full flex justify-center 3xl:mt-40 4xl:mt-44 px-6 lg:px-24">
      <div className="grid grid-cols-1 gap-10 sm:gap-1 sm:grid-cols-3 sm:-ml-4 lg:-ml-2 max-w-5xl w-full lg:max-w-6xl 3xl:max-w-7xl">
        {/* Feature 1: Free Forever */}
        <div className="flex sm:flex-col space-x-5 items-center sm:space-y-3 sm:space-x-0 md:space-y-4 lg:space-y-5 group">
          <div className="flex items-center justify-center">
            <svg 
              className="w-10 h-10 lg:w-12 lg:h-12 text-[#1B1130]" 
              viewBox="0 0 48 48" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                d="M40 18H8C6.89543 18 6 18.8954 6 20V42C6 43.1046 6.89543 44 8 44H40C41.1046 44 42 43.1046 42 42V20C42 18.8954 41.1046 18 40 18Z" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M24 18V44" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M42 26H6" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M31 18C31 18 31 4 24 4C17 4 17 18 17 18" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M17 18C17 18 17 4 24 4C31 4 31 18 31 18" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-xl font-bold leading-tight tracking-tight sm:text-center sm:text-lg md:text-xl lg:text-2xl lg:leading-snug text-[#1B1130]">
            1st resume,<br className="hidden sm:block" /> free forever
          </p>
        </div>

        {/* Feature 2: Privacy & GDPR */}
        <div className="flex sm:flex-col space-x-5 items-center sm:space-y-3 sm:space-x-0 sm:mr-4 md:space-y-4 lg:space-y-5 group">
          <div className="flex items-center justify-center">
            <svg 
              className="w-10 h-10 lg:w-12 lg:h-12 text-[#1B1130]" 
              viewBox="0 0 48 48" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                d="M24 4L6 12V22C6 33.0457 13.5652 42.6053 24 44C34.4348 42.6053 42 33.0457 42 22V12L24 4Z" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M24 18V26" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M24 32V32.02" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-xl font-bold leading-tight tracking-tight sm:text-center sm:text-lg md:text-xl lg:text-2xl lg:leading-snug text-[#1B1130]">
            Privacy & <br className="hidden sm:block" /> GDPR&nbsp;compliant
          </p>
        </div>

        {/* Feature 3: Professional Templates */}
        <div className="flex sm:flex-col space-x-5 items-center sm:space-y-3 sm:space-x-0 md:space-y-4 lg:space-y-5 group">
          <div className="flex items-center justify-center">
            <svg 
              className="w-10 h-10 lg:size-12 text-[#1B1130]" 
              viewBox="0 0 48 48" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                d="M38 4H10C7.79086 4 6 5.79086 6 8V40C6 42.2091 7.79086 44 10 44H38C40.2091 44 42 42.2091 42 40V8C42 5.79086 40.2091 4 38 4Z" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M34 14H14" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M34 24H14" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M22 34H14" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M36 34L30 34" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-xl font-bold leading-tight tracking-tight sm:text-center sm:text-lg md:text-xl lg:text-2xl lg:leading-snug text-[#1B1130]">
            Professional<br className="hidden sm:block" /> Templates
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesIcons;