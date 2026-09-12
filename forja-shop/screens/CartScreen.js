import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Image } from 'react-native';
import QRCode from 'qrcode';
import { createDynamicPix, hasError } from 'pix-utils';

import { products } from '../data/products';

const maskCep = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
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

const cartItems = products.slice(0, 3).map((product, index) => ({
  ...product,
  quantity: index + 1,
}));

function numeroPorExtenso(numero) {
  const unidades = [
    'zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
    'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'
  ];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  const formatar = (valor) => {
    if (valor < 20) return unidades[valor];
    if (valor < 100) {
      const dezena = Math.floor(valor / 10);
      const unidade = valor % 10;
      return unidade === 0 ? dezenas[dezena] : `${dezenas[dezena]} e ${unidades[unidade]}`;
    }
    if (valor < 1000) {
      const centena = Math.floor(valor / 100);
      const resto = valor % 100;
      if (resto === 0) return centenas[centena];
      return `${centenas[centena]} e ${formatar(resto)}`;
    }
    if (valor < 1000000) {
      const milhar = Math.floor(valor / 1000);
      const resto = valor % 1000;
      if (resto === 0) return `${formatar(milhar)} mil`;
      return `${formatar(milhar)} mil ${formatar(resto)}`;
    }
    return `${formatar(Math.floor(valor / 1000000))} milhão ${valor % 1000000 !== 0 ? `e ${formatar(valor % 1000000)}` : ''}`;
  };

  return formatar(numero);
}

function gerarPixCobrança(valorTotal) {
  const pix = createDynamicPix({
    merchantName: 'Forja Shop',
    merchantCity: 'SAO PAULO',
    url: `https://forjashop.com/pix/${Date.now()}`,
  });

  if (hasError(pix)) {
    return {
      payload: '00020101021226700014BR.GOV.BCB.PIX0136forjashop@pix.com52040000530398654051.005802BR5914Forja Shop6009SAO PAULO62070503***63047A9E',
      valorPorExtenso: numeroPorExtenso(Math.round(valorTotal)),
    };
  }

  return {
    payload: pix.toBRCode(),
    valorPorExtenso: numeroPorExtenso(Math.round(valorTotal)),
  };
}

