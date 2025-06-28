// src/components/HomeEnfermeroComponent.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;



const HomeEnfermeroComponent: React.FC = () => {
  const [Lugar, setLugar] = useState<string | null>(null);
  useEffect(() => {
    const storedLogin = sessionStorage.getItem('Login');
    if (storedLogin) {
      try {
        const loginData = JSON.parse(storedLogin);
        setLugar(loginData?.nombreLugar ?? null);
      } catch (error) {
        console.error('Error al parsear la sesión:', error);
      }
    }
  }, []);
  
  return (
    <div style={{ padding: '24px' }}>
      <Title level={1} style={{ textAlign: 'center' }} >Bienvenido Enfermero/a</Title>
      <Paragraph style={{ textAlign: 'center', fontSize: '24px' }}>
        Desde aquí puedes acceder a las funciones disponibles para tu rol.
      </Paragraph>

        <Card title="Gestión de Inventario" bordered hoverable style={{ fontSize: '24px' }}>
          Tiene una pestaña llamada <strong>Medicamentos</strong> esta mostrará el stock de <strong>{Lugar} </strong> 
          en el cual solo tendrá la opción de extraer medicamentos.
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
