# Alerta Temprana Explicable — Reto 2: Educación

**Hackathon EPIS XXI — "Innovando para el Perú"**
Categoría B: Vanguardia (IA Generativa) · UNSCH — Escuela Profesional de Ingeniería de Sistemas

---

## 1. Tema

Sistema de apoyo a docentes y tutores para la **detección temprana de estudiantes en riesgo de bajo rendimiento o deserción escolar**, con recomendaciones de intervención personalizadas y explicables generadas mediante IA generativa.

## 2. Problemática

En 2.º de primaria rural solo el 16.7 % de los estudiantes alcanza el nivel esperado en comprensión lectora, frente al 49.7 % en zonas urbanas (ECE, MINEDU), y la deserción en secundaria rural llega al 5.2 % (hasta 8.6 % en mujeres). Estos indicadores afectan principalmente a estudiantes de zonas rurales y de menor nivel socioeconómico, donde 6 de cada 10 no tienen internet en casa (BID, 2024) y el quechua es lengua materna en muchas comunidades.

**El problema central:** el riesgo de deserción o rezago suele detectarse tarde, cuando el estudiante ya acumuló muchas faltas o bajó notablemente sus notas. El docente no cuenta con una herramienta simple para identificar señales tempranas ni para personalizar el apoyo según el caso.

## 3. Solución propuesta

Una plataforma web que:

1. **Registra** datos de seguimiento ficticios del estudiante (asistencia, notas, participación) — mínimo 15–20 registros de demostración, sin usar datos reales de menores.
2. **Clasifica el riesgo** (bajo / medio / alto) mediante reglas explícitas y verificables (no caja negra), a partir de umbrales de asistencia, tendencia de notas y participación.
3. **Genera una recomendación personalizada** con IA generativa, tomando como contexto los motivos concretos del riesgo detectado, evitando mensajes genéricos o estigmatizantes.
4. Muestra siempre un aviso de que la herramienta **orienta al docente, no reemplaza su criterio profesional** ni sistemas oficiales (SIAGIE/MINEDU).

### Por qué la IA generativa es un componente real

El motor de reglas determina _qué_ riesgo existe y _por qué_ (explicabilidad). El LLM traduce esos motivos en una explicación humana y una acción de apoyo concreta y contextualizada (zona, lengua materna, tipo de riesgo) — no un texto plantilla.

### Fuentes de calibración (datos públicos agregados)

Para que los estudiantes ficticios reflejen una distribución realista de riesgo, sin usar microdatos reales de menores:

- **Tasa de deserción distrital 2023/2024** — MINEDU, Plataforma Nacional de Datos Abiertos (`datosabiertos.gob.pe`).
- **Padrón de Instituciones Educativas** — ESCALE/MINEDU (nombre de IE, zona rural/urbana, tipo de gestión).

## 4. Arquitectura

```
┌──────────────────────┐        ┌──────────────────────────┐        ┌───────────────┐
│   client (Next.js)   │ ─────▶ │   api (Go)               │ ─────▶ │  PostgreSQL   │
│  Feature Architecture│  REST  │  Repository Architecture │        │               │
└──────────────────────┘        └──────────┬───────────────┘        └───────────────┘
                                           │
                                           ▼
                                 ┌───────────────────┐
                                 │  Anthropic API    │
                                 │  (Claude - reco-  │
                                 │  mendaciones)     │
                                 └───────────────────┘
```

Todo el stack corre orquestado con **Docker Compose** sobre una red compartida.

---

### 4.1 Client — Next.js (Feature-based Architecture)

```
client/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard: lista de estudiantes
│   │   └── students/
│   │       └── [id]/
│   │           └── page.tsx            # Detalle + recomendación
│   │
│   ├── features/
│   │   ├── students/
│   │   │   ├── components/
│   │   │   │   ├── StudentCard.tsx
│   │   │   │   ├── StudentTable.tsx
│   │   │   │   ├── RiskBadge.tsx
│   │   │   │   └── StudentDetailChart.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useStudents.ts
│   │   │   │   └── useStudentDetail.ts
│   │   │   ├── api/
│   │   │   │   └── students.api.ts     # fetchers al backend Go
│   │   │   ├── types/
│   │   │   │   └── student.types.ts
│   │   │   └── utils/
│   │   │       └── riskColor.ts
│   │   │
│   │   └── recommendations/
│   │       ├── components/
│   │       │   ├── RecommendationPanel.tsx
│   │       │   └── GenerateButton.tsx
│   │       ├── hooks/
│   │       │   └── useRecommendation.ts
│   │       └── api/
│   │           └── recommendations.api.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/                     # botones, cards, badges genéricos
│   │   │   └── layout/
│   │   ├── lib/
│   │   │   └── httpClient.ts
│   │   └── config/
│   │       └── env.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile
```

**Principio:** cada feature (`students`, `recommendations`) es autocontenida — componentes, hooks, llamadas API y tipos propios. `shared/` solo contiene lo transversal (UI genérica, cliente HTTP, config).

---

### 4.2 API — Go (SERVER - Repository Architecture)

