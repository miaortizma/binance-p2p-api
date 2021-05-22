const tickerIndexes = { USDT: 1, BTC: 2, BNB: 3, BUSD: 4, ETH: 5, DAI: 6 };
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const express = require('express');

async function scrapeCheapest(page) {
  return page.evaluate(() => {
    let elements = document.querySelectorAll('main > div.css-16g55fu > div > div.css-vurnku > div');

    let element = elements[0]
    let text = element.childNodes[0].innerText.split('\n')

    let price = parseFloat(text[4].replace(',', ''));
    let amount = parseFloat(text[7].split(' ')[0].replace(',', ''))


    return {price, amount, text}
  });
}

const app = express();
const log = console.log;

const setup = async (page) => {
  const config = {
    'ticker': 'USDT',
    'fiat': 'COP',
    'operation': 'Buy'
  }

  await page.goto('https://p2p.binance.com/en');

  // Select Symbol
  await page.waitForSelector(`main > div.css-1u2nsrt > div > div > div.css-8f6za > div > div:nth-child(${tickerIndexes[config.ticker]})`);
  await page.click(`main > div.css-1u2nsrt > div > div > div.css-8f6za > div > div:nth-child(${tickerIndexes[config.ticker]})`);
  await page.waitForTimeout(1000);

  // Select Fiat
  await page.waitForSelector('#C2Cfiatfilter_searhbox_fiat');
  await page.click('#C2Cfiatfilter_searhbox_fiat');
  await page.waitForTimeout(1000);
  await page.waitForSelector(`#${config.fiat}`);
  await page.click(`#${config.fiat}`);
  await page.waitForTimeout(1000);

  // Select Payment
  await page.waitForSelector('#C2Cpaymentfilter_searchbox_payment')
  await page.click('#C2Cpaymentfilter_searchbox_payment');
  await page.waitForTimeout(1000);
  await page.waitForSelector('#Nequi');
  await page.click('#Nequi');
  await page.waitForTimeout(1000);

  (config.operation === 'Sell') ? await page.click('main > div.css-1u2nsrt > div > div > div.css-1yl7p9 > div > div.css-yxrkwa') : false;
  await page.waitForTimeout(2000);
};

app.get('/min', async (req, res) => {

  // Step 2
  log(`\n2️⃣  ${chalk.bold.underline(`Bot connecting to Binance \n`)}`);
  const browser = await puppeteer.launch({ headless: true, defaultViewport: null, args: [`--window-size=1400,800`] });
  const page = await browser.newPage();

  await setup(page)

  const values = await scrapeCheapest(page)

  log(values)


  res.json(values)

})

const PORT = 4000

app.listen(PORT)
log(`Listening on port: ${PORT}`)
