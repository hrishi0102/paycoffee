import express from "express";
import supabase from "../db.js";

const router = express.Router();

// Serve the widget loader script
router.get("/widget.js", async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("// Widget ID is required");
  }

  // Verify widget exists
  const { data: widget, error } = await supabase
    .from("widgets")
    .select(
      `
      *,
      owners!inner(display_name, payman_paytag)
    `
    )
    .eq("id", id)
    .single();

  if (error || !widget) {
    return res.status(404).send("// Widget not found");
  }

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://paycoffee.vercel.app"
      : "http://localhost:5173";

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://paycoffee-api.vercel.app" // Update this with your actual API URL
      : "http://localhost:3001";

  // Generate the widget loader script
  const script = `
(function() {
  // PayCoffee Widget v1.0.0
  const WIDGET_ID = '${id}';
  const BASE_URL = '${baseUrl}';
  const API_URL = '${apiUrl}';
  
  // Configuration
  const CONFIG = ${JSON.stringify({
    id: widget.id,
    title: widget.title,
    description: widget.description,
    defaultAmounts: widget.default_amounts,
    allowCustomAmount: widget.allow_custom_amount,
    buttonText: widget.button_text,
    primaryColor: widget.primary_color,
    owner: {
      displayName: widget.owners.display_name,
      paymanPaytag: widget.owners.payman_paytag,
    },
  })};

  // Check if widget already loaded
  if (window.PayCoffeeWidget && window.PayCoffeeWidget[WIDGET_ID]) {
    console.warn('PayCoffee widget already loaded for ID:', WIDGET_ID);
    return;
  }

  // Initialize global object
  window.PayCoffeeWidget = window.PayCoffeeWidget || {};
  window.PayCoffeeWidget[WIDGET_ID] = true;

  // Create styles
  const styles = \`
    .paycoffee-widget-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: \${CONFIG.primaryColor};
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 999998;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .paycoffee-widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .paycoffee-widget-button svg {
      width: 28px;
      height: 28px;
      fill: currentColor;
    }

    .paycoffee-widget-modal {
      display: none;
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 48px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: slideUp 0.3s ease;
    }

    .paycoffee-widget-modal.active {
      display: block;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .paycoffee-modal-header {
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
      position: relative;
    }

    .paycoffee-modal-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      color: #111827;
    }

    .paycoffee-modal-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 4px 0 0 0;
    }

    .paycoffee-modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border: none;
      background: #f3f4f6;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .paycoffee-modal-close:hover {
      background: #e5e7eb;
    }

    .paycoffee-modal-content {
      padding: 20px;
    }

    .paycoffee-amounts {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .paycoffee-amount-btn {
      padding: 12px;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.2s;
      color: #374151;
    }

    .paycoffee-amount-btn:hover {
      border-color: \${CONFIG.primaryColor};
      color: \${CONFIG.primaryColor};
    }

    .paycoffee-amount-btn.selected {
      background: \${CONFIG.primaryColor};
      color: white;
      border-color: \${CONFIG.primaryColor};
    }

    .paycoffee-custom-amount {
      margin-top: 16px;
    }

    .paycoffee-custom-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }

    .paycoffee-custom-input:focus {
      outline: none;
      border-color: \${CONFIG.primaryColor};
    }

    .paycoffee-pay-button {
      width: 100%;
      padding: 14px;
      background: \${CONFIG.primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 20px;
    }

    .paycoffee-pay-button:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .paycoffee-pay-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .paycoffee-powered {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }

    .paycoffee-powered a {
      color: #6b7280;
      text-decoration: none;
    }

    .paycoffee-powered a:hover {
      color: #4b5563;
    }

    @media (max-width: 480px) {
      .paycoffee-widget-modal {
        right: 12px;
        width: calc(100vw - 24px);
        bottom: 80px;
      }

      .paycoffee-widget-button {
        right: 16px;
        bottom: 16px;
      }
    }
  \`;

  // Inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Create widget HTML
  const widgetHTML = \`
    <button class="paycoffee-widget-button" id="paycoffee-toggle-\${WIDGET_ID}">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 17H7A5 5 0 0 1 7 7H17A5 5 0 0 1 17 17H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 1V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.5 2L9.5 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <div class="paycoffee-widget-modal" id="paycoffee-modal-\${WIDGET_ID}">
      <div class="paycoffee-modal-header">
        <h3 class="paycoffee-modal-title">\${CONFIG.title}</h3>
        <p class="paycoffee-modal-subtitle">Support \${CONFIG.owner.displayName}</p>
        <button class="paycoffee-modal-close" id="paycoffee-close-\${WIDGET_ID}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="#6b7280" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      <div class="paycoffee-modal-content">
        \${CONFIG.description ? \`<p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">\${CONFIG.description}</p>\` : ''}
        
        <div class="paycoffee-amounts">
          \${CONFIG.defaultAmounts.map(amount => 
            \`<button class="paycoffee-amount-btn" data-amount="\${amount}">$\${amount}</button>\`
          ).join('')}
        </div>
        
        \${CONFIG.allowCustomAmount ? \`
          <div class="paycoffee-custom-amount">
            <input type="number" class="paycoffee-custom-input" placeholder="Custom amount" min="1" step="0.01" id="paycoffee-custom-\${WIDGET_ID}">
          </div>
        \` : ''}
        
        <button class="paycoffee-pay-button" id="paycoffee-pay-\${WIDGET_ID}" disabled>
          \${CONFIG.buttonText}
        </button>
        
        <div class="paycoffee-powered">
          Powered by <a href="https://paycoffee.vercel.app" target="_blank">PayCoffee</a> • <a href="https://payman.ai" target="_blank">Payman</a>
        </div>
      </div>
    </div>
  \`;

  // Create container
  const container = document.createElement('div');
  container.innerHTML = widgetHTML;
  document.body.appendChild(container);

  // Widget functionality
  let selectedAmount = null;
  const modal = document.getElementById(\`paycoffee-modal-\${WIDGET_ID}\`);
  const toggleBtn = document.getElementById(\`paycoffee-toggle-\${WIDGET_ID}\`);
  const closeBtn = document.getElementById(\`paycoffee-close-\${WIDGET_ID}\`);
  const payBtn = document.getElementById(\`paycoffee-pay-\${WIDGET_ID}\`);
  const customInput = document.getElementById(\`paycoffee-custom-\${WIDGET_ID}\`);
  const amountBtns = container.querySelectorAll('.paycoffee-amount-btn');

  // Toggle modal
  toggleBtn.addEventListener('click', () => {
    modal.classList.toggle('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      modal.classList.remove('active');
    }
  });

  // Amount selection
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAmount = parseFloat(btn.dataset.amount);
      if (customInput) customInput.value = '';
      updatePayButton();
    });
  });

  // Custom amount
  if (customInput) {
    customInput.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('selected'));
      selectedAmount = parseFloat(customInput.value) || null;
      updatePayButton();
    });
  }

  function updatePayButton() {
    if (selectedAmount && selectedAmount > 0) {
      payBtn.disabled = false;
      payBtn.textContent = \`\${CONFIG.buttonText} ($\${selectedAmount})\`;
    } else {
      payBtn.disabled = true;
      payBtn.textContent = CONFIG.buttonText;
    }
  }

  // Payment
  payBtn.addEventListener('click', () => {
    if (selectedAmount && selectedAmount > 0) {
      const returnUrl = encodeURIComponent(window.location.href);
      window.open(\`\${BASE_URL}/pay/\${WIDGET_ID}?amount=\${selectedAmount}&return_url=\${returnUrl}\`, '_blank');
    }
  });
})();
`;

  res.set("Content-Type", "application/javascript");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(script);
});

export default router;
