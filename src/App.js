import React, { useState, useEffect } from "react";
import getSymbolFromCurrency from "currency-symbol-map";
import Timer from "./assets/images/timer.svg";
import "./App.css";
import FullDescription from "./components/FullDescription";
import Filter from "./components/Filter";

function App() {
  const [jobListings, setJobListings] = useState([]);
  const [viewMore, setViewMore] = useState(false);
  const [filteredJobListings, setFilteredJobListings] = useState([]);
  const [filters, setFilters] = useState({
    role: "",
    totalEmployees: "",
    minExperience: "",
    remote: "",
    salary: "",
    companyName: "",
  });
  const [page, setPage] = useState(1);
  const perPage = 10;

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
      setJobListings((prevListings) => [...prevListings, ...data.jdList]);
    } catch (error) {
      console.error("Error fetching job listings:", error);
    }
  };

  const applyFilters = () => {
    const filteredJobs = jobListings.filter((job) => {
      return (
        (!filters.role ||
          job.jobRole.toLowerCase().includes(filters.role.toLowerCase())) &&
        (!filters.minExperience || job.minExp >= filters.minExperience) &&
        (!filters.companyName ||
          job.companyName
            .toLowerCase()
            .includes(filters.companyName.toLowerCase())) &&
        (!filters.remote ||
          job.location?.toLowerCase().includes(filters.remote.toLowerCase())) &&
        (!filters.totalEmployees ||
          job.totalEmployees
            ?.toLowerCase()
            .includes(filters.totalEmployees.toLowerCase()) ||
          job) &&
        (!filters.salary ||
          (job.minJdSalary
            ? job.minJdSalary >= filters.salary
            : job.maxJdSalary >= filters.salary))
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
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="App">
      <Filter filters={filters} handleFilterChange={handleFilterChange} />

      <div
        className="job-listings"
        style={{
          opacity: viewMore ? 0.3 : 1.0,
        }}
      >
        {filteredJobListings.map((listing, index) => (
          <div className="job" key={index}>
            <div className="job-card" key={index}>
              <p className="post-time">
                <img src={Timer} alt="timer" /> &nbsp; Posted 10 days ago
              </p>
              <div className="job-name">
                <img src={listing.logoUrl} alt="logo" />
                <div className="job-info">
                  <div className="info-container">
                    <h3>{listing.companyName}</h3>
                    <h2>{listing.jobRole}</h2>
                  </div>
                  <p>{listing.location}</p>
                </div>
              </div>
              <p className="job-salary">
                Estimated Salary:{" "}
                {getSymbolFromCurrency(listing.salaryCurrencyCode)}
                {`${listing.minJdSalary ? listing.minJdSalary + " - " : ""}${
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
              <div
                className="job-experience"
                style={{
                  visibility: !listing.minExp ? "hidden" : "visible",
                }}
              >
                <h3>Minimum Experience</h3>
                <div>{listing.minExp} years</div>
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
        <FullDescription jobListings={jobListings} setViewMore={setViewMore} />
      )}
    </div>
  );
}

export default App;
