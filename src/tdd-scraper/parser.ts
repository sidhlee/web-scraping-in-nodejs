import cheerio from 'cheerio'

// export const add = (a: number, b: number) => a + b

export const listings = (html: string) => {
  const $ = cheerio.load(html)
  const listings = $('.result-info')
    .map((i, infoDiv) => {
      const title = $(infoDiv).find('.result-title').text()
      return { title }
    })
    .get()

  return listings
}
