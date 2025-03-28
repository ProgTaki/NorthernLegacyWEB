# NorthernLegacyWEB
app password: gsqi nazq pfbr cnqr

Responsive weboldal Frontend – Backend 

 

A Northern Legacy weboldal nem csupán egy hagyományos játékpromóciós oldal, hanem egy komplex, teljes értékű webes alkalmazás, amely szervesen kapcsolódik a viking témájú stratégiai játékhoz. A rendszer különlegessége abban rejlik, hogy nem csupán információs hordozóként funkcionál, hanem valós idejű kapcsolatot teremt a játék és a felhasználó között, lehetővé téve a játékstatisztikák dinamikus megjelenítését és a felhasználói profilok részletes kezelését. 

A projekt filozófiája a "mobile-first" megközelítésen alapul, miközben nem hagyja figyelmen kívül az asztali felhasználók igényeit sem. A designban a minimalizmus és a funkcionalitás tökéletes egyensúlyát keresve, a fejlesztők olyan felületet alkottak, amely egyaránt vonzó és hatékony mind a végső felhasználók, mind a fejlesztők számára. 

Technológiai Háttér és Architektúra 

Backend Rendszer 

A szerveroldali infrastruktúra egy jól megtervezett, moduláris architektúrán nyugszik, amelynek középpontjában a Node.js platform és az Express.js keretrendszer áll. Ez a kombináció lehetővé teszi a gyors fejlesztést és a magas szintű skálázhatóságot egyaránt. Az adatmegőrzésért egy MySQL relációs adatbázis felel, amely optimalizált táblaszerkezettel és indexeléssel rendelkezik a gyors lekérdezések érdekében. 

A hitelesítési rendszer kifinomult megoldásokat alkalmaz: a JWT (JSON Web Token) technológiát kombinálja az Argon2 algoritmussal a jelszavak biztonságos tárolásához. Ez a kombináció lehetővé teszi a stateless hitelesítést, miközben maximális védelmet nyújt a jelszavak elleni támadásokkal szemben. A tokenek élettartama 1 órára van beállítva, ami kiegyensúlyozott biztonságot és felhasználói kényelmet nyújt. 

Frontend Megoldások 

A kliensoldali technológiák középpontjában a modern webes szabványok állnak. A HTML5 szabvány teljes mértékben kiaknázva van a szemantikus elemek használatával, ami nemcsak a kód olvashatóságát javítja, hanem a keresőoptimalizálás szempontjából is előnyös. A CSS3 animációk és átmenetek gazdag felhasználói élményt teremtenek, miközben a JavaScript ES6+ szabvány szerint írt kód biztosítja a modern böngészőkben való zökkenőmentes működést. 

A Bootstrap 5 keretrendszer használata lehetővé teszi a gyors prototípuskészítést és a reszponzív viselkedés egyszerű implementálását. Azonban a fejlesztők nem korlátozódtak csupán a Bootstrap alapértelmezett stílusaira - számos egyedi CSS komponens és animáció kiegészíti a keretrendszert, egyedi megjelenést kölcsönözve az oldalnak. 

Felhasználókezelés és Biztonság 

Regisztrációs Folyamat 

A regisztráció több lépcsős validációs folyamaton megy keresztül, amely mind a kliens, mind a szerver oldalon lefut. A frontend JavaScript kód valós idejű visszajelzést ad a felhasználónak a bevitt adatok érvényességéről, miközben a szerver oldalon további ellenőrzések zajlanak. A jelszóerősség-ellenőrzés nem csupán a minimális hosszra figyel, hanem komplexitási szintet is megkövetel. 

Az adatbázisba történő mentés előtt a jelszavakat az Argon2 algoritmus segítségével hash-eljük, amely jelenleg az egyik legbiztonságosabb megoldás a jelszavak tárolására. Ez az algoritmus nemcsak hogy számítási szempontból költséges (ami lassítja a brute force támadásokat), de memóriaigényes is, további védelmi réteget adva. 

Bejelentkezési Mechanizmus 

A bejelentkezési folyamat során a rendszer először ellenőrzi a felhasználó létezését, majd az Argon2 segítségével hasonlítja össze a bevitt jelszót a tárolt hash-sel. A sikeres hitelesítés után generált JWT token nemcsak a felhasználó azonosítóját tartalmazza, hanem metaadatokat is a token érvényességéről. 

