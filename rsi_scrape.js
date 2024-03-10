const puppeteer = require('puppeteer');
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'bist100rsi'
});

async function scrapeLinks(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector('table tbody');

  const links = await page.evaluate(() => {
    const linksArray = [];
    const tableRows = document.querySelectorAll('table tbody tr');

    tableRows.forEach(row => {
      const linkElement = row.querySelector('td.currency a');
      if (linkElement) {
        const href = linkElement.getAttribute('href');
        linksArray.push(`https://uzmanpara.milliyet.com.tr${href}`);
      }
    });

    return linksArray;
  });

  await browser.close();
  return links;
}

async function scrapeAllLinks() {
  const linksArray = await scrapeLinks('https://uzmanpara.milliyet.com.tr/endeks-detay/XU100/hisseleri/?Pagenum=1');
  
  const links2 = await scrapeLinks('https://uzmanpara.milliyet.com.tr/endeks-detay/XU100/hisseleri/?Pagenum=2');
  linksArray.push(...links2);

  for (const link of linksArray) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(link);

    await page.waitForSelector('div.box');

    const stockSymbol = link.match(/-(?!.*-)([^/]+)\//)[1].toUpperCase();

    const data = await page.evaluate(() => {
      const dataArray = [];
      const rows = document.querySelectorAll('div.box tr.last');

      rows.forEach(row => {
        const valueElement = row.querySelector('td.right');
        if (valueElement) {
          const value = valueElement.textContent.trim().toUpperCase();
          dataArray.push(value);
        }
      });

      return dataArray;
    });

    await browser.close();

    const sql = 'UPDATE bist100rsi SET tavan_fiyati = ?, agirlikli_ortalama = ?, rsi14 = ?, dibe_uzaklik = ?, net_kar = ? WHERE stock_symbol = ?';
    const values = [data[0], data[1], data[2], data[3], data[4], stockSymbol];

    pool.query(sql, values, (err, results) => {
      if (err) throw err;
      console.log(`Updated data for ${stockSymbol} in MySQL`);
    });
  }
}

scrapeAllLinks();
