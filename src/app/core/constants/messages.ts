
export const errorMessages= new Map<string, string>(
  [
      ['auth.incorrect-data-of-login', $localize`Błędne dane logowania`],
      ['auth.expired-access-token', $localize`Token stracił ważność. Zaloguj się ponownie.`],
      ['user.username-already-taken', $localize`Nazwa użytkownika jest zajęta`],
      ['user.email-already-taken', $localize`Adres e-mail jest zajęty`],
      ['user.verification-code-not-found', $localize`Nie znaleziono kodu weryfikującego`],
      ['user.expired-verification-code', $localize`Kod weryfikacyjny wygasł. Poproś o nowy kod i spróbuj ponownie.`],
      ['user.incorrect-verification-code', $localize`Nieprawidłowy kod weryfikacyjny. Sprawdź kod i spróbuj ponownie.`],
      ['user.passwords-do-not-match', $localize`Hasła się nie zgadzają.`],
      ['user.recovery-code-has-expired', $localize`Kod odzyskiwania wygasł. Poproś o nowy kod i spróbuj ponownie.`],
      ['user.recovery-code-is-already-used', $localize`Kod odzyskiwania został już użyty.`],
      ['category.not-found',$localize`Kategoria nie została znaleziona.`],
      ['category.exist-game-with-this-category', $localize`Istnieje gra z tą kategorią`],
      ['category.category-with-this-name-already-exists', $localize`Ta nazwa kategorii jest już zajęta.`],
      ['game.not-found', $localize`Gra nie została znaleziona.`],
      ['game.game-with-this-name-already-exists', $localize`Ta nazwa gry jest już zajęta.`]
  ]
);
