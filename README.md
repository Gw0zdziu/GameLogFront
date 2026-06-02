# GameLogFront

Frontend aplikacji GameLog — dziennika gier wideo. Umożliwia użytkownikom rejestrację, logowanie oraz zarządzanie swoją biblioteką gier i kategoriami.

## Stos technologiczny

| Warstwa | Technologia |
|---|---|
| Framework | Angular 19 |
| UI | PrimeNG 19, FontAwesome |
| State management | NgRx SignalStore |
| i18n | Angular Localize (PL / EN) |
| Testy | Jest + @testing-library/angular |
| Serwer | nginx (Alpine) |
| Konteneryzacja | Docker / Docker Compose |

## Wymagania

- Node.js 22 (zarządzane przez [Volta](https://volta.sh))
- Docker + Docker Compose
- Backend: [GameLogBack](https://github.com/) uruchomiony lokalnie lub dostępny pod skonfigurowanym adresem

## Uruchomienie lokalne (bez Dockera)

```bash
npm install

# Wersja polska
npm run dev-pl

# Wersja angielska
npm run dev-en
```

Aplikacja działa na `http://localhost:4300`.

## Uruchomienie przez Docker Compose

Docker Compose uruchamia trzy usługi: frontend (nginx), backend (.NET) i bazę danych (PostgreSQL).

```bash
docker compose up --build
```

| Usługa | Port lokalny |
|---|---|
| Frontend | `http://localhost` |
| Backend API | `http://localhost:8080` |
| PostgreSQL | `localhost:5435` |

## Zmienne środowiskowe bazy danych

```
POSTGRES_PASSWORD=gamelogdb
POSTGRES_DB=gamelogdb
```

## Budowanie produkcyjne

```bash
npm run build
```

Artefakty trafiają do `dist/game-log-front/browser/` z podkatalogami `/en/` i `/pl/`.

## Testy

```bash
npm test
```

Uruchamia Jest z raportem pokrycia kodu.

## Struktura projektu

```
src/app/
├── core/
│   ├── components/        # Navbar, Menu
│   ├── directives/        # CloseSidebar
│   ├── guards/            # authGuard
│   ├── interceptors/      # auth, refresh-token
│   ├── pipes/             # FormatDate
│   ├── services/          # RefreshToken, Toast
│   └── store/             # lang, theme, token, user, logged
├── features/
│   ├── auth/              # Login
│   ├── category/          # CRUD kategorii
│   ├── game/              # CRUD gier, GameBrainAPI
│   ├── home/              # Widok główny
│   ├── lang-toggle/       # Przełącznik języka
│   ├── theme-toggle/      # Przełącznik motywu
│   └── user/              # Rejestracja
└── shared/
    ├── components/        # ListItem, MenuItem, Paginator
    ├── constants/         # Definicje języków
    ├── models/            # DTO, modele współdzielone
    └── services/          # Layout
```

## Internacjonalizacja (i18n)

Aplikacja jest budowana osobno dla każdego języka. nginx kieruje ruch na podstawie prefiksu URL:

- `http://localhost/pl/` — wersja polska
- `http://localhost/en/` — wersja angielska

Przekierowanie na domyślną wersję językową odbywa się na podstawie nagłówka `Accept-Language` przeglądarki. Nginx przekazuje do backendu nagłówek `Accept-Language` zgodny z aktywnym językiem aplikacji (wykrywanym z nagłówka `Referer`).

## Deployment (produkcja)

Aplikacja jest wdrożona na platformie [Railway](https://railway.app):

- Frontend: `https://gamelogfront.up.railway.app`
- Backend: `https://gamelogback.up.railway.app`

Produkcyjny obraz Dockera budowany jest z `Dockerfile`, deweloperski z `Dockerfile.dev`.
