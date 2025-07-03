import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home'; // 必要に応じて
import ReservePage from './components/ReservePage'; // ← 追加
// 他に必要なコンポーネントがあれば import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* トップページ */}
        <Route path="/reserve" element={<ReservePage />} />  {/* 予約フォーム＋一覧ページ */}
        {/* 他のルートもここに追加 */}
      </Routes>
    </Router>
  );
}

export default App;
