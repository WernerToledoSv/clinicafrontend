import { Tabs } from 'antd';
import InventarioComponent from './InventarioComponent';
import InventarioAsigComponent from './InventarioAsigComponent';

const { TabPane } = Tabs;

const InventarioComponentTab = () => {
  return (
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="Agregar inventario" key="1">
        <InventarioComponent />
      </TabPane>
      <TabPane tab="Asignacion de medicamento" key="2">
        <InventarioAsigComponent />
      </TabPane>
    </Tabs>
  );
};

export default InventarioComponentTab;
