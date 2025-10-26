import { useState, useEffect } from 'react';
import { supabase, Vehicle } from '../lib/supabase';
import VehicleCard from '../components/Transport/VehicleCard';
import { useAuth } from '../contexts/AuthContext';

export default function VehicleListing() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    vehicleType: [] as string[],
    location: [] as string[],
    minPrice: 0,
    maxPrice: 50000,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const vehicleTypes = ['car', 'bike', 'van'];
  const locations = ['Belihuloya Town', 'Near University', 'Belihuloya Center', 'Balangoda Road'];

  useEffect(() => {
    fetchVehicles();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters, searchTerm]);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('item_id')
        .eq('user_id', user.id)
        .eq('item_type', 'vehicle');

      if (error) throw error;
      setFavorites(new Set(data?.map(f => f.item_id) || []));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleFavorite = async (vehicleId: string) => {
    if (!user) return;

    try {
      if (favorites.has(vehicleId)) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', vehicleId)
          .eq('item_type', 'vehicle');

        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(vehicleId);
          return newSet;
        });
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            item_id: vehicleId,
            item_type: 'vehicle',
          });

        setFavorites(prev => new Set(prev).add(vehicleId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.vehicleType.length > 0) {
      filtered = filtered.filter(vehicle => filters.vehicleType.includes(vehicle.vehicle_type));
    }

    if (filters.location.length > 0) {
      filtered = filtered.filter(vehicle => filters.location.includes(vehicle.location));
    }

    filtered = filtered.filter(
      vehicle => vehicle.rental_price_per_day >= filters.minPrice && vehicle.rental_price_per_day <= filters.maxPrice
    );

    setFilteredVehicles(filtered);
  };

  const handleCheckboxChange = (category: 'vehicleType' | 'location', value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Transport</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by brand, model, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {showFilters && (
            <div className="lg:w-64 bg-white p-6 rounded-lg shadow-md h-fit">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Vehicle Type</h4>
                {vehicleTypes.map(type => (
                  <label key={type} className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.vehicleType.includes(type)}
                      onChange={() => handleCheckboxChange('vehicleType', type)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                {locations.map(location => (
                  <label key={location} className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.location.includes(location)}
                      onChange={() => handleCheckboxChange('location', location)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-gray-700 text-sm">{location}</span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range (per day)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Min Price</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max Price</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                      placeholder="50000"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setFilters({
                  vehicleType: [],
                  location: [],
                  minPrice: 0,
                  maxPrice: 50000,
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}

          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              Found {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
            </div>

            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No vehicles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onFavorite={user ? handleFavorite : undefined}
                    isFavorite={favorites.has(vehicle.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
