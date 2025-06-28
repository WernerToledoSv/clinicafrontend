import { Button, Select, Spin, Space, Table, Row } from 'antd';
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import { LugarResponse } from '../../Interfaces/InterfacesResponse/Lugar/LugarResponse';
import React, { useEffect, useState, useRef } from 'react';
import { MisionResponse } from '../../Interfaces/InterfacesResponse/Mision/MisionResponse';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { LugarMisionRequest } from '../../Interfaces/InterfacesResponse/UnionLugarMision/UnionMisionLugarRequest';
import { Formik, Form, FormikHelpers } from 'formik';
import { UnionMisionLugarResponse } from '../../Interfaces/InterfacesResponse/UnionLugarMision/UnionMisionLugarResponse'; 
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { GenericResponse } from '../../Interfaces/BaseResponse/GenericResponse';

const userApiUrl = import.meta.env.VITE_USER_API;

// Funcion para consumir las apis

// Obtener lugares 
const ObtenerLugares = async (): Promise<ListResponse<LugarResponse>> => {
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

// Obtener Mision 
const ObtenerMisiones = async (): Promise<ListResponse<MisionResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Mision/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los lugares');
  }

  const res = await response.json();
  return new ListResponse<MisionResponse>(res.code, res.message, res.items);
};

