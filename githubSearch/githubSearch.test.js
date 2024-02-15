/**
 * @jest-environment jsdom
 */

const fs = require("fs")

require("whatwg-fetch")
require("@testing-library/jest-dom")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default

const searchRepositoriesResult = require("./searchRepositoriesResult.json")

function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()
	console.log(jsPath)
	jest.isolateModules(function() {
		require(jsPath)
	})
}

test("correctly renders GitHub search results", async function () {
    initDomFromFiles(
        __dirname + "/githubSearch.html",
        __dirname + "/githubSearch.js"
    )

    const queryInput = domTesting.getByPlaceholderText(
        document,
        "Search GitHub"
    )
    const searchButton = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(queryInput, "jest")
    await user.click(searchButton)

    const results = await domTesting.findAllByRole(document, "listitem")
	expect(results).not.toHaveLength(0)
})
