# OpalTraceWebapp

`opaltrace-webapp` es una aplicación cliente Angular 21 para OpalTrace by MINEX — una plataforma SaaS de trazabilidad mineral responsable que conecta la cadena productiva desde la extracción hasta la certificación de joyería, garantizando origen ético y transparencia blockchain en cada etapa.

## Features

- Registro de lotes minerales con validación de zona GPS autorizada y generación de ID `OT-YYYY-NNNN`
- Cadena de custodia con escaneo QR y actualización de ubicación en tránsito
- Panel de alertas automáticas de anomalías (discrepancia de peso, salto de estado, demora GPS)
- Procesamiento en refinería: recepción, división en sublotes y registro de merma
- Inventario de joyería: recepción de material certificado OpalTrace y material externo
- Flujo de certificación de productos de joyería con QR verificable (`CERT-YYYY-NNNN`)
- Verificación pública de autenticidad por QR sin autenticación requerida
- Dashboard analítico con métricas de lotes por estado y periodo (día/semana/mes/año)
- Reporte ESG exportable (plan Platinum)
- Certificado de Origen de lote con historial de eventos en timeline visual
- Gestión de suscripciones y planes (Silver / Gold / Platinum) por segmento de empresa
- Internacionalización español/inglés con `ngx-translate`
- Arquitectura DDD por bounded context con Angular Signals y componentes standalone
- Mock REST API con `json-server` y datos de demostración completos

## Team

| Integrante | GitHub |
| --- | --- |
| Armestar Felipa, Adrian Andres | [@adrianAF](https://github.com/adrianAF) |
| Baldeon Vivar, Santiago Armando | [@Santibal11](https://github.com/Santibal11) |
| Philco Mota, Katty Yolanda | [@kattyPM](https://github.com/kattyPM) |
| Vergaray Calderon, Rose Almendra | [@roseVC](https://github.com/roseVC) |
| Yi Torrejon, Ethan Raul | [@ethanYT](https://github.com/ethanYT) |

## Prerequisites

- Node.js 20 LTS o superior
- npm 10+
- Angular CLI 21

## Installation

```bash
npm install
```

## Running the Application

Iniciar el servidor de datos mock (json-server) en una terminal:

```bash
npm run server
```

Iniciar la aplicación Angular en otra terminal:

```bash
ng serve --open
```

La aplicación estará disponible en `http://localhost:4200` y la API mock en `http://localhost:3000`.
