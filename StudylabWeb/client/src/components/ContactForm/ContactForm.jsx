import React, { useState } from "react";

function ContactForm() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(null); 

  const validateEmail = (value) => {
    const allowedDomains = ["@alu.ufc.br", "@ufc.br"];
    const isValidDomain = allowedDomains.some((domain) =>
      value.endsWith(domain)
    );
    setIsValid(value.length > 0 ? isValidDomain : null);
    setEmail(value);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <form className="bg-white p-6 rounded-lg border-[0.2px] border-americanOrange-500 w-full lg:w-[34rem] text-sm xs:text-base">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Seu nome</label>
          <input
            type="text"
            id="name"
            placeholder="Nome completo"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-0"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Seu e-mail
          </label>
          <div className="relative">
            <span className={`absolute inset-y-0 left-3 flex items-center ${
                isValid === null
                  ? "text-gray-500"
                  : isValid
                  ? "text-[#00BDEB]" 
                  : "text-[#EB0000]" 
              }`}>@</span>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              placeholder="Seu e-mail"
              className={`w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-0 ${
                isValid === null
                  ? "border-gray-300"
                  : isValid
                  ? "border-[#00BDEB]" 
                  : "border-[#EB0000]" 
              }`}/>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
            Sua mensagem
          </label>
          <textarea
            id="message"
            placeholder="Sugestões, ideias...."
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-0" 
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isValid === false}
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >Enviar mensagem</button>
      </form>
    </div>
  );
}

export default ContactForm;
