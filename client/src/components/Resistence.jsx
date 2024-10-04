// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import resistanceIcon from "../assets/resistance-bands.png";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

export default function Resistance() {
    const [resistanceForm, setResistanceForm] = useState({
        name: "",
        weight: "",
        sets: "",
        reps: "",
        date: ""
    })
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const getCookie = async () => {
        const token = await fetch('/api/csrf-token');
        return token.json()
    };

    const handleDateChange = date => {
        setStartDate(date);
        handleResistanceChange({
            target: { name: "date", value: date }
        })
    }

    const handleResistanceChange = (event) => {
        const { name, value } = event.target;
        setResistanceForm({ ...resistanceForm, [name]: value })

    }

    const validateForm = (form) => {
        return form.name && form.weight && form.sets && form.reps && form.date;
    }

    const handleResistanceSubmit = async (event) => {
        event.preventDefault();

        //get token
        const csrfToken = await getCookie();
        if (!csrfToken) return false;

        // get user id 
        const userId = currentUser._id;

        // resistance submit
        if (validateForm(resistanceForm)) {
            try {
                // add userid to resistance form
                resistanceForm.userId = userId;

                const response = await fetch('/api/fitness/resistance', {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                      'x-csrf-token': csrfToken.csrfToken,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(resistanceForm),
                  });

                 if (!response.ok) {
                     throw new Error('something went wrong!');
                 }

                setMessage("Resistance successfully created!")
                setTimeout(() => {
                    setMessage("")
                }, 3000);

            } catch (err) {
                console.error(err)
            }
        }

        // clear form input
        setResistanceForm({
            name: "",
            weight: "",
            sets: "",
            reps: "",
            date: ""
        });

        navigate("/fitness/history");
    }

    return (
        <div className='resistance'>
            <div className="d-flex flex-column align-items-center">
                <h2 className='title text-center'>Add Exercise</h2>
                <form className='resistance-form d-flex flex-column' onSubmit={handleResistanceSubmit}>
                    <div className='d-flex justify-content-center'><img alt="resistance" src={resistanceIcon} className="exercise-form-icon" /></div>
                    <label>Name:</label>
                    <input type="text" name="name" id="name" placeholder="Bench Press"
                        value={resistanceForm.name} onChange={handleResistanceChange} />
                    <label>Weight (lbs):</label>
                    <input type="number" name="weight" id="weight" placeholder="0"
                        value={resistanceForm.weight} onChange={handleResistanceChange} />
                    <label>Sets:</label>
                    <input type="number" name="sets" id="sets" placeholder="0"
                        value={resistanceForm.sets} onChange={handleResistanceChange} />
                    <label>Reps:</label>
                    <input type="number" name="reps" id="reps" placeholder="0"
                        value={resistanceForm.reps} onChange={handleResistanceChange} />
                    <label >Date:</label>
                    <DatePicker selected={startDate} value={resistanceForm.date} onChange={handleDateChange} placeholderText="mm/dd/yyyy" />
                    <button className='submit-btn' type="submit" disabled={!validateForm(resistanceForm)} >Add</button>
                </form>
                <p className='message'>{message}</p>
            </div>
        </div>
    )
}