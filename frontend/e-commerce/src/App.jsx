import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import { Routes, Route} from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";

import { Toaster } from "react-hot-toast";
import ProductPage from "./pages/ProductPage";
                                                                    
function App() {
  const {theme} = useThemeStore();
  
  return (
  <div className="  min-h-screen bg-base-200 transition-colors duration-300" >
    <Navbar/>
    
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
    <Toaster/>
  </div>
  );
}
export default App