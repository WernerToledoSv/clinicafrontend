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
          Tiene una pestaña llamada <strong>Medicamentos</strong> en la cual se mostrará el stock de cada lugar de manera automática
          y solo tendrá la opción de extraer medicamento
          <br/>
          <br/>
          <strong> Importante:</strong>
          <br/>
          En caso de que se cometa un error al momento de la salida del medicamento tendrá que hablar con los encargados del sistema 
          <strong> Werner Toledo, Gabriela Gonzalez o Josue Rivas </strong> 
          para hacer la respectiva motificación.
        </Card>
    </div>
  );
};

export default HomeEnfermeroComponent;
