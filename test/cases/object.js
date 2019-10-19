describe('Object opreations', () => {
  const original = {
    num: 0,
    bar: "foo",
    baz: {
      x: 1,
      y: 2
    },
    arr: [{value: "asdf"}],
    arr2: [{value: "asdf"}]
  };

  describe(`#produce(Object, noWrite)`, () => {
    it('should not change reference if no write', () => {
      const actual = runCase(original, draft => {
        draft.num;
        draft.foo;
        draft.bar;
        draft.baz.x;
        draft.baz.y;
        draft.arr[0].value;
        draft.arr2[0].value;
      });
      assert.strictEqual(actual, original);
    });
  });

  describe(`#produce(Object, assignment + push)`, () => {
    it('should work with a series of modification', () => {
      runCase(original, draft => {
        draft.num++;
        draft.foo = "bar";
        draft.bar = "foo";
        draft.baz.x++;
        draft.baz.y++;
        draft.arr[0].value = "foo";
        draft.arr.push({value: "asf"});
        draft.arr2[0].value = "foo";
        draft.arr2.push({value: "asf"});
        draft.arr2.push({value: "asf"});
      });
    });
  });

  describe(`#produce(Object, assignment + push)`, () => {
    const original = {
      a: {
        b: {
          c: {
            d: [1, {
              value: 0
            }],
          }
        },
        f: {
          g: [100]
        }
      }
    };

    it('should work with deep modification', () => {
      runCase(original, draft => {
        draft.a.b.c.d[1].value = 123;
        draft.a.f.g.push(101);
      });
    });
  });

  describe(`#produce(Object, assignment + push)`, () => {
    const original = {
      a: [1],
      setA() {
        this.a = [2];
      }
    };

    it('should work with function member', () => {
      runCase(original, draft => {
        draft.setA();
      });
    });
  });
});
