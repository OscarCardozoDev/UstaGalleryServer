import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Style, StyleUidResult, UpdateStyleDto } from './Styles.interface';

@Injectable()
export class StylesService {
  constructor(private prismaService: PrismaService) {}

  async getAll(): Promise<Style[]> {
    return this.prismaService.styles.findMany({
      select: {
        uid: true,
        name: true,
        description: true,
      },
    });
  }

  async get(uid: string): Promise<Style> {
    const style = await this.prismaService.styles.findUnique({
      where: { uid },
      select: {
        uid: true,
        name: true,
        description: true,
      },
    });

    if (!style) {
      throw new NotFoundException(`Style with uid ${uid} not found`);
    }

    return style;
  }

  async create(style: Style): Promise<StyleUidResult> {
    const created = await this.prismaService.styles.create({
      data: {
        uid: style.uid,
        name: style.name,
        description: style.description,
      },
      select: { uid: true },
    });

    return { uid: created.uid };
  }

  async update(uid: string, style: UpdateStyleDto): Promise<StyleUidResult> {
    const data = {
      ...Object.fromEntries(
        Object.entries(style).filter(([, v]) => v !== undefined),
      ),
    };

    const updated = await this.prismaService.styles.update({
      where: { uid },
      data,
      select: { uid: true },
    });

    return { uid: updated.uid };
  }

  async delete(uid: string): Promise<StyleUidResult> {
    await this.get(uid); // valida existencia

    const deleted = await this.prismaService.styles.delete({
      where: { uid },
      select: { uid: true },
    });

    return { uid: deleted.uid };
  }
}
