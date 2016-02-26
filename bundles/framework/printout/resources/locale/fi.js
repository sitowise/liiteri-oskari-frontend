Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "Printout",
    "value": {
        "title": "Tulosta karttanäkymä",
        "flyouttitle": "Tulosta karttanäkymä",
        "desc": "",
        "btnTooltip": "Tulosta nykyinen karttanäkymä png-kuvaksi tai pdf-tiedostoon.",
        "BasicView": {
            "title": "Tulosta karttanäkymä",
            "name": {
                "label": "Kartan nimi",
                "placeholder": "pakollinen",
                "tooltip": "Anna tulostettavalle kartalle nimi. Ota huomioon kartan teksteissä käytetty kieli."
            },
            "language": {
                "label": "Kieli",
                "options": {
                    "fi": "suomi",
                    "sv": "ruotsi",
                    "en": "englanti"
                },
                "tooltip": "Valitse tulosteessa käytettävä kieli. Ota huomioon käyttöliittymässä ja aineistossa käytetty kieli."
            },
            "size": {
                "label": "Koko ja suunta",
                "tooltip": "Valitse tulosteen arkkikoko ja suunta. Tarkista muutokset esikatselukuvasta.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 pystysuunta",
                        "classForPreview": "preview-portrait",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 vaakasuunta",
                        "classForPreview": "preview-landscape"
                    },
                    {
                        "id": "A3",
                        "label": "A3 pystysuunta",
                        "classForPreview": "preview-portrait"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 vaakasuunta",
                        "classForPreview": "preview-landscape"
                    }
                ]
            },
            "preview": {
                "label": "Esikatselu",
                "tooltip": "Klikkaa esikatselukuvaa avataksesi sen suuremmassa koossa uudessa ikkunassa.",
                "pending": "Esikatselukuva päivitetään hetken kuluttua.",
                "notes": {
                    "extent": "Tarkista tulosteen kattavuusalue esikatselukuvasta.",
                    "restriction": "Esikatselukuvassa näytetään ainoastaan taustakartta."
                }
            },
            "buttons": {
                "save": "Tulosta",
                "ok": "OK",
                "back": "Edellinen",
                "cancel": "Peruuta"
            },
            "location": {
                "label": "Sijainti ja mittakaava",
                "tooltip": "Kartan mittakaava tulosteessa vastaa esikatselukuvassa näytettävän kartan mittakaavaa.",
                "zoomlevel": "Mittakaava"
            },
            "settings": {
                "label": "Lisäasetukset",
                "tooltip": "Valitse asetukset karttatulosteelle."
            },
            "format": {
                "label": "Tiedostomuoto",
                "tooltip": "Valitse tiedostomuoto, jossa haluat tulosteen.",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG-kuva"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "PDF-dokumentti"
                    }
                ]
            },
            "mapTitle": {
                "label": "Näytettävät tiedot",
                "tooltip": "Valitse tulosteessa näytettävät tiedot."
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Näytä palvelun logo",
                        "tooltip": "Näytä tulosteessa tämän palvelun logo.",
                        "checked": "checked",
                        "cssClass" : "printout_pdfOnly"
                    },
                    {
                        "id": "pageScale",
                        "label": "Näytä mittakaava",
                        "tooltip": "Näytä tulosteessa kartan mittakaava.",
                        "checked": "checked"
                    },
                    {
                        "id": "pageDate",
                        "label": "Näytä päivämäärä",
                        "tooltip": "Näytä tulosteessa sen laatimispäivämäärä.",
                        "checked": "checked",
                        "cssClass" : "printout_pdfOnly"
                    },
                    {
                        "id": "pageLegend",
                        "label": "Lisää karttatasojen legenda (tulostuu toiselle sivulle)",
                        "tooltip": "You can add layers legend to the printout",
                        "checked": "checked",
                        "cssClass" : "printout_pdfOnly"
                    }
                ]
            },
            "legend": {
                "label": "Teemakartan karttaselitteen sijainti",
                "tooltip": "Valitse karttaselitteelle sijainti tulosteessa. Jos sijaintia ei ole valittuna, karttaselitettä ei näytetä tulosteessa.",
                "options": [
                    {
                        "id": "oskari_legend_NO",
                        "loca": "NO",
                        "label": "Ei karttaselitettä",
                        "tooltip": "Karttaselitettä ei näytetä tulosteessa.",
                        "selected": true
                    },
                    {
                        "id": "oskari_legend_LL",
                        "loca": "LL",
                        "label": "Vasemmassa alanurkassa",
                        "tooltip": "Karttaselite näytetään tulosteen vasemmassa alanurkassa."
                    },
                    {
                        "id": "oskari_legend_LU",
                        "loca": "LU",
                        "label": "Vasemmassa ylänurkassa",
                        "tooltip": "Karttaselite näytetään tulosteen vasemmassa ylänurkassa."
                    },
                    {
                        "id": "oskari_legend_RU",
                        "loca": "RU",
                        "label": "Oikeassa ylänurkassa",
                        "tooltip": "Karttaselite näytetään tulosteen oikeassa ylänurkassa."
                    },
                    {
                        "id": "oskari_legend_RL",
                        "loca": "RL",
                        "label": "Oikeassa alanurkassa",
                        "tooltip": "Karttaselite näytetään tulosteen oikeassa alanurkassa."
                    }
                ]
            },
            "help": "Ohje",
            "error": {
                "title": "Virhe",
                "size": "Tulosteen koko on virheellinen.",
                "name": "Kartalle ei ole annettu nimeä. Anna kartan nimi ja yritä uudelleen.",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Tulostus epäonnistui.",
                "nameIllegalCharacters": "Kartan nimessä on kiellettyjä merkkejä. Sallittuja merkkejä ovat suomen kielen aakkoset (a-ö, A-Ö), numerot (0-9), välilyönti ja yhdysmerkki (-)."
            }

        },
        "StartView": {
            "text": "Tulosta karttanäkymä tiedostoon. Tiedosto voi olla joko PNG-kuva tai PDF-tiedosto.",
            "info": {
                "maxLayers": "Tulosteessa voi olla enintään kahdeksan karttatasoa.",
                "printoutProcessingTime": "Tulostus voi kestää hetken, jos valittuna on useita karttatasoja."
            },
            "buttons" : {
                "continue" : "Jatka",
                "cancel" : "Peruuta"
            }
        }
    }
});
