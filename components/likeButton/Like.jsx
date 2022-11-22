import React from "react";
import style from "../../styles/LikeBtn.module.css";
import { toast } from "react-toastify";
import { useCar } from "../../contexts/CarContext";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/dist/client/router";
function Like({
  active,
  setActive,
  carID,
  carImg,
  brand,
  model,
  description,
  price,
  city,
  startDate,
  endDate,
  available,
}) {
  const { notifySuccess } = useCar();
  const { currentUser } = useAuth();
  const router = useRouter();
  const notifyWarning = () =>
    toast.info("Removed from liked cars!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const toggleClass = () => {
    /* Check if user is already logged in */
    if (currentUser) {
      setActive(!active);
      active
        ? removeFromLocalStorage(carID)
        : addItemToStorage(
            carID,
            carImg,
            brand,
            model,
            description,
            price,
            city,
            startDate,
            endDate,
            available
          );
    } else {
      router.push("/auth/LoginPage");
    }
  };

  function addItemToStorage(
    carID,
    carImg,
    brand,
    model,
    description,
    price,
    city,
    startDate,
    endDate,
    available
  ) {
    var cars = JSON.parse(localStorage.getItem("likedCars") || "[]"); // get current objects
    var carData = {
      carID: carID,
      active: true,
      carImg: carImg,
      brand: brand,
      model: model,
      description: description,
      city: city,
      price: price,
      startDate: startDate,
      endDate: endDate,
      available: available,
    };
    cars.push(carData); //push new one

    localStorage.setItem("likedCars", JSON.stringify(cars));
    notifySuccess("Car added to liked cars!");
  }

  const removeFromLocalStorage = (carID) => {
    const likedCars = JSON.parse(localStorage.getItem("likedCars"));

    const filteredCars = likedCars.filter((car) => car.carID != carID);
    localStorage.setItem("likedCars", JSON.stringify(filteredCars));
    notifyWarning();
  };

  return (
    <>
      <button
        className={active ? `${style.liked} ${style.likeBtn}` : style.likeBtn}
        onClick={toggleClass}
      ></button>
    </>
  );
}

export default Like;
