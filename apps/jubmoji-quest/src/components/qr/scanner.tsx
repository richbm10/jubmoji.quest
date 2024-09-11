import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const Scanner = () => {
  const [qrData, setQrData] = useState<string | null>(null); // State to store the scanned data
  const [error, setError] = useState<string | null>(null); // State to handle errors

  return (
    <div className="qr-scanner">
      <QrReader
        onResult={(result, error) => {
          if (result) {
            setQrData(result.getText()); // Set the scanned data
          }

          if (error) {
            setError("Error while scanning QR code.");
            console.error(error);
          }
        }}
        constraints={{ // Define camera constraints
          facingMode: 'environment', // Use the back camera on mobile
        }}
        className="w-full"
      />
      {error && <p className="text-red-500">{error}</p>} {/* Error message */}
      {qrData && <p>Scanned Data: {qrData}</p>} {/* Display scanned data */}
    </div>
  );
};

export default Scanner;