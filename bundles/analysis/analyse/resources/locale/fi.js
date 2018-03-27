Oskari.registerLocalization({
    "lang": "fi",
    "key": "Analyse",
    "value": {
        "title": "Luo puskurivyöhyke",
        "flyouttitle": "Luo puskurivyöhyke",
        "desc": "",
        "btnTooltip": "Luo puskurivyöhyke",
        "NotLoggedView": {
            "text": "Analyysi-toiminnon avulla voit tehdä yksinkertaisia paikkatietoanalyyseja kohdetietoja sisältäville karttatasoille. Toiminto edellyttää kirjautumista.",
            "signup": "Kirjaudu sisään",
            "register": "Rekisteröidy"
        },
        "AnalyseView": {
            "title": "Luo puskurivyöhyke",
            "content": {
                "label": "Valitse aineisto",
                "tooltip": "Lisää tietoaineisto painamalla [lisää tietoaineisto] painiketta",
                "features": {
                    "title": "Piirrä kohde",
                    "buttons": {
                        "cancel": "Peruuta",
                        "finish": "Valmis"
                    },
                    "tooltips": {
                        "point": "Lisää väliaikainen piste käytettäväksi analyysin pohjana.",
                        "line": "Lisää väliaikainen viiva käytettäväksi analyysin pohjana.",
                        "area": "Lisää väliaikainen alue käytettäväksi analyysin pohjana."
                    },
                    "modes": {
                        "area": "Alue",
                        "line": "Viiva",
                        "point": "Piste"
                    }
                },
                "search": {
                    "title": "Hae paikkahaulla",
                    "resultLink": "Tuo analyysiin"
                }
            },
            "method": {
                "label": "Menetelmä",
                "tooltip": "Vyöhyke-menetelmä: Lisää valittujen kohteiden ympärille vyöhykkeet ja käyttää näitä vyöhyke-geometrioita (buffer) analyysissä -+- Koostetyökalu: Laskee kohteen ominaisuuksille aggregointiominaisuuksia esim. summat -+- Unioni: kohteiden yhdistäminen taulukosta valitsemalla tai yhteisten ominaisuustietoarvojen perusteella -+- Leikkaus: Valitaan uudet kohteet leikkaamalla leikkaavan tason kohteilla leikattavaa tasoa",
                "options": [{
                    "id": "oskari_analyse_buffer",
                    "label": "Vyöhyke",
                    "classForMethod": "buffer",
                    "selected": true,
                    "tooltip": "Lisää valittujen kohteiden ympärille vyöhykkeet ja käyttää näitä vyöhyke-geometrioita (buffer) analyysissä"
//                }, {
//                    "id": "oskari_analyse_aggregate",
//                    "label": "Kooste",
//                    "classForPreview": "aggregate",
//                    "tooltip": "Laskee kohteen ominaisuuksille aggregointiominaisuuksia esim. summat"
//                }, {
//                    "id": "oskari_analyse_union",
//                    "label": "Yhdiste",
//                    "classForPreview": "union",
//                    "tooltip": "Kohteiden yhdistäminen taulukosta valitsemalla tai yhteisten ominaisuustietoarvojen perusteella"
//                }, {
//                    "id": "oskari_analyse_intersect",
//                    "label": "Leikkaavien kohteiden suodatus",
//                    "classForPreview": "intersect",
//                    "tooltip": "Valitaan uudet kohteet leikkaamalla leikkaavan tason kohteilla leikattavaa tasoa"
//                }, {
//                    "id": "oskari_analyse_layer_union",
//                    "label": "Analyysitasojen yhdiste",
//                    "classForPreview": "layer_union",
//                    "tooltip": "Yhdistää analyysitasoja, joilla on samat ominaisuustietokentät"
                }]
            },
            "aggregate": {
                "label": "Aggregointifunktio",
                "options": [{
                    "id": "oskari_analyse_Count",
                    "label": "Lukumäärä",
                    "selected": true
                }, {
                    "id": "oskari_analyse_Sum",
                    "label": "Summa"
                }, {
                    "id": "oskari_analyse_Min",
                    "label": "Minimi"
                }, {
                    "id": "oskari_analyse_Max",
                    "label": "Maksimi"
                }, {
                    "id": "oskari_analyse_Average",
                    "label": "Keskiarvo"
                }, {
                    "id": "oskari_analyse_StdDev",
                    "label": "Keskihajonta"
                }],
                "attribute": "Valitse ominaisuustieto"
            },
            "buffer_size": {
                "label": "Valitse vyöhykkeen koko (m)",
                "tooltip": "Anna vyöhykkeen koko"
            },
                    {
                        "id": "oskari_analyse_NoDataCnt",
                        "label": "Tietosuojattujen kohteiden lukumäärä"
                    }
                ],
                "attribute": "Valitse ominaisuustieto",
                "footer": "Tietosuojatut kohteet eivät ole mukana laskennassa.",
                "aggregateAdditionalInfo": "Huom! Olet valinnut tekstiä sisältäviä ominaisuustietoja. Niille voi laskea ainoastaan kohteiden lukumäärän. Jos kohteiden lukumäärä ei ole valittuna, tekstiä sisältäviä ominaisuustietoja ei oteta mukaan analyysin lopputulokseen."
            "includeOriginal": {
                "label": "Sisällytä alkuperäinen kohde"
            },
            "mergeBuffers": {
                "label": "Yhdistä puskurivyöhykkeet"
            },
            "analyse_name": {
                "label": "Vyöhykkeen nimi",
                "tooltip": "Anna vyöhykkeen nimi"
            },
            "settings": {
                "label": "Asetukset",
                "tooltip": "Anna parametrit analyysia varten. Parametrit riippuvat valitusta suodattimesta ja menetelmästä"
            },
            "intersect": {
                "label": "Leikkaava taso"
            },
            "union": {
                "label": "Valittu yhdistettävä taso"
            },
            "layer_union": {
                "label": "Valitut yhdistettävät tasot",
                "notAnalyseLayer": "Valitse jokin analyysitaso",
                "noLayersAvailable": "Tasoja, joilla on samat ominaisuustietokentät ei löytynyt"
            },
            "spatial": {
                "label": "Spatiaalinen operaattori",
                "options": [{
                    "id": "oskari_analyse_intersect",
                    "label": "Leikkaa",
                    "selected": true
                }, {
                    "id": "oskari_analyse_contains",
                    "label": "Sisältää"
                }]
            },
            "spatial_join": {
                "firstLayer": "Kohdetaso",
                "firstLayerTooltip": "Valitse kohdetaso eli taso, jonka ominaisuustietoihin lähdetasolta haetut ominaisuustiedot yhdistetään.",
                "firstLayerFieldTooltip": "Kohdetasolta mukaan otettavat ominaisuustiedot",
                "secondLayer": "Lähdetaso",
                "secondLayerTooltip": "Valitse lähdetaso eli taso, jonka ominaisuustiedoista yhdistettävät tiedot haetaan kohdetasolle.",
                "secondLayerFieldTooltip": "Lähdetasolta mukaan otettavat ominaisuustiedot",
                "mode": "Analyysimenetelmän tyyppi",
                "modeTooltip": "Valitse haluatko käyttää yhdistämisessä tunnuslukuja.",
                "normalMode": "Yhdistäminen sijainnin perusteella",
                "aggregateMode": "Tunnuslukujen laskenta",
                "backend_locale": [
                    {
                        "id": "count",
                        "label": "Kohteiden lukumäärä"
                    },
                    {
                        "id": "sum",
                        "label": "Summa"
                    },
                    {
                        "id": "min",
                        "label": "Pienin arvo"
                    },
                    {
                        "id": "max",
                        "label": "Suurin arvo"
                    },
                    {
                        "id": "avg",
                        "label": "Keskiarvo"
                    },
                    {
                        "id": "stddev",
                        "label": "Keskihajonta"
                    }
                ]
            },
            "params": {
                "label": "Mukaan otettavat ominaisuustiedot",
                "aggreLabel": "Ominaisuustiedot joille tunnusluvut lasketaan",
                "aggreLabelTooltip": "Valitse enintään 10 ominaisuustietoa, joille lasketaan tunnusluvut.",
                "labelTooltip": "Valitse enintään 10 ominaisuustietoa, jotka otetaan mukaan lopputulokseen.",
                "tooltip": "",
                "options": [
                    {
                    "id": "oskari_analyse_all",
                    "selected": true,
                    "label": "Kaikki"
                }, {
                    "id": "oskari_analyse_none",
                    "label": "Ei mitään"
                }, {
                    "id": "oskari_analyse_select",
                    "label": "Valitse listalta"
                }]
            },
            "output": {
                "label": "Ulkoasu",
                "color_label": "Valitse tyylit:",
                "colorset_tooltip": "Valitse tyylit eri geometria tyyleille",
                "tooltip": "Voit valita analyysin tuloksille sivuillesi sopivan tyylimaailman",
                "random_color_label": "Satunnaiset värit"
            },
            "buttons": {
                "save": "Tallenna",
                "analyse": "Luo vyöhyke",
                "data": "Valitse lähtöaineisto",
                "cancel": "Sulje",
                "ok": "OK"
            },
            "filter": {
                "title": "Suodatus",
                "description": "Suodatin tasolle ",
                "clearButton": "Tyhjennä suodatin",
                "refreshButton": "Päivitä suodatin",
                "addFilter": "Lisää uusi suodatin",
                "removeFilter": "Poista suodatin",
                "bbox": {
                    "title": "Ikkunarajaus",
                    "on": "Käytössä",
                    "off": "Pois käytöstä"
                },
                "clickedFeatures": {
                    "title": "Kohderajaus",
                    "label": "Sisällytä vain kartalta valitut kohteet"
                },
                "values": {
                    "title": "Suodatin",
                    "placeholders": {
                        "case-sensitive": "Case sensitive",
                        "attribute": "Attribuutti",
                        "boolean": "Looginen operaattori",
                        "operator": "Operaattori",
                        "attribute-value": "Arvo"
                    }
                },
                "validation": {
                    "title": "Seuraavat virheet estivät suodattimen päivityksen:",
                    "attribute_missing": "Attribuutti puuttuu",
                    "operator_missing": "Operaattori puuttuu",
                    "value_missing": "Arvo puuttuu",
                    "boolean_operator_missing": "Looginen operaattori puuttuu"
                }
            },
            "help": "Ohje",
            "success": {
                "layerAdded": {
                    "title": "Analyysi OK",
                    "message": "Lisätty uusi analyysitaso -- {layer} --"
                }
            },
            "error": {
                "title": "Virhe",
                "invalidSetup": "Virheellisiä parametrejä",
                "noParameters": "Ei tietoaineistoa, ei parametrejä",
                "noLayer": "Ei valittua tasoa",
                "noAnalyseUnionLayer": "Valitse ainakin toinen analyysitaso",
                "invalidMethod": "Tuntematon menetelmä: ",
                "bufferSize": "Virhe vyöhykkeen koossa",
                "illegalCharacters": "ei kirjaimia - käytä numeroita",
                "nohelp": "Ohjetta ei löytynyt",
                "saveFailed": "Analyysin tallennus epäonnistui. Yritä myöhemmin uudelleen.",
                "loadLayersFailed": "Analyysitasojen lataus epäonnistui. Yritä myöhemmin uudelleen.",
                "loadLayerTypesFailed": "Analyysi- tai WFS-tason tietotyyppien haku epäonnistui ",
                "Analyse_parameter_missing": "Analyysin parametrit puuttuvat",
                "Unable_to_parse_analysis": "Analyysin parametrit väärin",
                "Unable_to_get_WPS_features": "Analyysin WPS input kohteiden haku epäonnistui",
                "WPS_execute_returns_Exception": "Analyysin prosessointi epäonnistui",
                "WPS_execute_returns_no_features": "Analyysi ei palauta yhtään kohdetta",
                "Unable_to_process_aggregate_union": "Yhdisteen koosteen prosessointi epäonnistui",
                "Unable_to_get_features_for_union": "Koosteen input kohteiden haku epäonnistui",
                "Unable_to_store_analysis_data": "Analyysin tallennus epäonnistui",
                "Unable_to_get_analysisLayer_data": "Analyysitason tietojen parsinta epäonnistui",
				"server_error_key_limit": "Sallittujen GIS aineistojen määrä on ylittynyt."
            },
            "infos": {
                "title": "Tiedoksi",
                "layer": "Tasolla ",
                "over10": " on yli kymmenen ominaisuustietoa - valitse listalta korkeintaan 10"
            }
        },
        "StartView": {
            "text": "Voit analysoida valitsemiasi tietotuotteita ja paikkatietoja saatavilla olevilla analyysimenetelmillä ja tallentaa analyysin tulokset myöhempää käyttöä varten",
            "infoseen": {
                "label": "Älä näytä tätä viestiä uudelleen"
            },
            "buttons": {
                "continue": "Aloita analyysi",
                "cancel": "Poistu"
            }
        },
        "categoryform": {
            "name": {
                "label": "Nimi",
                "placeholder": "Anna tasolle nimi"
            },
            "drawing": {
                "label": "",
                "point": {
                    "label": "Piste",
                    "color": "Väri",
                    "size": "Koko"
                },
                "line": {
                    "label": "Viiva",
                    "color": "Väri",
                    "size": "Paksuus"
                },
                "area": {
                    "label": "Alue",
                    "fillcolor": "Täyttöväri",
                    "linecolor": "Viivan väri",
                    "size": "Viivan paksuus"
                }
            },
            "edit": {
                "title": "Muokkaa karttatasoa",
                "save": "Tallenna",
                "cancel": "Peruuta"
            }
        },
        "personalDataTab": {
            "grid": {
                "name": "Nimi",
                "delete": " "
            },
            "title": "Analyysit",
            "confirmDeleteMsg": "Haluatko poistaa analyysin \"{name}\"?",
            "buttons": {
                "ok": "Sulje",
                "cancel": "Peruuta",
                "delete": "Poista"
            },
            "notification": {
                "deletedTitle": "Karttatason poisto",
                "deletedMsg": "Karttataso poistettu."
            },
            "error": {
                "title": "Virhe!",
                "generic": "Järjestelmässä tapahtui virhe. Yritä uudelleen myöhemmin."
            }
        }
    }
});
