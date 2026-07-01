# Flujo de uso — Alerta Temprana Explicable

Sistema de detección temprana de deserción escolar para docentes y coordinadores.

---

## Acceso al sistema

1. Abre el navegador e ingresa a la URL del sistema.
2. Introduce tu correo y contraseña.
   - Cuenta demo docente: `teacher@education.pe` / `teacher123`
   - Cuenta demo admin: `admin@education.pe` / `admin123`
3. Presiona **Iniciar sesión**. Serás redirigido al panel principal.

---

## Panel principal (Dashboard)

Al iniciar sesión verás el resumen general:

- Conteo de estudiantes en **riesgo alto**, **medio** y **bajo**
- Distribución por zona (rural / urbana) y lengua materna
- Acceso rápido a todas las secciones desde la barra lateral izquierda

---

## 1. Registrar un nuevo estudiante

Usa esta función cuando incorpores un estudiante que aún no está en el sistema.

1. En la barra lateral ve a **Estudiantes**.
2. Haz clic en el botón **Nuevo estudiante** (esquina superior derecha).
3. Completa el formulario:
   - **Nombre completo** del estudiante
   - **Nombre de la institución educativa**
   - **Zona** — Rural o Urbana
   - **Lengua materna** — Español, Quechua, Aymara, etc.
   - **Nivel educativo** — Primaria o Secundaria
   - **Grado** — se ajusta automáticamente según el nivel
4. Haz clic en **Registrar estudiante**.

El sistema crea el perfil y te lleva directamente al detalle del estudiante para que puedas empezar a registrar sus notas.

---

## 2. Registrar asistencia y notas

Registra el seguimiento académico de un estudiante por bimestre.

1. Ve a **Estudiantes** y haz clic en el nombre del estudiante.
2. Baja hasta la sección **Registrar asistencia y notas**.
3. Selecciona el **Bimestre** (1 al 4).
4. Ingresa:
   - **Asistencia (%)** — porcentaje de días asistidos en el bimestre
   - **Promedio** — nota promedio en escala 0–20
   - **Participación** — nivel de participación en clase (1 = muy baja, 5 = excelente)
5. Haz clic en **Guardar registro**.

> Si ya existe un registro para ese bimestre, se actualizará automáticamente.

Después de guardar, la tabla **Seguimiento académico por bimestre** se actualiza en la misma página.

---

## 3. Evaluar el riesgo del estudiante

El motor de riesgo analiza los registros académicos y clasifica al estudiante en **bajo**, **medio** o **alto** riesgo según cuatro indicadores:

| Indicador     | Umbral de alerta                                                     |
| ------------- | -------------------------------------------------------------------- |
| Asistencia    | Promedio menor al 75 %                                               |
| Rendimiento   | Promedio de notas menor a 11/20                                      |
| Tendencia     | La nota del último bimestre cayó más de 2 puntos respecto al primero |
| Participación | Promedio igual o menor a 2/5                                         |

**Cómo evaluar:**

1. Entra al detalle del estudiante.
2. En la sección **Evaluación de riesgo**, haz clic en **Evaluar ahora**.
3. El sistema muestra inmediatamente el nivel de riesgo y los factores activados con su explicación.

> La evaluación se guarda en el historial para rastrear cambios en el tiempo.

---

## 4. Generar recomendación con IA

Una vez evaluado el riesgo, puedes solicitar una recomendación de intervención personalizada generada por inteligencia artificial.

1. En el detalle del estudiante, baja hasta la sección **Recomendación de intervención**.
2. Haz clic en **Generar recomendación con IA**.
3. Espera unos segundos mientras la IA analiza el contexto del estudiante:
   - Zona rural o urbana
   - Lengua materna
   - Factores de riesgo activos
   - Tasa de deserción distrital
4. La recomendación aparece con:
   - **Análisis** — explicación de por qué el estudiante está en riesgo
   - **Acción sugerida** — pasos concretos que el docente puede tomar

> La recomendación queda guardada y accesible desde la sección **Recomendaciones**.

---

## 5. Consultar alertas

La sección **Alertas** muestra únicamente los estudiantes con **riesgo alto** que requieren intervención inmediata.

1. En la barra lateral haz clic en **Alertas**.
2. Verás la lista de estudiantes críticos con:
   - Nombre e institución
   - Factores de riesgo activos
   - Botón para ir al detalle individual

Usa esta sección como punto de partida al inicio de cada semana para priorizar las intervenciones.

---

## 6. Historial de recomendaciones

Accede al historial completo de todas las recomendaciones generadas para cualquier estudiante.

1. En la barra lateral haz clic en **Recomendaciones**.
2. Verás cada recomendación con:
   - Nombre del estudiante y nivel de riesgo
   - Factores de riesgo asociados
   - Análisis y acción sugerida
   - Fecha y hora de generación
3. Haz clic en **Ver detalle del estudiante** para ir directamente al perfil.

---

## Flujo recomendado por semana

```
Lunes
  └─ Alertas → revisar estudiantes de riesgo alto

Martes – Jueves
  └─ Estudiantes → actualizar registros de asistencia y notas del bimestre en curso

Viernes
  └─ Evaluar riesgo → generar recomendaciones para nuevos casos críticos
  └─ Recomendaciones → revisar y planificar intervenciones de la siguiente semana
```

---

## Niveles de riesgo

| Nivel     | Color | Significado                                                                   |
| --------- | ----- | ----------------------------------------------------------------------------- |
| **Alto**  | Rojo  | Requiere intervención inmediata — contactar familia y coordinar con dirección |
| **Medio** | Ámbar | Seguimiento cercano — refuerzo académico y monitoreo de asistencia            |
| **Bajo**  | Verde | Sin señales de alerta activas — mantener seguimiento regular                  |
