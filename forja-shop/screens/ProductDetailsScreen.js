import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

export default function ProductDetailsScreen({ navigation, route }) {
  const product = route.params?.product;

  if (!product) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      <View style={[styles.imageBox, { backgroundColor: product.color || '#e2e8f0' }]}>
        <Text style={styles.emoji}>{product.emoji || '🔧'}</Text>
      </View>

      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.name}>{product.name}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.rating}>⭐ {product.rating} / 5</Text>
        <Text style={styles.stock}>{product.stock} em estoque</Text>
      </View>

      <View style={styles.priceBox}>
        <Text style={styles.priceLabel}>Preço por unidade</Text>
        <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Descrição</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.detailGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Marca</Text>
          <Text style={styles.detailValue}>{product.brand}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>SKU</Text>
          <Text style={styles.detailValue}>{product.sku}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Compatibilidade</Text>
          <Text style={styles.detailValue}>{product.compatibility}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Peso</Text>
          <Text style={styles.detailValue}>{product.weight} kg</Text>
        </View>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Cart')}>
        <Text style={styles.primaryText}>Adicionar ao carrinho</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backText: {
    color: '#1f2937',
    fontSize: 15,
    fontWeight: '700',
  },
  imageBox: {
    height: 220,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emoji: {
    fontSize: 90,
  },
  category: {
    color: '#f97316',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },
  name: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 34,
  },
  infoRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    color: '#f59e0b',
    fontWeight: '700',
  },
  stock: {
    color: '#0f766e',
    fontWeight: '700',
  },
  priceBox: {
    marginTop: 18,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  priceLabel: {
    color: '#64748b',
    fontSize: 12,
  },
  price: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  description: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 24,
  },
  detailGrid: {
    marginTop: 18,
    gap: 12,
  },
  detailItem: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailLabel: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#f97316',
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
  },
});
