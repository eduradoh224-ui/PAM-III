import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';

export default function ProductCard({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.imageBox, { backgroundColor: item.color || '#f3f4f6' }]}>
        <Text style={styles.emoji}>{item.emoji || '🔧'}</Text>
      </View>

      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
        <Text style={styles.stock}>{item.stock} em estoque</Text>
      </View>

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.priceLabel}>Preço</Text>
          <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.smallTag}>{item.brand}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imageBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 110,
    borderRadius: 14,
    marginBottom: 12,
  },
  emoji: {
    fontSize: 42,
  },
  category: {
    color: '#f97316',
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    minHeight: 36,
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '700',
  },
  stock: {
    color: '#64748b',
    fontSize: 10,
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceLabel: {
    color: '#64748b',
    fontSize: 10,
  },
  price: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  smallTag: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: '700',
  },
});
