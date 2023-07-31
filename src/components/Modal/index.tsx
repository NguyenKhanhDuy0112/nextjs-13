import { useState } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal(props: ModalProps) {
  const { show, onClose, children } = props;
  return (
    <div className={`modalBackdrop ${show ? "open" : ""}`}>
      <div className={"overlay"}></div>
      <div className={"modalContent"}>
        <button className={"closeButton"} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
