class Navbar extends HTMLElement {
    connectedCallback() {
        const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        const activePage = window.location.pathname.split('/').pop() || 'index.html';

        this.innerHTML = `
        <header class="sticky-top">
            <nav class="navbar navbar-expand-lg py-3">
                <div class="container d-flex align-items-center justify-content-between">
                    <!-- Left: Logos -->
                    <a class="navbar-brand d-flex align-items-center gap-2" href="${basePath}index.html">
                        <img src="${basePath}images/brand logo/Logo-Makna.jpg" alt="Logo Makna" class="logo-circle" />
                        <img src="${basePath}images/brand logo/Logo-Pilar_Kayu.jpg" alt="Logo Pilar" class="logo-circle" />
                    </a>

                    <!-- Center: Navigation Links -->
                    <div class="d-none d-lg-flex align-items-center gap-2">
                        <a class="nav-link ${activePage === 'index.html' || activePage === '' ? 'active' : ''}" href="${basePath}index.html">Home</a>
                        <a class="nav-link ${activePage === 'menu.html' ? 'active' : ''}" href="${basePath}pages/menu.html">Menu</a>
                        <a class="nav-link ${activePage === 'gallery.html' ? 'active' : ''}" href="${basePath}pages/gallery.html">Gallery</a>
                        <a class="nav-link ${activePage === 'about.html' ? 'active' : ''}" href="${basePath}pages/about.html">About Us</a>
                        <a class="nav-link ${activePage === 'contact.html' ? 'active' : ''}" href="${basePath}pages/contact.html">Contact Us</a>
                    </div>

                    <!-- Right: Cart & Profile -->
                    <div class="d-flex align-items-center gap-3">
                        <a href="${basePath}pages/cart.html" class="cart-icon-btn">
                            <i class="bi bi-cart3"></i>
                            <span class="cart-badge">0</span>
                        </a>
                        <a href="${basePath}pages/profile.html">
                            <img src="${basePath}images/profiles/profile-placeholder.jpg" alt="Profile" class="avatar-circle border" />
                        </a>
                    </div>
                </div>
            </nav>
        </header>
        `;
    }
}

customElements.define('app-navbar', Navbar);

