# Alerta Temprana Explicable — Reto 2: Educación

**Hackathon EPIS XXI — "Innovando para el Perú"**
Categoría B: Vanguardia (IA Generativa) · UNSCH — Escuela Profesional de Ingeniería de Sistemas

---

## 1. Tema

Sistema de apoyo a docentes y tutores para la **detección temprana de estudiantes en riesgo de bajo rendimiento o deserción escolar**, con recomendaciones de intervención personalizadas y explicables generadas mediante IA generativa (Gemini).

## 2. Problemática

En 2.° de primaria rural solo el 16.7 % de los estudiantes alcanza el nivel esperado en comprensión lectora, frente al 49.7 % en zonas urbanas (ECE, MINEDU), y la deserción en secundaria rural llega al 5.2 % (hasta 8.6 % en mujeres). El riesgo de deserción o rezago suele detectarse tarde, cuando el estudiante ya acumuló muchas faltas o bajó notablemente sus notas. El docente no cuenta con una herramienta simple para identificar señales tempranas ni para personalizar el apoyo según el caso.

## 3. Solución

Plataforma web full-stack que:

1. **Registra** datos de seguimiento por bimestre — asistencia, notas y participación — para estudiantes ficticios de demostración.
2. **Clasifica el riesgo** (bajo / medio / alto) mediante cuatro reglas explícitas y verificables, sin caja negra.
3. **Genera una recomendación personalizada** con Gemini, contextualizada según zona, lengua materna, grado y factores de riesgo activos.
4. **Centraliza alertas** para que el docente priorice su intervención en los casos más críticos.

| Indicador | Umbral de alerta |
|---|---|
| Asistencia | Promedio bimestral < 75 % |
| Rendimiento | Promedio de notas < 11 / 20 |
| Tendencia | Nota último bimestre < nota primer bimestre − 2 puntos |
| Participación | Promedio ≤ 2 / 5 |

> 0 factores → riesgo **bajo** · 1–2 → **medio** · 3 o más → **alto**

## 4. Arquitectura

```
┌─────────────────────────┐        ┌──────────────────────────────┐        ┌──────────────┐
│  client (Next.js 16)    │ ─────▶ │  server (Go 1.26)            │ ─────▶ │  PostgreSQL  │
│  App Router · RSC       │  REST  │  net/http · Repository Arch. │        │  18 (Docker) │
│  next-auth v5 · shadcn  │        └──────────────┬───────────────┘        └──────────────┘
└─────────────────────────┘                       │
                                                  ▼
                                      ┌──────────────────────┐
                                      │  Gemini API          │
                                      │  gemini-flash-latest │
                                      └──────────────────────┘
```

### 4.1 Client — Next.js 16

```
client/
├── app/
│   ├── (auth)/login/              # Página de inicio de sesión
│   └── (protected)/dashboard/
│       ├── layout.tsx             # Sidebar + TooltipProvider
│       ├── page.tsx               # Panel principal con métricas
│       ├── students/
│       │   ├── page.tsx           # Tabla de estudiantes + riesgo
│       │   ├── new/page.tsx       # Formulario crear estudiante
│       │   └── [id]/page.tsx      # Detalle + registrar notas + IA
│       ├── recommendations/page.tsx
│       ├── alerts/page.tsx
│       ├── risk/page.tsx
│       └── metrics/page.tsx
├── components/
│   ├── layout/app-sidebar.tsx
│   └── students/
│       ├── risk-badge.tsx
│       ├── assess-button.tsx
│       ├── recommend-button.tsx
│       ├── record-form.tsx        # Registrar asistencia/notas
│       └── student-create-form.tsx
├── types/student.ts
├── auth.ts                        # next-auth v5 config
└── next.config.ts                 # rewrites /api/v1/* → backend
```

**Stack:** Next.js 16.2 · React 19 · TypeScript · Tailwind CSS · shadcn/ui v4 · next-auth v5 beta

### 4.2 Server — Go 1.26

