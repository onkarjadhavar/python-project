/**
 * Webpage Summarizer - Modern Interactive Features
 * Enhances the user experience with smooth interactions and visual feedback
 */

(function () {
  "use strict";

  // ============================================
  // DOM ELEMENTS & INITIALIZATION
  // ============================================

  const form = document.getElementById("summarizerForm");
  const urlInput = document.getElementById("url");
  const submitButton = form?.querySelector(".premium-button");

  // Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", initializeApp);

  // ============================================
  // MAIN INITIALIZATION
  // ============================================

  function initializeApp() {
    setupFormHandling();
    setupInputEnhancements();
    setupAccessibility();
    animateElements();
  }

  // ============================================
  // FORM HANDLING
  // ============================================

  function setupFormHandling() {
    if (!form || !submitButton) return;

    form.addEventListener("submit", function (event) {
      // Add loading state
      setButtonLoading(true);

      // Optional: Add custom validation if needed
      const urlValue = urlInput?.value?.trim();
      if (!urlValue) {
        event.preventDefault();
        setButtonLoading(false);
        showInputError("Please enter a valid URL");
        return;
      }

      // Allow form submission, but keep loading state
      // Form will naturally submit via POST
    });

    // Reset button state if user navigates back
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) {
        setButtonLoading(false);
      }
    });
  }

  function setButtonLoading(isLoading) {
    if (!submitButton) return;

    if (isLoading) {
      submitButton.disabled = true;
      submitButton.classList.add("is-loading");
      const buttonText = submitButton.querySelector(".button-text");
      if (buttonText) {
        buttonText.textContent = "Summarizing...";
      }
    } else {
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
      const buttonText = submitButton.querySelector(".button-text");
      if (buttonText) {
        buttonText.textContent = "Summarize Now";
      }
    }
  }

  // ============================================
  // INPUT ENHANCEMENTS
  // ============================================

  function setupInputEnhancements() {
    if (!urlInput) return;

    // Clear error on input focus
    urlInput.addEventListener("focus", function () {
      clearInputError();
    });

    // Auto-correct common URL patterns
    urlInput.addEventListener("blur", function () {
      const value = this.value.trim();
      if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
        // Don't auto-correct, let backend handle it - better UX
      }
    });

    // Real-time validation feedback
    urlInput.addEventListener("input", function () {
      validateUrlInput(this.value);
    });
  }

  function validateUrlInput(value) {
    if (!value.trim()) {
      removeInputState();
      return;
    }

    // Simple URL pattern check
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (urlPattern.test(value)) {
      setInputValid();
    } else {
      removeInputState();
    }
  }

  function setInputValid() {
    urlInput?.classList.add("is-valid");
    urlInput?.classList.remove("is-invalid");
  }

  function showInputError(message) {
    urlInput?.classList.add("is-invalid");
    urlInput?.classList.remove("is-valid");

    // Optionally show error message
    console.warn("Input Error:", message);
  }

  function clearInputError() {
    urlInput?.classList.remove("is-invalid");
  }

  function removeInputState() {
    urlInput?.classList.remove("is-valid", "is-invalid");
  }

  // ============================================
  // ACCESSIBILITY ENHANCEMENTS
  // ============================================

  function setupAccessibility() {
    // Ensure proper focus management
    document.addEventListener("keydown", function (event) {
      // Handle Escape key to clear input
      if (event.key === "Escape" && document.activeElement === urlInput) {
        urlInput.value = "";
        clearInputError();
        removeInputState();
      }
    });

    // Add aria-live region for dynamic updates
    addAriaLiveRegion();
  }

  function addAriaLiveRegion() {
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only"; // Screen reader only
    liveRegion.id = "aria-live-region";
    document.body.appendChild(liveRegion);
  }

  // ============================================
  // ANIMATIONS
  // ============================================

  function animateElements() {
    // Animate summary items on page load
    const summaryItems = document.querySelectorAll(".summary-item");
    summaryItems.forEach((item, index) => {
      item.style.animation = `fadeInUp 0.5s ease-out ${0.1 * (index + 1)}s both`;
    });

    // Animate alerts on page load
    const alerts = document.querySelectorAll(".alert-container");
    alerts.forEach((alert) => {
      alert.style.animation = "slideDown 0.4s ease-out";
    });
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Smooth scroll to an element
   */
  function smoothScrollTo(element) {
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /**
   * Copy text to clipboard
   */
  function copyToClipboard(text) {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      console.log("Copied to clipboard!");
    });
  }

  /**
   * Debounce function for performance
   */
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // ============================================
  // ERROR HANDLING
  // ============================================

  window.addEventListener("error", function (event) {
    console.error("Global Error:", event.error);
  });

  // ============================================
  // PERFORMANCE: Lazy Loading for Heavy Elements
  // ============================================

  if ("IntersectionObserver" in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "50px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeInUp 0.5s ease-out forwards";
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe summary items
    document.querySelectorAll(".summary-item").forEach((item) => {
      observer.observe(item);
    });
  }

  // ============================================
  // MOBILE OPTIMIZATION
  // ============================================

  // Detect mobile device
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  // Optimize for mobile if needed
  if (isMobileDevice()) {
    document.documentElement.style.setProperty("--transition-fast", "100ms cubic-bezier(0.4, 0, 0.2, 1)");
  }

  // ============================================
  // THEME DETECTION & PERSISTENCE
  // ============================================

  function initializeTheme() {
    // The dark theme is the default, but this function can be extended
    // for future light theme toggle functionality
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark-theme");
    }
  }

  initializeTheme();
})();

/* ============================================
   ADDITIONAL CSS CLASSES FOR JS INTERACTIONS
   ============================================ */

// Add this to your style.css if needed:
/*
.modern-input.is-valid {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.modern-input.is-invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.premium-button.is-loading {
  opacity: 0.8;
  pointer-events: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
*/
