const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const Product = require('./models/Product');

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const { data } = await axios.get('https://dummyjson.com/products?limit=100');

    await Product.deleteMany({});
    console.log('Cleared existing products...');

    const products = data.products.map((item) => ({
      name:        item.title,
      description: item.description,
      price:       item.price,
      image:       item.thumbnail,
      category:    item.category,
      stock:       item.stock,
      rating:      item.rating,
      numReviews:  Math.floor(Math.random() * 200) + 10,
    }));

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded successfully!`);
    process.exit();
  } catch (error) {
    console.error('Error seeding:', error.message);
    process.exit(1);
  }
};

seedProducts();