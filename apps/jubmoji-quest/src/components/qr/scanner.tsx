import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Button } from "@/components/ui/Button";

interface ScannerProps {
  onResult: (data: string | null) => void; 
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onResult, onClose }) => {
  const [error, setError] = useState<string | null>(null);

  const handleScanResult = (result: any, scanError: any) => {
    if (scanError) {
      setError("Place the QR code in front of the camera.");
      console.error(scanError);
      return;
    }
    if (result) {
      const scannedText = result.getText();
      onResult(scannedText);
    }
  };

  return (
    <div className="qr-scanner w-full h-full fixed top-0 left-0 bg-black z-50 flex flex-col items-center justify-center">
      <QrReader
        onResult={handleScanResult}
        constraints={{ facingMode: 'environment' }}
        className="w-full h-auto"
      />

      {error && (
        <div className="flex flex-col items-center mt-4">
          <p className="text-white">{error}</p>
          <Button
            size="sm"
            variant="blue"
            className="mt-4 px-4 py-2 rounded-lg shadow-md"
            onClick={onClose}
          >
            Close QR Scanner
          </Button>
        </div>
      )}

    </div>
  );
};

export default Scanner;