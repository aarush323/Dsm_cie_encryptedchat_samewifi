const isProbablePrime = (n, k = 25) => {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;

  let d = n - 1n;
  let s = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    s++;
  }

  for (let i = 0; i < k; i++) {
    const a = randomBigInt(2n, n - 2n);
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;

    let composite = true;
    for (let r = 0; r < s - 1; r++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) return false;
  }
  return true;
};

const randomBigInt = (min, max) => {
  const range = max - min + 1n;
  const numBytes = Math.ceil(range.toString(16).length / 2);
  let result = 0n;
  for (let i = 0; i < numBytes; i++) {
    result = result * 256n + BigInt(Math.floor(Math.random() * 256));
  }
  return min + (result % range);
};

const generatePrime = (bits = 50) => {
  const min = 1n << BigInt(bits - 1);
  const max = (1n << BigInt(bits)) - 1n;
  
  while (true) {
    let n = randomBigInt(min, max);
    n |= 1n;
    if (isProbablePrime(n)) return n;
  }
};

const gcd = (a, b) => {
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
};

const modInverse = (e, phi) => {
  let [t, newT] = [0n, 1n];
  let [r, newR] = [phi, e];

  while (newR !== 0n) {
    const q = r / newR;
    [t, newT] = [newT, t - q * newT];
    [r, newR] = [newR, r - q * newR];
  }

  if (t < 0n) t += phi;
  return t;
};

const modPow = (base, exp, mod) => {
  let result = 1n;
  base = base % mod;
  
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  
  return result;
};

export const generateKeys = (p, q) => {
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);

  let e = 3n;
  while (gcd(e, phi) !== 1n) {
    e += 2n;
  }

  const d = modInverse(e, phi);

  return {
    publicKey: { e, n },
    privateKey: { d, n }
  };
};

export const textToNumbers = (text) => {
  return text.split('').map(char => BigInt(char.charCodeAt(0)));
};

export const numbersToText = (nums) => {
  return nums.map(n => String.fromCharCode(Number(n))).join('');
};

export const encrypt = (messageArr, publicKey) => {
  const { e, n } = publicKey;
  return messageArr.map(m => modPow(m, e, n));
};

export const decrypt = (cipherArr, privateKey) => {
  const { d, n } = privateKey;
  return cipherArr.map(c => modPow(c, d, n));
};

export { generatePrime, gcd, modInverse, modPow };
