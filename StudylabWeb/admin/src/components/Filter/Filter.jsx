import React, { useState, useRef, useEffect } from 'react';
import { icons } from '../../assets/assets';

const CourseFilter = ({ setCursoFilter, setCurrentPage }) => {
  const [showCourses, setShowCourses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({ id: 0, name: 'Todos os curso' });
  const dropdownRef = useRef(null);
  const prevCursoFilter = useRef('');

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

  const handleCourseSelect = (course) => {
    if (prevCursoFilter.current !== course)
      setCurrentPage(1)

    setSelectedCourse(course);
    setCursoFilter(course.id);
    setShowCourses(false);

    prevCursoFilter.current = course;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center gap-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setShowCourses(!showCourses)}
      >
        <img src={icons.filter} alt="Filtro" className="w-5 h-5" />
        Filtro
      </button>

      {showCourses && (
        <div
          className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {courses.map((course) => (
              <a
                key={course.id}
                href="#"
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                  course.id === selectedCourse.id ? 'bg-gray-100 font-semibold' : ''
                }`}
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  handleCourseSelect(course);
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
