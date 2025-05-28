import React from 'react';

const Filter = ({ filters, setFilters }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <div className="filter-container">
            <label>Date:</label>
            <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
            />

            <label>Category:</label>
            <select name="category" value={filters.category} onChange={handleChange}>
                <option value="">All</option>
                <option value="Music">Music</option>
                <option value="Art">Art</option>
                <option value="Food">Food</option>
                <option value="Theater">Theater</option>
            </select>

            <label>Location:</label>
            <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Enter location"
            />
        </div>
    );
};

export default Filter;
