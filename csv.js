const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = ((data)=>{

    const csvWriter = createCsvWriter({
        path: 'file.csv',
        header: [
            {id: 'vrstaSmjestaja_key', title: 'VRSTA SMJESTAJA'},
            {id: 'podrucje_key', title: 'PODRUCJE'},
            {id: 'lokacija_key', title: 'LOKACIJA'},
            {id: 'brSpavacihSoba_key', title: 'BROJ SPAVACIH SOBA'},
            {id: 'brKupatila_key', title: 'BROJ KUPATILA'},
            {id: 'cijena_key', title: 'CIJENA'},
            {id: 'stambenaPovrsina_key', title: 'STAMBENA POVRSINA'},
            {id: 'zemljiste_key', title: 'ZEMLJISTE'},
            {id: 'parkingMjesta_key', title: 'PARKING MJESTA'},
            {id: 'odMora_key', title: 'OD MORA'},
            {id: 'novogradnja_key', title: 'NOVOGRADNJA'},
            {id: 'klima_key', title: 'KLIMA'},
            {id: 'naslov_key', title: 'NASLOV'},
            {id: 'opis_key', title: 'OPIS'},
            {id: 'oglasio_key', title: 'OGLASIO'},
            {id: 'mobilni_key', title: 'MOBILNI'},
            {id: 'brojOglasa_key', title: 'BROJ OGLASA'},
            {id: 'zadnjaPromjena_key', title: 'ZADNJA PROMJENA'},
            {id: 'linkoviSlika_key', title: 'SLIKE'},
            {id: 'urlOglasa_key', title: 'URL'}
        ]
    });

    csvWriter.writeRecords(data) 
    .then(() => {
        console.log('...Done');
    });
});


