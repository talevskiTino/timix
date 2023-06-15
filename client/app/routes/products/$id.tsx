import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useParams } from '@remix-run/react';
import {
  ADD_PRODUCT_TO_WISHLIST,
  GET_PRODUCT,
  REMOVE_PRODUCT_FROM_WISHLIST,
  ADD_PRODUCT_TO_CART,
} from '~/api/products';
import { ProductModel } from '~/models/ProductModels';

import {
  errorToaster,
  promiseToaster,
  successToaster,
} from '~/utils/toasterNotifications';
import { toast, Toaster } from 'react-hot-toast';
import {
  addItemToCartCache,
  addItemToWishlistCache,
  deleteItemFromWishlistCache,
  updateProductsCache,
} from '~/cache/ProductsCache';
import Spinner from '~/components/Spinner/Spinner';
import authContext from '~/context/auth-context';
import { useContext } from 'react';

const Product = () => {
  const { id } = useParams();
  const client = useApolloClient();
  const context = useContext(authContext);
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { productId: id, userId: context.userId },
  });
  const addProductToWishlistMutation = useMutation(ADD_PRODUCT_TO_WISHLIST)[0];
  const removeProductFromWishlistMutation = useMutation(
    REMOVE_PRODUCT_FROM_WISHLIST
  )[0];
  const addProductToCartMutation = useMutation(ADD_PRODUCT_TO_CART)[0];

  const wishlistButtonHandler = (product: ProductModel) => {
    if (!product.isProductInWishlist) {
      addProductToWishlist(product._id, context?.userId!);
      updateProductsCache(client.cache, product._id, true, context?.userId!);
      addItemToWishlistCache(client.cache, product, context?.userId!);
    } else {
      removeProductFromWishlist(product._id, context.userId!);
      updateProductsCache(client.cache, product._id, false, context?.userId!);
      deleteItemFromWishlistCache(client.cache, product._id, context?.userId!);
    }
  };
  const addProductToWishlist = async (productId: string, userId: string) => {
    const res = await addProductToWishlistMutation({
      variables: { productId, userId },
    });
    const { addToWishlist } = res.data;
  };

  const removeProductFromWishlist = async (
    productId: string,
    userId: string
  ) => {
    const res = await removeProductFromWishlistMutation({
      variables: { productId, userId },
    });
    const { removeFromWishlist } = res.data;
  };

  const addToCartHandler = async (productId: string) => {
    try {
      const promise = await addProductToCartMutation({
        variables: { productId, userId: context.userId },
      });
      addItemToCartCache(
        client.cache,
        promise.data.addToCart,
        context?.userId!
      );
      successToaster('Product added to cart!');
    } catch (error) {
      errorToaster('Could not add product to cart.');
      console.error(error);
    }
  };
  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong</p>;
  return (
    <section className="py-10 bg-gray-100">
      <Toaster position="top-right" />
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div className="relative col-span-2 max-w-[70%] mx-auto">
          <img
            id="image"
            className="w-full h-full object-cover"
            src={`https://source.unsplash.com/800x600/?${
              data.product.category ? data.product.category : 'wallet'
            }`}
          />
          <div className="arrows w-full absolute inset-y-1/2 flex justify-between px-3">
            <button id="prev">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button id="next">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="space-y-5 p-5">
          <h4 className="text-xl font-semibold">{data.product.category}</h4>
          <h1 className="text-3xl font-bold">{data.product.name}</h1>
          <h2 className="text-xl font-bold">${data.product.price}</h2>
          <p className="text-sm">{data.product.description}</p>
          <p className="text-sm">{data.product.status}</p>

          <div className="flex items-center space-x-5">
            <button
              onClick={() => addToCartHandler(data.product._id)}
              className="flex items-center space-x-2 rounded-3xl border font-bold bg-rose-900 px-5 py-2 text-white  hover:bg-white hover:border hover:border-rose-900 hover:text-rose-900"
            >
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              <span>Add To Cart</span>
            </button>
            <button
              onClick={() => wishlistButtonHandler(data.product)}
              className={`rounded-full ${
                data.product.isProductInWishlist ? 'bg-rose-900' : 'bg-white'
              } hover:bg-rose-900 border-2 border-rose-900 hover:border-rose-900 p-3`}
            >
              <svg
                fill="#000000"
                width="32px"
                height="32px"
                viewBox="-4.8 -4.8 41.60 41.60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M 9.5 5 C 5.363281 5 2 8.402344 2 12.5 C 2 13.929688 2.648438 15.167969 3.25 16.0625 C 3.851563 16.957031 4.46875 17.53125 4.46875 17.53125 L 15.28125 28.375 L 16 29.09375 L 16.71875 28.375 L 27.53125 17.53125 C 27.53125 17.53125 30 15.355469 30 12.5 C 30 8.402344 26.636719 5 22.5 5 C 19.066406 5 16.855469 7.066406 16 7.9375 C 15.144531 7.066406 12.933594 5 9.5 5 Z M 9.5 7 C 12.488281 7 15.25 9.90625 15.25 9.90625 L 16 10.75 L 16.75 9.90625 C 16.75 9.90625 19.511719 7 22.5 7 C 25.542969 7 28 9.496094 28 12.5 C 28 14.042969 26.125 16.125 26.125 16.125 L 16 26.25 L 5.875 16.125 C 5.875 16.125 5.390625 15.660156 4.90625 14.9375 C 4.421875 14.214844 4 13.273438 4 12.5 C 4 9.496094 6.457031 7 9.5 7 Z"></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
