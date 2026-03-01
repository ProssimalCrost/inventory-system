import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar          from './components/shared/Navbar';
import ProductsPage    from './pages/ProductsPage';
import RawMaterialsPage from './pages/RawMaterialsPage';
import ProductionPage  from './pages/ProductionPage';

export default function App() {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"              element={<Navigate to="/products" replace />} />
          <Route path="/products"      element={<ProductsPage />} />
          <Route path="/raw-materials" element={<RawMaterialsPage />} />
          <Route path="/production"    element={<ProductionPage />} />
        </Routes>
      </main>
    </div>
  );
}
