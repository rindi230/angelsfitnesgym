import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Target, Users, Award, Heart, Star, Calendar, Clock, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export const WhoWeAre = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: imageRef, isVisible: imageVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.2 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10% left-5% w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20% right-10% w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-120 h-120 bg-purple-500/3 rounded-full blur-4xl animate-pulse-slower"></div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-red-500/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-20 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-8 py-3 rounded-2xl mb-8 shadow-2xl shadow-red-500/25 hover:shadow-3xl hover:shadow-red-500/40 transition-all duration-500 hover:scale-105">
            <Star className="w-5 h-5 mr-2 fill-current" />
            <span className="text-sm font-semibold tracking-wide">PREMIUM FITNESS EXPERIENCE</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Kush jemi ne
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Ne <span className="text-red-600 font-semibold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Angels Fitness Gym</span>, 
            krijojmë një <span className="text-gray-800 font-medium">komunitet transformues</span> ku shëndeti dhe suksesi personal janë prioriteti ynë kryesor.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Enhanced Image Section with 3D Effects */}
          <div 
            ref={imageRef as React.RefObject<HTMLDivElement>}
            className={`relative group transition-all duration-1000 ${
              imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Main 3D Container */}
            <div className="relative transform-style-3d perspective-1000">
              <div className={`relative rounded-4xl overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-102 group-hover:shadow-3xl ${
                isHovered ? 'rotate-y-2 rotate-x-1' : ''
              }`}>
                <img
                  src={`${import.meta.env.BASE_URL}downloads/angels logo.jpg`}
                  alt="Angels Fitness Gym - Premium Fitness Center"
                  className="w-full h-96 object-cover transform transition-all duration-700 group-hover:scale-110"
                />
                
                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-all duration-700"></div>

                {/* Animated floating elements */}
                <div className="absolute top-8 left-8 transform -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                  <div className="bg-gradient-to-br from-red-600 to-red-800 p-4 rounded-2xl shadow-2xl backdrop-blur-sm">
                    <span className="text-white font-bold text-sm tracking-tight">ANGELS<br/>FITNESS</span>
                  </div>
                </div>

                <div className="absolute top-8 right-8 transform rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500">
                  <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">500+</div>
                      <div className="text-xs text-gray-600 font-medium">Anëtarë</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 transform -rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-3 rounded-2xl shadow-xl">
                    <span className="font-bold text-sm">PREMIUM</span>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 transform rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500">
                  <div className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-lg">
                    <span className="font-medium text-sm">24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Surrounding glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-r from-red-500/20 via-orange-500/15 to-red-500/20 rounded-4xl opacity-0 group-hover:opacity-100 blur-3xl transition-all duration-1000 -z-10"></div>
          </div>

          {/* Enhanced Content Section */}
          <div 
            ref={contentRef as React.RefObject<HTMLDivElement>}
            className={`space-y-10 transition-all duration-1000 ${
              contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Mission Card */}
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="flex items-start mb-6">
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 rounded-2xl mr-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
                    Misioni ynë
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg font-light">
                    Ne besojmë se fitnesi është një udhëtim transformues që shndërron jo vetëm trupin, 
                    por edhe mendjen dhe shpirtin. Me pajisjet tona të teknologjisë së fundit dhe 
                    trajnerët ekspertë, ne krijojmë një mjedis ku çdo anëtar arrin potencialin e tyre maksimal.
                  </p>
                </div>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Heart, title: "Ekselencë", desc: "Cilësi maksimale në çdo detaj" },
                { icon: Users, title: "Komunitet", desc: "Mbështetje dhe motivim i vazhdueshëm" },
                { icon: Activity, title: "Innovacion", desc: "Teknologji e fundit fitness" },
                { icon: Award, title: "Ekspertizë", desc: "Trajnerë të certifikuar profesional" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-red-600 to-red-700 p-3 rounded-xl mr-4 transform group-hover:scale-110 transition-all duration-500">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { icon: Users, value: "500+", label: "Anëtarë" },
                { icon: Calendar, value: "5+", label: "Vite" },
                { icon: Clock, value: "24/7", label: "I hapur" },
                { icon: Award, value: "100%", label: "Kënaqësi" }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-md p-4 rounded-2xl text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
                >
                  <stat.icon className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-2 { transform: rotateY(2deg); }
        .rotate-x-1 { transform: rotateX(1deg); }
        .scale-102 { transform: scale(1.02); }
        .rounded-4xl { border-radius: 2.5rem; }
      `}</style>
    </section>
  );
};