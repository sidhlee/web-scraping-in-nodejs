import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

export const getHtml = async (url: string): Promise<any> => {
  // Craiglist blocks all IP that uses request
  // const html = await request.get(url)
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(url)
  const html = page.content()
  return html
}

export const saveHtmlToFile = async (html: string) => {
  // Save with absolute path because we want to save the file to the current folder.
  // Relative path could be changing based on the location of the file that calls this function.
  const saveTo = path.join(__dirname, 'test.html')
  fs.writeFileSync(saveTo, html)
}

export default async function main() {
  const html = await getHtml('https://toronto.craigslist.org/d/jobs/search/jjj')
  saveHtmlToFile(html as string)
}

main()
