import { useState } from 'react';
import CollapsableNavBar from "./components/CollapsableNavBar";
import HomePage from "./pages/HomePage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="App">
      <CollapsableNavBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <HomePage sidebarOpen={sidebarOpen} />
    </div>
  );
}

export default App;