export default function CartScreen({ navigation, profile, setProfile }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freight = subtotal > 500 ? 0 : 25;
  const total = subtotal + freight;

  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [pixData, setPixData] = useState(() => gerarPixCobrança(total));
  const [copied, setCopied] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [cardForm, setCardForm] = useState({
    holder: profile?.card?.holder || '',
    number: profile?.card?.number || '',
    expiry: profile?.card?.expiry || '',
    cvv: profile?.card?.cvv || '',
  });

  useEffect(() => {
    if (profile?.card) {
      setCardForm((prev) => ({
        ...prev,
        ...profile.card,
      }));
    }
  }, [profile?.card]);
  const [deliveryAddress, setDeliveryAddress] = useState({
    recipient: profile?.address?.recipient || '',
    cep: profile?.address?.cep || '',
    street: profile?.address?.street || '',
    number: profile?.address?.number || '',
    complement: profile?.address?.complement || '',
    neighborhood: profile?.address?.neighborhood || '',
    city: profile?.address?.city || '',
    state: profile?.address?.state || '',
  });

  useEffect(() => {
    if (profile?.address) {
      setDeliveryAddress((prev) => ({
        ...prev,
        ...profile.address,
      }));
    }
  }, [profile?.address]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPixData(gerarPixCobrança(total));
    }, 180000);

    return () => clearInterval(interval);
  }, [total]);

  useEffect(() => {
    setPixData(gerarPixCobrança(total));
  }, [total]);

  const [qrImage, setQrImage] = useState('');

  useEffect(() => {
    const gerarQr = async () => {
      try {
        const value = await QRCode.toDataURL(pixData.payload, {
          width: 180,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: { dark: '#111827', light: '#ffffff' },
          type: 'image/png',
        });
        setQrImage(value);
      } catch (error) {
        try {
          const fallback = await QRCode.toDataURL(pixData.payload, {
            width: 168,
            margin: 1,
            errorCorrectionLevel: 'L',
            color: { dark: '#111827', light: '#ffffff' },
            type: 'image/png',
          });
          setQrImage(fallback);
        } catch {
          setQrImage('');
        }
      }
    };

    gerarQr();
  }, [pixData]);

  const handleCopyPixCode = async () => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(pixData.payload);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = pixData.payload;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  };

  const setField = (field, value) => {
    setCardForm((prev) => ({ ...prev, [field]: value }));
  };

  const setDeliveryField = (field, value) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchCep = async () => {
    const cep = deliveryAddress.cep.replace(/\D/g, '');

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

      setDeliveryAddress((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));
    } catch (error) {
      setCepError('CEP não encontrado ou indisponível no momento.');
    } finally {
      setCepLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Carrinho</Text>
        <Text style={styles.count}>{cartItems.length} itens</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={[styles.imageBox, { backgroundColor: item.color }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>

            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.quantity} unidade(s)</Text>
              <Text style={styles.itemPrice}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.summaryBox}>
        <Text style={styles.paymentTitle}>Endereço de entrega</Text>

        <View style={styles.addressBox}>
          <TextInput
            style={styles.input}
            placeholder="Nome do destinatário"
            value={deliveryAddress.recipient}
            onChangeText={(value) => setDeliveryField('recipient', value)}
          />

          <View style={styles.cepRow}>
            <TextInput
              style={[styles.input, styles.cepInput]}
              placeholder="CEP"
              value={deliveryAddress.cep}
              keyboardType="numeric"
              onChangeText={(value) => setDeliveryField('cep', maskCep(value))}
            />
            <Pressable style={styles.searchCepButton} onPress={handleSearchCep}>
              <Text style={styles.searchCepText}>{cepLoading ? 'Buscando...' : 'Buscar CEP'}</Text>
            </Pressable>
          </View>

          {cepError ? <Text style={styles.errorText}>{cepError}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Rua"
            value={deliveryAddress.street}
            onChangeText={(value) => setDeliveryField('street', value)}
          />

          <View style={styles.inlineRow}>
            <TextInput
              style={[styles.input, styles.inlineInput]}
              placeholder="Número"
              keyboardType="numeric"
              value={deliveryAddress.number}
              onChangeText={(value) => setDeliveryField('number', value)}
            />
            <TextInput
              style={[styles.input, styles.inlineInput]}
              placeholder="Complemento"
              value={deliveryAddress.complement}
              onChangeText={(value) => setDeliveryField('complement', value)}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Bairro"
            value={deliveryAddress.neighborhood}
            onChangeText={(value) => setDeliveryField('neighborhood', value)}
          />

          <View style={styles.inlineRow}>
            <TextInput
              style={[styles.input, styles.inlineInput]}
              placeholder="Cidade"
              value={deliveryAddress.city}
              onChangeText={(value) => setDeliveryField('city', value)}
            />
            <TextInput
              style={[styles.input, styles.inlineInputSmall]}
              placeholder="UF"
              value={deliveryAddress.state}
              maxLength={2}
              onChangeText={(value) => setDeliveryField('state', value.toUpperCase())}
            />
          </View>
        </View>

        <Text style={styles.paymentTitle}>Forma de pagamento</Text>

        <View style={styles.paymentOptions}>
          <Pressable
            style={[styles.paymentOption, paymentMethod === 'pix' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('pix')}
          >
            <Text style={styles.paymentText}>Pix</Text>
          </Pressable>
          <Pressable
            style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('card')}
          >
            <Text style={styles.paymentText}>Cartão</Text>
          </Pressable>
        </View>

        {paymentMethod === 'pix' ? (
          <View style={styles.pixBox}>
            <Text style={styles.pixTimer}>Código expira em 3 minutos</Text>
            <View style={styles.qrContainer}>
              {qrImage ? (
                <Image source={{ uri: qrImage }} style={styles.qrImage} resizeMode="contain" />
              ) : (
                <Text style={styles.qrPlaceholder}>QR Pix</Text>
              )}
            </View>
            <View style={styles.copyRow}>
              <Text style={styles.pixLabel}>Código PIX</Text>
              <Pressable style={styles.copyButton} onPress={handleCopyPixCode}>
                <Text style={styles.copyButtonText}>{copied ? 'Copiado' : 'Copiar código'}</Text>
              </Pressable>
            </View>
            <Text style={styles.pixCode}>{pixData.payload.slice(0, 60)}...</Text>
            <Text style={styles.pixExtenso}>Por extenso: {pixData.valorPorExtenso}</Text>
          </View>
        ) : (
          <View style={styles.cardForm}>
            <TextInput
              style={styles.input}
              placeholder="Nome no cartão"
              value={cardForm.holder}
              onChangeText={(value) => setField('holder', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Número do cartão"
              keyboardType="numeric"
              value={cardForm.number}
              onChangeText={(value) => setField('number', maskCardNumber(value))}
            />
            <View style={styles.inlineRow}>
              <TextInput
                style={[styles.input, styles.inlineInput]}
                placeholder="MM/AA"
                value={cardForm.expiry}
                onChangeText={(value) => setField('expiry', maskExpiry(value))}
              />
              <TextInput
                style={[styles.input, styles.inlineInput]}
                placeholder="CVV"
                keyboardType="numeric"
                value={cardForm.cvv}
                onChangeText={(value) => setField('cvv', value)}
              />
            </View>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>R$ {subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Frete</Text>
          <Text style={styles.value}>R$ {freight.toFixed(2)}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>

        <Pressable style={styles.checkoutButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.checkoutText}>Finalizar compra</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 12,
  },
  back: {
    color: '#1f2937',
    fontWeight: '700',
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
  },
  count: {
    color: '#64748b',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imageBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 34,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 14,
  },
  itemMeta: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  itemPrice: {
    color: '#111827',
    fontWeight: '800',
    marginTop: 6,
  },
  summaryBox: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 500,
  },
  paymentTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  addressBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  cepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cepInput: {
    flex: 1,
  },
  searchCepButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minWidth: 110,
    alignItems: 'center',
  },
  searchCepText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  paymentOptions: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  paymentOptionActive: {
    backgroundColor: '#fff7ed',
    borderColor: '#f97316',
  },
  paymentText: {
    fontWeight: '800',
    color: '#111827',
  },
  pixBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  pixTimer: {
    color: '#f97316',
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  qrContainer: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#64748b',
    fontWeight: '700',
  },
  qrRow: {
    flexDirection: 'row',
  },
  qrCell: {
    width: 8,
    height: 8,
    margin: 1,
    borderRadius: 1,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10,
  },
  pixLabel: {
    color: '#64748b',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  copyButton: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fdba74',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  copyButtonText: {
    color: '#c2410c',
    fontWeight: '700',
    fontSize: 12,
  },
  pixCode: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 6,
    letterSpacing: 1,
  },
  pixExtenso: {
    color: '#475569',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 20,
  },
  cardForm: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    color: '#111827',
    marginBottom: 10,
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  inlineInput: {
    flex: 1,
  },
  inlineInputSmall: {
    width: 76,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#475569',
    fontSize: 14,
  },
  value: {
    color: '#111827',
    fontWeight: '700',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  totalLabel: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  totalValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  checkoutButton: {
    backgroundColor: '#f97316',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 14,
  },
  checkoutText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});
