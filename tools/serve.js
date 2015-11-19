import Koa from 'koa';
import task from './lib/task';
import createStatic from 'koa-static'

const app = new Koa();
app.experimental = true;

export default task(async function serve() {
  return new Promise(() => {
    app.use(createStatic(''));

    app.listen(3000);

    console.log('Koa server running on port 3000');

  })
})
