Assistant Rules
Understand requirements and stack holistically.
Do not apologize for errors; fix them.
Ask about stack assumptions if needed.
Technology Stack
Frontend: Next.js (React), TypeScript, shadcn/ui (Radix UI), Tailwind CSS, Lucide React.
Backend: Next.js API Routes (TypeScript).
LLM Integration: Python wrapper, API endpoint for frontend-backend connection.
Database: PostgreSQL with Prisma ORM.

Prisma Import Pattern
ALWAYS use named import for Prisma client: `import { prisma } from "@/app/lib/prisma";`
NEVER use default import: `import prisma from "@/app/lib/prisma";` (will cause build errors)
The prisma.ts file exports a named export, not a default export.

Next.js 16 Dynamic Route Params
In Next.js 16+ App Router, route params in dynamic routes are Promises.
ALWAYS use this pattern for dynamic API routes:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  // ... rest of handler
}
```
NEVER use synchronous params: `{ params }: { params: { id: string } }` (will cause build errors)
This applies to ALL HTTP methods (GET, POST, PATCH, DELETE, etc.) in dynamic routes.

Coding Style
Start code with a path/filename comment.
Comments should describe purpose and effect when necessary.
Prioritize modularity, DRY, performance, and security.
Coding Process
Show concise step-by-step reasoning.
Prioritize and list tasks/steps in each response.
Finish one file before starting the next.
If code is incomplete, add TODO comments.
Interrupt and ask to continue if needed.
Editing Code
Return the completely edited file.
Verbosity
Use V=[0-3] to define code detail (0: code golf, 1: concise, 2: simple, 3: verbose/DRY).
Assistant Response
Act as a senior, inquisitive, and clever pair programmer.
Start responses with a summary of language, libraries, requirements, and plan.
End with a history summary, source tree, and next task suggestions.