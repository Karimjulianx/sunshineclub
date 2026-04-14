[README.md](https://github.com/user-attachments/files/26726847/README.md)
# Sunshine Club — Website

## Ordnerstruktur

```
sunshine-club/
├── index.html
├── style.css
├── script.js
├── fonts.css
├── fonts/
│   ├── Agrandir-GrandHeavy.otf
│   ├── Agrandir-WideBlackItalic.otf
│   ├── Agrandir-WideLight.otf
│   ├── TruenoLt.otf
│   ├── TruenoRg.otf
│   ├── TruenoSBd.otf
│   └── TruenoBd.otf
└── img/
    ├── merch/
    │   ├── bag-1.png
    │   ├── bag-2.png
    │   ├── tank-top-model.png
    │   └── tank-top-flat.png
    └── moments/
        ├── vol1-2025/   ← "The Beginnings"
        ├── vol2-2025/   ← "Pride Edition"
        ├── vol3-2025/   ← "Midsummer Edition"
        ├── vol4-2025/   ← "Weinwandern"
        ├── vol5-2025/   ← "Sparkle Season"
        ├── vol1-2026/   ← "Valentines Edition"
        └── vol2-2026/   ← "Treasure & Sunshine Hunt"
```

## Event-Fotos einbinden

1. Lege deine Fotos in den jeweiligen Ordner, z.B. `img/moments/vol1-2025/`
2. Benenne sie einfach: `01.jpg`, `02.jpg`, `03.jpg` usw.
3. Öffne `index.html` und suche nach dem Karussell für dieses Event
4. Ersetze die `background-color` Zeilen durch:
   ```html
   <div class="carousel__slide" style="background-image:url('img/moments/vol1-2025/01.jpg'); background-size:cover; background-position:center;"></div>
   ```

## Auf GitHub hochladen

Alle diese Ordner und Dateien müssen auf GitHub sein:
1. GitHub → Add file → Upload files
2. Ordner einfach reinziehen (GitHub behält die Ordnerstruktur)
3. Commit changes

## Links anpassen

- Tickets: suche nach `eventbrite.com` in index.html → ersetzen
- Instagram: bereits auf `instagram.com/sunshine___club/` gesetzt
- E-Mail: bereits auf `hello@sunshineclub.at` gesetzt
