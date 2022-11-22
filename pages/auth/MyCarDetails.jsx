import React, { useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import Nav from "../../components/navbar/Nav";
import { useAuth } from "../../contexts/AuthContext";
import { useCar } from "../../contexts/CarContext";
import Error from "../../components/errors/Error";
import { db } from "../../firebase_config";
import Image from "next/image";
import noCar from "../../public/images/noCar.png";
import seat from "../../public/logos/seat.png";
import carDoor from "../../public/logos/car-door.png";
import gas from "../../public/logos/gas.png";
import hybrid from "../../public/logos/hybrid.png";
import electric from "../../public/logos/electric.png";
import CarMap from "../../components/map/CarMap";
import { getCenter } from "geolib";

function MyCarDetails() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [car, setCar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  //ES6 Destructing
  const { location, carID, brand, lng, lat, startDate, endDate, price } =
    router.query;
  const { timeConverter, timeStamptoDate } = useCar();

  const formattedStartDate = timeConverter(startDate);
  const formattedEndDate = timeConverter(endDate);

  // To calculate the time difference of two dates
  var differenceInTime = timeStamptoDate(endDate) - timeStamptoDate(startDate);

  // To calculate the number of days between two dates
  var numberOfDay = differenceInTime / (1000 * 3600 * 24) + 1;

  // FETCH THE CAR DATA WHEN WE OPEN MYCAR DETAILS PAGE
  useEffect(() => {
    async function getTheCarInfo() {
      const myCar = db.collection("cars");
      myCar
        .get()
        .then((data) => {
          if (data.size === 0) {
            console.log("Car not found.");
          }
          const cars = data.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
          const filterTheCar = cars?.filter(
            (theCar) => theCar.car.carID == carID
          );

          setLoading(true);
          setCar(filterTheCar);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to bring car", error);
          setError("Failed to bring car");
        });
    }
    getTheCarInfo();
  }, []);

  !loading && console.log(car);

  /* get longitude-latitude */
  var cordinates = car.map((data) => ({
    longitude: data["car"]["location"]["lng"],
    latitude: data["car"]["location"]["lat"],
  }));

  /* Get center lng and lat values of all cars */
  const center = getCenter(cordinates);

  return (
    <>
      {!loading && (
        <div>
          <div className="bg-white">
            <div className="pt-1">
              <nav>
                <Nav />
              </nav>
              {error ? (
                <Error error={error} />
              ) : (
                <>
                  {/* Image gallery */}
                  <div className="flex flex-col m-2 md:flex-row justify-center align-middle text-center">
                    <div className="m-2">
                      {car[0]?.car["carImage"]["img1"] ? (
                        <img
                          src={car[0]?.car["carImage"]["img1"]}
                          alt="Room Image 1"
                          className="md:min-h-full md:min-w-[400px] transform duration-200 hover:scale-105 xl:max-w-[500px] 
                          xl:max-h-[400px] rounded-md"
                        />
                      ) : (
                        <Image
                          src={noCar}
                          alt="Room Image 2"
                          className="md:min-h-full md:min-w-[400px] transform duration-200 hover:scale-105 xl:max-w-[500px] 
                          xl:max-h-[400px] rounded-md"
                        />
                      )}
                    </div>

                    <div className="m-2 relative">
                      {car[0]?.car["carImage"]["img2"] ? (
                        <img
                          src={car[0]?.car["carImage"]["img2"]}
                          alt="Room Image 2"
                          className="md:min-h-full md:min-w-[400px] transform duration-200 hover:scale-105 xl:max-w-[500px]
                           xl:max-h-[400px] rounded-md"
                        />
                      ) : null}
                    </div>
                  </div>

                  {/* Car info */}
                  <div
                    className="max-w-2xl mx-auto pt-10 pb-6 px-4 sm:px-6 lg:max-w-7xl lg:pt-8 
                    lg:pb-12 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-6"
                  >
                    <div
                      className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8 text-center text-2xl 
                      sm:text-3xl sm:font-extrabold mb-3 font-bold"
                    >
                      <h1
                        className="text-2xl font-bold tracking-tight
                    text-gray-900 sm:text-3xl sm:font-extrabold"
                      >
                        {car[0]?.car["brand"] + " " + car[0]?.car["model"]}
                      </h1>
                    </div>

                    {/* Options */}
                    <div
                      className=" flex flex-col mx-2 align-middle border-gray-300 border   
                      justify-center lg:mt-0 lg:row-span-2 rounded-lg shadow-lg"
                    >
                      <div>
                        <div className="mt-1 flex justify-center mb-8">
                          <p className="text-xl underline font-semibold text-blue-500">
                            Car Details
                          </p>
                        </div>
                        <div className="flex justify-center mb-6">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-7 w-7 mt-2 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </span>
                          <p className="text-xl md:text-2xl font-semibold text-gray-900">
                            <span>{car[0]?.reservationDetails["price"]} </span>
                            <span className="text-xl font-medium">€ / day</span>
                          </p>
                        </div>
                        <div className="flex justify-center mb-6">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-7 mt-2 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </span>
                          <p className="text-md md:text-lg font-semibold text-gray-900">
                            <span>
                              {timeConverter(
                                car[0]?.reservationDetails["startDate"]
                              )}
                              <br />

                              {timeConverter(
                                car[0]?.reservationDetails["endDate"]
                              )}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center">
                        <div
                          className="flex justify-center align-middle 
                                xl:min-w-[350px] xl:min-h-[400px] m-1 rounded-ml"
                        >
                          <CarMap
                            lng={lng}
                            lat={lat}
                            loading={loading}
                            center={center}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="py-6 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                      <div className="mt-5 border-t">
                        <div className="flex justify-start align-middle">
                          <div className="flex">
                            {car[0]?.user["userPhoto"] ? (
                              <img
                                className="m-2 inline-block h-16 w-16 lg:w-20 lg:h-20 rounded-full ring-2 ring-blue-500"
                                src={car[0]?.user["userPhoto"]}
                                alt="User Avatar"
                              />
                            ) : (
                              <div
                                className="m-2 h-16 w-16 lg:w-20 lg:h-20 flex justify-center items-center 
                              rounded-full bg-blue-400 text-2xl lg:text-3xl text-white capitalize"
                              >
                                {car[0]?.user["userEmail"].slice(0, 2)}
                              </div>
                            )}
                            <div className="flex flex-col text-md md:text-lg ">
                              <div className="m-3 font-semibold text-gray-700">
                                {" "}
                                Car location:{" "}
                                <span className="font-normal">
                                  {car[0]?.car["city"]}
                                </span>{" "}
                              </div>
                              <div className="m-3 font-semibold text-gray-700">
                                {" "}
                                Host Email:{" "}
                                <span className="font-normal">
                                  {car[0]?.user["userEmail"]}
                                </span>{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-b ">
                        <h3 className="text-xl font-semibold mt-2 text-blue-400">
                          Details
                        </h3>

                        <div className="mt-4 flex flex-col justify-start ">
                          <div className="flex my-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 mr-2 mt-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <div className="text-md md:text-lg">
                              {" "}
                              <p className="text-gray-700">
                                {" "}
                                You must be 18 years old or older to book.
                              </p>
                            </div>
                          </div>
                          <div className="flex my-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 mr-2 mt-1"
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
                            </svg>
                            <div className="text-md md:text-lg">
                              <p className="text-gray-700">
                                You will pick up the car at the host location.
                              </p>
                            </div>
                          </div>
                          <div className="flex my-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 mr-2 mt-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            <div className="text-md md:text-lg">
                              <p className="text-gray-700">
                                Insurance and protection are included.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 border-b">
                        <h3 className="text-xl font-semibold my-5 text-blue-400">
                          Features
                        </h3>

                        <div className="flex flex-col my-2">
                          <div className="flex m-3 ml-2">
                            <Image
                              src={carDoor}
                              width={30}
                              height={30}
                              alt="Door"
                            />
                            <div className="flex ml-2">
                              <p className="text-gray-700 text-md md:text-lg">
                                Number of Seat:{" "}
                              </p>
                              <div className="text-lg ml-2 font-semibold lg:text-xl">
                                {car[0]?.car["numberOfDoor"]}
                              </div>
                            </div>
                          </div>
                          <div className="flex m-3 ml-2">
                            <Image
                              src={seat}
                              width={30}
                              height={30}
                              alt="Seat"
                            />
                            <div className="flex ml-2">
                              <p className="text-gray-700 text-md md:text-lg">
                                Number of Door:{" "}
                              </p>
                              <div className="text-lg ml-2 font-semibold lg:text-xl">
                                {car[0]?.car["numberOfSeat"]}
                              </div>
                            </div>
                          </div>
                          <div className="flex m-3 ml-2">
                            <Image
                              src={
                                car[0]?.car["power"] === "Gas"
                                  ? gas
                                  : car[0]?.car["power"] === "Hybrid"
                                  ? hybrid
                                  : car[0]?.car["power"] === "Electric"
                                  ? electric
                                  : car[0]?.car["power"] === ""
                                  ? gas
                                  : gas
                              }
                              width={30}
                              height={30}
                              alt="Power"
                            />
                            <div className="flex ml-2">
                              <p className="text-gray-700 text-md md:text-lg">
                                Type of power:{" "}
                              </p>
                              <div className="text-lg ml-2 font-semibold lg:text-xl">
                                {car[0]?.car["power"]}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description and details */}
                      <div>
                        <h3 className="text-xl font-semibold my-5 text-blue-400  ">
                          Description
                        </h3>

                        <div className="mt-6">
                          <p className="text-lg text-gray-900">
                            {car[0]?.car["carDescription"]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyCarDetails;
