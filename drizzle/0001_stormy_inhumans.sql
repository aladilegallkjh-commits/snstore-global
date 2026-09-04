CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int,
	`variantId` int,
	`productName` varchar(180) NOT NULL,
	`variantLabel` varchar(200),
	`quantity` int NOT NULL,
	`unitPrice` decimal(12,2) NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(30) NOT NULL,
	`customerName` varchar(160),
	`city` varchar(100),
	`state` varchar(80),
	`origin` varchar(60) DEFAULT 'site',
	`subtotal` decimal(12,2) NOT NULL,
	`status` enum('Carrinho','WhatsApp iniciado','Em negociação','Confirmado','Cancelado','Concluído') NOT NULL DEFAULT 'Carrinho',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`storage` varchar(40),
	`ram` varchar(40),
	`color` varchar(60),
	`simType` varchar(60),
	`price` decimal(12,2),
	`promotionalPrice` decimal(12,2),
	`sku` varchar(100) NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`status` enum('Disponível','Indisponível','Reservado','Vendido','Sob consulta') NOT NULL DEFAULT 'Disponível',
	`supplierLot` varchar(100),
	CONSTRAINT `product_variants_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_variants_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int,
	`name` varchar(180) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`description` text,
	`condition` enum('Novo','Seminovo','Acessório') NOT NULL,
	`featured` boolean NOT NULL DEFAULT false,
	`published` boolean NOT NULL DEFAULT false,
	`status` enum('Publicado','Rascunho','Esgotado','Reservado','Vendido') NOT NULL DEFAULT 'Rascunho',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `store_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeName` varchar(160) NOT NULL,
	`logoUrl` text,
	`whatsapp` varchar(30),
	`instagram` varchar(120),
	`email` varchar(320),
	`description` text,
	`defaultWhatsappMessage` text,
	`defaultWarranty` text,
	`stockNotice` text,
	`cpoExplanation` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `store_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `used_devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`storage` varchar(40),
	`color` varchar(60),
	`batteryHealth` int,
	`batteryCycles` int,
	`price` decimal(12,2),
	`appleWarrantyUntil` timestamp,
	`storeWarrantyDays` int DEFAULT 90,
	`sku` varchar(100) NOT NULL,
	`status` enum('Disponível','Reservado','Vendido') NOT NULL DEFAULT 'Disponível',
	CONSTRAINT `used_devices_id` PRIMARY KEY(`id`),
	CONSTRAINT `used_devices_sku_unique` UNIQUE(`sku`)
);
