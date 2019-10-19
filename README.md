# Imer

A simple immutable data manager inspired by [Immer](https://github.com/immerjs/immer).

## Installation

Node:

    npm -i --save imer

Browser:

    <!-- Minified UMD version -->
    <script src="https://unpkg.com/imer/dist/umd/index.min.js"></script>
    <!-- Unminified UMD version -->
    <script src="https://unpkg.com/imer/dist/umd/index.js"></script>

    <!-- unminified ES version -->
    <script src="https://unpkg.com/imer/dist/es/index.js"></script>

## API

    produce(currentState, producer: (draftState) => void): nextState

## Usage

    const myStructure = {
      a: [1, 2, 3],
      b: 0
    };
    const copy = produce(myStructure, () => {
      // nothings to do
    });
    const modified = produce(myStructure, myStructure => {
      myStructure.a.push(4);
      myStructure.b++;
    });

    copy === myStructure  // true
    modified !== myStructure  // true
    JSON.stringify(modified) === JSON.stringify({ a: [1, 2, 3, 4], b: 1 })  // true
    JSON.stringify(myStructure) === JSON.stringify({ a: [1, 2, 3], b: 0 })  // true

## Implementation

![](https://miro.medium.com/max/2400/1*bZ2J4iIpsm2lMG4ZoXcj3A.png)

> The green tree is the original state tree. You will note that some circles in the green tree have a blue border around them. These are called proxies. Initially, when the producer starts, there is only one such proxy. It is the draft object that get’s passed into your function. Whenever you read any non-primitive value from that first proxy, it will in turn create a Proxy for that value. So that means that you end up with a proxy tree, that kind of overlays (or shadows) the original base tree. Yet, only the parts you have visited in the producer so far.

See [new一个Immer](http://www.ayqy.net/blog/new%e4%b8%80%e4%b8%aaimmer/) for more details.

## Contribution

    git clone https://github.com/ayqy/imer.git
    cd imer
    yarn install
    yarn test

## License

MIT
