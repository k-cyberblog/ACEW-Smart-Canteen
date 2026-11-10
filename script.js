let cartItems = {};

function addToCart(id, name, price, qtyId) {
    let quantity = parseInt(document.getElementById(qtyId).value);

    if (isNaN(quantity) || quantity < 1) {
        alert("Please enter a valid quantity!");
        return;
    }

    if (cartItems[id]) {
        cartItems[id].quantity += quantity;
    } else {
        cartItems[id] = {
            name: name,
            price: price,
            quantity: quantity
        };
    }

    displayCart();
}

function displayCart() {
    let cart = document.getElementById("cart");
    let total = 0;

    cart.innerHTML = "";

    for (let id in cartItems) {
        let item = cartItems[id];

        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        let row = document.createElement("div");

        let details = document.createElement("p");
        details.textContent =
            item.name + " x " + item.quantity + " = ₹" + itemTotal.toFixed(2);

        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {
            delete cartItems[id];
            displayCart();
        });

        row.appendChild(details);
        row.appendChild(removeButton);
        cart.appendChild(row);
    }

    document.getElementById("total").textContent =
        "Total: ₹" + total.toFixed(2);
}

async function loadFoods() {
    const foodList = document.getElementById("food-list");

    try {
        const response = await fetch("/api/foods");

        if (!response.ok) {
            throw new Error("Unable to fetch food items");
        }

        const foods = await response.json();

        foodList.innerHTML = "";

        foods.forEach(food => {
            const card = document.createElement("div");
            card.className = "food-card";
            const image = document.createElement("img");

            image.src = food.image_url;
            image.alt = food.name;
            image.className = "food-image";

            const name = document.createElement("h3");
            name.textContent = food.name;

            const price = document.createElement("p");
            price.textContent = "Price: ₹" + food.price;

            const quantity = document.createElement("input");
            quantity.type = "number";
            quantity.min = "1";
            quantity.value = "1";
            quantity.id = "qty-" + food.id;

            const button = document.createElement("button");
            button.textContent = "Add to Cart";

            button.addEventListener("click", function () {
                addToCart(
                    food.id,
                    food.name,
                    Number(food.price),
                    quantity.id
                );
            });

            card.appendChild(image);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(quantity);
            card.appendChild(button);

            foodList.appendChild(card);
        });

    } catch (error) {
        foodList.textContent = "Error loading food items!";
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", loadFoods)

async function placeOrder() {
    const items = Object.keys(cartItems).map(id => ({
        food_id: Number(id),
        quantity: cartItems[id].quantity
    }));

    if (items.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    try {
        const response = await fetch("/place-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: items })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Order failed");
        }

        document.getElementById("order-message").textContent =
            "Order placed successfully! Your Order ID is: " + result.order_id;

        cartItems = {};
        displayCart();

    } catch (error) {
        alert(error.message);
    }
}