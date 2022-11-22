import React, { useState } from "react";
import Link from "next/link";
import { MenuIcon, UserCircleIcon } from "@heroicons/react/solid";
import { useRouter } from "next/dist/client/router";
import { useAuth } from "../../contexts/AuthContext";

function Menu() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState(false);

  /* OPEN_CLOSE NAV */
  const handleNavClick = () => {
    setActive(!active);
  };

  /* SIGNOUT */
  async function handleLogout() {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      className={`flex items-center space-x-3 border-2 px-1 py-1.5 md:px-2 rounded-full active:bg-gray-100 hover:bg-gray-100 cursor-pointer`}
      onClick={handleNavClick}
    >
      <MenuIcon className="h-6 w-6 lg:h-6 lg:w-6" />
      {currentUser && currentUser.photoURL ? (
        <img
          className="inline-block h-5 w-5 lg:h-7 lg:w-7 rounded-full ring-2 ring-blue-500"
          src={currentUser.photoURL}
          alt="User Avatar"
        />
      ) : currentUser && currentUser.photoURL == null ? (
        <div
          className="p-2 w-5 h-5 lg:w-9 lg:h-7 flex justify-center items-center 
          rounded-full bg-blue-400 text-sm lg:text-lg text-white capitalize"
        >
          {currentUser.displayName?.slice(0, 2) ||
            currentUser.email?.slice(0, 2)}
        </div>
      ) : (
        <UserCircleIcon className="h-6 w-6 lg:h-7 lg:w-7 text-blue-400" />
      )}
      {/* {currentUser ? (
        <div
          className="p-2 w-5 h-5 lg:w-9 lg:h-7 flex justify-center items-center 
            rounded-full bg-blue-400 text-sm lg:text-lg text-white capitalize"
        >
          {currentUser.displayName?.slice(0,2) || currentUser.email?.slice(0,2)}
        </div>
      ) : (
        <UserCircleIcon className="h-6 w-6 lg:h-7 lg:w-7 text-blue-400" />
      )} */}

      <div
        className={`${
          active ? "" : "hidden"
        } origin-top-right absolute right-5 top-16 w-44 rounded-md shadow-lg 
      bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
      >
        {currentUser ? (
          <div className="p-1">
            <Link className="navItem" href="/auth/UserDashboard">
              <div className="navItem flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                User Dashboard
              </div>
            </Link>

            <Link href="/auth/ListCar">
              <div className="navItem flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                List your car
              </div>
            </Link>

            <Link href="/auth/MyCar">
              <div className="navItem flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
                My cars
              </div>
            </Link>
            <Link href="/auth/LikedCars">
              <div className="navItem flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Liked cars
              </div>
            </Link>
            <Link href="/contact">
              <div className="navItem flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div className="ml-2">Contact</div>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 block w-full text-sm hover:bg-gray-100"
            >
              <div className="navItem flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Log out
              </div>
            </button>
          </div>
        ) : (
          <div className="p-1">
            <Link className="navItem" href="/auth/LoginPage">
              <div className="navItem flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <div className=" ml-2">Login</div>
              </div>
            </Link>

            <Link href="/auth/SignUpPage">
              <div className="navItem flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <div className="ml-2">Sign up</div>
              </div>
            </Link>

            <Link href="/contact">
              <div className="navItem flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div className="ml-2">Contact</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
