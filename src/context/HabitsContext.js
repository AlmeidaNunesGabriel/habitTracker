import React, { createContext, useState, useContext } from 'react';

const HabitsContext = createContext();

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([
    { id: '1', name: 'Meditar', completed: false },
    { id: '2', name: 'Exercitar', completed: true },
    { id: '3', name: 'Ler um Livro', completed: false },
  ]);

  const addHabit = (name, description) => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      description,
      completed: false,
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  return (
    <HabitsContext.Provider value={{ habits, addHabit }}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => useContext(HabitsContext);
