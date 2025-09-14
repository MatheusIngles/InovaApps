document.addEventListener("DOMContentLoaded", () => {
    function loadSettings() {
      const defaultSettings = {
        primaryColor: "#007bff",
        secondaryColor: "#6c757d",
        backgroundColor: "#f8f9fa",
        textColor: "#343a40",
        headingFont: "Segoe UI",
        bodyFont: "Segoe UI",
        fontSize: 14,
        borderRadius: 8,
        spacing: 8,
      }

      const saved = localStorage.getItem("customizationSettings")
      const settings = saved ? JSON.parse(saved) : defaultSettings
      applyGlobalSettings(settings)
  }
  function applyGlobalSettings(settings) {
      const root = document.documentElement;

      root.style.setProperty("--primary-color", settings.primaryColor);
      root.style.setProperty("--secondary-color", settings.secondaryColor);
      root.style.setProperty("--background-color", settings.backgroundColor);
      root.style.setProperty("--text-color", settings.textColor);
      root.style.setProperty("--font-heading", settings.headingFont);
      root.style.setProperty("--font-body", settings.bodyFont);
      root.style.setProperty("--font-size", settings.fontSize + "px");
      root.style.setProperty("--border-radius", settings.borderRadius + "px");
      root.style.setProperty("--spacing", settings.spacing + "px");
    }

    loadSettings();
})