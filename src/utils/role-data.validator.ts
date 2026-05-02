// server/src/utils/role-data.validator.ts

export interface PregraduateData  { career: string; semester: string }
export interface PostgraduateData { career: string }
export interface FunctionaryData  { department: string }
export interface AlumniData       { career: string }
export interface ParticularData   {}

export type RoleData =
  | PregraduateData
  | PostgraduateData
  | FunctionaryData
  | AlumniData
  | ParticularData;

function checkFields(data: unknown, fields: string[]): string[] {
  if (!data || typeof data !== 'object') {
    return ['roleData must be an object'];
  }
  const errors: string[] = [];
  for (const field of fields) {
    const value = (data as Record<string, unknown>)[field];
    if (!value || typeof value !== 'string' || value.trim() === '') {
      errors.push(`roleData.${field} is required and must be a non-empty string`);
    }
  }
  return errors;
}

function pickFields(data: unknown, fields: string[]): Record<string, string> {
  if (!data || typeof data !== 'object') return {};
  const result: Record<string, string> = {};
  for (const field of fields) {
    const value = (data as Record<string, unknown>)[field];
    if (typeof value === 'string') result[field] = value.trim();
  }
  return result;
}

const ROLE_SCHEMAS: Record<string, string[]> = {
  pregrado:    ['career', 'semester'],
  posgrado:    ['career'],
  funcionario: ['department'],
  egresado:    ['career'],
  particular:  [],
};

export function validateRoleData(
  slug: string,
  data: unknown,
): { valid: boolean; errors: string[] } {
  const fields = ROLE_SCHEMAS[slug];
  if (fields === undefined) {
    return { valid: false, errors: [`Unknown role slug: ${slug}`] };
  }
  const errors = checkFields(data, fields);
  return { valid: errors.length === 0, errors };
}

export function sanitizeRoleData(
  slug: string,
  data: unknown,
): Record<string, string> {
  const fields = ROLE_SCHEMAS[slug] ?? [];
  return pickFields(data, fields);
}
