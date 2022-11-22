import React from "react";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import banner from "../../public/images/bannner.jpg";
import background from "../../public/images/background.svg";
import { useAuth } from "../../contexts/AuthContext";

function Banner() {
  const router = useRouter();
  const { currentUser } = useAuth();
  return (
    <>
      <div className="pt-24 relative bg-gray-100 min-h-[100vh] ">
        <Image
          src={background}
          alt="svg"
          layout="fill"
          objectFit="cover"
          className="relative z-0"
        />
        <div className="container relative px-3 mx-auto flex flex-wrap justify-center flex-col md:flex-row items-center">
          <div className="flex flex-col align-middle w-full md:w-2/5 justify-center items-start text-center lg:text-left">
            <p className="uppercase tracking-loose w-full">
              Explore the car sharing platform
            </p>
            <div className="flex flex-col w-full align-middle justify-center">
              <h1 className="my-4 text-4xl sm:text-5xl font-bold leading-tight md:text-left">
                Welcome to <br />{" "}
                <span className="text-blue-500">Car Rental</span>
              </h1>
              <p className="leading-normal text-2xl mb-4 lg:mx-2">
                Rent your perfect car from others and hit the road.
              </p>
            </div>

            <button
              className="mx-auto lg:mx-0 hover:outline-blue-800 bg-blue-500 text-gray-100 font-semibold
              rounded-full my-6 py-4 px-8 shadow-lg focus:shadow-outline transform transition
              hover:scale-105 duration-300 ease-in-out"
              onClick={() => {
                currentUser
                  ? router.push({
                      pathname: "/search",
                      query: {
                        location: 'paris',
                        startDate: new Date().toISOString(),
                        endDate: new Date(
                          new Date().valueOf() + 1000 * 3600 * 24
                        ).toISOString(),
                      },
                    })
                  : router.push("/auth/SignUpPage");
              }}
            >
              Let's start
            </button>
          </div>

          <div className="w-5/6 md:w-3/6 py-2 text-center">
            <Image
              className="rounded-2xl transform transition
              hover:scale-105 duration-300 ease-in-out"
              src={banner}
              alt="Header Image"
            />
            <div className="text-gray-700 font-medium italic">
              {" "}
              Get inspired by some dreamy road trips.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
