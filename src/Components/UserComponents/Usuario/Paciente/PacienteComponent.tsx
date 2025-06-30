// src/components/HomeEnfermeroComponent.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Input, Select, Button, Table, Tag, Spin, Typography } from 'antd';
import { LoginResponse } from '../../../../Interfaces/InterfacesResponse/Login/LoginResponse';
import { PacienteRq } from '../../../../Interfaces/InterfacesResponse/Paciente/PacienteInterfase';
import ToastNotifier, { ToastNotifierRef } from '../../../Alertas/ToastNotifier'; 
import { Formik } from 'formik';
import { ObtenerPacienteByIdLugar } from '../../../../Services/Paciente/PacienteService';
import { AgregarPaciente } from '../../../../Services/Paciente/PacienteService';


const { Title } = Typography;
const { Option } = Select;

const PacienteComponent: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginResponse | null>(null);
  const [pacientes, setPacientes] = useState<PacienteRq[]>([]);
  const toastRef = useRef<ToastNotifierRef>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const storedLogin = sessionStorage.getItem('Login');
    if (storedLogin) {
      try {
        const loginData = JSON.parse(storedLogin);
        setLoginData(loginData);
        CargarPacientesByLugar(loginData?.idLugar ?? 0);
      } catch (error) {
        toastRef.current?.showMessage({
          severity: 'error',
          summary: 'No se pudo obtener el inventario',
          detail: 'Contactese con el administrador',
          });
      }
    }
  }, []);

  //Tabla de pacientes
  const columnasPacientes = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombres', dataIndex: 'nombres', key: 'nombres' },
    { title: 'Apellidos', dataIndex: 'apellidos', key: 'apellidos' },
    { title: 'Edad', dataIndex: 'edad', key: 'edad' },
    { 
      title: 'Sexo', 
      dataIndex: 'sexo', 
      key: 'sexo',
      render: (sexo: string) => (
        <Tag color={sexo === 'm' ? 'blue' : 'magenta'}>{sexo === 'm' ? 'Masculino' : 'Femenino'}</Tag>
      )
    },
    { title: 'Celular', dataIndex: 'cel', key: 'cel' },
    { title: 'Dirección', dataIndex: 'direccion', key: 'direccion' },
    { title: 'Lugar', dataIndex: 'nombreLugar', key: 'idLugar' },
  ];
  //cargar pacientes
  const CargarPacientesByLugar = async (idLugar: number)=>{
    setIsLoading(true);
    try {
      const response = await ObtenerPacienteByIdLugar(idLugar);

      if (response.code === 1) {
        setPacientes(response.items);
      }      

    } catch (error) {
      toastRef.current?.showMessage({
        severity: 'error',
        summary: 'No se pudo obtener el inventario',
        detail: 'Contactese con el administrador',
      });
    }
    finally{
      setIsLoading(false);
    }
  }
  

  //Handler
    const handleSubmit = async (
        values: PacienteRq,
        { resetForm }: { resetForm: () => void }
      ) => 
    {
      setIsLoading(true);
      try {
        values.idLugar = loginData?.idLugar;
        const response = await AgregarPaciente(values);
        if (response.code === 1) {
          toastRef.current?.showMessage({
            severity: 'success',
            summary: 'Exito en el ingreso del inventario',
            detail: response.message,
          });
        }
        else{
          toastRef.current?.showMessage({
            severity: 'info',
            summary: 'No se pudó ingresar el paciente',
            detail: response.message,
          });
        }
      } catch (error) {
        toastRef.current?.showMessage({
            severity: 'error',
            summary: 'No se pudó ingresar el paciente',
            detail: 'Contactese con el administrador',
            });
      }
      finally{
        resetForm();
        CargarPacientesByLugar(loginData?.idLugar ?? 0);
        setIsLoading(false);
      }

    }

  return (
    <div style={{ padding: '24px' }}>
      <Spin spinning={isLoading} tip="Cargando...">
         <ToastNotifier ref={toastRef} />
         <Title level={2} style={{ textAlign: 'center' }}>Formulario de registro de pacientes de {loginData?.nombreLugar}</Title>
         <Formik initialValues={new PacienteRq()} onSubmit={handleSubmit}>
                {({ values, handleChange, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                    <Input
                      name="nombres"
                      placeholder="Nombres"
                      size="large"
                      style={{ marginBottom: 24 }}
                      value={values.nombres || ''}
                      onChange={handleChange}
                    />

                    <Input
                      name="apellidos"
                      placeholder="Apellidos"
                      size="large"
                      style={{ marginBottom: 24 }}
                      value={values.apellidos || ''}
                      onChange={handleChange}
                    />

                    <Input
                      name="edad"
                      type="number"
                      placeholder="Edad"
                      size="large"
                      style={{ marginBottom: 24 }}
                      value={values.edad ?? ''}
                      onChange={handleChange}
                      min={0}
                    />

                    <Select
                      placeholder="Sexo"
                      size="large"
                      style={{ width: '100%', marginBottom: 24 }}
                      value={values.sexo || undefined}
                      onChange={(value) => setFieldValue('sexo', value)}
                      allowClear
                    >
                      <Option value="m">Masculino</Option>
                      <Option value="f">Femenino</Option>
                    </Select>

                    <Input
                      name="cel"
                      placeholder="Celular"
                      size="large"
                      style={{ marginBottom: 24 }}
                      value={values.cel || ''}
                      onChange={handleChange}
                    />

                    <Input
                      name="direccion"
                      placeholder="Dirección"
                      size="large"
                      style={{ marginBottom: 24 }}
                      value={values.direccion || ''}
                      onChange={handleChange}
                    />

                    <Button type="primary" htmlType="submit" block>
                      Guardar
                    </Button>
                </form>
                )}
            </Formik>

        <Title level={2} style={{ textAlign: 'center' }}>Tabla de pacientes de {loginData?.nombreLugar}</Title>
         <Table
          dataSource={pacientes}
          columns={columnasPacientes}
          rowKey="Id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
          />
      </Spin>
    </div>
  );
};

export default PacienteComponent;
