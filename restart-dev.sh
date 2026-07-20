#!/usr/bin/env bash
# restart-dev.sh — 重启 Vite 开发服务器，自动清理端口占用
# 用法：
#   ./restart-dev.sh          # 默认端口 7200
#   ./restart-dev.sh 3100     # 指定端口
set -euo pipefail

PORT="${1:-7200}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔍 检查端口 $PORT 占用情况…"
PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"

if [ -n "$PIDS" ]; then
  for PID in $PIDS; do
    CMD="$(ps -p "$PID" -o command= 2>/dev/null || echo 'unknown')"
    echo "⚠️  端口 $PORT 被占用：PID $PID"
    echo "    命令：$CMD"
    case "$CMD" in
      *vite*|*node*|*npm*)
        echo "    → 识别为 Node/Vite 进程，结束中…"
        kill "$PID" 2>/dev/null || true
        ;;
      *)
        echo "    ❌ 非 Node/Vite 进程，为安全起见不自动结束。"
        echo "    请确认后手动处理：kill $PID"
        exit 1
        ;;
    esac
  done

  # 等待端口优雅释放（最多 5 秒）
  for _ in $(seq 1 10); do
    lsof -tiTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1 || break
    sleep 0.5
  done

  # 仍未释放则强制结束
  PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
  if [ -n "$PIDS" ]; then
    echo "⚠️  进程未响应 SIGTERM，强制结束（SIGKILL）…"
    kill -9 $PIDS 2>/dev/null || true
    sleep 0.5
  fi
fi

# 最终确认
if lsof -tiTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "❌ 端口 $PORT 仍被占用，启动中止。"
  exit 1
fi

echo "✅ 端口 $PORT 已空闲"
echo "🚀 启动开发服务器（strictPort：占用即报错，不会静默换端口）…"
cd "$PROJECT_DIR"
exec npm run dev -- --port "$PORT" --strictPort
