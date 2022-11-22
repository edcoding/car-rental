import React from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import carImg from "../../public/images/car.png";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Image from "next/image";
mapboxgl.accessToken = process.env.mapbox_access_token;

function CarMap({ lng, lat, loading, center }) {
  const [viewport, setViewport] = React.useState({
    width: "100%",
    height: "100%",
    latitude: center?.latitude,
    longitude: center?.longitude,
    zoom: 12,
  });
  return (
    <>
      {!loading && (
        <ReactMapGL
          mapStyle="mapbox://styles/mapbox/streets-v11qr"
          mapboxApiAccessToken={mapboxgl.accessToken}
          initialViewState={{
            longitude: center?.longitude,
            latitude: center?.latitude,
            zoom: 12,
          }}
          onMove={(nextViewport) => setViewport(nextViewport.viewState)} // movement on the map
        >
          <Marker
            longitude={lng}
            latitude={lat}
            offsetLeft={-20}
            offsetRight={-10}
          >
            <p
              role="img"
              className="cursor-pointer text-2xl animate-bounce"
              aria-label="car"
            >
              <Image src={carImg} width={35} height={35} alt="CAR" />
            </p>
          </Marker>
        </ReactMapGL>
      )}
    </>
  );
}

export default CarMap;
