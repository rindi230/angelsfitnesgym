import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Staff = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: staffRef, isVisible: staffVisible } = useScrollAnimation({ threshold: 0.2 });

  const trainers = [
    {
      name: "Eurola",
      specialty: "Personal Training & Strength",
      image: `${import.meta.env.BASE_URL}downloads/eurola.jpg`,
      bio: "Former competitive athlete with expertise in high-intensity workouts and functional fitness."
    },
    {
      name: "Elton",
      specialty: "CrossFit & HIIT",
      image: `${import.meta.env.BASE_URL}downloads/elton.jpg`,
      bio: "5+ years experience, certified personal trainer specializing in strength training and body transformation."
    },
    {
      name: "Matilda",
      specialty: "Yoga & Pilates",
      image: `${import.meta.env.BASE_URL}downloads/matilda.jpg`,
      bio: "Certified yoga instructor with 8 years of experience in mindfulness and flexibility training."
    },
    {
      name: "Arber",
      specialty: "Martial Arts & Karate",
      image: `${import.meta.env.BASE_URL}downloads/arber.jpg`,
      bio: "Black belt instructor with 15 years of martial arts experience and competition background."
    }
  ];

  return (
    <section id="staff" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Njifni stafin tone ekspert</h2>
          <p className="text-xl text-gray-600">
          Trajnerët tanë të çertifikuar janë këtu për t'ju ndihmuar të arrini qëllimet tuaja të fitnesit
          </p>
        </div>

        <div 
          ref={staffRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 ${
            staffVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover-lift transition-all duration-500 animate-delay-${index * 200}`}
            >
              <img
                src={trainer.image}
                alt={trainer.name}
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{trainer.name}</h3>
                <p className="text-red-600 font-semibold mb-3">{trainer.specialty}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{trainer.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
