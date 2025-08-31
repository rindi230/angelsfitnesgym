import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Gallery = () => { 
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: galleryRef, isVisible: galleryVisible } = useScrollAnimation({ threshold: 0.2 });

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

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Calculate which images to show (current, previous, next)
  const getVisibleImages = () => {
    const visibleImages = [];
    const totalImages = images.length;
    
    // Always show current image
    visibleImages.push(currentIndex);
    
    // Show previous image (if exists)
    if (totalImages > 1) {
      const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
      visibleImages.unshift(prevIndex);
    }
    
    // Show next image (if exists)
    if (totalImages > 2) {
      const nextIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
      visibleImages.push(nextIndex);
    }
    
    return visibleImages;
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Galeria e palestres</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Eksploroni mjediset dhe komunitetin tonë në foto
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          ref={galleryRef as React.RefObject<HTMLDivElement>}
          className={`relative transition-all duration-1000 ${
            galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center space-x-4 md:space-x-6">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-300 z-10"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Images Container */}
            <div className="flex items-center justify-center space-x-4 md:space-x-6">
              {getVisibleImages().map((imageIndex, position) => {
                const isCurrent = imageIndex === currentIndex;
                const isPrevious = position === 0 && getVisibleImages().length > 1;
                const isNext = position === 2 && getVisibleImages().length > 1;
                
                return (
                  <div
                    key={imageIndex}
                    className={`relative transition-all duration-500 ease-in-out ${
                      isCurrent 
                        ? 'z-20 transform scale-105' 
                        : 'z-10 opacity-60 transform scale-95'
                    } ${isPrevious ? '-rotate-2' : ''} ${isNext ? 'rotate-2' : ''}`}
                    onClick={() => setCurrentIndex(imageIndex)}
                  >
                    <img
                      src={images[imageIndex].src}
                      alt={images[imageIndex].alt}
                      className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-lg cursor-pointer border-4 border-white"
                    />
                    
                    {/* Highlight current image */}
                    {isCurrent && (
                      <div className="absolute inset-0 border-2 border-red-500 rounded-xl pointer-events-none"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-300 z-10"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Image Counter and Navigation Dots */}
          <div className="flex flex-col items-center mt-8 space-y-4">
            <div className="text-gray-700 font-medium">
              {currentIndex + 1} / {images.length}
            </div>
            
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-red-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};