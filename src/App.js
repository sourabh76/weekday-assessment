import React, { useState, useEffect } from "react";
import getSymbolFromCurrency from "currency-symbol-map";
import "./App.css";

function App() {
  const [jobListings, setJobListings] = useState([]);
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
      <div className="job-listings">
        {filteredJobListings.map((listing, index) => (
          <div className="job">
            <div className="job-card" key={index}>
              <p>
                <strong>Job Title:</strong> {listing.jobRole}
              </p>
              <p>
                <strong>Company Name:</strong> {listing.jdUid.slice(-5)}
              </p>
              <p>
                <strong>Location:</strong> {listing.location}
              </p>
              <p>
                <strong>Estimated Salary:</strong>{" "}
                {getSymbolFromCurrency(listing.salaryCurrencyCode)}
                {`${listing.minJdSalary ? listing.minJdSalary : 0} - ${
                  listing.maxJdSalary
                }  ✅`}
              </p>
              <p>
                <strong>Job Description:</strong>{" "}
                {listing.jobDetailsFromCompany}
              </p>
              <p>
                <strong>Experience Required:</strong> {listing.minExp}
              </p>
              <button>Apply Button/Link</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
