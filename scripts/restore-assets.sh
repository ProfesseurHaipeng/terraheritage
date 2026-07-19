#!/usr/bin/env bash
# restore-assets.sh — 还原仓库中的二进制资产。
#
# 本仓库的二进制文件(图片/贴图等)以 base64 文本形式存放在 assets-b64/ 目录下,
# 路径与原文件一一对应,仅多了 .b64 后缀。克隆仓库后运行本脚本即可把原始二进制
# 文件还原到对应位置:
#
#   bash scripts/restore-assets.sh
#
# 依赖:openssl、tr、cat(macOS 与 Linux 均自带)。
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ ! -d assets-b64 ]; then
  echo "未找到 assets-b64/ 目录,无需还原。" >&2
  exit 1
fi

decode_one() {
  # $1 = 去掉 assets-b64/ 前缀与 .b64 后缀后的目标相对路径
  # $2.. = 依次拼接的 base64 文本文件
  local target="$1"; shift
  mkdir -p "$(dirname "$target")"
  cat "$@" | tr -d '\r\n' | openssl base64 -d -A > "$target"
  echo "已还原: $target"
}

count=0

# 1) 普通单文件:assets-b64/**/*.b64
while IFS= read -r -d '' f; do
  rel="${f#assets-b64/}"
  target="${rel%.b64}"
  decode_one "$target" "$f"
  count=$((count + 1))
done < <(find assets-b64 -type f -name '*.b64' -print0 | sort -z)

# 2) 分片文件:assets-b64/**/*.b64.part-*(按字典序拼接)
if find assets-b64 -type f -name '*.b64.part-*' -print -quit | grep -q .; then
  for base in $(find assets-b64 -type f -name '*.b64.part-*' | sed 's/\.part-[^.]*$//' | sort -u); do
    rel="${base#assets-b64/}"
    target="${rel%.b64}"
    # shellcheck disable=SC2046
    decode_one "$target" $(ls "$base".part-* | sort)
    count=$((count + 1))
  done
fi

echo "完成:共还原 $count 个二进制资产。"
