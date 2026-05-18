import React, { useState, useRef, useEffect } from 'react';
import { icons } from '../../assets/assets';

const CourseFilter = ({ setCursoFilter, setCurrentPage }) => {
    const [showCourses, setShowCourses] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({ id: 0, name: 'Todos os curso' });
    const [dropdownStyle, setDropdownStyle] = useState({});
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

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
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setShowCourses(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!showCourses && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: 'fixed',
                top: rect.bottom + 4,
                left: rect.left,
                width: Math.max(rect.width, 224), // mínimo 224px (sm:w-56)
                zIndex: 9999,
            });
        }
        setShowCourses(prev => !prev);
    };

    const handleCourseSelect = (course) => {
        setCurrentPage(1);
        setSelectedCourse(course);
        setCursoFilter(course.id);
        setShowCourses(false);
    };

    return (
        <div className="relative w-full sm:w-auto text-left">
            <button
                ref={buttonRef}
                type="button"
                className="inline-flex w-full sm:w-auto items-center gap-2 justify-between sm:justify-left rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleToggle}
            >
                <span className="flex items-center gap-2">
                    <img src={icons.filter} alt="Filtro" className="w-5 h-5" />
                    {selectedCourse.name}
                </span>
                <img src={icons.arrowBottom} alt="Filtro" className="w-5 h-5" />
            </button>

            {showCourses && (
                <div
                    ref={dropdownRef}
                    style={dropdownStyle}
                    className="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="py-1" role="none">
                        {courses.map((course) => (
                            <a
                                key={course.id}
                                href="#"
                                style={{ textDecoration: 'none' }}
                                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-gray-900 ${
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