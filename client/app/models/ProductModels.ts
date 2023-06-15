import { UserModel } from './UserModel';

export type ProductModel = {
  __typename: 'Product';
  _id: string;
  name: string;
  description: string;
  status: string;
  price: number;
  category: string;
  images: [string];
  user: UserModel;
  isProductInWishlist: boolean;
  isProductInCart: boolean;
};
export type CartItemModel = {
  __typename: 'CartItemWithProduct';
  product: {
    __typename: 'Product';
    _id: string;
    name: string;
    description: string;
    status: string;
    price: number;
    category: string;
    images: [string];
    user: UserModel;
    isProductInWishlist: boolean;
    isProductInCart: boolean;
  };
  quantity: number;
};
