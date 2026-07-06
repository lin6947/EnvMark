# EnvMark 项目功能架构文档

## 一、项目概览

**EnvMark** 是一个 Manifest V3 Chrome 浏览器扩展，专为需要频繁在 **开发/测试/预发/生产** 环境之间切换的研发团队设计。它通过 URL 规则识别当前页面所属环境，在页面上叠加视觉标识（徽章/水印），帮助用户避免在视觉相似的系统间误操作。

- **版本**: 0.2.2
- **manifest_version**: 3
- **许可权限**: `storage`、`tabs`、`<all_urls>`（host_permissions）
- **国际化**: en、zh_CN

---

## 二、目录结构

```
EnvMark/
├── manifest.json              # 扩展清单（入口声明）
├── README.md                  # 项目说明
├── Makefile                   # 打包脚本（zip / crx）
├── _locales/                  # 多语言文案
│   ├── en/messages.json
│   └── zh_CN/messages.json
├── assets/icons/              # 图标资源
├── src/                       # 核心运行时
│   ├── background.js          # Service Worker（后台）
│   ├── content.js             # 内容脚本（注入页面）
│   ├── content.css            # 标识层样式
│   └── i18n.js                # 通用 i18n 模块（popup/options 共用）
├── popup/                     # 工具栏弹窗
│   ├── popup.html / .css / .js
└── options/                   # 设置页
    ├── options.html / .css / .js
└── samples/envmark-config.sample.json   # 配置示例
```

---

## 三、整体架构

扩展分为 4 个运行上下文，通过 `chrome.storage.local` 共享配置（key: `envmarkSettings`）和 `chrome.runtime` 消息通信：

```
┌──────────────────────────────────────────────────────────┐
│  Service Worker (background.js)                          │
│  - 监听标签页变化，动态绘制工具栏图标（matched/unmatched）│
│  - 初始化默认配置                                        │
└──────────────────────────────────────────────────────────┘
                              ▲ storage.onChanged
                              │
┌─────────────────────────────┴────────────────────────────┐
│  Content Script (content.js, 注入到所有页面)              │
│  - 匹配环境 → 注入 badge / watermark / title 前缀         │
│  - 接收 popup 消息执行账号填充 (ENVMATE_FILL_ACCOUNT)     │
│  - 监听 pushState/replaceState/popstate 应对 SPA 路由     │
└──────────────────────────────────────────────────────────┘
                              ▲ runtime.sendMessage
                              │
┌─────────────────────────────┴────────────────────────────┐
│  Popup (工具栏弹窗)        │  Options 页（设置/管理）    │
│  - 显示当前环境            │  - 分组管理 + 环境增删改    │
│  - 列出测试账号 → 一键填充 │  - URL 规则、徽章/水印配置  │
│  - Quick Access 快捷跳转   │  - 账号拖拽排序、导入/导出  │
└──────────────────────────────────────────────────────────┘
```

---

## 四、数据模型

### settings（存储于 `chrome.storage.local.envmarkSettings`）

```jsonc
{
  "groups": [{ "id": "default", "name": "Default Group" }],
  "environments": [
    {
      "id": "local",
      "groupId": "default",
      "name": "Local Dev",
      "homepageUrl": "http://localhost/",
      "lastQuickAccessAt": 0,        // Quick Access 最近访问时间戳
      "enabled": true,
      // —— URL 匹配规则 ——
      "rules": [
        { "type": "wildcard|prefix|regex", "value": "http://localhost:*/*" }
      ],
      // —— 标题前缀 ——
      "titlePrefix": true,
      // —— 徽章 (Badge) ——
      "badge": "LOCAL",
      "badgeEnabled": true,
      "badgeColor": "#2563eb",
      "badgeTextColor": "#ffffff",
      "badgeStyle": "slanted|pill",
      "badgePosition": "top-right|top-left|bottom-right|bottom-left",
      "badgeScale": 1, "badgeSize": 14, "badgeOffset": 12, "badgeOpacity": 1,
      // —— 水印 (Watermark) ——
      "watermarkText": "Local Dev",
      "watermarkEnabled": false,
      "watermarkColor": "#2563eb",
      "watermarkOpacity": 0.08, "watermarkAngle": -24,
      "watermarkSize": 42, "watermarkGap": 80,
      // —— 兼容旧字段 ——
      "markerMode": "badge|watermark|badge-watermark",
      // —— 测试账号 ——
      "accounts": []
    }
  ]
}
```

---

## 五、核心机制详解

### 1. URL 规则匹配（`findEnvironment`，三处代码逻辑相同）

`background.js:119`、`content.js:22`、`popup.js:67` 中各有一份相同的实现（重要：保持三处一致是设计权衡，便于 SW/content/popup 各自独立快速匹配，无需跨上下文通信）。

