# LevelUp: specifikacija proizvoda

Šta pravimo i kada se smatra da je gotovo. Dizajn je u
[frontend/DESIGN.md](frontend/DESIGN.md), podaci i API u [docs/entities.md](docs/entities.md),
pravila za AI agente u [AGENTS.md](AGENTS.md).

## Cilj
LevelUp je online prodavnica **novih** video igara. Gejmer (15–30 godina, uglavnom na telefonu)
brzo pronalazi igru, vidi cenu i platforme i stavlja je u korpu.

## MVP
Jedan glavni tok koji mora da radi od početka do kraja pre bilo čega drugog:

> **Pronađi igru → otvori je → dodaj u korpu.**

„Radi od početka do kraja“ znači: pravi mock podaci kroz `api/`, stanja učitavanja, prazne liste
i greške, i stranica izgleda kako treba na 375 px i 1440 px.

## Ekrani

| # | Ekran | Ruta | MVP |
|---|---|---|---|
| 1 | Početna | `/` | da |
| 2 | Katalog (lista + filter) | `/games` | da |
| 3 | Detalj igre | `/games/:id` | da |
| 4 | Korpa | `/cart` | da |
| 5 | Prijava | `/sign-in` | da |
| 6 | Forma za igru (kreiranje / izmena, admin) | `/admin/games/new`, `/admin/games/:id/edit` | da, traži je radionica |
| – | Stranica nije pronađena | `*` | postoji |

Svi ekrani dele isti header: crna traka sa LevelUp logom, polje za pretragu (ikonica na
telefonu, polje na desktopu), ikonica korpe sa brojem stavki i prijava / ime korisnika.

### 1. Početna
- Tri karusela: **Novo** (najnoviji datum izlaska), **Najprodavanije** (po `soldCount`),
  **Na popustu** (`discountPercent > 0`), po 10 igara
- Svaki karusel ima naslov, link „Prikaži sve“ ka katalogu sa odgovarajućim sortiranjem ili
  filterom i dugmad ← →
- Strelice pomeraju red za onoliko kutija koliko ih se vidi; leva strelica je onemogućena na
  početku, desna na kraju. Na ekranu osetljivom na dodir radi i prevlačenje
- 2 kutije se vide na 375 px, 5–6 na 1440 px

**Gotovo kada:** sva tri reda se učitavaju preko `useGames`, strelice i prevlačenje rade, svaki
red ima svoj skeleton za učitavanje i poruku o grešci, a „Prikaži sve“ otvara već filtriran
katalog.

### 2. Katalog
- Mreža kutija igara: 2 kolone na telefonu, 3 na tabletu, 5 na desktopu
- **Pretraga** po imenu, sa predlozima dok kucaš (do 5 igara sa sličicom; Enter ili klik otvara
  igru)
- **Filteri:** platforma, žanr, raspon cene (min / max), najviši PEGI, samo na popustu, uskoro
  izlazi
- **Sortiranje:** najnovije (podrazumevano), cena ↑, cena ↓, najbolje ocenjene, najprodavanije
- Aktivni filteri kao „čipovi“ iznad mreže, svaki sa ✕, plus „Obriši sve“
- Filteri, pretraga i sortiranje su u URL-u (`/games?platform=ps5&sort=price-asc`), pa se
  stranica može podeliti i dugme „nazad“ radi
- Filteri se primenjuju odmah; na telefonu se otvaraju u donjem panelu, na desktopu su u bočnoj
  koloni
- Broj rezultata („12 igara“)

**Gotovo kada:** svaki filter i sortiranje menjaju mrežu, filteri se kombinuju, URL se ažurira i
vraća stanje posle osvežavanja, a prazan rezultat prikazuje „Nijedna igra ne odgovara“ sa
dugmetom „Obriši filtere“.

### 3. Detalj igre
- Velika slika kutije, naslov, izdavač, žanr, PEGI, datum izlaska, ocena (zvezdice + broj)
- **Izbor platforme** (samo platforme te igre) i **izbor izdanja** (Standard; Deluxe samo ako
  postoji `deluxePrice`)
- Cena za izabrano izdanje, stara cena precrtana kad je na popustu, oznaka „−20%“
- „Na stanju“ / „Nema na stanju“; igre koje tek izlaze prikazuju „Pre-order · izlazi 19. nov 2026“
- Dugme **Dodaj u korpu** (crno, glavna akcija), sa količinom 1
- Opis

**Gotovo kada:** promena izdanja menja cenu, dodavanje radi i brojač u headeru „poskoči“,
nepostojeći id prikazuje poruku da igra nije pronađena, a kad igre nema na stanju dugme je
onemogućeno.

### 4. Korpa
- Jedan red po stavci: sličica, naslov, platforma, izdanje, cena po komadu, birač količine
  (1–10), ukupno za stavku, dugme za uklanjanje
- Ukupna cena na dnu; na telefonu ukupna cena i dugme „Plaćanje“ ostaju zalepljeni za dno ekrana
- Prazna korpa: poruka i dugme „Pogledaj igre“
- „Plaćanje“ se vidi, ali vodi na poruku „uskoro“ (plaćanje nije deo MVP-a)

**Gotovo kada:** količina i uklanjanje odmah menjaju ukupnu cenu, brojač u headeru se poklapa, a
posle uklanjanja poslednje stavke prikazuje se prazno stanje.

### 5. Prijava
- Email i lozinka, validacija preko zod-a (ispravan email, lozinka od najmanje 6 karaktera)
- Mock: prijava radi sa bilo kojim emailom iz mock korisnika, lozinka se ne proverava
- Pogrešan email prikazuje „Ne postoji nalog sa tim emailom“ ispod forme
- Posle prijave korisnik se vraća na stranicu sa koje je došao

**Gotovo kada:** prijava i odjava rade, header prikazuje ime korisnika, a zaštićene akcije vode na
prijavu i nazad.

### 6. Forma za igru (admin)
- Polja iz `NewGame` u `docs/entities.md`, validacija preko zod-a i react-hook-form
- Ista forma za kreiranje i izmenu; kod izmene su polja već popunjena
- Vidi je samo prijavljeni `admin`; ostali se preusmeravaju na prijavu
- Posle čuvanja: povratak na stranicu detalja igre

**Gotovo kada:** kreirana igra se pojavljuje u katalogu, izmena se vidi na stranici detalja, a
poruke validacije stoje pored polja.

## Pravila u celoj aplikaciji
- Za dodavanje u korpu potrebna je prijava. Neprijavljen korisnik koji klikne „Dodaj u korpu“
  ide na `/sign-in` i vraća se na istu igru
- Cene se prikazuju kao `€59.49`; popust se uračunava pre prikaza cene
- Sav tekst u interfejsu je na engleskom
- Svaka slika ima `alt`, svaka kontrola radi sa tastaturom, fokus je vidljiv

## Kasnije (ne pre nego što MVP proradi)
Ocene i recenzije, „Možda ti se sviđa i…“, lista želja, detalji pre-ordera, plaćanje i „Moje
porudžbine“, registracija.

## Van opsega
Polovne igre, plaćanje karticom, prava dostava, više valuta, tamna tema.

## Otvorena pitanja
Za sada ih je odlučio Claude; promenite ih ovde ako se tim ne slaže.
- Da li neprijavljen korisnik može da puni korpu (korpa za goste)? Trenutno: ne, prvo prijava
- Da li plaćanje u MVP-u pravi mock porudžbinu? Trenutno: ne, „uskoro“
