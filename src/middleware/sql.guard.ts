import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SqlInjectionGuard implements CanActivate {
  private readonly logger = new Logger(SqlInjectionGuard.name);

  // Patrones SQL comunes usados en inyecciones
  private readonly SQL_PATTERNS: RegExp[] = [
    /(\s|;|'|")(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|EXECUTE)\s/i,
    /(\bUNION\b.*\bSELECT\b)/i,
    /--\s*$/m,
    /\/\*[\s\S]*?\*\//,
    /;\s*(DROP|DELETE|UPDATE|INSERT)/i,
    /\bOR\b\s+[\w\d'"]+=\s*[\w\d'"]+/i,
    /\bAND\b\s+[\w\d'"]+=\s*[\w\d'"]+/i,
    /xp_\w+/i,
    /LOAD_FILE\s*\(/i,
    /INTO\s+(OUTFILE|DUMPFILE)/i,
    /BENCHMARK\s*\(/i,
    /SLEEP\s*\(\d+\)/i,
    /WAITFOR\s+DELAY/i,
    /char\s*\(\s*\d+/i,
    /0x[0-9a-fA-F]+/,
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const valuesToCheck = this.extractValues(request);

    for (const value of valuesToCheck) {
      if (this.containsSqlInjection(value)) {
        this.logger.warn(
          `Posible SQL injection detectado. IP: ${request.ip} | URL: ${request.url} | Valor: "${value}"`,
        );
        throw new ForbiddenException(
          'La solicitud contiene caracteres no permitidos.',
        );
      }
    }

    return true;
  }

  private extractValues(request: Request): string[] {
    const values: string[] = [];

    // Query params: ?name=foo&id=1
    this.collectStrings(request.query, values);

    // Body (JSON, form-data, etc.)
    this.collectStrings(request.body, values);

    // Route params: /users/:id
    this.collectStrings(request.params, values);

    return values;
  }

  private collectStrings(obj: unknown, result: string[]): void {
    if (obj === null || obj === undefined) return;

    if (typeof obj === 'string') {
      result.push(obj);
      return;
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      result.push(String(obj));
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item) => this.collectStrings(item, result));
      return;
    }

    if (typeof obj === 'object') {
      Object.values(obj).forEach((value) => this.collectStrings(value, result));
    }
  }

  private containsSqlInjection(value: string): boolean {
    return this.SQL_PATTERNS.some((pattern) => pattern.test(value));
  }
}
