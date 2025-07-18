// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'; // Importa a função configureStore do Redux Toolkit

// Importa os reducers de cada "slice" (fatia) do estado da aplicação
import authReducer from './authSlice';    // Reducer para gerenciar o estado de autenticação
import productReducer from './productSlice'; // Reducer para gerenciar o estado dos produtos

/**
 * @constant store
 * @description Configura e cria a store (loja) central do Redux para o aplicativo.
 * A store é o único local onde todo o estado da aplicação é armazenado.
 * `configureStore` é uma função do Redux Toolkit que simplifica a configuração
 * da store, adicionando automaticamente `redux-thunk` e a ferramenta de desenvolvedor do Redux.
 */
export const store = configureStore({
  /**
   * @property {object} reducer
   * @description Um objeto que mapeia os nomes dos slices (fatias) do estado
   * para seus respectivos reducers. Cada reducer é responsável por gerenciar
   * uma parte específica do estado global.
   */
  reducer: {
    // 'auth': O estado de autenticação será gerenciado pelo authReducer
    auth: authReducer,
    // 'products': O estado relacionado a produtos será gerenciado pelo productReducer
    products: productReducer,
  },
  // DevTools: O Redux Toolkit configura automaticamente os Redux DevTools para depuração.
  // Outras opções como middleware personalizado ou preloadedState podem ser adicionadas aqui.
});