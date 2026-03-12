export default function Hero() {
  return (
    <div className="w-full bg-white/50">
      <section className="relative w-full mx-auto overflow-hidden bg-white/50 pb-0 pt-20 rounded-b-[3rem]">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/100 via-green-50/50 to-green-700/50 pointer-events-none z-0" />

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
          <a 
            href="https://wa.me/15551495897?text=Hi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-10 inline-block px-8 py-3.5 bg-gradient-to-b from-[#4a4a4a] to-[#222222] border border-[#5a5a5a] text-white text-sm font-semibold rounded-lg shadow-lg hover:from-[#3a3a3a] hover:to-[#111111] transition-all duration-200"
          >
            Get Started
          </a>

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
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M2,22h20V2L2,22z" /></svg>
                {/* Wifi Icon */}
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3C7.79,3 3.7,4.41 0.38,6.9L12,21.05l11.62-14.15C20.3,4.41 16.21,3 12,3z" /></svg>
                {/* Battery Icon */}
                <div className="w-5 h-2.5 border border-black rounded-[3px] p-[1px] relative">
                  <div className="bg-black w-[80%] h-full rounded-[1px]"></div>
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1 bg-black rounded-r-sm"></div>
                </div>
              </div>
            </div>

            {/* App Header */}
            <div className="bg-[#075e54] text-white px-3 py-2 mt-1 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                  FK
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-xs leading-tight">FIT KAKA</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Video Icon */}
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" /></svg>
                {/* Phone Icon */}
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                {/* Menu Icon */}
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
              </div>
            </div>

            {/* App Content */}
            <div className="flex-1 bg-[#ece5dd] p-2.5 overflow-hidden flex flex-col gap-2 relative">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/r_QNEW3s1P_.png')" }} />

              {/* User Message 1 */}
              <div className="flex flex-col items-end w-full relative z-10">
                <div className="bg-[#dcf8c6] text-[#111b21] px-2.5 py-1.5 rounded-lg rounded-tr-none shadow-sm max-w-[80%] text-left text-[10px] leading-relaxed">
                  Hey Fit Kaka, I just ate 2 eggs and 1 slice of bread.
                </div>
                <span className="text-[7px] text-gray-500 mt-0.5 mr-1">9:41 AM</span>
              </div>

              {/* Bot Message 1 */}
              <div className="flex flex-col items-start w-full relative z-10">
                <div className="bg-white text-[#111b21] px-2.5 py-1.5 rounded-lg rounded-tl-none shadow-sm max-w-[80%] text-left text-[10px] leading-relaxed">
                  Nice! Here's your nutrition breakdown:
                  <br />
                  <br />
                  <span className="font-semibold text-[#075e54]">Calories: ~320 kcal</span>
                  <br />
                  Protein: 18g
                  <br />
                  Carbs: 28g
                  <br />
                  Fats: 12g
                </div>
                <span className="text-[7px] text-gray-500 mt-0.5 ml-1">9:41 AM</span>
              </div>

              {/* User Message 2 */}
              <div className="flex flex-col items-end relative z-10 mt-1">
                <div className="bg-[#dcf8c6] text-[#111b21] px-2.5 py-1.5 rounded-lg rounded-tr-none shadow-sm max-w-[80%] text-left text-[10px] leading-relaxed">
                  I also had a banana.
                </div>
                <span className="text-[7px] text-gray-500 mt-0.5 mr-1">9:42 AM</span>
              </div>

              
            </div>

            
          </div>
        </div>
      </section>
    </div>
  );
}