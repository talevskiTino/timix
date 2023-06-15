const usersResolvers = require('./users/users');
const productsResolvers = require('./products/products');

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...productsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...productsResolvers.Mutation,
  },
};
