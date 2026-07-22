export const NOTIF_SOUND = '/som.mp3';

const RESPOSTAS_150 = [
  "só gratidão","obrigado","chegou sim","valeu demais",
  "pode crer","obrigado de coração","vlw de boa",
  "top demais","obrigadão","só gratidão mesmo",
  "Deus te abençoe","brigado mesmo","caiu na conta","show de bola",
  "obrigado de verdade","chegou mesmo","presentão","valeu de coração",
  "recebi certinho","só alegria",
];

const RESPOSTAS_500 = [
  "muito obrigado mesmo","caiu e fez a diferença","salvou demais",
  "era o que eu precisava","obrigado de coração","Deus te abençoe sempre",
  "não esperava, valeu","obrigado demais, sério","chegou em boa hora",
  "vai ajudar muito","só gratidão profunda","muito obrigado, de verdade",
  "você é fera demais","obrigado, tava precisando","feliz demais aqui",
  "Deus te pague, irmão","sucesso pra você também","caiu certinho, obrigado",
  "obrigado, salvou minha semana","top demais, valeu mesmo",
];

const RESPOSTAS_1000 = [
  "obrigado demais, vai ajudar muito","salvou minha semana",
  "nunca duvidei","isso mudou meu mês","muito obrigado de coração",
  "não tenho palavras","Deus te abençoe imensamente","você mudou meu dia",
  "obrigado, salvou minha vida","não sei como agradecer",
  "gratidão imensa","isso veio na hora certa","obrigado de verdade, me ajudou",
  "você é um anjo","tava passando necessidade, obrigado","nunca vou esquecer",
  "Deus te abençoe grandemente","obrigado, tava sem esperança",
  "minha família agradece","só gratidão, obrigado demais",
];

export function getThankYouMessage(value: number, indexRef: { current: number }): string {
  let list: string[];
  if (value >= 1000) {
    list = RESPOSTAS_1000;
  } else if (value >= 500) {
    list = RESPOSTAS_500;
  } else {
    list = RESPOSTAS_150;
  }
  const idx = indexRef.current % list.length;
  indexRef.current = idx + 1;
  return list[idx];
}

export const BRAZILIAN_BANKS = [
  'BANCO DO BRASIL S.A.', 'BANCO BRADESCO S.A.', 'ITAÚ UNIBANCO S.A.', 'CAIXA ECONOMICA FEDERAL', 'BANCO SANTANDER (BRASIL) S.A.',
  'BANCO BTG PACTUAL S.A.', 'BANCO SAFRA S.A.', 'BANCO PAN S.A.', 'BANCO INTER S.A.', 'BANCO C6 S.A.',
  'BANCO MERCANTIL DO BRASIL S.A.', 'BANCO ORIGINAL S.A.', 'BANCO MODAL S.A.', 'BANCO NEON S.A.', 'BANCO BMG S.A.',
  'BANCO XP S.A.', 'BANCO SICOOB S.A.', 'BANCO SICREDI S.A.', 'BANCO DAYCOVAL S.A.', 'BANCO SOFISA S.A.',
  'PICPAY SERVICOS S.A.', 'STONE PAGAMENTOS S.A.', 'MERCADO PAGO INSTITUICAO DE PAGAMENTO LTDA',
  'BANCO RENDIMENTO S.A.', 'BANCO ABC BRASIL S.A.', 'BANCO CREFISA S.A.', 'BANCO FIBRA S.A.',
  'NU PAGAMENTOS - IP'
];
