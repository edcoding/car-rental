import React, { useState, useEffect } from "react";
import PrivateRoute from "../PrivateRoute";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/dist/client/router";
import { CalendarIcon } from "@heroicons/react/outline";
import Nav from "../../components/navbar/Nav";
import Image from "next/image";
import upcoming from "../../public/images/calendar.png";
import previous from "../../public/images/previous.png";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import UpdateUser from "../../components/updateUser/UpdateUser";
import { db } from "../../firebase_config";
import { useCar } from "../../contexts/CarContext";
import { UserCircleIcon } from "@heroicons/react/solid";
import { collection, query, where, getDocs } from "firebase/firestore";

function UserDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [userReservations, setUserReservations] = useState([]);
  const [endedTrips, setEndedTrips] = useState([]);
  const { timeConverter, timeStamptoDate, toTimestamp } = useCar();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //get user's reservations
    async function fetchReservations() {
      setLoading(true);
      const reservations = db.collection("reservations");
      reservations.get().then((data) => {
        let reservationsData = [];
          data.docs.map((doc) => {
            let reservationData = doc.data();
            if (reservationData["user"]["userID"] == user.uid) {
              reservationsData.push(reservationData)
              setUserReservations(reservationsData);
              setLoading(false);
            }
          });
        })
        .catch((error) => {
          console.log("Failed to bring car");
        });
    }
    // //Find ended trips
    async function findEndedReservations() {
      const q = query(
        collection(db, "reservations"),
        where("reservationDetails.endDate", "<", `${toTimestamp(new Date())}`)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setEndedTrips([{ docID: doc.id, docData: doc.data() }]);
      });
    }
    /* After trip set availability to true*/
    function changeAvailability() {
      endedTrips?.forEach(async function (trip) {
        const q = query(
          collection(db, "cars"),
          where("car.carID", "==", `${trip["docData"]["car"]["carID"]}`)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          let carData = doc.data();
          let docID = doc.id;

          //UPDATE DB
          db.collection("cars")
            .doc(docID)
            .update({
              car: {
                carID: carData["car"]["carID"],
                location: {
                  lng: carData["car"]["location"]["lng"],
                  lat: carData["car"]["location"]["lat"],
                },
                city: carData["car"]["city"],
                brand: carData["car"]["brand"],
                model: carData["car"]["model"],
                carImage: {
                  img1: carData["car"]["carImage"]["img1"],
                  img2: carData["car"]["carImage"]["img2"],
                },
                carDescription: carData["car"]["carDescription"],
                numberOfDoor: carData["car"]["numberOfDoor"],
                numberOfSeat: carData["car"]["numberOfSeat"],
                power: carData["car"]["power"],
                available: true,
              },
            })
            .then(function () {
              console.log("Availability updated");
            });
        });
      });
    }
    fetchReservations();
    findEndedReservations();
    changeAvailability();
  }, []);

  /* Filter upcoming travels */
  const upcomingRentalsArr = userReservations?.filter(
    (re) => timeStamptoDate(re?.["reservationDetails"]["endDate"]) >= new Date()
  );

  /* Filter previous road trips */
  const previousRentalsArr = userReservations?.filter(
    (re) => timeStamptoDate(re?.["reservationDetails"]["endDate"]) < new Date()
  );
 
 
  return (
    <div>
      <Nav />

      <div className="flex justify-center mt-5">
        <h2
          className="text-3xl text-blue-400 font-display font-semibold lg:text-left 
          xl:text-4xl xl:text-bold"
        >
          User Dashboard
        </h2>
      </div>

      <Breadcrumb
        title1={"List new car"}
        href1={"/auth/ListCar"}
        title2={"My Cars"}
        href2={"/auth/MyCar"}
        title3={"Liked Cars"}
        href3={"/auth/LikedCars"}
      />

      <div className="flex flex-col justify-center mt-4">
        <UpdateUser />
        <div className="mt-2 flex justify-evenly flex-col md:flex-row mb-5">
          <div className="mt-10 flex flex-col justify-start">
            <h3
              className="text-center text-2xl text-blue-400 font-display font-semibold  xl:text-3xl
                            xl:text-bold"
            >
              Upcoming Rentals
            </h3>
            {/* Filter upcoming trips */}
            <div className="mt-2 max-w-[350px] flex flex-col justify-evenly items-center">
              {upcomingRentalsArr?.length > 0 ? (
                upcomingRentalsArr?.map((r, key) => (
                  <div key={key} className="w-11/12 sm:w-full py-4 px-2">
                    <div className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
                      <div className="relative pb-48 overflow-hidden">
                        <img
                          className="absolute cursor-pointer inset-0 h-full w-full object-cover transform duration-200 hover:scale-110"
                          src={r.car["carImage"]["img1"]}
                          alt="Car Image"
                          onClick={() => {
                            router.push({
                              pathname: "/auth/MyCarDetails",
                              query: {
                                city: r?.car["city"],
                                carID: r?.car["carID"],
                                brand: r?.car["brand"],
                                lng: r?.car["location"]["lng"],
                                lat: r?.car["location"]["lat"],
                                startDate: r?.reservationDetails["startDate"],
                                endDate: r?.reservationDetails["endDate"],
                                price: r?.reservationDetails["price"],
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex flex-col align-center justify-center">
                          <span
                            className="inline-block m-2 px-3 py-2 w-2/5 text-center bg-blue-200 text-blue-800 
                              rounded-full font-semibold uppercase tracking-wide text-sm"
                          >
                            {"📌" + " " + r.car["city"]}
                          </span>
                          <div className="m-2 text-left flex">
                            <div>
                              {r?.host["hostPhoto"] ? (
                                <img
                                  className="inline-block mr-2 h-5 w-5 lg:h-8 lg:w-8 rounded-full ring-1 ring-blue-500"
                                  src={r?.host["hostPhoto"]}
                                  alt="Avatar"
                                />
                              ) : (
                                <UserCircleIcon className="h-6 w-6 lg:h-7 lg:w-7 text-blue-400" />
                              )}
                            </div>
                            <div>
                              {r?.host["hostEmail"]} <br />
                              {r?.host["hostPhoneNumber"]}
                            </div>
                          </div>
                        </div>

                        <h2
                          className="mt-2 mb-2 font-bold cursor-pointer font-uppercase"
                          onClick={() => {
                            router.push({
                              pathname: "/auth/MyCarDetails",
                              query: {
                                city: r?.car["city"],
                                carID: r?.car["carID"],
                                brand: r?.car["brand"],
                                lng: r?.car["location"]["lng"],
                                lat: r?.car["location"]["lat"],
                                startDate: r?.reservationDetails["startDate"],
                                endDate: r?.reservationDetails["endDate"],
                                price: r?.reservationDetails["price"],
                              },
                            });
                          }}
                        >
                          <p
                            className="
                            font-semibold
                            text-blue-600 text-xl
                            sm:text-[22px]
                            md:text-xl
                            lg:text-[22px]
                            xl:text-xl
                            2xl:text-[22px]
                            mb-4                                                      
                            "
                          >
                            {r.car["brand"] + " " + r.car["model"]}
                          </p>
                        </h2>
                        <p className="text-md ">
                          {r.car["carDescription"].length > 250
                            ? r.car["carDescription"]
                                .substring(0, 250)
                                .concat("...")
                            : r.car["carDescription"]}
                        </p>
                        <div className="mt-3 flex items-center">
                          <span className="font-bold text-xl">
                            {" "}
                            {r.reservationDetails["totalPrice"]}
                          </span>
                          &nbsp;
                          <span className="text-md font-semibold">€</span>
                        </div>
                      </div>

                      <div className="p-4 border-t border-b text-md text-gray-800">
                        <div className="flex justify-start align-middle items-center mb-1">
                          <div className="flex justify-end align-middle">
                            <div>
                              <CalendarIcon className="h-6 w-6 m-2" />
                            </div>
                            <div className="mt-2">
                              from{" "}
                              {timeConverter(r.reservationDetails["startDate"])}{" "}
                              to{" "}
                              {timeConverter(r.reservationDetails["endDate"])}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex items-center text-sm text-gray-600"></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className=" flex flex-col justify-center align-middle text-center my-2">
                  <Image
                    src={upcoming}
                    width={180}
                    height={280}
                    alt="No Data"
                  />
                  <div
                    className="text-center font-semibold text-xl my-3 text-gray-600 font-display xl:text-2xl
                      xl:text-bold "
                  >
                    No upcoming rental data
                  </div>
                  <div>
                    <button
                      onClick={() => router.push("/")}
                      className="bg-blue-500 text-gray-100 p-3 w-4/5 rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline
                                hover:bg-blue-600 shadow-lg"
                    >
                      Find a car
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-start items-center">
            <h3
              className="text-center text-2xl text-blue-400 font-display font-semibold  xl:text-3xl
                            xl:text-bold"
            >
              Previous Rentals
            </h3>

            {/* Filter previous renting, filter expired renting */}

            <div className="mt-2 max-w-[350px] flex flex-col justify-evenly items-center">
              {previousRentalsArr?.length > 0 ? (
                previousRentalsArr?.map((r, key) => (
                  <div key={key} className="w-11/12 sm:w-full py-4 px-2">
                    <div className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
                      <div className="relative pb-48 overflow-hidden">
                        <img
                          className="absolute cursor-pointer inset-0 h-full w-full object-cover transform duration-200 hover:scale-110"
                          src={r.car["carImage"]["img1"]}
                          alt="Car Image"
                          onClick={() => {
                            router.push({
                              pathname: "/auth/MyCarDetails",
                              query: {
                                city: r?.car["city"],
                                carID: r?.car["carID"],
                                brand: r?.car["brand"],
                                lng: r?.car["location"]["lng"],
                                lat: r?.car["location"]["lat"],
                                startDate: r?.reservationDetails["startDate"],
                                endDate: r?.reservationDetails["endDate"],
                                price: r?.reservationDetails["price"],
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex flex-col align-center justify-center">
                          <span
                            className="inline-block m-2 px-3 py-2 w-2/5 text-center bg-blue-200 text-blue-800 
                            rounded-full font-semibold uppercase tracking-wide text-sm"
                          >
                            {"📌" + " " + r.car["city"]}
                          </span>
                          <div className="m-2 text-left flex">
                            <div>
                              {r?.host["hostPhoto"] ? (
                                <img
                                  className="inline-block mr-2 h-5 w-5 lg:h-8 lg:w-8 rounded-full ring-1 ring-blue-500"
                                  src={r?.host["hostPhoto"]}
                                  alt="Avatar"
                                />
                              ) : (
                                <UserCircleIcon className="h-6 w-6 lg:h-7 lg:w-7 text-blue-400" />
                              )}
                            </div>
                            <div>
                              {r?.host["hostEmail"]} <br />
                              {r?.host["hostPhoneNumber"]}
                            </div>
                          </div>
                        </div>

                        <h2
                          className="mt-2 mb-2 font-bold cursor-pointer font-uppercase"
                          onClick={() => {
                            router.push({
                              pathname: "/auth/MyCarDetails",
                              query: {
                                city: r?.car["city"],
                                carID: r?.car["carID"],
                                brand: r?.car["brand"],
                                lng: r?.car["location"]["lng"],
                                lat: r?.car["location"]["lat"],
                                startDate: r?.reservationDetails["startDate"],
                                endDate: r?.reservationDetails["endDate"],
                                price: r?.reservationDetails["price"],
                              },
                            });
                          }}
                        >
                          <p
                            className="
                          font-semibold
                          text-blue-600 text-xl
                          sm:text-[22px]
                          md:text-xl
                          lg:text-[22px]
                          xl:text-xl
                          2xl:text-[22px]
                          mb-4                                                      
                          "
                          >
                            {r.car["brand"] + " " + r.car["model"]}
                          </p>
                        </h2>
                        <p className="text-md ">
                          {r.car["carDescription"].length > 250
                            ? r.car["carDescription"]
                                .substring(0, 250)
                                .concat("...")
                            : r.car["carDescription"]}
                        </p>
                        <div className="mt-3 flex items-center">
                          <span className="font-bold text-xl">
                            {" "}
                            {r.reservationDetails["totalPrice"]}
                          </span>
                          &nbsp;
                          <span className="text-md font-semibold">€</span>
                        </div>
                      </div>

                      <div className="p-4 border-t border-b text-md text-gray-800">
                        <div className="flex justify-start align-middle items-center mb-1">
                          <div className="flex justify-end align-middle">
                            <div>
                              <CalendarIcon className="h-6 w-6 m-2" />
                            </div>
                            <div className="mt-2">
                              from{" "}
                              {timeConverter(r.reservationDetails["startDate"])}{" "}
                              to{" "}
                              {timeConverter(r.reservationDetails["endDate"])}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex items-center text-sm text-gray-600"></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col justify-center align-middle text-center my-2">
                  <Image
                    src={previous}
                    width={200}
                    height={300}
                    alt="No Data"
                  />
                  <div
                    className="text-center font-semibold text-xl my-3 text-gray-600 font-display xl:text-2xl
                      xl:text-bold "
                  >
                    No previous rental history
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivateRoute(UserDashboard);
