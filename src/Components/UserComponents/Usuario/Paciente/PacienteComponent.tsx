// src/components/HomeEnfermeroComponent.tsx
import React from 'react';
import { Typography, Card, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const PacienteComponent: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={1} style={{ textAlign: 'center' }} >Bienvenido Usuario</Title>
      <Paragraph style={{ textAlign: 'center', fontSize: '24px' }}>
        Desde aquí puedes acceder a las funciones disponibles para tu rol.
      </Paragraph>

        <Card title="Gestión de Inventario" bordered hoverable style={{ fontSize: '24px' }}>
          Tiene una pestaña llamada <strong>Pacientes</strong> en la cual se mostrará los pacientes que se esperan atender durante la brigada, 
            <ol style={{ paddingLeft: 20 }}>
                <li>
                    Solo se permite la <strong>salida</strong> de medicamentos. No puede hacer ingresos ni ajustes de stock.
                </li> 
                </ol>  
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

export default PacienteComponent;
