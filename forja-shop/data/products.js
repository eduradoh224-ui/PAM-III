export const productCategories = [
  { name: 'Motor', emoji: '⚙️', description: 'Peças de desempenho e manutenção do motor.' },
  { name: 'Freios', emoji: '🛑', description: 'Discos, pastilhas e componentes de frenagem.' },
  { name: 'Suspensão', emoji: '🛞', description: 'Amortecedores, molas e bushings.' },
  { name: 'Elétrica', emoji: '🔋', description: 'Baterias, alternadores e sensores.' },
  { name: 'Direção', emoji: '🦮', description: 'Caixa de direção e itens de precisão.' },
  { name: 'Arrefecimento', emoji: '❄️', description: 'Radiadores e bombas de água.' },
  { name: 'Transmissão', emoji: '⚙️', description: 'Embreagens, câmbios e difusores.' },
  { name: 'Pneus', emoji: '🚗', description: 'Pneus e rodas para alto desempenho.' },
  { name: 'Iluminação', emoji: '💡', description: 'Faróis, luzes e componentes elétricos.' },
  { name: 'Acessórios', emoji: '🧰', description: 'Ferramentas e itens de utilidade geral.' },
];

const brands = ['Bosch', 'Mitsuboshi', 'SKF', 'NGK', 'Denso', 'Valeo', 'TRW', 'Monroe', 'Kühn', 'Sachs', 'Gates', 'Wagner'];

const partNamesByCategory = {
  Motor: ['Vela', 'Bomba de óleo', 'Correia dentada', 'Filtro de ar', 'Compressor', 'Alternador', 'Bomba d’água', 'Junta do cabeçote', 'Kit de vedação', 'Injetor', 'Sensor de pressão', 'Turbo'],
  Freios: ['Pastilha', 'Disco', 'Silencioso', 'Kit de freio', 'Cilindro mestre', 'Fluido de freio', 'Caliper', 'Tubo flexível', 'Luva do freio', 'Kit de ajuste'],
  Suspensão: ['Amortecedor', 'Mola', 'Bushing', 'Braço oscilante', 'Terminal de direção', 'Kit de suspensão', 'Pivô', 'Junta homocinética', 'Estabilizador', 'Apoio'],
  Elétrica: ['Bateria', 'Sensor', 'Relé', 'Cabos', 'Alternador', 'Motor de partida', 'Fusível', 'Modulo eletrônico', 'Chave de ignição', 'Inversor'],
  Direção: ['Caixa de direção', 'Cremalheira', 'Tubo de direção', 'Coluna de direção', 'Mancal', 'Rolamento', 'Pinhão', 'Válvula hidráulica'],
  Arrefecimento: ['Radiador', 'Bomba d’água', 'Termostato', 'Reservatório', 'Mangueira', 'Ventoinha', 'Condensador', 'Respiro', 'Tubo de refrigeração'],
  Transmissão: ['Embreagem', 'Kit de embreagem', 'Câmbio', 'Velocidade', 'Eixo', 'Carcaça', 'Acoplamento', 'Diferencial', 'Rolamento de transmissão'],
  Pneus: ['Pneu', 'Roda', 'Banda de rodagem', 'Câmara', 'Aro', 'Sensores TPMS', 'Pino', 'Kit de rotação'],
  Iluminação: ['Farol', 'Luz de seta', 'Luz traseira', 'Reflector', 'Modulo de led', 'Lâmpada', 'Farol LED', 'Kit de iluminação'],
  Acessórios: ['Chave de torque', 'Kit de ferramentas', 'Extensão', 'Filtro de combustível', 'Compra de emergência', 'Acessório de bancada', 'Conector', 'Puxador'],
};

const colors = ['#f97316', '#f59e0b', '#ef4444', '#14b8a6', '#3b82f6', '#8b5cf6', '#10b981', '#f43f5e'];

function makePrice(base, variation) {
  return Number((base + variation * 15.75).toFixed(2));
}

export const products = Array.from({ length: 1200 }, (_, index) => {
  const category = productCategories[index % productCategories.length].name;
  const partNames = partNamesByCategory[category];
  const partName = partNames[index % partNames.length];
  const brand = brands[index % brands.length];
  const price = makePrice(45 + (index % 55) * 18, (index % 9) + 1);
  const stock = 12 + ((index * 7) % 240);
  const rating = Number((3.8 + ((index * 7) % 14) / 10).toFixed(1));
  const peso = 0.4 + ((index * 13) % 22) / 10;

  return {
    id: index + 1,
    sku: `${category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(5, '0')}`,
    name: `${brand} ${partName} ${String((index % 77) + 1).padStart(2, '0')}`,
    category,
    brand,
    price,
    stock,
    rating,
    weight: Number(peso.toFixed(2)),
    compatibility: `${['Honda', 'Toyota', 'Chevrolet', 'Ford', 'Volkswagen', 'BMW', 'Mercedes', 'Fiat', 'Renault', 'Nissan'][index % 10]} ${['Civic', 'Corolla', 'Onix', 'Ka', 'Gol', '320i', 'C180', 'Uno', 'Clio', 'March'][index % 10]}`,
    description: `Peça automotiva premium para ${category.toLowerCase()}, com qualidade OEM e garantia de desempenho para uso diário e em alta performance.`,
    emoji: productCategories.find((item) => item.name === category)?.emoji || '🔧',
    color: colors[index % colors.length],
    featured: index % 9 === 0,
  };
});

export const featuredProducts = products.filter((product) => product.featured).slice(0, 8);

export const categorySummary = productCategories.map((category) => ({
  ...category,
  count: products.filter((product) => product.category === category.name).length,
}));