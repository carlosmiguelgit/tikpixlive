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