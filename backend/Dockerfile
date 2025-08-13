# --- 第一阶段：构建阶段 (Builder) ---
FROM node:22 AS builder

WORKDIR /app

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制 pnpm 配置文件
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖 (包括 devDependencies)
RUN pnpm install

# 复制所有源代码
COPY . .

# 执行编译命令
RUN pnpm run build


# --- 第二阶段：生产阶段 (Production) ---
FROM node:18-alpine AS production

WORKDIR /app

# 设置生产环境变量
ENV NODE_ENV=production

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 只从 builder 阶段复制 package.json 和 lockfile
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# 只安装生产环境依赖
RUN pnpm install --prod

# 从 builder 阶段，只把编译好的 dist 文件夹复制过来
COPY --from=builder /app/dist ./dist

# 暴露您的应用端口
EXPOSE 3822

# 使用 pnpm 启动已经编译好的 JavaScript 应用
# (请确保您的 package.json 中有 "start": "node dist/src/server.js" 这样的脚本)
CMD [ "pnpm", "start" ]