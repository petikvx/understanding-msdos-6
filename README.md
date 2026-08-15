# Comprendre MS-DOS 6

**Understanding MS-DOS 6** — lecture commentée du code source Microsoft (1991–1993).

Un guide statique, bilingue (FR / EN), qui explique le système depuis ses sources : noyau, boot, drivers, et tout `cmd/`. Pas un manuel utilisateur. Pas une histoire orale. Le texte s’appuie sur des chemins, des structures et des extraits réels (`UNPACK`, `COMTAB`, `Disk_Header`, `our_version = 0AA02h`…).

- **Guide :** ouvrir [`site/index.html`](site/index.html) — ou la [page racine](index.html) qui y pointe.
- **Explorateur :** [`site/source.html`](site/source.html) — arbre + coloration (ex. [`bios/sysconf.asm`](site/source.html?f=bios/sysconf.asm)).
- **Sources brutes :** [`ms-dos-6-source-code/`](ms-dos-6-source-code/)
- **Dépôt :** [github.com/petikvx/understanding-msdos-6](https://github.com/petikvx/understanding-msdos-6)

---

## Lire le guide

Aucun cadriciel, aucun serveur obligatoire.

```bash
git clone git@github.com:petikvx/understanding-msdos-6.git
cd understanding-msdos-6
xdg-open index.html          # ou ouvrir site/index.html dans le navigateur
```

Un serveur local évite les restrictions `file://` sur certains navigateurs :

```bash
python3 -m http.server 8080 --directory .
# http://127.0.0.1:8080/          → page racine
# http://127.0.0.1:8080/site/     → le guide
```

### Trois profondeurs, deux langues

Chaque article est **une seule page**. Les blocs se plient selon le niveau :

| Niveau | Ce qu’on y trouve |
| --- | --- |
| **Découverte** | À quoi ça sert, le geste à l’invite, l’image mentale. |
| **Intermédiaire** | Structures, interrupteurs, rapports entre utilitaires. |
| **Technique** | Extraíts commentés, chemins `dos/`, `cmd/`, `inc/`, rustines (M001, C02…). |
| **Tout** | Les trois ouverts. |

Sélecteurs en tête de page. Préférences conservées dans `localStorage` (`msdos-lang`, `msdos-level`).

### GitHub Pages

Dans le dépôt : **Settings → Pages → Deploy from a branch**, branche `main`, dossier `/ (root)`.

L’URL publique ouvre `index.html`, qui envoie vers `site/`.

---

## Les sept sagas

44 articles, dans l’ordre pédagogique.

### 1 · Du courant à l’invite

| Page | Sujet |
| --- | --- |
| [Amorçage](site/boot.html) | ROM → `7C00h` → IO.SYS (3 secteurs) → MSLOAD |
| [CONFIG.SYS](site/config.html) | Passes SYSINIT, `DEVICE=` en overlay, `DOS=HIGH,UMB` |
| [HIMEM.SYS](site/himem.html) | XMS, A20, HMA |
| [COMMAND.COM](site/command.html) | Résident / transient, pipes-fichiers, COMTAB |

### 2 · Noyau au quotidien

| Page | Sujet |
| --- | --- |
| [FAT](site/fat.html) | FAT12/16, UNPACK/PACK, ALLOCATE — pas de FAT32 |
| [Fichiers ouverts](site/fichiers.html) | Handle, JFN, SFT, FCB |
| [Mémoire](site/memoire.html) | Arènes `4Dh`/`5Ah`, first / best / last, UMB |
| [INT 21h](site/int21.html) | Dispatcher, piles Aux / Io / Dsk, table DISPATCH |
| [EXEC · PSP](site/exec.html) | `FOO.COM`, MZ, EXIT, TSR |

### 3 · Outils disque

| Page | Sujet |
| --- | --- |
| [FDISK](site/fdisk.html) | MBR, types 1/4/6, partition étendue |
| [FORMAT](site/format.html) | Safe format, BPB, `/S`, UNFORMAT |
| [CHKDSK](site/chkdsk.html) | FATMAP, orphelins, cross-links, `FILE0000.CHK` |
| [DISKCOPY](site/diskcopy.html) | Copie piste à piste + DISKCOMP |

### 4 · Au-dessus et en dessous du noyau

| Page | Sujet |
| --- | --- |
| [EMM386](site/emm386.html) | V86, EMS, UMB, VCPI (encore nommé CEMM) |
| [SMARTDRV](site/smartdrv.html) | Codename Bambi, cache XMS sous INT 13h |
| [DoubleSpace](site/dblspace.html) | MagicDrv, CVF, MAGICPATCH |
| [INT 13h](site/int13.html) | BDS, CHS, BIOS disque d’IO.SYS |

### 5 · Services et compatibilité

| Page | Sujet |
| --- | --- |
| [INT 24h](site/int24.html) | Abort / Retry / Ignore / Fail |
| [IOCTL](site/ioctl.html) | `AH=44h`, generic IOCTL |
| [MODE](site/mode.html) | CLI d’IOCTL : écran, COM, LPT, pages de codes |
| [SHARE](site/share.html) | JShare, deny-*, verrous `5Ch` |
| [PRINT](site/print.html) | Spouleur, INT 28 |
| [NLS](site/nls.html) | KEYB, COUNTRY, pages de codes, DBCS |
| [SETVER](site/setver.html) | Mentir sur `AH=30h` |

### 6 · Utilitaires et coquille

| Page | Sujet |
| --- | --- |
| [ANSI.SYS](site/ansi.html) | CON « fancy », CSI |
| [RAMDRIVE](site/ramdrive.html) | FAT en XMS/EMS |
| [POWER](site/power.html) | APM, `HLT`, idle INT 28 |
| [FASTOPEN](site/fastopen.html) | Cache de chemins |
| [RECOVER](site/recover.html) | Un fichier par chaîne FAT |
| [DEBUG](site/debug.html) | Assemble, trace, INT 21h à la main |
| [MEM](site/mem.html) | Carte des arènes, `/C /D /F` |
| [Interlnk](site/interlnk.html) | FastLynx, série / parallèle |
| [SUBST · JOIN · APPEND](site/chemins.html) | CDS, lettres menteuses |
| [DOSSHELL](site/dosshell.html) | COW, swapper WOA |

### 7 · La boîte `cmd/` jusqu’au bout

| Page | Sujet |
| --- | --- |
| [XCOPY](site/xcopy.html) | Arbre en RAM, REPLACE, EXPAND `SZDD` |
| [BACKUP](site/backup.html) | `CONTROL.001` + `BACKUP.001`, RESTORE deux formats |
| [Filtres](site/filtres.html) | MORE, FIND, SORT (64 Ko), FC, COMP |
| [DOSKEY](site/doskey.html) | Anneau d’historique, macros, INT 2Fh `4800h` |
| [EDLIN](site/edlin.html) | Éditeur ligne, `.BAK` |
| [ATTRIB](site/attrib.html) | LABEL, TREE, SYS |
| [GRAPHICS](site/graph.html) | PrtSc graphique, GRAFTABL INT 1Fh |
| [HELP](site/aide.html) | `DOSHELP.HLP` + spawn `/?` |
| [LOADFIX](site/loadfix.html) | EXE2BIN, PRINTFIX, WINA20.386 |
| [Restes](site/restes.html) | ADDRV (MSKK), REDIR sans source, MIRROR/UNFORMAT (Central Point) |

Hors saga, volontairement : **QBasic / EDIT**, **Setup** (`install/`), **CHOICE.COM** (absent de cet arbre).

---

## Arborescence du dépôt

```
.
├── index.html                 ← porte d’entrée (pointe vers site/)
├── README.md
├── site/                      ← le guide (HTML5 + CSS3 + JS vanilla)
│   ├── index.html             ← accueil, sept sagas
│   ├── css/style.css
│   ├── js/app.js              ← langue + niveau
│   ├── js/trace.js            ← machine TYPE AUTOEXEC (fichiers)
│   ├── js/mem.js              ← first / best / last
│   ├── js/dispatch.js         ← sélecteur INT 21h
│   ├── js/exec.js             ← FOO.COM
│   └── js/command.js          ← DIR | SORT
└── ms-dos-6-source-code/      ← sources Microsoft (et cousins)
    ├── dos/                   ← noyau (FAT, INT 21h, EXEC, arènes…)
    ├── bios/                  ← IO.SYS, SYSINIT, INT 13
    ├── boot/                  ← secteur d’amorçage
    ├── inc/                   ← structures partagées (BPB, DPB, CDS, SFT)
    ├── cmd/                   ← utilitaires externes + COMMAND
    ├── dev/                   ← HIMEM, EMM386, SMARTDRV, ANSI, RAMDRIVE…
    ├── dosshell/
    ├── install/               ← Setup (hors guide)
    ├── h/                     ← en-têtes C
    └── c6ers/                 ← bibliothèque C des utilitaires
```

---

## Conventions du site

- HTML statique, pas de build, pas de NPM.
- Bilingue par nœuds `data-lang="fr|en"` ; `html.lang-fr` / `html.lang-en` masque l’autre.
- Niveaux par `<details class="level-block" data-level="…">` ; `html[data-level]` les montre ou les cache.
- Extraíts de source dans des `<pre><code>` ; chemins toujours relatifs à `ms-dos-6-source-code/`.
- Machines JS optionnelles (FAT suite, mémoire, dispatcher, EXEC, COMMAND) : pédagogie, pas des émulateurs.

---

## English

A bilingual static handbook of MS-DOS 6, read from the Microsoft source. Open [`site/index.html`](site/index.html) (or the [root landing page](index.html)). Each article has three depths — discovery, intermediate, technical — and a FR/EN toggle (stored as `msdos-lang` / `msdos-level`).

No framework. Seven sagas: boot to prompt, everyday kernel, disk tools, around the kernel, services, utilities/shell, then the rest of `cmd/`. QBasic, Setup and CHOICE are out of scope.

```bash
python3 -m http.server 8080 --directory .
```

---

## Avertissement / notice

Les textes pédagogiques du dossier `site/` sont originaux.

Les extraits et l’arbre `ms-dos-6-source-code/` portent les en-têtes **Microsoft Confidential**, © Microsoft Corporation 1991 (et, pour MIRROR/UNFORMAT, Central Point Software). Ce dépôt est un outil d’étude. Il n’est pas une licence de redistribution commerciale du système.

Le code source n’est **pas** FAT32, **pas** MS-DOS 6.22 « retail » documenté : FAT12/16, DoubleSpace (pas DriveSpace), utilitaires encore étiquetés DOS 4.00 ou 5.00.
