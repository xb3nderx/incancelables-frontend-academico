# ESTADO DEL PROYECTO — CHECKPOINT v1.2.1 (PROD) · MVP LOCAL v1.3 (dev)

`PROJECT_STATE.md` es el **estado oficial y actualizado del proyecto INCANCELABLES WEB**: checkpoint de producción **v1.2.1** (`master`) y estado de cierre del **MVP local de v1.3 — E-commerce** al **10/10/2026** (rama `dev`).

Este documento es público y puede subirse al repositorio GitHub. No contiene credenciales, tokens, secretos, IDs privados ni información sensible de infraestructura.

---

# ESTADO REAL CONFIRMADO

El proyecto tiene completadas las siguientes etapas:

- v1.0 — Lanzamiento oficial
- v1.1 — Galerías de fotografías
- v1.2 — Visor avanzado de fotografías
- v1.2.1 — Protección del paneo durante pinch

La versión publicada en producción (`master` / GitHub Pages) es:

**v1.2.1**

En la rama de desarrollo `dev`, el estado vigente es el **MVP local de v1.3** (ver sección propia más abajo).

Commit de PROD:

`ef6d7d8`

Mensaje:

`Visor de fotos v1.2.1 - proteger paneo durante pinch`

El commit `ef6d7d8` está contenido en:

- `dev`
- `master`

La comprobación Git realizada fue:

`git merge-base --is-ancestor ef6d7d8 master`

con resultado verdadero.

---

# MVP LOCAL DE v1.3 AL 10/10/2026

## Estado

**CIERRE FUNCIONAL LOCAL** en la rama `dev` (HEAD `75ca293`, 2026-10-09), dentro del trabajo académico de e-commerce.

- El flujo completo de compra está implementado y funcional en el MVP local.
- El MVP local no presenta defectos bloqueantes conocidos.
- **No hay despliegue:** `master` permanece en v1.2.1 y el e-commerce no está publicado (ver sección Cierre funcional local vs despliegue posterior).
- Cambios sin commit al 10/10/2026: 5 archivos JavaScript, exclusivamente de comentarios (+181 / −41), y los 3 documentos de cierre (`documentacion/CHANGELOG.md`, `documentacion/ROADMAP.md`, `documentacion/PROJECT_STATE.md`).

## Flujo completo implementado

1. **Catálogo** (`pages/tienda.html`): productos desde `GET /api/productos` (API REST PHP del e-commerce).
2. **Carrito** (`scripts/carrito.js`): persistencia en `sessionStorage`, drawer responsive con cantidades y totales informativos.
3. **Checkout** (`scripts/tienda.js`): formulario guest, `POST /api/pedidos` → Pedido en `PEND_VERIF`, con correcciones comerciales reintentables.
4. **Mensaje bloqueante de pedido creado:** modal con el email del comprador (insertado con `textContent`), único control [OK] y foco retenido; la creación queda marcada en `sessionStorage` (aislamiento por pestaña: ninguna otra pestaña ve la marca ni pierde su carrito).
5. **Verificación de email:** enlace hacia `pages/resultado.html?flow=checkout&token=...` → `POST /api/email-verificaciones/validar` → **Continuar compra** hacia `pages/tienda.html?token=...`.
6. **Recuperación del Pedido:** `POST /api/email-verificaciones/pedidos`; sólo continúa el Pedido en `PEND_PAGO`, que reemplaza (nunca fusiona) el carrito local. El token vive sólo en memoria; `BroadcastChannel` no se usa.
7. **Pago simulado:** `POST /api/pedidos/{id}/pago` con simulación `APROBADO` (sin cobros reales); si los items del carrito difieren del snapshot del Pedido, primero `POST /api/email-verificaciones/pedidos/reemplazo`.
8. **Resultados:** `PAGADO` ⇒ confirmación y vaciado del carrito; `PAGADO_STOCK_NO_AFECTADO` ⇒ mensaje de revisión con el carrito conservado; `rechazado` y `correccion` ⇒ reintento dentro del mismo drawer; errores identificables vuelven al modo normal de la tienda.

