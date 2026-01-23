import React from 'react';
import Image from 'next/image';
import { Mail, Linkedin, Send, Facebook, MessageCircle, Twitter, Github } from 'lucide-react';

const Footer = () => {
    const logoUrl = "/logo.png";

    return (
      <footer className="w-full bg-[#1B1431] text-white pt-20 pb-10 font-sans">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] gap-12 lg:gap-20">
            {/* Logo and Mission Column */}
            <div className="flex flex-col items-start max-w-md">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center">
                  <Image 
                    src={logoUrl} 
                    alt="Plan Your Career Logo" 
                    width={48} 
                    height={48} 
                    className="h-12 w-auto"
                  />
                </div>
                  <span className="text-2xl font-black tracking-tight">Plan Your Career</span>
                </div>
              
              <p className="text-[#94A3B8] text-base lg:text-lg leading-relaxed mb-10">
                We are dedicated to helping job seekers worldwide. Our mission: Empower you to create professional resumes effortlessly. Plan Your Career is here to make your journey smoother, more enjoyable and ultimately more successful.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-auto">
                <span className="text-sm font-bold uppercase tracking-wider text-[#94A3B8]">Tell your friends about us</span>
                <div className="flex items-center gap-4">
                  <a href="mailto:?subject=Check out Plan Your Career" className="text-white hover:opacity-80 transition-opacity">
                  <Mail size={20} />
                </a>
                <a href="https://linkedin.com" className="text-white hover:opacity-80 transition-opacity">
                  <Linkedin size={20} />
                </a>
                <a href="https://telegram.org" className="text-white hover:opacity-80 transition-opacity">
                  <Send size={20} />
                </a>
                <a href="https://facebook.com" className="text-white hover:opacity-80 transition-opacity">
                  <Facebook size={20} />
                </a>
                <a href="https://whatsapp.com" className="text-white hover:opacity-80 transition-opacity">
                  <MessageCircle size={20} />
                </a>
                <a href="https://twitter.com" className="text-white hover:opacity-80 transition-opacity">
                  <Twitter size={20} />
                </a>
                <a href="https://reddit.com" className="text-white hover:opacity-80 transition-opacity">
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col">
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-white">Product</h4>
            <ul className="space-y-4">
              <li>
                <a href="/resume-templates" className="text-[#94A3B8] hover:text-white transition-colors text-base font-semibold">Resume Templates</a>
              </li>
              <li>
                <a href="#" className="text-[#94A3B8] hover:text-white transition-colors text-base font-semibold">AI Resume Writer</a>
              </li>
              <li>
                <a href="#" className="text-[#94A3B8] hover:text-white transition-colors text-base font-semibold">Cover Letter</a>
              </li>
              <li>
                <a href="#" className="text-[#94A3B8] hover:text-white transition-colors text-base font-semibold">Cover Letter Templates</a>
              </li>
              <li>
                <a href="#" className="text-[#94A3B8] hover:text-white transition-colors text-base font-semibold">Job Tracker</a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="flex flex-col">
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-white">Company</h4>
            <ul className="space-y-4">
              <li>
                <a href="/about" className="text-[#94A3B8] hover:text-white transition-colors text-base font-semibold">About</a>
              </li>
              <li>
                <a href="https://app.flowcv.com/pricing" className="text-[#94A3B8] hover:text-white transition-colors text-base font-semibold">Pricing</a>
              </li>
              <li>
                <a href="#" className="text-[#94A3B8] hover:text-white transition-colors text-base font-semibold">Contact</a>
              </li>
              <li>
                <a href="#" className="text-[#94A3B8] hover:text-white transition-colors text-base font-semibold">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-[#94A3B8] hover:text-white transition-colors text-base font-semibold">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-20 pt-8 border-t border-[#4B5563]/20 flex justify-center">
          <p className="text-[#94A3B8] text-sm">
            © 2026 Uniqkorn Creative GmbH
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;