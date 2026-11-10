USE acew_smart_canteen;

INSERT INTO food_items (name, description, price, available)
VALUES
('South Indian Meals', 'Traditional South Indian meal', 80.00, TRUE),
('Veg Sandwich', 'Fresh vegetable sandwich', 40.00, TRUE),
('Noodles', 'Delicious vegetable noodles', 100.00, TRUE),
('French Fries', 'Crispy golden fries', 50.00, TRUE),
('Fruit Salad', 'Fresh mixed fruit salad', 60.00, TRUE);

SELECT * FROM food_items;