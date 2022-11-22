import React, { useRef, useEffect, useState } from "react";
import PrivateRoute from "../PrivateRoute";
import Nav from "../../components/navbar/Nav";
import { useRouter } from "next/dist/client/router";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase_config";
import "react-date-range/dist/styles.css"; // main style file for date picker
import "react-date-range/dist/theme/default.css"; // theme css file date picker
import { DateRangePicker } from "react-date-range";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import style from "../../styles/carListing.module.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import {
  writeBatch,
  doc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useCar } from "../../contexts/CarContext";
import Image from "next/image";
import { storage } from "../../firebase_config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import delete_img from "../../public/logos/clearImg.png";
 
/* Mapbox Access Token */
mapboxgl.accessToken = process.env.mapbox_access_token;

function UpdateCar() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { timeStamptoDate, toTimestamp, timeConverter, notifySuccess } =
    useCar();
  const [progress, setProgress] = useState("");
  const [progress2, setProgress2] = useState("");
  //const [isLoading, setIsLoading] = useState(true);
  /* User */
  const [phoneNumber, setPhoneNumber] = useState("");
  const [drivingLicenceNo, setDrivingLicenceNo] = useState("");
  const [roomNo, setRoomNo] = useState("");
  /* Car Info*/
  const [car, setCar] = useState([]);
  const [carId, setCarId] = useState(0); //unique identifier for car
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [displayImg, setDisplayImg] = useState(null);
  const [displayImg2, setDisplayImg2] = useState(null);
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [carDescription, setCarDescription] = useState("");
  const [numberOfDoor, setNumberOfDoor] = useState("");
  const [numberOfSeat, setNumberOfSeat] = useState("");
  const [power, setPower] = useState("");
  const [available, setAvailable] = useState(true);

  /* Reservation Details */
  const [price, setPrice] = useState("");
  const [rentedFrom, setRentedFrom] = useState("");
  const [rentedTo, setRentedTo] = useState("");

  /*get carID from URL */
  const { carID } = router.query;

  /* Map states */
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(8.8127);
  const [lat, setLat] = useState(49.2485);
  const [zoom, setZoom] = useState(4);

  // const notifySuccess = () =>
  //   toast.success("Profile successfully updated!", {
  //     position: "top-right",
  //     autoClose: 4000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //   });

  /* Fetch Car Data */
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      const myCar = db.collection("cars");
      myCar
        .get()
        .then((data) => {
          if (data.size === 0) {
            console.log("Car not found.");
          }
          setLoading(false);
          const cars = data.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });
          if (user.uid) {
            const filterCar = cars.filter(
              (theCar) => theCar.car["carID"] == carID
            );
            setCar(filterCar);
          } else {
            setCar(car);
          }
        })
        .catch((error) => {
          console.error("Failed to bring car", error);
        });
    };
    fetchData();
  }, []);

  //console.log(car);

  /* Bring the values from DB and set them*/
  useEffect(() => {
    car
      ?.filter((c) => c.car["carID"] == carID)
      .map((c) => {
        setCity(c?.car["city"]);
        setCarId(c?.car["carID"]);
        setLng(c?.car["location"]["lng"]);
        setLat(c?.car["location"]["lat"]);
        setPhoneNumber(c?.user["phoneNumber"]);
        setDrivingLicenceNo(c?.user["drivingLicenceNo"]);
        setBrand(c?.car["brand"]);
        setModel(c?.car["model"]);
        setImg1(c?.car["carImage"]["img1"]);
        setImg2(c?.car["carImage"]["img2"]);
        setCarDescription(c?.car["carDescription"]);
        setNumberOfSeat(c?.car["numberOfSeat"]);
        setNumberOfDoor(c?.car["numberOfDoor"]);
        setPower(c?.car["power"]);
        setPrice(c?.reservationDetails["price"]);
        setRentedFrom(c?.reservationDetails["startDate"]);
        setRentedTo(c?.reservationDetails["endDate"]);
      });
  }, [car]);

  /* Date Range DEFAULT: Previous selection */
  const dateRange = {
    startDate: timeStamptoDate(rentedFrom),
    endDate: timeStamptoDate(rentedTo),
    key: "selection",
  };

  /* Handle Date Selection */
  const handleDatePicker = (ranges) => {
    setRentedFrom(toTimestamp(ranges.selection.startDate));
    setRentedTo(toTimestamp(ranges.selection.endDate));
  };

  /* Mapbox geolocation and find user location, define marker here */
  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/berkayalatas/cl082a0ql001r14p4m2jypcqr",
      center: [lng, lat],
      zoom: zoom,
    });

    let geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
        color: "#3f97f2",
      },
      mapboxgl: mapboxgl,
    });
    map.current.addControl(geocoder);

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );
    const marker = new mapboxgl.Marker({
      color: "#3f97f2",
    });
    map.current.on("click", (event) => {
      marker.setLngLat(event.lngLat).addTo(map.current);
      setLng(event.lngLat.lng.toFixed(4));
      setLat(event.lngLat.lat.toFixed(4));
    });
  });

  /* Images */
  const handleUpload = (event) => {
    //Display img functionality after uploading
    if (event.target.files && event.target.files[0]) {
      setDisplayImg(URL.createObjectURL(event.target.files[0]));
    }
    let fileRef = ref(storage, "userCars/" + event.target.files[0].name);
    const uploadCar = uploadBytesResumable(fileRef, event.target.files[0]);

    // Track the progress of uploading
    uploadCar.on(
      "state_changed",
      (snapshot) => {
        const fileProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(fileProgress);
      },
      (error) => {
        console.log("Error:", error);
      },
      () => {
        getDownloadURL(uploadCar.snapshot.ref).then((url) => {
          console.log("File available at", url);
          setImg1(url);
        });
      }
    );
  };
  const handleUpload2 = (event) => {
    //Display img functionality after uploading
    if (event.target.files && event.target.files[0]) {
      setDisplayImg2(URL.createObjectURL(event.target.files[0]));
    }
    let fileRef = ref(storage, "userCars/" + event.target.files[0].name);
    const uploadCar = uploadBytesResumable(fileRef, event.target.files[0]);

    // Track the progress of uploading
    uploadCar.on(
      "state_changed",
      (snapshot) => {
        const fileProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress2(fileProgress);
      },
      (error) => {
        console.log("Error:", error);
      },
      () => {
        getDownloadURL(uploadCar.snapshot.ref).then((url) => {
          console.log("File available at", url);
          setImg2(url);
        });
      }
    );
  };
  async function handleUpdate() {
    //!TODO this function may include a bug
    const q = query(
      collection(db, "cars"),
      where("user.userID", "==", user.uid)
    );
    var docID;
    const querySnapshot = await getDocs(q);
    //console.log(carId);

    querySnapshot.forEach((doc) => {
      console.log(doc.id);
      const myData = doc.data();
      if (myData["car"]["carID"] == carId) {
        docID = doc.id;
      }
      //console.log("Document data:", doc.data());
    });

    const batch = writeBatch(db);
    const updatedStates = doc(db, "cars", docID);
    batch.update(updatedStates, {
      car: {
        carID: carId,
        location: {
          lng: lng,
          lat: lat,
        },
        city: city,
        brand: brand,
        model: model,
        carImage: {
          img1: img1,
          img2: img2,
        },
        carDescription: carDescription,
        numberOfDoor: numberOfDoor,
        numberOfSeat: numberOfSeat,
        power: power, //gas or electric
        available: available,
      },
      reservationDetails: {
        startDate: rentedFrom,
        endDate: rentedTo,
        price: price, //per day
      },
    });
    await batch.commit();
  }

  return (
    <>
      <Nav />
      <div className="flex flex-col text-center justify-center align-middle">
        <h2
          className="text-center mt-2 text-4xl text-blue-400 font-display font-semibold xl:text-4xl
                    xl:text-bold"
        >
          Update Your Car
        </h2>
        <div className="m-3 sm:m-0 mt-2 flex justify-center ">
          <form
            onSubmit={() => {
              handleUpdate();
              router.push("/auth/UserDashboard"); //redirect to the dashboard
            }}
          >
            <div className="mt-4">
              <div className="flex flex-col">
                <div className="lg:text-md text-left font-bold text-gray-700 tracking-wide">
                  Your City
                </div>
                <div className="text-sm text-gray-500 text-left ">
                  For now, we're only available in Paris, Berlin, and Vienna.
                </div>
              </div>
              <select
                id="city"
                name="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="
                w-full text-lg py-2 border-2 mt-2 border-gray-600  focus:border-blue-300
                focus:ring-indigo-500 h-full pl-2 pr-7 bg-transparent text-gray-500 sm:text-sm rounded-md"
              >
                <option defaultValue="">Select City</option>
                <option value="Paris">Paris</option>
                <option value="Berlin">Berlin</option>
                <option value="Vienna">Vienna</option>
              </select>
            </div>

            <div className="mt-5">
              <div className="flex justify-between items-center">
                <div className="m-2 font-bold text-left text-gray-700 lg:text-md tracking-wide">
                  Find your car location{" "}
                  <div className="text-sm text-gray-500 text-left ">
                    If you don't want to change you car location skip this
                    field. Otherwise,
                    <br />
                    Search your city or locate yourself using the find my
                    location button. <br />
                    Click on the map to indicate your car location.
                  </div>
                </div>
              </div>
              <div className={style.sidebar}>
                Longitude: {lng} | Latitude: {lat}
              </div>
              <div ref={mapContainer} className={style.map_container} />
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div className="lg:text-md font-bold text-gray-700 tracking-wide">
                  Phone Number
                </div>
              </div>
              <input
                className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                type="text"
                required
                placeholder="+15718312255"
                minLength="9"
                maxLength="15"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(event) => {
                  const numberValidate = event.target.value.slice(0, 15);
                  setPhoneNumber(numberValidate);
                }}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div className="lg:text-md font-bold text-gray-700 tracking-wide">
                  Driving Licence No
                </div>
              </div>
              <input
                className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                type="text"
                required
                placeholder="Driving Licence Number"
                minLength="4"
                maxLength="15"
                name="drivingLicenceNo"
                value={drivingLicenceNo}
                onChange={(event) => setDrivingLicenceNo(event.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-between ">
              <div>
                <div className="flex justify-between items-center">
                  <div className="lg:text-md font-bold text-gray-700 tracking-wide">
                    Brand
                  </div>
                </div>
                <input
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                  type="text"
                  required
                  placeholder="Audi"
                  minLength="3"
                  maxLength="20"
                  name="brand"
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                />
              </div>
              <div className="flex justify-around items-center">
                <div>
                  <div className="lg:text-md text-left font-bold text-gray-700 tracking-wide">
                    Model
                  </div>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                    type="text"
                    required
                    placeholder="Q7"
                    minLength="1"
                    maxLength="20"
                    name="model"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div className="lg:text-md font-bold text-gray-700 tracking-wide">
                  Car Image
                </div>
              </div>
            </div>
            <div className="m-1 flex flex-wrap">
              <div className={style.img_area}>
                <img
                  src={img1}
                  style={{ display: displayImg ? "none" : "inline-block" }}
                  alt="Add IMG"
                  className={style.plus}
                />
                <input
                  className="w-24 h-24"
                  type="file"
                  name="img1"
                  onChange={handleUpload}
                  style={{
                    textIndent: "-999em",
                    outline: "none",
                    position: "absolute",
                  }}
                />
                <div>
                  <img
                    src={displayImg}
                    alt=""
                    className={
                      displayImg != null
                        ? style.uploaded_img
                        : style.not_uploaded
                    }
                  />
                </div>
              </div>
              <div
                className={
                  displayImg === null
                    ? style.delete_img_before
                    : style.delete_img
                }
                onClick={() => {
                  setDisplayImg(null);
                }}
              >
                <Image src={delete_img} />
              </div>

              <div className={style.img_area}>
                <img
                  src={img2}
                  style={{ display: displayImg2 ? "none" : "inline-block" }}
                  alt="Add IMG"
                  className={style.plus}
                />
                <input
                  className="w-24 h-24 "
                  type="file"
                  name="img2"
                  style={{
                    textIndent: "-999em",
                    outline: "none",
                    position: "absolute",
                  }}
                  onChange={handleUpload2}
                />
                <div>
                  <img
                    src={displayImg2}
                    alt=""
                    className={
                      displayImg2 != null
                        ? style.uploaded_img
                        : style.not_uploaded
                    }
                  />
                </div>
              </div>
              <div
                className={
                  displayImg2 === null
                    ? style.delete_img_before
                    : style.delete_img
                }
                onClick={() => {
                  setDisplayImg2(null);
                }}
              >
                <Image src={delete_img} />
              </div>

              <div
                className="w-full bg-gray-200 rounded-full dark:bg-gray-700"
                style={{ display: progress == 0 ? "none" : "block" }}
              >
                <div
                  className="bg-blue-400 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                  style={{ width: progress == "" ? 0 : `${progress}%` }}
                >
                  {" "}
                  {parseFloat(progress).toFixed(1)}
                </div>
              </div>
              <div
                className="w-full mt-3 bg-gray-200 rounded-full dark:bg-gray-700"
                style={{ display: progress2 == 0 ? "none" : "block" }}
              >
                <div
                  className="bg-blue-400 text-xs font-medium text-gray-100 text-center p-0.5 leading-none rounded-full"
                  style={{ width: progress2 == "" ? 0 : `${progress2}%` }}
                >
                  {" "}
                  {parseFloat(progress2).toFixed(1)}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center">
                <div className="lg:text-md font-bold text-gray-700 tracking-wide">
                  Car Description
                </div>
              </div>
              <textarea
                name="message"
                className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                required
                rows="2"
                minLength="6"
                maxLength="200"
                placeholder="Car Description"
                value={carDescription}
                onChange={(event) => setCarDescription(event.target.value)}
              ></textarea>
            </div>
            <div className="mt-4 flex justify-between ">
              <div>
                <div className="flex justify-between items-center">
                  <div className="lg:text-md font-bold text-gray-700 tracking-wide">
                    Number of Door
                  </div>
                </div>
                <input
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                  type="number"
                  required
                  placeholder="4"
                  min="2"
                  max="6"
                  name="numberOfDoor"
                  value={numberOfDoor}
                  onChange={(event) => setNumberOfDoor(event.target.value)}
                />
              </div>
              <div className="flex justify-around items-center">
                <div>
                  <div className="lg:text-md text-left font-bold text-gray-700 tracking-wide">
                    Number of Seat
                  </div>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                    type="number"
                    required
                    min="1"
                    max="10"
                    placeholder="4"
                    name="numberOfSeat"
                    value={numberOfSeat}
                    onChange={(event) => setNumberOfSeat(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div className="lg:text-md font-bold text-gray-700 tracking-wide">
                  Power
                </div>
              </div>
              <select
                id="power"
                name="power"
                type="text"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="
                w-full text-lg py-2 border-2 mt-2 border-gray-600 focus:border-blue-300
                focus:ring-indigo-500 h-full pl-2 pr-7 bg-transparent text-gray-500 sm:text-sm rounded-md"
              >
                <option defaultValue="">Select Type of Power</option>
                <option value="Gas">Gas</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div className="lg:text-md font-bold text-gray-700 tracking-wide">
                  Price
                </div>
              </div>
              <input
                className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                type="number"
                required
                placeholder="Car price per day"
                name="price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div className="lg:text-md font-bold text-gray-700 tracking-wide">
                  Car availability
                </div>
                <div className="text-md text-gray-500 text-left ">
                  {"from " +
                    timeConverter(rentedFrom) +
                    " to " +
                    timeConverter(rentedTo)}
                </div>
              </div>
              <DateRangePicker
                showDateDisplay={false}
                ranges={[dateRange]}
                rangeColors={["#3f97f2"]}
                onChange={handleDatePicker}
              />
            </div>

            <div className="mt-8 mb-4 flex justify-center items-center">
              <button
                disabled={loading}
                type="submit"
                className="bg-blue-400 text-gray-100 p-3 w-2/3 rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline
                                hover:bg-blue-500 shadow-lg"
              >
                Update the car
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
    </>
  );
}
export default PrivateRoute(UpdateCar);
