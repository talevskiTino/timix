import { useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react';
import { GET_USER_CART_PRODUCTS } from '~/api/products';
import Spinner from '~/components/Spinner/Spinner';
import CartList from '~/components/Cart/CartList';
import authContext from '~/context/auth-context';
interface CartListProps {
  cartData: any;
}

const Products: React.FC<CartListProps> = () => {
  const context = useContext(authContext);
  const userId = context?.userId;
  const {
    loading: cartDataLoading,
    error: cartDataError,
    data: cartData,
  } = useQuery(
    GET_USER_CART_PRODUCTS,
    useMemo(
      () => ({
        skip: !userId,
        variables: { userId },
      }),
      [context?.userId]
    )
  );
  if (cartDataLoading) return <Spinner />;
  if (cartDataError || !userId) return <p>Something went wrong</p>;
  return (
    <>
      {!cartDataLoading && !cartDataError && (
        <CartList userId={userId} cartDataProps={cartData} />
      )}
    </>
  );
};

export default Products;
