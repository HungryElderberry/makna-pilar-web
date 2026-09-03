class Footer extends HTMLElement {
    connectedCallback() {
        const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        const activePage = window.location.pathname.split('/').pop() || 'index.html';

        this.innerHTML = `
        <footer class="pt-5 pb-3">
            <div class="container">
                <div class="row gy-4 mb-4">
                    <!-- Footer Col 1: Logos -->
                    <div class="col-12 col-md-4">
                        <div class="d-flex align-items-center gap-3">
                            <img src="${basePath}images/brand logo/Logo-Makna.jpg" alt="Logo Makna" class="logo-circle bg-white p-1" />
                            <img src="${basePath}images/brand logo/Logo-Pilar_Kayu.jpg" alt="Logo Pilar" class="logo-circle bg-white p-1" />
                        </div>
                    </div>

                    <!-- Footer Col 2: Navigation -->
                    <div class="col-12 col-md-4 footer-nav">
                        <a href="${basePath}index.html" class="${activePage === 'index.html' || activePage === '' ? 'active' : ''}">Home</a>
                        <a href="${basePath}pages/menu.html" class="${activePage === 'menu.html' ? 'active' : ''}">Menu</a>
                        <a href="${basePath}pages/gallery.html" class="${activePage === 'gallery.html' ? 'active' : ''}">Gallery</a>
                        <a href="${basePath}pages/about.html" class="${activePage === 'about.html' ? 'active' : ''}">About Us</a>
                        <a href="${basePath}pages/contact.html" class="${activePage === 'contact.html' ? 'active' : ''}">Contact Us</a>
                    </div>

                    <!-- Footer Col 3: Find Us -->
                    <div class="col-12 col-md-4">
                        <h5 class="text-white fw-bold mb-3">Find Us</h5>
                        <p class="mb-2 d-flex align-items-center gap-3 find-us-text">
                            <i class="bi bi-geo-alt find-us-icon"></i>
                            <span>Jl. Hercules No. 5, Bandung</span>
                        </p>
                        <p class="mb-2 d-flex align-items-center gap-3 find-us-text">
                            <i class="bi bi-clock find-us-icon"></i>
                            <span>Hours: 10.00 - 21.00</span>
                        </p>
                        <p class="mb-0 d-flex align-items-center gap-3 find-us-text">
                            <i class="bi bi-instagram find-us-icon"></i>
                            <span>
                                <a href="https://www.instagram.com/maknakopi.bdg/" target="_blank" rel="noopener noreferrer" class="text-white text-decoration-none">@maknakopi.bdg</a>
                                &
                                <a href="https://www.instagram.com/pilarkayuresto/" target="_blank" rel="noopener noreferrer" class="text-white text-decoration-none">@pilarkayuresto</a>
                            </span>
                        </p>
                    </div>
                </div>

                <hr class="border-secondary opacity-25 my-4" />

                <div class="text-center small text-white-50">
                    &copy; 2026 Makna Kopi x Pilar Kayu Resto. All rights reserved.
                </div>
            </div>
        </footer>
        `;
    }
}

customElements.define('app-footer', Footer);

