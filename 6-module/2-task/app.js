const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const User = require('./models/User');

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

async function errorsHandler(errors){
  let result = {};
  for(const error in errors){
    await (async function(){
      result[error] = errors[error].message;
    })()
  }
  return result;
};

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = { error: err.message };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
});

const router = new Router();

router.get('/users', async (ctx) => {
  ctx.status = 200;
  ctx.body = await User.find({});
});

router.get('/users/:id', async (ctx) => {
  const _id = ctx.params.id; 
  try {
    await User.findById({_id}, (err, arr) => {
      if(!!arr){
        ctx.status = 200;
        ctx.body = arr;
      }
    })
  }
  catch (err) {
    let response = await errorsHandler(err.errors);
    ctx.status = 400;
    ctx.body = {"errors": response};
  }
});
 
router.patch('/users/:id', async (ctx) => {
  const {email, displayName} = ctx.request.body;
  const _id = ctx.params.id; 
  try {
    await User.findByIdAndUpdate({_id}, {$set: {email, displayName}},
      {omitUndefined: true, runValidators: true});
    ctx.status = 200;
    ctx.body = await User.findById(_id);
  }
  catch (err) {
    let response = await errorsHandler(err.errors);
    ctx.status = 400;
    ctx.body = {"errors": response};
  }
});

router.post('/users', async (ctx) => {
  const {email, displayName} = ctx.request.body;
  try {
    ctx.status = 200;
    ctx.body = await User.create({email, displayName});
  }
  catch (err) {
    let response = await errorsHandler(err.errors);
    ctx.status = 400;
    ctx.body = {"errors": response};
  }
});

router.delete('/users/:id', async (ctx) => {
  const _id = ctx.params.id; 
  await User.deleteOne({_id}, (err, result)=>{
    if(!!result.deletedCount){
      ctx.status = 200;
      ctx.body = false;
    }
  });

});

app.use(router.routes());

module.exports = app;
