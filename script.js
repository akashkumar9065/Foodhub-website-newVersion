// ===============================
// FOODHUB - script.js
// ===============================

// ---------- RESPONSIVE NAVIGATION ----------

const navbar = document.getElementById("navbar");

if (navbar) {
    const navLinks = navbar.querySelector(".nav-links");

    if (navLinks) {
        const toggle = document.createElement("button");
        toggle.className = "menu-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-label", "Open navigation menu");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        navbar.appendChild(toggle);

        const closeMenu = () => {
            navbar.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open navigation menu");
            toggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        };

        toggle.addEventListener("click", () => {
            const isOpen = navbar.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
            toggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        });

        navLinks.addEventListener("click", closeMenu);
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) closeMenu();
        });
    }
}

// ---------- SEARCH ----------
//-----------------------------

const searchBox = document.getElementById("searchBox");
const searchFood = document.getElementById("searchFood");
const homeSearchResults = document.getElementById("homeSearchResults");
const searchBtn = document.getElementById("searchBtn");
const menuSearchStatus = document.getElementById("menuSearchStatus");

const homeFoods = [
    { name: "Zinger Burger", restaurant: "KFC", image: "kfc/zinger-burger.png" },
    { name: "Chicken Bucket", restaurant: "KFC", image: "kfc/chicken-bucket.png" },
    { name: "Popcorn Chicken", restaurant: "KFC", image: "kfc/popcorn-chicken.png" },
    { name: "Margherita Pizza", restaurant: "Domino's", image: "dominoes/margherita.png" },
    { name: "Cheese Pizza", restaurant: "Domino's", image: "dominoes/cheese-pizza.png" },
    { name: "Farmhouse Pizza", restaurant: "Domino's", image: "dominoes/farmhose.png" },
    { name: "Whopper", restaurant: "Burger King", image: "burgerKing/whopper.png" },
    { name: "Chicken Whopper", restaurant: "Burger King", image: "burgerKing/chicken-whopper.png" },
    { name: "Crispy Veg Burger", restaurant: "Burger King", image: "burgerKing/crispy-veg.png" },
    { name: "Chicken Biryani", restaurant: "Biryani House", image: "biryanihouse/chicken-biryani.png" },
    { name: "Mutton Biryani", restaurant: "Biryani House", image: "biryanihouse/mutton-biryani.png" },
    { name: "Veg Biryani", restaurant: "Biryani House", image: "biryanihouse/bveg-biryani.png" }
];

function showHomeSearchResults(query) {
    if (!homeSearchResults) return;

    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) {
        homeSearchResults.innerHTML = "";
        return;
    }

    const matches = homeFoods.filter(food =>
        `${food.name} ${food.restaurant}`.toLowerCase().includes(searchTerm)
    );

    homeSearchResults.innerHTML = matches.length
        ? matches.map(food => `
            <a class="home-search-result" href="menu.html?search=${encodeURIComponent(food.name)}">
                <div class="search-result-image"><img src="${food.image}" alt="${food.name}"></div>
                <span><small>${food.restaurant}</small><strong>${food.name}</strong><em>View menu <i class="fa-solid fa-arrow-right"></i></em></span>
            </a>`).join("")
        : '<p class="no-search-result"><i class="fa-solid fa-bowl-food"></i> No food item found. Try pizza, burger or biryani.</p>';
}

function showMenuSearchResults(query) {
    if (homeSearchResults) return;

    const searchTerm = query.trim().toLowerCase();
    const sections = document.querySelectorAll(".restaurant-section");
    let matchCount = 0;

    sections.forEach(section => {
        const restaurant = section.querySelector(".restaurant-info h2")?.textContent.toLowerCase() || "";
        const cards = section.querySelectorAll(".food-card");
        let sectionHasMatch = false;

        cards.forEach(card => {
            const foodName = card.querySelector("h3")?.textContent.toLowerCase() || "";
            const isMatch = !searchTerm || foodName.includes(searchTerm) || restaurant.includes(searchTerm);
            card.hidden = !isMatch;
            if (isMatch) {
                sectionHasMatch = true;
                matchCount++;
            }
        });

        section.hidden = Boolean(searchTerm) && !sectionHasMatch;
        section.classList.toggle("is-searching", Boolean(searchTerm));
    });

    if (menuSearchStatus) {
        menuSearchStatus.textContent = searchTerm
            ? (matchCount ? `${matchCount} delicious item${matchCount === 1 ? "" : "s"} found for “${query.trim()}”` : `No food item found for “${query.trim()}”. Try pizza, burger or biryani.`)
            : "";
        menuSearchStatus.classList.toggle("has-results", Boolean(searchTerm && matchCount));
        menuSearchStatus.classList.toggle("no-results", Boolean(searchTerm && !matchCount));
    }
}

if (searchBox) {

    searchBox.addEventListener("input", function () {

        if (homeSearchResults) {
            showHomeSearchResults(this.value);
            return;
        }

        showMenuSearchResults(this.value);

    });

}

