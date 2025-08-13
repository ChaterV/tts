# --- 第一阶段：构建前端静态文件 ---
FROM node:22 AS builder

WORKDIR /app

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制 pnpm 配置文件
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖
RUN pnpm install

# 复制所有源代码
COPY . .

# 构建生产版本的静态文件
RUN pnpm run build


# --- 第二阶段：最终的静态文件服务镜像 ---
# (这一阶段无需改动，因为它不使用 node 或 pnpm)
FROM nginx:stable-alpine

# 从构建阶段复制出编译好的前端静态文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制我们为前端准备的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]