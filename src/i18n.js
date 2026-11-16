// English source strings are stable message keys. Placeholders use {name}.
const messages = {
  ro: {},
  de: {},
  es: {},
  it: {},
  hu: {},
};

function add(en, ro, de, es, it, hu) {
  [ro, de, es, it, hu].forEach((value, index) => {
    messages[['ro', 'de', 'es', 'it', 'hu'][index]][en] = value;
  });
}

add('Language', 'Limba', 'Sprache', 'Idioma', 'Lingua', 'Nyelv');
add(
  'Skip to the configurator',
  'Sari la configurator',
  'Zum Konfigurator springen',
  'Ir al configurador',
  'Vai al configuratore',
  'Ugrás a konfigurátorhoz',
);
add(
  'Elite Custom Wrap home',
  'Elite Custom Wrap — pagina principală',
  'Elite Custom Wrap Startseite',
  'Elite Custom Wrap inicio',
  'Elite Custom Wrap pagina iniziale',
  'Elite Custom Wrap kezdőlap',
);
add(
  'Main navigation',
  'Navigare principală',
  'Hauptnavigation',
  'Navegación principal',
  'Navigazione principale',
  'Fő navigáció',
);
add(
  'Mobile navigation',
  'Navigare mobilă',
  'Mobile Navigation',
  'Navegación móvil',
  'Navigazione mobile',
  'Mobil navigáció',
);
add(
  'The configurator',
  'Configuratorul',
  'Der Konfigurator',
  'El configurador',
  'Il configuratore',
  'A konfigurátor',
);
add(
  'Our craft',
  'Măiestria noastră',
  'Unser Handwerk',
  'Nuestro oficio',
  'La nostra arte',
  'A mesterségünk',
);
add(
  'The collection',
  'Colecția',
  'Die Kollektion',
  'La colección',
  'La collezione',
  'A kollekció',
);
add(
  "Let's create",
  'Să creăm',
  'Jetzt gestalten',
  'Vamos a crear',
  'Creiamo',
  'Alkossunk',
);
add(
  'Open navigation',
  'Deschide navigarea',
  'Navigation öffnen',
  'Abrir navegación',
  'Apri navigazione',
  'Navigáció megnyitása',
);
add(
  'Close navigation',
  'Închide navigarea',
  'Navigation schließen',
  'Cerrar navegación',
  'Chiudi navigazione',
  'Navigáció bezárása',
);
add(
  'Start your project ↗',
  'Începe proiectul ↗',
  'Projekt starten ↗',
  'Inicia tu proyecto ↗',
  'Inizia il tuo progetto ↗',
  'Kezdd el a projektet ↗',
);
add(
  'Interactive vehicle wrap configurator',
  'Configurator interactiv pentru colantarea vehiculului',
  'Interaktiver Fahrzeugfolierungs-Konfigurator',
  'Configurador interactivo de vinilos para vehículos',
  'Configuratore interattivo per il wrapping',
  'Interaktív autófóliázási konfigurátor',
);
add(
  'THE DESIGN STUDIO',
  'STUDIOUL DE DESIGN',
  'DAS DESIGNSTUDIO',
  'EL ESTUDIO DE DISEÑO',
  'LO STUDIO DI DESIGN',
  'A DESIGNSTÚDIÓ',
);
add(
  'YOUR VISION. IN REAL TIME.',
  'VIZIUNEA TA. ÎN TIMP REAL.',
  'DEINE VISION. IN ECHTZEIT.',
  'TU VISIÓN. EN TIEMPO REAL.',
  'LA TUA VISIONE. IN TEMPO REALE.',
  'AZ ÖTLETED. VALÓS IDŐBEN.',
);
add(
  'Choose vehicle brand',
  'Alege marca vehiculului',
  'Fahrzeugmarke wählen',
  'Elige la marca',
  'Scegli la marca',
  'Válassz márkát',
);
add(
  'Choose your model',
  'Alege modelul',
  'Modell wählen',
  'Elige tu modelo',
  'Scegli il modello',
  'Válassz modellt',
);
add(
  'Find a vehicle',
  'Caută un vehicul',
  'Fahrzeug suchen',
  'Buscar un vehículo',
  'Cerca un veicolo',
  'Jármű keresése',
);
add(
  'Search brand or model',
  'Caută marca sau modelul',
  'Marke oder Modell suchen',
  'Buscar marca o modelo',
  'Cerca marca o modello',
  'Márka vagy modell keresése',
);
add(
  'THE WRAPPING ROOM / 01',
  'ATELIERUL DE COLANTARE / 01',
  'DIE FOLIERUNGSWERKSTATT / 01',
  'EL TALLER DE VINILOS / 01',
  'IL LABORATORIO WRAPPING / 01',
  'A FÓLIÁZÓMŰHELY / 01',
);
add(
  'Interactive 3D vehicle preview. Drag to rotate; use the controls to select and color panels.',
  'Previzualizare 3D interactivă. Trage pentru rotire; folosește comenzile pentru a selecta și colora panourile.',
  'Interaktive 3D-Fahrzeugvorschau. Ziehen zum Drehen; Flächen mit den Bedienelementen auswählen und färben.',
  'Vista 3D interactiva. Arrastra para girar; usa los controles para seleccionar y colorear paneles.',
  'Anteprima 3D interattiva. Trascina per ruotare; usa i comandi per selezionare e colorare i pannelli.',
  'Interaktív 3D járműnézet. Forgasd húzással, és válaszd ki és színezd a paneleket a vezérlőkkel.',
);
add(
  'The vehicle preview is unavailable.',
  'Previzualizarea vehiculului nu este disponibilă.',
  'Die Fahrzeugvorschau ist nicht verfügbar.',
  'La vista previa del vehículo no está disponible.',
  "L'anteprima del veicolo non è disponibile.",
  'A jármű előnézete nem érhető el.',
);
add(
  'Check your connection, reload, and use a browser with hardware acceleration enabled. You can still export your design brief.',
  'Verifică conexiunea, reîncarcă pagina și folosește un browser cu accelerare hardware activată. Poți totuși descărca fișa proiectului.',
  'Prüfe deine Verbindung, lade die Seite neu und verwende einen Browser mit Hardwarebeschleunigung. Das Briefing kannst du weiterhin exportieren.',
  'Comprueba la conexión, recarga y usa un navegador con aceleración por hardware. Aún puedes exportar tu ficha de diseño.',
  'Controlla la connessione, ricarica e usa un browser con accelerazione hardware. Puoi comunque esportare il riepilogo del progetto.',
  'Ellenőrizd a kapcsolatot, töltsd újra az oldalt, és használj hardveres gyorsítással működő böngészőt. A terv összefoglalója továbbra is letölthető.',
);
add(
  'Enable automatic rotation',
  'Activează rotirea automată',
  'Automatische Drehung aktivieren',
  'Activar giro automático',
  'Attiva rotazione automatica',
  'Automatikus forgatás bekapcsolása',
);
add(
  'Disable automatic rotation',
  'Dezactivează rotirea automată',
  'Automatische Drehung deaktivieren',
  'Desactivar giro automático',
  'Disattiva rotazione automatica',
  'Automatikus forgatás kikapcsolása',
);
add(
  'Auto rotate',
  'Rotire automată',
  'Automatisch drehen',
  'Giro automático',
  'Rotazione automatica',
  'Automatikus forgatás',
);
add(
  'Reset camera view',
  'Resetează perspectiva camerei',
  'Kameraansicht zurücksetzen',
  'Restablecer vista de cámara',
  'Ripristina vista della telecamera',
  'Kameranézet visszaállítása',
);
add(
  'Reset view',
  'Resetează perspectiva',
  'Ansicht zurücksetzen',
  'Restablecer vista',
  'Ripristina vista',
  'Nézet visszaállítása',
);
add(
  'Download car preview as PNG',
  'Descarcă previzualizarea ca PNG',
  'Fahrzeugvorschau als PNG herunterladen',
  'Descargar vista del coche como PNG',
  "Scarica l'anteprima come PNG",
  'Autó előnézetének letöltése PNG-ként',
);
add(
  'Download preview',
  'Descarcă previzualizarea',
  'Vorschau herunterladen',
  'Descargar vista previa',
  'Scarica anteprima',
  'Előnézet letöltése',
);
add(
  'DRAG TO EXPLORE',
  'TRAGE PENTRU A EXPLORA',
  'ZIEHEN ZUM ERKUNDEN',
  'ARRASTRA PARA EXPLORAR',
  'TRASCINA PER ESPLORARE',
  'HÚZD A FELFEDEZÉSHEZ',
);
add(
  'TAP A PANEL',
  'ATINGE UN PANOU',
  'FLÄCHE ANTIPPEN',
  'TOCA UN PANEL',
  'TOCCA UN PANNELLO',
  'ÉRINTS MEG EGY PANELT',
);
add(
  'Camera view',
  'Perspectiva camerei',
  'Kameraansicht',
  'Vista de cámara',
  'Vista telecamera',
  'Kameranézet',
);
add('Side', 'Lateral', 'Seite', 'Lateral', 'Laterale', 'Oldal');
add('Front', 'Față', 'Vorne', 'Frente', 'Fronte', 'Elöl');
add('Rear', 'Spate', 'Hinten', 'Atrás', 'Retro', 'Hátul');
add(
  'Wrap design controls',
  'Comenzi pentru designul colantării',
  'Bedienelemente für das Foliendesign',
  'Controles de diseño del vinilo',
  'Comandi per il design del wrapping',
  'Fóliaterv vezérlői',
);
add(
  'MAKE IT PERSONAL',
  'PERSONALIZEAZĂ',
  'MACH ES PERSÖNLICH',
  'HAZLO PERSONAL',
  'RENDILO PERSONALE',
  'TEDD EGYEDIVÉ',
);
add(
  'Reset',
  'Resetează',
  'Zurücksetzen',
  'Restablecer',
  'Ripristina',
  'Visszaállítás',
);
add(
  'A finish like no other.',
  'Un finisaj fără egal.',
  'Ein Finish wie kein anderes.',
  'Un acabado incomparable.',
  'Una finitura senza paragoni.',
  'Egyedülálló felület.',
);
add(
  'Choose a surface',
  'Alege o suprafață',
  'Fläche wählen',
  'Elige una superficie',
  'Scegli una superficie',
  'Válassz felületet',
);
add(
  'One panel. Or a whole new identity.',
  'Un panou. Sau o identitate complet nouă.',
  'Eine Fläche. Oder eine ganz neue Identität.',
  'Un panel. O una identidad completamente nueva.',
  "Un pannello. O un'identità completamente nuova.",
  'Egy panel. Vagy egy teljesen új megjelenés.',
);
add(
  'Wrap colors',
  'Culorile foliei',
  'Folienfarben',
  'Colores del vinilo',
  'Colori del wrapping',
  'Fóliaszínek',
);
add(
  'Find your own shade',
  'Găsește nuanța ta',
  'Finde deinen Farbton',
  'Encuentra tu tono',
  'Trova la tua tonalità',
  'Találd meg a saját árnyalatod',
);
add(
  'Choose a custom wrap color',
  'Alege o culoare personalizată',
  'Individuelle Folienfarbe wählen',
  'Elige un color personalizado',
  'Scegli un colore personalizzato',
  'Egyedi fóliaszín kiválasztása',
);
add(
  'Choose a finish',
  'Alege un finisaj',
  'Finish wählen',
  'Elige un acabado',
  'Scegli una finitura',
  'Válassz felületet',
);
add(
  'Wrap finish',
  'Finisajul foliei',
  'Folienfinish',
  'Acabado del vinilo',
  'Finitura del wrapping',
  'Fólia felülete',
);
add('Gloss', 'Lucios', 'Glänzend', 'Brillante', 'Lucido', 'Fényes');
add('Satin', 'Satinat', 'Seidenmatt', 'Satinado', 'Satinato', 'Szatén');
add('Matte', 'Mat', 'Matt', 'Mate', 'Opaco', 'Matt');
add(
  'Apply color to all painted panels',
  'Aplică culoarea pe toate panourile vopsite',
  'Farbe auf alle lackierten Flächen anwenden',
  'Aplicar color a todos los paneles pintados',
  'Applica il colore a tutti i pannelli verniciati',
  'Szín alkalmazása minden fényezett panelre',
);
add(
  'Your selection',
  'Selecția ta',
  'Deine Auswahl',
  'Tu selección',
  'La tua selezione',
  'A választásod',
);
add(
  'Bring this design to life',
  'Dă viață acestui design',
  'Dieses Design verwirklichen',
  'Haz realidad este diseño',
  'Dai vita a questo design',
  'Keltsd életre a terved',
);
add(
  'Share design ↗',
  'Distribuie designul ↗',
  'Design teilen ↗',
  'Compartir diseño ↗',
  'Condividi design ↗',
  'Terv megosztása ↗',
);
add(
  'VISUAL CONCEPT',
  'CONCEPT VIZUAL',
  'VISUELLES KONZEPT',
  'CONCEPTO VISUAL',
  'CONCETTO VISIVO',
  'LÁTVÁNYTERV',
);
add(
  'Licensed real vehicle models.',
  'Modele reale de vehicule, licențiate.',
  'Lizenzierte reale Fahrzeugmodelle.',
  'Modelos reales de vehículos con licencia.',
  'Modelli reali di veicoli con licenza.',
  'Licencelt, valós járműmodellek.',
);
add(
  'All authors, licenses & modifications',
  'Toți autorii, licențele și modificările',
  'Alle Autoren, Lizenzen und Änderungen',
  'Todos los autores, licencias y modificaciones',
  'Tutti gli autori, le licenze e le modifiche',
  'Összes szerző, licenc és módosítás',
);
add(
  '. Panel regions and vinyl colors are approximate.',
  '. Zonele panourilor și culorile foliei sunt aproximative.',
  '. Flächenbereiche und Folienfarben sind Näherungswerte.',
  '. Las zonas y los colores del vinilo son aproximados.',
  '. Le aree dei pannelli e i colori sono approssimativi.',
  '. A panelterületek és a fólia színei közelítőek.',
);
add(
  "Don't see your car?",
  'Nu îți găsești mașina?',
  'Dein Auto ist nicht dabei?',
  '¿No ves tu coche?',
  'Non trovi la tua auto?',
  'Nem találod az autódat?',
);
add(
  'AUTOMOTIVE INDIVIDUALITY',
  'INDIVIDUALITATE AUTO',
  'AUTOMOBILE INDIVIDUALITÄT',
  'INDIVIDUALIDAD AUTOMOTRIZ',
  'INDIVIDUALITÀ AUTOMOBILISTICA',
  'AUTÓS EGYÉNISÉG',
);
add(
  'Your car.',
  'Mașina ta.',
  'Dein Auto.',
  'Tu coche.',
  'La tua auto.',
  'Az autód.',
);
add('Your', 'A ta', 'Deine', 'Tu', 'La tua', 'A te');
add('signature.', 'semnătură.', 'Signatur.', 'firma.', 'firma.', 'kézjegyed.');
add(
  'EST. FOR THE EXTRAORDINARY',
  'CREAT PENTRU EXTRAORDINAR',
  'GESCHAFFEN FÜR DAS AUSSERGEWÖHNLICHE',
  'CREADO PARA LO EXTRAORDINARIO',
  "CREATO PER L'ECCEZIONALE",
  'A RENDKÍVÜLIÉRT',
);
add(
  'Not another car on the road.',
  'Nu încă o mașină pe șosea.',
  'Nicht einfach nur ein weiteres Auto.',
  'No es otro coche más.',
  "Non un'auto come le altre.",
  'Nem csak egy újabb autó az úton.',
);
add(
  'A reflection of you. Precision wrapping,',
  'O reflexie a ta. Colantare precisă,',
  'Ein Spiegelbild deiner Persönlichkeit. Präzise Folierung,',
  'Un reflejo de ti. Vinilado de precisión,',
  'Un riflesso di te. Wrapping di precisione,',
  'A személyiséged tükre. Precíz fóliázás,',
);
add(
  'without compromise.',
  'fără compromisuri.',
  'ohne Kompromisse.',
  'sin concesiones.',
  'senza compromessi.',
  'kompromisszumok nélkül.',
);
add(
  'Make it yours',
  'Fă-l al tău',
  'Mach es zu deinem',
  'Hazlo tuyo',
  'Rendila tua',
  'Tedd a magadévá',
);
add(
  'Vehicle brands',
  'Mărci de vehicule',
  'Fahrzeugmarken',
  'Marcas de vehículos',
  'Marche di veicoli',
  'Járműmárkák',
);
add(
  'EVERY MARQUE.',
  'ORICE MARCĂ.',
  'JEDE MARKE.',
  'CUALQUIER MARCA.',
  'OGNI MARCA.',
  'BÁRMELY MÁRKA.',
);
add(
  'ONE STANDARD.',
  'UN SINGUR STANDARD.',
  'EIN STANDARD.',
  'UN SOLO ESTÁNDAR.',
  'UN SOLO STANDARD.',
  'EGYETLEN MÉRCE.',
);
add(
  '02 / THE CRAFT',
  '02 / MĂIESTRIA',
  '02 / DAS HANDWERK',
  '02 / EL OFICIO',
  "02 / L'ARTE",
  '02 / A MESTERSÉG',
);
add(
  'Details make',
  'Detaliile fac',
  'Details machen',
  'Los detalles marcan',
  'I dettagli fanno',
  'A részletek adják',
);
add('the', '', 'den', 'la', 'la', 'a');
add(
  'difference.',
  'diferența.',
  'Unterschied.',
  'diferencia.',
  'differenza.',
  'különbséget.',
);
add(
  'Beauty is in the finish.',
  'Frumusețea stă în finisaj.',
  'Schönheit liegt im Finish.',
  'La belleza está en el acabado.',
  'La bellezza è nella finitura.',
  'A szépség a felületben rejlik.',
);
add(
  'Excellence is in everything underneath.',
  'Excelența, în tot ce se află dedesubt.',
  'Exzellenz in allem darunter.',
  'La excelencia, en todo lo que hay debajo.',
  "L'eccellenza è in tutto ciò che sta sotto.",
  'A kiválóság pedig mindenben, ami alatta van.',
);
add(
  'Color change wraps',
  'Colantare pentru schimbarea culorii',
  'Farbwechsel-Folierungen',
  'Vinilos de cambio de color',
  'Wrapping cambio colore',
  'Színváltó fóliázás',
);
add(
  'A complete transformation. Carefully fitted vinyl, considered colors, and an identity that is unmistakably yours.',
  'O transformare completă. Folie aplicată cu grijă, culori alese atent și o identitate inconfundabilă.',
  'Eine vollständige Verwandlung. Sorgfältig angebrachte Folie, ausgewählte Farben und eine unverwechselbare Identität.',
  'Una transformación completa. Vinilo aplicado con cuidado, colores elegidos y una identidad inconfundiblemente tuya.',
  "Una trasformazione completa. Pellicola applicata con cura, colori selezionati e un'identità inconfondibilmente tua.",
  'Teljes átalakulás. Gondosan felhelyezett fólia, átgondolt színek és összetéveszthetetlen egyéniség.',
);
add(
  'Explore your color',
  'Explorează culoarea ta',
  'Entdecke deine Farbe',
  'Explora tu color',
  'Esplora il tuo colore',
  'Fedezd fel a színed',
);
add(
  'Paint protection film',
  'Folie de protecție a vopselei',
  'Lackschutzfolie',
  'Lámina de protección de pintura',
  'Pellicola protettiva per vernice',
  'Fényezésvédő fólia',
);
add(
  'Protection, without distraction. Clear, matte stealth or colored film, designed to help preserve the paint you love.',
  'Protecție discretă. Folie transparentă, mată (stealth) sau colorată, creată pentru a păstra vopseaua pe care o iubești.',
  'Schutz ohne Ablenkung. Transparente, matte Stealth- oder farbige Folie, die deinen Lack bewahrt.',
  'Protección sin distracciones. Lámina transparente, mate (stealth) o de color, diseñada para conservar la pintura que te encanta.',
  'Protezione discreta. Pellicola trasparente, opaca stealth o colorata, pensata per preservare la vernice che ami.',
  'Védelem feltűnés nélkül. Átlátszó, matt (stealth) vagy színes fólia, amely segít megőrizni a szeretett fényezést.',
);
add(
  'Protect your investment',
  'Protejează-ți investiția',
  'Schütze deine Investition',
  'Protege tu inversión',
  'Proteggi il tuo investimento',
  'Védd a befektetésed',
);
add(
  'Bespoke details',
  'Detalii personalizate',
  'Individuelle Details',
  'Detalles a medida',
  'Dettagli su misura',
  'Egyedi részletek',
);
add(
  'Roof accents. Mirror caps. Contrasting panels. Sometimes the smallest change makes the boldest statement.',
  'Accente pe plafon. Carcase de oglinzi. Panouri contrastante. Uneori cea mai mică schimbare are cel mai mare impact.',
  'Dachakzente. Spiegelkappen. Kontrastierende Flächen. Manchmal setzt die kleinste Änderung das stärkste Zeichen.',
  'Acentos en el techo. Carcasas de espejos. Paneles de contraste. A veces el cambio más pequeño causa el mayor impacto.',
  'Accenti sul tetto. Calotte degli specchietti. Pannelli a contrasto. A volte il cambiamento più piccolo è il più audace.',
  'Tetőhangsúlyok. Tükörburkolatok. Kontrasztos panelek. Néha a legkisebb változás a legmerészebb.',
);
add(
  'Consider the details',
  'Descoperă detaliile',
  'Entdecke die Details',
  'Descubre los detalles',
  'Scopri i dettagli',
  'Fedezd fel a részleteket',
);
add(
  '03 / SIGNATURE PALETTES',
  '03 / PALETELE SEMNĂTURĂ',
  '03 / SIGNATUR-PALETTEN',
  '03 / PALETAS DISTINTIVAS',
  '03 / PALETTE ESCLUSIVE',
  '03 / JELLEGZETES PALETTÁK',
);
add(
  'Quietly',
  'Discret, dar',
  'Leise',
  'Discretamente',
  'Discretamente',
  'Visszafogottan',
);
add('bold.', 'îndrăzneț.', 'mutig.', 'atrevido.', 'audace.', 'merész.');
add(
  'Unmistakably you.',
  'Inconfundabil al tău.',
  'Unverkennbar du.',
  'Inconfundiblemente tú.',
  'Inconfondibilmente tua.',
  'Összetéveszthetetlenül te.',
);
add(
  'A few directions. Endless possibilities.',
  'Câteva direcții. Posibilități infinite.',
  'Ein paar Richtungen. Endlose Möglichkeiten.',
  'Algunas ideas. Infinitas posibilidades.',
  'Alcune direzioni. Infinite possibilità.',
  'Néhány irány. Végtelen lehetőség.',
);
add(
  'Load a palette and make it your own.',
  'Încarcă o paletă și personalizeaz-o.',
  'Lade eine Palette und mach sie zu deiner.',
  'Carga una paleta y hazla tuya.',
  'Carica una palette e rendila tua.',
  'Tölts be egy palettát, és formáld a sajátodra.',
);
add(
  '01 / GLOSS',
  '01 / LUCIOS',
  '01 / GLÄNZEND',
  '01 / BRILLANTE',
  '01 / LUCIDO',
  '01 / FÉNYES',
);
add(
  '02 / MATTE',
  '02 / MAT',
  '02 / MATT',
  '02 / MATE',
  '02 / OPACO',
  '02 / MATT',
);
add(
  '03 / SATIN',
  '03 / SATINAT',
  '03 / SEIDENMATT',
  '03 / SATINADO',
  '03 / SATINATO',
  '03 / SZATÉN',
);
add(
  'The Monochrome',
  'Monocrom',
  'Monochrom',
  'Monocromo',
  'Monocromatico',
  'Monokróm',
);
add(
  'Bone white. Piano black.',
  'Alb os. Negru pian.',
  'Knochenweiß. Klavierschwarz.',
  'Blanco hueso. Negro piano.',
  'Bianco osso. Nero pianoforte.',
  'Csontfehér. Zongorafekete.',
);
add(
  'After Hours',
  'După program',
  'Nachts',
  'Después de horas',
  'Dopo le ore',
  'Zárás után',
);
add(
  'Deep black. Subtle presence.',
  'Negru profund. Prezență discretă.',
  'Tiefschwarz. Dezente Präsenz.',
  'Negro intenso. Presencia sutil.',
  'Nero intenso. Presenza discreta.',
  'Mélyfekete. Visszafogott jelenlét.',
);
add(
  'British Reserve',
  'Eleganță britanică',
  'Britische Zurückhaltung',
  'Reserva británica',
  'Eleganza britannica',
  'Brit elegancia',
);
add(
  'Racing green. Champagne accents.',
  'Verde racing. Accente șampanie.',
  'Racing Green. Champagnerfarbene Akzente.',
  'Verde carreras. Acentos champán.',
  'Verde racing. Accenti champagne.',
  'Versenyzöld. Pezsgőszínű hangsúlyok.',
);
add(
  'A CONSIDERED PROCESS',
  'UN PROCES ATENT GÂNDIT',
  'EIN DURCHDACHTER PROZESS',
  'UN PROCESO CUIDADO',
  'UN PROCESSO PONDERATO',
  'ÁTGONDOLT FOLYAMAT',
);
add(
  'From a thought.',
  'De la un gând.',
  'Von einem Gedanken.',
  'De una idea.',
  "Da un'idea.",
  'Egy gondolatból.',
);
add('To a', 'La o', 'Zu einem', 'A una', 'A una', 'Egy');
add(
  'statement.',
  'afirmație.',
  'Statement.',
  'declaración.',
  'dichiarazione.',
  'egyedi megjelenés.',
);
add(
  'Imagine it',
  'Imaginează-ți',
  'Stell es dir vor',
  'Imagínalo',
  'Immaginala',
  'Képzeld el',
);
add(
  'Explore your vehicle, palette, and finish in our design studio.',
  'Explorează vehiculul, paleta și finisajul în studioul nostru de design.',
  'Erkunde dein Fahrzeug, deine Palette und dein Finish in unserem Designstudio.',
  'Explora tu vehículo, paleta y acabado en nuestro estudio de diseño.',
  'Esplora il veicolo, la palette e la finitura nel nostro studio di design.',
  'Fedezd fel a járművet, a palettát és a felületet designstúdiónkban.',
);
add(
  'Make it precise',
  'Definește detaliile',
  'Mach es präzise',
  'Define los detalles',
  'Definisci i dettagli',
  'Pontosítsd',
);
add(
  'Discuss your vehicle and compare physical material samples before deciding.',
  'Discută despre vehicul și compară mostre fizice de material înainte de a decide.',
  'Besprich dein Fahrzeug und vergleiche echte Materialmuster, bevor du dich entscheidest.',
  'Habla de tu vehículo y compara muestras físicas antes de decidir.',
  'Parla del tuo veicolo e confronta campioni fisici prima di decidere.',
  'Beszéld át a járművet, és a döntés előtt hasonlítsd össze a valódi anyagmintákat.',
);
add(
  'Make it yours',
  'Fă-l al tău',
  'Mach es zu deinem',
  'Hazlo tuyo',
  'Rendila tua',
  'Tedd a magadévá',
);
add(
  'Agree the scope, preparation, and installation details with the studio.',
  'Stabilește cu studioul amploarea, pregătirea și detaliile instalării.',
  'Stimme Umfang, Vorbereitung und Details der Anbringung mit dem Studio ab.',
  'Acuerda con el estudio el alcance, la preparación y la instalación.',
  "Concorda con lo studio l'ambito, la preparazione e i dettagli dell'applicazione.",
  'Egyeztesd a műhellyel a munka körét, az előkészítést és a kivitelezés részleteit.',
);
add(
  'GOOD TO KNOW',
  'BINE DE ȘTIUT',
  'GUT ZU WISSEN',
  'BUENO SABERLO',
  'UTILE DA SAPERE',
  'JÓ TUDNI',
);
add('A little', 'Puțină', 'Etwas', 'Un poco de', 'Un po’ di', 'Egy kis');
add(
  'clarity.',
  'claritate.',
  'Klarheit.',
  'claridad.',
  'chiarezza.',
  'világosság.',
);
add(
  'Can I configure my exact car model?',
  'Pot configura modelul exact al mașinii mele?',
  'Kann ich mein genaues Automodell konfigurieren?',
  '¿Puedo configurar el modelo exacto de mi coche?',
  'Posso configurare il modello esatto della mia auto?',
  'Beállíthatom a pontos autómodellemet?',
);
add(
  "Choose a brand, then a model, or search the available catalog. Every listed vehicle has a real 3D model; there are no placeholder cars. Luxury and performance marques appear first. Panel colors use approximate spatial regions, not exact manufacturer boundaries. A roadster's rear deck replaces the roof selection. If your vehicle is not listed, include its make, model, and year in your brief.",
  'Alege marca și modelul sau caută în catalog. Fiecare vehicul afișat are un model 3D real; nu există mașini provizorii. Mărcile de lux și performanță apar primele. Culorile panourilor folosesc regiuni aproximative, nu limitele exacte ale producătorului. La un roadster, zona din spate înlocuiește plafonul. Dacă vehiculul tău nu este listat, include marca, modelul și anul în fișă.',
  'Wähle Marke und Modell oder durchsuche den Katalog. Jedes Fahrzeug hat ein echtes 3D-Modell; es gibt keine Platzhalter. Luxus- und Performance-Marken stehen zuerst. Die Farbflächen sind räumliche Näherungen und entsprechen nicht exakt den Herstellergrenzen. Bei Roadstern ersetzt das Heckdeck das Dach. Falls dein Fahrzeug fehlt, nenne Marke, Modell und Baujahr im Briefing.',
  'Elige una marca y un modelo o busca en el catálogo. Cada vehículo tiene un modelo 3D real; no hay coches de relleno. Las marcas de lujo y altas prestaciones aparecen primero. Los colores usan zonas aproximadas, no límites exactos del fabricante. En un roadster, la cubierta trasera sustituye al techo. Si tu vehículo no aparece, incluye marca, modelo y año en tu ficha.',
  'Scegli una marca e un modello o cerca nel catalogo. Ogni veicolo elencato ha un modello 3D reale, senza auto segnaposto. I marchi di lusso e sportivi appaiono per primi. I colori usano aree approssimative, non i confini esatti del produttore. In una roadster il cofano posteriore sostituisce il tetto. Se il veicolo non è presente, indica marca, modello e anno nel riepilogo.',
  'Válassz márkát és modellt, vagy keress a katalógusban. Minden felsorolt jármű valódi 3D modellel rendelkezik; nincsenek helyettesítő autók. A luxus- és sportmárkák szerepelnek elöl. A panelszínek közelítő térbeli területeket használnak, nem a gyártó pontos határait. Roadster esetén a hátsó fedél helyettesíti a tetőt. Ha járműved nem szerepel, add meg a márkát, a modellt és az évjáratot az összefoglalóban.',
);
add(
  'Will my wrap look exactly like the preview?',
  'Colantarea va arăta exact ca în previzualizare?',
  'Sieht meine Folierung genau wie in der Vorschau aus?',
  '¿Mi vinilo se verá exactamente como en la vista previa?',
  "Il wrapping sarà identico all'anteprima?",
  'Pontosan úgy néz majd ki a fóliázás, mint az előnézetben?',
);
add(
  'The preview helps you explore a direction. Screens, lighting, and different vinyl materials affect color and finish. Always confirm your selection using physical samples before installation.',
  'Previzualizarea te ajută să explorezi o direcție. Ecranele, lumina și materialele influențează culoarea și finisajul. Confirmă întotdeauna alegerea cu mostre fizice înainte de instalare.',
  'Die Vorschau hilft bei der Orientierung. Bildschirm, Licht und Folienmaterial beeinflussen Farbe und Finish. Bestätige deine Auswahl vor der Anbringung immer anhand echter Muster.',
  'La vista previa te ayuda a explorar una idea. Las pantallas, la iluminación y los materiales afectan al color y al acabado. Confirma siempre tu elección con muestras físicas antes de la instalación.',
  "L'anteprima ti aiuta a esplorare una direzione. Schermi, illuminazione e materiali influenzano colore e finitura. Conferma sempre la scelta con campioni fisici prima dell'applicazione.",
  'Az előnézet segít az irány kiválasztásában. A képernyő, a fény és a fólia anyaga befolyásolja a színt és a felületet. A kivitelezés előtt mindig erősítsd meg választásod valódi mintákkal.',
);
add(
  'Can I wrap only selected parts?',
  'Pot colanta doar anumite părți?',
  'Kann ich nur ausgewählte Teile folieren?',
  '¿Puedo vinilar solo algunas partes?',
  'Posso rivestire solo alcune parti?',
  'Csak bizonyos részeket is fóliáztathatok?',
);
add(
  'Yes. Experiment with the hood, roof, mirrors, body, wheels, and accents independently in the studio. Wheel colors are styling references; discuss the appropriate refinishing method separately. The actual scope and suitability are confirmed during consultation.',
  'Da. Experimentează separat cu capota, plafonul, oglinzile, caroseria, roțile și accentele. Culorile roților sunt orientative; discută separat metoda de finisare potrivită. Amploarea și potrivirea se confirmă în timpul consultării.',
  'Ja. Experimentiere im Studio unabhängig mit Haube, Dach, Spiegeln, Karosserie, Rädern und Akzenten. Radfarben dienen als Stilreferenz; besprich die passende Aufbereitung separat. Umfang und Eignung werden bei der Beratung geklärt.',
  'Sí. Experimenta por separado con capó, techo, espejos, carrocería, ruedas y detalles. Los colores de las ruedas son referencias de estilo; consulta por separado el método adecuado. El alcance y la viabilidad se confirman durante la consulta.',
  'Sì. Sperimenta separatamente con cofano, tetto, specchietti, carrozzeria, ruote e dettagli. I colori delle ruote sono riferimenti stilistici; discuti separatamente il metodo di finitura appropriato. Ambito e fattibilità si confermano durante la consulenza.',
  'Igen. A stúdióban külön-külön próbálhatod ki a motorháztetőt, tetőt, tükröket, karosszériát, kerekeket és hangsúlyokat. A kerékszínek stílusreferenciák; a megfelelő felújítási módot külön egyeztesd. A munka körét és alkalmasságát a konzultáció során erősítik meg.',
);
add(
  'Which services do you offer?',
  'Ce servicii oferiți?',
  'Welche Leistungen bietet ihr an?',
  '¿Qué servicios ofrece el estudio?',
  'Quali servizi offrite?',
  'Milyen szolgáltatásokat kínáltok?',
);
add(
  'Color change wraps, paint protection film, chrome delete, and bespoke details such as contrasting roofs, mirror caps, and accents. Chrome delete blacks out chrome trims, window surrounds, grilles, and badges in gloss, satin, or matte black, or in a color of your choice.',
  'Colantare pentru schimbarea culorii, folie de protecție a vopselei, chrome delete și detalii personalizate, precum plafoane contrastante, carcase de oglinzi și accente. Chrome delete acoperă ornamentele cromate, ramele geamurilor, grilele și emblemele în negru lucios, satinat sau mat, ori într-o culoare la alegere.',
  'Farbwechsel-Folierungen, Lackschutzfolie, Chrome Delete und individuelle Details wie kontrastierende Dächer, Spiegelkappen und Akzente. Beim Chrome Delete werden Chromleisten, Fensterrahmen, Grills und Embleme in glänzendem, seidenmattem oder mattem Schwarz oder in einer Wunschfarbe foliert.',
  'Vinilos de cambio de color, lámina de protección de pintura, eliminación de cromados y detalles a medida, como techos en contraste, carcasas de espejos y acentos. La eliminación de cromados oscurece molduras, marcos de ventanas, parrillas y emblemas en negro brillante, satinado o mate, o en el color que elijas.',
  "Wrapping cambio colore, pellicola protettiva per vernice, oscuramento cromature e dettagli su misura come tetti a contrasto, calotte degli specchietti e accenti. L'oscuramento cromature riveste modanature, cornici dei finestrini, griglie e loghi in nero lucido, satinato od opaco, o in un colore a scelta.",
  'Színváltó fóliázás, fényezésvédő fólia, krómelemek sötétítése és egyedi részletek, például kontrasztos tető, tükörburkolatok és hangsúlyok. Krómsötétítéskor a krómcsíkokat, ablakkereteket, hűtőrácsokat és emblémákat fényes, szatén vagy matt feketével, illetve választott színnel fóliázzuk.',
);
add(
  'Is paint protection film only clear?',
  'Folia de protecție a vopselei este doar transparentă?',
  'Gibt es Lackschutzfolie nur transparent?',
  '¿La lámina de protección de pintura solo es transparente?',
  'La pellicola protettiva è solo trasparente?',
  'Csak átlátszó fényezésvédő fólia létezik?',
);
add(
  'No. Besides invisible clear film, PPF is available in a matte stealth version that gives gloss paint a satin-matte look, and in colored or tinted versions that protect and restyle the car at the same time. Available shades are confirmed with physical samples.',
  'Nu. Pe lângă folia transparentă invizibilă, PPF este disponibil și în varianta mată (stealth), care oferă vopselei lucioase un aspect satinat-mat, precum și în variante colorate sau nuanțate, care protejează și schimbă aspectul mașinii în același timp. Nuanțele disponibile se confirmă pe mostre fizice.',
  'Nein. Neben unsichtbarer transparenter Folie gibt es PPF auch als matte Stealth-Variante, die glänzendem Lack einen seidenmatten Look verleiht, sowie in farbigen oder getönten Varianten, die das Auto gleichzeitig schützen und neu gestalten. Verfügbare Farbtöne werden anhand echter Muster bestätigt.',
  'No. Además de la lámina transparente invisible, el PPF existe en versión mate (stealth), que da a la pintura brillante un aspecto satinado mate, y en versiones de color o tintadas que protegen y transforman el coche a la vez. Los tonos disponibles se confirman con muestras físicas.',
  "No. Oltre alla pellicola trasparente invisibile, il PPF è disponibile in versione opaca stealth, che dona alla vernice lucida un aspetto satinato, e in versioni colorate o fumé che proteggono e rinnovano l'auto allo stesso tempo. Le tonalità disponibili si confermano con campioni fisici.",
  'Nem. A láthatatlan, átlátszó fólia mellett a PPF matt (stealth) változatban is elérhető, amely a fényes fényezésnek szatén-matt hatást ad, valamint színes vagy színezett változatban, amely egyszerre véd és ad új megjelenést az autónak. Az elérhető árnyalatokat valódi mintákkal erősítjük meg.',
);
add(
  'How do I get a quote or book an installation?',
  'Cum obțin o ofertă sau programez instalarea?',
  'Wie erhalte ich ein Angebot oder buche einen Termin?',
  '¿Cómo solicito un presupuesto o reservo una instalación?',
  "Come richiedo un preventivo o prenoto l'applicazione?",
  'Hogyan kérhetek árajánlatot vagy foglalhatok időpontot?',
);
add(
  'Send a request from the consultation form. It opens WhatsApp with your vehicle and design details prefilled, so you only need to press Send. You can also message us directly on WhatsApp or download a brief. Pricing is confirmed directly with the studio.',
  'Trimite o solicitare din formularul de consultare. Se deschide WhatsApp cu detaliile vehiculului și ale designului deja completate, așa că trebuie doar să apeși Trimite. Ne poți scrie și direct pe WhatsApp sau poți descărca o fișă. Prețul se confirmă direct cu studioul.',
  'Sende eine Anfrage über das Beratungsformular. Es öffnet WhatsApp mit deinen Fahrzeug- und Designdetails, du musst nur noch auf Senden tippen. Du kannst uns auch direkt auf WhatsApp schreiben oder ein Briefing herunterladen. Preise werden direkt mit dem Studio bestätigt.',
  'Envía una solicitud desde el formulario de consulta. Se abre WhatsApp con los datos de tu vehículo y tu diseño ya escritos, así que solo tienes que pulsar Enviar. También puedes escribirnos directamente por WhatsApp o descargar una ficha. El precio se confirma directamente con el estudio.',
  'Invia una richiesta dal modulo di consulenza. Si apre WhatsApp con i dati del veicolo e del design già compilati: devi solo premere Invia. Puoi anche scriverci direttamente su WhatsApp o scaricare un riepilogo. I prezzi vengono confermati direttamente dallo studio.',
  'Küldj kérést a konzultációs űrlapon. Megnyílik a WhatsApp a járműved és a terved adataival kitöltve, csak a Küldés gombot kell megnyomnod. Írhatsz nekünk közvetlenül WhatsAppon is, vagy letölthetsz egy összefoglalót. Az árat közvetlenül a stúdió erősíti meg.',
);
add(
  '04 / YOUR NEXT CHAPTER',
  '04 / URMĂTORUL CAPITOL',
  '04 / DEIN NÄCHSTES KAPITEL',
  '04 / TU PRÓXIMO CAPÍTULO',
  '04 / IL TUO PROSSIMO CAPITOLO',
  '04 / A KÖVETKEZŐ FEJEZET',
);
add(
  'Some cars turn heads.',
  'Unele mașini atrag priviri.',
  'Manche Autos ziehen Blicke auf sich.',
  'Algunos coches atraen miradas.',
  'Alcune auto attirano gli sguardi.',
  'Egyes autók után megfordulnak.',
);
add(
  'Yours should stay in them.',
  'A ta ar trebui să rămână în memorie.',
  'Deines sollte in Erinnerung bleiben.',
  'El tuyo debería permanecer en la memoria.',
  'La tua dovrebbe restare impressa.',
  'A tied maradjon is emlékezetes.',
);
add(
  "Let's create something exceptional",
  'Să creăm ceva excepțional',
  'Lass uns etwas Besonderes schaffen',
  'Creemos algo excepcional',
  'Creiamo qualcosa di eccezionale',
  'Alkossunk valami kivételeset',
);
add(
  'Find the business on Google Maps ↗',
  'Găsește firma pe Google Maps ↗',
  'Unternehmen auf Google Maps finden ↗',
  'Encuentra el negocio en Google Maps ↗',
  "Trova l'attività su Google Maps ↗",
  'Vállalkozás keresése a Google Mapsen ↗',
);
add(
  'Leave a Google review ↗',
  'Lasă o recenzie pe Google ↗',
  'Google-Bewertung hinterlassen ↗',
  'Deja una reseña en Google ↗',
  'Lascia una recensione su Google ↗',
  'Google-értékelés írása ↗',
);
add(
  'Individuality. In every detail.',
  'Individualitate. În fiecare detaliu.',
  'Individualität. In jedem Detail.',
  'Individualidad. En cada detalle.',
  'Individualità. In ogni dettaglio.',
  'Egyéniség. Minden részletben.',
);
add(
  'YOUR VISION STARTS HERE',
  'VIZIUNEA TA ÎNCEPE AICI',
  'DEINE VISION BEGINNT HIER',
  'TU VISIÓN COMIENZA AQUÍ',
  'LA TUA VISIONE INIZIA QUI',
  'ITT KEZDŐDIK AZ ÖTLETED',
);
add(
  'Close consultation form',
  'Închide formularul de consultare',
  'Beratungsformular schließen',
  'Cerrar formulario de consulta',
  'Chiudi il modulo di consulenza',
  'Konzultációs űrlap bezárása',
);
add(
  "Let's make it",
  'Să-l facem',
  'Mach es zu',
  'Hagámoslo',
  'Rendila',
  'Tegyük',
);
add('yours.', 'al tău.', 'deinem.', 'tuyo.', 'tua.', 'a tiéddé.');
add(
  'Send your vehicle and design to the studio. We reply on WhatsApp or by email.',
  'Trimite studioului vehiculul și designul tău. Îți răspundem pe WhatsApp sau prin e-mail.',
  'Sende dein Fahrzeug und dein Design an das Studio. Wir antworten per WhatsApp oder E-Mail.',
  'Envía tu vehículo y tu diseño al estudio. Te respondemos por WhatsApp o por correo.',
  'Invia allo studio il tuo veicolo e il tuo design. Rispondiamo su WhatsApp o via email.',
  'Küldd el a stúdiónak a járműved és a terved. WhatsAppon vagy e-mailben válaszolunk.',
);
add(
  'Prefer to chat?',
  'Preferi să discutăm?',
  'Lieber direkt chatten?',
  '¿Prefieres chatear?',
  'Preferisci chattare?',
  'Inkább csevegnél?',
);
add(
  'Your name',
  'Numele tău',
  'Dein Name',
  'Tu nombre',
  'Il tuo nome',
  'Neved',
);
add(
  'Full name',
  'Nume complet',
  'Vollständiger Name',
  'Nombre completo',
  'Nome completo',
  'Teljes név',
);
add('Email', 'E-mail', 'E-Mail', 'Correo electrónico', 'Email', 'E-mail');
add(
  'Your vehicle',
  'Vehiculul tău',
  'Dein Fahrzeug',
  'Tu vehículo',
  'Il tuo veicolo',
  'Járműved',
);
add(
  'Make, model, year',
  'Marcă, model, an',
  'Marke, Modell, Baujahr',
  'Marca, modelo, año',
  'Marca, modello, anno',
  'Márka, modell, évjárat',
);
add(
  'Phone (optional)',
  'Telefon (opțional)',
  'Telefon (optional)',
  'Teléfono (opcional)',
  'Telefono (facoltativo)',
  'Telefon (nem kötelező)',
);
add(
  'Services you are interested in',
  'Serviciile care te interesează',
  'Gewünschte Leistungen',
  'Servicios que te interesan',
  'Servizi che ti interessano',
  'Szolgáltatások, amelyek érdekelnek',
);
add(
  'What do you have in mind?',
  'Ce ai în minte?',
  'Was hast du vor?',
  '¿Qué tienes en mente?',
  'Cosa hai in mente?',
  'Mire gondoltál?',
);
add(
  'Tell us about your car, the desired scope, or a material you love.',
  'Spune-ne despre mașină, lucrările dorite sau un material preferat.',
  'Erzähle uns von deinem Auto, dem gewünschten Umfang oder einem Lieblingsmaterial.',
  'Cuéntanos sobre tu coche, el alcance deseado o un material que te guste.',
  "Parlaci della tua auto, dell'intervento desiderato o di un materiale che ami.",
  'Mesélj az autódról, a kívánt munkáról vagy egy kedvelt anyagról.',
);
add(
  'Your request is emailed to the studio through FormSubmit, and WhatsApp opens with the same message. Just press Send there. A request is not a booking or a confirmed quote.',
  'Solicitarea este trimisă studioului prin e-mail, prin FormSubmit, iar WhatsApp se deschide cu același mesaj. Apasă doar Trimite. O solicitare nu reprezintă o rezervare sau o ofertă confirmată.',
  'Deine Anfrage wird über FormSubmit per E-Mail an das Studio gesendet, und WhatsApp öffnet sich mit derselben Nachricht. Tippe dort nur auf Senden. Eine Anfrage ist keine Buchung und kein bestätigtes Angebot.',
  'Tu solicitud se envía al estudio por correo a través de FormSubmit y WhatsApp se abre con el mismo mensaje. Solo pulsa Enviar. Una solicitud no es una reserva ni un presupuesto confirmado.',
  'La richiesta viene inviata allo studio via email tramite FormSubmit e WhatsApp si apre con lo stesso messaggio. Premi solo Invia. Una richiesta non è una prenotazione né un preventivo confermato.',
  'A kérésedet a FormSubmit e-mailben továbbítja a stúdiónak, a WhatsApp pedig ugyanazzal az üzenettel nyílik meg. Ott csak nyomd meg a Küldés gombot. A kérés nem foglalás és nem megerősített árajánlat.',
);
add(
  'WhatsApp opens with your request prefilled. Just press Send there to deliver it. A request is not a booking or a confirmed quote.',
  'WhatsApp se deschide cu solicitarea deja completată. Apasă doar Trimite pentru a o expedia. O solicitare nu reprezintă o rezervare sau o ofertă confirmată.',
  'WhatsApp öffnet sich mit deiner vorausgefüllten Anfrage. Tippe dort nur auf Senden. Eine Anfrage ist keine Buchung und kein bestätigtes Angebot.',
  'WhatsApp se abre con tu solicitud ya escrita. Solo pulsa Enviar para mandarla. Una solicitud no es una reserva ni un presupuesto confirmado.',
  'WhatsApp si apre con la richiesta già compilata. Premi solo Invia per inoltrarla. Una richiesta non è una prenotazione né un preventivo confermato.',
  'A WhatsApp előre kitöltött kéréssel nyílik meg. Ott csak nyomd meg a Küldés gombot. A kérés nem foglalás és nem megerősített árajánlat.',
);
add(
  'Send request',
  'Trimite solicitarea',
  'Anfrage senden',
  'Enviar solicitud',
  'Invia richiesta',
  'Kérés küldése',
);
add(
  'Download a brief instead',
  'Sau descarcă o fișă',
  'Stattdessen Briefing herunterladen',
  'O descarga una ficha',
  'Oppure scarica un riepilogo',
  'Vagy tölts le összefoglalót',
);
add(
  'Your request is on its way.',
  'Solicitarea ta a fost trimisă.',
  'Deine Anfrage ist unterwegs.',
  'Tu solicitud está en camino.',
  'La tua richiesta è stata inviata.',
  'A kérésed úton van.',
);
add(
  'Almost done.',
  'Aproape gata.',
  'Fast geschafft.',
  'Casi listo.',
  'Quasi fatto.',
  'Majdnem kész.',
);
add(
  'WhatsApp opens with your request prefilled. Press Send there to deliver it to {number}.',
  'WhatsApp se deschide cu solicitarea deja completată. Apasă Trimite pentru a o expedia la {number}.',
  'WhatsApp öffnet sich mit deiner vorausgefüllten Anfrage. Tippe auf Senden, um sie an {number} zu schicken.',
  'WhatsApp se abre con tu solicitud ya escrita. Pulsa Enviar para mandarla al {number}.',
  'WhatsApp si apre con la richiesta già compilata. Premi Invia per inoltrarla al {number}.',
  'A WhatsApp előre kitöltött kéréssel nyílik meg. Nyomd meg a Küldés gombot, hogy elküldd a {number} számra.',
);
add(
  'A copy of your request was emailed to the studio.',
  'O copie a solicitării a fost trimisă studioului prin e-mail.',
  'Eine Kopie deiner Anfrage wurde per E-Mail an das Studio gesendet.',
  'Se ha enviado una copia de tu solicitud al estudio por correo.',
  'Una copia della richiesta è stata inviata allo studio via email.',
  'A kérésed másolatát e-mailben elküldtük a stúdiónak.',
);
add(
  'The email could not be sent ({error}). Your WhatsApp message and the downloadable brief still include every detail.',
  'E-mailul nu a putut fi trimis ({error}). Mesajul WhatsApp și fișa descărcabilă conțin în continuare toate detaliile.',
  'Die E-Mail konnte nicht gesendet werden ({error}). Deine WhatsApp-Nachricht und das herunterladbare Briefing enthalten trotzdem alle Details.',
  'No se pudo enviar el correo ({error}). Tu mensaje de WhatsApp y la ficha descargable siguen incluyendo todos los detalles.',
  "Non è stato possibile inviare l'email ({error}). Il messaggio WhatsApp e il riepilogo scaricabile contengono comunque tutti i dettagli.",
  'Az e-mailt nem sikerült elküldeni ({error}). A WhatsApp-üzenet és a letölthető összefoglaló így is minden részletet tartalmaz.',
);
add(
  'Open WhatsApp',
  'Deschide WhatsApp',
  'WhatsApp öffnen',
  'Abrir WhatsApp',
  'Apri WhatsApp',
  'WhatsApp megnyitása',
);
add(
  'Download brief',
  'Descarcă fișa',
  'Briefing herunterladen',
  'Descargar ficha',
  'Scarica il riepilogo',
  'Összefoglaló letöltése',
);
add(
  'Edit your request',
  'Editează solicitarea',
  'Anfrage bearbeiten',
  'Editar solicitud',
  'Modifica la richiesta',
  'Kérés szerkesztése',
);
add(
  'Your design link',
  'Linkul designului tău',
  'Dein Design-Link',
  'El enlace de tu diseño',
  'Il link del tuo design',
  'A terved hivatkozása',
);
add(
  'Close share link',
  'Închide linkul de distribuire',
  'Freigabelink schließen',
  'Cerrar enlace para compartir',
  'Chiudi link di condivisione',
  'Megosztási hivatkozás bezárása',
);
add(
  'Copy this link to reopen the same car, panel colors, and finish.',
  'Copiază linkul pentru a redeschide aceeași mașină, culori și finisaj.',
  'Kopiere diesen Link, um dasselbe Auto, dieselben Farben und dasselbe Finish erneut zu öffnen.',
  'Copia este enlace para volver a abrir el mismo coche, colores y acabado.',
  'Copia questo link per riaprire la stessa auto, gli stessi colori e la stessa finitura.',
  'Másold a hivatkozást ugyanazon autó, panelszínek és felület újbóli megnyitásához.',
);
add(
  'Design URL',
  'Linkul designului',
  'Design-URL',
  'URL del diseño',
  'URL del design',
  'Terv URL-címe',
);
add(
  'Copy link ↗',
  'Copiază linkul ↗',
  'Link kopieren ↗',
  'Copiar enlace ↗',
  'Copia link ↗',
  'Hivatkozás másolása ↗',
);

