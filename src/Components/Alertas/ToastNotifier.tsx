// src/components/ToastNotifier.tsx
import { notification } from 'antd';
import { useImperativeHandle, forwardRef } from 'react';

export type ToastSeverity = 'success' | 'info' | 'warning' | 'error'; // Los tipos para la severidad

export interface ToastMessage {
  severity: ToastSeverity;
  summary: string;
  detail: string;
}

export interface ToastNotifierRef {
  showMessage: (message: ToastMessage) => void;
}

const ToastNotifier = forwardRef<ToastNotifierRef>((_, ref) => {
  // Exponemos el método 'showMessage' al componente padre
  useImperativeHandle(ref, () => ({
    showMessage: (message: ToastMessage) => {
      // Mostramos el mensaje con el tipo adecuado de Ant Design
      notification[message.severity]({
        message: message.summary,    // El título del toast
        description: message.detail, // El detalle del mensaje
        duration: 4, // Duración en segundos (valor predeterminado: 4)
        placement: 'topRight',       // Posición del toast
      });
    },
  }));

  return null; // No se necesita renderizar nada en el DOM
});

export default ToastNotifier;
