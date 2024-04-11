let activeEffect
class ReactiveEffect {
  private _fn: any
  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this as any
    this._fn()
  }
}

const targetMap = new WeakMap()

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}

export function trackEffect(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

export function triggerEffect(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  for (const _effect of dep) _effect.run()
}
