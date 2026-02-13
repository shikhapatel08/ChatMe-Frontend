import { BrowserRouter as Router, Routes } from 'react-router-dom';
import AppRoutes from './Routes/AppRoutes';
import { ToastContainer } from 'react-toastify'
import { ModalProvider } from './Context/ModalContext';


function App() {

  return (
    <>
      <Router>
        <ModalProvider>
          <ToastContainer position='top-right' />
          <AppRoutes />
        </ModalProvider>
      </Router>
    </>
  )
}

export default App
