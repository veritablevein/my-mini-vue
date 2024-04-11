import { reactive } from '../src/reactive'

describe('reactive', () => {
  it('happy path', () => {
    const origin = { age: 18 }
    const observed = reactive(origin)
    // proxy intercept origin object
    expect(observed).not.toBe(origin)
    // [[Get]]
    expect(observed.age).toBe(18)
    // [[Set]]
  })
})
