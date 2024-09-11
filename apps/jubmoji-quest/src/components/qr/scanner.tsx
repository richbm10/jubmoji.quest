import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

interface ScannerProps {
  onResult: (data: string | null) => void; 
}

const Scanner: React.FC<ScannerProps> = ({ onResult }) => {
  const [error, setError] = useState<string | null>(null); 

  const handleScanResult = (result: any, scanError: any) => {
    if (scanError) {
      setError("Error while scanning QR code.");
      console.error(scanError);
      return;
    }
    if (result) {
      const scannedText = result.getText();
      onResult(scannedText); 
    }
  };

  return (
    <div className="qr-scanner">
      <QrReader
        onResult={handleScanResult}
        constraints={{
          facingMode: 'environment',
        }}
        className="w-full"
      />
      {error && <p className="text-red-500">{error}</p>} 
    </div>
  );
};

export default Scanner;