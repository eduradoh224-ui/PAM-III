import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

import Header from '../components/Header';
import CategoryButton from '../components/CategoryButton';
import ProductCard from '../components/ProductCard';
import { categorySummary, featuredProducts } from '../data/products';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header
        title="Forja Shop"
        subtitle="Peças automotivas com estoque ágil"
        rightContent={
          <Pressable style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartText}>🛒 0</Text>
          </Pressable>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>Loja especialista</Text>
          <Text style={styles.heroTitle}>Mais de 1.200 peças para seu veículo</Text>
          <Text style={styles.heroText}>
            Freios, motor, suspensão, direção e acessórios premium para carros e motos.
          </Text>

          <View style={styles.heroActions}>
            <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Products')}>
              <Text style={styles.primaryText}>Ver catálogo</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.secondaryText}>Minha conta</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1.200+</Text>
            <Text style={styles.statLabel}>Itens</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24h</Text>
            <Text style={styles.statLabel}>Entrega</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Avaliação</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <Pressable onPress={() => navigation.navigate('Products')}>
            <Text style={styles.linkText}>Ver tudo</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {categorySummary.map((category) => (
            <CategoryButton
              key={category.name}
              label={category.name}
              emoji={category.emoji}
              isActive={false}
              onPress={() => navigation.navigate('Products', { category: category.name })}
            />
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Peças em destaque</Text>
        </View>

        <View style={styles.grid}>
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              item={product}
              onPress={() => navigation.navigate('ProductDetails', { product })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 20,
    marginTop: 18,
    marginBottom: 18,
  },
  heroTag: {
    color: '#fdba74',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    marginTop: 12,
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
  },
  heroText: {
    marginTop: 10,
    color: '#dbeafe',
    fontSize: 15,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#f97316',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  secondaryText: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 11,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 18,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
  },
  linkText: {
    color: '#f97316',
    fontWeight: '700',
  },
  categoryRow: {
    paddingBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  cartButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  cartText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
});
