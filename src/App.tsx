import { BrowserRouter } from 'react-router-dom';
import './App.css'
import AppRoutes from './Routes/AppRoutes';


function App() {
  return (
    <>
      <BrowserRouter>
      <div>
        <AppRoutes />
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
