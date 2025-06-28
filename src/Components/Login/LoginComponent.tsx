// src/components/LoginForm.tsx
import type { LoginRequest } from '../../Interfaces/InterfacesResponse/Login/LoginRequest';
import type { LoginProps } from '../../Interfaces/InterfacesResponse/Login/loginProps';
import type { ObjectResponse } from '../../Interfaces/BaseResponse/ObjectResponse';
import type { LoginResponse } from '../../Interfaces/InterfacesResponse/Login/LoginResponse';
import ToastNotifier, { ToastNotifierRef } from '../Alertas/ToastNotifier';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, FormikHelpers  } from 'formik';

import { Card, Input, Button, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';


// URl base para las api
const userApiUrl = import.meta.env.VITE_USER_API;


  const loginApi = async (loginRequest: LoginRequest): Promise<ObjectResponse<LoginResponse>> => {
    const params = new URLSearchParams({
      pUsername: loginRequest.pUserName,
      pPassword: loginRequest.pPassword,
    }).toString();

    const response = await fetch(`${userApiUrl}v1/Login/Validar-Credenciales?${params}`);

    
  const data = await response.json(); 
  return data as ObjectResponse<LoginResponse>;
};


export function LoginComponent({ onChangeView }: LoginProps) {
  const toastRef = useRef<ToastNotifierRef>(null);
  const navigate = useNavigate();
  const { Title } = Typography;

  const handleSubmit = async (
    values: LoginRequest,
    actions: FormikHelpers<LoginRequest>
  ) => {
    try {
      actions.setSubmitting(true);
      
      const response: ObjectResponse<LoginResponse> = await loginApi(values);
      console.log('Login exitoso:', response.item);

      if(response.code === 1){
        sessionStorage.setItem('Login', JSON.stringify(response.item));
        navigate('/home');
      }
      else{
        toastRef.current?.showMessage({
          severity: 'info',
          summary: 'Credenciales incorrectas',
          detail: 'Vuelva a intentarlo'
        });
      }
    } catch (error) {
     

      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'Error en la operación',
        detail: 'Contactese con el administrado'
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <ToastNotifier ref={toastRef} />
      <Card
        title={<Title level={4} style={{ margin: 0 }}>Login</Title>}
        style={{ width: '100%', maxWidth: 500 }}
      >
        <Formik<LoginRequest>
          initialValues={{ pUserName: '', pPassword: '' }}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values, isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: 30 }}>
                <Input
                  id="pUserName"
                  name="pUserName"
                  value={values.pUserName}
                  onChange={handleChange}
                  placeholder="Usuario"
                  prefix={<UserOutlined />}
                  size="large"
                />
              </div>

              <div style={{ marginBottom: 30 }}>
                <Input.Password
                  id="pPassword"
                  name="pPassword"
                  value={values.pPassword}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  prefix={<LockOutlined />}
                  size="large"
                />
              </div>

              <div style={{ marginBottom: 30 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isSubmitting}
                >
                  Entrar
                </Button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Button type="link" onClick={onChangeView} style={{ fontSize: '0.85rem' }}>
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}