# GeoFS 飞行扩展

[English](readme.md) · [参与贡献](contributing.zh-cn.md) · [路线图](docs/roadmap.md) · [更新日志](changelog.md) · [安全政策](security.md) · [MIT 许可证](license)

![版本](https://img.shields.io/badge/Version-v0.3.0-blue?style=flat-square)

这款 Manifest V3 扩展为 GeoFS 3.9 和 4.0 提供 AP++、自动油门、驾驶舱仪表、检查单、燃油管理、雷达、推回和着陆记录。不同飞机可用的控制项有所区别。实际飞行的验证进度见 [V4 测试记录](docs/live-v4-status.md)。

## 安装与更新

1. 从[发行页面](https://github.com/AMFI-Disable/GeoFS_Extension/releases)获取并解压扩展，或从源码构建。
2. 在 Chromium 浏览器的扩展管理页面打开开发者模式，选择“加载已解压的扩展程序”，选中包含 `manifest.json` 的目录。
3. 固定扩展图标，打开或刷新 [GeoFS 3.9](https://www.geo-fs.com/geofs.php) 或 [GeoFS 4.0](https://beta.geo-fs.com/geofs.php)。更新扩展后，先在扩展管理页重新加载，再刷新模拟器。使用统一扩展时请停用功能重复的[旧用户脚本](userscripts/readme.md)。

## 驾驶舱与飞行记录

- **浮动 HUD** 的 INFO 显示遥测、METAR 和交通小地图。CHECKS 包含起飞前、巡航前、着陆前及挡轮四个检查阶段。FUEL 调整燃油与载重，LAND 显示着陆评分。可拖动、折叠或停靠面板，用加号打开其他面板。
- **自动驾驶栏** 提供 A/THR、AP++ 与 OP ENG。AP++ 涵盖航路跟踪、等待航线、垂直导航、进近和旋翼机悬停。FPV 显示飞行轨迹。
- **工具栏与侧边栏** 可切换模块、选择仪表飞行或目视飞行预设、调整屏幕尺寸，也可打开雷达、SimBrief 飞行计划、机场图和侧风计算器。
- **环境与地面操作** 包括灯光、地景图源、风场、故障模拟与应急检查、机位查找、地面推回及绕机检查。设置页面可调整机型参数、重新绑定快捷键，并将浏览器本地的着陆日志导出为 JSON 或 CSV。

## 默认快捷键

| 功能 | 按键 |
| --- | --- |
| 自动油门、增强引擎、HUD、飞行轨迹 | Alt+A、Alt+O、Alt+H、Alt+F |
| 检查单、着陆灯、自由移动、绕机检查 | Alt+C、Alt+L、Alt+Y、Alt+W |
| 快捷键列表、复位视角 | ?、双击鼠标中键 |

macOS 使用 Option 代替 Alt。HUD 尺寸异常时可在弹窗中调整 **Screen Calibrator**。

## 构建与验证

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run test:e2e
```

加载生成的 `dist/` 目录，并按照[实飞验证指南](docs/live-verification-guide.md)核实模拟器的真实响应。运行 `npm run package` 可以在 `release/` 中生成本地发行包。[星标历史](https://www.star-history.com/?repos=AMFI-Disable%2FGeoFS_Extension&type=date)
