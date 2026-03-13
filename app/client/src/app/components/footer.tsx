"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 py-16 px-4 md:px-8 border-t border-neutral-900 overflow-hidden relative">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#25d366]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 relative z-10">
        {/* Brand & Description */}
        <div className="flex flex-col gap-4 max-w-xs">
          <Link href="/" className="flex items-center gap-2">
           
            <span className="font-bold text-xl tracking-tight text-white">
              FIT KAKA
            </span>
          </Link>
          <p className="text-sm text-neutral-400 leading-relaxed">
            AI powered WhatsApp nutrition tracking. No apps to install, just pure convenience and powerful insights right in your pocket.
          </p>
          <div className="flex items-center gap-4 mt-2">
           
            <a href="https://github.com/SiddhantKanawade30/fit-kaka" target="_blank" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#25d366] hover:text-white hover:border-[#25d366] transition-colors">
              <Github className="size-4" />
            </a>
           
          </div>
        </div>
        
        <div className="text-center mt-8">
          <span className="text-sm text-neutral-400">Built with ❤️ by Team Velora</span>
        </div>
      </div>

    </footer>
  );
}
