import React from 'react';

const ValueProps = () => {
  return (
    <section className="mt-20 md:mt-28 lg:mt-32 xl:mt-36 2xl:mt-40 mb-20 md:mb-24 lg:mb-28 w-full flex justify-center 3xl:mt-40 4xl:mt-44 px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-10 sm:gap-1 sm:grid-cols-3 sm:-ml-4 lg:-ml-2 max-w-5xl w-full lg:max-w-6xl 3xl:max-w-7xl">
        {/* Item 1: Free Forever */}
        <div className="flex sm:flex-col space-x-5 items-center sm:space-y-3 sm:space-x-0 md:space-y-4 lg:space-y-5">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="size-10 lg:size-12 text-[#1B1431]"
          >
            <path 
              d="M38 18H10C8.89543 18 8 18.8954 8 20V40C8 41.1046 8.89543 42 10 42H38C39.1046 42 40 41.1046 40 40V20C40 18.8954 39.1046 18 38 18Z" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M8 26H40" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M24 18V42" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M16 18C16 14.134 19.5817 11 24 11C28.4183 11 32 14.134 32 18" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-xl font-bold leading-tight tracking-tight sm:text-center sm:text-lg md:text-xl lg:text-2xl lg:leading-snug text-[#1B1431]">
            1st resume,<br className="hidden sm:block" /> free forever
          </p>
        </div>

        {/* Item 2: Privacy */}
        <div className="flex sm:flex-col space-x-5 items-center sm:space-y-3 sm:space-x-0 sm:mr-4 md:space-y-4 lg:space-y-5">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="size-10 lg:size-12 text-[#1B1431]"
          >
            <path 
              d="M24 6L10 12V24C10 32.8366 16.1634 39.1634 24 42C31.8366 39.1634 38 32.8366 38 24V12L24 6Z" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M24 18V26" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle 
              cx="24" 
              cy="28" 
              r="2" 
              fill="currentColor"
            />
          </svg>
          <p className="text-xl font-bold leading-tight tracking-tight sm:text-center sm:text-lg md:text-xl lg:text-2xl lg:leading-snug text-[#1B1431]">
            Privacy & <br className="hidden sm:block" /> GDPR&nbsp;compliant
          </p>
        </div>

        {/* Item 3: Templates */}
        <div className="flex sm:flex-col space-x-5 items-center sm:space-y-3 sm:space-x-0 md:space-y-4 lg:space-y-5">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="size-10 lg:size-12 text-[#1B1431]"
          >
            <path 
              d="M36 6H12C10.8954 6 10 6.89543 10 8V40C10 41.1046 10.8954 42 12 42H36C37.1046 42 38 41.1046 38 40V8C38 6.89543 37.1046 6 36 6Z" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M18 14H30" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M18 22H30" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M18 30H24" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M32 32L38 38" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-xl font-bold leading-tight tracking-tight sm:text-center sm:text-lg md:text-xl lg:text-2xl lg:leading-snug text-[#1B1431]">
            Professional<br className="hidden sm:block" /> Templates
          </p>
        </div>
      </div>
    </section>
  );
};

export default ValueProps;