import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import { db } from "../../firebase_config";
import Error from "../../components/errors/Error";
import nocar from "../../public/images/noCar.png";
import { useCar } from "../../contexts/CarContext";
import { UserCircleIcon } from "@heroicons/react/solid";

function PopularCars() {
  const router = useRouter();
  const { toTimestamp } = useCar();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ref = React.useRef(null);
  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };
  useEffect(() => {
    async function fetchCarData() {
      setLoading(true);
      const popularCars = db.collection("cars");
      popularCars
        .get()
        .then((data) => {
          const cars = data.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });

          /* Shuffle the array */
          const sortedCars = cars.map(function(n){ return [Math.random(), n] })
          .sort().map(function(n){ return n[1] });
 
          /* check if somebody already rented and select 5 car*/
          const filterByAvailability = sortedCars
            ?.filter((car) => car.car["available"])
            .slice(0, 5);

          setCars(filterByAvailability);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to bring cars", error);
          setError("Failed to bring cars");
        });
    }
    fetchCarData();
  }, []);

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <section className=" mx-5">
          <h3 className="text-4xl font-extrabold text-center my-2 text-blue-500">
            Popular Cars
          </h3>
          <div className="flex justify-center align-center text-center my-3">
            <hr className="border-gray-400 w-2/5" />
          </div>
          <div className="flex justify-evenly">
            <button
              className="cursor-pointer z-10 hover:shadow-lg"
              onClick={() => scroll(-200)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-11 w-11"
                viewBox="0 0 20 20"
                fill="rgba(55, 65, 81)"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              className="z-10 cursor-pointer px-3 hover:shadow-lg"
              onClick={() => scroll(200)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-11 w-11"
                viewBox="0 0 20 20"
                fill="rgba(55, 65, 81)"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            ref={ref}
            className="flex space-x-3 overflow-scroll 
            scrollbar-hide -ml-3 p-3 mx-4"
            style={{
              scrollBehavior: "smooth",
            }}
          >
            {cars.map((car, key) => (
              <div className="pb-12" key={key}>
                <div
                  className="relative w-72 h-64 sm:h-80 sm:w-96 cursor-pointer hover:scale-105
                    transform transition duration-300 ease-out"
                  onClick={() => {
                    router.push({
                      pathname: "/carDetails",
                      query: {
                        location: car["car"]["city"],
                        carID: car["car"]["carID"],
                        startDate: toTimestamp(new Date().toISOString()),
                        endDate: toTimestamp(
                          new Date(
                            new Date().valueOf() + 1000 * 3600 * 24
                          ).toISOString()
                        ),
                        lng: car["car"]["location"]["lng"],
                        lat: car["car"]["location"]["lat"],
                      },
                    });
                  }}
                >
                  <Image
                    src={
                      car["car"]["carImage"]["img1"]
                        ? car["car"]["carImage"]["img1"]
                        : nocar
                    }
                    layout="fill"
                    className="rounded-xl"
                  />
                </div>
                <div className="flex flex-col justify-center align-middle text-center">
                  <div className="text-xl mt-3 ">
                    <div className="text-center font-semibold text-gray-700  mt-1">
                      {car["car"]["brand"] + "" + car["car"]["model"]}
                    </div>
                    <div>
                      <div className="text-center mt-2 flex justify-center">
                        <div className="m-2 text-center flex">
                          {car["user"]["userPhoto"] ? (
                            <img
                              className="inline-block mr-2 h-5 w-5 lg:h-8 lg:w-8 rounded-full ring-1 ring-blue-500"
                              src={car["user"]["userPhoto"]}
                              alt="User Avatar"
                            />
                          ) : (
                            <UserCircleIcon className="h-7 w-7 lg:h-8 lg:w-8 text-blue-400" />
                          )}
                        </div>
                        <div className="ml-1 mt-1 md:mt-2 ">
                          {car["car"]["city"]} <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default PopularCars;
