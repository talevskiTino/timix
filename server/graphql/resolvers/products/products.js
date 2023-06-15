const Product = require('../../../data/models/Product');
const DataLoader = require('dataloader');
const { ApolloServer, gql, UserInputError } = require('apollo-server');
const { ApolloError } = require('apollo-server-errors');
const User = require('../../../data/models/User');
const { transformProduct } = require('../merge');
const { default: mongoose } = require('mongoose');
const { isAuth } = require('../../../middleware/auth.ts');
const productService = require('../../../data/services/productService');

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});
const productLoader = new DataLoader((productIds) => {
  return Product.find({ _id: { $in: productIds } });
});

module.exports = {
  Mutation: {
    async addProduct(_, { productInput }) {
      return await productService.addProduct(productInput);
    },
    deleteProduct: async (_, { productId, userId }) => {
      return await productService.deleteProduct(productId, userId);
    },
    editProduct: async (_, args) => {
      try {
        return await productService.editProduct(
          args.editProductInput.id,
          args.editProductInput
        );
      } catch (error) {
        throw new ApolloError(error.message, 'EDIT_PRODUCT_ERROR', error);
      }
    },
    async addToWishlist(_, { productId, userId }) {
      return productService.addToWishlist(productId, userId);
    },
    async removeFromWishlist(_, { productId, userId }) {
      return productService.removeFromWishlist(productId, userId);
    },
    async addToCart(_, { productId, userId }) {
      return productService.addToCart(productId, userId);
    },
    async removeFromCart(_, { productId, userId }) {
      return productService.removeFromCart(productId, userId);
    },
    async deleteFromCart(_, { productId, userId }) {
      try {
        return await productService.deleteProductFromCart(userId, productId);
      } catch (err) {
        throw new Error('Could not delete product from cart');
      }
    },
  },
  Query: {
    products: async (_, { userId }) => {
      return productService.getUserProducts(userId);
    },
    product: async (_, { productId, userId }) => {
      return productService.getProduct(productId, userId);
    },
    async userWishlist(_, { userId }, context) {
      try {
        return await productService.getUserWishlist(userId);
      } catch (err) {
        throw new Error('Could not get user wishlist');
      }
    },
    async getProductsByIds(_, { productIds }) {
      const products = await productService.getProductsByIds(productIds);
      return products;
    },
    userCartItems: async (parent, { userId }, context) => {
      isAuth(context);
      return await productService.getUserCartItems(userId);
    },
    searchProducts: async (_, { query }) => {
      const products = await productService.getProducts();
      const searchResults = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        );
      });
      return searchResults;
    },
  },
};
