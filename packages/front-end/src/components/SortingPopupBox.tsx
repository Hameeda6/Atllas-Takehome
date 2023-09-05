import React from 'react';

interface SortingPopupBoxProps {
  onSortAscending: () => void;
  onSortDescending: () => void;
}

const SortingPopupBox: React.FC<SortingPopupBoxProps> = ({ onSortAscending, onSortDescending }) => {
  return (
    <div className="absolute bg-white border p-2 shadow z-10">
      <div className="py-2 px-4 cursor-pointer hover:bg-gray-100" onClick={onSortAscending}>
        Ascending
      </div>
      <div className="py-2 px-4 cursor-pointer hover:bg-gray-100" onClick={onSortDescending}>
        Descending
      </div>
    </div>
  );
};

export default SortingPopupBox;
