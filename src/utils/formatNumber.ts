/**
 * 数値をフォーマットする
 * @param input 入力値
 */
export const formatNumber = (input: unknown): string => {
  if (typeof input !== 'number' && typeof input !== 'string') {
    return '';
  }

  return new Intl.NumberFormat('ja-JP').format(+input);
};
