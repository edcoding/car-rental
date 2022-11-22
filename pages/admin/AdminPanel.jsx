import React, { useState, useEffect } from "react";
import PrivateRoute from "../PrivateRoute";
import CardStats from "../../components/adminPanel/CardStats";
import UsersTable from "../../components/adminPanel/UsersTable";
import CarsTable from "../../components/adminPanel/CarsTable";
import ReservationsTable from "../../components/adminPanel/ReservationsTable";
import { db } from "../../firebase_config";
import ContactTable from "../../components/adminPanel/ContactTable";
import { useAuth } from "../../contexts/AuthContext";
import AdminLogin from "./AdminLogin";

function AdminPanel() {
  const [numberOfUser, setNumberOfUser] = useState("");
  const [numberOfCar, setNumberOfCar] = useState("");
  const [numberOfReservations, setNumberOfReservations] = useState("");
  const [numberOfMessage, setNumberOfMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    async function fetchNumberReservations() {
      const reservations = db.collection("reservations");
      reservations.get().then((data) => {
        const reservations = data.size;
        setNumberOfReservations(reservations);
      });
    }
    async function fetchNumberOfUser() {
      const users = db.collection("users");
      users.get().then((data) => {
        const users = data.size;
        setNumberOfUser(users);
      });
    }
    async function fetchNumberOfCars() {
      const cars = db.collection("cars");
      cars.get().then((data) => {
        const cars = data.size;
        setNumberOfCar(cars);
      });
    }
    async function fetchNumberOfMessages() {
      const messages = db.collection("contact");
      messages.get().then((data) => {
        const messages = data.size;
        setNumberOfMessage(messages);
      });
    }
    fetchNumberOfUser();
    fetchNumberReservations();
    fetchNumberOfCars();
    fetchNumberOfMessages();
  }, []);

  return (
    <>
      {user.uid == "ZSI4RxAly1Yrks6u4c24Ren1sJR2" ? (
        <>
          <h3 className="text-4xl font-extrabold text-center my-2 text-blue-500">
            Admin Panel
          </h3>
          <div className="flex justify-center align-center text-center my-3">
            <hr className="border-gray-400 w-2/5" />
          </div>
          <div className="relative bg-blueGray-800 md:pt-16 pb-16 pt-12">
            <div className="px-4 md:px-10 mx-auto w-full">
              <div>
                {/* Card stats */}
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <CardStats
                      statSubtitle="TOTAL USER"
                      statTitle={`${numberOfUser}`}
                      statPercentColor="text-emerald-500"
                      statDescripiron="Until Now"
                      statIconName="far fa-chart-bar"
                      statIconColor="bg-red-500"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <CardStats
                      statSubtitle="TOTAL CAR"
                      statTitle={`${numberOfCar}`}
                      statPercentColor="text-red-500"
                      statDescripiron="Until Now"
                      statIconName="fas fa-chart-pie"
                      statIconColor="bg-orange-500"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <CardStats
                      statSubtitle="TOTAL RESERVATION"
                      statTitle={`${numberOfReservations}`}
                      statPercentColor="text-orange-500"
                      statDescripiron="Until Now"
                      statIconName="fas fa-users"
                      statIconColor="bg-pink-500"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <CardStats
                      statSubtitle="TOTAL MESSAGE"
                      statTitle={`${numberOfMessage}`}
                      statPercentColor="text-emerald-500"
                      statDescripiron="Until Now"
                      statIconName="fas fa-percent"
                      statIconColor="bg-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ContactTable />
          <CarsTable />
          <UsersTable />
          <ReservationsTable />{" "}
        </>
      ) : (
        <AdminLogin />
      )}
      {/* Header */}
    </>
  );
}

export default PrivateRoute(AdminPanel);
