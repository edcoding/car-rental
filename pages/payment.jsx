import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { useAuth } from "../contexts/AuthContext";
import Nav from "../components/navbar/Nav";
import { db } from "../firebase_config";
import { useCar } from "../contexts/CarContext";
import PrivateRoute from "./PrivateRoute";
import paymentImg from "../public/images/payment.png";
import Error from "../components/errors/Error";
import Image from "next/image";

function payment() {
  const router = useRouter();

  const { user, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const [docID, setDocID] = useState("");
  const [fullname, setFullName] = useState("");
  const [number, setNumber] = useState("");
  const [drivingLicenceNo, setDrivingLicenceNo] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");

  /*get data from URL */
  const { city, carID, startDate, endDate } = router.query;

  /* Call function from  car context */
  const { timeStamptoDate } = useCar();

  /* Get reservation info from localStorage */
  let carData = JSON.parse(window.localStorage.getItem("reservation"));

  // To calculate the time difference of two dates
  var differenceInTime = timeStamptoDate(endDate) - timeStamptoDate(startDate);

  // To calculate the number of days between two dates
  var numberOfDay = differenceInTime / (1000 * 3600 * 24) + 1;

  const handleCardNumber = (e) => {
    const inputVal = e.target.value.replace(/ /g, ""); //remove all the empty spaces in the input
    let inputNumbersOnly = inputVal.replace(/\D/g, ""); // Get only digits

    if (inputNumbersOnly.length > 16) {
      //If entered value has a length greater than 16 then take only the first 16 digits
      inputNumbersOnly = inputNumbersOnly.substr(0, 16);
    }

    // Get nd array of 4 digits per an element EX: ["4242", "4242", ...]
    const splits = inputNumbersOnly.match(/.{1,4}/g);

    let spacedNumber = "";
    if (splits) {
      spacedNumber = splits.join(" "); // Join all the splits with an empty space
    }

    setCardNumber(spacedNumber); // Set the new CC number
  };

  function handlePayment(e) {
    e.preventDefault();
    setLoading(true);
    /* Save to Database */
    carData
      ? db
          .collection("reservations")
          .add({
            user: {
              userID: user.uid,
              fullname: fullname,
              userEmail: user.email,
              userPhoto: user.photoURL,
              phoneNumber: number,
              drivingLicenceNo: drivingLicenceNo,
              cardNumber: cardNumber,
              cardCode: cvc,
            },
            host: {
              hostID: carData[0].user["userID"],
              hostEmail: carData[0].user["userEmail"],
              hostPhoto: carData[0].user["userPhoto"]
                ? carData[0].user["userPhoto"]
                : "",
              hostPhoneNumber: carData[0].user["phoneNumber"],
            },
            car: {
              carID: carID,
              location: {
                lng: carData[0].car["location"]["lng"],
                lat: carData[0].car["location"]["lat"],
              },
              city: city,
              brand: carData[0].car["brand"],
              model: carData[0].car["model"],
              carImage: {
                img1: carData[0].car["carImage"]["img1"],
                img2: carData[0].car["carImage"]["img1"],
              },
              carDescription: carData[0].car["carDescription"],
              numberOfDoor: carData[0].car["numberOfDoor"],
              numberOfSeat: carData[0].car["numberOfSeat"],
              power: carData[0].car["power"], //gas or electric
            },
            reservationDetails: {
              startDate: startDate, //Store the date as a unix timestamp (in milliseconds) using
              endDate: endDate, //Store the date as a unix timestamp (in milliseconds) using
              price: carData[0].reservationDetails["price"], //per day
              totalDay: numberOfDay,
              totalPrice: carData[0].reservationDetails["price"] * numberOfDay,
            },
          })
          .then(() => { //success  
            //UPDATE
            db.collection("cars").doc(docID).update({
              car: {
                carID: carData[0].car['carID'],
                location: {
                  lng: carData[0].car['location']['lng'],
                  lat: carData[0].car['location']['lat'],
                },
                city: city,
                brand: carData[0].car['brand'],
                model: carData[0].car['model'],
                carImage: {
                  img1: carData[0].car['carImage']['img1'],
                  img2: carData[0].car['carImage']['img2'],
                },
                carDescription: carData[0].car['carDescription'],
                numberOfDoor: carData[0].car['numberOfDoor'],
                numberOfSeat: carData[0].car['numberOfSeat'],
                power: carData[0].car['power'], 
                available: false,
              }
            }).then(function() {
              console.log("Availability updated");
            });
            setLoading(false);
            router.push("/afterPayment");            
          })
          .catch((error) => {
            console.error(error);
            setError("Failed to rent this car");
          })
      : setError("Something went wrong!");
  }

  useEffect(() => {
    async function getDocID() {
      const rentedCar = db.collection("cars");
      rentedCar
        .get()
        .then((data) => {
          data.docs.map((doc) => {
            let rentedCarData = doc.data();
            if (rentedCarData["car"]["carID"] == carID) {
              setDocID(doc.id);
            }
            return { id: doc.id, ...doc.data() };
          });
        })
    }
    getDocID();
  }, []);

  console.log(docID, carData);
  return (
    <div>
      <nav>
        <Nav />
      </nav>
      <div className="lg:flex">
        <div className="lg:w-1/2 xl:max-w-screen-md">
          {error ? (
            <Error error={error} />
          ) : (
            <>
              <div className="mt-6 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-10 xl:px-24 xl:max-w-2xl">
                <h2
                  className="text-center text-4xl text-blue-400 font-display font-semibold lg:text-left xl:text-4xl
                    xl:text-bold"
                >
                  Πληρωμη
                </h2>
                <div className="mt-8">
                  <form onSubmit={handlePayment}>
                    <div className="mt-8">
                      <div className="text-sm font-bold text-gray-700 tracking-wide">
                        Εμαιλ*
                      </div>
                      <input
                        className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                        type="email"
                        placeholder="example@gmail.com*"
                        required
                        defaultValue={currentUser.email}
                        ref={emailRef}
                      />
                    </div>
                    <div className="mt-8">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-gray-700 tracking-wide">
                          Πληρες Ονομα
                        </div>
                      </div>
                      <input
                        className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                        type="text"
                        placeholder="Firstname Lastname"
                        required
                        minLength="5"
                        maxLength="30"
                        value={fullname}
                        onChange={(event) => setFullName(event.target.value)}
                      />
                    </div>
                    <div className="mt-8">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-gray-700 tracking-wide">
                          Νουμερο
                        </div>
                      </div>
                      <input
                        className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                        type="number"
                        required
                        placeholder="+15718312255"
                        minLength="9"
                        maxLength="15"
                        name="number"
                        value={number}
                        onChange={(event) => {
                          const numberValidate = event.target.value.slice(
                            0,
                            15
                          );
                          setNumber(numberValidate);
                        }}
                      />
                    </div>
                    <div className="mt-8">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-gray-700 tracking-wide">
                        Πινακιδα No
                        </div>
                      </div>
                      <input
                        className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                        type="text"
                        required
                        placeholder="Driving Licence Info"
                        minLength="5"
                        maxLength="15"
                        name="number"
                        value={drivingLicenceNo}
                        onChange={(event) => {
                          setDrivingLicenceNo(event.target.value);
                        }}
                      />
                    </div>
                    <div className="mt-8">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-gray-700 tracking-wide">
                          Card Number
                        </div>
                      </div>
                      <input
                        className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                        type="text"
                        name="card"
                        placeholder="Card number"
                        value={cardNumber}
                        onChange={handleCardNumber}
                      />
                    </div>

                    <div className="mt-8">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-gray-700 tracking-wide">
                          Card Code
                        </div>
                      </div>
                      <input
                        className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                        type="number"
                        name="code"
                        placeholder="000"
                        value={cvc}
                        onChange={(event) => {
                          const code = event.target.value.slice(0, 3);
                          setCvc(code);
                        }}
                      />
                    </div>
                    <div className="mt-10 flex justify-center items-center">
                      <button
                        disabled={loading}
                        type="submit"
                        className="bg-blue-400 text-gray-100 p-3 w-2/3 rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline
                                hover:bg-blue-500 shadow-lg"
                      >
                        RΕνοικιαση Αυτοκινητου
                      </button>
                    </div>
                  </form>
                  <div className="mt-5 pb-5 text-sm font-display font-semibold text-gray-700 text-center">
                    <button
                      className="cursor-pointer p-5 text-blue-400 hover:text-blue-500"
                      onClick={() => {
                        window.localStorage.removeItem("reservation");
                        router.push("/");
                      }}
                    >
                      Ακυρωση
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="hidden lg:flex flex-col items-center justify-start bg-blue-100 flex-1 h-screen">
          <div className="flex justify-center aligned-center m-2">
            <p className="font-semibold text-lg">
              {carData[0].car["brand"] + " " + carData[0].car["model"]}
            </p>
          </div>
          <div className="flex m-3 mt-3 justify-evenly">
            {carData[0].car["carImage"]["img1"] && (
              <div className="m-3">
                <Image
                  className="rounded-xl transform duration-200 hover:scale-110"
                  src={carData[0].car["carImage"]["img1"]}
                  width={180}
                  height={150}
                  alt="Payment Image"
                />{" "}
              </div>
            )}

            {carData[0].car["carImage"]["img2"] && (
              <div className="m-3">
                <Image
                  className="rounded-xl transform duration-200 hover:scale-110"
                  src={carData[0].car["carImage"]["img2"]}
                  width={180}
                  height={150}
                  alt="Payment Image"
                />
              </div>
            )}
          </div>
          <div className="max-w-xs transform duration-200 hover:scale-110">
            <Image
              src={paymentImg}
              width={375}
              height={375}
              alt="Payment Image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivateRoute(payment);
