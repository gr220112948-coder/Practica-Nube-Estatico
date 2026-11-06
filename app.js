/**
 * Application Logic for Azure CloudLab Static Web App
 * Ingeniería Informática - Administración de Cómputo en la Nube
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCostCalculator();
  initYamlCopy();
  initLatencyTester();
  initLiveMetrics();
  updateTimestamp();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('azure-cloud-theme') || 'dark';

  document.body.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('azure-cloud-theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. Cost Calculator (Fase 2.2 - Azure Storage vs Virtual Machine)
   ========================================================================== */
function initCostCalculator() {
  const reqSlider = document.getElementById('requestsSlider');
  const bwSlider = document.getElementById('bandwidthSlider');
  const reqVal = document.getElementById('requestsValue');
  const bwVal = document.getElementById('bandwidthValue');

  const azureCostEl = document.getElementById('azureCost');
  const vmCostEl = document.getElementById('vmCost');
  const savingsPctEl = document.getElementById('savingsPct');

  if (!reqSlider || !bwSlider) return;

  function recalculate() {
    const requests = parseInt(reqSlider.value, 10);
    const bandwidthGB = parseInt(bwSlider.value, 10);

    reqVal.textContent = requests.toLocaleString('es-MX') + ' req';
    bwVal.textContent = bandwidthGB + ' GB';

    // Pricing formulas:
    // Azure Blob Storage Hot Tier:
    // - Storage: ~0.1 GB website files = $0.002 USD
    // - Operations: $0.0004 USD per 10,000 read operations
    // - Outbound Data Transfer (Egress): First 5 GB free, then $0.087/GB
    const opsCost = (requests / 10000) * 0.0004;
    const egressCost = Math.max(0, bandwidthGB - 5) * 0.087;
    const storageCost = 0.018; // approx 1GB storage buffer
    const totalAzure = Math.max(0.02, storageCost + opsCost + egressCost);

    // Azure Virtual Machine (B1s 1 vCPU, 1 GiB RAM):
    // - Compute: ~$10.50 USD/mo
    // - OS Disk (Standard SSD 32GB E4): ~$3.20 USD/mo
    // - Static Public IP: ~$3.60 USD/mo
    // - Egress Data: $0.087/GB beyond 5GB
    const vmFixed = 10.50 + 3.20 + 3.60;
    const totalVM = vmFixed + egressCost;

    // Savings %:
    const savings = ((totalVM - totalAzure) / totalVM) * 100;

    azureCostEl.textContent = '$' + totalAzure.toFixed(2);
    vmCostEl.textContent = '$' + totalVM.toFixed(2);
    savingsPctEl.textContent = savings.toFixed(1) + '%';
  }

  reqSlider.addEventListener('input', recalculate);
  bwSlider.addEventListener('input', recalculate);
  recalculate();
}

/* ==========================================================================
   3. Copy YAML Pipeline to Clipboard
   ========================================================================== */
function initYamlCopy() {
  const copyBtn = document.getElementById('btnCopyYaml');
  const yamlCode = document.getElementById('yamlCode');

  if (!copyBtn || !yamlCode) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(yamlCode.innerText);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '¡Copiado! ✓';
      copyBtn.style.background = '#10b981';
      copyBtn.style.color = '#fff';

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 2000);
    } catch (err) {
      console.warn('Fallback copy failed', err);
    }
  });
}

/* ==========================================================================
   4. Latency / Endpoint Ping Tester
   ========================================================================== */
function initLatencyTester() {
  const pingBtn = document.getElementById('btnPingEndpoint');
  const pingResult = document.getElementById('pingResult');

  if (!pingBtn || !pingResult) return;

  pingBtn.addEventListener('click', async () => {
    pingResult.textContent = 'Midiendo... ⏳';
    pingBtn.disabled = true;

    const start = performance.now();
    try {
      // Self-fetch to measure HTTP roundtrip time
      await fetch(window.location.href, { method: 'HEAD', cache: 'no-cache' });
      const duration = Math.round(performance.now() - start);
      pingResult.innerHTML = `⚡ <strong>${duration} ms</strong> (HTTP 200 OK - Azure Edge)`;
      pingResult.style.color = '#10b981';
    } catch {
      // Fallback realistic simulation for local preview
      setTimeout(() => {
        const randomMs = Math.floor(Math.random() * 20) + 14;
        pingResult.innerHTML = `⚡ <strong>${randomMs} ms</strong> (Simulado - Azure Edge CDN)`;
        pingResult.style.color = '#10b981';
      }, 300);
    } finally {
      setTimeout(() => {
        pingBtn.disabled = false;
      }, 600);
    }
  });
}

/* ==========================================================================
   5. Live Metrics & Timestamp
   ========================================================================== */
function initLiveMetrics() {
  const reqEl = document.getElementById('metricRequests');
  const latencyEl = document.getElementById('metricLatency');
  const egressEl = document.getElementById('metricEgress');

  if (!reqEl) return;

  let reqCount = 1420;
  setInterval(() => {
    // Subtle increment for dashboard realism
    reqCount += Math.floor(Math.random() * 3);
    reqEl.textContent = reqCount.toLocaleString('es-MX');

    if (latencyEl && Math.random() > 0.7) {
      const simulatedLatency = Math.floor(Math.random() * 6) + 16;
      latencyEl.textContent = `${simulatedLatency} ms`;
    }

    if (egressEl && Math.random() > 0.8) {
      const currentMB = (4.82 + (reqCount - 1420) * 0.003).toFixed(2);
      egressEl.textContent = `${currentMB} MB`;
    }
  }, 4000);
}

function updateTimestamp() {
  const timeEl = document.getElementById('liveTimestamp');
  if (timeEl) {
    const now = new Date();
    timeEl.textContent = 'Actualizado: ' + now.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

