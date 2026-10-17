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
Svetla crno-bela tema sa većim naglaskom na sive tonove, prema poslednjem zahtevu korisnika.
Siva pozadina stranice, izraženija siva polica karusela i svetlosive oznake stvaraju slojeve.
Taman header, tekst i glavne akcije zadržavaju kontrast; meniji i paneli ostaju beli.

| Uloga | Boja | Token | Gde se koristi |
|---|---|---|---|
| Pozadina | svetlosiva `#F5F5F5`, bela `#FFFFFF` | `background`, `card`, `popover` | stranica, kartice, meniji |
| Tekst | skoro crna `#1C1C1C` | `foreground` | naslovi i tekst |
| Brend | skoro crna `#171717`, beli tekst | `brand`, `brand-foreground` | header i ivice 3D kutija |
| Glavna akcija | ugljenosiva `#262626`, beli tekst | `primary`, `primary-foreground` | dugmad, popusti, cene i oznake sekcija |
| Sekundarna | tamnosiva `#4A4A4A`, beli tekst | `secondary`, `secondary-foreground` | izabrane opcije i aktivni filteri |
| Tihi tekst | siva `#606060` | `muted-foreground` | dodatne informacije i stara cena |
| Tiha podloga | siva `#E7E7E7` | `muted` | skeletoni i pozadina karusela |
| Akcent | siva `#DEDEDE`, tekst `#333333` | `accent`, `accent-foreground` | hover i oznake platformi |
| Status | siva `#E4E4E4`, tekst `#333333` | `highlight`, `highlight-foreground` | „In stock“ i „Pre-order“ u katalogu |
| Linije | `#D0D0D0`, `#BCBCBC` | `border`, `input` | okviri i ivice polja |
| Fokus | srednja siva `#808080` | `ring` | prsten fokusa |
| Greška | crvena | `destructive` | samo poruke o grešci i „Ukloni“ |

- Na tamnom headeru brojač korpe je beo krug sa tamnim brojem.
- Tekst i podloge moraju imati najmanje 4.5:1 kontrast.
- Crvena se koristi samo za greške; ostatak interfejsa je u crnoj, sivoj i beloj.

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
- Tanke `border` linije za kontrole. Senke na 3D kutijama daju osećaj fizičke dubine; koriste se
  i na slojevima koji lebde (meniji, panel sa filterima, zalepljena ukupna cena u korpi).

## Header
- Tamna traka preko cele širine (`bg-brand`), beli logo „LevelUp“ u Rajdhani bold
- Telefon: logo levo; ikonice pretrage, korpe sa brojem i korisnika desno. Pretraga se otvara kao
  polje preko cele širine ispod trake
- Desktop: logo levo; ikonica pretrage (vodi na katalog), korpa i prijava desno
- Brojač korpe: mali beli krug sa tamnim brojem; jednom „poskoči“ kad se doda stavka

## Kutija igre (glavni element interfejsa)
- Svaka igra se prikazuje kao cela kutija: uspravna slika omota u odnosu **3:4**
- Ispod kutije: naslov (najviše 2 reda), oznake platformi, cena; stara cena precrtana kad je na
  popustu; oznaka „−20%“ u gornjem levom uglu kutije
- Igre koje tek izlaze u katalogu dobijaju svetlosivu oznaku „Pre-order“; popusti su ugljenosivi.
- Kutije u katalogu i karuselu imaju prednju, zadnju i bočne strane, sa blagim odsjajem.
- Hover (desktop): kutija u katalogu se podigne 8 px i dodatno zakrene, senka se pojača, a slika se
  blago uveća (105%); cela kutija je link ka igri
- Fokus (tastatura): vidljiv sivi prsten (`ring`)
- Usklađen izgled fizičke kutije u karuselu i u mreži kataloga

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
- Iza slajdera je blagi prelaz srednje svetle sive u svetlosivu, sa tankim okvirom,
  zaobljen na desktopu. Prelaz izdvaja policu sa 3D kutijama.
- **Samo se okreće**: na svake 3 sekunde prsten se okrene za jedno mesto **udesno** (igra levo od
  glavne dolazi napred). Prelaz traje 700 ms sa mekim usporavanjem
- Igra koja prelazi sa jednog kraja liste na drugi to radi iza prstena, bez animacije, pa ništa
  ne preleće preko ekrana
- **Pauza na hover**: dok je miš iznad slajdera (ili je fokus u njemu), kretanje stoji
- Bez strelica: prevlačenje prstom na telefonu i klik na bočnu igru (ona dođe napred); klik na
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
  zalepljeno: „Clear all“ (outline) i „Show games“ (ugljenosivo) jedno pored drugog
- Broj aktivnih filtera je mali tamnosivi krug sa belim brojem u dugmetu „Filters“
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
- Hover na kutiji: podizanje 8 px, zakretanje i senka za 300 ms, uvećanje slike za 300 ms
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
- Best Buy: istaknuta boja za glavnu akciju (kod nas ugljenosiva), jasan blok sa cenom i precrtanom starom cenom

## Ne raditi
- Gradijente bez razloga, emoji umesto ikonica, „Dobro došli u…“ hero sekciju
- Sve u karticama sa senkama
- Proizvoljne boje izvan definisanih tokena; svaki akcent ima doslednu ulogu
- Položene sličice za igre: igra se uvek prikazuje kao uspravna kutija
- Više od dva fonta
