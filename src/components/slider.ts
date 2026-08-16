export function initSlider(root: HTMLElement): void {
    const track = root.querySelector<HTMLElement>(".hero__track");
    const slides = root.querySelectorAll<HTMLElement>(".hero__slide");
    const prevBtn = root.querySelector<HTMLButtonElement>(".hero__nav--prev");
    const nextBtn = root.querySelector<HTMLButtonElement>(".hero__nav--next");
    const status = root.querySelector<HTMLElement>(".hero__status");

    if (!track || !prevBtn || !nextBtn || slides.length === 0) {
        console.warn("initSlider: chybí .hero__track, .hero__nav-- tlačítka nebo .hero__slide", {
            track,
            prevBtn,
            nextBtn,
            slidesCount: slides.length,
        });
        return;
    }

    let current = 0;

    const showSlide = (index: number): void => {
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;

        slides.forEach((slide, i) => {
            if (i === current) {
                slide.removeAttribute("inert");
            } else {
                slide.setAttribute("inert", "");
            }
        });

        if (status) status.textContent = `Slide ${current + 1} z ${slides.length}`;
    };

    prevBtn.addEventListener("click", () => {
        showSlide((current - 1 + slides.length) % slides.length);
    });

    nextBtn.addEventListener("click", () => {
        showSlide((current + 1) % slides.length);
    });
}
