
-- Create a function to reduce product stock when an order is completed
CREATE OR REPLACE FUNCTION public.reduce_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Reduce stock for each product in the order
  UPDATE public.products 
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id 
  AND stock_quantity >= NEW.quantity;
  
  -- Check if the update affected any rows (i.e., if there was enough stock)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product ID %', NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that fires when order items are inserted
CREATE TRIGGER reduce_stock_on_order
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.reduce_product_stock();

-- Add a function to handle successful payments and update order status
CREATE OR REPLACE FUNCTION public.complete_order(order_id_param UUID)
RETURNS void AS $$
BEGIN
  -- Update order status to completed
  UPDATE public.orders 
  SET status = 'completed'
  WHERE id = order_id_param;
END;
$$ LANGUAGE plpgsql;
