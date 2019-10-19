// produce(currentState, producer: (draftState) => void): nextState
const INTERNAL_STATE_KEY = Symbol('state');

function proxyProp(propValue, propKey, hostDraftState) {
  const { originalValue, draftValue, onWrite } = hostDraftState;
  return proxy(propValue, (value) => {
    if (!draftValue.mutated) {
      hostDraftState.mutated = true;
      // 拷贝host所有属性
      copyProps(draftValue, originalValue);
    }
    draftValue[propKey] = value;
    if (onWrite) {
      onWrite(draftValue);
    }
  });
}

// 跳过target身上已有的属性
function copyProps(target, source) {
  if (Array.isArray(target)) {
    for (let i = 0; i < source.length; i++) {
      // 跳过在更深层已经被改过的属性
      if (!(i in target)) {
        target[i] = source[i];
      }
    }
  }
  else {
    Reflect.ownKeys(source).forEach(key => {
      const desc = Object.getOwnPropertyDescriptor(source, key);
      // 跳过已有属性
      if (!(key in target)) {
        Object.defineProperty(target, key, desc);
      }
    });
  }
}

function copyOnWrite(draftState) {
  const { originalValue, draftValue, mutated, onWrite } = draftState;
  if (!mutated) {
    draftState.mutated = true;
    // 下一层有修改时才往父级 draftValue 上挂
    if (onWrite) {
      onWrite(draftValue);
    }
    // 第一次写时复制
    copyProps(draftValue, originalValue);
  }
}

function getTarget(draftState) {
  return draftState.mutated ? draftState.draftValue : draftState.originalValue;
}

function getCleanCopy(obj) {
  return Object.create(Object.getPrototypeOf(obj));
}

function proxy(original, onWrite) {
  const isArrayValue = Array.isArray(original);
  // 创建一份干净的draft值
  const draftValue = isArrayValue ? [] : getCleanCopy(original);
  let proxiedKeyMap = Object.create(null);
  let draftState = {
    originalValue: original,
    draftValue,
    mutated: false,
    onWrite
  };
  const draft = new Proxy(original, {
    get(target, key, receiver) {
      // 建立proxy到draft值的关联
      if (key === INTERNAL_STATE_KEY) {
        return draftState;
      }
      // 优先走已创建的代理
      if (key in proxiedKeyMap) {
        return proxiedKeyMap[key];
      }

      // 代理属性访问
      if (typeof original[key] === 'object' && original[key] !== null) {
        // 不为基本值类型的现有属性，创建下一层代理
        proxiedKeyMap[key] = proxyProp(original[key], key, draftState, onWrite);
        return proxiedKeyMap[key];
      }
      else {
        // 改过直接从draft取最新状态
        if (draftState.mutated) {
          return draftValue[key];
        }

        // 不存在的，或者值为基本值的现有属性，代理到原值
        return Reflect.get(target, key, receiver);
      }
    },
    set(target, key, value) {
      // 监听修改，用新值重写原值
      // 如果新值不为基本值类型，创建下一层代理
      if (typeof value === 'object') {
        proxiedKeyMap[key] = proxyProp(value, key, draftState, onWrite);
      }
      // 第一次写时复制
      copyOnWrite(draftState);
      // 复制过了，直接写
      draftValue[key] = value;
      return true;
    },
    // 代理其它读方法
    has(_, ...args) {
      return Reflect.has(getTarget(draftState), ...args);
    },
    ownKeys(_, ...args) {
      return Reflect.ownKeys(getTarget(draftState), ...args);
    },
    getOwnPropertyDescriptor(_, ...args) {
      return Reflect.getOwnPropertyDescriptor(getTarget(draftState), ...args);
    },
    getPrototypeOf(_, ...args) {
      return Reflect.getPrototypeOf(original, ...args);
    },
    // 代理其它写方法
    deleteProperty(_, ...args) {
      copyOnWrite(draftState);
      return Reflect.deleteProperty(draftValue, ...args);
    },
    defineProperty(_, ...args) {
      copyOnWrite(draftState);
      return Reflect.defineProperty(draftValue, ...args);
    },
    setPrototypeOf(_, ...args) {
      copyOnWrite(draftState);
      return Reflect.setPrototypeOf(draftValue, ...args);
    }
  });

  return draft;
}

export default function produce(original, producer) {
  const draft = proxy(original);
  // 修改draft
  producer(draft);
  // 取出draft内部状态
  const { originalValue, draftValue, mutated } = draft[INTERNAL_STATE_KEY];
  // console.log('-- draftState --');
  // console.log(draft[INTERNAL_STATE_KEY]);
  // 将改过的新值patch上去
  const next = mutated ? draftValue : originalValue;
  return next;
}
