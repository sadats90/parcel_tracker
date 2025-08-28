const validateTrackingNumber = (value) => {
  // Custom validation for tracking number format
  const regex = /^[A-Z0-9]+$/;
  if (!regex.test(value.toUpperCase())) {
    throw new Error('Tracking number must contain only letters and numbers');
  }
  return true;
};

const validateCoordinates = (lat, lng) => {
  if (lat < -90 || lat > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (lng < -180 || lng > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }
  return true;
};

const validateStatus = (status) => {
  const validStatuses = [
    'picked_up', 
    'in_transit', 
    'out_for_delivery', 
    'delivered', 
    'exception', 
    'returned'
  ];
  
  if (!validStatuses.includes(status)) {
    throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  return true;
};

module.exports = {
  validateTrackingNumber,
  validateCoordinates,
  validateStatus
};