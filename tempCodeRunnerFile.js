const puppeteer = require('puppeteer');

async function scrapeLinks(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Wait for the table to load
  await page.waitForSelector('table tbody');

  // Extract links
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
  const linksArray = [];

  // Scrape first page
  const links1 = await scrapeLinks('https://uzmanpara.milliyet.com.tr/endeks-detay/XU100/hisseleri/?Pagenum=1');
  linksArray.push(...links1);

  // Scrape second page
  const links2 = await scrapeLinks('https://uzmanpara.milliyet.com.tr/endeks-detay/XU100/hisseleri/?Pagenum=2');
  linksArray.push(...links2);

  // Scrape and display data from each link
  for (const link of linksArray) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(link);

    // Wait for the box element
    await page.waitForSelector('div.box');

    // Extract data
    const data = await page.evaluate(() => {
      const dataArray = [];
      const rows = document.querySelectorAll('div.box tr.last');

      rows.forEach(row => {
        const valueElement = row.querySelector('td.right');
        if (valueElement) {
          const value = valueElement.textContent.trim();
          dataArray.push(value);
        }
      });

      return dataArray;
    });

    console.log(`Data from ${link}:`, data);

    await browser.close();
  }
}

scrapeAllLinks();
