import { AccountModel } from "./Account"

test("can be created", () => {
  const instance = AccountModel.create({})

  expect(instance).toBeTruthy()
})
