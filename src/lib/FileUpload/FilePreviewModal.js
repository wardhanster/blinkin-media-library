import React, { useState, useEffect } from "react";

import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default function FilePreviewModal(props) {
  const { className, modalStatus } = props;

  const [modal, setModal] = useState(false);
  const toggle = () => {
    props.toggle(!modal);
    setModal(!modal);
  };

  useEffect(() => {
    setModal(modalStatus);
  }, [modalStatus]);

  return (
    <div>
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={className}
        backdrop="static"
      >
        <ModalHeader toggle={toggle}>
          {window.strings.ML_filePreview || "File Preview"}
        </ModalHeader>
        <ModalBody>{props.render()}</ModalBody>
      </Modal>
    </div>
  );
}
