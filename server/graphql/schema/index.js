const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    _id: ID!
    email: String
    password: String
    products: [Product]
    wishlist: [Product]
    cart: [CartItem]
    role: User_Role
  }
  type Product {
    _id: ID!
    name: String
    description: String
    price: String
    status: String
    category: String
    images: [String]
    user: User!
    isProductInWishlist: Boolean
    isProductInCart: Boolean
  }

  type CartItem {
    productId: ID!
    quantity: Int
  }

  type CartItemWithProduct {
    product: Product!
    quantity: Int!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    role: User_Role
  }

  input RegisterInput {
    email: String!
    password: String!
    role: User_Role
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    description: String!
    price: String!
    status: Product_Status
    category: Product_Category
    images: [String]
    userId: String!
  }
  input EditProductInput {
    id: String!
    name: String!
    description: String!
    price: String!
    status: Product_Status
    category: Product_Category
    images: [String]
  }

  type Query {
    user(id: ID!): User
    users: [User]
    products(userId: ID): [Product]
    product(productId: ID!, userId: ID): Product
    userCartItems(userId: ID!): [CartItemWithProduct]
    userWishlist(userId: ID!): [Product]
    getProductsByIds(productIds: [ID!]!): [Product]
    searchProducts(query: String!): [Product!]!
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): AuthData
    deleteUser(userId: ID!): User
    addProduct(productInput: ProductInput): Product
    editProduct(editProductInput: EditProductInput): Product
    deleteProduct(productId: ID!, userId: ID!): Boolean!
    addToWishlist(productId: ID!, userId: ID!): Product
    removeFromWishlist(productId: ID!, userId: ID!): Product
    addToCart(productId: ID!, userId: ID!): CartItemWithProduct
    removeFromCart(productId: ID!, userId: ID!): CartItemWithProduct
    deleteFromCart(productId: ID!, userId: ID!): Boolean!
  }

  enum User_Role {
    USER
    ADMIN
  }
  enum Product_Status {
    AVAILABLE
    OUT_OF_STOCK
  }
  enum Product_Category {
    WALLET
    BELT
    BRACELET
    GLASSES
  }
`;
