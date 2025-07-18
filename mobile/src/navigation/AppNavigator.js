// src/navigation/AppNavigator.js
import React from 'react';
// Importa navegadores do React Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importa hook do Redux para acessar o estado global
import { useSelector } from 'react-redux';

// Importa ícones da biblioteca @expo/vector-icons (Ionicons para home/settings, MaterialIcons para outros usos potenciais)
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Importa as telas do aplicativo
import LoginScreen from '../screens/LoginScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Cria instâncias dos navegadores
const AuthStack = createNativeStackNavigator();    // Navegador de pilha para o fluxo de autenticação
const AppStack = createNativeStackNavigator();     // Navegador de pilha principal do aplicativo
const BottomTab = createBottomTabNavigator();      // Navegador de abas inferiores

/**
 * @function AuthNavigator
 * @description Define o navegador de pilha para o fluxo de autenticação do aplicativo.
 * Contém a tela de Login e pode ser expandido para incluir outras telas de autenticação
 * (ex: Registro, Recuperação de Senha).
 */
const AuthNavigator = () => (
  <AuthStack.Navigator 
    screenOptions={{ headerShown: false }} // Oculta o cabeçalho padrão para todas as telas neste navegador
  >
    <AuthStack.Screen 
      name="Login"           // Nome da rota para a tela de Login
      component={LoginScreen} // Componente da tela de Login
    />
  </AuthStack.Navigator>
);

/**
 * @function MainTabsNavigator
 * @description Define o navegador de abas inferiores (Bottom Tab Navigator) para as telas principais
 * do aplicativo após o login. Ele organiza as telas de "Início" (lista de produtos)
 * e "Configurações" em uma barra de navegação persistente na parte inferior da tela.
 */
const MainTabsNavigator = () => {
  return (
    <BottomTab.Navigator
      // screenOptions: Configurações globais para todas as abas dentro deste navegador
      screenOptions={({ route }) => ({
        // tabBarActiveTintColor: Cor do ícone e texto da aba ativa
        tabBarActiveTintColor: '#2567e8', 
        // tabBarInactiveTintColor: Cor do ícone e texto da aba inativa
        tabBarInactiveTintColor: '#888',
        // tabBarStyle: Estilos aplicados à barra de abas em si
        tabBarStyle: {
          height: 60,              // Altura fixa da barra de abas inferior
          paddingBottom: 0,        // Zera o padding inferior explícito (SafeAreaView lida com insets)
          paddingTop: 1,           // Pequeno padding superior para o conteúdo da aba
          backgroundColor: '#fff', // Fundo branco da barra de abas
          borderTopWidth: 0,       // Remove a borda superior padrão (para evitar a "linha branca")
          elevation: 0,            // Remove a sombra de elevação no Android
          shadowOpacity: 0,        // Remove a opacidade da sombra no iOS
          shadowOffset: { width: 0, height: 0 }, // Zera o deslocamento da sombra no iOS
          shadowRadius: 0,         // Zera o raio da sombra no iOS
        },
        // tabBarLabelStyle: Estilos aplicados ao texto (rótulo) de cada aba
        tabBarLabelStyle: {
          fontSize: 12,            // Tamanho da fonte do rótulo
          fontWeight: 'bold',      // Negrito
          marginTop: 2,            // Pequeno espaço entre o ícone e o texto
        },
        // tabBarIcon: Função para renderizar o ícone de cada aba dinamicamente
        tabBarIcon: ({ focused, color, size }) => {
          let iconName; // Variável para armazenar o nome do ícone

          // Define o ícone com base no nome da rota e no estado 'focused' (ativo/inativo)
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline'; // Ícone de casa (preenchido/contorno)
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline'; // Ícone de configurações (preenchido/contorno)
            return <Ionicons name={iconName} size={size} color={color} />;
          }
          // Caso precise de outros ícones, pode adicionar mais condições aqui
          // return <MaterialIcons name="shopping-cart" size={size} color={color} />;
        },
        // headerShown: Oculta o cabeçalho padrão fornecido pelo navegador de pilha pai
        headerShown: false,
      })}
    >
      {/* Aba "Início": Exibe a lista de produtos */}
      <BottomTab.Screen
        name="HomeTab"              // Nome interno da rota da aba (usado para navegação e ícone)
        component={ProductListScreen} // Componente da tela de lista de produtos
        options={{
          title: 'Início',          // Título exibido na barra de abas
        }}
      />
      {/* Aba "Configurações": Exibe as opções de configuração do aplicativo */}
      <BottomTab.Screen
        name="SettingsTab"          // Nome interno da rota da aba
        component={SettingsScreen}  // Componente da tela de configurações
        options={{
          title: 'Configurações',   // Título exibido na barra de abas
        }}
      />
    </BottomTab.Navigator>
  );
};

/**
 * @function MainAppNavigator
 * @description Define o navegador de pilha principal do aplicativo para o usuário logado.
 * Ele engloba o `MainTabsNavigator` (barra de abas inferior) e a `ProductDetailsScreen`.
 * A `ProductDetailsScreen` é mantida fora das abas para que a barra inferior desapareça
 * quando o usuário navega para os detalhes de um produto, proporcionando uma experiência
 * de tela cheia para os detalhes.
 */
const MainAppNavigator = () => (
  <AppStack.Navigator 
    initialRouteName="MainTabs" // Define 'MainTabs' como a rota inicial ao entrar neste navegador
  >
    <AppStack.Screen
      name="MainTabs"             // Rota para o navegador de abas (que contém Início e Configurações)
      component={MainTabsNavigator} // Componente do navegador de abas
      options={{ headerShown: false }} // Oculta o cabeçalho padrão para o navegador de abas
    />
    <AppStack.Screen
      name="ProductDetails"         // Rota para a tela de detalhes do produto
      component={ProductDetailsScreen} // Componente da tela de detalhes
      options={({ route }) => ({ 
        // Define o título do cabeçalho da tela de detalhes, usando o título do produto
        title: route.params?.productTitle || 'Detalhes do Produto' 
      })}
    />
  </AppStack.Navigator>
);

/**
 * @function AppNavigator
 * @description O navegador raiz e principal do aplicativo. Ele decide qual fluxo de navegação
 * exibir com base no estado de autenticação do usuário (logado ou não logado).
 * Utiliza o estado `isLoggedIn` do Redux para fazer essa decisão.
 */
const AppNavigator = () => {
  // `useSelector` para obter o estado de login do Redux Store
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Renderiza o navegador apropriado:
  // Se o usuário estiver logado, exibe o fluxo principal do aplicativo (MainAppNavigator).
  // Caso contrário, exibe o fluxo de autenticação (AuthNavigator).
  return isLoggedIn ? <MainAppNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
