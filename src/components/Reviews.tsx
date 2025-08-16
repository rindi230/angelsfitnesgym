
export const Reviews = () => {
  const reviews = [
    {
      name: "Rory O Brien",
      rating: 5,
      review: "Perhaps the best gym I've ever been to. Loads of machines that are all in top condition and a solid free weights area too.",
      image: "/angels2/gym-photos/rory.png"
    },
    {
      name: "Vojna Ngjeqari",
      rating: 5,
      review: "Amazing. All the possible Equipment. I completed my physiotherapy here. Great, friendly staff. Thank You to Genti and the staff. Shume falemnderit!",
      image: "/angels2/gym-photos/vojna.png"
    },
    {
      name: "Luis Rozario",
      rating: 5,
      review: "Very good equipment, they have everything.Paid 600 LEK for a day.They accept card.",
      image: "/angels2/gym-photos/luis.png"
    },
    {
      name: "Adriano Antimi",
      rating: 5,
      review: "Great gym. Probably the best in Tirana for trainers and equipment. There are “fancy” alternatives with better showers and changing rooms, but I still prefer Angel’s Fitness in the area.",
      image: "/angels2/gym-photos/adriano.png"
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Cfare thone pjestaret tane</h2>
          <p className="text-xl text-gray-600">
            Historite e thena nga njerezit qe kane transformuar jeten e tyre
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover-scale transition-all duration-300 animate-fade-in"
            >
              <div className="flex items-center mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{review.name}</h3>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed italic">"{review.review}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
