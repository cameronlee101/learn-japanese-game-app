import * as Realm from 'realm-web'

export class RealmAppService {
  private static app: Realm.App

  async getAppInstance() {
    if (!RealmAppService.app) {
      RealmAppService.app = new Realm.App({ id: 'application-0-teaho' })

      const credentials = Realm.Credentials.anonymous()
      await RealmAppService.app.logIn(credentials)
    }

    return RealmAppService.app
  }
}