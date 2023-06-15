const DataLoader = require('dataloader');
const Product = require('../models/Product');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');
const {
  transformProduct,
  setProductInWishlist,
} = require('../../graphql/resolvers/merge');

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});
const productLoader = new DataLoader((productIds) => {
  return Product.find({ _id: { $in: productIds } });
});

exports.addProduct = async ({
  name,
  description,
  price,
  status,
  category,
  images,
  userId,
}) => {
  const tempUser = await userLoader.load(userId);
  const newProduct = new Product({
    name: name,
    description: description,
    price: price,
    status: status,
    category: category,
    images: images,
    user: tempUser,
  });
  await tempUser.save();
  const res = await newProduct.save();
  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { products: res._id } },
    { new: true }
  );
  return res;
};

exports.deleteProduct = async (productId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const user = await userLoader.load(userId);
  if (!user.products.includes(productId)) {
    throw new ApolloError(
      `The user with id ${userId} doesn't have the product with id ${productId}`,
      'PRODUCT_DONT_EXIST_ON_USER'
    );
  }
  try {
    // Remove product from user's products array
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { products: productId } },
      { new: true, session }
    );
    // Delete product from Product collection
    await Product.deleteOne({ _id: productId }, { session });

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Could not remove product from user');
  }
};

exports.editProduct = async (id, editProductInput) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name: editProductInput.name,
          description: editProductInput.description,
          price: editProductInput.price,
          status: editProductInput.status,
          category: editProductInput.category,
          images: editProductInput.images,
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      throw new Error(`Product with id ${id} doesn't exist`);
    }

    return updatedProduct;
  } catch (error) {
    throw new Error(`Could not edit product: ${error.message}`);
  }
};

exports.getUserProducts = async (userId) => {
  try {
    let products;
    if (userId) {
      products = await Product.find();
      const transformedProducts = await Promise.all(
        products.map((product) => transformProduct(product, userId))
      );
      return transformedProducts;
    } else {
      return await Product.find(
        {},
        {
          isProductInWishlist: false,
          isProductInCart: false,
        }
      ).lean();
    }
  } catch (err) {
    throw err;
  }
};

exports.getProduct = async (productId, userId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} doesn't exist`);
    }
    const transformedProduct = await transformProduct(product, userId);
    return transformedProduct;
  } catch (err) {
    throw err;
  }
};

exports.addToWishlist = async (productId, userId) => {
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { wishlist: productId } },
      { new: true }
    );
    const product = await Product.findByIdAndUpdate(
      productId,
      { isProductInWishlist: true },
      { new: true }
    );
    return product;
  } catch (err) {
    throw new Error('Could not add product to wishlist');
  }
};

exports.removeFromWishlist = async (productId, userId) => {
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { wishlist: productId } },
      { new: true }
    );
    const product = await Product.findByIdAndUpdate(
      productId,
      { isProductInWishlist: false },
      { new: true }
    );
    return product;
  } catch (err) {
    throw new Error('Could not remove product from wishlist');
  }
};

exports.addToCart = async (productId, userId) => {
  try {
    const user = await userLoader.load(userId);
    const existingCartItem = user.cart.find(
      (item) => item.productId.toString() === productId.toString()
    );
    let quantity = 1;
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      quantity = existingCartItem.quantity;
    } else {
      user.cart.push({ productId: productId, quantity: 1 });
    }
    await user.save();
    await Product.findByIdAndUpdate(
      productId,
      { isProductInCart: true },
      { new: true }
    );
    const product = await Product.findById(productId);
    return {
      product,
      quantity,
    };
  } catch (err) {
    throw new Error('Could not add product to cart');
  }
};

exports.removeFromCart = async (productId, userId) => {
  try {
    const user = await userLoader.load(userId);
    const existingCartItem = user.cart.find(
      (item) => item.productId.toString() === productId.toString()
    );
    if (existingCartItem) {
      if (existingCartItem.quantity === 1) {
        user.cart.pull(existingCartItem);
      } else {
        existingCartItem.quantity -= 1;
      }
      const quantity = existingCartItem.quantity;
      await user.save();
      await Product.findByIdAndUpdate(
        productId,
        { isProductInCart: quantity > 0 },
        { new: true }
      );
      const product = await Product.findById(productId);
      return {
        product,
        quantity,
      };
    } else {
      throw new Error(
        'Could not remove product from cart since its not in the cart'
      );
    }
  } catch (err) {
    throw new Error('Could not remove product from cart');
  }
};

exports.deleteProductFromCart = async (userId, productId) => {
  try {
    const user = await userLoader.load(userId);
    const existingCartItem = user.cart.find(
      (item) => item.productId.toString() === productId.toString()
    );
    if (existingCartItem) {
      user.cart.pull(existingCartItem);
      await user.save();
      return true;
    } else {
      throw new Error(
        'Could not remove product from cart since its not in the cart'
      );
    }
  } catch (err) {
    throw new Error('Could not remove product from cart');
  }
};

exports.getUserWishlist = async (userId) => {
  try {
    const user = await User.findById(userId);
    const wishlistItems = await Promise.all(
      user.wishlist.map(async (wishlistItemId) => {
        const product = await Product.findById(wishlistItemId);
        product.isProductInWishlist = true;
        return product;
      })
    );
    return wishlistItems;
  } catch (err) {
    throw new Error('Could not get user wishlist');
  }
};
exports.getProductsByIds = async (ids) => {
  try {
    const products = await Product.find({ _id: { $in: ids } });
    const updatedProducts = setProductInWishlist(products);
    return updatedProducts;
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

exports.getUserCartItems = async (userId) => {
  const user = await userLoader.load(userId);
  const cartItems = user.cart;
  const cartItemWithProducts = await Promise.all(
    cartItems.map(async (cartItem) => {
      const product = await Product.findById(cartItem.productId);
      return {
        product,
        quantity: cartItem.quantity,
      };
    })
  );
  return cartItemWithProducts;
};

exports.getProducts = async () => {
  return await Product.find();
};
