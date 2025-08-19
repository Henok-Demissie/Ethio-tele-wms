-- Seed initial data for EthioTelecom Warehouse Management System

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role, department) VALUES
('System Administrator', 'admin@ethiotelecom.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'IT'),
('Warehouse Manager', 'manager@ethiotelecom.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 'Warehouse'),
('Inventory Supervisor', 'supervisor@ethiotelecom.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'supervisor', 'Logistics'),
('Warehouse Operator', 'operator@ethiotelecom.et', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operator', 'Warehouse');

-- Insert warehouses
INSERT INTO warehouses (name, location, capacity, manager_id) VALUES
('Main Warehouse', 'Addis Ababa Central', 10000, (SELECT id FROM users WHERE email = 'manager@ethiotelecom.et')),
('Regional Warehouse North', 'Bahir Dar', 5000, (SELECT id FROM users WHERE email = 'supervisor@ethiotelecom.et')),
('Regional Warehouse South', 'Hawassa', 5000, (SELECT id FROM users WHERE email = 'supervisor@ethiotelecom.et'));

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Network Equipment', 'Routers, switches, and networking hardware'),
('Telecommunications', 'Phones, modems, and communication devices'),
('Cables & Accessories', 'Various cables, connectors, and accessories'),
('Power & Backup', 'UPS systems, batteries, and power equipment'),
('Tools & Maintenance', 'Installation and maintenance tools'),
('Office Supplies', 'General office and administrative supplies');

-- Insert suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('TechCorp Ethiopia', 'John Smith', 'sales@techcorp.et', '+251-11-123-4567', 'Bole, Addis Ababa'),
('Network Solutions Ltd', 'Sarah Johnson', 'info@netsol.et', '+251-11-234-5678', 'Kazanchis, Addis Ababa'),
('Power Systems Inc', 'Michael Brown', 'contact@powersys.et', '+251-11-345-6789', 'Merkato, Addis Ababa'),
('Cable & Wire Co', 'Emma Wilson', 'orders@cableco.et', '+251-11-456-7890', 'Piassa, Addis Ababa');

-- Insert products
INSERT INTO products (name, sku, description, category_id, unit_price, unit, minimum_stock, maximum_stock) VALUES
('Cisco Router 2900 Series', 'RTR-2900-001', 'Enterprise-grade router for network infrastructure', 
 (SELECT id FROM categories WHERE name = 'Network Equipment'), 15000.00, 'piece', 5, 50),
('Ethernet Cable Cat6', 'CBL-CAT6-001', 'High-speed ethernet cable 305m roll', 
 (SELECT id FROM categories WHERE name = 'Cables & Accessories'), 250.00, 'roll', 20, 200),
('UPS 3000VA', 'UPS-3000-001', 'Uninterruptible power supply 3000VA capacity', 
 (SELECT id FROM categories WHERE name = 'Power & Backup'), 8500.00, 'piece', 10, 100),
('IP Phone Cisco 7841', 'PHN-7841-001', 'VoIP desk phone with advanced features', 
 (SELECT id FROM categories WHERE name = 'Telecommunications'), 1200.00, 'piece', 15, 150),
('Network Switch 24-Port', 'SWT-24P-001', '24-port managed ethernet switch', 
 (SELECT id FROM categories WHERE name = 'Network Equipment'), 5500.00, 'piece', 8, 80),
('Fiber Optic Cable SM', 'CBL-FO-SM-001', 'Single-mode fiber optic cable 1km', 
 (SELECT id FROM categories WHERE name = 'Cables & Accessories'), 450.00, 'km', 25, 250);

-- Insert initial inventory
INSERT INTO inventory (product_id, warehouse_id, quantity) VALUES
((SELECT id FROM products WHERE sku = 'RTR-2900-001'), (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 25),
((SELECT id FROM products WHERE sku = 'CBL-CAT6-001'), (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 150),
((SELECT id FROM products WHERE sku = 'UPS-3000-001'), (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 45),
((SELECT id FROM products WHERE sku = 'PHN-7841-001'), (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 80),
((SELECT id FROM products WHERE sku = 'SWT-24P-001'), (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 35),
((SELECT id FROM products WHERE sku = 'CBL-FO-SM-001'), (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 120);

-- Insert sample orders
INSERT INTO orders (order_number, supplier_id, warehouse_id, status, order_date, expected_date, total_amount, created_by) VALUES
('PO-2024-001', (SELECT id FROM suppliers WHERE name = 'TechCorp Ethiopia'), 
 (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 'pending', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 75000.00,
 (SELECT id FROM users WHERE email = 'manager@ethiotelecom.et')),
('PO-2024-002', (SELECT id FROM suppliers WHERE name = 'Network Solutions Ltd'), 
 (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 'approved', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 32500.00,
 (SELECT id FROM users WHERE email = 'manager@ethiotelecom.et'));

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
((SELECT id FROM orders WHERE order_number = 'PO-2024-001'), (SELECT id FROM products WHERE sku = 'RTR-2900-001'), 5, 15000.00),
((SELECT id FROM orders WHERE order_number = 'PO-2024-002'), (SELECT id FROM products WHERE sku = 'SWT-24P-001'), 6, 5500.00);

-- Insert sample alerts
INSERT INTO alerts (type, title, message, severity, related_id) VALUES
('low_stock', 'Low Stock Alert', 'Cisco Router 2900 Series is running low on stock', 'medium', 
 (SELECT id FROM products WHERE sku = 'RTR-2900-001')),
('system', 'System Maintenance', 'Scheduled maintenance window this weekend', 'low', NULL),
('security', 'Unauthorized Access Attempt', 'Multiple failed login attempts detected', 'high', NULL);

-- Insert initial stock movements
INSERT INTO stock_movements (product_id, warehouse_id, movement_type, quantity, reference_number, created_by) VALUES
((SELECT id FROM products WHERE sku = 'RTR-2900-001'), (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 'in', 25, 'INIT-001', 
 (SELECT id FROM users WHERE email = 'admin@ethiotelecom.et')),
((SELECT id FROM products WHERE sku = 'CBL-CAT6-001'), (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 'in', 150, 'INIT-002', 
 (SELECT id FROM users WHERE email = 'admin@ethiotelecom.et')),
((SELECT id FROM products WHERE sku = 'UPS-3000-001'), (SELECT id FROM warehouses WHERE name = 'Main Warehouse'), 'in', 45, 'INIT-003', 
 (SELECT id FROM users WHERE email = 'admin@ethiotelecom.et'));
