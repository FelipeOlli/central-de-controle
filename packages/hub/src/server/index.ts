import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hubRoot = path.resolve(__dirname, "../..");
dotenv.config({ path: path.resolve(hubRoot, ".env") });
const isProductionEnv = process.env.NODE_ENV === "production";
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = isProductionEnv ? "file:/tmp/hub.sqlite" : "file:./dev.db";
}
console.log("[hub-api] starting (cwd=%s)", process.cwd());
if (process.env.DATABASE_URL?.startsWith("file:")) {
  const rel = process.env.DATABASE_URL.replace(/^file:/, "").trim();
  const isAbsolute = path.isAbsolute(rel);
  if (!isAbsolute) {
    const schemaDir = path.join(hubRoot, "prisma");
    process.env.DATABASE_URL = "file:" + path.resolve(schemaDir, rel);
  }
}

const prisma = new PrismaClient();
const app = express();

const port = Number(process.env.PORT ?? 3001);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
const jwtSecret = process.env.JWT_SECRET ?? "hub-dev-secret-change-me";
const isProduction = process.env.NODE_ENV === "production";
const distDir = path.resolve(__dirname, "../../dist");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);

if (isProduction && existsSync(distDir)) {
  app.use(express.static(distDir));
}

type JwtPayload = { userId: string; email: string };

function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
}

function getUserIdFromRequest(req: express.Request): string | null {
  const token = req.cookies?.hub_token as string | undefined;
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded.userId;
  } catch {
    return null;
  }
}

function setAuthCookie(res: express.Response, token: string): void {
  res.cookie("hub_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookie(res: express.Response): void {
  res.clearCookie("hub_token");
}

function normalizeCommitmentStatus(status: string, dueDate: Date): string {
  if (status === "cumprido") {
    return status;
  }
  return dueDate < new Date() ? "atrasado" : status;
}

function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  res.locals.userId = userId;
  next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");
  if (!email || password.length < 6) {
    res.status(400).json({ error: "E-mail e senha (mínimo 6 caracteres) são obrigatórios." });
    return;
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    res.status(409).json({ error: "E-mail já cadastrado." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  const token = createToken({ userId: user.id, email: user.email });
  setAuthCookie(res, token);
  res.status(201).json({ id: user.id, email: user.email });
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: "Credenciais inválidas." });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Credenciais inválidas." });
    return;
  }

  const token = createToken({ userId: user.id, email: user.email });
  setAuthCookie(res, token);
  res.json({ id: user.id, email: user.email });
});

app.post("/api/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
});

app.get("/api/auth/me", requireAuth, async (_req, res) => {
  const userId = res.locals.userId as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });
  if (!user) {
    res.status(401).json({ error: "Sessão inválida." });
    return;
  }
  res.json(user);
});

app.get("/api/projects", requireAuth, async (_req, res) => {
  const userId = res.locals.userId as string;
  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      _count: { select: { ideas: true, commitments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(projects);
});

app.post("/api/projects", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const project = await prisma.project.create({
    data: {
      userId,
      name: String(req.body?.name ?? ""),
      description: req.body?.description ? String(req.body.description) : null,
      status: req.body?.status,
    },
  });
  res.status(201).json(project);
});

app.patch("/api/projects/:id", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const itemId = String(req.params.id);
  const current = await prisma.project.findFirst({
    where: { id: itemId, userId },
  });
  if (!current) {
    res.status(404).json({ error: "Projeto não encontrado." });
    return;
  }

  const updated = await prisma.project.update({
    where: { id: current.id },
    data: {
      name: req.body?.name ?? current.name,
      description: req.body?.description ?? current.description,
      status: req.body?.status ?? current.status,
    },
  });
  res.json(updated);
});

app.delete("/api/projects/:id", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const itemId = String(req.params.id);
  const current = await prisma.project.findFirst({
    where: { id: itemId, userId },
  });
  if (!current) {
    res.status(404).json({ error: "Projeto não encontrado." });
    return;
  }
  await prisma.project.delete({ where: { id: current.id } });
  res.status(204).send();
});

app.get("/api/themes", requireAuth, async (_req, res) => {
  const userId = res.locals.userId as string;
  const themes = await prisma.theme.findMany({ where: { userId }, orderBy: { name: "asc" } });
  res.json(themes);
});

app.post("/api/themes", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const name = String(req.body?.name ?? "").trim();
  if (!name) {
    res.status(400).json({ error: "Nome do tema é obrigatório." });
    return;
  }

  const theme = await prisma.theme.create({
    data: { userId, name },
  });
  res.status(201).json(theme);
});

