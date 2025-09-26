export class AuthExpiration {
  constructor(private readonly timestamp: number) {
    if (timestamp > Date.now()) throw new Error('Expiration is required')
  }

  getValue() {
    return this.timestamp
  }
}
