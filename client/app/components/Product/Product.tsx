import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_PRODUCT_TO_CART,
  ADD_PRODUCT_TO_WISHLIST,
  DELETE_PRODUCT,
  REMOVE_PRODUCT_FROM_WISHLIST,
} from '~/api/products';
import {
  addItemToWishlistCache,
  anonymousUserWishlistCache,
  deleteItemFromWishlistCache,
  deleteProductCache,
  updateAnonymousUserProductsCache,
  updateCartItemQuantityCache,
  updateProductsCache,
} from '~/cache/ProductsCache';
import { ProductModel } from '~/models/ProductModels';
import { useApolloClient } from '@apollo/client';
import {
  generateTempWishlistId,
  getTempWishlistFromBrowser,
  saveTempWishlistToBrowser,
} from '~/utils/utils';
import { addItemToCartCache } from '~/cache/ProductsCache';
import authContext from '~/context/auth-context';
import { useContext } from 'react';

const Product = ({
  product,
  userId,
}: {
  product: ProductModel;
  userId: any;
}) => {
  const client = useApolloClient();
  const context = useContext(authContext);
  const addProductToWishlistMutation = useMutation(ADD_PRODUCT_TO_WISHLIST)[0];
  const removeProductFromWishlistMutation = useMutation(
    REMOVE_PRODUCT_FROM_WISHLIST
  )[0];
  const deleteProductMutation = useMutation(DELETE_PRODUCT)[0];
  const addProductToCartMutation = useMutation(ADD_PRODUCT_TO_CART)[0];

  const wishlistButtonHandler = () => {
    console.log('wishlistButtonHandler', userId, product);
    if (!product.isProductInWishlist) {
      addProductToWishlist(product._id, userId);
    } else {
      removeProductFromWishlist(product._id, userId);
    }
  };

  const addProductToWishlist = async (productId: string, userId?: string) => {
    if (userId) {
      const res = await addProductToWishlistMutation({
        variables: { productId, userId },
      });
      const { productData } = res.data;
      if (productData) {
        updateProductsCache(client.cache, productId, true, userId);
        addItemToWishlistCache(client.cache, productData, userId);
      }
    } else {
      console.log(123);
      let tempWishlist = getTempWishlistFromBrowser();
      if (tempWishlist) {
        tempWishlist.products.push(productId);
      }
      saveTempWishlistToBrowser(tempWishlist);
      updateAnonymousUserProductsCache(client.cache, productId, true);
      anonymousUserWishlistCache(client.cache, product, true);
    }
  };

  const removeProductFromWishlist = async (
    productId: string,
    userId: string
  ) => {
    if (userId) {
      const res = await removeProductFromWishlistMutation({
        variables: { productId, userId },
      });
      const { removeFromWishlist } = res.data;
      if (removeFromWishlist) {
        updateProductsCache(client.cache, productId, false, userId);
        deleteItemFromWishlistCache(client.cache, productId, userId);
      }
    } else {
      let tempWishlist = getTempWishlistFromBrowser();
      if (tempWishlist) {
        const index = tempWishlist.products.indexOf(productId);
        if (index !== -1) {
          // Product exists in the wishlist, so remove it.
          tempWishlist.products.splice(index, 1);
        }
      }
      saveTempWishlistToBrowser(tempWishlist);
      updateAnonymousUserProductsCache(client.cache, productId, false);
      anonymousUserWishlistCache(client.cache, productId, false);
    }
  };
  const deleteProductHandler = async () => {
    try {
      await deleteProductMutation({
        variables: { productId: product._id, userId },
      });
      deleteProductCache(client.cache, product._id, userId);
    } catch (err) {
      console.error(err);
    }
  };

  const addProductToCart = async () => {
    const res = await addProductToCartMutation({
      variables: { productId: product._id, userId },
    });
    const cartItem = res.data.addToCart;
    if (cartItem) {
      !product.isProductInCart
        ? addItemToCartCache(client.cache, cartItem, userId)
        : updateCartItemQuantityCache(
            client.cache,
            product._id,
            cartItem.quantity,
            userId
          );
    }
  };

  return (
    <div className="bg-white p-3 shadow-lg relative">
      {context.role === 'ADMIN' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5 w-5 ml-auto"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteProductHandler();
          }}
        >
          <path
            fill="currentColor"
            d="M17.6 6.6l-4.6 4.6 4.6 4.6-1.4 1.4-4.6-4.6-4.6 4.6-1.4-1.4 4.6-4.6-4.6-4.6 1.4-1.4 4.6 4.6 4.6-4.6z"
          />
        </svg>
      )}
      <>
        <div className="relative flex items-end overflow-hidden z-10">
          <img
            id="image"
            className="w-full h-full object-cover"
            src={`https://source.unsplash.com/800x600/?${
              product.category ? product.category : 'wallet'
            }`}
          />
          <div
            className="absolute top-3 right-3"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              wishlistButtonHandler();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                product?.isProductInWishlist
                  ? 'text-red-600'
                  : 'text-white hover:text-red-200'
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 17.297l-1.635-1.488C3.704 11.05 2 8.665 2 6.412c0-2.483 2.017-4.5 4.5-4.5 1.614 0 3.061.85 3.875 2.122C11.439 2.762 12.886 2 14.5 2c2.483 0 4.5 2.017 4.5 4.5 0 2.253-1.704 4.638-6.365 9.397L10 17.297z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 inline-flex items-center rounded-lg bg-white p-2 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm text-slate-400">4.9</span>
          </div>
        </div>
        <div className="mt-1 p-2">
          <h2 className="text-slate-700">{product.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{product.description}</p>

          <div className="mt-3 flex items-end justify-between">
            <p className="text-lg font-bold text-blue-500">${product.price}</p>

            <div className="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>

              <button
                className="text-sm"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  addProductToCart();
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Product;
