import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query Query {
    users {
      id
      name
      email
      products {
        name
        images
        price
      }
    }
  }
`;
export const GET_USER = gql`
  query Query($userId: ID!) {
    user(id: $userId) {
      email
    }
  }
`;
export const LOGIN = gql`
  mutation Mutation($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      userId
      token
      tokenExpiration
      role
    }
  }
`;
export const REGISTER = gql`
  mutation Mutation($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
      _id
      email
    }
  }
`;
