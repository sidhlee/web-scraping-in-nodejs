import puppeteer from 'puppeteer'

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
  // visit url
  const page = await browser.newPage()
  await page.goto('https://www.google.com')
}
