const chalk = require('chalk');
const OSS = require('ali-oss');
const fs = require("fs");
const path = require('path');

module.exports = (api, options) => {
    const {
      context,
      log,
      onHook
    } = api;

    onHook('before.build.run', () => optionsCheck(api, options))

    onHook('after.build.compile', async () => {
      const region = options.region;
      const accessKeyId = options.accessKeyId;
      const accessKeySecret = options.accessKeySecret;
      const bucket = options.bucket;
      const ossRoot = options.root || 'web';

      const deployResource = options.deployResource || 'build/web';

      log.info('====================');
      log.info('start deploy to OSS');

      // iterate output dir and upload it to oss
      let client = new OSS({
        region,
        accessKeyId,
        accessKeySecret,
        bucket
      });

      let files = []
      const dir = path.resolve(context.rootDir, deployResource);
      readFileList(dir, files, ossRoot)
      
      for(let file of files){
        let result = await client.put(file.name, file.path).catch(e => {
          log.info('deploy failed')
          log.error(e)
        })
        if(result){
          log.info('deployed %s success', file.name)
        }
      }

      log.info('deployed');
      log.info('====================');
    });
};

function optionsCheck(api, options){
  const { context, log } = api;
  let hasError = false;
  let errMsg = '';

  if(!options.region){
    hasError = true;
    errMsg = "build-plugin-rax-oss-deploy needs region option";
  }

  if(!options.accessKeyId){
    hasError = true;
    errMsg = "build-plugin-rax-oss-deploy needs accessKeyId option";
  }

  if(!options.accessKeySecret){
    hasError = true;
    errMsg = "build-plugin-rax-oss-deploy needs accessKeySecret option";
  }

  if(!options.bucket){
    hasError = true;
    errMsg = "build-plugin-rax-oss-deploy needs bucket option";
  }

  if(hasError){
    log.error(chalk.red(errMsg));
    console.log();
    process.exit(1);
  }
}

let root;
let _startPath;
function readFileList(dir, fileList, startPath){
  const files = fs.readdirSync(dir)

  if(!root){
    root = dir;
    _startPath = startPath;
  }

  for(let file of files){
    let fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {

      const rootLength = root.split(path.sep).length;;

      const relatePath = fullPath.split(path.sep).slice(rootLength);

      startPath = _startPath + '/' + relatePath.join('/')
      readFileList(path.join(dir, file), fileList, startPath);
    } else {
      fileList.push({
        name: ( startPath ? startPath + '/' : '')  + file,
        path: fullPath
      });
    }
  }
}