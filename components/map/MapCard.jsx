import React from "react";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import noCar from '../../public/images/noCar.png';
import { useCar } from '../../contexts/CarContext';

function MapCard({location,carID,startDate,endDate, lng, lat, carImg, description, model, brand, price }) {
  const router = useRouter();
  const { toTimestamp } = useCar();

  return (
    <div
      className="bg-white rounded shadow-md flex card text-gray-900"
      style={{ height: "14rem", width: "25rem" }}
    >
      <div className="relative w-full">
        <Image
          className="rounded-md"
          src={carImg ? carImg : noCar}
          layout="fill"
          alt="Car Image"
          objectFit="fill"
          objectPosition="left"
        />
      </div>

      <div className="w-full flex flex-col">
        <div className="pl-2 pb-0 flex-1">
          <div className="text-lg font-bold mt-1 text-blue-500  flex items-center mb-2">
            {brand + " " + model}
          </div>
          <p className="text-lg text-gray-700 ">
            <span className="text-xl font-semibold text-grey-darkest">
              {price}
            </span>{" "}
            € / day
          </p>
          <div className="flex mt-2">
            <div className="pr-2 text-xs text-left text-gray-700 ">
              {description.length > 160
                ? description.substring(0, 160).concat("...")
                : description}
            </div>
          </div>
        </div>
        <div
          style={{ transition: "all .2s ease-out" }}
          className="p-3 flex items-center justify-between"
        >
          <button
            className="rounded-lg px-2 py-1 bg-blue-400 text-white hover:bg-blue-500 duration-300"
            onClick={() => {
              router.push({
                pathname: "/carDetails",
                query: {
                  location: location ,
                  carID: carID,
                  startDate: toTimestamp(startDate),
                  endDate: toTimestamp(endDate),
                  lng: lng,
                  lat:lat,
                },
              });
            }}
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default MapCard;
