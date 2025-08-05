import React, { useRef, useState } from 'react';
import { Modal, Input, Button, Spin, InputNumber, Select } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import { InventarioResponse } from '../../Interfaces/InterfacesResponse/Inventario/InventarioResponse';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { ActualizarInventario } from '../../Services/Inventario/InventarioService';

const { TextArea } = Input;

interface Props {
  visible: boolean;
  onClose: () => void;
  inventario?: InventarioResponse;
  onSuccess?: () => void;
}


const InventarioEditarComponent: React.FC<Props> = ({ visible, onClose, inventario, onSuccess }) => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [loading, setLoading] = useState(false);

  if (!inventario) return null;

  const handleFormSubmit = async (values: InventarioResponse, actions: FormikHelpers<InventarioResponse>) => {
    try {
      setLoading(true);
      const response = await ActualizarInventario(values);

      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Inventario actualizado',
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
        summary: 'Error al modificar el inventario',
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
      title="Editar Inventario"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={loading} tip="Cargando..." />
      <ToastNotifier ref={toastRef} />

      <Formik
        initialValues={{
          ...inventario
        }}
        enableReinitialize
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleSubmit, setFieldValue, values, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label>Medicamento</label>
              <Input name="medicamento" value={values.medicamento} onChange={handleChange} disabled />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Usuario</label>
              <Input name="username" value={values.username} onChange={handleChange} disabled />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Lugar</label>
              <Input name="username" value={values.nombreLugar} onChange={handleChange} disabled />
            </div>
        
            <div style={{ marginBottom: 16 }}>
              <label>Descripción</label>
              <TextArea name="descripcion" value={values.descripcion = 'Edicion de medicamento'} onChange={handleChange} rows={2} disabled/>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Precio</label>
              <InputNumber
                name="precio"
                value={values.precio}
                onChange={(value) => setFieldValue('precio', value)}
                min={0}
                precision={2}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Cantidad Total</label>
              <InputNumber
                name="cantidadTotal"
                value={values.cantidadTotal}
                onChange={(value) => setFieldValue('cantidadTotal', value)}
                min={0}
                style={{ width: '100%' }}
                required
              />
            </div>

                <div style={{ marginBottom: 16 }}>
                <label>Acción</label>
                <Select
                    value={values.accion}
                    onChange={(value) => setFieldValue('acccion', value)}
                    style={{ width: '100%' }}
                    disabled
                >
                    <Select.Option value="in">Ingreso</Select.Option>
                    <Select.Option value="out">Salida</Select.Option>
                    <Select.Option value="asig">Asignación</Select.Option>
                </Select>
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

export default InventarioEditarComponent;