## Validaciones disponibles

- **Automatizada:** `node tests/checkoutA.test.mjs` → **88/88 PASS** (última corrida: 2026-10-10, con los cambios de comentarios todavía sin commit). Incluye aserciones estáticas sobre el fuente: sin `localStorage`, sin `BroadcastChannel`, marca con `sessionStorage.setItem(CLAVE_PEDIDO_CREADO)` y presencia de `mostrarContinuarCompra`, entre otras. Sintaxis `node --check` OK en los archivos intervenidos.
- **Manual:** recorrido humano del flujo completo con **pago aprobado** (creación → verificación → recuperación → pago `APROBADO` → confirmación), validado sobre el MVP local. Es evidencia distinta de la automatizada.
- Con motivo de la actualización documental del 10/10/2026 no se volvió a ejecutar ninguna suite.

## Limitaciones conocidas

- Sin reenvío de verificación de email ni cooldown.
- Sin cancelación de Pedido ni estado `EN_PROCESO`.
- Pago simulado (proveedor `DUMMY`, sólo `APROBADO`/`RECHAZADO`): el MVP académico no realiza cobros.
- Token de verificación sólo en memoria: la única puerta de entrada es `?token=` en la URL.
- Carrito con alcance por pestaña (`sessionStorage`), por diseño.
- Deuda técnica conocida sin impacto funcional (auditoría interna previa al `75ca293`): `scripts/config/paths.js` sin uso, `aNumero` duplicada entre `scripts/tienda.js` y `scripts/carrito.js`, y `mostrarCorreccionDePago` / `mostrarCorreccionDeReemplazo` con lógica muy similar.
- `README.md` sin actualizar: su preparación según los requisitos académicos es una etapa posterior.

## Relación frontend / backend

- **Este repositorio (Incancelables Web):** frontend estático del sitio y de la tienda; no contiene backend propio.
- **Repositorio separado (Incancelables E-Commerce):** backend del e-commerce en **PHP + MariaDB** con **API REST**, consumido por el frontend mediante `scripts/api/tiendaClient.js`; email transaccional mediante **Resend**.
- **Google Apps Script + Google Sheets:** se conservan como backend del sitio y de la comunidad/newsletter (formularios, confirmación y baja), sin cambios por el MVP.
- Los tres conviven: el MVP no reemplaza ni migra el backend de Apps Script.

## Cierre funcional local vs despliegue posterior

| Concepto | Estado |
| --- | --- |
| Cierre funcional local del MVP | **COMPLETADO** — flujo completo, 88/88 automatizado, validación manual del pago aprobado, sin defectos bloqueantes conocidos |
| Despliegue a PROD del e-commerce | **NO REALIZADO** — `master` continúa en v1.2.1; no habrá ventas ni cobros reales |
| Último deploy del sitio | GitHub Pages `c4e7d20`, 2026-08-08, estado `success` (anterior a la etapa v1.3) |
| Pendientes posteriores (no requisitos de cierre) | reenvío de verificación, cancelación de Pedido, estado `EN_PROCESO`, README académico |

---

# SEPARACIÓN DEV / PROD

La separación entre DEV y PROD es un diseño intencional del proyecto.

`apiConfig.js` utiliza un parámetro de entorno:

- DEV → `ENVIRONMENT: "DEV"`
- PROD → `ENVIRONMENT: "PROD"`

El código selecciona automáticamente la API correspondiente según ese parámetro.

Existe además una excepción en el proceso de merge para preservar esta diferencia entre DEV y PROD.

Este mecanismo:

- funciona correctamente;
- es intencional;
- no debe considerarse un problema;
- no requiere cambios.

Los detalles operativos y de infraestructura permanecen en la documentación privada almacenada fuera del repositorio público.

---

