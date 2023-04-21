import React, { FC, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ModalComponentProps {
  setShowModal: (v: boolean) => void;
  title?: string;
  onClose: (data?: any) => void;
  onSave?: () => void;
}



export const ModalComponent: FC<React.PropsWithChildren<ModalComponentProps>> = ({
  setShowModal,
  children,
  title,
  onClose,
  onSave,
}) => {
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    setShowModal(false);
    onClose(onSave ? onSave() : undefined);
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title || 'Modal'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};