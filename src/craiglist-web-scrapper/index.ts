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

type Job = {
  title: string
  datePosted: Date
  neighborhood: string
  url: string
  jobDescription: string
  compensation: string
}

/**
 * Go to individual listing page and scape job description and compensation info
 */
async function addJobDescriptionAndCompensation(
  listings: Exclude<Job, 'jobDescription' | 'compensation'>[],
  page: puppeteer.Page,
  maxListings: number = 10
): Promise<Job[] | undefined> {
  try {
    const completeListings = []
    if (maxListings < 0 || !Number.isInteger(maxListings)) {
      throw new Error('maxListing should be a non-negative integer.')
    }

    const numIter = Math.min(maxListings, listings.length)

    for (let i = 0; i < numIter; i++) {
      await page.goto(listings[i].url)
      const jobPage = await page.content()
      const $ = cheerio.load(jobPage)
      const jobDescription = $('#postingbody')
        .contents()
        .filter(function (this: Node) {
          return this.nodeType !== 1
        })
        .text()
        .trim()
      const compensation = $('div.mapAndAttrs > p > span:nth-child(1)')
        .text()
        .replace('compensation:', '')
        .trim()

      const completeListing = {
        ...listings[i],
        jobDescription,
        compensation,
      }
      console.log(completeListing)
      completeListings.push(completeListing)

      await sleep(2000) // sleep for 2 + 0-2 seconds
      await page.goBack()
    }

    return completeListings
  } catch (err) {
    console.log(err)
    return undefined
  }
}

// Using puppeteer instead of request because Craiglist has been blocking scraping IP addresses
async function scrapePage(page: puppeteer.Page) {
  await page.goto('https://toronto.craigslist.org/d/for-sale/search/tor/jjj')
  // get the page html
  const html = await page.content()
  // load the page into cheerio
  const $ = cheerio.load(html)

  // Now go to the browser devtool console & try getting the result you want
  // When successful, copy the code from the devtool console
  // $('.result-title ').each((i, titleEl) => {
  //   console.log($(titleEl).text())
  // })
  // $('.result-title ').each((i, titleEl) => {
  //   console.log($(titleEl).attr('href'))
  // })

  const listings = $('.result-info')
    .map((i, divEl) => {
      const linkEl = $(divEl).find('.result-title')
      const title = $(linkEl).text()
      const url = $(linkEl).attr('href')

      const timeEl = $(divEl).find('.result-date')
      const datePosted = new Date($(timeEl).attr('datetime') as string)

      const hoodEl = $(divEl).find('.result-hood')
      const neighborhood = cleanUp(hoodEl.text())

      const job = { title, url, datePosted, neighborhood }

      return job
    })
    .get()

  return listings
}

function cleanUp(str: string): string {
  let cleaned
  cleaned = str.trim()
  if (cleaned[0] === '(') {
    cleaned = cleaned.slice(1)
  }
  if (cleaned.slice(-1) === ')') {
    cleaned = cleaned.slice(0, -1)
  }
  return cleaned
}

export default async function main() {
  // initialize and open up browser (chromium)
  const browser = await puppeteer.launch({ headless: false })
  // create a new page instance
  const page = await browser.newPage()
  // visit the page you want to scrape

  const listings = await scrapePage(page)
  const completeListings = await addJobDescriptionAndCompensation(
    listings,
    page
  )
  console.log(completeListings)
}

async function sleep(ms: number) {
  const jitter = Math.random() * 2000 // add random delay between 0 - 2 seconds
  return new Promise((resolve) => setTimeout(resolve, ms + jitter))
}
