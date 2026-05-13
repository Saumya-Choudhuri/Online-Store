const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

// Reinitialize scroll after page load to ensure all content is measured
window.addEventListener('load', () => {
    setTimeout(() => {
        scroll.update();
        
        // Handle anchor navigation for smooth scrolling
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                scroll.scrollTo(element, {
                    duration: 1000,
                    offset: -100
                });
            }
        }
    }, 500);
});

// Logo and Nav scroll animation
scroll.on('scroll', (args) => {
    const logo = document.getElementById('logo');
    const navLinks = document.getElementById('linkes');
    const scrollY = args.scroll.y;
    
    // Start fading after 50px scroll, fully hidden at 300px
    const fadeStart = 50;
    const fadeEnd = 300;
    
    if (scrollY <= fadeStart) {
        logo.style.opacity = 1;
        logo.style.transform = 'translateY(0)';
        navLinks.classList.remove('hidden');
    } else if (scrollY >= fadeEnd) {
        logo.style.opacity = 0;
        logo.style.transform = 'translateY(-30px)';
        navLinks.classList.add('hidden');
    } else {
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        logo.style.opacity = 1 - progress;
        logo.style.transform = `translateY(${-30 * progress}px)`;
        if (progress > 0.5) {
            navLinks.classList.add('hidden');
        } else {
            navLinks.classList.remove('hidden');
        }
    }
});

// Product Data
const products = [
    { id: 1, name: "Classic White Tee", price: 49, originalPrice: 65, category: "women", badge: "Sale", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop" },
    { id: 2, name: "Denim Jacket", price: 129, category: "women", badge: "New", image: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop" },
    { id: 3, name: "Leather Handbag", price: 189, originalPrice: 250, category: "accessories", badge: "Sale", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop" },
    { id: 4, name: "Slim Fit Chinos", price: 79, category: "men", image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop" },
    { id: 5, name: "Silk Scarf", price: 45, category: "accessories", badge: "New", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop" },
    { id: 6, name: "Wool Blazer", price: 199, category: "men", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop" },
    { id: 7, name: "Summer Dress", price: 89, originalPrice: 120, category: "women", badge: "Sale", image: "https://images.unsplash.com/photo-1595777712802-91d02d1d07c9?w=400&h=400&fit=crop" },
    { id: 8, name: "Leather Belt", price: 55, category: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
    { id: 9, name: "Cotton Shirt", price: 65, category: "men", badge: "New", image: "https://images.unsplash.com/photo-1596362051930-c3a146b3b299?w=400&h=400&fit=crop" },
    { id: 10, name: "Knit Sweater", price: 95, category: "women", image: "https://images.unsplash.com/photo-1578932750294-708f62ac54c6?w=400&h=400&fit=crop" },
];

// Cart State
let cart = [];

// Panel Toggle Functions
function toggleAbout() {
    closePanels();
    document.getElementById('about-panel').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function toggleShopping() {
    closePanels();
    document.getElementById('shopping-panel').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
    renderProducts('all');
}

function toggleCart() {
    closePanels();
    document.getElementById('cart-panel').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
    renderCart();
}

function closePanels() {
    document.querySelectorAll('.side-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById('overlay').classList.remove('active');
}

// Product Functions
function renderProducts(filter) {
    const grid = document.getElementById('products-grid');
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.style.display='none'">
                <i class="fas fa-tshirt placeholder-icon" style="display: ${product.image ? 'none' : 'block'}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">
                    $${product.price}
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderProducts(category);
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
        }
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartSummary.style.display = 'block';
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-tshirt"></i>
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-variant">Size: M / Color: Default</p>
                    <p class="cart-item-price">$${item.price}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
    }
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #000;
        color: #fff;
        padding: 15px 30px;
        border-radius: 5px;
        z-index: 10000;
        font-size: 14px;
        animation: slideUp 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add notification animations to page
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

function videoconAnimation() {
    var videocon = document.querySelector("#video-container");
    var playbtn = document.querySelector("#play");

    videocon.addEventListener("mouseenter", function () {
        gsap.to(playbtn, {
            scale: 1,
            opacity: 1,
        });
    });

    videocon.addEventListener("mouseleave", function () {
        gsap.to(playbtn, {
            scale: 0,
            opacity: 0,
        });
    });

    videocon.addEventListener("mousemove", function (dets) {
        gsap.to(playbtn, {
           left: dets.x - 15,
           top: dets.y - 15,
        });
    });
}


videoconAnimation()

function loadinganimation(){
    gsap.from("#page1 h1",{
        y:100,
        opacity:0,
        delay:0.5,
        duration:0.9,
        stagger:0.3,
    })
    gsap.from("#page1 video-container",{
        scale:0.9,
        opacity:0,
        delay:1.3,
        duration:0.5,
    })
}
loadinganimation();

// Page 2 horizontal glide detection
let lastX = 0;
let lastXPage3 = 0;
let isScrolling = false;
let scrollTimeout;
const page2 = document.getElementById('page2');
const elems = document.querySelectorAll('#page2 .elem');
const page3 = document.getElementById('page3');
const page3Items = document.querySelectorAll('#page3 .child');

// Detect scrolling
scroll.on('scroll', () => {
    isScrolling = true;
    if (page2) {
        page2.classList.remove('gliding');
        elems.forEach(el => el.classList.remove('active'));
    }
    if (page3) {
        page3.classList.remove('gliding');
        page3Items.forEach(item => item.classList.remove('active'));
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 150);
});

if (page2) {
    page2.addEventListener('mousemove', (e) => {
        // Don't trigger effect while scrolling
        if (isScrolling) return;
        
        const deltaX = Math.abs(e.clientX - lastX);
        
        // Only trigger if horizontal movement is significant
        if (deltaX > 5) {
            page2.classList.add('gliding');
        }
        
        lastX = e.clientX;
    });
    
    // Add hover listeners to each elem
    elems.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            if (isScrolling) return;
            // Remove active from all, add to current
            elems.forEach(el => el.classList.remove('active'));
            elem.classList.add('active');
            page2.classList.add('gliding');
        });
    });
    
    page2.addEventListener('mouseleave', () => {
        page2.classList.remove('gliding');
        elems.forEach(el => el.classList.remove('active'));
    });
}

if (page3) {
    // Pause all videos initially
    page3Items.forEach(item => {
        const video = item.querySelector('video');
        if (video) {
            video.pause();
        }
    });

    page3.addEventListener('mouseenter', () => {
        page3.classList.add('gliding');
        
        // Automatically play the first video on entering page3 (even if scrolling)
        if (page3Items.length > 0) {
            const firstChild = page3Items[0];
            page3Items.forEach(el => el.classList.remove('active'));
            firstChild.classList.add('active');
            const firstVideo = firstChild.querySelector('video');
            if (firstVideo) {
                firstVideo.play();
            }
        }
    });

    page3.addEventListener('mousemove', (e) => {
        if (isScrolling) return;
        
        const child = e.target.closest('.child');
        if (child) {
            page3Items.forEach(el => {
                el.classList.remove('active');
                // Pause video for non-active items
                const video = el.querySelector('video');
                if (video) {
                    video.pause();
                }
            });
            child.classList.add('active');
            // Play video for active item
            const activeVideo = child.querySelector('video');
            if (activeVideo) {
                activeVideo.play();
            }
            page3.classList.add('gliding');
        }
    });

    page3.addEventListener('mouseleave', () => {
        page3.classList.remove('gliding');
        page3Items.forEach(el => {
            el.classList.remove('active');
            // Pause all videos when leaving
            const video = el.querySelector('video');
            if (video) {
                video.pause();
            }
        });
    });
}
//new change 