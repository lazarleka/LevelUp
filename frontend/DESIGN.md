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
Svetla tema. Tamnozelena preuzima ulogu crne: to je boja brenda i teksta. Žuta je rezervisana
za akcije, tako da je dugme za kupovinu uvek najuočljivija stvar na ekranu.

| Uloga | Boja | Token | Gde se koristi |
|---|---|---|---|
| Pozadina | `#FFFFFF` | `background`, `card`, `popover` | stranica, kartice, meniji |
| Tekst | `#164A41` | `foreground` | naslovi i tekst |
| Brend | `#164A41` sa belim tekstom | `brand`, `brand-foreground` | traka headera, footer |
| Glavna akcija | `#F1B24A` sa tekstom `#164A41` | `primary`, `primary-foreground`, `ring` | „Dodaj u korpu“, strelice karusela, oznaka popusta, brojač korpe, prsten fokusa |
| Sekundarna | `#4D774E` sa belim tekstom | `secondary`, `secondary-foreground` | oznake platforme, aktivni filter-čipovi |
| Tihi tekst | `#4D774E` | `muted-foreground` | dodatne informacije, stara cena, pomoćni tekst |
| Meka zelena | `#9DC88D` | `highlight`, `highlight-foreground` | oznaka „Na stanju“ |
| Svetle nijanse zelene | iz `#9DC88D` | `muted`, `accent` | skeletoni, pozadine sekcija, hover na filterima i stavkama menija |
| Linije | svetla sivozelena | `border`, `input` | okviri, ivice polja |
| Greška | crvena, van palete | `destructive` | samo poruke o grešci i „Ukloni“ |

- Tekst na žutoj je uvek tamnozelen, nikad beo (beli tekst na `#F1B24A` se ne čita)
- Svi parovi tekst/pozadina iz tabele prolaze WCAG AA (4.5:1 ili više)
- Žuta nikad nije ukras: bez žutih naslova, okvira ili pozadina ako tu nema akcije

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
- Tamnozelena traka preko cele širine (`bg-brand`), beli logo „LevelUp“ u Rajdhani bold
- Telefon: logo levo; ikonice pretrage, korpe sa brojem i korisnika desno. Pretraga se otvara kao
  polje preko cele širine ispod trake
- Desktop: logo, link Games, polje za pretragu u sredini (`max-w-md`), korpa i prijava desno
- Brojač korpe: mali žuti krug sa tamnozelenim brojem; jednom „poskoči“ kad se doda stavka

## Kutija igre (glavni element interfejsa)
- Svaka igra se prikazuje kao cela kutija: uspravna slika omota u odnosu **3:4**
- Ispod kutije: naslov (najviše 2 reda), oznake platformi, cena; stara cena precrtana kad je na
  popustu; oznaka „−20%“ u gornjem levom uglu kutije
- Igre koje tek izlaze dobijaju oznaku „Pre-order“ umesto oznake popusta
- Hover (desktop): kutija se podigne 4 px i okvir postane žut; cela kutija je link ka igri
- Fokus (tastatura): vidljiv žuti prsten
- Ista komponenta u karuselima i u mreži kataloga

## Karusel
- Naslov levo, link „Prikaži sve“ i dugmad ← → desno
- Dugmad sa strelicama: kvadrat 40 px, žuta (`primary`), onemogućena na krajevima sa 50% providnosti
- Na telefonu se vide 2 kutije (i deo treće), na desktopu 5–6; skrolovanje se „lepi“ za kutiju
- Prevlačenje na ekranu osetljivom na dodir, strelice na svim veličinama

## Katalog
- Telefon: polje za pretragu, zatim red sa dugmetom „Filteri (2)“ i izborom sortiranja; filteri
  se otvaraju u donjem panelu; mreža od 2 kolone
- Desktop: bočna kolona sa filterima (240 px) levo, mreža od 5 kolona desno; izbor sortiranja
  iznad mreže
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
- Hover na kutiji: podizanje i žuti okvir, 200 ms
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
- Best Buy: žuta samo za glavnu akciju, jasan blok sa cenom i precrtanom starom cenom

## Ne raditi
- Gradijente bez razloga, emoji umesto ikonica, „Dobro došli u…“ hero sekciju
- Sve u karticama sa senkama
- Beli tekst na žutoj, ili žutu kao ukras
- Položene sličice za igre: igra se uvek prikazuje kao uspravna kutija
- Više od dva fonta
