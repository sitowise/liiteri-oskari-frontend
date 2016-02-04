Oskari.registerLocalization({
    "lang": "fi",
    "key": "admin-layerselector",
    "value": {
        "title": "Karttatasojen ylläpito",
        "desc": "",
        "flyout": {
            "title": "Karttatasojen hallinta",
            "fetchingLayers" : "Haetaan tasoja."
        },
        "tile": {
            "title": "Karttatasot",
            "tooltip": "."
        },
        "view": {
            "title": "",
            "prompt": "",
            "templates": {}
        },
        "errors": {
            "title": "Virhe!",
            "generic": "Järjestelmässä tapahtui virhe. Yritä myöhemmin uudelleen.",
            "loadFailed": "Karttatasojen latauksessa tapahtui virhe. Päivitä sivu selaimessasi ja valitse karttatasot uudelleen.",
            "noResults": "Haulla ei löytynyt yhtään tulosta.",
            "layerTypeNotSupported": "Karttatason tyyppiä ei vielä tueta:",
            "not_empty": "Teemaan, jota yrität poistaa, on liitetty karttatasoja. Valitse karttatasoille ensin toinen teema."
        },
        "loading": "Ladataan...",
        "filter": {
            "text": "Hae karttatasoja",
            "inspire": "Aiheittain",
            "organization": "Tiedontuottajittain",
            "published": "Käyttäjät",
            "userThemes": "Teemat"
        },
        "published": {
            "organization": "Julkaistu taso",
            "inspire": "Julkaistu taso"
        },
        "tooltip": {
            "type-base": "Taustakartta",
            "type-wms": "Karttataso",
            "type-wfs": "Tietotuote"
        },
        "backendStatus": {
            "OK": {
                "tooltip": "Karttataso on saatavilla tällä hetkellä.",
                "iconClass": "backendstatus-ok"
            },
            "DOWN": {
                "tooltip": "Karttataso ei ole saatavilla tällä hetkellä.",
                "iconClass": "backendstatus-down"
            },
            "MAINTENANCE": {
                "tooltip": "Karttatason saatavuudessa on tiedossa katkoksia lähipäivinä.",
                "iconClass": "backendstatus-maintenance"
            },
            "UNKNOWN": {
                "tooltip": "",
                "iconClass": "backendstatus-ok"
            }
        },
        "admin": {
            "capabilitiesLabel": "Capabilities",
            "confirmResourceKeyChange": "Olet muuttanut Karttatason yksilöivä nimi- tai Rajapinnan osoite -kentän arvoja. Tietoturvasyistä karttatason käyttöoikeudet poistetaan ja ne täytyy asettaa uudelleen. Haluatko jatkaa?",
            "confirmDeleteLayerGroup": "Karttatasoryhmä poistetaan. Haluatko jatkaa?",
            "confirmDeleteLayer": "Karttataso poistetaan. Haluatko jatkaa?",
            "layertypes": {
                "wms": "WMS-taso",
                "wfs": "WFS-taso",
                "wmts": "WMTS-taso",
                "arcgis": "ArcGIS-taso",
                "arcgislayer": "ArcGis Taso
            },
            "selectLayer": "Valitse ylätaso",
            "selectSubLayer": "Valitse alataso",
            "addOrganization": "Lisää tiedontuottaja",
            "addOrganizationDesc": "Lisää uusi tiedontuottaja eli karttatason tuottava organisaatio.",
            "addInspire": "Lisää aihe",
            "addInspireDesc": "Lisää uusi aihe eli karttatasoa kuvaava Inspire-teema.",
            "addLayer": "Lisää karttataso",
            "addLayerDesc": "Lisää karttataso tähän Inspire-teemaan",
            "edit": "Muokkaa",
            "editDesc": "Muokkaa karttatason nimeä",
            "layerType": "Tason tyyppi",
            "layerTypeDesc": "Valitse tason tyyppi. Tällä hetkellä vaihtoehdot ovat WMS (Web Map Service), WFS (Web Feature Service), WMTS (Web Map Tile Service) ja ArcGIS (ArcGIS REST -rasteritaso).",
            "type": "Tason tyyppi",
            "typePlaceholder": "Valitse tason tyyppi",
            "baseLayer": "Taustakarttataso",
            "groupLayer": "Karttatasoryhmä",
            "wfslayer": "WFS-taso",
            "arcgisLayer": "ArcGis-taso",
            "interfaceVersion": "Rajapinnan versio",
            "interfaceVersionDesc": "Rajapinnan versio",
            "wms1_1_1": "WMS 1.1.1",
            "wms1_3_0": "WMS 1.3.0",
            "wfs1_0_0": "WFS 1.0.0",
            "wfs1_1_0": "WFS 1.1.0",
//            "wfslayer": "WFS Taso",
//            "wmtslayer": "WMTS Taso",
            "getInfo": "Hae tiedot",
            "editWfs": "WFS muokkaus",
            "selectClass": "Valitse aihe",
            "selectClassDesc": "Valitse aihe",
            "baseName": "Taustatason nimi",
            "groupName": "Ryhmätason nimi",
            "subLayers": "Alatasot",
            "addSubLayer": "Lisää alataso",
            "wmsInterfaceAddress": "Rajapinnan osoitteet",
            "wmsUrl": "Rajapinnan osoitteet",
            "wmsInterfaceAddressDesc": "Anna rajapinnan URL-osoite tai -osoitteet pilkulla eroteltuna.",
            "wmsServiceMetaId": "Palvelun metatiedon tunniste",
            "wmsServiceMetaIdDesc": "Anna rajapintapalvelua kuvaavan metatiedon tiedostotunniste.",
            "layerNameAndDesc": "Tason nimi ja kuvaus",
			
			"downloadServiceUrlDesc": "Latauspalvelun osoite",
			"downloadServiceUrl": "Latauspalvelun osoite",
			"copyrightInfoDesc": "Tiedontuottaja",
			"copyrightInfo": "Tiedontuottaja",

            "metaInfoIdDesc": "Paikkatieto&shy;hakemiston metatiedon tiedostotunniste, joka yksilöi metatiedon XML kuvailun",
            "metaInfoId": "Metatiedon tiedosto&shy;tunniste",
            "wmsName": "Karttatason yksilöivä nimi",
            "wmsNameDesc": "Karttatason yksilöivä eli tekninen nimi",
            "username": "Käyttäjätunnus",
            "password": "Salasana",
            "wfsusername": "Käyttäjänimi",
            "wfspassword": "Salasana",
            "wfsgmlversion": "GML versio",
            "wfsgmlgeometryproperty": "GML geometria-attribuutti",
            "wfsfeaturenamespaceURI": "Kohteen nimiavaruuden osoite (URI)",
            "wfsfeaturenamespace": "Kohteen nimiavaruus",
            "wfsfeatureelement": "Kohde-elementti",
            "wfsgeometrynamespaceURI": "Geometrian nimiavaruuden osoite (URI)",

            "addInspireName": "Aiheen nimi",
            "addInspireNameTitle": "Aiheen nimi",
            "addOrganizationName": "Tiedontuottajan nimi",
            "addOrganizationNameTitle": "Tiedontuottajan nimi",
            "addNewClass": "Lisää uusi teema",
            "addNewLayer": "Lisää uusi karttataso",
            "addNewGroupLayer": "Lisää uusi ryhmätaso",
            "addNewBaseLayer": "Lisää uusi taustataso",
            "addNewOrganization": "Lisää uusi tiedontuottaja",
            "addInspireTheme": "Aihe",
            "addInspireThemeDesc": "Valitse Inspire-direktiivin liitteissä olevien teemojen mukainen aihe.",
            "opacity": "Peittävyys",
            "opacityDesc": "Tason peittävyys (arvo 0% tekee tasosta oletuksena näkymättömän)",
            "style": "Oletustyyli",
            "styleDesc": "Oletustyyli",
            "minScale": "Pienin mittakaava",
            "minScaleDesc": "Pienin mittakaava, jolla karttataso voidaan esittää (1:5669294)",
            "minScalePlaceholder": "Pienin mittakaava muodossa 5669294 (1:5669294)",
            "maxScale": "Suurin mittakaava",
            "maxScaleDesc": "Suurin mittakaava, jolla karttataso voidaan esittää (1:1)",
            "maxScalePlaceholder": "Suurin mittakaava muodossa 1 (1:1)",
            "srsName": "Koordinaatti&shy;järjestelmä",
            "srsNamePlaceholder": "Koordinaattijärjestelmä",
            "legendImage": "Karttaselitteen osoite",
            "legendImageDesc": "Osoite rajapintapalvelussa olevaan karttatasoa kuvaavaan karttaselitteeseen.",
            "legendImagePlaceholder": "Anna karttaselitteen url-osoite.",
            "gfiContent": "Kohdetietoikkunan lisäsisältö",
            "gfiResponseType": "GFI-vastaustyyppi",
            "gfiResponseTypeDesc": "Kohdetietokyselyn (GFI=Get Feature Info) vastauksen tyyppi.",
            "gfiStyle": "GFI-tyyli (XSLT)",
            "gfiStyleDesc": "Kohdetietokyselyn (GFI=Get Feature Info) vastauksen tyyli XSLT-muodossa.",
            "matrixSetId": "WMTS-tiilimatrisin tunniste",
            "matrixSetIdDesc": "WMTS-tiilimatriisin tunniste (TileMatrixSet id)",
            "matrixSet": "WMTS-tason JSON",
            "matrixSetDesc": "WMTS-tason tiedot JSON-muodossa",
            "realtime": "Reaaliaikataso",
            "refreshRate": "Virkistystaajuus (sekunneissa)",
            "generic": {
                "placeholder": "Nimi kielellä {0}",
                "descplaceholder": "Kuvaus kielellä {0}"
            },
            "en": {
                "title": "En",
                "placeholder": "Nimi englanniksi",
                "descplaceholder": "Kuvaus englanniksi"
            },
            "fi": {
                "title": "Fi",
                "placeholder": "Nimi suomeksi",
                "descplaceholder": "Kuvaus suomeksi"
            },
            "sv": {
                "title": "Sv",
                "placeholder": "Nimi ruotsiksi",
                "descplaceholder": "Kuvaus ruotsiksi"
            },
            "interfaceAddress": "Rajapinnan osoite",
            "interfaceAddressDesc": "Anna rajapinnan osoite ilman ?-merkkiä ja sen jälkeisiä parametreja.",
            "arcgisMapServerInterfaceAddress": "Karttapalvelimen rajapinnan osoite",
            "arcgisMapServerAddress": "Karttapalvelimen osoite",
            "wfsInterfaceAddress": "WFS-rajapinnan osoite",
            "layersLabel": "Saatavissa olevat tasot",
            "layerName": "Tason nimi",
            "viewingRightsRoles": "Katseluoikeudet rooleille",
            "metadataReadFailure": "Karttatason metatietojen haku epäonnistui.",
            "permissionFailure": "Virheellinen käyttäjätunnus tai salasana.",
            "mandatory_field_missing": "Pakollinen tieto:",
            "invalid_field_value": "Virheellinen arvo:",
            "operation_not_permitted_for_layer_id": "Käyttöoikeutesi eivät riitä tason muokkaamiseen tai lisäämiseen.",
            "no_layer_with_id": "Virhe: Karttatasoa ei löytynyt. Se on mahdollisesti jo poistettu.",
            "success": "Tallennus onnistui.",
            "errorRemoveLayer": "Karttatason poisto ei onnistunut.",
            "errorInsertAllreadyExists": "Uusi taso lisätty, mutta samalla id:llä oleva taso on jo olemassa!!",
            "errorRemoveGroupLayer": "Karttatasoryhmän poisto epäonnistui.",
            "errorSaveGroupLayer": "Karttatasoryhmän tallennus epäonnistui.",
            "errorTitle": "Virhe",
            "warningTitle": "Varoitus",
            "successTitle": "Tallennettu"
        },
        "cancel": "Peruuta",
        "add": "Lisää",
        "save": "Tallenna",
        "delete": "Poista",
        "ok": "OK"
    }
});
