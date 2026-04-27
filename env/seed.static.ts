// Load DATABASE_URL before PrismaClient initializes
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: 'env/development.env' });

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL_TEST!,
});
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

const IDS = {
  userTypes: {
    admin: 'c782a79d-54f2-40d2-b5af-1282abgt33ef',
    professor: 'b782a79d-54f2-40d2-b5af-5190llkj152h',
    student: 'e782a79d-54f2-40d2-b5af-5509bb1e369a',
  },
  users: {
    admin: 'c782a79d-54f2-40d2-b5af-1282abgt33ef',
    professor: 'b782a79d-54f2-40d2-b5af-5190llkj152h',
    student: 'e782a79d-54f2-40d2-b5af-5509bb1e369a',
  },
  groups: {
    artes: 'e782a79d-54f2-arte-b5af-5509bb1e369a',
  },
};

async function main() {
  console.log('🌱 [STATIC] Iniciando seed de datos fijos...\n');

  await prisma.$connect();

  // -------------------------------------------------------
  // 1. USER TYPES
  // -------------------------------------------------------
  console.log('📋 Creando tipos de usuario...');

  const adminType = await prisma.userTypes.upsert({
    where: { uid: IDS.userTypes.admin },
    update: {},
    create: { uid: IDS.userTypes.admin, name: 'Admin' },
  });

  const professorType = await prisma.userTypes.upsert({
    where: { uid: IDS.userTypes.professor },
    update: {},
    create: { uid: IDS.userTypes.professor, name: 'Professor' },
  });

  const studentType = await prisma.userTypes.upsert({
    where: { uid: IDS.userTypes.student },
    update: {},
    create: { uid: IDS.userTypes.student, name: 'Student' },
  });

  // -------------------------------------------------------
  // 2. CREDENTIALS
  // -------------------------------------------------------
  console.log('🔐 Creando credenciales...');

  const professorPasswordHash = await bcrypt.hash(
    'Professor@1234!',
    SALT_ROUNDS,
  );
  const studentPasswordHash = await bcrypt.hash('Student@1234!', SALT_ROUNDS);
  const adminPasswordHash = await bcrypt.hash('Admin@1234!', SALT_ROUNDS);

  await prisma.credentials.upsert({
    where: { mail: 'professor@gmail.com' },
    update: {},
    create: {
      uid: IDS.users.professor,
      mail: 'professor@gmail.com',
      password: professorPasswordHash,
    },
  });

  await prisma.credentials.upsert({
    where: { mail: 'student@gmail.com' },
    update: {},
    create: {
      uid: IDS.users.student,
      mail: 'student@gmail.com',
      password: studentPasswordHash,
    },
  });

  await prisma.credentials.upsert({
    where: { mail: 'admin@ustagallery.com' },
    update: {},
    create: {
      uid: IDS.users.admin,
      mail: 'admin@ustagallery.com',
      password: adminPasswordHash,
    },
  });

  // -------------------------------------------------------
  // 3. USERS
  // -------------------------------------------------------
  console.log('👤 Creando usuarios por defecto...');

  const professorUser = await prisma.users.upsert({
    where: { uid: IDS.users.professor },
    update: {},
    create: {
      uid: IDS.users.professor,
      name: 'Professor',
      lastName: 'Docente',
      username: 'professor',
      gender: 'M',
      idCard: '000000000002',
      degree: 'Artes y Fotografía',
      semester: '1',
      telNumber: '0000000001',
      isActive: true,
      isProfesor: true,
      userTypeId: professorType.uid,
    },
  });

  await prisma.users.upsert({
    where: { uid: IDS.users.student },
    update: {},
    create: {
      uid: IDS.users.student,
      name: 'Student',
      lastName: 'Estudiante',
      username: 'student',
      gender: 'M',
      idCard: '000000000003',
      degree: 'Bellas Artes',
      semester: '1',
      telNumber: '0000000002',
      isActive: true,
      isProfesor: false,
      userTypeId: studentType.uid,
    },
  });

  // -------------------------------------------------------
  // 4. GROUP — Grupo de Artes y Fotografía
  // -------------------------------------------------------
  console.log('🎨 Creando grupo de Artes y Fotografía...');

  await prisma.groups.upsert({
    where: { uid: IDS.groups.artes },
    update: {},
    create: {
      uid: IDS.groups.artes,
      name: 'Grupo de Artes y Fotografía',
      category: 'ARTES',
      isActive: true,
      profesorId: professorUser.uid,
    },
  });

  console.log('\n✅ [STATIC] Seed completado!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('UserTypes : Admin | Professor | Student');
  console.log(
    'Usuarios  : admin@ustagallery.com | professor@gmail.com | student@gmail.com',
  );
  console.log('Grupo     : Grupo de Artes y Fotografía (ARTES)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed estático:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
