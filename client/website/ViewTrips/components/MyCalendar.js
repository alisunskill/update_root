import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MyCalendar = () => {
  const handleDateChange = (date) => {
    // Handle date change logic here
    console.log(date);
  };

  return (
    <div>
      <Calendar className='text-dark' onChange={handleDateChange} />
    </div>
  );
};

export default MyCalendar;