if (searchBtn && searchBox) {
    searchBtn.addEventListener("click", function () {
        if (homeSearchResults) showHomeSearchResults(searchBox.value);
        else showMenuSearchResults(searchBox.value);
    });

    searchBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (homeSearchResults) showHomeSearchResults(this.value);
            else showMenuSearchResults(this.value);
        }
    });
}

if (searchBox && !homeSearchResults) {
    const menuSearch = new URLSearchParams(window.location.search).get("search");
    if (menuSearch) {
        searchBox.value = menuSearch;
        searchBox.dispatchEvent(new Event("input"));
    }
}

if (searchFood) {

    searchFood.addEventListener("keyup", function () {

        let value = this.value.toLowerCase();

        let menu = document.querySelectorAll(".menu-card");

        menu.forEach(item => {

            let name = item.querySelector("h3").textContent.toLowerCase();

            if (name.includes(value)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }

        });

    });

}
// ---------- ADD TO CART (Dynamic LocalStorage) ----------

// ---------- ADD TO CART ----------

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("click", function (e) {

    const button = e.target.closest(".add-to-cart");

    if (!button) return;

    e.preventDefault();

    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const image = button.dataset.image || "";

    if (!name) {
        alert("Food name not found!");
        return;
    }

    if (!price || price <= 0) {
        alert("Food price not found!");
        return;
    }

    const existing = cart.find(item => item.name === name);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1,
            image: image
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Refresh the cart table immediately when an item is added from this page.
    loadCart();

    alert(name + " added to cart!");

});

// ---------- LOAD CART ----------

function loadCart() {

    const tbody = document.querySelector("tbody");

    if (!tbody) return;

    cart = JSON.parse(localStorage.getItem("cart")) || [];

    tbody.innerHTML = "";

    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="5">🛒 Your Cart is Empty</td>
        </tr>`;

        updateSummary(0, 0);

        return;
    }

    cart.forEach((item, index) => {

        const total = item.price * item.quantity;

        subtotal += total;

        totalItems += item.quantity;

        tbody.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <input type="number"
                    value="${item.quantity}"
                    min="1"
                    onchange="changeQty(${index}, this.value)">
            </td>
            <td>₹${total}</td>
            <td>
                <button onclick="removeItem(${index})">
                    Remove
                </button>
            </td>
        </tr>
        `;

    });

    updateSummary(totalItems, subtotal);

}
// ---------- UPDATE SUMMARY ----------

function updateSummary(items, subtotal) {

    const delivery = items > 0 ? 40 : 0;

    const total = subtotal + delivery;

    const spans = document.querySelectorAll(".bill-summary span");

    if (spans.length >= 3) {

        spans[0].innerText = items;
        spans[1].innerText = "₹" + subtotal;
        spans[2].innerText = "₹" + delivery;

    }

    const totalText = document.querySelector(".bill-summary h3");

    if (totalText) {

        totalText.innerText = "Total : ₹" + total;

    }

}

loadCart();

// ---------- CHANGE QUANTITY ----------

function changeQty(index, qty) {

    qty = Number(qty);

    if (qty < 1) qty = 1;

    cart[index].quantity = qty;

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();

}
// ---------- REMOVE ITEM ----------

function removeItem(index) {

    if (confirm("Remove this item from cart?")) {

        cart.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(cart));

        loadCart();

    }

}

// ---------- LOGIN ----------

const loginForm = document.querySelector(".login-box form");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        alert("Login Successful!");

        window.location.href = "index.html";

    });

}

// ---------- SIGNUP ----------

const signupForm = document.querySelector(".signup-box form");

if (signupForm) {

    signupForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const password = signupForm.querySelectorAll("input")[3].value;

        const confirmPassword = signupForm.querySelectorAll("input")[4].value;

        if (password !== confirmPassword) {

            alert("Passwords do not match!");

            return;

        }

        alert("Account Created Successfully!");

        window.location.href = "login.html";

    });

}
// ---------- CONTACT ----------

const contactForm = document.querySelector(".contact-form form");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        alert("Thank you! Your message has been sent.");

        contactForm.reset();

    });

}
// ---------- HERO ----------

const heroBtn = document.querySelector(".btn");

if (heroBtn) {

    heroBtn.addEventListener("click", function () {

        console.log("FoodHub Loaded");

    });

}

// ---------- SCROLL TO TOP ----------

window.addEventListener("scroll", function () {

    if (window.scrollY > 200) {

        console.log("Scrolling...");

    }

});

// ---------- SIMPLE FADE ANIMATION ----------

const cards = document.querySelectorAll(
    ".food-card, .menu-card, .card, .review, .why-box"
);

cards.forEach(card => {

    card.addEventListener("mouseenter", function () {

        card.style.transform = "scale(1.05)";

    });

    card.addEventListener("mouseleave", function () {

        card.style.transform = "scale(1)";

    });

});

// ---------- CURRENT YEAR ----------

const footer = document.querySelector("footer");

if (footer) {

    console.log("FoodHub Website Loaded Successfully");

}

// popular resturent section

function openRestaurant(name){

window.location.href=name+".html";

}


