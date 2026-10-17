# LevelUp: dizajn

Kako LevelUp izgleda i kakav je osećaj. Šta svaki ekran radi i kada je gotov piše u
[../SPEC.md](../SPEC.md); ovaj fajl određuje samo izgled.

## Proizvod
LevelUp je online prodavnica novih video igara: kupci pregledaju katalog, pronalaze igru po
imenu, platformi ili žanru i dodaju je u korpu.

## Korisnici
Gejmeri od 15 do 30 godina. Većina kupuje sa telefona, pa se svaki ekran pravi **mobile first**
(375 px) i zatim proširuje na desktop (1440 px).

## Ton
Energičan, brz, pouzdan. Treba da deluje kao šetnja pored police sa kutijama igara, a ne kao
čitanje tabele.

## Boje
Svetla, crno-bela tema: bela pozadina, crna za brend, tekst i akcije, nijanse sive za sve ostalo.
Pošto nema boje akcenta, hijerarhiju nose kontrast i veličina: glavno dugme je jedina velika crna
površina na ekranu (osim headera).

| Uloga | Boja | Token | Gde se koristi |
|---|---|---|---|
| Pozadina | bela `#FFFFFF` | `background`, `card`, `popover` | stranica, kartice, meniji |
| Tekst | skoro crna `#111111` | `foreground` | naslovi i tekst |
| Brend | crna `#0A0A0A` sa belim tekstom | `brand`, `brand-foreground` | traka headera, footer |
| Glavna akcija | crna `#111111` sa belim tekstom | `primary`, `primary-foreground` | „Dodaj u korpu“, strelice karusela, oznaka popusta |
| Sekundarna | tamnosiva `#404040` sa belim tekstom | `secondary`, `secondary-foreground` | oznake platforme, izabrane opcije, aktivni filter-čipovi |
| Tihi tekst | siva `#666666` | `muted-foreground` | dodatne informacije, stara cena, pomoćni tekst |
| Svetla siva | `#F4F4F4`, `#EBEBEB` | `muted`, `accent`, `highlight` | skeletoni, pozadine sekcija, hover, oznaka „Na stanju“ |
| Linije | svetlosiva `#E2E2E2` | `border`, `input` | okviri, ivice polja |
| Fokus | srednja siva `#8A8A8A` | `ring` | prsten fokusa, vidljiv i na beloj i na crnoj |
| Greška | crvena, jedina boja van palete | `destructive` | samo poruke o grešci i „Ukloni“ |

- Na crnom headeru brojač korpe je beo krug sa crnim brojem
- Svi parovi tekst/pozadina iz tabele prolaze WCAG AA (4.5:1 ili više)
- Crvena se koristi samo za greške; nikakve druge boje osim crne, sive i bele

## Tipografija
- **Rajdhani** (600, 700): naslovi, cene, logo, naslovi karusela
- **Inter** (400, 500, 600): sve ostalo
- Veličine (telefon → desktop):
  - Naslov stranice `text-3xl` → `md:text-4xl`, bold
  - Naslov sekcije / karusela `text-xl` → `md:text-2xl`, bold
  - Naslov igre u kutiji `text-base`, semibold, najviše 2 reda
  - Cena u kutiji `text-lg`, Rajdhani bold; na stranici detalja `text-3xl`
  - Tekst `text-sm` → `md:text-base`; dodatne informacije `text-xs`/`text-sm` u `muted-foreground`
- Najviše dve veličine naslova po ekranu; redovi teksta do ~70 karaktera

## Raspored i razmaci
- Širina sadržaja `max-w-6xl`, bočni razmak `px-4` (16 px) na telefonu, `md:px-6`
- Breakpointi: osnova = telefon (375), `sm` 640, `md` 768, `lg` 1024 (desktop raspored), proverava se i 1440
- Između sekcija `py-12` ili više; unutar grupa `gap-2` do `gap-4`
- Razmaci samo sa skale 1, 2, 3, 4, 6, 8, 12, 16

## Oblik
- Radius 6 px (`--radius: 0.375rem`); dugmad, polja i kartice koriste `rounded-md`/`rounded-lg`
- Kutije igara i oznaka popusta koriste `rounded-sm`, oštrije, kao prava kutija
- Tanke `border` linije umesto senki. Senka samo na slojevima koji lebde (meniji, panel sa
  filterima, zalepljena ukupna cena u korpi)

## Header
- Crna traka preko cele širine (`bg-brand`), beli logo „LevelUp“ u Rajdhani bold
- Telefon: logo levo; ikonice pretrage, korpe sa brojem i korisnika desno. Pretraga se otvara kao
  polje preko cele širine ispod trake
- Desktop: logo levo; ikonica pretrage (vodi na katalog), korpa i prijava desno
- Brojač korpe: mali beli krug sa crnim brojem; jednom „poskoči“ kad se doda stavka

## Kutija igre (glavni element interfejsa)
- Svaka igra se prikazuje kao cela kutija: uspravna slika omota u odnosu **3:4**
- Ispod kutije: naslov (najviše 2 reda), oznake platformi, cena; stara cena precrtana kad je na
  popustu; oznaka „−20%“ u gornjem levom uglu kutije
- Igre koje tek izlaze dobijaju belu oznaku „Pre-order“ sa okvirom umesto crne oznake popusta
- Hover (desktop): kutija se podigne 8 px, okvir postane crn, ispod se pojavi senka, a slika se
  blago uveća (105%); cela kutija je link ka igri
- Fokus (tastatura): vidljiv sivi prsten (`ring`)
- Ista komponenta u karuselima i u mreži kataloga

## Početna sa katalogom
Jedna stranica, odozgo nadole: slajder „Best sellers“, pa naslov „All games“, red sa pretragom,
dugmetom „Filters“ i sortiranjem, čipovi aktivnih filtera i mreža kutija.

