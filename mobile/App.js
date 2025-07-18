// App.js
import React from 'react'; // Importa a biblioteca React
import { NavigationContainer } from '@react-navigation/native'; // Importa o contêiner de navegação do React Navigation
import { Provider } from 'react-redux'; // Importa o Provider do React Redux para disponibilizar a store

import { store } from './src/store/store'; // Importa a store (loja) Redux configurada
import AppNavigator from './src/navigation/AppNavigator'; // Importa o navegador principal da aplicação

/**
 * @function App
 * @description Componente raiz da aplicação.
 * Este componente configura os provedores globais necessários para o funcionamento do aplicativo,
 * como o Redux Store (para gerenciamento de estado) e o React Navigation (para navegação entre telas).
 * É o ponto de entrada principal onde a estrutura de navegação é montada.
 */
export default function App() {
  return (
    // Provider: Componente do React Redux que torna a store Redux disponível para todos os componentes filhos.
    // Qualquer componente aninhado pode acessar o estado global e despachar ações.
    <Provider store={store}>
      {/* NavigationContainer: Componente do React Navigation que gerencia o estado de navegação da aplicação.
        Ele deve envolver toda a estrutura de navegadores (Stack, Tab, Drawer, etc.).
      */}
      <NavigationContainer>
        {/* AppNavigator: O componente que define toda a estrutura de navegação da aplicação.
          Ele decide qual fluxo de navegação (autenticação ou principal) deve ser exibido.
        */}
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}