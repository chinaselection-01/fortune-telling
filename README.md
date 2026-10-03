# 周易命理阁 · 静态站（路线 C：纯免费引流版）

八字排盘 · 称骨算命 · 小六壬 · 观音灵签 · 数字能量 · 生肖纳音 · 风水故事（中英双语）。
当前版本**已关闭会员付费**：流年深度解析、小六壬深度解析直接免费展示，不调用任何后端，
适合直接丢到 GitHub Pages 当引流站。

---

## 一、改了什么（相对上一版）

- `app.js` 顶部新增全局开关 `CONFIG.paymentEnabled = false`
  - 为 `false` 时：深度解析免费展示、不弹付费窗、不请求后端 `/api`
  - 付费弹窗代码（HTML 里的 `#pay-modal`）保留但默认隐藏，以后想收钱改一个值即可
- `index.html` 去掉了小六壬、流年两处的「会员专享」徽章
- 页脚新增「关注 / 合作微信」引流位（见第三节改微信号）
- 新增 `.nojekyll`（GitHub Pages 部署需要）

---

## 二、部署到 GitHub Pages（两种办法，任选）

### 办法 A：网页拖拽上传（最简单，不用装 git）

1. 打开 https://github.com ，登录 / 注册账号
2. 右上角 **＋ → New repository**
   - Repository name 随便取，例如 `mingli`（公开仓库，Private 需付费才能开 Pages）
   - 不用勾 README（我们已经有了），直接 **Create repository**
3. 进仓库后点 **Add file → Upload files**，把本目录这些文件全选拖进去：
   `index.html` `style.css` `app.js` `data.js` `guanyin.js` `guanyin_en.js` `i18n.js`
   `lib/lunar.js` `.nojekyll` `README.md`
   （`backend/` 和 `test*.js` 不是必须，可不上传；要上也无害）
4. 底部 **Commit changes**
5. 仓库 **Settings → Pages → Build and deployment → Source 选 `Deploy from a branch`**
   - Branch 选 `main`（或 `master`）→ 目录选 `/ (root)` → Save
6. 等 1~2 分钟，访问 `https://你的用户名.github.io/仓库名/`

### 办法 B：用 git 命令（你或技术朋友会命令行时用）

```bash
git init
git add index.html style.css app.js data.js guanyin.js guanyin_en.js i18n.js lib .nojekyll README.md
git commit -m "命理站 免费引流版"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
# 然后同样去 Settings → Pages 选 main / root
```

---

## 三、把「微信号」填成你自己的

打开 `index.html`，搜索这一行：

```html
<p class="contact-line">📱 关注 / 合作微信：<span id="wx-id">（把这里改成你的微信号）</span></p>
```

把括号里那句换成你的微信号，例如 `<span id="wx-id">stwadd-mu</span>`，保存重传即可。
（想更狠一点：把微信换成你的公众号二维码图片也行，自己改。）

---

## 四、以后想重新收钱（路线 B）

1. 把 `app.js` 里的 `CONFIG.paymentEnabled = false` 改成 `true`
2. 办个体户营业执照 + 微信/支付宝商户号（约 1~2 周）
3. 把 `backend/` 部署到一台能跑 Node 的主机（腾讯云/阿里云轻量，约 60~100 元/月）
4. 在主机上 `cd backend && npm install && node server.js`，并按 `backend/README.md` 填商户号环境变量
5. 前端把请求地址指到这台主机（改 `app.js` 里 fetch 的 `/api` 前缀为你的域名）

---

## 五、合规提醒（别碰红线）

- 全站定位「中国传统民俗文化 / 娱乐参考」，页脚已写明**不含科学、医疗、投资、决策建议**
- 对外不要承诺改运、消灾、保发财——那是红线，平台会下架、监管会找
- 收费内容也只做「娱乐化解读」，不碰医疗/投资/风水改运的实打实建议

---

## 六、本地预览

不需要服务器，直接双击 `index.html` 就能在浏览器打开看效果。
