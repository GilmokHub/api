import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEvents } from '../../api/events.js'

const statusLabel = { OPEN: 'OPEN', DRAFT: 'DRAFT', CLOSED: 'CLOSED' }
const statusClass = { OPEN: 'open', DRAFT: 'draft', CLOSED: 'closed' }

function toDateStr(ldt) {
  if (!ldt) return ''
  const d = new Date(ldt)
  return d.toISOString().slice(0, 10)
}

export default function EventManagement() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEvents()
      setEvents(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || '목록을 불러오지 못했습니다.')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1 fw-bold">이벤트 및 정책 관리</h1>
        <p className="text-muted mb-0">
          고객사 서비스에서 등록된 이벤트를 확인하고, 각 이벤트의 대기열 정책 및 실시간 모니터링을 설정합니다.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="닫기" />
        </div>
      )}

      <div className="card border rounded-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="h5 fw-semibold mb-1">등록된 이벤트 목록</h2>
              <p className="text-muted small mb-0">이벤트를 선택하여 대기열 정책 설정, 실시간 모니터링, AI 추천을 관리합니다.</p>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={loadEvents}
              disabled={loading}
            >
              새로고침
            </button>
          </div>

          {loading ? (
            <p className="text-muted mb-0 py-3 text-center">불러오는 중...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>이벤트 ID</th>
                    <th>이름</th>
                    <th>상태</th>
                    <th>생성일</th>
                    <th className="text-end" style={{ width: 140 }}>대기열 설정</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-muted text-center py-4">
                        등록된 이벤트가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    events.map((evt) => (
                      <tr key={evt.eventId}>
                        <td className="fw-medium">{evt.eventId}</td>
                        <td>{evt.name}</td>
                        <td>
                          <span className={`badge badge-status ${statusClass[evt.status] || 'draft'}`}>
                            {statusLabel[evt.status] ?? evt.status}
                          </span>
                        </td>
                        <td>{toDateStr(evt.createdAt)}</td>
                        <td className="text-end">
                          <Link
                            to={`/events/${evt.eventId}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            콘솔 상세 →
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
