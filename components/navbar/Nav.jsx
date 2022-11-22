import React, { useState } from "react";
import Image from "next/image";
import { GlobeAltIcon, SearchIcon } from "@heroicons/react/solid";
import "react-date-range/dist/styles.css"; // main style file for date picker
import "react-date-range/dist/theme/default.css"; // theme css file date picker
import { DateRangePicker } from "react-date-range";
import { useRouter } from "next/dist/client/router";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../public/logo.jpg";
import WarningModel from "../modals/WarningModal";
import Menu from "./Menu";
// import { db } from "../../firebase_config";
// import { useCar } from "../../contexts/CarContext";
// import { getDocs, collection } from "firebase/firestore";

function Nav({ placeholder }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [warningContent, setWarningContent] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const { currentUser } = useAuth();
  //const [allCars, setAllCars] = useState([]);
  //  const { fetchData } = useCar();
  //const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   fetchData(setAllCars);
  // }, []);

  //console.log(allCars);

  const dateRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  /* DATE SELECTION */
  const handleDatePicker = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
    console.log(ranges.selection.endDate)
  };
  /* CLEAR SEACRH INPUT */
  const resetSearchInput = () => {
    setSearchInput("");
  };

  const search = () => {
    /* Check if user authenticated */
    // if (currentUser) {
      /* search input validation */
      if (searchInput?.length > 2 && searchInput?.charAt(0) != " ") {
        /* Date must be greater than today's date */
        if (startDate && endDate >= new Date()) {
          /* Check the cities */
          if (
            searchInput?.toLowerCase() === "berlin" ||
            searchInput?.toLowerCase() === "vienna" ||
            searchInput?.toLowerCase() === "paris"
          ) {
            router.push({
              pathname: "/search",
              query: {
                location: searchInput,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              },
            });
            setTimeout(() => {
              if (router.pathname.includes("search")) router.reload();
            });
          } else {
            router.push("/NotFound");
          }
        } else {
          setOpen(true); // WARNING MODAL
          setWarningContent("Date must be greater than today's date.");
        }
      } else {
        setOpen(true); // WARNING MODAL
        setWarningContent("Please enter a valid city.");
      }
    // } else {
    //   setOpen(true); // WARNING MODAL
    //   setWarningContent("Please sign in or register to continue.");
    // }
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 flex md:grid md:grid-cols-3 bg-white shadow-md 
      p-4 md:px-10 justify-between "
      >
        <div className="relative flex items-center h-7 md:h-12 my-auto">
          <Image
            src={logo}
            alt="logo"
            width={180}
            height={80}
            objectFit="contain"
            objectPosition="left"
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>

        <div
          className="flex items-center ml-2 sm:border-2 md:inline-flex 
                rounded-full py-2 md:shadow-sm"
        >
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            type="text"
            className="flex-grow md:pl-5 ml-1 w-full border-2 py-1 sm:border-none rounded-full bg-transparent outline-none
               text-gray-600 placeholder-gray-500"
            placeholder={placeholder || "Paris-Berlin-Vienna"}
          />
          <SearchIcon
            onClick={search}
            className="h-8 w-8 hidden lg:inline-flex bg-blue-400 text-white rounded-full p-2 cursor-pointer md:mx-2"
          />
        </div>
        <div className="flex items-center justify-end text-gray-500 space-x-4">
          <div
            onClick={() => {
              currentUser
                ? router.push("/auth/ListCar")
                : router.push("/auth/LoginPage");
            }}
          >
            <p className="hidden lg:inline cursor-pointer">Become a host</p>

            <GlobeAltIcon className="h-6 ml-2 mb-0.5 cursor-pointer hidden lg:inline" />
          </div>

          <Menu />
        </div>
      </header>
      <div className="flex justify-center align-middle">
        {searchInput && (
          <div className="flex flex-col col-span-3 mb-4">
            <DateRangePicker
              ranges={[dateRange]}
              minDate={new Date()}
              rangeColors={["#3f97f2"]}
              onChange={handleDatePicker}
              scroll={{ enabled: false }}
            />

            <div className="flex justify-center align-middle sm:w-full ">
              <button
                onClick={resetSearchInput}
                className="flex-grow relative text-gray-500 font-semibold py-1 border-2 rounded-full m-2 hover:shadow-sm
                hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={search}
                className="flex-grow text-blue-500 font-semibold py-1 border-2 rounded-full m-2 hover:shadow-sm
                hover:bg-gray-100"
              >
                Search
              </button>
            </div>
          </div>
        )}
        {open && (
          <WarningModel
            setOpen={setOpen}
            content={warningContent}
            setWarningContent={setWarningContent}
          />
        )}
      </div>
    </>
  );
}

export default Nav;
