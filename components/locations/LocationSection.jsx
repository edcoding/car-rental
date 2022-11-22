import React from "react";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import noCity from "../../public/images/noCity.png";
import locationData from './loactionData.json';

function LocationSection() {
  const router = useRouter();
  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto py-16 sm:py-24 lg:py-32 lg:max-w-none">
            <h3 className="text-4xl font-extrabold text-center my-2 text-blue-500">
              Available Cities
            </h3>
            <div className="flex justify-center align-center text-center mb-2">
              <hr className="border-gray-400 w-2/5" />
            </div>
            <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6">
              {locationData?.map((city) => (
                <div
                  key={city.country}
                  className="group relative text-center hover:scale-105 duration-200 ease-linear border-2 cursor-pointer border-gray-300 h-[390px] rounded-lg "
                  onClick={() => {
                    router.push({
                      pathname: "/search",
                      query: {
                        location: `${city.city}`,
                        startDate: new Date().toISOString(),
                        endDate: new Date(
                          new Date().valueOf() + 1000 * 3600 * 24
                        ).toISOString(),
                      },
                    });
                  }}
                >
                  <div className="relative w-full h-80 bg-gray-800 rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
                    <Image
                      src={city.image ? city.image : noCity}
                      alt={city.alt}
                      layout="fill"
                      className="w-full h-full object-center object-cover hover:scale-105 duration-200 ease-linear"
                    />
                  </div>

                  <h3 className="mt-1 lg:mt-6 text-xl text-gray-500">
                    <p>{city.country}</p>
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {city.city}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-gray-700 font-medium text-lg flex justify-center align-middle mt-4 italic">
              For now, we are only available in Paris, Berlin and Vienna.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LocationSection;