```
server/
├── cmd/
│   └── api/
│       └── main.go                     # entrypoint, wiring de dependencias
│
├── internal/
│   ├── domain/
│   │   ├── student.go                  # entidad Student, RiskLevel
│   │   └── recommendation.go           # entidad Recommendation
│   │
│   ├── repository/
│   │   ├── student_repository.go       # interface StudentRepository
│   │   ├── postgres/
│   │   │   ├── student_postgres.go     # implementación PostgreSQL
│   │   │   └── connection.go
│   │   └── seed/
│   │       └── seed_loader.go          # carga dataset ficticio inicial
│   │
│   ├── service/
│   │   ├── risk_service.go             # motor de reglas explícito
│   │   └── recommendation_service.go   # orquesta prompt + llamada a Claude
│   │
│   ├── handler/
│   │   ├── student_handler.go          # HTTP handlers /students
│   │   └── recommendation_handler.go   # HTTP handlers /recommend
│   │
│   ├── llm/
│   │   └── anthropic_client.go         # cliente API de Anthropic
│   │
│   └── router/
│       └── router.go                   # definición de rutas
│
├── pkg/
│   └── config/
│       └── config.go                   # variables de entorno
│
├── migrations/
│   ├── 0001_create_students.sql
│   └── 0002_create_recommendations.sql
│
├── go.mod
├── go.sum
└── Dockerfile
```

**Flujo (Repository Architecture):**

```
Handler → Service → Repository (interface) → Postgres (implementación)
                  → LLM Client (Anthropic)
```

- `domain/`: entidades puras, sin dependencias externas.
- `repository/`: interfaces (contrato) + implementación concreta en `postgres/`. Permite cambiar de motor de BD sin tocar el `service`.
- `service/`: lógica de negocio — clasificación de riesgo (reglas explícitas) y orquestación de la recomendación (arma el prompt con los motivos del riesgo y llama al LLM).
- `handler/`: capa HTTP (Gin o net/http), traduce requests/responses.

**Endpoints principales:**

| Método | Ruta                          | Descripción                                |
| ------ | ----------------------------- | ------------------------------------------ |
| `POST` | `/api/seed`                   | Carga dataset ficticio (15–20 estudiantes) |
| `GET`  | `/api/students`               | Lista estudiantes con riesgo calculado     |
| `GET`  | `/api/students/:id`           | Detalle de un estudiante                   |
| `POST` | `/api/students/:id/recommend` | Genera recomendación vía IA generativa     |

---

### 4.3 Base de datos — PostgreSQL

```sql
CREATE TABLE students (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_ficticio TEXT NOT NULL,
    ie              TEXT NOT NULL,        -- nombre real de IE (ESCALE)
    zona            TEXT NOT NULL,        -- rural/urbano
    lengua_materna  TEXT,
    ubigeo          TEXT,                 -- referencia a distrito real
    tasa_desercion_distrital NUMERIC(5,2),-- dato real MINEDU (contexto)
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE seguimiento (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID REFERENCES students(id) ON DELETE CASCADE,
    bimestre        INT NOT NULL,
    asistencia_pct  NUMERIC(5,2) NOT NULL,
    promedio_notas  NUMERIC(4,2) NOT NULL,
    participacion   INT NOT NULL CHECK (participacion BETWEEN 1 AND 5)
);

CREATE TABLE risk_assessments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID REFERENCES students(id) ON DELETE CASCADE,
    nivel_riesgo    TEXT NOT NULL CHECK (nivel_riesgo IN ('bajo','medio','alto')),
    motivos         TEXT[] NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE recommendations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID REFERENCES students(id) ON DELETE CASCADE,
    explicacion     TEXT NOT NULL,
    accion_sugerida TEXT NOT NULL,
    generated_at    TIMESTAMPTZ DEFAULT now()
);
```

> Todos los datos de `students` son **ficticios**. Los campos `ie`, `ubigeo` y `tasa_desercion_distrital` provienen de fuentes públicas agregadas (ESCALE / MINEDU Datos Abiertos), no de registros reales de menores.

---

### 4.4 Docker Compose

```yaml
version: "3.9"

services:
  education-frontend:
    build: ./client
    container_name: education-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://education-api:8080
    depends_on:
      - education-api
    networks:
      - hackathon-network

  education-api:
    build: ./api
    container_name: education-api
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=education-db
      - DB_PORT=5432
      - DB_USER=education
      - DB_PASSWORD=education
      - DB_NAME=education
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - education-db
    networks:
      - hackathon-network

  education-db:
    image: postgres:18
    container_name: education-db
    environment:
      - POSTGRES_USER=education
      - POSTGRES_PASSWORD=education
      - POSTGRES_DB=education
    volumes:
      - education-db-data:/var/lib/postgresql
    ports:
      - "5432:5432"
    networks:
      - hackathon-network

volumes:
  education-db-data:

networks:
  hackathon-network:
    driver: bridge
```

---

## 5. Alcance y restricciones

**Sí incluye:**

- Clasificación de riesgo explicable a partir de asistencia, notas y participación.
- Recomendación personalizada y no genérica generada por IA.
- Dataset de demostración de 15–20 estudiantes ficticios.

**No incluye:**

- Integración con SIAGIE ni sistemas oficiales de MINEDU.
- Uso de datos reales de estudiantes.
- Diagnóstico o decisión definitiva — solo orientación al docente.

## 6. Aviso legal / ético

Esta herramienta es un **prototipo de apoyo pedagógico (MVP)**. No reemplaza el criterio profesional del docente ni constituye una evaluación oficial. Todos los datos de estudiantes usados en la demo son **ficticios**.

## 7. Cómo ejecutar

```bash
git clone <repo-url>
cd education-risk-alert
cp .env.example .env   # agregar ANTHROPIC_API_KEY
docker compose up --build
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:8080`

## 8. Equipo

**Nombre del grupo:** Stella

- Isaias Ramos Lopez — Código: 27202506
- John Carlos Solca Prado — Código: 27210502

_Hackathon EPIS XXI, UNSCH_
