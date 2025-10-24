# 后端启动命令
cd /root/home/yuyuan/studyx_human/web/backend
nohup uvicorn app.main:app --reload --host 0.0.0.0 --port 18201 > uvicorn.log 2>&1 &

# 前端启动命令
pm2 restart ai-humanizer-web

# 前端配置访问接口地址
cd /root/home/yuyuan/studyx_human/web/frontend
# 修改配置后
cd /root/home/yuyuan/studyx_human/web/frontend
vim .env.production
pnpm build
pm2 restart ai-humanizer-web --update-env

# 代码更新后
pnpm build
pm2 restart ai-humanizer-web 