import argon2 from 'argon2';

export const createArgonHash = async (textValue: string): Promise<string> => {
  return argon2.hash(textValue);
};

export const verifyArgonHash = async (textValue: string, hashedValue: string): Promise<boolean> => {
  return argon2.verify(hashedValue, textValue);
};
