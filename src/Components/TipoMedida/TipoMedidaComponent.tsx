import { TipoMedidaRequest } from '../../Interfaces/InterfacesResponse/TipoMedida/TipoMedidaRequest';
import { TipoMedidaResponse } from '../../Interfaces/InterfacesResponse/TipoMedida/TipoMedidaResponse';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import React, { useState, useRef, useEffect } from 'react';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { Button, Spin, Input, Table, Space, Row } from 'antd';
import { Formik, Form, FormikHelpers } from 'formik';
import { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import TipoMedidaEditarComponent from './TipoMedidaEditarComponent';

const inventarioApiUrl = import.meta.env.VITE_INVENTARIO_API;

//api
const AgregarTipoMedida = async (request: TipoMedidaRequest): Promise<ObjectResponse<TipoMedidaResponse>> => {

  const response = await fetch(`${inventarioApiUrl}v1/TipoMedida/Agregar`, {
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
  return new ObjectResponse<TipoMedidaResponse>(res.code, res.message, res.Item);
};

const obtenerTipMedida = async (): Promise<ListResponse<TipoMedidaResponse>> => {
  const response = await fetch(`${inventarioApiUrl}v1/TipoMedida/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los tipos de medida');
  }

  const res = await response.json();
  return new ListResponse<TipoMedidaResponse>(res.code, res.message, res.items);
};

const eliminarTipoMedicamento  = async (pId: number): Promise<ObjectResponse<TipoMedidaResponse>> => {
  const response = await fetch(`${inventarioApiUrl}v1/TipoMedida/Eliminar`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pId }), // Enviamos el pId en el cuerpo
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el tipo medida');
  }

  const data = await response.json();
  return new ObjectResponse<TipoMedidaResponse>(data.code, data.message, data.item);
};
//api

const TipoMedidaComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const toastRef = useRef<ToastNotifierRef>(null);
  const [tipoMedida, setTipoMedida] = useState<TipoMedidaResponse[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [tipoMedidaSeleccionado, setTipoMedidaSeleccionado] = useState<TipoMedidaResponse | undefined>(undefined);
  

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
     try {
        setLoading(true);
        const response = await obtenerTipMedida();

        if (response.code === 1) {
          setTipoMedida(response.items);
        }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al obtener el tipo de medida',
        detail: 'Contactese con el adminstrador',
      });

    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnsType<TipoMedidaResponse> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Abreviatura', dataIndex: 'abreviatura', key: 'abreviatura' },
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

  const handleEliminar = async (tipoMedida: TipoMedidaResponse) => {
    try {
      setLoading(true);
      const response = await eliminarTipoMedicamento(tipoMedida.id);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Exito en el proceso de eliminacion',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'error al eliminar el tipo de media',
          detail: response.message,
        });
        
      }
    } catch (error) {
      toastRef.current?.showMessage({
          severity: 'error',
          summary: 'Error al elimnar el tipo de medida',
          detail: 'Contactese con el administrador',
        });
    }    
    finally{
      setLoading(false);
    }
  }

  const handleEditar = async (tipoMedida: TipoMedidaResponse) => {
    setTipoMedidaSeleccionado(tipoMedida);
    setPanelVisible(true);
  }


  const handleSubmit = async (values: TipoMedidaRequest, actions: FormikHelpers<TipoMedidaRequest>) => {
    setLoading(true);
    try {
      const response = await AgregarTipoMedida(values);

      if (response.code === 1) {
        // Mostrar mensaje de éxito
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Tipo medida registrado',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al ingresar el tipo medida',
          detail: response.message,
        });
      }
      actions.resetForm();
    } catch (error: any) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al guardar el registro',
        detail: 'Contactese con el administrador',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <ToastNotifier ref={toastRef} />
      <Spin spinning={loading} tip="Cargando...">
        <h1>Tipo medida</h1>
        <Formik initialValues={new TipoMedidaRequest()} onSubmit={handleSubmit}>
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: 24 }}>
                <Input
                  name="pNombre"
                  value={values.pNombre}
                  onChange={handleChange}
                  placeholder="Tipo Medida"
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Input
                  name="pAbreviatura"
                  value={values.pAbreviatura}
                  onChange={handleChange}
                  placeholder="Abreviatura"
                  required
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isSubmitting}
                style={{ backgroundColor: '#1890ff', color: '#fff' }}
              >
                Guardar Tipo de Medida
              </Button>
            </Form>
          )}
        </Formik>
        <Row justify="center">
          <h1>Registros de los tipos de medida</h1>
        </Row>
        <Table
          columns={columns}
          dataSource={tipoMedida}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }} 
        />

        <TipoMedidaEditarComponent
          visible={panelVisible}
          onClose={() => setPanelVisible(false)}
          tipoMedida={tipoMedidaSeleccionado}
          onSuccess={cargarDatos}
        />
      </Spin>
    </div>
  );
};

export default TipoMedidaComponent;
