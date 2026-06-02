const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // Disable browser caching so image updates appear immediately.
    res.set('Cache-Control', 'no-store');
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    // Disable browser caching so image updates appear immediately.
    res.set('Cache-Control', 'no-store');
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'CastError') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   POST api/products
// @desc    Create a product
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  try {
    if (!name || !description || price === undefined || !category || !image) {
      return res.status(400).json({ msg: 'Please provide all required product fields' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  // Build product object
  const productFields = {};
  if (name !== undefined) productFields.name = name;
  if (description !== undefined) productFields.description = description;
  if (price !== undefined) productFields.price = price;
  if (category !== undefined) productFields.category = category;
  if (image !== undefined) productFields.image = image;
  if (stock !== undefined) productFields.stock = stock;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: 'Product not found' });

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: 'Product not found' });

    await Product.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/products/related/:id
// @desc    Get related products by category
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    // Disable browser caching so image updates appear immediately.
    res.set('Cache-Control', 'no-store');
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Get 6 products from the same category, excluding current product
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(6);

    res.json(relatedProducts);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'CastError') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
};
