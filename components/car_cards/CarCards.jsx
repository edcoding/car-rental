import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import seat from "../../public/logos/seat.png";
import carDoor from "../../public/logos/car-door.png";
import gas from "../../public/logos/gas.png";
import electric from "../../public/logos/electric.png";
import hybrid from "../../public/logos/hybrid.png";
import Like from "../../components/likeButton/Like";
import { ToastContainer } from "react-toastify";
import noCar from "../../public/images/noCar.png";
import { useAuth } from "../../contexts/AuthContext";
import { useCar } from "../../contexts/CarContext";

function CarCards({ carData }) {
  const router = useRouter();
  const { startDate, endDate } = router.query;
  const { toTimestamp } = useCar();
  /* Number of days between startDate and endDate*/
  const totalDay =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

  const [toggleLike, setToggleLike] = useState(false);

  useEffect(() => {
    const handleLikeClick = () => {
      const fetchLikedCars = JSON.parse(localStorage.getItem("likedCars"));
      if (fetchLikedCars != null) {
        // const filteredCars = fetchLikedCars.filter((car)=> car.carID != carID);
        for (let i = 0; i < fetchLikedCars.length; i++) {
          if (carData["car"]["carID"] == fetchLikedCars[i]["carID"]) {
            fetchLikedCars[i].active
              ? setToggleLike(true)
              : setToggleLike(false);
          }
        }
      }
    };
    handleLikeClick();
  }, []);

  return (
    <div
      className="flex flex-col md:flex-row pt-4 pb-7 px-2 pr-4 border-b
      hover:opacity-90 hover:shadow-lg transition duration-200 ease-out first:border-t"
    >
      <div
        className="relative h-64 w-full object-contain md:h-52 md:w-80 flex-shrink-0 cursor-pointer"
        onClick={() => {
          router.push({
            pathname: "/carDetails",
            query: {
              location: carData["car"]["city"],
              carID: carData["car"]["carID"],
              startDate: toTimestamp(startDate),
              endDate: toTimestamp(endDate),
              lng: carData['car']["location"]["lng"],
              lat: carData['car']["location"]["lat"],
            },
          });
        }}
      >
        {/* <Image src={noCar} width={50} height={50} alt="Car Image" /> */}
        <Image
          src={
            carData["car"]["carImage"]["img1"] != null
              ? carData["car"]["carImage"]["img1"]
              : carData["car"]["carImage"]["img2"] != null
              ? carData["car"]["carImage"]["img2"]
              : noCar
          }
          alt={carData["car"]["model"]}
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      </div>

      <div className="flex flex-col flex-grow pl-1 md:pl-5 mt-2">
        <div className="flex justify-between">
          <h4
            className="text-xl cursor-pointer "
            onClick={() => {
              router.push({
                pathname: "/carDetails",
                query: {
                  location: carData["car"]["city"],
                  carID: carData["car"]["carID"],
                  startDate: toTimestamp(startDate),
                  endDate: toTimestamp(endDate),
                  lng: carData['car']["location"]["lng"],
                  lat: carData['car']["location"]["lat"],
                },
              });
            }}
          >
            {carData["car"]["brand"] + " " + carData["car"]["model"]}
          </h4>

          <Like
            carID={carData["car"]["carID"]}
            active={toggleLike}
            setActive={setToggleLike}
            carImg={carData["car"]["carImage"]["img1"]}
            brand={carData["car"]["brand"]}
            model={carData["car"]["model"]}
            description={carData["car"]["carDescription"]}
            price={carData["reservationDetails"]["price"]}
            city={carData["car"]["city"]}
            startDate={carData["reservationDetails"]["startDate"]}
            endDate={carData["reservationDetails"]["endDate"]}
            available={carData["car"]["available"]}
          />
        </div>

        <div className="border-b w-10 p-2" />
        <div className="pt-2 flex align-middle justify-start text-sm text-gray-500 flex-grow">
          {carData["user"]["userPhoto"] != null ||
          carData["user"]["userPhoto"] != undefined ? (
            <img
              className="inline-block mr-2 h-6 w-6 lg:h-7 lg:w-7 rounded-full ring-1 ring-blue-500"
              src={carData["user"]["userPhoto"]}
              alt="IMG"
            />
          ) : (
            <div
              className="p-2 mr-2 w-6 h-6 lg:w-8 lg:h-8 flex justify-center items-center 
            rounded-full bg-blue-400 text-md text-white capitalize"
            >
              {carData["user"]["userEmail"]?.slice(0, 2)}
            </div>
          )}

          <div>
            {carData["car"]["carDescription"].length > 250
              ? carData["car"]["carDescription"].substring(0, 250).concat("...")
              : carData["car"]["carDescription"]}
          </div>
        </div>

        <div className="flex my-2">
          <div className="flex m-2">
            <Image src={carDoor} width={30} height={30} alt="Door" />
            <div className="text-lg ml-2 font-semibold lg:text-xl">
              {carData["car"]["numberOfDoor"]}
            </div>
          </div>
          <div className="flex m-2 ml-4">
            <Image src={seat} width={30} height={30} alt="Seat" />
            <div className="text-lg ml-2 font-semibold lg:text-xl">
              {carData["car"]["numberOfSeat"]}
            </div>
          </div>
          <div className="flex m-2 ml-4">
            <Image
              src={
                carData["car"]["power"] === "Gas"
                  ? gas
                  : carData["car"]["power"] === "Hybrid"
                  ? hybrid
                  : carData["car"]["power"] === "Electric"
                  ? electric
                  : carData["car"]["power"] === ""
                  ? gas
                  : gas
              }
              width={30}
              height={30}
              alt="Power"
            />
            <div className="text-lg ml-2 font-semibold lg:text-xl">
              {carData["car"]["power"]}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end pt-5">
          <div>
            <p className="text-md font-semibold pb-2 lg:text-lg">
              {"Total: " +
                totalDay * carData["reservationDetails"]["price"] +
                " €"}
            </p>
          </div>

          <div>
            <p className="text-lg font-semibold pb-2 lg:text-2xl">
              {carData["reservationDetails"]["price"] + " € / day"}
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default CarCards;