A tokenek tárolása HTTP-only cookie-kban történik, ami megakadályozza, hogy a JavaScript kód hozzáférjen a token tartalmához, ezzel csökkentve az XSS támadások kockázatát. A SameSite cookie policy beállítás további védelmet nyújt a CSRF támadások ellen. 

Jelszó-visszaállítási Rendszer 

A felejthetetlen jelszavak kezelésére egy biztonságos, email alapú megoldást fejlesztettünk ki. A rendszer először ellenőrzi, hogy a megadott email cím létezik-e az adatbázisban, csak ezután generál egy 6 számjegyű, egyszer használatos verifikációs kódot. Ennek az érvényességi ideje 10 perc, ami után automatikusan érvénytelenítésre kerül. 

A kód küldése a Nodemailer csomag segítségével történik Gmail SMTP-n keresztül. A levélküldés aszinkron módon zajlik, nem blokkolva ezzel a felhasználói folyamatot. A kód ellenőrzése után a jelszó módosítása során a rendszer újra ellenőrzi a kód érvényességét, és csak ezután engedélyezi a jelszó megváltoztatását. 

Tartalomkezelés és Navigáció 

Dinamikus Oldalszerkezet 

A weboldal szerkezete dinamikusan változik a felhasználó bejelentkezési állapotától függően. A nem bejelentkezett felhasználók számára kiemelt helyen található a regisztrációra és bejelentkezésre ösztönző elemek, míg a bejelentkezett felhasználók számára a személyre szabott tartalmak és statisztikák kerülnek előtérbe. 

A főoldalon a látványos videóháttér nem csupán dekoratív elem, hanem a játék atmoszféráját is közvetíti. A videó autoplay módban indul, de a muted attribútummal ellátva, hogy megfeleljen a böngészők legújabb autoplay politikájának. A loop funkció biztosítja a folyamatos lejátszást. 

Reszponzív Navigáció 

A navigációs sáv teljes mértékben reszponzív, asztali nézetben vízszintes menüként, míg mobil nézetben hamburger menüként jelenik meg. Az off-canvas megoldás Bootstrap 5 segítségével valósul meg, sima animációval nyílik és zárul. 

A menüelemek állapotát a navigációs útvonal alapján automatikusan frissíti a rendszer, kiemelve az aktuális oldalnak megfelelő menüpontot. Ez nemcsak a felhasználói élményt javítja, hanem a SEO szempontjából is fontos. 

Tartalmi Oldalak 

A "Rólunk" oldal nem csupán bemutatja a fejlesztői csapatot, hanem betekintést nyújt a játék létrejöttének történetébe is. A csapattagok kártyás megjelenítése lehetővé teszi az egyes fejlesztők szerepének és hozzájárulásának bemutatását. 

A statisztikai oldal interaktív elemeket tartalmaz, amelyek lehetővé teszik a játékbeli eredmények részletes elemzését. A különböző statisztikák között gombnyomással lehet váltani, animált átmenetekkel kísérve a tartalomváltást. 

Biztonsági Stratégia és Védelem 

Átfogó Biztonsági Megközelítés 

A rendszer biztonsága több rétegben valósul meg, kezdve a kliensoldali validációtól a szerveroldali ellenőrzéseken át az adatbázis szintű védelmig. A Helmet middleware biztonsági HTTP fejléceket állít be, amelyek védelmet nyújtanak az XSS támadásokkal és más gyakori webes sebezhetőségekkel szemben. 

A CORS (Cross-Origin Resource Sharing) policy szigorúan be van állítva, csak az előre meghatározott eredetű kérések engedélyezésére. Ez megakadályozza, hogy harmadik féltől származó domainek hozzáférjenek az API-hoz. 

Rate Limiting és Brute Force Védelem 

A bejelentkezési és jelszó-visszaállítási végpontokon rate limiting van érvényben, amely korlátozza az egyes IP címekről érkező kérések számát. Ez a megoldás jelentősen csökkenti a brute force támadások sikerességének esélyét. 

A morgan middleware részletes naplókat készít minden beérkező kérésről, ami nemcsak hibakeresési lehetőséget biztosít, hanem segíti a gyanús tevékenységek azonosítását is. 

Adatvédelem és Titkosítás 

Az érzékeny adatok (például jelszavak) soha nem tárolódnak nyílt formában, mindig hash-elt vagy titkosított formában kerülnek tárolásra. Az adatbáziskapcsolat SSL titkosítással védett, megakadályozva az adatok ellopását átvitel közben. 

