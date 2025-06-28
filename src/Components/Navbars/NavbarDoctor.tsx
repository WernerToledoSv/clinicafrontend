// src/components/NavbarDoctor.tsx
import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  FileTextOutlined,
  UserOutlined
} from '@ant-design/icons';
import HomeDoctorComponent from '../UserComponents/Doctor/HomeDoctor/HomeDoctorComponent';
import MedicamentoDocComponent from '../UserComponents/Doctor/Medimento/MedicamentoDocComponent';


const { Sider, Content } = Layout;

const NavbarDoctor: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');

  const toggleSidebar = () => setCollapsed(!collapsed);

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <HomeDoctorComponent />;
      case '2':
        return <MedicamentoDocComponent />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggleSidebar} theme="dark" width={250}>
        <div style={{ padding: '16px', textAlign: 'center', color: '#fff', fontSize: '20px' }}>
          {collapsed ? 'Logo' : 'Panel Doctor'}
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
          <Menu.Item key="2" icon={<UserOutlined />}>Medicamentos</Menu.Item>
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

export default NavbarDoctor;
