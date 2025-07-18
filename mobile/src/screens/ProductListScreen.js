// src/screens/ProductListScreen.js
import React from 'react';
import { 
  View,           // Contêiner básico para layout usando flexbox
  Text,           // Componente para exibir texto
  StyleSheet,     // API para criar folhas de estilo CSS-like
  TouchableOpacity, // Componente de botão que responde ao toque com opacidade
  StatusBar,      // Componente para controlar a barra de status do dispositivo
  Platform        // API para detectar a plataforma atual (iOS, Android, web)
} from 'react-native';

// Importa o navegador de abas superiores do React Navigation
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Importa o hook para acesso ao objeto de navegação
import { useNavigation } from '@react-navigation/native';

// Importa o componente CategoryProductList, responsável por renderizar a lista de produtos por categoria
import CategoryProductList from '../components/CategoryProductList';

// Cria uma instância do navegador de abas superiores
const Tab = createMaterialTopTabNavigator();

/**
 * @function ProductListScreen
 * @description Tela principal que exibe um catálogo de produtos, organizado por categorias
 * através de um navegador de abas superiores (Top Tab Navigator).
 * Esta tela também inclui um cabeçalho personalizado e gerencia a barra de status.
 */
const ProductListScreen = () => {
  // Hook para acessar o objeto de navegação, permitindo a transição entre telas
  const navigation = useNavigation();

  return (
    // Contêiner principal da tela. Define o layout flexível para ocupar todo o espaço
    // e ajusta o padding superior para a barra de status em Android.
    <View style={styles.container}> 
      {/* StatusBar: Componente para estilizar a barra de status do sistema (cor, estilo do texto) */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header: View que funciona como um cabeçalho personalizado.
        Ele cria um espaço acima da barra de abas superiores, empurrando-a para baixo,
        conforme o design desejado.
      */}
      <View style={styles.header}>
        {/*
          headerTitle: Título exibido no cabeçalho. 
          Pode ser personalizado ou removido se apenas o espaço for necessário.
        */}

      </View>

      {/* Contêiner principal para o Top Tab Navigator.
        'flex: 1' garante que este View ocupe todo o espaço restante após o cabeçalho.
      */}
      <View style={{ flex: 1 }}> 
        {/* Tab.Navigator: Componente que cria a navegação de abas na parte superior.
          Gerencia a exibição de diferentes telas (abas) para cada categoria de produtos.
        */}
        <Tab.Navigator
          // screenOptions: Configurações globais para todas as abas dentro deste navegador
          screenOptions={{
            // tabBarActiveTintColor: Cor do ícone e texto da aba ativa (azul do tema)
            tabBarActiveTintColor: '#2567e8',
            // tabBarInactiveTintColor: Cor do ícone e texto da aba inativa (cinza)
            tabBarInactiveTintColor: '#888',
            // tabBarIndicatorStyle: Estilo da linha indicadora abaixo da aba ativa
            tabBarIndicatorStyle: {
              backgroundColor: '#2567e8', // Cor do indicador (azul do tema)
              height: 5,                  // Altura da linha indicadora
              borderRadius: 1.5,          // Borda arredondada da linha indicadora
            },
            // tabBarStyle: Estilos aplicados à barra de abas em si (fundo, sombras, altura)
            tabBarStyle: {
              backgroundColor: '#fff', // Fundo branco da barra de abas
              elevation: 0,             // Remove sombra no Android
              shadowOpacity: 0,         // Remove opacidade da sombra no iOS
              shadowOffset: { width: 0, height: 0 }, // Zera deslocamento da sombra no iOS
              shadowRadius: 0,          // Zera o raio da sombra no iOS
              borderBottomWidth: 0,     // Remove borda inferior padrão da barra de abas
              height: 50,               // Altura explícita da barra de abas superiores
            },
            // tabBarLabelStyle: Estilos aplicados ao texto (rótulo) de cada aba
            tabBarLabelStyle: {
              fontSize: 14,             // Tamanho da fonte do rótulo
              fontWeight: 'bold',       // Texto em negrito
              textTransform: 'none',    // Impede que o texto seja convertido para maiúsculas
            },
            // tabBarPressColor: Cor de feedback ao tocar em uma aba
            tabBarPressColor: '#e0e0e0',
          }}
        >
          {/* Tab.Screen para a categoria "Produtos Masculinos" */}
          <Tab.Screen
            name="Produtos Masculinos" // Nome da aba exibido na interface
            // children: Função que retorna o componente a ser renderizado quando esta aba estiver ativa
            children={() => (
              <CategoryProductList
                categories={['mens-shirts', 'mens-shoes', 'mens-watches']} // Categorias masculinas para esta aba
                navigation={navigation} // Passa o objeto de navegação para o componente filho
              />
            )}
          />
          {/* Tab.Screen para a categoria "Produtos Femininos" */}
          <Tab.Screen
            name="Produtos Femininos" // Nome da aba exibido na interface
            children={() => (
              <CategoryProductList
                categories={['womens-bags', 'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches']} // Categorias femininas
                navigation={navigation}
              />
            )}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

// --- Folha de Estilos do Componente ProductListScreen ---
const styles = StyleSheet.create({
  // container: Estilo para o contêiner View principal da tela
  container: {
    flex: 1,                          // Ocupa todo o espaço vertical disponível
    backgroundColor: '#fff',          // Fundo branco da tela
    // paddingTop condicional para Android: Ajusta o conteúdo abaixo da barra de status
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
  },
  // header: Estilo para o View que serve como cabeçalho customizado acima das abas
  header: {
    height: 20,                       // Altura fixa do cabeçalho
    backgroundColor: '#fff',          // Cor de fundo do cabeçalho
    justifyContent: 'center',         // Centraliza o conteúdo (título) verticalmente
    alignItems: 'flex-start',         // Alinha o conteúdo (título) à esquerda
    paddingHorizontal: 20,            // Espaçamento horizontal para o conteúdo do cabeçalho
    // borderBottomWidth: 1,             // Exemplo de estilo para uma borda inferior no cabeçalho
    // borderBottomColor: '#eee',
  },
  // headerTitle: Estilo para o texto do título dentro do cabeçalho
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  // Outros estilos (como os de CategoryProductList.js, ProductCard.js, etc.)
  // estariam definidos em seus respectivos arquivos para manter a modularidade.
});

export default ProductListScreen;
