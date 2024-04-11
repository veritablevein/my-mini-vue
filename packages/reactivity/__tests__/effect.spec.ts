import { effect } from '../src/effect'
import { reactive } from '../src/reactive'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({ age: 18 })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    // first run
    expect(nextAge).toBe(19)
    // update
    user.age++
    expect(nextAge).toBe(20)
  })
})
