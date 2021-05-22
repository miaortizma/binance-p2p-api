const inquirer = require('inquirer');
const ui = new inquirer.ui.BottomBar();
const chalk = require('chalk');
const log = console.log;

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

/*
let scrape = async (page) => {
  let result = await
}
*/



module.exports = scrapeCheapest;