## Best sellers slider
Polica sa najprodavanijim igrama na vrhu početne (`GameShowcase`), po uzoru na „Perpetual Motion“
slajdere.
- **3D prsten**: igre stoje na luku oko glavne igre, 22° jedna od druge, kao na okruglom stalku.
  Vide se po 2 igre sa svake strane, uvek cele (igra koja ne bi cela stala se sakrije); prečnik
  prstena se prilagođava širini ekrana
- Kutije su male da se ceo cover vidi: 26% širine ekrana na telefonu, 176 px na desktopu
- **Glavna igra** je napred i najviša: izlazi iz prstena ka gledaocu, veća je za 18% i ima senku
- **Visine padaju u polukrug**: što je igra dalja od glavne, to je niža (vrhovi prate polukrug),
  a sve stoje na istoj donjoj liniji
- Bočne igre su samo blago zatamnjene (90%), na hover pune svetline
- Iza slajdera je svetlosiva pozadina (`bg-muted`), zaobljena na desktopu
- **Samo se okreće**: na svake 3 sekunde prsten se okrene za jedno mesto **udesno** (igra levo od
  glavne dolazi napred). Prelaz traje 700 ms sa mekim usporavanjem
- Igra koja prelazi sa jednog kraja liste na drugi to radi iza prstena, bez animacije, pa ništa
  ne preleće preko ekrana
- **Pauza na hover**: dok je miš iznad slajdera (ili je fokus u njemu), kretanje stoji
- Strelice ← →, prevlačenje prstom na telefonu i klik na bočnu igru (ona dođe napred); klik na
  glavnu igru otvara njenu stranicu
- Ispod glavne igre: „#N best seller · izdavač“, naslov i cena
- Uz `prefers-reduced-motion` nema automatskog okretanja ni animacije prelaza
- Tehnička napomena: bez `z-index` na karticama, jer u Chromeu poravna 3D prsten u ravan

## Katalog
- Telefon: polje za pretragu, zatim red sa dugmetom „Filters“ i izborom sortiranja; mreža od 2 kolone
- Desktop: pretraga levo, „Filters“ i sortiranje desno u istom redu; mreža od 5 kolona preko cele
  širine (nema bočne kolone)
- **Panel sa filterima** klizi sa desne strane na svim veličinama (`Sheet`, `side="right"`): preko
  celog ekrana na telefonu, širine `max-w-md` na desktopu, sa tamnim slojem iza. Dno panela je
  zalepljeno: „Clear all“ (outline) i „Show games“ (crno) jedno pored drugog
- Broj aktivnih filtera je mali crni krug sa belim brojem u dugmetu „Filters“
- Aktivni filteri kao `secondary` čipovi sa ✕, plus „Obriši sve“ kao tekstualno dugme
- Broj rezultata iznad mreže u `muted-foreground`

## Detalj igre
- Telefon: slika kutije na vrhu (najviše 60% širine ekrana, centrirana), zatim informacije, izbor
  platforme i izdanja, cena, dugme „Dodaj u korpu“ preko cele širine, opis
- Desktop: dve kolone, slika kutije levo (zalepljena pri skrolovanju), sve ostalo desno
- Izbor platforme i izdanja su toggle dugmad (sa okvirom; izabrano = `secondary`)
- Dodaj u korpu: veliko `primary` dugme sa ikonicom korpe

## Forme (prijava, forma za igru)
- Jedna kolona, labele iznad polja, `max-w-md` za prijavu, `max-w-2xl` za formu igre
- Tekst greške ispod polja u `destructive`, `text-sm`
- Glavno dugme je `primary`; otkazivanje je `ghost` dugme

## Stanja
- **Učitavanje:** skeletoni istog oblika kao sadržaj (kutije 3:4, redovi teksta), `bg-muted`
- **Prazno:** kratka poruka i jedna akcija („Obriši filtere“, „Pogledaj igre“), centrirano, uz
  ikonicu iz lucide u `muted-foreground`
- **Greška:** poruka u `destructive` i dugme „Pokušaj ponovo“
- Dugmad koja čuvaju podatke prikazuju spinner i onemogućena su

## Interakcija i animacije
- Hover na kutiji: podizanje 8 px, crni okvir i senka za 200 ms, uvećanje slike za 300 ms
- Dodavanje u korpu: brojač „poskoči“, 250 ms, plus kratka poruka „Dodato u korpu“
- Filteri i sortiranje odmah menjaju listu i čuvaju se u URL-u
- Sve animacije traju 150–250 ms i isključuju se uz `prefers-reduced-motion`

## Slike
- Slike kutija u odnosu 3:4, `object-cover`, lazy učitavanje, sa `alt="<title> box art"`
- Za sada su placeholder slike sa picsum-a; kasnije ih zamenite pravim slikama kutija

## Ikonice
Samo `lucide-react`: `ShoppingCart`, `Search`, `User`, `ChevronLeft`, `ChevronRight`,
`SlidersHorizontal`, `X`, `Star`, `Trash2`, `Minus`, `Plus`.

## Reference
- GameStop: predlozi u pretrazi, bočna kolona sa filterima, izbor platforme i izdanja na
  stranici proizvoda
- Best Buy: jedna istaknuta boja samo za glavnu akciju (kod nas crna), jasan blok sa cenom i precrtanom starom cenom

## Ne raditi
- Gradijente bez razloga, emoji umesto ikonica, „Dobro došli u…“ hero sekciju
- Sve u karticama sa senkama
- Boje van crne, sive i bele (osim crvene za greške)
- Položene sličice za igre: igra se uvek prikazuje kao uspravna kutija
- Više od dva fonta
