import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';

import Header from '../components/Header';
import CategoryButton from '../components/CategoryButton';
import ProductCard from '../components/ProductCard';
import { productCategories, products } from '../data/products';

export default function ProductsScreen({ navigation, route }) {
  const initialCategory = route.params?.category || 'Todos';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const categories = [{ name: 'Todos', emoji: '🏁' }, ...productCategories];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  return (
    <View style={styles.container}>
      <Header
        title="Catálogo"
        subtitle={`${filteredProducts.length} peças automotivas`}
        rightContent={
          <Pressable style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartText}>🛒</Text>
          </Pressable>
        }
      />

      <View style={styles.filterBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          data={categories}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <CategoryButton
              label={item.name}
              emoji={item.emoji}
              isActive={activeCategory === item.name}
              onPress={() => setActiveCategory(item.name)}
            />
          )}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  filterBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 12,
    paddingLeft: 16,
  },
  filterList: {
    paddingRight: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cartButton: {
    backgroundColor: '#f97316',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartText: {
    fontSize: 18,
  },
});
