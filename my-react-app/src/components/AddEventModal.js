// AddEventModal.js
import React, { useState } from "react";
import "./Modal.css"; // Your CSS for the modal
import { GeoPoint } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

const eventTypeOptions = [
    { value: "Music", label: "Music" },
    { value: "Art", label: "Art" },
    { value: "Food", label: "Food" },
    { value: "Theater", label: "Theater" },
];

const AddEventModal = ({ isOpen, onClose, onAddEvent }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState(""); // New state for description
    const [startDateTime, setStartDateTime] = useState(null);
    const [endDateTime, setEndDateTime] = useState(null);
    const [type, setType] = useState(null);
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [validationMessage, setValidationMessage] = useState("");

    // Handler to validate the address using Google Geocoding API remains the same...
    const handleCheckAddress = async () => {
        if (!address) return;
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    address
                )}&key=AIzaSyAz-ydWZje-QBS6QH65zVbZZhDy-OazOiY`
            );
            const data = await response.json();
            if (data.status === "OK" && data.results.length > 0) {
                const result = data.results[0];
                const formattedAddress = result.formatted_address;
                const location = result.geometry.location;
                let street = "";
                let city = "";
                result.address_components.forEach((component) => {
                    if (component.types.includes("route")) {
                        street = component.long_name;
                    }
                    if (component.types.includes("locality")) {
                        city = component.long_name;
                    }
                });
                const message =
                    street && city
                        ? `Street: ${street}, City: ${city}`
                        : formattedAddress;
                setValidationMessage(message);
                setAddress(formattedAddress);
                setCoordinates({ lat: location.lat, lng: location.lng });
            } else {
                setValidationMessage("Invalid address");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            setValidationMessage("Invalid address");
        }
    };

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !description || !startDateTime || !endDateTime || !type || !address) {
            alert("Please fill in all fields.");
            return;
        }
        if (!coordinates.lat || !coordinates.lng) {
            alert("Please validate the address by clicking the 'Check' button.");
            return;
        }

        const newEvent = {
            name,
            description,
            startDateTime,
            endDateTime,
            type: type ? type.value : "",
            address,
            location: new GeoPoint(coordinates.lat, coordinates.lng),
        };

        onAddEvent(newEvent);


        setName("");
        setDescription("");
        setStartDateTime(null);
        setEndDateTime(null);
        setType(null);
        setAddress("");
        setCoordinates({ lat: null, lng: null });
        setValidationMessage("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content add-event">
                <h1 className="form-title">Добави събитие</h1>
                <p className="form-subtitle">Попълни формата внимателно за да създадеш събитие</p>
                <form className="event-form" onSubmit={handleSubmit}>
                    {/* Event Name */}
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Име на събитие</label>
                            <input
                                type="text"
                                placeholder="Име на събитие"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Описание</label>
                            <textarea
                                placeholder="Добави описание"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={155}
                            />
                            <small>
                                {description.length} / {155} знака
                            </small>
                        </div>
                    </div>

                    {/* Start & End Date/Time */}
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Дата и час на започване</label>
                            <DatePicker
                                selected={startDateTime}
                                onChange={(date) => setStartDateTime(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="yyyy-MM-dd HH:mm"
                                placeholderText="Дата и час на започване"
                            />
                        </div>
                        <div className="form-group">
                            <label>Дата и час на приключване</label>
                            <DatePicker
                                selected={endDateTime}
                                onChange={(date) => setEndDateTime(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="yyyy-MM-dd HH:mm"
                                placeholderText="Дата и час на приключване"
                            />
                        </div>
                    </div>

                    {/* Event Type & Address with Check Button */}
                    <div className="form-group-row">
                        <div className="form-group" style={{ height: "90px" }}>
                            <label>Вид събитие</label>
                            <Select
                                options={eventTypeOptions}
                                placeholder="Избери вид"
                                value={type}
                                onChange={(selectedOption) => setType(selectedOption)}
                                styles={{
                                    placeholder: (provided) => ({
                                        ...provided,
                                        color: "#888",
                                    }),
                                    control: (provided, state) => ({
                                        ...provided,
                                        borderColor: state.isFocused ? "#28b498" : provided.borderColor,
                                        transition: "border-color 0.3s ease",
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isFocused ? "#28b4985e" : provided.backgroundColor,
                                        transition: "background-color 0.3s ease, color 0.3s ease",
                                    }),
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Адрес</label>
                            <div className="check-address-row">
                                <input
                                    type="text"
                                    placeholder="пр: Улица, Град"
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        setValidationMessage("");
                                    }}
                                />
                                <button type="button" onClick={handleCheckAddress}>
                                    Провери
                                </button>
                            </div>
                            {validationMessage && (
                                <div
                                    style={{
                                        color:
                                            validationMessage === "Invalid address" ? "#B4284E" : "#4DDAC8",
                                        marginTop: "5px",
                                    }}
                                >
                                    {validationMessage}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="form-buttons">
                        <button type="submit" className="submit-btn">
                            Направи
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Откажи
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;
