import React, { useState } from "react";

const AddEventForm = ({ onAddEvent }) => {
    const [eventName, setEventName] = useState("");
    const [eventDateTime, setEventDateTime] = useState("");
    const [eventType, setEventType] = useState("");
    const [eventAddress, setEventAddress] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!eventName || !eventDateTime || !eventType || !eventAddress) {
            alert("Please fill in all fields.");
            return;
        }

        const newEvent = {
            id: Date.now(), // Simple unique ID
            name: eventName,
            dateTime: eventDateTime, // Expecting ISO format from datetime-local input
            type: eventType,
            address: eventAddress,
        };

        onAddEvent(newEvent);

        // Clear the form fields
        setEventName("");
        setEventDateTime("");
        setEventType("");
        setEventAddress("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                style={{ marginRight: "10px", padding: "8px" }}
            />
            <input
                type="datetime-local"
                value={eventDateTime}
                onChange={(e) => setEventDateTime(e.target.value)}
                style={{ marginRight: "10px", padding: "8px" }}
            />
            <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                style={{ marginRight: "10px", padding: "8px" }}
            >
                <option value="">Select event type</option>
                <option value="Music">Music</option>
                <option value="Art">Art</option>
                <option value="Food">Food</option>
                <option value="Theater">Theater</option>
            </select>
            <input
                type="text"
                placeholder="Event Address"
                value={eventAddress}
                onChange={(e) => setEventAddress(e.target.value)}
                style={{ marginRight: "10px", padding: "8px" }}
            />
            <button
                type="submit"
                style={{
                    padding: "10px 20px",
                    borderRadius: "20px",
                    backgroundColor: "#28b498",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Add Event
            </button>
        </form>
    );
};

export default AddEventForm;
