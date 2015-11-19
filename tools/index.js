require('babel-register');
require('babel-polyfill');

function onError(err) {
  console.log(err.stack);
}

var args = process.argv.slice(2);
var cmds = ['start', 'build', 'deploy', 'clean', 'render', 'serve'];
while(cmds.length) {
  var cmd = cmds.shift();
  if (args.indexOf(cmd) < 0) continue;
  require('./' + cmd).default().catch(onError);
}
