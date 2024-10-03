import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../styles/BMIHistory.css";

export default function BMIHistory() {
  const { currentUser } = useSelector((state) => state.user);
  const [bmiHistory, setBmiHistory] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf-token', { method: 'GET', credentials: 'include' });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    const fetchBmiHistory = async () => {
      if (!currentUser || !currentUser._id || !csrfToken) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/bmi/user/${currentUser._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setBmiHistory(data);
        } else {
          throw new Error(data.message || "Failed to fetch BMI history.");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching BMI history:", err);
      }
      setLoading(false);
    };

    fetchBmiHistory();
  }, [csrfToken, currentUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bmi-history-container">
      <h1 className="bmi-history-title">BMI History</h1>
      {bmiHistory.length > 0 ? (
        <ul className="bmi-history-list">
          {bmiHistory.map((entry, index) => (
            <li key={index} className="bmi-history-item">
              <p>Date: {new Date(entry.date).toLocaleDateString()}</p>
              <p>BMI: {entry.bmi.toFixed(2)}</p>
              <p>Note: {entry.note}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No BMI entries found.</p>
      )}
    </div>
  );
}