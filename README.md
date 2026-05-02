# AgroDrone Idle

AgroDrone Idle es un juego web idle/incremental donde el jugador gestiona una granja inteligente desde una estación de control, enviando drones para escanear cultivos, regar parcelas, controlar plagas y optimizar la producción con ayuda de un asesor IA.

## Capturas

Sección preparada para agregar capturas del panel principal una vez desplegado.

## Características

- Interfaz en español, minimalista y visual, pensada como una cabina agrícola de una sola pantalla.
- Recursos visibles: dinero, cosecha, agua, energía y datos agrícolas.
- Mapa 3x3 de parcelas con salud, humedad, plagas y crecimiento.
- Drones con acciones claras: escanear, regar, controlar plaga y cosechar.
- Bucle idle por segundo con crecimiento, degradación de humedad, presión de plagas, ingreso pasivo y recuperación de batería.
- Mejoras compactas para comprar drones, subir eficiencia, batería, centro de control y automatizaciones.
- Eventos y recomendaciones del Asesor IA en modo simulado.
- Guardado automático en LocalStorage, carga al iniciar y reinicio con confirmación.
- Estructura preparada para conectar OpenAI más adelante mediante `VITE_OPENAI_API_KEY`.

## Tecnologías

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- LocalStorage
- lucide-react

## Correr Localmente

```bash
npm install
npm run dev
```

El servidor de desarrollo imprime una URL local, normalmente `http://localhost:5173`.

Para verificar compilación de producción:

```bash
npm run build
```

Para correr revisión de código:

```bash
npm run lint
```

## Variables De Entorno

Copiar `.env.example` a `.env` si se quiere experimentar con la futura conexión de IA.

```bash
VITE_OPENAI_API_KEY=
```

El MVP funciona sin API key porque usa IA simulada por defecto.

## Bucle De Juego

- Las parcelas crecen mejor con buena salud, humedad suficiente y baja plaga.
- Las acciones de drones consumen batería y recursos.
- Los drones recuperan batería cuando están libres o cargando.
- El campo genera dinero pasivo según su estado productivo.
- Las automatizaciones ejecutan riego, escaneo y cosecha en intervalos simples.
- El Asesor IA analiza el estado real y sugiere prioridades.

## Arquitectura

- `src/store/gameStore.ts` organiza estado global y acciones del jugador.
- `src/utils/gameEngine.ts` contiene simulación, acciones de drones y automatización.
- `src/utils` guarda cálculos, balance y formateadores.
- `src/data` define estado inicial y textos de mejoras.
- `src/services/aiService.ts` abstrae IA simulada y futuro adaptador OpenAI.
- `src/services/saveService.ts` aísla persistencia local.
- `src/components` contiene paneles y tarjetas de la interfaz.

## IA Simulada Y Lista Para API

`aiService.ts` expone:

- `generateFarmEvent(gameState)` para eventos inteligentes simulados.
- `generateAdvisorRecommendation(gameState)` para recomendaciones basadas en humedad, plagas, energía, cosecha y datos.
- `generateOpenAIRecommendation(gameState)` como marcador protegido para integración futura.

Para producción, las llamadas reales a OpenAI deberían moverse a un backend para no exponer claves privadas en el navegador.

## Próximos Pasos

- Progreso sin conexión.
- Más cultivos y expansión de parcelas.
- Eventos de mercado más ricos.
- Tests de balance y migraciones de guardado.
- Backend liviano para IA real.
- Despliegue público y capturas de portafolio.

## Valor Para Portafolio

El proyecto demuestra modelado de dominio con TypeScript, estado global con Zustand, UI responsive con Tailwind, lógica incremental, persistencia local, arquitectura modular y una integración de IA preparada para evolucionar.
