
-- Create users profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create classes table for class management
CREATE TABLE public.classes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trainer TEXT,
  schedule_time TEXT,
  duration TEXT,
  max_slots INTEGER DEFAULT 20,
  available_slots INTEGER DEFAULT 20,
  price DECIMAL(10,2),
  difficulty TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table for persistent booking storage
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES public.classes(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  booking_date DATE DEFAULT CURRENT_DATE,
  booking_time TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create products table for inventory management
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders table for shopping cart and payments
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create order_items table for order details
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for classes (public read, admin write)
CREATE POLICY "Anyone can view active classes" ON public.classes FOR SELECT USING (active = true);
CREATE POLICY "Service role can manage classes" ON public.classes FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can manage all bookings" ON public.bookings FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "Service role can manage products" ON public.products FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can manage orders" ON public.orders FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can manage order items" ON public.order_items FOR ALL USING (auth.role() = 'service_role');

-- Insert initial classes data
INSERT INTO public.classes (name, description, trainer, schedule_time, duration, max_slots, available_slots, price, difficulty, image_url) VALUES
('Karate', 'Traditional martial arts training focusing on discipline, technique, and self-defense', 'David Thompson', 'Mon, Wed, Fri - 6:00 PM', '60 minutes', 15, 12, 25.00, 'Intermediate', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'),
('Yoga Flow', 'Dynamic yoga sequences that build strength, flexibility, and mindfulness', 'Emily Chen', 'Tue, Thu - 7:00 AM', '75 minutes', 20, 12, 20.00, 'Beginner', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'),
('CrossFit Intense', 'High-intensity functional fitness workouts for all fitness levels', 'Mike Rodriguez', 'Mon, Wed, Fri - 7:00 AM', '45 minutes', 12, 0, 30.00, 'Advanced', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'),
('Pilates Core', 'Core strengthening and body alignment through controlled movements', 'Emily Chen', 'Tue, Thu - 5:30 PM', '50 minutes', 18, 3, 22.00, 'Intermediate', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'),
('HIIT Training', 'High-intensity interval training for maximum calorie burn and fitness', 'Sarah Johnson', 'Sat - 9:00 AM', '30 minutes', 16, 0, 28.00, 'Advanced', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'),
('Zumba Dance', 'Fun dance fitness party with Latin and international music', 'Sarah Johnson', 'Sun - 11:00 AM', '60 minutes', 25, 3, 18.00, 'Beginner', 'https://images.unsplash.com/photo-1506629905877-c4c96e9df2b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');

-- Insert initial products data
INSERT INTO public.products (name, description, price, image_url, stock_quantity) VALUES
('Premium Protein Powder', 'High-quality whey protein for muscle building and recovery', 49.99, 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 50),
('Resistance Bands Set', 'Complete set of resistance bands for strength training', 29.99, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 30),
('Yoga Mat Premium', 'Non-slip premium yoga mat for all your workout needs', 39.99, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 25),
('Pre-Workout Energy', 'Natural pre-workout supplement for enhanced performance', 34.99, 'https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 40),
('Adjustable Dumbbells', 'Space-saving adjustable dumbbells for home workouts', 199.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 15),
('Gym Water Bottle', 'Insulated water bottle to keep you hydrated during workouts', 19.99, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 100);

-- Create trigger function to update profiles on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
