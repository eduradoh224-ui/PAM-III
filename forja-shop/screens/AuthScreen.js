import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';

const maskPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export default function AuthScreen({ navigation, profile, setProfile }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: 'Cliente Forja',
    email: 'cliente@forjashop.com.br',
    phone: '(11) 99999-0000',
    password: '123456',
    confirmPassword: '123456',
  });
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    if (field === 'phone') {
      setForm((prev) => ({ ...prev, [field]: maskPhone(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    if (!form.email || !form.password) {
      setError('Preencha e-mail e senha.');
      return;
    }

    const emailMatches = profile.email?.toLowerCase() === form.email.trim().toLowerCase();
    const passwordMatches = profile.password === form.password;

    if (emailMatches && passwordMatches) {
      setError('');
      navigation.navigate('Home');
      return;
    }

    if (profile.email?.toLowerCase() === form.email.trim().toLowerCase() || profile.password === form.password) {
      setError('E-mail ou senha inválidos.');
      return;
    }

    setError('Conta não encontrada. Cadastre-se primeiro.');
  };

  const handleSignUp = () => {
    if (!form.name || !form.email || !form.password) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }

    if (form.password.length < 4) {
      setError('A senha precisa ter pelo menos 4 caracteres.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    const user = {
      ...profile,
      name: form.name,
      email: form.email.trim(),
      phone: form.phone || profile.phone,
      password: form.password,
      address: profile.address || {
        recipient: form.name,
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },
      card: profile.card || {
        holder: form.name.toUpperCase(),
        number: '4242 4242 4242 4242',
        expiry: '12/30',
        cvv: '123',
      },
    };

    setProfile(user);
    setError('');
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.brand}>Forja Shop</Text>
        <Text style={styles.subtitle}>Peças automotivas premium</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Pressable
            style={[styles.switchButton, mode === 'login' && styles.switchButtonActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.switchText, mode === 'login' && styles.switchTextActive]}>Login</Text>
          </Pressable>
          <Pressable
            style={[styles.switchButton, mode === 'signup' && styles.switchButtonActive]}
            onPress={() => setMode('signup')}
          >
            <Text style={[styles.switchText, mode === 'signup' && styles.switchTextActive]}>Cadastro</Text>
          </Pressable>
        </View>

        {mode === 'login' ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={form.email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(value) => updateField('email', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={form.password}
              secureTextEntry
              onChangeText={(value) => updateField('password', value)}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryText}>Entrar</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={form.name}
              onChangeText={(value) => updateField('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={form.email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(value) => updateField('email', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={form.phone}
              onChangeText={(value) => updateField('phone', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={form.password}
              secureTextEntry
              onChangeText={(value) => updateField('password', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              value={form.confirmPassword}
              secureTextEntry
              onChangeText={(value) => updateField('confirmPassword', value)}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable style={styles.primaryButton} onPress={handleSignUp}>
              <Text style={styles.primaryText}>Criar conta</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    color: '#64748b',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  switchRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  switchButtonActive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fdba74',
  },
  switchText: {
    fontWeight: '700',
    color: '#475569',
  },
  switchTextActive: {
    color: '#111827',
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#111827',
  },
  primaryButton: {
    marginTop: 6,
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  error: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 12,
  },
});
