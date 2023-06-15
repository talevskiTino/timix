export type UserModel = {
  __typename: 'User';
  id: string;
  email: string;
  password: string;
  products: [];
};

export type AuthInput = {
  userId: string;
  token: string;
  tokenExpiration: string;
};
