# FadeMemo GitHub 数据看板

FadeMemo 的独立项目轨迹观测台，使用 GitHub 公开 REST API 展示贡献者、真实分支图、阶段目标、发布记录与可解释建议。

## 本地运行

需要 Node.js 20 或更高版本。

```powershell
npm install
npm run dev
```

默认读取 `Stone-People-Like/FadeMemo`。可以通过 `.env.local` 覆盖公开仓库：

```dotenv
VITE_GITHUB_OWNER=Stone-People-Like
VITE_GITHUB_REPO=FadeMemo
```

看板不接受或打包 GitHub Token。公共 API 限流或离线时，可在界面切换示例数据，或使用 `?demo=1`。

## 验证

```powershell
npm run check
npm run lint
npm run test
npm run build
```
