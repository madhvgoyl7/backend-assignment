const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const categories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { name: 'Clothing', description: 'Fashion and apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Home & Garden', description: 'Home decor and garden supplies', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400' },
  { name: 'Sports', description: 'Sports equipment and accessories', image: 'https://images.unsplash.com/photo-1461896836934- voices0d9c8c?w=400' },
  { name: 'Books', description: 'Books and literature', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' },
  { name: 'Beauty', description: 'Beauty and personal care', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
  { name: 'Toys', description: 'Toys and games', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400' },
  { name: 'Automotive', description: 'Car parts and accessories', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400' }
];

const products = [
  // Electronics
  { name: 'Wireless Bluetooth Headphones', description: 'Premium noise-canceling wireless headphones with 40-hour battery life. Experience immersive sound quality with deep bass and crystal-clear highs.', price: 149.99, originalPrice: 199.99, category: 'Electronics', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', rating: 4.5, numReviews: 234, stock: 50, isFeatured: true, tags: ['wireless', 'bluetooth', 'audio'] },
  { name: 'Smart Watch Pro', description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life. Track your fitness goals with precision.', price: 299.99, originalPrice: 349.99, category: 'Electronics', brand: 'TechFit', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', rating: 4.7, numReviews: 567, stock: 35, isFeatured: true, tags: ['smart', 'fitness', 'wearable'] },
  { name: '4K Ultra HD Monitor 27"', description: 'Stunning 4K display with HDR support and 144Hz refresh rate. Perfect for gaming and professional work.', price: 449.99, originalPrice: 549.99, category: 'Electronics', brand: 'ViewPro', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', rating: 4.6, numReviews: 189, stock: 25, isFeatured: false, tags: ['monitor', '4k', 'gaming'] },
  { name: 'Wireless Charging Pad', description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.', price: 29.99, originalPrice: 39.99, category: 'Electronics', brand: 'ChargeTech', image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=400', rating: 4.3, numReviews: 456, stock: 100, isFeatured: false, tags: ['wireless', 'charging', 'accessories'] },
  { name: 'Portable Bluetooth Speaker', description: 'Waterproof portable speaker with 360-degree sound. 20-hour battery life and built-in microphone.', price: 79.99, originalPrice: 99.99, category: 'Electronics', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', rating: 4.4, numReviews: 321, stock: 60, isFeatured: true, tags: ['speaker', 'bluetooth', 'portable'] },
  { name: 'Laptop Stand Aluminum', description: 'Ergonomic aluminum laptop stand with adjustable height. Improves posture and cooling.', price: 49.99, originalPrice: 69.99, category: 'Electronics', brand: 'DeskPro', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', rating: 4.5, numReviews: 178, stock: 45, isFeatured: false, tags: ['laptop', 'stand', 'ergonomic'] },
  { name: 'Mechanical Gaming Keyboard', description: 'RGB mechanical keyboard with Cherry MX switches. Programmable keys and aluminum frame.', price: 129.99, originalPrice: 159.99, category: 'Electronics', brand: 'GameMaster', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400', rating: 4.8, numReviews: 412, stock: 30, isFeatured: true, tags: ['keyboard', 'gaming', 'mechanical'] },
  { name: 'Wireless Gaming Mouse', description: 'High-precision wireless gaming mouse with 16000 DPI sensor. Ergonomic design for long gaming sessions.', price: 69.99, originalPrice: 89.99, category: 'Electronics', brand: 'GameMaster', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', rating: 4.6, numReviews: 289, stock: 55, isFeatured: false, tags: ['mouse', 'gaming', 'wireless'] },
  
  // Clothing
  { name: 'Premium Cotton T-Shirt', description: 'Ultra-soft 100% organic cotton t-shirt. Classic fit with reinforced stitching for durability.', price: 29.99, originalPrice: 39.99, category: 'Clothing', brand: 'UrbanWear', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', rating: 4.4, numReviews: 567, stock: 200, isFeatured: false, tags: ['cotton', 'casual', 'basic'] },
  { name: 'Slim Fit Denim Jeans', description: 'Modern slim fit jeans with stretch comfort. Premium denim with classic 5-pocket styling.', price: 59.99, originalPrice: 79.99, category: 'Clothing', brand: 'DenimCo', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', rating: 4.5, numReviews: 423, stock: 150, isFeatured: true, tags: ['denim', 'jeans', 'casual'] },
  { name: 'Hooded Sweatshirt', description: 'Cozy fleece-lined hoodie with kangaroo pocket. Perfect for layering in any season.', price: 49.99, originalPrice: 64.99, category: 'Clothing', brand: 'ComfortPlus', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', rating: 4.6, numReviews: 345, stock: 120, isFeatured: false, tags: ['hoodie', 'casual', 'comfort'] },
  { name: 'Leather Jacket Classic', description: 'Genuine leather jacket with quilted lining. Timeless style with modern comfort.', price: 199.99, originalPrice: 279.99, category: 'Clothing', brand: 'LeatherCraft', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', rating: 4.8, numReviews: 234, stock: 40, isFeatured: true, tags: ['leather', 'jacket', 'premium'] },
  { name: 'Running Sneakers', description: 'Lightweight running shoes with responsive cushioning. Breathable mesh upper for maximum comfort.', price: 89.99, originalPrice: 119.99, category: 'Clothing', brand: 'RunFast', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', rating: 4.7, numReviews: 678, stock: 80, isFeatured: true, tags: ['shoes', 'running', 'athletic'] },
  { name: 'Casual Polo Shirt', description: 'Classic polo shirt with moisture-wicking fabric. Perfect for work or weekend wear.', price: 39.99, originalPrice: 54.99, category: 'Clothing', brand: 'UrbanWear', image: 'https://images.unsplash.com/photo-1625910513413-5fc45e4a8b1f?w=400', rating: 4.3, numReviews: 234, stock: 90, isFeatured: false, tags: ['polo', 'casual', 'business'] },
  
  // Home & Garden
  { name: 'Modern Table Lamp', description: 'Minimalist LED table lamp with touch dimmer. 3 color temperatures for perfect ambiance.', price: 45.99, originalPrice: 59.99, category: 'Home & Garden', brand: 'LightCraft', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', rating: 4.4, numReviews: 189, stock: 65, isFeatured: false, tags: ['lamp', 'lighting', 'decor'] },
  { name: 'Ceramic Plant Pot Set', description: 'Set of 3 modern ceramic planters with drainage holes. Perfect for indoor plants.', price: 34.99, originalPrice: 44.99, category: 'Home & Garden', brand: 'GreenHome', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', rating: 4.6, numReviews: 267, stock: 70, isFeatured: true, tags: ['plants', 'ceramic', 'decor'] },
  { name: 'Throw Blanket Luxury', description: 'Ultra-soft sherpa throw blanket. Perfect for cozy nights on the couch.', price: 39.99, originalPrice: 54.99, category: 'Home & Garden', brand: 'CozyLiving', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', rating: 4.7, numReviews: 345, stock: 85, isFeatured: false, tags: ['blanket', 'cozy', 'home'] },
  { name: 'Stainless Steel Cookware Set', description: '10-piece professional cookware set with tri-ply construction. Oven-safe and dishwasher-safe.', price: 189.99, originalPrice: 249.99, category: 'Home & Garden', brand: 'ChefPro', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', rating: 4.8, numReviews: 423, stock: 30, isFeatured: true, tags: ['cookware', 'kitchen', 'stainless'] },
  { name: 'Wall Art Canvas Print', description: 'Modern abstract canvas art print. Ready to hang with included hardware.', price: 59.99, originalPrice: 79.99, category: 'Home & Garden', brand: 'ArtDecor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400', rating: 4.5, numReviews: 156, stock: 40, isFeatured: false, tags: ['art', 'canvas', 'decor'] },
  { name: 'Smart Robot Vacuum', description: 'AI-powered robot vacuum with mapping technology. Self-charging and app-controlled.', price: 299.99, originalPrice: 399.99, category: 'Home & Garden', brand: 'CleanBot', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', rating: 4.6, numReviews: 567, stock: 25, isFeatured: true, tags: ['vacuum', 'smart', 'cleaning'] },
  
  // Sports
  { name: 'Yoga Mat Premium', description: 'Extra-thick yoga mat with alignment lines. Non-slip surface and eco-friendly materials.', price: 39.99, originalPrice: 54.99, category: 'Sports', brand: 'FitLife', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', rating: 4.7, numReviews: 456, stock: 100, isFeatured: true, tags: ['yoga', 'fitness', 'mat'] },
  { name: 'Adjustable Dumbbells Set', description: 'Space-saving adjustable dumbbells 5-50 lbs. Quick-change weight system.', price: 249.99, originalPrice: 329.99, category: 'Sports', brand: 'PowerFit', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', rating: 4.8, numReviews: 234, stock: 20, isFeatured: true, tags: ['dumbbells', 'weights', 'fitness'] },
  { name: 'Running Water Bottle', description: 'Insulated stainless steel water bottle. Keeps drinks cold 24 hours or hot 12 hours.', price: 24.99, originalPrice: 34.99, category: 'Sports', brand: 'HydroFit', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', rating: 4.5, numReviews: 678, stock: 150, isFeatured: false, tags: ['bottle', 'hydration', 'fitness'] },
  { name: 'Resistance Bands Set', description: 'Complete resistance bands set with 5 levels. Includes door anchor and carrying bag.', price: 29.99, originalPrice: 39.99, category: 'Sports', brand: 'FitLife', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400', rating: 4.4, numReviews: 345, stock: 120, isFeatured: false, tags: ['bands', 'resistance', 'workout'] },
  { name: 'Basketball Official Size', description: 'Official size and weight basketball with superior grip. Indoor/outdoor composite leather.', price: 34.99, originalPrice: 44.99, category: 'Sports', brand: 'ProSport', image: 'https://images.unsplash.com/photo-1494199505258-5f95387f933c?w=400', rating: 4.6, numReviews: 189, stock: 60, isFeatured: false, tags: ['basketball', 'ball', 'sports'] },
  { name: 'Gym Bag Duffle', description: 'Large capacity gym duffle bag with shoe compartment. Water-resistant and durable.', price: 44.99, originalPrice: 59.99, category: 'Sports', brand: 'FitLife', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', rating: 4.5, numReviews: 267, stock: 75, isFeatured: false, tags: ['bag', 'gym', 'duffle'] },
  
  // Books
  { name: 'The Art of Programming', description: 'Comprehensive guide to modern programming practices. Perfect for beginners and experts alike.', price: 39.99, originalPrice: 49.99, category: 'Books', brand: 'TechBooks', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', rating: 4.8, numReviews: 567, stock: 200, isFeatured: true, tags: ['programming', 'tech', 'learning'] },
  { name: 'Mindfulness for Everyone', description: 'Practical guide to mindfulness and meditation. Transform your daily life with simple techniques.', price: 19.99, originalPrice: 24.99, category: 'Books', brand: 'WellnessPress', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', rating: 4.6, numReviews: 345, stock: 150, isFeatured: false, tags: ['mindfulness', 'wellness', 'self-help'] },
  { name: 'World History Encyclopedia', description: 'Illustrated encyclopedia covering 5000 years of world history. Over 500 pages of content.', price: 49.99, originalPrice: 69.99, category: 'Books', brand: 'EduBooks', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', rating: 4.7, numReviews: 234, stock: 80, isFeatured: true, tags: ['history', 'encyclopedia', 'education'] },
  { name: 'Cooking Masterclass', description: 'Step-by-step recipes from world-renowned chefs. 200+ recipes with detailed instructions.', price: 34.99, originalPrice: 44.99, category: 'Books', brand: 'CulinaryPress', image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400', rating: 4.5, numReviews: 456, stock: 100, isFeatured: false, tags: ['cooking', 'recipes', 'food'] },
  
  // Beauty
  { name: 'Skincare Set Complete', description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer. All skin types.', price: 79.99, originalPrice: 99.99, category: 'Beauty', brand: 'GlowSkin', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', rating: 4.7, numReviews: 567, stock: 60, isFeatured: true, tags: ['skincare', 'beauty', 'set'] },
  { name: 'Professional Hair Dryer', description: 'Salon-quality hair dryer with ionic technology. Multiple heat and speed settings.', price: 89.99, originalPrice: 119.99, category: 'Beauty', brand: 'HairPro', image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400', rating: 4.6, numReviews: 345, stock: 45, isFeatured: false, tags: ['hairdryer', 'hair', 'styling'] },
  { name: 'Makeup Brush Set', description: 'Professional 15-piece makeup brush set with case. Synthetic bristles for flawless application.', price: 44.99, originalPrice: 59.99, category: 'Beauty', brand: 'BeautyPro', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', rating: 4.5, numReviews: 423, stock: 80, isFeatured: true, tags: ['makeup', 'brushes', 'beauty'] },
  { name: 'Natural Perfume Collection', description: 'Set of 3 natural perfumes with essential oils. Long-lasting and allergen-free.', price: 59.99, originalPrice: 79.99, category: 'Beauty', brand: 'NaturalScents', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', rating: 4.4, numReviews: 234, stock: 55, isFeatured: false, tags: ['perfume', 'fragrance', 'natural'] },
  
  // Toys
  { name: 'Building Blocks Set 500pc', description: 'Creative building blocks set with 500 pieces. Compatible with major brands.', price: 39.99, originalPrice: 54.99, category: 'Toys', brand: 'BuildFun', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400', rating: 4.8, numReviews: 456, stock: 100, isFeatured: true, tags: ['blocks', 'building', 'creative'] },
  { name: 'Remote Control Car', description: 'High-speed RC car with 4WD and rechargeable battery. Off-road capable.', price: 59.99, originalPrice: 79.99, category: 'Toys', brand: 'SpeedToys', image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400', rating: 4.6, numReviews: 345, stock: 50, isFeatured: true, tags: ['rc', 'car', 'remote'] },
  { name: 'Educational Board Game', description: 'Fun and educational board game for ages 8+. Learn while playing with family.', price: 29.99, originalPrice: 39.99, category: 'Toys', brand: 'LearnPlay', image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400', rating: 4.5, numReviews: 234, stock: 75, isFeatured: false, tags: ['boardgame', 'educational', 'family'] },
  { name: 'Plush Teddy Bear Large', description: 'Super soft large teddy bear. Perfect gift for all ages. 24 inches tall.', price: 34.99, originalPrice: 44.99, category: 'Toys', brand: 'CuddleFriends', image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400', rating: 4.7, numReviews: 567, stock: 60, isFeatured: false, tags: ['plush', 'teddy', 'gift'] },
  
  // Automotive
  { name: 'Car Phone Mount', description: 'Universal car phone mount with 360° rotation. Compatible with all smartphones.', price: 19.99, originalPrice: 29.99, category: 'Automotive', brand: 'AutoTech', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', rating: 4.4, numReviews: 567, stock: 150, isFeatured: false, tags: ['phone', 'mount', 'car'] },
  { name: 'LED Car Interior Lights', description: 'RGB LED strip lights for car interior. App-controlled with music sync feature.', price: 29.99, originalPrice: 39.99, category: 'Automotive', brand: 'LightRide', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', rating: 4.5, numReviews: 345, stock: 80, isFeatured: true, tags: ['led', 'interior', 'lights'] },
  { name: 'Tire Pressure Gauge Digital', description: 'Digital tire pressure gauge with backlit display. Accurate and easy to read.', price: 14.99, originalPrice: 19.99, category: 'Automotive', brand: 'AutoTech', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', rating: 4.3, numReviews: 234, stock: 100, isFeatured: false, tags: ['tire', 'pressure', 'gauge'] },
  { name: 'Car Vacuum Cleaner Portable', description: 'Powerful portable car vacuum with HEPA filter. Cordless and lightweight.', price: 49.99, originalPrice: 69.99, category: 'Automotive', brand: 'CleanAuto', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', rating: 4.6, numReviews: 423, stock: 55, isFeatured: true, tags: ['vacuum', 'car', 'cleaning'] }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Existing data cleared');

    // Insert categories
    await Category.insertMany(categories);
    console.log('Categories seeded');

    // Insert products
    await Product.insertMany(products);
    console.log('Products seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
