-- =====================================================
-- SUPABASE DATABASE SCHEMA - COTIN APP
-- =====================================================
-- Ejecuta este script en el SQL Editor de Supabase
-- (Dashboard → SQL Editor → New Query → Pega y ejecuta)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: products
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    allergens TEXT[] DEFAULT '{}',
    pairing TEXT,
    pairing_description TEXT,
    available BOOLEAN DEFAULT true,
    is_new BOOLEAN DEFAULT false,
    is_recommendation BOOLEAN DEFAULT false,
    is_off_menu BOOLEAN DEFAULT false,
    is_banner BOOLEAN DEFAULT false,
    is_offer BOOLEAN DEFAULT false,
    offer_text TEXT,
    translations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: subscribers
-- =====================================================
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for better performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- PRODUCTS Policies
-- Public can read all products
CREATE POLICY "Public can view products"
    ON products FOR SELECT
    TO anon, authenticated
    USING (true);

-- Only authenticated users can insert/update/delete products
CREATE POLICY "Authenticated can insert products"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated can update products"
    ON products FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated can delete products"
    ON products FOR DELETE
    TO authenticated
    USING (true);

-- SUBSCRIBERS Policies
-- Public can insert (for newsletter signup)
CREATE POLICY "Public can subscribe"
    ON subscribers FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only authenticated can view/delete
CREATE POLICY "Authenticated can view subscribers"
    ON subscribers FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated can delete subscribers"
    ON subscribers FOR DELETE
    TO authenticated
    USING (true);

-- ANALYTICS Policies
-- Public can insert analytics events
CREATE POLICY "Public can insert analytics"
    ON analytics FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only authenticated can view analytics
CREATE POLICY "Authenticated can view analytics"
    ON analytics FOR SELECT
    TO authenticated
    USING (true);

-- =====================================================
-- FUNCTION: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products table
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================
INSERT INTO products (title, description, price, category, image, allergens) VALUES
('Croquetas de Jamón Ibérico', 'Cremosas croquetas caseras elaboradas con bechamel suave y virutas de jamón ibérico de bellota 100%.', 12.50, 'entrantes', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800', ARRAY['Gluten', 'Lácteos', 'Huevos']),
('Pulpo a la Brasa', 'Pata de pulpo cocida a baja temperatura y terminada a la brasa, acompañada de puré de patata trufado.', 18.00, 'entrantes', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800', ARRAY['Moluscos', 'Lácteos']),
('Solomillo al Foie', 'Tierno solomillo de ternera gallega a la parrilla, coronado con escalope de foie fresco.', 26.00, 'principales', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800', ARRAY['Lácteos', 'Sulfitos'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- ✅ SCRIPT COMPLETADO
-- =====================================================
-- Verifica que todo se creó correctamente:
-- SELECT * FROM products;
-- SELECT * FROM subscribers;
-- SELECT * FROM analytics;
