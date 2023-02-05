import { FC } from 'react';
import { HiOutlineExclamationCircle as ExclamationIcon } from 'react-icons/hi';
import { Modal, Button } from 'flowbite-react';

type DeleteModalProps = {
  show: boolean;
  prompt: string;
  onClose: () => void;
  onClick: () => void;
};

const DeleteModal: FC<DeleteModalProps> = ({ show, prompt, onClose, onClick }) => {
  return (
    <Modal show={show} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <ExclamationIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{prompt}</h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={onClick}>
              Yes, I&apos;m sure
            </Button>
            <Button color="gray" onClick={onClose}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
