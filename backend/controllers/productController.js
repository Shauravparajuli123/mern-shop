const Product = require('../models/Product');

const { nfaSearch } = require('../utils/dfaSearch');

const getProducts = async (req, res) => {
  try {
    const { keyword, pattern } = req.query;
    let products = await Product.find({});

    if (pattern) {
      // Use DFA/NFA search for pattern matching
      products = nfaSearch(products, pattern);
    } else if (keyword) {
      // Regular keyword search
      const keywordFilter = {
        $or: [
          { name:        { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { category:    { $regex: keyword, $options: 'i' } },
        ],
      };
      products = await Product.find(keywordFilter);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

const createProduct = async (req, res) => {
  const { name, description, price, image, category, stock } = req.body;
  const product = await Product.create({ name, description, price, image, category, stock });
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Product removed' });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };