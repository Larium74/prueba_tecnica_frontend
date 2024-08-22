import React, { createContext, useState, useEffect } from 'react';

// Crea el contexto
const UserContext = createContext();

// Crea el proveedor del contexto
export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(() => {
    // Obtener el email del almacenamiento local al iniciar
    return localStorage.getItem('userEmail') || null;
  });

  useEffect(() => {
    // Guardar el email en almacenamiento local cuando cambie
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [userEmail]);

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

// Exporta el contexto para que otros componentes puedan acceder a él
export default UserContext;