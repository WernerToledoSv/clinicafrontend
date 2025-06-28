// src/components/HomeEnfermeroComponent.tsx
import React from 'react';
import { Typography, Card, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const HomeEnfermeroComponent: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={1} style={{ textAlign: 'center' }} >Bienvenido Doctor/a</Title>
      <Paragraph style={{ textAlign: 'center', fontSize: '24px' }}>
        Desde aquí puedes acceder a las funciones disponibles para tu rol.
      </Paragraph>

        <Card title="Gestión de Inventario" bordered hoverable style={{ fontSize: '24px' }}>
          Tiene una pestaña llamada <strong>Medicamentos</strong> solo podra visualizar el stock por lugar que se tiene.
          <br/>
          <br/>
          <strong> Importante:</strong>
          <br/>
          Cualquier consulta del sistema puede acercarse a:  
          <strong> Werner Toledo, Gabriela Gonzalez o Josue Rivas </strong> 
          para hacer la respectiva motificación.
        </Card>
    </div>
  );
};

export default HomeEnfermeroComponent;
