Boombox Project — Local Setup Instructions
1. Install Requirements

Install Node.js: https://nodejs.org

Install Docker: https://www.docker.com/get-started
 (required for Postgres)

2. Set Up the Environment File

In the root of the project, create a file called .env.

Add the following variables:

DATABASE_URL="postgresql://boombox:boombox_pass@localhost:5432/boombox_dev?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

AUTH_SECRET="any-long-random-string-here"
NEXTAUTH_URL="http://localhost:3000"


⚠️ Do not commit .env to GitHub — it’s local-only.

3. Start the Local Database

If the project includes a docker-compose.yml file:

docker-compose up -d


This will spin up a local Postgres database matching the .env configuration.

4. Apply Prisma Migrations

Create tables in the local database:

npx prisma migrate deploy


Or, for a fresh reset (erases existing data):

npx prisma migrate reset


Optional: open Prisma Studio to view the database:

npx prisma studio

5. Install Dependencies
npm install

6. Run the Project
npm run dev


The app should now run at http://localhost:3000
 and connect to the local database.

7. Workflow for Committing

Features branch → UI, new features

Fixes branch → bug fixes, backend/code fixes

Make sure to pull the latest changes before starting your work.

After making changes:

Commit locally with a descriptive message.

Push to the correct branch.

8. Tips / Best Practices

If you change Prisma models, create a new migration:

npx prisma migrate dev --name descriptive_migration_name


Use .env for sensitive data; never commit it.

Commit small, meaningful changes to make tracking easier.