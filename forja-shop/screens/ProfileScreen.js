import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';

const maskCep = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const maskPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const maskCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const maskExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export default function ProfileScreen({ navigation, profile, setProfile }) {
  const [password, setPassword] = useState('');
  const [cardPassword, setCardPassword] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [draft, setDraft] = useState(profile);
  const [cardDraft, setCardDraft] = useState(profile.card || {});

  const cardMask = useMemo(() => {
    if (!profile.card?.number) return '----';
    return profile.card.number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  }, [profile.card]);

  const saveProfileChanges = () => {
    if (!password || password !== profile.password) {
      setError('Digite a senha correta para alterar os dados pessoais.');
      setSuccess('');
      return;
    }

    const next = {
      ...profile,
      ...draft,
      address: { ...profile.address, ...draft.address },
      card: { ...profile.card, ...draft.card },
    };

    setProfile(next);
    setError('');
    setSuccess('Dados pessoais atualizados com sucesso.');
    setPassword('');
    setIsEditingProfile(false);
  };

  const saveAddressChanges = () => {
    setProfile((prev) => ({
      ...prev,
      address: { ...prev.address, ...draft.address },
    }));
    setSuccess('Endereço atualizado com sucesso.');
    setError('');
    setIsEditingAddress(false);
  };

  const saveCardChanges = () => {
    if (!cardPassword || cardPassword !== profile.password) {
      setError('Confirme a senha de login para alterar os dados do cartão.');
      setSuccess('');
      return;
    }

    setProfile((prev) => ({
      ...prev,
      card: { ...prev.card, ...cardDraft },
    }));
    setSuccess('Dados do cartão atualizados com sucesso.');
    setError('');
    setCardPassword('');
    setIsEditingCard(false);
  };

  const handleFieldChange = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddressFieldChange = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  };

  const handleSearchCep = async () => {
    const cep = (draft.address?.cep || '').replace(/\D/g, '');

    if (cep.length !== 8) {
      setCepError('Informe um CEP com 8 dígitos.');
      return;
    }

    setCepLoading(true);
    setCepError('');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      setDraft((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          street: data.logradouro || prev.address?.street || '',
          neighborhood: data.bairro || prev.address?.neighborhood || '',
          city: data.localidade || prev.address?.city || '',
          state: data.uf || prev.address?.state || '',
        },
      }));
    } catch (error) {
      setCepError('CEP não encontrado ou indisponível no momento.');
    } finally {
      setCepLoading(false);
    }
  };

  const handleCardFieldChange = (key, value) => {
    setCardDraft((prev) => ({ ...prev, [key]: value }));
  };

  const requestOrderCancellation = (orderId) => {
    setProfile((prev) => ({
      ...prev,
      orders: (prev.orders || []).map((order) =>
        order.id === orderId ? { ...order, status: 'cancelamento solicitado' } : order
      ),
    }));
    setSuccess('Cancelamento solicitado com sucesso.');
    setError('');
  };

  const orders = profile.orders || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Meu perfil</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.avatar}>🚘</Text>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>
          <Pressable onPress={() => {
            setDraft(profile);
            setIsEditingProfile((prev) => !prev);
            setError('');
            setSuccess('');
          }}>
            <Text style={styles.link}>{isEditingProfile ? 'Cancelar' : 'Editar'}</Text>
          </Pressable>
        </View>

        {isEditingProfile ? (
          <View style={styles.form}>
            <TextInput style={styles.input} value={draft.name} onChangeText={(value) => handleFieldChange('name', value)} placeholder="Nome" />
            <TextInput style={styles.input} value={draft.email} onChangeText={(value) => handleFieldChange('email', value)} placeholder="Email" />
            <TextInput style={styles.input} value={draft.phone} onChangeText={(value) => handleFieldChange('phone', maskPhone(value))} placeholder="Telefone" />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Senha para confirmar" secureTextEntry />
            <Pressable style={styles.primaryButton} onPress={saveProfileChanges}>
              <Text style={styles.primaryText}>Salvar dados</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{profile.name}</Text>
            <Text style={styles.infoLabel}>E-mail</Text>
            <Text style={styles.infoValue}>{profile.email}</Text>
            <Text style={styles.infoLabel}>Telefone</Text>
            <Text style={styles.infoValue}>{profile.phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Pressable onPress={() => {
            setDraft(profile);
            setIsEditingAddress((prev) => !prev);
            setError('');
            setSuccess('');
          }}>
            <Text style={styles.link}>{isEditingAddress ? 'Cancelar' : 'Editar'}</Text>
          </Pressable>
        </View>

        {isEditingAddress ? (
          <View style={styles.form}>
            <TextInput style={styles.input} value={draft.address?.recipient || ''} onChangeText={(value) => handleAddressFieldChange('recipient', value)} placeholder="Destinatário" />
            <View style={styles.cepRow}>
              <TextInput
                style={[styles.input, styles.cepInput]}
                value={draft.address?.cep || ''}
                onChangeText={(value) => handleAddressFieldChange('cep', maskCep(value))}
                placeholder="CEP"
                keyboardType="numeric"
              />
              <Pressable style={styles.searchCepButton} onPress={handleSearchCep}>
                <Text style={styles.searchCepText}>{cepLoading ? 'Buscando...' : 'Buscar'}</Text>
              </Pressable>
            </View>
            {cepError ? <Text style={styles.errorText}>{cepError}</Text> : null}
            <TextInput style={styles.input} value={draft.address?.street || ''} onChangeText={(value) => handleAddressFieldChange('street', value)} placeholder="Rua" />
            <View style={styles.inlineRow}>
              <TextInput style={[styles.input, styles.inlineInput]} value={draft.address?.number || ''} onChangeText={(value) => handleAddressFieldChange('number', value)} placeholder="Número" />
              <TextInput style={[styles.input, styles.inlineInput]} value={draft.address?.complement || ''} onChangeText={(value) => handleAddressFieldChange('complement', value)} placeholder="Complemento" />
            </View>
            <TextInput style={styles.input} value={draft.address?.neighborhood || ''} onChangeText={(value) => handleAddressFieldChange('neighborhood', value)} placeholder="Bairro" />
            <View style={styles.inlineRow}>
              <TextInput style={[styles.input, styles.inlineInput]} value={draft.address?.city || ''} onChangeText={(value) => handleAddressFieldChange('city', value)} placeholder="Cidade" />
              <TextInput style={[styles.input, styles.inlineInputSmall]} value={draft.address?.state || ''} maxLength={2} onChangeText={(value) => handleAddressFieldChange('state', value.toUpperCase())} placeholder="UF" />
            </View>
            <Pressable style={styles.primaryButton} onPress={saveAddressChanges}>
              <Text style={styles.primaryText}>Salvar endereço</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>{profile.address?.recipient || 'Cliente'}</Text>
            <Text style={styles.infoValue}>{profile.address?.street || 'Rua'} {profile.address?.number || ''}</Text>
            <Text style={styles.infoValue}>{profile.address?.neighborhood || 'Bairro'} - {profile.address?.city || 'Cidade'} / {profile.address?.state || 'SP'}</Text>
            <Text style={styles.infoValue}>CEP: {profile.address?.cep || '00000-000'}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cartão principal</Text>
          <Pressable onPress={() => {
            setCardDraft(profile.card || {});
            setIsEditingCard((prev) => !prev);
            setError('');
            setSuccess('');
          }}>
            <Text style={styles.link}>{isEditingCard ? 'Cancelar' : 'Editar'}</Text>
          </Pressable>
        </View>

        {isEditingCard ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={cardDraft.holder || ''}
              onChangeText={(value) => handleCardFieldChange('holder', value)}
              placeholder="Nome do titular"
            />
            <TextInput
              style={styles.input}
              value={cardDraft.number || ''}
              onChangeText={(value) => handleCardFieldChange('number', maskCardNumber(value))}
              placeholder="Número do cartão"
              keyboardType="numeric"
            />
            <View style={styles.inlineRow}>
              <TextInput
                style={[styles.input, styles.inlineInput]}
                value={cardDraft.expiry || ''}
                onChangeText={(value) => handleCardFieldChange('expiry', maskExpiry(value))}
                placeholder="MM/AA"
              />
              <TextInput
                style={[styles.input, styles.inlineInput]}
                value={cardDraft.cvv || ''}
                onChangeText={(value) => handleCardFieldChange('cvv', value.replace(/\D/g, '').slice(0, 4))}
                placeholder="CVV"
                keyboardType="numeric"
              />
            </View>
            <TextInput
              style={styles.input}
              value={cardPassword}
              onChangeText={setCardPassword}
              placeholder="Senha do login para confirmar"
              secureTextEntry
            />
            <Pressable style={styles.primaryButton} onPress={saveCardChanges}>
              <Text style={styles.primaryText}>Salvar cartão</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>Titular</Text>
            <Text style={styles.cardValue}>{profile.card?.holder || 'Cliente Forja'}</Text>
            <Text style={styles.cardLabel}>Número</Text>
            <Text style={styles.cardValue}>{cardMask}</Text>
            <Text style={styles.cardLabel}>Validade</Text>
            <Text style={styles.cardValue}>{profile.card?.expiry || '12/30'}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minhas compras</Text>

        {orders.length === 0 ? (
          <Text style={styles.infoValue}>Nenhuma compra registrada ainda.</Text>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <Pressable onPress={() => setExpandedOrderId((prev) => (prev === order.id ? null : order.id))}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderMeta}>{order.date}</Text>
                  </View>
                  <View style={styles.orderStatusWrap}>
                    <Text style={[styles.orderStatus, order.status === 'cancelado' && styles.cancelledStatus, order.status === 'cancelamento solicitado' && styles.pendingCancelStatus]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              </Pressable>

              {expandedOrderId === order.id && (
                <View style={styles.orderBody}>
                  {order.items?.map((item, index) => (
                    <View key={`${order.id}-${index}`} style={styles.itemRow}>
                      <Text style={styles.orderItem}>{item.name}</Text>
                      <Text style={styles.orderItemQty}>Qtd: {item.quantity}</Text>
                      <Text style={styles.orderItemPrice}>R$ {Number(item.price).toFixed(2)}</Text>
                    </View>
                  ))}

                  <View style={styles.orderTotalRow}>
                    <Text style={styles.orderTotalLabel}>Total</Text>
                    <Text style={styles.orderTotalValue}>R$ {Number(order.total || 0).toFixed(2)}</Text>
                  </View>

                  {order.status !== 'cancelado' && order.status !== 'entregue' && order.status !== 'cancelamento solicitado' && (
                    <Pressable style={styles.cancelButton} onPress={() => requestOrderCancellation(order.id)}>
                      <Text style={styles.cancelButtonText}>Solicitar cancelamento</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {success ? <Text style={styles.successText}>{success}</Text> : null}

      <Pressable style={styles.item} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.itemText}>🏠 Voltar para a loja</Text>
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
    padding: 20,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  back: {
    color: '#1f2937',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    fontSize: 52,
  },
  name: {
    marginTop: 12,
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 20,
  },
  email: {
    color: '#cbd5e1',
    marginTop: 6,
    fontSize: 13,
  },
  section: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  link: {
    color: '#f97316',
    fontWeight: '700',
  },
  infoBox: {
    gap: 6,
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },
  form: {
    gap: 10,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    color: '#111827',
  },
  cepRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  cepInput: {
    flex: 1,
  },
  searchCepButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minWidth: 92,
    alignItems: 'center',
  },
  searchCepText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inlineInput: {
    flex: 1,
  },
  inlineInputSmall: {
    width: 76,
  },
  primaryButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  cardInfo: {
    backgroundColor: '#fff7ed',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fdba74',
  },
  cardLabel: {
    color: '#9a5a1f',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 6,
  },
  cardValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  orderCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginTop: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 15,
  },
  orderMeta: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  orderStatusWrap: {
    alignItems: 'flex-end',
  },
  orderStatus: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  cancelledStatus: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  pendingCancelStatus: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  orderBody: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  orderItem: {
    flex: 1,
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
  },
  orderItemQty: {
    color: '#475569',
    fontSize: 12,
  },
  orderItemPrice: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
  },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  orderTotalLabel: {
    color: '#111827',
    fontWeight: '700',
  },
  orderTotalValue: {
    color: '#111827',
    fontWeight: '800',
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#991b1b',
    fontWeight: '800',
  },
  errorText: {
    marginTop: 18,
    color: '#dc2626',
    fontWeight: '700',
  },
  successText: {
    marginTop: 18,
    color: '#15803d',
    fontWeight: '700',
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  itemText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 15,
  },
});
