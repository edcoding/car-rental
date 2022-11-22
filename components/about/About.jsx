import React from "react";
import Image from "next/image";
import road from "../../public/images/road.jpg";
import trip from "../../public/images/trip.jpg";
function About() {
  return (
    <section className="border-b py-2 bg-gray-50">
      <div className="container max-w-5xl mx-auto m-8 ">
        <h3 className="text-4xl font-extrabold text-center my-2 text-blue-400">
          About
        </h3>
        <div className="flex justify-center align-center text-center mb-2">
          <hr className="border-gray-400 w-2/5" />
        </div>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
        </div>

        <div className="flex flex-wrap">
          <div className="w-5/6 sm:w-1/2 p-6">
            <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
                Getting started
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
             Book your car
              <br />
            </p>
          </div>
          <div className="w-full sm:w-1/2 p-6">
            <Image
              src={trip}
              alt={"Image"}
              width={400}
              height={300}
              className="w-full h-full object-center object-cover rounded-xl hover:scale-105 duration-200 ease-linear"
            />
          </div>
        </div>

        <div className="flex flex-wrap flex-col-reverse sm:flex-row">
          <div className="w-full sm:w-1/2 p-6 mt-6">
            <Image
              src={road}
              alt={"Image"}
              width={450}
              height={300}
              className="w-full h-full object-center object-cover rounded-xl hover:scale-105 duration-200 ease-linear"
            />
          </div>
          <div className="w-full sm:w-1/2 p-6 mt-6">
            <div className="align-middle">
              <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
                Infinite options
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
               Car Rental.
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
