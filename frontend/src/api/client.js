const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'gilmok-admin-secret'

/**
 * 길목 대기열 SaaS 플랫폼 공통 API 클라이언트
 * - JSON 자동 직렬화/역직렬화 및 data 필드 언래핑
 * - B2B 관리자 전용 인증 헤더(X-Platform-Admin-Key) 기본 주입
 */
async function request(path, options = {}) {
    const url = `${API_BASE}${path}`

    const fetchOptions = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-Platform-Admin-Key': ADMIN_KEY,
            ...options.headers,
        },
    }

    const res = await fetch(url, fetchOptions)
    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
        const err = new Error(json.message || res.statusText || '요청 실패')
        err.status = res.status
        err.code = json.code
        throw err
    }

    return json.data !== undefined ? json.data : json
}

export const api = {
    get: (path, headers, opts) => request(path, { method: 'GET', headers, ...opts }),
    post: (path, body, opts) => request(path, {
        method: 'POST',
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...opts,
    }),
    put: (path, body, opts) => request(path, {
        method: 'PUT',
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...opts,
    }),
    delete: (path, opts) => request(path, { method: 'DELETE', ...opts }),
}