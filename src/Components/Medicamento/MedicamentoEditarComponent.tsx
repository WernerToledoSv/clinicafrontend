import React, { useRef, useState, useEffect } from 'react';
import { Modal, Input, Button, Spin, Select, InputNumber } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import { MedicamentoRequest } from '../../Interfaces/InterfacesResponse/Medicamento/MedicamentoRequest';
import { MedicamentoResponse } from '../../Interfaces/InterfacesResponse/Medicamento/MedicamentoResponse';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import { TipoMedidaResponse } from '../../Interfaces/InterfacesResponse/TipoMedida/TipoMedidaResponse';
import { TipoMedicamentoResponse } from '../../Interfaces/InterfacesResponse/TipoMedicamento/TipoMedicamentoResponse';

const InventarioUrl = import.meta.env.VITE_INVENTARIO_API;

interface Props {
  visible: boolean;
  onClose: () => void;
  medicamento?: MedicamentoResponse;
  onSuccess?: () => void;
}

const editarMedicamento = async (
  medicamento: MedicamentoRequest
): Promise<ObjectResponse<MedicamentoResponse>> => {
  const response = await fetch(`${InventarioUrl}v1/Medicamento/Actualizar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicamento),
  });

  if (!response.ok) throw new Error('Error al actualizar medicamento');
  const data = await response.json();
  return new ObjectResponse<MedicamentoResponse>(data.code, data.message, data.item);
};

const obtenerTipoMedida = async (): Promise<ListResponse<TipoMedidaResponse>> => {
  const response = await fetch(`${InventarioUrl}v1/TipoMedida/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Error al obtener los tipos de medida');
  const res = await response.json();
  return new ListResponse<TipoMedidaResponse>(res.code, res.message, res.items);
};

const obtenerTipoMedicamento = async (): Promise<ListResponse<TipoMedicamentoResponse>> => {
  const response = await fetch(`${InventarioUrl}v1/TipoMedicamento/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Error al obtener los tipos de medicamento');
  const res = await response.json();
  return new ListResponse<TipoMedicamentoResponse>(res.code, res.message, res.items);
};

const MedicamentoEditarComponent: React.FC<Props> = ({
  visible,
  onClose,
  medicamento,
  onSuccess
}) => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [loadingTiposMedicamento, setLoadingTiposMedicamento] = useState(false);
  const [loadingTiposMedida, setLoadingTiposMedida] = useState(false);
  const [opcionesTipoMedicamento, setOpcionesTipoMedicamento] = useState<{ value: number; label: string }[]>([]);
  const [opcionesTipoMedida, setOpcionesTipoMedida] = useState<{ value: number; label: string }[]>([]);
    
  useEffect(() => {
    if (visible) {
      cargarTipoMedicamento();
      cargarTipoMedida();
    }
  }, [visible]);

  if (!medicamento) return null;

  const cargarTipoMedicamento = async () => {
    setLoadingTiposMedicamento(true);
    try {
      const responseTipoMedicamento = await obtenerTipoMedicamento();
      const items = Array.isArray(responseTipoMedicamento.items) ? responseTipoMedicamento.items : [responseTipoMedicamento.items];
      const opciones = items.map(t => ({ value: t.id, label: t.nombre }));
      setOpcionesTipoMedicamento(opciones);
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al cargar tipos de medicamento',
        detail: 'Contacte con el administrador.'
      });
    } finally {
      setLoadingTiposMedicamento(false);
    }
  };

  const cargarTipoMedida = async () => {
    setLoadingTiposMedida(true);
    try {
      const responseTipoMedida = await obtenerTipoMedida();
      const items = Array.isArray(responseTipoMedida.items) ? responseTipoMedida.items : [responseTipoMedida.items];
      const opciones = items.map(t => ({ value: t.id, label: t.nombre }));
      setOpcionesTipoMedida(opciones);
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al cargar tipos de medida',
        detail: 'Contacte con el administrador.'
      });
    } finally {
      setLoadingTiposMedida(false);
    }
  };

  const handleFormSubmit = async (
    values: MedicamentoRequest,
    actions: FormikHelpers<MedicamentoRequest>
  ) => {
    try {
      actions.setSubmitting(true);
      const response = await editarMedicamento(values);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Medicamento actualizado',
          detail: response.message,
        });
        onSuccess?.();
        onClose();
      } else {
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'No se actualizó',
          detail: response.message,
        });
      }
    } catch {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Contacte con el administrador',
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Editar Medicamento"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <ToastNotifier ref={toastRef} />
      <Spin spinning={loadingTiposMedicamento || loadingTiposMedida} tip="Cargando...">
        <Formik
          initialValues={new MedicamentoRequest(
            medicamento.id,
            medicamento.idTipoMedida,
            medicamento.idTipoMedicamento,
            medicamento.nombre || '',
            medicamento.descripcion || '',
            medicamento.laboratorio || '',
            medicamento.cantidad || 0,
            medicamento.valor || 0
          )}
          enableReinitialize
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleSubmit, values, setFieldValue, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label>Nombre</label>
                <Input
                  name="pNombre"
                  value={values.pNombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Descripción</label>
                <Input
                  name="pDescripcion"
                  value={values.pDescripcion}
                  onChange={handleChange}
                  placeholder="Descripción"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Laboratorio</label>
                <Input
                  name="pLaboratorio"
                  value={values.pLaboratorio}
                  onChange={handleChange}
                  placeholder="Laboratorio"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Cantidad</label>
                <InputNumber
                  name="pCantidad"
                  value={values.pCantidad}
                  onChange={(v) => setFieldValue('pCantidad', v)}
                  style={{ width: '100%' }}
                  placeholder="Cantidad"
                  min={0}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Valor</label>
                <InputNumber
                  name="pValor"
                  value={values.pValor}
                  onChange={(v) => setFieldValue('pValor', v)}
                  style={{ width: '100%' }}
                  placeholder="Valor"
                  min={0}
                  formatter={(value) => `${value}`}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Tipo de Medicamento</label>
                <Select
                  value={values.pIdTipoMedicamento}
                  onChange={(v) => setFieldValue('pIdTipoMedicamento', v)}
                  style={{ width: '100%' }}
                  options={opcionesTipoMedicamento}
                  placeholder="Seleccione tipo de medicamento"
                  loading={loadingTiposMedicamento}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Tipo de Medida</label>
                <Select
                  value={values.pIdTipoMedida}
                  onChange={(v) => setFieldValue('pIdTipoMedida', v)}
                  style={{ width: '100%' }}
                  options={opcionesTipoMedida}
                  placeholder="Seleccione tipo de medida"
                  loading={loadingTiposMedida}
                />
              </div>

              <div style={{ textAlign: 'center', paddingTop: 16 }}>
                <Button
                  onClick={onClose}
                  danger
                  style={{ marginRight: 12 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Guardar
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Spin>
    </Modal>
  );
};

export default MedicamentoEditarComponent;
