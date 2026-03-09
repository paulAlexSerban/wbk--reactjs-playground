import { type ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

export type ModalHandle = {
    open: () => void;
};

type ModalProps = {
    children: ReactNode;
    buttonCaption: string;
};

const Modal = forwardRef<ModalHandle, ModalProps>(({ children, buttonCaption }, ref) => {
    const modalRoot = document.getElementById('modal-root')!;
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
        open() {
            dialogRef.current!.showModal();
        },
    }));

    return createPortal(
        <dialog ref={dialogRef} className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md">
            {children}
            <form method="dialog" className="mt-4 text-right">
                <Button>{buttonCaption}</Button>
            </form>
        </dialog>,
        modalRoot
    );
});

export default Modal;
