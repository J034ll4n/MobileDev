// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit'; // Importa a função createSlice do Redux Toolkit

/**
 * @constant authSlice
 * @description Define um "slice" (fatia) do estado Redux para gerenciar a autenticação do usuário.
 * Um slice é uma coleção de reducer logic e actions para uma única feature do aplicativo,
 * simplificando a configuração do Redux.
 */
const authSlice = createSlice({
  name: 'auth', // Nome do slice. Será usado como prefixo para os tipos de ação (ex: 'auth/loginSuccess').
  
  // initialState: Define o estado inicial para este slice.
  initialState: {
    isLoggedIn: false, // Booleano que indica se o usuário está logado (false por padrão).
    user: null,        // Objeto que armazena os dados do usuário logado (nulo por padrão).
  },
  
  // reducers: Objeto contendo funções que definem como o estado pode ser alterado.
  // O Redux Toolkit usa Immer internamente, permitindo que escrevamos lógica de mutação
  // do estado diretamente, mas na realidade, ele cria uma nova cópia de estado imutável.
  reducers: {
    /**
     * @action loginSuccess
     * @description Reducer para lidar com o sucesso do login.
     * Atualiza o estado para indicar que o usuário está logado e armazena seus dados.
     * @param {object} state - O estado atual do slice 'auth'.
     * @param {object} action - O objeto de ação despachado. Espera `action.payload.user`
     * contendo os dados do usuário (ex: { username: 'test', name: 'User Test' }).
     */
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;          // Define isLoggedIn para true
      state.user = action.payload.user; // Armazena os dados do usuário recebidos no payload
    },
    /**
     * @action logout
     * @description Reducer para lidar com a ação de logout.
     * Redefine o estado para indicar que o usuário não está mais logado e limpa seus dados.
     * @param {object} state - O estado atual do slice 'auth'.
     */
    logout: (state) => {
      state.isLoggedIn = false; // Define isLoggedIn para false
      state.user = null;        // Limpa os dados do usuário
    },
  },
});

// Extrai as ações geradas automaticamente pelo createSlice.
// Estas ações são "action creators" que podem ser despachadas no aplicativo.
export const { loginSuccess, logout } = authSlice.actions;

// Exporta o reducer gerado pelo createSlice.
// Este reducer será combinado com outros reducers na store principal do Redux.
export default authSlice.reducer;
