import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <h1>📦 Controle de Estoque</h1>
      <nav>
        <NavLink to="/products"     className={({isActive}) => isActive ? 'active' : ''}>Produtos</NavLink>
        <NavLink to="/raw-materials"className={({isActive}) => isActive ? 'active' : ''}>Matérias-Primas</NavLink>
        <NavLink to="/production"   className={({isActive}) => isActive ? 'active' : ''}>Sugestão de Produção</NavLink>
      </nav>
    </header>
  );
}
