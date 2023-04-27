import React, { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/modalStyle.css";

interface WalletsModalProps {
  showModal: boolean;
  closeModal: () => void;
  title: string;
  children: ReactNode;
}

const WalletsModal: React.FC<WalletsModalProps> = ({ showModal, closeModal, title, children }) => {
  return (
    <div className={`modal-container ${showModal ? "show" : ""}`}>
      <div className="modal">
        <h2 className="title">{title}</h2><hr />
        <button className="close-btn" onClick={closeModal}>
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
};

export default WalletsModal;
