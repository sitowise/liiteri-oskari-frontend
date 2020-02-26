Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "StatsGrid",
    "value": {
        "title": "Tilastot",
        "desc": "",
        "tile": {
            "title": "Tilastot",
            "standardStats": "Tilastot",
            "twoWayStats": "Työmatka-analyysit"
        },
        "view": {
            "title": "Tilastot",
            "message": "patiopoc",
			"tooltip": "Tilastot"
        },
        "tab": {
            "title": "Tilastot",
            "description": "Omat indikaattorit",
            "grid": {
                "name": "Otsikko",
                "description": "Kuvaus",
                "organization": "Tietolähde",
                "year": "Vuosi",
                "delete": "Poista"
            },
            "deleteTitle": "Tilaston poistaminen",
            "destroyIndicator": "Poista",
            "cancelDelete": "Peruuta",
            "confirmDelete": "Haluatko varmasti poistaa tilaston ",
            "newIndicator": "Uusi tilasto",
            "error": {
                "title": "Virhe",
                "indicatorsError": "Virhe tilastojen latauksessa. Yritä myöhemmin uudelleen",
                "indicatorError": "Virhe tilaston latauksessa. Yritä myöhemmin uudelleen",
                "indicatorDeleteError": "Virhe tilaston poistossa. Yritä myöhemmin uudelleen"
            }
        },
        "gender": "Sukupuoli",
        "genders": {
            "male": "miehet",
            "female": "naiset",
            "total": "yhteensä"
        },
        "direction": "Esityssuunta",
        "directions": {
            "work": "Työalueittain",
            "home": "Kotialueittain"
        },
        "type": "Tilasto",
        "addColumn": "Laske",
        "addColumnFromArea": "Lisää karttarajaus",
        "addColumnFromRegionFilter": "Lisää aluerajaus",
        "clearColumn": "Tyhjennä valinnat",
        "createChart": "Luo diagrammi",
        "errorTitle": "Virhe",
        "noIndicator": "Yhtään tilastoa ei ole valittu",
        "removeColumn": "Poista",
        "indicators": "Taulu",
        "cannotDisplayIndicator": "Tilastolla ei ole arvoja valitsemallasi aluejaolla, joten sitä ei voida näyttää taulukossa.",
        "availableRegions": "Arvot löytyvät seuraaville aluejaoille:",
        "numberOfSelectedIndicators": "Olet valinnut {0} tilastoa.",
        "year": "Vuosi",
        "createIntersection": "Muodosta valittujen toiminnallisten alueiden leikkaus (valitse vain kaksi aluetta)",
        "buttons": {
            "ok": "Sulje",
            "cancel": "Sulje",
            "filter": "Suodata",
            "close": "Lopeta",
            "finish": "Lopeta",
            "save": "Hyväksy",
            "saveAsMyPlace": "Tallenna omaksi paikaksi",
            "movePlaces": "Siirrä kohteet ja poista",
            "deleteCategory": "Poista",
            "deleteCategoryAndPlaces": "Poista kohteineen",
            "changeToPublic": "Muuta julkiseksi",
            "changeToPrivate": "Muuta yksityiseksi"
        },
        "stats": {
            "municipality": "Kunta",
            "code": "Koodi",
            "errorTitle": "Virhe",
            "regionDataError": "Kuntatietojen haussa tapahtui virhe. Yritä myöhemmin uudelleen.",
            "regionDataXHRError": "Aineistoon ei saatu yhteyttä. Yritä myöhemmin uudelleen.",
            "indicatorsDataError": "Indikaattorin haussa tapahtui virhe. Yritä myöhemmin uudelleen.",
            "indicatorsDataXHRError": "Aineistoon ei saatu yhteyttä. Yritä myöhemmin uudelleen.",
            "indicatorMetaError": "Indikaattorin metatietojen haussa tapahtu virhe. Yritä myöhemmin uudelleen.",
            "indicatorMetaXHRError": "Aineistoon ei saatu yhteyttä. Yritä myöhemmin uudelleen.",
            "indicatorDataError": "Indikaattorin tietojen haussa tapahtui virhe. Yritä myöhemmin uudelleen.",
            "indicatorDataXHRError": "Aineistoon ei saatu yhteyttä. Yritä myöhemmin uudelleen.",
            "noselection": "There is no active selection",
            "descriptionTitle": "Kuvaus",
            "sourceTitle": "Tietolähde",
            "annotationsTitle": "Vuosikommentit",
            "additionalInfoTitle": "Lisätieto",
            "lifeCycleStateTitle": "Ajallinen vaihe",
            "stageTitle": "Käsittelyvaihe",
            "unitTitle": "Mittayksikkö",
            "yearsTitle": "Seurantavuodet",
            "gridYearsTitle": "Ruututiedon seurantavuodet",
            "annotations": {
                "year": "Vuosi",
                "organization": "Organisaatio",
                "description": "Lisätietoa indikaattorin vuosituloksista",
            },
            "privacyLimitTitle": "Tietosuoja"
        },
        "classify": {
            "classify": "Teemakartan selite",
            "classifymethod": "Luokittelutapa",
            "classes": "Luokkajako",
            "jenks": "Luonnolliset välit",
            "quantile": "Kvantiilit",
            "eqinterval": "Tasavälit",
            "manual": "Luokittelu käsin",
            "manualPlaceholder": "Erota luvut pilkuilla.",
            "manualRangeError": "Luokkarajojen tulee olla lukuja välillä {min} - {max}.  Anna luokkarajat uudelleen pilkulla erotettuina lukuina. Desimaalierottimena toimii piste.",
            "nanError": "Antamasi arvo ei ole luku. Anna luokkarajat uudelleen pilkulla erotettuina lukuina. Desimaalierottimena toimii piste.",
            "infoTitle": "Luokittelu käsin",
            "info": "Anna luokkarajat lukuina erotettuna pilkulla toisistaan. Desimaalierottimena toimii piste. Esimerkiksi syöttämällä \"0, 10.5, 24, 30.2, 57, 73.1\" saat viisi luokkaa, joiden arvot ovat välillä \"0-10,5\", \"10,5-24\", \"24-30,2\", \"30,2-57\" ja \"57-73,1\". Indikaattorin arvoja, jotka ovat pienempiä kuin alin luokkaraja (esimerkissä 0) tai suurempia kuin ylin luokkaraja (73,1), ei näytetä kartalla. Luokkarajojen on oltava indikaattorin pienimmän ja suurimman arvon välillä.",
            "mode": "Luokkarajojen jatkuvuus",
            "modes": {
                "distinct": "Jatkuva",
                "discontinuous": "Epäjatkuva"
            },
            "pointSize": "Pistekoko",
            "big": "Suuri",
            "normal": "Normaali",
            "small": "Pieni",
            "visualizationmethod": "Aluejako",
            "visualizationsubmethod": "Visualisointitapa",
            "textOptions": "Karttatekstit",
            "showAreaNames": "Näytä nimet kartalla",
            "showValues": "Näytä arvot kartalla",
            "graduated": "Ympyräteemakartta",
            "choropletic": "Alueluokituskartta",
            "administrative": "Hallinnollinen",
            "grid250m": "250m ruudut",
            "grid500m": "500m ruudut",
            "grid1km": "1km ruudut",
            "grid2km": "2km ruudut",
            "grid5km": "5km ruudut",
            "grid10km": "10km ruudut",
            "grid20km": "20km ruudut",
            "visualizationRow": "Visualisoitava rivi",
            "privacyNoticeTitle": "Huomio",
            "privacyNoticeDescription": "Valitulla tilastolla on käytössä tietosuojarajoitus. Kaikki arvoja ei näytetä teemakartalla. Tarkempi kuvaus tietosuojasta löytyy tilaston taustatiedoista."
        },
        "colorset": {
            "button": "Värit",
            "flipButton": "Käännä värit",
            "themeselection": "Luokkien värien valinta",
            "setselection": "Jakauman tyyppi",
            "sequential": "Kvantitatiivinen",
            "qualitative": "Kvalitatiivinen",
            "divergent": "Jakautuva",
            "info2": "Valitse värit klikkaamalla hiirellä haluamaasi väriryhmää",
            "cancel": "Poistu"
        },
        "statistic": {
            "title": "Tunnusluvut",
            "avg": "Keskiarvo",
            "max": "Suurin arvo",
            "mde": "Moodi",
            "mdn": "Mediaani",
            "min": "Pienin arvo",
            "std": "Keskihajonta",
            "sum": "Summa",
            "tooltip": {
                "avg": "Tilaston keskiarvo",
                "max": "Suurin indikaattorissa esiintyvä arvo",
                "mde": "Yleisin tilastossa esiintyvä arvo",
                "mdn": "Tilaston järjestyksessä keskimmäinen arvo",
                "min": "Pienin tilastossa esiintyvä arvo",
                "std": "Tilaston keskihajonta",
                "sum": "Tilaston arvot yhteensä"
            }
        },
        "additionalInfo" :{
            "copyright": "Tietolähde",
            "tooltip": {
                "copyright": "Tietolähde"
            }
        },
		"indicatorFilters": {
			"themeLevel0": "Teema",
			"themeLevel1": "1. alateema",
			"themeLevel2": "2. alateema",
			"themeLevel3": "3. alateema",
			"themeLevel4": "4. alateema",
			"name": "Nimi",
			"selectTheme": "Valitse"
		},
		"connectionErrors": {			
            "errorTitle": "Virhe",
            "regionDataError": "Virhe kuntatietojen haussa.",
            "regionDataXHRError": "Kuntatietojen haku: virhe yhteydessä.",
            "indicatorsDataError": "Virhe tilastojen haussa.",
            "indicatorsDataXHRError": "Tilastojen haku: virhe yhteydessä.",
            "indicatorMetaError": "Virhe tilastojen metadatan haussa",
            "indicatorMetaXHRError": "Tilaston metadata: virhe yhteydessä.",
            "indicatorDataError": "Virhe tilastojen datan haussa",
            "indicatorDataXHRError": "Tilaston data: virhe yhteydessä."
		},
		"errors": {
		    "title": "Virhe",
		    "regionWithoutVisualization": "Kyseiselle jaottelulle ei ole saatavilla teemakarttoja"
		},
        "noIndicatorData": "Tilastoa ei voi tarkastella tässä aluejaossa",
        "values": "arvoa",
        "included": "Arvot",
        "municipality": "Kunnat",
        "not_included": "Poistettu laskuista",
        "selectRows": "Valitse rivit",
        "select4Municipalities": "Valitse vähintään kaksi aluetta tarkasteluun.",
        "showSelected": "Näytä vain valitut alueet taulukossa",
        "toogleTable": "Taulukko",
        "toogleMap": "Kartta",
        "noMatch": "Tilastoa ei löytynyt",
        "selectIndicator": "3. Valitse tilastot",
        "selectIndicatorPlaceholder": "Valitse tilastot",
        "areaRestrictions": "1. Valitse alue",
        "presentationLevel": "2. Valitse esitystaso",
        "yearSelector": "4. Valitse vuodet",
        "functionalAreas": "5. Valitse toiminnalliset alueet",
        "noAreaFilterSet": "Tilastojen rajaus on tällä hetkellä koko Suomi. Voit rajata tilastojen hakualuetta joko tekemällä aluerajauksen tai rajaamalla oman alueen kartalta",
        "noAreaFilterSetNoGrid": "Tilastojen rajaus on tällä hetkellä koko Suomi. Voit rajata tilastojen hakualuetta tekemällä aluerajauksen",
        "areaFilterLimitBySelected": "Rajaa valituilla alueilla",
        "areaFilterItemsSelected": "kohdetta valittuna",
        "areaFilterNoItemsSelected": "Valituilla tasoilla ei ole valittuja kohteita",
        "areaFilterDrawNewFromCrop": "Piirrä uusi aluerajaus",
        "areaFilterDrawNew": "Lisää aluerajaus",
        "areaFilterRemove": "Poista rajaukset",
        "areaFilterDescription" : "Voit rajata tilaston laskenta-alueen joko valittuna oleviin kohteisiin tai piirtää uuden aluerajauksen",
        "geometryFilterSet": "Olet rajannut tilastohaun alueeksi omat alueet joita on valittuna [{0}] kappaletta",
        "areaFilterSet": "Olet rajannut tilastohaun aluerajauksella jonka ehdot ovat: ",
        "filterTitle": "Lisää aluerajaus",
        "indicatorFilterDesc": "Suodattamalla halutut tilastoyksiköt korostuvat taulukossa. Voit asettaa suodatuksen jokaiselle sarakkeelle erikseen.",
        "filterIndicator": "Muuttuja:",
        "filterCondition": "Ehto:",
        "filterSelectCondition": "Valitse ehto",
        "filterGT": "Suurempi kuin (>)",
        "filterGTOE": "Suurempi tai yhtäsuuri kuin (>=)",
        "filterE": "Yhtäsuuri kuin (=)",
        "filterLTOE": "Pienempi tai yhtäsuuri kuin (<=)",
        "filterLT": "Pienempi kuin (<)",
        "filterBetween": "Arvoväli (poissulkeva)",
        "filter": "Suodata",
        "filterByValue": "Arvoilla",
        "filterByRegion": "Alueilla",
        "print": "Tulosta teemakartta",
        "selectRegionCategory": "Aluejako:",
        "regionCatPlaceholder": "Valitse aluejako",
        "selectRegion": "Alue:",
        "chosenRegionText": "Valitse alueita",
        "noRegionFound": "Aluetta ei löytynyt",
        "dataSource": "Tietolähde",
        "regionCategories": {
            "title": "Aluejaot",
            "ERVA": "ERVA-alueet",
            "ELY-KESKUS": "ELY-alueet",
            "KUNTA": "Kunta",
            "ALUEHALLINTOVIRASTO": "Aluehallintovirasto",
            "MAAKUNTA": "Maakunta",
            "NUTS1": "Manner-Suomi ja Ahvenanmaa",
            "SAIRAANHOITOPIIRI": "Sairaanhoitopiiri",
            "SEUTUKUNTA": "Seutukunta",
            "SUURALUE": "Suuralue",
            'ELY_E': "Elinkeino-ELY",
            'ELY_L': "Liikenne-ELY",
            'ELY_Y': "Ympäristö-ELY",
            'FINLAND': "Koko maa",
            'URBANAREA': "Kaupunkiseutu",
            'NEIGHBORHOOD': "Neighborhood",
            'LOCALITY': "Taajama",
            "PLANNEDAREA": "Asemakaavoitettu alue",
            "PLANNEDAREATYPE": "Asemakaavoitettu alue -tyyppi",
            "NEIGHBORHOODTYPE": "Asutusalueen tyyppi",
            "ADMINISTRATIVELAWAREA": "Hallinto-oikeus",
            "SHOPAREA": "Kaupan alue",
            "CITYRURALAREATYPE": "Kaupunkimaaseutuluokitustyyppi",
            "URBANAREATYPE": "Kaupunkiseutu-tyyppi",
            "CITYCENTRALAREA": "Keskusta-alue",
            "CITYCENTRALTYPE": "Keskustatyyppi",
            "LOCALDENSITYTYPE": "Taajama harva/tiheä -tyyppi",
            "PALISKUNTA": "Paliskunta"
        },
        "regionSelectorCategories": {
            "KUNTA": "Kunnittain",
            "MAAKUNTA": "Maakunnittain",
            "SEUTUKUNTA": "Seutukunnittain",
            "SUURALUE": "Suuralueittain",
            'ELY_E': "Elinkeino-ELYittäin",
            'ELY_L': "Liikenne-ELYittäin",
            'ELY_Y': "Ympäristö-ELYittäin",
            'FINLAND': "Koko maa",
            "ADMINISTRATIVELAWAREA": "Hallinto-oikeuksittain",
            "PALISKUNTA": "Paliskunnittain"
        },
        "baseInfoTitle": "Tunnistetiedot",
        "dataTitle": "Aineisto",
        "addDataButton": "Lisää uusi",
        "addDataTitle": "Lisää uusi indikaattori",
        "openImportDialogTip": "Tuo arvot leikepöydältä.",
        "openImportDataButton": "Tuo arvot",
        "addDataMetaTitle": "Otsikko",
        "addDataMetaTitlePH": "Tilaston otsikko",
        "addDataMetaSources": "Lähde",
        "addDataMetaSourcesPH": "Datan lähdeviittaus",
        "addDataMetaDescription": "Kuvaus",
        "addDataMetaDescriptionPH": "Kuvaus",
        "addDataMetaReferenceLayer": "Aluejako",
        "addDataMetaYear": "Vuosi",
        "addDataMetaYearPH": "Tiedot ovat vuodelta",
        "addDataMetaPublicity": "Julkaistavissa",
        "municipalityHeader": "Kunnat",
        "dataRows": "Indikaattorin arvot alueittain",
        "municipalityPlaceHolder": "Anna arvo",
        "formEmpty": "Tyhjennä",
        "formCancel": "Peruuta",
        "formSubmit": "Tallenna",
        "cancelButton": "Peruuta",
        "clearImportDataButton": "Tyhjennä aineistorivit",
        "importDataButton": "Lisää",
        "popupTitle": "Tuo arvot",
        "importDataDescription": "Voit tuoda kunta - arvo -pareja kopioimalla ne tekstikenttään. \nJokainen kunta omalle rivilleen ja erottimeksi käy tabulaattori, kaksoispiste ja pilkku. \nEsimerkki 1: Alajärvi, 1234 \nEsimerkki 2: 009   2100",
        "failedSubmit": "Lisää tilaston metatiedot: ",
        "connectionProblem": "Dataa ei voitu tallentaa yhteysongelman takia.",
        "parsedDataInfo": "Tuotuja alueita oli yhteensä",
        "parsedDataUnrecognized": "Tunnistamattomia alueita",
        "loginToSaveIndicator": "Kirjaudu ensin sisään jos haluat tallentaa aineiston.",        
        "tools": {
            "measureline": {
              "title": "Etäisyyden mittaus",
              "tooltip": "Mittaa etäisyys",
              "add": "",
              "next": "",
              "edit": "Muokkaa viivaa raahaamalla viivan taitepisteitä.",
              "noResult": "0 m"
            },
            "measurearea": {
              "title": "Pinta-alan mittaus",
              "tooltip": "Mittaa pinta-ala",
              "add": "",
              "next": "",
              "edit": "Muokkaa muotoa raahaamalla reunaviivan taitepisteitä.",
              "noResult": "0 m²"
            },
            "point": {
              "title": "Pisteen lisäys",
              "tooltip": "Lisää piste",
              "add": "Lisää piste klikkaamalla karttaa.",
              "next": "Voit tallentaa tai piirtää pisteitä samaan kohteeseen.",
              "edit": "Siirrä pistettä raahaamalla.",
              "save": "Tallenna sijainti"
            },
            "line": {
              "title": "Viivan lisäys",
              "tooltip": "Lisää viiva",
              "add": "Lisää viivan taitepiste klikkaamalla karttaa. Lopeta piirto tuplaklikkauksella tai painamalla 'Lopeta'.",
              "next": "Voit tallentaa tai piirtää lisää viivoja samaan kohteeseen.",
              "edit": "Muokkaa viivaa raahaamalla viivan taitepisteitä.",
              "save": "Tallenna muoto",
              "noResult": "0 m"
            },
            "area": {
              "title": "Alueen lisäys",
              "tooltip": "Lisää alue",
              "add": "Lisää alueen taitepisteet klikkaamalla karttaa. Lopeta piirto painamalla 'Lopeta'.",
              "next": "Voit tallentaa tai piirtää lisää alueita samaan kohteeseen.",
              "edit": "Muokkaa muotoa raahaamalla reunaviivan taitepisteitä.",
              "save": "Tallenna muoto",
              "noResult": "0 m²"
            }
        },
        "filterForm": {
            "selectValue": "Valitse aluetyyppi",
            "selectSomeOptions": "Valitse alueet",
            "close": "Sulje",
            "clear": "Tyhjennä",
            "and": "JA",
            "or": "JA/TAI",
            "selectType": "Tarkastelusuunta",
            "typeHome": "Asuinpaikka",
            "typeWork": "Työpaikka",
            "validateKeyMissing": "Valitse aluetyyppi",
            "validateValuesMissing": "Valitse alueet",
            "validateTypeMissing": "Valitse tarkastelusuunta",
            "validateTypeUsed": "Valitse aluerajauksille eri tarkastelusuunnat",
            "validateOk": "Ok",
            "infoText": "Valitse alue ja työmatkojen tarkastelusuunta. Asuinpaikka tarkoittaa työmatkojen lähtöaluetta, työpaikka työmatkojen kohdealuetta. Jos valitset ensimmäisen rajauksen suunnaksi asuinpaikan, saat tulostaulukkoon kaikki valitulla alueella asuvien työmatkojen kohdealueet. Jos valitset työpaikan, saat tulostaulukkoon kaikki valitulla alueella työssäkäyvien asuinalueet."
        },
		"export": {
			"downloadFile": "Lataa tiedostona",
			"toFile": "Tiedostoon",
            "csvFileName": "tilastot",
            "shpFileName": "tilastot",
            "formattingOfTheFile": "Tallennettavan tiedoston muotoilu",
            "fileType": "Tiedostomuoto",
			"fieldSeparator": "Kenttien erotin",
			"stringSeparator": "Merkijonon erotin",
			"nullSymbolizer": "Puuttuvan numeerisen tiedon merkki",
            "decimalSeparator": "Desimaalierotin",
            "csv": "CSV",
            "shp": "SHP",
            "semicolon": "Puolipiste",
            "comma": "Pilkku",
            "colon": "Kaksoispiste",
            "tabulator": "Sarkain",
            "pipe": "Pystyviiva",
            "quotationMark": "Lainausmerkki",
            "apostrophe": "Heittomerkki",
            "dash": "Viiva",
            "dashCharacter": "-",
            "dot": "Piste",
            "negative1": "-1",
            "negative99": "-99",
            "negative99999": "-99999",
            "empty": "Ei mitään",
			"fileHeader": "Elinympäristön tietopalvelu Liiteri",
            "dataSources": "Tietolähteet",
            "ownAreaWarning": "Varoitus! Valittujen aluekohteiden olemassa olevat ominaisuudet poistetaan."
		},
        "classification" : {
            "error" : {
                "title": "Error",
                "general" : "There was an error during retrieving data"
            }
        },
        "geometryFilter": {
            "error": "Virhe",
            "warning": "Varoitus",
            "manyGeometries": "Yli {0} geometriaa valittuna. Tilastojen laskenta voi kestää useita minuutteja.",
            "tooManyGeometries": "Liian monta geometriaa valittuna. Suurin sallittu määrä on {0}.",
            "selectAttrInstr": "Valitse yksilöivä ominaisuustieto.",
            "selectAttrWarn": "Yksilöivä ominaisuustieto tulee valita ennen jatkamista.",
            "drawnAreaFilterId": "Piirretty alue {0}"
        },
        "columnComparison": {
            "notValid": "Saraketta ei voi verrata itseensä. Klikkaa vertailupainiketta sarakkeessa, jota haluat verrata valittuun sarakkeeseen.",
            "compared": "Aikaisemman vertailun tuloksia ei voi käyttää uudessa vertailussa.",
            "unknown": "Tuntematon virhetilanne.",
            "instructions": "Valitse muutostyyppi edellisen sarakevalinnan (a) ja tämän sarakkeen (b) väliselle vertailulle",
            "difference": "Erotus b-a",
            "division": "Jako b/a",
            "relativeChange": "Suhteellinen muutos (b-a)/a x 100 %",
            "sum": "Summa a+b",
            "differenceTitle": "Erotus",
            "divisionTitle": "Jako",
            "relativeChangeTitle": "Muutossuhde",
            "sumTitle": "Summa",
            "tasksElementTitle": "Vertaa valittuun sarakkeeseen",
            "cancel": "Peruuta",
            "ok": "Laske"
        },
        "hideEmptyRows": "Piilota tyhjät rivit",
        "showRowsAgain": "Palauta piilotetut rivit"
    }
}
);