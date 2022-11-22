import React, { useState, useEffect } from "react";
import ReactMapGL, {
  Marker,
  Popup,
  GeolocateControl,
  FullscreenControl,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";
import Image from "next/image";
import MapCard from "./MapCard";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import carImg from "../../public/images/car.png";


mapboxgl.accessToken = process.env.mapbox_access_token;

function Map({ carData, loading, center }) {
  const [selectedPin, setSelectedPin] = useState({});


  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    longitude: center?.longitude,
    latitude: center?.latitude,
  });

  return (
    <>
      {!loading && (
        <ReactMapGL
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxApiAccessToken={mapboxgl.accessToken}
          initialViewState={{
            longitude: center?.longitude,
            latitude: center?.latitude,
            zoom: 10,
          }}
          onMove={(nextViewport) => setViewport(nextViewport.viewState)} // movement on the map
        >
          <ScaleControl position="top-left" />
          <FullscreenControl position="top-left" />
          <GeolocateControl />
          <NavigationControl />

          {carData?.map((marker, key) => (
            <div key={key}>
              <Marker
                longitude={marker["car"]["location"]["lng"]}
                latitude={marker["car"]["location"]["lat"]}
                offsetLeft={-20}
                offsetRight={-10}
              >
                <p
                  role="img"
                  className="cursor-pointer text-2xl animate-bounce"
                  onClick={() => {
                    setTimeout(() => {
                      setSelectedPin(marker["car"]["location"]);
                    });
                  }}
                  aria-label="car"
                >
                  <Image src={carImg} width={35} height={35} alt="CAR" />
                </p>
              </Marker>
              {/* {console.log(selectedPin.lng, marker["car"]["location"]["lng"])} */}
              {/* popup will show up if we click on a marker */}
              {selectedPin.lng == marker["car"]["location"]["lng"] ? (
                <Popup
                  onClose={() => {
                    setSelectedPin({});
                  }}
                  className="z-10 "
                  maxWidth="330"
                  closeOnClick={true}
                  latitude={marker["car"]["location"]["lat"]}
                  longitude={marker["car"]["location"]["lng"]}
                >
                  <MapCard
                    location={marker["car"]["city"]}
                    carID={marker["car"]["carID"]}
                    startDate={marker["reservationDetails"]["startDate"]}
                    endDate={marker["reservationDetails"]["startDate"]}
                    lng={marker["car"]['location']['lng']}
                    lat = {marker["car"]['location']['lat']}
                    carImg={marker["car"]["carImage"]["img1"]}
                    description={marker["car"]["carDescription"]}
                    model={marker["car"]["model"]}
                    brand={marker["car"]["brand"]}
                    price={marker["reservationDetails"]["price"]}
                  />
                </Popup>
              ) : (
                false
              )}
            </div>
          ))}
        </ReactMapGL>
      )}
    </>
  );
}

export default Map;
