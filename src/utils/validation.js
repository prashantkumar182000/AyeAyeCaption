export const validateTimestamp = (timestamp) => {
    // Basic regex to check if the timestamp is in HH:MM:SS format
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return regex.test(timestamp);
  };