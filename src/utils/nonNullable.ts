/** 値がNonNullableであることをチェックする */
export const nonNullable = <T>(value :T): value is NonNullable<T> => value != null;
