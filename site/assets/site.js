const menuButton = document.querySelector(".menu-button");
const primaryNav = document.querySelector(".primary-nav");

if (menuButton && primaryNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "Close" : "Menu";
  });

  primaryNav.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
  });
}
