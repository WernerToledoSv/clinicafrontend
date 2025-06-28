// src/components/HomeEnfermeroComponent.tsx
import React, { useEffect, useState, useRef } from 'react';
import ToastNotifier, { ToastNotifierRef } from '../../../Alertas/ToastNotifier'; 
import { Input, Select, Button, Typography, Spin, Tag, Table } from 'antd';
import { Formik } from 'formik';
import { InventarioRequest } from '../../../../Interfaces/InterfacesResponse/Inventario/InventarioRequest';
import { obtenerMedicamento } from '../../../../Services/Medicamento/MedicamentoService';
import { CargarInventarioLugar, SalidaInventario } from '../../../../Services/Inventario/InventarioService';
import { InventarioStockResponse } from '../../../../Interfaces/InterfacesResponse/Inventario/InventarioStockResponse';
import { LoginResponse } from '../../../../Interfaces/InterfacesResponse/Login/LoginResponse';

const { Title } = Typography;

const InventarioLugarComponent: React.FC = () => {
    //variables
    const toastRef = useRef<ToastNotifierRef>(null);
    const [medicamentos, setMedicamentos] = useState<{ value: number; label: string }[]>([]);
    const [loginData, setLoginData] = useState<LoginResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [Lugar, setLugar] = useState<string | null>(null);
    const [inventarioLugarData, setInventarioLugarData] = useState<InventarioStockResponse[]>([]);

      useEffect(() => {
        cargarMedicamentos();
        const storedLogin = sessionStorage.getItem('Login');
        if (storedLogin) {
          try {
            const loginData = JSON.parse(storedLogin);
            setLoginData(loginData);
            setLugar(loginData?.nombreLugar ?? null);
            cargarInventarioAsig(loginData?.idLugar ?? 0);
          } catch (error) {
            console.error('Error al parsear la sesión:', error);
          }
        }
      }, []);

      //Tabla de stock por lugar
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
      
      //cargando datos
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

    const handleSubmit = async (
        values: InventarioRequest,
        { resetForm }: { resetForm: () => void }
      ) => 
    {
        setIsLoading(true);
        try{
            values.idUsuario = loginData?.id;
            values.idLugar = loginData?.idLugar;

            var response = await SalidaInventario(values);
            if (response.code === 1) {
                toastRef.current?.showMessage({
                    severity: 'success',
                    summary: 'Exito en la salida de medicamento',
                    detail: response.message,
                });                
                cargarInventarioAsig(loginData?.idLugar ?? 0);
            }
            else{
                toastRef.current?.showMessage({
                    severity: 'info',
                    summary: 'No se sacar el medicamento',
                    detail: response.message,
                });
            }
        }catch(erro){
             toastRef.current?.showMessage({
                severity: 'error',
                summary: 'Error al guardar los registros',
                detail: 'Contactese con el administrador',
            });
        }
        finally{
            resetForm();
            setIsLoading(false);
        }

    };

  return (
    <div style={{ padding: '24px' }}>
        <Spin spinning={isLoading} tip="Cargando...">
            <ToastNotifier ref={toastRef} />
            <Title level={2} style={{ textAlign: 'center' }}>Stock de {Lugar}</Title>
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
                    allowClear
                    options={medicamentos}
                    />

                    <Input
                    name="descripcion"
                    placeholder="Descripción"
                    size="large"
                    style={{ marginBottom: 24 }}
                    value={values.descripcion = "Salida del medicamento por enfermero"}
                    onChange={handleChange}
                    readOnly
                    />

                    <Input
                    name="cantidadAccion"
                    type="number"
                    placeholder="Cantidad por unidad"
                    size="large"
                    style={{ marginBottom: 24 }}
                    value={values.cantidadAccion}
                    onChange={handleChange}
                    min={1}
                    />

                    <Button type="primary" htmlType="submit" block>
                    Guardar
                    </Button>
                </form>
                )}
            </Formik>
            <Title level={2} style={{ textAlign: 'center' }}>Tabla de Stock {Lugar}</Title>
            <Table
                    dataSource={inventarioLugarData}
                    columns={columnasMedicamentos}
                    rowKey="Id"
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 'max-content' }}
                />
         </Spin>       
    </div>
  );
};

export default InventarioLugarComponent;
