Oskari.registerLocalization(
{
    "lang": "en",
    "key": "StatsGrid",
    "value": {
        "title": "Thematic maps",
        "desc": "",
        "tile": {
            "title": "Thematic maps",
            "standardStats": "Thematic maps",
            "twoWayStats": "Two way stats"
        },
        "view": {
            "title": "Thematic maps",
            "message": "patiopoc",
			"tooltip": "Statistics"
        },
        "tab": {
            "title": "Indicators",
            "description": "Own indicators",
            "grid": {
                "name": "Title",
                "description": "Description",
                "organization": "Data source",
                "year": "Year",
                "delete": "Delete"
            },
            "deleteTitle": "Delete indicator",
            "destroyIndicator": "Delete",
            "cancelDelete": "Cancel",
            "confirmDelete": "Are you sure you want to delete indicator",
            "newIndicator": "New indicator",
            "error": {
                "title": "Error",
                "indicatorsError": "Error occurred whilst loading the indicators. Please try again later",
                "indicatorError": "Error occurred whilst loading an indicator. Please try again later",
                "indicatorDeleteError": "Error occurred whilst removing an indicator. Please try again later"
            }
        },
        "gender": "Gender",
        "genders": {
            "male": "men",
            "female": "women",
            "total": "total"
        },
        "direction": "Esityssuunta",
        "directions": {
            "work": "Työalueittain",
            "home": "Kotialueittain"
        },
        "addColumn": "Get data",
        "addColumnFromArea": "Set geometry area filter",
        "addColumnFromRegionFilter": "Set area filter",
        "clearColumn" : "Clear",
        "createChart": "Create chart",
        "errorTitle": "Error",
        "noIndicator" : "Statistic data are not present in the table",
        "removeColumn": "Remove",
        "indicators": "Indicator",
        "cannotDisplayIndicator": "The indicator does not have values on the selected regional classification. So it cannot be displayed in the grid.",
        "availableRegions": "Values are found for the following regional classifications:",
        "numberOfSelectedIndicators": "You have selected {0} indicators",
        "year": "Year",
        "buttons": {
            "ok": "OK",
            "cancel": "Cancel",
            "filter": "Filter",
            "save": "Save",
            "close": "Close",
            "finish": "Finish",
            "saveAsMyPlace": "Save as my place",
            "movePlaces": "Move places",
            "deleteCategory": "Delete",
            "deleteCategoryAndPlaces": "Delete places",
            "changeToPublic": "Change to public",
            "changeToPrivate": "Change to private"
        },
        "stats": {
            "municipality": "Municipality",
            "code": "Code",
            "errorTitle": "Error",
            "regionDataError": "The municipal data could not be found. Try again later.",
            "regionDataXHRError": "The indicator could not be loaded. Try again later.",
            "indicatorsDataError": "The indicator could not be found. Try again later.",
            "indicatorsDataXHRError": "The indicator could not be loaded. Try again later.",
            "indicatorMetaError": "Metadata for the indicator could not be found. Try again later.",
            "indicatorMetaXHRError": "The indicator could not be loaded. Try again later.",
            "indicatorDataError": "Data for the indicator could not be found. Try again later.",
            "indicatorDataXHRError": "The indicator could not be loaded. Try again later.",
            "noselection" : "There is no active selection",
            "descriptionTitle": "Description",
            "sourceTitle": "Source",
            "annotationsTitle" : "Annotations",
            "additionalInfoTitle": "Additional info",
            "lifeCycleStateTitle": "Life cycle state",
            "stageTitle": "Stage",
            "unitTitle": "Unit",
            "yearsTitle": "Years",
            "annotations" : {
                "year": "Year",
                "organization": "Organization",
                "description": "Description",
            },
            "privacyLimitTitle": "Privacy limits"
        },
        "classify": {
            "classify": "Classification",
            "classifymethod": "Classification method",
            "classes": "Classes",
            "jenks": "Natural breaks",
            "quantile": "Quantiles",
            "eqinterval": "Equal intervals",
            "manual": "Own classes",
            "manualPlaceholder": "Input numbers separated with a comma.",
            "manualRangeError": "The class breaks should be numbers between {min} and {max}. Input numbers separated with a comma.  Decimal are separated with a dot.",
            "nanError": "The given value is not a number. Input class breaks again as numbers separated with a comma. Decimal are separated with a dot.",
            "infoTitle": "Own classes",
            "info": "Input class breaks again as numbers separated with a comma. Decimal are separated with a dot. For example by inputting \"\"0, 10.5, 24, 30.2, 57, 73.1\" you get five classes which have values between  \"0-10,5\", \"10,5-24\", \"24-30,2\", \"30,2-57\" ja \"57-73,1\". The indicator's values smaller than the minimum value (0) or larger than the maximum value (73,1) are not shown on the map. The class breaks should be numbers between {min} and {max}.",
            "mode": "Class breaks",
            "modes": {
                "distinct": "Continuous",
                "discontinuous": "Discrete"
            },
            "pointSize": "Point size",
            "big": "Big",
            "normal": "Normal",
            "small" : "Small",
            "visualizationmethod": "Zoning",
            "visualizationsubmethod": "Visualization method",
            "textOptions": "Text options",
            "showAreaNames": "Show area names",
            "showValues": "Show values",
            "graduated": "Graduated",
            "choropletic" : "Choropletic",
            "administrative": "Administrative areas",
            "grid250m": "250m grid",
            "grid500m": "500m grid",
            "grid1km": "1km grid",
            "grid2km": "2km grid",
            "grid5km": "5km grid",
            "grid10km": "10km grid",
            "grid20km": "20km grid",
            "visualizationRow": "Visualisoitava rivi",
            "privacyNoticeTitle": "Huomio",
            "privacyNoticeDescription": "Valitulla tilastolla on käytössä tietosuojarajoitus. Kaikki arvoja ei näytetä teemakartalla. Tarkempi kuvaus tietosuojasta löytyy tilaston taustatiedoista."
        },
        "colorset": {
            "button": "Colors",
            "flipButton": "Flip colors",
            "themeselection": "Color theme selection",
            "setselection": "Color set selection",
            "sequential": "Quantitative",
            "qualitative": "Qualitative",
            "divergent": "Divisible",
            "info2": "Select the colors by clicking the color group",
            "cancel": "Cancel"
        },
        "statistic": {
            "title": "Statistical variables",
            "avg": "Average",
            "max": "Maximum value",
            "mde": "Mode",
            "mdn": "Median",
            "min": "Minimum value",
            "std": "Standard deviation",
            "sum": "Sum",
            "tooltip": {
                "avg": "The average value of the values in the indicator.",
                "max": "The largest value of the values in the indicator.",
                "mde": "The most common value of the values in the indicator.",
                "mdn": "The middle value of of the values in the indicator after sorting them by a value.",
                "min": "The smallest value of the values in the indicator.",
                "std": "The standard deviation of the values in the indicator.",
                "sum": "The total sum of the values in the indicator."
            }
        },
        "additionalInfo": {
            "copyright": "Copyright",
            "tooltip": {
                "copyright": "Copyright",
            }
        },
		"indicatorFilters": {
			"themeLevel0": "Theme",
			"themeLevel1": "1. Subtheme",
			"themeLevel2": "2. Subtheme",
			"themeLevel3": "3. Subtheme",
			"themeLevel4": "4. Subtheme",
			"name": "Name",
			"selectTheme": "[Select a value]"
		},
		"connectionErrors": {			
            "errorTitle": "Error",
            "regionDataError": "Error in getting region data.",
            "regionDataXHRError": "Error loading region data",
            "indicatorsDataError": "Error in getting indicators.",
            "indicatorsDataXHRError": "Error loading indicators",
            "indicatorMetaError": "Error in getting indicator metadata",
            "indicatorMetaXHRError": "Error loading indicator metadata",
            "indicatorDataError": "Error in getting indicator data",
            "indicatorDataXHRError": "Error loading indicator data"
		},
        "errors" : {
            "title": "Error",
            "regionWithoutVisualization" : "This region has no visualization",
        },
        "noIndicatorData": "Can not display indicator with selected region category",
        "values": "values",
        "included": "Values",
        "municipality": "Municipalities",
        "selectRows": "Select rows",
        "select4Municipalities": "Select at least two areas.",
        "showSelected": "Show only selected areas on the grid.",
        "toogleTable": "Table",
        "toogleMap": "Map",
        "not_included": "Not included",
        "noMatch": "No results matched",
        "selectIndicator": "Select an indicator",
        "selectIndicatorPlaceholder": "Select indicators",
        "areaRestrictions": "Area restrictions",
        "presentationLevel": "Presentation level",
        "noAreaFilterSet": "There is no area filter set",
        "noAreaFilterSetNoGrid": "There is no area filter set",
        "areaFilterLimitBySelected": "Limit by selected regions",
        "areaFilterDrawNewFromCrop": "Draw new filter from crop",
        "areaFilterDrawNew": "Draw new filter",
        "areaFilterRemove": "Clear filter",
        "areaFilterDescription": "You can limit the statistics counting area either selected subjects, or draw a new area delimitation",
        "areaFilterItemsSelected": "items selected",
        "areaFilterNoItemsSelected": "There are no selected items at given map layers",
        "geometryFilterSet": "Olet rajannut tilastohaun alueeksi omat alueet joita on valittuna [{0}] kappaletta",
        "areaFilterSet": "Olet rajannut tilastohaun aluerajauksella jonka ehdot ovat: ",
        "filterTitle": "Filter out column data",
        "indicatorFilterDesc": "Filtered values are selected in the grid. You can set filtering separately for every column.",
        "filterIndicator": "Indicator:",
        "filterCondition": "Condition:",
        "filterSelectCondition": "Select condition",
        "filterGT": "Greater than (>)",
        "filterGTOE": "Greater than or equal to (>=)",
        "filterE": "Equal (=)",
        "filterLTOE": "Less than or equal to (<=)",
        "filterLT": "Less than (<)",
        "filterBetween": "In between (exclusive)",
        "filter": "Filter",
        "filterByValue": "By value",
        "filterByRegion": "By region",
        "print": "Print",
        "selectRegionCategory": "Region categories:",
        "regionCatPlaceholder": "Choose a region category",
        "selectRegion": "Regions:",
        "chosenRegionText": "Choose regions",
        "noRegionFound": "Region not found",
        "dataSource" : "Data source",
        "regionCategories": {
            "title": "Region categories",
            "KUNTA": "Municipality",
            "ALUEHALLINTOVIRASTO": "Aluehallintovirasto",
            "MAAKUNTA": "Region",
            "NUTS1": "Manner-Suomi ja Ahvenanmaa",
            "SAIRAANHOITOPIIRI": "Sairaanhoitopiiri",
            "SEUTUKUNTA": "Subregion",
            "SUURALUE": "Suuralue",
            'ELY_E' : "ELY E area",
            'ELY_L': "ELY L area",
            'ELY_Y': "ELY Y area",
            'FINLAND': "Finland",
            'URBANAREA': "Urban area",
            'NEIGHBORHOOD': "Neighborhood",
            'LOCALITY': "Locality",
            "PLANNEDAREA" : "Planned area",
            "NEIGHBORHOODTYPE" : "Neighborhood type",
            "ADMINISTRATIVELAWAREA" : "Administrative law area",
            "SHOPAREA" : "Shop area",
            "CITYRURALAREATYPE": "City rural area type",
            "URBANAREATYPE" : "Urban area type",
            "CITYCENTRALAREA" : "City central area",
            "CITYCENTRALTYPE" : "City central type",
            "LOCALDENSITYTYPE": "Local density type"
        },
        "regionSelectorCategories": {
            "KUNTA": "Municipality",
            "MAAKUNTA": "Region",
            "SEUTUKUNTA": "Subregion",
            "SUURALUE": "Suuralue",
            'ELY_E': "ELY E area",
            'ELY_L': "ELY L area",
            'ELY_Y': "ELY Y area",
            'FINLAND': "Finland",
            "ADMINISTRATIVELAWAREA": "Administrative law area",
        },
        "addDataButton": "Add indicator",
        "addDataTitle": "Add a new indicator.",
        "openImportDialogTip": "Import data from the clipboard.",
        "openImportDataButton": "Import data",
        "addDataMetaTitle": "Title",
        "addDataMetaTitlePH": "Indicator's title",
        "addDataMetaSources": "Data source",
        "addDataMetaSourcesPH": "Data source for the indicator",
        "addDataMetaDescription": "Description",
        "addDataMetaDescriptionPH": "Description",
        "addDataMetaReferenceLayer": "Regional classification",
        "addDataMetaYear": "Year",
        "addDataMetaYearPH": "Data has been produced in the year",
        "addDataMetaPublicity": "Publishable",
        "municipalityHeader": "Municipalities",
        "dataRows": "Indicator values by region",
        "municipalityPlaceHolder": "Give value",
        "formEmpty": "Clear",
        "formCancel": "Cancel",
        "formSubmit": "Submit",
        "cancelButton": "Cancel",
        "clearImportDataButton": "Clear the data rows",
        "importDataButton": "Add",
        "popupTitle": "Import data",
        "importDataDescription": "You can bring region value duples by copying them to the textarea. \nPlace every municipality to their own row. You can separate the values with tabulator, colon or comma. \nExample 1: Alajärvi, 1234 \nExample 2: 009    2100",
        "failedSubmit": "Add indicator's metadata: ",
        "connectionProblem": "We could not save the data due to connection problems",
        "parsedDataInfo": "Imported regions count",
        "parsedDataUnrecognized": "Unrecognized regions count",
        "loginToSaveIndicator": "NOT TRANSLATED",
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
                "add": "Lisää viivan taitepiste klikkaamalla karttaa. Lopeta piirto tuplaklikkauksella tai painamalla 'Lopeta piirto'.",
                "next": "Voit tallentaa tai piirtää lisää viivoja samaan kohteeseen.",
                "edit": "Muokkaa viivaa raahaamalla viivan taitepisteitä.",
                "save": "Tallenna muoto",
                "noResult": "0 m"
            },
            "area": {
                "title": "Alueen lisäys",
                "tooltip": "Lisää alue",
                "add": "Lisää alueen taitepisteet klikkaamalla karttaa. Lopeta piirto painamalla 'Lopeta piirto'.",
                "next": "Voit tallentaa tai piirtää lisää alueita samaan kohteeseen.",
                "edit": "Muokkaa muotoa raahaamalla reunaviivan taitepisteitä.",
                "save": "Tallenna muoto",
                "noResult": "0 m²"
            }
        },
        "filterForm" : {
            "selectValue": "Select value",
            "selectSomeOptions": "Select some options",
            "close": "Close",
            "clear": "Clear",
            "and": "AND",
            "or": "OR",
            "selectType": "Type of area:",
            "typeHome": "Home",
            "typeWork": "Work",
            "validateKeyMissing": "Valitse aluetyyppi",
            "validateValuesMissing": "Valitse alueet",
            "validateTypeMissing": "Valitse tarkastelusuunta",
            "validateTypeUsed": "Valitse aluerajauksille eri tarkastelusuunnat",
            "validateOk": "Ok",
            "infoText": "Valitse alue ja työmatkojen tarkastelusuunta. Asuinpaikka tarkoittaa työmatkojen lähtöaluetta, työpaikka työmatkojen kohdealuetta. Jos valitset ensimmäisen rajauksen suunnaksi asuinpaikan, saat tulostaulukkoon kaikki valitulla alueella asuvien työmatkojen kohdealueet. Jos valitset työpaikan, saat tulostaulukkoon kaikki valitulla alueella työssäkäyvien asuinalueet."    
        },
		"csv": {
			"downloadFile": "Download file",
			"toFile": "Download file",
			"csvFileName": "statistics",
			"formattingOfTheFile": "Formatting of the file",
			"fieldSeparator": "Field separator",
			"stringSeparator": "String separator",
			"nullSymbolizer": "Null symbolizer",
			"decimalSeparator": "Decimal separator",
            "semicolon": "Semicolon",
            "comma": "Comma",
            "colon": "Colon",
            "tabulator": "Tabulator",
            "pipe": "Pipe",
            "quotationMark": "QuotationMark",
            "apostrophe": "Apostrophe",
            "dash": "Dash",
            "dashCharacter": "-",
            "dot": "Dot",
            "negative1": "-1",
            "negative99": "-99",
            "negative99999": "-99999",
            "empty": "Empty",
			"fileHeader": "The Living Environment Information Services Liiteri",
			"dataSources": "Data sources"
		},
        "classification" : {
            "error" : {
                "title": "Error",
                "general" : "There was an error during retrieving data"
            }
        },
        "geometryFilter": {
            "error": "Error",
            "warning": "Warning",
            "manyGeometries": "You selected more than {0} geometries. Loading the statistics might take few minutes",
            "tooManyGeometries": "Too many geometries selected. Maximum valid amount is {0}.",
            "selectAttrInstr": "Select identyfying attribute",
            "selectAttrWarn": "You should select an identyfying attribute",
            "drawnAreaFilterId": "Drawn area {0}"
        }
    }
}
);