add(
  'Elite Custom Wrap — Premium car wrapping, PPF & chrome delete',
  'Elite Custom Wrap — Colantare auto premium, folie PPF și chrome delete',
  'Elite Custom Wrap — Premium-Autofolierung, Lackschutzfolie & Chrome Delete',
  'Elite Custom Wrap — Vinilado de coches premium, PPF y chrome delete',
  'Elite Custom Wrap — Car wrapping premium, PPF e chrome delete',
  'Elite Custom Wrap — Prémium autófóliázás, PPF és chrome delete',
);
add(
  'Premium car wrapping, colour change wraps, clear and coloured PPF and chrome delete. Design your wrap in our live 3D configurator with 500+ real films.',
  'Colantare auto premium, schimbare de culoare, folie PPF transparentă sau colorată și chrome delete. Creează-ți designul în configuratorul 3D cu peste 500 de folii reale.',
  'Premium-Autofolierung, Farbwechsel, transparente und farbige Lackschutzfolie sowie Chrome Delete. Gestalte deine Folierung im 3D-Konfigurator mit über 500 echten Folien.',
  'Vinilado de coches premium, cambio de color, PPF transparente o de color y chrome delete. Diseña tu vinilado en nuestro configurador 3D con más de 500 vinilos reales.',
  'Car wrapping premium, cambio colore, PPF trasparente o colorato e chrome delete. Progetta il tuo wrap nel configuratore 3D con oltre 500 pellicole reali.',
  'Prémium autófóliázás, színváltás, átlátszó és színes PPF fényezésvédő fólia, chrome delete. Tervezd meg a fóliázást 3D konfigurátorunkban több mint 500 valódi fóliával.',
);
add(
  'PREMIUM CAR WRAPPING & PPF',
  'COLANTARE AUTO PREMIUM & PPF',
  'PREMIUM-AUTOFOLIERUNG & PPF',
  'VINILADO PREMIUM & PPF',
  'CAR WRAPPING PREMIUM & PPF',
  'PRÉMIUM AUTÓFÓLIÁZÁS & PPF',
);
add(
  'Body',
  'Caroserie',
  'Karosserie',
  'Carrocería',
  'Carrozzeria',
  'Karosszéria',
);
add('Hood', 'Capotă', 'Motorhaube', 'Capó', 'Cofano', 'Motorháztető');
add(
  'Roof / rear deck',
  'Plafon / zona din spate',
  'Dach / Heckdeck',
  'Techo / cubierta trasera',
  'Tetto / cofano posteriore',
  'Tető / hátsó fedél',
);
add('Mirrors', 'Oglinzi', 'Spiegel', 'Espejos', 'Specchietti', 'Tükrök');
add('Wheels', 'Roți', 'Räder', 'Ruedas', 'Ruote', 'Kerekek');
add('Accents', 'Accente', 'Akzente', 'Detalles', 'Dettagli', 'Hangsúlyok');
add(
  'Bone white',
  'Alb os',
  'Knochenweiß',
  'Blanco hueso',
  'Bianco osso',
  'Csontfehér',
);
add(
  'Piano black',
  'Negru pian',
  'Klavierschwarz',
  'Negro piano',
  'Nero pianoforte',
  'Zongorafekete',
);
add('Graphite', 'Grafit', 'Graphit', 'Grafito', 'Grafite', 'Grafit');
add('Champagne', 'Șampanie', 'Champagner', 'Champán', 'Champagne', 'Pezsgő');
add(
  'Racing green',
  'Verde racing',
  'Racing Green',
  'Verde carreras',
  'Verde racing',
  'Versenyzöld',
);
add(
  'Midnight blue',
  'Albastru miezul nopții',
  'Mitternachtsblau',
  'Azul medianoche',
  'Blu notte',
  'Éjkék',
);
add('Burgundy', 'Burgund', 'Bordeauxrot', 'Burdeos', 'Bordeaux', 'Bordó');
add(
  'Arctic silver',
  'Argintiu arctic',
  'Arktissilber',
  'Plata ártica',
  'Argento artico',
  'Sarkvidéki ezüst',
);
add(
  'Pearl cream',
  'Crem perlat',
  'Perlcreme',
  'Crema perla',
  'Crema perlato',
  'Gyöngyházkrém',
);
add(
  'Burnt copper',
  'Cupru ars',
  'Gebranntes Kupfer',
  'Cobre tostado',
  'Rame bruciato',
  'Égetett réz',
);
add(
  'Signal red',
  'Roșu intens',
  'Signalrot',
  'Rojo señal',
  'Rosso segnale',
  'Jelzővörös',
);
add(
  'Slate blue',
  'Albastru ardezie',
  'Schieferblau',
  'Azul pizarra',
  'Blu ardesia',
  'Palakék',
);
add('Olive', 'Măsliniu', 'Oliv', 'Oliva', 'Oliva', 'Olívazöld');
add(
  'Dusty rose',
  'Roz prăfuit',
  'Altrosa',
  'Rosa empolvado',
  'Rosa antico',
  'Púderrózsaszín',
);
add(
  'Custom {hex}',
  'Personalizat {hex}',
  'Individuell {hex}',
  'Personalizado {hex}',
  'Personalizzato {hex}',
  'Egyedi {hex}',
);
add(
  'Luxury saloon',
  'Berlină de lux',
  'Luxuslimousine',
  'Berlina de lujo',
  'Berlina di lusso',
  'Luxuslimuzin',
);
add(
  'Hybrid hypercar',
  'Hipercar hibrid',
  'Hybrid-Hypercar',
  'Hiperdeportivo híbrido',
  'Hypercar ibrida',
  'Hibrid hiperautó',
);
add(
  'GT racing car',
  'Mașină de curse GT',
  'GT-Rennwagen',
  'Coche de carreras GT',
  'Auto da corsa GT',
  'GT-versenyautó',
);
add(
  'Open-top supercar',
  'Supercar decapotabil',
  'Offener Supersportwagen',
  'Superdeportivo descapotable',
  'Supercar scoperta',
  'Nyitott szupersportautó',
);
add(
  'Custom supercar',
  'Supercar personalizat',
  'Individueller Supersportwagen',
  'Superdeportivo personalizado',
  'Supercar personalizzata',
  'Egyedi szupersportautó',
);
add(
  'Supercar',
  'Supercar',
  'Supersportwagen',
  'Superdeportivo',
  'Supercar',
  'Szupersportautó',
);
add('SUV', 'SUV', 'SUV', 'SUV', 'SUV', 'SUV');
add(
  'Luxury SUV',
  'SUV de lux',
  'Luxus-SUV',
  'SUV de lujo',
  'SUV di lusso',
  'Luxus SUV',
);
add(
  'Family hatchback',
  'Hatchback de familie',
  'Familien-Kompaktwagen',
  'Compacto familiar',
  'Berlina compatta per la famiglia',
  'Családi ferdehátú',
);
add('Estate', 'Break', 'Kombi', 'Familiar', 'Station wagon', 'Kombi');
add('Saloon', 'Berlină', 'Limousine', 'Berlina', 'Berlina', 'Szedán');
add(
  'Off-roader',
  'Off-road',
  'Geländewagen',
  'Todoterreno',
  'Fuoristrada',
  'Terepjáró',
);
add(
  'Compact SUV',
  'SUV compact',
  'Kompakt-SUV',
  'SUV compacto',
  'SUV compatto',
  'Kompakt SUV',
);
add(
  'Electric SUV',
  'SUV electric',
  'Elektro-SUV',
  'SUV eléctrico',
  'SUV elettrico',
  'Elektromos SUV',
);
add(
  'Grand tourer',
  'Grand tourer',
  'Gran Turismo',
  'Gran turismo',
  'Gran turismo',
  'Gran turismo',
);
add(
  'Hypercar',
  'Hipercar',
  'Hypercar',
  'Hiperdeportivo',
  'Hypercar',
  'Hiperautó',
);
add('Pickup', 'Pickup', 'Pick-up', 'Pick-up', 'Pick-up', 'Pickup');
add('MPV', 'Monovolum', 'Van', 'Monovolumen', 'Monovolume', 'Egyterű');
add(
  'City car',
  'Mașină de oraș',
  'Kleinstwagen',
  'Urbano',
  'Citycar',
  'Városi autó',
);
add(
  'Sports saloon',
  'Berlină sport',
  'Sportlimousine',
  'Berlina deportiva',
  'Berlina sportiva',
  'Sportszedán',
);
add(
  'Performance estate',
  'Break de performanță',
  'Performance-Kombi',
  'Familiar de altas prestaciones',
  'Station wagon ad alte prestazioni',
  'Sportkombi',
);
add(
  'Electric hatchback',
  'Hatchback electric',
  'Elektro-Kompaktwagen',
  'Compacto eléctrico',
  'Compatta elettrica',
  'Elektromos ferdehátú',
);
add(
  'Luxury coupe',
  'Coupé de lux',
  'Luxus-Coupé',
  'Coupé de lujo',
  'Coupé di lusso',
  'Luxus kupé',
);
add(
  'Sports car',
  'Mașină sport',
  'Sportwagen',
  'Deportivo',
  'Auto sportiva',
  'Sportautó',
);
add(
  'Compact saloon',
  'Berlină compactă',
  'Kompaktlimousine',
  'Berlina compacta',
  'Berlina compatta',
  'Kompakt szedán',
);
add(
  'Luxury roadster',
  'Roadster de lux',
  'Luxus-Roadster',
  'Roadster de lujo',
  'Roadster di lusso',
  'Luxus roadster',
);
add(
  'Track-focused coupe',
  'Coupé pentru circuit',
  'Streckenorientiertes Coupé',
  'Coupé para circuito',
  'Coupé da pista',
  'Pályára tervezett kupé',
);
add(
  'Sports coupe',
  'Coupé sport',
  'Sportcoupé',
  'Coupé deportivo',
  'Coupé sportiva',
  'Sportkupé',
);
add(
  'Classic sports coupe',
  'Coupé sport clasic',
  'Klassisches Sportcoupé',
  'Coupé deportivo clásico',
  'Coupé sportiva classica',
  'Klasszikus sportkupé',
);
add(
  'Historic racing car',
  'Mașină de curse istorică',
  'Historischer Rennwagen',
  'Coche de carreras histórico',
  'Auto da corsa storica',
  'Történelmi versenyautó',
);
add(
  'Performance coupe',
  'Coupé de performanță',
  'Performance-Coupé',
  'Coupé de altas prestaciones',
  'Coupé ad alte prestazioni',
  'Nagy teljesítményű kupé',
);
add(
  'Mid-engine sports coupe',
  'Coupé sport cu motor central',
  'Sportcoupé mit Mittelmotor',
  'Coupé deportivo con motor central',
  'Coupé sportiva a motore centrale',
  'Középmotoros sportkupé',
);
add(
  'Electric saloon',
  'Berlină electrică',
  'Elektrolimousine',
  'Berlina eléctrica',
  'Berlina elettrica',
  'Elektromos limuzin',
);
add(
  'Muscle coupe',
  'Coupé muscle',
  'Muscle-Coupé',
  'Coupé musculoso',
  'Coupé muscle',
  'Izomautó kupé',
);
add(
  'Performance pickup',
  'Pickup de performanță',
  'Performance-Pickup',
  'Pickup de altas prestaciones',
  'Pickup ad alte prestazioni',
  'Nagy teljesítményű pickup',
);
add(
  'Custom performance hatchback',
  'Hatchback sport personalizat',
  'Individueller Performance-Kompaktwagen',
  'Compacto deportivo personalizado',
  'Berlina sportiva personalizzata',
  'Egyedi sportos ferdehátú',
);
add(
  'Classic hatchback',
  'Hatchback clasic',
  'Klassischer Kompaktwagen',
  'Compacto clásico',
  'Berlina compatta classica',
  'Klasszikus ferdehátú',
);
add(
  'Wrap preview',
  'Previzualizare colantare',
  'Folierungsvorschau',
  'Vista previa del vinilo',
  'Anteprima wrapping',
  'Fóliázás előnézete',
);
add(
  '{vehicle} 3D wrap concept. Drag to rotate or use the view buttons. Selected panel: {part}.',
  'Concept 3D de colantare pentru {vehicle}. Trage pentru a roti sau folosește butoanele de vizualizare. Panou selectat: {part}.',
  '3D-Folierungskonzept für {vehicle}. Zum Drehen ziehen oder Ansichtstasten verwenden. Gewählte Fläche: {part}.',
  'Concepto 3D de vinilo para {vehicle}. Arrastra para girar o usa los botones de vista. Panel seleccionado: {part}.',
  'Progetto wrapping 3D per {vehicle}. Trascina per ruotare o usa i pulsanti di vista. Pannello selezionato: {part}.',
  '{vehicle} 3D fóliaterve. Forgasd húzással vagy a nézetgombokkal. Kiválasztott panel: {part}.',
);
add(
  '{part} — not available on this model',
  '{part} — indisponibil pentru acest model',
  '{part} — bei diesem Modell nicht verfügbar',
  '{part} — no disponible en este modelo',
  '{part} — non disponibile su questo modello',
  '{part} — ezen a modellen nem érhető el',
);
add(
  '{vehicle} (current)',
  '{vehicle} (curent)',
  '{vehicle} (aktuell)',
  '{vehicle} (actual)',
  '{vehicle} (attuale)',
  '{vehicle} (jelenlegi)',
);
add(
  '{count} matching vehicles',
  '{count} vehicule găsite',
  '{count} passende Fahrzeuge',
  '{count} vehículos encontrados',
  '{count} veicoli trovati',
  '{count} találat',
);
add(
  '{count} matching vehicle',
  '{count} vehicul găsit',
  '{count} passendes Fahrzeug',
  '{count} vehículo encontrado',
  '{count} veicolo trovato',
  '{count} találat',
);
add(
  '{models} models / {brands} brands · Luxury first',
  '{models} modele / {brands} mărci · Luxul pe primul loc',
  '{models} Modelle / {brands} Marken · Luxus zuerst',
  '{models} modelos / {brands} marcas · Lujo primero',
  '{models} modelli / {brands} marchi · Lusso prima',
  '{models} modell / {brands} márka · Luxus elöl',
);
add(
  'Choose {brand} models',
  'Alege modelele {brand}',
  '{brand}-Modelle wählen',
  'Elegir modelos {brand}',
  'Scegli modelli {brand}',
  '{brand} modellek kiválasztása',
);
add(
  'This surface is not available on the selected model.',
  'Această suprafață nu este disponibilă pentru modelul selectat.',
  'Diese Fläche ist beim gewählten Modell nicht verfügbar.',
  'Esta superficie no está disponible en el modelo elegido.',
  'Questa superficie non è disponibile sul modello selezionato.',
  'Ez a felület nem érhető el a kiválasztott modellen.',
);
add(
  'Please choose a valid six-digit color.',
  'Alege o culoare validă cu șase caractere.',
  'Bitte wähle eine gültige sechsstellige Farbe.',
  'Elige un color válido de seis dígitos.',
  'Scegli un colore valido a sei cifre.',
  'Válassz érvényes, hatjegyű színt.',
);
add(
  'This design link is incomplete or invalid. The default design has been loaded.',
  'Linkul designului este incomplet sau invalid. A fost încărcat designul implicit.',
  'Dieser Design-Link ist unvollständig oder ungültig. Das Standarddesign wurde geladen.',
  'El enlace está incompleto o no es válido. Se ha cargado el diseño predeterminado.',
  'Il link è incompleto o non valido. È stato caricato il design predefinito.',
  'A terv hivatkozása hiányos vagy érvénytelen. Az alapértelmezett terv töltődött be.',
);
add(
  'Local saving is unavailable ({error}). You can still share or download your design.',
  'Salvarea locală nu este disponibilă ({error}). Poți distribui sau descărca designul.',
  'Lokales Speichern ist nicht verfügbar ({error}). Du kannst dein Design weiterhin teilen oder herunterladen.',
  'El guardado local no está disponible ({error}). Aún puedes compartir o descargar tu diseño.',
  'Il salvataggio locale non è disponibile ({error}). Puoi condividere o scaricare il design.',
  'A helyi mentés nem érhető el ({error}). A tervet továbbra is megoszthatod vagy letöltheted.',
);
add(
  'The saved design could not be read ({error}). Starting a new design.',
  'Designul salvat nu a putut fi citit ({error}). Începem un design nou.',
  'Das gespeicherte Design konnte nicht gelesen werden ({error}). Ein neues Design wird begonnen.',
  'No se pudo leer el diseño guardado ({error}). Se inicia uno nuevo.',
  'Impossibile leggere il design salvato ({error}). Si avvia un nuovo design.',
  'A mentett terv nem olvasható ({error}). Új terv indul.',
);
add(
  'The saved design is not compatible. Starting a new design.',
  'Designul salvat nu este compatibil. Începem un design nou.',
  'Das gespeicherte Design ist nicht kompatibel. Ein neues Design wird begonnen.',
  'El diseño guardado no es compatible. Se inicia uno nuevo.',
  'Il design salvato non è compatibile. Si avvia un nuovo design.',
  'A mentett terv nem kompatibilis. Új terv indul.',
);
add(
  'Your browser cannot save this design ({error}). Use Share design to keep it.',
  'Browserul nu poate salva designul ({error}). Folosește distribuirea pentru a-l păstra.',
  'Dein Browser kann dieses Design nicht speichern ({error}). Teile es, um es zu behalten.',
  'Tu navegador no puede guardar el diseño ({error}). Compártelo para conservarlo.',
  'Il browser non può salvare il design ({error}). Condividilo per conservarlo.',
  'A böngésző nem tudja menteni a tervet ({error}). Megőrzéséhez oszd meg.',
);
add(
  'Your design has been reset to the signature palette.',
  'Designul a fost resetat la paleta semnătură.',
  'Dein Design wurde auf die Signatur-Palette zurückgesetzt.',
  'Tu diseño se ha restablecido a la paleta distintiva.',
  'Il design è stato ripristinato alla palette esclusiva.',
  'A terv visszaállt az alap palettára.',
);
add(
  'Your preview is ready to download.',
  'Previzualizarea este gata de descărcare.',
  'Deine Vorschau ist zum Herunterladen bereit.',
  'Tu vista previa está lista para descargar.',
  "L'anteprima è pronta per il download.",
  'Az előnézet letölthető.',
);
add(
  'Preview export is unavailable ({error}). You can still download a consultation brief.',
  'Exportul previzualizării nu este disponibil ({error}). Poți descărca fișa de consultare.',
  'Der Vorschau-Export ist nicht verfügbar ({error}). Das Beratungsbriefing kannst du weiterhin herunterladen.',
  'La exportación no está disponible ({error}). Aún puedes descargar una ficha de consulta.',
  "L'esportazione non è disponibile ({error}). Puoi comunque scaricare il riepilogo.",
  'Az előnézet exportálása nem érhető el ({error}). A konzultációs összefoglaló továbbra is letölthető.',
);
add(
  'Select and copy the design link. Clipboard access needs HTTPS or localhost.',
  'Selectează și copiază linkul. Accesul la clipboard necesită HTTPS sau localhost.',
  'Wähle und kopiere den Design-Link. Die Zwischenablage benötigt HTTPS oder localhost.',
  'Selecciona y copia el enlace. El portapapeles requiere HTTPS o localhost.',
  'Seleziona e copia il link. Gli appunti richiedono HTTPS o localhost.',
  'Jelöld ki és másold a hivatkozást. A vágólaphoz HTTPS vagy localhost szükséges.',
);
add(
  'Design link copied. Every color and your selected vehicle are included.',
  'Linkul a fost copiat. Include toate culorile și vehiculul selectat.',
  'Design-Link kopiert. Alle Farben und das gewählte Fahrzeug sind enthalten.',
  'Enlace copiado. Incluye todos los colores y el vehículo elegido.',
  'Link copiato. Include tutti i colori e il veicolo selezionato.',
  'A terv hivatkozása másolva. Tartalmazza az összes színt és a kiválasztott járművet.',
);
add(
  'Clipboard access was blocked ({error}). Copy the selected link manually.',
  'Accesul la clipboard a fost blocat ({error}). Copiază manual linkul selectat.',
  'Der Zugriff auf die Zwischenablage wurde blockiert ({error}). Kopiere den markierten Link manuell.',
  'Se bloqueó el acceso al portapapeles ({error}). Copia el enlace seleccionado manualmente.',
  "L'accesso agli appunti è stato bloccato ({error}). Copia il link selezionato manualmente.",
  'A vágólap hozzáférése blokkolva van ({error}). Másold kézzel a kijelölt hivatkozást.',
);
add(
  'Signature palette loaded. Make it your own.',
  'Paleta semnătură a fost încărcată. Personalizeaz-o.',
  'Signatur-Palette geladen. Mach sie zu deiner.',
  'Paleta distintiva cargada. Hazla tuya.',
  'Palette esclusiva caricata. Rendila tua.',
  'A jellegzetes paletta betöltve. Formáld a sajátodra.',
);
add(
  'LOADING REAL VEHICLE',
  'SE ÎNCARCĂ VEHICULUL REAL',
  'ECHTES FAHRZEUG WIRD GELADEN',
  'CARGANDO VEHÍCULO REAL',
  'CARICAMENTO VEICOLO REALE',
  'VALÓDI JÁRMŰ BETÖLTÉSE',
);
add(
  'Preparing the detailed 3D model...',
  'Se pregătește modelul 3D detaliat...',
  'Das detaillierte 3D-Modell wird vorbereitet...',
  'Preparando el modelo 3D detallado...',
  'Preparazione del modello 3D dettagliato...',
  'A részletes 3D modell előkészítése...',
);
add(
  '{percentage}% downloaded',
  '{percentage}% descărcat',
  '{percentage}% heruntergeladen',
  '{percentage}% descargado',
  '{percentage}% scaricato',
  '{percentage}% letöltve',
);
add(
  '{vehicle} (add model year)',
  '{vehicle} (adaugă anul fabricației)',
  '{vehicle} (Baujahr ergänzen)',
  '{vehicle} (añade el año)',
  '{vehicle} (aggiungi anno)',
  '{vehicle} (add meg az évjáratot)',
);
add(
  'Color change wrap',
  'Colantare pentru schimbarea culorii',
  'Farbwechsel-Folierung',
  'Vinilo de cambio de color',
  'Wrapping cambio colore',
  'Színváltó fóliázás',
);
add(
  '{vehicle} · {finish} finish · Body: {body} · Roof / rear deck: {roof}',
  '{vehicle} · finisaj {finish} · Caroserie: {body} · Plafon / zona din spate: {roof}',
  '{vehicle} · Finish: {finish} · Karosserie: {body} · Dach / Heckdeck: {roof}',
  '{vehicle} · acabado {finish} · Carrocería: {body} · Techo / cubierta trasera: {roof}',
  '{vehicle} · finitura {finish} · Carrozzeria: {body} · Tetto / cofano posteriore: {roof}',
  '{vehicle} · felület: {finish} · Karosszéria: {body} · Tető / hátsó fedél: {roof}',
);
add(
  'ELITE CUSTOM WRAP / CONSULTATION BRIEF',
  'ELITE CUSTOM WRAP / FIȘĂ DE CONSULTARE',
  'ELITE CUSTOM WRAP / BERATUNGSBRIEFING',
  'ELITE CUSTOM WRAP / FICHA DE CONSULTA',
  'ELITE CUSTOM WRAP / RIEPILOGO CONSULENZA',
  'ELITE CUSTOM WRAP / KONZULTÁCIÓS ÖSSZEFOGLALÓ',
);
add('Created', 'Creat', 'Erstellt', 'Creado', 'Creato', 'Létrehozva');
add('Name', 'Nume', 'Name', 'Nombre', 'Nome', 'Név');
add(
  'Actual vehicle',
  'Vehiculul propriu',
  'Tatsächliches Fahrzeug',
  'Vehículo real',
  'Veicolo effettivo',
  'Tényleges jármű',
);
add(
  'Preview vehicle',
  'Vehiculul din previzualizare',
  'Fahrzeug in der Vorschau',
  'Vehículo de vista previa',
  "Veicolo dell'anteprima",
  'Előnézeti jármű',
);
add('Finish', 'Finisaj', 'Finish', 'Acabado', 'Finitura', 'Felület');
add(
  'Project notes:',
  'Note despre proiect:',
  'Projektnotizen:',
  'Notas del proyecto:',
  'Note sul progetto:',
  'Projektmegjegyzések:',
);
add(
  'No additional notes.',
  'Fără note suplimentare.',
  'Keine zusätzlichen Notizen.',
  'Sin notas adicionales.',
  'Nessuna nota aggiuntiva.',
  'Nincs további megjegyzés.',
);
add(
  'Reopen design:',
  'Redeschide designul:',
  'Design erneut öffnen:',
  'Volver a abrir el diseño:',
  'Riapri il design:',
  'Terv újbóli megnyitása:',
);
add(
  'This is a visual concept, not a confirmed booking or quote.',
  'Acesta este un concept vizual, nu o rezervare sau ofertă confirmată.',
  'Dies ist ein visuelles Konzept, keine bestätigte Buchung oder ein Angebot.',
  'Este es un concepto visual, no una reserva ni un presupuesto confirmado.',
  'Questo è un concetto visivo, non una prenotazione o un preventivo confermato.',
  'Ez látványterv, nem megerősített foglalás vagy árajánlat.',
);
add(
  'Actual vinyl colors, bodywork, and suitability must be confirmed with physical samples.',
  'Culorile reale ale foliei, caroseria și potrivirea trebuie confirmate cu mostre fizice.',
  'Folienfarben, Karosserie und Eignung müssen anhand echter Muster bestätigt werden.',
  'Los colores reales del vinilo, la carrocería y la idoneidad deben confirmarse con muestras físicas.',
  'Colori reali, carrozzeria e idoneità devono essere confermati con campioni fisici.',
  'A fólia tényleges színét, a karosszériát és az alkalmasságot valódi mintákkal kell megerősíteni.',
);
add(
  'Wheel color is a styling reference; discuss the appropriate refinishing method.',
  'Culoarea roților este orientativă; discută metoda potrivită de finisare.',
  'Die Radfarbe ist eine Stilreferenz; besprich die geeignete Aufbereitung.',
  'El color de las ruedas es una referencia de estilo; consulta el método adecuado.',
  'Il colore delle ruote è un riferimento stilistico; discuti il metodo di finitura appropriato.',
  'A kerék színe stílusreferencia; egyeztesd a megfelelő felújítási módot.',
);
add(
  'Chrome delete',
  'Chrome delete',
  'Chrome Delete',
  'Eliminación de cromados',
  'Oscuramento cromature',
  'Krómelemek sötétítése',
);
add(
  'Chrome trims, window surrounds, grilles and badges, blacked out in gloss, satin or matte black, or in any color you choose.',
  'Ornamente cromate, rame de geamuri, grile și embleme, acoperite în negru lucios, satinat sau mat, ori în orice culoare alegi.',
  'Chromleisten, Fensterrahmen, Grills und Embleme, foliert in glänzendem, seidenmattem oder mattem Schwarz oder in einer Farbe deiner Wahl.',
  'Molduras cromadas, marcos de ventanas, parrillas y emblemas, oscurecidos en negro brillante, satinado o mate, o en el color que elijas.',
  'Modanature cromate, cornici dei finestrini, griglie e loghi, oscurati in nero lucido, satinato od opaco, o nel colore che preferisci.',
  'Krómcsíkok, ablakkeretek, hűtőrácsok és emblémák fényes, szatén vagy matt feketében, vagy bármilyen választott színben.',
);
add(
  'Black out the chrome',
  'Înnegrește cromul',
  'Chrom abdunkeln',
  'Oscurece el cromo',
  'Oscura le cromature',
  'Sötétítsd el a krómot',
);
add(
  'Message us on WhatsApp',
  'Scrie-ne pe WhatsApp',
  'Schreib uns auf WhatsApp',
  'Escríbenos por WhatsApp',
  'Scrivici su WhatsApp',
  'Írj nekünk WhatsAppon',
);
add(
  'Chat on WhatsApp',
  'Discută pe WhatsApp',
  'Auf WhatsApp chatten',
  'Chatea por WhatsApp',
  'Chatta su WhatsApp',
  'Csevegj WhatsAppon',
);
add(
  'Chat with us on WhatsApp (opens in a new tab)',
  'Scrie-ne pe WhatsApp (se deschide într-o filă nouă)',
  'Schreib uns auf WhatsApp (öffnet in einem neuen Tab)',
  'Escríbenos por WhatsApp (se abre en una pestaña nueva)',
  'Scrivici su WhatsApp (si apre in una nuova scheda)',
  'Írj nekünk WhatsAppon (új lapon nyílik meg)',
);
add(
  'Hide WhatsApp button',
  'Ascunde butonul WhatsApp',
  'WhatsApp-Schaltfläche ausblenden',
  'Ocultar el botón de WhatsApp',
  'Nascondi il pulsante WhatsApp',
  'WhatsApp gomb elrejtése',
);
add(
  "Hello Elite Custom Wrap! I'd like to ask about wrapping my car.",
  'Bună, Elite Custom Wrap! Aș dori informații despre colantarea mașinii mele.',
  'Hallo Elite Custom Wrap! Ich hätte eine Frage zur Folierung meines Autos.',
  '¡Hola, Elite Custom Wrap! Me gustaría informarme sobre el vinilado de mi coche.',
  'Ciao Elite Custom Wrap! Vorrei informazioni sul wrapping della mia auto.',
  'Szia, Elite Custom Wrap! Az autóm fóliázásáról szeretnék érdeklődni.',
);
add(
  "Hello Elite Custom Wrap! I'd like a consultation for my car.",
  'Bună, Elite Custom Wrap! Aș dori o consultanță pentru mașina mea.',
  'Hallo Elite Custom Wrap! Ich hätte gern eine Beratung für mein Auto.',
  '¡Hola, Elite Custom Wrap! Me gustaría una consulta para mi coche.',
  'Ciao Elite Custom Wrap! Vorrei una consulenza per la mia auto.',
  'Szia, Elite Custom Wrap! Konzultációt szeretnék kérni az autómhoz.',
);
add('Phone', 'Telefon', 'Telefon', 'Teléfono', 'Telefono', 'Telefon');
add(
  'Services',
  'Servicii',
  'Leistungen',
  'Servicios',
  'Servizi',
  'Szolgáltatások',
);
add(
  'Not specified',
  'Nespecificat',
  'Nicht angegeben',
  'Sin especificar',
  'Non specificato',
  'Nincs megadva',
);
add(
  'Project notes',
  'Note despre proiect',
  'Projektnotizen',
  'Notas del proyecto',
  'Note sul progetto',
  'Projektmegjegyzések',
);
add(
  'Design link',
  'Linkul designului',
  'Design-Link',
  'Enlace del diseño',
  'Link del design',
  'Terv hivatkozása',
);
add(
  'New wrap request from {name}',
  'Solicitare nouă de colantare de la {name}',
  'Neue Folierungsanfrage von {name}',
  'Nueva solicitud de vinilado de {name}',
  'Nuova richiesta di wrapping da {name}',
  'Új fóliázási kérés tőle: {name}',
);
add(
  'Please enter your name.',
  'Introdu numele tău.',
  'Bitte gib deinen Namen ein.',
  'Introduce tu nombre.',
  'Inserisci il tuo nome.',
  'Add meg a neved.',
);
add(
  'Please enter a valid email address.',
  'Introdu o adresă de e-mail validă.',
  'Bitte gib eine gültige E-Mail-Adresse ein.',
  'Introduce un correo electrónico válido.',
  'Inserisci un indirizzo email valido.',
  'Adj meg érvényes e-mail-címet.',
);
add(
  'Please enter a valid phone number, or leave it empty.',
  'Introdu un număr de telefon valid sau lasă câmpul gol.',
  'Bitte gib eine gültige Telefonnummer ein oder lass das Feld leer.',
  'Introduce un teléfono válido o deja el campo vacío.',
  'Inserisci un numero di telefono valido o lascia il campo vuoto.',
  'Adj meg érvényes telefonszámot, vagy hagyd üresen.',
);
add(
  'Please describe your vehicle.',
  'Descrie vehiculul tău.',
  'Bitte beschreibe dein Fahrzeug.',
  'Describe tu vehículo.',
  'Descrivi il tuo veicolo.',
  'Írd le a járműved.',
);
add(
  'Your consultation brief has been downloaded.',
  'Fișa de consultare a fost descărcată.',
  'Dein Beratungsbriefing wurde heruntergeladen.',
  'Se ha descargado tu ficha de consulta.',
  'Il riepilogo per la consulenza è stato scaricato.',
  'A konzultációs összefoglaló letöltődött.',
);
add(
  'Website crafted by New Folder Solutions',
  'Site realizat de New Folder Solutions',
  'Website gestaltet von New Folder Solutions',
  'Sitio web creado por New Folder Solutions',
  'Sito realizzato da New Folder Solutions',
  'A weboldalt a New Folder Solutions készítette',
);
add(
  'BEHIND THIS WEBSITE',
  'CINE A CREAT ACEST SITE',
  'HINTER DIESER WEBSITE',
  'DETRÁS DE ESTA WEB',
  'DIETRO QUESTO SITO',
  'A WEBOLDAL MÖGÖTT',
);
add(
  'Close website credit',
  'Închide informațiile despre creatorul site-ului',
  'Hinweis zur Website schließen',
  'Cerrar los créditos del sitio web',
  'Chiudi i crediti del sito',
  'Készítői információ bezárása',
);
add(
  'Want a website like',
  'Îți dorești un site ca',
  'Möchtest du eine Website wie',
  '¿Quieres una web como',
  'Vuoi un sito come',
  'Szeretnél egy ilyen',
);
add('this?', 'acesta?', 'diese?', 'esta?', 'questo?', 'weboldalt?');
add(
  'New Folder Solutions builds premium websites and web apps. Get in touch.',
  'New Folder Solutions realizează site-uri și aplicații web premium. Ia legătura cu echipa.',
  'New Folder Solutions entwickelt Premium-Websites und Web-Apps. Nimm Kontakt auf.',
  'New Folder Solutions crea sitios web y aplicaciones web premium. Ponte en contacto.',
  'New Folder Solutions realizza siti e web app premium. Mettiti in contatto.',
  'A New Folder Solutions prémium weboldalakat és webalkalmazásokat készít. Vedd fel velük a kapcsolatot.',
);
add(
  'Visit New Folder Solutions',
  'Vizitează New Folder Solutions',
  'New Folder Solutions besuchen',
  'Visitar New Folder Solutions',
  'Visita New Folder Solutions',
  'Irány a New Folder Solutions',
);
add(
  'Did you find your car on the site?',
  'Ai găsit mașina ta pe site?',
  'Hast du dein Auto auf der Website gefunden?',
  '¿Has encontrado tu coche en la web?',
  'Hai trovato la tua auto sul sito?',
  'Megtaláltad az autódat az oldalon?',
);
add(
  'Yes, this is my car',
  'Da, aceasta este mașina mea',
  'Ja, das ist mein Auto',
  'Sí, este es mi coche',
  'Sì, è la mia auto',
  'Igen, ez az én autóm',
);
add(
  'No, my car is different',
  'Nu, mașina mea este alta',
  'Nein, mein Auto ist ein anderes',
  'No, mi coche es otro',
  'No, la mia auto è diversa',
  'Nem, nekem másik autóm van',
);
add(
  'Your car (make, model, year)',
  'Mașina ta (marcă, model, an)',
  'Dein Auto (Marke, Modell, Baujahr)',
  'Tu coche (marca, modelo, año)',
  'La tua auto (marca, modello, anno)',
  'Az autód (márka, modell, évjárat)',
);
add(
  "Please enter your car's make, model and year.",
  'Introdu marca, modelul și anul mașinii tale.',
  'Bitte gib Marke, Modell und Baujahr deines Autos ein.',
  'Introduce la marca, el modelo y el año de tu coche.',
  'Inserisci marca, modello e anno della tua auto.',
  'Add meg az autód márkáját, modelljét és évjáratát.',
);
add('Vehicle', 'Vehicul', 'Fahrzeug', 'Vehículo', 'Veicolo', 'Jármű');
add(
  '{car} (preview shown on: {model})',
  '{car} (previzualizare pe: {model})',
  '{car} (Vorschau gezeigt an: {model})',
  '{car} (vista previa en: {model})',
  '{car} (anteprima su: {model})',
  '{car} (az előnézet ezen látható: {model})',
);
[
  [
    'Play with any colour',
    'Joacă-te cu orice culoare',
    'Spiel mit jeder Farbe',
    'Juega con cualquier color',
    'Gioca con qualsiasi colore',
    'Játssz bármilyen színnel',
  ],
  [
    'Our studio films — exact colours',
    'Foliile noastre — culori exacte',
    'Unsere Folien — exakte Farben',
    'Nuestros vinilos — colores exactos',
    'Le nostre pellicole — colori esatti',
    'Fóliáink — pontos színek',
  ],
  [
    'All manufacturers',
    'Toți producătorii',
    'Alle Hersteller',
    'Todos los fabricantes',
    'Tutti i produttori',
    'Minden gyártó',
  ],
  [
    'Search colour or code',
    'Caută culoare sau cod',
    'Farbe oder Code suchen',
    'Buscar color o código',
    'Cerca colore o codice',
    'Szín vagy kód keresése',
  ],
  [
    'Search films by colour name or code',
    'Caută folii după nume sau cod',
    'Folien nach Farbname oder Code suchen',
    'Buscar vinilos por nombre o código',
    'Cerca pellicole per nome o codice',
    'Fóliák keresése szín vagy kód szerint',
  ],
  [
    'Film manufacturer',
    'Producător folie',
    'Folienhersteller',
    'Fabricante del vinilo',
    'Produttore della pellicola',
    'Fóliagyártó',
  ],
  [
    'Filter by finish',
    'Filtrează după finisaj',
    'Nach Finish filtern',
    'Filtrar por acabado',
    'Filtra per finitura',
    'Szűrés felület szerint',
  ],
  [
    'Wrap films',
    'Folii de colantare',
    'Wrap-Folien',
    'Vinilos de wrap',
    'Pellicole wrap',
    'Fóliák',
  ],
  [
    'Finishes available for this colour',
    'Finisaje disponibile pentru această culoare',
    'Verfügbare Finishes für diese Farbe',
    'Acabados disponibles para este color',
    'Finiture disponibili per questo colore',
    'Elérhető felületek ehhez a színhez',
  ],
  [
    'Approximate on-screen colour. Confirm with a physical sample.',
    'Culoare aproximativă pe ecran. Confirmă pe o mostră fizică.',
    'Ungefähre Bildschirmfarbe. Bitte am echten Muster prüfen.',
    'Color aproximado en pantalla. Confírmalo con una muestra física.',
    'Colore approssimativo a schermo. Verificalo su un campione fisico.',
    'Közelítő képernyőszín. Ellenőrizd fizikai mintán.',
  ],
  [
    'Manufacturer RGB reference. Confirm with a physical sample.',
    'Referință RGB de la producător. Confirmă pe o mostră fizică.',
    'RGB-Referenz des Herstellers. Bitte am echten Muster prüfen.',
    'Referencia RGB del fabricante. Confírmalo con una muestra física.',
    'Riferimento RGB del produttore. Verificalo su un campione fisico.',
    'Gyártói RGB-referencia. Ellenőrizd fizikai mintán.',
  ],
  [
    'Custom shade. We will match it to the closest real film.',
    'Nuanță liberă. O potrivim cu cea mai apropiată folie reală.',
    'Freie Farbe. Wir wählen die nächstliegende echte Folie.',
    'Tono libre. Lo igualamos con el vinilo real más cercano.',
    'Tonalità libera. La abbiniamo alla pellicola reale più vicina.',
    'Egyedi árnyalat. A legközelebbi valódi fóliához igazítjuk.',
  ],
  [
    'High gloss',
    'Lucios intens',
    'Hochglanz',
    'Alto brillo',
    'Lucido intenso',
    'Magasfényű',
  ],
  [
    'Gloss metallic',
    'Metalizat lucios',
    'Glanz-Metallic',
    'Metalizado brillante',
    'Metallizzato lucido',
    'Fényes metál',
  ],
  [
    'Satin metallic',
    'Metalizat satinat',
    'Satin-Metallic',
    'Metalizado satinado',
    'Metallizzato satinato',
    'Szatén metál',
  ],
  [
    'Satin pearl',
    'Perlat satinat',
    'Satin-Perleffekt',
    'Perlado satinado',
    'Perlato satinato',
    'Szatén gyöngyház',
  ],
  [
    'Matte metallic',
    'Metalizat mat',
    'Matt-Metallic',
    'Metalizado mate',
    'Metallizzato opaco',
    'Matt metál',
  ],
  [
    'Colour flip',
    'Cameleon',
    'Farbflip',
    'Camaleón',
    'Cangiante',
    'Színváltós',
  ],
  [
    'Satin colour flip',
    'Cameleon satinat',
    'Satin-Farbflip',
    'Camaleón satinado',
    'Cangiante satinato',
    'Szatén színváltós',
  ],
  [
    'Diamond sparkle',
    'Sclipici diamant',
    'Diamant-Glitzer',
    'Brillo diamante',
    'Scintillio diamante',
    'Gyémántcsillám',
  ],
  [
    'Liquid metal',
    'Metal lichid',
    'Flüssigmetall',
    'Metal líquido',
    'Metallo liquido',
    'Folyékony fém',
  ],
  [
    'Brushed metal',
    'Metal periat',
    'Gebürstetes Metall',
    'Metal cepillado',
    'Metallo spazzolato',
    'Szálcsiszolt fém',
  ],
  [
    'Carbon fibre',
    'Fibră de carbon',
    'Carbonfaser',
    'Fibra de carbono',
    'Fibra di carbonio',
    'Karbon',
  ],
  [
    'Textured',
    'Texturat',
    'Strukturiert',
    'Texturizado',
    'Testurizzato',
    'Texturált',
  ],
  [
    'All finishes',
    'Toate finisajele',
    'Alle Finishes',
    'Todos los acabados',
    'Tutte le finiture',
    'Minden felület',
  ],
  ['Metallic', 'Metalizat', 'Metallic', 'Metalizado', 'Metallizzato', 'Metál'],
  [
    'Pearl & flip',
    'Perlat și cameleon',
    'Perl & Flip',
    'Perlado y camaleón',
    'Perlato e cangiante',
    'Gyöngyház és színváltós',
  ],
  [
    'Carbon, brushed & textured',
    'Carbon, periat și texturat',
    'Carbon, gebürstet & strukturiert',
    'Carbono, cepillado y texturizado',
    'Carbonio, spazzolato e testurizzato',
    'Karbon, szálcsiszolt és texturált',
  ],
  [
    'Pure white',
    'Alb pur',
    'Reinweiß',
    'Blanco puro',
    'Bianco puro',
    'Tiszta fehér',
  ],
  [
    'Electric orange',
    'Portocaliu electric',
    'Elektrisches Orange',
    'Naranja eléctrico',
    'Arancione elettrico',
    'Élénk narancs',
  ],
  [
    'Sunburst yellow',
    'Galben solar',
    'Sonnengelb',
    'Amarillo sol',
    'Giallo sole',
    'Napsárga',
  ],
  [
    'Sky blue',
    'Albastru cer',
    'Himmelblau',
    'Azul cielo',
    'Azzurro cielo',
    'Égkék',
  ],
  [
    'Royal purple',
    'Mov regal',
    'Königsviolett',
    'Púrpura real',
    'Viola reale',
    'Királylila',
  ],
].forEach((entry) => add(...entry));
add(
  '{count} film',
  '{count} folie',
  '{count} Folie',
  '{count} vinilo',
  '{count} pellicola',
  '{count} fólia',
);
add(
  '{count} films',
  '{count} folii',
  '{count} Folien',
  '{count} vinilos',
  '{count} pellicole',
  '{count} fólia',
);

