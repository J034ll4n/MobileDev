// src/components/ProductCard.js
import React from 'react';
import { 
  View,           // Contêiner básico para layout
  Text,           // Exibição de texto
  Image,          // Componente para exibir imagens
  TouchableOpacity, // Componente de botão que responde ao toque com opacidade
  StyleSheet,     // API para criar folhas de estilo
  Dimensions      // API para obter as dimensões da tela do dispositivo
} from 'react-native';

// Obtém a largura da janela para calcular a largura dos cards de forma responsiva
const { width } = Dimensions.get('window');

// Calcula a largura de cada card, considerando que serão 2 colunas e haverá um espaçamento
// O ajuste '- 15' é para criar um gap total de 15px (7.5px de margem em cada lado do card)
const cardWidth = (width / 2) - 15; 

/**
 * @function ProductCard
 * @description Componente reutilizável para exibir um único produto em uma lista ou grade.
 * Formata e apresenta a imagem, título, descrição e preços (original e com desconto) do produto.
 * @param {object} props - Propriedades passadas para o componente.
 * @param {object} props.product - O objeto de produto contendo informações como thumbnail, title, description, price, discountPercentage.
 * @param {function} props.onPress - Função de callback executada quando o card é pressionado.
 */
const ProductCard = ({ product, onPress }) => {
  // Extrai o preço original do objeto do produto
  const originalPrice = product.price;

  // Formata o preço original para ter 2 casas decimais
  const formattedOriginalPrice = originalPrice.toFixed(2);
  
  // Calcula o preço com desconto e o formata para 2 casas decimais
  const formattedDiscountedPrice = (originalPrice - (originalPrice * product.discountPercentage / 100)).toFixed(2);

  return (
    // TouchableOpacity: Torna o card clicável e adiciona feedback visual de opacidade ao toque
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image: Exibe a imagem em miniatura do produto */}
      <Image
        source={{ uri: product.thumbnail }} // URL da imagem do produto
        style={styles.image}                // Estilos específicos da imagem
        resizeMode="contain"                // Ajusta a imagem para caber dentro de suas dimensões
      />
      {/* infoContainer: View que agrupa as informações de texto do produto (título, descrição, preços) */}
      <View style={styles.infoContainer}>
        {/* title: Exibe o título do produto, limitado a 2 linhas */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        {/* description: Exibe uma breve descrição do produto, limitada a 3 linhas */}
        <Text style={styles.description} numberOfLines={3}>
          {product.description}
        </Text>

        {/* priceContainer: View que agrupa os textos de preço (descontado e original) */}
        <View style={styles.priceContainer}>
          {/* discountedPrice: Exibe o preço final (com desconto), com destaque */}
          <Text style={styles.discountedPrice}>R$ {formattedDiscountedPrice}</Text>
          {/* originalPrice: Exibe o preço original riscado, apenas se houver um desconto aplicado */}
          {product.discountPercentage > 0 && (
            <Text style={styles.originalPrice}>R$ {formattedOriginalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- Folha de Estilos do Componente ProductCard ---
const styles = StyleSheet.create({
  // card: Estilo do contêiner principal de cada produto (o "card" em si)
  card: {
    backgroundColor: '#fff',          // Fundo branco
    borderRadius: 8,                  // Cantos arredondados
    margin: 5.5,                      // Margem externa para criar espaçamento entre os cards
    width: cardWidth,                 // Largura calculada para se ajustar à grade de 2 colunas
    // Sombras para dar um efeito de elevação (3D)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,                     // Elevação para Android (simula sombra)
  },
  // image: Estilo da imagem do produto dentro do card
  image: {
    width: '100%',                    // Ocupa toda a largura do card
    height: 120,                      // Altura fixa da imagem
    marginBottom: 10,                 // Espaço abaixo da imagem
    borderRadius: 8,                  // Cantos arredondados para a imagem
    // As bordas inferior e paddingBottom foram removidas para seguir o Figma
    // borderBottomWidth: 1,
    // borderBottomColor: '#e0e0e0',
    // paddingBottom: 10,
  },
  // infoContainer: Estilo para o contêiner de texto que fica abaixo da imagem
  infoContainer: {
    flex: 1,                          // Ocupa o espaço restante verticalmente
    paddingTop: 0,                    // Removido padding superior, pois a borda da imagem foi retirada
    paddingHorizontal: 10,            // Padding nas laterais do texto
    paddingBottom: 10,                // Padding na parte inferior do texto
  },
  // title: Estilo para o título do produto
  title: {
    fontSize: 16,                     // Tamanho da fonte
    fontWeight: 'bold',               // Negrito
    color: '#333',                    // Cor do texto
    marginBottom: 5,                  // Espaço abaixo do título
  },
  // brand: Estilo para a marca do produto. Comentado conforme o Figma não a exibe
  // brand: {
  //   fontSize: 12,
  //   color: '#666',
  //   marginBottom: 5,
  // },
  // description: Estilo para a descrição breve do produto
  description: {
    fontSize: 12,                     // Tamanho da fonte
    color: '#555',                    // Cor do texto
    marginBottom: 10,                 // Espaço abaixo da descrição
    lineHeight: 16,                   // Altura da linha para melhor legibilidade
  },
  // priceContainer: Estilo para o contêiner dos textos de preço
  priceContainer: {
    flexDirection: 'row',             // Preços lado a lado
    alignItems: 'baseline',           // Alinha os textos pela linha de base
    marginTop: 'auto',                // Empurra este contêiner para a parte inferior do infoContainer
                                      // garantindo que os preços fiquem na base do card,
                                      // independentemente da altura do título/descrição.
  },
  // originalPrice: Estilo para o preço original (riscado)
  originalPrice: {
    fontSize: 13,                     // Tamanho da fonte
    color: '#888',                    // Cor cinza
    textDecorationLine: 'line-through', // Efeito de texto riscado
    marginLeft: 8,                    // Espaço à esquerda (após o preço com desconto)
  },
  // discountedPrice: Estilo para o preço com desconto (preço principal)
  discountedPrice: {
    fontSize: 18,                     // Tamanho da fonte maior
    fontWeight: 'bold',               // Negrito
    color: '#333',                    // Cor do texto
  },
});

export default ProductCard;
