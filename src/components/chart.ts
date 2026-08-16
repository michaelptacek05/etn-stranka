import { chartData, chartLabels } from "../data/chartData";

export function initChart(root: HTMLElement): void {
    const list = root.querySelector<HTMLElement>(".chart__bars");

    if (!list) {
        console.warn("initChart: chybí .chart__bars");
        return;
    }

    for (const point of chartData) {
        const item = document.createElement("li");
        item.className = "chart__bar-item";
        item.setAttribute(
            "aria-label",
            `${point.hour} — ${chartLabels[point.level]}`,
        );

        const bar = document.createElement("span");
        bar.className = `chart__bar chart__bar--${point.level}`;
        bar.style.setProperty("--value", String(point.value));

        const label = document.createElement("span");
        label.className = "chart__bar-label";
        label.textContent = point.hour;
        label.setAttribute("aria-hidden", "true");

        item.append(bar, label);
        list.append(item);
    }
}