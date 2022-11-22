import React from "react";
import PrivateRoute from "./PrivateRoute";
import Link from "next/link";
import Nav from "../components/navbar/Nav";
import roadTrip from '../public/images/roadTrip.jpg';
import Image from "next/image";

function afterPayment() {
  return (
    <div className="overflow-x-hidden">
      <nav>
        <Nav />
      </nav>
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="px-4 lg:py-8">
          <div className="lg:gap-4 md:flex">
            <div className="flex flex-col items-center justify-center md:py-12 lg:py-18">
              <h1 className="font-bold text-blue-600 text-5xl text-center">
                Payment Successfull!
              </h1>
              <p className="my-3 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                <span className="text-gray-700">Have a safe road trip!</span>
              </p>
              <p className="mb-8 text-center text-gray-600 md:text-lg">
                You can see the rental history on your dashboard.
              </p>
              <button
                className="px-6 py-3 my-2 hover:bg-blue-500 text-sm font-semibold rounded-md 
              text-gray-100 bg-blue-400"
              >
                <Link href="/auth/UserDashboard">User Dashboard</Link>
              </button>

              <button
                className="px-6 py-3 my-2 hover:bg-gray-700 text-sm font-semibold rounded-md 
                    text-gray-100 bg-gray-600"
              >
                <Link href="/">Go home</Link>
              </button>
            </div>
            <div className="hidden md:flex m-4">
              <Image
                src={roadTrip}
                alt="img"
                className="object-cover w-full h-full rounded-lg transform duration-200 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivateRoute(afterPayment);
