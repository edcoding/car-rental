import React from "react";
import rent from "../../public/images/rent.png";
import map from "../../public/images/map.png";
import road from "../../public/images/road.png";
import Image from "next/image";
const cards = [
  {
    id: 1,
    name: "Find the perfect car",
    image: map,
    alt: "CARD1",
    description:
      "Browse too many cars shared by hosts based on and date and city.",
  },
  {
    id: 2,
    name: "Rent your Car",
    image: rent,
    alt: "CARD2",
    description:
      "Book your Car.",
  },
  {
    id: 3,
    name: "Hit the road",
    image: road,
    alt: "CARD3",
    description:
      "Pick it up you car from the host's location. Ready to travel.",
  },
];

function HowItWorks() {
  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h3 className="text-4xl font-extrabold text-center my-2 text-blue-400">
          How It Works
        </h3>
        <div className="flex justify-center align-center text-center mb-2">
          <hr className="border-gray-400 w-2/5" />
        </div>

        <div
          className="mt-6 grid grid-cols-1 gap-y-5 gap-x-6 content-center sm:grid-cols-2 
          lg:grid-cols-3 xl:gap-x-8 "
        >
          {cards?.map((data) => (
            <div
              key={data.id}
              className="group relative p-2 border-2 rounded-xl hover:bg-gray-100"
            >
              <div
                className="flex align-middle justify-center m-2 rounded-md overflow-hidden 
                group-hover:opacity-90 lg:aspect-none"
              >
                <Image
                  src={data.image}
                  alt={data.alt}
                  width={220}
                  height={220}
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
              </div>
              <div className="my-4 flex flex-col justify-center align-middle m-2">
                <h3 className="text-xl m-1 font-semibold text-gray-700 text-center">
                  {data.name}
                </h3>
                <p className="m-1 text-lg text-gray-600">{data.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
