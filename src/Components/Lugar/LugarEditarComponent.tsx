import React, { useRef, useState } from 'react';
import { Modal, Input, Button, Spin, DatePicker, TimePicker } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import dayjs from 'dayjs';
import { LugarResponse } from '../../Interfaces/InterfacesResponse/Lugar/LugarResponse';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { LugarEditarRequest } from '../../Interfaces/InterfacesResponse/Lugar/LugarEditarRequest';

const userApiUrl = import.meta.env.VITE_USER_API;

interface Props {
  visible: boolean;
  onClose: () => void;
  lugar?: LugarResponse;
  onSuccess?: () => void;
}

const editarLugar = async (lugar: LugarEditarRequest): Promise<ObjectResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/lugar/Actualizar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lugar),
  });

  if (!response.ok) {
    throw new Error('Error en la actualización del lugar');
  }

  const data = await response.json();
  return new ObjectResponse<LugarResponse>(data.code, data.message, data.item);
};

const LugarEditarComponent: React.FC<Props> = ({ visible, onClose, lugar, onSuccess }) => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [loading, setLoading] = useState(false);

  if (!lugar) return null;

  const handleFormSubmit = async (values: LugarEditarRequest, actions: FormikHelpers<LugarEditarRequest>) => {
    try {
      setLoading(true);
      const response = await editarLugar(values);

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
        summary: 'Error al modificar el lugar',
        detail: 'Contáctese con el administrador',
      });
      onClose();
    } finally {
      setLoading(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Editar Lugar"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={loading} tip="Cargando..." />
      <ToastNotifier ref={toastRef} />

      <Formik
        initialValues={{
          pId: lugar.id,
          pNombre: lugar.nombre || '',
          pFecha: dayjs(lugar.fecha).format('YYYY-MM-DD'),
          pHoraInicio: lugar.horaInicio || '',
          pHoraFin: lugar.horaFin || '',
        }}
        enableReinitialize
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, values, setFieldValue, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label>Nombre</label>
              <Input name="pNombre" value={values.pNombre} onChange={handleChange} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Fecha</label>
              <DatePicker
                name="pFecha"
                value={dayjs(values.pFecha)}
                onChange={(date) => setFieldValue('pFecha', date?.format('YYYY-MM-DD'))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Hora de Inicio</label>
              <TimePicker
                name="pHoraInicio"
                value={values.pHoraInicio ? dayjs(values.pHoraInicio, 'HH:mm') : null}
                onChange={(time) => setFieldValue('pHoraInicio', time?.format('HH:mm'))}
                format="HH:mm"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Hora de Fin</label>
              <TimePicker
                name="pHoraFin"
                value={values.pHoraFin ? dayjs(values.pHoraFin, 'HH:mm') : null}
                onChange={(time) => setFieldValue('pHoraFin', time?.format('HH:mm'))}
                format="HH:mm"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ textAlign: 'center', paddingTop: 16 }}>
              <Button onClick={onClose} style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white', marginRight: 12 }}>
                Cancelar
              </Button>

              <Button htmlType="submit" loading={isSubmitting} style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16', color: 'white' }}>
                Modificar
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default LugarEditarComponent;
