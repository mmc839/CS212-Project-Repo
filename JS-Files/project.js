// -------- Cart helpers --------
function loadCart() {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartItemCount() {
    const cart = loadCart();
    return cart.reduce((total, item) => {
        const qty = item.quantity || 1;
        return total + qty;
    }, 0);
}

function updateCartCount() {
    const count = getCartItemCount();
    document.querySelectorAll('.cart-count').forEach(span => {
        span.textContent = count;
    });
}

// Add or increment an item in the cart
function addItemToCart(name, price) {
    const cart = loadCart();
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
    alert(`${name} added to cart.`);
}

// -------- Checkout page rendering --------
function renderCheckout() {
    const container = document.getElementById('checkout-items');
    const totalSpan = document.getElementById('checkout-total');

    // If we're not on the checkout page, just skip
    if (!container || !totalSpan) return;

    const cart = loadCart();
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted">Your cart is currently empty.</p>';
        totalSpan.textContent = '$0.00';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'list-group mb-3';

    let total = 0;

    cart.forEach(item => {
        const qty = item.quantity || 1;
        const itemTotal = item.price * qty;
        total += itemTotal;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <small class="text-muted ms-2">x${qty}</small>
            </div>
            <span>$${itemTotal.toFixed(2)}</span>
        `;

        list.appendChild(li);
    });

    container.appendChild(list);
    totalSpan.textContent = '$' + total.toFixed(2);
}

// -------- Checkout form handling --------
function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return; // not on checkout page

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.querySelector('#customer-name')?.value.trim();
        const email = form.querySelector('#customer-email')?.value.trim();
        const address = form.querySelector('#customer-address')?.value.trim();

        if (!name || !email || !address) {
            alert('Please fill out name, email, and address to place your (fake) order.');
            return;
        }

        alert('Thanks! Your fake order has been placed for the project demo.');

        // Clear cart and UI
        localStorage.removeItem('cart');
        updateCartCount();
        renderCheckout();
        form.reset();
    });
}

// -------- Attach events on page load --------
document.addEventListener('DOMContentLoaded', function () {
    // Hook up all add-to-cart buttons on the menu page
    document.querySelectorAll('[data-add-to-cart]').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);

            if (!name || isNaN(price)) {
                console.warn('Add-to-cart button missing data-name or data-price');
                return;
            }

            addItemToCart(name, price);
        });
    });

    // Sync badge with stored cart
    updateCartCount();

    // If we're on checkout.html, render and set up form
    renderCheckout();
    setupCheckoutForm();
});
