
import { Instagram, Facebook } from "lucide-react";

export const Contact = () => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/angelsfitnessgym_/?hl=en",
      color: "hover:text-pink-500"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://web.facebook.com/profile.php?id=100054706813134",
      color: "hover:text-blue-500"
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
      color: "hover:text-black"
    },
    {
      name: "Gmail",
      icon: () => (
        <svg className="w-8 h-8 group" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="8" fill="black"/>
          <path d="M37 14H11c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h26c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2Zm0 2v2.34l-13 8.16-13-8.16V16h26Zm-26 16V19.12l12.34 7.75c.41.26.91.26 1.32 0L37 19.12V32H11Z" fill="white" className="transition-colors duration-200 group-hover:fill-red-500"/>
        </svg>
      ),
      url: "mailto:angelsfitnessgym@gmail.com",
      color: "hover:text-red-500"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Na kontaktoni</h2>
          <p className="text-xl text-gray-600">
            Na ndiqni ne rrjetet tona sociale per me te rejat rreth stafit, palestres dhe ofertave te ardshme
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover-scale ${link.color}`}
                >
                  <IconComponent />
                  <span className="mt-2 text-sm font-semibold text-gray-700">{link.name}</span>
                </a>
              );
            })}
          </div>

          <div className="mt-12 bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Vizito Palestren</h3>
            <div className="space-y-8 w-full">
              {/* Address and contact info */}
              <div className="space-y-2 text-gray-600 text-center">
                <p><span className="font-semibold">Address:</span> Rruga e Kavajes, Pallati Orion kati 2</p>
                <p><span className="font-semibold">Phone:</span> (355) 68 567 223</p>
                <p><span className="font-semibold">Email:</span> angelsfitnessgym@gmail.com</p>
                <p><span className="font-semibold">Oret:</span> E hene-E shtune 5:00 AM - 12:00 PM | Sun 6:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        {/* Full-width map below */}
        <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 mt-8 h-[400px] md:h-[500px] rounded-none overflow-hidden shadow-lg border-t border-b border-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.3278610568736!2d19.792846975355054!3d41.32348349995773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135031ad66910e23%3A0xc2f355740d2bb13!2sAngel's%20Fitness%20Gym!5e0!3m2!1sen!2s!4v1752170487939!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Angel's Fitness Gym Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};
