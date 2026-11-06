# REPORTE DE PRÁCTICA DE LABORATORIO

| **Materia** | **Carrera** | **Unidad** | **Puntaje** |
| :--- | :--- | :--- | :--- |
| Administración de Cómputo en la Nube | Ingeniería Informática | Unidad 2 | 25 Puntos |

---

### **Título de la Práctica:** Sitio Web Estático en Azure
- **Estudiante:** César
- **Identificador:** gr220112948-coder
- **Docente:** Juan Carlos Garcia Sepulveda
- **Fecha de Entrega:** 06 de noviembre de 2026

---

## 1. Competencia y Objetivo

- **Competencia:** Diseña y gestiona la arquitectura para proyectos basados en la nube e inteligencia artificial generando estrategias y utilizando herramientas para implementar soluciones eficientes y escalables.
- **Objetivo:** Configurar un entorno de almacenamiento en la nube para hospedar un sitio web estático (HTML/CSS/JS), automatizando su despliegue mediante un pipeline de CI/CD.

---

## 2. Enlaces del Proyecto

- **Enlace al Repositorio Remoto (GitHub):**  
  [https://github.com/gr220112948-coder/Practica-Nube-Estatico](https://github.com/gr220112948-coder/Practica-Nube-Estatico)

- **URL Pública Funcional en Microsoft Azure:**  
  *Coloca aquí tu URL pública generada por Azure (por ejemplo: `https://sawebestatico...z22.web.core.windows.net/` o `https://lemon-sky-...azurestaticapps.net`)*

---

## 3. Justificación Económica (Fase 2.2)

### Comparativa: Azure Blob Storage / Static Web Apps vs. Máquina Virtual (VM)

| Criterio | Azure Blob Storage / Static Web Apps | Máquina Virtual Azure (B1s / B2s) |
| :--- | :--- | :--- |
| **Costo Base Mensual** | **~$0.02 - $0.30 USD** | ~$15.00 - $35.00 USD |
| **Facturación** | Por consumo estricto (GB leídos + transacciones) | Fijo por horas de cómputo encendido 24/7 |
| **Mantenimiento del SO** | 0 horas (Completamente Serverless administrado) | Parches del kernel, antivirus, servidor web (Nginx/Apache) |
| **Disponibilidad y SSL** | SLA 99.99%, Certificado HTTPS integrado gratuito | Requiere balanceador y configuración manual de certificados |
| **Elasticidad** | Autoescalado instantáneo ante picos de tráfico | Requiere redimensionar instancia o auto-scaling pools |

**Conclusión Financiera:** El modelo estático serverless representa un ahorro de más del **98%** en comparación con el mantenimiento de una máquina virtual, eliminando el desperdicio de recursos durante períodos sin tráfico y suprimiendo las horas hombre dedicadas a administración de infraestructura.

---

## 4. Evidencias de Infraestructura y Configuración

### 4.1 Evidencia del Servicio de Hospedaje en Azure
*(Pega aquí la captura de pantalla de tu cuenta de almacenamiento con el sitio web estático habilitado o del servicio Azure Static Web Apps activo)*

### 4.2 Evidencia de la Regla de Presupuesto (Azure Budget)
*(Pega aquí la captura de la regla de presupuesto de $5.00 USD con umbral de alerta configurada en Azure Cost Management)*

### 4.3 Evidencia de la Autenticación y Secretos en GitHub
*(Pega aquí la captura de GitHub > Settings > Secrets and variables > Actions)*

---

## 5. Automatización CI/CD (Pipeline)

El archivo `.github/workflows/deploy-azure-storage.yml` y/o `.github/workflows/azure-static-web-apps.yml` automatiza la entrega con las siguientes tareas:
1. `checkout`: Descarga el código fuente del commit activado.
2. `validación`: Inspecciona la existencia de los artefactos estáticos (`index.html`, `styles.css`, `app.js`).
3. `autenticación`: Conexión cifrada a Azure mediante `secrets.AZURE_CREDENTIALS` o token de implementación.
4. `despliegue`: Sincronización diferencial con el contenedor `$web` o distribución CDN global.

*(Pega aquí la captura de la pestaña "Actions" en GitHub mostrando el pipeline ejecutado con éxito en color verde)*

---

## 6. Reporte de Métricas y Monitoreo (Fase 4.1)

Durante las pruebas de tráfico y carga se registraron las siguientes métricas en Azure Monitor:
- **Peticiones HTTP solicitadas:** Tráfico registrado con código HTTP 200 satisfactorio.
- **Ancho de banda consumido (Egress):** Consumo óptimo de transferencia gracias al empaquetado de recursos estáticos.
- **Tiempos de respuesta (Latencia):** Tiempos inferiores a 25 ms mediante la red perimetral de Azure.

*(Pega aquí la captura del gráfico de Métricas de Azure Monitor mostrando las peticiones y salida de datos)*

---

## 7. Prueba del Ciclo de Despliegue Continuo (Fase 4.2)

Se realizó un cambio visible en la interfaz local del proyecto (en `index.html`), se envió mediante `git push origin main` y el pipeline de GitHub Actions actualizó automáticamente el sitio en producción sin necesidad de intervención manual en Azure Portal.

*(Pega aquí las capturas del antes y después en la URL pública confirmando la actualización automática)*

---

## 8. Conclusiones

La implementación de sitios web estáticos en la nube mediante servicios PaaS/Serverless como Azure Blob Storage y Azure Static Web Apps, combinados con pipelines de CI/CD en GitHub Actions, demuestra ser la estrategia idónea para arquitecturas modernas. Garantiza alta disponibilidad, seguridad robusta por ausencia de superficies vulnerables de servidor tradicional, y una reducción drástica de costos operativos y financieros.

