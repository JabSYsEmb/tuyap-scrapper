const axios = require("axios");
const jsdom = require("jsdom");
const fs    = require("fs");


const main = "div.filter-list__item > div > table > tbody > tr" // css selector

const fuar_name = "maktek"

const url_fuar = "https://maktekfuari.com/katilimci-listesi?page=" // website


const document_builder = (html_as_string) =>
  new jsdom.JSDOM(html_as_string).window.document;

const main_selector = (document) => Array.from(document.querySelectorAll(main));

const get_company_info = (company_instance) => {
	const name = company_instance[0].trim();
	const location = company_instance[1].trim();
	const contact = company_instance[4].trim().split(":").pop().trim();
	const website = "https:" + company_instance[5].trim().split(":").pop().trim();
	if(name && location && contact && website) {
		const company = {name, location, contact, website}
		fs.appendFile(`./${fuar_name}.json`, JSON.stringify(company), (err) => {
			if (err) throw err;
			console.log(`${name}`);
		})
	}
}

async function companies(url){
	await axios.get(url)
		.then(response => response.data)
		.then(document_builder)
		.then(main_selector)
		.then(data => data.filter((_,idx) => idx % 3 === 0))
		.then(objs => objs.map(item => item.textContent.trim().split("\n")))
		.then(objz => objz.map(item => get_company_info(item)))
		.catch((err) => console.error("Error:",err))
		.finally(() => console.log(""))
}

function fuari_companies(url,idx){
	while( idx > 0 ){
		companies(`${url}${idx}`);
		idx--;
	}
}

fuari_companies(url_fuar,37);
