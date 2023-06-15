import {
  GET_PRODUCTS,
  GET_USER_CART_PRODUCTS,
  GET_USER_WISHLIST,
} from '~/api/products';
import { CartItemModel, ProductModel } from '~/models/ProductModels';

export const updateProductsCache = (
  cache: any,
  productId: string,
  isProductInWishlist: boolean,
  userId: string
) => {
  const products = cache.readQuery({
    query: GET_PRODUCTS,
    variables: {
      userId,
    },
  });
  if (products) {
    const index = products.products.findIndex(
      (product: ProductModel) => product._id === productId
    );
    const updatedProducts = [...products.products];
    const updatedProduct = {
      ...updatedProducts[index],
      isProductInWishlist,
    };
    updatedProducts[index] = updatedProduct;
    cache.writeQuery({
      query: GET_PRODUCTS,
      variables: {
        userId,
      },
      data: {
        products: updatedProducts,
      },
    });
  }
};
export const updateAnonymousUserProductsCache = (
  cache: any,
  productId: string,
  isProductInWishlist: boolean
) => {
  const products = cache.readQuery({
    query: GET_PRODUCTS,
    variables: {
      userId: null,
    },
  });
  if (products) {
    const index = products.products.findIndex(
      (product: ProductModel) => product._id === productId
    );
    const updatedProducts = [...products.products];
    const updatedProduct = {
      ...updatedProducts[index],
      isProductInWishlist,
    };
    updatedProducts[index] = updatedProduct;
    cache.writeQuery({
      query: GET_PRODUCTS,
      variables: {
        userId: null,
      },
      data: {
        products: updatedProducts,
      },
    });
  }
};
export const anonymousUserWishlistCache = (
  cache: any,
  product: any,
  isProductInWishlist: boolean
) => {
  const wishlistItems = cache.readQuery({
    query: GET_USER_WISHLIST,
    variables: {
      userId: null,
    },
  });
  let updatedWishlistItems;
  if (wishlistItems) {
    if (isProductInWishlist) {
      updatedWishlistItems = [...wishlistItems.userWishlist, product];
    } else {
      updatedWishlistItems = wishlistItems.userWishlist.filter(
        (item: ProductModel) => item._id !== product._id
      );
    }
  }
  cache.writeQuery({
    query: GET_USER_WISHLIST,
    variables: {
      userId: null,
    },
    data: {
      userWishlist: updatedWishlistItems,
    },
  });
};
export const deleteCartItemFromProductsCache = (
  cache: any,
  productId: string,
  isProductInCart: boolean,
  userId: string
) => {
  const products = cache.readQuery({
    query: GET_PRODUCTS,
    variables: {
      userId,
    },
  });
  if (products) {
    const index = products.products.findIndex(
      (product: ProductModel) => product._id === productId
    );
    const updatedProducts = [...products.products];
    const updatedProduct = {
      ...updatedProducts[index],
      isProductInCart,
    };
    updatedProducts[index] = updatedProduct;
    cache.writeQuery({
      query: GET_PRODUCTS,
      variables: {
        userId,
      },
      data: {
        products: updatedProducts,
      },
    });
  }
};

export const updateCartItemQuantityCache = (
  cache: any,
  productId: string,
  quantity: number,
  userId: string
) => {
  console.log('updateCartItemQuantityCache');
  const cartItems = cache.readQuery({
    query: GET_USER_CART_PRODUCTS,
    variables: {
      userId,
    },
  });
  const index = cartItems.userCartItems.findIndex(
    (item: CartItemModel) => item.product._id === productId
  );
  const updatedCartItems = [...cartItems.userCartItems];
  const updatedCartItem = {
    ...updatedCartItems[index],
    quantity,
  };
  updatedCartItems[index] = updatedCartItem;
  cache.writeQuery({
    query: GET_USER_CART_PRODUCTS,
    variables: {
      userId,
    },
    data: {
      userCartItems: updatedCartItems,
    },
  });
};

export const deleteItemFromCartCache = (
  cache: any,
  productId: string,
  userId: string
) => {
  const cartItems = cache.readQuery({
    query: GET_USER_CART_PRODUCTS,
    variables: {
      userId,
    },
  });
  const updatedCartItems = cartItems.userCartItems.filter(
    (item: CartItemModel) => item.product._id !== productId
  );
  cache.writeQuery({
    query: GET_USER_CART_PRODUCTS,
    variables: {
      userId,
    },
    data: {
      userCartItems: updatedCartItems,
    },
  });
};

export const addItemToCartCache = (
  cache: any,
  cartItem: CartItemModel,
  userId: string
) => {
  console.log('addItemToCartCache');
  const cartItems = cache.readQuery({
    query: GET_USER_CART_PRODUCTS,
    variables: {
      userId,
    },
  });
  if (cartItems) {
    const updatedCartItems = [...cartItems.userCartItems, cartItem];
    cache.writeQuery({
      query: GET_USER_CART_PRODUCTS,
      variables: {
        userId,
      },
      data: {
        userCartItems: updatedCartItems,
      },
    });
  }
};

export const deleteItemFromWishlistCache = (
  cache: any,
  productId: string,
  userId: string
) => {
  const wishlistItems = cache.readQuery({
    query: GET_USER_WISHLIST,
    variables: {
      userId,
    },
  });
  const updatedWishlistItems = wishlistItems.userWishlist.filter(
    (item: ProductModel) => item._id !== productId
  );
  cache.writeQuery({
    query: GET_USER_WISHLIST,
    variables: {
      userId,
    },
    data: {
      userWishlist: updatedWishlistItems,
    },
  });
};

export const addItemToWishlistCache = (
  cache: any,
  wishlistItem: ProductModel,
  userId: string
) => {
  const wishlistItems = cache.readQuery({
    query: GET_USER_WISHLIST,
    variables: {
      userId,
    },
  });
  if (wishlistItems) {
    const updatedWishlistItems = [...wishlistItems.userWishlist, wishlistItem];
    cache.writeQuery({
      query: GET_USER_WISHLIST,
      variables: {
        userId,
      },
      data: {
        userWishlist: updatedWishlistItems,
      },
    });
  }
};

export const deleteProductCache = (
  cache: any,
  productId: string,
  userId: string
) => {
  const data = cache.readQuery({
    query: GET_PRODUCTS,
    variables: {
      userId,
    },
  });
  const updatedProducts = data.products.filter(
    (item: ProductModel) => item._id !== productId
  );
  cache.writeQuery({
    query: GET_PRODUCTS,
    variables: {
      userId,
    },
    data: {
      products: updatedProducts,
    },
  });
};

export const addProductCache = (
  cache: any,
  product: ProductModel,
  userId: string
) => {
  const data = cache.readQuery({
    query: GET_PRODUCTS,
    variables: {
      userId,
    },
  });
  const updatedProducts = [...data.products, product];
  cache.writeQuery({
    query: GET_PRODUCTS,
    variables: {
      userId,
    },
    data: {
      products: updatedProducts,
    },
  });
};
