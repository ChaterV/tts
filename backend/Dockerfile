# 使用一个轻量级的 Node.js 镜像作为基础
FROM node:18-alpine

# 在容器内设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 以便缓存依赖
COPY package*.json ./

# 安装生产环境依赖
RUN npm ci --only=production

# 复制所有项目文件
COPY . .

# 编译 TypeScript 代码
RUN npm run build

# 容器启动时运行的命令
CMD [ "npm", "start" ]