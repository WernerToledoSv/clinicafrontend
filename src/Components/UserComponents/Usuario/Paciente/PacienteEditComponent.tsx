import React, { useRef, useState } from 'react';
import { Modal, Input, Button, Spin, Select } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import ToastNotifier, {ToastNotifierRef } from '../../../Alertas/ToastNotifier'; 
import { PacienteRq } from '../../../../Interfaces/InterfacesResponse/Paciente/PacienteInterfase';
import { EditarPaciente } from '../../../../Services/Paciente/PacienteService';

const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  paciente?: PacienteRq;
  onSuccess?: () => void;
}



const PacienteEditarComponent: React.FC<Props> = ({ visible, onClose, paciente, onSuccess }) => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [loading, setLoading] = useState(false);

  if (!paciente) return null;

  const handleFormSubmit = async (values: PacienteRq, actions: FormikHelpers<PacienteRq>) => {
    try {
      setLoading(true);
      const response = await EditarPaciente(values);

      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Paciente actualizado',
          detail: response.message,
        });
        onSuccess?.();
        onClose();
      } else {
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'No se pudo actualizar el paciente',
          detail: response.message,
        });
      }
    } catch {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al modificar el paciente',
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
      title="Editar Paciente"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={loading} tip="Cargando..." />
      <ToastNotifier ref={toastRef} />

      <Formik initialValues={paciente} enableReinitialize onSubmit={handleFormSubmit}>
        {({ values, handleChange, handleSubmit, setFieldValue, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label>Nombres</label>
              <Input name="nombres" value={values.nombres} onChange={handleChange} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Apellidos</label>
              <Input name="apellidos" value={values.apellidos} onChange={handleChange} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Edad</label>
              <Input name="edad" type="number" value={values.edad ?? 0} onChange={handleChange} min={0} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Sexo</label>
              <Select
                value={values.sexo}
                onChange={(value) => setFieldValue('sexo', value)}
                style={{ width: '100%' }}
              >
                <Option value="m">Masculino</Option>
                <Option value="f">Femenino</Option>
              </Select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Celular</label>
              <Input name="cel" value={values.cel} onChange={handleChange} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Dirección</label>
              <Input name="direccion" value={values.direccion} onChange={handleChange} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Tipo Consulta</label>
              <Select
                value={values.tipoconsulta}
                onChange={(value) => setFieldValue('tipoconsulta', value)}
                style={{ width: '100%' }}
              >
                <Option value="general">General</Option>
                <Option value="lentes">Lentes</Option>
                <Option value="ambas">Ambas</Option>
              </Select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Tipo Paciente</label>
              <Select
                value={values.tipopaciente}
                onChange={(value) => setFieldValue('tipopaciente', value)}
                style={{ width: '100%' }}
              >
                <Option value="h">Hermano</Option>
                <Option value="a">Amigo</Option>
              </Select>
            </div>

            <div style={{ textAlign: 'center', paddingTop: 16 }}>
              <Button onClick={onClose} style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white', marginRight: 12 }}>
                Cancelar
              </Button>

              <Button htmlType="submit" loading={isSubmitting} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' }}>
                Guardar Cambios
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default PacienteEditarComponent;
