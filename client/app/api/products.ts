import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query Query($userId: ID) {
    products(userId: $userId) {
      _id
      name
      description
      price
      status
      category
      images
      isProductInWishlist
      isProductInCart
      user {
        _id
        email
      }
    }
  }
`;
export const SEARCH_PRODUCTS = gql`
  query Query($query: String!) {
    searchProducts(query: $query) {
      _id
      name
      description
      price
      status
      category
      images
      isProductInWishlist
      isProductInCart
    }
  }
`;
export const GET_PRODUCT = gql`
  query Query($productId: ID!, $userId: ID) {
    product(productId: $productId, userId: $userId) {
      _id
      category
      description
      images
      name
      price
      status
      isProductInWishlist
      isProductInCart
    }
  }
`;
export const ADD_PRODUCT = gql`
  mutation Mutation($productInput: ProductInput) {
    addProduct(productInput: $productInput) {
      name
      description
      price
      category
      status
      images
      user {
        _id
        email
      }
    }
  }
`;
export const ADD_PRODUCT_TO_WISHLIST = gql`
  mutation Mutation($productId: ID!, $userId: ID!) {
    addToWishlist(productId: $productId, userId: $userId) {
      _id
      name
      description
      isProductInWishlist
    }
  }
`;
export const REMOVE_PRODUCT_FROM_WISHLIST = gql`
  mutation Mutation($productId: ID!, $userId: ID!) {
    removeFromWishlist(productId: $productId, userId: $userId) {
      _id
      name
      description
      isProductInWishlist
    }
  }
`;
export const ADD_PRODUCT_TO_CART = gql`
  mutation Mutation($productId: ID!, $userId: ID!) {
    addToCart(productId: $productId, userId: $userId) {
      product {
        _id
        name
        description
        price
        isProductInCart
      }
      quantity
    }
  }
`;
export const REMOVE_PRODUCT_FROM_CART = gql`
  mutation Mutation($productId: ID!, $userId: ID!) {
    removeFromCart(productId: $productId, userId: $userId) {
      product {
        _id
        name
        description
        price
        isProductInCart
      }
      quantity
    }
  }
`;
export const DELETE_PRODUCT_FROM_CART = gql`
  mutation Mutation($productId: ID!, $userId: ID!) {
    deleteFromCart(productId: $productId, userId: $userId)
  }
`;
export const DELETE_PRODUCT = gql`
  mutation Mutation($productId: ID!, $userId: ID!) {
    deleteProduct(productId: $productId, userId: $userId)
  }
`;

export const GET_USER_CART_PRODUCTS = gql`
  query UserCartItems($userId: ID!) {
    userCartItems(userId: $userId) {
      product {
        _id
        name
        description
        price
        images
        category
        status
      }
      quantity
    }
  }
`;

export const GET_USER_WISHLIST = gql`
  query UserWishlist($userId: ID!) {
    userWishlist(userId: $userId) {
      _id
      name
      description
      price
      images
      category
      status
      isProductInWishlist
    }
  }
`;
export const GET_ANONYMOUS_USER_WISHLIST = gql`
  query GetProductsByIds($productIds: [ID!]!) {
    getProductsByIds(productIds: $productIds) {
      name
      isProductInWishlist
    }
  }
`;
