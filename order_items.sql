USE acew_smart_canteen;

ALTER TABLE orders
MODIFY user_id INT NULL;

SELECT * FROM orders;

SELECT * FROM order_items;