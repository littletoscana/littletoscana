# LittleToscana

Aplicație completă TanStack Start pentru site-ul LittleToscana, cu rezervări, disponibilitate, formular de contact și administrare.

## Cerințe

- Node.js 20 sau mai nou, ori Bun 1.2 sau mai nou
- conexiune la internet pentru PocketBase, Formspree, Google Maps și linkurile sociale

Fotografiile, favicon-ul și fonturile sunt incluse local în proiect.

## Rulare locală cu Bun

```sh
bun install
bun run dev
```

Site-ul va fi disponibil la adresa afișată în terminal.

## Rulare locală cu npm

```sh
npm install
npm run dev
```

## Compilare pentru hosting

```sh
bun install
bun run build
```

Acesta este un proiect full-stack, nu un set de pagini HTML statice. Hostingul trebuie să suporte TanStack Start/Nitro și funcții de server. După compilare, porniți rezultatul conform instrucțiunilor platformei de hosting alese.

Serviciile externe folosite de funcționalitățile existente sunt configurate în cod: PocketBase pentru rezervări și administrare, Formspree pentru formularul de contact și Google Maps pentru hartă.
