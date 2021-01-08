import cheerio from 'cheerio'
import { cleanUp } from '../craiglist-web-scrapper'

// export const add = (a: number, b: number) => a + b

const getDatePosted = ($: cheerio.Root, elem: cheerio.Element) => {
  const dateString = $(elem).find('time').attr('datetime') as string
  return new Date(dateString)
}

const getNeighborhood = ($: cheerio.Root, elem: cheerio.Element) => {
  const rawNeighborhoodString = $(elem).find('.result-hood').text()
  return cleanUp(rawNeighborhoodString)
}

export const listings = (html: Buffer) => {
  const $ = cheerio.load(html)
  const listings = $('.result-info')
    .map((i, infoDiv) => {
      const $listingLink = $(infoDiv).find('.result-title')
      const title = $listingLink.text()
      const url = $listingLink.attr('href')
      const datePosted = getDatePosted($, infoDiv)
      const neighborhood = getNeighborhood($, infoDiv)

      return { title, url, datePosted, neighborhood }
    })
    .get()

  return listings
}
