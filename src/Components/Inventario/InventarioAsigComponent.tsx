import { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { Input, Select, Button, Typography, Spin, Tag, Table } from 'antd';
import { InventarioRequest } from '../../Interfaces/InterfacesResponse/Inventario/InventarioRequest';
import { obtenerMedicamento } from '../../Services/Medicamento/MedicamentoService';
import { ObtenerLugares } from '../../Services/Lugar/LugarService';
import { AsignarLugar, CargarInventarioLugar } from '../../Services/Inventario/InventarioService';
import { InventarioStockResponse } from '../../Interfaces/InterfacesResponse/Inventario/InventarioStockResponse';
const { Title } = Typography;
const { Search } = Input;

const InventarioAsigComponent = () => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [medicamentos, setMedicamentos] = useState<{ value: number; label: string }[]>([]);
  const [lugares, setLugares] = useState<{ value: number; label: string }[]>([]);
  const [inventarioLugarData, setInventarioLugarData] = useState<InventarioStockResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lugarSeleccionado, setLugarSeleccionado] = useState<number>();
  const [filtro, setFiltro] = useState<string>('');
           

  useEffect(() => {
    cargarMedicamentos();
    cargarLugares();
    cargarInventarioAsig(lugarSeleccionado ?? 0);
  }, []);

  const columnasMedicamentos = [
    { title: 'Nombre', dataIndex: 'nombreMedicamento', key: 'nombreMedicamento' },
    { title: 'Descripción', dataIndex: 'descripcionMedicamento', key: 'descripcionMedicamento' },
    { title: 'Laboratorio', dataIndex: 'laboratorio', key: 'laboratorio' },
    { 
      title: 'Valor', 
      dataIndex: 'valor', 
      key: 'valor', 
      render: (v: number) => `${v?.toFixed(2) || '0.00'}` 
    },
    { title: 'Medida', dataIndex: 'medida', key: 'medida' },
    { title: 'Tipo', dataIndex: 'tipoMedicamento', key: 'tipoMedicamento' },
    { title: 'Lugar', dataIndex: 'nombreLugar', key: 'nombreLugar'},
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { 
      title: 'Estado', 
      dataIndex: 'estado', 
      key: 'estado', 
      render: (estado: string) => (
        <Tag color={estado === 'disponible' ? 'green' : 'red'}>{estado?.toUpperCase() || ''}</Tag>
      ) 
    },
  ];

  const cargarMedicamentos = async () => {
    try {
      const response = await obtenerMedicamento();
      if (response.code === 1) {
        const opciones = response.items.map((item: any) => ({
          value: item.id,
          label: item.nombre,
        }));
        setMedicamentos(opciones);
      }
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
    }
  };

  const cargarLugares = async () => {
    try {
      const response = await ObtenerLugares();
      if (response.code === 1) {
        const opciones = response.items.map((item: any) => ({
          value: item.id,
          label: item.nombre,
        }));
        setLugares(opciones);
        setLugarSeleccionado(opciones[0].value);
      }
    } catch (error) {
      console.error('Error al cargar lugares:', error);
    }
  };

    const cargarInventarioAsig = async (idLugar : number) => {
      setIsLoading(true);
      try {
        const response = await CargarInventarioLugar(idLugar);
        if (response.code === 1) {
          setInventarioLugarData(response.items);
        } else {
          setInventarioLugarData([]);
        }
      } catch (error) {
        toastRef.current?.showMessage({
            severity: 'error',
            summary: 'No se pudo obtener el inventario',
            detail: 'Contactese con el administrador',
          });
      } finally {
        setIsLoading(false);
      }
    };

  const handleChangeLugar = (value: number) => {
    setLugarSeleccionado(value);
    cargarInventarioAsig(value);
  };

  const handleSubmit = async (
    values: InventarioRequest,
    { resetForm }: { resetForm: () => void }
  ) => {
    setIsLoading(true);
    try {
      const loginString = sessionStorage.getItem('Login');
      var login = loginString ? JSON.parse(loginString) : null;
      values.idUsuario = login.id;
      
        const response = await AsignarLugar(values);

        if (response.code === 1) {
          toastRef.current?.showMessage({
            severity: 'success',
            summary: 'Inventario agregado',
            detail: response.message,
          });
          cargarInventarioAsig(lugarSeleccionado ?? 0);
        } else {
          toastRef.current?.showMessage({
            severity: 'info',
            summary: 'Advertencia',
            detail: response.message,
          });
        }       
    } catch (error) {
      console.log(error);
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error del servidor',
        detail: 'Ocurrió un error inesperado. Contacte al administrador.',
      });
    }
    finally{
      setIsLoading(false);
      resetForm();
    }
  };

  const datosFiltrados = inventarioLugarData.filter((item) =>
      item.nombreMedicamento.toLowerCase().includes(filtro.toLowerCase())
    );

  return (
    <div style={{ padding: 24 }}>
      <Spin spinning={isLoading} tip="Cargando...">
        <Title level={4} style={{ textAlign: 'center' }}>Asignación de medicamento</Title>
        <ToastNotifier ref={toastRef} />
        
        <Formik initialValues={new InventarioRequest()} onSubmit={handleSubmit}>
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <Select
                placeholder="Seleccione Medicamento"
                size="large"
                style={{ width: '100%', marginBottom: 24 }}
                value={values.idMedicamento}
                onChange={(value) => setFieldValue('idMedicamento', value)}
                showSearch
                optionFilterProp="label"
                allowClear
                options={medicamentos}
              />

              <Input
                name="descripcion"
                placeholder="Descripción"
                size="large"
                style={{ marginBottom: 24 }}
                value={ values.descripcion !== undefined && values.descripcion !== ''
                        ? values.descripcion:"Asignacion de medicamento (Admin)"}
                onChange={handleChange}
              />

              <Input
                name="cantidadAccion"
                type="number"
                placeholder="Cantidad"
                size="large"
                style={{ marginBottom: 24 }}
                value={values.cantidadAccion}
                onChange={handleChange}
                min={1}
              />

              <Input
                name="cantidadTotal"
                type="number"
                value={values.cantidadTotal}
                onChange={handleChange}
                placeholder="Cantidad unidades"
                min={1}
                style={{ width: '100%', marginBottom: 24 }}
              />

              <Select
                placeholder="Seleccione Lugar"
                size="large"
                style={{ width: '100%', marginBottom: 24 }}
                value={values.idLugar}
                onChange={(value) => setFieldValue('idLugar', value)}
                optionFilterProp="label"
                showSearch
                allowClear
                options={lugares}
              />

              <Button type="primary" htmlType="submit" block>
                Guardar
              </Button>
            </form>
          )}
        </Formik>
          

        <Title level={4} style={{ textAlign: 'center' }}>Medicamentos por lugar</Title>

        <Select
            placeholder="Seleccione un lugar"
            size="large"
            style={{ width: '100%', marginBottom: 24 }}
            value={lugarSeleccionado}
            onChange={handleChangeLugar}
            allowClear
            showSearch
            optionFilterProp="label"
            options={lugares}
        />

        <Search
          placeholder="Buscar medicamento..."
          allowClear
          onChange={(e) => setFiltro(e.target.value)}
          style={{ marginBottom: '40px' }}
        />

        <Table
              dataSource={datosFiltrados}
              columns={columnasMedicamentos}
              rowKey="Id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 'max-content' }}
            />
      </Spin>
    </div>
  );
};

export default InventarioAsigComponent;
