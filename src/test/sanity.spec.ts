describe('Sanity Test', () => {

  it('Should test matchers', () => {

    let _undefined, _defined = true;

    expect('a' + 'b').toBe('ab');

    expect(_undefined).toBeUndefined();
    expect(_defined).toBeDefined();

    expect(!_defined).toBeFalsy();
    expect(_defined).toBeTruthy();
    expect(null).toBeNull();

    expect(1 + 1).toEqual(2);
    expect(5).toBeGreaterThan(4);
    expect(5).toBeLessThan(6);

    expect('abcdbca').toContain('bcd');
    expect([4, 5, 6]).toContain(5);
    expect('abcdefgh').toMatch(/efg/);

    expect('abcdbca').not.toContain('xyz');
    expect('abcdefgh').not.toMatch(/123/);
  });

});
