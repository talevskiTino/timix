import React from 'react';

const Modal = (props) => {
  return (
    <div className="fixed z-20 top-24 w-3/5 bg-white shadow-md left-0 right-0 mx-auto">
      <div className="p-1 bg-rose-900 text-white">
        <h1 className="m-0 text-lg">{props.title}</h1>
      </div>
      <div className="p-1">{props.children}</div>
      {/* <div className="flex justify-end form-control max-w-xl mx-auto mb-5 gap-3">
        <button
          type="submit"
          onClick={props.onConfirm}
          className="bg-rose-900 hover:bg-rose-700 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Product
        </button>
        <button
          type="submit"
          onClick={props.onCancel}
          className="bg-rose-900 hover:bg-rose-700 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div> */}
    </div>
  );
};

export default Modal;
