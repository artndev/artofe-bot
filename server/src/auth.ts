export class Auth {
  private _auth: IUser

  constructor() {
    this._auth = {} as IUser
  }

  get auth(): typeof this._auth {
    return this._auth
  }

  set auth(val: typeof this._auth) {
    this._auth = val
  }
}
