

## Digital Lab — Aplicación B2B de Diagnóstico Digital para PYMEs

### Páginas y funcionalidad

**1. Landing Page**
- Hero con mensaje de impacto ("¿Cuánto está perdiendo tu empresa...?")
- CTA principal → "Evaluar mi nivel digital" (lleva al diagnóstico)
- Secciones: 3 cards de servicios, beneficios, testimonios, CTA demo
- Paleta: Azul #2E86AB + Verde #10B981, estilo SaaS moderno

**2. Diagnóstico (Quiz interactivo)**
- Formulario tipo Typeform con barra de progreso
- ~8-10 preguntas sobre: uso de datos, nivel tecnológico, automatización, sector/tamaño
- Navegación paso a paso, una pregunta por pantalla
- Resultados calculados al finalizar

**3. Resultados**
- Score de competitividad (%) con gráfico circular
- Estimación de pérdida económica anual
- Nivel de madurez digital (básico/intermedio/avanzado)
- Gráficos radar de áreas evaluadas
- Quick wins + soluciones sugeridas
- CTAs: "Ver solución personalizada" y "Agendar demo"

**4. Catálogo de servicios**
- Cards de servicios filtrados según resultado del diagnóstico
- Pricing orientativo por servicio
- Botón "Contratar" por servicio

**5. Contratación**
- Flujo: selección servicio → formulario empresa → pago simulado → confirmación
- Formulario con datos de empresa (nombre, CIF, contacto)

**6. Dashboard Cliente**
- Vista de servicios contratados con estado
- Métricas clave (KPIs simulados)
- Tickets de soporte
- Insights generados

### Diseño
- Mobile-first, responsive
- Tipografía moderna (Inter)
- Animaciones sutiles en transiciones del quiz y aparición de resultados
- Gráficos con Recharts

### Datos
- Todo en estado local (React state/context), sin backend
- Los resultados del diagnóstico se almacenan en contexto para personalizar catálogo y dashboard