# HISTORIAL DE VERSIONES

## v1.0 — Lanzamiento oficial

ESTADO: **COMPLETADO**

Principales elementos incorporados:

- sitio web oficial;
- frontend responsive;
- arquitectura frontend Vanilla HTML/CSS/JavaScript;
- backend Google Apps Script;
- persistencia mediante Google Sheets;
- formularios de contacto;
- comunidad/newsletter;
- doble opt-in;
- gestión de tokens;
- confirmación y baja;
- sistema de campañas;
- separación DEV/PROD;
- integración de Google Analytics 4;
- SEO y metadatos base;
- sitemap;
- robots.txt;
- dominio personalizado;
- Cloudflare;
- GitHub Pages;
- página 404 personalizada.

v1.0 constituye la base estable del proyecto.

---

## v1.1 — Galerías de fotografías

ESTADO: **COMPLETADO**

Se incorporaron:

- galerías históricas de shows;
- botón "Ver fotos";
- visor/modal responsive;
- separación entre flyers y fotografías;
- estructura de galerías por show;
- datos de galerías desacoplados del HTML;
- generación automática de datos de galerías;
- integración de las galerías con los shows históricos.

---

## v1.2 — Visor avanzado de fotografías

ESTADO: **COMPLETADO**

Se incorporó un visor individual de fotografías con:

- apertura individual de fotografías;
- zoom mediante rueda del mouse;
- zoom táctil mediante pinch;
- paneo;
- límites de desplazamiento;
- zoom centrado en el punto de interacción;
- zoom progresivo;
- escala mínima y máxima;
- cursor dinámico;
- restauración de posición de scroll;
- reset del estado al abrir una nueva fotografía;
- uso de Pointer Events.

La arquitectura del visor utiliza un estado centralizado para escala y desplazamiento.

La funcionalidad fue validada mediante pruebas automatizadas.

---

## v1.2.1 — Protección del paneo durante pinch

ESTADO: **COMPLETADO**

Commit:

`ef6d7d8`

Objetivo:

Evitar que un tercer puntero inicie accidentalmente el paneo mientras existe un gesto de pinch activo.

La implementación fue validada con:

**29/29 pruebas PASS**

v1.2.1 constituye el último checkpoint funcional confirmado **en producción**; el cierre del MVP local de v1.3 se registra en la sección propia y en `documentacion/CHANGELOG.md`.

---

## v1.3 — E-commerce (proyecto académico)

ESTADO: **MVP LOCAL COMPLETADO EN `dev` (SIN DESPLIEGUE)**

Etapa desarrollada en la rama `dev`. El MVP local incluye catálogo, carrito, checkout con verificación de email, mensaje bloqueante de pedido creado, recuperación del Pedido, pago simulado y confirmación (ver sección MVP LOCAL DE v1.3). El backend del e-commerce vive en un repositorio separado (PHP + MariaDB). Pendientes posteriores: reenvío de verificación, cancelación de Pedido y estado `EN_PROCESO`.

---

# ESTADO ACTUAL

## VERSIÓN PRODUCTIVA

**v1.2.1 — estable en `master`**

`master` es la rama productiva y contiene la versión estable **v1.2.1**.

Todas las funcionalidades previstas hasta v1.2.1 se consideran terminadas y validadas.

No existen tareas funcionales pendientes correspondientes a v1.0, v1.1, v1.2 o v1.2.1.

## DESARROLLO EN CURSO

**v1.3 — E-Commerce (proyecto académico) en `dev`**

v1.3 se desarrolla en la rama `dev` como parte de un trabajo académico sobre e-commerce.

Al 10/10/2026 el **MVP local está completado y validado** (ver sección MVP LOCAL DE v1.3): quedan como pendientes posteriores el reenvío de verificación, la cancelación de Pedido y el estado `EN_PROCESO`, y como etapa posterior cualquier decisión de despliegue.

El alcance definitivo se determinará a partir de los requisitos de dicho trabajo.

