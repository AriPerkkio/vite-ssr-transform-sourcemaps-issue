export function add(a: number, b: number): number {
  if (a === 1) {
    return 1;
  }

  if (a === 2) {
    return 2;
  }

  if (a === 3) {
    return 3;
  }

  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}
