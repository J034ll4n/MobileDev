// src/components/CategoryProductList.js
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View,           // Contêiner básico para layout
  Text,           // Exibição de texto
  FlatList,       // Componente para renderizar listas grandes de forma performática
  ActivityIndicator, // Indicador de carregamento visual
  StyleSheet,     // API para criar folhas de estilo
  TouchableOpacity, // Componente de botão com feedback de opacidade
  RefreshControl  // Componente para funcionalidade "pull-to-refresh" na lista
} from 'react-native';

// Importa hooks do Redux para interagir com o store
import { useDispatch, useSelector } from 'react-redux';
// Importa o thunk de Redux Toolkit para buscar produtos por categoria (se Redux estiver em uso)
import { fetchProductsByCategory } from '../store/productSlice';
// Importa a função de API para buscar produtos por categoria diretamente (se não usar Redux Thunk para a busca)
import { getProductsByCategory } from '../services/api';

// Importa o componente ProductCard, que representa um item individual na lista de produtos
import ProductCard from './ProductCard';

/**
 * @function CategoryProductList
 * @description Componente funcional que exibe uma lista de produtos de categorias específicas.
 * Gerencia o carregamento de dados da API, estados de carregamento e erro,
 * e a renderização dos produtos em formato de grade.
 * @param {object} props - Propriedades passadas para o componente.
 * @param {string[]} props.categories - Um array de strings com os nomes das categorias de produtos a serem carregados.
 * @param {object} props.navigation - O objeto de navegação do React Navigation, usado para navegar para a tela de detalhes do produto.
 */
