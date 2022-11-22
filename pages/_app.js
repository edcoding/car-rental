import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import ProgressBar from "@badrap/bar-of-progress";
import Router from 'next/router';
import { AuthProvider } from "../contexts/AuthContext";
import { CarProvider } from '../contexts/CarContext';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-toastify/dist/ReactToastify.css';

const progress = new ProgressBar({
  size:5,
  color:"#3f97f2",
  className: "z-50",
  delay:40,
});

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish);
Router.events.on('routeChangeError', progress.finish);

function MyApp({ Component, pageProps }) {
  return(
  <>
    <AuthProvider>
      <CarProvider>
        <Component {...pageProps} />
      </CarProvider>
    </AuthProvider>
  </>
)
}

export default MyApp
