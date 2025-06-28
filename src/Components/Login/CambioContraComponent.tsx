import React from 'react';
import { Formik } from 'formik';
import { Card, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

type CambioContraProps = {
  onBackToLogin: () => void;
};

type ChangePasswordForm = {
  username: string;
  newPassword: string;
  confirmPassword: string;
};

const CambioContraComponent: React.FC<CambioContraProps> = ({ onBackToLogin }) => {
  const handleSubmit = (values: ChangePasswordForm) => {
    console.log('Formulario enviado:', values);
    // Aquí podrías validar que las contraseñas coincidan y hacer la solicitud al backend
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card
        title={<Title level={4} style={{ margin: 0 }}>Cambio de Contraseña</Title>}
        style={{ width: '100%', maxWidth: 500 }}
      >
        <Formik<ChangePasswordForm>
          initialValues={{ username: '', newPassword: '', confirmPassword: '' }}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values, isSubmitting }) => (
            <form onSubmit={e => { e.preventDefault(); handleSubmit(values); }}>
              <div style={{ marginBottom: 30 }}>
                <Input
                  id="username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  placeholder="Usuario"
                  prefix={<UserOutlined />}
                  size="large"
                />
              </div>

              <div style={{ marginBottom: 30 }}>
                <Input.Password
                  id="newPassword"
                  name="newPassword"
                  value={values.newPassword}
                  onChange={handleChange}
                  placeholder="Nueva contraseña"
                  prefix={<LockOutlined />}
                  size="large"
                />
              </div>

              <div style={{ marginBottom: 30 }}>
                <Input.Password
                  id="confirmPassword"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmar contraseña"
                  prefix={<LockOutlined />}
                  size="large"
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isSubmitting}
                >
                  Confirmar cambio
                </Button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Button type="link" onClick={onBackToLogin} style={{ fontSize: '0.85rem' }}>
                  Volver al login
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default CambioContraComponent;
