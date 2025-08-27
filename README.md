# Prometheus OS: Creator Marketing AI

Prometheus OS to platforma oparta na AI, zaprojektowana jako centrum dowodzenia dla niezależnych twórców (muzyków, pisarzy, artystów). Jej celem jest automatyzacja i optymalizacja działań marketingowych poprzez wykorzystanie darmowych narzędzi open-source oraz potęgi generatywnej sztucznej inteligencji.

## Lista Zadań (To-Do List)

Poniższa lista śledzi postęp prac nad projektem, dzieląc zadania na te, które zostały już ukończone, oraz te, które są planowane w dalszym rozwoju.

---

### ✅ Ukończone

-   **[x] Struktura i Nawigacja:**
    -   **[x]** Stworzenie głównej struktury aplikacji w oparciu o React i TypeScript.
    -   **[x]** Implementacja panelu bocznego (Sidebar) z nawigacją do wszystkich kluczowych modułów.

-   **[x] Dashboard:**
    -   **[x]** Stworzenie interaktywnego pulpitu nawigacyjnego jako centralnego punktu startowego.

-   **[x] AI Factory (Fabryka AI):**
    -   **[x]** Generator postów na media społecznościowe dla różnych platform.
    -   **[x]** Generator pomysłów na wpisy blogowe wraz ze szkicami i słowami kluczowymi.
    -   **[x]** Generator obrazów (integracja z modelem Imagen 4).
    -   **[x]** UI do konceptualnego wyboru modeli AI, podkreślający filozofię open-source.

-   **[x] Distribution Hub (Centrum Dystrybucji):**
    -   **[x]** Generator profesjonalnych informacji prasowych na podstawie krótkiego opisu.
    -   **[x]** Symulator dystrybucji informacji prasowej ze śledzeniem statusu w czasie rzeczywistym.
    -   **[x]** Asystent Zgłoszeń do mediów (generowanie spersonalizowanych "pitchy" do kuratorów, blogów, etc.).
    -   **[x]** Inteligentny Harmonogram (generowanie 7-dniowego planu publikacji w social mediach).

-   **[x] CRM (Zarządzanie Kontaktami):**
    -   **[x]** Generator przykładowej bazy kontaktów (media, fani, influencerzy) na podstawie niszy twórcy.
    -   **[x]** Wyświetlanie listy kontaktów w przejrzystej formie tabelarycznej.

-   **[x] Analytics (Analityka):**
    -   **[x]** Dynamiczny, generowany przez AI panel analityczny symulujący wyniki kampanii.
    -   **[x]** Wizualizacja kluczowych wskaźników (KPI), sentymentu, trendów zaangażowania i najpopularniejszych treści.

-   **[x] Automation (Automatyzacja):**
    -   **[x]** Generator pomysłów na gotowe schematy automatyzacji marketingowej (np. cross-posting, newslettery).

-   **[x] Interactive AI (Interaktywne AI):**
    -   **[x]** Generator konceptów na doświadczenia interaktywne (AR/VR/MR) dla fanów.
    -   **[x]** Generowanie obrazu koncepcyjnego na podstawie opisu projektu interaktywnego.

-   **[x] Settings (Ustawienia):**
    -   **[x]** Stworzenie panelu do konceptualnej konfiguracji stosu technologicznego (open-source).

-   **[x] UI/UX:**
    -   **[x]** Wdrożenie spójnego systemu designu (karty, przyciski, ikony).
    -   **[x]** Implementacja obsługi stanów ładowania i błędów w kluczowych modułach.
-   **[x] Funkcjonalność:**
    -   **[x]** **Pełne zarządzanie CRM:** Rozbudowa modułu CRM o możliwość ręcznego dodawania, edycji i usuwania kontaktów.
    -   **[x]** **Integracja z Kalendarzem:** Możliwość eksportu harmonogramu z Distribution Hub do pliku `.ics`.
    -   **[x]** **Zapisywanie Stanu:** Implementacja mechanizmu zapisywania wygenerowanych treści (np. w `localStorage`), aby nie znikały po odświeżeniu strony.

### 🔜 Do Wykonania

-   **[ ] Funkcjonalność:**
    -   **[ ]** **Interaktywna Automatyzacja:** Rozbudowa modułu Automation o wizualny edytor "przeciągnij i upuść" do budowania schematów (zamiast samego generowania pomysłów).

-   **[ ] AI Factory - Rozszerzenia:**
    -   **[ ]** **Implementacja Generowania Audio:** Podłączenie konceptualnego modułu Audio do rzeczywistego, darmowego API lub narzędzia open-source.
    -   **[ ]** **Implementacja Generowania Wideo:** Analogicznie do audio, integracja z generatorem wideo.

-   **[ ] UI/UX i Dostępność:**
    -   **[ ]** **Onboarding / Samouczek:** Stworzenie krótkiego przewodnika dla nowych użytkowników, który wyjaśni możliwości każdego modułu.
    -   **[ ]** **Audyt Dostępności (WCAG):** Pełna weryfikacja aplikacji pod kątem dostępności dla osób z niepełnosprawnościami.
    -   **[ ]** **Lokalizacja:** Przygotowanie infrastruktury do tłumaczenia interfejsu na inne języki.

-   **[ ] Techniczne:**
    -   **[ ]** **Testy Jednostkowe i Integracyjne:** Dodanie testów dla kluczowych komponentów i usług (np. `geminiService`).
    -   **[ ]** **Optymalizacja Wydajności:** Analiza i optymalizacja ładowania zasobów oraz renderowania komponentów.
    -   **[ ]** **Dokumentacja Kodu:** Uzupełnienie komentarzy i dokumentacji dla bardziej złożonych części aplikacji.

---
### ⚙️ Automatyzacja Postępów (Development Automation)

Ten projekt zawiera skrypt do automatycznego aktualizowania tej listy zadań. Po ukończeniu zadania z sekcji "Do Wykonania", możesz użyć poniższej komendy, aby przenieść je do sekcji "Ukończone".

**Użycie:**
```bash
node scripts/update-readme.mjs "Unikalny fragment nazwy zadania"
```

**Przykład:**

Aby oznaczyć zadanie "Implementacja mechanizmu zapisywania stanu" jako ukończone, użyj:
```bash
node scripts/update-readme.mjs "Zapisywanie Stanu"
```

Możesz podać wiele fragmentów nazw, aby zaktualizować kilka zadań jednocześnie.