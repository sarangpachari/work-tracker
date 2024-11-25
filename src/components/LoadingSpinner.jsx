import React from "react";

const LoadingSpinner = () => {
  return (
    <>
      <div
        style={{ height: "100px" }}
        className="d-flex justify-content-center align-items-center m-5"
      >
        <Spinner animation="grow" size="sm" variant="dark" />
        <Spinner animation="grow" variant="dark" />
        <Spinner animation="grow" size="sm" variant="dark" />
      </div>
    </>
  );
};

export default LoadingSpinner;
