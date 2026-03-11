"use client";

import React from "react";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Features from "./components/features";
import Footer from "./components/footer";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#ece5dd] font-sans text-neutral-900 selection:bg-[#dcf8c6]">
      <Navbar />

      <main>
        <Hero />

        {/* Why FIT KAKA Works Section */}
        <section id="highlights" className="py-24 border-y border-neutral-100 bg-white/50 backdrop-blur-xl relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-6">
                Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#075e54] to-[#25d366]">FIT KAKA</span> Works
              </h2>
              <p className="text-lg text-neutral-600">
                FIT KAKA simplifies nutrition tracking by bringing AI-powered analysis directly to WhatsApp. Instead of manual logging, users simply send a message or photo of their meal. The AI instantly identifies food items, estimates calories and nutrients, and logs the data automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "WhatsApp Logging", desc: "Log meals by sending a photo or text message in WhatsApp" },
                { title: "AI Detection", desc: "AI automatically detects food items and estimates calories" },
                { title: "Instant Insights", desc: "Get quick insights about daily nutrition intake" },
                { title: "Zero Apps", desc: "No need to install complicated health tracking apps" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-neutral-100 hover:border-[#25d366]/30 hover:shadow-[0_8px_30px_rgba(37,211,102,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col items-start"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#dcf8c6]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#dcf8c6] flex items-center justify-center text-[#075e54] font-bold mb-4 border border-[#128c7e]/20">
                      {idx + 1}
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        
        <Features />



        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-neutral-950">
            {/* Dark gradient background */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#075e54]/40 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#25d366]/20 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white"
            >
              Start Tracking Your Nutrition <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#075e54] to-[#25d366]">Smarter</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-neutral-400 font-medium"
            >
              No apps required. Just message the bot.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="pt-8"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white text-neutral-900 font-bold text-xl hover:bg-neutral-100 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Get Started with WhatsApp
                <ArrowRight className="size-6 text-[#25d366]" />
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
