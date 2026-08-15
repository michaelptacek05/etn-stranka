import "./styles/main.scss";
import { initNav } from "./components/nav";
import { initSlider } from "./components/slider";

const header = document.querySelector<HTMLElement>(".header");
if (header) initNav(header);

const hero = document.querySelector<HTMLElement>(".hero");
if (hero) initSlider(hero);