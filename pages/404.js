import React from "react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import notFound from "../public/images/notFound_404Page.png";
import Image from "next/image";

export default function Custom404() {
    return (
        <div>
        <div className="flex items-center justify-center w-screen h-screen overflow-x-hidden">
          <div className="px-8 mt-12 sm:py-4">
            <div className="sm:gap-4 sm:flex">
              <div className="flex flex-col items-center justify-center md:py-24 lg:py-32">
                {/* <h1 className="font-bold text-blue-600 text-9xl">404</h1> */}
                <p className="md:mb-4 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                  <span className="text-blue-500">Oops!</span> Page not found
                </p>
                <p className="my-3 text-center">
                  <span className="text-md font-normal text-gray-500 md:text-md">
                    The page you’re looking for doesn’t exist.
                  </span>
                </p>
  
 
  
                <div className="px-6 py-3 my-2 hover:bg-blue-500 text-sm font-semibold rounded-md text-gray-100 bg-blue-400">
                  <Link href="/">Go home</Link>
                </div>
              </div>
              <div className="m-1 hidden md:flex justify-center align-center text-center">
                <Image src={notFound} width={450} height={600} alt="NOT FOUND" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

 
 