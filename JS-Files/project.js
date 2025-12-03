// Simple cart using localStorage
// Items are stored as: [{ name, price, quantity }]

function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addItemToCart(name, price) {
    let cart = loadCart();

    // If item already in cart, increase quantity
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart(cart);
    alert(`${name} was added to your cart.`);
}

// Render cart items into checkout page if present
function renderCheckout() {
    const container = document.getElementById("checkout-items");
    const totalEl = document.getElementById("checkout-total");

    if (!container || !totalEl) return; // not on checkout page

    const cart = loadCart();

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-text">Your cart is currently empty.</p>';
        totalEl.textContent = "$0.00";
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const row = document.createElement("div");
        row.classList.add("checkout-item-row");

        const left = document.createElement("span");
        left.classList.add("checkout-item-name");
        left.textContent = item.name;

        const qty = document.createElement("span");
        qty.classList.add("checkout-item-qty");
        qty.textContent = `×${item.quantity}`;
        left.appendChild(qty);

        const right = document.createElement("span");
        right.classList.add("checkout-item-price");
        right.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        row.appendChild(left);
        row.appendChild(right);
        container.appendChild(row);

        total += item.price * item.quantity;
    });

    totalEl.textContent = `$${total.toFixed(2)}`;
}

// Handle the fake checkout form
function setupCheckoutForm() {
    const form = document.getElementById("checkout-form");
    if (!form) return; // not on checkout page

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("cust-name").value.trim();
        const email = document.getElementById("cust-email").value.trim();
        const phone = document.getElementById("cust-phone").value.trim();
        const pickup = document.getElementById("pickup-time").value;

        const cart = loadCart();

        if (cart.length === 0) {
            alert("Your cart is empty. Please add items from the menu before checking out.");
            return;
        }

        if (!name || !email || !phone || !pickup) {
            alert("Please fill out all required fields.");
            return;
        }

        // Fake confirmation for the project
        alert(
            `Thank you, ${name}! Your order has been placed.\n` +
            `Pickup time: ${pickup}\n\n` +
            `A confirmation would be sent to: ${email} (for demo purposes only).`
        );

        // Clear cart and form
        localStorage.removeItem("cart");
        form.reset();

        // Optionally redirect back home or to menu
        window.location.href = "../index.html";
    });
}

// Hook up everything once the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    // 1. Add-to-cart buttons on menu page
    document.querySelectorAll("[data-add-to-cart]").forEach(button => {
        button.addEventListener("click", function () {
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            if (!name || isNaN(price)) return;
            addItemToCart(name, price);
        });
    });

    // 2. Checkout rendering + form on checkout page
    renderCheckout();
    setupCheckoutForm();
});
