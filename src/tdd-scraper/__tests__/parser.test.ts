import * as parser from '../parser'
import path from 'path'
import fs from 'fs'
import { IListing } from 'craiglist-web-scrapper/models/listing'

let html: string, listings: IListing[]

beforeAll(() => {
  // load fetched html
  const filePath = path.join(__dirname, '../test.html')
  html = fs.readFileSync(filePath)
  // parse html into a data that we can test against
  listings = parser.listings(html)
})

// const listings = [
//   {
//     title: 'Outsource Agent Required',
//     url:
//       'https://toronto.craigslist.org/tor/acc/d/east-york-outsource-agent-required/7258922103.html',
//     datePosted: '2021-01-08 12:47',
//     neighborhood: 'Toronto',
//   },
// ]

// it('should give 4', () => {
//   const result = parser.add(2, 2)
//   expect(result).toBe(4)
// })

// test if the function returns what it's supposed to
it('should give the correct listing object', () => {
  expect(listings.length).toBe(120)
})

it('should get correct title', () => {
  expect(listings[0].title).toBe('Outsource Agent Required')
})

it('should get correct url', () => {
  expect(listings[0].url).toBe(
    'https://toronto.craigslist.org/tor/acc/d/east-york-outsource-agent-required/7258922103.html'
  )
})

it('should get neighborhood from listing', () => {
  expect(listings[0].neighborhood).toBe('Toronto')
})

it('should get correct date from listing', () => {
  // toBe compares reference
  expect(listings[0].datePosted).toMatchObject(new Date('2021-01-08 12:47'))
})

// Now you can start implementing the actual function to the data
