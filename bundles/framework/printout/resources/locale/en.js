Oskari.registerLocalization(
{
    "lang": "en",
    "key": "Printout",
    "value": {
        "title": "Print Map View",
        "flyouttitle": "Print Map View",
        "desc": "",
        "btnTooltip": "Print the current map view to a PNG image or a PDF file.",
        "BasicView": {
            "title": "Print Map View",
            "name": {
                "label": "Map name",
                "placeholder": "required",
                "tooltip": "Type a name for your print-out. Please note the language used in the map layers."
            },
            "language": {
                "label": "Language",
                "options": {
                    "fi": "Finnish",
                    "sv": "Swedish",
                    "en": "English"
                },
                "tooltip": "Select a language for your print-out. Please note the language used in the user interface and map layers."
            },
            "size": {
                "label": "Size and direction",
                "tooltip": "Select a print size and direction. You can see updates in the preview image.",
                "options": [
                    {
                    "id": "A4",
                    "label": "A4 portrait",
                    "classForPreview": "preview-portrait",
                    "selected": true
                    },
                    {
                    "id": "A4_Landscape",
                    "label": "A4 landscape",
                    "classForPreview": "preview-landscape"
                    },
                    {
                    "id": "A3",
                    "label": "A3 portrait",
                    "classForPreview": "preview-portrait"
                    },
                    {
                    "id": "A3_Landscape",
                    "label": "A3 landscape",
                    "classForPreview": "preview-landscape"
                    }
                ]
            },
            "preview": {
                "label": "Preview",
                "tooltip": "Click the preview image to open a larger image in another window.",
                "pending": "The preview image will be updated shortly.",
                "notes": {
                    "extent": "Check the map extent area in the preview image.",
                    "restriction": "Only a background map is shown in the preview image."
                }
            },
            "buttons": {
                "save": "Print",
                "ok": "OK",
                "back": "Previous",
                "cancel": "Cancel"
            },
            "location": {
                "label": "Location and scale",
                "tooltip": "The printout scale matches the scale used in the preview map.",
                "zoomlevel": "Scale"
            },
            "settings": {
                "label": "Additional settings",
                "tooltip": "Select settings for your print-out."
            },
            "format": {
                "label": "File format",
                "tooltip": "Select a file format for your print-out.",
                "options": [
                    {
                    "id": "png",
                    "format": "image/png",
                    "label": "PNG image"
                    },
                    {
                    "id": "pdf",
                    "format": "application/pdf",
                    "selected": true,
                    "label": "PDF document"
                    }
                ]
            },
            "mapTitle": {
                "label": "Map Title",
                "tooltip": "Add a title for the map."
            },
            "content": {
                "options": [
                    {
                    "id": "pageLogo",
                    "label": "Add the logo of Liiteri",
                    "tooltip": "You can hide the logo if necessary",
                    "checked": "checked",
                    "cssClass" : "printout_pdfOnly"
                    },
                    {
                    "id": "pageScale",
                        "label": "Add a scale to the map printout.",
                        "tooltip": "Add a scale to the map, if you want.",
                    "checked": "checked"
                    },
                    {
                    "id": "pageDate",
                        "label": "Show a date in the map printout.",
                        "tooltip": "You can add a date to the printout.",
                    "checked": "checked",
                    "cssClass" : "printout_pdfOnly"
                }, {
                    "id": "pageLegend",
                    "label": "Add layers legend",
                    "tooltip": "You can add layers legend to the printout",
                    "checked": "checked",
                    "cssClass" : "printout_pdfOnly"
                    }
                ]
            },
            "legend": {
                "label": "Map legend",
                "tooltip": "Select a position for the map legend. If any position is not selected, a map legend is not shown in the map printout.",
                "options": [
                    {
                        "id": "oskari_legend_NO",
                        "loca": "NO",
                        "label": "No map legend",
                        "tooltip": "The map legend is not shown in the map printout."
                    },
                    {
                        "id": "oskari_legend_LL",
                        "loca": "LL",
                        "label": "Left lower corner",
                        "tooltip": "The map legend is shown in the left lower corner of the printout.",
                        "selected": true
                    },
                    {
                        "id": "oskari_legend_LU",
                        "loca": "LU",
                        "label": "Left upper corner",
                        "tooltip": "The map legend is shown in the left upper corner of the printout."
                    },
                    {
                        "id": "oskari_legend_RU",
                        "loca": "RU",
                        "label": "Right upper corner",
                        "tooltip": "The map legend is shown in the right upper corner of the printout."
                    },
                    {
                        "id": "oskari_legend_RL",
                        "loca": "RL",
                        "label": "Right lower corner",
                        "tooltip": "The map legend is shown in the right upper corner of the printout."
                    }
                ]
            },
            "help": "Help",
            "error": {
                "title": "Error",
                "size": "Error in size definitions",
                "name": "Name is required information",
                "nohelp": "There is no help available.",
                "saveFailed": "Printing the map view not succeeded. Please try again later.",
                "nameIllegalCharacters": "The name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens."
            }
        },
        "StartView": {
            "text": "You can print out the Map view you just created as a PNG image or a PDF file.",
            "info": {
                "maxLayers": "You can use at most eight map layers in the printout.",
                "printoutProcessingTime": "Printing out the map view may take some time when multiple layers are selected."
            },
            "buttons": {
                "continue": "Continue",
                "cancel": "Cancel"
            }
        }
    }
}
);