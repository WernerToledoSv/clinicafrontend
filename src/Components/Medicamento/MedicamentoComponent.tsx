import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Spin, Select, Row, Col, Space, Table,Tag } from 'antd';
import { Formik, Form } from 'formik';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { MedicamentoRequest } from '../../Interfaces/InterfacesResponse/Medicamento/MedicamentoRequest';
import { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import { TipoMedidaResponse } from '../../Interfaces/InterfacesResponse/TipoMedida/TipoMedidaResponse';
import { TipoMedicamentoResponse } from '../../Interfaces/InterfacesResponse/TipoMedicamento/TipoMedicamentoResponse';
import { MedicamentoResponse } from '../../Interfaces/InterfacesResponse/Medicamento/MedicamentoResponse';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import MedicamentoEditarComponent from './MedicamentoEditarComponent';

const { Search } = Input;

const inventarioApiUrl = import.meta.env.VITE_INVENTARIO_API;

const MedicamentoComponent: React.FC = () => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [loading, setLoading] = useState(false);
  const [opcionesTipoMedicamento, setOpcionesTipoMedicamento] = useState<{ value?: number; label?: string }[]>([]);
  const [opcionesTipoMedida, setOpcionesTipoMedida] = useState<{ value?: number; label?: string }[]>([]);
  const [medicamento, setMedicamento] = useState<MedicamentoResponse[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [MedicamentoSeleccionado, setMedicamentoSeleccionado] = useState<MedicamentoResponse | undefined>(undefined);
  const [filtro, setFiltro] = useState<string>('');
    

  useEffect(() => {
    cargarTipoMedicamento();
    cargarTipoMedida();
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await obtenerMedicamento();

      if (response.code === 1) {
        setMedicamento(response.items);
      }
      else{
      }
      
    } catch (error) {
        toastRef.current?.showMessage({
          severity: 'error',
          summary: 'No se obtuvieron los medicamentos',
          detail: 'Contactese con el administrador',
        });
    }
    finally{
      setLoading(false);
    }
  }

  const columns: ColumnsType<MedicamentoResponse> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Laboratorio', dataIndex: 'laboratorio', key: 'laboratorio' },
    { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
    { title: 'Valor', dataIndex: 'valor', key: 'valor' },
    {
      title: 'Tipo Medicamento',
      dataIndex: 'tipoMedicamento',
      key: 'idTipoMedicamento', 
    },
    {
      title: 'Tipo Medida',
      dataIndex: 'tipoMedida',
      key: 'idTipoMedida',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado: MedicamentoResponse['estado']) => (
        <Tag
            color={
              estado === 'disponible'
                ? 'green'
                : estado === 'agotado'
                ? 'red'
                : 'orange'
            }
          >
            {estado.toUpperCase()}
        </Tag>

      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => {
        const esDisponible = record.estado === 'disponible';
        const esAgotado = record.estado === 'agotado';

        return (
          <Space>
            {/* Mostrar botón de editar para todos los estados */}
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditar(record)}
            />

            {/* Mostrar botón de eliminar o activar solo si no está agotado */}
            {!esAgotado && (
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
            )}
          </Space>
        );
      },
    }
  ];

  const handleEditar = (medicamento: MedicamentoResponse) => {
    setMedicamentoSeleccionado(medicamento);
    setPanelVisible(true);
  };
  const handleEliminar = async (medicamento: MedicamentoResponse) => {
    try {
      setLoading(true);
      const response = await eliminarMedicamento(medicamento.id);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Exito al eliminar el medicamento',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al eliminar el medicamento',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al eliminar el medicamento',
        detail: `Contacte con el administrador.`,
      });
    }
    finally{
      setLoading(false);
    }
  };

  const handleActivar = async (medicamento: MedicamentoResponse) => {
    try {
      setLoading(true);
      const response = await activarMedicamento(medicamento.id);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Exito al editar el medicamento',
          detail: response.message,
        });
        cargarDatos();
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Error al editar el medicamento',
          detail: response.message,
        });
      }
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al editar el medicamento',
        detail: `Contacte con el administrador.`,
      });
    }
    finally{
      setLoading(false);
    }
  };

  const cargarTipoMedicamento = async () => {
    setLoading(true);
    try {
      const responseTipoMedicamento = await obtenerTipoMedicamento();
      const TipoMedicamento = Array.isArray(responseTipoMedicamento.items) ? responseTipoMedicamento.items : [responseTipoMedicamento.items];
      
      const opcionesTipoMedicamento = TipoMedicamento.map((TMedicamento) => ({
        value: TMedicamento.id,
        label: TMedicamento.nombre,
      }));

      setOpcionesTipoMedicamento(opcionesTipoMedicamento);
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al cargar los tipos de medicamento',
        detail: `Contacte con el administrador.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarTipoMedida = async () => {
    setLoading(true);
    try {
      const responseTipoMedida = await obtenerTipoMedida();
      const TipoMedida = Array.isArray(responseTipoMedida.items) ? responseTipoMedida.items : [responseTipoMedida.items];
      
      const opcionesTipoMedida = TipoMedida.map((TMedida) => ({
        value: TMedida.id,
        label: TMedida.nombre,
      }));

      setOpcionesTipoMedida(opcionesTipoMedida);
    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al cargar los tipos de medida',
        detail: `Contacte con el administrador.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: MedicamentoRequest) => {
    try {
      const response = await agregarMedicamento(values);
      if (response.code === 1) {
        toastRef.current?.showMessage({
          severity: 'success',
          summary: 'Medicamento agregado correctamente',
          detail: response.message
        });
        cargarDatos();        
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'No se pudo ingresar el medicamento',
          detail: response.message
        });
      }

    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error al agregar el medicamento',
        detail: `Contacte con el administrador.`,
      });
    }
  };

  //buscador
  const datosFiltrados = medicamento.filter((item) =>
    item.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <ToastNotifier ref={toastRef} />
      <Spin spinning={loading} tip="Cargando...">
        `<h1>Agregar Medicamento</h1>
        
        <Formik
          initialValues={new MedicamentoRequest()}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Input
                      name="pNombre"
                      value={values.pNombre}
                      onChange={handleChange}
                      placeholder="Nombre del medicamento"
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>

                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Input
                      name="pDescripcion"
                      value={values.pDescripcion || ''}
                      onChange={handleChange}
                      placeholder="Descripción del medicamento"
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>

                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Input
                      name="pLaboratorio"
                      value={values.pLaboratorio}
                      onChange={handleChange}
                      placeholder="Laboratorio"
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>

                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Input
                      name="pCantidad"
                      type="number"
                      value={values.pCantidad}
                      onChange={handleChange}
                      placeholder="Cantidad"
                      style={{ width: '100%' }}
                      min={1}
                    />
                  </div>
                </Col>

                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Input
                      name="pValor"
                      type="number"
                      value={values.pValor}
                      onChange={handleChange}
                      placeholder="Valor"
                      style={{ width: '100%' }}
                      min={0}
                    />
                  </div>
                </Col>

                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Select
                      value={values.pIdTipoMedicamento}
                      onChange={value => handleChange({ target: { name: 'pIdTipoMedicamento', value } })}
                      placeholder="Seleccionar tipo de medicamento"
                      options={opcionesTipoMedicamento}
                      style={{ width: '100%' }}
                      optionFilterProp="label"
                      allowClear
                      showSearch
                    />
                  </div>
                </Col>

                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Select
                      value={values.pIdTipoMedida}
                      onChange={value => handleChange({ target: { name: 'pIdTipoMedida', value } })}
                      placeholder="Seleccionar tipo de medida"
                      options={opcionesTipoMedida}
                      style={{ width: '100%' }}
                      optionFilterProp="label"
                      allowClear
                      showSearch
                    />
                  </div>
                </Col>
              </Row>

              <Button type="primary" htmlType="submit" size="large" loading={isSubmitting} block>
                Guardar Medicamento
              </Button>
            </Form>
          )}
        </Formik>

        <Row justify="center">
          <h1>Registros de los medicamentos</h1>
        </Row>
        <Search
          placeholder="Buscar medicamento..."
          allowClear
          onChange={(e) => setFiltro(e.target.value)}
          style={{ marginBottom: '40px' }}
        />

        <Table
          columns={columns}
          dataSource={datosFiltrados}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }} 
        />

        <MedicamentoEditarComponent
          visible={panelVisible}
          onClose={() => setPanelVisible(false)}
          medicamento={MedicamentoSeleccionado}
          onSuccess={cargarDatos}
        />
      </Spin>
    </div>
  );
};

const obtenerTipoMedida = async (): Promise<ListResponse<TipoMedidaResponse>> => {
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

const obtenerTipoMedicamento = async (): Promise<ListResponse<TipoMedicamentoResponse>> => {
  const response = await fetch(`${inventarioApiUrl}v1/TipoMedicamento/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los tipos de medicamento');
  }

  const res = await response.json();
  return new ListResponse<TipoMedicamentoResponse>(res.code, res.message, res.items);
};


