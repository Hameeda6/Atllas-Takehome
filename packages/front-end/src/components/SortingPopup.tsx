import React from 'react';

interface SortingPopupProps {
  onSortAscending: () => void;
  onSortDescending: () => void;
}

const SortingPopup: React.FC<SortingPopupProps> = ({ onSortAscending, onSortDescending }) => {
  return (
    <div className="sorting-popup">
      {/* <button onClick={onSortAscending}>Ascending</button> */}
      {/* <button onClick={onSortDescending}>Descending</button> */}
    </div>
  );
};

export default SortingPopup;
