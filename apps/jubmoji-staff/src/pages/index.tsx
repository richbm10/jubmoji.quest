import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRPage = () => {
  const [coords, setCoords] = useState<{
    latitude: null | number;
    longitude: null | number;
  }>({ latitude: null, longitude: null });
  const [timestamp, setTimestamp] = useState<null | number>(null);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
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
        const newQrUrl = `https://example.page.link/?link=https://example.com?lat=${coords.latitude}&long=${coords.longitude}&timestamp=${now}`;
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
  }, [coords.latitude, coords.longitude]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Dynamic QR Code</h1>
      {qrUrl ? (
        <>
          {/* Use QRCodeCanvas to render the QR code as a Canvas element */}
          <QRCodeCanvas value={qrUrl} size={256} />
          <p>Latitude: {coords.latitude} </p>
          <p>Longitude: {coords.longitude}</p>
          <p>
            Timestamp: {timestamp ? new Date(timestamp).toLocaleString() : ""}
          </p>
        </>
      ) : (
        <p>Loading QR code...</p>
      )}
    </div>
  );
};

export default QRPage;
