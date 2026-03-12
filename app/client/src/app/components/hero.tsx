export default function Hero() {
  return (
    <div className="w-full bg-white/50">
    <section className="relative w-full mx-auto overflow-hidden bg-white/50 pb-0 pt-20 rounded-b-[3rem]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/100 via-green-50/50 to-green-400/50 pointer-events-none z-0" />

      {/* Concentric Rings (Decorative) */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-white/60 rounded-full pointer-events-none z-0" />
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border-2 border-white/40 rounded-full pointer-events-none z-0" />
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1300px] h-[1300px] border-3 border-white/30 rounded-full pointer-events-none z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Headline */}
        <h1 className="text-5xl pt-30 md:text-6xl lg:text-[64px] font-bold text-gray-900 leading-[1.1] tracking-tight">
          
          Snap Your Food,
          <br /> Know Your <span className="text-green-600">Nutrition</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-[15px] md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Send a photo or message of your food on WhatsApp and instantly get calories, protein, carbs, and fats powered by AI.
        </p>

        {/* CTA Button */}
        <button className="mt-10 px-8 py-3.5 bg-gradient-to-b from-[#4a4a4a] to-[#222222] border border-[#5a5a5a] text-white text-sm font-semibold rounded-lg shadow-lg hover:from-[#3a3a3a] hover:to-[#111111] transition-all duration-200">
          Get Started
        </button>

        {/* Phone Mockup */}
        <div className="mt-16 relative w-[300px] h-[380px] bg-white border-[10px] border-black rounded-t-[2.5rem] overflow-hidden shadow-2xl flex flex-col mx-auto translate-y-4">
          
          {/* Dynamic Island / Camera Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20 flex justify-end items-center px-3">
             <div className="w-2 h-2 rounded-full bg-white/20"></div>
          </div>

          {/* Status Bar */}
          <div className="flex justify-between items-center px-5 pt-3 pb-2 z-10 bg-white">
            <span className="text-[10px] font-bold">9:41</span>
            <div className="flex gap-1 items-center">
              {/* Cellular Icon */}
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M2,22h20V2L2,22z"/></svg>
              {/* Wifi Icon */}
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3C7.79,3 3.7,4.41 0.38,6.9L12,21.05l11.62-14.15C20.3,4.41 16.21,3 12,3z"/></svg>
              {/* Battery Icon */}
              <div className="w-5 h-2.5 border border-black rounded-[3px] p-[1px] relative">
                <div className="bg-black w-[80%] h-full rounded-[1px]"></div>
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1 bg-black rounded-r-sm"></div>
              </div>
            </div>
          </div>

          {/* App Header */}
          <div className="flex justify-between items-center px-4 py-2 bg-white">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                <div className="w-3 h-0.5 bg-gray-400 rounded-full"></div>
              </div>
              <span className="font-semibold text-sm">Schedule</span>
            </div>
            <span className="text-xs text-gray-500 font-medium cursor-pointer">See all {'>'}</span>
          </div>

          {/* App Content */}
          <div className="flex-1 bg-white px-4 pt-2 overflow-hidden flex flex-col gap-3">
            
            {/* Card 1 */}
            <div className="bg-[#FFF6F2] p-4 rounded-2xl w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[13px] font-semibold text-gray-800">Meeting with Kishore</h3>
                  <p className="text-[10px] text-gray-500 mt-1">8:00 AM - 9:00 AM</p>
                </div>
                <span className="text-gray-400 text-lg leading-none -mt-1">...</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-[#FFF6F2] z-20"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-[#FFF6F2] z-10"></div>
                  <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-[#FFF6F2] z-0 flex items-center justify-center text-[8px] font-bold text-gray-600">2+</div>
                </div>
                <span className="px-2.5 py-1 bg-[#E8D4CC] text-[#8C6454] text-[9px] font-bold rounded-full">Marketing</span>
              </div>
              <p className="text-[9px] text-gray-400 mt-2 flex items-center gap-1">
                on Gmeet
              </p>
            </div>

            {/* Card 2 (Partially visible) */}
            <div className="bg-[#EAF3FF] p-4 rounded-2xl w-full flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[13px] font-semibold text-gray-800">Meeting with Manu</h3>
                  <p className="text-[10px] text-gray-500 mt-1">8:00 AM - 9:00 AM</p>
                </div>
                <span className="text-gray-400 text-lg leading-none -mt-1">...</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex -space-x-1.5">
                   <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-[#EAF3FF] z-20"></div>
                   <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-[#EAF3FF] z-10"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
    </div>
  );
}