### Despliegue a PROD

El e-commerce **no se desplegará a PROD por ahora**: no habrá ventas ni cobros reales.

## AUDITORÍA TÉCNICA INTEGRAL

**POSTERGADA**

La auditoría técnica integral, originalmente prevista como v1.3, queda postergada. Según el roadmap vigente pasa a **v1.5**, después de la etapa de e-commerce (v1.3) y de estabilización y migración (v1.4).

Estas tareas todavía no deben considerarse realizadas.

---

# PRÓXIMOS OBJETIVOS

## v1.3 — E-commerce e infraestructura

ESTADO: **MVP LOCAL COMPLETADO EN `dev` — ETAPA ABIERTA**

Etapa desarrollada como proyecto académico. El MVP local está completado y validado (suite automatizada 88/88 PASS y validación manual del flujo con pago aprobado; ver sección MVP LOCAL DE v1.3). Quedan pendientes posteriores (reenvío de verificación, cancelación de Pedido, estado `EN_PROCESO`) y la definición de despliegue, fuera del alcance actual (ver `documentacion/ROADMAP.md`).

El e-commerce no se desplegará a PROD por ahora: no habrá ventas ni cobros reales.

## v1.4 — Estabilización y migración

ESTADO: **PENDIENTE**

Estabilización de la arquitectura una vez implementado el nuevo backend/API y, si corresponde, migración de las funcionalidades que hoy dependen de Google Apps Script y Google Sheets.

## v1.5 — Auditoría técnica integral

ESTADO: **POSTERGADA**

El alcance previsto comprende:

- SEO avanzado;
- Performance;
- Core Web Vitals;
- Accesibilidad;
- Lighthouse;
- optimización de assets;
- limpieza CSS;
- consolidación de código.

Estas tareas todavía no deben considerarse realizadas.

La auditoría deberá realizarse sobre la arquitectura ya evolucionada y estabilizada, y no debe reabrir funcionalidades ya cerradas salvo que aparezca evidencia concreta de un problema.

---

# FUTURAS VERSIONES

Las siguientes etapas pertenecen al roadmap futuro y quedan fuera del alcance actual. Parte de los conceptos de comercio podrá avanzar de forma acotada durante la etapa académica v1.3; el alcance completo de v2.x queda a definir:

## v2.0 — Plataforma de comercio y gestión de eventos

Concepto general:

Evolucionar progresivamente el sitio hacia una plataforma de gestión de comercio, entradas, merchandising y audiencia.

### v2.1 — Core de comercio electrónico

- clientes;
- productos;
- pedidos;
- pagos;
- Mercado Pago.

### v2.2 — Verificación de email reutilizable

Sistema reutilizable de verificación de correo electrónico.

### v2.3 — Venta de entradas

- entradas digitales;
- QR;
- envío por email.

### v2.4 — Check-in y control de acceso

- lectura de QR;
- control de acceso;
- registro de asistencia.

### v2.5 — Merchandising

- catálogo;
- stock;
- pedidos;
- logística/envíos.

### v2.6 — CRM y analítica de audiencia

- gestión de audiencia;
- segmentación;
- analítica;
- evolución de la comunidad.

Estas funcionalidades son FUTURAS y no forman parte del trabajo actual.

---

# ARQUITECTURA ACTUAL

## Frontend

Tecnologías principales:

- HTML;
- CSS;
- JavaScript Vanilla.

El proyecto NO utiliza:

- React;
- Vue;
- Angular;
- Vite.

La arquitectura frontend está orientada a un sitio estático y responsive, con datos desacoplados de las páginas HTML. Desde v1.3 incluye la tienda (`pages/tienda.html`: catálogo, carrito, checkout y continuación de la compra).

---

## Backend

El backend utiliza:

- Google Apps Script;
- Google Sheets;
- API mediante Web App;
- sistema de emails;
- configuración separada DEV/PROD.

