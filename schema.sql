-- =============================================================
-- 1. DATABASE INITIALIZATION
-- =============================================================
DROP DATABASE IF EXISTS makna_pilar_db;
CREATE DATABASE makna_pilar_db;
USE makna_pilar_db;

-- =============================================================
-- 2. DDL (DATA DEFINITION LANGUAGE)
-- =============================================================

-- Table 1: Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table 2: Menu Sections (Beverages, Food, Dessert)
CREATE TABLE menu_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: Menu Categories (Sub-sections)
CREATE TABLE menu_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_section_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_section
        FOREIGN KEY (menu_section_id) REFERENCES menu_sections(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Table 4: Menu Items (Price menggunakan tipe INT)
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    price INT NOT NULL,
    image_url VARCHAR(255) NOT NULL DEFAULT 'images/portrait.jpg',
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_category
        FOREIGN KEY (menu_category_id) REFERENCES menu_categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =============================================================
-- 3. DML (DATA MANIPULATION LANGUAGE / SEED DATA)
-- =============================================================

-- A. SEED USERS
INSERT INTO users (name, email, password, phone_number, role) VALUES
('Super Admin', 'admin@maknaxpilar.com', '$2b$10$YourHashedAdminPasswordHere', '081397695777', 'admin'),
('John Doe', 'johndoe@gmail.com', '$2b$10$YourHashedCustomerPasswordHere', '081234567890', 'customer'),
('Jane Smith', 'janesmith@gmail.com', '$2b$10$YourHashedCustomerPasswordHere', '081987654321', 'customer');

-- B. SEED MENU SECTIONS
INSERT INTO menu_sections (id, name, slug) VALUES
(1, 'Beverages', 'beverages'),
(2, 'Food', 'food'),
(3, 'Dessert', 'dessert');

-- C. SEED MENU CATEGORIES
INSERT INTO menu_categories (id, menu_section_id, name, slug) VALUES
-- Beverages (Section ID: 1)
(1, 1, 'Coffee', 'coffee'),
(2, 1, 'Milk Based', 'milk-based'),
(3, 1, 'Mocktail', 'mocktail'),
(4, 1, 'Tea', 'tea'),
(5, 1, 'Juice', 'juice'),
(6, 1, 'Mojito', 'mojito'),

-- Food (Section ID: 2)
(7, 2, 'Western & Steak', 'western-steak'),
(8, 2, 'Asian Delight', 'asian-delight'),
(9, 2, 'Pilar Nusantara', 'pilar-nusantara'),
(10, 2, 'Menu Cobek', 'menu-cobek'),
(11, 2, 'Bites & Snacks', 'bites-snacks'),
(12, 2, 'Burger & Pasta', 'burger-pasta'),

-- Dessert (Section ID: 3)
(13, 3, 'Desserts', 'desserts');


INSERT INTO
	menu_items (menu_category_id, name, description, price, image_url, is_favorite)
VALUES
	-- Coffee
	(1, 'Makna Kopi', 'Signature iced espresso with creamy milk blend', 24000, 'images/portrait.jpg', TRUE),
	(1, 'Makna Aren', 'Espresso with rich organic palm sugar and fresh milk', 24000, 'images/portrait.jpg', FALSE),
	(1, 'Irish Cream Coffee', 'Creamy aromatic coffee with Irish cream flavour', 28000, 'images/portrait.jpg', FALSE),
	(1, 'Butterscotch Latte', 'Smooth latte infused with butterscotch hints', 25000, 'images/portrait.jpg', FALSE),
	(1, 'Vanilla Latte', 'Classic espresso and steamed milk with vanilla', 25000, 'images/portrait.jpg', FALSE),
	(1, 'Latte', 'Fresh espresso balanced with velvety steamed milk', 24000, 'images/portrait.jpg', FALSE),
	(1, 'Americano', 'Rich double shot espresso topped with hot/iced water', 24000, 'images/portrait.jpg', FALSE),
	(1, 'Cappuccino', 'Bold espresso with rich frothed milk foam', 25000, 'images/portrait.jpg', FALSE),
	(1, 'Espresso', 'Pure single extraction specialty beans', 17000, 'images/portrait.jpg', FALSE),

	-- Milk Based
	(2, 'Chocolate', 'Rich and decadent artisan dark cocoa blend', 28000, 'images/portrait.jpg', FALSE),
	(2, 'Matcha Latte', 'Authentic Japanese Uji matcha with steamed milk', 35000, 'images/portrait.jpg', FALSE),
	(2, 'Matcha Strawberry', 'Layered matcha latte with real strawberry puree', 35000, 'images/portrait.jpg', FALSE),
	(2, 'Milkshake Vanilla', 'Creamy vanilla ice cream shake', 27000, 'images/portrait.jpg', FALSE),
	(2, 'Milkshake Strawberry', 'Fresh strawberry blended milkshake', 27000, 'images/portrait.jpg', FALSE),
	(2, 'Milkshake Oreo', 'Classic cookies & cream oreo blend', 27000, 'images/portrait.jpg', FALSE),

	-- Mocktail
	(3, 'Black Markisa', 'Sparkling cold brew infused with passion fruit', 24000, 'images/portrait.jpg', FALSE),
	(3, 'Black Apple', 'Crisp cold brew layered with green apple notes', 24000, 'images/portrait.jpg', FALSE),
	(3, 'Black Lemon', 'Refreshing citrus lemon paired with cold brew coffee', 24000, 'images/portrait.jpg', FALSE),
	(3, 'Black Berry', 'Deep blackberry and wild berry coffee mocktail', 24000, 'images/portrait.jpg', FALSE),

	-- Tea
	(4, 'Tea', 'Freshly brewed house classic tea', 15000, 'images/portrait.jpg', FALSE),
	(4, 'Sweet Tea', 'Classic sweet aromatic tea', 15000, 'images/portrait.jpg', FALSE),
	(4, 'Lemon Tea', 'Real squeezed lemon with freshly brewed iced tea', 20000, 'images/portrait.jpg', FALSE),
	(4, 'Lychee Tea', 'Sweet fragrant tea with whole lychee fruit', 23000, 'images/portrait.jpg', FALSE),
	(4, 'Artisan Tea', 'Curated loose leaf botanical blend', 30000, 'images/portrait.jpg', FALSE),

	-- Juice
	(5, 'Fresh Orange Juice', '100% freshly pressed sweet oranges', 23000, 'images/portrait.jpg', FALSE),
	(5, 'Strawberry Juice', 'Pure fresh strawberry blended smooth', 23000, 'images/portrait.jpg', FALSE),
	(5, 'Avocado Juice', 'Creamy ripe avocado with chocolate drizzle', 23000, 'images/portrait.jpg', FALSE),
	(5, 'Sirsak Juice', 'Refreshing soursop juice', 23000, 'images/portrait.jpg', FALSE),
	(5, 'Mango Juice', 'Sweet tropical mango blend', 23000, 'images/portrait.jpg', FALSE),
	(5, 'Tropical Green', 'Healthy detox kiwi, mint and apple juice', 27000, 'images/portrait.jpg', FALSE),
	(5, 'Dragon Fruit', 'Vibrant fresh red dragon fruit juice', 23000, 'images/portrait.jpg', FALSE),

	-- Mojito
	(6, 'Lychee Mojito', 'Sparkling soda, lime, mint, and sweet lychee', 23000, 'images/portrait.jpg', FALSE),
	(6, 'Leaf Mint Mojito', 'Classic virgin crushed mint and zesty lime', 23000, 'images/portrait.jpg', FALSE),
	(6, 'Marquisa Mojito', 'Tangy passion fruit mojito cooler', 23000, 'images/portrait.jpg', FALSE),
	(6, 'Strawberry Mojito', 'Fizzy strawberry cooler with fresh garden mint', 23000, 'images/portrait.jpg', FALSE),

	-- Western & Steak
	(7, 'Rib Eye Meltique Steak', 'Grilled rib eye served with choices of potato, vegetable, and sauce', 130000, 'images/portrait.jpg', TRUE),
	(7, 'Grilled Chicken Steak', 'Grilled chicken served with choices of potato & mixed salad', 75000, 'images/portrait.jpg', FALSE),
	(7, 'Jeanelle Cheese Chicken Steak', 'Grilled chicken breast with melted mozzarella and white sauce', 75000, 'images/portrait.jpg', FALSE),
	(7, 'Local Tenderloin Steak', 'Grilled tenderloin with potato and mixed seasonal salad', 84000, 'images/portrait.jpg', FALSE),
	(7, 'Local Sirloin Steak', 'Grilled sirloin with potato choices and brown sauce', 84000, 'images/portrait.jpg', FALSE),
	(7, 'Fish & Chips', 'Fried fish in crispy batter served with french fries & tartar', 68000, 'images/portrait.jpg', FALSE),
	(7, 'Chicken Cordon Bleu', 'Breaded chicken stuffed with smoked beef & cheese', 75000, 'images/portrait.jpg', FALSE),

	-- Asian Delight
	(8, 'Capcay Goreng Khas Pilar', 'Wok fried fresh vegetables served with warm rice', 27000, 'images/portrait.jpg', FALSE),
	(8, 'Kwetiau Goreng Khas Pilar', 'Stir fried flat noodles with prawn, chicken, and egg', 40000, 'images/portrait.jpg', FALSE),

	-- Pilar Nusantara
	(9, 'Sop Buntut', 'Sajian sop buntut sapi rempah dengan nasi, emping & lalaban', 85000, 'images/portrait.jpg', TRUE),
	(9, 'Ayam Bakar Taliwang', 'Ayam bakar bumbu Lombok nikmat dengan plecing & tahu tempe', 60000, 'images/portrait.jpg', FALSE),
	(9, 'Nasi Rames Mak Mer', 'Nasi dengan ayam kremes, paru balado, karedok & sambal matah', 63000, 'images/portrait.jpg', FALSE),
	(9, 'Nasi Rames Ala Mak Jo', 'Nasi ayam kremes, ikan dori, paru sambal balado & lalaban', 63000, 'images/portrait.jpg', FALSE),
	(9, 'Soto Ayam', 'Soto ayam kuah kuning lengkap dengan telur, soun, tauge & nasi', 45000, 'images/portrait.jpg', FALSE),
	(9, 'Nasi Goreng Pilar Kayu', 'Nasi goreng resep khas Chef dengan telur, kerupuk & lalaban', 38000, 'images/portrait.jpg', FALSE),
	(9, 'Nasi Goreng Matah', 'Nasi goreng bumbu Bali disajikan dengan telur mata sapi & emping', 40000, 'images/portrait.jpg', FALSE),
	(9, 'Sop Iga', 'Sop iga sapi berkuah kaldu gurih dengan sambal ceurik & kerupuk', 65000, 'images/portrait.jpg', FALSE),
	(9, 'Soto Bandung', 'Soto potongan daging sapi, babat, lobak & kedelai goreng', 47000, 'images/portrait.jpg', FALSE),
	(9, 'Ikan Dori Sambal Matah', 'Ikan dori crispy sambal matah nusantara dengan nasi & lalaban', 51000, 'images/portrait.jpg', FALSE),
	(9, 'Mie Tek Tek', 'Mie kuah khas Bandung dengan suwir ayam, sayur & kerupuk', 30000, 'images/portrait.jpg', FALSE),

	-- Menu Cobek
	(10, 'Iga Bakar Sambal Tempong', 'Dilengkapi nasi putih, terong goreng, tahu tempe & lalaban', 65000, 'images/portrait.jpg', FALSE),
	(10, 'Ayam Cobek Sambal Korek', 'Ayam goreng sambal korek, nasi putih, tahu tempe & lalaban', 35000, 'images/portrait.jpg', FALSE),

	-- Bites & Snacks
	(11, 'Lumpia', 'Kulit pastry isi bihun, sayur & suwir ayam sambal bangkok', 15000, 'images/portrait.jpg', FALSE),
	(11, 'Cibay', 'Camilan aci suwir ayam pedas khas Sunda', 10000, 'images/portrait.jpg', FALSE),
	(11, 'Martabak Tahu', 'Gorengan renyah adonan tahu & cincang ayam', 15000, 'images/portrait.jpg', FALSE),
	(11, 'Beef Puff', 'Pastry renyah dengan saus beef bolognaise & mozzarella', 25000, 'images/portrait.jpg', FALSE),
	(11, 'Strawberry Puff', 'Pastry manis dengan isian selai strawberry wangi', 21000, 'images/portrait.jpg', FALSE),
	(11, 'Sosis Puff', 'Pastry gurih renyah dengan sosis sapi & mozarella', 30000, 'images/portrait.jpg', FALSE),
	(11, 'Cireng Goreng', 'Cireng khas Jawa Barat renyah dengan bumbu rujak pedas', 25000, 'images/portrait.jpg', FALSE),
	(11, 'Tahu Lada Garam', 'Tahu crispy tabur cabe rawit, bawang putih & garam gurih', 21000, 'images/portrait.jpg', FALSE),
	(11, 'Poutine Potato', 'Kentang goreng siram saus bolognaise & melted mozarella', 45000, 'images/portrait.jpg', FALSE),
	(11, 'Mix Platter', 'Paket sharing jamur goreng, french fries, sosis & nugget', 65000, 'images/portrait.jpg', FALSE),
	(11, 'French Fries', 'Classic crispy salted french fries', 21000, 'images/portrait.jpg', FALSE),
	(11, 'Potato Wedges', 'Seasoned skin-on potato wedges', 27000, 'images/portrait.jpg', FALSE),
	(11, 'Pisang Goreng / Bakar', 'Pilihan topping Palm Sugar atau Coklat Keju', 28000, 'images/portrait.jpg', FALSE),

	-- Burger & Pasta
	(12, 'Cheese Burger', 'Beef burger patties, french fries, and melted yellow cheese', 50000, 'images/portrait.jpg', FALSE),
	(12, 'Aglio Olio Smoked Beef', 'Spaghetti with garlic, smoked beef, chili flakes & garlic bread', 58000, 'images/portrait.jpg', TRUE),
	(12, 'Bolognese', 'Pasta with minced ground beef, rich tomato sauce & herbs', 58000, 'images/portrait.jpg', FALSE),
	(12, 'Carbonara', 'Creamy pasta sauce with onion, capsicum, salmon & garlic bread', 60000, 'images/portrait.jpg', FALSE),

	-- Desserts
	(13, 'Avo Kocok', 'Dessert alpukat kocok segar dengan susu kental manis', 23000, 'images/portrait.jpg', FALSE),
	(13, 'Es Campur Pilar Rasa', 'Es campur legendaris aneka buah dan jelly segar', 35000, 'images/portrait.jpg', TRUE),
	(13, 'Es Cream Sundae Ala Pilar', 'Sundae es krim manis dengan saus coklat & wafer renyah', 25000, 'images/portrait.jpg', FALSE),
	(13, 'Es Kuwut', 'Es kelapa melon khas Bali dengan perasan jeruk nipis', 23000, 'images/portrait.jpg', FALSE),
	(13, 'Dragon Fruity Coconut', 'Campuran kelapa muda dan buah naga segar', 32000, 'images/portrait.jpg', FALSE)
;