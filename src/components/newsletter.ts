export function initNewsletter(root: HTMLElement): void {
    const toggle = root.querySelector<HTMLButtonElement>(".newsletter__toggle");
    const popup = root.querySelector<HTMLElement>(".newsletter__popup");
    const closeBtn = root.querySelector<HTMLButtonElement>(".newsletter__close");
    const form = root.querySelector<HTMLFormElement>(".newsletter__form");
    const emailInput = root.querySelector<HTMLInputElement>(".newsletter__input");
    const honeypot = root.querySelector<HTMLInputElement>(".newsletter__hp-input");
    const success = root.querySelector<HTMLElement>(".newsletter__success");

    if (!toggle || !popup || !closeBtn || !form || !emailInput || !honeypot || !success) {
        console.warn("initNewsletter: chybí některý z očekávaných prvků uvnitř .newsletter");
        return;
    }

    const inertTargets = [
        document.querySelector<HTMLElement>(".header"),
        document.querySelector<HTMLElement>("main"),
        document.querySelector<HTMLElement>(".footer"),
    ].filter((el): el is HTMLElement => el !== null);

    const closePopup = (returnFocus = true): void => {
        root.classList.remove("newsletter--open");
        toggle.setAttribute("aria-expanded", "false");
        popup.setAttribute("inert", "");
        inertTargets.forEach((el) => el.removeAttribute("inert"));

        document.removeEventListener("keydown", onKeydown);
        document.removeEventListener("click", onDocumentClick);

        if (returnFocus) toggle.focus();
    };

    const onKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Escape") closePopup();
    };

    const onDocumentClick = (event: MouseEvent): void => {
        if (event.target instanceof Node && !root.contains(event.target)) {
            closePopup(false);
        }
    };

    const openPopup = (): void => {
        root.classList.add("newsletter--open");
        toggle.setAttribute("aria-expanded", "true");
        popup.removeAttribute("inert");
        inertTargets.forEach((el) => el.setAttribute("inert", ""));
        requestAnimationFrame(() => emailInput.focus());

        document.addEventListener("keydown", onKeydown);
        document.addEventListener("click", onDocumentClick);
    };

    toggle.addEventListener("click", () => {
        if (root.classList.contains("newsletter--open")) {
            closePopup();
        } else {
            openPopup();
        }
    });

    closeBtn.addEventListener("click", () => closePopup());

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (honeypot.value.trim() !== "") return;
        if (!emailInput.reportValidity()) return;
        form.hidden = true;
        success.hidden = false;
    });
}
