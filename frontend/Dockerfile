# --- 第一阶段：构建前端静态文件 ---
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# --- 第二阶段：最终的静态文件服务镜像 ---
FROM nginx:stable-alpine

# 从构建阶段复制出编译好的前端静态文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制我们为前端准备的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露容器的 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]