const { ApolloError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const DataLoader = require('dataloader');

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } })
    .populate('products')
    .populate('wishlist')
    .populate('cart');
});

const registerUser = async ({ email, password, role }) => {
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    throw new ApolloError(
      'A user is already registered with the email: ' + email,
      'USER_ALREADY_EXISTS'
    );
  }
  var encryptedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email: email.toLowerCase(),
    password: encryptedPassword,
    role: role,
  });
  const token = jwt.sign({ user_id: newUser._id, email }, 'UNSAFESTRING', {
    expiresIn: '2h',
  });
  newUser.token = token;
  const res = await newUser.save();
  return {
    id: res.id,
    ...res._doc,
  };
};
const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  } else {
    return null;
  }
};
const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with id ${userId} doesn't exist`);
  }
  await User.deleteOne({ _id: userId });
  return user;
};
const getUserById = async (userId) => {
  try {
    return await userLoader.load(userId);
  } catch (err) {
    throw new Error(`User with id ${userId} not found`);
  }
};

module.exports = {
  registerUser,
  authenticateUser,
  deleteUser,
  getUserById,
};
