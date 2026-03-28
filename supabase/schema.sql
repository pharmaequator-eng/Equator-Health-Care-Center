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

-- 3. Site Content Table (For CMS)
CREATE TABLE IF NOT EXISTS site_content (
  section_key TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default content if it doesn't exist
INSERT INTO site_content (section_key, content)
VALUES 
  ('hero', '{"title": "Mental Health Matters.", "subtitle": "We Are Here to Help.", "description": "Equator Health Care Pvt. Ltd. is a specialized pharmacy and lab dedicated to mental health. We provide professional support, diagnostics, and medication management to help you lead a fulfilling life."}'::jsonb),
  ('contact_info', '{"email": "pharmaequator@gmail.com", "phone": "+977-9840066925", "address": "Tinkune - 32, Kathmandu (Near CITe College)"}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- Note: Admin login is handled via environment variables for simplicity in this crude dashboard.
-- If you want a database-backed admin, create an 'admins' table.