### Backend del e-commerce (v1.3)

- PHP + MariaDB, en el repositorio separado **Incancelables E-Commerce**.
- API REST consumida por el frontend mediante `scripts/api/tiendaClient.js`.
- Email transaccional mediante **Resend**.
- Convive con el backend de Apps Script: el MVP no lo reemplaza ni migra.

La documentación detallada del backend y los procedimientos operativos sensibles se mantienen en documentación privada fuera del repositorio público.

---

## Hosting

El frontend se publica mediante:

- GitHub Pages;
- dominio personalizado;
- Cloudflare.

---

## Analytics

Google Analytics 4 está integrado de forma centralizada y se utiliza únicamente en producción.

La implementación se encuentra centralizada en:

`scripts/analytics.js`

Eventos principales implementados:

- `contact_form_submitted`
- `community_signup_requested`
- `community_signup_confirmed`

---

# DATOS Y CONTENIDOS

Los datos principales del sitio se encuentran desacoplados de las páginas HTML.

Entre ellos:

- discografía;
- shows;
- galerías.

Archivos principales:

- `scripts/data/discografia.js`
- `scripts/data/showsListado.js`
- `scripts/data/galerias.js`

Las galerías utilizan una estructura organizada por show.

---

# VISOR DE FOTOGRAFÍAS

El visor avanzado implementado durante v1.2/v1.2.1 utiliza:

- zoom;
- paneo;
- pinch;
- límites de movimiento;
- Pointer Events;
- estado centralizado de transformación.

La funcionalidad está considerada cerrada para el checkpoint v1.2.1.

---

# CONTROL DE VERSIONES

El desarrollo utiliza ramas separadas:

- `dev`
- `master`

El flujo DEV/PROD preserva deliberadamente las diferencias de configuración necesarias entre ambos entornos.

El estado del código se controla mediante Git.

IMPORTANTE:

El hecho de que un commit exista en Git no implica por sí mismo que una versión determinada esté actualmente publicada en producción.

Los estados de:

- Git;
- GitHub Pages;
- backend Apps Script;
- documentación

deben considerarse independientes.

---

# DOCUMENTACIÓN

La documentación pública del proyecto se mantiene dentro del repositorio cuando no contiene información sensible.

La documentación operativa o de infraestructura que pueda exponer información sensible se mantiene fuera del repositorio público.

Entre ella se encuentran los documentos privados relacionados con:

- backend;
- configuración operativa;
- backup;
- recuperación;
- infraestructura.

---

# CHECKPOINT

## Último checkpoint de producción (PROD, `master`)

**v1.2.1** — commit `ef6d7d8` — **COMPLETADO**

## Cierre funcional local (rama `dev`, MVP v1.3)

**MVP LOCAL COMPLETADO** al 10/10/2026 — HEAD `75ca293` (2026-10-09), suite automatizada 88/88 PASS y validación manual del flujo con pago aprobado. Sin despliegue.

## Próximo checkpoint

**v1.3 — cierre de la etapa** (pendientes posteriores del flujo de compra y definición de despliegue; ver `documentacion/ROADMAP.md`)

## Estado de v1.3

**MVP LOCAL COMPLETADO — ETAPA ABIERTA**

## Auditoría técnica integral

**POSTERGADA — v1.5**

---

# REGLA PARA FUTURAS ACTUALIZACIONES

Este documento debe actualizarse cuando se cierre una nueva versión significativa del proyecto.

No utilizar este documento para registrar cada cambio menor.

El objetivo de `PROJECT_STATE.md` es permitir identificar rápidamente:

1. dónde está el proyecto;
2. qué versiones están terminadas;
3. cuál es el próximo objetivo;
4. qué funcionalidades pertenecen al futuro;
5. cuál es la arquitectura general vigente.

---

# FIN DEL DOCUMENTO — CHECKPOINT v1.2.1 (PROD) · MVP LOCAL v1.3 AL 2026-10-10