const tickerIndexes = { USDT: 1, BTC: 2, BNB: 3, BUSD: 4, ETH: 5, DAI: 6 };
const PORT = process.env.PORT || 4000;
const timeOutMultiplier = 0.7

async function setupPage (page) {
  const config = {
    'ticker': 'USDT',
    'fiat': 'COP',
    'operation': 'Buy'
  }

  await page.goto('https://p2p.binance.com/en');

  // Select Symbol
  await page.waitForSelector(`main > div.css-1u2nsrt > div > div > div.css-8f6za > div > div:nth-child(${tickerIndexes[config.ticker]})`);
  await page.click(`main > div.css-1u2nsrt > div > div > div.css-8f6za > div > div:nth-child(${tickerIndexes[config.ticker]})`);
  //await page.waitForTimeout(1000 * timeOutMultiplier);

  // Select Fiat
  await page.waitForSelector('#C2Cfiatfilter_searhbox_fiat');
  await page.click('#C2Cfiatfilter_searhbox_fiat');
  //await page.waitForTimeout(1000 * timeOutMultiplier);
  await page.waitForSelector(`#${config.fiat}`);
  await page.click(`#${config.fiat}`);
  //await page.waitForTimeout(1000 * timeOutMultiplier);

  // Select Payment
  await page.waitForSelector('#C2Cpaymentfilter_searchbox_payment')
  await page.click('#C2Cpaymentfilter_searchbox_payment');
  //await page.waitForTimeout(1000 * timeOutMultiplier);
  await page.waitForSelector('#Nequi');
  await page.click('#Nequi');
  //await page.waitForTimeout(1000 * timeOutMultiplier);

  //(config.operation === 'Sell') ? await page.click('main > div.css-1u2nsrt > div > div > div.css-1yl7p9 > div > div.css-yxrkwa') : false;
  //await page.waitForTimeout(2000 * time);
};

async function scrapeCheapest(page) {
  await page.waitForSelector('main > div.css-16g55fu > div > div.css-vurnku > div')
  return page.evaluate(() => {
    let elements = document.querySelectorAll('main > div.css-16g55fu > div > div.css-vurnku > div');

    let element = elements[0]
    let text = element.childNodes[0].innerText.split('\n')

    let price = parseFloat(text[4].replace(',', ''));
    let amount = parseFloat(text[7].split(' ')[0].replace(',', ''))


    return {price, amount, text}
  });
}


(async function() {
  const puppeteer = require('puppeteer');
  const chalk = require('chalk');
  const express = require('express');
  const app = express();
  const log = console.log;

  log('Launching Browser...')
  const browser = await puppeteer.launch({ args: [`--no-sandbox`] });
  log('Launched!')

  app.get('/', (req, res) => res.status(200).json({ status: 'ok' }))

  app.get('/min', async (req, res) => {

    // Step 2
    log(`\n2️⃣  ${chalk.bold.underline(`Bot connecting to Binance \n`)}`);
    const page = await browser.newPage();

    log('\n Setting Up')
    await setupPage(page)

    log('\n Scrape')
    const values = await scrapeCheapest(page)
    page.close()
    log('\n Done')

    res.json(values)

  })

  app.listen(PORT, () => log(`App listening on port: ${PORT}`))
  
})()