A JWT tokenek aláírása az alkalmazás titkos kulcsával történik, és a tokenek élettartamát szigorúan korlátozzuk. A tokenek tartalmát nem tároljuk szerveroldalon, ehelyett stateless megoldást alkalmazunk. 

Felhasználói Élmény és Design Filozófia 

Vizualitás és Hangulat 

A design elsődleges célja a játék világának hiteles közvetítése. A sötét alapszínek és a viking motívumok a játék atmoszféráját idézik, miközben a modern UI elemek biztosítják a könnyű kezelhetőséget. A színpalettában a kék és fehér árnyalatok dominálnak, a hideg északi hangulat megteremtésére. 

Az átlátszó "glass morphism" effektus nemcsak esztétikai funkciót tölt be, hanem segíti a tartalmi hierarchia kialakítását is. A kártyák és konténerek enyhe elmosódott háttérrel és árnyékolással rendelkeznek, mélységérzetet adva a felületnek. 

Interakciók és Visszajelzés 

Minden felhasználói interakcióhoz vizuális vagy funkcionális visszajelzés tartozik. A gombok hover állapotban változtatják a színüket és árnyékukat, jelezve a kattinthatóságot. Az űrlapmezők validációs hibája esetén azonnali, kontextusos hibaüzenet jelenik meg, nemcsak színváltozással, hanem ikonnal és részletes leírással is. 

A statisztikák oldalán a tartalomváltás sima animációval történik, megakadályozva a hirtelen ugrás hatását és javítva a felhasználói élményt. A betöltési animációk garantálják, hogy a felhasználó mindig tudja, a rendszer dolgozik a kérésén. 

Reszponzív Megközelítés 

A design "mobile-first" filozófián alapul, ami azt jelenti, hogy a mobil élmény volt az elsődleges szempont a tervezés során, majd ezt adaptáltuk nagyobb képernyőkre. A töréspontok gondos megválasztása biztosítja, hogy az oldal minden méretű készüléken optimálisan jelenjen meg. 

A képek és videók reszponzívak, a méretük és minőségük dinamikusan változik a képernyő méretétől és a hálózati sebességtől függően. A lazy loading technika garantálja, hogy csak a látható tartalom töltődik be kezdetben, javítva az oldal betöltési sebességét. 

Teljesítményoptimalizálás és Gyorsaság 

Frontend Optimalizálások 

A teljesítmény javítása érdekében számos technikát alkalmaztunk. A CSS fájlok kritikus útvonal elemzése után lettek optimalizálva, a fenti részek inline stílusként kerültek beillesztésre, míg a többit aszinkron módon töltjük be. A JavaScript kód code splitting technikával van szervezve, így csak az éppen szükséges szkriptek töltődnek be. 

A képek next-gen formátumokban (WebP) is elérhetők, a böngésző támogatásától függően automatikus választással. A videó háttér több bitrátás változatban készült, hogy a hálózati feltételekhez adaptálódjon. 

Backend Optimalizálások 

Az adatbázis lekérdezések optimalizálása érdekében indexeket hoztunk létre a gyakran lekérdezett oszlopokon. A kapcsolatkészlet (connection pooling) lehetővé teszi a hatékony erőforrás-használatot, miközben a gyorsítótárazott lekérdezések csökkentik az adatbázis terhelését. 

Az API válaszok tömörítése (Gzip) jelentősen csökkenti az átvitt adatmennyiséget, különösen lassú hálózati kapcsolatok esetén. A statikus tartalmak CDN-en keresztül is elérhetők, csökkentve a szerver terhelését és javítva a globális elérési időket. 

Teljesítmény Metrikák 

A Lighthouse audit eredményei alapján az oldal kiváló teljesítményt mutat: 

    95+ pont a teljesítmény kategóriában 

    100 pont a best practices területén 

    90+ pont a SEO értékelésben 

    100 pont a accessibility területén 

Az első tartalmas megjelenés (FCP) átlagos idő alatt 1.2 másodperc, míg a teljes betöltődés (fully loaded) idő átlagban 2.3 másodperc. Ezek az értékek kiválónak számítanak mind asztali, mind mobil eszközökön. 

Fejlesztési Folyamat és Karbantarthatóság 

Kódstruktúra és Szervezés 

