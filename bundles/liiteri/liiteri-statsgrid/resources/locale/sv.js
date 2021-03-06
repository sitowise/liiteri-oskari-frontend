Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "StatsGrid",
    "value": {
        "title": "patiopoc",
        "desc": "",
        "tile": {
            "title": "Tematiska kartor"
        },
        "view": {
            "title": "patiopoc",
            "message": "patiopoc"
        },
        "tab": {
            "title": "Indikatorer",
            "description": "Egen indikatorer",
            "grid": {
                "name": "Titeln",
                "description": "Beskrivning",
                "organization": "Upphov",
                "year": "År",
                "delete": "Ta bort"
            },
            "deleteTitle": "Ta bort en indikator",
            "destroyIndicator": "Radera",
            "cancelDelete": "Avsluta",
            "confirmDelete": "Vill du säkert ta bort indikatoren",
            "newIndicator": "Ny indikator",
            "error": {
                "title": "Fel",
                "indicatorsError": "Laddning av indikatorer misslyckades. Försök igen senare.",
                "indicatorError": "Laddning av indikatoren misslyckades. Försök igen senare.",
                "indicatorDeleteError": "Radering av indikatoren misslyckades. Försök igen senare."
            }
        },
        "gender": "Kön",
        "genders": {
            "male": "män",
            "female": "kvinnor",
            "total": "totalt"
        },
        "addColumn": "Sök indikator",
        "removeColumn": "Radera",
        "indicators": "Indikator",
        "cannotDisplayIndicator": "Indikatorn har inga värde på din utval regional indelning. Så det kan inte visas på tabellen.",
        "availableRegions": "Värde finns till följande regionala indelningar:",
        "year": "År",
        "buttons": {
            "ok": "OK",
            "cancel": "Avbryta",
            "filter": "Filter"
        },
        "stats": {
            "municipality": "Kommun",
            "code": "Kod",
            "errorTitle": "Fel",
            "regionDataError": "Fel att få  regionen data.",
            "regionDataXHRError": "Fel vid laddning av regionen data",
            "indicatorsDataError": "Fel att få indikatorer.",
            "indicatorsDataXHRError": "Fel vid laddning av indikatorer.",
            "indicatorMetaError": "Fel att få indikator metadata",
            "indicatorMetaXHRError": "Fel vid laddning av indikator metadata",
            "indicatorDataError": "Fel att få indikator data",
            "indicatorDataXHRError": "Fel vid laddning av indikator data",
            "descriptionTitle": "Beskrivning",
            "sourceTitle": "Upphov"
        },
        "classify": {
            "classify": "Klassificera",
            "classifymethod": "Metod",
            "classes": "Klasser",
            "jenks": "Jenks intervall",
            "quantile": "Quantile intervall",
            "eqinterval": "Eqintervall",
            "manual": "Manuell klassificering",
            "manualPlaceholder": "Ange siffrorna, separerade med kommatecken.",
            "manualRangeError": "Det bör vara minst {min} och högst {max} siffror!",
            "nanError": "Ett värde var inte ett nummer!",
            "infoTitle": "Manuell klassificering",
            "info": "Ange siffrorna separerade med kommatecken. Punkt fungerar som ett decimaltecken. Först in den nedre gränsen, då gränserna klass och slutligen den övre gränsen. T.ex. genom att skriva \"0, 10,5, 24, 30,2, 57, 73,1\" du får fem klasser med nedre och övre gränsen satt till 0 och 73,1 och klass gränser mellan dem. Värden kvar utanför gränserna kommer att uteslutas.",
            "mode": "Klass gränsen",
            "modes": {
                "distinct": "Kontinuerlig",
                "discontinuous": "Diskontinuerlig"
            }
        },
        "colorset": {
            "button": "Färger",
            "flipButton": "Vända färger",
            "themeselection": "Välj färgtema",
            "setselection": "Välj färgset",
            "sequential": "Kvantitiv",
            "qualitative": "Kvalitativ",
            "divergent": "Divergent",
            "info2": "Vända färger - använd muspekaren för att välja en färg från sekvensen färgskalan",
            "cancel": "Avsluta"
        },
        "statistic": {
            "title": "Nyckeltal",
            "avg": "Medelvärde",
            "max": "Maximivärde",
            "mde": "Modus",
            "mdn": "Median",
            "min": "Minimivärde",
            "std": "Standardavvikelse",
            "sum": "Summa",
            "tooltip": {
                "avg": "Medelvärde",
                "max": "Det största av indikatorens värde.",
                "mde": "Det mest allmänna av indikatorens värde.",
                "mdn": "Det mellersta av indikatorens ordnade värde.",
                "min": "Det minsta av indikatorens värde.",
                "std": "En genomsnittlig avvikelse av indikatorens medelvärde.",
                "sum": "Totalt summa av indikatorens värde."
            }
        },
		"indicatorFilters": {
			"themeLevel0": "Tema",
			"themeLevel1": "1. SubTema",
			"themeLevel2": "2. SubTema",
			"themeLevel3": "3. SubTema",
			"themeLevel4": "4. SubTema",
			"name": "Namn",
			"selectTheme": "[Välj ett värde]"
		},
		"connectionErrors": {			
            "errorTitle": "Fel",
            "regionDataError": "Fel att fåregionen data.",
            "regionDataXHRError": "Fel vid laddning av regionen data",
            "indicatorsDataError": "Fel att få indikatorer.",
            "indicatorsDataXHRError": "Fel vid laddning av indikatorer.",
            "indicatorMetaError": "Fel att få indikator metadata",
            "indicatorMetaXHRError": "Fel vid laddning av indikator metadata",
            "indicatorDataError": "Fel att få indikator data",
            "indicatorDataXHRError": "Fel vid laddning av indikator data"
		},
        "noIndicatorData": "NOT TRANSLATED",
        "values": "värden",
        "included": "Värden",
        "municipality": "Kommuner",
        "selectRows": "Markera rader",
        "select4Municipalities": "Välj minst två områden",
        "showSelected": "Visa endast utvalda områden på nätet",
        "not_included": "Inte inlcuded",
        "noMatch": "Inga matchade indikatorer",
        "selectIndicator": "Välja en indikator",
        "selectIndicatorPlaceholder": "NOT TRANSLATED",
        "filterTitle": "Filtrera kolumndata",
        "indicatorFilterDesc": "Filtrerade värdena kommer att väljas i tabellen. Du kan ställa in filtrering separat för varje kolumn.",
        "filterIndicator": "Indikator:",
        "filterCondition": "Filter:",
        "filterSelectCondition": "välj filter",
        "filterGT": "Större (>)",
        "filterGTOE": "Större än eller lika med (>=)",
        "filterE": "Lika med (=)",
        "filterLTOE": "Mindre än eller lika med (<=)",
        "filterLT": "Mindre (<)",
        "filterBetween": "Värdeintervallet (exklusivt)",
        "filter": "Filter",
        "filterByValue": "Med värde",
        "filterByRegion": "Med region",
        "dataSource" : "NOT TRANSLATED",
        "selectRegionCategory": "NOT TRANSLATED",
        "regionCatPlaceholder": "NOT TRANSLATED",
        "selectRegion": "NOT TRANSLATED",
        "chosenRegionText": "NOT TRANSLATED",
        "noRegionFound": "NOT TRANSLATED",
        "regionCategories": {
            "title": "Regionindelningar",
            "ERVA": "Specialupptagningsområde",
            "ELY-KESKUS": "NTM-regioner",
            "KUNTA": "Kommuner",
            "ALUEHALLINTOVIRASTO": "Regionförvaltningsverken",
            "MAAKUNTA": "Landskap",
            "NUTS1": "Fasta Finland och Åland",
            "SAIRAANHOITOPIIRI": "Sjukvårdsdistrikter",
            "SEUTUKUNTA": "Samkommuner",
            "SUURALUE": "Storområden"
        },
        "addDataButton": "Ladda egen",
        "addDataTitle": "Ladda egen indikator",
        "openImportDialogTip": "Ladda värde från urklippet",
        "openImportDataButton": "Ladda värde",
        "addDataMetaTitle": "Titel",
        "addDataMetaTitlePH": "Titeln av indikator",
        "addDataMetaSources": "Källa",
        "addDataMetaSourcesPH": "Datakälla",
        "addDataMetaDescription": "Beskrivning",
        "addDataMetaDescriptionPH": "Beskrivning",
        "addDataMetaReferenceLayer": "Regional indelning:",
        "addDataMetaYear": "År",
        "addDataMetaYearPH": "Information är från år",
        "addDataMetaPublicity": "Publicerande",
        "municipalityHeader": "Kommuner",
        "dataRows": "Indikators värde på regioner",
        "municipalityPlaceHolder": "Ge ett värde",
        "formEmpty": "Töm",
        "formCancel": "Avbryta",
        "formSubmit": "Lagra",
        "cancelButton": "Avbryta",
        "clearImportDataButton": "Töm datarader",
        "importDataButton": "Tilllägg",
        "popupTitle": "Ladda värde",
        "importDataDescription": "Kopiera regioner (namn eller id) och motsvarande värde till nedanstående textfältet. Skilja kommun och värde med tabulator, kolon eller prick. Skriv varje kommun på sin egen rad.  \r\nExempel 1: Alajärvi, 1234 \r\nExempel 2: 009   2100",
        "failedSubmit": "Tilllägg metadata för indikatoren:",
        "connectionProblem": "Data kunde inte lagras för nättförbindelseproblemens skull.",
        "parsedDataInfo": "Laddade regioner finns totalt",
        "parsedDataUnrecognized": "Obekanta regioner",
        "loginToSaveIndicator": "Att lagra din egen indikator måste du logga in.",
        "geometryFilter": {
            "error": "Error",
            "warning": "Warning",
            "manyGeometries": "You selected more than {0} geometries. Loading the statistics might take few minutes",
            "tooManyGeometries": "Too many geometries selected. Maximum valid amount is {0}.",
            "selectAttrInstr": "Select identyfying attribute",
            "selectAttrWarn": "You should select an identyfying attribute",
            "drawnAreaFilterId": "Drawn area {0}"
        }
    },
    "filterForm" : {
        "selectValue": "Select value",
        "selectSomeOptions": "Select some options",
        "close": "Close",
        "clear": "Clear",
        "and": "AND",
        "or": "OR",
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
	"csv": {
		"downloadFile": "NOT TRANSLATED",
		"toFile": "NOT TRANSLATED",
		"csvFileName": "NOT TRANSLATED",
		"formattingOfTheFile": "NOT TRANSLATED",
		"fieldSeparator": "NOT TRANSLATED",
		"stringSeparator": "NOT TRANSLATED",
		"nullSymbolizer": "NOT TRANSLATED",
		"decimalSeparator": "NOT TRANSLATED",
		"semicolon": "NOT TRANSLATED",
		"comma": "NOT TRANSLATED",
		"dot": "NOT TRANSLATED",
		"colon": "NOT TRANSLATED",
		"tab": "NOT TRANSLATED",
		"verticalLine": "NOT TRANSLATED",
		"empty": "NOT TRANSLATED",
		"quotationMarks": "NOT TRANSLATED",
		"apostrophe": "NOT TRANSLATED",
		"line": "NOT TRANSLATED",
		"fileHeader": "NOT TRANSLATED",
		"dataSources": "NOT TRANSLATED"
	}
}
);