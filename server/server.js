
const Koa = require('koa');
const serve = require('koa-static');
const Router = require("koa-router");
const koaBody = require("koa-body");
const send = require("koa-send");
const path = require("path");

const { upload_file, _UPLOAD_PATH } = require("./upload_file");

const app = new Koa();
const router = new Router();

router.post('/uploadFile', async (ctx, next) => {
    const { file, editor } = await upload_file(ctx);
    ctx.body = {
        urls: {
            default: "/download/" + file,
            editor: editor
        }
    };
});

router.get('/download/:name*', async (ctx) => {
    console.log(ctx);
    const name = ctx.params.name;
    const filePath = path.join(_UPLOAD_PATH, name);

    ctx.attachment(name);
    await send(ctx, filePath);
});

app.use(serve(_UPLOAD_PATH));
app.use(koaBody({ multipart: true }))
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(4000);

console.log('listening on port 4000');