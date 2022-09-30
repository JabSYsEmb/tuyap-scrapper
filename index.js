const axios = require("axios");
const jsdom = require("jsdom");


const main = "div.filter-list__item > div > table > tbody > tr" // css selector

const url = "https://maktekfuari.com/katilimci-listesi" // website


const document_builder = (html_as_string) =>
  new jsdom.JSDOM(html_as_string).window.document;

const main_selector = (document) => Array.from(document.querySelectorAll(main));

const get_company_info = (company_instance) => {
	const name = company_instance[0].trim();
	const location = company_instance[1].trim();
	const contact = company_instance[4].trim().split(":").pop().trim();
	const website = "https:" + company_instance[5].trim().split(":").pop().trim();
	const company = {name, location, contact, website}
	return JSON.stringify(company)
}

axios.get(url)
	.then(response => response.data)
	.then(document_builder)
	.then(main_selector)
	.then(data => data)
	.then(data => data.filter((_,idx) => idx % 3 === 0))
	.then(objs => objs.map(item => item.textContent.trim().split("\n")))
	.then(objz => objz.map(item => get_company_info(item)))
	.then(objs => console.log('[' + objs.join(",") + ']')) // this is temperarory use 'fs' to create and write inside a json file
	.catch((err) => console.error("Error:",err))
