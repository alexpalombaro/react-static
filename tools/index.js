require('babel/register');

function onError(err) {
  console.log(err.stack);
}

var args = process.argv.slice(2);
switch (true) {
  case args.indexOf('--start') > -1:
    require('./start')().catch(onError);
    break;
}
