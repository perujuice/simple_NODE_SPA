export default class User {
  #name = ''

  constructor () {
    this.#name = ''
  }

  get name () {
    return this.#name
  }

  set name (name) {
    this.#name = name
  }
}
