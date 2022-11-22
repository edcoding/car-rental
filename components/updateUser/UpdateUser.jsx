import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import { storage } from "../../firebase_config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useCar } from "../../contexts/CarContext";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/dist/client/router";

function UpdateUser() {
  const router = useRouter();
  const { currentUser, updateProfilePic } = useAuth();
  const { notifySuccess } = useCar();
  const [loading, setLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState("");

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUserPhoto(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (currentUser?.photoURL) {
      setUserPhotoUrl(currentUser.photoURL);
    }
  }, [currentUser]);

  async function upload() {
    const fileRef = ref(storage, "userProfilePhotos/" + currentUser.uid);

    setLoading(true);

    const snapshot = await uploadBytes(fileRef, userPhoto);
    const photoURL = await getDownloadURL(fileRef);

    await updateProfilePic(photoURL);

    setLoading(false);
    notifySuccess("Image successfully uploaded!");
    setTimeout(() => {
      router.reload();
    }, 1000);
  }

  return (
    <>
      <div className="m-2 p-2 align-middle text-center">
        <h3
          className="text-center font-semibold text-xl mt-2 text-gray-700 font-display xl:text-2xl
              xl:text-bold"
        >
          Welcome {currentUser.displayName || currentUser.email}{" "}
        </h3>
        <div className="flex justify-center align-middle">
          {userPhotoUrl ? (
            <img
              className="m-2 inline-block h-28 w-28 lg:w-32 lg:h-32 rounded-full ring-2 ring-blue-500"
              src={userPhotoUrl}
              alt="Avatar"
            />
          ) : (
            <div
              className="m-2 h-16 w-16 lg:w-20 lg:h-20 flex justify-center items-center 
            rounded-full bg-blue-400 text-2xl lg:text-3xl text-white capitalize"
            >
              {currentUser.displayName?.slice(0, 2) ||
                currentUser.email?.slice(0, 2)}
            </div>
          )}
        </div>
        <div className="flex justify-center align-middle">
          <input
            type="file"
            style={{
              width: "230px",
            }}
            className="border border-gray-600 text-gray-700 p-2 rounded-xl text-sm 
                      font-semibold font-display focus:outline-none focus:shadow-outline
                      hover:bg-blue-100 shadow-md m-1"
            onChange={handleChange}
          />
          <button
            className=" border border-gray-600 text-gray-700 p-2 rounded-xl text-sm tracking-wide
                      font-semibold font-display focus:outline-none focus:shadow-outline
                      hover:bg-blue-100 shadow-md m-1"
            style={{ display: !userPhoto ? "none" : "block" }}
            onClick={upload}
          >
            Upload photo
          </button>
        </div>
        <div className="flex justify-center align-middle">
          {loading && userPhoto && (
            <svg
              role="status"
              className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
        </div>

        {/* {imgSrc ? (
          <img
            className="inline-block h-14 w-14 rounded-full ring-2 ring-white"
            src={sourceUrl}
            alt="User Avatar"
          />
        ) : (
          <div
            className="p-2 w-5 h-5 lg:w-9 lg:h-7 flex justify-center items-center 
            rounded-full bg-blue-400 text-sm lg:text-lg text-white capitalize"
          >
            {currentUser.displayName?.slice(0, 2) ||
              currentUser.email?.slice(0, 2)}
          </div>
        )} */}
      </div>
      <div className="mt-7 flex flex-col justify-center items-center ">
        <div className=" flex flex-col sm:flex-row ">
          <div className="flex flex-col sm:mr-4">
            <div className="text-md sm:text-lg font-bold text-gray-600 tracking-wide">
              Username
            </div>
            <div className="flex flex-row">
              <div className="text-md mt-2 font-semibold text-gray-500">
                {currentUser.displayName || "Please add a username"}{" "}
              </div>
              <div className="ml-3 cursor-pointer">
                <Link href="/auth/UpdateProfile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#e78514"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-6 sm:mt-0 sm:ml-4">
            <div className="text-md sm:text-lg font-bold text-gray-600 tracking-wide sm:text-center">
              Email Address
            </div>
            <div className="flex flex-row text-center">
              <div className="text-md mt-2 font-semibold text-gray-500">
                {currentUser.email}{" "}
              </div>
              <div className="ml-3 cursor-pointer">
                <Link href="/auth/UpdateProfile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#e78514"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-3">
          <div className="mt-6 flex justify-center pb-5 text-sm font-display font-semibold text-gray-700 text-center">
            Do you want to update your profile ?{" "}
            <div className="cursor-pointer ml-3 font-bold text-blue-500 hover:text-blue-600">
              <Link href="/auth/UpdateProfile">UPDATE</Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default UpdateUser;
