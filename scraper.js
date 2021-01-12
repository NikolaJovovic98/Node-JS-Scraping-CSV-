const cheerio = require("cheerio");
const axios = require("axios");
const { get } = require("http");
const fillCsv = require("./csv");

async function fetchHtml(url) {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (e) {
        console.log("Error! " + e.message);
    }
}

async function findNumPages() {
    const urlNum = `https://www.realitica.com/?cur_page=0&for=Prodaja&pZpa=Crna+Gora&pState=Crna+Gora&type%5B%5D=Hotel&lng=hr`;
    const htmlNum = await fetchHtml(urlNum);
    const $ = cheerio.load(htmlNum);
    const numberLen = $('body').find('#left_column_holder > div > span').toArray().map((x) => { return $(x).text() });
    numberLen1 = parseInt(numberLen[0].slice(-4));
    if (numberLen1 % 20 === 0) {
        return numberLen1 / 20;
    } else {
        numberLen1 = parseInt(numberLen1 / 20) + 1;
        return numberLen1;
    }
}

async function getAllPages() {
    const allPages = [];
    const numberOfPages = await findNumPages();
    for (let i = 0; i < numberOfPages; i++) {
        let tempLinkUrl = `https://www.realitica.com/?cur_page=${i}&for=Prodaja&pZpa=Crna+Gora&pState=Crna+Gora&type%5B%5D=Hotel&lng=hr`;
        allPages.push(tempLinkUrl);
    }
    return allPages;
}

async function scrapePages() {
    const scrapePagesArray = [];
    const allPages = await getAllPages();
    for (let i = 0; i < allPages.length; i++) {
        await scrapNekretnine(allPages[i])
            .then(res => {
                scrapePagesArray.push(res);
            })
            .catch(err => {
                console.log("Error in scrape pages:" + err);
            });
    }
    return scrapePagesArray;
}

async function makeCsv(){
    const data = await scrapePages();
    const flatData = data.flat();
    fillCsv(flatData);
}

makeCsv()
.then(()=>{
    console.log("Done");
})


async function scrapNekretnine(urlArg) {
    const url = urlArg;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const links = $("body")
        .find(".thumb_div > a")
        .toArray()
        .map(elem => $(elem).attr('href'));
    const arrayOfInfo = [];
    for (let i = 0; i < links.length; i++) {
        await scrapNekretnineInformacije(links[i])
            .then(res => {
                arrayOfInfo.push(res);
            })
            .catch(err => {
                console.log(err);
            });
    }
    return arrayOfInfo;
}

