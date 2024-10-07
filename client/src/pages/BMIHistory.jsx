import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../styles/BMIHistory.css";
import { Link } from "react-router-dom";

export default function BMIHistory() {
  const { currentUser } = useSelector((state) => state.user);
  const [bmiHistory, setBmiHistory] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(false);

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
        console.error("Error fetching BMI history:", err);
      }
      setLoading(false);
    };

    fetchBmiHistory();
  }, [csrfToken, currentUser]);


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/bmi/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
      });
      if (response.ok) {
        setBmiHistory(bmiHistory.filter(entry => entry._id !== id));
      } else {
        throw new Error("Failed to delete BMI entry.");
      }
    } catch (err) {
      console.error("Error deleting BMI entry:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="d-flex flex-column align-items-center">
      <h3 className="title">BMI History</h3>
      {bmiHistory.length ? (
        <ul className="bmi-history-list">
          {bmiHistory.map((entry, index) => (
            <li key={index} className="bmi-history-item">
              <p>Date: {new Date(entry.date).toLocaleDateString()}</p>
              <p>BMI: {entry.bmi.toFixed(2)}</p>
              <p>Note: {entry.note}</p>
              {/* Delete button for each BMI entry */}
              <button className="delete-btn" onClick={() => handleDelete(entry._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <div>
        <h3 className="history-text">No bmi data yet...</h3>
        <Link to="/health">
          <button className="home-btn">Calculate BMI</button>
        </Link>
      </div>
        
      )}
    </div>
    </div>
  );
}
