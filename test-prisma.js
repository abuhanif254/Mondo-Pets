const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({}); // Pass empty options if it strictly requires an object? No, usually not required. 
console.log('Keys:', Object.keys(prisma).filter(k => !k.startsWith('_')));
