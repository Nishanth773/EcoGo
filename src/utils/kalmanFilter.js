// Simplified 1D Kalman Filter for smoothing noisy speed/acceleration data
// Real application would use Matrix math for multi-dimensional GPS+Accel smoothing.

export class KalmanFilter {
  constructor(processNoise = 1, sensorNoise = 1, estimatedError = 1, initialValue = 0) {
    this.q = processNoise; // Process noise covariance
    this.r = sensorNoise;  // Measurement noise covariance
    this.p = estimatedError; // Estimation error covariance
    this.x = initialValue;   // Value
  }

  filter(measurement) {
    // Prediction Update
    this.p = this.p + this.q;

    // Measurement Update
    const k = this.p / (this.p + this.r); // Kalman gain
    this.x = this.x + k * (measurement - this.x);
    this.p = (1 - k) * this.p;

    return this.x;
  }
}
