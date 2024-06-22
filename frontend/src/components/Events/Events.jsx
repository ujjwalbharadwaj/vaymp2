import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from './EventCard';
import { getAllEvents } from '../../redux/actions/event';

const Events = () => {
  const {allEvents,isLoading} = useSelector((state) => state.events);  
console.log("aaaa",allEvents)


  // if (error) {
  //   console.error("Error loading events:", error);
  // }
  console.log("Error loading events:", allEvents);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.section}>
          <div className={styles.heading}>
            <h1>Popular Events</h1>
          </div>
          <div className="w-full grid">
            {allEvents && allEvents.length !== 0 ? (
              allEvents.map((event) => <EventCard key={event._id} data={event} />)
            ) : (
              <h4>No Events available!</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
