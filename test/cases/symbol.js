describe('Object opreations', () => {
  const symbolKey = Symbol('key');
  const original = {
    a: 1,
    [symbolKey]: 'symbol'
  };

  describe(`#produce(Object, setPrototype)`, () => {
    it('should work with enumerable symbol members', () => {
      const result = runCase(original, draft => {
        draft.a = 2;
      });
      assert.strictEqual(result[symbolKey], original[symbolKey]);
    });
  });
});
