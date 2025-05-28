import React from "react";
import "./StyledEventList.css";
import { format } from "date-fns";
import { bg } from "date-fns/locale";

// Map event types to color & image (adjust paths to your images)
const categoryInfo = {
    MUSIC: {
        color: "#F44336",
        image: "/music.jpg", // place the image in your public folder
    },
    ART: {
        color: "#2196F3",
        image: "/art.jpg",
    },
    FOOD: {
        color: "#4CAF50",
        image: "/food.jpg",
    },
    THEATER: {
        color: "#9C27B0",
        image: "/theater.jpg",
    },
    DEFAULT: {
        color: "#757575",
        image: "/default-event.jpg",
    },
};

// map English type values → Bulgarian labels
const BG_EVENT_TYPES = {
    Music:   "Музика",
    Art:     "Изкуство",
    Food:    "Храна",
    Theater: "Театър",
};


function getCategoryData(type) {
    let key = "";
    if (typeof type === "string") {
        key = type.toUpperCase();
    } else if (typeof type === "object" && type !== null && type.value) {
        key = type.value.toUpperCase();
    }
    return categoryInfo[key] || categoryInfo.DEFAULT;
}

const StyledEventList = ({ events, onEventClick }) => {
    // Sort events by start date/time
    const sortedEvents = [...events].sort(
        (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
    );

    return (
        <div className="event-grid">
            {sortedEvents.map((event) => {
                // Format dates
                const startDate = new Date(event.startDateTime);
                const dayOfMonth = format(startDate, "dd"); // e.g., "20"
                const monthShort = format(startDate, "MMM", { locale: bg }); // e.g., "Mar"

                const endDate = new Date(event.endDateTime);
                const startTime = format(startDate, "HH:mm");
                const endTime = format(endDate, "HH:mm");

                // Get color/image for the event type
                const categoryData = getCategoryData(event.type);

                // Determine event type text (if type is an object, extract its value)
                const rawType =
                    typeof event.type === "string"
                        ? event.type
                        : event.type && event.type.value
                            ? event.type.value
                            : "";

// look up Bulgarian, fallback to raw
                const eventTypeText = BG_EVENT_TYPES[rawType] || rawType;

                return (
                    <div
                        key={event.id}
                        className="event-card"
                        style={{
                            backgroundColor: categoryData.color,
                            backgroundImage: `url(${categoryData.image})`,
                        }}
                        onClick={() => onEventClick(event)}
                    >
                        <p className="event-description">{event.description}</p>
                        {/* Date Badge at Top-Left */}
                        <div className="event-date">
                            <div className="event-day">{dayOfMonth}</div>
                            <div className="event-month">{monthShort}</div>
                        </div>

                        {/* Main Content at Bottom */}
                        <div className="event-content">
                            <div className="event-category">{eventTypeText}</div>
                            <h4 className="event-name">{event.name}</h4>
                            <div className="event-location">{event.address}</div>
                            <div className="event-time">
                                {startTime} - {endTime}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StyledEventList;
