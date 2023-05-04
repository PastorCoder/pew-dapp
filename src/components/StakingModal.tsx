import React, { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/modalStyle.css";

interface Props {
  handleShowModal: boolean;
  handleCloseModal: () => void;
  modalTitle: string;
  children: ReactNode;
}

const StakingModal: React.FC<Props> = ({
  handleShowModal,
  handleCloseModal,
  modalTitle,
  children,
}) => {
  return (
    <div className={`modal-container ${handleShowModal ? "show" : ""}`}>
      <div className="modal">
        <h2 className="title">{modalTitle}</h2>
        <hr />
        <button className="close-btn" onClick={handleCloseModal}>
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
};

export default StakingModal;
