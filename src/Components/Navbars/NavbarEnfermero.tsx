// src/components/NavbarEnfermero.tsx
import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import HomeEnfermeroComponent from '../UserComponents/Enfermero/HomeEnfermero/HomeEnfermeroComponent';
import InventarioLugarComponent from '../UserComponents/Enfermero/Inventario/InventarioLugarComponent';
import logo from '../../imgs/logoNav.png'


const { Sider, Content } = Layout;

const NavbarEnfermero: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');

  const toggleSidebar = () => setCollapsed(!collapsed);

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <HomeEnfermeroComponent />;
      case '2':
        return <InventarioLugarComponent />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggleSidebar} theme="dark" width={250}>
        <div style={{ padding: '16px', textAlign: 'center', color: '#fff', fontSize: '20px' }}>
          {collapsed ? <img
            src={logo} // Cambia esto por la ruta de tu imagen
            alt="Logo"
            style={{ width: '40px', height: '40px' }} // Ajusta el tamaño como quieras
          />  
          : 'Panel Enfermero'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            if (key === '3') {
              sessionStorage.clear();
              navigate('/Login');
            } else {
              setSelectedKey(key);
            }
          }}
        >
          <Menu.Item key="1" icon={<InfoCircleOutlined />}>Home</Menu.Item>
          <Menu.Item key="2" icon={<MedicineBoxOutlined />}>Medicamentos</Menu.Item>
          <Menu.Item key="3" icon={<LogoutOutlined />}>Cerrar sesión</Menu.Item>
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

export default NavbarEnfermero;
