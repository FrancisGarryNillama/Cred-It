import React from 'react';
import { Modal, ModalContent } from '../../../components/common';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export function LoginModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login" size="sm">
      <ModalContent>
        <LoginForm onClose={onClose} />
      </ModalContent>
    </Modal>
  );
}

export function RegisterModal({ isOpen, onClose, onSuccess }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Up" size="sm">
      <ModalContent>
        <RegisterForm onClose={onClose} onSuccess={onSuccess} />
      </ModalContent>
    </Modal>
  );
}