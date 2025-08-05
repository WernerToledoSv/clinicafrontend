// src/components/NavbarAdmin.tsx
import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CompassOutlined,
  TeamOutlined,
  ZoomInOutlined,
  SwapOutlined,
  LineChartOutlined,
  MedicineBoxOutlined,
  UsergroupAddOutlined,
  ApartmentOutlined,
  MoreOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import RolAdminComponent from '../Rol/RolAdminComponent';
import LugarComponent from '../Lugar/LugarComponent';
import MisionComponent from '../Mision/MisionComponent';
import UsuarioComponent from '../Usuario/UsuarioComponent';
import MisionLugarComponent from '../MisionLugar/MisionLugarComponent';
import InventarioComponentTab from '../Inventario/InventarioComponentTab';
import MedicamentoComponent from '../Medicamento/MedicamentoComponent';
import TipoMedicamentoComponent from '../TipoMedicamento/TipoMedicamentoComponent';
import TipoMedidaComponent from '../TipoMedida/TipoMedidaComponent';
import logo from '../../imgs/logoNav.png'


const { Sider, Content } = Layout;

const NavbarAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1'); // Controla el componente actual

  const toggleSidebar = () => setCollapsed(!collapsed);

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <RolAdminComponent />;
      case '2':
        return <LugarComponent />;
      case '3':
        return <MisionComponent />
      case '4':
        return <UsuarioComponent />
      case '5':
        return <MisionLugarComponent />
      case '6':
        return <InventarioComponentTab />
      case '7':
        return <MedicamentoComponent />
      case '8':
        return <TipoMedicamentoComponent />
      case '9':
        return <TipoMedidaComponent />
    }
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggleSidebar} theme="dark" width={250}>
        <div style={{ padding: '16px', textAlign: 'center', color: '#fff', fontSize: '20px' }}>
            {collapsed ?  <img
            src={logo} // Cambia esto por la ruta de tu imagen
            alt="Logo"
            style={{ width: '40px', height: '40px' }} // Ajusta el tamaño como quieras
          /> 
        : 'Admin Dashboard'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            if (key === '10') {
              sessionStorage.clear();
              navigate('/Login');
            } else {
              setSelectedKey(key);
            }
          }}
        >
          <Menu.Item key="1" icon={<TeamOutlined />}>Gestión de roles</Menu.Item>
          <Menu.Item key="2" icon={<CompassOutlined />}>Gestion de lugares</Menu.Item>
          <Menu.Item key="3" icon={<ZoomInOutlined />}>Gestión de misiones</Menu.Item>
          <Menu.Item key="4" icon={<UsergroupAddOutlined />}>Gestión de usuarios</Menu.Item>
          <Menu.Item key="5" icon={<SwapOutlined />}>Gestión de mision/Lugar</Menu.Item>

          <Menu.Item key="6" icon={<LineChartOutlined />}>Gestión de inventario</Menu.Item>
          <Menu.Item key="7" icon={<MedicineBoxOutlined />}>Gestión de medicamento</Menu.Item>
          <Menu.Item key="8" icon={<ApartmentOutlined />}>Gestión de tipo de medicamento</Menu.Item>
          <Menu.Item key="9" icon={<MoreOutlined />}>Gestión de tipo de medida</Menu.Item>
          <Menu.Item key="10" icon={<LogoutOutlined />}>Cerrar sesion</Menu.Item>
          
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ padding: '16px' }}>
          <Button
            type="primary"
            onClick={toggleSidebar}
            style={{ marginBottom: '16px', display: collapsed ? 'block' : 'none' }}
          >
            <MenuUnfoldOutlined />
          </Button>
          <Button
            type="primary"
            onClick={toggleSidebar}
            style={{ marginBottom: '16px', display: collapsed ? 'none' : 'block' }}
          >
            <MenuFoldOutlined />
          </Button>

          <div style={{ background: '#fff', height: '100%', padding: 24 }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NavbarAdmin;
