import React, { useRef, useState } from 'react';
import { Modal, Input, Button, Spin } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import { TipoMedidaResponse } from '../../Interfaces/InterfacesResponse/TipoMedida/TipoMedidaResponse';
import { TipoMedidaRequest } from '../../Interfaces/InterfacesResponse/TipoMedida/TipoMedidaRequest';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';

const InventarioUrl = import.meta.env.VITE_INVENTARIO_API;

interface Props {
  visible: boolean;
  onClose: () => void;
  tipoMedida?: TipoMedidaResponse;
  onSuccess?: () => void;
}

const editarTipoMedida = async (
  tipoMedida: TipoMedidaRequest
): Promise<ObjectResponse<TipoMedidaResponse>> => {
  const response = await fetch(`${InventarioUrl}v1/TipoMedida/Actualizar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tipoMedida),
  });

  if (!response.ok) {
    throw new Error('Error en la actualización del tipo de medida');
  }

  const data = await response.json();
  return new ObjectResponse<TipoMedidaResponse>(data.code, data.message, data.item);
};

const TipoMedidaEditarComponent: React.FC<Props> = ({
  visible,
  onClose,
  tipoMedida,
  onSuccess,
}) => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [loading, setLoading] = useState(false);

  if (!tipoMedida) return null;

  const handleFormSubmit = async (
    values: TipoMedidaRequest,
    actions: FormikHelpers<TipoMedidaRequest>
  ) => {
    try {
      setLoading(true);
      const response = await editarTipoMedida(values);

      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Registro actualizado',
          detail: response.message,
        });
        onSuccess?.();
        onClose();
      } else {
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'No se pudo actualizar',
          detail: response.message,
        });
      }
    } catch {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Contacte al administrador',
      });
      onClose();
    } finally {
      setLoading(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Editar Tipo de Medida"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={loading} tip="Cargando..." />
      <ToastNotifier ref={toastRef} />

      <Formik
        initialValues={new TipoMedidaRequest(
          tipoMedida.id,
          tipoMedida.nombre || '',
          tipoMedida.abreviatura || ''
        )}
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
              <label>Abreviatura</label>
              <Input
                name="pAbreviatura"
                value={values.pAbreviatura}
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

export default TipoMedidaEditarComponent;
