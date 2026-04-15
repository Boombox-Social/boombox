# Environment Configuration Guide

This project uses different environment files for different deployment stages.

## Environment Files

- **`.env.local`** - Local development environment (used by Next.js by default in development)
- **`.env.production`** - Production environment (contains production database credentials)
- **`.env.example`** - Template file showing required environment variables

## Setup Instructions

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your local database credentials

3. Run migrations for local database:
   ```bash
   npm run prisma:migrate:dev
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Production Deployment

1. Update `.env.production` with your production database credentials

2. Deploy migrations to production:
   ```bash
   npm run prisma:migrate:deploy:production
   ```

3. Build for production:
   ```bash
   npm run build:production
   ```

## Available Scripts

### Development Scripts
- `npm run dev` - Start Next.js development server
- `npm run prisma:migrate:dev` - Run Prisma migrations in development (uses `.env.local`)
- `npm run prisma:studio` - Open Prisma Studio for local database

### Production Scripts
- `npm run build:production` - Build with production environment
- `npm run prisma:migrate:deploy:production` - Deploy migrations to production database
- `npm run prisma:studio:production` - Open Prisma Studio for production database

### General Scripts
- `npm run prisma:migrate:deploy` - Deploy migrations using local environment
- `npm run prisma:generate` - Generate Prisma Client
- `npm run seed` - Seed the database
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## How Next.js Handles Environment Files

Next.js automatically loads environment files in this order:
1. `.env.local` (loaded for all environments except test, has highest priority for local dev)
2. `.env.development` or `.env.production` (depending on NODE_ENV)
3. `.env` (all environments)

For local development, Next.js will automatically use `.env.local`.

## Database Configuration

The project uses PostgreSQL with Prisma ORM. Environment variables required:

- `POSTGRES_URL` - PostgreSQL connection string
- `DATABASE_URL` - Database connection string (used by Prisma)

## Security Notes

- **NEVER** commit `.env.local` or `.env.production` to version control
- Use strong, random values for `JWT_SECRET` and `JWT_REFRESH_SECRET` in production
- Keep production credentials secure and rotate them regularly
- `.env.example` is safe to commit as it contains no sensitive data
