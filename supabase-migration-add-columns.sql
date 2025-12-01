-- =====================================================
-- MIGRATION: Add missing columns to products table
-- =====================================================
-- Run this in Supabase SQL Editor to add the missing columns
-- (Dashboard → SQL Editor → New Query → Paste and Run)
-- =====================================================

-- Add offer_text column for storing offer labels (e.g., "50%", "2x1")
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS offer_text TEXT;

-- Add pairing_description column for wine pairing descriptions
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS pairing_description TEXT;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- =====================================================
-- ✅ MIGRATION COMPLETED
-- =====================================================
