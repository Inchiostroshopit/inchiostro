// DATI PRODOTTI
const products = [
    {
        id: 1,
        name: "Notturno Fiorentino",
        description: "Un'essenza notturna che cattura l'arte di Firenze, con note di gelsomino, legno di sandalo e ambra grigia.",
        price: 189.00,
        image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Oceano di Seta",
        description: "La brezza marina incontra fiori d'arancio e alghe marine per un viaggio sensoriale unico.",
        price: 165.00,
        image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Giardino Segreto",
        description: "Un bouquet di rose bulgare, peonia bianca e violetta, avvolto da muschio e legno di cedro.",
        price: 210.00,
        image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Pergamena Antica",
        description: "Note di incenso, patchouli, vaniglia bourbon e un tocco di zafferano per un'essenza senza tempo.",
        price: 240.00,
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop"
    }
];

// STATO CARRELLO
let cart = JSON.parse(localStorage.getItem('inchiostro-cart')) || [];

// ELEMENTI DOM
const productsGrid = document.getElementById('productsGrid');
const cartButton = document.getElementById('cartButton');
const closeCart = document.getElementById('closeCart');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.querySelector('.cart-count');
const totalPrice = document.querySelector('.total-price');
const checkoutBtn = document.getElementById('checkoutBtn');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const toast = document.getElementById('toast');
const navbar = document.getElementById('navbar');

// FUNZIONE PER CARICARE PRODOTTI
function loadProducts() {
    console.log("Tentativo di caricamento prodotti...");
    if (!productsGrid) {
        console.error("productsGrid NON TROVATO!");
        return;
    }
    
    let html = '';
    products.forEach(product => {
        html += `
            <article class="perfume-card">
                <div class="perfume-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="perfume-info">
                    <h3 class="perfume-name">${product.name}</h3>
                    <p class="perfume-desc">${product.description}</p>
                    <div class="perfume-price">€${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" 
                            data-id="${product.id}"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-image="${product.image}">
                        <i class="fas fa-plus"></i> Aggiungi al carrello
                    </button>
                </div>
            </article>
        `;
    });
    
    productsGrid.innerHTML = html;
    console.log("Prodotti caricati con successo!");
    
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// INIZIALIZZA
function init() {
    console.log("Inizializzazione...");
    loadProducts();
    updateCartUI();
    
    if (cartButton) cartButton.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Accesso effettuato! Benvenuto.', 'success');
            this.reset();
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Registrazione completata! Ora puoi accedere.', 'success');
            this.reset();
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

function addToCart(e) {
    const button = e.currentTarget;
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    const image = button.getAttribute('data-image');
    
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            image,
            quantity: 1
        });
    }
    
    localStorage.setItem('inchiostro-cart', JSON.stringify(cart));
    updateCartUI();
    showToast(`✨ ${name} aggiunto al carrello`, 'success');
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    if (cartCount) {
        cartCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCount.style.transform = '';
        }, 200);
    }
    
    if (cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Il carrello è vuoto</p>';
        if (totalPrice) totalPrice.textContent = '€0.00';
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.6';
        }
        return;
    }
    
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">€${item.price.toFixed(2)} x ${item.quantity}</div>
                    <button class="cart-item-remove" data-id="${item.id}">Rimuovi</button>
                </div>
            </div>
        `;
    });
    
    if (cartItemsContainer) cartItemsContainer.innerHTML = cartHTML;
    if (totalPrice) totalPrice.textContent = `€${total.toFixed(2)}`;
    
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

function removeFromCart(e) {
    const button = e.currentTarget;
    const id = button.getAttribute('data-id');
    
    const cartItem = button.closest('.cart-item');
    if (cartItem) {
        cartItem.style.transform = 'translateX(100px)';
        cartItem.style.opacity = '0';
    }
    
    setTimeout(() => {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('inchiostro-cart', JSON.stringify(cart));
        updateCartUI();
        showToast('Prodotto rimosso dal carrello');
    }, 300);
}

function checkout() {
    if (cart.length === 0) return;
    
    showToast('Grazie per l\'acquisto! ✨', 'success');
    
    setTimeout(() => {
        cart = [];
        localStorage.setItem('inchiostro-cart', JSON.stringify(cart));
        updateCartUI();
        toggleCart();
        showToast('Ordine completato con successo!', 'success');
    }, 1500);
}

window.copyCode = function() {
    const code = 'WELCOME20';
    navigator.clipboard.writeText(code).then(() => {
        showToast('Codice copiato! ✨', 'success');
    }).catch(() => {
        showToast('Errore nella copia', 'error');
    });
};

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (icon) {
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

function handleNavClick(e) {
    e.preventDefault();
    
    navLinks.forEach(link => link.classList.remove('active'));
    this.classList.add('active');
    
    navMenu.classList.remove('active');
    const icon = hamburger.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

function showToast(message, type = 'info') {
    if (!toast) return;
    toast.textContent = message;
    toast.style.backgroundColor = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#0a0a0a';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;
    
    if (window.scrollY > 100) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Banner cookie attivo');
    const savedPrefs = document.cookie.match(/gdpr_preferences=([^;]+)/);
    if (savedPrefs) {
        console.log('Preferenze cookie caricate:', savedPrefs[1]);
    }
});