```
server/
├── cmd/
│   ├── api/main.go                # Entrypoint
│   └── seed/main.go               # Carga dataset ficticio
├── internal/
│   ├── domain/                    # Entidades puras (Student, Recommendation)
│   ├── dto/                       # Request/response shapes
│   ├── repository/
│   │   ├── student_repository.go  # Interface
│   │   └── postgres/              # Implementación PostgreSQL
│   ├── service/
│   │   ├── risk_service.go        # Motor de 4 reglas explícitas
│   │   └── recommendation_service.go  # Prompt builder + Gemini
│   ├── handler/                   # HTTP handlers
│   ├── middleware/                 # Logger
│   └── router/router.go
├── pkg/
│   ├── config/                    # Viper + .env
│   ├── llm/                       # Interface LLM + GeminiClient
│   └── argon2id/                  # Hash de contraseñas
└── migrations/init.up.sql
```

**Flujo:**
```
Handler → Service → Repository (interface) → Postgres
        → RiskService (reglas explícitas)
        → LLM Client (Gemini)
```

**Endpoints:**

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/auth/signin` | Login, devuelve JWT |
| `GET` | `/api/v1/students` | Lista con riesgo calculado |
| `POST` | `/api/v1/students` | Crear nuevo estudiante |
| `GET` | `/api/v1/students/{id}` | Detalle completo |
| `POST` | `/api/v1/students/{id}/records` | Registrar / actualizar bimestre |
| `POST` | `/api/v1/students/{id}/assess` | Evaluar y guardar riesgo |
| `POST` | `/api/v1/students/{id}/recommend` | Generar recomendación IA |
| `GET` | `/api/v1/recommendations` | Historial de recomendaciones |

### 4.3 Base de datos — PostgreSQL 18

Tres schemas: `auth` (usuarios y roles), `academic` (estudiantes y seguimiento), `metrics` (logs y snapshots).

Tablas principales en `academic`:

| Tabla | Propósito |
|---|---|
| `districts` | Tasas de deserción distrital MINEDU 2023/24 (fuente pública) |
| `schools` | IE ficticias con zona y nivel |
| `students` | Perfiles ficticios enlazados a IE |
| `academic_records` | Seguimiento por bimestre (asistencia, notas, participación) |
| `risk_assessments` | Resultados del motor de riesgo con motivos en TEXT[] |
| `recommendations` | Recomendaciones IA enlazadas al assessment |

### 4.4 Dataset de demostración

El seed carga automáticamente:

- **20 estudiantes** con datos generados a partir de las tasas de deserción reales de 20 distritos (CSV MINEDU) — a mayor tasa, peores indicadores ficticios.
- **5 estudiantes de alto riesgo** deterministas con los 4 factores activados (asistencia 55–74 %, notas 7–11, participación 1–2).

Fuentes públicas usadas para calibración: *Tasa y número de desertores en Educación Primaria/Secundaria 2023–2024*, MINEDU / Plataforma Nacional de Datos Abiertos.

## 5. Cómo ejecutar

### Requisitos

- Go 1.22+
- Node.js 20+
- Docker (para PostgreSQL)

### Backend

```bash
cd server
cp .env.example .env        # completar GEMINI_API_KEY
make db/start               # PostgreSQL en :5546
make seed                   # migraciones + dataset ficticio
make dev                    # hot reload con air en :8086
```

### Frontend

```bash
cd client
cp .env.local.example .env.local   # BACKEND_URL + NEXTAUTH_SECRET
bun install
bun dev                            # :3000
```

### Credenciales demo

| Rol | Email | Contraseña |
|---|---|---|
| Admin | `admin@education.pe` | `admin123` |
| Docente | `teacher@education.pe` | `teacher123` |

## 6. Aviso ético

Esta herramienta es un **prototipo de apoyo pedagógico (MVP)**. No reemplaza el criterio profesional del docente ni constituye una evaluación oficial. Todos los datos de estudiantes son **ficticios**. Los datos de deserción distrital son de fuentes públicas agregadas (MINEDU), sin microdatos de menores.

## 7. Equipo

**Nombre del grupo:** Stella

- Isaias Ramos Lopez — Código: 27202506
- John Carlos Solca Prado — Código: 27210502

_Hackathon EPIS XXI — UNSCH, 1 de julio de 2026_
