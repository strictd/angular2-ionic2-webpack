
// https://www.npmjs.com/package/fs-extra

module.exports = {
  include: [
    {
      src: 'app/assets/',
      dest: 'www/assets/'
    },
    {
      src: 'app/index.html',
      dest: 'www/index.html'
    },
    {
      src: 'node_modules/ionic-angular/polyfills/polyfills.js',
      dest: 'www/build/polyfills.js'
    },
    {
      src: 'node_modules/ionicons/dist/fonts/',
      dest: 'www/assets/fonts/'
    },
  ]
};
