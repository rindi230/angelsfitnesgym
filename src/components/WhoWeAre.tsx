export const WhoWeAre = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Kush jemi ne</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ne Angels Fitness Gym, jemi më shumë se një palester - jemi një komunitet i dedikuar të transformoj jetën tuaj përmes fitnesit dhe shëndetit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in relative group">
            {/* Main image container with elegant effects */}
            <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_25px_50px_-15px_rgba(220,38,38,0.25)]">
              <img
                src="/angels2/downloads/angels logo.jpg"
                alt="Angels Fitness Gym Logo"
                className="w-full h-96 object-cover transition-all duration-500 group-hover:brightness-105 group-hover:contrast-110"
              />
              
              {/* Elegant gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Sophisticated branding elements */}
              <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 shadow-lg">
                <span className="text-white font-bold text-xs leading-tight text-center">ANGELS</span>
              </div>
              
              <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-500">
                <span className="text-red-600 font-bold text-sm"></span>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-500">
                <span className="font-semibold text-xs">PREMIUM</span>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-md group-hover:scale-105 transition-all duration-500">
                <span className="text-gray-800 font-medium text-xs">24/7</span>
              </div>
              
              {/* Subtle border accent */}
              <div className="absolute inset-0 rounded-2xl border-2 border-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Elegant glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/15 via-orange-500/10 to-red-500/15 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10"></div>
            
            {/* Subtle floating elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-red-400 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-orange-400 rounded-full opacity-80 animate-pulse delay-1000"></div>
            </div>
          </div>
          
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Misioni yne</h3>
              <p className="text-gray-600 leading-relaxed">
                Ne besojme se fitnesi nuk ka te bej vetem me rritjen e fizikut, por ndertimi i konfidences, disiplines, dhe nje rutine te shendetshme qe do te zgjasi perjete. Pajisjet tona të teknologjisë së fundit dhe trajnerët tanë ekspertë janë këtu për t'ju udhëhequr në çdo hap të rrugës.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Vlerat tona</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                  Ekselente ne cdo gje qe bejme
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                  Komunitet gjithëpërfshirës dhe mbështetës
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                  Qasje e personalizuar ndaj fitnesit
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                  Inovacion dhe përmirësim i vazhdueshëm
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
