import { Link, useNavigate } from '@remix-run/react';
import AuthContext from '../../context/auth-context';
import { useApolloClient, useLazyQuery } from '@apollo/client';
import { GET_USER } from '~/api/users';
import authContext from '../../context/auth-context';
import { useContext, useEffect, useState } from 'react';
import { GET_USER_CART_PRODUCTS, SEARCH_PRODUCTS } from '~/api/products';

const Navbar = () => {
  const context = useContext(authContext);
  const client = useApolloClient();
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // Input value state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  useEffect(() => {
    if (context && context.userId) {
      const observer = client.watchQuery({
        query: GET_USER_CART_PRODUCTS,
        variables: {
          userId: context.userId,
        },
      });
      const subscription = observer.subscribe((res) => {
        const cartItems = res?.data?.userCartItems || [];
        setCartItemsCount(cartItems.length);
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [context, client]);

  const handleSearchIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleBurgerToggle = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  const handleFormSubmit = (event: any) => {
    event.preventDefault(); // Prevent form submission
    const url = `/search?query=${searchQuery}`;
    navigate(url);
  };

  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <div>
            <div className="flex flex-wrap place-items-start">
              <section className="relative mx-auto w-full">
                <nav className="flex justify-between bg-rose-900 text-white w-full">
                  <div className="px-5 xl:px-12 py-6 flex w-full items-center">
                    <a
                      className="z-[1035] navbar-burger self-center cursor-pointer mr-12 lg:hidden"
                      onClick={handleBurgerToggle}
                    >
                      {isBurgerOpen && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                        >
                          <path
                            fill="currentColor"
                            d="M17.6 6.6l-4.6 4.6 4.6 4.6-1.4 1.4-4.6-4.6-4.6 4.6-1.4-1.4 4.6-4.6-4.6-4.6 1.4-1.4 4.6 4.6 4.6-4.6z"
                          />
                        </svg>
                      )}
                      {!isBurgerOpen && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </a>

                    <div>
                      <svg
                        fill="#000000"
                        width="64px"
                        height="64px"
                        viewBox="-3.2 -3.2 38.40 38.40"
                        id="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#000000"
                        transform="rotate(0)"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0">
                          <path
                            transform="translate(-3.2, -3.2), scale(1.2)"
                            d="M16,29.11410644816028C18.3611321764303,29.597335456081023,21.22195452118116,29.781109444082883,23.049255225393505,28.209668205901952C24.912117665805187,26.607644601810406,23.760772167111302,23.311849799068106,25.12393680893047,21.267707372705143C26.635693376615126,19.000742955103263,31.06211911615978,18.721729480472398,31.191441294219757,16C31.317967084277647,13.337123624063006,27.01525016564503,12.718079379608293,25.638643714259395,10.435126456949448C24.302232684135127,8.218833293406048,25.736582524801527,4.304748205167345,23.43070005708271,3.1296499653277987C21.071990446252705,1.9276305429237632,18.633983950721127,5.257687753568808,16,5.5231877863407135C13.744370448046723,5.750550492860211,11.596907434154883,4.0411571794051735,9.386605713930399,4.54526508604174C6.9025596600533845,5.1118064069622084,4.442009761654079,6.394834266017133,2.992149615064916,8.489914078679343C1.513036695320317,10.627264792191209,0.4116903500631133,13.621348600310169,1.4595742275317498,15.999999999999996C2.5725631988665043,18.52643716677852,6.384370015738386,18.445539984427572,8.267369370592185,20.464436375432538C9.56339980004111,21.854001990472383,9.17417247433633,24.212573950384154,10.44059009270535,25.629180419536105C11.923534995829877,27.287992893945308,13.82014816045032,28.66797825069852,16,29.11410644816028"
                            fill="#ffffff"
                            strokeWidth="0"
                          ></path>
                        </g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          stroke="#CCCCCC"
                          strokeWidth="0.192"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <defs>
                            <style></style>
                          </defs>
                          <polygon points="8 11 11 11 11 23 13 23 13 11 16 11 16 9 8 9 8 11"></polygon>
                          <path d="M23,15V13H20V11H18v2H16v2h2v6a2,2,0,0,0,2,2h3V21H20V15Z"></path>
                        </g>
                      </svg>{' '}
                    </div>
                    <ul className="hidden lg:flex px-4 mr-auto font-semibold font-heading space-x-12">
                      <li>
                        <Link to={'/'} className="hover:text-gray-200">
                          Home
                        </Link>
                      </li>
                      {!context.token && (
                        <li>
                          <Link to={'/auth'} className="hover:text-gray-200">
                            Login
                          </Link>
                        </li>
                      )}
                      {context.token && (
                        <li>
                          <Link
                            to={'/'}
                            onClick={context.logout}
                            className="hover:text-gray-200"
                          >
                            Logout
                          </Link>
                        </li>
                      )}

                      <li>
                        <Link to={'/products'} className="hover:text-gray-200">
                          Products
                        </Link>
                      </li>
                    </ul>

                    <div className="flex items-center space-x-5 ml-auto">
                      <div className="relative flex items-center">
                        <svg
                          onClick={handleSearchIconClick}
                          className={`w-6 h-6 cursor-pointer ${
                            isSearchOpen ? 'absolute left-10' : '' // Add Tailwind CSS animation class
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          stroke="#ffffff"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            <path
                              clipRule="evenodd"
                              d="m3.75 11c0-4.00406 3.24594-7.25 7.25-7.25 4.0041 0 7.25 3.24594 7.25 7.25 0 1.9606-.7782 3.7394-2.0427 5.0444-.0306.0225-.0599.0476-.0876.0753s-.0528.057-.0753.0876c-1.3049 1.2644-3.0838 2.0427-5.0444 2.0427-4.00406 0-7.25-3.2459-7.25-7.25zm12.8842 6.6949c-1.5222 1.2824-3.488 2.0551-5.6342 2.0551-4.83249 0-8.75-3.9175-8.75-8.75 0-4.83249 3.91751-8.75 8.75-8.75 4.8325 0 8.75 3.91751 8.75 8.75 0 2.1462-.7727 4.112-2.0551 5.6342l3.8354 3.8355c.2929.2929.2929.7677 0 1.0606s-.7677.2929-1.0606 0z"
                              fill="#ffffff"
                              fillRule="evenodd"
                            ></path>
                          </g>
                        </svg>
                        <form onSubmit={handleFormSubmit}>
                          <input
                            className={`${
                              isSearchOpen ? 'flex' : 'hidden'
                            } ml-8 p-2 border-white border-solid border-2 rounded-lg bg-rose-900 text-sm`} // Add Tailwind CSS margin class
                            type="text"
                            placeholder="Search..."
                            style={{ paddingLeft: '35px' }}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => setIsSearchOpen(false)}
                          />
                        </form>
                      </div>
                      <Link to={'/wishlist'} className="hover:text-gray-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </Link>
                      {context.token && (
                        <>
                          <Link
                            to={'/cart'}
                            className="flex items-center hover:text-gray-200"
                          >
                            {cartItemsCount}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span className="flex absolute -mt-5 ml-4">
                              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                            </span>
                          </Link>
                          <Link
                            to={'/user'}
                            className="flex items-center hover:text-gray-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 hover:text-gray-200"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </nav>
              </section>
            </div>
            <div
              className={`lg:hidden z-20 absolute top-0 left-0 h-full w-60 transform duration-300 ${
                isBurgerOpen ? 'translate-x-full' : 'translate-x-0'
              }`}
            >
              <nav
                id="sidenav-3"
                className="bg-rose-900 fixed left-0 top-100 h-screen w-60 -translate-x-full overflow-y-visible white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0"
                data-te-sidenav-init
                data-te-sidenav-hidden="true"
                data-te-sidenav-color="white"
              >
                <ul
                  className="relative mt-28 list-none px-[0.2rem]"
                  data-te-sidenav-menu-ref
                >
                  <li>
                    <Link
                      to={'/'}
                      className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-white font-bold outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                    >
                      Home
                    </Link>
                  </li>
                  {!context.token && (
                    <li>
                      <Link
                        to={'/auth'}
                        className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-white font-bold outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                      >
                        Login
                      </Link>
                    </li>
                  )}
                  {context.token && (
                    <li>
                      <Link
                        to={'/'}
                        onClick={context.logout}
                        className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-white font-bold outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                      >
                        Logout
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link
                      to={'/products'}
                      className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-white font-bold outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                    >
                      Products
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default Navbar;
