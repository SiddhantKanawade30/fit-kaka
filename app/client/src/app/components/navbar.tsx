"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className={`fixed top-4 left-0 right-0 z-50 flex justify-center w-full px-4 sm:px-6 lg:px-8`}
    >
      <div
        className={`flex max-w-6xl w-full items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/70 shadow-lg shadow-[#075e54]/5 backdrop-blur-lg border border-white/20"
            : "bg-white/30 backdrop-blur-md border border-white/10"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#075e54] to-[#25d366] flex items-center justify-center text-white font-bold shadow-sm shadow-[#25d366]/30 group-hover:scale-105 transition-transform">
            FK
          </div>
          <span className="font-bold text-lg tracking-tight text-neutral-900">
            FIT KAKA
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Home", "Highlights" , "Features"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-neutral-600 hover:text-[#128c7e] transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-white bg-[#25d366] hover:bg-[#128c7e] transition-colors px-5 py-2.5 rounded-full shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
