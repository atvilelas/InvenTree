
export interface UseModalProps {
  title: string;
  children: React.ReactElement;
  onOpen?: () => void;
  onClose?: () => void;
  closeOnClickOutside?: boolean;
}

export interface UseModalReturn {
  open: () => void;
  close: () => void;
  toggle: () => void;
  modal: React.ReactElement;
}