const storageKey = 'elite-wrap-language-v1';
export const languages = {
  en: 'English',
  ro: 'Română',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  hu: 'Magyar',
};

function supported(value) {
  const code =
    typeof value === 'string' ? value.toLowerCase().split(/[-_]/)[0] : '';
  return Object.hasOwn(languages, code) ? code : null;
}

let saved;
try {
  saved = localStorage.getItem(storageKey);
} catch (error) {
  console.warn('Language preference cannot be read:', error);
}
// A ?lang= link (used by search engines for each language) wins over the
// saved preference and the browser language.
const urlLocale = supported(new URLSearchParams(location.search).get('lang'));
let locale =
  urlLocale ||
  supported(saved) ||
  [...(navigator.languages || []), navigator.language]
    .map(supported)
    .find(Boolean) ||
  'en';

export function getLocale() {
  return locale;
}

export function setLocale(value, { persist = true } = {}) {
  locale = supported(value) || 'en';
  if (!persist) return;
  const url = new URL(location.href);
  if (url.searchParams.has('lang')) {
    url.searchParams.set('lang', locale);
    history.replaceState(history.state, '', url);
  }
  try {
    localStorage.setItem(storageKey, locale);
  } catch (error) {
    console.warn('Language preference cannot be saved:', error);
  }
}

