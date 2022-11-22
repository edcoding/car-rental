import React, { useState, useEffect } from "react";
import Nav from "../components/navbar/Nav";
import Footer from "../components/footer/Footer";
import { useRouter } from "next/dist/client/router";
import { db } from "../firebase_config";
import Error from "../components/errors/Error";
import CarCards from "../components/car_cards/CarCards";
import Map from "../components/map/Map";
import { ToastContainer } from "react-toastify";
import Dropdown from "../components/dropdown/Dropdown";
import { getCenter } from "geolib";
import { useCar } from "../contexts/CarContext";

function Search() {
  const router = useRouter();
  const { location, startDate, endDate } = router.query;
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tempData, setTempData] = useState([]);
  const [selected, setSelected] = useState("");

  const { timeConverter, notifySuccess } =
    useCar(); /* timestamp to date, Notification */
  //const [sortedData, setSortedData] = useState([]);

  //Format the date to human readable format
  const formattedStartDate = timeConverter(
    Date.parse(new Date(startDate)) / 1000
  );
  const formattedEndDate = timeConverter(Date.parse(new Date(endDate)) / 1000);
  const range = `from ${formattedStartDate} to ${formattedEndDate}`;

  // FETCH DATA ACCORDING TO SEARCH INPUT
  useEffect(() => {
    async function fetchCarData() {
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
          //if (user.uid) { //check if user is logged in
          const filterByInput = cars?.filter(
            (theCar) => theCar.car.city.toLowerCase() == location?.toLowerCase()
          );
          /* compare car's available date and data picker - check if somebody already rented */
          const filterByDateAndAvailability = filterByInput?.filter(
            (car, key) =>
              Date.parse(startDate) / 1000 >=
                car.reservationDetails["startDate"] &&
              Date.parse(endDate) / 1000 <= car.reservationDetails["endDate"] && car.car['available']
          );
          setLoading(true);
          setCars(filterByDateAndAvailability);
          setTempData(filterByDateAndAvailability);
          setLoading(false);
          // } else {
          //   setCars(cars);
          // }
        })
        .catch((error) => {
          console.error("Failed to bring cars", error);
          setError("Failed to bring cars");
        });
    }
    fetchCarData();
  }, []);

  /* Filtering according to price */
  function filteredByPrice() {
    const sortedByPrice = tempData.sort(
      (a, b) => a.reservationDetails["price"] - b.reservationDetails["price"]
    );
    setCars([...sortedByPrice]);
  }
  /* Filtering according to number of seat */
  function filteredByNumberOfSeat() {
    const sortedBySeatNumber = tempData.sort(
      (a, b) => b.car["numberOfSeat"] - a.car["numberOfSeat"]
    );
    setCars([...sortedBySeatNumber]);
  }

 
  /* get longitude-latitude */
  var cordinates = cars.map((data) => ({
    longitude: data["car"]["location"]["lng"],
    latitude: data["car"]["location"]["lat"],
  }));

  /* Get center lng and lat values of all cars */
  const center = getCenter(cordinates);

  return (
    <div>
      <Nav
        placeholder={`${
          location?.charAt(0).toUpperCase() + location?.slice(1)
        } `}
      />
      {error ? (
        <Error error={error} />
      ) : (
        <main className="flex flex-col xl:flex-row justify-center align-items-center gap-2 xl:min-h-[100vh]">
          <section className="flex-col xl:overflow-y-scroll w-full xl:max-h-[100vh]">
            <h2
              className="text-2xl text-blue-400 font-display font-semibold ml-4 mt-2 text-left xl:text-4xl
                    xl:text-bold"
            >
              Cars in {location?.charAt(0).toUpperCase() + location?.slice(1)}
            </h2>
            <p className="text-md md:text-lg font-semibold m-3 pl-2 pb-2 text-gray-900 ">
              {location?.charAt(0).toUpperCase() + location?.slice(1)}, {range}
            </p>
            <div
              className="flex pl-2 mb-5 space-x-3 
          text-gray-700 whitespace-nowrap justify-evenly "
            >
              {/* TODO: Add filters here */}
              <button
                className="button text-sm sm:text-md"
                onClick={() => {
                  filteredByPrice();
                  notifySuccess("Cars successfully sorted!");
                }}
              >
                Car Price
              </button>
              <button
                className="button text-sm sm:text-md"
                onClick={() => {
                  filteredByNumberOfSeat();
                  notifySuccess("Cars successfully sorted!");
                }}
              >
                Number of Seat
              </button>
             
             <Dropdown tempData={tempData} setCars={setCars}/>
            </div>
            <div className="flex flex-col w-full">
              {cars?.map((car, key) => (
                <div key={key}>
                  <CarCards carData={car} />
                </div>
              ))}
              {cars?.length == 0 && (
                <div className="flex justify-center align-middle">
                  <div
                    className="bg-teal-100 flex w-2/3 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="py-1">
                        <svg
                          className="fill-current h-6 w-6 text-teal-500 mr-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold">No Filter Result</p>
                        <p className="text-sm">
                          No cars found. Please try to filter again.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          <section className="flex flex-wrap justify-center xl:min-w-[600px]">
            <Map
              carData={!loading && cars}
              center={!loading && center}
              loading={loading}
            />
          </section>
        </main>
      )}

      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2000}
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

export default Search;

/* ALTERNATIVE WAY TO FETCH DATA */
// async function fetchData() {
//   const querySnapshot = await getDocs(collection(db, "cars"));
//   var allData = [];
//   querySnapshot.forEach((doc) => {
//     allData.push(doc.data());
//     console.log("Document data:", doc.data());
//   });
//   const matchedData = allData?.filter(
//     (car) => car.car["city"].toLowerCase() == searchInput.toLowerCase()
//   );
//   setCars([...matchedData]);
// }
