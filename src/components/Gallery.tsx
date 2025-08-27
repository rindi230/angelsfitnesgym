import { useState } from "react";
import { X } from "lucide-react";

export const Gallery = () =>{ 
  const [selectedImage] = useState<string | null>(null);

  // Replace these with your actual gym photos
  // Place your downloaded Google Maps photos in the public/gym-photos/ folder
  const base = import.meta.env.BASE_URL;
  const images = [
    {
      src: `${base}downloads/palestra1.jpg`,
      alt: "Enhanced gym photo uploaded by user"
    },
          {
        src: `${base}downloads/palestra2.jpg`, 
        alt: "Weight training area"
      },
      {
        src: `${base}downloads/palestra3.jpg`,
        alt: "Cardio equipment section"
      },
    {
      src: `${base}downloads/palestra4.jpg`,
      alt: "Gym equipment and training area"
    },
    {
      src: `${base}downloads/palestra5.jpg`,
      alt: "Gym area and equipment"
    },
    {
      src: `${base}downloads/palestra6.jpg`,
      alt: "Members training area"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Galeria e palestres</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Eksploroni mjediset dhe komunitetin tonë në foto
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-60 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 