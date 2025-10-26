import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Room, Vehicle } from '../lib/supabase';
import RoomCard from '../components/Accommodation/RoomCard';
import VehicleCard from '../components/Transport/VehicleCard';

export default function Home() {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Sanduni Perera',
      role: 'Engineering Student',
      content: 'CampusStay made finding accommodation near Sabaragamuwa University so easy! The rooms are verified and affordable. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Nuwan Silva',
      role: 'Postgraduate Student',
      content: 'Amazing platform! I found a great apartment close to campus within days. The booking process was smooth and the owner was very responsive.',
      rating: 5,
    },
    {
      name: 'Chamika Fernando',
      role: 'Lecturer',
      content: 'The transport booking feature is fantastic. I rent a car every weekend to explore the area. Very convenient and reliable service.',
      rating: 5,
    },
  ];

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_available', true)
        .limit(3);

      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('*')
        .eq('is_available', true)
        .limit(3);

      setFeaturedRooms(rooms || []);
      setFeaturedVehicles(vehicles || []);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to CampusStay
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-50">
              Your trusted platform for accommodation and transport near Sabaragamuwa University
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/rooms')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
              >
                Find Accommodation
              </button>
              <button
                onClick={() => navigate('/vehicles')}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg"
              >
                Rent a Vehicle
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Listings</h3>
              <p className="text-gray-600">
                All accommodations and vehicles are verified for your safety and peace of mind.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Affordable Prices</h3>
              <p className="text-gray-600">
                Student-friendly pricing with options for every budget and requirement.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Booking</h3>
              <p className="text-gray-600">
                Simple and fast booking process with instant confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Accommodations</h2>
                  <p className="text-gray-600">Discover the best rooms near campus</p>
                </div>
                <button
                  onClick={() => navigate('/rooms')}
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
                >
                  View All
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Vehicles</h2>
                  <p className="text-gray-600">Rent a vehicle for your convenience</p>
                </div>
                <button
                  onClick={() => navigate('/vehicles')}
                  className="text-green-600 hover:text-green-700 font-semibold flex items-center"
                >
                  View All
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>

          <div className="relative bg-white text-gray-900 rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <p className="text-lg text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </p>

              <div>
                <p className="font-semibold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-sm text-gray-600">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Stay?
            </h2>
            <p className="text-xl mb-8 text-blue-50">
              Join hundreds of students and staff who trust CampusStay
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
