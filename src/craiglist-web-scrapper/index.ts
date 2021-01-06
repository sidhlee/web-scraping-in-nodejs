import puppeteer from 'puppeteer'

// Using puppeteer instead of request because Craiglist has been blocking scraping IP addresses
export default async function main() {
  // initialize and open up browser (chromium)
  const browser = await puppeteer.launch({ headless: false })
  // visit url
  const page = await browser.newPage()
  await page.goto('https://www.google.com')
}
