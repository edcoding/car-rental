import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import Error from "../../components/errors/Error";
import adminImg from "../../public/images/admin.png";
import { useAuth } from "../../contexts/AuthContext";

function AdminLogin() {
  const router = useRouter();
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const { login, loginErrMsg } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdminLogin(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      router.push("/admin/AdminPanel");
    } catch (error) {
      setError("Failed to login");
    }

    setLoading(false);
  }
  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <div>
          <div className="lg:flex">
            <div className="lg:w-1/2 xl:max-w-screen-md">
              {loginErrMsg && (
                <div role="alert">
                  <div className="flex justify-center align-middle m-2">
                    <div className="w-2/3 ">
                      <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                        Error
                      </div>
                      <div
                        className="border border-t-0 border-red-400 rounded-b 
              bg-red-100 px-4 py-3 text-red-700 "
                      >
                        <p>{loginErrMsg.slice(22, -2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-10 xl:px-24 xl:max-w-2xl">
                <h2
                  className="text-center text-4xl text-blue-400 font-display font-semibold lg:text-left xl:text-4xl
                  xl:text-bold"
                >
                  Admin Log In
                </h2>
                <div className="mt-8">
                  <form onSubmit={handleAdminLogin}>
                    <div className="mt-10">
                      <div className="text-sm font-bold text-gray-700 tracking-wide">
                        Email Address
                      </div>
                      <input
                        className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                        type="email"
                        placeholder="example@gmail.com*"
                        ref={emailRef}
                        required
                      />
                    </div>
                    <div className="mt-10">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-gray-700 tracking-wide">
                          Password
                        </div>
                      </div>
                      <input
                        className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-blue-300"
                        type="password"
                        placeholder="Enter your password*"
                        ref={passwordRef}
                        required
                        minLength="6"
                        maxLength="20"
                      />
                    </div>

                    <div className="mt-10 flex justify-center items-center">
                      <button
                        disabled={loading}
                        type="submit"
                        className="bg-blue-400 text-gray-100 p-4 w-2/3 rounded-full tracking-wide
                              font-semibold font-display focus:outline-none focus:shadow-outline
                              hover:bg-blue-500 shadow-lg"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center bg-blue-100 flex-1 h-screen">
              <div className="max-w-xs transform duration-200 hover:scale-110 cursor-pointer">
                <Image
                  src={adminImg}
                  width={400}
                  height={400}
                  alt="Login Image"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminLogin;
