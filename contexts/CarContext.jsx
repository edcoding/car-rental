import React, { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../firebase_config";
import { db } from "../firebase_config";
import { useRouter } from "next/dist/client/router";
import {
  writeBatch,
  doc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";

const CarContext = createContext("");

export function useCar() {
  return useContext(CarContext);
}

export function CarProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  /* Fetch all car data */
  async function fetchData(setAllCars) {
    const querySnapshot = await getDocs(collection(db, "cars"));
    var allData = [];
    querySnapshot.forEach((doc) => {
      allData.push(doc.data());
    });
    setAllCars(allData);
    setIsLoading(false);
  }

  /* Conver timestamp to Data input format */
  const timeStamptoDate = (timestamp) => {
    var date = new Date(timestamp * 1000);
    return date;
  };

  function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
  }

  /* timestamp to date */
  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + " " + month + " " + year;
    return time;
  }

  /* Notification */
  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

 

  /* send data (variable or function) here  */
  const values = { fetchData, timeConverter, notifySuccess, timeStamptoDate, toTimestamp };

  return <CarContext.Provider value={values}>{children}</CarContext.Provider>;
}
