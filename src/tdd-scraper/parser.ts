import cheerio from 'cheerio'
import { cleanUp } from '../craiglist-web-scrapper'

// export const add = (a: number, b: number) => a + b

export const listings = (html: Buffer) => {
  const $ = cheerio.load(html)
  const listings = $('.result-info')
    .map((i, infoDiv) => {
      const $listingLink = $(infoDiv).find('.result-title')
      const title = $listingLink.text()
      const url = $listingLink.attr('href')
      const datePosted = new Date(
        $(infoDiv).find('time').attr('datetime') as string
      )
      const neighborhood = cleanUp($(infoDiv).find('.result-hood').text())

      return { title, url, datePosted, neighborhood }
    })
    .get()

  return listings
}
