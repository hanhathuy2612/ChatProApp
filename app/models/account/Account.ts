import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "app/models/helpers/withSetPropAction"
import { accountService } from "app/services/accountService"

/**
 * Model description here for TypeScript hints.
 */
export const AccountModel = types
  .model("Account")
  .props({
    id: types.maybeNull(types.number),
    email: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .views((store) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((store) => ({
    fetchAccount() {
      accountService.fetchAccount().then(
        res => {
          if (res.status === 200) {
            const account = res.data
            store.setProp("id", account?.id)
            store.setProp("email", account?.email)
            store.setProp("firstName", account?.firstName)
            store.setProp("lastName", account?.lastName)
          }
        },
      )
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Account extends Instance<typeof AccountModel> {
}

export interface AccountSnapshotOut extends SnapshotOut<typeof AccountModel> {
}

export interface AccountSnapshotIn extends SnapshotIn<typeof AccountModel> {
}

export const createAccountDefaultModel = () => types.optional(AccountModel, {})