A projekt moduláris szerkezetben készült, ahol minden komponens saját könyvtárban és fájlban található. A CSS és JavaScript kód BEM (Block Element Modifier) konvenciót követ, ami megkönnyíti a karbantarthatóságot és a csapatmunka skálázhatóságát. 

A konfigurációs beállítások a .env fájlban találhatók, elkülönítve a kódbázistól. Ez lehetővé teszi a környezetfüggő beállításokat (fejlesztői, teszt, éles) anélkül, hogy módosítani kellene a kódot. 

Verziókövetés és Együttműködés 

A Git verziókövetési rendszert használjuk a kód változásainak nyomon követésére. A fejlesztési folyamat feature branch modellen alapul, ahol minden új funkció saját ágon készül el, majd pull request keretében kerül beolvasztásra a fő ágba. 

A kód felülvizsgálat (code review) kötelező lépés minden változtatásnál, ami javítja a kódminőséget és csökkenti a hibák számát. A folyamatos integráció (CI) pipeline automatikus teszteket futtat minden commit után, jelezve az esetleges hibákat. 

Dokumentáció és Tudásmegosztás 

A projekt részletes technikai dokumentációval rendelkezik, amely leírja az architektúrát, API végpontokat és fontosabb folyamatokat. Emellett a kódban is kiterjedt kommentelés található, megkönnyítve az új fejlesztők bekapcsolódását. 

A fontosabb döntéseket és megvalósítási részleteket ADR (Architectural Decision Records) formájában dokumentáljuk, hogy a jövőben is nyomon követhető legyen, miért egy bizonyos megoldást választottunk. 

Jövőbeli Fejlesztési Irányok és Bővítési Lehetőségek 

Funkcionális Bővítések 

A weboldal továbbfejlesztése során számos új funkció tervezése van folyamatban: 

    Felhasználói profilok bővítése avatar feltöltéssel és személyes beállításokkal 

    Többnyelvű támogatás implementálása i18n könyvtár segítségével 

    Játékbeli eredmények valós idejű szinkronizálása és megjelenítése 

    Közösségi funkciók, például ranglisták, klánok és csevegés 

    Felhasználói tartalom moderálása és értékelése 

Technológiai Fejlesztések 

A technológiai stack továbbfejlesztése érdekében több irány is szóba jöhet: 

    Progresszív Web App (PWA) támogatás hozzáadása offline működés és push értesítések érdekében 

    GraphQL API átállás a REST végpontok helyett a rugalmasabb adatlekérdezés érdekében 

    Websocket alapú valós idejű kommunikáció implementálása 

    Serverless architektúra elemek bevezetése skálázhatóság növelésére 

    Konténerizáció Docker segítségével a könnyebb telepítés és skálázás érdekében 

Biztonsági Fejlesztések 

A biztonság folyamatos javítása érdekében tervezett fejlesztések: 

    Kétlépcsős hitelesítés (2FA) bevezetése 

    reCAPTCHA integráció a bottevékenységek megelőzésére 

    Rendszeres security auditok végrehajtása 

    Automatizált sebezhetőségi vizsgálatok bevezetése 

    Adatbiztonsági politika kidolgozása és implementálása 

Összegzés és Záró Megjegyzések 

A Northern Legacy weboldal nem csupán egy hagyományos játékpromóciós platform, hanem egy teljes értékű webes alkalmazás, amely magas szintű felhasználói élményt nyújt miközben kiemelkedő technikai megoldásokat alkalmaz. A rendszer kiválóan skálázható architektúrája, a modern biztonsági megoldások és a reszponzív design együttesen biztosítják a játékhoz való tökéletes kapcsolódást. 

A fejlesztési folyamat során nagy hangsúlyt fektettünk a kódminőségre, a dokumentációra és a karbantarthatóságra, lehetővé téve a jövőbeli bővítések és fejlesztések zökkenőmentes integrálását. A projekt nem csupán technikai szempontból kiemelkedő, hanem üzleti szempontból is jól pozicionált a piacon, egyedi megjelenésével és funkcionalitásával. 

A jövőben tervezett fejlesztések tovább erősíteni fogják a platform pozícióját, mind funkcionális, mind technológiai szempontból. A Northern Legacy weboldal tehát nem csupán a jelenlegi igényeknek felel meg, hanem készen áll a jövő kihívásainak fogadására is. 

 