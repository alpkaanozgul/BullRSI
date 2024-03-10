const puppeteer = require('puppeteer');
const mysql = require('mysql');

async function scrapeStocks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const stockElements = await page.$$eval('td.currency a', stocks => stocks.map(stock => stock.textContent.trim()));

    await browser.close();
    return stockElements;
}

function insertStockElements(stockElements) {
    const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'bist100'
    });

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to MySQL database:', err.stack);
            return;
        }

        console.log('Connected to MySQL database');

        const values = stockElements.map((element, index) => [index + 1, element]); 
        const sql = 'INSERT INTO stocks (id, name) VALUES ?'; 

        connection.query(sql, [values], (error, results, fields) => {
            if (error) {
                console.error('Error inserting data into MySQL database:', error.stack);
                return;
            }

            console.log('Inserted', results.affectedRows, 'rows into MySQL database');
        });

        connection.end();
    });
}

(async () => {
    const urls = [
        'https://uzmanpara.milliyet.com.tr/endeks-detay/XU100/hisseleri/?Pagenum=1&',
        'https://uzmanpara.milliyet.com.tr/endeks-detay/XU100/hisseleri/?Pagenum=2&'
    ];

    let allStockElements = [];

    for (const url of urls) {
        const stockElements = await scrapeStocks(url);
        allStockElements = allStockElements.concat(stockElements);
    }

    allStockElements.sort();

    console.log(allStockElements);

    insertStockElements(allStockElements);
})();
