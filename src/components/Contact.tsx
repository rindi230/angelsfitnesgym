import { Instagram, Facebook, MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useRef } from "react";

export const Contact = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: socialRef, isVisible: socialVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: infoRef, isVisible: infoVisible } = useScrollAnimation({ threshold: 0.3 });
  const mapRef = useRef<HTMLDivElement>(null);
  
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/angelsfitnessgym_/?hl=en",
      color: "hover:text-pink-600",
      bgColor: "hover:bg-pink-50"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://web.facebook.com/profile.php?id=100054706813134",
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-50"
    },
    {
      name: "Threads",
      icon: () => (
        <svg className="w-8 h-8" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="50" height="50" rx="25" fill="black"/>
          <path d="M25 13c5.5 0 10 3.5 10 8.5 0 3.5-2.5 6-6.5 6.5 3.5 1 5 3 5 5.5 0 3-2.5 5.5-8.5 5.5-6 0-8.5-2.5-8.5-5.5 0-2.5 1.5-4.5 5-5.5C17.5 27.5 15 25 15 21.5 15 16.5 19.5 13 25 13Zm0 2c-4.1 0-7 2.6-7 6.5 0 2.7 2.1 4.5 6.5 5.5l.5.1.5-.1c4.4-1 6.5-2.8 6.5-5.5C32 17.6 29.1 15 25 15Zm0 13c-4.7 0-7 1.7-7 3.5 0 1.7 2.3 3.5 7 3.5s7-1.8 7-3.5c0-1.8-2.3-3.5-7-3.5Z" fill="white"/>
        </svg>
      ),
      url: "https://www.threads.com/@angelsfitnessgym_?xmt=AQF0Zs9FiUAtjvQbMfQyyEsF3Jx4JNB5pA5hwE1h8Y_TgX8",
      color: "hover:text-gray-800",
      bgColor: "hover:bg-gray-100"
    },
    {
      name: "Gmail",
      icon: () => (
        <svg className="w-8 h-8 group" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="8" fill="black"/>
          <path d="M37 14H11c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h26c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2Zm0 2v2.34l-13 8.16-13-8.16V16h26Zm-26 16V19.12l12.34 7.75c.41.26.91.26 1.32 0L37 19.12V32H11Z" fill="white" className="transition-colors duration-200 group-hover:fill-red-600"/>
        </svg>
      ),
      url: "mailto:angelsfitnessgym@gmail.com",
      color: "hover:text-red-600",
      bgColor: "hover:bg-red-50"
    }
  ];

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Na kontaktoni</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Na ndiqni ne rrjetet tona sociale per me te rejat rreth stafit, palestres dhe ofertave te ardshme
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div 
            ref={socialRef as React.RefObject<HTMLDivElement>}
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-1000 ${
              socialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift ${link.color} ${link.bgColor} border border-gray-200/60 animate-delay-${index * 200} group`}
                >
                  <div className="p-3 bg-gray-100 rounded-full mb-3 transition-all duration-300 group-hover:scale-110">
                    <IconComponent />
                  </div>
                  <span className="mt-2 text-sm font-semibold text-gray-700 group-hover:text-current transition-colors duration-300">{link.name}</span>
                </a>
              );
            })}
          </div>

          <div 
            ref={infoRef as React.RefObject<HTMLDivElement>}
            className={`bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100 transition-all duration-1000 ${
              infoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="p-8 md:p-12">
              {/* Header with elegant gradient */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 mb-8 text-white text-center">
                <h3 className="text-2xl md:text-3xl font-bold flex items-center justify-center">
                  <MapPin className="w-8 h-8 mr-3" />
                  Vizito Palestren
                </h3>
                <p className="text-red-100 mt-2">Na vizitoni për një eksperiencë të paharruar fitnesi</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-gray-900">Adresa</h4>
                      <p className="text-gray-600">Rruga e Kavajes, Pallati Orion kati 2</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                      <Phone className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-gray-900">Telefoni</h4>
                      <p className="text-gray-600">(355) 68 567 223</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                      <Mail className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-gray-900">Email</h4>
                      <p className="text-gray-600">angelsfitnessgym@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                      <Clock className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1 text-gray-900">Orari i Hapjes</h4>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                          <span>E Hënë - E Shtunë:</span>
                          <span className="font-semibold text-red-600">5:00 AM - 12:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>E Dielë:</span>
                          <span className="font-semibold text-red-600">6:00 AM - 10:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action Button */}
                  <div className="pt-4 text-center">
                    <button
                      onClick={scrollToMap}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Navigation className="w-5 h-5 mr-2" />
                      Shiko rrugën në hartë
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width map below */}
        <div 
          ref={mapRef}
          className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 mt-12 h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-300 hover:shadow-3xl hover:border-red-100"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.3278610568736!2d19.792846975355054!3d41.32348349995773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135031ad66910e23%3A0xc2f355740d2bb13!2sAngel's%20Fitness%20Gym!5e0!3m2!1sen!2s!4v1752170487939!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Angel's Fitness Gym Location"
            className="rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};