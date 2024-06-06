import { track, trigger } from './effect'

export function reactive(target) {
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      // target: { age:18 }
      const res = Reflect.get(target, key, receiver)
      // 依赖收集
      track(target, key)
      return res
    },

    set(target, key, newValue, receiver) {
      const res = Reflect.set(target, key, newValue, receiver)
      // 触发依赖
      trigger(target, key)
      return res
    },
  })
  return proxy
}
