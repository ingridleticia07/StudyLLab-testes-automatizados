const HomeFooter = () => {
  return (
    <footer className="bg-americanOrange-500 text-white py-6 px-6 sm:px-12 w-full max-w-screen-xl mx-auto rounded-t-2xl flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 text-center sm:text-left">
        <span className="font-semibold">LearningLab</span>
        <span className="text-sm">Desenvolvido por LearningLab</span>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <a
          href="https://www.instagram.com/learninglabufc/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Instagram
        </a>
        <span className="hidden sm:inline">·</span>
        <a
          href="https://www.linkedin.com/company/projeto-learninglab/?viewAsMember=true"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
};

export default HomeFooter;
