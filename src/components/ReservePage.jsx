import React from 'react';
import ReserveForm from './ReserveForm';
import ReserveList from './ReserveList';

const ReservePage = () => {
  return (
    <div
      className="reserve-page"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        padding: '2rem',
        alignItems: 'flex-start',
      }}
    >
      {/* 左側：予約フォーム */}
      <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
        <h2>予約入力</h2>
        <ReserveForm />
      </div>

      {/* 右側：予約一覧 */}
      <div style={{ flex: '2 1 600px', minWidth: '300px' }}>
        <h2>予約一覧</h2>
        <ReserveList />
      </div>
    </div>
  );
};

export default ReservePage;
