"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, MessageCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden w-full">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] max-w-[1000px] pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#25d366]/20 blur-[120px] mix-blend-multiply opacity-80" />
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#128c7e]/20 blur-[100px] opacity-70" />
        <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#075e54]/10 blur-[100px] opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#dcf8c6] border border-[#25d366]/30 text-[#075e54] text-sm font-medium mb-4 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#25d366] animate-pulse" />
            V1.0 is now live!
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1]"
          >
            AI Powered <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#075e54] via-[#128c7e] to-[#25d366] relative inline-block">
              Nutrition Tracking
              {/* Decorative underline */}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#25d366]/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>{" "}
            Through WhatsApp
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed"
          >
            FIT KAKA is an AI-powered WhatsApp bot that allows users to track meals effortlessly. Just send a food photo or text message, and we'll calculate your calories, macros, and fitness progress instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white font-semibold text-lg shadow-lg shadow-[#25d366]/25 hover:shadow-[#25d366]/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border border-neutral-200 text-neutral-700 font-semibold text-lg hover:bg-neutral-50 transition-colors shadow-sm"
            >
              <Play className="size-5 text-neutral-500" />
              View Demo
            </Link>
          </motion.div>
        </div>

        {/* Phone Mockup Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.4 }}
          className="relative mt-20 md:mt-32 max-w-5xl mx-auto"
        >
          <div className="relative rounded-[2rem] md:rounded-[3rem] p-2 bg-white/40 shadow-2xl shadow-neutral-900/10 backdrop-blur-xl border border-white/40 ring-1 ring-neutral-900/5">
            <div className="rounded-[1.75rem] md:rounded-[2.75rem] overflow-hidden bg-neutral-100 flex items-center justify-center relative aspect-[16/9] md:aspect-[21/9]">
              {/* WhatsApp Interface Mockup */}
              <div className="absolute inset-x-0 bottom-0 top-12 bg-[#ece5dd] flex justify-center">
                 {/* Decorative mock phone frame */}
                 <div className="w-[320px] h-[580px] mt-4 md:mt-12 bg-black rounded-[2.5rem] shadow-2xl border-8 border-black overflow-hidden flex flex-col relative z-10 transition-transform hover:-translate-y-2 duration-500">
                    {/* Header */}
                    <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 relative z-10 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                        FK
                      </div>
                      <div>
                        <div className="font-semibold">FIT KAKA Bot</div>
                        <div className="text-[10px] opacity-80">online</div>
                      </div>
                    </div>
                    {/* Chat Area */}
                    <div className="flex-1 bg-[#ece5dd] p-4 flex flex-col gap-4 overflow-hidden relative">
                       {/* Background pattern simulate */}
                       <div className="absolute inset-0 opacity-5" style={{backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/r_QNEW3s1P_.png')"}} />
                       
                       <div className="flex flex-col gap-1 items-end relative z-10">
                         <div className="bg-[#dcf8c6] text-[#111b21] px-3 py-1.5 rounded-lg rounded-tr-none shadow-sm max-w-[85%] text-sm">
                           I just ate 2 eggs and a slice of whole wheat toast.
                         </div>
                         <span className="text-[10px] text-neutral-500 mr-1">10:42 AM</span>
                       </div>

                       <div className="flex flex-col gap-1 items-start relative z-10">
                         <div className="bg-white text-[#111b21] px-3 py-2 rounded-lg rounded-tl-none shadow-sm max-w-[90%] text-sm">
                           <div className="font-semibold text-[#128c7e] mb-1 flex items-center gap-1.5"><CheckCircle2 className="size-3"/> Meal Logged!</div>
                           <p className="mb-2"><strong>2 Eggs & 1 Wheat Toast</strong></p>
                           <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                             <div className="bg-[#dcf8c6] px-2 py-1 rounded text-[#075e54] font-medium">Calories: ~220</div>
                             <div className="bg-[#dcf8c6] px-2 py-1 rounded text-[#075e54] font-medium">Protein: 16g</div>
                             <div className="bg-[#dcf8c6] px-2 py-1 rounded text-[#075e54] font-medium">Carbs: 15g</div>
                             <div className="bg-[#dcf8c6] px-2 py-1 rounded text-[#075e54] font-medium">Fat: 11g</div>
                           </div>
                           <p className="text-neutral-500 text-xs italic">You are currently at 1650/2200 kcal for today.</p>
                         </div>
                         <span className="text-[10px] text-neutral-500 ml-1">10:42 AM</span>
                       </div>
                    </div>
                    {/* Input Area */}
                    <div className="bg-[#f0f2f5] px-3 py-2 flex items-center gap-2 relative z-10">
                       <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-neutral-400 shadow-sm">
                         Type a message...
                       </div>
                       <div className="w-10 h-10 rounded-full bg-[#128c7e] items-center justify-center flex text-white shadow-sm">
                          <MessageCircle className="size-5 fill-current" />
                       </div>
                    </div>
                 </div>
              </div>

               {/* Add decorative floating elements behind phone */}
               <motion.div animate={{y: [0, -10, 0]}} transition={{repeat: Infinity, duration: 4, ease: "easeInOut"}} className="absolute top-[20%] right-[15%] hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/50">
                  <div className="w-10 h-10 rounded-full bg-[#dcf8c6] flex items-center justify-center text-[#128c7e] text-lg">🥗</div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Salad Analyzed</div>
                    <div className="text-xs text-neutral-500">+12g Protein</div>
                  </div>
               </motion.div>
               <motion.div animate={{y: [0, 15, 0]}} transition={{repeat: Infinity, duration: 5, ease: "easeInOut"}} className="absolute bottom-[25%] left-[15%] hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/50">
                  <div className="w-10 h-10 rounded-full bg-[#dcf8c6] flex items-center justify-center text-[#128c7e] text-lg">🔥</div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">1,650 kcal</div>
                    <div className="text-xs text-neutral-500">Remaining: 550 kcal</div>
                  </div>
               </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
