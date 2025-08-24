import React, { useState, useRef, useEffect } from 'react';
import { icons } from '../../assets/assets';

const UserFilter = ({ setUserStatusFiler, setUserTypeFilter, setCurrentPage }) => {
  const [showStatus, setShowStatus] = useState(false);
  const [showType, setShowType] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState({ id: 1, name: 'Todos os status', value: 0 });
  const [selectedType, setSelectedType] = useState({ id: 1, name: 'Todos os tipos', value: 0 });

  const statusDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  const prevStatusFilter = useRef('');
  const prevTypeFilter = useRef('');

  const statusOptions = [
    { id: 1, value: 0, name: 'Todos os status' },
    { id: 2, value: 2, name: 'Ativo' },
    { id: 3, value: 1, name: 'Inativo' }
  ];

  const typeOptions = [
    { id: 1, value: 0, name: 'Todos os tipos' },
    { id: 2, value: 1, name: 'Admin' },
    { id: 3, value: 3, name: 'Aluno' },
    { id: 4, value: 2, name: 'Professor' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setShowStatus(false);
      }
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target)
      ) {
        setShowType(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // define "Todos" como já selecionado ao carregar
    setUserStatusFiler(selectedStatus.value);
    setUserTypeFilter(selectedType.value);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // executa só uma vez ao montar

  const handleStatusSelect = (status) => {
    if (prevStatusFilter.current !== status.value) setCurrentPage(1);

    setSelectedStatus(status);
    setUserStatusFiler(status.value);
    setShowStatus(false);

    prevStatusFilter.current = status.value;
  };

  const handleTypeSelect = (type) => {
    if (prevTypeFilter.current !== type.value) setCurrentPage(1);

    setSelectedType(type);
    setUserTypeFilter(type.value);
    setShowType(false);

    prevTypeFilter.current = type.value;
  };

  return (
    <div className="flex gap-4">
      {/* Dropdown de Status */}
      <div className="relative inline-block text-left" ref={statusDropdownRef}>
        <button
          type="button"
          className="inline-flex items-center gap-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => setShowStatus(!showStatus)}
        >
          <img src={icons.filter} alt="Filtro" className="w-5 h-5" />
          {selectedStatus.name}
        </button>

        {showStatus && (
          <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              {statusOptions.map((status) => (
                <a
                  key={status.id}
                  href="#"
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    status.id === selectedStatus.id ? 'bg-gray-100 font-semibold' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleStatusSelect(status);
                  }}
                >
                  {status.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dropdown de Tipo */}
      <div className="relative inline-block text-left" ref={typeDropdownRef}>
        <button
          type="button"
          className="inline-flex items-center gap-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => setShowType(!showType)}
        >
          <img src={icons.filter} alt="Filtro" className="w-5 h-5" />
          {selectedType.name}
        </button>

        {showType && (
          <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              {typeOptions.map((type) => (
                <a
                  key={type.id}
                  href="#"
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    type.id === selectedType.id ? 'bg-gray-100 font-semibold' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTypeSelect(type);
                  }}
                >
                  {type.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFilter;
