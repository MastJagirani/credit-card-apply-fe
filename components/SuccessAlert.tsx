import { RocketIcon } from "@radix-ui/react-icons"
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
  import React, { useEffect, useState } from 'react';

interface SuccessAlertProps {
    isVisible: boolean;
    message?: string;
    onClose?: () => void;
    duration?: number;
  }

  const SuccessAlert: React.FC<SuccessAlertProps> = ({ isVisible, message, onClose ,duration = 5000}) => {
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
         <Alert 
           variant="destructive" 
           className="w-[300px] bg-green-100 text-green-800 border border-green-300 shadow-lg rounded-lg p-4"
         >
           <div className="flex items-center space-x-2">
             <RocketIcon className="h-4 w-4" />
             <AlertTitle>Message</AlertTitle>
           </div>
           <AlertDescription className="mt-2">
             {message || 'SUCCESS'}
           </AlertDescription>
           {onClose && <button onClick={onClose} className="ml-auto mt-2 text-green-500 hover:text-green-700">Close</button>}
         </Alert>
       </div>
        )}
      </>
    );
  };
  
  export default SuccessAlert;

