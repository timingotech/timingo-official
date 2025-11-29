import React from 'react';

const InfoModal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="max-w-2xl w-full bg-white rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
        </div>
        <div className="mt-4 text-gray-700">{children}</div>
        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md">Close</button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
