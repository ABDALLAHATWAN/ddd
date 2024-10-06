// js/main.js

// قائمة المنتجات - يمكن توسيعها حسب الحاجة
const products = [
    {
        id: 1,
        name: "iPhone 13 Pro Max",
        price: 1200,
        images: [
            "./imgs/phone1_red.png",
            "./imgs/phone1_blue.png",
            "./imgs/phone1_black.png",
            "./imgs/phone1_white.png",
            "./imgs/phone1_green.png"
        ]
    },
    {
        id: 2,
        name: "iPhone 14",
        price: 999,
        images: [
            "./imgs/phone2_red.png",
            "./imgs/phone2_blue.png",
            "./imgs/phone2_black.png",
            "./imgs/phone2_white.png",
            "./imgs/phone2_green.png"
        ]
    },
    {
        id: 3,
        name: "iPhone 15",
        price: 1099,
        images: [
            "./imgs/phone3_red.png",
            "./imgs/phone3_blue.png",
            "./imgs/phone3_black.png",
            "./imgs/phone3_white.png",
            "./imgs/phone3_green.png"
        ]
    }
];

// تحميل المنتجات ديناميكيًا عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
});

// دالة لعرض المنتجات
function displayProducts() {
    const productsContainer = document.getElementById("products");
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.setAttribute("data-id", product.id);

        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" class="product-image"/>
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <div class="color-options">
                ${product.images.map((img, index) => `
                    <img src="${img}" alt="Color ${index + 1}" data-index="${index}" onclick="selectColor(${product.id}, ${index})" />
                `).join('')}
            </div>
            <button class="buy-button" onclick="addToCart(${product.id})">Buy Now</button>
        `;

        productsContainer.appendChild(productCard);
    });

    // تحميل الألوان المختارة سابقًا من localStorage
    loadSelectedColors();
}

// دالة لاختيار اللون
function selectColor(productId, colorIndex) {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    const colorImages = productCard.querySelectorAll(".color-options img");
    
    colorImages.forEach(img => img.classList.remove("selected"));
    colorImages[colorIndex].classList.add("selected");
    
    // حفظ اللون المختار في localStorage
    let selectedColors = JSON.parse(localStorage.getItem("selectedColors")) || {};
    selectedColors[productId] = colorIndex;
    localStorage.setItem("selectedColors", JSON.stringify(selectedColors));
}

// تحميل الألوان المختارة سابقًا
function loadSelectedColors() {
    let selectedColors = JSON.parse(localStorage.getItem("selectedColors")) || {};
    for (const [productId, colorIndex] of Object.entries(selectedColors)) {
        const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
        if (productCard) {
            const colorImages = productCard.querySelectorAll(".color-options img");
            if (colorImages[colorIndex]) {
                colorImages[colorIndex].classList.add("selected");
            }
        }
    }
}

// دالة لإضافة المنتج إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification("Product not found!", false);
        return;
    }

    // الحصول على اللون المختار
    let selectedColors = JSON.parse(localStorage.getItem("selectedColors")) || {};
    let colorIndex = selectedColors[productId] || 0;
    let selectedImage = product.images[colorIndex];
    let selectedColor = getColorFromImage(selectedImage);

    // إنشاء كائن المنتج للسلة
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: selectedImage,
        color: selectedColor,
        quantity: 1
    };

    // تحميل السلة من localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // التحقق إذا كان المنتج موجودًا بالفعل في السلة بنفس اللون
    const existingItemIndex = cart.findIndex(item => item.id === cartItem.id && item.color === cartItem.color);
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push(cartItem);
    }

    // حفظ السلة في localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    showNotification("Product added to cart!", true);
}

// دالة لاستخراج اللون من اسم الصورة
function getColorFromImage(imagePath) {
    // نفترض أن اسم الصورة يحتوي على اللون، مثل "phone1_red.png"
    const parts = imagePath.split('_');
    if (parts.length < 2) return "Unknown";
    const colorPart = parts[1].split('.')[0];
    return capitalizeFirstLetter(colorPart);
}

// دالة لتحويل الحرف الأول إلى كبير
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// دالة لعرض الإشعارات
function showNotification(message, isSuccess) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.backgroundColor = isSuccess ? "#28a745" : "#dc3545"; // Green for success, red for error
    notification.classList.add("show");

    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}
