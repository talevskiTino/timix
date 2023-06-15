import { useQuery, gql, useApolloClient } from '@apollo/client';
import { useContext } from 'react';
import authContext from '~/context/auth-context';
import { GET_USER } from '~/api/users';
import Spinner from '~/components/Spinner/Spinner';

function User() {
  const context = useContext(authContext);
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: context.userId },
    skip: !context.userId,
  });

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;
  if (data) {
    const { user } = data;
    return (
      <>
        <p>User email: {user.email}</p>
      </>
    );
  }

  return null;
}

export default User;
