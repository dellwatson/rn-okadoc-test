const getFibonnaci = require('../Slide.tsx');

test('fibonnaci', () => {
    expect(getFibonnaci(4)).toBe([0, 1, 1, 2]);
});