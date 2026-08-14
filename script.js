document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:3000/api";
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Path checker
    const isInsidePages = window.location.pathname.includes("/pages/");
    const isProfilePage = window.location.pathname.includes("profile.html");
    const authPath = isInsidePages ? "auth.html" : "pages/auth.html";
    const profilePath = isInsidePages ? "profile.html" : "pages/profile.html";

    // Regex Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // =============================================================
    // 1. NAVBAR & GUARD STATE
    // =============================================================
    const navProfileBtn = document.getElementById("navProfileBtn");
    const navAvatarImg = document.getElementById("navAvatarImg");

    if (navProfileBtn) {
        if (!currentUser) {
            navProfileBtn.setAttribute("href", authPath);
            // Jika belum login dan coba akses profile.html, lempar ke auth.html
            if (isProfilePage) {
                window.location.href = "auth.html";
                return;
            }
        } else {
            navProfileBtn.setAttribute("href", profilePath);
            if (navAvatarImg && currentUser.profile_picture) {
                navAvatarImg.src = isInsidePages ? `../${currentUser.profile_picture}` : currentUser.profile_picture;
            }
        }
    }

    // =============================================================
    // 2. CAROUSEL HOME PAGE (JIKA ADA)
    // =============================================================
    const ambienceCarouselEl = document.getElementById("ambienceCarousel");
    if (ambienceCarouselEl && typeof bootstrap !== "undefined") {
        const carousel = new bootstrap.Carousel(ambienceCarouselEl, {
            interval: 3500,
            ride: "carousel",
            wrap: true
        });

        const prevBtn = document.getElementById("prevAmbienceBtn");
        const nextBtn = document.getElementById("nextAmbienceBtn");

        if (prevBtn) prevBtn.addEventListener("click", () => carousel.prev());
        if (nextBtn) nextBtn.addEventListener("click", () => carousel.next());
    }

    // =============================================================
    // 3. GALLERY FILTER (JIKA ADA)
    // =============================================================
    const filterButtons = document.querySelectorAll(".gallery-filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    if (filterButtons.length > 0) {
        filterButtons.forEach((button) => {
            button.addEventListener("click", function () {
                filterButtons.forEach((btn) => btn.classList.remove("active"));
                this.classList.add("active");

                const selectedCategory = this.getAttribute("data-filter");
                galleryItems.forEach((item) => {
                    const itemCategory = item.getAttribute("data-category");
                    if (selectedCategory === "all" || itemCategory === selectedCategory) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    }

    // =============================================================
    // 4. AUTH LOGIC (LOGIN & SIGN UP MENGGUNAKAN API EXPRESS)
    // =============================================================
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // --- A. PROSES LOGIN REAL ---
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            if (!email || !password) {
                alert("Email dan password wajib diisi!");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (!response.ok) {
                    // Jika password salah atau user tidak ditemukan
                    throw new Error(result.message || "Gagal melakukan login.");
                }

                // Login Berhasil
                localStorage.setItem("currentUser", JSON.stringify(result.user));
                alert("Login berhasil! Mengalihkan ke profil...");
                window.location.href = "profile.html";
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }

    // --- B. PROSES REGISTER REAL ---
    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const name = document.getElementById("registerName").value.trim();
            const email = document.getElementById("registerEmail").value.trim();
            const phone_number = document.getElementById("registerPhone").value.trim();
            const password = document.getElementById("registerPassword").value;

            // Validasi Regex Password
            if (!passwordRegex.test(password)) {
                alert("Password harus minimal 8 karakter, mengandung minimal 1 huruf besar (A-Z), 1 huruf kecil (a-z), dan 1 angka (0-9)!");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, phone_number, password })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Gagal melakukan registrasi.");
                }

                alert("Registrasi berhasil! Silakan login dengan akun Anda.");
                registerForm.reset();
                const loginTabBtn = document.getElementById("login-tab");
                if (loginTabBtn) loginTabBtn.click();
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }

    // =============================================================
    // 5. PROFILE PAGE LOGIC
    // =============================================================
    const profileDisplayImg = document.getElementById("profileDisplayImg");
    const profilePicInput = document.getElementById("profilePicInput");
    const updateProfileForm = document.getElementById("updateProfileForm");
    const logoutBtn = document.getElementById("logoutBtn");

    if (isProfilePage && currentUser) {
        const userDisplayName = document.getElementById("userDisplayName");
        const userDisplayEmail = document.getElementById("userDisplayEmail");
        const userDisplayPhone = document.getElementById("userDisplayPhone");
        const userRoleBadge = document.getElementById("userRoleBadge");
        const profileName = document.getElementById("profileName");
        const profileEmail = document.getElementById("profileEmail");
        const profilePhone = document.getElementById("profilePhone");

        if (userDisplayName) userDisplayName.innerText = currentUser.name;
        if (userDisplayEmail) userDisplayEmail.innerText = currentUser.email;
        if (userDisplayPhone) userDisplayPhone.innerText = currentUser.phone_number;
        if (userRoleBadge) userRoleBadge.innerText = currentUser.role.toUpperCase();
        if (profileName) profileName.value = currentUser.name;
        if (profileEmail) profileEmail.value = currentUser.email;
        if (profilePhone) profilePhone.value = currentUser.phone_number;

        if (profileDisplayImg && currentUser.profile_picture) {
            profileDisplayImg.src = `../${currentUser.profile_picture}`;
        }
    }

    // Preview Foto Profil Saat Dipilih
    if (profilePicInput) {
        profilePicInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (profileDisplayImg) profileDisplayImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- C. PROSES UPDATE PROFILE REAL ---
    if (updateProfileForm) {
        updateProfileForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            if (!currentUser) return;

            const phone_number = document.getElementById("profilePhone").value.trim();
            const newPassword = document.getElementById("profilePassword").value;

            // Validasi Password Baru Jika Diisi
            if (newPassword && newPassword.trim() !== "") {
                if (!passwordRegex.test(newPassword)) {
                    alert("Password baru harus minimal 8 karakter, mengandung minimal 1 huruf besar (A-Z), 1 huruf kecil (a-z), dan 1 angka (0-9)!");
                    return;
                }
            }

            try {
                const response = await fetch(`${API_URL}/profile/${currentUser.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        phone_number: phone_number,
                        password: newPassword,
                        profile_picture: currentUser.profile_picture
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Gagal memperbarui profil.");
                }

                // Update data lokal
                currentUser.phone_number = phone_number;
                localStorage.setItem("currentUser", JSON.stringify(currentUser));

                alert(result.message);
                window.location.reload();
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    }

    // --- D. LOGOUT ---
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            alert("Anda telah berhasil keluar (Log Out).");
            window.location.href = "auth.html";
        });
    }
});