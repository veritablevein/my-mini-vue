let activeEffect
const targetMap = new WeakMap()
class ReactiveEffect {
  deps: any[] = []
  private _fn: any
  constructor(fn) {
    this._fn = fn
  }

  run() {
    clearupEffect(this)
    activeEffect = this as any
    this._fn()
  }
}

function clearupEffect(effect) {
  effect.deps.forEach(deps => {
    deps.delete(effect)
  })
  effect.deps.length = 0
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}

export function track(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  trackEffect(deps)
}

export function trackEffect(deps) {
  if (!deps.has(activeEffect)) {
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
  }
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  const depsCopy = new Set<any>(deps)
  depsCopy &&
    depsCopy.forEach(_effect => {
      _effect.run()
    })
}
