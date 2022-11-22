import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Image from "next/image";
import PrivateRoute from "../PrivateRoute";
import { useRouter } from "next/dist/client/router";
import Nav from "../../components/navbar/Nav";
import { db } from "../../firebase_config";
import { CalendarIcon } from "@heroicons/react/outline";
import Error from "../../components/errors/Error";
import notfound from "../../public/images/notfound.png";
import DeleteModal from "../../components/modals/DeleteModal";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import { useCar } from "../../contexts/CarContext";
import noCar from "../../public/images/noCar.png";

function MyCar() {
  const { user } = useAuth();
  const router = useRouter();
  const { timeConverter } = useCar();
  const [error, setError] = useState("");
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);

  /* Receive car data if user has a car in the database */
  useEffect(() => {
    const fetchData = () => {
      const myCars = db.collection("cars");
      myCars
        .get()
        .then((data) => {
          if (data.size === 0) {
            console.log("Cars not found.");
          }
          const cars = data.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
          if (user.uid) {
            const filterCars = cars.filter(
              (theCar) => theCar.user.userID === user.uid
            );
            setCars(filterCars);
          } else {
            setCars(cars);
          }
        })
        .catch((error) => {
          console.error("Failed to bring car", error);
          setError(error);
        });
    };
    fetchData();
  }, []);

  // console.log(cars);

  return (
    <div className="overflow-x-hidden">
      <Nav />
      <div className="flex justify-center mt-5">
        <h2
          className="text-3xl text-blue-400 font-display font-semibold lg:text-left xl:text-4xl
                    xl:text-bold"
        >
          My Cars
        </h2>
      </div>

      <Breadcrumb
        title1={"User Dashboard"}
        href1={"/auth/UserDashboard"}
        title2={"List new car"}
        href2={"/auth/ListCar"}
        title3={"Liked Cars"}
        href3={"/auth/LikedCars"}
      />

      {error && <Error error={error} />}

      <section className="mt-10 lg:mt-12 pb-10 lg:pb-10 flex justify-center align-center">
        <div className="container m-2 sm:m-4">
          <div className="flex flex-wrap -mx-4 m-2 justify-center">
            {/* Filter user cars here */}
            {cars.length > 0 ? (
              cars.map((car, key) => (
                <div key={key} className="w-full md:w-1/2 xl:w-1/3 px-4">
                  <div className="bg-gray-50 w-full hover:shadow-lg rounded-xl overflow-hidden mb-10 border-2">
                    {car?.car["carImage"]["img1"] ||
                    car?.car["carImage"]["img2"] ? (
                      <img
                        src={
                          car?.car["carImage"]["img1"]
                            ? car?.car["carImage"]["img1"]
                            : car?.car["carImage"]["img2"]
                        }
                        alt="Car Image"
                        className="w-full cursor-pointer transform duration-200 hover:scale-110"
                        onClick={() => {
                          router.push({
                            pathname: "/auth/MyCarDetails",
                            query: {
                              city: car?.car["city"],
                              carID: car?.car["carID"],
                              brand: car?.car["brand"],
                              lng: car?.car["location"]["lng"],
                              lat: car?.car["location"]["lat"],
                              startDate: car?.reservationDetails["startDate"],
                              endDate: car?.reservationDetails["endDate"],
                              price: car?.reservationDetails["price"],
                            },
                          });
                        }}
                      />
                    ) : (
                      <div className="flex justify-center align-middle">
                        <Image
                          src={noCar}
                          alt="Car Image"
                          className="w-full transform duration-200 hover:scale-110"
                        />
                      </div>
                    )}

                    <div className="p-8 sm:p-9 md:p-7 xl:p-9 text-center">
                      <h3
                        onClick={() => {
                          router.push({
                            pathname: "/auth/MyCarDetails",
                            query: {
                              city: car?.car["city"],
                              carID: car?.car["carID"],
                              brand: car?.car["brand"],
                              lng: car?.car["location"]["lng"],
                              lat: car?.car["location"]["lat"],
                              startDate: car?.reservationDetails["startDate"],
                              endDate: car?.reservationDetails["endDate"],
                              price: car?.reservationDetails["price"],
                            },
                          });
                        }}
                        className="cursor-pointer"
                      >
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
                            "
                        >
                          {car?.car["brand"]} {car?.car["model"]}
                        </p>
                      </h3>
                      <p className="text-base text-body-color leading-relaxed mb-7">
                        {car?.car["carDescription"].length > 250
                          ? car?.car["carDescription"]
                              .substring(0, 250)
                              .concat("...")
                          : car?.car["carDescription"]}
                      </p>
                      <div className="p-4 border-t text-sm text-gray-800 flex flex-col justify-around">
                        <div className="flex items-center">
                          <p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 lg:h-7 lg:w-7 m-2 mb-2"
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
                          </p>
                          <p className="text-lg text-md font-semibold pb-1 lg:text-lg">
                            {car?.reservationDetails["price"]} € / day
                          </p>
                        </div>
                        <div className="flex justify-start align-middle items-center mb-1">
                          <div className="flex justify-end align-middle">
                            <div>
                              <CalendarIcon className="h-6 w-6 m-2" />
                            </div>
                            <div className="mt-2 text-left text-md font-semibold pb-1 lg:text-lg">
                              from{" "}
                              {timeConverter(
                                car?.reservationDetails["startDate"]
                              )}{" "}
                              to{" "}
                              {timeConverter(
                                car?.reservationDetails["endDate"]
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row justify-center lg:justify-around align-middle">
                        <div>
                          <button
                            onClick={() => {
                              router.push({
                                /* View details click event (routing) -- push carID, brand and model to the URL*/
                                pathname: "/auth/UpdateCar",
                                query: {
                                  city: car?.car["city"],
                                  carID: car?.car["carID"],
                                  brand: car?.car["brand"],
                                  lng: car?.car["location"]["lng"],
                                  lat: car?.car["location"]["lat"],
                                },
                              });
                            }}
                            className="inline-block py-3 px-4 m-2 w-1/2 lg:w-full border border-[#E5E7EB] rounded-2xl
                          text-base text-body-color font-medium hover:border-primary transition cursor-pointer 
                          bg-blue-500 hover:bg-blue-600 text-gray-100"
                          >
                            Update Car
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              setOpen(true);
                              router.push({
                                query: {
                                  carID: car?.car["carID"],
                                },
                              });
                            }}
                            className="inline-block py-3 px-4 m-2 w-1/2 lg:w-full border border-[#E5E7EB] rounded-2xl
                              text-base text-body-color font-medium hover:border-primary transition cursor-pointer 
                              bg-red-500 hover:bg-red-600 text-gray-100"
                          >
                            Delete Car
                          </button>
                          {open && (
                            <DeleteModal
                              setOpen={setOpen}
                              carID={car?.car["carID"]}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className=" flex flex-col justify-center align-middle text-center my-2">
                <Image src={notfound} width={200} height={250} alt="No Data" />
                <div
                  className="text-center font-semibold text-xl my-3 text-gray-600 font-display lg:text-2xl
                      lg:text-bold "
                >
                  You have not added a car yet
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
