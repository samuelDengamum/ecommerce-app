/**
 * @file server.js
 * @description Main entry point for the backend Node.js application. 
 * Connects to MongoDB, setups up Express server, socket.io and seeds initial data.
 */

const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const FOOD_TERMS = [
	'food',
	'drink',
	'beverage',
	'grocery',
	'groceries',
	'kitchen',
	'snack',
	'cookie',
	'chocolate',
	'milk',
	'juice',
	'coffee',
	'tea',
	'burger',
	'pizza',
	'noodle',
	'pasta',
	'sauce',
	'honey',
	'cooking',
	'olive-oil',
	'ice-cream',
];

const ALLOWED_IMAGE_CATEGORIES = new Set([
	'smartphones',
	'laptops',
	'tablets',
	'mobile-accessories',
	'sports-accessories',
	'mens-watches',
	'womens-watches',
	'sunglasses',
	'womens-bags',
	'womens-shoes',
	'womens-dresses',
	'mens-shirts',
	'mens-shoes',
	'tops',
	'womens-jewellery',
	'home-decoration',
	'furniture',
	'vehicle',
	'motorcycle',
]);

const PRICE_RULES = {
	smartphones: { min: 179, max: 999 },
	laptops: { min: 429, max: 1999 },
	tablets: { min: 149, max: 899 },
	'mobile-accessories': { min: 19, max: 149 },
	'sports-accessories': { min: 25, max: 189 },
	'mens-watches': { min: 69, max: 499 },
	'womens-watches': { min: 69, max: 499 },
	sunglasses: { min: 39, max: 199 },
	'womens-bags': { min: 49, max: 249 },
	'womens-shoes': { min: 49, max: 229 },
	'womens-dresses': { min: 39, max: 229 },
	'mens-shirts': { min: 29, max: 139 },
	'mens-shoes': { min: 49, max: 239 },
	tops: { min: 25, max: 119 },
	'womens-jewellery': { min: 59, max: 499 },
	'home-decoration': { min: 25, max: 199 },
	furniture: { min: 99, max: 1299 },
	vehicle: { min: 799, max: 5999 },
	motorcycle: { min: 1299, max: 7499 },
	default: { min: 29, max: 399 },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toConvenientPrice = (value) => {
	const roundedToFive = Math.round(value / 5) * 5;
	return clamp(roundedToFive - 1, 9, 9999);
};

const getConvenientPrice = (rawPrice, categoryKey) => {
	const base = Number.isFinite(rawPrice) ? rawPrice : 50;
	const rule = PRICE_RULES[categoryKey] || PRICE_RULES.default;
	const discounted = base * 0.88;
	const normalized = clamp(Math.round(discounted), rule.min, rule.max);
	return toConvenientPrice(normalized);
};

const hasFoodTerm = (value = '') => {
	const text = String(value).toLowerCase();
	return FOOD_TERMS.some((term) => text.includes(term));
};

const buildProductImage = (keyword, index) => {
	// Fallback image if remote image discovery fails.
	const id = (index % 12) + 1;
	return `/images/products/${id}.svg`;
};

const fetchCuratedProducts = async (count) => {
	try {
		const response = await fetch('https://dummyjson.com/products?limit=194&skip=0');
		if (!response.ok) {
			throw new Error(`Image API failed with status ${response.status}`);
		}

		const payload = await response.json();
		const products = Array.isArray(payload.products) ? payload.products : [];

		const nonFoodProducts = products.filter((item) => {
			if (!ALLOWED_IMAGE_CATEGORIES.has(item.category)) {
				return false;
			}
			const lookup = `${item.category || ''} ${item.title || ''} ${item.description || ''}`;
			return !hasFoodTerm(lookup);
		});

		const curatedProducts = [];
		const seen = new Set();
		for (const item of nonFoodProducts) {
			const image = item.thumbnail || (Array.isArray(item.images) ? item.images[0] : null);
			if (!image || seen.has(image) || hasFoodTerm(image)) {
				continue;
			}
			seen.add(image);
			const categoryKey = String(item.category || 'general');
			const convenientPrice = getConvenientPrice(Number(item.price) || 50, categoryKey);
			curatedProducts.push({
				name: item.title,
				description: item.description,
				price: convenientPrice,
				category: categoryKey.replace(/-/g, ' '),
				image,
				stock: Math.max(1, Number(item.stock) || 10),
			});

			if (curatedProducts.length >= count) {
				break;
			}
		}

		if (curatedProducts.length < count) {
			console.warn(`Only found ${curatedProducts.length} curated non-food products from remote source.`);
		}

		return curatedProducts;
	} catch (error) {
		console.warn(`Could not fetch curated products: ${error.message}`);
		return [];
	}
};

const buildCatalog = async (count) => {
	const curatedProducts = await fetchCuratedProducts(count);
	if (curatedProducts.length >= count) {
		return curatedProducts.slice(0, count);
	}

	// Fallback-only branch.
	const products = [...curatedProducts];
	for (let index = products.length; index < count; index += 1) {
		products.push({
			name: `Product ${index + 1}`,
			description: 'Premium quality product with reliable performance and modern design.',
			price: 50 + index,
			category: 'general',
			image: buildProductImage('product', index),
			stock: 10 + (index % 25),
		});
	}

	return products;
};

const seedData = async () => {
	const userCount = await User.countDocuments();
	const productCount = await Product.countDocuments();

	if (userCount === 0 && productCount === 0) {
		console.log('Seeding database with initial data...');
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash('password123', salt);

		await User.insertMany([
			{ name: 'Admin User', email: 'admin@superstore.com', password: hashedPassword, role: 'admin' },
			{ name: 'Demo Buyer', email: 'user@superstore.com', password: hashedPassword, role: 'user' },
		]);

		const generatedCatalog = await buildCatalog(100);
		await Product.insertMany(generatedCatalog);
		console.log('Database seeding complete');
	} else if (productCount > 0) {
		const targetCount = 100;
		const generatedCatalog = await buildCatalog(targetCount);
		const existingProducts = await Product.find().sort({ createdAt: 1, _id: 1 }).limit(targetCount);

		const needsUpdate =
			existingProducts.length !== targetCount ||
			existingProducts.some((product, index) => {
				const nextProduct = generatedCatalog[index];
				if (!nextProduct) return true;
				return (
					product.name !== nextProduct.name ||
					product.description !== nextProduct.description ||
					product.category !== nextProduct.category ||
					product.price !== nextProduct.price ||
					product.stock !== nextProduct.stock ||
					product.image !== nextProduct.image
				);
			});

		if (needsUpdate) {
			console.log('Synchronizing product catalog for name/image/description consistency...');

			const updateOps = existingProducts.map((product, index) => ({
				updateOne: {
					filter: { _id: product._id },
					update: { $set: generatedCatalog[index] },
				},
			}));

			if (updateOps.length > 0) {
				await Product.bulkWrite(updateOps, { ordered: false });
			}

			if (existingProducts.length < targetCount) {
				await Product.insertMany(generatedCatalog.slice(existingProducts.length));
			}

			if (productCount > targetCount) {
				const idsToKeep = existingProducts.map((product) => product._id);
				await Product.deleteMany({ _id: { $nin: idsToKeep } });
			}

			console.log('Catalog synchronization complete');
		}
	}
};

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

const io = require('socket.io')(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

let connectedUsers = {}; // { sessionId: { name, email, online } }
let admins = new Set();
let chatHistory = {}; // { sessionId: [messages] }

io.on('connection', (socket) => {
	console.log('Client connected:', socket.id);

	socket.on('join', (profile) => {
		if (profile.role === 'admin') {
			admins.add(socket.id);
			socket.emit('active_chats', chatHistory);
			socket.emit('connected_users', connectedUsers);
		} else {
			const { sessionId, name, email } = profile;
			socket.sessionId = sessionId; // Attach to socket instance
			socket.join(sessionId); // User joins their own session room

			connectedUsers[sessionId] = { name: name || 'Guest', email, online: true };
			if (!chatHistory[sessionId]) {
				chatHistory[sessionId] = [];
			}
			
			// Notify admins a user joined
			admins.forEach(adminId => {
				io.to(adminId).emit('user_joined', { 
					sessionId, 
					profile: connectedUsers[sessionId],
					history: chatHistory[sessionId]
				});
			});

			// Catch up the user with their history
			socket.emit('chat_history', chatHistory[sessionId]);
		}
	});

	socket.on('user_msg', (data) => {
		const sessionId = socket.sessionId || data.sessionId;
		if (!sessionId) return;

		const msgPayload = {
			id: Date.now().toString(),
			text: data.text,
			sender: 'user',
			time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			sessionId: sessionId
		};
		
		if (!chatHistory[sessionId]) chatHistory[sessionId] = [];
		chatHistory[sessionId].push(msgPayload);

		// Broadcast to all admins
		let adminOnline = false;
		admins.forEach(adminId => {
			adminOnline = true;
			io.to(adminId).emit('receive_admin_msg', msgPayload);
		});

		// Auto-reply if user says "hi" or "hello" (useful for testing)
		const textLower = data.text.toLowerCase().trim();
		if (textLower === 'hi' || textLower === 'hello') {
			setTimeout(() => {
				const autoReply = {
					id: (Date.now() + 1).toString(),
					text: "Hello there! How can we assist you today? 🌟",
					sender: 'agent',
					time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
					sessionId: sessionId
				};
				chatHistory[sessionId].push(autoReply);
				io.to(sessionId).emit('receive_user_msg', autoReply);
				admins.forEach(a => io.to(a).emit('receive_admin_msg', autoReply));
			}, 1000);
		}
	});

	socket.on('admin_msg', (data) => {
		const msgPayload = {
			id: Date.now().toString(),
			text: data.text,
			sender: 'agent',
			time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			sessionId: data.targetSessionId
		};
		
		if (!chatHistory[data.targetSessionId]) {
			chatHistory[data.targetSessionId] = [];
		}
		chatHistory[data.targetSessionId].push(msgPayload);
		
		// Send to the specific user room (any of their open tabs)
		io.to(data.targetSessionId).emit('receive_user_msg', msgPayload);
		
		// Broadcast to other admins to sync state
		admins.forEach(adminId => {
			io.to(adminId).emit('receive_admin_msg', msgPayload);
		});
	});

	socket.on('disconnect', () => {
		if (admins.has(socket.id)) {
			admins.delete(socket.id);
		} else if (socket.sessionId) {
			if (connectedUsers[socket.sessionId]) {
				connectedUsers[socket.sessionId].online = false;
			}
			// Notify admins user went offline
			admins.forEach(adminId => {
				io.to(adminId).emit('user_status', { sessionId: socket.sessionId, online: false });
			});
		}
	});
});

const startServer = async () => {
	await connectDB();
	await seedData();
	httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

startServer().catch((err) => {
	console.error(err);
	process.exit(1);
});