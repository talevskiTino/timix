const DataLoader = require('dataloader');
const User = require('../../data/models/User');
const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});
const transformProduct = async (product, userId) => {
  const transformedProduct = product.toObject();

  // Check if the product is in the user's wishlist or cart
  if (userId) {
    const user = await User.findById(userId);
    transformedProduct.isProductInWishlist = false;
    if (user.wishlist.includes(product._id)) {
      transformedProduct.isProductInWishlist = true;
    }
    transformedProduct.isProductInCart = false;
    if (
      user.cart.find(
        (item) => item.productId.toString() === product._id.toString()
      )
    ) {
      transformedProduct.isProductInCart = true;
    }
  }

  // Return the transformed product
  return transformedProduct;
};

const setProductInWishlist = async (products) => {
  return products.map((product) => ({
    ...product.toObject(),
    isProductInWishlist: true,
  }));
};

const transformWishlistProducts = async (product, userId) => {
  const transformedProduct = product.toObject();

  // Check if the product is in the user's wishlist or cart
  if (userId) {
    const user = await userLoader.load(userId);

    transformedProduct.isProductInWishlist = false;
    if (user.wishlist.includes(product._id)) {
      transformedProduct.isProductInWishlist = true;
    }

    if (
      user.cart.find(
        (item) => item.productId.toString() === product._id.toString()
      )
    ) {
      transformedProduct.isProductInCart = true;
    }
  }

  // Return the transformed product
  return transformedProduct;
};

exports.transformProduct = transformProduct;
exports.setProductInWishlist = setProductInWishlist;
