import React, { useRef, useState } from 'react';
import { Modal, Form, Input, Button, Spin } from 'antd';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import { RolResponse } from '../../Interfaces/InterfacesResponse/Rol/RolResponse';
import { RolEditarRequest } from '../../Interfaces/InterfacesResponse/Rol/RolEditarRequest';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier'; // Asegúrate de tener este componente

const userApiUrl = import.meta.env.VITE_USER_API;

interface Props {
  visible: boolean;
  onClose: () => void;
  rol?: RolResponse;
  onSuccess?: () => void;
}

const editarRol = async (rol: RolEditarRequest): Promise<ObjectResponse<RolResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Rol/Actualizar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rol),
  });

  if (!response.ok) {
    throw new Error('Error en la actualización del rol');
  }

  const data = await response.json();
  return new ObjectResponse<RolResponse>(data.code, data.message, data.item);
};

const RolEditarComponent: React.FC<Props> = ({ visible, onClose, rol, onSuccess }) => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [loading, setLoading] = useState(false);

  // Si no hay rol, no mostrar el modal
  if (!rol) {
    return null;
  }

  // Lógica para manejar el submit
  const handleFormSubmit = async (values: RolEditarRequest, actions: FormikHelpers<RolEditarRequest>) => {
    try {
      // Llamamos a la función editarRol para realizar la actualización
      setLoading(true);
      const response = await editarRol(values);

      if (response.code === 1) {
        // Mostrar un mensaje de éxito en el toast
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Registro actualizado',
          detail: response.message, // Mostrar el mensaje de éxito
        });
        if (onSuccess) {
          onSuccess(); // 🔁 Recarga tabla u otros datos
        }
        onClose(); // Cerrar el modal al completar
      } else {
        // Mostrar mensaje de error si la respuesta no es exitosa
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'El registro no se pudo actualizar',
          detail: response.message, // Mostrar el mensaje de error
        });
      }
    } catch (error) {
      // Mostrar error en el toast si algo sale mal
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al registrar el rol',
        detail: 'Contactese con el administrador',
      });
      onClose(); // Cerrar el modal después de un error
    } finally {
      setLoading(false);
      actions.setSubmitting(false); // Terminar el estado de submitting
    }
  };

  return (
    <Modal
      title="Editar Rol"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={loading} tip="Cargando..." />
      <ToastNotifier ref={toastRef} />
      
      <Formik
        initialValues={{
          pId: rol.id,
          pNombre: rol.nombre || '',
          pDescripcion: rol.descripcion || '',
        }}
        enableReinitialize
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, values, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label>Nombre</label>
              <Input
                name="pNombre"
                value={values.pNombre}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Descripción</label>
              <Input
                name="pDescripcion"
                value={values.pDescripcion}
                onChange={handleChange}
              />
            </div>

            <div style={{ textAlign: 'center', paddingTop: 16 }}>
              <Button
                onClick={onClose}
                style={{
                  backgroundColor: '#ff4d4f',
                  borderColor: '#ff4d4f',
                  color: 'white',
                  marginRight: '12px',
                  padding: '0 24px',
                }}
              >
                Cancelar
              </Button>

              <Button
                htmlType="submit"
                loading={isSubmitting}
                style={{
                  backgroundColor: '#fa8c16',
                  borderColor: '#fa8c16',
                  color: 'white',
                  padding: '0 24px',
                }}
              >
                Modificar
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Modal>

  );
};

export default RolEditarComponent;
