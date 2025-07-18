// src/screens/ProductDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View,           // Contêiner básico para layout
  Text,           // Exibição de texto
  Image,          // Componente para exibir imagens
  ScrollView,     // Contêiner com funcionalidade de rolagem
  StyleSheet,     // API para criar folhas de estilo
  ActivityIndicator, // Indicador de carregamento (spinner)
  Alert,          // API para exibir caixas de diálogo de alerta
  Dimensions,     // API para obter as dimensões da tela do dispositivo
  Platform,       // Para ajustar padding para iOS/Android se necessário (geralmente via SafeAreaView/insets)
  StatusBar       // Para ajustar a barra de status se necessário
} from 'react-native';

// Importa o hook useRoute do React Navigation para acessar os parâmetros da rota
import { useRoute } from '@react-navigation/native';
// Importa a função de API para buscar detalhes de um produto específico
import { getProductDetails } from '../services/api'; 

// Obtém a largura da janela para calcular dimensões responsivas, especialmente para a imagem principal
const { width } = Dimensions.get('window');

/**
 * @function ProductDetailsScreen
 * @description Componente de tela que exibe os detalhes completos de um produto específico.
 * Carrega os dados do produto através de uma API com base no ID recebido por parâmetro
 * de navegação e gerencia os estados de carregamento e erro. O layout segue o Figma.
 */
