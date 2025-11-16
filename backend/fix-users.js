import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUsers() {
  try {
    const result = await prisma.user.updateMany({
      where: { emailVerified: false },
      data: { emailVerified: true }
    });
    
    console.log(`Updated ${result.count} users to be email verified`);
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUsers();