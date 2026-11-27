# 参与 GeoFS_Extension 开发

[English](contributing.md) · [项目指南](readme.zh-cn.md)

修改飞行控制后，重新加载已解压的扩展并按实飞验证指南记录模拟器版本、机型、控制输入和实际响应。

## 验证

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run test:e2e
```

请在拉取请求中记录执行的命令与实际结果。面向用户的步骤发生变化时，同步更新两种语言的指南，并在[更新日志](changelog.md)中记录待发布的改动。

[报告问题](https://github.com/AMFI-Disable/GeoFS_Extension/issues/new?title=%5BBUG%5D+&body=%23%23+Observed+%2F+%E5%AE%9E%E9%99%85%E7%BB%93%E6%9E%9C%0A%0A%0A%23%23+Expected+%2F+%E9%A2%84%E6%9C%9F%E7%BB%93%E6%9E%9C%0A%0A%0A%23%23+Steps+%2F+%E5%A4%8D%E7%8E%B0%E6%AD%A5%E9%AA%A4%0A%0A%0A%23%23+Environment+%2F+%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83%0A%0A)
