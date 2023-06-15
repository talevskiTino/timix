import * as Z from 'zod';
import { useContext, useEffect, useRef, useState } from 'react';
import { ActionFunction, json } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { validationAction } from '~/utils/utils';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { LOGIN, REGISTER } from '~/api/users';
import { useNavigate } from '@remix-run/react';
import { AuthInput } from '~/models/UserModel';
import authContext from '../../context/auth-context';
import { setAccessToken } from '~/context/accessToken';
// const client = useApolloClient();

const schema = Z.object({
  email: Z.string({
    required_error: 'Email is required',
  }).email('Invalid email'),
  password: Z.string().min(6, 'Password must be at least 6 characters long'),
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
    email?: string;
    password?: string;
  };
}
const Auth = () => {
  const context = useContext(authContext);
  const loginUserMutation = useMutation(LOGIN)[0];
  const registerUserMutation = useMutation(REGISTER)[0];
  const navigate = useNavigate();
  const actionData = useActionData() as ActionData;
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLogin, setIsLogin] = useState(true);
  const toggleIsLogin = () => {
    setIsLogin(!isLogin);
  };

  const submitHandler = (actionData: ActionInput) => {
    let userInput = {
      email: actionData?.email,
      password: actionData?.password,
    };
    if (isLogin) {
      loginUser(userInput);
    } else {
      registerUser(userInput);
    }
  };

  const loginUser = async (loginInput: ActionInput) => {
    try {
      let res = await loginUserMutation({
        variables: { loginInput },
      });
      setAccessToken(res.data.loginUser.token);
      context.login(
        res.data.loginUser.token,
        res.data.loginUser.userId,
        res.data.loginUser.tokenExpiration,
        res.data.loginUser.role
      );
      navigate('/user');
    } catch (error) {
      console.error(error);
    }
  };

  // const updateUserInLocalStorage = (loggedInUser: AuthInput) => {
  //   const now = new Date().getTime();
  //   const expirationTime = 60 * 60 * (+loggedInUser.tokenExpiration * 1000);
  //   const authData = {
  //     value: loggedInUser,
  //     expiry: now + expirationTime,
  //   };
  // };

  const registerUser = async (registerInput: ActionInput) => {
    try {
      await registerUserMutation({
        variables: { registerInput },
      });
      loginUser(registerInput);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
    if (actionData && !actionData?.errors) {
      submitHandler(actionData as ActionInput);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-gray-900 text-7xl font-bold">
        {isLogin ? 'Login' : 'Register'}
      </p>
      <Form className="w-8/12 max-w-md" method="post">
        <div className="form-control">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            ref={emailRef}
            id="email"
            required
            autoFocus={true}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-error"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {actionData?.errors?.email && (
            <div className="pt-1 text-red-700" id="email-error">
              {actionData.errors.email}
            </div>
          )}
        </div>
        <div className="form-control">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            ref={passwordRef}
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {actionData?.errors?.password && (
            <div className="pt-1 text-red-700" id="password-error">
              {actionData.errors.password}
            </div>
          )}
        </div>
        <div className="flex items-center justify-evenly mt-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={toggleIsLogin}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Auth;
