import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { Form, Link, useActionData } from '@remix-run/react';
import { useContext, useEffect, useState } from 'react';
import { ADD_PRODUCT, GET_PRODUCTS } from '~/api/products';
import Spinner from '~/components/Spinner/Spinner';
import Product from '~/components/Product/Product';
import authContext from '~/context/auth-context';
import { ProductModel } from '~/models/ProductModels';
import { ROLE_ADMIN, ROLE_USER } from '~/utils/constants';
import Backdrop from '../../components/Backdrop/Backdrop';
import Modal from '../../components/Modal/Modal';
import AddProductForm from '../../components/AddProductForm/AddProductForm';
import * as Z from 'zod';
import { getTempWishlistFromBrowser, validationAction } from '~/utils/utils';
import { ActionFunction, json } from '@remix-run/node';
import { successToaster } from '~/utils/toasterNotifications';
import { addProductCache } from '~/cache/ProductsCache';

const schema = Z.object({
  name: Z.string().min(1, 'Name is required'),
  description: Z.string().min(1, 'Description is required'),
  price: Z.string().min(1, 'Price is required'),
  status: Z.string().min(1, 'Status is required'),
  category: Z.string().min(1, 'Category is required'),
  images: Z.string().min(1, 'Image is required'),
  // userId: Z.string().min(1, 'User is required'),
});
type ActionInput = Z.TypeOf<typeof schema>;
export const action: ActionFunction = async ({ request }) => {
  const { formData, errors } = await validationAction<ActionInput>({
    request,
    schema,
  });
  if (errors) {
    return json({ errors }, { status: 400 });
  }
  return formData;
};
interface ActionData {
  errors?: {
    name?: string;
    description?: string;
    price?: string;
    status?: string;
    category?: string;
    images?: string | string[];
    userId?: string;
  };
}
const Products = () => {
  const addProduct = useMutation(ADD_PRODUCT)[0];
  const [createProduct, setCreateProduct] = useState(false);
  const context = useContext(authContext);
  const client = useApolloClient();
  const actionData = useActionData() as ActionData;
  const userId = context?.userId;
  const [anonymousUserProductsData, setAnonymousUserProductsData] = useState<
    ProductModel[] | null
  >(null);

  const {
    loading: productsLoading,
    error: errorProducts,
    data: productsData,
  } = useQuery(GET_PRODUCTS, {
    variables: {
      userId: userId || null,
    },
  });

  useEffect(() => {
    if (!userId) {
      const updatedProducts = productsData?.products.map(
        (product: ProductModel) => {
          let tempWishlist = getTempWishlistFromBrowser();
          if (tempWishlist && tempWishlist.products.includes(product._id)) {
            return { ...product, isProductInWishlist: true };
          } else {
            return { ...product, isProductInWishlist: false };
          }
        }
      );
      setAnonymousUserProductsData(updatedProducts);
      console.log(123123123, anonymousUserProductsData);
    }
    return () => {
      setAnonymousUserProductsData(null);
    };
  }, [productsData]);

  const createProductHandler = () => {
    setCreateProduct(true);
  };
  const modalCancelHandler = () => {
    setCreateProduct(false);
  };
  const modalConfirmHandler = () => {
    setCreateProduct(false);
  };

  const addProductHandler = async (productInput: any) => {
    try {
      let product = (await addProduct({
        variables: { productInput },
      })) as ProductModel;
      setCreateProduct(false);
      addProductCache(client.cache, product, userId!);
      successToaster('Product created!');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (actionData && !actionData?.errors) {
      let productInput = {
        ...actionData,
        userId,
      };
      addProductHandler(productInput);
    }
  }, [actionData]);

  if (productsLoading) return <Spinner />;
  if (errorProducts) return <p>Something went wrong</p>;
  const productsToMap = userId
    ? productsData?.products
    : anonymousUserProductsData;
  console.log('productsToMap', productsToMap);
  return (
    <>
      {context?.role === ROLE_ADMIN && (
        <div className="relative">
          <div className="w-36 ml-auto mt-2 mr-2 mb-2 flex items-center justify-center">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-900 text-black cursor-pointer"
              onClick={createProductHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="ml-2 whitespace-nowrap">Add Product</span>
          </div>
        </div>
      )}
      {createProduct && <Backdrop />}
      {createProduct && (
        <Modal
          title="Add Product"
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
        >
          <Form className="max-w-xl mx-auto" method="post">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  // required
                  autoFocus={true}
                  name="name"
                  autoComplete="name"
                  aria-invalid={actionData?.errors?.name ? true : undefined}
                  aria-describedby="name-error"
                  className={`w-full bg-gray-100 border ${
                    actionData?.errors?.name
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } p-2 rounded-lg focus:outline-none focus:bg-white`}
                />
                {actionData?.errors?.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData?.errors?.name}
                  </p>
                )}
              </div>
              <div className="form-control">
                <label
                  htmlFor="category"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  // required
                  autoFocus={true}
                  name="category"
                  autoComplete="category"
                  aria-invalid={actionData?.errors?.category ? true : undefined}
                  aria-describedby="category-error"
                  className={`w-full bg-gray-100 border ${
                    actionData?.errors?.category
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } p-2 rounded-lg focus:outline-none focus:bg-white`}
                >
                  <option value="">-- Select category --</option>
                  <option value="WALLET">Wallet</option>
                  <option value="BELT">Belt</option>
                  <option value="BRACELET">Bracelet</option>
                  <option value="GLASSES">Glasses</option>
                </select>
                {actionData?.errors?.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData?.errors?.category}
                  </p>
                )}
              </div>
            </div>
            <div className="form-control">
              <label
                htmlFor="description"
                className="block text-gray-700 font-bold mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                autoFocus={true}
                name="description"
                autoComplete="description"
                aria-invalid={
                  actionData?.errors?.description ? true : undefined
                }
                aria-describedby="description-error"
                className={`w-full bg-gray-100 border ${
                  actionData?.errors?.description
                    ? 'border-red-500'
                    : 'border-gray-300'
                } p-2 rounded-lg focus:outline-none focus:bg-white`}
              ></textarea>
              {actionData?.errors?.description && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData?.errors?.description}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  autoFocus={true}
                  name="price"
                  autoComplete="price"
                  aria-invalid={actionData?.errors?.price ? true : undefined}
                  aria-describedby="price-error"
                  className="w-full bg-gray-100 border border-gray-300 p-2 rounded-lg focus:outline-none focus:bg-white"
                />
                {actionData?.errors?.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData?.errors?.price}
                  </p>
                )}
              </div>
              <div className="form-control">
                <label
                  htmlFor="status"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  autoFocus={true}
                  name="status"
                  autoComplete="status"
                  aria-invalid={actionData?.errors?.status ? true : undefined}
                  aria-describedby="status-error"
                  className="w-full bg-gray-100 border border-gray-300 p-2 rounded-lg focus:outline-none focus:bg-white"
                >
                  <option value="">-- Select status --</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="OUT_OF_STOCK">Out of stock</option>
                </select>
                {actionData?.errors?.status && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData?.errors?.status}
                  </p>
                )}
              </div>
            </div>
            <div className="form-control">
              <label
                htmlFor="images"
                className="block text-gray-700 font-bold mb-2"
              >
                Images (comma separated URLs)
              </label>
              <input
                type="text"
                id="images"
                autoFocus={true}
                name="images"
                autoComplete="images"
                aria-invalid={actionData?.errors?.images ? true : undefined}
                aria-describedby="images-error"
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-lg focus:outline-none focus:bg-white"
              />
              {actionData?.errors?.images && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData?.errors?.images}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-rose-900 hover:bg-rose-700 text-white font-bold py-2 px-4 my-6 rounded focus:outline-none focus:shadow-outline"
            >
              Add Product
            </button>
          </Form>{' '}
        </Modal>
      )}

      {!productsLoading && !errorProducts && (
        <div>
          <section className="py-10 bg-gray-100">
            <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {productsToMap?.map((product: ProductModel) => (
                <Link to={product?._id} key={product?._id}>
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
