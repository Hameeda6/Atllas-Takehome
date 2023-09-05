import React, { useEffect, useState } from 'react';
import styles from './AddUserPopup.module.css';

interface DeleteConfirmationPopupProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  position: { top: string; left: string };
  selectedUserId: string;
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({ isVisible, onCancel, onConfirm ,position,selectedUserId}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  if (!isVisible) {
    return null;
  }

  return (
   
    <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75'>
      <div style={isMobile ? position : {}}
      className={`fixed bg-white p-4 rounded shadow-md ${styles.popup}`}>
    
        <h2 className='text-xl font-semibold mb-4'>Delete User Confirmation</h2>
        <p>Do you want to delete the user entry with ID:{selectedUserId}?</p>
        <div className='flex justify-end mt-4'>
          <button
            type='button'
            onClick={onCancel}
            className='mr-2 px-4 py-2 bg-gray-300 rounded'
          >
            No
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className='px-4 py-2 bg-red-500 text-white rounded'
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;
