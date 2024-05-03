import React from "react";
import Close from "../assets/images/close.svg";
import "./FullDescription.css";

const FullDescription = ({ jobListings, setViewMore }) => {
  return (
    <div className="full-description">
      <img src={Close} alt="close" onClick={() => setViewMore(false)} />
      <h2>Job description</h2>
      <div>{jobListings[0].jobDetailsFromCompany}</div>
    </div>
  );
};

export default FullDescription;
