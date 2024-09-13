import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
  import React, { useEffect, useState } from 'react';

interface ErrorAlertProps {
    isVisible: boolean;
    message?: string;
    onClose?: () => void;
    duration?: number;
  }

  const ErrorAlert: React.FC<ErrorAlertProps> = ({ isVisible, message, onClose ,duration = 5000}) => {
    const [visible, setVisible] = useState(isVisible);
    useEffect(() => {
        if (isVisible) {
          setVisible(true);
          const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
          }, duration);
    
          return () => clearTimeout(timer); // Clean up timer on unmount or visibility change
        } else {
          setVisible(false);
        }
      }, [isVisible, duration, onClose]);
    
    return (
      <>
        {isVisible && (
            <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert variant="destructive" className="w-[300px] bg-red-500 text-white border border-red-700 shadow-lg p-4">
            <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>INFO</AlertTitle>
            </div>
            <AlertDescription>
              {message || 'An unexpected error occurred.'}
            </AlertDescription>
            {onClose && <button onClick={onClose}  
                                           className="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800"
            >Close</button>}
          </Alert>
          </div>
        )}
      </>
    );
  };
  
  export default ErrorAlert;

