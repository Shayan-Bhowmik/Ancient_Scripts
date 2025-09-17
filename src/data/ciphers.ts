import { Cipher } from '@/components/CipherChallenge';

export const ciphers: Cipher[] = [
  {
    id: 'caesar_1',
    type: 'caesar',
    level: 1,
    title: 'The Caesar\'s Secret',
    description: 'Julius Caesar used this cipher to protect his military communications. Each letter is shifted by a fixed number of positions in the alphabet.',
    encryptedMessage: 'KHOOR ZRUOG',
    correctAnswer: 'hello world',
    hint: 'Try shifting each letter back by 3 positions. A becomes X, B becomes Y, C becomes Z, D becomes A...',
    points: 100,
  },
  {
    id: 'morse_1',
    type: 'morse',
    level: 2,
    title: 'Dots and Dashes',
    description: 'Samuel Morse\'s telegraph code uses dots (.) and dashes (-) to represent letters. Separate letters with spaces.',
    encryptedMessage: '.- -. -.-. .. . -. -',
    correctAnswer: 'ancient',
    hint: 'A = .-, N = -., C = -.-.  Remember: dot-dash patterns for each letter!',
    points: 150,
  },
  {
    id: 'atbash_1',
    type: 'atbash',
    level: 3,
    title: 'Mirror Writing',
    description: 'The Atbash cipher reverses the alphabet: A↔Z, B↔Y, C↔X, and so on. Used in ancient Hebrew texts.',
    encryptedMessage: 'HXIVEH',
    correctAnswer: 'sacred',
    hint: 'A becomes Z, B becomes Y, C becomes X... It\'s like a mirror reflection of the alphabet.',
    points: 200,
  },
  {
    id: 'pigpen_1',
    type: 'pigpen',
    level: 4,
    title: 'The Freemason\'s Code',
    description: 'Also known as the Masonic cipher, letters are replaced by symbols based on their position in a grid.',
    encryptedMessage: '⌞ ⌟ ◢ ⌝ ⌞',
    correctAnswer: 'codes',
    hint: 'Draw a tic-tac-toe grid and an X. Letters A-I go in the grid (A top-left), J-R in the grid with dots, S-Z in the X shape.',
    points: 250,
  },
  {
    id: 'substitution_1',
    type: 'substitution',
    level: 5,
    title: 'The Great Substitution',
    description: 'Each letter of the alphabet is consistently replaced by another letter. Find the pattern!',
    encryptedMessage: 'XOFWFK JCKKFVDK',
    correctAnswer: 'hidden messages',
    hint: 'Look for common English words and letter patterns. E is the most common letter in English.',
    points: 300,
  },
  {
    id: 'combined_final',
    type: 'substitution',
    level: 6,
    title: 'The Ultimate Challenge',
    description: 'This final cipher combines multiple encryption techniques. You\'ll need all your skills to crack this ancient secret!',
    encryptedMessage: '.-. ..- -. / - .... . / -.-. .- . ... .- .-. / - .... .-. . .',
    correctAnswer: 'run the caesar three',
    hint: 'First decode the Morse, then apply what the message tells you to do with another cipher type.',
    points: 500,
  },
];

export const getCipherById = (id: string): Cipher | undefined => {
  return ciphers.find(cipher => cipher.id === id);
};

export const getCiphersByLevel = (): Cipher[][] => {
  const levels: Cipher[][] = [];
  ciphers.forEach(cipher => {
    if (!levels[cipher.level - 1]) {
      levels[cipher.level - 1] = [];
    }
    levels[cipher.level - 1].push(cipher);
  });
  return levels;
};