//medicamento api
const agregarMedicamento = async (data: MedicamentoRequest): Promise<ObjectResponse<MedicamentoResponse>> => {
  const response = await fetch(`${inventarioApiUrl}v1/Medicamento/Agregar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al agregar el medicamento');
  }

  const res = await response.json();
  return new ObjectResponse<MedicamentoResponse>(res.code, res.message, res.item);
};

const obtenerMedicamento = async (): Promise<ListResponse<MedicamentoResponse>> => {
  const response = await fetch(`${inventarioApiUrl}v1/Medicamento/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los tipos de medicamento');
  }

  const res = await response.json();
  return new ListResponse<MedicamentoResponse>(res.code, res.message, res.items);
};

const eliminarMedicamento = async (pId: number): Promise<ObjectResponse<MedicamentoResponse>> => {
  const response = await fetch(`${inventarioApiUrl}v1/Medicamento/Eliminar`, {
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
  return new ObjectResponse<MedicamentoResponse>(data.code, data.message, data.item);
};

//Activar mision
const activarMedicamento = async (pId: number): Promise<ObjectResponse<MedicamentoResponse>> => {
  const response = await fetch(`${inventarioApiUrl}v1/Medicamento/Activar`, {
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
  return new ObjectResponse<MedicamentoResponse>(data.code, data.message, data.item);
};

//medicamento api
export default MedicamentoComponent;
