import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Image from "next/image";
import PrivateRoute from "../PrivateRoute";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import Nav from "../../components/navbar/Nav";
import { CalendarIcon } from "@heroicons/react/outline";
import Error from "../../components/errors/Error";
import empty from "../../public/images/empty.png";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import available from "../../public/logos/available.png";
import expired from "../../public/logos/expired.png";
import { useCar } from "../../contexts/CarContext";

function MyCar() {
  const { user } = useAuth();
  const router = useRouter();
  const { timeConverter } = useCar();

  const [error, setError] = useState("");
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchLikedCars = JSON.parse(localStorage.getItem("likedCars"));

  /* Receive car data if user has a car in the database */
  //   useEffect(() => {
  //     const fetchData = () => {
  //       const myCars = db.collection("cars");
  //       myCars
  //         .get()
  //         .then((data) => {
  //           if (data.size === 0) {
  //             console.log("Cars not found.");
  //           }
  //           const cars = data.docs.map((doc) => {
  //             return { id: doc.id, ...doc.data() };
  //           });
  //           if (user.uid) {
  //             const filterCars = cars.filter((theCar, key) => {
  //               theCar.car.carID == fetchLikedCars[0].carID;
  //             });
  //             setCars(filterCars);
  //           } else {
  //             setCars(cars);
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("Failed to bring car", error);
  //           setError(error);
  //         });
  //     };
  //     fetchData();
  //   }, []);

  //console.log(cars);

  return (
    <div className="overflow-x-hidden">
      <Nav />
      <div className="flex justify-center mt-5">
        <h2
          className="text-3xl text-blue-400 font-display font-semibold lg:text-left xl:text-4xl
                    xl:text-bold"
        >
          Liked Cars
        </h2>
      </div>

      <Breadcrumb
        title1={"User Dashboard"}
        href1={"/auth/UserDashboard"}
        title2={"List new car"}
        href2={"/auth/ListCar"}
        title3={"My Cars"}
        href3={"/auth/MyCar"}
      />

      {error && <Error error={error} />}

      <section className="mt-10 lg:mt-12 pb-10 lg:pb-10 flex justify-center align-center">
        <div className="container m-2 sm:m-4">
          <div className="flex flex-wrap -mx-4 m-2 justify-center">
            {/* Filter user cars here */}
            {fetchLikedCars?.length > 0 ? (
              fetchLikedCars?.map((car, key) => (
                <div key={key} className="w-full md:w-1/2 xl:w-1/3 px-4">
                  <div className="bg-gray-50 hover:shadow-lg rounded-xl overflow-hidden mb-10 border-2">
                    <img
                      src={car.carImg}
                      alt="image"
                      className="w-full transform duration-200 hover:scale-110"
                    />
                    <div className="p-8 sm:p-9 md:p-7 xl:p-9 text-center">
                      <h3>
                        <Link href="#">
                          <p
                            className="
                            font-semibold
                            text-dark text-xl
                            sm:text-[22px]
                            md:text-xl
                            lg:text-[22px]
                            xl:text-xl
                            2xl:text-[22px]
                            mb-4
                            block
                            cursor-pointer                    
                            "
                          >
                            {car?.brand} {car?.model}
                          </p>
                        </Link>
                      </h3>
                      <p className="text-base text-body-color leading-relaxed mb-7">
                        {car?.description}
                      </p>
                      <div className="p-4 border-t text-sm text-gray-800 flex flex-col justify-around">
                        <div className="flex flex-col items-left align-center">
                          <div className="flex flex-row m-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 m-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>{" "}
                            <div className="text-lg text-md font-semibold pb-1 lg:text-lg">
                              {car?.city}
                            </div>
                          </div>
                          <div className="flex flex-row m-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 m-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-lg text-md font-semibold pb-1 lg:text-lg">
                              {car?.price} € / day
                            </p>
                          </div>
                          <div className="flex justify-start align-middle items-center mb-1">
                            <div className="flex justify-end align-middle">
                              <div>
                                <CalendarIcon className="h-6 w-6 m-2" />
                              </div>
                              <div className="mt-2 text-left text-md font-semibold pb-1 lg:text-lg">
                                from {timeConverter(car?.startDate)} to{" "}
                                {timeConverter(car?.endDate)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-1">
                            {car?.endDate > Date.parse(new Date()) / 1000 &&
                            car?.available ? (
                              <Image
                                src={available}
                                width={50}
                                height={50}
                                alt="Available"
                              />
                            ) : (
                              <Image
                                src={expired}
                                width={50}
                                height={50}
                                alt="Expired"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className=" flex flex-col justify-center align-middle text-center my-2">
                <Image src={empty} width={200} height={250} alt="No Data" />
                <div
                  className="text-center font-semibold text-xl my-3 text-gray-600 font-display lg:text-2xl
                      lg:text-bold "
                >
                  You have not liked any car yet.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivateRoute(MyCar);
