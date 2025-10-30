import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [detectedDistrict, setDetectedDistrict] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Detect user's location and find district
  const detectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setIsDetecting(true);
    setPermissionDenied(false);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });

      // Find the nearest district
      const district = await findNearestDistrict(latitude, longitude);
      if (district) {
        setDetectedDistrict(district);
        toast.success(`Detected your location: ${district.district_name}, ${district.state_name}`);
      } else {
        toast.error('Could not determine your district from location');
      }
    } catch (error) {
      console.error('Location detection error:', error);
      
      if (error.code === error.PERMISSION_DENIED) {
        setPermissionDenied(true);
        toast.error('Location access denied. Please allow location access or select manually.');
      } else if (error.code === error.TIMEOUT) {
        toast.error('Location detection timed out. Please try again.');
      } else {
        toast.error('Unable to detect your location. Please select manually.');
      }
    } finally {
      setIsDetecting(false);
    }
  };

  // Find nearest district based on coordinates
  const findNearestDistrict = async (latitude, longitude) => {
    try {
      // Get all districts with coordinates
      const response = await fetch('/api/districts');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to fetch districts');
      }

      const districts = result.data.filter(d => d.latitude && d.longitude);
      
      if (districts.length === 0) {
        return null;
      }

      // Calculate distance to each district and find the nearest one
      let nearestDistrict = null;
      let minDistance = Infinity;

      districts.forEach(district => {
        const distance = calculateDistance(
          latitude,
          longitude,
          district.latitude,
          district.longitude
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestDistrict = district;
        }
      });

      return nearestDistrict;
    } catch (error) {
      console.error('Error finding nearest district:', error);
      return null;
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Clear detected location
  const clearLocation = () => {
    setUserLocation(null);
    setDetectedDistrict(null);
    setPermissionDenied(false);
  };

  // Check if location is available on component mount
  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      // Check if we have permission
      navigator.permissions?.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          // Auto-detect location if permission is already granted
          detectLocation();
        }
      }).catch(() => {
        // Permissions API not supported, do nothing
      });
    }
  }, []);

  const value = {
    userLocation,
    detectedDistrict,
    isDetecting,
    permissionDenied,
    detectLocation,
    clearLocation,
    findNearestDistrict
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

