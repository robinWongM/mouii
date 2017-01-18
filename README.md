# Mouii
多曰（もういい），一个致力于成为多说的替代品的评论系统。

## Structure
多曰目前的项目结构为：
- 根目录（/）：基于 Express.js & Mongoose 的后端，提供 API 接口与 Dashboard 功能（暂未实现）
- 评论框（/widget/）：基于 Vue.js & Webpack 的前端，作为嵌入其他网站的 widget

## Development
1. Install MongoDB and start the MongoDB server (with default configuration)
2. `git clone` this repo to the folder named `mouii`
3. `cd mouii && npm install`
4. `npm install -g nodemon`(optional, to restart backend automatically when the code has changed)
5. `npm start` or `nodemon`(if nodemon is installed)
6. `cd widget && npm install`
7. `npm run dev`

Now, you can access `http://127.0.0.1:8080` to try mouii and develop it.
