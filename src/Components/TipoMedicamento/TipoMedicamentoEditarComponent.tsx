import React, { useRef, useState } from 'react';
import { Modal, Input, Button, Spin } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import { TipoMedicamentoResponse } from '../../Interfaces/InterfacesResponse/TipoMedicamento/TipoMedicamentoResponse';
import { TipoMedicamentoRequest } from '../../Interfaces/InterfacesResponse/TipoMedicamento/TipoMedicamentoRequest'; 
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';

const InventarioUrl = import.meta.env.VITE_INVENTARIO_API;

interface Props {
  visible: boolean;
  onClose: () => void;
  tipoMedicamento?: TipoMedicamentoResponse;
  onSuccess?: () => void;
}

const editarTipoMedicamento = async (
  tipoMedicamento: TipoMedicamentoRequest
): Promise<ObjectResponse<TipoMedicamentoResponse>> => {
  const response = await fetch(`${InventarioUrl}v1/TipoMedicamento/Actualizar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tipoMedicamento),
  });

  if (!response.ok) {
    throw new Error('Error en la actualización del tipo de medicamento');
  }

  const data = await response.json();
  return new ObjectResponse<TipoMedicamentoResponse>(data.code, data.message, data.item);
};

const TipoMedicamentoEditarComponent: React.FC<Props> = ({
  visible,
  onClose,
  tipoMedicamento,
  onSuccess,
}) => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [loading, setLoading] = useState(false);

  if (!tipoMedicamento) return null;

  const handleFormSubmit = async (
    values: TipoMedicamentoRequest,
    actions: FormikHelpers<TipoMedicamentoRequest>
  ) => {
    try {
      setLoading(true);
      const response = await editarTipoMedicamento(values);

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
          summary: 'El registro no se pudo actualizar',
          detail: response.message,
        });
      }
    } catch {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al modificar el tipo de medicamento',
        detail: 'Contactese con el administrador',
      });
      onClose();
    } finally {
      setLoading(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Editar Tipo de Medicamento"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={loading} tip="Cargando..." />
      <ToastNotifier ref={toastRef} />

      <Formik
         initialValues={new TipoMedicamentoRequest(
                tipoMedicamento.id,
                tipoMedicamento.nombre || '',
                tipoMedicamento.descripcion || ''
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

export default TipoMedicamentoEditarComponent;
