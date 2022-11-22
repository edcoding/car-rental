import React, { useRef, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useAuth } from "../../contexts/AuthContext";
import Nav from "../../components/navbar/Nav";
import Link from "next/link";
import passwordImg from "../../public/images/password.png";
import Image from "next/image";

function ResetPassword() {
  const emailRef = useRef();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Please check your email.");
    } catch (error) {
      setError("Failed to reset password");
      console.log(error.message);
    }

    setLoading(false);
  }

  return (
    <div>
      <Nav />
      <div className="lg:flex">
        <div className="lg:w-1/2 xl:max-w-screen-md">
          {error}
          <div className="mt-6 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-10 xl:px-24 xl:max-w-2xl">
            <h2
              className="text-center text-4xl text-blue-400 font-display font-semibold lg:text-left xl:text-4xl
                    xl:text-bold"
            >
              Password Reset
            </h2>
            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                <div className="mt-10">
                  <div className="text-sm font-bold text-gray-700 tracking-wide">
                    Email Address*
                  </div>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                    type="email"
                    placeholder="example@gmail.com"
                    ref={emailRef}
                    required
                  />
                </div>

                <div className="mt-10 flex justify-center items-center">
                  <button
                    disabled={loading}
                    type="submit"
                    className="bg-blue-400 text-gray-100 p-4 w-1/2  rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline
                                hover:bg-blue-500 shadow-lg"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
              <div className="mt-5 flex justify-center text-sm text-gray-700 font-display font-semibold  text-center">
                Do you have an account ?{" "}
                <div className="cursor-pointer ml-3 text-blue-400 hover:text-blue-500">
                  <Link href="/auth/LoginPage">Log In</Link>
                </div>
              </div>

              <div className="mt-4 flex justify-center pb-5 text-sm font-display font-semibold text-gray-700 text-center">
                Don't have an account ?{" "}
                <div className="cursor-pointer ml-3 text-blue-400 hover:text-blue-500">
                  <Link href="/auth/SignUpPage">Sign Up</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center bg-blue-100 flex-1 h-screen">
          <div className="max-w-xs transform duration-200 hover:scale-110 cursor-pointer">
            <Image src={passwordImg} width={400} height={400} alt="Password" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
