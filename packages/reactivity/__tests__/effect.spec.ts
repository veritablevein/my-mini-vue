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
  it('switch branch', () => {
    const obj = reactive({ ok: true, text: 'hello world' })
    let innerText
    const fnSpy = vi.fn(() => {
      innerText = obj.ok ? obj.text : 'not'
    })
    effect(fnSpy)
    expect(innerText).toBe('hello world')
    expect(fnSpy).toHaveBeenCalledTimes(1)
    obj.text = 'bye'
    expect(innerText).toBe('bye')
    expect(fnSpy).toHaveBeenCalledTimes(2)
    obj.ok = false
    expect(innerText).toBe('not')
    expect(fnSpy).toHaveBeenCalledTimes(3)
    // whatever the value of obj.text changes, effect should not re-run
    obj.text = 'hello vue'
    expect(innerText).toBe('not')
    expect(fnSpy).toHaveBeenCalledTimes(3)
  })
})
