# Ficha Técnica — Hackathon EPIS XXI

| | |
|---|---|
| **Proyecto** | Alerta Temprana Explicable |
| **Reto** | Reto 2 — Educación · Categoría B: Vanguardia (IA Generativa) |
| **Nombre del equipo** | Stella |
| **Integrantes** | Isaias Ramos Lopez (27202506) · John Carlos Solca Prado (27210502) |
| **Institución** | UNSCH — Escuela Profesional de Ingeniería de Sistemas |
| **Fecha** | 1 de julio de 2026 |
| **Jurados** | Pelayo Quispe Bautista · Stivens Rayli Espinoza Reina |

---

## 1. Problema abordado

El riesgo de deserción o rezago escolar en el Perú se detecta tarde, cuando el estudiante ya acumuló faltas o bajó notablemente sus notas. En secundaria rural la tasa de deserción llega al 5.2 % (hasta 8.6 % en mujeres) y solo el 16.7 % de los estudiantes rurales de 2.° de primaria alcanza el nivel esperado en comprensión lectora (MINEDU/ECE). El docente no dispone de una herramienta sencilla para identificar señales tempranas ni para personalizar el apoyo según las características concretas de cada estudiante.

**Pregunta orientadora:** ¿Cómo podríamos ayudar a docentes a detectar a tiempo a los estudiantes en riesgo de bajo rendimiento o deserción, y ofrecerles un apoyo pertinente?

---

## 2. Solución implementada

Plataforma web full-stack con tres componentes articulados:

**a) Motor de riesgo explicable** — cuatro reglas deterministas y auditables sobre los registros bimestrales del estudiante:

| Regla | Umbral |
|---|---|
| Asistencia crítica | Promedio bimestral < 75 % |
| Rendimiento bajo | Promedio de notas < 11 / 20 |
| Tendencia negativa | Nota último bimestre < nota primer bimestre − 2 pts. |
| Baja participación | Promedio ≤ 2 / 5 |

El número de reglas activadas determina el nivel: **0 → bajo · 1–2 → medio · 3+ → alto**. Cada evaluación guarda los motivos activados en base de datos (TEXT[]), no solo el nivel, garantizando explicabilidad completa.

**b) Recomendación personalizada con IA generativa** — cuando el docente solicita una recomendación, el sistema construye un prompt en español con el contexto real del estudiante: zona (rural/urbana), lengua materna, nivel/grado, tasa de deserción distrital, y los motivos concretos del riesgo. Gemini (`gemini-flash-latest`) genera una explicación pedagógica y una acción sugerida específica para ese caso. La respuesta se parsea y persiste vinculada al assessment.

**c) Interfaz de gestión** — el docente puede registrar nuevos estudiantes, ingresar registros de asistencia y notas por bimestre, evaluar el riesgo con un clic, consultar un panel de alertas (solo alto riesgo) y revisar el historial de recomendaciones generadas.

---

## 3. Arquitectura técnica

```
Next.js 16 (RSC + next-auth v5)
        │  REST /api/v1/*
        ▼
Go 1.26 · net/http · Repository Architecture
        │
        ├── Motor de riesgo (4 reglas)
        ├── Gemini API (gemini-flash-latest)
        └── PostgreSQL 18 — 3 schemas: auth · academic · metrics
```

**Frontend:** Next.js 16.2 · React 19 · TypeScript · Tailwind CSS · shadcn/ui v4 · next-auth v5
**Backend:** Go 1.26 · net/http estándar · zerolog · pgx/v5 · golang-jwt/v5 · argon2id
**Base de datos:** PostgreSQL 18 · esquemas `auth`, `academic`, `metrics` · 10 tablas
**IA:** Google Gemini API — modelo `gemini-flash-latest` · prompt en español con contexto estructurado

**Endpoints principales:**

| Método | Ruta | Función |
|---|---|---|
| `GET` | `/api/v1/students` | Lista con riesgo calculado en tiempo real |
| `POST` | `/api/v1/students` | Registrar nuevo estudiante |
| `POST` | `/api/v1/students/{id}/records` | Upsert registro bimestral |
| `POST` | `/api/v1/students/{id}/assess` | Evaluar riesgo y guardar assessment |
| `POST` | `/api/v1/students/{id}/recommend` | Generar recomendación con Gemini |
| `GET` | `/api/v1/recommendations` | Historial de recomendaciones |

---

## 4. Uso de la IA generativa

La IA no es decorativa: el motor de reglas determina **qué** riesgo existe y **por qué**; el LLM traduce esos motivos en una recomendación pedagógica humana, contextualizada y no genérica.

El prompt incluye explícitamente: zona rural/urbana, lengua materna, grado y nivel educativo, tasa de deserción distrital del año escolar 2023/24 (dato MINEDU), y los motivos activados en lenguaje natural. La respuesta se extrae como JSON `{"explanation":"...","suggested_action":"..."}` y se persiste vinculada al assessment de riesgo.

---

## 5. Dataset y fuentes

El sistema usa **datos ficticios** para todos los estudiantes. Los registros de seguimiento se generan de forma determinista calibrada con datos públicos agregados:

- **Tasa y número de desertores en Educación Primaria/Secundaria 2023–2024** — MINEDU / Plataforma Nacional de Datos Abiertos (`datosabiertos.gob.pe`). Usada para que los indicadores ficticios reflejen la distribución real de riesgo por distrito.
- **25 perfiles de demostración:** 20 generados a partir de tasas de deserción de 20 distritos reales + 5 deterministas con todos los factores de riesgo activados para demostración inmediata.

No se usan datos reales de menores. Las recomendaciones están formuladas para no estigmatizar al estudiante.

---

## 6. Demostración en vivo

Flujo de demostración de 7 minutos:

1. Login como docente → panel principal con distribución de riesgo
2. Panel **Alertas** → 5 estudiantes en rojo listos para mostrar
3. Detalle de estudiante de alto riesgo → ver 4 factores activados y gráfico bimestral
4. Clic **Evaluar ahora** → resultado instantáneo con motivos
5. Clic **Generar recomendación con IA** → respuesta contextualizada de Gemini en ~3 s
6. Registrar un nuevo bimestre con peores datos → re-evaluar → nivel sube a alto
7. Panel **Recomendaciones** → historial de todas las generadas

---

## 7. Alcance y restricciones

**Incluye:** clasificación de riesgo explicable · recomendación personalizada por IA · gestión de estudiantes y registros bimestrales · panel de alertas · historial de recomendaciones.

**No incluye:** integración con SIAGIE ni sistemas oficiales MINEDU · datos reales de menores · diagnóstico ni decisión definitiva — solo orientación al docente.

> *Esta herramienta es un prototipo de apoyo pedagógico (MVP). No reemplaza el criterio profesional del docente ni constituye una evaluación oficial.*
