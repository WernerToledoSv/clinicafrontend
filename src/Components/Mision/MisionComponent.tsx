import React, { useRef, useState, useEffect} from 'react';
import { Formik, FormikHelpers } from 'formik';
import { Input, Button, Typography, DatePicker, Spin, Space, Tag, Row, Table } from 'antd';
import { MisionRequest } from '../../Interfaces/InterfacesResponse/Mision/MisionRequest'; // Ajusta la ruta
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier'; // Componente para mostrar mensajes de alerta
import dayjs from 'dayjs';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import { MisionResponse } from '../../Interfaces/InterfacesResponse/Mision/MisionResponse';   
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import MisionEditarComponent from './MisionEditarComponent';

const { Title } = Typography;
const { TextArea } = Input;

const userApiUrl = import.meta.env.VITE_USER_API;  // Asegúrate de configurar tu URL en el archivo de entorno

//Funciones apis
//Agregar mision
const crearMision = async (data: MisionRequest): Promise<ObjectResponse<MisionResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Mision/Agregar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear la misión');
  }

  // Supongamos que la respuesta de la API contiene los siguientes campos
  const res = await response.json();

  // Crear una instancia de ObjectResponse con los datos obtenidos
  return new ObjectResponse<MisionResponse>(res.code, res.message, res.item);
};

//Obtener mision
const obtenerMision = async (): Promise<ListResponse<MisionResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Mision/Listado`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las misiones');
    }
    const res = await response.json();
  return new ListResponse<MisionResponse>(res.code, res.message, res.items);
}

//Eliminar mision
const eliminarMision = async (pId: number): Promise<ObjectResponse<MisionResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Mision/Cancelar`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pId }), // Enviamos el pId en el cuerpo
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la mision');
  }

  const data = await response.json();
  return new ObjectResponse<MisionResponse>(data.code, data.message, data.item);
};

//Activar mision
const activarMision = async (pId: number): Promise<ObjectResponse<MisionResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Mision/Activar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pId }), // Enviamos el pId en el cuerpo
  });

  if (!response.ok) {
    throw new Error('Error al activar la mision');
  }

  const data = await response.json();
  return new ObjectResponse<MisionResponse>(data.code, data.message, data.item);
};

//cambiar estado
const cambiarEstadoMision = async (pId: number, pEstado: string): Promise<ObjectResponse<MisionResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Mision/CambiarEstado`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pId, pEstado }), // Enviamos el pId en el cuerpo
  });

  if (!response.ok) {
    throw new Error('Error al cambiar el estdo de la mision');
  }

  const data = await response.json();
  return new ObjectResponse<MisionResponse>(data.code, data.message, data.item);
};

//Funciones apis


const MisionComponent: React.FC = () => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mision, setMision] = useState<MisionResponse[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [misionSeleccionada, setMisionSeleccionada] = useState<MisionResponse | undefined>(undefined);
      

  useEffect(() => {
      cargarDatos();
    }, []);
    
    const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const response = await obtenerMision();

      if (response.code === 1) {
        setMision(response.items);
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'No se obtuvieron las misiones',
          detail: response.message,
        });
      }
      
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al obtener',
        detail: 'Contactese con el adminstrador',
      });

    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnsType<MisionResponse> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Fecha Inicio', dataIndex: 'fechaInicio', key: 'fechaInicio' },
    { title: 'Fecha Fin', dataIndex: 'fechaFin', key: 'fechaFin' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Misión', dataIndex: 'mision', key: 'mision' },
    { title: 'Visión', dataIndex: 'vision', key: 'vision' },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado'},
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => {
        const esActivo = record.estado === 'Proxima' || record.estado === 'En proceso';
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

  //funciones CRUD
  const handleEditar = (mision: MisionResponse) => {
    setMisionSeleccionada(mision);
    setPanelVisible(true);
  };

  const handleEliminar = async(mision: MisionResponse) => {
    try {
      setIsLoading(true);
      const response = await eliminarMision(mision.id);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Misión eliminada',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al eliminar la mision',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al eliminar la misión',
        detail: `Contactese con el adminstrador.`,
      });
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleActivar = async(mision: MisionResponse) => {
    try {
      setIsLoading(true);
      const response = await activarMision(mision.id);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Misión activada',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al activar la mision',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al activar la misión',
        detail: `Contactese con el adminstrador.`,
      });
    }
    finally{
      setIsLoading(false);
    }
  };


  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (
    values: MisionRequest,
    actions: FormikHelpers<MisionRequest>
  ) => {
    try {
      setIsLoading(true);

      const response = await crearMision(values);
      // Mostrar mensaje de éxito
      if(response.code === 1){
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Misión registrada',
          detail: response.message,
        });
        cargarDatos();
        actions.resetForm();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Revise los campos',
          detail: response.message,
        });
      }
       // Limpiar el formulario

    } catch (err) {
      // Mostrar mensaje de error
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al registrar misión',
        detail: `No se pudo completar el proceso.`,
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
        <Title level={3}>Registro de Misión</Title>

        <Formik
          initialValues={new MisionRequest()}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, setFieldValue, values, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <Input
                  name="pNombre"
                  value={values.pNombre}
                  onChange={handleChange}
                  placeholder="Nombre de la misión"
                  size="large"
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  value={values.pFechaInicio ? dayjs(values.pFechaInicio) : null}
                  onChange={(date) => {
                    setFieldValue('pFechaInicio', date?.toISOString() || '');
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  value={values.pFechaFin ? dayjs(values.pFechaFin) : null}
                  onChange={(date) => {
                    setFieldValue('pFechaFin', date?.toISOString() || '');
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <TextArea
                  name="pDescripcion"
                  value={values.pDescripcion}
                  onChange={handleChange}
                  placeholder="Descripción de la misión"
                  rows={4}
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <TextArea
                  name="pMision"
                  value={values.pMision}
                  onChange={handleChange}
                  placeholder="Misión"
                  rows={4}
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <TextArea
                  name="pVision"
                  value={values.pVision}
                  onChange={handleChange}
                  placeholder="Visión"
                  rows={4}
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
                Guardar Misión
              </Button>
            </form>
          )}
        </Formik>

        <Row justify="center">
          <h1>Registros de las misiones</h1>
        </Row>
        <Table
          columns={columns}
          dataSource={mision}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }} 
        />

        <MisionEditarComponent
          visible={panelVisible}
          onClose={() => setPanelVisible(false)}
          mision={misionSeleccionada}
          onSuccess={cargarDatos}
        />
      </Spin>
    </div>
  );
};

export default MisionComponent;