export function t(key, params = {}) {
  const template = messages[locale]?.[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    Object.hasOwn(params, name) ? String(params[name]) : match,
  );
}

// Capture the original static nodes once, so language changes never replace
// controls, erase user input, or disturb application state.
export function captureStaticTranslations(root = document) {
  const nodes = [];
  const walker = document.createTreeWalker(root.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script, style')) continue;
    const original = node.nodeValue;
    const key = original.trim().replace(/\s+/g, ' ');
    if (key && Object.hasOwn(messages.ro, key)) {
      nodes.push({
        node,
        key,
        leading: original.match(/^\s*/)[0],
        trailing: original.match(/\s*$/)[0],
      });
    }
  }
  const attributes = [];
  root
    .querySelectorAll('[aria-label], [placeholder], [title]')
    .forEach((element) => {
      ['aria-label', 'placeholder', 'title'].forEach((name) => {
        const key = element.getAttribute(name);
        if (key && Object.hasOwn(messages.ro, key))
          attributes.push({ element, name, key });
      });
    });
  const description = root.querySelector('meta[name="description"]');
  const descriptionKey = description.content;
  const titleKey = root.title;
  // An optional scope limits the update to one subtree, without touching the
  // document language, for layout measurement.
  return (scope = null) => {
    const inScope = (node) => !scope || scope.contains(node);
    if (!scope) {
      root.documentElement.lang = locale;
      root.title = t(titleKey);
      description.content = t(descriptionKey);
      // Each ?lang= page is its own canonical, so hreflang alternates count.
      const canonical = root.querySelector('link[rel="canonical"]');
      if (canonical && new URLSearchParams(location.search).has('lang')) {
        const url = new URL(canonical.href);
        url.search = locale === 'en' ? '' : `?lang=${locale}`;
        canonical.href = url.href;
      }
    }
    nodes.forEach(({ node, key, leading, trailing }) => {
      if (inScope(node)) node.nodeValue = `${leading}${t(key)}${trailing}`;
    });
    attributes.forEach(({ element, name, key }) => {
      if (inScope(element)) element.setAttribute(name, t(key));
    });
  };
}
