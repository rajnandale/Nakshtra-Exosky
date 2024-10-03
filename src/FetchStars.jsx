import React, { useState } from "react";

const FetchStars = () => {
  const [loading, setLoading] = useState(false);
  const [starsData, setStarsData] = useState(null);
  const [error, setError] = useState(null);

  // Initial form state
  const [formData, setFormData] = useState({
    ra: "", // Right Ascension (RA)
    dec: "", // Declination (Dec)
    radius: 0.1, // Radius for search
    mag_threshold: 6, // Magnitude threshold
    limit: 100, // Limit for the number of stars
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/interface/fetch-stars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the form data
      });

      if (response.ok) {
        const data = await response.json();
        setStarsData(data); // Update state with the star data
      } else {
        setError("Failed to fetch star data.");
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Fetch Stars Data</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Right Ascension (RA):
            <input
              type="number"
              name="ra"
              value={formData.ra}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Declination (Dec):
            <input
              type="number"
              name="dec"
              value={formData.dec}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Radius:
            <input
              type="number"
              name="radius"
              value={formData.radius}
              onChange={handleChange}
              step="0.01"
            />
          </label>
        </div>
        <div>
          <label>
            Magnitude Threshold:
            <input
              type="text"
              name="mag_threshold"
              value={formData.mag_threshold}
              onChange={handleChange}
              step="0.01"
            />
          </label>
        </div>
        <div>
          <label>
            Limit:
            <input
              type="text"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              step="1"
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Fetching..." : "Fetch Stars"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {starsData && (
        <div>
          <h3>Star Data:</h3>
          <pre>{JSON.stringify(starsData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FetchStars;