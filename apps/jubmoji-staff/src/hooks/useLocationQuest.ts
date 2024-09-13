import { useEffect, useState } from "react";

export const useLocationQuest = (id: string | number) => {
  const [coords, setCoords] = useState<{
    latitude: null | number;
    longitude: null | number;
  }>({ latitude: null, longitude: null });
  const [timestamp, setTimestamp] = useState<null | number>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleIsVisible = (_isVisible: boolean) => setIsVisible(_isVisible);

  useEffect(() => {
    if (!id) {
      return;
    }

    // Function to get the user's location
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    // Function to update the QR code URL
    const updateQrUrl = () => {
      const now = new Date().getTime(); // Current timestamp
      setTimestamp(now);

      if (coords.latitude && coords.longitude) {
        // Firebase deep link with coordinates and timestamp as parameters
        const newQrUrl = `${window.location.origin}/quests/${id}?lat=${coords.latitude}&long=${coords.longitude}&timestamp=${now}`;
        setQrUrl(newQrUrl);
      }
    };

    // Get the initial location
    getLocation();
    updateQrUrl();

    // Update QR code URL initially and every 2 minutes
    const intervalId = setInterval(() => {
      getLocation();
      updateQrUrl();
    }, 120000); // 2 minutes

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [id, coords.latitude, coords.longitude]);

  return {
    handleIsVisible,
    isVisible,
    timestamp,
    qrUrl,
  };
};
