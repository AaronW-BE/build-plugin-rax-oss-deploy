# build-plugin-rax-oss-deploy

This plugin helps you to deploy build resource upload to your OSS automatic, you need a OSS bucket in advance.
Upload target dir is ```/web``` in bucket workspace.You can change the ```root``` option to change default target of uploaded to OSS.
### Install
```
yarn add build-plugin-rax-oss-deploy -D
```
or
```
npm i build-plugin-rax-oss-deploy -D
```

### Configuration
Edit ```build.json``` file in project and append configs like below in plugins:
```
[
    "build-plugin-rax-oss-deploy",
    {
        "region": "[oss region]",
        "accessKeyId": "[accesskeyId]",
        "accessKeySecret": "[accessKeySecret]",
        "bucket": "[bucket]",
        "root": "web"
    }
]
```

### Features
 * [x] specific a dir in bucket (```root``` option in config)

 * [ ] version control on OSS workspace