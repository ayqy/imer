describe('Object opreations', () => {
  const original = {
    a: {
      b: 1
    }
  };
  const originalProto = { myProto: 2 };
  Object.setPrototypeOf(original.a, originalProto);

  describe(`#produce(Object, setPrototype)`, () => {
    it('should work with a prototype modification', () => {
      const modifiedProto = { modifiedProto: 4 };
      const result = runCase(original, draft => {
        draft.c = 3;
        Object.setPrototypeOf(draft.a, modifiedProto);
        draft.a.d = 5;
      });
      assert.deepStrictEqual(Object.getPrototypeOf(result.a), modifiedProto);
      assert.deepStrictEqual(Object.getPrototypeOf(original.a), originalProto);
    });

    it('should work with root prototype modification', () => {
      const result = runCase({ a: 1 }, draft => {
        Object.setPrototypeOf(draft, null);
      });
      assert.strictEqual(Object.getPrototypeOf(result), null);
    });
  });

  describe(`#produce(Object, Object.create prop)`, () => {
    it('should work with new prop which prototype is not the default', () => {
      const proto = {
        setA() {
          this.a = 2;
        }
      };
      runCase({ a: 1 }, draft => {
        draft.b = Object.assign(Object.create(proto), { b: 2 });
      });
    });
  })
});
