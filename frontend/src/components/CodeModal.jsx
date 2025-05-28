import React from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root'); // Set root element for accessibility

const CodeModal = ({ isOpen, onRequestClose, code }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Submission Code"
      className="bg-white rounded-lg p-6 max-w-lg w-full mx-auto shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="flex flex-col">
        <h2 className="text-2xl mb-4">Submission Code</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">{code}</pre>
        <button
          onClick={onRequestClose}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 self-end"
        >
          Close
        </button>
      </div>
    </ReactModal>
  );
};

export default CodeModal;
