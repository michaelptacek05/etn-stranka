import "./styles/main.scss";
import { initNav } from "./components/nav";
import { initSlider } from "./components/slider";
import { initNewsletter } from "./components/newsletter";
import { initChart } from "./components/chart";

const header = document.querySelector<HTMLElement>(".header");
if (header) initNav(header);

const hero = document.querySelector<HTMLElement>(".hero");
if (hero) initSlider(hero);

const newsletter = document.querySelector<HTMLElement>(".newsletter");
if (newsletter) initNewsletter(newsletter);

const chart = document.querySelector<HTMLElement>(".chart");
if (chart) initChart(chart);