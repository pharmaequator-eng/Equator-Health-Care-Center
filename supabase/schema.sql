-- Supabase Schema for Equator Health Care

-- 1. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER NOT NULL,
  subject TEXT NOT NULL,
  message TEXT,
  booking_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- 2. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: Admin login is handled via environment variables for simplicity in this crude dashboard.
-- If you want a database-backed admin, create an 'admins' table.
