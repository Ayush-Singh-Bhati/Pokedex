import React from "react";
import ReactDom from "react-dom";

const Modal = (props) => {
  const { handleCloseModal, children } = props;
  return ReactDom.createPortal(
    <div className="modal-container">
      <button className="modal-underlay" onClick={handleCloseModal}></button>
      <div className="modal-content">{children}</div>
    </div>,
    document.getElementById("portal")
  );
};

export default Modal;
