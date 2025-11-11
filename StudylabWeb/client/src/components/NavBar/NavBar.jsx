import { Link } from "react-router-dom";
import NavLink from "../NavLink/NavLink";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div>
        <nav className="flex justify-between items-center py-4 px-8 bg-white mt-10 md:gap-64 ml-[1vw] mr-[1vw] rounded-full">
            <div className="text-americanOrange-500 font-urbanist text-[clamp(24px,8vw,64px)]">
                <Link to="/inicio">Study<strong>Lab</strong></Link>
            </div>
            <div className=" hidden md:flex items-center space-x-6">
                <NavLink to="/inicio" text="Início" link/>
                <NavLink to="/sobre" text="Sobre" link/>
                <NavLink to="/contato " text="Contato" link/>
                <NavLink to="/" text="Entrar na Conta" login />
                <NavLink to="/cadastro" text="Criar minha conta" cadastro />
            </div>

            <div className="md:hidden ml-[48vw]" onClick={() => setIsMenuOpen(!isMenuOpen)}>

              <button className = "text-3xl ">
                ☰
              </button>
            </div>
        </nav>
        {isMenuOpen ?(<div className = "md:hidden bg-white w-full shadow-lg">
          <div className = "flex flex-col items-center py-4">
             <NavLink to="/inicio" text="Início" link/>
              <NavLink to="/sobre" text="Sobre" link/>
              <NavLink to="/contato " text="Contato" link/>
              <NavLink to="/" text="Entrar na Conta" login />
              <NavLink to="/cadastro" text="Criar minha conta" cadastro />
          </div>
        </div>): null} 
    </div>
  );
};

export default Navbar;
