import { useState, useEffect } from "react";
import { useCar } from "../../contexts/CarContext";

export default function Dropdown({ tempData, setCars }) {
  const [selected, setSelected] = useState("");
  const { notifySuccess } = useCar();
  /* Filtering according to power type */

  function filteredByPower(power) {
    const sortedByPower = tempData.filter((car) => car.car["power"] === power);
    setCars([...sortedByPower]);
  }

  return (
    <select
      id="city"
      name="city"
      type="text"
      value={selected}
      onChange={(e) => {
        setSelected(e.target.value);
        filteredByPower(e.target.value);
        notifySuccess("Cars successfully filtered!");
      }}
      className="w-32 text-sm py-2 border-2 border-blue-100  focus:border-blue-200
  focus:ring-blue-500 h-full pl-1 sm:pl-2 pr-2 sm:pr-7 bg-transparent text-gray-600 sm:text-md rounded-full"
    >
      <option defaultValue disabled value="">
        Power Type
      </option>
      {["Gas", "Electric", "Hybrid"].map((power, key) => (
        <option key={key} value={power}>
          {power}
        </option>
      ))}
    </select>
  );
}
