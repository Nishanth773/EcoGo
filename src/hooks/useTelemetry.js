import { useState, useEffect, useRef } from 'react';
import { KalmanFilter } from '../utils/kalmanFilter';

// Simulates incoming OBD-II and phone accelerometer data
export function useTelemetry(isActive) {
  const [speed, setSpeed] = useState(0); // mph/kmh
  const [idleTime, setIdleTime] = useState(0); // seconds
  const [alerts, setAlerts] = useState([]); // Array of strings e.g. 'Harsh Acceleration'
  const [ecoScore, setEcoScore] = useState(100);

  // Kalman filter instance for speed/acceleration
  const kf = useRef(new KalmanFilter(0.1, 2, 1, 0));

  useEffect(() => {
    if (!isActive) return;

    let intervalId;
    let idleCounter = 0;
    let targetSpeed = 45; 
    let currentRawSpeed = 0;
    
    // Simulate telemetry ticks every second
    intervalId = setInterval(() => {
      // Simulate random speed changes up to +/- 10 mph
      const noise = (Math.random() - 0.5) * 15;
      
      // Calculate new raw speed
      currentRawSpeed = Math.max(0, targetSpeed + noise);
      
      // Randomly decide to stop (simulate traffic)
      if (Math.random() < 0.05) targetSpeed = 0;
      // Randomly start moving again
      else if (targetSpeed === 0 && Math.random() < 0.2) targetSpeed = 45;

      // Filter the noisy raw speed
      const smoothedSpeed = kf.current.filter(currentRawSpeed);
      const accelGForce = (smoothedSpeed - speed) * 0.045; // Simulated g-force calc

      // Update state
      setSpeed(Math.round(smoothedSpeed));

      // Harsh Acceleration Detection (> 0.25g)
      if (accelGForce > 0.25) {
        setAlerts(prev => [...prev.slice(-2), 'Harsh Acceleration Detected!']);
        setEcoScore(prev => Math.max(0, prev - 2));
      }

      // Idle Detection
      if (Math.round(smoothedSpeed) === 0) {
        idleCounter++;
        setIdleTime(idleCounter);
        
        // If > 180s, calculate fuel waste/drop score
        if (idleCounter > 180 && idleCounter % 10 === 0) {
          setAlerts(prev => [...prev.slice(-2), 'Excessive Idling: High Fuel Burn']);
          setEcoScore(prev => Math.max(0, prev - 1));
        }
      } else {
        idleCounter = 0;
        setIdleTime(0);
      }

      // Clear alerts after a few seconds if driving smoothly
      if (accelGForce <= 0.25 && idleCounter < 180 && Math.random() < 0.3) {
        setAlerts([]);
      }

    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive, speed]);

  return { speed, idleTime, alerts, ecoScore };
}
