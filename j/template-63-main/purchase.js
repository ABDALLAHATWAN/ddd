// js/purchase.js

// Load the cart when the page loads
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

// Function to render the cart
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalContainer = document.getElementById("total");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItemsContainer.innerHTML = ""; // Clear previous content

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty!</p>`;
        totalContainer.textContent = `Total: $0`;
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" />
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>Color: ${item.color}</p>
                <p>Price: $${item.price}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="decreaseQuantity(${index})"><i class="fas fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${index})"><i class="fas fa-plus"></i></button>
            </div>
            <div>
                <p>Total: $${itemTotal}</p>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    totalContainer.textContent = `Total: $${total}`;
}

// Function to increase quantity
function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index]) {
        cart[index].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

// Function to decrease quantity
function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index]) {
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1); // Remove item if quantity is 0
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}
