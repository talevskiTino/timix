import { useApolloClient, useQuery } from '@apollo/client';
import { Link } from '@remix-run/react';
import { useContext, useMemo } from 'react';
import {
  GET_ANONYMOUS_USER_WISHLIST,
  GET_PRODUCTS,
  GET_USER_WISHLIST,
} from '~/api/products';
import Spinner from '~/components/Spinner/Spinner';
import authContext from '~/context/auth-context';
import { ProductModel } from '~/models/ProductModels';
import Product from '~/components/Product/Product';
import { getTempWishlistFromBrowser } from '~/utils/utils';

interface CartListProps {
  cartData: any;
}

const Products: React.FC<CartListProps> = () => {
  const context = useContext(authContext);
  const userId = context?.userId;
  const tempWishlist = getTempWishlistFromBrowser();
  const {
    loading: wishlistLoading,
    error: wishlistError,
    data: wishlistData,
  } = useQuery(GET_USER_WISHLIST, {
    skip: !userId,
    variables: { userId },
  });

  const {
    loading: anonymousWishlistLoading,
    error: anonymousWishlistError,
    data: anonymousWishlistData,
  } = useQuery(GET_ANONYMOUS_USER_WISHLIST, {
    skip: !!userId,
    variables: {
      productIds: tempWishlist?.products || [],
    },
  });

  if (wishlistLoading || anonymousWishlistLoading) return <Spinner />;
  if (wishlistError || anonymousWishlistError)
    return <p>Something went wrong</p>;

  const mergedWishlistData = (wishlistData?.userWishlist ?? []).concat(
    anonymousWishlistData?.getProductsByIds ?? []
  );

  return (
    <>
      {!wishlistLoading && !wishlistError && (
        <div>
          <section className="py-10 bg-gray-100">
            <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {mergedWishlistData?.map((product: ProductModel) => (
                <Link to={`/products/${product?._id}`} key={product?._id}>
                  <Product userId={userId} product={product} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Products;
