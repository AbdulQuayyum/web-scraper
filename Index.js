const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")
const j2cp = require("json2csv").Parser

const Mystery = "https://books.toscrape.com/catalogue/category/books/mystery_3/index.html"
const BaseUrl = "https://books.toscrape.com/catalogue/category/books/mystery_3/"
const BookData = []

async function GetBooks(url) {
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)

        const books = $("article")
        books.each(function () {
            title = $(this).find("h3 a").text()
            price = $(this).find(".price_color").text()
            stock = $(this).find(".availability").text().trim()

            BookData.push({ title, price, stock })
        })

        if ($(".next a").length > 0) {
            NextPage = BaseUrl + $(".next a").attr("href")
            GetBooks(NextPage)
        } else {
            const parser = new j2cp()
            const csv = parser.parse(BookData)
            fs.writeFileSync("./Books.csv", csv)
        }

        console.log(BookData)
    }
    catch (error) {
        console.error(error)
    }
}

GetBooks(Mystery)