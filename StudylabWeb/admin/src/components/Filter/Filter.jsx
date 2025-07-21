import React, { useState, useRef, useEffect } from 'react';

const CourseFilter = ({ setCursoFilter }) => {
  const [showCourses, setShowCourses] = useState(false);
  const dropdownRef = useRef(null);

  const courses = [
    { id: 0, name: 'Todos os curso' },
    { id: 1, name: 'Engenharia de Software' },
    { id: 2, name: 'Ciência da Computação' },
    { id: 3, name: 'Engenharia Civil' },
    { id: 4, name: 'Engenharia de Produção' },
    { id: 5, name: 'Engenharia Mecânica' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCourses(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCourseSelect = (courseId) => {
    
    setCursoFilter(courseId)
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-between rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-28" // Increased width slightly
          onClick={() => setShowCourses(!showCourses)}
        >
          Curso
          {/* Heroicon for dropdown arrow */}
          <svg
            className="-mr-1 h-5 w-5" // Adjusted margin to be closer
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {showCourses && (
        <div
            className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" // z-10 to ensure it's above table
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {courses.map((course) => (
              <a
                key={course.id}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  handleCourseSelect(course.id);
                }}
              >
                {course.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseFilter;