import { useApolloClient, useMutation } from '@apollo/client';
import { useState } from 'react';
import {
  ADD_PRODUCT_TO_CART,
  DELETE_PRODUCT_FROM_CART,
  REMOVE_PRODUCT_FROM_CART,
} from '~/api/products';
import {
  deleteCartItemFromProductsCache,
  deleteItemFromCartCache,
  updateCartItemQuantityCache,
} from '~/cache/ProductsCache';
import { ProductModel } from '~/models/ProductModels';
import Spinner from '../Spinner/Spinner';
const CartItem = ({
  product,
  quantity,
  user,
}: {
  product: ProductModel;
  quantity: number;
  user: any;
}) => {
  const client = useApolloClient();
  const userId = user;
  const [loading, setLoading] = useState(false);
  const [productQuantity, setProductQuantity] = useState(quantity);
  const [productTotalPrice, setProductTotalPrice] = useState(
    +product.price * quantity
  );
  const addProductToCartMutation = useMutation(ADD_PRODUCT_TO_CART)[0];
  const removeProductFromCartMutation = useMutation(
    REMOVE_PRODUCT_FROM_CART
  )[0];
  const deleteProductFromCartMutation = useMutation(
    DELETE_PRODUCT_FROM_CART
  )[0];

  const addToCartHandler = async (productId: string) => {
    try {
      setLoading(true);
      const promise = await addProductToCartMutation({
        variables: { productId, userId },
      });
      setProductQuantity((prevQuantity) => prevQuantity + 1);
      setProductTotalPrice(
        (prevTotalPrice) =>
          promise.data.addToCart.quantity *
          +promise.data.addToCart.product.price
      );
      updateCartItemQuantityCache(
        client.cache,
        productId,
        promise.data.addToCart.quantity,
        userId
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const removeFromCartHandler = async (productId: string) => {
    try {
      setLoading(true);
      const promise = await removeProductFromCartMutation({
        variables: { productId, userId },
      });
      setProductQuantity((prevQuantity) => prevQuantity - 1);
      setProductTotalPrice(
        (prevTotalPrice) =>
          promise.data.removeFromCart.quantity *
          +promise.data.removeFromCart.product.price
      );
      updateCartItemQuantityCache(
        client.cache,
        productId,
        promise.data.removeFromCart.quantity,
        userId
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const deleteProductHandler = async (productId: string) => {
    try {
      const promise = await deleteProductFromCartMutation({
        variables: { productId, userId },
      });
      deleteItemFromCartCache(client.cache, productId, userId);
      deleteCartItemFromProductsCache(client.cache, productId, false, userId);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <div className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
        <div className="flex w-2/5">
          <div className="w-20">
            <img
              className="h-24"
              src={`https://source.unsplash.com/800x600/?${
                product.category ? product.category : 'wallet'
              }`}
              alt=""
            />
          </div>
          <div className="flex flex-col justify-center ml-4 flex-grow">
            <span className="font-bold text-sm">
              {product.name} {product.description}
            </span>
            <span className="text-center w-1/5 font-semibold text-sm">
              {typeof product.price === 'number'
                ? product.price.toFixed(2)
                : product.price}
            </span>
          </div>
        </div>
        <div className="flex justify-center w-1/5">
          <svg
            className="fill-current text-gray-600 w-3 cursor-pointer"
            viewBox="0 0 448 512"
            onClick={() => {
              productQuantity === 1
                ? deleteProductHandler(product._id)
                : removeFromCartHandler(product._id);
            }}
          >
            <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
          </svg>

          <input
            onChange={() => {}}
            className="mx-2 border text-center w-8"
            type="text"
            value={productQuantity}
          />

          <svg
            className="fill-current text-gray-600 w-3 cursor-pointer"
            viewBox="0 0 448 512"
            onClick={() => addToCartHandler(product._id)}
          >
            <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
          </svg>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => deleteProductHandler(product._id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
          >
            <path
              d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z"
              fill="currentColor"
            ></path>
            <path
              d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        {loading ? (
          <span className="text-center w-1/5 font-semibold text-sm">
            <Spinner />
          </span>
        ) : (
          <span className="text-center w-1/5 font-semibold text-sm">
            {productTotalPrice.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartItem;
