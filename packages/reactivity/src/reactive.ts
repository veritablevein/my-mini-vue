export function reactive(target) {
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      // target: { age:18 }
      const res = Reflect.get(target, key, receiver)
      // TODO 依赖收集
      return res
    },
  })
  return proxy
}
