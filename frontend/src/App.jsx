import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { HomePage as StudentHome } from './pages/student';
import {
  DepartmentHome,
  DocumentPage,
  FinalDocumentPage,
   RequestPage,
} from './pages/faculty';
import { Notification } from './components/common';
import { useNotification } from './hooks';

function App() {
  const { notification, closeNotification } = useNotification();

  return (
    <Router>
      {/* Global Notification */}
      {notification?.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
          show={notification.show}
        />
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/HomePage" element={<StudentHome />} />
        <Route path="/DepartmentHome" element={<DepartmentHome />} />
        <Route path="/request/:id" element={<RequestPage />} />
        <Route path="/document/:id" element={<DocumentPage />} />
        <Route path="/finalDocument/:id" element={<FinalDocumentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;