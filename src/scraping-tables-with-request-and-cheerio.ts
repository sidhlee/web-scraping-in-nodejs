import request from 'request-promise'
import cheerio from 'cheerio'

export default async function main() {
  const aeoPage = await request.get(
    'https://finviz.com/quote.ashx?t=AEO&ty=c&p=d&b=1'
  )
  const $ = cheerio.load(aeoPage)
  const shortFloat = $(
    '.snapshot-table2 > tbody > tr:nth-child(3) > td:nth-child(10)'
  ).text()
  const shortRatio = $(
    '.snapshot-table2 > tbody > tr:nth-child(4) > td:nth-child(10)'
  ).text()
  const dividend = $(
    '.snapshot-table2 > tbody > tr:nth-child(8) > td:nth-child(2)'
  ).text()

  console.log({
    shortFloat,
    shortRatio,
    dividend,
  })
}