async function scrapNekretnineInformacije(url) {
    const nemaPodataka = "  Nema Podataka";
    const nemaPodatakaOpisPromjena = "  Nema Podataka  ";
    let lokacija = undefined;
    let brojOglasa = undefined;
    let opis = undefined;
    let mobilni = undefined;
    let vrstaSmjestaja = undefined;
    let podrucje = undefined;
    let brSpavacihSoba = undefined;
    let brKupatila = undefined;
    let cijena = undefined;
    let stambenaPovrsina = undefined;
    let zemljiste = undefined;
    let parkingMjesta = undefined;
    let odMora = undefined;
    let novogradnja = undefined;
    let klima = undefined;
    let zadnjaPromjena = undefined;
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const urlOglasa = url;
    const naslov = $("body").find("#listing_body > h2").text();
    const oglasio = $("body").find("#aboutAuthor > a").text();
    const linkoviSlika = $("body")
        .find("#rea_blueimp > a")
        .toArray()
        .map(elem => $(elem).attr('href'));
    if (typeof $("body").find("strong:contains(Lokacija)")[0] !== "undefined") {
        lokacija = defaultValue($("body").find("strong:contains(Lokacija)")[0].next.data, nemaPodataka);
    } else {
        lokacija = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Oglas Broj)")[0] !== "undefined") {
        brojOglasa = defaultValue($("body").find("strong:contains(Oglas Broj)")[0].next.data, nemaPodatakaOpisPromjena);
    } else {
        brojOglasa = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Opis)")[0] !== "undefined") {
        opis = defaultValue($("body").find("strong:contains(Opis)")[0].next.data, nemaPodataka);
    } else {
        opis = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Mobitel)")[0] !== "undefined") {
        mobilni = defaultValue($("body").find("strong:contains(Mobitel)")[0].next.data, nemaPodataka);
    } else {
        mobilni = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Vrsta)")[0] !== "undefined") {
        vrstaSmjestaja = defaultValue($("body").find("strong:contains(Vrsta)")[0].next.data, nemaPodataka);
    } else {
        vrstaSmjestaja = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Područje)")[0] !== "undefined") {
        podrucje = defaultValue($("body").find("strong:contains(Područje)")[0].next.data, nemaPodataka);
    } else {
        podrucje = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Spavaćih Soba)")[0] !== "undefined") {
        brSpavacihSoba = defaultValue($("body").find("strong:contains(Spavaćih Soba)")[0].next.data, nemaPodataka);
    } else {
        brSpavacihSoba = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Kupatila)")[0] !== "undefined") {
        brKupatila = defaultValue($("body").find("strong:contains(Kupatila)")[0].next.data, nemaPodataka);
    } else {
        brKupatila = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Cijena)")[0] !== "undefined") {
        cijena = defaultValue($("body").find("strong:contains(Cijena)")[0].next.data, nemaPodataka);
    } else {
        cijena = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Stambena Površina)")[0] !== "undefined") {
        stambenaPovrsina = defaultValue($("body").find("strong:contains(Stambena Površina)")[0].next.data, nemaPodataka);
    } else {
        stambenaPovrsina = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Zemljište)")[0] !== "undefined") {
        zemljiste = defaultValue($("body").find("strong:contains(Zemljište)")[0].next.data, nemaPodataka);
    } else {
        zemljiste = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Parking Mjesta)")[0] !== "undefined") {
        parkingMjesta = defaultValue($("body").find("strong:contains(Parking Mjesta)")[0].next.data, nemaPodataka);
    } else {
        parkingMjesta = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Od Mora (m))")[0] !== "undefined") {
        odMora = defaultValue($("body").find("strong:contains(Od Mora (m))")[0].next.data, nemaPodataka);
    } else {
        odMora = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Novogradnja)")[0] !== "undefined") {
        novogradnja = defaultValue($("body").find("strong:contains(Novogradnja)")[0].next.data, nemaPodataka);
    } else {
        novogradnja = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Klima Uređaj)")[0] !== "undefined") {
        klima = defaultValue($("body").find("strong:contains(Klima Uređaj)").next.data, nemaPodataka);
    } else {
        klima = nemaPodataka;
    }
    if (typeof $("body").find("strong:contains(Zadnja Promjena)")[0] !== "undefined") {
        zadnjaPromjena = defaultValue($("body").find("strong:contains(Zadnja Promjena)")[0].next.data, nemaPodatakaOpisPromjena);
    } else {
        zadnjaPromjena = nemaPodataka;
    }

    const scrapeObject = {
        vrstaSmjestaja_key: removeColon(vrstaSmjestaja),
        podrucje_key: removeColon(podrucje),
        lokacija_key: removeColon(lokacija),
        brSpavacihSoba_key: removeColon(brSpavacihSoba),
        brKupatila_key: removeColon(brKupatila),
        cijena_key: removeColon(cijena),
        stambenaPovrsina_key: removeColon(stambenaPovrsina),
        zemljiste_key: removeColon(zemljiste),
        parkingMjesta_key: removeColon(parkingMjesta),
        odMora_key: removeColon(odMora),
        novogradnja_key: removeColon(novogradnja),
        klima_key: removeColon(klima),
        naslov_key: naslov,
        opis_key: removeColon(opis),
        oglasio_key: oglasio,
        mobilni_key: removeColon(mobilni),
        brojOglasa_key: removeColon(removeBackslashN(brojOglasa)),
        zadnjaPromjena_key: removeColon(removeBackslashN(zadnjaPromjena)),
        linkoviSlika_key: linkoviSlika,
        urlOglasa_key: urlOglasa,
    }

    return scrapeObject;
}
function defaultValue(myVar, defaultVal) {
    if (typeof myVar === "undefined") myVar = defaultVal;
    return myVar;
}
function removeColon(string) {
    if (string !== undefined) {
        return string.slice(2, string.length);
    } else {
        return;
    }
}
function removeBackslashN(string) {
    return string.replace("\n", "");
}


/*
const bigArray = [
    [
        {
            name:"Nikola",
            surname:"Jovovic",
            age:21
        },
        {
            name:"Dybala",
            surname:"Dybalovic",
            age:20
        },
        {
            name:"Petar",
            surname:"Petrovic",
            age:51
        }
    ],
    [
        {
            name:"Nikola",
            surname:"Jovovic",
            age:21
        },
        {
            name:"Dybala",
            surname:"Dybalovic",
            age:20
        },
        {
            name:"Petar",
            surname:"Petrovic",
            age:51
        }
    ],
    [
        {
            name:"Nikola",
            surname:"Jovovic",
            age:21
        },
        {
            name:"Dybala",
            surname:"Dybalovic",
            age:20
        },
        {
            name:"Petar",
            surname:"Petrovic",
            age:51
        }
    ]
]

const flatArray = bigArray.flat();

console.log(flatArray);
*/