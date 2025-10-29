#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const dbType = process.argv[2];

if (!dbType || !['mysql', 'postgresql'].includes(dbType)) {
  console.log('Usage: node switch-db.js [mysql|postgresql]');
  console.log('');
  console.log('Examples:');
  console.log('  node switch-db.js mysql      # Switch to MySQL for local development');
  console.log('  node switch-db.js postgresql # Switch to PostgreSQL for Railway deployment');
  process.exit(1);
}

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const mysqlSchemaPath = path.join(__dirname, 'prisma', 'schema.mysql.prisma');
const postgresqlSchemaPath = path.join(__dirname, 'prisma', 'schema.postgresql.prisma');

// Backup current schema as MySQL version if it doesn't exist
if (!fs.existsSync(mysqlSchemaPath) && fs.existsSync(schemaPath)) {
  fs.copyFileSync(schemaPath, mysqlSchemaPath);
  console.log('✅ Backed up current schema as MySQL version');
}

if (dbType === 'mysql') {
  if (fs.existsSync(mysqlSchemaPath)) {
    fs.copyFileSync(mysqlSchemaPath, schemaPath);
    console.log('✅ Switched to MySQL schema');
    console.log('📝 Update your .env DATABASE_URL to MySQL format:');
    console.log('   DATABASE_URL="mysql://user:password@localhost:3306/database"');
  } else {
    console.log('❌ MySQL schema not found');
  }
} else if (dbType === 'postgresql') {
  if (fs.existsSync(postgresqlSchemaPath)) {
    fs.copyFileSync(postgresqlSchemaPath, schemaPath);
    console.log('✅ Switched to PostgreSQL schema');
    console.log('📝 Update your .env DATABASE_URL to PostgreSQL format:');
    console.log('   DATABASE_URL="postgresql://user:password@host:5432/database"');
  } else {
    console.log('❌ PostgreSQL schema not found');
  }
}

console.log('');
console.log('🔄 Next steps:');
console.log('1. Update your DATABASE_URL in .env');
console.log('2. Run: npx prisma generate');
console.log('3. Run: npx prisma migrate dev (for development)');
console.log('   Or: npx prisma migrate deploy (for production)');