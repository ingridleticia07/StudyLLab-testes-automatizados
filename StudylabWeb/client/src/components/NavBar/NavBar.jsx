import React from "react";
import { Link } from "react-router-dom";
import NavLink from "../NavLink/NavLink";

const Navbar = () => {
  return (
    <div>
        <nav className="flex justify-between items-center py-4 px-8 bg-white rounded-full gap-64 mt-10 ml-[1vw] mr-[1vw]">
            <div className="text-americanOrange-500 font-urbanist text-5xl">
                <Link to="/inicio">Study<strong>Lab</strong></Link>
            </div>
            <div className="flex items-center space-x-6">
                <NavLink to="/inicio" text="Início" link/>
                <NavLink to="/sobre" text="Sobre" link/>
                <NavLink to="/contato " text="Contato" link/>
                <NavLink to="/" text="Entrar na Conta" login />
                <NavLink to="/cadastro" text="Criar minha conta" cadastro />
            </div>
        </nav>
    </div>
  );
};

export default Navbar;
