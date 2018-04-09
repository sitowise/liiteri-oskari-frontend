Oskari.registerLocalization({
    "lang": "fi",
    "key": "liiteri-urbanplanning",
    "value": {
        "title": "Asemakaavat",
        "flyouttitle": "Asemakaavat",
        "desc": "",
        "flyout": {
            "desc": ""
        },
        "tile": {
            "title": "Asemakaavojen seurantalomakkeet",
            "goToMapService": "Kartta"
        },
        "error": {
            "title": "Virhe",
            "duplicate_date": "Voit antaa kerralla samasta aikavalinnan vaihtoehdosta vain yhden ajanjakson. Poista edellinen aikavalinta ennen uuden lisäystä.",
            "empty_filter": "Anna ainakin yksi hakukriteeri ennen haun aloittamista",
            "max_limit_reached": "Hakusi tuotti yli 2100 tulosta, muuta hakukriiterejä pienentääksesi tulosjoukkoa"
        },
        "tilePlugin": {
            "tiles": {
                "plans": {
                    "title": "Asemakaavojen seurantalomakkeet"
                },
                "markings": {
                    "title": "Kaavamerkinnät"
                },
                "people" : {
                    "title": "Yhteyshenkilöt"
                }
            },
        },
        "view": {
            "title": "Asemakaavojen seurantalomakkeet",
            "datatablelanguagefile": "Finnish.json",
            "info": {
                "title": "Ohje",
                "selectedFilter": "<p>Valikkoon kertyvät näkyviin käyttäjän valitsemat hakuehdot, joilla rajataan haettavia asemakaavojen seurantalomakkeita. Hakuehdot valitaan alla olevista valikoista: <i>Kaava</i>, <i>Aika</i> ja <i>Alue</i>. Hakuehtoja ei tarvitse valita kaikista valikoista, mutta useamman hakuehdon valinta nopeuttaa hakua. Ainakin yksi hakuehto on valittava. Samoihin hakuehtoihin voi palata myöhemmin tekemällä hakuun selaimen toiminnoilla kirjanmerkin.</p><p>Kaikkiin eri valikoihin liittyvien hakuehtojen tulee täyttyä, jotta tietty asemakaavan seurantalomake haetaan (esim. jonkun kunnan lomakkeet, jotka on täytetty tietyn ajankohdan jälkeen). Aluevalintaehtojen eri vaihtoehtojen ei kuitenkaan tarvitse olla yhtä aikaa voimassa (esim. haetaan samalla kertaa Helsingin ja Vantaan lomakkeet). Esimerkki hakuehtojen yhteisvaikutuksesta: haetaan lomakkeet, jotka sijaitsevat Uudenmaan ympäristö-ELYn TAI Hämeen ympäristö-ELYn alueella (saman valikon eri ympäristö-ELY-vaihtoehdot) JA joiden hyväksymisajankohta on aikaisintaan 1.1.2015 (hyväksymispäivän valinta).</p><p>Annettuja hakuehtoja voi muuttaa poistamalla hakuehdon <i>Valitut hakuehdot</i> -valikosta, hakuehdon perässä näkyvästä rastista klikkaamalla, ja tekemällä uuden valinnan haluamastaan valikosta. Kaikki hakuehdot voi tyhjentää yhdellä kertaa klikkaamalla <i>Tyhjennä valinnat</i> -painikkeesta.</p><p>Hakuehtojen antamisen jälkeen saadaan hakuehtojen mukaiset lomakkeet listana Hae-painiketta klikkaamalla. Käyttäjä voi missä vaiheessa tahansa muuttaa hakuehtoja ja tehdä uuden haun.</p>",
                "formatFilter": "<p>Valikossa voi valita asemakaavan seurantalomakkeita kaavan nimen, tunnusten, tyypin ja/tai hyväksyjän perusteella. Valitut hakuehdot tulevat näkyviin <i>Valitut hakuehdot</i> -valikkoon.</p><p><i>Anna nimi tai tunnus…</i><br/>Toiminnossa rajataan haku niihin asemakaavoihin, joiden suomen- tai ruotsinkielinen nimi tai kunnan kaavatunnus, generoitu kaavatunnus tai TYVI-tunnus sisältää käyttäjän kirjoittamat merkit.  Käyttäjä kirjoittaa haluamansa määrän asemakaavan nimessä tai tunnuksessa esiintyviä merkkejä (esim. 10. kaupunginosa tai 091), jolloin merkkijono tulee hakuehdoksi.</p><p><i>Kaavatyyppi</i><br/>Toiminnossa rajataan haku tietyn tyyppisiin asemakaavoihin. Kaavatyyppien vaihtoehdot ovat:</p><p>Asemakaava (ei ranta-asemakaavoja eikä kokonaan maanalaisia asemakaavoja) - Hakuun ei sisälly ranta-asemakaavoja eikä kokonaan maanalaisia asemakaavoja. Näissä ns. tavallisissa asemakaavoissa ovat mukana myös osittain maanalaista tilaa sisältävät asemakaavat eli seurantalomakkeet, joissa on kaavan maantason pinta-alan lisäksi maanalaisia tiloja.</p><p>Ranta-asemakaava - Hakuun otetaan mukaan ne seurantalomakkeet, joissa on vähintään yksi ranta-asemakaavaa koskevista tiedoista (rantaviivan pituus, omarantaiset ja muut rakennuspaikat ja lomarakennuspaikat).</p><p>Asemakaava, jossa maanalaista tilaa - Hakuun otetaan mukaan ne seurantalomakkeet, joissa on maanalaista tilaa. Maanalaista tilaa sisältävät asemakaavat voivat olla osin (kaavassa lisäksi maantason pinta-alaa) tai kokonaan (kaavassa vain maanalaista tilaa) maanalaisia asemakaavoja.</p><p>Kerralla voi valita yhden tai useita kaavatyypeistä. Huom. kaavatyypit eivät ole toisensa poissulkevia, vaan sama asemakaava saattaa sisältyä useaan hakuun. Esim. osin maanalaiset asemakaavat kuuluvat sekä ensimmäiseen että kolmanteen tyyppiin.</p><p><i>Hyväksyjä</i><br/>Toiminnossa rajataan haku eri luottamusorganisaatioiden hyväksymiin asemakaavoihin. Asemakaavan hyväksymispäätöksen tekijän vaihtoehdot ovat kunnanvaltuusto (V), kunnanhallitus (H) ja lautakunta (L). Kerralla voi valita yhden tai useita päätöksentekijöistä.</p>",
                "timeFilter": "<p>Valikossa voi valita aikavälin, jolta tietoja haetaan. Valitut aikarajaukset tulevat näkyviin ylös <i>Valitut hakuehdot</i> -valikkoon. Aikavalintaan on liitettävä päivämäärärajaus valitsemalla <i>Alku</i> ja/tai <i>Loppu</i>. Kerralla voi valita yhden tai useita aikavalintoja. Valintojen jälkeen ajanjakso on hyväksyttävä hakuehdoksi <i>Hyväksy ajanjakso</i> -painikkeella.</p><p><i>Aika</i><br/>Aikavalintojen vaihtoehdot alasvetovalikossa ovat: </p><p>Hyväksymispvm - Hakuun otetaan mukaan ne seurantalomakkeet, joissa hyväksymispäivämäärä on valitulla aikavälillä. Asemakaavan hyväksymispäivämäärä on viimeinen, mahdollisen ympäristö-ELYn (ent. alueellisen ympäristökeskuksen) oikaisukehotuksen jälkeen tehdyn hyväksymisen päiväys.</p><p>Ehdotuspvm - Hakuun otetaan mukaan ne seurantalomakkeet, joissa ehdotuspäivämäärä on valitulla aikavälillä. Asemakaavaehdotuksen päivämäärä on viimeisin päiväys mahdollisista useista kaavaluonnosten hyväksymispäätöksistä. Kunnan lautakunnan, hallituksen, valtuuston tms. hyväksyttyä kaavaluonnoksen, se asetetaan kaavaehdotuksena nähtäville.</p><p>Vireilletulosta ilm. pvm - Hakuun otetaan mukaan ne seurantalomakkeet, joissa vireilletulosta ilmoittamisen päivämäärä on valitulla aikavälillä. Asemakaavan vireilletulosta ilmoittamisen päivämäärä on MRL 63 § mukaisen tiedottamistavan ajankohta. Vireilletulosta ilmoittaminen voi esim. liittyä osallistumis- ja arviointisuunnitelmaan, tapahtua kirjeitse asianosaisille, sanomalehti-ilmoituksella osallisille tai kaavoituskatsauksesta tiedottamisen yhteydessä.</p><p>Täyttämispvm - Hakuun otetaan mukaan ne seurantalomakkeet, joissa täyttämispäivämäärä on valitulla aikavälillä. Täyttämispäivämäärä kertoo milloin ko. kaavan seurantalomakkeen täyttäjä on viimeksi muuttanut tietoja.</p><p><i>Alku</i><br/>Käyttäjä valitsee haluamansa ajanjakson alkupäivämäärän joko käsin kirjoittamalla tai valitsemalla kalenterista. Jos alkupäivän jättää pois, haetaan kaikki tiedot loppupäivään asti ja jos loppupäivän jättää pois, haetaan tiedot alkupäivästä tähän päivään asti.</p><p><i>Loppu</i><br/>Käyttäjä valitsee haluamansa ajanjakson loppupäivämäärän joko käsin kirjoittamalla tai valitsemalla kalenterista.</p>",
                "areaFilter": "<p>Valikossa voi valita alueen, jonka asemakaavan seurantalomakkeita halutaan tarkastella. Valitut alueet tulevat näkyviin ylös <i>Valitut hakuehdot</i> -valikkoon. Tarkastelualueet ovat aina voimassa olevien rajojen mukaiset.</p><p>Suuralue, hallinto-oikeus, ympäristö-ELY, maakunta, seutukunta ja/tai kunta valitaan klikkaamalla haluttua kohdetta kunkin aluetason valintalistasta. Aluetta voi myös etsiä nimellä valintalistan yläreunassa olevaa hakutoimintoa apuna käyttäen.  Useita kohteita voi valita toistamalla edellä esitetyn valintamenettelyn.</p><p>Aluevalintojen eri aluetasojen ei tarvitse olla yhtä aikaa voimassa. Käyttäjä voi valita useita alueita kultakin aluetasolta. Jos käyttäjä valitsee samaan hakuun esimerkiksi ympäristö-ELYn ja kunnan jonkun muun kuin jo valitun ympäristö-ELYn toimialueelta, tulevat näkyviin sekä valitun ympäristö-ELYn että kyseisen kunnan asemakaavojen seurantalomakkeet.</p>",
            },
            "error": {
                "title": "Virhe",
                "duplicate_date": "Voit antaa kerralla samasta aikavalinnan vaihtoehdosta vain yhden ajanjakson. Poista edellinen aikavalinta ennen uuden lisäystä.",
                "empty_filter": "Anna ainakin yksi hakukriteeri ennen haun aloittamista",
                "max_limit_reached": "Hakusi tuotti yli 2100 tulosta, muuta hakukriiterejä pienentääksesi tulosjoukkoa",
                "incorrectDateFormat": "Annettu päivämäärä on virheellinen",
                "csvLoadingError": "Tietojen haussa tapahtui virhe. Yritä myöhemmin uudelleen.",
                "max_keywords": "Hakuehtoihin voi lisätä korkeintaan 100 nimeä tai tunnusta"
            },
            "search": {
                "searchtitle": "Asemakaavojen haku",
                "entername": "Anna nimi tai tunnus...",
                "selecttype": "Kaavatyyppi",
                "selectarea": "Alue",
                "acceptedby": "Hyväksyjä",
                "filterbytime": "Aika",
                "filterbyformat": "Kaava",
                "selectedfilter": "Valitut hakuehdot",
                "from": "Alku",
                "to": "Loppu",
                "dateFormat": "pp.kk.vvvv",
                "show": "Hae",
                "clear": "Tyhjennä valinnat",
                "apply": "Hyväksy ajanjakso",                
                "noResultText": "Ei hakutuloksia",
                "add": "Lisää hakuehdoksi"
            },
            "table": {
                "searchresult": "Hakutulokset - Asemakaavat listana",
                "summary": "Tee yhteenveto kaavoista",
                "download": "Vie kaavat tiedostoon",
                "print": "Tulosta",
                "close": "Sulje",
                "cancel": "Peruuta",
                "select": "Select",
                "id": "Tunnus",
                "name": "Kaavan nimi",
                "municipalityPlanId": "Kunnan kaavatunnus",
                "initialDate": "Vir.pvm",
                "generatedPlanId": "Gen. kaavatunnus",
                "proposalDate": "Ehd.pvm",
                "approvalDate": "Hyv.pvm",
                "municipalityId": "Kuntakoodi",
                "municipality": "Kunta",
                "fillDate": "Täyttämispvm",
                "searchPlaceHolder": "vapaa sanahaku",
                "tyviId": "TYVI-tunnus"
            },
            "csv": {
                "loadingTitle" : "Tietoja ladataan",
                "loadingMessage": "Haetaan {1}/{2}",
                "createdTitle" : "Tiedot tiedostoissa",
                "createdInfo": "Tiedot on kirjoitettu kahteen tiedostoon: ensimmäiseen perustiedot ja rakennussuojelu sekä toiseen alamerkinnät valittujen asemakaavojen seurantalomakkeista. Klikkaa molempia linkkejä tallettaaksesi tiedostot omaan hakemistoosi. Tiedostoista voit yhdistää samaa asemakaavaa koskevat tiedot Asemakaava_Id:n perusteella.",
                "createdExample": "Esimerkkinä 10 ensimmäistä riviä asemakaavojen perustietojen ja rakennussuojelun tiedoston sisällöstä.",
                "createdExampleMarkings": "Esimerkkinä 10 ensimmäistä riviä asemakaavojen alamerkintöjen tiedoston sisällöstä.",
                "close": "Sulje",
                "delete" : "Peruuta",
                "file" : "Tiedostoon",
                "fieldSeparator": "Kenttien erotin",
                "stringDelimiter": "Merkijonon erotin",
                "nullSymbolizer": "Puuttuvan numeerisen tiedon merkki",
                "decimalPointSeparator" : "Desimaalierotin",
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
                "disclaimer" : [
                    "Elinympäristön tietopalvelu Liiteri / Asemakaavojen seurantalomakkeet, {DATE}",
                    "Asemakaavojen seurantalomakkeet sisältävät kuntien sähköisesti valtion ympäristöhallinnolle toimittamaa tietoa vuonna 2000 voimaan tulleen maankäyttö-ja rakennuslain mukaisesta asemakaavoituksesta."
                ] 
            },
            "planDetail": {
                "summaryTitle": "Asemakaavojen yhteenveto",
                "detailTitle": "Asemakaavan perustiedot ja yhteenveto",
                "summaryHeader": "Asemakaavat, joista yhteenveto on tehty:",
                "disclaimer": "Asemakaavojen seurantalomakkeet sisältävät kuntien sähköisesti valtion ympäristöhallinnolle toimittamaa tietoa vuonna 2000 voimaan tulleen maankäyttö- ja rakennuslain mukaisesta asemakaavoituksesta. Asemakaavojen tiedot ovat selailtavissa syyskuussa 2003 käyttöönotetulla TYVI-järjestelmällä saaduista lomakkeista ja vuosina 2000-03 hyväksyttyjen kaavojen excel-muotoisista seurantalomakkeista. Uudet tiedot kopioituvat TYVI-operaattorilta joka yö, sekä keskeneräisistä että valmiiksi täytetyistä lomakkeista. Kunta tai sen valtuuttama konsultti toimittaa jokaisesta asemakaavasta, myös ranta-asemakaavasta <a target='_blank' href='http://www.ymparisto.fi/fi-FI/Elinymparisto_ja_kaavoitus/Maankayton_suunnittelujarjestelma/Tietoa_kaavoituksesta/Asemakaavan_seurantalomake'>seurantalomakkeen</a> viimeistään kun kaava on hyväksytty.",
                "detailInfoHeader" : "Alamerkinnät",
                "main": {
                    "decisionMaker": "Hyväksyjä",
                    "decisionNumber": "Hyväksymispykälä",
                    "duration": "Kesto [kk]",
                    "planArea": "Kaava-alueen pinta-ala [ha]",
                    "undergroundArea": "Maanalaisten tilojen pinta-ala [ha]",
                    "durationAverage": "Keston keskiarvo [kk]",
                    "planAreaNew": "Uusi asemakaavan pinta-ala [ha]",
                    "planAreaChange": "Asemakaavan muutoksen pinta-ala [ha]",
                    "durationMedian": "Keston mediaani [kk]",
                    "fillDate": "Täyttämispvm",
                    "proposalDate": "Ehdotuspvm",
                    "initialDate": "Vireilletulosta ilm. pvm",
                    "municipalityPlanId": "Kunnan kaavatunnus",
                    "tyviId": "TYVI-tunnus",
                    "generatedPlanId": "Generoitu kaavatunnus",
                    "approvalDate": "Hyväksymispvm",
                    "name": "Kaavan nimi",
                    "municipality": "Kunta",
                    "coastlinePlan": "Ranta-asemakaava",
                    "coastlineLength": "Rantaviivan pituus [km]",
                    "buildingCountOwn": "Omarantaiset",
                    "buildingLocations": "Rakennuspaikat [lkm]",
                    "buildingCountOther": "Ei-omarantaiset",
                    "buildingHolidayLocations": "Lomarakennuspaikat [lkm]",
                    "buildingCountOwnHoliday": "Omarantaiset",
                    "buildingCountOtherHoliday": "Ei-omarantaiset"
                },
                "conservation" : {
                    "name": "Rakennussuojelu",
                    "buildingCount": "Suojellut rakennukset  [lkm]",
                    "floorArea": "Suojellut rakennukset [k-m2]",
                    "changeCount": "Suojeltujen rakennusten muutos [lkm +/-]",
                    "changeFloorSpace": "Suojeltujen rakennusten muutos [k-m2 +/-]",
                },
                "underground": {
                    "description": "Maanalaiset tilat",
                    "areaSize": "Pinta-ala [ha]",
                    "areaPercent": "Pinta-ala [%]",
                    "floorSpace": "Kerrosala [k-m2]",
                    "areaChange": "Pinta-alan muut. [ha+/-]",
                    "floorSpaceChange": "Kerrosalan muut. [k-m2+/-]",
                },
                "areaReservation" : {
                    "description": "Aluevaraukset",
                    "areaSize": "Pinta-ala [ha]",
                    "areaPercent": "Pinta-ala [%]",
                    "floorSpace": "Kerrosala [k-m2]",
                    "efficiency": "Tehokkuus [e]",
                    "areaChange": "Pinta-alan muut. [ha+/-]",
                    "floorSpaceChange": "Kerrosalan muut. [k-m2+/-]"
                }
            },
            "markingssearch": {
                "parameters": "Kaavamerkintöjen haku",
                "type": "Asemakaavamerkinnät",
                "markingtype": "Kaavamerkinnän tyyppi",
                "standardtype": "Asetuksen mukaiset kaavamerkinnät",
                "municipalityType": "Kuntien omat kaavamerkinnät",
                "undergroundareas": "maanalaiset merkinnät",
                "areareservations": "aluevarausmerkinnät",
                "name": "Merkintä",
                "municipalityid": "Kunta",
                "mainmarkname": "Pääluokka",
                "show": "Hae",
                "empty": "Valitse"
            },
            "markingstable": {
                "markings": "Hakutulokset",
                "mainmarkname": "Pääluokka",
                "description": "Merkinnän selitys",
                "municipalityname": "Kuntanimi",
                "municipalityid": "Kunta&shy;koodi",
                "name": "Merkintä",
                "standardDescription": "Ympäristöministeriön asetuksen 31.03.2000 mukaiset asemakaavojen alamerkinnät",
                "customDescription": "Muut kuntien asemakaavan seurantalomakkeissa käyttämät alamerkinnät (eivät sisälly ympäristöministeriön asetukseen 31.03.2000)"
            },
            "peoplesearch": {
                "searchTitle": "Yhteyshenkilöiden haku",
                "personType": "Valitse kunnat tai konsultit",
                "municipalityConsult": "Konsultit, jotka kunta valtuuttanut",
                "municipalityConsultDetailed": "Konsulttien yhteyshenkilöt",
                "municipalityContact": "Kuntien yhteyshenkilöt",
                "ely": "Ympäristö-ELY",
                "municipality": "Kunta",
                "consult": "Konsultti",
                "empty": "Valitse",
                "search": "Haku",
                "show": "Hae"
            },
            "peopletable": {
                "city": "Postitoimipaikka",
                "vat": "Y-tunnus",
                "companyName": "Yrityksen nimi",
                "office": "Virasto / toimisto ",
                "personName": "Suku- ja etunimi",
                "address": "Osoite",
                "postAddress": "Postinumero- ja postitoimipaikka",
                "email": "Sähköpostiosoite",
                "phone": "Puhelinnumero",
                "fax": "Faksinumero",
                "contacts": "Yhteyshenkilöt",
                "consultAuthorized": "Konsultin valtuuksia",
                "municipalityName": "Kuntanimi",
                "municipalityId" : "Kunta&shy;koodi",
                "true": "Kyllä",
                "false": "Ei",
                "title": {
                    "default": "Hakutulokset",
                    "MunicipalityConsult": "Hakutulokset - Konsulttien yhteyshenkilöt, jotka kunta valtuuttanut",
                    "MunicipalityConsultDetailed": "Hakutulokset - Konsulttien yhteyshenkilöt",
                    "MunicipalityContact": "Hakutulokset - Kuntien yhteyshenkilöt"
                }
            }
        },
    }
});
