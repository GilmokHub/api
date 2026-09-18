import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    const bypassHtml = (req) => {
        if (req.headers.accept?.includes('text/html')) return '/index.html'
    }

    // 길목 대기열 플랫폼 코어 서버 (backend) - 포트 8082
    const queueServerProxy = {
        target: env.VITE_QUEUE_API_URL || 'http://localhost:8082',
        changeOrigin: true,
        bypass: bypassHtml,
    }

    // 고객사 데모 백엔드 (demo-backend) - 포트 8081 (공연 및 이벤트 메타데이터)
    const demoBackendProxy = {
        target: env.VITE_DEMO_API_URL || 'http://localhost:8081',
        changeOrigin: true,
        bypass: bypassHtml,
    }

    return {
        plugins: [react()],
        server: {
            port: 3031,
            proxy: {
                // 1. 길목 대기열 플랫폼 전용 엔드포인트 (:8082)
                '/admin/logs': queueServerProxy,
                '/queue': queueServerProxy,
                '/policy': queueServerProxy,
                '^/admin/events/[^/]+/policy': queueServerProxy,
                '^/admin/events/[^/]+/recommendation': queueServerProxy,

                // 2. 공연 및 좌석 정보 (고객사 백엔드 :8081)
                '/admin/events': demoBackendProxy,

                // 3. 기본 기타 관리자/API 요청
                '/admin': queueServerProxy,
                '/api': queueServerProxy,
            },
        },
    }
})
