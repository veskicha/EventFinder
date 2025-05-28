// MapComponent.js
import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { format } from "date-fns";
import mapStyle from "../mapStyle.json";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const center = {
    lat: 43.204483,
    lng: 27.913784,
};

const mapOptions = {
    styles: mapStyle,
    disableDefaultUI: true, // Hide default controls
    zoomControl: false,     // Hide zoom control
};

// Returns the correct marker icon URL based on event type
const getMarkerIconUrl = (type) => {
    const key = typeof type === "string"
        ? type.toLowerCase()
        : (type && type.value ? type.value.toLowerCase() : "");
    switch (key) {
        case "music":
            return "/logo-music.png";
        case "art":
            return "/logo-art.png";
        case "food":
            return "/logo-food.png";
        case "theater":
            return "/logo-theater.png";
        default:
            return "/logobrowser.png"; // fallback icon
    }
};

const MapComponent = ({ events }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAz-ydWZje-QBS6QH65zVbZZhDy-OazOiY",
        libraries: ["maps", "places"],
    });

    const [activeEvent, setActiveEvent] = useState(null);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={mapOptions}
        >
            {events.map((event) => {
                const loc = event.location;
                const position = loc && loc.latitude && loc.longitude
                    ? { lat: loc.latitude, lng: loc.longitude }
                    : (event.lat && event.lng ? { lat: event.lat, lng: event.lng } : null);
                if (!position) return null;

                // Construct custom icon for this event type
                const icon = {
                    url: getMarkerIconUrl(event.type),
                    scaledSize: new window.google.maps.Size(40, 40),
                };

                return (
                    <Marker
                        key={event.id}
                        position={position}
                        icon={icon}
                        onClick={() => setActiveEvent(event)}
                    />
                );
            })}

            {activeEvent && (
                <InfoWindow
                    position={
                        activeEvent.location
                            ? { lat: activeEvent.location.latitude, lng: activeEvent.location.longitude }
                            : { lat: activeEvent.lat, lng: activeEvent.lng }
                    }
                    onCloseClick={() => setActiveEvent(null)}
                    options={{ disableAutoPan: true, pixelOffset: new window.google.maps.Size(0, -35) }}
                >
                    <div className="custom-info-window">
                        <div className="info-window-left">
                            <img
                                src={getMarkerIconUrl(activeEvent.type)}
                                alt="Event"
                                className="info-window-image"
                            />
                        </div>
                        <div className="info-window-right">
                            <button
                                className="info-window-close"
                                onClick={() => setActiveEvent(null)}
                            >
                                ×
                            </button>
                            <div className="info-window-text">
                                <h4>{activeEvent.name}</h4>
                                <p>{format(new Date(activeEvent.startDateTime), "MMM dd, yyyy")}</p>
                            </div>
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    ) : (
        <div>Loading Map...</div>
    );
};

export default React.memo(MapComponent);
