import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import { Link } from '@remix-run/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  GET_PRODUCTS,
  GET_USER_WISHLIST,
  SEARCH_PRODUCTS,
} from '~/api/products';
import Spinner from '~/components/Spinner/Spinner';
import authContext from '~/context/auth-context';
import { ProductModel } from '~/models/ProductModels';
import Product from '~/components/Product/Product';
import { useLocation } from 'react-router-dom'; // Example usage with React Router
import { useParams, useSearchParams } from '@remix-run/react';

const Products = () => {
  const [searchParams] = useSearchParams();
  const client = useApolloClient();
  const context = useContext(authContext);
  const userId = context?.userId;
  const query = searchParams.get('query');
  const [searchProducts, { data, loading, error }] =
    useLazyQuery(SEARCH_PRODUCTS);
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [query]);
  const fetchProducts = async () => {
    try {
      if (!query) return;
      const productsData = client.readQuery({
        query: GET_PRODUCTS,
        variables: {
          userId,
        },
      });

      let filteredProducts: ProductModel[] = [];
      if (productsData) {
        filteredProducts = productsData.products.filter(
          (product: ProductModel) => {
            return (
              product.name.toLowerCase().includes(query!.toLowerCase()) ||
              product.description.toLowerCase().includes(query!.toLowerCase())
            );
          }
        );
      } else {
        const searchResult = await searchProducts({
          variables: { query },
        });
        filteredProducts = searchResult.data.searchProducts;
      }

      setProducts(filteredProducts);
      console.log(123, 1, filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong</p>;
  if (products)
    return (
      <div>
        <section className="py-10 bg-gray-100">
          <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {products.map((product: ProductModel) => (
              <Link to={`/products/${product?._id}`} key={product?._id}>
                <Product userId={userId} product={product} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
};

export default Products;
