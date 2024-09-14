import React, { createContext, useReducer, ReactNode } from 'react';
import dayjs from 'dayjs';

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
}

export interface Entry {
  id: string;
  date: dayjs.Dayjs;
  type: 'income' | 'expense';
  amount: number;
  category: string;
}

export interface GlobalState {
  transactions: Transaction[];
  user: null | { fullName: string; email: string; uid: string };
  totalIncome: number;
  totalExpense: number;
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: GlobalState = {
  transactions: [],
  user: null,
  totalIncome: 0,
  totalExpense: 0,
};

const reducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, transactions: [], totalIncome: 0, totalExpense: 0 };
    case 'ADD_TRANSACTION':
      const newTransactions = [...state.transactions, action.payload];
      const updatedIncome = newTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + (curr.amount ?? 0), 0);
      const updatedExpense = newTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + (curr.amount ?? 0), 0);
      return { ...state, transactions: newTransactions, totalIncome: updatedIncome, totalExpense: updatedExpense };
    case 'UPDATE_TOTALS':
      return {
        ...state,
        totalIncome: action.payload.totalIncome,
        totalExpense: action.payload.totalExpense
      };
    default:
      return state;
  }
};

export const GlobalContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
