import Head from "next/head";
import Footer from "../components/footer/Footer";
import Nav from "../components/navbar/Nav";
import Banner from "../components/banner/Banner";
import HowItWorks from "../components/about/HowItWorks";
import About from "../components/about/About";
import LocationSection from "../components/locations/LocationSection";
import Link from "next/link";
import PopularCars from "../components/popularCars/PopularCars";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Car Rental</title>
        <meta
          name="description"
          content="Car Rental"
        />
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <Link
          href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Nav />

      <main>
        <Banner />
        <HowItWorks />
        <About />
        <LocationSection />
        <PopularCars />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
 