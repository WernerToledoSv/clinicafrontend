// src/components/HomeEnfermeroComponent.tsx
import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

const HomeUsuarioComponent: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={1} style={{ textAlign: 'center' }} >Bienvenido Usuario</Title>
      <Paragraph style={{ textAlign: 'center', fontSize: '24px' }}>
        Desde aquí puedes acceder a las funciones disponibles para tu rol.
      </Paragraph>

        <Card title="Gestión de Inventario" bordered hoverable style={{ fontSize: '24px' }}>
          Tiene una pestaña llamada <strong>Pacientes</strong> en la cual se mostrará los pacientes que se esperan atender durante la brigada.
           con su usuario podrá:
            <ol style={{ paddingLeft: 20 }}>
                <li>
                    Buscar pacientes
                </li> 
                <li>Cambiar el estado de citado a atendido</li>
                <li>Agregar paciente</li>
            </ol>
          <strong> Importante:</strong>
          <br/>
          En caso de que se cometa un error al momento del ingreso del paciente tendrá que hablar con los encargados del sistema 
          <strong> Werner Toledo, Gabriela Gonzalez o Josue Rivas </strong> 
          para hacer la respectiva motificación.    
        </Card>
    </div>
  );
};

export default HomeUsuarioComponent;
