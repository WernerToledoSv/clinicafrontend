import React, { useEffect, useState, useRef } from 'react';
import ToastNotifier, { ToastNotifierRef } from '../../../Alertas/ToastNotifier'; 
import { Input, Typography, Tag, Table } from 'antd';
import { CargarInventarioLugar } from '../../../../Services/Inventario/InventarioService';
import { InventarioStockResponse } from '../../../../Interfaces/InterfacesResponse/Inventario/InventarioStockResponse';

const { Title } = Typography;
const { Search } = Input;

const MedicamentoDocComponent: React.FC = () => {
  const toastRef = useRef<ToastNotifierRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Lugar, setLugar] = useState<string | null>(null);
  const [inventarioLugarData, setInventarioLugarData] = useState<InventarioStockResponse[]>([]);
  const [filtro, setFiltro] = useState<string>(''); 

// Obtener login del sessionStorage
  useEffect(() => {
    const storedLogin = sessionStorage.getItem('Login');
    if (!storedLogin) return;

    try {
      const loginData = JSON.parse(storedLogin);
      const lugarId = loginData?.idLugar;

      setLugar(loginData?.nombreLugar ?? null);

      if (!lugarId) return;

      // Cargar una vez
      cargarInventarioAsig(lugarId);

      // Luego cada 5 minutos
      const intervalo = setInterval(() => {
         console.log('Recargando inventario...');
        cargarInventarioAsig(lugarId);
      }, 15 * 60 * 1000);

      // Limpiar intervalo al desmontar
      return () => clearInterval(intervalo);
    } catch (error) {
      console.error('Error al parsear la sesión:', error);
    }
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

  const datosFiltrados = inventarioLugarData.filter((item) =>
    item.nombreMedicamento.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ padding: '24px' }}>
      <Title level={1} style={{ textAlign: 'center' }}>Stock de {Lugar}</Title>
      <ToastNotifier ref={toastRef} />

      <Search
        placeholder="Buscar medicamento..."
        allowClear
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <Table
        dataSource={datosFiltrados}
        columns={columnasMedicamentos}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        loading={isLoading}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default MedicamentoDocComponent;
