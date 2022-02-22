/* eslint-disable no-unused-vars */
import { useEffect, useState, createContext } from 'react';
import Toast from '../components/ui/Toast';

export const ToastContext = createContext({
  open: (_text, _type) => {},
  close: () => {},
});

let timer = null;
export const ToastProvider = ({ children }) => {
  const [text, setText] = useState('');
  const [type, setType] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setText('');
        setShow(false);
      }, 2800);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [show]);

  const open = (text, type) => {
    setText(text);
    setType(type);
    setShow(true);
  };

  const close = () => {
    setText('');
    setType('');
    setShow(false);
  };

  return (
    <ToastContext.Provider
      value={{
        open,
        close,
      }}
    >
      {children}
      <Toast type={type} visible={show} close={() => close()}>
        <p>{text}</p>
      </Toast>
    </ToastContext.Provider>
  );
};
