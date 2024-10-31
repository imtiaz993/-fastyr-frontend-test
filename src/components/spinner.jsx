import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div className="mt-20 flex justify-center">
      <RotatingLines
        visible={true}
        height="96"
        width="96"
        strokeColor="black"
        strokeWidth="2"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Spinner;
