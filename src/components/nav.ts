export function initNav(root: HTMLElement): void {
    const toggle = root.querySelector<HTMLButtonElement>(".header__toggle");

    if (!toggle) {
        console.warn("initNav: chybí .header__toggle");
        return;
    }

    toggle.addEventListener("click", () => {
        root.classList.toggle("header--nav-open");
    });
}
