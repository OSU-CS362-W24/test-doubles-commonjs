/**
 * @jest-environment jsdom
 */

const fs = require("fs")

require("whatwg-fetch")
require("@testing-library/jest-dom")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default

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

test("displays 'midnight' at 00:00", function() {
	jest.useFakeTimers()
	jest.setSystemTime(new Date(2024, 2, 19, 0, 0))

	initDomFromFiles(
		__dirname + "/currentTime.html",
		__dirname + "/currentTime.js"
	)

	expect(domTesting.queryByText(document, "midnight")).not.toBeNull()

	jest.useRealTimers()
})
