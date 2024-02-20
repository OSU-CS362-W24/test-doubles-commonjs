const registerUser = require('./registerUser')

const Database = require("./database")

test("saves user record in the database, password is NOT stored in cleartext", function() {
	const emailAddress = "iamfake@oregonstate.edu"
	const password = "pa$$word123"

	const spy = jest.spyOn(Database, "save")

	registerUser(emailAddress, password);

	expect(spy).toHaveBeenCalledTimes(1)
	
	const userRecord = spy.mock.calls[0][0]
	expect(userRecord).toMatchObject({
		password: expect.not.stringContaining(password)
	})
	expect(userRecord.password.startsWith("$2a$")).toBeTruthy()
	expect(userRecord.password).toHaveLength(60)

	spy.mockRestore()
})

test("registerUser returns null when Database.save throws exception", function() {
	const emailAddress = "iamfake@oregonstate.edu"
	const password = "pa$$word123"

	const spy = jest.spyOn(Database, "save")

	spy.mockImplementation(function() {
		// This is our stub
		throw new Error()
	})

	const result = registerUser(emailAddress, password);
	expect(result).toBeNull()

	spy.mockRestore()
})
