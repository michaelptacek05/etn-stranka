export function initNav(root: HTMLElement): void {
    const toggle = root.querySelector<HTMLButtonElement>(".header__toggle");
    const closeBtn = root.querySelector<HTMLButtonElement>(".nav__close");

    if (!toggle || !closeBtn) {
        console.warn("initNav: chybí .header__toggle nebo .nav__close");
        return;
    }

    const inertTargets = [
        document.querySelector<HTMLElement>("main"),
        document.querySelector<HTMLElement>(".footer"),
        document.querySelector<HTMLElement>(".newsletter"),
    ].filter((el): el is HTMLElement => el !== null);

    const closeNav = (returnFocus = true): void => {
        root.classList.remove("header--nav-open");
        toggle.setAttribute("aria-expanded", "false");
        inertTargets.forEach((el) => el.removeAttribute("inert"));

        if (returnFocus) toggle.focus();
    };

    const openNav = (): void => {
        root.classList.add("header--nav-open");
        toggle.setAttribute("aria-expanded", "true");
        inertTargets.forEach((el) => el.setAttribute("inert", ""));

        requestAnimationFrame(() => closeBtn.focus());
    };

    toggle.addEventListener("click", () => {
        if (root.classList.contains("header--nav-open")) {
            closeNav();
        } else {
            openNav();
        }
    });

    closeBtn.addEventListener("click", () => closeNav());

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && root.classList.contains("header--nav-open")) {
            closeNav();
        }
    });
}
