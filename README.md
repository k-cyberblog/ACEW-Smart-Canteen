# ACEW Smart Canteen

A full-stack web-based food ordering application that allows users to browse available food items, add items to a shopping cart, calculate the total amount, and place orders.

## Features

- Dynamic food menu loaded from MySQL database
- Food images and prices displayed automatically
- Add food items to cart
- Update quantities
- Remove items from cart
- Automatic total price calculation
- Place food orders
- Store orders and order details in MySQL
- Order confirmation with unique Order ID

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, Flask
- **Database:** MySQL
- **API:** Flask REST endpoints

## Project Structure

```text
ACEW Smart Canteen/
├── app.py
├── db.py
├── requirements.txt
├── templates/
│   ├── index.html
│   └── menu.html
├── static/
│   ├── style.css
│   ├── script.js
│   └── cscript.js
├── database/
│   └── schema.sql
└── README.md
```

## Installation and Setup

1. Clone the repository.
2. Create and activate a Python virtual environment.
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create the MySQL database and tables using `database/schema.sql`.
5. Configure your MySQL credentials in `db.py`.
6. Run the Flask application:

```bash
python app.py
```

7. Open `http://127.0.0.1:5000/` in your browser.

## Database Tables

- `users`
- `food_items`
- `orders`
- `order_items`

## Future Enhancements

- User registration and login
- Online payment integration
- Admin dashboard
- Order history and tracking

## Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Food Menu
![Food Menu](screenshots/menu.png)

### Order Confirmation
![Order Confirmation](screenshots/order.png)

## Author

Babisha B