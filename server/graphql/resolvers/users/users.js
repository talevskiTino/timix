const User = require('../../../data/models/User');
const Product = require('../../../data/models/Product');
const userService = require('../../../data/services/userService');
const DataLoader = require('dataloader');
const { ApolloError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { transformUsers } = require('../merge');
require('dotenv').config({ path: 'server/.env' });
require('dotenv').config();
const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} = require('../../../middleware/auth.ts');

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } })
    .populate('products')
    .populate('wishlist')
    .populate('cart');
});
const productLoader = new DataLoader((productIds) => {
  return Product.find({ _id: { $in: productIds } });
});

module.exports = {
  Mutation: {
    async registerUser(_, { registerInput }) {
      try {
        return await userService.registerUser(registerInput);
      } catch (err) {
        throw new ApolloError(err.message, err.code);
      }
    },
    async loginUser(_, { loginInput: { email, password } }, { res }) {
      const user = await userService.authenticateUser(email, password);
      if (user) {
        sendRefreshToken(res, createRefreshToken(user));
        return {
          userId: user.id,
          token: createAccessToken(user),
          tokenExpiration: 1,
          role: user.role,
        };
      } else {
        throw new ApolloError('Wrong credentials', 'WRONG_CREDENTIALS');
      }
    },
    async deleteUser(parent, args, context, info) {
      try {
        const deletedUser = await userService.deleteUser(args.userId);
        return deletedUser;
      } catch (err) {
        throw new ApolloError(err.message, 'USER_NOT_FOUND');
      }
    },
  },
  Query: {
    user: async (_, { id }) => {
      return await userService.getUserById(id);
    },
    users: async () => {
      const users = await User.find({});
      return users;
    },
  },
  User: {
    products: async (user) => {
      const productIds = user.products.map((productId) => productId.toString());
      const products = await productLoader.loadMany(productIds);
      return products;
    },
    wishlist: async (user) => {
      const productIds = user.wishlist.map((productId) => productId.toString());
      const products = await productLoader.loadMany(productIds);
      return products;
    },
    cart: async (user) => {
      const productIds = user.cart.map((cartItem) =>
        cartItem.productId.toString()
      );
      const products = await productLoader.loadMany(productIds);
      const cart = user.cart.map((cartItem) => {
        const product = products.find(
          (p) => p._id.toString() === cartItem.productId.toString()
        );
        return {
          product,
          quantity: cartItem.quantity,
        };
      });
      return cart;
    },
  },
};