- **规则类型**：
  - `wildcard`：`*` → `.*`，整体锚定 `^...$`
  - `prefix`：字符串前缀匹配
  - `regex`：JavaScript 正则
- **特异性优先级**（`ruleSpecificity`）：当多个环境都匹配时，**prefix > wildcard > regex**，并在同类型中按规则长度更具体者优先。这保证 `https://prod.example.com/*` 优先于 `https://*.example.com/*`。

### 2. Service Worker（`background.js`）

- **职责**：根据当前标签页 URL 是否匹配某环境，**动态绘制工具栏图标颜色**（matched=蓝色 / unmatched=灰色），通过 `OffscreenCanvas` + `chrome.action.setIcon`。
- **触发时机**：`onInstalled`、`onStartup`、`tabs.onActivated`、`tabs.onUpdated`、`windows.onFocusChanged`、`storage.onChanged`。
- **初始化**：首次安装时写入 `DEFAULT_SETTINGS`（仅包含空的默认分组）。示例环境由用户在 Options 页主动点击 `Load Sample` 后写入。

### 3. Content Script（`content.js`）— 视觉标识核心

注入到所有页面 `<all_urls>`，`document_idle` 时机运行。

**核心流程 `applyMarkers`**（`content.js:214`）：
1. 清理旧标记（`[data-envmate-root]` 节点 + 还原 `document.title`）
2. `findEnvironment` 匹配当前 URL
3. 若命中：
   - `applyTitle`：`document.title = "[BADGE] 原标题"`
   - 可选 `createWatermark`：36 项的旋转网格水印，覆盖全屏，`pointer-events: none`
   - 可选 `createBadge`：固定定位的角标（slanted=对角丝带 / pill=胶囊），并启用 **mouse-enter 1.2s 后变透明 `--peek`**（让用户能"看穿"徽章下方的页面内容）
   - `scheduleDefaultFill`：若该环境存在 `defaultFill: true` 账号，且页面看起来是登录表单，则自动填充（24 次 × 300ms 重试 + MutationObserver 监听 DOM 变化），并显示 toast 提示。

**SPA 路由适配**（`content.js:239`）：包装 `history.pushState / replaceState` 与监听 `popstate`，URL 改变后重新匹配并刷新标记。

**消息接口**：
- `ENVMATE_GET_PAGE_ENV` → 返回当前匹配的环境
- `ENVMATE_FILL_ACCOUNT` → 用指定账号填充用户名/密码输入框

### 4. 登录表单识别与填充（`content.js:248-461`）

- **候选输入框发现**：`resolveLoginInputs` 先尝试一组显式 CSS 选择器（`input[name="username"]`、`input[autocomplete="username"]`、含中文 placeholder "用户名/账号/手机号/工号" 等），未命中则用 `inferInputs` 启发式回退（取第一个可见非密码 input 作为用户名框）。
- **填充触发器** `fillAccount(account, { auto })`：
  - 当 `auto=true`（自动填充场景）时，需通过 `isLikelyLoginForm` 判定（密码框关键词 + 同 form / 用户名关键词 / 上下文关键词中含 `login|signin|auth|sso|登录`），避免误填非登录页。
  - 当 `auto=false`（用户在 popup 主动点击账号）时，跳过此判定。
- **值写入** `setInputValue`：通过原型链上的 `value` setter 写入，并派发 `input` + `change` 事件，兼容 React/Vue 等受控组件。
- **关键安全语义**：扩展**仅填充、不提交**——不会点击登录按钮（README 明确声明）。

### 5. Popup（`popup/popup.js`）

工具栏弹窗，展示当前标签页状态并触发动作：
- **环境卡片**：显示当前 URL 命中的环境名/徽章/分组，提供"启用/禁用"切换。
- **Add Current Site**：未命中且当前页是 http/https 时，跳转到 options 页并带 `quickAdd=1` 查询参数，触发快速建环境流程（自动生成 prefix 规则 + 智能徽章识别 `detectQuickBadge`，识别 localhost/dev/test/uat/prod 等关键词）。
- **Test Accounts**：列出当前环境账号，点击 → 向 content script 发 `ENVMATE_FILL_ACCOUNT`。
- **Quick Access**：分组折叠列表，点击 → 复用当前空标签或新开标签跳转 `homepageUrl`，并刷新 `lastQuickAccessAt`（用于排序）。

### 6. Options 页（`options/options.js`）— 配置管理中枢

代码体量最大（~2630 行），单文件包含：

- **分组 + 环境的双层管理**：左侧分组卡片（重命名、删除、克隆），每个环境下可编辑基本信息、URL 规则、徽章、水印、账号。
- **拖拽排序**：
  - 环境可在组内/跨组拖拽（`draggingEnvironmentId`，`reorderEnvironments` / `moveEnvironmentToGroup`）
  - 账号在环境内拖拽排序（`reorderAccounts`）
  - 拖放时显示 before/after 指示线
