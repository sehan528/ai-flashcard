#!/bin/bash

# Vercel에서 자동 배포를 건너뛰기 위한 스크립트
# Exit code 0 = 배포 진행
# Exit code 1 = 배포 건너뛰기

# main 브랜치가 아니면 배포 건너뛰기
if [[ "$VERCEL_GIT_COMMIT_REF" != "main" ]] ; then
  echo "🔄 Not main branch ($VERCEL_GIT_COMMIT_REF). Skipping deployment."
  exit 1
fi

echo "✅ Main branch detected. Proceeding with deployment."
exit 0