const AgregarUnionMision = async (request: LugarMisionRequest): Promise<GenericResponse> => {
    const response = await fetch(`${userApiUrl}v1/UnionMisionLugar/Agregar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Error al agregar el usuario');
    }

    const res = await response.json();
    return new GenericResponse(res.code, res.message)
};

//obtener mision lugar
const ObtenerMisionesLugar = async (): Promise<ListResponse<UnionMisionLugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/UnionMisionLugar/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener la union');
  }

  const res = await response.json();
  return new ListResponse<UnionMisionLugarResponse>(res.code, res.message, res.items);
};

//eliminar union
const eliminarUnion  = async (pId: number): Promise<GenericResponse> => {
  const response = await fetch(`${userApiUrl}v1/UnionMisionLugar/Eliminar`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pId }), // Enviamos el pId en el cuerpo
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la union');
  }

  const data = await response.json();
  return new GenericResponse(data.code, data.message);
};


// Funcion para consumir las apis

const MisionLugarComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [opcionesMisiones, setOpcionesMisiones] = useState<{ value: number; label: string }[]>([]);
  const [opcionesLugares, setOpcionesLugares] = useState<{ value: number; label: string }[]>([]);
  const [Union, setUnion] = useState<UnionMisionLugarResponse[]>([]);
  const toastRef = useRef<ToastNotifierRef>(null);

 useEffect(() => {
     cargarMisiones();
     cargarLugares();
     cargarDatos();
   }, []);
   
   const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await ObtenerMisionesLugar();

      if (response.code === 1) {
        setUnion(response.items);
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'No se obtuvieron las uniones',
          detail: response.message,
        });
      }
      
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al obtener las uniones',
        detail: 'Contactese con el adminstrador',
      });

    } finally {
      setLoading(false);
    }
  };


  const cargarMisiones = async () => {
      try {
        setLoading(true);
        const ResponseMision = await ObtenerMisiones();
        const Misiones = Array.isArray(ResponseMision.items) ? ResponseMision.items : [ResponseMision.items];
        
        const opcionesMision = Misiones.map((mision) => ({
          value: mision.id,
          label: mision.nombre,
        }));
  
        setOpcionesMisiones(opcionesMision);
      } catch (error) {
         toastRef.current?.showMessage({
          severity: 'error',
          summary: 'Error al cargar las misiones',
          detail: `No se pudieron cargar las misiones. Contacte al administrador.`,
      });
      }
      finally{
        setLoading(false);
      }
   }
   const cargarLugares = async () => {
      try {
        setLoading(true);
        const ResponseLugar = await ObtenerLugares();
        const Lugares = Array.isArray(ResponseLugar.items) ? ResponseLugar.items : [ResponseLugar.items];

        const opcionesMision = Lugares.map((lugar) => ({
          value: lugar.id,
          label: lugar.nombre,
        }));

        setOpcionesLugares(opcionesMision);

      } catch (error) {
        toastRef.current?.showMessage({
          severity: 'error',
          summary: 'Error al cargar los lugares',
          detail: `No se pudieron cargar los lugares. Contacte al administrador.`,
        })
      }
      finally{
        setLoading(false);
      } 
   }

  const columns: ColumnsType<UnionMisionLugarResponse> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Misión', dataIndex: 'mision', key: 'mision' },
    { title: 'Fecha Inicio Misión', dataIndex: 'fechaInicioMision', key: 'fechaInicioMision' },
    { title: 'Fecha Fin Misión', dataIndex: 'fechaFinMision', key: 'fechaFinMision' },
    { title: 'Fecha Lugar', dataIndex: 'fechaLugar', key: 'fechaLugar' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Lugar', dataIndex: 'lugar', key: 'lugar' },
    { title: 'Hora Inicio', dataIndex: 'horaInicio', key: 'horaInicio' },
    { title: 'Hora Fin', dataIndex: 'horaFin', key: 'horaFin' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => {
        // Puedes personalizar la lógica de estado aquí si agregas un campo como "estado"
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditar(record)}
            />
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleEliminar(record)}
              style={{ backgroundColor: 'red', borderColor: 'red', color: '#fff' }}
            />
          </Space>
        );
      },
    },
  ];

  const handleEditar = (union: UnionMisionLugarResponse) => {

  };
  
  const handleEliminar = async (union: UnionMisionLugarResponse) => {
    try {
      const response = await eliminarUnion(union.id);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Exito al eliminar',
          detail: response.message,
        });        
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al eliminar la union',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al eliminar la union',
        detail: 'Contactese con el adminstrador',
      });
    }
    finally{

    }
  };
  

  // ===================== FORM SUBMIT ============================
  const handleSubmit = async (values: LugarMisionRequest, actions: FormikHelpers<LugarMisionRequest>) => {
    try {
      // Llamada a la función AgregarUnionMision pasando el request
      const response: GenericResponse = await AgregarUnionMision(values);
  
      // Mostrar mensaje de éxito o error
      if (response.code === 1) {
        // Éxito
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message,
        });
        cargarDatos();
        actions.resetForm(); // Reseteamos el formulario si todo fue exitoso
      } else {
        // Error
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al ingresar la',
          detail: response.message,
        });
      }
    } catch (error) {
      // Manejo de errores
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error inesperado',
        detail: 'Hubo un problema al procesar la solicitud.',
      });
    } finally {
      actions.setSubmitting(false); // Finalizamos la ejecución de Formik
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Spin spinning={loading} tip="Cargando...">
        <ToastNotifier ref={toastRef} />

        <h1>Mision/Lugar</h1>
        <Formik
          initialValues={ new LugarMisionRequest()}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: 24 }}>
                <label>Misión</label>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Selecciona una Misión"
                  options={opcionesMisiones}
                  onChange={(value) => setFieldValue('pIdMision', value)}
                  value={values.pIdMision}
                  optionFilterProp="label"
                  showSearch
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label>Lugar</label>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Selecciona un Lugar"
                  options={opcionesLugares}
                  onChange={(value) => setFieldValue('pIdLugar', value)}
                  value={values.pIdLugar}
                  optionFilterProp="label"
                  showSearch
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isSubmitting}
                style={{ backgroundColor: '#1890ff', color: '#fff' }} // color azul personalizado
              >
                Guardar unión
              </Button>
            </Form>
          )}
        </Formik>

        <Row justify="center">
          <h1>Registros de las uniones</h1>
        </Row>
        
        <Table
          columns={columns}
          dataSource={Union}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }} 
        />
      </Spin>
    </div>
  );
};

export default MisionLugarComponent;