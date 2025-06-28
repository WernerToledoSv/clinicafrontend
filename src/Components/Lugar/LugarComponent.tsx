import React, { useRef, useState, useEffect} from 'react';
import { Formik, FormikHelpers } from 'formik';
import { Input, Button, Typography, DatePicker, TimePicker, Row, Spin, Tag, Space, Table } from 'antd';
import dayjs from 'dayjs';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';// Asegúrate de tener este componente
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse'; // Ajusta según tu modelo
import { LugarRequest } from '../../Interfaces/InterfacesResponse/Lugar/LugarRequest';
import { LugarResponse } from '../../Interfaces/InterfacesResponse/Lugar/LugarResponse';
import 'dayjs/locale/es';
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import LugarEditarComponent from './LugarEditarComponent';



const userApiUrl = import.meta.env.VITE_USER_API;

const { Title } = Typography;

// Funciones de la api

//funcion para agrear
const crearLugar = async (data: LugarRequest): Promise<ObjectResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Lugar/Agregar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error en la creación del lugar');

  const res = await response.json();
  return new ObjectResponse<LugarResponse>(res.code, res.message, res.item);
};

//Funcion para obtener los lugares
const obtenerLugares = async (): Promise<ListResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Lugar/Listado`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los lugares');
    }

    const res = await response.json();
  return new ListResponse<LugarResponse>(res.code, res.message, res.items);
}

//funcion para eliminar 
const eliminarLugar = async (pId: number): Promise<ObjectResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Lugar/Eliminar`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pId }), // Enviamos el pId en el cuerpo
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el lugar');
  }

  const data = await response.json();
  return new ObjectResponse<LugarResponse>(data.code, data.message, data.item);
};

//funcion para activar
const activarLugar = async (pId: number): Promise<ObjectResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Lugar/Activar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pId }), // Enviamos el pId en el cuerpo
  });

  if (!response.ok) {
    throw new Error('Error al activar el rol');
  }

  const data = await response.json();
  return new ObjectResponse<LugarResponse>(data.code, data.message, data.item);
};
// Funciones de la api

//inicion del return de react
const LugarComponent: React.FC = () => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lugar, setLugares] = useState<LugarResponse[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [lugarSeleccionado, setLugarSeleccionado] = useState<LugarResponse | undefined>(undefined);
  

  useEffect(() => {
    cargarDatos();
  }, []);
  
  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const response = await obtenerLugares();

      if (response.code === 1) {
        setLugares(response.items);
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'No se obtuvieron lugares',
          detail: response.message,
        });
      }
      
    } catch (error) {
      

    } finally {
      setIsLoading(false);
    }
  };

  //Columnas de la tabla
  const columns: ColumnsType<LugarResponse> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Hora Inicio', dataIndex: 'horaInicio', key: 'horaInicio' },
    { title: 'Hora Fin', dataIndex: 'horaFin', key: 'horaFin' },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado: string) => {
        const esActivo = estado === 'A';
        return (
          <Tag color={esActivo ? 'green' : 'red'}>
            {esActivo ? 'ACTIVO' : 'INACTIVO'}
          </Tag>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => {
        const esActivo = record.estado === 'A';
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditar(record)}
            />
            <Button
              type="primary"
              danger={esActivo}
              icon={esActivo ? <DeleteOutlined /> : <ReloadOutlined />}
              onClick={() =>
                esActivo ? handleEliminar(record) : handleActivar(record)
              }
              style={
                esActivo
                  ? {}
                  : { backgroundColor: 'green', borderColor: 'green', color: '#fff' }
              }
            />
          </Space>
        );
      },
    },
  ];

const handleEditar = (lugar: LugarResponse) => {
  setLugarSeleccionado(lugar); // Guardas el lugar que se va a editar
  setPanelVisible(true);       // Muestras el modal
};

  const handleEliminar = async (lugar: LugarResponse) => {
    try {
      setIsLoading(true);
      const response = await eliminarLugar(lugar.id);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Lugar eliminado',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al eliminar lugar',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al eliminar lugar',
        detail: 'Contactese con el administrador',
      });
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleActivar = async (lugar: LugarResponse) => {
    try {
      setIsLoading(true);
      const response = await activarLugar(lugar.id);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Lugar activado',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al activar lugar',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al activar lugar',
        detail: 'Contactese con el administrador',
      });
    }
    finally{
      setIsLoading(false);
    }
  };


  const handleSubmit = async (
    values: LugarRequest,
    actions: FormikHelpers<LugarRequest>
  ) => {
    try {
      setIsLoading(true);

      const response = await crearLugar(values);

      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Lugar registrado',
          detail: response.message,
        });
        cargarDatos();        
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al registrar el lugar',
          detail: response.message,
        });
      }
      actions.resetForm({
        values: new LugarRequest(),  // Limpiar los valores del formulario
      });
    } catch (err) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al registrar lugar',
        detail: `Contactese con el administrador. ${err}`,
      });
    } finally {
      setIsLoading(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Spin spinning={isLoading} tip="Cargando...">
          <ToastNotifier ref={toastRef} />
          <Title level={3}>Registro de Lugar</Title>
          <Formik
            initialValues={new LugarRequest()}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleSubmit, setFieldValue, values, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 24 }}>
                  <Input
                    name="pNombre"
                    value={values.pNombre}
                    onChange={handleChange}
                    placeholder="Nombre del lugar"
                    size="large"
                    required
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    value={dayjs(values.pFecha)}
                    onChange={(date) => {
                      setFieldValue('pFecha', date?.toISOString() || '');
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <TimePicker
                    style={{ width: '100%' }}
                    size="large"
                    format="HH:mm"
                    placeholder="Hora de inicio"
                    onChange={(time) => {
                      setFieldValue('pHoraInicio', time?.format('HH:mm') || '');
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <TimePicker
                    style={{ width: '100%' }}
                    size="large"
                    format="HH:mm"
                    placeholder="Hora de fin"
                    onChange={(time) => {
                      setFieldValue('pHoraFin', time?.format('HH:mm') || '');
                    }}
                    required
                  />
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoading || isSubmitting}
                >
                  Guardar Lugar
                </Button>
              </form>
            )}
          </Formik>


          <Row justify="center">
            <h1>Registros de los lugares</h1>
          </Row>
          <Table
            columns={columns}
            dataSource={lugar}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }} 
          />

          <LugarEditarComponent
            visible={panelVisible}
            onClose={() => setPanelVisible(false)}
            lugar={lugarSeleccionado}
            onSuccess={cargarDatos}
          />
      </Spin>
    </div>
  );
};

export default LugarComponent;