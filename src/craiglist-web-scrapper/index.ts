import puppeteer from 'puppeteer'
import cheerio from 'cheerio'

const scrapingResults = [
  {
    title: 'Sales Representative (Seafood)',
    datePosted: new Date('2021-01-06 12:00:00'),
    neighborhood: 'Toronto, ON (Remote work to start)',
    url:
      'https://toronto.craigslist.org/tor/sls/d/toronto-sales-representative-seafood/7257905978.html',
    jobDescription: `An established global trading company is looking for an energetic sales representative in Toronto area.
You are responsible for the domestic frozen seafood market. The ideal candidate would possess at least five years of sales experience in a similar setting.
`,
    compensation: '$50K – 100K (DOE)',
  },
]

// Using puppeteer instead of request because Craiglist has been blocking scraping IP addresses
export default async function main() {
  // initialize and open up browser (chromium)
  const browser = await puppeteer.launch({ headless: false })
  // create a new page instance
  const page = await browser.newPage()
  // visit the page you want to scrape
  await page.goto('https://toronto.craigslist.org/d/for-sale/search/tor/jjj')
  // get the page html
  const html = await page.content()
  // load the page into cheerio
  const $ = cheerio.load(html)

  // Now go to the browser devtool console & try getting the result you want
  // When successful, copy the code from the devtool console
  $('.result-title ').each((i, titleEl) => {
    console.log($(titleEl).text())
  })
}
