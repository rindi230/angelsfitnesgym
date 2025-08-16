import { useState } from "react";
import { ArrowRight, Play, Star, Users, Award } from "lucide-react";

export const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartJourney = () => {
    // Scroll to classes section for immediate action
    scrollToSection('classes');
  };

  const handleWatchVideo = () => {
    setShowVideo(true);
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=2070&q=80')`
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-red-600/20 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Stats floating elements */}
      <div className="absolute top-32 right-20 bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-fade-in hidden lg:block">
        <div className="flex items-center space-x-2 text-white">
          <Users className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-2xl font-bold">500+</p>
            <p className="text-sm opacity-80">Active Members</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-32 left-20 bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-fade-in delay-500 hidden lg:block">
        <div className="flex items-center space-x-2 text-white">
          <Award className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-2xl font-bold">5 Years</p>
            <p className="text-sm opacity-80">Excellence</p>
          </div>
        </div>
      </div>

      <div className="text-center text-white animate-fade-in relative z-10 max-w-4xl mx-auto px-4">
        {/* Rating display */}
        <div className="flex items-center justify-center mb-6 animate-scale-in">
          <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-sm font-medium">4.4/5 Rating</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          TRANSFORMONI
          <br />
          <span className="text-red-500 relative">
            TRUPIN & MENDJEN 
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-scale-in delay-1000"></div>
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto px-4 font-light">
          Mire se erdhet ne Angels Fitness Gym - Aty ku Kampjonet jane krijuar
        </p>
        
        <p className="text-lg mb-12 max-w-xl mx-auto px-4 opacity-90">
          Bëhuni pjesë në komunitetin tonë të fitnesit dhe zbuloni versionin tuaj më të fuqishëm me mentorë të përvojës dhe ekipin tonë të mëtejshëm.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={handleStartJourney}
            className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
          >
            <span>Filloni Rrugën Tuaj</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={handleWatchVideo}
            className="group border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-2"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Shikoni palestrën tonë</span>
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => scrollToSection('tools')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            Kalkuloni BMI
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            Mesoni me shume
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
          >
           Rrjetet tona
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-6xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-16 right-0 text-white hover:text-red-500 text-3xl font-bold bg-red-600 hover:bg-red-700 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-lg z-10"
            >
              ✕
            </button>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                width="100%"
                height="100%"
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                <source src="/angels2/gym-photos/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
