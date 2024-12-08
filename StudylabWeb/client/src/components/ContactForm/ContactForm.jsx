
function ContactForm() {
  return (
    <div className="flex justify-center items-center">
      <form className="bg-white p-6 rounded-lg border-[0.2px] border-americanOrange-500 w-[38rem]">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Seu nome
          </label>
          <input
            type="text"
            id="name"
            placeholder="Nome completo"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Seu e-mail
          </label>
          <input
            type="email"
            id="email"
            placeholder="@ Seu e-mail"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
            Sua mensagem
          </label>
          <textarea
            id="message"
            placeholder="Sugestões, ideias...."
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Enviar mensagem
        </button>
      </form>
    </div>
  );
}

export default ContactForm;