app.get("/api/ideas", requireAuth, async (_req, res) => {
  const userId = res.locals.userId as string;
  const ideas = await prisma.idea.findMany({
    where: { userId },
    include: {
      themes: {
        include: { theme: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(
    ideas.map((idea) => ({
      ...idea,
      themes: idea.themes.map((item) => item.theme),
    })),
  );
});

app.post("/api/ideas", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const idea = await prisma.idea.create({
    data: {
      userId,
      title: String(req.body?.title ?? ""),
      description: req.body?.description ? String(req.body.description) : null,
      status: req.body?.status,
      priority: req.body?.priority ?? null,
      projectId: req.body?.projectId ?? null,
    },
  });
  res.status(201).json(idea);
});

app.patch("/api/ideas/:id", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const itemId = String(req.params.id);
  const current = await prisma.idea.findFirst({
    where: { id: itemId, userId },
  });
  if (!current) {
    res.status(404).json({ error: "Ideia não encontrada." });
    return;
  }
  const updated = await prisma.idea.update({
    where: { id: current.id },
    data: {
      title: req.body?.title ?? current.title,
      description: req.body?.description ?? current.description,
      status: req.body?.status ?? current.status,
      priority: req.body?.priority ?? current.priority,
      projectId: req.body?.projectId ?? current.projectId,
    },
  });
  res.json(updated);
});

app.post("/api/ideas/:id/themes", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const itemId = String(req.params.id);
  const idea = await prisma.idea.findFirst({
    where: { id: itemId, userId },
  });
  if (!idea) {
    res.status(404).json({ error: "Ideia não encontrada." });
    return;
  }

  const themeIds = Array.isArray(req.body?.themeIds)
    ? (req.body.themeIds as string[])
    : [];

  await prisma.ideaTheme.deleteMany({ where: { ideaId: idea.id } });
  if (themeIds.length > 0) {
    const validThemes = await prisma.theme.findMany({
      where: { userId, id: { in: themeIds } },
      select: { id: true },
    });
    const rows = validThemes.map((theme) => ({ ideaId: idea.id, themeId: theme.id }));
    if (rows.length > 0) {
      await prisma.ideaTheme.createMany({ data: rows });
    }
  }

  res.status(204).send();
});

app.delete("/api/ideas/:id", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const itemId = String(req.params.id);
  const current = await prisma.idea.findFirst({
    where: { id: itemId, userId },
  });
  if (!current) {
    res.status(404).json({ error: "Ideia não encontrada." });
    return;
  }
  await prisma.idea.delete({ where: { id: current.id } });
  res.status(204).send();
});

app.get("/api/commitments", requireAuth, async (_req, res) => {
  const userId = res.locals.userId as string;
  const items = await prisma.commitment.findMany({
    where: { userId },
    orderBy: { dueDate: "asc" },
  });
  res.json(
    items.map((item) => ({
      ...item,
      status: normalizeCommitmentStatus(item.status, item.dueDate),
      dueDate: item.dueDate.toISOString().slice(0, 10),
    })),
  );
});

app.post("/api/commitments", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const created = await prisma.commitment.create({
    data: {
      userId,
      title: String(req.body?.title ?? ""),
      description: req.body?.description ? String(req.body.description) : null,
      dueDate: new Date(String(req.body?.dueDate ?? "")),
      status: req.body?.status,
      projectId: req.body?.projectId ?? null,
    },
  });
  res.status(201).json({
    ...created,
    dueDate: created.dueDate.toISOString().slice(0, 10),
  });
});

app.patch("/api/commitments/:id", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const itemId = String(req.params.id);
  const current = await prisma.commitment.findFirst({
    where: { id: itemId, userId },
  });
  if (!current) {
    res.status(404).json({ error: "Compromisso não encontrado." });
    return;
  }
  const updated = await prisma.commitment.update({
    where: { id: current.id },
    data: {
      title: req.body?.title ?? current.title,
      description: req.body?.description ?? current.description,
      dueDate: req.body?.dueDate ? new Date(String(req.body.dueDate)) : current.dueDate,
      status: req.body?.status ?? current.status,
      projectId: req.body?.projectId ?? current.projectId,
    },
  });
  res.json({
    ...updated,
    dueDate: updated.dueDate.toISOString().slice(0, 10),
  });
});

app.delete("/api/commitments/:id", requireAuth, async (req, res) => {
  const userId = res.locals.userId as string;
  const itemId = String(req.params.id);
  const current = await prisma.commitment.findFirst({
    where: { id: itemId, userId },
  });
  if (!current) {
    res.status(404).json({ error: "Compromisso não encontrado." });
    return;
  }
  await prisma.commitment.delete({ where: { id: current.id } });
  res.status(204).send();
});

if (isProduction && existsSync(distDir)) {
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

async function start() {
  try {
    await prisma.$connect();
  } catch (err) {
    console.error("[hub-api] Erro ao conectar no banco:", err);
    console.error("[hub-api] Verifique DATABASE_URL em packages/hub/.env e rode: npm run db:push -w @aiox/hub");
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`[hub-api] running on http://localhost:${port}`);
  });
}

start();
