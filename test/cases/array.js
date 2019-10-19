describe('Array opreations', () => {
  const original = [{
    todo: "Learn typescript",
    done: true
  }, {
    todo: "Try immer",
    done: false
  }];

  describe(`#produce(Array, noop)`, () => {
    it(`should strictly equals original`, () => {
      const next = produce(original, () => {});
      assert.equal(next, original);
    });
  });

  describe(`#produce(Array, push)`, () => {
    const next = produce(original, draft => {
      draft.push({
        todo: 'new one',
        done: false
      });
    });

    it(`should return a new one as expected`, () => {
      assert.deepStrictEqual(next, original.concat([{
        todo: 'new one',
        done: false
      }]));
    });
    it(`should not make any change on original`, () => {
      assert.deepStrictEqual(original, JSON.parse(JSON.stringify(original)));
    });
  });

  describe(`#produce(Array, splice)`, () => {
    it(`should delete the second element`, () => {
      runCase(original, draft => {
        draft.splice(1, 1);
      });
    });
    it(`should delete the first element then insert another two elements`, () => {
      runCase(original, draft => {
        const newElements = [{ a: 1 }, { b: 2 }];
        draft.splice(0, 1, newElements);
      });
    });
  });

  describe(`#produce(Array, assignment)`, () => {
    it(`should change the second element`, () => {
      runCase(original, draft => {
        const newElement = { id: 'the new one' };
        draft[1] = newElement;
      });
    });
    it(`should cut elements by small length`, () => {
      runCase(original, draft => {
        draft.length = 1;
      });
    });
  });

  describe(`#produce(Array, push + splice)`, () => {
    it(`should work as expected`, () => {
      runCase([1, 2, 3], draft => {
        draft.push(4);
        draft.splice(1, 1, 2, 2, 2);
      });
    });
  });
});
