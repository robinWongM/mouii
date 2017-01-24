# Mouii

多曰（もういい），一个致力于成为多说的替代品的评论系统。

## Structure

多曰目前的项目结构为：
- 根目录（/）：基于 Express.js & Mongoose 的后端，提供 API 接口与 Dashboard 功能（暂未实现）

- 评论框（/widget/）：基于 Vue.js & Webpack 的前端，作为嵌入其他网站的 widget

## Prerequisites

1. Node.js （推荐 v7.3.0 或以上版本）

2. MongoDB （推荐 v3.2.0 或以上版本）

## Development

1. Install prerequisites with default configuration

2. (For Windows) Add the directory that MongoDB Server binaries are located in to the environment variable `PATH` (e.g. `"C:\Program Files\MongoDB\Server\3.2\bin"`)

3. `git clone` this repo to the folder named `mouii`

4. `cd mouii && npm install`

5. `npm install -g nodemon`(optional, to restart backend automatically when the code has changed)

6. `npm run db` to start MongoDB with mouii's configuration (The server is listening on port 27107 and the data is stored at `./db_data`)

6. `npm start` or `nodemon`(if nodemon is installed)

7. `cd widget && npm install`

8. `npm run dev`

Now, you can access `http://127.0.0.1:8080` to try mouii and develop it.
