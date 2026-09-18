import React from 'react';

export function GilmokWaitingModal({ isWaiting, queueStatus }) {
  if (!isWaiting) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>🚦 Gilmok Queue Guard</h2>
        <p>고객님의 요청을 처리하기 위해 대기열에 진입했습니다.</p>
        <div style={styles.statusBox}>
          <div style={styles.statusItem}>
            <span>내 대기 순서</span>
            <strong>{queueStatus?.rank ?? '--'} 번째</strong>
          </div>
          <div style={styles.statusItem}>
            <span>예상 대기 시간</span>
            <strong>{queueStatus?.expectedWaitSeconds ? `${queueStatus.expectedWaitSeconds}초` : '--'}</strong>
          </div>
        </div>
        <div style={styles.spinner}></div>
        <p style={styles.footer}>창을 닫지 말고 잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
  },
  modal: {
    backgroundColor: '#fff', borderRadius: '12px', padding: '32px',
    width: '400px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  title: { margin: '0 0 16px 0', fontSize: '24px', color: '#333' },
  statusBox: {
    backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '16px',
    marginTop: '24px', marginBottom: '24px'
  },
  statusItem: {
    display: 'flex', justifyContent: 'space-between', marginBottom: '8px',
    fontSize: '18px', color: '#555'
  },
  footer: { color: '#888', fontSize: '14px', marginTop: '16px' }
};
