export type OccupationDescription = {
  occupationCode: string;
  intro: string;
};

const occupationDescriptions: Record<string, OccupationDescription> = {
  "0000": {
    occupationCode: "0000",
    intro: "Denne koden brukes når yrket ikke kan fastslås tydelig, og beskriver derfor ikke et bestemt arbeid med egne oppgaver eller ansvar.",
  },
  "0110": {
    occupationCode: "0110",
    intro: "Offiserer leder militære styrker og har ansvar for planlegging, gjennomføring og oppfølging av operasjoner, øvelser og daglig drift. De tar beslutninger under press og følger opp personell, ressurser og sikkerhet.",
  },
  "0210": {
    occupationCode: "0210",
    intro: "Befal med sersjant grad har en sentral rolle i den daglige oppfølgingen av soldater, og sørger for opplæring, disiplin og gjennomføring av oppgaver. De fungerer ofte som bindeledd mellom offiserer og mannskap.",
  },
  "0310": {
    occupationCode: "0310",
    intro: "Menige utfører praktiske og operative oppgaver i Forsvaret, og deltar i øvelser, vakthold og ulike typer oppdrag. De jobber tett i team og følger instrukser fra befal og offiserer.",
  },
  "1111": {
    occupationCode: "1111",
    intro: "Politikere arbeider med å utvikle og vedta lover, regler og prioriteringer som påvirker samfunnet. De representerer velgere, fremmer saker og deltar i beslutningsprosesser på ulike nivåer.",
  },
  "1112": {
    occupationCode: "1112",
    intro: "Toppledere i offentlig administrasjon har ansvar for styring av statlige eller kommunale virksomheter, og jobber med strategi, ressursfordeling og gjennomføring av politiske vedtak i praksis.",
  },
  "1114": {
    occupationCode: "1114",
    intro: "Toppledere i interesseorganisasjoner leder arbeid for å fremme medlemmenes interesser, og jobber med påvirkning, samarbeid og synlighet mot myndigheter, næringsliv og offentligheten.",
  },
  "1120": {
    occupationCode: "1120",
    intro: "Administrerende direktører har det overordnede ansvaret for drift, resultater og utvikling i en virksomhet. De setter retning, følger opp ledere og tar beslutninger som påvirker hele organisasjonen.",
  },
  "1211": {
    occupationCode: "1211",
    intro: "Finans- og økonomisjefer har ansvar for økonomistyring, rapportering og analyser i en virksomhet. De følger opp budsjett, likviditet og lønnsomhet, og gir beslutningsgrunnlag til ledelsen.",
  },
  "1212": {
    occupationCode: "1212",
    intro: "Personalsjefer jobber med ansatte og organisasjon, og har ansvar for rekruttering, kompetanseutvikling og arbeidsmiljø. De følger opp personalprosesser og sørger for gode rammer for medarbeiderne.",
  },
  "1213": {
    occupationCode: "1213",
    intro: "Strategi- og planleggingssjefer jobber med å utvikle mål, planer og retning for virksomheter, og analyserer informasjon for å legge grunnlag for beslutninger og prioriteringer.",
  },
  "1219": {
    occupationCode: "1219",
    intro: "Andre administrative ledere har ansvar for å koordinere og følge opp administrative funksjoner, og sørger for at interne prosesser, rutiner og støttefunksjoner fungerer effektivt.",
  },
  "1221": {
    occupationCode: "1221",
    intro: "Salgs- og markedssjefer leder arbeid med salg og markedsføring, og har ansvar for å utvikle strategier, følge opp resultater og styrke virksomhetens posisjon i markedet.",
  },
  "1222": {
    occupationCode: "1222",
    intro: "PR- og informasjonssjefer jobber med kommunikasjon ut mot omverdenen, og har ansvar for mediehåndtering, budskap og synlighet i ulike kanaler.",
  },
  "1223": {
    occupationCode: "1223",
    intro: "Forsknings- og utviklingsledere leder arbeid med å utvikle nye produkter, tjenester eller løsninger, og følger opp prosjekter, fagmiljøer og fremdrift i innovasjonsarbeid.",
  },
  "1311": {
    occupationCode: "1311",
    intro: "Ledere i skogbruk, gartnerier mv. har ansvar for drift og produksjon innen naturbaserte næringer, og følger opp ressurser, ansatte og praktisk gjennomføring av arbeidet.",
  },
  "1312": {
    occupationCode: "1312",
    intro: "Ledere innen akvakultur mv. har ansvar for drift og produksjon i oppdrettsanlegg, og følger opp fiskehelse, miljøforhold, ansatte og tekniske systemer for å sikre god kvalitet og bærekraftig produksjon.",
  },
  "1321": {
    occupationCode: "1321",
    intro: "Ledere av industriproduksjon mv. styrer produksjonsprosesser i industribedrifter, og har ansvar for effektiv drift, kvalitet, bemanning og optimal utnyttelse av maskiner, råvarer og ressurser.",
  },
  "1322": {
    occupationCode: "1322",
    intro: "Ledere av olje- og gassutvinning mv. har ansvar for planlegging og drift av utvinningsaktiviteter, og følger opp sikkerhet, produksjon, teknologi og personell i krevende og ofte risikofylte omgivelser.",
  },
  "1323": {
    occupationCode: "1323",
    intro: "Ledere av bygge- og anleggsvirksomhet har ansvar for gjennomføring av byggeprosjekter, og koordinerer fremdrift, økonomi, kvalitet og samarbeid mellom ulike faggrupper på byggeplassen.",
  },
  "1324": {
    occupationCode: "1324",
    intro: "Ledere av logistikk og transport mv. planlegger og styrer vareflyt og transportløsninger, og har ansvar for effektiv distribusjon, lagerstyring og koordinering av ressurser og leveranser.",
  },
  "1330": {
    occupationCode: "1330",
    intro: "Ledere av IKT-enheter har ansvar for utvikling, drift og sikkerhet i virksomhetens IT-systemer, og følger opp tekniske løsninger, prosjekter og ansatte innen teknologiområdet.",
  },
  "1341": {
    occupationCode: "1341",
    intro: "Ledere av omsorgstjenester for barn har ansvar for drift av tilbud som barnehager eller institusjoner, og følger opp ansatte, pedagogisk innhold og barns trivsel og utvikling.",
  },
  "1342": {
    occupationCode: "1342",
    intro: "Ledere av helsetjenester har ansvar for organisering og drift av helsetilbud, og følger opp faglig kvalitet, bemanning, pasientsikkerhet og ressursbruk i tjenestene.",
  },
  "1343": {
    occupationCode: "1343",
    intro: "Har ansvar for drift og utvikling av tjenester for eldre, og følger opp ansatte, kvalitet, bemanning, økonomi og omsorgstilbud i hverdagen.",
  },
  "1344": {
    occupationCode: "1344",
    intro: "Leder tjenester som skal støtte mennesker i krevende livssituasjoner, og følger opp faglig innhold, ansatte, brukere, samarbeid og ressursbruk.",
  },
  "1345": {
    occupationCode: "1345",
    intro: "Har ansvar for drift og utvikling av skoler eller andre opplæringstilbud, og følger opp ansatte, kvalitet, læringsmiljø, planer og resultater.",
  },
  "1346": {
    occupationCode: "1346",
    intro: "Leder virksomheter innen bank, forsikring eller andre finansielle tjenester, og følger opp risiko, lønnsomhet, regelverk, ansatte og kundeprosesser.",
  },
  "1349": {
    occupationCode: "1349",
    intro: "Har ansvar for å lede ulike typer produksjons- eller tjenestevirksomhet, og følger opp drift, bemanning, kvalitet, økonomi og forbedringsarbeid.",
  },
  "1411": {
    occupationCode: "1411",
    intro: "Styrer den daglige driften av hotell, og følger opp gjesteopplevelser, ansatte, økonomi, booking, service, renhold og rutiner på tvers av avdelinger.",
  },
  "1412": {
    occupationCode: "1412",
    intro: "Leder restaurantdrift og sørger for at kjøkken, servering, bemanning, økonomi og gjesteopplevelse fungerer godt gjennom hele dagen.",
  },
  "1420": {
    occupationCode: "1420",
    intro: "Har ansvar for den daglige driften i butikker eller kjeder, og følger opp salg, bemanning, varer, kundeservice, budsjett og resultater.",
  },
  "1431": {
    occupationCode: "1431",
    intro: "Leder steder som tilbyr sport, kultur eller fritidsaktiviteter, og følger opp ansatte, tilbud, økonomi, sikkerhet og opplevelsen for brukerne.",
  },
  "1439": {
    occupationCode: "1439",
    intro: "Har ansvar for daglig drift i ulike servicevirksomheter, og følger opp ansatte, kvalitet, kunder, rutiner, inntekter og praktisk gjennomføring.",
  },
  "2111": {
    occupationCode: "2111",
    intro: "Arbeider med naturens grunnleggende lover og fenomener, og bruker beregninger, observasjoner og eksperimenter for å forstå alt fra partikler til verdensrommet.",
  },
  "2112": {
    occupationCode: "2112",
    intro: "Analyserer vær og klima ved hjelp av målinger, modeller og satellittdata, og lager varsler og vurderinger av hvordan været utvikler seg.",
  },
  "2113": {
    occupationCode: "2113",
    intro: "Arbeider med stoffer, materialer og kjemiske reaksjoner, og analyserer hvordan ulike forbindelser kan brukes, fremstilles, testes eller forbedres.",
  },
  "2114": {
    occupationCode: "2114",
    intro: "Studerer jorden, bergarter og prosesser under overflaten, og bruker målinger og analyser til å forstå naturressurser, landskap og geologiske endringer.",
  },
  "2120": {
    occupationCode: "2120",
    intro: "Jobber med tall, sannsynlighet og modeller, og analyserer data for å finne mønstre, beregne risiko og støtte beslutninger innen mange fagområder.",
  },
  "2131": {
    occupationCode: "2131",
    intro: "Studerer levende organismer, arter og økosystemer, og undersøker hvordan planter, dyr og andre livsformer utvikler seg og påvirker hverandre.",
  },
  "2132": {
    occupationCode: "2132",
    intro: "Arbeider med landbruk, naturressurser og matproduksjon, og kombinerer biologisk kunnskap med drift, rådgivning og utvikling av bærekraftige løsninger.",
  },
  "2133": {
    occupationCode: "2133",
    intro: "Rådgir om natur, klima og miljøpåvirkning, og hjelper virksomheter og myndigheter med å vurdere tiltak, krav og løsninger for bærekraftig drift.",
  },
  "2141": {
    occupationCode: "2141",
    intro: "Utvikler og forbedrer produksjonsprosesser, fabrikker og tekniske løsninger, og arbeider med effektivitet, kvalitet, sikkerhet og ressursbruk i industrien.",
  },
  "2142": {
    occupationCode: "2142",
    intro: "Planlegger og prosjekterer bygninger, veier, broer og annen infrastruktur, og følger opp tekniske løsninger, beregninger og gjennomføring av prosjekter.",
  },
  "2143": {
    occupationCode: "2143",
    intro: "Utvikler tekniske løsninger som reduserer forurensning og ressursbruk, og jobber med vann, avfall, energi og andre miljørelaterte systemer.",
  },
  "2144": {
    occupationCode: "2144",
    intro: "Utvikler tekniske løsninger for maskiner, skip og mekaniske systemer, og arbeider med konstruksjon, drift, beregninger og forbedring av utstyr.",
  },
  "2145": {
    occupationCode: "2145",
    intro: "Arbeider med kjemiske prosesser og produksjonsanlegg, og utvikler løsninger for materialer, råstoff, sikkerhet og effektiv drift i laboratorier og industri.",
  },
  "2146": {
    occupationCode: "2146",
    intro: "Jobber med ressurser og prosesser i berggrunn og undergrunn, og utvikler tekniske løsninger knyttet til utvinning, materialer, trykk og geologiske forhold.",
  },
  "2149": {
    occupationCode: "2149",
    intro: "Utvikler avanserte tekniske løsninger på tvers av fagområder, og arbeider med beregninger, prosjektering, testing og forbedring av komplekse systemer.",
  },
  "2151": {
    occupationCode: "2151",
    intro: "Planlegger og utvikler anlegg for strømproduksjon og strømforsyning, og arbeider med tekniske beregninger, nett, sikkerhet og energisystemer.",
  },
  "2152": {
    occupationCode: "2152",
    intro: "Utvikler elektroniske systemer og komponenter, og arbeider med alt fra styring og instrumentering til kretsdesign, testing og integrasjon.",
  },
  "2153": {
    occupationCode: "2153",
    intro: "Planlegger og utvikler systemer for kommunikasjon og dataoverføring, og arbeider med nettverk, signaler, infrastruktur og tekniske løsninger.",
  },
  "2161": {
    occupationCode: "2161",
    intro: "Utformer bygninger og romlige løsninger som skal fungere godt i bruk, og jobber med form, materialer, regler, tegninger og helhet i prosjekter.",
  },
  "2162": {
    occupationCode: "2162",
    intro: "Planlegger uterom, parker og landskap, og arbeider med hvordan natur, funksjon, estetikk og bruk kan spille godt sammen over tid.",
  },
  "2163": {
    occupationCode: "2163",
    intro: "Utvikler produkter, klær og visuelle konsepter, og arbeider med form, materialer, funksjon, brukervennlighet og uttrykk fra idé til ferdig løsning.",
  },
  "2164": {
    occupationCode: "2164",
    intro: "Planlegger hvordan arealer skal brukes i byer og lokalsamfunn, og balanserer hensyn til bolig, transport, natur, næring og samfunnsutvikling.",
  },
  "2165": {
    occupationCode: "2165",
    intro: "Måler opp terreng og eiendommer, lager kart og bearbeider geografiske data, og sørger for nøyaktig grunnlag i planlegging og byggesaker.",
  },
  "2166": {
    occupationCode: "2166",
    intro: "Utformer visuell kommunikasjon for skjerm, trykk og digitale flater, og jobber med identitet, brukeropplevelse, form, layout og innhold.",
  },
  "2211": {
    occupationCode: "2211",
    intro: "Undersøker, behandler og følger opp vanlige sykdommer og helseplager, og møter pasienter over tid med ansvar for vurdering, råd og behandling.",
  },
  "2212": {
    occupationCode: "2212",
    intro: "Arbeider med bestemte fagområder i medisinen, og utreder, behandler og følger opp pasienter med mer sammensatte eller alvorlige tilstander.",
  },
  "2221": {
    occupationCode: "2221",
    intro: "Har avansert klinisk kompetanse innen bestemte deler av helsetjenesten, og følger opp pasienter med spesielle behov, behandlinger og vurderinger.",
  },
  "2222": {
    occupationCode: "2222",
    intro: "Følger gravide, fødende og nybakte mødre gjennom svangerskap, fødsel og barseltid, og har ansvar for helse, trygghet og oppfølging.",
  },
  "2223": {
    occupationCode: "2223",
    intro: "Gir sykepleie, behandling og oppfølging til pasienter i ulike deler av helsetjenesten, og kombinerer faglige vurderinger med omsorg og samarbeid.",
  },
  "2224": {
    occupationCode: "2224",
    intro: "Jobber med mennesker som trenger hjelp til mestring, omsorg og deltakelse, og følger opp hverdagsliv, utvikling, helse og praktisk støtte.",
  },
  "2250": {
    occupationCode: "2250",
    intro: "Behandler og følger opp dyr, og arbeider med sykdom, skader, forebygging, dyrevelferd og rådgivning til eiere og dyreholdere.",
  },
  "2261": {
    occupationCode: "2261",
    intro: "Undersøker og behandler tenner, tannkjøtt og munnhule, og jobber med alt fra forebygging og fyllinger til kirurgi og oppfølging.",
  },
  "2262": {
    occupationCode: "2262",
    intro: "Har inngående kunnskap om legemidler, og arbeider med utlevering, råd, kvalitetssikring og vurdering av trygg og riktig medisinbruk.",
  },
  "2263": {
    occupationCode: "2263",
    intro: "Rådgir om helse, arbeidsmiljø og ytre miljø, og hjelper virksomheter med å forebygge risiko, følge krav og forbedre rutiner og praksis.",
  },
  "2264": {
    occupationCode: "2264",
    intro: "Behandler plager i muskler og ledd gjennom øvelser, veiledning og opptrening, og hjelper mennesker tilbake til bedre funksjon i hverdagen.",
  },
  "2265": {
    occupationCode: "2265",
    intro: "Gir råd om kosthold og ernæring ved sykdom, livsstil eller spesielle behov, og tilpasser anbefalinger til den enkeltes situasjon og mål.",
  },
  "2266": {
    occupationCode: "2266",
    intro: "Utreder og følger opp hørsel, språk, tale og kommunikasjon, og hjelper mennesker med å forstå, bruke eller forbedre ulike funksjoner.",
  },
  "2267": {
    occupationCode: "2267",
    intro: "Hjelper mennesker til å mestre hverdagsaktiviteter etter sykdom, skade eller funksjonsnedsettelse, og tilpasser tiltak, hjelpemidler og trening.",
  },
  "2269": {
    occupationCode: "2269",
    intro: "Arbeider med muskel- og skjelettplager, særlig i rygg og ledd, og bruker undersøkelser og manuell behandling for å bedre funksjon og smerter.",
  },
  "2310": {
    occupationCode: "2310",
    intro: "Underviser og veileder studenter i høyere utdanning, og arbeider med faglig formidling, vurdering, forberedelser og ofte også forskning.",
  },
  "2320": {
    occupationCode: "2320",
    intro: "Underviser i praktiske yrkesfag og knytter opplæringen tett til arbeidslivet, slik at elevene lærer metoder, verktøy og faglige krav.",
  },
  "2330": {
    occupationCode: "2330",
    intro: "Underviser i fag på videregående nivå og følger opp læring, vurdering, faglig utvikling og klassemiljø gjennom skoleåret.",
  },
  "2341": {
    occupationCode: "2341",
    intro: "Lærer barn grunnleggende fag, ferdigheter og arbeidsvaner, og følger opp både læring, trivsel, utvikling og samarbeid med foresatte.",
  },
  "2342": {
    occupationCode: "2342",
    intro: "Legger til rette for lek, omsorg og læring for små barn, og følger opp utvikling, språk, samspill og trygge rammer i barnehagen.",
  },
  "2351": {
    occupationCode: "2351",
    intro: "Arbeider med læring, utvikling og pedagogiske metoder, og gir faglige råd om hvordan undervisning og opplæring kan planlegges og forbedres.",
  },
  "2352": {
    occupationCode: "2352",
    intro: "Gir tilpasset støtte til barn, unge eller voksne med særskilte behov, og tilrettelegger opplæring ut fra funksjon, læring og utvikling.",
  },
  "2353": {
    occupationCode: "2353",
    intro: "Underviser i språk utenfor de ordinære skolefagene, og jobber med muntlig og skriftlig kommunikasjon, uttale, grammatikk og kulturforståelse.",
  },
  "2354": {
    occupationCode: "2354",
    intro: "Underviser i musikkfag utenfor de ordinære skoleløpene, og arbeider med instrumenter, sang, samspill, øving og kunstnerisk utvikling.",
  },
  "2355": {
    occupationCode: "2355",
    intro: "Underviser i kreative og estetiske fag, og hjelper elever eller deltakere med å utvikle ferdigheter innen uttrykk, form og skapende arbeid.",
  },
  "2356": {
    occupationCode: "2356",
    intro: "Lærer bort digitale verktøy, systemer og teknologiske ferdigheter, og hjelper elever eller deltakere med å forstå og bruke IKT i praksis.",
  },
  "2359": {
    occupationCode: "2359",
    intro: "Underviser i andre fag eller opplæringstilbud, og følger opp læring, progresjon, tilpasning og formidling i møte med ulike elevgrupper.",
  },
  "2411": {
    occupationCode: "2411",
    intro: "Kontrollerer regnskap, gir økonomiske råd og hjelper virksomheter med rapportering, regelverk, kvalitet og pålitelig økonomisk informasjon.",
  },
  "2412": {
    occupationCode: "2412",
    intro: "Rådgir om sparing, investeringer og økonomiske valg, og hjelper kunder med å vurdere risiko, mål, produkter og mulige strategier.",
  },
  "2413": {
    occupationCode: "2413",
    intro: "Analyserer selskaper, markeder og økonomiske forhold, og vurderer utvikling, risiko og verdier som grunnlag for investeringer og beslutninger.",
  },
  "2421": {
    occupationCode: "2421",
    intro: "Rådgir om organisering, endring og forbedring i virksomheter, og arbeider med struktur, prosesser, ledelse, kultur og arbeidsmåter.",
  },
  "2422": {
    occupationCode: "2422",
    intro: "Behandler krevende saker og vurderinger i offentlig eller privat sektor, og arbeider med analyser, regelverk, dokumentasjon og beslutningsgrunnlag.",
  },
  "2423": {
    occupationCode: "2423",
    intro: "Hjelper mennesker og virksomheter med rekruttering, karrierevalg og utvikling, og arbeider med rådgivning, prosesser og oppfølging.",
  },
  "2424": {
    occupationCode: "2424",
    intro: "Rådgir om læring og utvikling i arbeidslivet, og planlegger tiltak som styrker ferdigheter, kompetanse og organisasjonens behov over tid.",
  },
  "2431": {
    occupationCode: "2431",
    intro: "Utvikler kampanjer og budskap som skal nå bestemte målgrupper, og arbeider med markedsstrategi, innhold, kanaler og profilering.",
  },
  "2432": {
    occupationCode: "2432",
    intro: "Jobber med intern og ekstern kommunikasjon, og utformer budskap, innhold og planer som skal informere, bygge tillit og skape synlighet.",
  },
  "2433": {
    occupationCode: "2433",
    intro: "Selger avanserte produkter til virksomheter og fagmiljøer, og kombinerer salgsarbeid med produktkunnskap, behovsanalyse og oppfølging.",
  },
  "2434": {
    occupationCode: "2434",
    intro: "Selger programvare, systemer og teknologiske løsninger, og jobber med kundebehov, rådgivning, tilbud, forhandlinger og langsiktige relasjoner.",
  },
  "2511": {
    occupationCode: "2511",
    intro: "Analyserer behov og designer hvordan IT-løsninger bør bygges opp, slik at systemer fungerer godt teknisk, praktisk og over tid.",
  },
  "2512": {
    occupationCode: "2512",
    intro: "Utvikler programvare ved å skrive, teste og forbedre kode, og bygger løsninger som skal fungere stabilt, sikkert og brukervennlig.",
  },
  "2513": {
    occupationCode: "2513",
    intro: "Utvikler nettsider og digitale opplevelser med både teknisk og visuelt fokus, og jobber med funksjon, design, innhold og brukerflyt.",
  },
  "2514": {
    occupationCode: "2514",
    intro: "Programmerer konkrete funksjoner og apper, og arbeider med kode, feilretting, testing og videreutvikling av digitale løsninger.",
  },
  "2519": {
    occupationCode: "2519",
    intro: "Utvikler ulike typer programvareløsninger og applikasjoner, og tilpasser funksjoner, kode og tekniske løsninger til konkrete behov.",
  },
  "2521": {
    occupationCode: "2521",
    intro: "Utformer og drifter databaser, og sørger for at data lagres sikkert, er tilgjengelige og kan brukes effektivt i systemer og analyser.",
  },
  "2522": {
    occupationCode: "2522",
    intro: "Har ansvar for drift, vedlikehold og oppsett av IT-systemer, og følger opp brukere, sikkerhet, servere og tekniske problemer.",
  },
  "2523": {
    occupationCode: "2523",
    intro: "Planlegger, drifter og forbedrer nettverk og infrastruktur, slik at systemer, enheter og kommunikasjon fungerer stabilt og sikkert.",
  },
  "2529": {
    occupationCode: "2529",
    intro: "Undersøker trusler, svakheter og digitale hendelser, og arbeider med å beskytte systemer, data og virksomheter mot sikkerhetsbrudd.",
  },
  "2611": {
    occupationCode: "2611",
    intro: "Tolker lover og regler, gir juridiske råd og bistår i tvister, avtaler og saker der rettigheter, plikter og ansvar må avklares.",
  },
  "2612": {
    occupationCode: "2612",
    intro: "Behandler rettssaker og tar stilling til bevis, regler og argumenter, før de avgjør saker med utgangspunkt i loven og sakens innhold.",
  },
  "2619": {
    occupationCode: "2619",
    intro: "Arbeider med juridiske oppgaver utenfor domstoler og advokatvirksomhet, og bistår med saksbehandling, regelverk, kontrakter og vurderinger.",
  },
  "2621": {
    occupationCode: "2621",
    intro: "Tar vare på samlinger, arkiver og kulturhistorisk materiale, og sørger for at gjenstander og dokumentasjon blir bevart, ordnet og formidlet.",
  },
  "2622": {
    occupationCode: "2622",
    intro: "Hjelper mennesker med å finne, vurdere og bruke informasjon, og arbeider med samlinger, søk, systematisering og formidling av kunnskap.",
  },
  "2631": {
    occupationCode: "2631",
    intro: "Analyserer økonomi på samfunnsnivå, og forsker på hvordan arbeid, priser, politikk og ressurser påvirker utviklingen i samfunnet.",
  },
  "2632": {
    occupationCode: "2632",
    intro: "Forsker på mennesker, grupper og samfunn, og analyserer hvordan sosiale forhold, politikk, kultur og institusjoner virker sammen.",
  },
  "2633": {
    occupationCode: "2633",
    intro: "Forsker på språk, historie, kultur og idéer, og arbeider med analyse, tolkning og formidling av menneskelige uttrykk og erfaringer.",
  },
  "2634": {
    occupationCode: "2634",
    intro: "Utreder tanker, følelser og atferd, og hjelper mennesker gjennom samtaler, tester og behandling til bedre forståelse og mestring.",
  },
  "2635": {
    occupationCode: "2635",
    intro: "Rådgir og følger opp mennesker i krevende livssituasjoner, og arbeider med støtte, koordinering, vurderinger og kontakt med tjenester.",
  },
  "2636": {
    occupationCode: "2636",
    intro: "Leder religiøse handlinger og gir åndelig veiledning, og følger opp mennesker i viktige livsfaser, kriser og fellesskap.",
  },
  "2641": {
    occupationCode: "2641",
    intro: "Skriver bøker, manus eller andre tekster, og arbeider med språk, idéutvikling, fortelling, research og bearbeiding av innhold.",
  },
  "2642": {
    occupationCode: "2642",
    intro: "Undersøker og formidler nyheter og samfunnsstoff, og arbeider med research, kilder, intervjuer, vinkling og publisering.",
  },
  "2643": {
    occupationCode: "2643",
    intro: "Oversetter språk eller tolker mellom mennesker i samtaler og møter, og sikrer at innhold, mening og nyanser blir forstått riktig.",
  },
  "2651": {
    occupationCode: "2651",
    intro: "Skaper visuelle kunstuttrykk gjennom ulike materialer og teknikker, og arbeider med idé, form, uttrykk og kunstnerisk utvikling.",
  },
  "2652": {
    occupationCode: "2652",
    intro: "Skaper, fremfører eller leder musikk, og arbeider med øving, tolkning, komposisjon, samspill og kunstnerisk uttrykk.",
  },
  "2653": {
    occupationCode: "2653",
    intro: "Skaper og fremfører dans, og arbeider med bevegelse, uttrykk, trening, koreografi og samarbeid i sceneproduksjoner.",
  },
  "2654": {
    occupationCode: "2654",
    intro: "Leder kunstneriske produksjoner for scene, film eller andre formater, og har ansvar for tolkning, uttrykk og helheten i oppsetningen.",
  },
  "2655": {
    occupationCode: "2655",
    intro: "Tolker roller og fremstiller karakterer på scene, film eller TV, og arbeider med tekst, uttrykk, samspill og formidling til publikum.",
  },
  "2656": {
    occupationCode: "2656",
    intro: "Leder sendinger og presenterer innhold for publikum, og arbeider med formidling, intervju, manus, timing og tilstedeværelse.",
  },
  "2659": {
    occupationCode: "2659",
    intro: "Fremfører kunstneriske uttrykk i andre former, og arbeider med trening, tolkning, scenisk nærvær og formidling til publikum.",
  },
  "3112": {
    occupationCode: "3112",
    intro: "Planlegger og beregner tekniske løsninger for bygg og konstruksjoner, og arbeider med tegninger, materialer, bæreevne og gjennomføring.",
  },
  "3113": {
    occupationCode: "3113",
    intro: "Utvikler og følger opp elektriske anlegg og energiløsninger, og arbeider med beregninger, sikkerhet, installasjoner og teknisk drift.",
  },
  "3114": {
    occupationCode: "3114",
    intro: "Utvikler elektroniske systemer og komponenter, og arbeider med konstruksjon, testing, feilsøking og tekniske forbedringer.",
  },
  "3115": {
    occupationCode: "3115",
    intro: "Utformer og forbedrer maskiner og mekaniske løsninger, og arbeider med konstruksjon, beregninger, produksjon og teknisk drift.",
  },
  "3116": {
    occupationCode: "3116",
    intro: "Arbeider med kjemiske prosesser, produksjon og laboratoriearbeid, og følger opp analyser, kvalitet, sikkerhet og tekniske forbedringer.",
  },
  "3117": {
    occupationCode: "3117",
    intro: "Jobber med tekniske oppgaver knyttet til olje, bergverk og metall, og følger opp drift, utstyr, prosesser og sikkerhet.",
  },
  "3118": {
    occupationCode: "3118",
    intro: "Lager tekniske tegninger og modeller som brukes i produksjon og prosjekter, og omsetter faglige krav til presist tegningsgrunnlag.",
  },
  "3119": {
    occupationCode: "3119",
    intro: "Arbeider med tekniske oppgaver innen ulike fagområder, og følger opp beregninger, tegninger, drift, testing og praktiske løsninger.",
  },
  "3121": {
    occupationCode: "3121",
    intro: "Leder arbeid i bergverksfag og følger opp sikkerhet, bemanning, utstyr, framdrift og praktisk gjennomføring under krevende forhold.",
  },
  "3122": {
    occupationCode: "3122",
    intro: "Har ansvar for å organisere arbeid i industrien, og følger opp produksjon, kvalitet, ansatte, rutiner og daglig drift.",
  },
  "3123": {
    occupationCode: "3123",
    intro: "Leder arbeid på bygge- og anleggsplasser, og følger opp framdrift, bemanning, kvalitet, sikkerhet og koordinering av faggrupper.",
  },
  "3131": {
    occupationCode: "3131",
    intro: "Overvåker og styrer systemer for energiflyt og produksjon, og passer på at anlegg fungerer stabilt, effektivt og sikkert.",
  },
  "3132": {
    occupationCode: "3132",
    intro: "Styrer tekniske anlegg for varme, kjøling eller vannrensing, og overvåker prosesser, målinger, alarmer og driftsforhold.",
  },
  "3133": {
    occupationCode: "3133",
    intro: "Overvåker kjemiske prosesser i industrien, og justerer produksjon, sikkerhet og kvalitet gjennom kontrollsystemer og måledata.",
  },
  "3134": {
    occupationCode: "3134",
    intro: "Styrer prosesser i raffineringsanlegg, og følger med på trykk, temperatur, sikkerhet og produksjonsforløp i store tekniske systemer.",
  },
  "3135": {
    occupationCode: "3135",
    intro: "Overvåker og styrer prosesser i metallproduksjon, og følger opp temperatur, råstoff, kvalitet og stabil drift i anleggene.",
  },
  "3139": {
    occupationCode: "3139",
    intro: "Styrer andre typer prosessanlegg fra kontrollrom eller ute i anlegg, og følger opp drift, kvalitet, avvik og sikkerhet.",
  },
  "3141": {
    occupationCode: "3141",
    intro: "Utfører teknisk arbeid i laboratorier utenfor medisinen, og analyserer prøver, prosesser og biologisk materiale for forskning og produksjon.",
  },
  "3142": {
    occupationCode: "3142",
    intro: "Jobber der landbruk møter teknologi, og sørger for at maskiner, sensorer og tekniske løsninger fungerer godt i den daglige driften.",
  },
  "3143": {
    occupationCode: "3143",
    intro: "Følger opp tekniske og praktiske oppgaver i skogbruket, og arbeider med planlegging, målinger, drift, utstyr og ressursforvaltning.",
  },
  "3151": {
    occupationCode: "3151",
    intro: "Har ansvar for maskineriet om bord på skip, og følger opp drift, vedlikehold, feilsøking og sikker bruk av tekniske anlegg.",
  },
  "3152": {
    occupationCode: "3152",
    intro: "Navigerer skip eller loser fartøy trygt gjennom farvann, og følger opp kurs, mannskap, sikkerhet og maritime prosedyrer.",
  },
  "3153": {
    occupationCode: "3153",
    intro: "Fører fly og har ansvar for trygg gjennomføring av flygninger, med oppfølging av navigasjon, vær, prosedyrer og samarbeid.",
  },
  "3154": {
    occupationCode: "3154",
    intro: "Styrer lufttrafikken fra tårn eller kontrollsenter, og sørger for sikker avstand, flyt og koordinering mellom fly i luftrommet.",
  },
  "3155": {
    occupationCode: "3155",
    intro: "Arbeider med tekniske systemer som påvirker flysikkerheten, og følger opp kontroll, vedlikehold, testing og dokumentasjon.",
  },
  "3211": {
    occupationCode: "3211",
    intro: "Tar bilder av kroppen ved hjelp av røntgen og annet utstyr, og bidrar til undersøkelser, diagnoser og behandling i helsetjenesten.",
  },
  "3212": {
    occupationCode: "3212",
    intro: "Analyserer blod, vev og andre prøver i laboratorier, og gir viktig grunnlag for diagnoser, behandling og medisinsk oppfølging.",
  },
  "3213": {
    occupationCode: "3213",
    intro: "Utleverer reseptpliktige legemidler og gir råd om bruk, dosering og praktiske spørsmål knyttet til medisin og helse.",
  },
  "3214": {
    occupationCode: "3214",
    intro: "Lager og tilpasser proteser, kroner, broer og andre tekniske hjelpemidler, slik at de fungerer godt og passer den enkelte.",
  },
  "3230": {
    occupationCode: "3230",
    intro: "Arbeider med behandlingsformer utenfor den etablerte medisinen, og møter mennesker som søker lindring, balanse eller alternative tilnærminger.",
  },
  "3240": {
    occupationCode: "3240",
    intro: "Følger opp dyr før, under og etter behandling, og hjelper til med stell, prøver, praktiske prosedyrer og omsorg i klinikken.",
  },
  "3251": {
    occupationCode: "3251",
    intro: "Arbeider forebyggende med tannhelse, og undersøker munnhule, renser tenner og veileder om gode vaner og videre oppfølging.",
  },
  "3254": {
    occupationCode: "3254",
    intro: "Undersøker syn og tilpasser briller, linser eller andre hjelpemidler, og veileder om synsbehov, øyehelse og bruk.",
  },
  "3256": {
    occupationCode: "3256",
    intro: "Tar imot pasienter, organiserer timeavtaler og følger opp administrative oppgaver, samtidig som de støtter arbeidet i helsepraksiser.",
  },
  "3257": {
    occupationCode: "3257",
    intro: "Kontrollerer at regler om helse, miljø og sikkerhet blir fulgt, og gjennomfører tilsyn, målinger, vurderinger og oppfølging.",
  },
  "3258": {
    occupationCode: "3258",
    intro: "Gir akutt hjelp ved sykdom og skader, og arbeider under tidspress med vurdering, behandling, transport og samarbeid med andre.",
  },
  "3259": {
    occupationCode: "3259",
    intro: "Utfører andre oppgaver innen helse og behandling, og bidrar med praktisk oppfølging, undersøkelser, støtte eller spesialisert hjelp.",
  },
  "3311": {
    occupationCode: "3311",
    intro: "Formidler kjøp og salg av finansielle produkter som aksjer, valuta eller andre instrumenter, og følger markeder, kunder og handler.",
  },
  "3312": {
    occupationCode: "3312",
    intro: "Behandler søknader og spørsmål om lån og kreditt, og vurderer økonomi, risiko, vilkår og videre oppfølging av kunder.",
  },
  "3313": {
    occupationCode: "3313",
    intro: "Fører regnskap for virksomheter, og arbeider med bokføring, avstemming, rapportering, lønn, skatt og økonomisk oversikt.",
  },
  "3315": {
    occupationCode: "3315",
    intro: "Vurderer verdi på eiendom, løsøre eller andre objekter, og bruker fagkunnskap, markedskunnskap og dokumentasjon i arbeidet.",
  },
  "3321": {
    occupationCode: "3321",
    intro: "Selger forsikringer og hjelper kunder med å velge dekninger som passer livssituasjon, risiko, behov og økonomiske rammer.",
  },
  "3322": {
    occupationCode: "3322",
    intro: "Selger varer i større kvanta til bedrifter og profesjonelle kunder, og følger opp tilbud, relasjoner, behov og leveranser.",
  },
  "3323": {
    occupationCode: "3323",
    intro: "Har ansvar for innkjøp av varer og tjenester, og vurderer pris, kvalitet, leverandører, avtaler og behov i virksomheten.",
  },
  "3324": {
    occupationCode: "3324",
    intro: "Formidler handler innen sjøfart eller annen varehandel, og kobler sammen kjøpere, selgere, frakt og markedsmuligheter.",
  },
  "3331": {
    occupationCode: "3331",
    intro: "Planlegger transport av varer og følger opp frakt, dokumentasjon, leveringstider og kontakt mellom kunder, sjåfører og transportører.",
  },
  "3332": {
    occupationCode: "3332",
    intro: "Planlegger møter, konferanser og arrangementer, og følger opp program, praktiske detaljer, deltakere, leverandører og gjennomføring.",
  },
  "3333": {
    occupationCode: "3333",
    intro: "Hjelper arbeidssøkere og arbeidsgivere med å finne hverandre, og jobber med veiledning, matching, oppfølging og arbeidsmarkedskunnskap.",
  },
  "3334": {
    occupationCode: "3334",
    intro: "Formidler salg, kjøp og drift av eiendom, og arbeider med kontrakter, visninger, oppfølging, økonomi og kontakt med kunder.",
  },
  "3339": {
    occupationCode: "3339",
    intro: "Utfører andre oppgaver innen forretningstjenester, og bidrar med koordinering, kundekontakt, planlegging eller administrativ støtte.",
  },
  "3341": {
    occupationCode: "3341",
    intro: "Leder kontoransatte i det daglige arbeidet, og følger opp rutiner, bemanning, oppgaver, kvalitet og effektiv drift på kontoret.",
  },
  "3342": {
    occupationCode: "3342",
    intro: "Støtter advokater i juridisk arbeid, og følger opp dokumenter, frister, klientkontakt, saksflyt og administrasjon.",
  },
  "3343": {
    occupationCode: "3343",
    intro: "Har en sentral støttefunksjon for ledere eller avdelinger, og følger opp møter, dokumenter, koordinering og praktiske oppgaver.",
  },
  "3351": {
    occupationCode: "3351",
    intro: "Kontrollerer varer og dokumenter ved grensepassering, og følger opp regelverk, deklarasjoner, avgifter og ulovlig innførsel eller utførsel.",
  },
  "3352": {
    occupationCode: "3352",
    intro: "Arbeider med skatteforvaltning og følger opp innrapportering, kontroll, veiledning og behandling av saker etter gjeldende regelverk.",
  },
  "3353": {
    occupationCode: "3353",
    intro: "Behandler saker om økonomiske støtteordninger og ytelser, og vurderer dokumentasjon, vilkår, rettigheter og videre oppfølging.",
  },
  "3354": {
    occupationCode: "3354",
    intro: "Behandler søknader og tillatelser knyttet til førerkort, import eller andre offentlige ordninger, og følger lover, regler og dokumentasjon.",
  },
  "3355": {
    occupationCode: "3355",
    intro: "Forebygger og håndterer kriminalitet, og arbeider med patruljering, beredskap, etterforskning, kontakt med publikum og akutte hendelser.",
  },
  "3359": {
    occupationCode: "3359",
    intro: "Utfører andre oppgaver innen offentlig forvaltning, og arbeider med saksbehandling, veiledning, kontroll og oppfølging av regelverk.",
  },
  "3411": {
    occupationCode: "3411",
    intro: "Undersøker forhold på oppdrag fra private eller virksomheter, og samler inn informasjon, observasjoner og dokumentasjon i ulike saker.",
  },
  "3412": {
    occupationCode: "3412",
    intro: "Jobber tett med mennesker som trenger støtte i hverdagen, og bidrar med relasjonsarbeid, oppfølging, aktivitet og sosial mestring.",
  },
  "3413": {
    occupationCode: "3413",
    intro: "Arbeider med religiøs veiledning, undervisning eller støttefunksjoner, og følger opp mennesker og aktiviteter i trosbaserte sammenhenger.",
  },
  "3421": {
    occupationCode: "3421",
    intro: "Trener, konkurrerer og utvikler prestasjoner innen idrett, og lever med målrettet forberedelse, fysisk arbeid og krav til resultater.",
  },
  "3422": {
    occupationCode: "3422",
    intro: "Trener utøvere eller leder konkurranser, og arbeider med regler, utvikling, vurderinger, motivasjon og gjennomføring av idrett.",
  },
  "3423": {
    occupationCode: "3423",
    intro: "Leder trening, aktivitet og bevegelse for ulike grupper, og legger opp økter som skal passe nivå, mål og trygg gjennomføring.",
  },
  "3431": {
    occupationCode: "3431",
    intro: "Tar bilder eller filmer for kunst, medier eller oppdrag, og arbeider med lys, utsnitt, teknikk, historiefortelling og etterarbeid.",
  },
  "3432": {
    occupationCode: "3432",
    intro: "Planlegger og utformer innemiljøer og dekorative løsninger, og arbeider med stil, funksjon, materialer, farger og romopplevelse.",
  },
  "3433": {
    occupationCode: "3433",
    intro: "Bevarer og vedlikeholder tekniske gjenstander og kulturmateriale, og arbeider med dokumentasjon, restaurering og skånsom håndtering.",
  },
  "3434": {
    occupationCode: "3434",
    intro: "Leder kjøkken og matproduksjon, og følger opp menyer, kvalitet, råvarer, bemanning, økonomi og faglig nivå i kjøkkenet.",
  },
  "3439": {
    occupationCode: "3439",
    intro: "Arbeider kreativt innen andre estetiske fag, og utvikler uttrykk, produkter eller opplevelser med vekt på form, stil og sansing.",
  },
  "3511": {
    occupationCode: "3511",
    intro: "Holder IT-utstyr og tekniske løsninger i drift, og arbeider med installasjon, vedlikehold, feilsøking og praktisk brukeroppfølging.",
  },
  "3512": {
    occupationCode: "3512",
    intro: "Hjelper brukere når IT-systemer eller utstyr ikke fungerer som de skal, og løser problemer gjennom veiledning og feilsøking.",
  },
  "3513": {
    occupationCode: "3513",
    intro: "Installerer, drifter og vedlikeholder nettverk og systemer, og følger opp teknisk stabilitet, sikkerhet og praktiske feil.",
  },
  "3514": {
    occupationCode: "3514",
    intro: "Arbeider med tekniske løsninger knyttet til internett og webtjenester, og følger opp drift, tilkoblinger, feil og funksjonalitet.",
  },
  "3521": {
    occupationCode: "3521",
    intro: "Installerer og vedlikeholder utstyr for radio og TV, og arbeider med signaler, sendinger, tekniske feil og kommunikasjonssystemer.",
  },
  "3522": {
    occupationCode: "3522",
    intro: "Arbeider med telekommunikasjon og følger opp nett, signaler, utstyr, feilsøking og tekniske løsninger for kommunikasjon.",
  },
  "4110": {
    occupationCode: "4110",
    intro: "Utfører administrative oppgaver på kontor, og jobber med dokumenter, registrering, kommunikasjon, arkivering og praktisk støtte.",
  },
  "4131": {
    occupationCode: "4131",
    intro: "Skriver raskt og nøyaktig etter tale eller lyd, og arbeider med referater, notater, utskrifter og annen språklig dokumentasjon.",
  },
  "4132": {
    occupationCode: "4132",
    intro: "Registrerer informasjon i systemer og databaser, og sørger for at data blir tastet inn korrekt, strukturert og tilgjengelig.",
  },
  "4211": {
    occupationCode: "4211",
    intro: "Hjelper kunder med enkle bank- og posttjenester, og arbeider med henvendelser, transaksjoner, veiledning og praktisk oppfølging.",
  },
  "4212": {
    occupationCode: "4212",
    intro: "Arbeider med spill, odds eller veddemål, og følger opp kunder, regler, innsatser og praktiske oppgaver i slike tilbud.",
  },
  "4213": {
    occupationCode: "4213",
    intro: "Gir lån mot pant og følger opp vurdering, registrering, utbetaling og tilbakebetaling knyttet til verdigjenstander.",
  },
  "4214": {
    occupationCode: "4214",
    intro: "Følger opp ubetalte krav og kontakter kunder om betaling, avtaler og videre håndtering av saker som er sendt til inkasso.",
  },
  "4221": {
    occupationCode: "4221",
    intro: "Hjelper kunder med bestilling av reiser og opphold, og arbeider med råd, alternativer, priser, reservasjoner og endringer.",
  },
  "4222": {
    occupationCode: "4222",
    intro: "Svarer på henvendelser fra kunder via telefon, e-post eller chat, og hjelper med spørsmål, problemer og videre oppfølging.",
  },
  "4223": {
    occupationCode: "4223",
    intro: "Tar imot og setter over telefoner, og sørger for at henvendelser blir besvart, registrert og sendt til riktig person.",
  },
  "4224": {
    occupationCode: "4224",
    intro: "Tar imot gjester på hotell og følger opp innsjekk, utsjekk, spørsmål, reservasjoner og praktisk service i resepsjonen.",
  },
  "4225": {
    occupationCode: "4225",
    intro: "Hjelper besøkende eller kunder i skranker og mottak, og gir informasjon, veiledning og praktisk hjelp ved oppmøte.",
  },
  "4226": {
    occupationCode: "4226",
    intro: "Tar imot besøkende, svarer på spørsmål og håndterer administrative oppgaver i resepsjoner utenfor hotellbransjen.",
  },
  "4227": {
    occupationCode: "4227",
    intro: "Samler inn svar og opplysninger gjennom intervjuer, og følger spørreskjemaer, rutiner og kontakt med ulike personer.",
  },
  "4229": {
    occupationCode: "4229",
    intro: "Gir informasjon og veiledning i andre sammenhenger, og hjelper brukere eller kunder med spørsmål, rutiner og praktiske behov.",
  },
  "4311": {
    occupationCode: "4311",
    intro: "Hjelper til med bokføring, avstemming og bilag, og utfører praktiske regnskapsoppgaver som støtter den økonomiske driften.",
  },
  "4312": {
    occupationCode: "4312",
    intro: "Arbeider med oppgaver innen bank, forsikring og finans, og følger opp kunder, dokumentasjon, avtaler og administrative prosesser.",
  },
  "4313": {
    occupationCode: "4313",
    intro: "Behandler lønn og tilhørende oppgaver, og følger opp satser, frister, trekk, utbetalinger og rapportering til myndigheter.",
  },
  "4321": {
    occupationCode: "4321",
    intro: "Holder oversikt over varer, lagerbeholdning og materialflyt, og sørger for mottak, registrering, plassering og tilgjengelighet.",
  },
  "4322": {
    occupationCode: "4322",
    intro: "Følger opp vareflyt, bestillinger og leveranser, og bidrar til at logistikkprosesser fungerer effektivt og oversiktlig.",
  },
  "4323": {
    occupationCode: "4323",
    intro: "Støtter transportarbeid gjennom planlegging, dokumentasjon og koordinering, og følger opp ruter, frakt og praktiske forhold.",
  },
  "4411": {
    occupationCode: "4411",
    intro: "Hjelper til i bibliotek med utlån, registrering, orden og service, og bidrar til at samlinger og brukere blir fulgt opp.",
  },
  "4412": {
    occupationCode: "4412",
    intro: "Sorterer og deler ut post, og sørger for at sendinger kommer fram til riktig mottaker på en effektiv måte.",
  },
  "4413": {
    occupationCode: "4413",
    intro: "Koder informasjon etter faste regler og systemer, slik at opplysninger blir korrekt registrert, sortert og brukt videre.",
  },
  "4415": {
    occupationCode: "4415",
    intro: "Hjelper til med arkivarbeid, og følger opp registrering, sortering, lagring og framfinning av dokumenter og saker.",
  },
  "4416": {
    occupationCode: "4416",
    intro: "Støtter HR-arbeid gjennom praktiske oppgaver, og følger opp personaldata, dokumenter, rutiner og kontakt med ansatte.",
  },
  "5111": {
    occupationCode: "5111",
    intro: "Tar vare på passasjerer om bord på fly eller båt, og kombinerer service med sikkerhetsrutiner, informasjon og praktisk hjelp.",
  },
  "5112": {
    occupationCode: "5112",
    intro: "Kontrollerer billetter og hjelper passasjerer under reisen, og bidrar til trygg, ryddig og effektiv transportgjennomføring.",
  },
  "5113": {
    occupationCode: "5113",
    intro: "Følger grupper eller reisende på tur, og gir informasjon, veiledning, praktisk hjelp og lokal kunnskap underveis.",
  },
  "5120": {
    occupationCode: "5120",
    intro: "Lager mat til servering og sørger for at råvarer blir behandlet riktig, slik at maten holder god kvalitet og smak.",
  },
  "5131": {
    occupationCode: "5131",
    intro: "Serverer mat og drikke og følger opp gjester gjennom måltidet, med ansvar for service, samarbeid og god flyt i lokalet.",
  },
  "5132": {
    occupationCode: "5132",
    intro: "Mikser og serverer drikke, tar imot bestillinger og skaper god stemning, samtidig som de følger rutiner og kundekontakt.",
  },
  "5141": {
    occupationCode: "5141",
    intro: "Klipper, former og styler hår, og hjelper kunder med å finne løsninger som passer utseende, ønsker og hårtype.",
  },
  "5142": {
    occupationCode: "5142",
    intro: "Gir behandlinger knyttet til hud, kropp og skjønnhet, og arbeider med pleie, produkter, hygiene og kundeopplevelse.",
  },
  "5151": {
    occupationCode: "5151",
    intro: "Leder renholdsarbeid i virksomheter, og følger opp ansatte, planer, kvalitet, utstyr og gjennomføring av renholdsoppgaver.",
  },
  "5152": {
    occupationCode: "5152",
    intro: "Har ansvar for praktisk drift og orden i private hjem eller institusjoner, og følger opp innkjøp, måltider, vask og rutiner.",
  },
  "5153": {
    occupationCode: "5153",
    intro: "Tar hånd om vedlikehold og praktiske oppgaver i bygg, og sørger for at lokaler, utstyr og uteområder fungerer som de skal.",
  },
  "5161": {
    occupationCode: "5161",
    intro: "Tilbyr tjenester knyttet til astrologi eller lignende felt, og møter mennesker som søker råd, tolkning eller refleksjon.",
  },
  "5163": {
    occupationCode: "5163",
    intro: "Hjelper familier ved dødsfall og følger opp praktiske og seremonielle oppgaver, med ansvar for verdighet, logistikk og støtte.",
  },
  "5164": {
    occupationCode: "5164",
    intro: "Tar vare på dyr i ulike miljøer, og arbeider med stell, trening, fôring, aktivitet og oppfølging av dyrenes behov.",
  },
  "5165": {
    occupationCode: "5165",
    intro: "Lærer bort trygg og riktig kjøring, og hjelper elever med regler, vurderinger, øving og forståelse av trafikale situasjoner.",
  },
  "5169": {
    occupationCode: "5169",
    intro: "Yter personlige tjenester i andre sammenhenger, og arbeider med praktisk hjelp, service, oppfølging og kundekontakt.",
  },
  "5211": {
    occupationCode: "5211",
    intro: "Selger varer direkte på torg og markeder, og arbeider med kundekontakt, oppstilling, prising og enkel varehåndtering.",
  },
  "5212": {
    occupationCode: "5212",
    intro: "Selger mat fra gatekjøkken eller utsalg, og arbeider med kundeservice, enkel matlaging, betaling og rask ekspedering.",
  },
  "5221": {
    occupationCode: "5221",
    intro: "Driver en liten butikk eller kiosk og følger opp vareutvalg, kunder, åpningstider, innkjøp og den daglige driften.",
  },
  "5222": {
    occupationCode: "5222",
    intro: "Leder en avdeling i butikk, og følger opp salg, varer, ansatte, kampanjer, kundeservice og mål for avdelingen.",
  },
  "5223": {
    occupationCode: "5223",
    intro: "Selger varer i butikk og hjelper kunder med valg, spørsmål, betaling, varepåfylling og orden i lokalet.",
  },
  "5230": {
    occupationCode: "5230",
    intro: "Selger billetter til transport, arrangementer eller tjenester, og hjelper kunder med informasjon, betaling og praktiske spørsmål.",
  },
  "5241": {
    occupationCode: "5241",
    intro: "Viser fram klær, produkter eller uttrykk i reklame og presentasjoner, og arbeider med formidling, stil og visuell representasjon.",
  },
  "5242": {
    occupationCode: "5242",
    intro: "Viser fram og forklarer produkter for å skape interesse og salg, og jobber med kontakt, presentasjon og kundebehandling.",
  },
  "5243": {
    occupationCode: "5243",
    intro: "Selger varer eller tjenester direkte ved oppsøkende kontakt, og arbeider med presentasjon, overbevisning og oppfølging.",
  },
  "5244": {
    occupationCode: "5244",
    intro: "Selger via telefon eller nett, og arbeider med kontakt, behovsavklaring, tilbud, kundedialog og oppfølging av salg.",
  },
  "5245": {
    occupationCode: "5245",
    intro: "Hjelper kunder på bensinstasjon med varer og tjenester, og arbeider med betaling, påfylling, orden og praktisk service.",
  },
  "5246": {
    occupationCode: "5246",
    intro: "Serverer enkel mat og drikke i gatekjøkken eller kafé, og arbeider med kundeservice, tilberedning og ryddig drift.",
  },
  "5249": {
    occupationCode: "5249",
    intro: "Utfører andre typer salgsarbeid og hjelper kunder med varer, informasjon, betaling, presentasjon og oppfølging.",
  },
  "5311": {
    occupationCode: "5311",
    intro: "Hjelper barn i lek, aktivitet og hverdagsrutiner i barnehage eller skolefritid, og gir støtte, omsorg og praktisk oppfølging.",
  },
  "5312": {
    occupationCode: "5312",
    intro: "Støtter elever i skolehverdagen og hjelper til med praktiske oppgaver, læring, trivsel og tilrettelegging etter behov.",
  },
  "5321": {
    occupationCode: "5321",
    intro: "Gir grunnleggende pleie og omsorg til mennesker som trenger hjelp, og følger opp daglige behov, observasjoner og praktiske oppgaver.",
  },
  "5322": {
    occupationCode: "5322",
    intro: "Hjelper mennesker hjemme med husarbeid og daglige gjøremål, slik at de kan bo trygt og fungere best mulig i hverdagen.",
  },
  "5329": {
    occupationCode: "5329",
    intro: "Gir omsorg og praktisk hjelp i andre sammenhenger, og følger opp mennesker som trenger støtte i daglige situasjoner.",
  },
  "5411": {
    occupationCode: "5411",
    intro: "Rykker ut ved brann, ulykker og redningsoppdrag, og arbeider med slokking, sikring, beredskap og akutt innsats.",
  },
  "5413": {
    occupationCode: "5413",
    intro: "Følger opp innsatte i fengsel og bidrar til sikkerhet, orden, kontakt og praktisk gjennomføring av hverdagen i anstalten.",
  },
  "5414": {
    occupationCode: "5414",
    intro: "Passer på personer, bygninger og områder, og arbeider med kontroll, tilstedeværelse, forebygging og håndtering av hendelser.",
  },
  "5419": {
    occupationCode: "5419",
    intro: "Utfører andre typer sikkerhetsarbeid, og bidrar til kontroll, beredskap, trygghet og forebygging i ulike miljøer.",
  },
  "6111": {
    occupationCode: "6111",
    intro: "Dyrker korn og grønnsaker og følger opp jord, maskiner, såing, vekst, innhøsting og kvalitet gjennom sesongen.",
  },
  "6112": {
    occupationCode: "6112",
    intro: "Produserer frukt og bær og arbeider med planting, stell, beskjæring, innhøsting og kvalitet i produksjonen.",
  },
  "6113": {
    occupationCode: "6113",
    intro: "Steller planter og grønne områder, og arbeider med dyrking, vedlikehold, planting, beskjæring og praktiske oppgaver ute.",
  },
  "6114": {
    occupationCode: "6114",
    intro: "Driver med flere typer nyttevekster på samme bruk, og følger opp jord, såing, vekst, maskiner og innhøsting.",
  },
  "6121": {
    occupationCode: "6121",
    intro: "Steller melkekyr eller andre husdyr, og arbeider med fôring, helse, drift, produksjon og oppfølging gjennom året.",
  },
  "6122": {
    occupationCode: "6122",
    intro: "Driver med egg- eller fjørfeproduksjon og følger opp dyr, fôr, miljøforhold, produksjon og hygiene i anleggene.",
  },
  "6123": {
    occupationCode: "6123",
    intro: "Holder bier og følger opp kuber, svermer, helse og honningproduksjon, med vekt på stell og sesongarbeid.",
  },
  "6129": {
    occupationCode: "6129",
    intro: "Arbeider med oppdrett og stell av andre dyr, og følger opp fôring, helse, avl, miljø og praktiske rutiner.",
  },
  "6130": {
    occupationCode: "6130",
    intro: "Driver gårdsbruk med både planter og dyr, og balanserer ulike oppgaver knyttet til drift, stell, produksjon og vedlikehold.",
  },
  "6210": {
    occupationCode: "6210",
    intro: "Arbeider med drift og forvaltning av skog, og følger opp planting, hogst, skjøtsel, veier og bærekraftig ressursbruk.",
  },
  "6221": {
    occupationCode: "6221",
    intro: "Arbeider med oppdrett i sjø eller på land, og følger opp fôring, fiskehelse, anlegg, utstyr og daglig drift.",
  },
  "6222": {
    occupationCode: "6222",
    intro: "Fanger fisk kommersielt og arbeider med redskap, navigasjon, fangst, håndtering av råstoff og forholdene på sjøen.",
  },
  "6224": {
    occupationCode: "6224",
    intro: "Driver fangst av ville dyr eller marine ressurser, og arbeider med utstyr, sikkerhet, håndtering og krevende naturforhold.",
  },
  "7112": {
    occupationCode: "7112",
    intro: "Murer vegger, piper og andre konstruksjoner i tegl eller blokk, og arbeider med oppmåling, puss og nøyaktig utførelse.",
  },
  "7113": {
    occupationCode: "7113",
    intro: "Former og bearbeider stein til bygg, monumenter eller andre formål, og arbeider med verktøy, presisjon og overflate.",
  },
  "7114": {
    occupationCode: "7114",
    intro: "Støper, former og bearbeider betong i bygg og anlegg, og arbeider med forskaling, armering og etterbehandling.",
  },
  "7115": {
    occupationCode: "7115",
    intro: "Setter opp trekonstruksjoner og innredning, og arbeider med bygging, montering, tilpasning og praktiske løsninger på stedet.",
  },
  "7119": {
    occupationCode: "7119",
    intro: "Utfører andre typer praktisk bygningsarbeid, og bidrar til oppføring, montering, vedlikehold og ferdigstillelse av bygg.",
  },
  "7121": {
    occupationCode: "7121",
    intro: "Legger og reparerer tak, og sørger for at bygninger blir tette, holdbare og godt beskyttet mot vær og slitasje.",
  },
  "7122": {
    occupationCode: "7122",
    intro: "Legger gulv og fliser med nøyaktig tilpasning, og arbeider med underlag, mønster, finish og slitesterke løsninger.",
  },
  "7123": {
    occupationCode: "7123",
    intro: "Monterer gips og utfører sparkling, slik at vegger og tak får jevne flater som er klare for videre arbeid.",
  },
  "7124": {
    occupationCode: "7124",
    intro: "Isolerer bygninger, anlegg eller tekniske installasjoner, og arbeider med materialer som skal redusere varmetap og støy.",
  },
  "7125": {
    occupationCode: "7125",
    intro: "Monterer, tilpasser og reparerer glass i bygninger eller andre løsninger, og arbeider med presisjon, sikkerhet og finish.",
  },
  "7126": {
    occupationCode: "7126",
    intro: "Installerer rør, sanitæranlegg og varmeløsninger, og arbeider med vann, avløp, varme og tekniske installasjoner i bygg.",
  },
  "7127": {
    occupationCode: "7127",
    intro: "Monterer og vedlikeholder kjøle- og fryseanlegg, og arbeider med temperaturstyring, rør, gasser og tekniske systemer.",
  },
  "7131": {
    occupationCode: "7131",
    intro: "Maler og tapetserer bygninger, og sørger for at overflater får riktig behandling, beskyttelse og et godt ferdig uttrykk.",
  },
  "7132": {
    occupationCode: "7132",
    intro: "Behandler og lakkerer overflater på ulike materialer, og arbeider med forarbeid, påføring, finish og holdbarhet.",
  },
  "7133": {
    occupationCode: "7133",
    intro: "Rengjør piper, fasader og utsatte flater, og arbeider med sikkerhet, forebygging og vedlikehold av bygninger.",
  },
  "7211": {
    occupationCode: "7211",
    intro: "Arbeider med smelting og forming av metall i former, og følger opp temperatur, materialkvalitet og støpeprosesser.",
  },
  "7212": {
    occupationCode: "7212",
    intro: "Sammenføyer metall ved hjelp av sveising, og arbeider med varme, presisjon, styrke og kvalitet i konstruksjoner og deler.",
  },
  "7213": {
    occupationCode: "7213",
    intro: "Former og monterer plater og beslag i metall, og arbeider med tak, kanaler, detaljer og tilpassede løsninger.",
  },
  "7214": {
    occupationCode: "7214",
    intro: "Bearbeider metallplater til ulike produkter og konstruksjoner, og arbeider med kutting, forming, montering og tilpasning.",
  },
  "7215": {
    occupationCode: "7215",
    intro: "Arbeider med løft, rigg og sammenføyning av tau og utstyr, ofte i krevende miljøer der sikkerhet er avgjørende.",
  },
  "7221": {
    occupationCode: "7221",
    intro: "Former og bearbeider metall med varme og verktøy, og lager eller reparerer deler, redskap og konstruksjoner.",
  },
  "7222": {
    occupationCode: "7222",
    intro: "Lager presise verktøy og mekaniske deler, og arbeider også med låser eller finmekanikk som krever nøyaktig håndverk.",
  },
  "7223": {
    occupationCode: "7223",
    intro: "Bearbeider metall på dreiebenk eller lignende maskiner, og lager deler med nøyaktige mål og tekniske krav.",
  },
  "7224": {
    occupationCode: "7224",
    intro: "Sliper metallflater og deler til riktig form eller finish, og arbeider med presisjon, kvalitet og bearbeiding.",
  },
  "7231": {
    occupationCode: "7231",
    intro: "Utfører service og reparasjoner på biler, og arbeider med motor, bremser, elektronikk, feilsøking og vedlikehold.",
  },
  "7232": {
    occupationCode: "7232",
    intro: "Vedlikeholder og reparerer tekniske systemer i fly, og arbeider med høye krav til sikkerhet, nøyaktighet og dokumentasjon.",
  },
  "7233": {
    occupationCode: "7233",
    intro: "Reparerer og vedlikeholder store maskiner og anlegg, og arbeider med hydraulikk, motorer, mekanikk og tekniske feil.",
  },
  "7234": {
    occupationCode: "7234",
    intro: "Reparerer sykler og lignende utstyr, og arbeider med justering, utskifting av deler og praktisk vedlikehold.",
  },
  "7311": {
    occupationCode: "7311",
    intro: "Lager og reparerer presisjonsinstrumenter og finmekaniske produkter, og arbeider med små detaljer og høy nøyaktighet.",
  },
  "7312": {
    occupationCode: "7312",
    intro: "Lager, reparerer og stemmer instrumenter, og arbeider med lyd, materialer, håndverk og finjustering av detaljer.",
  },
  "7313": {
    occupationCode: "7313",
    intro: "Lager, reparerer og utsmykker produkter i edle metaller, og arbeider med detaljarbeid, formgiving og overflate.",
  },
  "7314": {
    occupationCode: "7314",
    intro: "Former leire og keramiske materialer til bruksgjenstander eller kunst, og arbeider med teknikk, brenning og uttrykk.",
  },
  "7315": {
    occupationCode: "7315",
    intro: "Former og bearbeider glass til bruk, kunst eller dekor, og arbeider med varme, form og visuell kvalitet.",
  },
  "7316": {
    occupationCode: "7316",
    intro: "Malte dekorative motiver eller detaljer på flater og gjenstander, og arbeider med mønster, presisjon og estetisk uttrykk.",
  },
  "7317": {
    occupationCode: "7317",
    intro: "Lager gjenstander og dekor i tre, og kombinerer håndverk, materialkunnskap og formgiving i praktisk arbeid.",
  },
  "7318": {
    occupationCode: "7318",
    intro: "Produserer tekstiler og strikkede produkter innen husflid, og arbeider med mønstre, teknikk, materialer og håndlagde uttrykk.",
  },
  "7319": {
    occupationCode: "7319",
    intro: "Utfører annet kunsthåndverk og lager gjenstander med tydelig preg av håndverk, formgivning og materialforståelse.",
  },
  "7321": {
    occupationCode: "7321",
    intro: "Forbereder filer og oppsett før trykking, og sørger for at tekst, bilder og format blir klare for produksjon.",
  },
  "7322": {
    occupationCode: "7322",
    intro: "Betjener trykkpresser og produserer trykksaker, med ansvar for kvalitet, farger, papir og jevn produksjonsflyt.",
  },
  "7323": {
    occupationCode: "7323",
    intro: "Setter sammen og ferdigstiller bøker eller andre trykksaker, og arbeider med kutting, bretting, liming og innbinding.",
  },
  "7411": {
    occupationCode: "7411",
    intro: "Installerer og vedlikeholder elektriske anlegg, og arbeider med kabler, sikringer, tavler og sikker strømforsyning.",
  },
  "7412": {
    occupationCode: "7412",
    intro: "Installerer og programmerer automatiserte systemer, og arbeider med styring, sensorer, feilsøking og teknisk drift.",
  },
  "7413": {
    occupationCode: "7413",
    intro: "Bygger og vedlikeholder strømnett og energianlegg, og arbeider ute med kabler, stolper, sikkerhet og forsyning.",
  },
  "7421": {
    occupationCode: "7421",
    intro: "Reparerer og vedlikeholder elektronisk serviceutstyr, og arbeider med testing, komponenter, feilsøking og kundeløsninger.",
  },
  "7422": {
    occupationCode: "7422",
    intro: "Installerer tele- og datautstyr i bygg og anlegg, og arbeider med kabling, nettverk, signaler og oppkobling.",
  },
  "7511": {
    occupationCode: "7511",
    intro: "Skjærer opp, bearbeider og selger kjøtt eller fisk, og arbeider med hygiene, kvalitet, produktkunnskap og kundeservice.",
  },
  "7512": {
    occupationCode: "7512",
    intro: "Baker brød, kaker og andre bakervarer, og arbeider med deig, råvarer, steking, pynting og kvalitet i produksjonen.",
  },
  "7513": {
    occupationCode: "7513",
    intro: "Lager ost i mindre skala og følger opp melk, prosess, hygiene, modning og kvalitet gjennom hele produksjonen.",
  },
  "7514": {
    occupationCode: "7514",
    intro: "Lager saft, syltetøy og lignende produkter fra råvarer på gård, og arbeider med koking, hygiene og holdbarhet.",
  },
  "7515": {
    occupationCode: "7515",
    intro: "Smaker og vurderer kvaliteten på mat og drikke, og bruker sanser og fagkunnskap til å bedømme smak, lukt og helhet.",
  },
  "7522": {
    occupationCode: "7522",
    intro: "Lager møbler i tre og arbeider med mål, materialer, sammenføyning, finish og godt håndverk i detaljene.",
  },
  "7531": {
    occupationCode: "7531",
    intro: "Syr og tilpasser klær eller arbeider med pels, og kombinerer håndverk, passform, detaljer og materialkunnskap.",
  },
  "7532": {
    occupationCode: "7532",
    intro: "Tilpasser mønstre og størrelser i klesproduksjon, slik at plagg får riktige mål, proporsjoner og passform.",
  },
  "7534": {
    occupationCode: "7534",
    intro: "Trekker om og bygger opp møbler med stopping og tekstiler, og arbeider med komfort, detaljer og finish.",
  },
  "7535": {
    occupationCode: "7535",
    intro: "Bearbeider skinn og lær fra råvare til brukbart materiale, og arbeider med kjemi, overflate og holdbarhet.",
  },
  "7536": {
    occupationCode: "7536",
    intro: "Lager og reparerer sko, og arbeider med passform, såler, materialer og praktiske løsninger for bruk og slitestyrke.",
  },
  "7541": {
    occupationCode: "7541",
    intro: "Utfører arbeid under vann, og bruker spesialisert utstyr for inspeksjon, montering, reparasjon eller redningsoppdrag.",
  },
  "7542": {
    occupationCode: "7542",
    intro: "Planlegger og gjennomfører sprengningsarbeid, og arbeider med boring, ladning, sikkerhet og kontroll i krevende omgivelser.",
  },
  "7543": {
    occupationCode: "7543",
    intro: "Tester produkter for å se hvordan de fungerer i bruk, og vurderer kvalitet, feil, sikkerhet og forbedringsmuligheter.",
  },
  "7544": {
    occupationCode: "7544",
    intro: "Arbeider med å forebygge eller fjerne smitte, skadedyr og skadelige organismer, og følger strenge rutiner og tiltak.",
  },
  "7549": {
    occupationCode: "7549",
    intro: "Utfører andre typer håndverksarbeid, og lager, reparerer eller tilpasser produkter gjennom praktisk og materialbasert arbeid.",
  },
  "8111": {
    occupationCode: "8111",
    intro: "Arbeider med uttak av stein og mineraler, og følger opp boring, sprengning, utstyr, sikkerhet og praktiske oppgaver.",
  },
  "8112": {
    occupationCode: "8112",
    intro: "Overvåker og styrer prosesser som skiller ut eller bearbeider mineraler, og følger opp drift, målinger og kvalitet.",
  },
  "8113": {
    occupationCode: "8113",
    intro: "Betjener utstyr knyttet til boring i ulike miljøer, og følger opp prosess, sikkerhet, framdrift og teknisk drift.",
  },
  "8114": {
    occupationCode: "8114",
    intro: "Betjener produksjonsutstyr for betong eller lignende produkter, og arbeider med blanding, forming, kontroll og flyt.",
  },
  "8121": {
    occupationCode: "8121",
    intro: "Styrer prosesser der metaller smeltes og bearbeides, og følger opp temperatur, råstoff, kvalitet og sikker drift.",
  },
  "8122": {
    occupationCode: "8122",
    intro: "Betjener utstyr som behandler eller beskytter metallflater, og følger opp kjemi, prosess og overflatekvalitet.",
  },
  "8131": {
    occupationCode: "8131",
    intro: "Betjener anlegg i kjemisk industri og følger opp produksjon, målinger, sikkerhet og kvalitet i prosessene.",
  },
  "8132": {
    occupationCode: "8132",
    intro: "Arbeider i produksjon av spesialprodukter som fotofilm eller papir, og følger opp maskiner, kjemi og kvalitet.",
  },
  "8141": {
    occupationCode: "8141",
    intro: "Betjener maskiner som lager gummiprodukter, og følger opp råstoff, forming, kvalitet og jevn produksjon.",
  },
  "8142": {
    occupationCode: "8142",
    intro: "Betjener utstyr som produserer plastprodukter, og følger opp temperatur, former, råstoff og kvalitet i prosessen.",
  },
  "8143": {
    occupationCode: "8143",
    intro: "Betjener maskiner som lager papirprodukter, og arbeider med flyt, kontroll, råstoff og ferdiggjøring.",
  },
  "8151": {
    occupationCode: "8151",
    intro: "Styrer maskiner som spinner eller nøster tekstiltråd, og følger opp hastighet, kvalitet og jevn produksjon.",
  },
  "8152": {
    occupationCode: "8152",
    intro: "Betjener maskiner i tekstilproduksjon, og arbeider med råstoff, prosess, kvalitet og drift av produksjonslinjer.",
  },
  "8153": {
    occupationCode: "8153",
    intro: "Syr tekstilprodukter i industrien, og arbeider raskt og nøyaktig med maskiner, søm, materialer og produksjonskrav.",
  },
  "8154": {
    occupationCode: "8154",
    intro: "Betjener utstyr som behandler tekstiler videre, og følger opp finish, kvalitet, prosess og tekniske innstillinger.",
  },
  "8155": {
    occupationCode: "8155",
    intro: "Arbeider med bearbeiding av pels, skinn og lær, og følger opp materialer, maskiner og kvalitet i prosessen.",
  },
  "8156": {
    occupationCode: "8156",
    intro: "Betjener maskiner eller utstyr som lager produkter av lær, og arbeider med forming, montering og kvalitet.",
  },
  "8157": {
    occupationCode: "8157",
    intro: "Styrer maskiner for vask og rens av tekstiler, og følger opp kjemi, temperatur, sortering og skånsom behandling.",
  },
  "8159": {
    occupationCode: "8159",
    intro: "Utfører andre typer maskinarbeid innen tekstiler, skinn og lær, og følger opp produksjon, kvalitet og flyt.",
  },
  "8160": {
    occupationCode: "8160",
    intro: "Betjener utstyr i produksjon av mat og drikke, og følger opp råvarer, hygiene, prosess og kvalitet underveis.",
  },
  "8171": {
    occupationCode: "8171",
    intro: "Styrer maskiner som bearbeider tre til papir, plater eller andre produkter, og følger opp råstoff og drift.",
  },
  "8172": {
    occupationCode: "8172",
    intro: "Betjener anlegg som skjærer og bearbeider tømmer, og følger opp maskiner, dimensjoner og flyt i produksjonen.",
  },
  "8181": {
    occupationCode: "8181",
    intro: "Styrer maskiner som lager produkter i glass eller keramikk, og arbeider med varme, former og kvalitet.",
  },
  "8182": {
    occupationCode: "8182",
    intro: "Overvåker kjeler, turbiner og energianlegg, og følger opp trykk, temperatur, drift og sikker produksjon.",
  },
  "8183": {
    occupationCode: "8183",
    intro: "Betjener maskiner som pakker, tapper eller merker produkter, og følger opp flyt, nøyaktighet og driftsstabilitet.",
  },
  "8189": {
    occupationCode: "8189",
    intro: "Styrer andre typer stasjonære maskiner, og følger opp produksjon, innstillinger, kvalitet og tekniske avvik.",
  },
  "8211": {
    occupationCode: "8211",
    intro: "Monterer mekaniske produkter og setter sammen deler til ferdige enheter, med vekt på nøyaktighet og jevn kvalitet.",
  },
  "8212": {
    occupationCode: "8212",
    intro: "Monterer elektriske og elektroniske produkter, og arbeider med komponenter, ledninger, testing og korrekt sammenstilling.",
  },
  "8219": {
    occupationCode: "8219",
    intro: "Utfører annet monteringsarbeid og setter sammen produkter eller deler etter tegninger, rutiner og kvalitetskrav.",
  },
  "8311": {
    occupationCode: "8311",
    intro: "Fører tog eller T-bane og har ansvar for sikker framføring, rutetider, signaler og trygg transport av passasjerer.",
  },
  "8312": {
    occupationCode: "8312",
    intro: "Arbeider med skifting og klargjøring av vogner, og følger opp rangering, sikkerhet og praktisk jernbanedrift.",
  },
  "8322": {
    occupationCode: "8322",
    intro: "Kjører personbil, taxi eller varebil og følger opp passasjerer eller leveranser, med ansvar for sikker og effektiv transport.",
  },
  "8331": {
    occupationCode: "8331",
    intro: "Kjører buss eller trikk og transporterer passasjerer trygt etter rute, samtidig som de følger trafikk og kundekontakt.",
  },
  "8332": {
    occupationCode: "8332",
    intro: "Kjører tunge kjøretøy over korte eller lange strekninger, og følger opp last, sikkerhet, ruter og leveringstider.",
  },
  "8341": {
    occupationCode: "8341",
    intro: "Kjører maskiner i jord- og skogbruk, og arbeider med oppgaver som såing, høsting, transport og terrengarbeid.",
  },
  "8342": {
    occupationCode: "8342",
    intro: "Betjener gravemaskiner og andre store anleggsmaskiner, og utfører arbeid med presisjon, sikkerhet og kontroll.",
  },
  "8343": {
    occupationCode: "8343",
    intro: "Fører kraner, heiser eller lignende utstyr, og arbeider med tunge løft, sikker plassering og kontroll av last.",
  },
  "8344": {
    occupationCode: "8344",
    intro: "Kjører truck og flytter varer på lager eller terminal, med ansvar for sikker håndtering, plassering og effektiv flyt.",
  },
  "8350": {
    occupationCode: "8350",
    intro: "Utfører praktiske oppgaver om bord på skip, og følger opp dekk, maskin, vedlikehold, sikkerhet og drift.",
  },
  "9111": {
    occupationCode: "9111",
    intro: "Utfører renhold i hjem og sørger for orden, hygiene og trivsel gjennom vask, rydding og praktiske oppgaver.",
  },
  "9112": {
    occupationCode: "9112",
    intro: "Utfører renhold i bedrifter og offentlige bygg, og sørger for rene lokaler, hygiene og gode rutiner i arbeidsmiljøet.",
  },
  "9122": {
    occupationCode: "9122",
    intro: "Vasker kjøretøy innvendig og utvendig, og arbeider med rengjøring, pleieprodukter og et godt ferdig resultat.",
  },
  "9123": {
    occupationCode: "9123",
    intro: "Rengjør vinduer og glassflater, ofte i høyden, og arbeider med sikkerhet, grundighet og godt visuelt resultat.",
  },
  "9129": {
    occupationCode: "9129",
    intro: "Utfører andre typer rengjøring og holder lokaler eller områder rene gjennom praktisk arbeid, rutiner og grundighet.",
  },
  "9211": {
    occupationCode: "9211",
    intro: "Hjelper til i dyrking av nyttevekster, og arbeider med planting, luking, vanning, innhøsting og annet sesongarbeid.",
  },
  "9212": {
    occupationCode: "9212",
    intro: "Hjelper til i husdyrproduksjon og utfører praktiske oppgaver knyttet til fôring, stell, rengjøring og daglig drift.",
  },
  "9213": {
    occupationCode: "9213",
    intro: "Utfører praktiske oppgaver på gårdsbruk med både planter og dyr, og hjelper til med drift, stell og vedlikehold.",
  },
  "9214": {
    occupationCode: "9214",
    intro: "Hjelper til i gartneri og lignende virksomheter, og arbeider med planter, jord, vanning, høsting og praktiske oppgaver.",
  },
  "9215": {
    occupationCode: "9215",
    intro: "Hjelper til i skogbruket med planting, rydding, vedlikehold og annet fysisk arbeid ute i skog og terreng.",
  },
  "9216": {
    occupationCode: "9216",
    intro: "Utfører enkle og praktiske oppgaver i havbruk, og hjelper til med fôring, rengjøring, utstyr og daglig drift.",
  },
  "9311": {
    occupationCode: "9311",
    intro: "Hjelper til i bergverk med fysisk arbeid, rydding, transport, vedlikehold og andre praktiske oppgaver på anlegg.",
  },
  "9312": {
    occupationCode: "9312",
    intro: "Utfører praktiske oppgaver på anlegg, og hjelper til med transport, rydding, klargjøring og støtte til fagarbeidere.",
  },
  "9313": {
    occupationCode: "9313",
    intro: "Hjelper til på byggeplass med bæring, rydding, klargjøring og andre praktiske oppgaver som får arbeidet til å flyte.",
  },
  "9321": {
    occupationCode: "9321",
    intro: "Pakker varer manuelt og gjør dem klare for lagring, sending eller salg, med vekt på tempo, nøyaktighet og orden.",
  },
  "9329": {
    occupationCode: "9329",
    intro: "Utfører annet enkelt arbeid i industrien, og hjelper til med pakking, flytting, rengjøring og støtte til produksjonen.",
  },
  "9331": {
    occupationCode: "9331",
    intro: "Fører kjøretøy uten motor, og transporterer varer eller personer ved hjelp av sykkel, kjerre eller lignende løsninger.",
  },
  "9333": {
    occupationCode: "9333",
    intro: "Laster og losser varer manuelt eller med hjelpemidler, og arbeider med fysisk håndtering, sortering og flyt.",
  },
  "9334": {
    occupationCode: "9334",
    intro: "Fyller på varer i butikk eller lager, og sørger for at hyller og utstillinger er ryddige, fulle og oversiktlige.",
  },
  "9412": {
    occupationCode: "9412",
    intro: "Hjelper til på kjøkken med enkel matforberedelse, oppvask, rydding og praktiske oppgaver som støtter matproduksjonen.",
  },
  "9510": {
    occupationCode: "9510",
    intro: "Deler ut reklame, aviser eller annet materiale, og følger ruter, levering og praktisk håndtering av utsendinger.",
  },
  "9611": {
    occupationCode: "9611",
    intro: "Samler inn og håndterer avfall, og arbeider med tømming, transport, sikkerhet og praktisk drift i renovasjonstjenester.",
  },
  "9612": {
    occupationCode: "9612",
    intro: "Sorterer og håndterer avfall til gjenbruk eller videre behandling, og arbeider med miljø, sikkerhet og praktiske rutiner.",
  },
  "9613": {
    occupationCode: "9613",
    intro: "Rengjør gater og uteområder, og bidrar til ryddige omgivelser gjennom feiing, vedlikehold og praktisk utearbeid.",
  },
  "9621": {
    occupationCode: "9621",
    intro: "Leverer varer, mat eller dokumenter raskt og presist, og følger opp ruter, tidspunkter og praktisk kundekontakt.",
  },
  "9622": {
    occupationCode: "9622",
    intro: "Utfører mange ulike praktiske oppgaver der det trengs, og hjelper til med vedlikehold, reparasjoner, flytting eller montering.",
  },
  "9623": {
    occupationCode: "9623",
    intro: "Leser av målere og registrerer forbruk eller tekniske data, og følger opp nøyaktighet, rutiner og dokumentasjon.",
  },
  "9629": {
    occupationCode: "9629",
    intro: "Utfører andre typer enkelt, praktisk arbeid, og hjelper til der det trengs med oppgaver som støtter drift og gjennomføring.",
  },
};

export function getOccupationDescription(occupationCode: string) {
  return occupationDescriptions[occupationCode] ?? null;
}