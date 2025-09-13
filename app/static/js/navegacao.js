// Navegação e controle do menu
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle")
  const sidebar = document.getElementById("sidebar")
  const closeSidebar = document.getElementById("closeSidebar")
  const overlay = document.getElementById("overlay")

  // Abrir menu
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("active")
      overlay.classList.add("active")
      document.body.style.overflow = "hidden"
    })
  }

  // Fechar menu
  function closeSidebarMenu() {
    sidebar.classList.remove("active")
    overlay.classList.remove("active")
    document.body.style.overflow = ""
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", closeSidebarMenu)
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebarMenu)
  }

  // Fechar menu com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("active")) {
      closeSidebarMenu()
    }
  })

  // Marcar item ativo no menu
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navItems = document.querySelectorAll(".nav-item")

  navItems.forEach((item) => {
    const href = item.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      item.classList.add("active")
    } else {
      item.classList.remove("active")
    }
  })
})
