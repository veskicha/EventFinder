// EventDetailModal.js
import React from 'react';
import './EventDetailModal.css';
import { format } from 'date-fns';

const categoryInfo = {
    MUSIC: { image: '/music.jpg' },
    ART:   { image: '/art.jpg' },
    FOOD:  { image: '/food.jpg' },
    THEATER:{ image: '/theater.jpg' },
    DEFAULT:{ image: '/default-event.jpg' },
};

function getCategoryImage(type) {
    const key = (typeof type === 'string'
            ? type.toUpperCase()
            : type && type.value
                ? type.value.toUpperCase()
                : ''
    );
    return (categoryInfo[key] || categoryInfo.DEFAULT).image;
}

const EventDetailModal = ({ event, onClose, onBuy }) => {
    if (!event) return null;

    const start = new Date(event.startDateTime);
    const end   = new Date(event.endDateTime);
    const img   = getCategoryImage(event.type);

    return (
        <div className="modal-overlay">
            <div className="modal-content detail-modal">
                {/* Left image panel */}
                <div
                    className="detail-image"
                    style={{ backgroundImage: `url(${img})` }}
                >
                    <div className="detail-date">
                        <div>{format(start, 'dd')}</div>
                        <div>{format(start, 'MMM')}</div>
                    </div>
                </div>

                {/* Right info panel */}
                <div className="detail-info">
                    <h2 className="detail-title">{event.name}</h2>
                    <p className="detail-address">
                        <strong>Къде:</strong> {event.address}
                    </p>
                    <p className="detail-description">
                        <strong>Описание:</strong> {event.description}
                    </p>
                    <div className="detail-buttons">
                        <button
                            className="buy-btn"
                            onClick={() => onBuy(event)}
                        >
                            Купи билет
                        </button>
                        <button
                            className="back-btn"
                            onClick={onClose}
                        >
                            Назад
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailModal;
