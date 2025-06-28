import React, { useRef, useState } from 'react';
import { Modal, Input, Button, Spin, DatePicker } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import dayjs from 'dayjs';
import { MisionResponse } from '../../Interfaces/InterfacesResponse/Mision/MisionResponse';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { MisionEditarRequest } from '../../Interfaces/InterfacesResponse/Mision/MisionEditarRequest'; 

const userApiUrl = import.meta.env.VITE_USER_API;  // Asegúrate de configurar tu URL en el archivo de entorno

interface Props {
  visible: boolean;
  onClose: () => void;
  mision?: MisionResponse;
  onSuccess?: () => void;
}

const editarMision = async (mision: MisionEditarRequest): Promise<ObjectResponse<MisionResponse>> => {
  const response = await fetch(`${userApiUrl}v1/mision/Actualizar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mision),
  });

  if (!response.ok) {
    throw new Error('Error en la actualización de la misión');
  }

  const data = await response.json();
  return new ObjectResponse<MisionResponse>(data.code, data.message, data.item);
};

const MisionEditarComponent: React.FC<Props> = ({ visible, onClose, mision, onSuccess }) => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [loading, setLoading] = useState(false);

  if (!mision) return null;

  const handleFormSubmit = async (values: MisionEditarRequest, actions: FormikHelpers<MisionEditarRequest>) => {
    try {
      setLoading(true);
      const response = await editarMision(values);

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
        summary: 'Error al modificar la misión',
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
      title="Editar Misión"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={loading} tip="Cargando..." >
        <ToastNotifier ref={toastRef} />

        <Formik
          initialValues={{
            pId: mision.id,
            pNombre: mision.nombre || '',
            pFechaInicio: dayjs(mision.fechaInicio).format('YYYY-MM-DD'),
            pFechaFin: dayjs(mision.fechaFin).format('YYYY-MM-DD'),
            pDescripcion: mision.descripcion || '',
            pMision: mision.mision || '',
            pVision: mision.vision || '',
          }}
          enableReinitialize
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, values, setFieldValue, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label>Nombre</label>
                <Input name="pNombre" value={values.pNombre} onChange={handleChange} required/>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Fecha de Inicio</label>
                <DatePicker
                  name="pFechaInicio"
                  value={dayjs(values.pFechaInicio)}
                  onChange={(date) => setFieldValue('pFechaInicio', date?.format('YYYY-MM-DD'))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Fecha de Fin</label>
                <DatePicker
                  name="pFechaFin"
                  value={dayjs(values.pFechaFin)}
                  onChange={(date) => setFieldValue('pFechaFin', date?.format('YYYY-MM-DD'))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Descripción</label>
                <Input.TextArea rows={3} name="pDescripcion" value={values.pDescripcion} onChange={handleChange} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Misión</label>
                <Input.TextArea rows={3} name="pMision" value={values.pMision} onChange={handleChange} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Visión</label>
                <Input.TextArea rows={3} name="pVision" value={values.pVision} onChange={handleChange} />
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
      </Spin>
    </Modal>
  );
};

export default MisionEditarComponent;
