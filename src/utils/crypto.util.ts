import * as bcrypt from 'bcryptjs';

export async function hashText(text: string): Promise<string> {
  try {
    const saltRounds = 12;

    const hash = await bcrypt.hash(text, saltRounds);

    return hash;
  } catch (error) {
    console.error('bcrypt error:', error);
    throw error;
  }
}

export async function verifyText(text: string, hash: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(text, hash);

    return isMatch;
  } catch (error) {
    console.error('bcrypt error:', error);
    throw error;
  }
}
