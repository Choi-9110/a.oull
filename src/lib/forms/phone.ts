/**
 * 휴대폰 번호 입력 중 자동 하이픈 (TDS: 입력 부담 줄이기)
 * - 국내 번호: 010-1234-5678 형태로 맞춘다
 * - 국제 번호(+로 시작): 숫자·공백만 남기고 그대로 둔다
 */
export function formatPhoneInput(raw: string): string {
  if (raw.trim().startsWith("+")) return "+" + raw.replace(/[^\d ]/g, "").slice(0, 18);
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}
