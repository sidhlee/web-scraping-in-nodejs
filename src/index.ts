import express from 'express'

const app = express()
const port = process.env.PORT || 5000

app.use('/', (req, res, next) => {
  res.status(200).send({ data: 'Hello Express' })
})

console.log(process.env.TEST)

app.listen(port, () => console.log(`Server is up on port ${port}`))
