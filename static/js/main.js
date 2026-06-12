/* ============================================================
   TFU CRM — Main JavaScript
   ============================================================ */

// ── Flash message auto-dismiss ───────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const flashes = document.querySelectorAll('.flash');
  flashes.forEach(function (flash) {
    setTimeout(function () {
      flash.style.opacity = '0';
      flash.style.transform = 'translateX(20px)';
      flash.style.transition = 'all 0.3s ease';
      setTimeout(() => flash.remove(), 320);
    }, 5000);
  });

  // Mobile sidebar toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.style.display = 'block';
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('mobile-open');
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }

  // Animate stats numbers
  document.querySelectorAll('.stat-value').forEach(function (el) {
    const target = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
    if (isNaN(target) || target === 0) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(function () {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 20);
  });
});

// ── Modal helpers ────────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
        closeModal(m.id);
      });
    }
  });
});

// ── Search live search ───────────────────────────────────────
let searchTimeout = null;
function liveSearch(inputEl, campaign) {
  clearTimeout(searchTimeout);
  const q = inputEl.value.trim();
  if (q.length < 2) return;
  searchTimeout = setTimeout(async function () {
    try {
      const url = `/api/search-leads?q=${encodeURIComponent(q)}&campaign=${campaign || ''}`;
      const resp = await fetch(url);
      const results = await resp.json();
      // Handle results
      console.log('Search results:', results);
    } catch (err) {
      console.error('Search error:', err);
    }
  }, 300);
}

// ── Status quick-update ──────────────────────────────────────
async function updateLeadStatus(leadId, newStatus) {
  try {
    const resp = await fetch(`/api/leads/${leadId}/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await resp.json();
    if (data.success) {
      showToast('Status updated to ' + newStatus, 'success');
    } else {
      showToast('Failed to update status', 'error');
    }
  } catch (err) {
    showToast('Network error', 'error');
  }
}

// ── Toast notification ───────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('flashMessages');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `flash ${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span>${message}<span class="flash-close" onclick="this.parentElement.remove()">✕</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 320);
  }, 4000);
}

// ── Table row click highlight ────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('tbody tr[onclick]').forEach(function (row) {
    row.style.cursor = 'pointer';
    row.addEventListener('mouseenter', function () {
      this.style.background = 'var(--bg-hover)';
    });
    row.addEventListener('mouseleave', function () {
      this.style.background = '';
    });
  });
});
