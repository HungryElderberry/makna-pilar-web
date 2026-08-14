// ==================== CART MANAGEMENT SYSTEM (cart.js) ====================

// 1. Ambil data keranjang dari LocalStorage
function getCart() {
	return JSON.parse(localStorage.getItem("userCart")) || [];
}

// 2. Simpan data keranjang ke LocalStorage & perbarui badge
function saveCart(cart) {
	localStorage.setItem("userCart", JSON.stringify(cart));
	updateCartBadge();
}

// 3. Update angka badge keranjang di Navbar (Semua Halaman)
function updateCartBadge() {
	const cart = getCart();
	const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
	const badges = document.querySelectorAll(".cart-badge");

	badges.forEach((badge) => {
		badge.innerText = totalItems;
	});
}

// 4. Tambah Item ke Keranjang
function addToCart(item) {
	let cart = getCart();
	const existingIndex = cart.findIndex((i) => i.name === item.name);

	if (existingIndex > -1) {
		cart[existingIndex].quantity += 1;
	} else {
		cart.push({
			id: item.id || Date.now(),
			name: item.name,
			price: item.price,
			image: item.image,
			quantity: 1
		});
	}

	saveCart(cart);
	showToastNotification(`${item.name} berhasil ditambahkan ke keranjang!`);
}

// 5. Ubah Jumlah Item (+ atau -)
function updateQuantity(index, change) {
	let cart = getCart();
	if (!cart[index]) return;

	cart[index].quantity += change;

	if (cart[index].quantity <= 0) {
		cart.splice(index, 1);
	}

	saveCart(cart);
	renderCartItems();
}

// 6. Hapus Item Tertentu dari Keranjang
function removeFromCart(index) {
	let cart = getCart();
	cart.splice(index, 1);
	saveCart(cart);
	renderCartItems();
}

// 7. Notifikasi Toast Feedback
function showToastNotification(message) {
	// Buat container toast jika belum ada
	let toastContainer = document.getElementById("toast-container");
	if (!toastContainer) {
		toastContainer = document.createElement("div");
		toastContainer.id = "toast-container";
		toastContainer.style.position = "fixed";
		toastContainer.style.bottom = "20px";
		toastContainer.style.right = "20px";
		toastContainer.style.zIndex = "9999";
		document.body.appendChild(toastContainer);
	}

	const toast = document.createElement("div");
	toast.className = "alert alert-dark shadow-lg py-2 px-3 mb-2 rounded-3 text-white";
	toast.style.backgroundColor = "var(--bg-dark)";
	toast.style.border = "1px solid var(--accent-orange)";
	toast.style.fontSize = "0.9rem";
	toast.innerHTML = `<i class="bi bi-bag-check-fill text-warning me-2"></i>${message}`;

	toastContainer.appendChild(toast);

	setTimeout(() => {
		toast.remove();
	}, 2500);
}

// 8. Render Tampilan Item di Halaman cart.html
function renderCartItems() {
	const cartListContainer = document.getElementById("cartItemsList");
	const subtotalEl = document.getElementById("cartSubtotal");
	const taxEl = document.getElementById("cartTax");
	const grandTotalEl = document.getElementById("cartGrandTotal");
	const emptyCartMsg = document.getElementById("emptyCartMessage");
	const checkoutBtn = document.getElementById("checkoutBtn");

	if (!cartListContainer) return; // Jika tidak di halaman cart.html, skip

	const cart = getCart();

	if (cart.length === 0) {
		cartListContainer.innerHTML = "";
		if (emptyCartMsg) emptyCartMsg.classList.remove("d-none");
		if (checkoutBtn) checkoutBtn.disabled = true;
		if (subtotalEl) subtotalEl.innerText = "Rp 0";
		if (taxEl) taxEl.innerText = "Rp 0";
		if (grandTotalEl) grandTotalEl.innerText = "Rp 0";
		return;
	}

	if (emptyCartMsg) emptyCartMsg.classList.add("d-none");
	if (checkoutBtn) checkoutBtn.disabled = false;

	let subtotal = 0;
	let html = "";

	cart.forEach((item, index) => {
		const itemTotal = item.price * item.quantity;
		subtotal += itemTotal;

		html += `
			<div class="d-flex align-items-center justify-content-between py-3 border-bottom">
				<div class="d-flex align-items-center gap-3">
					<img src="${item.image}" alt="${item.name}" class="rounded-3 object-fit-cover" style="width: 65px; height: 65px;" />
					<div>
						<h6 class="fw-bold mb-1">${item.name}</h6>
						<p class="text-secondary small mb-0">Rp ${item.price.toLocaleString("id-ID")}</p>
					</div>
				</div>

				<div class="d-flex align-items-center gap-4">
					<div class="d-flex align-items-center gap-2">
						<button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="updateQuantity(${index}, -1)">-</button>
						<span class="fw-bold px-1">${item.quantity}</span>
						<button class="btn btn-sm btn-outline-secondary px-2 py-0" onclick="updateQuantity(${index}, 1)">+</button>
					</div>
					<div class="text-end" style="min-width: 100px;">
						<span class="fw-bold text-dark">Rp ${itemTotal.toLocaleString("id-ID")}</span>
					</div>
					<button class="btn btn-sm text-danger" onclick="removeFromCart(${index})" title="Hapus Item">
						<i class="bi bi-trash3-fill"></i>
					</button>
				</div>
			</div>
		`;
	});

	cartListContainer.innerHTML = html;

	// Perhitungan Pajak PB1 Resto 10%
	const tax = Math.round(subtotal * 0.1);
	const grandTotal = subtotal + tax;

	if (subtotalEl) subtotalEl.innerText = `Rp ${subtotal.toLocaleString("id-ID")}`;
	if (taxEl) taxEl.innerText = `Rp ${tax.toLocaleString("id-ID")}`;
	if (grandTotalEl) grandTotalEl.innerText = `Rp ${grandTotal.toLocaleString("id-ID")}`;
}

// Inisialisasi Event Listener
document.addEventListener("DOMContentLoaded", function () {
	// 1. Sinkronisasi Badge saat halaman dibuka
	updateCartBadge();

	// 2. Render jika sedang di cart.html
	renderCartItems();

	// 3. Pasang Event Listener otomatis untuk semua tombol Add to Cart di Menu/Home
	document.addEventListener("click", function (e) {
		const btn = e.target.closest(".btn-orange");
		if (btn && btn.innerText.includes("Add to Cart")) {
			e.preventDefault();

			const foodCard = btn.closest(".food-card");
			if (foodCard) {
				const name = foodCard.querySelector("h6").innerText.trim();
				const priceText = foodCard.querySelector("p").innerText.replace(/[^0-9]/g, "");
				const price = parseInt(priceText, 10);
				const img = foodCard.querySelector("img").getAttribute("src");

				addToCart({
					name: name,
					price: price,
					image: img
				});
			}
		}
	});
});