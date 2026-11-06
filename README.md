# Práctica 2: Sitio Web Estático en Microsoft Azure con CI/CD

> **Materia:** Administración de Cómputo en la Nube  
> **Carrera:** Ingeniería Informática  
> **Institución:** Instituto Tecnológico José Mario Molina Pasquel y Henríquez (TecMM)  
> **Alumno:** César (`gr220112948-coder`)  
> **Valor:** 25 Puntos | Unidad 2  

---

## 🌐 URL Pública en Producción

- **Sitio Desplegado:** [https://jolly-river-08941b010.4.azurestaticapps.net](https://jolly-river-08941b010.4.azurestaticapps.net)
- **Repositorio:** [https://github.com/gr220112948-coder/Practica-Nube-Estatico](https://github.com/gr220112948-coder/Practica-Nube-Estatico)

---

## 📋 Descripción del Proyecto

Este repositorio contiene la solución completa para la **Práctica 2: Sitio Web Estático en Azure**. El proyecto implementa una arquitectura desacoplada y *serverless* que aloja una aplicación web estática de alto rendimiento en la nube de Microsoft Azure, completamente automatizada mediante un pipeline de Integración y Despliegue Continuo (CI/CD) con **GitHub Actions**.

Adicionalmente, el sitio web integra un panel de control interactivo que incluye:
- **Visualizador de la arquitectura en la nube** paso a paso.
- **Calculadora financiera interactiva de costos** (Azure Blob Storage vs Máquina Virtual).
- **Módulo de prueba del ciclo de cambio visible** (para validación de la Fase 4.2).
- **Tablero de monitoreo y métricas de rendimiento** (HTTP requests, latencia, ancho de banda).
- **Checklist de cumplimiento de las 4 fases** del laboratorio.

---

## 🏛️ Arquitectura del Sistema

```text
[ Desarrollador ] 
       │
       │ (git push origin main)
       ▼
[ GitHub Repository ]
       │
       │ (Webhook trigger)
       ▼
[ GitHub Actions CI/CD Runner ]
       │
       │ 1. Checkout & Validación sintáctica
       │ 2. Autenticación segura (OIDC / Secrets)
       │ 3. Sincronización diferencial de artefactos
       ▼
[ Microsoft Azure Cloud ]
   ├── Opción A: Azure Blob Storage ($web container)
   └── Opción B: Azure Static Web Apps (CDN global)
       │
       ▼
[ Usuario Final ] ◄── HTTPS / SSL / Baja latencia (99.99% SLA)
```

---

## 🚀 Fases del Laboratorio

### Fase 1: Preparación del Código Fuente y Control de Versiones
1. **Código fuente:** Desarrollado con tecnologías estándar de alto rendimiento (HTML5 semántico, CSS3 moderno con soporte claro/oscuro y JavaScript modular).
2. **Control de versiones:** Repositorio Git local inicializado con rama principal `main`, archivo `.gitignore` para seguridad de credenciales y publicado en GitHub.

### Fase 2: Implementación de Infraestructura en la Nube
El proyecto soporta dos opciones de hospedaje nativo en Azure:

#### Opción 2.A: Azure Blob Storage (Sitio Web Estático `$web`)
Comandos de Azure CLI para aprovisionar la infraestructura:
```bash
# 1. Crear Grupo de Recursos
az group create --name rg-cloudlab-estatico --location eastus

# 2. Crear Cuenta de Almacenamiento
az storage account create \
  --name sawebestatico$RANDOM \
  --resource-group rg-cloudlab-estatico \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2

# 3. Habilitar la función de Sitio Web Estático ($web)
az storage account blob-service-properties update \
  --account-name <NOMBRE_DE_TU_STORAGE_ACCOUNT> \
  --static-website \
  --index-document index.html \
  --error-document404-path index.html
```

#### Opción 2.B: Azure Static Web Apps (Recomendada con GitHub Actions nativo)
1. En el portal de Azure, busca **Static Web Apps** y haz clic en **Crear**.
2. Vincula tu cuenta de GitHub y selecciona este repositorio (`Practica-Nube-Estatico`).
3. En detalles de compilación elige:
   - **Preajustes de compilación:** Personalizado (Custom)
   - **Ubicación de la aplicación:** `/`
   - **Ubicación de salida:** Dejar en blanco o `/`

#### Fase 2.2: Gestión de Costos y Azure Budget
Para cumplir con el requerimiento de monitoreo financiero:
1. En Azure Portal, entra a **Cost Management + Facturación** > **Administración de Costos** > **Presupuestos (Budgets)**.
2. Agrega una regla de presupuesto con:
   - **Nombre:** `Presupuesto-Practica-Estatico`
   - **Monto:** `$5.00 USD` / mes
   - **Alerta de umbral:** Notificación por correo electrónico al alcanzar el **80% ($4.00 USD)**.

> **Justificación económica:** Un sitio web estático alojado en Blob Storage o Static Web Apps incurre en un costo aproximado de **$0.02 a $0.30 USD/mes**, debido a que solo se factura el almacenamiento consumido (megabytes) y las transacciones de lectura realizadas. En contraste, una Máquina Virtual (incluso de gama baja como B1s) genera un costo mensual fijo de **$15.00 a $25.00 USD/mes** por cómputo continuo y discos administrados, independientemente de si recibe visitas o está inactiva. El esquema estático representa más de un **98% de ahorro financiero**.

---

### Fase 3: Automatización del Flujo CI/CD

El repositorio incluye dos pipelines en `.github/workflows/`:
1. `.github/workflows/deploy-azure-storage.yml`: Para despliegue hacia Azure Blob Storage `$web`.
2. `.github/workflows/azure-static-web-apps.yml`: Para despliegue mediante Azure Static Web Apps.

#### Configuración de Secretos en GitHub:
En tu repositorio de GitHub ve a **Settings** > **Secrets and variables** > **Actions** y agrega los secretos según la opción que utilices:

- Para **Azure Blob Storage**:
  - `AZURE_STORAGE_ACCOUNT`: Nombre de la cuenta de almacenamiento.
  - `AZURE_STORAGE_KEY`: Llave de acceso (Access Key) de la cuenta de almacenamiento.
  - `AZURE_CREDENTIALS`: JSON generado con `az ad sp create-for-rbac` (opcional si usas llave directa).
- Para **Azure Static Web Apps**:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN`: Token de implementación generado por Azure (se crea automáticamente al vincular desde Azure Portal).

---

### Fase 4: Verificación, Monitoreo y Pruebas

#### 4.1 Monitoreo de Rendimiento
Para obtener las evidencias para el reporte:
1. Dirígete a la cuenta de almacenamiento en Azure Portal.
2. En el menú de navegación selecciona **Supervisión (Monitoring)** > **Métricas (Metrics)**.
3. Agrega las gráficas de:
   - **Transacciones (Transactions)**
   - **Salida / Tráfico transferido (Egress)**
   - **Latencia de extremo a extremo (Success E2E Latency)**
4. Captura pantalla para incluir en el documento de reporte PDF.

#### 4.2 Prueba del Ciclo de Despliegue Continuo
Para demostrar que el pipeline funciona automáticamente:
1. Abre `index.html` en tu entorno local.
2. Modifica el mensaje en la sección de verificación (línea con `id="liveMessage"` o cambia la versión a `v2.0.0`).
3. Envía el cambio con Git:
   ```bash
   git add .
   git commit -m "feat(fase4): prueba de actualizacion visible sin intervencion manual"
   git push origin main
   ```
4. Abre la pestaña **Actions** en GitHub para presenciar la ejecución automática del pipeline.
5. Recarga la URL pública de Azure para confirmar la actualización en vivo.

---

## 📁 Estructura del Repositorio

```text
├── .github/
│   └── workflows/
│       ├── azure-static-web-apps.yml    # Pipeline CI/CD para Azure Static Web Apps
│       └── deploy-azure-storage.yml     # Pipeline CI/CD para Azure Blob Storage ($web)
├── .gitignore                           # Exclusión de archivos temporales y secretos
├── index.html                           # Aplicación web estática principal
├── styles.css                           # Hojas de estilo modernas y responsivas
├── app.js                               # Lógica interactiva, simulador de costos y métricas
├── REPORTE_PRACTICA.md                  # Plantilla estructurada para el reporte PDF
└── README.md                            # Documentación técnica completa del proyecto
```

---

## 👨‍💻 Autor

- **Nombre:** César  
- **Usuario GitHub:** [@gr220112948-coder](https://github.com/gr220112948-coder)  
- **Institución:** TecMM El Grullo - Carrera de Ingeniería Informática  

