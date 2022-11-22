import React from "react";
import style from "../../styles/Modal.module.css";
import { ExclamationIcon, CheckIcon } from "@heroicons/react/outline";

function WarningModel({ setOpen, content, setWarningContent }) {
  return (
    <div>
      <div className={style.darkBG} />
      <div className={style.centered}>
        <div className={style.warningModal}>
          <div className={style.headerModal}>
            <div className={style.headerArea}>
              <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-8 sm:w-8">
                <ExclamationIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <h5 className={style.modalTitle}>ALERT</h5>
            </div>
          </div>

          <div className={style.contentOfModal}> {content}</div>
          <div className={style.modalActions}>
            <div className={style.actionsContainer}>
              <button
                className={style.okayBtn}
                onClick={() => {
                  setOpen(false);
                  setWarningContent("");
                }}
              >
                <div className={style.btnContainer}>
                  <CheckIcon className="w-6 h-6 mr-2" />
                  OKAY
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarningModel;
