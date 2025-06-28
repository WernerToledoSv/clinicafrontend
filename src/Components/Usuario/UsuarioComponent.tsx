import React, { useEffect, useState, useRef } from 'react';
import { Formik, FormikHelpers, Form } from 'formik';
import { Input, Button, Select, Typography, Spin, Radio, Space, Table, Row, Tag } from 'antd';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier'; // Componente para mostrar mensajes de alerta
import { UsuarioRequest } from '../../Interfaces/InterfacesResponse/Usuario/UsuarioRequest';  // Importar UsuarioRequest
import { RolResponse } from '../../Interfaces/InterfacesResponse/Rol/RolResponse';
import { LugarResponse } from '../../Interfaces/InterfacesResponse/Lugar/LugarResponse';
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import { UsuarioResponse } from '../../Interfaces/InterfacesResponse/Usuario/UsuarioResponse';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import UsuarioEditarComponent from './UsuarioEditarComponent';

const { Title } = Typography;
const userApiUrl = import.meta.env.VITE_USER_API;

const UsuarioComponent: React.FC = () => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [loading, setLoading] = useState(false);
  const [opcionesRol, setOpcionesRol] = useState<{ value: number; label: string }[]>([]);
  const [opcionesLugar, setOpcionesLugar] = useState<{ value: number; label: string }[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [usuarioSeleccionado, setusuarioSeleccionado] = useState<UsuarioResponse | undefined>(undefined);
         

  useEffect(() => {
    cargarRoles();
    cargarLugares();
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await obtenerUsuarios();

      if (response.code === 1) {
        setUsuarios(response.items);
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'No se obtuvieron los usuarios',
          detail: response.message,
        });
      }
      
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al obtener los usuarios',
        detail: 'Contactese con el adminstrador',
      });

    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    setLoading(true);
    try {
      const responseRoles = await obtenerRol(); // Asegúrate que esta función retorna ListResponse<RolResponse>
      const roles = Array.isArray(responseRoles.items) ? responseRoles.items : [responseRoles.items];

      const opcionesRol = roles.map((rol) => ({
        value: rol.id,
        label: rol.nombre,
      }));

      setOpcionesRol(opcionesRol);
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al cargar los roles',
        detail: `No se pudieron cargar los roles. Contacte con el administrador. ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarLugares = async () => {
    setLoading(true);
    try {
      const responseLugares = await obtenerLugar(); // Asegúrate que esta función retorna ListResponse<LugarResponse>
      const lugares = Array.isArray(responseLugares.items) ? responseLugares.items : [responseLugares.items];

      const opcionesLugar = lugares.map((lugar) => ({
        value: lugar.id,
        label: lugar.nombre,
      }));

      setOpcionesLugar(opcionesLugar);
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al cargar los lugares',
        detail: `No se pudieron cargar los lugares. Contacte con el administrador.`,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEditar = (usuario: UsuarioResponse) => {
    setusuarioSeleccionado(usuario);
    setPanelVisible(true);
  };

  const handleEliminar = async (usuario: UsuarioResponse) => {
    try {
      setLoading(true);
      const response = await eliminarUsuario(usuario.id);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Usuario eliminado',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'El usuario no se pudó eliminar',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
          severity: 'error',
          summary: 'Error al desactivar el usuario',
          detail: 'Contactese con el administrador',
        });
    }
    finally{
      setLoading(false);
    }
  };

  const handleActivar = async (usuario: UsuarioResponse) => {
    try {
      setLoading(true);
      const response = await activarUsuario(usuario.id);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Usuario activado',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'El usuario no se pudó activar',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
          severity: 'error',
          summary: 'Error al activar el usuario',
          detail: 'Contactese con el administrador',
        });
    }
    finally{
      setLoading(false);
    }
  };

  const handleSubmit = async (values: UsuarioRequest, actions: FormikHelpers<UsuarioRequest>) => {
    try {
      setLoading(true);
      // Llamar a la función que agrega el usuario
      const response = await agregarUsuario(values);

      if(response.code === 1){
        // Mostrar mensaje de éxito
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Usuario registrado',
          detail: response.message,
        });        
        cargarDatos();
        actions.resetForm();
      }
      else{
        // Mostrar mensaje de éxito
        toastRef.current?.showMessage({
        severity: 'info',
        summary: 'Error al ingresar el usuario',
        detail: response.message,
      });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al registrar el usuario',
        detail: `No se pudo completar el proceso.`,
      });
    }
    finally{
      setLoading(false);
    }
  };

  const columns: ColumnsType<UsuarioResponse> = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Nombre', dataIndex: 'nombres', key: 'nombres' }, // Nombre
      { title: 'Apellido', dataIndex: 'apellidos', key: 'apellidos' }, // Apellido
      { title: 'Sexo', dataIndex: 'sexo', key: 'sexo' }, // Sexo
      { title: 'Celular', dataIndex: 'cel', key: 'cel' }, // Celular
      { title: 'Email', dataIndex: 'email', key: 'email' }, // Email
      { title: 'Fecha de Ingreso', dataIndex: 'fechaIngreso', key: 'fechaIngreso' }, // Fecha de Ingreso
      { title: 'Rol', dataIndex: 'rol', key: 'idRol' }, // ID Rol
      { title: 'Lugar', dataIndex: 'lugar', key: 'idLugar' }, // ID Lugar
      { title: 'Username', dataIndex: 'username', key: 'username' }, // Username
      { title: 'Contraseña', dataIndex: 'password', key: 'password' }, // Contraseña
      {
        title: 'Estado',
        dataIndex: 'estado',
        key: 'estado',
        render: (estado) => (
          <Tag color={estado === 'disponible' ? 'green' : 'red'}>
            {estado === 'disponible' ? 'ACTIVO' : 'INACTIVO'}
          </Tag>
        ),
      }, 
      {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => {
        const esDisponible = record.estado === 'disponible';
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditar(record)}
            />
            <Button
              type="primary"
              danger={esDisponible}
              icon={esDisponible ? <DeleteOutlined /> : <ReloadOutlined />}
              onClick={() =>
                esDisponible ? handleEliminar(record) : handleActivar(record)
              }
              style={
                esDisponible
                  ? {}
                  : { backgroundColor: 'green', borderColor: 'green', color: '#fff' }
              }
            />
          </Space>
        );
      },
    },
  ];


  return (
    <div style={{ padding: 24 }}>
      <ToastNotifier ref={toastRef} />
      <Title level={3}>Registro de Usuario</Title>
      <Spin spinning={loading} tip="Cargando...">
        <Formik
          initialValues={new UsuarioRequest( '', '', '', '', '', '', '')} // Inicializa con un objeto vacío de UsuarioRequest
          onSubmit={handleSubmit}
          
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <Select
                  value={values.pIdRol} // valor numérico, no string
                  onChange={(value) => setFieldValue('pIdRol', value)}
                  style={{ width: '100%' }}
                  placeholder="Selecciona un Rol"
                  options={opcionesRol} // [{ value: 1, label: 'Administrador' }, ...]
                  optionFilterProp="label"
                  showSearch
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Select
                  value={values.pIdLugar}
                  onChange={(value) => setFieldValue('pIdLugar', value)}
                  style={{ width: '100%' }}
                  placeholder="Selecciona un Lugar"
                  options={opcionesLugar}
                  optionFilterProp="label"
                  showSearch
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Input
                  name="pUsername"
                  value={values.pUsername}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Input
                  name="pPassword"
                  value={values.pPassword}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  type="password"
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Input
                  name="pNombres"
                  value={values.pNombres}
                  onChange={handleChange}
                  placeholder="Nombres"
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Input
                  name="pApellidos"
                  value={values.pApellidos}
                  onChange={handleChange}
                  placeholder="Apellidos"
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Radio.Group
                  name="pSexo"
                  value={values.pSexo}
                  onChange={handleChange}
                >
                  <Radio value="m">Masculino</Radio>
                  <Radio value="f">Femenino</Radio>
                </Radio.Group>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Input
                  name="pCel"
                  value={values.pCel}
                  onChange={handleChange}
                  placeholder="Celular"
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <Input
                  name="pEmail"
                  value={values.pEmail}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  type="email"
                  required
                />
              </div>

              <Button type="primary" htmlType="submit" size="large" block>
                Guardar Usuario
              </Button>
            </Form>
          )}
        </Formik>
        <Row justify="center">
          <h1>Registros de los usuarios</h1>
        </Row>
        <Table
          columns={columns}
          dataSource={usuarios}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }} 
        />
        <UsuarioEditarComponent
          visible={panelVisible}
          onClose={() => setPanelVisible(false)}
          usuario={usuarioSeleccionado}
          onSuccess={cargarDatos}
        />
      </Spin>
    </div>
  );
};

//funciones api
// Función para obtener los roles (ListResponse)
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

// Función para obtener los lugares (ListResponse)
const obtenerLugar = async (): Promise<ListResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Lugar/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los lugares');
  }

  const res = await response.json();
  return new ListResponse<LugarResponse>(res.code, res.message, res.items);
};

// Función para agregar un usuario (ObjectResponse) USUARIO
const agregarUsuario = async (data: UsuarioRequest): Promise<ObjectResponse<UsuarioResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Usuario/Agregar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al agregar el usuario');
  }

  const res = await response.json();
  return new ObjectResponse<UsuarioResponse>(res.code, res.message, res.item);
};

//obtener Lugares
const obtenerUsuarios = async (): Promise<ListResponse<UsuarioResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Usuario/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los usuarios');
  }

  const res = await response.json();
  return new ListResponse<UsuarioResponse>(res.code, res.message, res.items);
};

//Eliminar usuario
const eliminarUsuario  = async (pId: number): Promise<ObjectResponse<UsuarioResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Usuario/Eliminar`, {
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
  return new ObjectResponse<UsuarioResponse>(data.code, data.message, data.item);
};

//activar Usuario
const activarUsuario = async (pId: number): Promise<ObjectResponse<UsuarioResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Usuario/Activar`, {
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
  return new ObjectResponse<UsuarioResponse>(data.code, data.message, data.item);
};

//funciones api
export default UsuarioComponent;
