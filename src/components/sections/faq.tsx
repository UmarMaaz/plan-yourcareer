"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <div className="border-b border-[#E5E7EB]">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className="text-lg font-bold tracking-[-0.01em] text-[#1B1431] md:text-xl lg:text-xl">
          {question}
        </span>
        <Plus
          className={`h-5 w-5 shrink-0 text-[#1B1431] transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] pb-6" : "max-h-0"
        }`}
      >
        <div className="text-base leading-relaxed text-[#4B5563] md:text-lg">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Plan Your Career and how does it work?",
      answer:
        "Plan Your Career is a modern resume builder designed to help you create professional, job-winning documents in minutes. Simply add your content, choose a design, and download your polished PDF.",
    },
    {
      question: "Is Plan Your Career really free?",
      answer:
        "Your first resume is 100% free forever. This includes unlimited updates, edits, and PDF downloads without any watermarks or hidden fees.",
    },
    {
      question: "Why is Plan Your Career free?",
      answer:
        "We believe basic career tools should be accessible to everyone. While we offer premium features for users who need multiple resumes or advanced tools, our core resume building experience remains free.",
    },
    {
      question: "Can I save multiple resume versions on Plan Your Career?",
      answer:
        "With a premium plan, you can create and manage unlimited versions of your resume tailored for different job applications.",
    },
    {
      question: "How does Plan Your Career protect my data?",
      answer:
        "Plan Your Career is privacy-first and GDPR-compliant. Your personal data is encrypted, we never sell your information to third parties, and you can delete your account and all associated data at any time.",
    },
    {
      question: "Does Plan Your Career support multiple languages?",
      answer:
        "Yes, our builder supports all major languages and allows you to customize labels and headings to match your local requirements.",
    },
    {
      question: "Can I also create cover letters with Plan Your Career?",
      answer:
        "Absolutely. Plan Your Career offers a matching cover letter builder so you can maintain a consistent visual brand across your entire application package.",
    },
    {
      question: "Are Plan Your Career resumes ATS-friendly?",
      answer: (
        <div className="space-y-4">
          <p>
            Yes. Plan Your Career exports clean, text-based PDFs with embedded fonts and
            simple structure, so ATS tools can read your resume without
            issues—even with two-column templates; if you&apos;re worried about very
            old systems, it&apos;s safest to pick a one-column layout.
          </p>
          <p>
            In practice, what matters most is that a human can quickly skim your
            resume, so focus on clear headings, relevant keywords, and
            impact-focused bullets.
          </p>
        </div>
      ),
    },
    {
      question: "Can I import an existing resume into Plan Your Career?",
      answer:
        "Yes, you can upload your existing resume in various formats (PDF, DOCX, etc.), and our smart parser will help you transition your content into our designer templates.",
    },
    {
      question: "Is Plan Your Career top-rated by users?",
      answer:
        "Plan Your Career is trusted by over 4.3 million users and holds a 4.9/5 rating across Trustpilot, Product Hunt, and Google Reviews.",
    },
  ];

  return (
    <section className="w-full bg-[#F1EFE9] px-6 py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[900px]">
        <h2 className="mb-12 text-center text-4xl font-black tracking-[-0.03em] text-[#1B1431] md:mb-16 md:text-5xl lg:text-6xl">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col border-t border-[#E5E7EB]">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}