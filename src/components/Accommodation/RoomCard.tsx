import { Room } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface RoomCardProps {
  room: Room;
  onFavorite?: (roomId: string) => void;
  isFavorite?: boolean;
}

export default function RoomCard({ room, onFavorite, isFavorite }: RoomCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="relative" onClick={() => navigate(`/rooms/${room.id}`)}>
        <img
          src={room.images[0]}
          alt={room.room_name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          {onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(room.id);
              }}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <svg
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {room.room_type}
          </span>
        </div>
      </div>

      <div className="p-4" onClick={() => navigate(`/rooms/${room.id}`)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.room_name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {room.location}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs text-gray-500">+{room.amenities.length - 3} more</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              LKR {room.price_per_month.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">/month</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/rooms/${room.id}`);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
