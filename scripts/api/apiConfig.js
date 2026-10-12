// =======================================================
// API CONFIG — backend del SITIO (Google Apps Script)
// =======================================================
//
// Configura la Web App de Google Apps Script del sitio: la URL que
// consumen los formularios (scripts/api/forms.js) y las acciones de
// suscripción/baja de pages/resultado.html (confirm-json y
// unsubscribe-json), más el entorno que analytics.js usa para
// habilitar Analytics sólo en PROD.
//
// Es independiente de scripts/api/tiendaConfig.js, que configura la
// API REST PHP del e-commerce (v1.3): son backends distintos y los
// dos archivos conviven sin tocarse. ENVIRONMENT acá ("DEV"/"PROD")
// aplica sólo a este backend.
//
// TIMEOUT (ms) queda declarado como parte de la configuración; hoy
// ningún fetch de este backend lo aplica.

const API = {

    URL_DEV:
        "https://script.google.com/macros/s/AKfycbzMSx5lM48xVjKBwxpw-51y3unfKOXS8eb7EuqOrviNFSLnX1xQ36Jwvkpz1bbNwu0o/exec",

    URL_PROD:
        "https://script.google.com/macros/s/AKfycbwCdemjNBvYsy6MsqtEpfqjfctOGdxCK_S2ukxLQmCfM6TKXAwvPODOrruMngm9r5C8/exec",

    ENVIRONMENT: "DEV",

    TIMEOUT: 10000

};

API.URL =
    API.ENVIRONMENT === "PROD"
        ? API.URL_PROD
        : API.URL_DEV;