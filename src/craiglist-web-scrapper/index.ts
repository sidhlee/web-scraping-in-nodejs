import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import mongoose from 'mongoose'
import Listing, { IListing } from './models/listing'

/* 

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

*/

/**
 * Go to individual listing page and scape job description and compensation info
 */
async function scrapeListingPageAndSave(
  // Exclude: Utility Types https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
  listings: Exclude<IListing, 'jobDescription' | 'compensation'>[],
  page: puppeteer.Page,
  maxListings: number = 10 // limit number of listings to prevent IP blocking
): Promise<IListing[] | undefined> {
  try {
    const completeListings: IListing[] = []

    // Arg validation (not possible to define type for non-negative integers)
    if (maxListings < 0 || !Number.isInteger(maxListings)) {
      throw new Error('maxListing should be a non-negative integer.')
    }

    // Only returns the first N listings where N = maxListings
    const numIter = Math.min(maxListings, listings.length)

    for (let i = 0; i < numIter; i++) {
      await page.goto(listings[i].url) // navigate to the listing page
      const jobPage = await page.content() // get page
      const $ = cheerio.load(jobPage) // load page into cheerio

      const jobDescription = $('#postingbody')
        .contents()
        .filter(function (this: Node | HTMLElement) {
          // children can be text node or element
          // if 'this' is element
          if ('classList' in this && this.nodeType === 1) {
            // filter out element with .print-information
            return !this.classList.contains('print-information')
          } else {
            // could've shorten this without if/else, but this is easier to read
            return true
          }
        })
        .text()
        .trim()

      const compensation = $('div.mapAndAttrs > p > span:nth-child(1)')
        .text()
        .replace('compensation:', '')
        .trim()

      const completeListing: IListing = {
        ...listings[i],
        jobDescription,
        compensation,
      }

      // save listing to Atlas
      await new Listing(completeListing).save()
      console.log(completeListing)

      //
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
async function scrapeListingsPage(page: puppeteer.Page) {
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

/**
 * Cleans up leading & tailing parenthesis if any
 * @param str
 */
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

async function sleep(ms: number) {
  const jitter = Math.random() * 2000 // add random delay between 0 - 2 seconds
  return new Promise((resolve) => setTimeout(resolve, ms + jitter))
}

export default async function main() {
  try {
    // To use await, you must not pass the callback function into connect
    await mongoose.connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('connected to db...')

    // initialize and open up browser (chromium)
    const browser = await puppeteer.launch({ headless: false })
    // create a new page instance
    const page = await browser.newPage()
    // visit the page you want to scrape

    const listings = await scrapeListingsPage(page)
    await scrapeListingPageAndSave(listings, page)
  } catch (err) {
    console.log(err)
  }
}
