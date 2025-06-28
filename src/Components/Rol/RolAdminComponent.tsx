import React, { useRef, useState, useEffect } from 'react';
import { Table, Button, Input, Typography, Spin, Row, Tag, Space } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import { RolRequest } from '../../Interfaces/InterfacesResponse/Rol/RolRequest'; // Ajusta la ruta de la interfaz RolRequest
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse'; // Asegúrate de tener este tipo
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';// Asegúrate de tener este componente
import { RolResponse } from '../../Interfaces/InterfacesResponse/Rol/RolResponse';
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import RolEditarComponent from './RolEditarComponent';

const { Title } = Typography;
const userApiUrl = import.meta.env.VITE_USER_API;

//Funciones del servicio

//Funcion para obtener roles
const obtenerRol = async (): Promise<ListResponse<RolResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Rol/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los roles');
  }

  const res = await response.json();
  return new ListResponse<RolResponse>(res.code, res.message, res.items);
};


// Función para crear un rol
const crearRol = async (rol: RolRequest): Promise<ObjectResponse<RolResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Rol/Agregar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rol),
  });

  if (!response.ok) {
    throw new Error('Error en la creación del rol');
  }

  const data = await response.json();
  return new ObjectResponse<RolResponse>(data.code, data.message, data.item);
};

//Funcion de eliminar rol
const eliminarRol = async (pId: number): Promise<ObjectResponse<RolResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Rol/Eliminar`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pId }), // Enviamos el pId en el cuerpo
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el rol');
  }

  const data = await response.json();
  return new ObjectResponse<RolResponse>(data.code, data.message, data.item);
};


//Funcion de activar rol
const activarRol = async (pId: number): Promise<ObjectResponse<RolResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Rol/Activar`, {
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
  return new ObjectResponse<RolResponse>(data.code, data.message, data.item);
};

//Funciones del servicio


const RolAdminComponent: React.FC = () => {
  const [roles, setRoles] = useState<RolResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef<ToastNotifierRef>(null);
  const [isLoading, setIsLoading] = useState(false);  
  const [panelVisible, setPanelVisible] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<RolResponse | undefined>(undefined);

  
  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    setLoading(true);
    try {
      const res = await obtenerRol();
      setRoles(res.items);
      if (res.code === 0){
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'No hay datos en la base de datos',
          detail: res.message, // Mostrar el mensaje de éxito
        });        
      }
    } catch (error: any) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al obtener los registros',
        detail: 'Contactese con el administrador',
      });
    } finally {
      setLoading(false);
    }
  };

// 👉 Columnas
const columns: ColumnsType<RolResponse> = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
  { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
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
            >
            </Button>
    
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
            >
            </Button>
          </Space>
        );
      },
    }
  ];// Manejar el envío del formulario

  // 👉 Acciones
  const handleEditar = (rol: RolResponse) => {
    setRolSeleccionado(rol);
    setPanelVisible(true);
  };

  const handleEliminar = async (rol: RolResponse) => {
    try {
      setIsLoading(true);
      const response = await eliminarRol(rol.id);

      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Resgistro eliminado',
          detail: response.message, // Mostrar el mensaje de éxito
        });
        await cargarRoles();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'El rol no se pudo eliminar',
          detail: response.message, // Mostrar el mensaje de éxito
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al eliminar el registro',
        detail: 'Contactese con el administrador',
      });
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleActivar = async (rol: RolResponse) => {
    try {
      setIsLoading(true);
      const response = await activarRol(rol.id);

      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Se activó el usuario',
          detail: response.message, // Mostrar el mensaje de éxito
        });
        await cargarRoles();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'El rol no se pudo activar',
          detail: response.message, // Mostrar el mensaje de éxito
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al activar el registro',
        detail: 'Contactese con el administrador',
      });
    }
    finally{
      setIsLoading(false);
    }
  };


  const handleSubmit = async (
    values: RolRequest,
    actions: FormikHelpers<RolRequest>
  ) => {
    try {
      setIsLoading(true); // Iniciar la carga

      // Ejecutar la llamada para crear el rol
      const response: ObjectResponse<RolResponse> = await crearRol(values);

      // Mostrar mensaje de éxito en el toast
      if(response.code === 1){
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Rol creado',
          detail: response.message, // Mostrar el mensaje de éxito
        });

        await cargarRoles();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'El rol no se pudo crear',
          detail: response.message, // Mostrar el mensaje de éxito
        });
      }
      // Limpiar los campos del formulario
      actions.resetForm();
    } catch (err) {
      // En caso de error, mostrar mensaje de error
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al crear rol',
        detail: 'Contactese con el administrador.',
      });
      // Limpiar los campos del formulario
      actions.resetForm();
    } finally {
      setIsLoading(false); // Terminar la carga
      actions.setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Spin spinning={loading} tip="Cargando...">
          <ToastNotifier ref={toastRef} />
          <Title level={3}>Crear Rol</Title>
          
          {/* Indicador de carga */}
          {isLoading && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Spin size="large" />
            </div>
          )}

          <Formik
            initialValues={{ pNombre: '', pDescripcion: '' }}
            onSubmit={handleSubmit}
          >
            {({ handleChange, values, isSubmitting, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 24 }}>
                  <Input
                    id="pNombre"
                    name="pNombre"
                    value={values.pNombre}
                    onChange={handleChange}
                    placeholder="Nombre del rol"
                    size="large"
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Input
                    id="pDescripcion"
                    name="pDescripcion"
                    value={values.pDescripcion}
                    onChange={handleChange}
                    placeholder="Descripción del rol"
                    size="large"
                  />
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoading || isSubmitting} // Deshabilitar el botón si está cargando
                >
                  Guardar Rol
                </Button>
              </form>
            )}
          </Formik>

          <Row justify="center">
            <h1>Registro de Roles</h1>
          </Row>
          
          <Table
            columns={columns}
            dataSource={roles}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }} 
          />

          <RolEditarComponent
            visible={panelVisible}
            onClose={() => setPanelVisible(false)}
            rol={rolSeleccionado}
            onSuccess={cargarRoles}
          />
      </Spin>
    </div>
  );
};

export default RolAdminComponent;