const CategoryProductList = ({ categories, navigation }) => {
  // Hook useDispatch para despachar ações para o store Redux (não usado na lógica de busca direta aqui)
  const dispatch = useDispatch(); 

  // --- Estados do Componente ---
  // Estado para armazenar a lista de produtos carregados
  const [products, setProducts] = useState([]);
  // Estado para controlar o indicador de carregamento
  const [isLoading, setIsLoading] = useState(true);
  // Estado para armazenar mensagens de erro (se a requisição falhar)
  const [error, setError] = useState(null);
  // Estado para controlar a funcionalidade de "pull-to-refresh"
  const [refreshing, setRefreshing] = useState(false);

  /**
   * @function loadProducts
   * @description Função assíncrona responsável por buscar os produtos de todas as categorias especificadas.
   * Utiliza a API `getProductsByCategory` e combina os resultados, removendo duplicatas.
   * Gerencia os estados de carregamento e erro durante o processo.
   * @callback
   */
  const loadProducts = useCallback(async () => {
    setIsLoading(true);   // Ativa o indicador de carregamento
    setError(null);       // Limpa qualquer erro anterior
    try {
      let allProducts = [];
      // Itera sobre cada categoria fornecida
      for (const category of categories) {
        // Realiza a chamada à API para obter produtos da categoria atual
        const categoryProducts = await getProductsByCategory(category);
        // Adiciona os produtos da categoria ao array geral
        allProducts = [...allProducts, ...categoryProducts];
      }
      // Remove produtos duplicados (caso um produto apareça em múltiplas categorias, o que é raro com dummyjson)
      // Converte para Set para unicidade e depois de volta para Array
      const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.id, item])).values());
      setProducts(uniqueProducts); // Atualiza o estado com os produtos únicos
    } catch (err) {
      console.error("Erro ao carregar produtos:", err); // Loga o erro no console
      setError(err.message || 'Falha ao carregar os produtos.'); // Define a mensagem de erro para exibição
    } finally {
      setIsLoading(false);    // Desativa o indicador de carregamento
      setRefreshing(false);   // Desativa o estado de "refreshing" (se for pull-to-refresh)
    }
  }, [categories]); // A função é recriada apenas se as categorias mudarem

  /**
   * @useEffect
   * @description Hook que executa a função `loadProducts` uma vez quando o componente é montado
   * e sempre que a função `loadProducts` for recriada (devido a mudanças nas `categories`).
   */
  useEffect(() => {
    loadProducts();
  }, [loadProducts]); // `loadProducts` é uma dependência do useEffect devido ao `useCallback`

  /**
   * @function onRefresh
   * @description Lida com o evento de "pull-to-refresh".
   * Ativa o estado de `refreshing` e chama `loadProducts` para recarregar os dados.
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  /**
   * @function renderProductItem
   * @description Função de renderização para cada item na FlatList.
   * Retorna um componente ProductCard configurado com os dados do produto e um onPress.
   * @param {object} param0 - Objeto contendo o item atual a ser renderizado.
   * @param {object} param0.item - O objeto de produto individual.
   * @returns {JSX.Element} Um componente ProductCard.
   */
  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item} // Passa todos os dados do produto para o ProductCard
      onPress={() => 
        // Navega para a tela de Detalhes do Produto, passando o ID e o título como parâmetros
        navigation.navigate('ProductDetails', { productId: item.id, productTitle: item.title })
      }
    />
  );

  // --- Renderização Condicional da Interface do Usuário ---

  // 1. Exibição do indicador de carregamento (spinner)
  if (isLoading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2567e8" /> {/* Spinner azul */}
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  // 2. Exibição de mensagem de erro, se a requisição falhar
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadProducts} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Exibição de mensagem quando não há produtos (e não está carregando)
  if (products.length === 0 && !isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Nenhum produto encontrado nesta categoria.</Text>
        <TouchableOpacity onPress={loadProducts} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Recarregar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Renderização da lista de produtos (FlatList)
  return (
    <FlatList
      data={products} // Dados a serem renderizados na lista
      keyExtractor={(item) => String(item.id)} // Função para extrair uma chave única para cada item
      renderItem={renderProductItem} // Função que renderiza cada item da lista
      contentContainerStyle={styles.listContainer} // Estilos para o contêiner do conteúdo da lista
      numColumns={2} // Renderiza os itens em 2 colunas, criando um layout de grade
      columnWrapperStyle={styles.row} // Estilos para o invólucro de cada linha (útil para espaçamento entre colunas)
      refreshControl={ // Configura a funcionalidade "pull-to-refresh"
        <RefreshControl 
          refreshing={refreshing} // Estado atual do refresh
          onRefresh={onRefresh}   // Função chamada quando o usuário "puxa para atualizar"
          colors={['#2567e8']}    // Cor do spinner de refresh (azul do tema)
        /> 
      }
    />
  );
};

// --- Folha de Estilos do Componente CategoryProductList ---
const styles = StyleSheet.create({
  // centered: Estilo para centralizar conteúdo em tela cheia (usado para loading, erro, vazio)
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8', // Fundo cinza claro
  },
  // loadingText: Estilo para o texto de carregamento
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  // errorText: Estilo para o texto de mensagem de erro
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  // emptyText: Estilo para o texto de "nenhum produto encontrado"
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  // retryButton: Estilo para o botão "Tentar Novamente" / "Recarregar"
  retryButton: {
    backgroundColor: '#2567e8', // Cor de fundo do botão (azul do tema)
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  // retryButtonText: Estilo para o texto do botão de tentar novamente
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // listContainer: Estilo para o contêiner do conteúdo da FlatList
  listContainer: {
    paddingTop: 10,     // Padding na parte superior da lista
    paddingBottom: 80,  // Padding na parte inferior para que o último item não seja cortado
                        // pela barra de navegação inferior (Bottom Tab Bar).
                        // Este valor deve ser maior que a altura da Bottom Tab Bar.
  },
  // row: Estilo para o invólucro de cada linha na grade de 2 colunas
  row: {
    justifyContent: 'space-between', // Distribui os itens uniformemente na linha
    marginHorizontal: 7.5,           // Margem horizontal para compensar a margem dos cards
                                     // e criar espaçamento nas bordas da lista e entre colunas.
  },
});

export default CategoryProductList;
