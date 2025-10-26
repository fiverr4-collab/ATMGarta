/*
  # CampusStay Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `phone` (text)
      - `role` (text) - student/staff/owner
      - `university_id` (text) - for students/staff
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `rooms`
      - `id` (uuid, primary key)
      - `room_name` (text)
      - `room_type` (text) - single/double/apartment/hostel
      - `location` (text)
      - `address` (text)
      - `price_per_month` (integer)
      - `images` (text[])
      - `amenities` (text[])
      - `description` (text)
      - `available_from` (date)
      - `owner_id` (uuid, references profiles)
      - `owner_name` (text)
      - `owner_phone` (text)
      - `owner_email` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `is_available` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `vehicles`
      - `id` (uuid, primary key)
      - `brand` (text)
      - `model` (text)
      - `vehicle_type` (text) - car/bike/van
      - `rental_price_per_day` (integer)
      - `images` (text[])
      - `address` (text)
      - `location` (text)
      - `specifications` (jsonb)
      - `description` (text)
      - `owner_id` (uuid, references profiles)
      - `owner_name` (text)
      - `owner_phone` (text)
      - `owner_email` (text)
      - `is_available` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `booking_type` (text) - room/vehicle
      - `item_id` (uuid)
      - `item_name` (text)
      - `item_images` (text[])
      - `start_date` (date)
      - `end_date` (date)
      - `total_amount` (integer)
      - `payment_method` (text)
      - `status` (text) - pending/confirmed/completed/cancelled
      - `owner_id` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `user_name` (text)
      - `booking_type` (text) - room/vehicle
      - `item_id` (uuid)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamptz)
    
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `item_type` (text) - room/vehicle
      - `item_id` (uuid)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read all public listings (rooms, vehicles)
      - Manage their own bookings
      - Manage their own favorites
      - Add reviews for completed bookings
      - Owners can manage their own listings
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'student',
  university_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name text NOT NULL,
  room_type text NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  price_per_month integer NOT NULL,
  images text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  description text,
  available_from date DEFAULT CURRENT_DATE,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  owner_name text NOT NULL,
  owner_phone text NOT NULL,
  owner_email text NOT NULL,
  latitude decimal,
  longitude decimal,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (is_available = true OR owner_id = auth.uid());

CREATE POLICY "Owners can insert their rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their rooms"
  ON rooms FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  vehicle_type text NOT NULL,
  rental_price_per_day integer NOT NULL,
  images text[] DEFAULT '{}',
  address text NOT NULL,
  location text NOT NULL,
  specifications jsonb DEFAULT '{}',
  description text,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  owner_name text NOT NULL,
  owner_phone text NOT NULL,
  owner_email text NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (is_available = true OR owner_id = auth.uid());

CREATE POLICY "Owners can insert their vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  booking_type text NOT NULL,
  item_id uuid NOT NULL,
  item_name text NOT NULL,
  item_images text[] DEFAULT '{}',
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_amount integer NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = owner_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = owner_id);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  booking_type text NOT NULL,
  item_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_type text NOT NULL,
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rooms_location ON rooms(location);
CREATE INDEX IF NOT EXISTS idx_rooms_room_type ON rooms(room_type);
CREATE INDEX IF NOT EXISTS idx_rooms_price ON rooms(price_per_month);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON vehicles(location);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(rental_price_per_day);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_id, booking_type);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);