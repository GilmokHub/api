import { useState, useEffect, useCallback } from 'react';

/**
 * Gilmok Queue SaaS React Hook
 * @param {string} clientKey - 고객사(Tenant) 식별 키
 * @param {string} queueUrl - 길목 대기열 플랫폼 URL (기본값: https://queue.gilmok.kr)
 */
export function useGilmokQueue(clientKey, queueUrl = 'http://localhost:8082') {
  const [isWaiting, setIsWaiting] = useState(false);
  const [queueStatus, setQueueStatus] = useState(null); // { rank, expectedWaitSeconds, status }
  const [admissionToken, setAdmissionToken] = useState(null);
  
  // 폴링 타이머
  useEffect(() => {
    let intervalId;
    if (isWaiting && !admissionToken) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`${queueUrl}/api/v1/queue/status?clientKey=${clientKey}`, {
            // 이 요청은 쿠키나 Authorization 대신 별도의 식별 방식을 쓰거나,
            // queue 서버 자체의 세션을 사용합니다.
            credentials: 'omit' 
          });
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'ADMITTED') {
              setAdmissionToken(data.token);
              setIsWaiting(false);
            } else {
              setQueueStatus({
                rank: data.rank,
                expectedWaitSeconds: data.expectedWaitSeconds
              });
            }
          }
        } catch (e) {
          console.error("Queue status poll failed", e);
        }
      }, 3000); // 3초마다 폴링
    }
    return () => clearInterval(intervalId);
  }, [isWaiting, admissionToken, clientKey, queueUrl]);

  const enterQueue = useCallback(async (eventId, userId) => {
    try {
      const res = await fetch(`${queueUrl}/api/v1/queue/enter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientKey, eventId, userId })
      });
      if (res.ok) {
        setIsWaiting(true);
      }
    } catch (e) {
      console.error("Failed to enter queue", e);
    }
  }, [clientKey, queueUrl]);

  return { isWaiting, queueStatus, admissionToken, enterQueue };
}
