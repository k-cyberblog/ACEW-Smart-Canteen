
from flask import Flask, render_template, jsonify, request
from db import get_db_connection
from decimal import Decimal

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/menu")
def menu():
    return render_template("menu.html")


@app.route("/test-db")
def test_db():
    try:
        connection = get_db_connection()

        if connection.is_connected():
            connection.close()
            return "MySQL Database Connected Successfully!"

    except Exception as e:
        return f"Database Connection Failed: {e}"


@app.route("/api/foods")
def get_foods():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM food_items WHERE available = TRUE")
    foods = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(foods)


@app.route("/place-order", methods=["POST"])
def place_order():
    data = request.get_json()
    items = data.get("items", []) if isinstance(data, dict) else []

    if not isinstance(items, list) or not items:
        return jsonify({"error": "Your cart is empty"}), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        connection.start_transaction()

        cursor = connection.cursor(dictionary=True)

        total = Decimal("0.00")
        order_items = []

        for item in items:
            food_id = item.get("food_id")
            quantity = item.get("quantity")

            if (type(food_id) is not int or food_id < 1
                    or type(quantity) is not int or quantity < 1
                    or quantity > 100):
                raise ValueError("Invalid food item or quantity")

            cursor.execute(
                "SELECT id, price FROM food_items "
                "WHERE id = %s AND available = TRUE",
                (food_id,)
            )

            food = cursor.fetchone()

            if not food:
                raise ValueError("Food item is unavailable")

            price = Decimal(str(food["price"]))
            total += price * quantity

            order_items.append((food_id, quantity, price))

        cursor.execute(
            "INSERT INTO orders (user_id, total_amount) VALUES (NULL, %s)",
            (total,)
        )

        order_id = cursor.lastrowid

        for food_id, quantity, price in order_items:
            cursor.execute(
                """INSERT INTO order_items
                   (order_id, food_id, quantity, price)
                   VALUES (%s, %s, %s, %s)""",
                (order_id, food_id, quantity, price)
            )

        connection.commit()

        return jsonify({
            "message": "Order placed successfully!",
            "order_id": order_id,
            "total": str(total)
        }), 201

    except ValueError as e:
        if connection:
            connection.rollback()
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        if connection:
            connection.rollback()
        print("Order error:", e)
        return jsonify({"error": "Unable to place order"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


if __name__ == "__main__":
    app.run(debug=True)
