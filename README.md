# Sudoku Challenge 數獨挑戰

使用純 HTML、CSS 與 JavaScript 製作的繁體中文數獨網頁遊戲。無需安裝套件或啟動伺服器，可直接在瀏覽器遊玩，也能部署至 Vercel。

## 遊戲功能

- 標準 9×9 數獨，內建一個中等難度關卡。
- 點選空格後，可使用鍵盤或畫面上的按鈕輸入 1～9。
- 使用 Backspace、Delete、0 或「清除」按鈕清除玩家輸入。
- 顯示遊玩時間、即時分數與瀏覽器儲存的最高分。
- 填入正確答案後顯示完成時間與最終分數。
- 重新開始會重設棋盤和計時器，最高分紀錄則會保留。
- 支援手機與電腦瀏覽器，版面會依螢幕寬度調整。

## 專案檔案

```text
.
├── index.html   # 網頁內容
├── style.css    # 版面與樣式
├── script.js    # 棋盤、計時與計分功能
└── README.md    # 專案說明
```

## 開始遊玩

下載或複製專案後，直接用瀏覽器開啟根目錄中的 `index.html` 即可，不需要安裝其他工具。

## 操作方式

1. 點選棋盤上的空格。
2. 按鍵盤上的 `1`～`9`，或點選畫面中的數字按鈕。
3. 要清除玩家輸入時，按 `Backspace`、`Delete`、`0` 或「清除」。
4. 按「重新開始」可重設本局。

題目原有的固定數字不能修改。每秒扣 1 分，最低為 0 分；最高分只儲存在目前瀏覽器的 `localStorage`，不會同步至其他裝置。

## 部署到 GitHub 與 Vercel

### 上傳至 GitHub

1. 登入 [GitHub](https://github.com/) 並建立新的 Repository。
2. 將 `index.html`、`style.css`、`script.js` 和 `README.md` 上傳至 Repository 根目錄。
3. 提交（Commit）變更。

### 部署至 Vercel

1. 登入 [Vercel](https://vercel.com/)；可使用 GitHub 帳號登入。
2. 選擇 **Add New → Project**，匯入剛建立的 GitHub Repository。
3. 設定如下：
   - **Framework Preset：** Other
   - **Root Directory：** `./`
   - **Build Command：** 留空，不需要建置指令
   - **Output Directory：** `.`
4. 按 **Deploy**。部署完成後，Vercel 會提供網站網址。

之後將變更提交至 GitHub，Vercel 會自動重新部署。遊戲不使用後端、資料庫、API 或外部套件。
