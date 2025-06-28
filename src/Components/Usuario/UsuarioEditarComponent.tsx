import React, { useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import { Modal, Input, Button, Select, Spin, Radio } from 'antd';
import { UsuarioResponse } from '../../Interfaces/InterfacesResponse/Usuario/UsuarioResponse';
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import { RolResponse } from '../../Interfaces/InterfacesResponse/Rol/RolResponse';
import { LugarResponse } from '../../Interfaces/InterfacesResponse/Lugar/LugarResponse';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import { UsuarioEditarRequest } from '../../Interfaces/InterfacesResponse/Usuario/UsuarioEditarRequest';

const { Option } = Select;
const userApiUrl = import.meta.env.VITE_USER_API;

interface Props {
  visible: boolean;
  onClose: () => void;
  usuario?: UsuarioResponse;
  onSuccess?: () => void;
}

const obtenerRol = async (): Promise<ListResponse<RolResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Rol/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Error al obtener los roles');
  const res = await response.json();
  return new ListResponse<RolResponse>(res.code, res.message, res.items);
};

const obtenerLugar = async (): Promise<ListResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Lugar/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Error al obtener los lugares');
  const res = await response.json();
  return new ListResponse<LugarResponse>(res.code, res.message, res.items);
};

const editarUsuario = async (lugar: UsuarioEditarRequest): Promise<ObjectResponse<UsuarioResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Usuario/Actualizar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lugar),
  });

  if (!response.ok) {
    throw new Error('Error en la actualización del lugar');
  }

  const data = await response.json();
  return new ObjectResponse<UsuarioResponse>(data.code, data.message, data.item);
};


const UsuarioEditarComponent: React.FC<Props> = ({ visible, onClose, usuario, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [opcionesRol, setOpcionesRol] = useState<{ value: number; label: string }[]>([]);
  const [opcionesLugar, setOpcionesLugar] = useState<{ value: number; label: string }[]>([]);
  const toastRef = useRef<ToastNotifierRef>(null);

  useEffect(() => {
    cargarRoles();
    cargarLugares();
  }, []);

  const cargarRoles = async () => {
    setLoading(true);
    try {
      const responseRoles = await obtenerRol();
      const rolesres = Array.isArray(responseRoles.items) ? responseRoles.items : [responseRoles.items];
      const opciones = rolesres.map((rol) => ({
        value: rol.id,
        label: rol.nombre,
      }));
      setOpcionesRol(opciones);
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al cargar los roles',
        detail: `No se pudieron cargar los roles. ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarLugares = async () => {
    setLoading(true);
    try {
      const responseLugares = await obtenerLugar();
      const lugaresRes = Array.isArray(responseLugares.items) ? responseLugares.items : [responseLugares.items];
      const opciones = lugaresRes.map((lugar) => ({
        value: lugar.id,
        label: lugar.nombre,
      }));
      setOpcionesLugar(opciones);
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al cargar los lugares',
        detail: 'No se pudieron cargar los lugares.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values: UsuarioEditarRequest, actions: any) => {
    try {
      setLoading(true);
      const response = await editarUsuario(values);

      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Usuario actualizado',
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
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al actualizar',
        detail: 'No se pudo actualizar el usuario.',
      });
    } finally {
      actions.setSubmitting(false);
      setLoading(false);
    }
  };

  if (!usuario) return null;

  return (
    <Modal
      title="Editar Usuario"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <ToastNotifier ref={toastRef} />
      <Spin spinning={loading} tip="Cargando...">
        <Formik
          initialValues={{ 
            pId: usuario.id,
            pIdRol: usuario.idRol,
            pIdLugar: usuario.idLugar,
            pUsername: usuario.username,
            pPassword: usuario.password,
            pNombres: usuario.nombres,
            pApellidos: usuario.apellidos,
            pSexo: usuario.sexo,
            pCel: usuario.cel,
            pEmail: usuario.email,
          }}
          enableReinitialize
          onSubmit={handleFormSubmit}
        >
          {({ values, handleChange, setFieldValue, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label>Nombre de Usuario</label>
                <Input name="pUsername" value={values.pUsername} onChange={handleChange} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Rol</label>
                <Select
                  value={values.pIdRol}
                  onChange={(value) => setFieldValue('pIdRol', value)}
                  style={{ width: '100%' }}
                  options={opcionesRol}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Lugar</label>
                <Select
                  value={values.pIdLugar}
                  onChange={(value) => setFieldValue('pIdLugar', value)}
                  style={{ width: '100%' }}
                  options={opcionesLugar}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Nombres</label>
                <Input name="pNombres" value={values.pNombres} onChange={handleChange} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Apellidos</label>
                <Input name="pApellidos" value={values.pApellidos} onChange={handleChange} />
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

              <div style={{ marginBottom: 16 }}>
                <label>Celular</label>
                <Input name="pCel" value={values.pCel} onChange={handleChange} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Email</label>
                <Input name="pEmail" value={values.pEmail} onChange={handleChange} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Password</label>
                <Input name="pPassword" value={values.pPassword} onChange={handleChange} />
              </div>

              <div style={{ textAlign: 'center', paddingTop: 16 }}>
                <Button onClick={onClose} style={{ backgroundColor: '#ff4d4f', color: 'white', marginRight: 12 }}>
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

export default UsuarioEditarComponent;
