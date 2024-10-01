// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaDumbbell } from 'react-icons/fa';

import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

export default function Cardio() {
    const [cardioForm, setCardioForm] = useState({
        name: "",
        distance: "",
        duration: "",
        date: ""
    })
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("")

    const { currentUser } = useSelector((state) => state.user);

    const getCookie = async () => {
        const token = await fetch('/api/csrf-token');
        return token.json()
    };

    const handleCardioChange = (event) => {
        const { name, value } = event.target;
        setCardioForm({ ...cardioForm, [name]: value })
    }

    const handleDateChange = date => {
        setStartDate(date);
        handleCardioChange({
            target: { name: "date", value: date }
        })
    }

    const validateForm = (form) => {
        return form.name && form.distance && form.duration && form.date;
    }

    const handleCardioSubmit = async (event) => {
        event.preventDefault();

        //get token
        const csrfToken = await getCookie();
        if (!csrfToken) return false;

        // get user id 
        const userId = currentUser._id;

        // cardio submit
        if (validateForm(cardioForm)) {
            try {
                // add userid to cardio form
                cardioForm.userId = userId;

                const response = await fetch('/api/fitness/cardio', {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                      'x-csrf-token': csrfToken.csrfToken,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cardioForm),
                  });

                if (!response.ok) {
                    throw new Error('something went wrong!');
                }

                setMessage("Cardio successfully added!")
                setTimeout(() => {
                    setMessage("")
                }, 3000);
            } catch (err) {
                console.error(err)
            }
        }

        // clear form input
        setCardioForm({
            name: "",
            distance: "",
            duration: "",
            date: ""
        });

        navigate("/fitness/history");
    }

    return (
        <div className='cardio'>
            <div className="d-flex flex-column align-items-center">
                <h2 className='title text-center'>Add Exercise</h2>
                <form className='cardio-form d-flex flex-column' onSubmit={handleCardioSubmit}>
                    <div className='d-flex justify-content-center'><FaDumbbell alt="cardio" className="exercise-form-icon" /></div>
                    <label >Name:</label>
                    <input type="text" name="name" id="name" placeholder="Running"
                        value={cardioForm.name} onChange={handleCardioChange} />
                    <label >Distance (miles):</label>
                    <input type="number" name="distance" id="distance" placeholder="0"
                        value={cardioForm.distance} onChange={handleCardioChange} />
                    <label >Duration (minutes):</label>
                    <input type="number" name="duration" id="duration" placeholder="0"
                        value={cardioForm.duration} onChange={handleCardioChange} />
                    <label>Date:</label>
                    <DatePicker selected={startDate} value={cardioForm.date} onChange={handleDateChange} placeholderText="mm/dd/yyyy" />
                    <button className='submit-btn cardio-submit-btn' type="submit" disabled={!validateForm(cardioForm)} >Add</button>
                </form>
                <p className='message'>{message}</p>
            </div>
        </div>
    )
}