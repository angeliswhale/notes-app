# 📒 個人網頁記事本 · Personal Notes App

> 純前端實作的個人記事管理工具，無需伺服器，開啟即用。
> A lightweight personal note-taking app built with vanilla HTML / CSS / JavaScript.

🔗 **[線上展示 Live Demo](https://angeliswhale.github.io/notes-app/)**

---

## 截圖 · Screenshots

| 介面總覽 | 便條紙背景色功能 |
|:---:|:---:|
| <img width="960" height="422" alt="overview" src="https://github.com/user-attachments/assets/f3b5e951-2da5-4acb-8006-20cc42daedac" /> | <img width="956" height="423" alt="colors" src="https://github.com/user-attachments/assets/0e7e784b-dbc9-431b-b231-dade14390a1a" /> |
---

## 功能列表 · Features

- [x] 新增、編輯、刪除記事
- [x] 六種便條紙背景色分類（白、黃、藍、綠、粉、橘）
- [x] 即時搜尋，關鍵字高亮顯示
- [x] 側邊欄記事列表，色點同步對應分類色
- [x] 刪除操作 inline 確認，防止誤刪
- [x] 資料持久化，關閉瀏覽器後不遺失（localStorage）
- [x] 符合 WCAG AA 無障礙標準（對比度 ≥ 4.5:1）
- [x] 無需安裝、無需伺服器，下載後直接開啟

---

## 技術說明 · Tech Stack

| 項目 | 說明 |
|------|------|
| 語言 | HTML5 · CSS3 · JavaScript (ES6+) |
| 儲存 | LocalStorage API |
| 無障礙 | WCAG 2.1 AA 標準驗證 |
| 相依套件 | 無（零依賴） |

---

## 安全性說明 · Security

- **XSS 防護**：所有使用者輸入透過 `escapeHtml()` 處理，禁止 `innerHTML` 直接插入原始輸入
- **索引安全**：以 `uid()` 唯一 ID 識別記事，搜尋過濾後仍能正確刪除與編輯

---

## 使用方式 · Getting Started

**方法一：直接開啟**

下載 index.html → 用瀏覽器開啟 → 開始使用


**方法二：複製網址後開啟**

複製 https://angeliswhale.github.io/notes-app/ → 開啟 → 開始使用

---

## 未來規劃 · Roadmap

- [ ] 標籤（Tag）分類系統，支援多標籤篩選
- [ ] Markdown 語法支援
- [ ] 串接 Firebase 實現雲端同步

---

## 作者 · Author

**ChiaYu**

國立金門大學電機工程學系 National Quemoy University, EE Dept.

高二高三自主學習專案(大一優化版)

**GitHub：https://github.com/angeliswhale**

---

*本專案為個人課外實作，歡迎參考與交流。*
