import * as parser from '../parser'
import path from 'path'
import fs from 'fs'

let html

beforeAll(() => {
  const filePath = path.join(__dirname, '../test.html')
  html = fs.readFileSync(filePath)
})

it('should give 4', () => {
  const result = parser.add(2, 2)
  expect(result).toBe(4)
})
