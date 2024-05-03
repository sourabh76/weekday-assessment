import React, { useState, useEffect } from "react";
import getSymbolFromCurrency from "currency-symbol-map";
import Timer from "./assets/images/timer.svg";
import Company1 from "./assets/images/company1.svg";
import Company2 from "./assets/images/company2.svg";
import Company3 from "./assets/images/company3.svg";
import Close from "./assets/images/close.svg";
import "./App.css";

function App() {
  const [jobListings, setJobListings] = useState([]);
  const [viewMore, setViewMore] = useState(false);
  const [filteredJobListings, setFilteredJobListings] = useState([]);
  const [filters, setFilters] = useState({
    minExperience: "",
    companyName: "",
    location: "",
    remote: false,
    techStack: "",
    role: "",
    minBasePay: "",
  });
  const [page, setPage] = useState(1);
  const perPage = 10;

  // This function is used to get random company image
  const getCompanyImg = () => {
    const val = Math.floor(Math.random() * 3);
    switch (val) {
      case 1:
        return Company1;
      case 2:
        return Company2;
      default:
        return Company3;
    }
  };

  useEffect(() => {
    fetchJobListings(page);
  }, [page]);

  useEffect(() => {
    applyFilters();
  }, [jobListings, filters]);

  const fetchJobListings = async (page) => {
    try {
      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: perPage,
            offset: (page - 1) * perPage,
          }),
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch job listings");
      }

      const data = await response.json();
      console.log(">>>", data);
      setJobListings((prevListings) => [...prevListings, ...data.jdList]);
    } catch (error) {
      console.error("Error fetching job listings:", error);
    }
  };

  const applyFilters = () => {
    const filteredJobs = jobListings.filter((job) => {
      return (
        (!filters.minExperience || job.experience >= filters.minExperience) &&
        (!filters.companyName ||
          job.company
            .toLowerCase()
            .includes(filters.companyName.toLowerCase())) &&
        (!filters.location ||
          job.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (!filters.remote || job.remote) &&
        (!filters.techStack ||
          job.techStack
            .toLowerCase()
            .includes(filters.techStack.toLowerCase())) &&
        (!filters.role ||
          job.role.toLowerCase().includes(filters.role.toLowerCase())) &&
        (!filters.minBasePay || job.minBasePay >= filters.minBasePay)
      );
    });
    setFilteredJobListings(filteredJobs);
  };

  const handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    if (scrollBottom < 50) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Add scroll event listener on mount and remove on unmount

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="App">
      {/* <div className="filters">
        <label>
          Min Experience:
          <input
            type="text"
            name="minExperience"
            value={filters.minExperience}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={filters.companyName}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Remote:
          <input
            type="checkbox"
            name="remote"
            checked={filters.remote}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Tech Stack:
          <input
            type="text"
            name="techStack"
            value={filters.techStack}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Role:
          <input
            type="text"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Min Base Pay:
          <input
            type="text"
            name="minBasePay"
            value={filters.minBasePay}
            onChange={handleFilterChange}
          />
        </label>
      </div> */}
      <div
        className="job-listings"
        id="job-listings"
        style={{
          opacity: viewMore ? 0.3 : 1.0,
        }}
      >
        {filteredJobListings.map((listing, index) => (
          <div className="job">
            <div className="job-card" key={index}>
              <p className="post-time">
                <img src={Timer} alt="timer" /> &nbsp; Posted 10 days ago
              </p>
              <div className="job-name">
                <img src={getCompanyImg()} alt="logo" />
                <div className="job-info">
                  <div className="info-container">
                    <h3>{listing.jdUid.slice(-5)}</h3>
                    <h2>{listing.jobRole}</h2>
                  </div>
                  <p>{listing.location}</p>
                </div>
              </div>
              <p className="job-salary">
                Estimated Salary:{" "}
                {getSymbolFromCurrency(listing.salaryCurrencyCode)}
                {`${listing.minJdSalary ? listing.minJdSalary : 0} - ${
                  listing.maxJdSalary
                }  ✅`}
              </p>
              <div className="job-description">
                <p className="about-company">About Company:</p>
                <div className="about-us">
                  <p>
                    <strong>About us</strong>
                  </p>
                  <p>{listing.jobDetailsFromCompany}</p>
                </div>
              </div>
              <div className="view-job" onClick={() => setViewMore(true)}>
                View Job
              </div>
              <div className="job-experience">
                <h3>Minimum Experience</h3>
                <div>{listing.minExp ? listing.minExp : 0} years</div>
              </div>
              <div className="apply-button">
                <button
                  className="easy-apply"
                  onClick={() => alert("Applied!!")}
                >
                  ⚡ Easy Apply
                </button>
                <button
                  className="referral"
                  onClick={() => alert("Referred!!")}
                >
                  <img
                    src="https://media.licdn.com/dms/image/C5103AQHRgnM-GkuZmA/profile-displayphoto-shrink_100_100/0/1549103266658?e=1715817600&v=beta&t=qxtZ_x6KLpbOr-4cDJBp42cEoBKAVabypWSf-7c9Cic"
                    alt="referral"
                  />
                  <img
                    src="https://media.licdn.com/dms/image/C5103AQHRgnM-GkuZmA/profile-displayphoto-shrink_100_100/0/1549103266658?e=1715817600&v=beta&t=qxtZ_x6KLpbOr-4cDJBp42cEoBKAVabypWSf-7c9Cic"
                    alt="referral"
                  />
                  <span>Unlock referral asks</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {viewMore && (
        <div>
          <div className="full-description">
            <img src={Close} alt="close" onClick={() => setViewMore(false)} />
            <h2>Job description</h2>
            <div>{jobListings[0].jobDetailsFromCompany}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
