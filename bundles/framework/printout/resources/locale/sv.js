Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "Printout",
    "value": {
        "title": "Skriv ut kartvyn",
        "flyouttitle": "Skriv ut kartvyn",
        "desc": "",
        "btnTooltip": "Skriv ut",
        "BasicView": {
            "title": "Skriv ut kartvyn",
            "name": {
                "label": "Kartans namn",
                "placeholder": "obligatorisk uppgift",
                "tooltip": "Ge kartan ett beskrivande namn. Observera användargränssnittets språk"
            },
            "language": {
                "label": "Språk",
                "options": {
                    "fi": "finska",
                    "sv": "svenska",
                    "en": "engelska"
                },
                "tooltip": "Välj det språk som ska användas i tryck. Observera språket i användargränssnittet och datasetet."
            },
            "size": {
                "label": "Storlek",
                "tooltip": "Välj utskriftsstorlek. Uppdateringar visas i förhandsgranskningsbilden.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 porträtt",
                        "classForPreview": "förhandsgranska-porträtt",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 landskap",
                        "classForPreview": "förhandsgranska-landscape"
                    },
                    {
                        "id": "A3",
                        "label": "A3 porträtt",
                        "classForPreview": "förhandsgranska-porträtt"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 landskap",
                        "classForPreview": "förhandsgranska-landskap"
                    }
                ]
            },
            "preview": {
                "label": "Förhandsgranska",
                "tooltip": "Du kan förstora förhandsgranskningsbilden genom att klicka på den.",
                "pending": "Förhandsgransningsvyn uppdateras inom kort.",
                "notes": {
                    "extent": "Du kan kontrollera kartans omfattning för utskriften i förhandsgranskningsbilden.",
                    "restriction": "Alla kartlager visas inte i förhandsgransningsvyn"
                }
            },
            "buttons": {
                "save": "Få utskrift",
                "ok": "OK",
                "back": "Föregående",
                "cancel": "Avbryt"
            },
            "location": {
                "label": "Läge och skalnivå",
                "tooltip": "Utskriftens skalnivå motsvarar skalnivån i webbläsaren.",
                "zoomlevel": "Utskriftens skalnivå"
            },
            "settings": {
                "label": "Fler inställningar",
                "tooltip": "Välj ett filformat, en titel, en skala och ett datum för kartutskriften."
            },
            "format": {
                "label": "Filformat",
                "tooltip": "Välj fil format",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG bild"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "PDF dokument"
                    }
                ]
            },
            "mapTitle": {
                "label": "Kart rubrik",
                "tooltip": "Lägg till rubrik för kartan"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Visa finska geoportal Paikkatietoikkuna logotyp i utskriften.",
                        "tooltip": "Du kan dölja finska geoportal Paikkatietoikkuna logotyp vid behov.",
                        "checked": "kontrollerad"
                    },
                    {
                        "id": "pageScale",
                        "label": "Lägg en skala till kartutskriften.",
                        "tooltip": "Lägg till skala till kartan, om du vill.",
                        "checked": "kontrollerad"
                    },
                    {
                        "id": "pageDate",
                        "label": "Visa ett datum i kartutskriften.",
                        "tooltip": "Du kan lägga till ett datum till utskriften.",
                        "checked": "kontrollerad"
                    }
                ]
            },
            "legend": {
                "label": "Kart legend",
                "tooltip": "Välj en position för kartlegenden. Om någon position inte är vald, kommer en kart legend inte visas i kartutskriften.",
                "options": [
                    {
                        "id": "oskari_legend_NO",
                        "loca": "NO",
                        "label": "Ingen kartlegend",
                        "tooltip": "Kartlegenden visas inte i kart utskriften.",
                        "selected": true
                    },
                    {
                        "id": "oskari_legend_LL",
                        "loca": "LL",
                        "label": "Nedre vänstra hörn",
                        "tooltip": "Kartlegenden visas i det nedre vänstra hörnet av utskriften."
                    },
                    {
                        "id": "oskari_legend_LU",
                        "loca": "LU",
                        "label": "Övre vänstra hörn",
                        "tooltip": "Kartlegenden visas i övre vänstra hörnet på utskriften."
                    },
                    {
                        "id": "oskari_legend_RU",
                        "loca": "RU",
                        "label": "Övre högra hörnet",
                        "tooltip": "Kartlegenden visas i övre högra hörnet på utskriften."
                    },
                    {
                        "id": "oskari_legend_RL",
                        "loca": "RL",
                        "label": "Nedre högra hörn",
                        "tooltip": "Kartlegenden visas i övre högra hörnet på utskriften."
                    }
                ]
            },
            "help": "Hjälp",
            "error": {
                "title": "Fel",
                "size": "Fel i storleksdefinitionerna",
                "name": "Namnet är en nödvändig uppgift",
                "nohelp": "Ingen hjälp finns tillgänglig.",
                "saveFailed": "Utskriften av kartvyn lyckades inte. Försök igen senare.",
                "nameIllegalCharacters": "Namnet innehåller otillåtna tecken. Tillåtna tecken är bokstäverna az samt å, ä och ö, siffror, backsteg och bindestreck."
            }
        },
        "StartView": {
            "text": "Du kan skriva ut kartvyn du just skapat som en PNG-bild eller en PDF-fil.",
            "info": {
                "maxLayers": "Du kan använda högst åtta kartlager i utskriften.",
                "printoutProcessingTime": "Utskriften av kartvyn kan ta lite tid när flera lager är markerade."
            },
            "buttons": {
                "continue": "Fortsätt",
                "cancel": "Avbryt"
            }
        }
    }
}
);