  import React, { useState, useEffect, useRef } from 'react';
  import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
  import { ObtenerStockInventario } from '../../Services/Inventario/InventarioService';
  import { ObtenerInventario } from '../../Services/Inventario/InventarioService';
  import { InventarioResponse } from '../../Interfaces/InterfacesResponse/Inventario/InventarioResponse';
  import { InventarioStockResponse } from '../../Interfaces/InterfacesResponse/Inventario/InventarioStockResponse';
  import { Formik } from 'formik';
  import { InventarioRequest } from '../../Interfaces/InterfacesResponse/Inventario/InventarioRequest';
  import { AgregarInventario, SalidaInventario } from '../../Services/Inventario/InventarioService';
  import { Input, Button, Typography, DatePicker, Spin, Tag, Table, Select} from 'antd';
  import { ObtenerLugares } from '../../Services/Lugar/LugarService';
  import dayjs from 'dayjs';
  import { obtenerMedicamento } from '../../Services/Medicamento/MedicamentoService';
  const { Option } = Select;
  const { Title } = Typography;


  const InventarioComponent = () => {
    const toastRef = useRef<ToastNotifierRef>(null);
    const [medicamentos, setMedicamentos] = useState<{ value?: number; label?: string }[]>([]);  
    const [isLoading, setIsLoading] = useState(false);
    const [filtroTabla, setFiltroTabla] = useState<'inventario' | 'stock'>('inventario');
    const [stockData, setStockData] = useState<InventarioStockResponse[]>([]);
    const [inventarioData, setInventarioData] = useState<InventarioResponse[]>([]);
    const [tipoMovimiento, settipoMovimientoValue] = useState<string | undefined>('in');
    const [lugares, setLugares] = useState<{ value: number; label: string }[]>([]);
      

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

  const columnasInventario = [
    { title: 'Medicamento', dataIndex: 'medicamento', key: 'medicamento' },
    { title: 'Usuario', dataIndex: 'username', key: 'username' },
    { title: 'Lugar', dataIndex: 'nombreLugar', key: 'idLugar' },
    { title: 'Descripción', dataIndex: 'descripcion', key:'descripcion'},
    { title: 'Precio', dataIndex: 'precio', key: 'precio', render: (p: number) => `$${p?.toFixed(2)}` },
    { title: 'Cantidad Acción', dataIndex: 'cantidadAccion', key: 'cantidadAccion' },
    { title: 'Cantidad Total', dataIndex: 'cantidadTotal', key: 'cantidadTotal' },
    { title: 'Fecha Acción', dataIndex: 'fechaAccion', key: 'fechaAccion', render: (d: string) => new Date(d).toLocaleDateString() },
    { title: 'Fecha Expira', dataIndex: 'fechaExpira', key: 'fechaExpira', render: (d: string) => new Date(d).toLocaleDateString() },
    { 
      title: 'Acción', 
      dataIndex: 'accion', 
      key: 'accion',
      render: (accion: string) => (
      <Tag
        color={
          accion === 'in'
            ? 'green'
            : accion === 'out'
            ? 'red'
            : accion === 'asig'
            ? 'orange'
            : 'default'
        }
      >
        {accion === 'in'
          ? 'Ingreso'
          : accion === 'out'
          ? 'Salida'
          : accion === 'asig'
          ? 'Asignación'
          : 'Desconocido'}
      </Tag>

      )
    },
  ];


    useEffect(() => {
      ObtenerMedicamentos();
      if (filtroTabla === 'stock') {
        cargarStock();
      } else {
        cargarInventario();
      }
    }, [filtroTabla]);

    const cargarStock = async () => {
      setIsLoading(true);
      try {
        const response = await ObtenerStockInventario();
        if (response.code === 1) {
          setStockData(response.items);
        } else {
        
        }
      } catch (error) {
        toastRef.current?.showMessage({
            severity: 'error',
            summary: 'No se pudo obtener el stock del inventario',
            detail: 'Contactese con el administrador',
          });
      } finally {
        setIsLoading(false);
      }
    };

    const cargarInventario = async () => {
      setIsLoading(true);
      try {
        const response = await ObtenerInventario();
        if (response.code === 1) {
          setInventarioData(response.items);
        } else {
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

    const cargarLugares = async () => {
      try {
        const response = await ObtenerLugares();
        if (response.code === 1) {
          const opciones = response.items.map((item: any) => ({
            value: item.id,
            label: item.nombre,
          }));
          setLugares(opciones);
        }
      } catch (error) {
        console.error('Error al cargar lugares:', error);
      }
    };

    const ObtenerMedicamentos = async () => {
      setIsLoading(true);
      try {
        const response = await obtenerMedicamento();
        if (response.code === 1) {
          // Transformar response.items para que tenga value y label
        const opciones = response.items.map(item => ({
          value: item.id,
          label: item.nombre,
        }));
        setMedicamentos(opciones);
        } else {
          setMedicamentos([]);
        }
      } catch (error) {
        toastRef.current?.showMessage({
            severity: 'error',
            summary: 'No se pudieron obtener los medicamentos',
            detail: 'Contactese con el administrador',
          });
      } finally {
        setIsLoading(false);
      }
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
        
        if (tipoMovimiento === 'in') {
          const response = await AgregarInventario(values);

          if (response.code === 1) {
            toastRef.current?.showMessage({
              severity: 'success',
              summary: 'Inventario agregado',
              detail: response.message,
            });
          } else {
            toastRef.current?.showMessage({
              severity: 'info',
              summary: 'Advertencia',
              detail: response.message,
            });
          }  
        }
        else{
          const response = await SalidaInventario(values);

          if (response.code === 1) {
            toastRef.current?.showMessage({
              severity: 'success',
              summary: 'Inventario agregado',
              detail: response.message,
            });
            cargarInventario();
          } else {
            toastRef.current?.showMessage({
              severity: 'info',
              summary: 'Advertencia',
              detail: response.message,
            });
          }  
        }
        if (filtroTabla === 'stock') {
          cargarStock();
        } else {
          cargarInventario();
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
        settipoMovimientoValue('in');
        setIsLoading(false);
        resetForm();
      }
    };


    return (
      <div style={{ padding: 24 }}>
        <Spin spinning={isLoading} tip="Cargando...">
          <ToastNotifier ref={toastRef} />
          <Title level={3}>Inventario</Title>
          <Formik
              initialValues={new InventarioRequest()}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleSubmit, setFieldValue, values, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <Select
                      placeholder="Seleccione Medicamento"
                      size="large"
                      style={{ width: '100%', marginBottom: 24 }}
                      value={values.idMedicamento}
                      onChange={(value) => setFieldValue('idMedicamento', value)}
                      allowClear
                      optionFilterProp="label"
                      showSearch
                      options={medicamentos}
                    >
                  </Select>

                  {/* Otros campos */}

                  <Input
                    name="descripcion"
                    placeholder="Descripción"
                    size="large"
                    style={{ marginBottom: 24 }}
                    value={
                      values.descripcion !== undefined && values.descripcion !== ''
                        ? values.descripcion
                        : tipoMovimiento === 'in'
                          ? 'Ingreso de medicamento (Admin)'
                          : 'Salida de medicamento (Admin)'
                    }
                    onChange={handleChange}
                  />     
                  {tipoMovimiento === 'out' &&(
                    <>
                      <Input
                        name="cantidadAccion"
                        type="number"
                        value={values.cantidadAccion}
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
                        showSearch
                        allowClear
                        options={lugares}
                      />
                    </>
                  )}
                    
                
                    {tipoMovimiento === 'in' && (
                      <>
                      <Input
                        name="cantidadAccion"
                        type="number"
                        value={values.cantidadAccion}
                        onChange={handleChange}
                        placeholder="Cantidad en conjuntos (cajas, frascos, etc)"
                        min={1}
                        style={{ width: '100%', marginBottom: 24 }}
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

                      <Input
                        name="precio"
                        type="number"
                        placeholder="Precio"
                        size="large"
                        style={{ width: '100%', marginBottom: 24 }}
                        value={values.precio}
                        onChange={handleChange}
                        min={0.1}            
                        step={0.01}          
                      />


                        <DatePicker
                          placeholder="Fecha de vencimiento"
                          style={{ width: '100%', marginBottom: 24 }}
                          size="large"
                          value={values.fechaExpira ? dayjs(values.fechaExpira) : null}
                          onChange={(date) =>
                            setFieldValue('fechaExpira', date ? date.toDate() : null)
                          }
                        />
                      </>
                    )}

                    <Select
                      placeholder="Seleccione el tipo de acción"
                      size="large"
                      style={{ width: '100%', marginBottom: 24 }}
                      value={tipoMovimiento}
                      onChange={(value) => 
                          {if (value !== tipoMovimiento) {
                           settipoMovimientoValue(value);
                            if (value === 'out') {
                              cargarLugares();
                            }
                          }}
                      }
                      allowClear
                      showSearch
                      optionFilterProp="children"
                    >
                      <Option value="in">Ingreso</Option>
                      <Option value="out">Salida</Option>
                    </Select>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={isLoading || isSubmitting}
                  >
                    Guardar Inventario
                  </Button>
                </form>
                    )}
            </Formik>

          <h2 style={{ textAlign: 'center' }}>Registro de inventario</h2>
          <Select
            value={filtroTabla}
            onChange={value => setFiltroTabla(value)}
            style={{ width: 250, marginBottom: 24 }}
            placeholder="Seleccione una opción"
          >
            <Option value="inventario">Inventario</Option>
            <Option value="stock">Stock del inventario</Option>
          </Select>

          {filtroTabla === 'inventario' ? (
            <Table
              dataSource={inventarioData}
              columns={columnasInventario}
              rowKey="Id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 'max-content' }}
            />
          ) : (
            <Table
              dataSource={stockData}
              columns={columnasMedicamentos}
              rowKey="NombreMedicamento"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 'max-content' }}
            />
          )}
        </Spin>
      </div>
    );
  };

  export default InventarioComponent;
