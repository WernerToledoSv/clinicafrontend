import React, { useState, useRef, useEffect } from 'react';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { Input, Button, Spin, Space, Table, Row } from 'antd';
import { TipoMedicamentoRequest } from '../../Interfaces/InterfacesResponse/TipoMedicamento/TipoMedicamentoRequest';
import { TipoMedicamentoResponse } from '../../Interfaces/InterfacesResponse/TipoMedicamento/TipoMedicamentoResponse';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import { Formik, Form, FormikHelpers } from 'formik';
import { TipoMedidaRequest } from '../../Interfaces/InterfacesResponse/TipoMedida/TipoMedidaRequest';
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TipoMedicamentoEditarComponent from './TipoMedicamentoEditarComponent';


const inventarioApiUrl = import.meta.env.VITE_INVENTARIO_API;


//api
const AgregarTipoMedicamento = async (request: TipoMedicamentoRequest): Promise<ObjectResponse<TipoMedicamentoResponse>> => {

  const response = await fetch(`${inventarioApiUrl}v1/TipoMedicamento/Agregar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Error al agregar el tipo de medida');
  }

  const res = await response.json();
  return new ObjectResponse<TipoMedicamentoResponse>(res.code, res.message, res.Item);
};

const obtenerTipMedicamento = async (): Promise<ListResponse<TipoMedicamentoResponse>> => {
  const response = await fetch(`${inventarioApiUrl}v1/TipoMedicamento/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los usuarios');
  }

  const res = await response.json();
  return new ListResponse<TipoMedicamentoResponse>(res.code, res.message, res.items);
};

const eliminarTipoMedicamento  = async (pId: number): Promise<ObjectResponse<TipoMedicamentoResponse>> => {
  const response = await fetch(`${inventarioApiUrl}v1/TipoMedicamento/Eliminar`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pId }), // Enviamos el pId en el cuerpo
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el usuario');
  }

  const data = await response.json();
  return new ObjectResponse<TipoMedicamentoResponse>(data.code, data.message, data.item);
};
//api


const TipoMedicamentoComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const toastRef = useRef<ToastNotifierRef>(null);
  const [tipoMedicamento, setTipoMedicamento] = useState<TipoMedicamentoResponse[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [tipoMedicamentoSeleccionado, setTipoMedicamentoRolSeleccionado] = useState<TipoMedicamentoResponse | undefined>(undefined);


    useEffect(() => {
      cargarDatos();
    }, []);

    const cargarDatos = async () => {
      try {
        setLoading(true);
        const response = await obtenerTipMedicamento();

        if (response.code === 1) {
          setTipoMedicamento(response.items);
        }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al obtener el tipo de medicamento',
        detail: 'Contactese con el adminstrador',
      });

    } finally {
      setLoading(false);
    }
  };
    
  const columns: ColumnsType<TipoMedicamentoResponse> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditar(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleEliminar(record)}
          />
        </Space>
      ),
    },
  ];

  const handleEliminar = async (tipoMedicamento: TipoMedicamentoResponse) => {
    try {
      setLoading(true);
      const response = await eliminarTipoMedicamento(tipoMedicamento.id);

      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Tipo medicamento eliminado',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al eliminar el tipo de medicamento',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al eliminar el tipo de medicamento',
        detail: 'Contactese con el administrador',
      });
    }
    finally{
      setLoading(false);
    }
  }

  const handleEditar = async (tipoMedicamento: TipoMedicamentoResponse) => {
    setTipoMedicamentoRolSeleccionado(tipoMedicamento);
    setPanelVisible(true);
  }

  const handleSubmit = async (values: TipoMedidaRequest, actions: FormikHelpers<TipoMedicamentoRequest>) => {
    setLoading(true);
    try {
      const response = await AgregarTipoMedicamento(values);

      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Tipo medicamento registrado',
          detail: response.message,
        });
        cargarDatos();
        actions.resetForm();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al ingresar el tipo medicamento',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al guardar el registro',
        detail: 'Contactese con el administrador',
      });
      actions.resetForm();
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <ToastNotifier ref={toastRef} />
      <Spin spinning={loading} tip="Cargando...">
        <h1>Tipo medicamento</h1>
        <Formik
          initialValues={ new TipoMedicamentoRequest() }
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <Input
                name="pNombre"
                value={values.pNombre}
                onChange={handleChange}
                placeholder="Nombre"
                style={{ marginBottom: 16 }}
              />

              <Input
                name="pDescripcion"
                value={values.pDescripcion}
                onChange={handleChange}
                placeholder="Descripción"
                style={{ marginBottom: 16 }}
              />

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isSubmitting}
                style={{ backgroundColor: '#1890ff', color: '#fff' }}
              >
                Guardar Tipo de medicamento
              </Button>
            </Form>
          )}
        </Formik>
        <Row justify="center">
          <h1>Registros de los tipos de medicamento</h1>
        </Row>
        <Table
          columns={columns}
          dataSource={tipoMedicamento}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }} 
        />
        <TipoMedicamentoEditarComponent
          visible={panelVisible}
          onClose={() => setPanelVisible(false)}
          tipoMedicamento={tipoMedicamentoSeleccionado}
          onSuccess={cargarDatos}
        />
      </Spin>
    </div>
  );
};

export default TipoMedicamentoComponent;