const ProductDetailsScreen = () => {
  // useRoute: Hook para acessar o objeto de rota, que contém os parâmetros passados na navegação
  const route = useRoute();
  // Extrai o 'productId' dos parâmetros da rota. Este ID é usado para buscar os detalhes do produto.
  const { productId } = route.params;

  // --- Estados do Componente ---
  // product: Estado para armazenar os detalhes do produto carregado
  const [product, setProduct] = useState(null);
  // isLoading: Estado para controlar a exibição do indicador de carregamento
  const [isLoading, setIsLoading] = useState(true);
  // error: Estado para armazenar mensagens de erro (se a requisição falhar)
  const [error, setError] = useState(null);

  /**
   * @useEffect
   * @description Hook que executa a função `loadProductDetails` quando o componente é montado
   * ou quando o `productId` muda.
   */
  useEffect(() => {
    /**
     * @function loadProductDetails
     * @description Função assíncrona responsável por buscar os detalhes de um produto específico
     * usando o `productId`. Gerencia os estados de carregamento e erro durante a requisição.
     */
    const loadProductDetails = async () => {
      setIsLoading(true); 
      setError(null);     
      try {
        const data = await getProductDetails(productId);
        setProduct(data); 
      } catch (err) {
        console.error("Erro ao carregar detalhes do produto:", err);
        setError(err.message || 'Não foi possível carregar os detalhes do produto.');
        Alert.alert('Erro', err.message || 'Não foi possível carregar os detalhes do produto.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetails(); 
  }, [productId]); 

  // --- Renderização Condicional da Interface do Usuário ---

  // 1. Exibição do indicador de carregamento (spinner) enquanto os dados estão sendo buscados
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2567e8" /> {/* Usando a cor azul do tema */}
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  // 2. Exibição de mensagem de erro ou "não encontrado" se a requisição falhar ou o produto não existir
  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Detalhes do produto não encontrados.'}</Text>
      </View>
    );
  }

  // Calcula o preço com desconto com base no preço original e porcentagem de desconto
  const originalPrice = product.price;
  const discountedPriceValue = originalPrice - (originalPrice * product.discountPercentage / 100);

  return (
    // ScrollView: Permite que o conteúdo da tela seja rolado se for muito extenso
    <ScrollView style={styles.container}>
      {/* mainImageContainer: Contêiner para a imagem principal do produto, com padding e fundo branco */}
      <View style={styles.mainImageContainer}>
        {product.images && product.images.length > 0 && (
          <Image 
            source={{ uri: product.images[0] }} 
            style={styles.mainImage} 
            resizeMode="contain" 
          />
        )}
      </View>
      
      {/* infoContent: Contêiner para as informações textuais do produto (sem o card branco explícito) */}
      <View style={styles.infoContent}>
        <Text style={styles.title}>{product.title}</Text>
        
        {/* priceContainer: View para exibir os preços formatados (descontado e original) */}
        <View style={styles.priceContainer}>
          {/* discountedPrice: Exibe o preço final (com desconto), com destaque */}
          <Text style={styles.discountedPrice}>R$ {discountedPriceValue.toFixed(2)}</Text>
          {/* originalPrice: Exibe o preço original riscado, se houver desconto */}
          {product.discountPercentage > 0 && (
            <Text style={styles.originalPrice}>R$ {originalPrice.toFixed(2)}</Text>
          )}
        </View>

        {/* description: Exibe a descrição completa do produto */}
        <Text style={styles.description}>{product.description}</Text>

        {/*
          Removido: Marca, Categoria, Estoque, Avaliação
          Conforme a nova imagem do Figma, essas informações não estão mais visíveis nesta tela.
          Se precisar delas novamente, reintroduza-as aqui.
        */}
        {/* <Text style={styles.brand}>Marca: {product.brand}</Text> */}
        {/* <Text style={styles.category}>Categoria: {product.category}</Text> */}
        {/* <Text style={styles.stock}>Estoque: {product.stock} unidades</Text> */}
        {/* <Text style={styles.rating}>Avaliação: {product.rating} ⭐</Text> */}
      </View>
    </ScrollView>
  );
};

// --- Folha de Estilos do Componente ProductDetailsScreen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,                          // Ocupa todo o espaço vertical disponível
    backgroundColor: '#fff',          // Fundo branco (conforme Figma, não tem cinza no fundo principal)
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8', // Fundo cinza para telas de loading/erro
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  // mainImageContainer: Novo contêiner para a imagem principal, para aplicar padding e fundo
  mainImageContainer: {
    width: '100%',
    backgroundColor: '#fff', // Fundo branco para a área da imagem
    paddingVertical: 20,     // Padding vertical para a imagem
    alignItems: 'center',    // Centraliza a imagem horizontalmente
    borderBottomWidth: 1,    // Borda inferior sutil, como no Figma
    borderBottomColor: '#eee',
  },
  // mainImage: Estilo da imagem principal do produto dentro do seu contêiner
  mainImage: {
    width: width * 0.8,      // 80% da largura da tela, como na imagem do Figma
    height: width * 0.8,     // Altura igual à largura para um formato quadrado
    resizeMode: 'contain',   // Garante que a imagem caiba sem cortar
  },
  // infoContent: Contêiner para as informações textuais abaixo da imagem
  infoContent: {
    padding: 20,             // Padding geral para todo o conteúdo de texto
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,         // Espaço menor após o título, conforme Figma
    color: '#333',
  },

  category: {
    // Removido da exibição conforme Figma.
    // fontSize: 14,
    // color: '#888',
    // marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',  // Alinha pela linha de base dos textos
    marginBottom: 20,        // Espaço maior entre preços e descrição
    marginTop: 5,            // Espaço entre título e preços
  },
  originalPrice: {
    fontSize: 16,            // Tamanho um pouco maior para o preço riscado
    color: '#888',
    textDecorationLine: 'line-through',
    marginLeft: 10,          // Espaço à esquerda do preço riscado
  },
  discountedPrice: {
    fontSize: 28,            // Tamanho maior para o preço com desconto, como no Figma
    fontWeight: 'bold',
    color: '#E91E63',           // Cor mais escura para o preço principal
  },
  discountPercentage: {
    // Removido da exibição conforme Figma.
    // fontSize: 14,
    // color: '#E91E63',
    // fontWeight: 'bold',
  },
  descriptionHeader: {
    // Removido, pois a descrição não tem um cabeçalho separado no Figma.
    // fontSize: 18,
    // fontWeight: 'bold',
    // marginTop: 10,
    // marginBottom: 5,
    // color: '#333',
  },
  description: {
    fontSize: 16,            // Tamanho da fonte da descrição
    color: '#555',
    lineHeight: 24,          // Altura da linha para melhor legibilidade
    marginBottom: 15,        // Padding inferior do ScrollView (se precisar)
  },
  stock: {
    // Removido da exibição conforme Figma.
    // fontSize: 14,
    // color: '#666',
    // marginBottom: 5,
  },
  rating: {
    // Removido da exibição conforme Figma.
    // fontSize: 14,
    // color: '#666',
  },
});

export default ProductDetailsScreen;
