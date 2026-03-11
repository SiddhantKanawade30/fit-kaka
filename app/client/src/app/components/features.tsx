"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Camera, 
  MessageCircle, 
  PieChart, 
  Activity,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    title: "AI Food Recognition",
    description: "Users send a photo of their meal and the AI identifies the food items and portions automatically with incredible accuracy.",
    icon: Camera,
    className: "md:col-span-2 md:row-span-2",
    gradient: "from-[#128c7e]/10 to-[#dcf8c6]/50",
    iconColor: "text-[#128c7e]"
  },
  {
    title: "WhatsApp Based Logging",
    description: "Log meals directly from WhatsApp without installing any new apps.",
    icon: MessageCircle,
    className: "md:col-span-1 md:row-span-1",
    gradient: "from-[#128c7e]/20 to-[#25d366]/20",
    iconColor: "text-[#25d366]"
  },
  {
    title: "Nutrition Analytics",
    description: "Track calories, protein, carbs, and fat automatically logged into your dashboard.",
    icon: PieChart,
    className: "md:col-span-1 md:row-span-1",
    gradient: "from-[#dcf8c6]/50 to-[#128c7e]/10",
    iconColor: "text-[#075e54]"
  },
  {
    title: "Daily Health Insights",
    description: "Users receive insights on how their meals align with fitness goals step by step.",
    icon: Activity,
    className: "md:col-span-2 md:row-span-1",
    gradient: "from-[#25d366]/10 to-[#dcf8c6]/50",
    iconColor: "text-[#128c7e]"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-transparent overflow-hidden relative">
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-[#25d366]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900"
          >
            Features you'll <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#075e54] to-[#25d366]">Love</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-600"
          >
            Powerful AI features designed to simplify nutrition tracking and help you achieve your fitness goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-6 auto-rows-[minmax(0,1fr)]">
          {features.map((entry, index) => {
            const Icon = entry.icon;
            const isLarge = entry.className.includes("md:row-span-2");

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-white hover:border-[#25d366]/50 transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.1)] p-8 ${entry.className}`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${entry.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-neutral-100 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`size-7 ${entry.iconColor}`} />
                  </div>
                  
                  <h3 className={`font-bold text-neutral-900 mb-3 ${isLarge ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'}`}>
                    {entry.title}
                  </h3>
                  
                  <p className={`text-neutral-600 leading-relaxed ${isLarge ? 'text-lg max-w-md' : 'text-base'}`}>
                    {entry.description}
                  </p>

                  {/* For the large card, add an extra graphic or visual element */}
                  {isLarge && (
                    <div className="mt-8 flex-1 rounded-xl bg-[#dcf8c6]/50 border border-[#25d366]/30 overflow-hidden relative group-hover:-translate-y-2 transition-transform duration-500 flex items-center justify-center min-h-[150px]">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                      <div className="relative bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm border border-[#25d366]/40 flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-200 rounded-lg overflow-hidden relative">
                           {/* Placeholder for food image */}
                           <div className="absolute inset-0 bg-gradient-to-tr from-[#128c7e] to-[#25d366]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-sm">Grilled Salmon Salad</span>
                          <span className="text-xs text-neutral-500">450 kcal • 40g Protein</span>
                        </div>
                        <CheckCircle2 className="size-5 text-[#25d366] ml-2" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
