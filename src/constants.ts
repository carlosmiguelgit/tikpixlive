export const NOTIF_SOUND = '/som.mp3';

const RESPOSTAS = [
  "só gratidão","obrigado","chegou sim","valeu demais","Deus te abençoe",
  "só sucesso","pode crer","obrigado de coração","muito obrigado",
  "agradeço demais","recebi sim, obrigado","n esperava por essa","vlw de boa",
  "obrigado demais, vai ajudar muito","salvou minha semana","Deus te pague",
  "nunca duvidei","top demais","obrigadão","só gratidão mesmo",
];

export function getThankYouMessage(value: number, indexRef: { current: number }): string {
  const idx = indexRef.current;
  indexRef.current = (idx + 1) % RESPOSTAS.length;
  return RESPOSTAS[idx];
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
