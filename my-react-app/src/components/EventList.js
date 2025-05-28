const EventList = ({ events = [] }) => {
    if (!events.length) {
        return <p>No events found.</p>;
    }

    return (
        <ul>
            {events.map((event) => (
                <li key={event.id}>
                    <h3>{event.name}</h3>
                    <p>Date: {event.date}</p>
                    <p>Category: {event.category}</p>
                    <p>Location: {event.location}</p>
                </li>
            ))}
        </ul>
    );
};

export default EventList;
