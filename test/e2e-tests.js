describe('Protractor Demo Tests', function() {
  it('home page should have a title', function() {
    browser.get('http://localhost:3000');

    expect(browser.getTitle()).toEqual('Top C****!');
  });
});