// ========================================================
// FOODHUB - ORDER SUMMARY & WHATSAPP CHECKOUT (app.js)
// ========================================================

document.addEventListener("DOMContentLoaded", function () {

    // ---------- 1. LOAD ORDER SUMMARY & CALCULATE TOTAL ----------
    const orderItems = document.getElementById("orderItems");
    const grandTotal = document.getElementById("grandTotal");

    function updateOrderSummary() {
        if (!orderItems || !grandTotal) return;

        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem("cart")) || [];
        } catch (e) {
            cart = [];
        }

        let subtotal = 0;
        orderItems.innerHTML = "";

        if (cart.length === 0) {
            orderItems.innerHTML = "<p style='color: #888;'>Your Cart is Empty</p>";
            grandTotal.innerHTML = "Total : ₹0";
            return;
        }

        // Cart ke items aur price calculate karna
        cart.forEach(item => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            const itemTotal = price * quantity;

            subtotal += itemTotal;

            orderItems.innerHTML += `
                <p>
                    ${item.name} × ${quantity}
                    <span>₹${itemTotal}</span>
                </p>
            `;
        });

        // Delivery Charge ₹40 add karna
        const delivery = 40;
        const total = subtotal + delivery;

        // Total Update
        grandTotal.innerHTML = "Total : ₹" + total;
    }

    updateOrderSummary();


    // ---------- 2. CHECKOUT FORM → WHATSAPP SEND ----------
    const checkoutForm = document.getElementById("checkoutForm");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem("cart")) || [];
            } catch (err) {
                cart = [];
            }

            if (cart.length === 0) {
                alert("Aapka cart khali hai! Kripya pehle items add karein.");
                window.location.href = "menu.html";
                return;
            }

            // Customer Details fetch karna
            const name = document.getElementById("name") ? document.getElementById("name").value.trim() : "";
            const phone = document.getElementById("phone") ? document.getElementById("phone").value.trim() : "";
            const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
            const address = document.getElementById("address") ? document.getElementById("address").value.trim() : "";
            const city = document.getElementById("city") ? document.getElementById("city").value.trim() : "";
            const pincode = document.getElementById("pincode") ? document.getElementById("pincode").value.trim() : "";

            const paymentElement = document.querySelector('input[name="payment"]:checked');
            const payment = paymentElement ? paymentElement.value : "Cash on Delivery";

            let subtotal = 0;

            // WhatsApp Message structure
            let message = "🍔 *FOODHUB - NEW ORDER*\n";
            message += "══════════════════════\n\n";

            message += "👤 *CUSTOMER INFORMATION*\n";
            message += "• *Name:* " + name + "\n";
            message += "• *Phone:* " + phone + "\n";
            message += "• *Email:* " + email + "\n";
            message += "• *Address:* " + address + ", " + city + " - " + pincode + "\n";
            message += "• *Payment Mode:* " + payment + "\n\n";

            message += "🍽️ *ORDER ITEMS*\n";

            cart.forEach((item, index) => {
                const price = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 1;
                const itemTotal = price * quantity;

                subtotal += itemTotal;

                message += (index + 1) + ". *" + item.name + "* × " + quantity + "  ➜  ₹" + itemTotal + "\n";
            });

            const delivery = 40;
            const grandTotalAmount = subtotal + delivery;

            message += "\n💵 *BILL SUMMARY*\n";
            message += "• Subtotal: ₹" + subtotal + "\n";
            message += "• Delivery Fee: ₹" + delivery + "\n";
            message += "• *Total Payable: ₹" + grandTotalAmount + "*\n\n";
            message += "══════════════════════\n";
            message += "✨ _Thank you for ordering with FoodHub!_";

            const whatsappNumber = "919065521532";
            const whatsappURL = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);

            // Cart empty karein
            localStorage.removeItem("cart");

            // WhatsApp redirect
            window.location.href = whatsappURL;
        });
    }

});





// ================= CONTACT FORM → WHATSAPP =================
window.sendContactWhatsApp = function () {
    // Input values read karna
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const subjectEl = document.getElementById("subject");
    const messageEl = document.getElementById("message");

    const name = nameEl ? nameEl.value.trim() : "";
    const email = emailEl ? emailEl.value.trim() : "";
    const subject = subjectEl ? subjectEl.value.trim() : "";
    const message = messageEl ? messageEl.value.trim() : "";

    // Validation
    if (!name || !email || !message) {
        alert("Please fill Name, Email, and Message before sending!");
        return;
    }

    // Clean WhatsApp Message Format
    let waText = "📩 *FOODHUB - CUSTOMER MESSAGE*\n";
    waText += "══════════════════════\n\n";

    waText += "👤 *SENDER DETAILS*\n";
    waText += "• *Name:* " + name + "\n";
    waText += "• *Email:* " + email + "\n\n";

    waText += "📌 *SUBJECT*\n";
    waText += (subject || "General Inquiry") + "\n\n";

    waText += "💬 *MESSAGE*\n";
    waText += message + "\n\n";

    waText += "══════════════════════\n";
    waText += "_Sent via FoodHub Contact Page_";

    // WhatsApp URL
    const whatsappNumber = "919065521532";
    const whatsappURL = "https://api.whatsapp.com/send?phone=" + whatsappNumber + "&text=" + encodeURIComponent(waText);

    // Direct WhatsApp Open in New Tab
    window.open(whatsappURL, "_blank");
};