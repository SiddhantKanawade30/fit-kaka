"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 py-16 px-4 md:px-8 border-t border-neutral-900 overflow-hidden relative">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#25d366]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 relative z-10">
        {/* Brand & Description */}
        <div className="flex flex-col gap-4 max-w-xs">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#075e54] to-[#25d366] flex items-center justify-center text-white font-bold">
              FK
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              FIT KAKA
            </span>
          </Link>
          <p className="text-sm text-neutral-400 leading-relaxed">
            AI powered WhatsApp nutrition tracking. No apps to install, just pure convenience and powerful insights right in your pocket.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#25d366] hover:text-white hover:border-[#25d366] transition-colors">
              <Twitter className="size-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#25d366] hover:text-white hover:border-[#25d366] transition-colors">
              <Github className="size-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#25d366] hover:text-white hover:border-[#25d366] transition-colors">
              <Linkedin className="size-4" />
            </a>
          </div>
        </div>

        {/* Links Array */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold mb-2">Product</h4>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">Features</Link>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">Pricing</Link>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">Integrations</Link>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">Changelog</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold mb-2">Company</h4>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">About Us</Link>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">Blog</Link>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">Careers</Link>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">Contact</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold mb-2">Legal</h4>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm hover:text-[#25d366] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
        <p className="text-xs text-neutral-500 cursor-default">
          © 2026 FIT KAKA. All rights reserved. 
        </p>
        <div className="flex gap-4 cursor-default">
           <span className="w-2 h-2 rounded-full bg-[#25d366] my-auto animate-pulse"></span>
           <span className="text-xs text-neutral-400">Made with  ❤️  by Team Velora</span>
        </div>
      </div>
    </footer>
  );
}
