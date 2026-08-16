# Etnetera — zadání stránky

Statická kariérní stránka Etnetery podle grafického návrhu.

**Živá verze:** https://michaelptacek05.github.io/etn-stranka/

## Obsah

- [Tech stack](#tech-stack)
- [Architektura projektu](#architektura-projektu)
- [Styly (SCSS)](#styly-scss)
- [Fonty a WebP — optimalizace rychlosti](#fonty-a-webp--optimalizace-rychlosti)
- [TypeScript skripty](#typescript-skripty)
- [Sekce grafu (Návštěvnost firmy)](#sekce-grafu-návštěvnost-firmy)
- [GitHub Actions — build a nasazení](#github-actions--build-a-nasazení)
- [Cross-browser testování](#cross-browser-testování)
- [SEO](#seo)
- [Spuštění projektu lokálně](#spuštění-projektu-lokálně)

## Tech stack

| | |
|---|---|
| Build nástroj | [Vite 8](https://vite.dev/) |
| Jazyk | [TypeScript 6](https://www.typescriptlang.org/) (strict mode) |
| Styly | SCSS ([Dart Sass](https://sass-lang.com/)) |
| Framework | žádný — vanilla TS/DOM API |
| Runtime závislosti | žádné (jen `sass`, `typescript`, `vite` jako dev dependencies) |
| Hosting | GitHub Pages |

Cílem bylo ukázat, že web nepotřebuje frontend framework ani knihovny navíc,
celá interaktivita (menu, slider, newsletter popup, graf) je napsaná ve
vanilla TS DOM API.

## Architektura projektu

```
├── index.html                 # HTML struktura stránky, celý markup
├── public/                    # statické assety kopírované beze změny do dist/
│   ├── *.webp                 # obrázky
│   ├── etnetera-small.svg
│   ├── fonts/                 # Open Sans .woff2, variace fontu
│   └── robots.txt
├── src/
│   ├── main.ts                # vstupní bod — napojí styly a inicializuje komponenty
│   ├── components/            # izolované TS moduly, každý ovládá jednu interaktivní část
│   │   ├── nav.ts             # mobilní menu (hamburger)
│   │   ├── slider.ts          # hero carousel
│   │   ├── newsletter.ts      # newsletter popup + honeypot validace
│   │   └── chart.ts           # vykreslení sloupcového grafu z dat
│   ├── data/
│   │   └── chartData.ts       # label texty a hodnoty grafu
│   └── styles/
│       ├── main.scss          # vstupní bod stylů, globální reset a utility
│       ├── _variables.scss    # design tokeny (barvy, typografie, breakpointy, mixin mq())
│       └── sections/          # 1 partial = 1 sekce stránky (BEM)
├── vite.config.ts             # base path pro GitHub Pages (/etn-stranka/)
└── .github/workflows/deploy.yml # deploy na GitHub Pages po pushnutem commitu
```

**Princip:** každá sekce stránky má svůj SCSS partial ve `styles/sections/`
a případně svůj TS modul v `components/`. Komponenty se samy postarají o to,
že si v `main.ts` najdou svůj root element (`.header`, `.hero`, `.newsletter`,
`.chart`) a pokud na stránce chybí, tiše (přes `console.warn`) přeskočí
inicializaci — žádný modul tedy nepředpokládá, že jeho markup nutně existuje.

## Styly (SCSS)

- **`_variables.scss`** — jediné místo pravdy pro design tokeny: barvy
  (`$color-primary` = `#e84e0e`, `$color-bg-alt` = `#f2f2f2`...), typografická
  škála, šířka kontejneru a mapa breakpointů. SCSS proměnné se zároveň
  exportují do CSS custom properties (`--c-primary`, `--c-bg`...), takže jsou
  dostupné i za běhu v `style.setProperty()` (využívá to např. graf).
- **`mq($breakpoint)` mixin** — jednotný zápis media queries nad mapou
  breakpointů (`sm`/`md`/`lg`/`xl`) místo natvrdo psaných `px` hodnot po
  souborech.
- **Sekce jako partialy** — `main.scss` je jen `@use` na jednotlivé sekce;
  každá sekce (`_header`, `_hero`, `_about`, `_chart`, `_columns`, ...) je
  samostatný soubor pojmenovaný podle BEM bloku, který stylizuje.
- **BEM** napříč markupem (`.chart__bar--high`, `.newsletter__popup`...) —
  ploché selektory bez zanořování do hloubky, snadné dohledání stylu podle
  class name v HTML.

## Fonty a WebP — optimalizace rychlosti

- Všechny rastrové obrázky (`background`, `building`, `etnetera-barevne`)
  jsou převzaté z PSD návrhu a převedené z PNG do **WebP** 
- Písmo **Open Sans** je lokálně v `public/fonts/` ve formátu **`.woff2`**
  (nejmenší dostupný formát) ve třech řezech (Light/Regular/Bold), místo
  načítání přes Google Fonts CDN — odpadá extra DNS/handshake na cizí
  doménu.
- `font-display: swap` u všech `@font-face` — text se vykreslí systémovým
  fontem hned a nepřepisuje se do neviditelného stavu (FOIT), dokud se
  webfont nenačte.
- `<link rel="preload" as="font">` na `OpenSans-Light.woff2` v `<head>` —
  prohlížeč začne stahovat kritický font co nejdřív, ne až narazí na něj
  přes CSS.
- `<img fetchpriority="high">` na hero pozadí a explicitní `width`/`height`
  na obrázcích napříč stránkou, aby prohlížeč rovnou znal poměr stran a
  nedocházelo k layout shiftu (CLS) při načítání.

## TypeScript skripty

`main.ts` je jediný vstupní bod (`<script type="module" src="/src/main.ts">`).
Naimportuje globální styly a pro každou komponentu si najde její root element
v DOM; pokud existuje, zavolá její `init*()` funkci:

```ts
const header = document.querySelector<HTMLElement>(".header");
if (header) initNav(header);
```

Každý modul v `components/` je samostatná funkce `init*(root: HTMLElement)`
bez sdíleného stavu mezi moduly:

- **`nav.ts`** — otevírání/zavírání mobilního menu. Při otevření nastaví
  `inert` na `<main>`, `.footer` a `.newsletter`, aby je klávesnice/čtečka
  obrazovky nemohly zaostřit pod otevřeným menu, řídí `aria-expanded` a
  zavírá se na Escape i na tlačítko.
- **`slider.ts`** — hero carousel bez knihovny: posun `.hero__track` přes
  `transform: translateX()`, aktivní slide je jediný bez `inert`, ostatní
  jsou z přístupnostního stromu vyřazené. Stav pro čtečky obrazovky hlásí
  přes `.hero__status` (`role="status"`).
- **`newsletter.ts`** — popup s formulářem: `inert` na zbytku stránky po
  otevření, zavírání na Escape/klik mimo/křížek, focus management (po
  otevření focus na input, po zavření focus zpátky na tlačítko). Odeslání
  je čistě klientské — ověří honeypot pole (anti-spam past pro roboty) a
  validitu e-mailu, pak schová formulář a zobrazí potvrzení.
- **`chart.ts`** — viz níže.

Typová bezpečnost: `tsconfig.json` má zapnutý `strict`, `noUnusedLocals`
a `noUnusedParameters`; `npm run build` nejdřív spustí `tsc` a až pak
`vite build`, takže build spadne na typové chybě dřív, než se cokoliv
zabundluje.

## Sekce grafu (Návštěvnost firmy)

Graf je záměrně rozdělený na **data** a **vykreslení**:

- **`src/data/chartData.ts`** — pole `chartData: ChartValues[]`, kde má
  každý bod hodinu (`hour`), procentuální hodnotu výšky sloupce (`value`)
  a úroveň provozu (`level: "low" | "medium" | "high"`). Popisky úrovní
  (`chartLabels`) jsou oddělené od dat pro snadný překlad/úpravu textu bez
  zásahu do logiky.
- **`src/components/chart.ts`** (`initChart`) — pro každý datový bod
  vytvoří `<li>` se sloupcem (`<span class="chart__bar">`) a popiskem
  hodiny, čistě přes `document.createElement`, žádný template string s HTML.
  Výška sloupce se nenastavuje inline stylem na pevno, ale přes CSS custom
  property `--value`, kterou pak v `_chart.scss` používá:

  ```scss
  .chart__bar {
      height: calc(var(--value) * 1%);
  }
  ```

  Barva sloupce jde přes modifikátor `chart__bar--{level}`, který v SCSS
  mapuje na tokeny `--c-chartlvl-1/2/3`.
- **Přístupnost** — každá položka má `aria-label` složený z hodiny a
  slovního popisu úrovně (např. „8:00 — bez fronty"), popisek hodiny pod
  sloupcem je `aria-hidden`, protože stejná informace už je v `aria-label`
  nadřazeného `<li>`.

Chceš-li graf upravit, stačí zasahovat pouze do `chartData.ts` — vykreslovací
logika ani styly se měnit nemusí.

## GitHub Actions — build a nasazení

`.github/workflows/deploy.yml` nasazuje na GitHub Pages při každém pushi do
`main` (a jde spustit i ručně přes `workflow_dispatch`):

1. **`build`** job — checkout, Node 20 s `npm` cachí, `npm ci`,
   `npm run build` (typecheck + Vite build do `dist/`), výsledek se nahraje
   jako Pages artifact (`actions/upload-pages-artifact`).
2. **`deploy`** job — čeká na `build` (`needs: build`) a nasadí artifact přes
   `actions/deploy-pages`. Běží přes `github-pages` environment, takže URL
   nasazení je vidět přímo u workflow runu.

Oprávnění workflow jsou omezená na nutné minimum (`contents: read`,
`pages: write`, `id-token: write`) a `concurrency` skupina `pages` zajišťuje,
že se nepřekrývají dva souběžné deploye, ale rozběhlý deploy se nikdy
nezruší uprostřed (`cancel-in-progress: false`).

Protože stránka běží na `https://michaelptacek05.github.io/etn-stranka/`
(podstránka, ne kořen domény), `vite.config.ts` má nastavené
`base: "/etn-stranka/"`, aby v produkčním buildu seděly cesty k assetům.

## Cross-browser testování

Testováno v prohližečích Chrome, Safari a Firefox, ve všech 3 prohlížečích bylo vše vpořádku, na žádný problém jsem nenarazil.

## SEO

SEO skóre je záměrně nízké — stránka je určená jen jako ukázka kodérského
úkolu, ne pro reálné vyhledávání, proto je explicitně vyřazená z indexace:

- `public/robots.txt` obsahuje `Disallow: /` pro všechny roboty.
- `index.html` má navíc `<meta name="robots" content="noindex, nofollow" />`.

Obě opatření jsou zámerná (ne chyba) — dvojitá pojistka, aby se testovací
verze na `github.io` neobjevovala ve výsledcích vyhledávání a nekonkurovala
reálnému webu Etnetera. (což si nemyslím že by se stalo, každopádně jsem to i tak nechal, ať k indexaci nedojde)

## Spuštění projektu lokálně

```bash
npm install
npm run dev       # vývojový server s HMR
npm run build     # typecheck (tsc) + produkční build do dist/
npm run preview   # lokální náhled produkčního buildu
```
