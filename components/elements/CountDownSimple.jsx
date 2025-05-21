'use client';

import React, { useState, useEffect } from 'react';

const CountDownSimple = ({ timeTillDate, timeFormat }) => {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const then = new Date(timeTillDate);
            const now = new Date();
            const countdown = then - now;
            const d = Math.floor(countdown / (1000 * 60 * 60 * 24));
            const h = Math.floor(
                (countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const m = Math.floor(
                (countdown % (1000 * 60 * 60)) / (1000 * 60)
            );
            const s = Math.floor((countdown % (1000 * 60)) / 1000);
            
            setDays(d);
            setHours(h);
            setMinutes(m);
            setSeconds(s);
        }, 1000);
        
        return () => clearInterval(interval);
    }, [timeTillDate]);

    return (
        <div className="ps-countdown">
            <span className="days">
                <strong>{days < 10 ? `0${days}` : days}</strong>
                <p>Days</p>
            </span>
            <span className="hours">
                <strong>{hours < 10 ? `0${hours}` : hours}</strong>
                <p>Hours</p>
            </span>
            <span className="minutes">
                <strong>{minutes < 10 ? `0${minutes}` : minutes}</strong>
                <p>Minutes</p>
            </span>
            <span className="seconds">
                <strong>{seconds < 10 ? `0${seconds}` : seconds}</strong>
                <p>Seconds</p>
            </span>
        </div>
    );
};

export default CountDownSimple;