- **实时预览**：`renderMarkerPreviews` 在迷你"浏览器窗口"画布上预览徽章/水印效果。
- **导入/导出**（带密码混淆）：
  - 导出前对每个账号密码做 `emsec:v1:<base64>` 混淆（`encodeExportedPasswordV1`：固定 key + 按位置异或 + base64）。**注意：这只是轻量混淆而非加密**，导入时逆向还原（`revealImportedPassword`）。
  - 导入导出均提供 **分组树状选择器**（`renderSelectionTree`，支持半选 indeterminate），可勾选导出/导入子集。
  - 导入采用 **合并而非覆盖** 策略（`mergeImportedSettings`）：同 ID 环境跳过，重名组追加 "N" 后缀。
- **未保存变更保护**：`hasUnsavedChanges` 状态、切换环境/关闭页面前 `confirm`、`beforeunload` 拦截。
- **校验**：保存时检查空账号、非法 homepageUrl，并跳转到对应分区提示。
- **多语言切换**：`locale-switcher` 下拉，`auto` 跟随浏览器，可选 en / zh_CN。About 弹窗在中文环境下显示微信二维码区块。

### 7. i18n 模块（`src/i18n.js`）

popup 和 options 共用：
- 通过 `window.envmarkI18n` 暴露 `t / localizeDocument / setLocaleChoice / getLocaleChoice / ready`
- 支持 `data-i18n`、`data-i18n-title`、`data-i18n-placeholder` 属性自动本地化
- 支持 Chrome i18n placeholders 语法（`$COUNT$` → `$1`）
- locale 选择持久化在 `localStorage.envmarkUiLocale`
- `auto` 模式回退到 `chrome.i18n.getUILanguage()`

---

## 六、消息与存储契约

| 通道 | 方向 | 用途 |
|------|------|------|
| `chrome.storage.local.envmarkSettings` | 双向 | 所有配置数据， onChanged 监听变更 |
| `chrome.runtime.sendMessage({type:"ENVMATE_GET_PAGE_ENV"})` | popup → content | 取当前页匹配的环境 |
| `chrome.runtime.sendMessage({type:"ENVMATE_FILL_ACCOUNT", account})` | popup → content | 触发填充 |
| URL 查询参数 `?quickAdd=1&prefix=...&url=...&title=...` | popup → options | 快速建环境 |
| URL 查询参数 `?environmentId=...` | popup → options | 直接定位某环境 |

---

## 七、构建与发布

`Makefile` 提供三个目标：
- `make zip`：将 `manifest.json _locales assets options popup src` 打包为 `dist/envmark-<version>.zip`（Web Store 上架用）
- `make crx [KEY=path/to/key.pem]`：调用 Chrome CLI 生成 `.crx`，未提供 KEY 时自动生成 `.keys/envmark-<version>.pem`（**勿提交此目录**）
- `make clean`：清理 `dist/`

---

## 八、关键设计要点

1. **三处重复的匹配逻辑**（background/content/popup）：是性能与解耦的权衡——避免每个标签都向 SW 发消息确认环境，content script 可独立工作。
2. **特异性算法**：保证具体规则压倒宽泛规则，避免"通配规则盖住精确规则"。
3. **不自动提交**：填充只触达 input，不点登录按钮，是核心安全承诺。
4. **自动填充防误触发**：必须有密码框 + 上下文关键词，避免在搜索框/订阅框乱填。
5. **badge peek-through**：徽章遮挡内容时，鼠标停留 120ms 后降至 28% 透明度并允许事件穿透。
6. **密码导出仅为混淆**：方案字符串 `emsec:v1` 便于未来升级到 v2 真加密；当前实现不应被视为安全存储。
7. **legacy `markerMode` 字段兼容**：旧配置缺 `badgeEnabled/watermarkEnabled` 时，由 `markerMode` 派生（normalizeSettings）。

---

## 九、典型使用流程

1. 用户加载扩展 → 首次安装只创建空默认分组；可在 Options 页点击 `Load Sample` 加载示例环境。
2. 用户添加环境规则后，打开内部系统 → URL 命中规则 → 页面右上角出现彩色角标 + 标签页标题加前缀。
3. 工具栏图标变蓝，弹窗显示当前环境。
4. 若该环境配置了 `defaultFill` 账号且页面是登录表单 → 自动填充并 toast 提示。
5. 用户在弹窗中点击其他账号 → 切换填充内容（仍不提交）。
6. 通过 Quick Access 一键跳转到其他环境主页。
7. 在 options 页维护分组、规则、徽章样式、账号；可导入/导出 JSON 分发给团队。
