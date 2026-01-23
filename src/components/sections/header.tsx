"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import Image from "next/image";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-[100] w-full transition-all duration-300">
      <div className="mx-auto max-w-[1440px] px-6 lg:pt-2">
        <div
          id="js-pageHeader"
          className={`flex w-full items-center justify-between gap-4 py-2 lg:px-4 px-3 md:px-6 lg:rounded-xl transition-all duration-300 ${
            isScrolled
              ? "bg-white/80 backdrop-blur-lg shadow-floating"
              : "bg-transparent"
          }`}
        >
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-90"
              aria-label="Home"
            >
                <Image
                  src="/logo.png"
                  alt="Plan Your Career Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="text-xl md:text-2xl font-bold text-[#1B1431]">
                  Plan Your Career
                </span>
            </Link>

        <div className="flex gap-2 items-center">
            <Link
              className="flex h-10 lg:h-12 bg-transparent w-auto px-3.5 sm:px-5 lg:px-8 cursor-pointer touch-manipulation appearance-none items-center justify-center rounded-lg border-2 border-solid border-[#1B1431] text-sm lg:text-base font-bold text-[#1B1431] focus-visible:outline-blue-600 hover:opacity-80 lg:rounded-xl transition-all"
              href="/login"
              aria-label="Login to your account"
            >
              Login
            </Link>
            <Link
              className="flex h-10 lg:h-12 bg-[#1B1431] w-auto px-3.5 sm:px-5 lg:px-8 cursor-pointer touch-manipulation appearance-none items-center justify-center rounded-lg border-none text-sm lg:text-base font-bold text-white focus-visible:outline-blue-600 hover:opacity-80 lg:rounded-xl transition-all"
              href="/dashboard"
              aria-label="Go to dashboard to get started"
            >
              Start now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;