import { promises as fs } from 'fs';
import * as path from 'path';

const IMAGES_ROOT = path.resolve(process.cwd(), 'Images');

export interface SavePhotoParams {
  fileBuffer: Buffer;
  fileName: string;
  folderPath?: string;
}

export interface PhotoResult {
  name: string;
  url: string;
}

export interface GetPhotoResult {
  base64: string;
}

function resolveFolder(folderPath?: string): string {
  return folderPath ? path.join(IMAGES_ROOT, folderPath) : IMAGES_ROOT;
}

export const photoManagment = {
  /**
   * Guarda una foto en Images/(path)/
   */
  async save({
    fileBuffer,
    fileName,
    folderPath,
  }: SavePhotoParams): Promise<PhotoResult> {
    const targetDir = resolveFolder(folderPath);
    const filePath = path.join(targetDir, fileName);

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(filePath, fileBuffer);

    return {
      name: fileName,
      url: filePath,
    };
  },

  /**
   * Edita (sobrescribe) una foto existente
   */
  async edit({
    fileBuffer,
    fileName,
    folderPath,
  }: SavePhotoParams): Promise<PhotoResult> {
    const targetDir = resolveFolder(folderPath);
    const filePath = path.join(targetDir, fileName);

    await fs.access(filePath);
    await fs.writeFile(filePath, fileBuffer);

    return {
      name: fileName,
      url: filePath,
    };
  },

  /**
   * Obtiene una foto y la devuelve en base64
   */
  async get(folderPath: string): Promise<GetPhotoResult | null> {
    const targetDir = resolveFolder(folderPath);

    try {
      const buffer = await fs.readFile(targetDir);

      return {
        base64: buffer.toString('base64'),
      };
    } catch {
      return null;
    }
  },

  /**
   * Elimina una foto
   */
  async remove(fileName: string, folderPath?: string): Promise<void> {
    const targetDir = resolveFolder(folderPath);
    const filePath = path.join(targetDir, fileName);

    await fs.unlink(filePath);
  },
};
