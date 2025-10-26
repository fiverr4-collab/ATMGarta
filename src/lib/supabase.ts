import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'student' | 'staff' | 'owner';
  university_id?: string;
}

export interface Room {
  id: string;
  room_name: string;
  room_type: string;
  location: string;
  address: string;
  price_per_month: number;
  images: string[];
  amenities: string[];
  description?: string;
  available_from: string;
  owner_id: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  latitude?: number;
  longitude?: number;
  is_available: boolean;
  created_at: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  vehicle_type: string;
  rental_price_per_day: number;
  images: string[];
  address: string;
  location: string;
  specifications: {
    year?: string;
    transmission?: string;
    fuel?: string;
    seats?: string;
    ac?: string;
    engine?: string;
  };
  description?: string;
  owner_id: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_type: 'room' | 'vehicle';
  item_id: string;
  item_name: string;
  item_images: string[];
  start_date: string;
  end_date: string;
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  owner_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  booking_type: 'room' | 'vehicle';
  item_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  item_type: 'room' | 'vehicle';
  item_id: string;
  created_at: string;
}
