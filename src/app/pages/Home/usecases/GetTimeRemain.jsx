import React, { useState, useEffect } from "react";

export const GetTimeRemain = ({ startTime, endTime }) => {
  // State to store the remaining time (days, hours, minutes, seconds)
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const start = new Date(startTime.replace(" ", "T"));
  const end = new Date(endTime.replace(" ", "T"));
  let timeDiff = end.getTime() - start.getTime();

  useEffect(() => {
    const calculateTimeRemaining = () => {
      // If the time difference is less than or equal to 0, stop the countdown
      if (timeDiff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      timeDiff -= 1000;
      // Convert milliseconds into days, hours, minutes, and seconds
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Calculate time remaining every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return (
    <div className="flex items-center justify-center text-center">
      <div className="flex space-x-2 gap-1 items-center">
        <div className="flex flex-col !p-2 bg-accent rounded-lg text-accent-content">
          <span className="countdown font-mono text-[14px]">
            <span
              style={{ "--value": timeRemaining.hours }}
              aria-live="polite"
              aria-label={`${timeRemaining.hours} hours`}
            >
              {timeRemaining.hours}
            </span>
          </span>
        </div>
        <span className="text-[14px] font-extrabold">:</span>
        <div className="flex flex-col !p-2 bg-accent rounded-lg text-accent-content">
          <span className="countdown font-mono text-[14px]">
            <span
              style={{ "--value": timeRemaining.minutes }}
              aria-live="polite"
              aria-label={`${timeRemaining.minutes} minutes`}
            >
              {timeRemaining.minutes}
            </span>
          </span>
        </div>
        <span className="text-[14px] font-extrabold">:</span>
        <div className="flex flex-col !p-2 bg-accent rounded-lg text-accent-content">
          <span className="countdown font-mono text-[14px]">
            <span
              style={{ "--value": timeRemaining.seconds }}
              aria-live="polite"
              aria-label={`${timeRemaining.seconds} seconds`}
            >
              {timeRemaining.seconds}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
