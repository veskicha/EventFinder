// Home.js
import React, { useState, useEffect } from "react";
import EventDetailModal from './EventDetailModal';
import { auth, db } from "../firebase";
import { collection, getDocs, setDoc, doc , addDoc} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import StyledEventList from "./StyledEventList";
import AddEventModal from "./AddEventModal";
import {FaPlus, FaSignOutAlt} from "react-icons/fa";
import MapComponent from "./MapComponent";
import "./HomeSplit.css";
import eventImage from "./event.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import Cookies from "js-cookie";
import { format } from "date-fns";
import {FaTicket} from "react-icons/fa6";


// Options for event type filtering (react-select)
const eventTypeOptions = [
    { value: "",       label: "Всички"    },
    { value: "Music", label: "Музика" },
    { value: "Art", label: "Изкуство" },
    { value: "Food", label: "Храна" },
    { value: "Theater", label: "Театър" },
];

const BG_EVENT_TYPES = {
    Music:   "#2196F3",
    Art:     "#d94a18",
    Food:    "#35c99c",
    Theater: "#ba0017",
};


const Home = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [animateTicket, setAnimateTicket] = useState(false);

    // Filter states: for live input and applied filters
    const [filters, setFilters] = useState({ category: "", date: "" });
    const [appliedFilters, setAppliedFilters] = useState({ category: "", date: "" });
    const [purchasedEvents, setPurchasedEvents] = useState([]);
    const [currentUid, setCurrentUid] = useState(null);

    const handleBuy = async evt => {
        if (!currentUid) return;
        await setDoc(doc(db, "users", currentUid, "tickets", evt.id), {
            eventId:   evt.id,
            name:      evt.name,
            address:   evt.address,
            startDateTime: evt.startDateTime.toISOString(),
            type:      evt.type,
            purchased: new Date().toISOString()
        });
        // optimistically add to state
        setPurchasedEvents(prev => {
            return [
                ...prev.filter(t => t.eventId !== evt.id),
                {
                    eventId:       evt.id,
                    name:          evt.name,
                    address:       evt.address,
                    startDateTime: evt.startDateTime,
                    type:          evt.type
                }
            ];
        });

        setAnimateTicket(true);
        setTimeout(() => setAnimateTicket(false), 600);
        setSelectedEvent(null);
        setSelectedEvent(null);
    };

    const handleTicketClick = ticket => {
        // find the full event object (which includes description)
        const full = events.find(e => e.id === ticket.eventId);
        if (!full) return;          
        setMenuOpen(false);
        setSelectedEvent(full);
    };

    // Fetch events from Firestore when component mounts
    useEffect(() => {
        Cookies.set("myFilters", JSON.stringify(filters), { expires: 7 });


        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "events"));
                const eventsData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Firestore Timestamps → JS Dates
                    const start = data.startDateTime.toDate
                        ? data.startDateTime.toDate()
                        : new Date(data.startDateTime);
                    const end = data.endDateTime.toDate
                        ? data.endDateTime.toDate()
                        : new Date(data.endDateTime);

                    return {
                        id: doc.id,
                        ...data,
                        startDateTime: start,
                        endDateTime:   end,
                    };
                });
                // Sort events by startDateTime
                eventsData.sort(
                    (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
                );
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [filters]);

    useEffect(() => {
        return onAuthStateChanged(auth, user => {
            setCurrentUid(user ? user.uid : null);
            if (!user) setPurchasedEvents([]);
        });
    }, []);

    // your existing “load tickets” effect becomes:
    useEffect(() => {
        if (!currentUid) return;
        (async () => {
            try {
                const snap = await getDocs(collection(db, "users", currentUid, "tickets"));
                const tickets = snap.docs.map(d => d.data());
                setPurchasedEvents(tickets);
            } catch (e) {
                console.error("Error loading tickets:", e);
            }
        })();
    }, [currentUid]);

    // Handle adding a new event to Firestore
    const handleAddEvent = async (newEvent) => {
        try {
            const docRef = await addDoc(collection(db, "events"), newEvent);
            setEvents((prev) => {
                const updated = [...prev, { id: docRef.id, ...newEvent }];
                updated.sort(
                    (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
                );
                return updated;
            });
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const filteredEvents = events.filter((event) => {
        let valid = true;

        // Convert event.type to a string. If it's an object (from react-select), extract its value.
        const eventTypeStr =
            typeof event.type === "string"
                ? event.type
                : event.type && event.type.value
                    ? event.type.value
                    : "";

        if (appliedFilters.category) {
            valid =
                valid &&
                eventTypeStr.toLowerCase() === appliedFilters.category.toLowerCase();
        }

        if (appliedFilters.date) {
            // Compare only the date part (YYYY-MM-DD)
            const eventDate = new Date(event.startDateTime)
                .toISOString()
                .split("T")[0];
            valid = valid && eventDate === appliedFilters.date;
        }

        return valid;
    });


    return (
        <div className="home-container">
            {/* Header with page title and logo on the same row */}
            <div className="header">
                <img className="header-logo" src="/logobrowser.png" alt="Logo" />
                <h1 className="page-title">Открий събитията около теб</h1>
                <div className="header-right">
                    <button
                        className={`menu-btn ${animateTicket ? "bounce" : ""}`}
                        onClick={() => setMenuOpen(o => !o)}
                    >
                        <FaTicket />
                        {purchasedEvents.length > 0 &&
                            (<span className="ticket-badge">{purchasedEvents.length}
                        </span>)}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
            )}

            {/* Sliding menu */}
            <div className={`side-menu ${menuOpen?"open":""}`}>
                <h2>Моите билети</h2>
                <ul className="tickets-list">
                    {purchasedEvents.length === 0 ? (
                        <li className="no-tickets">Няма купени билети</li>
                    ) : (
                        purchasedEvents.map(ticket => {
                            const color = BG_EVENT_TYPES[ticket.type] || "#777";
                            const time  = format(ticket.startDateTime, "HH:mm");

                            return (
                                <li
                                    key={ticket.eventId}
                                    className="ticket-item"
                                    style={{ borderLeft: `4px solid ${color}` }}
                                    onClick={() => handleTicketClick(ticket)}
                                >
                                    <div className="ticket-time">{time}</div>
                                    <div className="ticket-name">{ticket.name}</div>
                                    <div className="ticket-address">{ticket.address}</div>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>

            <div className="main-content">
                <div className="split-layout">
                    {/* Left side: background image + filter box */}
                    <div
                        className="left-section"
                        style={{
                            background: `url(${eventImage}) center center / cover no-repeat`,
                        }}
                    >
                        <div className="left-overlay">
                            <div className="filter-box">
                                <h2 className="filter-title">Филтриране</h2>
                                <p className="filter-subtitle">
                                    Избери опциите за да проемниш търсенето
                                </p>
                                <div className="filter-option">
                                    <label>Тип:</label>
                                    <Select
                                        options={eventTypeOptions}
                                        placeholder="Избери тип събитие"
                                        value={ eventTypeOptions.find(opt => opt.value === filters.category) }
                                        onChange={(opt) =>
                                            setFilters(prev => ({ ...prev, category: opt ? opt.value : "" }))
                                        }
                                        isClearable={false}        // we have an explicit “All” option
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
                                <div className="filter-option">
                                    <label>Начална дата:</label>
                                    <DatePicker
                                        selected={filters.date ? new Date(filters.date) : null}
                                        onChange={(date) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                date: date ? date.toISOString().split("T")[0] : "",
                                            }))
                                        }
                                        placeholderText="Избери дата"
                                        dateFormat="yyyy-MM-dd"
                                        wrapperClassName="date-picker-wrapper"
                                    />
                                </div>
                                <button
                                    className="filter-save-btn"
                                    onClick={() => setAppliedFilters(filters)}
                                >
                                    Запази промени
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right side: map */}
                    <div className="right-section">
                        <MapComponent events={filteredEvents} />

                    </div>
                </div>

                {/* Events list goes below the split */}
                <div className="events-below">
                    <div className="sidebar">
                        <div
                            className="sidebar-item"
                            onClick={() => setShowModal(true)}
                            title="Добави"
                        >
                            <div className="icon-container">
                                <button className="sidebar-btn">
                                    <FaPlus />
                                </button>
                            </div>
                            <span className="sidebar-label">Добави</span>
                        </div>
                        <div
                            className="sidebar-item"
                            onClick={() => auth.signOut()}
                            title="Излез"
                        >
                            <div className="icon-container">
                                <button className="sidebar-btn">
                                    <FaSignOutAlt />
                                </button>
                            </div>
                            <span className="sidebar-label">Излез</span>
                        </div>
                    </div>

                    {/* Modal for adding an event */}
                    <AddEventModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onAddEvent={handleAddEvent}
                    />

                    <h2>Всички събития</h2>
                    <StyledEventList
                        events={filteredEvents}
                        onEventClick={setSelectedEvent}
                    />

                </div>
                <EventDetailModal
                    event={selectedEvent}
                    onClose={()=>setSelectedEvent(null)}
                    onBuy={handleBuy}
                />
            </div>
        </div>
    );
};

export default Home;
