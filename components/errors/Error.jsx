import React from "react";

function Error({error}) {
  return (
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
            <p>{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;
