import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthScreen from './screens/AuthScreen';

const Stack = createNativeStackNavigator();
function enableWebScroll() {
  if (typeof document === 'undefined') return;

  const root = document.getElementById('root');
  document.body.style.overflow = 'auto';
  document.body.style.height = 'auto';
  document.body.style.minHeight = '100vh';
  document.documentElement.style.overflow = 'auto';
  document.documentElement.style.height = 'auto';
  document.documentElement.style.minHeight = '100vh';

  if (root) {
    root.style.display = 'block';
    root.style.height = 'auto';
    root.style.minHeight = '100vh';
    root.style.flex = '1';
  }
}
const defaultProfile = {
  name: 'Cliente Forja',
  email: 'cliente@forjashop.com.br',
  phone: '(11) 99999-0000',
  password: '123456',
  address: {
    recipient: 'Cliente Forja',
    cep: '01000-000',
    street: 'Av. Paulista',
    number: '1000',
    complement: 'Apto 101',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
  },
  card: {
    holder: 'CLIENTE FORJA',
    number: '4242 4242 4242 4242',
    expiry: '12/30',
    cvv: '123',
  },
  orders: [
    {
      id: 'PED-2026-0001',
      date: '12/09/2026',
      total: 428.9,
      status: 'entregue',
      items: [
        { name: 'Pastilha de Freio Bosch', quantity: 1, price: 189.9 },
        { name: 'Bateria 12V Denso', quantity: 1, price: 239.0 },
      ],
    },
    {
      id: 'PED-2026-0002',
      date: '08/09/2026',
      total: 674.8,
      status: 'em trânsito',
      items: [
        { name: 'Kit de Suspensão Monroe', quantity: 1, price: 399.0 },
        { name: 'Radiador Valeo', quantity: 1, price: 275.8 },
      ],
    },
    {
      id: 'PED-2026-0003',
      date: '02/09/2026',
      total: 321.5,
      status: 'em processamento',
      items: [
        { name: 'Vela NGK', quantity: 2, price: 68.5 },
        { name: 'Filtro de Ar Bosch', quantity: 1, price: 184.5 },
      ],
    },
  ],
};

export default function App() {
  const [profile, setProfile] = useState(defaultProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    enableWebScroll();
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const saved = await AsyncStorage.getItem('forja-profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfile({
            ...defaultProfile,
            ...parsed,
            address: { ...defaultProfile.address, ...(parsed.address || {}) },
            card: { ...defaultProfile.card, ...(parsed.card || {}) },
            orders: parsed.orders?.length ? parsed.orders : defaultProfile.orders,
          });
        }
      } catch (error) {
        // ignora erro de inicialização
      } finally {
        setReady(true);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem('forja-profile', JSON.stringify(profile));
  }, [profile, ready]);

  const contextValue = useMemo(() => ({ profile, setProfile }), [profile]);

  return (
    <View style={{ flex: 1, minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Auth" options={{ title: 'Login' }}>
            {(props) => <AuthScreen {...props} profile={profile} setProfile={setProfile} />}
          </Stack.Screen>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Products" component={ProductsScreen} />
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
          <Stack.Screen name="Cart">
            {(props) => <CartScreen {...props} profile={profile} setProfile={setProfile} />}
          </Stack.Screen>
          <Stack.Screen name="Profile">
            {(props) => <ProfileScreen {...props} profile={profile} setProfile={setProfile} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
