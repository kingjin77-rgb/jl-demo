/* ══════════════════════════════════════════════════════════════
   입주예정자협의회 플랫폼 — v2
   단지별 설정은 config.js 에만 있습니다. 이 파일은 공통입니다.
   ══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var C  = window.CONFIG;
var KEY = 'jl2_' + (C.repo || 'demo');

/* ───────── 저장소 ───────── */
var DB = {
  load: function () {
    try { var v = localStorage.getItem(KEY); if (v) return JSON.parse(v); } catch (e) {}
    return null;
  },
  save: function () {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  },
  wipe: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
};

/* ───────── 상태 ───────── */
var S = null;

function seed() {
  var recs = [];
  var names = ['김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권','황','안','송','전','홍'];

  /* 동별 전체 호수 목록을 만든 뒤 그 중 일부를 무작위로 접수 처리 */
  C.dongs.forEach(function (row) {
    var d = row[0], n = row[1];
    var lines = 4;                                   // 한 층 4세대 기준
    var floors = Math.max(1, Math.ceil(n / lines));
    var units = [], f, l;
    for (f = 1; f <= floors && units.length < n; f++) {
      for (l = 1; l <= lines && units.length < n; l++) {
        units.push(String(f) + '0' + l);
      }
    }
    /* 셔플 후 앞에서 k개만 사용 */
    for (var i = units.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = units[i]; units[i] = units[j]; units[j] = t;
    }
    var k = Math.round(n * (0.58 + Math.random() * 0.32));
    units.slice(0, k).forEach(function (ho) {
      var jt = Math.random() < 0.34;
      recs.push({
        dong: d, ho: ho,
        name: names[Math.floor(Math.random() * names.length)] + '○○',
        joint: jt,
        name2: jt ? names[Math.floor(Math.random() * names.length)] + '○○' : null,
        at: Date.now() - Math.floor(Math.random() * 26) * 86400000
      });
    });
  });

  recs.sort(function (a, b) { return b.at - a.at; });

  /* 회비 납부 — 위임장 접수 세대 중 약 70% */
  var fees = {};
  recs.forEach(function (r) {
    if (Math.random() < 0.7) fees[r.dong + '-' + r.ho] = { at: r.at + 86400000, amt: 20000 };
  });

  return {
    recs: recs,
    votes: [
      { id:'v1', q:'단지 공식 명칭을 무엇으로 할까요?', end:'2026-10-05', mine:null,
        opts:[{t:'OO아파트', v:412},{t:'OO 센트럴파크', v:288},{t:'OO 더퍼스트', v:151}] },
      { id:'v2', q:'커뮤니티 시설 중 우선 요청 항목은?', end:'2026-10-12', mine:null,
        opts:[{t:'실내 골프연습장', v:301},{t:'키즈카페·돌봄센터', v:377},{t:'피트니스 확장', v:164}] }
    ],
    notices: [
      { t:'제1차 정기총회 개최 안내', k:'중요', d:'2026-09-12',
        s:'10월 4일(토) 오후 2시, ○○구민회관 대강당에서 제1차 정기총회를 개최합니다. 위임장을 제출하신 세대는 별도 참석 없이도 의결권이 행사됩니다.' },
      { t:'시공사 현장 실사 결과 공유', k:'공지', d:'2026-09-08',
        s:'9월 5일 임원진 6인이 현장을 방문하여 지하주차장 골조 상태를 확인하였습니다. 세부 사진은 현장 사진 메뉴에 올렸습니다.' },
      { t:'위임장 미제출 세대 안내문 부착', k:'안내', d:'2026-09-02',
        s:'각 동 엘리베이터에 QR 안내문을 부착하였습니다. 아직 제출하지 않으신 세대는 QR로 1분 내 접수 가능합니다.' },
      { t:'협의회 계좌 개설 완료', k:'공지', d:'2026-08-21',
        s:'○○은행 협의회 명의 계좌 개설이 완료되었습니다. 회비 입금 내역은 회비 메뉴에서 전 세대가 확인하실 수 있습니다.' }
    ],
    timeline: [
      { d:'2026-07-15', t:'입주예정자협의회 발족', s:'발기인 12인, 창립총회 개최', st:'past' },
      { d:'2026-08-02', t:'법무법인 자문 계약 체결', s:'법률 자문 및 플랫폼 운영 지원', st:'past' },
      { d:'2026-08-20', t:'전자 위임장 접수 개시', s:'QR 기반 모바일 접수 시작', st:'past' },
      { d:'2026-10-04', t:'제1차 정기총회', s:'임원 선출 · 사업계획 의결', st:'now' },
      { d:'2026-12-00', t:'사전점검 대응 준비', s:'하자 체크리스트 배포 예정', st:'next' },
      { d:'2027-03-00', t:'입주 및 협의회 이관', s:'입주자대표회의 구성 지원', st:'next' }
    ],
    org: [
      { r:'회장',   n:'김○○', d:'103동', c:'총괄 · 대외 협의' },
      { r:'부회장', n:'이○○', d:'107동', c:'회의 운영 · 총회 준비' },
      { r:'총무',   n:'박○○', d:'101동', c:'회계 · 회비 관리' },
      { r:'감사',   n:'최○○', d:'105동', c:'지출 감사' },
      { r:'홍보이사', n:'정○○', d:'108동', c:'공지 · 플랫폼 운영' },
      { r:'법률자문', n:'법무법인 제이엘', d:'—', c:'계약 검토 · 분쟁 대응' }
    ],
    budget: [
      { d:'2026-09-12', t:'현수막 제작 · 게시', a: -420000, type:'out', rc:true, st:'대기' },
      { d:'2026-09-10', t:'회비 납부 (9월분 48세대)', a:  960000, type:'in'  },
      { d:'2026-09-05', t:'총회 장소 대관료',          a: -350000, type:'out', rc:true, st:'승인' },
      { d:'2026-08-28', t:'회비 납부 (8월분 121세대)',  a: 2420000, type:'in'  },
      { d:'2026-08-22', t:'안내문 인쇄 · 부착',        a: -186000, type:'out', rc:true, st:'승인' },
      { d:'2026-08-12', t:'법률 자문료',              a: -550000, type:'out', rc:true, st:'승인' },
      { d:'2026-08-01', t:'회비 납부 (초기 발기인)',    a: 1200000, type:'in'  }
    ],
    gallery: [
      { e:'🏗️', t:'지하 2층 골조', s:'2026.09.05 · 임원진 현장 실사' },
      { e:'🚧', t:'지상 12층 진행', s:'2026.09.05 · 타워크레인 2기 가동' },
      { e:'🅿️', t:'지하주차장 슬래브', s:'2026.08.28 · 누수 여부 확인' },
      { e:'📐', t:'견본주택 내부', s:'2026.08.14 · 마감재 확인' },
      { e:'🌳', t:'단지 조경 예정지', s:'2026.08.14 · 배치도 대조' },
      { e:'🧱', t:'외벽 조적 시작', s:'2026.07.30' }
    ],
    posts: [
      { id:'p1', cat:'질문', t:'사전점검 때 뭘 준비해 가야 하나요?',
        b:'다음 달 사전점검인데 처음이라 뭘 봐야 할지 모르겠습니다.\n선배님들 조언 부탁드립니다. 줄자랑 포스트잇은 챙기려고요.',
        n:'103동 주민', at:Date.now()-3*3600000, v:284, like:12,
        c:[{n:'107동 주민', b:'손전등 꼭 챙기세요. 몰딩 틈이랑 도배 들뜸은 어두우면 안 보입니다.', at:Date.now()-2.4*3600000},
           {n:'익명', b:'수평계 앱 깔아가시면 문틀 기울기 바로 확인됩니다.', at:Date.now()-1.7*3600000},
           {n:'총무', b:'협의회에서 체크리스트 배포 예정입니다. 공지 확인해 주세요.', at:Date.now()-40*60000}] },
      { id:'p2', cat:'정보', t:'커뮤니티 시설 관련 시행사 답변 정리',
        b:'지난주 시행사 면담 내용 공유드립니다.\n\n1. 실내 골프연습장 — 설계 변경 검토 중\n2. 어린이집 — 원안 유지\n3. 피트니스 — 면적 확대 불가 회신\n\n자세한 내용은 총회에서 보고드리겠습니다.',
        n:'부회장', at:Date.now()-26*3600000, v:612, like:47,
        c:[{n:'101동 주민', b:'정리 감사합니다. 골프연습장은 계속 요청해야 할 것 같네요.', at:Date.now()-20*3600000}] },
      { id:'p3', cat:'자유', t:'입주 전에 인터넷 미리 신청하신 분 계신가요',
        b:'통신사 사전 가입 혜택이 있다고 해서 문의드립니다. 입주지정기간 전에 신청해도 되는지 아시는 분?',
        n:'익명', at:Date.now()-2*86400000, v:197, like:5,
        c:[{n:'105동 주민', b:'입주 2개월 전부터 가능하다고 들었습니다.', at:Date.now()-1.7*86400000}] },
      { id:'p4', cat:'질문', t:'발코니 확장 옵션 안 하신 분 계신가요?',
        b:'확장을 안 하면 나중에 개별 시공이 어렵다고 하던데 사실인가요?',
        n:'익명', at:Date.now()-4*86400000, v:341, like:8, c:[] },
      { id:'p5', cat:'정보', t:'단지 앞 버스 노선 신설 민원 결과',
        b:'시청에 접수한 민원 회신이 왔습니다. 입주 시점에 맞춰 노선 조정을 검토하겠다는 원론적 답변입니다.\n지속적으로 요청이 필요해 보입니다.',
        n:'홍보이사', at:Date.now()-6*86400000, v:508, like:31, c:[] }
    ],
    fees: fees,
    assembly: {
      no:'제1차 정기총회', date:'2026-10-04', time:'오후 2시',
      place:'○○구민회관 대강당', noticedAt:'2026-09-12',
      agenda:[
        { t:'제1호 의안 — 협의회 규약 제정(안)', s:'재적 과반 찬성', y:0, n:0 },
        { t:'제2호 의안 — 2026년 사업계획 및 예산(안)', s:'출석 과반 찬성', y:0, n:0 },
        { t:'제3호 의안 — 시행사 협의 대표단 구성(안)', s:'출석 과반 찬성', y:0, n:0 }
      ],
      attend:{}, myPick:null
    },
    election: {
      pos:'회장', end:'2026-10-04', myVote:null,
      cands:[
        { id:'c1', n:'김○○', d:'103동 1502호', j:'IT기업 20년 · 前 자치회 총무',
          p:'1. 시행사 협의 창구 일원화\n2. 회계 전액 공개 및 영수증 첨부 의무화\n3. 사전점검 전문업체 공동 계약 추진', v:218 },
        { id:'c2', n:'이○○', d:'107동 903호', j:'건축시공기술사 · 現 감리업 종사',
          p:'1. 시공 품질 상시 점검단 운영\n2. 마감재 변경 이력 전수 확인\n3. 하자 데이터 축적 후 일괄 대응', v:271 },
        { id:'c3', n:'박○○', d:'101동 2104호', j:'세무사 · 회계 실무 15년',
          p:'1. 회비 사용 내역 월별 공시\n2. 지출 사전 승인제 도입\n3. 협의회 해산 시 잔여금 세대 환급 규정 마련', v:164 }
      ]
    },
    risks: [
      { lv:'high', c:'제23조 (입주지정기간)', t:'입주지정기간 경과 시 미입주라도 관리비 부과',
        b:'입주 지연 사유가 시공사에 있더라도 입주지정기간이 지나면 관리비가 부과되는 구조입니다.',
        jl:'준공 지연·하자로 인한 입주 불능 기간은 제외한다는 단서 조항 삽입을 요구해야 합니다. 협의회 명의 공문으로 요청하고 회신을 문서로 남기십시오.' },
      { lv:'high', c:'제31조 (마감재)', t:'동등 이상 자재로 변경 가능 — 사전 통지 의무 없음',
        b:'"동등 이상"의 판단 주체가 시공사이며, 변경 시 입주민에게 알릴 의무가 없습니다.',
        jl:'분양 카탈로그·견본주택 사진을 지금 전부 확보해 자료실에 보관하십시오. 변경 사실을 나중에 입증하는 유일한 수단입니다.' },
      { lv:'mid', c:'제18조 (중도금 대출)', t:'금리 인상분은 전액 계약자 부담',
        b:'집단대출 금리가 오르면 계약자가 전부 부담하며 시행사는 책임지지 않습니다.',
        jl:'취급 은행 변경 협상은 협의회 단위로 하는 것이 유리합니다. 개별 교섭은 사실상 불가능합니다.' },
      { lv:'mid', c:'제27조 (하자담보책임)', t:'하자 보수 청구 창구를 시공사 단일화',
        b:'협의회를 통한 집단 청구 경로가 명시되어 있지 않습니다.',
        jl:'세대별 개별 접수는 유지하되, 동일 하자 집계는 협의회가 별도로 축적해야 협상력이 생깁니다.' },
      { lv:'low', c:'제9조 (전매제한)', t:'전매제한 기간 중 명의변경 제한',
        b:'법령상 기준과 동일하며 특별히 불리한 조항은 아닙니다.',
        jl:'다만 명의변경 시 협의회 위임장이 실효되므로 신고 절차를 반드시 거치셔야 합니다.' }
    ],
    asks: [],
    transfers: [],
    docs: [
      { cat:'공문', t:'시행사 앞 커뮤니티시설 개선 요청 공문', d:'2026-09-10', sz:'1.2MB', k:'PDF' },
      { cat:'공문', t:'시공사 회신 — 마감재 변경 관련', d:'2026-09-03', sz:'860KB', k:'PDF' },
      { cat:'계약', t:'입주자모집공고문 전문', d:'2026-06-14', sz:'4.8MB', k:'PDF' },
      { cat:'계약', t:'분양계약서 표준양식', d:'2026-06-14', sz:'2.1MB', k:'PDF' },
      { cat:'회의록', t:'제3차 임원회의 회의록', d:'2026-09-08', sz:'420KB', k:'HWP' },
      { cat:'회의록', t:'창립총회 회의록', d:'2026-07-15', sz:'510KB', k:'HWP' },
      { cat:'카탈로그', t:'견본주택 마감재 사양서', d:'2026-06-20', sz:'12.4MB', k:'PDF' },
      { cat:'카탈로그', t:'견본주택 내부 촬영본', d:'2026-06-20', sz:'38.2MB', k:'ZIP' }
    ],
    says: [
      { id:'s1', tag:'궁금', n:'104동 주민', anon:false, b:'사전점검 날짜 확정됐나요? 연차 써야 해서요', at:Date.now()-18*60000, l:7,
        r:[{n:'총무', b:'다음 주 공고 예정입니다', at:Date.now()-9*60000}] },
      { id:'s2', tag:'정보', n:'익명', anon:true, b:'오늘 현장 지나가는데 타워크레인 한 대 더 들어왔더라구요', at:Date.now()-52*60000, l:23, r:[] },
      { id:'s3', tag:'응원', n:'107동 주민', anon:false, b:'임원분들 고생 많으십니다. 위임장 오늘 냈습니다!', at:Date.now()-2.4*3600000, l:41, r:[] },
      { id:'s4', tag:'궁금', n:'익명', anon:true, b:'회비 계좌 어디였죠? 놓쳤습니다', at:Date.now()-4*3600000, l:3,
        r:[{n:'101동 주민', b:'회비 메뉴에서 우리집 확인 누르면 계좌 나옵니다', at:Date.now()-3.6*3600000},
           {n:'익명', b:'감사합니다', at:Date.now()-3.2*3600000}] },
      { id:'s5', tag:'정보', n:'부회장', anon:false, b:'시행사 면담 다녀왔습니다. 자세한 내용은 게시판에 올렸어요', at:Date.now()-7*3600000, l:35, r:[] },
      { id:'s6', tag:'궁금', n:'105동 주민', anon:false, b:'총회 위임하면 따로 안 가도 되는 거 맞죠?', at:Date.now()-11*3600000, l:9,
        r:[{n:'총무', b:'네 맞습니다. 위임장 제출하시면 의결권이 행사됩니다', at:Date.now()-10.5*3600000}] },
      { id:'s7', tag:'응원', n:'익명', anon:true, b:'단톡방보다 여기가 훨씬 편하네요', at:Date.now()-26*3600000, l:52, r:[] },
      { id:'s8', tag:'정보', n:'103동 주민', anon:false, b:'단지 앞 버스 노선 민원 저도 넣었습니다. 다들 한 번씩 부탁드려요', at:Date.now()-2*86400000, l:64, r:[] }
    ],
    sayLikes: {},
    atLog: [],
    likes: {},
    pin: false
  };
}

/* ───────── 유틸 ───────── */
function $(id) { return document.getElementById(id); }
function el(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
  });
}
function won(n) {
  return (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('ko-KR') + '원';
}
function ago(ts) {
  var m = Math.floor((Date.now() - ts) / 60000);
  if (m < 60) return m + '분 전';
  if (m < 1440) return Math.floor(m / 60) + '시간 전';
  return Math.floor(m / 1440) + '일 전';
}
var TOTAL = C.dongs.reduce(function (a, r) { return a + r[1]; }, 0) || C.totalUnits;

/* ══════════════════════════════════════════════════════════════
   App
   ══════════════════════════════════════════════════════════════ */
var TABS = [
  { id:'home',     ic:'🏠', t:'홈' },
  { id:'delegate', ic:'✍️', t:'위임장' },
  { id:'say',      ic:'💬', t:'한마디' },
  { id:'assembly', ic:'⚖️', t:'총회' },
  { id:'more',     ic:'⋯',  t:'더보기' }
];
var TITLES = {
  home:'홈', delegate:'위임장 제출', vote:'투표 · 설문', notice:'소식',
  apt:'단지 개요', org:'임원진', budget:'회비 · 지출', gallery:'현장 사진',
  board:'게시판', say:'입주민 한마디', check:'내 접수 확인', admin:'관리자',
  assembly:'총회', election:'임원 선거', legal:'계약 분석 · 법률상담',
  docs:'자료실', transfer:'명의변경 신고'
};
var DESK = [
  { id:'home',     t:'홈' },
  { id:'delegate', t:'위임장' },
  { id:'say',      t:'한마디' },
  { id:'board',    t:'게시판' },
  { id:'assembly', t:'총회' },
  { id:'election', t:'임원 선거' },
  { id:'legal',    t:'계약 분석' },
  { id:'budget',   t:'회비' },
  { id:'docs',     t:'자료실' },
  { id:'notice',   t:'소식' }
];
var MORE = [
  { id:'board',    ic:'📝', t:'게시판' },
  { id:'vote',     ic:'🗳️', t:'투표·설문' },
  { id:'election', ic:'🗂️', t:'임원 선거' },
  { id:'legal',    ic:'⚠️', t:'계약 분석' },
  { id:'budget',   ic:'💰', t:'회비·지출' },
  { id:'docs',     ic:'📁', t:'자료실' },
  { id:'notice',   ic:'📢', t:'소식·일정' },
  { id:'apt',      ic:'🏗️', t:'단지 개요' },
  { id:'org',      ic:'👥', t:'임원진' },
  { id:'gallery',  ic:'📸', t:'현장 사진' },
  { id:'check',    ic:'🔎', t:'내 접수 확인' },
  { id:'transfer', ic:'🔁', t:'명의변경 신고' },
  { id:'admin',    ic:'⚙️', t:'관리자' }
];

var App = {
  cur: 'home',

  init: function () {
    S = DB.load();
    if (!S || !S.recs || !S.posts) { S = seed(); DB.save(); }

    /* 단지 고유색 — config.theme 가 있으면 악센트/헤더색만 교체합니다 */
    if (C.theme) {
      var r = document.documentElement.style;
      if (C.theme.acc)  r.setProperty('--acc',   C.theme.acc);
      if (C.theme.acc2) r.setProperty('--acc-2', C.theme.acc2);
      if (C.theme.ink)  r.setProperty('--ink',   C.theme.ink);
      if (C.theme.ink2) r.setProperty('--ink-2', C.theme.ink2);
      if (C.theme.glow) {
        var st = document.createElement('style');
        st.textContent = '.hero::before{background:radial-gradient(circle,' +
          C.theme.glow + ',transparent 68%)!important}';
        document.head.appendChild(st);
      }
      var g = document.querySelector('#gr stop:first-child');
      if (g && C.theme.acc) g.setAttribute('stop-color', C.theme.acc);
    }

    if (C.heroLight !== false) document.querySelector('.hero').classList.add('light');
    document.title = C.org;
    $('emblem').textContent = C.emblem;
    $('heroName').textContent = C.apt;
    $('heroLoc').textContent = C.address;
    $('barSub').textContent = C.org;
    $('agreeTx').textContent = C.agree;
    $('footEm').textContent = C.emblem;
    $('footOrg').textContent = C.org;
    $('footAddr').innerHTML = esc(C.apt) + ' · ' + esc(C.address) +
      '<br>시공 ' + esc(C.builder) + ' · 입주 ' + esc(C.moveIn);
    if (!C.demo) $('demoFlag').hidden = true;

    this.buildTabs();
    this.paintHome();
    this.paintNotice();
    this.paintVote();
    this.paintApt();
    this.paintOrg();
    this.paintGallery();
    Deleg.init();
    Check.init();
    Board.init();
    Say.init();
    Fee.init();
    Transfer.init();
    Assembly.paint();
    Election.paint();
    Legal.paint();
    Docs.init();
    Fee.paint();

    var t = (location.hash || '').replace('#', '');
    this.go(TITLES[t] ? t : 'home');

    window.addEventListener('resize', function () { App.setBarTitle(); });
    window.addEventListener('scroll', function () {
      $('appbar').classList.toggle('stuck', window.scrollY > 6);
    }, { passive:true });

    try {
      var th = localStorage.getItem('jl2_theme');
      if (th) document.documentElement.setAttribute('data-theme', th);
    } catch (e) {}
    $('netDot').classList.toggle('off', !!C.demo);
  },

  /* PC 에서는 상단 브랜드에 단지명을, 모바일에서는 현재 화면 이름을 보여준다 */
  setBarTitle: function () {
    var wide = window.matchMedia('(min-width:960px)').matches;
    $('barTitle').textContent = wide ? C.apt : (TITLES[this.cur] || '');
  },

  buildTabs: function () {
    var bar = $('tabbar'); bar.innerHTML = '';
    TABS.forEach(function (t) {
      var b = el('button', 'tab', '<span class="ti">' + t.ic + '</span><span>' + t.t + '</span>');
      b.id = 'tab-' + t.id;
      b.onclick = function () { t.id === 'more' ? App.openSheet('more') : App.go(t.id); };
      bar.appendChild(b);
    });

    var dn = $('deskNav'); dn.innerHTML = '';
    DESK.forEach(function (t) {
      var a = el('button', 'dn', t.t);
      a.id = 'dn-' + t.id;
      a.onclick = function () { App.go(t.id); };
      dn.appendChild(a);
    });
  },

  go: function (id) {
    this.closeSheet();
    var p = $('p-' + id);
    if (!p) return;
    Array.prototype.forEach.call(document.querySelectorAll('.page'), function (x) {
      x.classList.remove('on');
    });
    p.classList.add('on');
    this.cur = id;
    this.setBarTitle();
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (x) {
      x.classList.remove('on');
    });
    var tb = $('tab-' + id) || (MORE.some(function (m) { return m.id === id; }) ? $('tab-more') : null);
    if (tb) tb.classList.add('on');
    Array.prototype.forEach.call(document.querySelectorAll('.dn'), function (x) {
      x.classList.remove('on');
    });
    var dnb = $('dn-' + id);
    if (dnb) dnb.classList.add('on');
    location.hash = id;
    window.scrollTo(0, 0);
    if (id === 'admin' && S.pin) Admin.paint();
    if (id === 'board') Board.back();
    if (id === 'say') Say.init();
    if (id === 'assembly') Assembly.paint();
    if (id === 'election') Election.paint();
    if (id === 'budget') Fee.paint();
  },

  /* ── 홈 ── */
  paintHome: function () {
    var done = S.recs.length;
    var pct  = Math.round(done / TOTAL * 100);

    $('fDone').innerHTML  = done.toLocaleString() + '<em>세대</em>';
    $('fLeft').innerHTML  = (TOTAL - done).toLocaleString() + '<em>세대</em>';
    $('fTotal').innerHTML = TOTAL.toLocaleString() + '<em>세대</em>';

    setTimeout(function () {
      $('ringBar').style.strokeDashoffset = String(282.7 * (1 - pct / 100));
    }, 120);
    var n = 0, tick = setInterval(function () {
      n += Math.max(1, Math.round(pct / 26));
      if (n >= pct) { n = pct; clearInterval(tick); }
      $('ringPct').textContent = n + '%';
    }, 32);

    this.paintQuorum(done, pct);

    /* 지금 하실 일 */
    var box = $('todoBox'); box.innerHTML = '';
    var mine = Deleg.mine();
    box.appendChild(this.actCard(
      mine ? '✓' : '✍️',
      mine ? '위임장 접수 완료' : '위임장 제출하기',
      mine ? mine.dong + '동 ' + mine.ho + '호 · ' + ago(mine.at) + ' 접수되었습니다'
           : '동·호수 선택 후 서명까지 약 1분이면 끝납니다',
      mine ? 'done' : '', 'delegate', mine ? null : ['b', '필수']
    ));
    var open = S.votes.filter(function (v) { return v.mine === null; }).length;
    box.appendChild(this.actCard('🗳️',
      open ? '진행중인 투표 ' + open + '건' : '투표 참여 완료',
      open ? '안건에 의견을 남겨주세요' : '진행중인 안건에 모두 참여하셨습니다',
      open ? '' : 'done', 'vote', open ? ['o', 'D-' + 19] : null));
    box.appendChild(this.actCard('💬', '입주민 한마디',
      S.says[0].b.slice(0, 30) + (S.says[0].b.length > 30 ? '…' : ''), '', 'say', null));
    box.appendChild(this.actCard('📢', '공지사항 확인',
      S.notices[0].t, '', 'notice', null));

    /* 동별 히트맵 */
    var heat = $('heatBox'); heat.innerHTML = '';
    C.dongs.forEach(function (row) {
      var d = row[0], tot = row[1];
      var k = S.recs.filter(function (r) { return r.dong === d; }).length;
      var p = Math.round(k / tot * 100);
      var c = el('div', 'hcell' + (p >= 80 ? ' hi' : p < 60 ? ' lo' : ''),
        '<div class="fill" style="height:0"></div>' +
        '<div class="d">' + esc(d) + '동</div>' +
        '<div class="p num">' + p + '%</div>' +
        '<div class="n num">' + k + '/' + tot + '</div>');
      heat.appendChild(c);
      setTimeout(function () { c.querySelector('.fill').style.height = p + '%'; }, 200);
    });

    /* 공정률 */
    $('progPct').textContent = C.progress + '%';
    $('progNote').textContent = C.progressNote;
    setTimeout(function () { $('progBar').style.width = C.progress + '%'; }, 250);

    /* 게시판 인기글 */
    var hb = $('homeBoard'); hb.innerHTML = '';
    S.posts.slice().sort(function (a, b) {
      return (b.like * 3 + b.c.length * 5 + b.v / 40) - (a.like * 3 + a.c.length * 5 + a.v / 40);
    }).slice(0, 3).forEach(function (p) {
      var b = el('button', 'row');
      b.innerHTML =
        '<div class="tick">💬</div>' +
        '<div class="rl"><div class="rt" style="font-size:.9rem">' + esc(p.t) + '</div>' +
        '<div class="rm"><span class="pill n">' + esc(p.cat) + '</span>' +
        '<span>댓글 ' + p.c.length + '</span><span>공감 ' + p.like + '</span></div></div>';
      b.onclick = function () { App.go('board'); setTimeout(function () { Board.open(p.id); }, 60); };
      hb.appendChild(b);
    });

    /* 최근 소식 */
    var hn = $('homeNotice'); hn.innerHTML = '';
    S.notices.slice(0, 3).forEach(function (n2) {
      hn.appendChild(App.noticeRow(n2, true));
    });
  },

  /* ── 총회 의결 정족수 ── */
  paintQuorum: function (done, pct) {
    var need = C.quorum || 50;
    var needUnits = Math.ceil(TOTAL * need / 100);
    var ok = done >= needUnits;
    var conv = C.type === 'conversion';

    $('qState').textContent = ok
      ? '충족 — 총회 의결이 가능합니다'
      : '미충족 — ' + (needUnits - done).toLocaleString() + '세대 더 필요합니다';
    var bd = $('qBadge');
    bd.textContent = ok ? '충족' : '미충족';
    bd.classList.toggle('no', !ok);
    $('qMark').style.left = need + '%';
    $('qMarkLb').textContent = (need === 50 ? '과반 ' : '') + need + '%';
    $('qMarkLb').style.transform = need > 70 ? 'translateX(-90%)' : 'translateX(-50%)';
    document.querySelector('.q-track').classList.toggle('ok', ok);
    setTimeout(function () { $('qFill').style.width = Math.min(100, pct) + '%'; }, 320);

    $('qFoot').innerHTML =
      '재적 ' + TOTAL.toLocaleString() + '세대 · 위임 접수 <b>' + done.toLocaleString() + '세대(' + pct + '%)</b><br>' +
      (conv
        ? '분양전환 협의 및 감정평가 대응 권한 위임 기준 ' + need + '%'
        : '총회 의결정족수 기준 ' + need + '% (' + needUnits.toLocaleString() + '세대)');
  },

  actCard: function (ic, tt, ds, cls, target, pill) {
    var b = el('button', 'act ' + (cls || ''));
    b.innerHTML =
      '<div class="ic">' + ic + '</div>' +
      '<div class="tx"><div class="tt">' + esc(tt) +
        (pill ? '<span class="pill ' + pill[0] + '">' + esc(pill[1]) + '</span>' : '') +
      '</div><div class="ds">' + esc(ds) + '</div></div>' +
      '<div class="ar">›</div>';
    b.onclick = function () { App.go(target); };
    return b;
  },

  noticeRow: function (n, compact) {
    var k = n.k === '중요' ? 'b' : n.k === '안내' ? 'o' : 'n';
    var b = el('button', 'row');
    b.innerHTML =
      '<div class="tick">' + (n.k === '중요' ? '❗' : '📄') + '</div>' +
      '<div class="rl"><div class="rt">' + esc(n.t) + '</div>' +
      (compact ? '' : '<div class="rd">' + esc(n.s) + '</div>') +
      '<div class="rm"><span class="pill ' + k + '">' + esc(n.k) + '</span><span>' + esc(n.d) + '</span></div></div>';
    b.onclick = function () {
      App.sheet(n.t, '<div style="font-size:.88rem;color:var(--tx-2);line-height:1.75">' +
        esc(n.s) + '</div><div style="font-size:.76rem;color:var(--tx-3);margin-top:16px">' +
        esc(n.d) + ' · ' + esc(C.org) + '</div>');
    };
    return b;
  },

  paintNotice: function () {
    var b = $('noticeBox'); b.innerHTML = '';
    S.notices.forEach(function (n) { b.appendChild(App.noticeRow(n)); });

    var t = $('tlBox'); t.innerHTML = '';
    S.timeline.forEach(function (x) {
      t.appendChild(el('div', 'tl-i ' + x.st,
        '<div class="tl-d">' + esc(x.d) + '</div>' +
        '<div class="tl-t">' + esc(x.t) + '</div>' +
        '<div class="tl-s">' + esc(x.s) + '</div>'));
    });
  },

  paintVote: function () {
    var box = $('voteBox'); box.innerHTML = '';
    S.votes.forEach(function (v) {
      var tot = v.opts.reduce(function (a, o) { return a + o.v; }, 0);
      var sec = el('div', 'sec');
      sec.style.marginTop = '6px';
      var h = el('div', 'sec-h',
        '<h2 class="sec-t">' + esc(v.q) + '</h2>' +
        '<span class="pill ' + (v.mine === null ? 'b' : 'g') + '">' +
        (v.mine === null ? '참여 전' : '참여 완료') + '</span>');
      sec.appendChild(h);
      sec.appendChild(el('p', 'sec-d', '마감 ' + esc(v.end) + ' · 현재 ' +
        tot.toLocaleString() + '세대 참여'));
      var wrap = el('div');
      v.opts.forEach(function (o, i) {
        var p = tot ? Math.round(o.v / tot * 100) : 0;
        var b = el('button', 'opt' + (v.mine === i ? ' mine' : ''),
          '<div class="fill" style="width:0"></div>' +
          '<div class="in"><span class="ot">' + esc(o.t) + '</span>' +
          '<span class="ov num">' + p + '%</span></div>');
        b.onclick = function () { App.vote(v, i); };
        wrap.appendChild(b);
        setTimeout(function () { b.querySelector('.fill').style.width = p + '%'; }, 220);
      });
      sec.appendChild(wrap);
      box.appendChild(sec);
    });
  },

  vote: function (v, i) {
    if (v.mine !== null) {
      if (v.mine === i) { App.toast('이미 이 항목에 투표하셨습니다'); return; }
      v.opts[v.mine].v--;
    }
    v.opts[i].v++;
    v.mine = i;
    DB.save();
    this.paintVote();
    this.paintHome();
    this.toast('투표가 반영되었습니다');
  },

  paintApt: function () {
    var rows = [
      ['단지명', C.apt], ['소재지', C.address], ['총 세대수', TOTAL.toLocaleString() + '세대'],
      ['동 수', C.dongs.length + '개동'], ['시공사', C.builder], ['시행사', C.owner],
      ['입주 예정', C.moveIn]
    ];
    var b = $('aptBox'); b.innerHTML = '';
    rows.forEach(function (r) {
      b.appendChild(el('div', 'row',
        '<div class="rl"><div class="rd" style="margin:0">' + esc(r[0]) + '</div></div>' +
        '<div class="rr" style="color:var(--tx);font-weight:700;font-size:.9rem">' + esc(r[1]) + '</div>'));
    });

    var t = $('typeBox'); t.innerHTML = '';
    C.types.forEach(function (x) {
      var p = Math.round(x.u / TOTAL * 100);
      var w = el('div');
      w.style.marginBottom = '14px';
      w.innerHTML =
        '<div style="display:flex;justify-content:space-between;font-size:.87rem;font-weight:700;margin-bottom:6px">' +
        '<span>' + esc(x.t) + '</span><span class="num" style="color:var(--tx-2);font-weight:600">' +
        x.u + '세대 · ' + p + '%</span></div>' +
        '<div class="bar"><i style="width:' + p + '%"></i></div>';
      t.appendChild(w);
    });
  },

  paintOrg: function () {
    var b = $('orgBox'); b.innerHTML = '';
    S.org.forEach(function (o) {
      b.appendChild(el('div', 'row',
        '<div class="tick">' + esc(o.n.charAt(0)) + '</div>' +
        '<div class="rl"><div class="rt">' + esc(o.n) +
        '<span class="pill n" style="margin-left:7px">' + esc(o.r) + '</span></div>' +
        '<div class="rd">' + esc(o.c) + '</div></div>' +
        '<div class="rr">' + esc(o.d) + '</div>'));
    });
  },

  paintGallery: function () {
    var g = $('galBox'); g.innerHTML = '';
    S.gallery.forEach(function (x) {
      g.appendChild(el('figure', '',
        '<div class="ph">' + x.e + '</div>' +
        '<figcaption><b>' + esc(x.t) + '</b>' + esc(x.s) + '</figcaption>'));
    });
  },

  /* ── 시트 ── */
  sheet: function (title, html) {
    $('sheetBody').innerHTML =
      '<div style="font-size:1.06rem;font-weight:800;letter-spacing:-.03em;margin-bottom:12px">' +
      esc(title) + '</div>' + html;
    $('sheet').classList.add('on');
    $('scrim').classList.add('on');
  },

  openSheet: function (kind) {
    if (kind === 'more') {
      var h = '<div class="mgrid">';
      MORE.forEach(function (m) {
        h += '<button class="mtile" onclick="App.go(\'' + m.id + '\')">' +
             '<span class="mi">' + m.ic + '</span><span class="mt">' + m.t + '</span></button>';
      });
      h += '</div>';
      this.sheet('더보기', h);
    } else if (kind === 'status') {
      this.sheet('연결 상태',
        '<div style="font-size:.87rem;color:var(--tx-2);line-height:1.75">' +
        (C.demo
          ? '현재 <b style="color:var(--tx)">데모 모드</b>입니다.<br>' +
            '입력하신 위임장·투표는 이 기기 안에만 임시로 남고, 어디에도 전송되지 않습니다. ' +
            '관리자 화면에서 언제든 처음 상태로 되돌릴 수 있습니다.'
          : '서버에 정상 연결되어 있습니다.<br>제출하신 내용은 즉시 협의회 서버에 기록됩니다.') +
        '</div>');
    } else if (kind === 'heatinfo') {
      this.sheet('동별 접수 현황 보는 법',
        '<div style="font-size:.87rem;color:var(--tx-2);line-height:1.8">' +
        '각 칸의 채워진 높이가 그 동의 위임장 접수율입니다.<br><br>' +
        '<span style="color:var(--ok);font-weight:700">■ 초록</span> 80% 이상 — 목표 도달<br>' +
        '<span style="color:var(--acc);font-weight:700">■ 파랑</span> 60~79% — 진행중<br>' +
        '<span style="color:var(--warn);font-weight:700">■ 주황</span> 60% 미만 — 집중 독려 필요' +
        '</div>');
    }
  },

  closeSheet: function () {
    $('sheet').classList.remove('on');
    $('scrim').classList.remove('on');
  },

  toggleTheme: function () {
    var r = document.documentElement;
    var cur = r.getAttribute('data-theme');
    var dark = matchMedia('(prefers-color-scheme:dark)').matches;
    var next = cur ? (cur === 'dark' ? 'light' : 'dark') : (dark ? 'light' : 'dark');
    r.setAttribute('data-theme', next);
    try { localStorage.setItem('jl2_theme', next); } catch (e) {}
  },

  toast: function (msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove('on'); }, 2400);
  },

  reset: function () {
    if (!confirm('데모 데이터를 처음 상태로 되돌립니다. 계속할까요?')) return;
    DB.wipe();
    location.reload();
  }
};

/* ══════════════════════════════════════════════════════════════
   위임장
   ══════════════════════════════════════════════════════════════ */
var Deleg = {
  cur: 1, pads: {},

  init: function () {
    var sel = $('inDong');
    sel.innerHTML = '<option value="">선택</option>';
    C.dongs.forEach(function (r) {
      var o = document.createElement('option');
      o.value = r[0]; o.textContent = r[0] + '동';
      sel.appendChild(o);
    });
    this.pads[1] = this.makePad(1);
    this.pads[2] = this.makePad(2);
  },

  mine: function () {
    try {
      var m = JSON.parse(localStorage.getItem(KEY + '_me') || 'null');
      if (m && S.recs.some(function (r) { return r.dong === m.dong && r.ho === m.ho; })) return m;
    } catch (e) {}
    return null;
  },

  isJoint: function () { return $('inJoint').checked; },

  agree: function () {
    var on = $('inAgree').checked;
    $('signArea').hidden = !on;
    if (on) {
      var self = this;
      setTimeout(function () {
        self.pads[1].size();
        if (self.isJoint()) self.pads[2].size();
      }, 40);
    }
  },

  joint: function () {
    var on = this.isJoint();
    $('spouseBox').hidden = !on;
    if (on) {
      var self = this;
      setTimeout(function () { self.pads[2].size(); }, 40);
    }
  },

  /* ── 서명패드 (번호별로 독립) ── */
  makePad: function (n) {
    var canvas = $('pad' + n), wrap = $('wrap' + n);
    var ctx = canvas.getContext('2d');
    var drawing = false, lastW = 0;
    var pad = {
      drawn: false,
      size: function () {
        var r = canvas.getBoundingClientRect();
        if (!r.width) return;
        lastW = r.width;
        var dpr = window.devicePixelRatio || 1;
        canvas.width = r.width * dpr;
        canvas.height = r.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = getComputedStyle(document.body).color;
        pad.drawn = false;
        wrap.classList.remove('has');
      },
      data: function () {
        try { return pad.drawn ? canvas.toDataURL('image/png') : null; } catch (e) { return null; }
      }
    };

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      var p = e.touches ? e.touches[0] : e;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    }
    function start(e) {
      e.preventDefault(); drawing = true;
      var p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y);
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      var p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke();
      if (!pad.drawn) { pad.drawn = true; wrap.classList.add('has'); }
    }
    function end() { drawing = false; }

    ['mousedown', 'touchstart'].forEach(function (t) { canvas.addEventListener(t, start, { passive:false }); });
    ['mousemove', 'touchmove'].forEach(function (t) { canvas.addEventListener(t, move, { passive:false }); });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function (t) { canvas.addEventListener(t, end); });

    /* 화면 크기가 바뀌어도(회전·주소창 접힘) 서명이 지워지지 않도록 복원합니다 */
    var rzTimer;
    window.addEventListener('resize', function () {
      clearTimeout(rzTimer);
      rzTimer = setTimeout(function () {
        if (wrap.offsetParent === null) return;               // 화면에 없으면 무시
        if (canvas.getBoundingClientRect().width === lastW) return;
        if (!pad.drawn) { pad.size(); return; }
        var prev = pad.data();
        pad.size();
        if (!prev) return;
        var img = new Image();
        img.onload = function () {
          var r = canvas.getBoundingClientRect();
          ctx.drawImage(img, 0, 0, r.width, r.height);
          pad.drawn = true;
          wrap.classList.add('has');
        };
        img.src = prev;
      }, 160);
    });
    return pad;
  },

  clearPad: function (n) { this.pads[n].size(); },

  step: function (n) {
    if (n === 2) {
      if (!$('inDong').value) return App.toast('동을 선택해 주세요');
      if (!/^\d{3,4}$/.test($('inHo').value.trim())) return App.toast('호수를 숫자로 입력해 주세요');
      var d = $('inDong').value, h = $('inHo').value.trim();
      if (S.recs.some(function (r) { return r.dong === d && r.ho === h; }))
        return App.toast(d + '동 ' + h + '호는 이미 접수된 세대입니다');
    }
    if (n === 3) {
      if (!$('inName').value.trim()) return App.toast('성명을 입력해 주세요');
      if (!/^\d{6}$/.test($('inBirth').value.replace(/\D/g, '')))
        return App.toast('생년월일 6자리를 입력해 주세요');
      if ($('inTel').value.replace(/\D/g, '').length < 10)
        return App.toast('휴대전화 번호를 확인해 주세요');
      $('nm1').textContent = $('inName').value.trim();
      $('spouseBox').hidden = !this.isJoint();
      $('signArea').hidden = !$('inAgree').checked;
    }
    this.cur = n;
    [1, 2, 3].forEach(function (i) { $('st-' + i).hidden = (i !== n); });
    $('st-done').hidden = true;
    Array.prototype.forEach.call($('stepBar').children, function (s, i) {
      s.className = 'step' + (i + 1 === n ? ' on' : i + 1 < n ? ' did' : '');
    });
    window.scrollTo(0, 0);
    if (n === 3 && $('inAgree').checked) {
      var self = this;
      setTimeout(function () {
        self.pads[1].size();
        if (self.isJoint()) self.pads[2].size();
      }, 60);
    }
  },

  submit: function () {
    var joint = this.isJoint();
    if (!$('inAgree').checked) return App.toast('위임 내용에 동의해 주세요');
    if (!this.pads[1].drawn) return App.toast('계약자 서명을 해주세요');
    if (joint) {
      if (!$('inName2').value.trim()) return App.toast('배우자 성명을 입력해 주세요');
      if (!this.pads[2].drawn) return App.toast('배우자 서명을 해주세요');
    }

    var rec = {
      dong:  $('inDong').value,
      ho:    $('inHo').value.trim(),
      name:  $('inName').value.trim().charAt(0) + '○○',
      joint: joint,
      name2: joint ? $('inName2').value.trim().charAt(0) + '○○' : null,
      sign:  this.pads[1].data(),
      sign2: joint ? this.pads[2].data() : null,
      at:    Date.now()
    };
    S.recs.unshift({ dong:rec.dong, ho:rec.ho, name:rec.name, joint:joint,
                     name2:rec.name2, at:rec.at });
    DB.save();
    try {
      localStorage.setItem(KEY + '_me',
        JSON.stringify({ dong:rec.dong, ho:rec.ho, at:rec.at }));
    } catch (e) {}

    $('doneMsg').innerHTML =
      esc(rec.dong) + '동 ' + esc(rec.ho) + '호 · ' +
      (joint ? '공동명의 2인 서명' : '단독명의 1인 서명') + '<br>' +
      (C.demo
        ? '데모 화면이므로 실제로는 저장되지 않았습니다.'
        : '협의회 서버에 정상 접수되었습니다.');

    [1, 2, 3].forEach(function (i) { $('st-' + i).hidden = true; });
    $('st-done').hidden = false;
    Array.prototype.forEach.call($('stepBar').children, function (s) { s.className = 'step did'; });
    App.paintHome();
    window.scrollTo(0, 0);
  },

  reset: function () {
    $('inHo').value = ''; $('inName').value = ''; $('inName2').value = '';
    $('inBirth').value = ''; $('inTel').value = '';
    $('inJoint').checked = false;
    $('inAgree').checked = false;
    $('spouseBox').hidden = true;
    $('signArea').hidden = true;
    this.pads[1].size(); this.pads[2].size();
    this.step(1);
    App.go('home');
  }
};

/* ══════════════════════════════════════════════════════════════
   관리자
   ══════════════════════════════════════════════════════════════ */
var Admin = {
  unlock: function () {
    if ($('inPin').value.trim() !== C.pin) return App.toast('입장 코드가 올바르지 않습니다');
    S.pin = true; DB.save();
    $('adminGate').hidden = true;
    $('adminBody').hidden = false;
    this.paint();
  },

  paint: function () {
    Notify.init();
    Notify.log();
    $('adminGate').hidden = true;
    $('adminBody').hidden = false;

    var b = $('recBox'); b.innerHTML = '';
    S.recs.slice(0, 20).forEach(function (r) {
      b.appendChild(el('div', 'row',
        '<div class="tick">✓</div>' +
        '<div class="rl"><div class="rt" style="font-size:.9rem">' +
        esc(r.dong) + '동 ' + esc(r.ho) + '호 · ' + esc(r.name) +
        (r.joint ? ' · ' + esc(r.name2) + '<span class="pill b" style="margin-left:6px">공동명의</span>' : '') + '</div>' +
        '<div class="rm"><span>' + ago(r.at) + ' 접수</span></div></div>'));
    });
    if (S.recs.length > 20) {
      b.appendChild(el('div', 'row',
        '<div class="rl"><div class="rd" style="margin:0;text-align:center">외 ' +
        (S.recs.length - 20).toLocaleString() + '건 · CSV로 전체 확인</div></div>'));
    }

    var ap = $('apprBox'); ap.innerHTML = '';
    var wait = S.budget.filter(function (x) { return x.st === '대기'; });
    if (!wait.length) ap.innerHTML = '<div class="empty">승인 대기 중인 지출이 없습니다.</div>';
    wait.forEach(function (x, i) {
      var r = el('div', 'row');
      r.innerHTML = '<div class="tick">🧾</div>' +
        '<div class="rl"><div class="rt" style="font-size:.9rem">' + esc(x.t) + '</div>' +
        '<div class="rm"><span>' + esc(x.d) + '</span><span class="num">' + won(x.a) + '</span>' +
        '<span class="rcpt">영수증 첨부됨</span></div>' +
        '<button class="btn sm" style="margin-top:9px">승인</button></div>';
      r.querySelector('button').onclick = function () {
        x.st = '승인'; DB.save(); Admin.paint(); Fee.paint();
        App.toast('지출이 승인되었습니다');
      };
      ap.appendChild(r);
    });

    var ab = $('askBox'); ab.innerHTML = '';
    if (!S.asks.length) ab.innerHTML = '<div class="empty">접수된 상담이 없습니다.</div>';
    S.asks.forEach(function (x) {
      ab.appendChild(el('div', 'row',
        '<div class="tick">⚖️</div><div class="rl">' +
        '<div class="rt" style="font-size:.9rem">' + esc(x.cat) + '</div>' +
        '<div class="rd">' + esc(x.q.slice(0, 70)) + '</div>' +
        '<div class="rm"><span class="pill o">' + esc(x.st) + '</span><span>' + ago(x.at) + '</span></div></div>'));
    });

    var tb = $('tfBox'); tb.innerHTML = '';
    if (!S.transfers.length) tb.innerHTML = '<div class="empty">신고된 명의변경이 없습니다.</div>';
    S.transfers.forEach(function (x) {
      tb.appendChild(el('div', 'row',
        '<div class="tick">🔁</div><div class="rl">' +
        '<div class="rt" style="font-size:.9rem">' + esc(x.dong) + '동 ' + esc(x.ho) + '호 → ' + esc(x.name) + '</div>' +
        '<div class="rm"><span>' + esc(x.kind) + '</span>' +
        (x.voided ? '<span class="pill o">기존 위임장 해지됨</span>' : '') + '</div></div>'));
    });

    var m = $('missBox'); m.innerHTML = '';
    C.dongs.forEach(function (row) {
      var k = S.recs.filter(function (r) { return r.dong === row[0]; }).length;
      var left = row[1] - k;
      var w = el('div');
      w.style.cssText = 'display:flex;justify-content:space-between;align-items:center;' +
        'padding:9px 0;border-bottom:1px solid var(--line-2)';
      w.innerHTML = '<span style="font-weight:700;font-size:.88rem">' + esc(row[0]) + '동</span>' +
        '<span class="num" style="font-size:.86rem;color:' +
        (left > row[1] * 0.4 ? 'var(--warn)' : 'var(--tx-2)') + '">미접수 ' + left + '세대</span>';
      m.appendChild(w);
    });
  },

  feeCsv: function () {
    var rows = [['동', '호', '위임장', '회비']];
    C.dongs.forEach(function (row) {
      var d = row[0];
      var paidD = Object.keys(S.fees).filter(function (k) { return k.split('-')[0] === d; })
        .map(function (k) { return k.split('-')[1]; });
      S.recs.filter(function (r) { return r.dong === d; }).forEach(function (r) {
        if (paidD.indexOf(r.ho) < 0) rows.push([d, r.ho, '제출', '미납']);
      });
    });
    var csv = '\uFEFF' + rows.map(function (r) { return r.join(','); }).join('\n');
    try {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
      a.download = C.apt + '_회비미납세대.csv';
      a.click();
      App.toast('미납 세대 ' + (rows.length - 1) + '건을 내려받았습니다');
    } catch (e) { App.toast('이 환경에서는 내려받기가 제한됩니다'); }
  },

  csv: function () {
    var rows = [['동', '호', '성명', '명의구분', '배우자', '접수일시']];
    S.recs.forEach(function (r) {
      rows.push([r.dong, r.ho, r.name, r.joint ? '공동명의' : '단독명의',
        r.joint ? r.name2 : '', new Date(r.at).toLocaleString('ko-KR')]);
    });
    var csv = '﻿' + rows.map(function (r) { return r.join(','); }).join('\n');
    try {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
      a.download = C.apt + '_위임장접수내역.csv';
      a.click();
      App.toast('CSV를 내려받았습니다');
    } catch (e) { App.toast('이 환경에서는 내려받기가 제한됩니다'); }
  }
};


/* ══════════════════════════════════════════════════════════════
   게시판 — 네이버 카페를 대신하는 입주민 소통 공간
   ══════════════════════════════════════════════════════════════ */
var CATS = ['전체', '자유', '질문', '정보', '나눔'];

var Board = {
  cat: '전체', cur: null,

  init: function () {
    var segs = $('bdSegs'); segs.innerHTML = '';
    CATS.forEach(function (c) {
      var b = el('button', 'seg' + (c === Board.cat ? ' on' : ''), c);
      b.onclick = function () { Board.cat = c; Board.init(); Board.paint(); };
      segs.appendChild(b);
    });
    var sel = $('wrCat'); sel.innerHTML = '';
    CATS.slice(1).forEach(function (c) {
      var o = document.createElement('option'); o.value = c; o.textContent = c;
      sel.appendChild(o);
    });
    this.paint();
  },

  filtered: function () {
    var q = ($('bdQ').value || '').trim();
    var self = this;
    return S.posts.filter(function (p) {
      if (self.cat !== '전체' && p.cat !== self.cat) return false;
      if (q && (p.t + p.b).indexOf(q) < 0) return false;
      return true;
    });
  },

  paint: function () {
    var box = $('bdRows'); box.innerHTML = '';
    var list = this.filtered();
    if (!list.length) {
      box.innerHTML = '<div class="empty">해당하는 글이 없습니다.</div>';
      return;
    }
    list.forEach(function (p) {
      var fresh = Date.now() - p.at < 12 * 3600000;
      var b = el('button', 'row');
      b.innerHTML =
        '<div class="rl">' +
        '<div class="rt">' + esc(p.t) +
          (fresh ? '<span class="bd-new">N</span>' : '') +
          (p.c.length ? '<span class="bd-cnt num">[' + p.c.length + ']</span>' : '') + '</div>' +
        '<div class="rd">' + esc(p.b.replace(/\n/g, ' ').slice(0, 52)) +
          (p.b.length > 52 ? '…' : '') + '</div>' +
        '<div class="rm"><span class="pill n">' + esc(p.cat) + '</span>' +
        '<span>' + esc(p.n) + '</span><span>' + ago(p.at) + '</span>' +
        '<span class="num">조회 ' + p.v.toLocaleString() + '</span></div></div>';
      b.onclick = function () { Board.open(p.id); };
      box.appendChild(b);
    });
  },

  open: function (id) {
    var p = S.posts.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    this.cur = id;
    p.v++;
    DB.save();

    $('pvCat').textContent = p.cat;
    $('pvTitle').textContent = p.t;
    $('pvMeta').innerHTML = '<span>' + esc(p.n) + '</span><span>' +
      new Date(p.at).toLocaleString('ko-KR', { month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) + '</span>';
    $('pvBody').textContent = p.b;
    $('pvViews').textContent = '조회 ' + p.v.toLocaleString();
    $('pvLikeN').textContent = p.like;
    $('pvLike').classList.toggle('on', !!S.likes[id]);
    this.paintCmts(p);

    $('bdList').hidden = true; $('bdWrite').hidden = true; $('bdView').hidden = false;
    window.scrollTo(0, 0);
  },

  paintCmts: function (p) {
    $('pvCmtN').textContent = p.c.length;
    var box = $('pvCmts'); box.innerHTML = '';
    if (!p.c.length) { box.innerHTML = '<div class="empty">첫 댓글을 남겨보세요.</div>'; return; }
    p.c.forEach(function (c) {
      box.appendChild(el('div', 'row',
        '<div class="tick">' + esc(c.n.charAt(0)) + '</div>' +
        '<div class="rl"><div class="rm" style="margin:0"><b style="color:var(--tx);font-size:.83rem">' +
        esc(c.n) + '</b><span>' + ago(c.at) + '</span></div>' +
        '<div class="cmt-b">' + esc(c.b) + '</div></div>'));
    });
  },

  like: function () {
    var p = S.posts.filter(function (x) { return x.id === Board.cur; })[0];
    if (!p) return;
    if (S.likes[p.id]) { p.like--; delete S.likes[p.id]; }
    else { p.like++; S.likes[p.id] = 1; App.toast('공감했습니다'); }
    DB.save();
    $('pvLikeN').textContent = p.like;
    $('pvLike').classList.toggle('on', !!S.likes[p.id]);
  },

  comment: function () {
    var t = $('pvNew').value.trim();
    if (!t) return App.toast('댓글 내용을 입력해 주세요');
    var p = S.posts.filter(function (x) { return x.id === Board.cur; })[0];
    p.c.push({ n: $('pvAnon').checked ? '익명' : Board.me(), b: t, at: Date.now() });
    DB.save();
    $('pvNew').value = '';
    this.paintCmts(p);
    App.toast('댓글이 등록되었습니다');
  },

  me: function () {
    var m = Deleg.mine();
    return m ? m.dong + '동 주민' : '입주예정자';
  },

  write: function () {
    $('wrTitle').value = ''; $('wrBody').value = '';
    $('bdList').hidden = true; $('bdView').hidden = true; $('bdWrite').hidden = false;
    window.scrollTo(0, 0);
  },

  save: function () {
    var t = $('wrTitle').value.trim(), b = $('wrBody').value.trim();
    if (!t) return App.toast('제목을 입력해 주세요');
    if (!b) return App.toast('내용을 입력해 주세요');
    S.posts.unshift({ id:'u' + Date.now(), cat:$('wrCat').value, t:t, b:b,
                      n:Board.me(), at:Date.now(), v:1, like:0, c:[] });
    DB.save();
    this.back();
    App.toast('글이 등록되었습니다');
  },

  back: function () {
    $('bdView').hidden = true; $('bdWrite').hidden = true; $('bdList').hidden = false;
    this.cur = null;
    this.paint();
    window.scrollTo(0, 0);
  }
};


/* ══════════════════════════════════════════════════════════════
   총회
   ══════════════════════════════════════════════════════════════ */
var Assembly = {
  paint: function () {
    var a = S.assembly;
    var days = Math.ceil((new Date(a.date) - new Date()) / 86400000);
    $('asD').textContent = days > 0 ? 'D-' + days : days === 0 ? 'D-DAY' : '종료';

    $('asInfo').innerHTML =
      '<dt>일시</dt><dd>' + esc(a.date) + ' ' + esc(a.time) + '</dd>' +
      '<dt>장소</dt><dd>' + esc(a.place) + '</dd>' +
      '<dt>소집공고</dt><dd>' + esc(a.noticedAt) + '</dd>' +
      '<dt>재적</dt><dd class="num">' + TOTAL.toLocaleString() + '세대</dd>';

    /* 법정 공고기한 — 총회 14일 전까지 공고 */
    var gap = Math.round((new Date(a.date) - new Date(a.noticedAt)) / 86400000);
    var ok = gap >= 14;
    $('asLegal').innerHTML =
      '공고일로부터 총회일까지 <b class="num">' + gap + '일</b> — ' +
      (ok ? '<b>법정 공고기한(14일) 충족</b>'
          : '<b class="no">법정 공고기한(14일) 미달 — 의결 무효 위험</b>') +
      '<br>규약에 따라 총회는 개최 14일 전까지 공고하여야 합니다.';

    /* 참석 · 위임 집계 */
    var deleg = S.recs.length;
    var att = Object.keys(a.attend).filter(function (k) { return a.attend[k] === 'y'; }).length + 132;
    var rest = Math.max(0, TOTAL - deleg - att);
    var pc = function (n) { return Math.round(n / TOTAL * 100); };
    $('asBar').innerHTML =
      '<i class="b" style="width:' + pc(att) + '%">' + (pc(att) > 7 ? pc(att) + '%' : '') + '</i>' +
      '<i class="a" style="width:' + pc(deleg) + '%">' + (pc(deleg) > 7 ? pc(deleg) + '%' : '') + '</i>' +
      '<i class="c" style="width:' + pc(rest) + '%"></i>';
    $('asLeg').innerHTML =
      '<span><s style="background:var(--ok)"></s>직접 참석 ' + att.toLocaleString() + '세대</span>' +
      '<span><s style="background:var(--acc)"></s>위임 ' + deleg.toLocaleString() + '세대</span>' +
      '<span><s style="background:var(--tx-3)"></s>미정 ' + rest.toLocaleString() + '세대</span>';
    var sum = att + deleg;
    $('asFoot').innerHTML =
      '성립 인원 <b class="num">' + sum.toLocaleString() + '세대 (' + pc(sum) + '%)</b> · ' +
      (sum >= TOTAL / 2 ? '의결정족수 충족' : '의결정족수 미달') +
      '<br>직접 참석과 위임을 합산해 산정합니다.';

    /* 내 참석 의사 */
    var box = $('asPick'); box.innerHTML = '';
    [['y', '✅', '직접 참석합니다', '총회 당일 현장에 갑니다'],
     ['d', '✍️', '위임하겠습니다', '협의회에 의결권을 위임합니다'],
     ['n', '❌', '불참합니다', '참석도 위임도 하지 않습니다']].forEach(function (o) {
      var b = el('button', 'act' + (a.myPick === o[0] ? ' done' : ''));
      b.innerHTML = '<div class="ic">' + o[1] + '</div><div class="tx"><div class="tt">' + o[2] +
        (a.myPick === o[0] ? '<span class="pill g">선택함</span>' : '') +
        '</div><div class="ds">' + o[3] + '</div></div><div class="ar">›</div>';
      b.onclick = function () { Assembly.pick(o[0]); };
      box.appendChild(b);
    });

    /* 안건 */
    var ag = $('asAgenda'); ag.innerHTML = '';
    a.agenda.forEach(function (x, i) {
      ag.appendChild(el('div', 'row',
        '<div class="tick num">' + (i + 1) + '</div>' +
        '<div class="rl"><div class="rt">' + esc(x.t) + '</div>' +
        '<div class="rm"><span class="pill n">의결요건 ' + esc(x.s) + '</span></div></div>'));
    });
  },

  pick: function (v) {
    var m = Deleg.mine();
    S.assembly.myPick = v;
    if (m) S.assembly.attend[m.dong + '-' + m.ho] = v;
    DB.save();
    this.paint();
    App.toast(v === 'y' ? '직접 참석으로 등록되었습니다'
            : v === 'd' ? '위임으로 등록되었습니다' : '불참으로 등록되었습니다');
    if (v === 'd' && !m) setTimeout(function () { App.go('delegate'); }, 700);
  },

  doc: function (kind) {
    var a = S.assembly, deleg = S.recs.length;
    var att = Object.keys(a.attend).filter(function (k) { return a.attend[k] === 'y'; }).length + 132;
    var body;
    if (kind === '소집공고') {
      body = '<table>' +
        '<tr><th>총회 명칭</th><td>' + esc(a.no) + '</td></tr>' +
        '<tr><th>일시</th><td>' + esc(a.date) + ' ' + esc(a.time) + '</td></tr>' +
        '<tr><th>장소</th><td>' + esc(a.place) + '</td></tr>' +
        '<tr><th>공고일</th><td>' + esc(a.noticedAt) + '</td></tr></table>' +
        '<div class="stmt"><b>부의 안건</b><br>' +
        a.agenda.map(function (x, i) { return (i + 1) + '. ' + esc(x.t); }).join('<br>') +
        '</div><div class="stmt">위 안건을 의결하기 위하여 ' + esc(C.org) +
        ' 규약에 따라 총회를 소집하오니 참석하여 주시기 바랍니다. ' +
        '부득이 참석이 어려운 세대는 전자 위임장을 제출하여 주시기 바랍니다.</div>';
    } else if (kind === '의결서') {
      body = '<table>' +
        '<tr><th>총회 명칭</th><td>' + esc(a.no) + '</td></tr>' +
        '<tr><th>개최 일시</th><td>' + esc(a.date) + ' ' + esc(a.time) + '</td></tr>' +
        '<tr><th>재적 세대</th><td class="num">' + TOTAL.toLocaleString() + '세대</td></tr>' +
        '<tr><th>직접 참석</th><td class="num">' + att.toLocaleString() + '세대</td></tr>' +
        '<tr><th>위임 참석</th><td class="num">' + deleg.toLocaleString() + '세대</td></tr>' +
        '<tr><th>성립 인원</th><td class="num big">' + (att + deleg).toLocaleString() + '세대 (' +
        Math.round((att + deleg) / TOTAL * 100) + '%)</td></tr></table>' +
        '<div class="stmt">위와 같이 재적 세대 과반수의 참석으로 총회가 적법하게 성립하였으며, ' +
        '아래 안건을 의결하였음을 확인합니다.<br><br>' +
        a.agenda.map(function (x, i) { return (i + 1) + '. ' + esc(x.t) + ' — <b>가결</b>'; }).join('<br>') +
        '</div>';
    } else {
      body = '<table>' +
        '<tr><th>일시</th><td>' + esc(a.date) + ' ' + esc(a.time) + '</td></tr>' +
        '<tr><th>장소</th><td>' + esc(a.place) + '</td></tr>' +
        '<tr><th>참석</th><td class="num">직접 ' + att.toLocaleString() +
        '세대 · 위임 ' + deleg.toLocaleString() + '세대</td></tr></table>' +
        '<div class="stmt"><b>회의 경과</b><br>' +
        '1. 개회 선언 및 성원 보고<br>2. 의장 선출<br>' +
        a.agenda.map(function (x, i) { return (i + 3) + '. ' + esc(x.t) + ' 심의 및 의결'; }).join('<br>') +
        '<br>' + (a.agenda.length + 3) + '. 폐회</div>';
    }
    Cert.render(kind, esc(a.no) + ' ' + kind, body);
  }
};

/* ══════════════════════════════════════════════════════════════
   임원 선거
   ══════════════════════════════════════════════════════════════ */
var Election = {
  paint: function () {
    var e = S.election;
    $('elTitle').textContent = e.pos + ' 선거';
    $('elDesc').textContent = '마감 ' + e.end + ' · 1세대 1표 · 위임장을 제출한 세대만 투표할 수 있습니다.';
    var st = $('elState');
    st.textContent = e.myVote === null ? '미투표' : '투표 완료';
    st.className = 'pill ' + (e.myVote === null ? 'b' : 'g');

    var me = Deleg.mine();
    $('elGuard').innerHTML = me
      ? '<b>' + esc(me.dong) + '동 ' + esc(me.ho) + '호</b>로 세대 인증되었습니다. 1표를 행사하실 수 있습니다.' +
        (e.myVote !== null ? '<br>이미 투표를 마치셨습니다. 마감 전까지 변경할 수 있습니다.' : '')
      : '<b>아직 세대 인증이 되지 않았습니다.</b><br>위임장을 제출한 세대만 투표할 수 있습니다. ' +
        '카페 댓글 투표와 달리 1세대 1표가 보장되며 중복·조작이 불가능합니다.' +
        '<button class="btn sm" style="margin-top:12px" onclick="App.go(\'delegate\')">위임장 제출하기</button>';

    var tot = e.cands.reduce(function (a2, c) { return a2 + c.v; }, 0);
    var box = $('elCands'); box.innerHTML = '';
    e.cands.forEach(function (c) {
      var p = tot ? Math.round(c.v / tot * 100) : 0;
      var w = el('div', 'cand');
      w.innerHTML =
        '<div class="cand-h"><div class="cand-av">' + esc(c.n.charAt(0)) + '</div>' +
        '<div><div class="cand-n">' + esc(c.n) +
        (e.myVote === c.id ? '<span class="pill g" style="margin-left:7px">내 선택</span>' : '') +
        '</div><div class="cand-d">' + esc(c.d) + ' · ' + esc(c.j) + '</div></div></div>' +
        '<div class="cand-p">' + esc(c.p) + '</div>' +
        '<div class="cand-f"><div class="bar"><i style="width:' + p + '%"></i></div>' +
        '<span class="cand-v num">' + p + '% · ' + c.v + '표</span></div>';
      w.querySelector('.cand-h').style.cursor = 'pointer';
      w.onclick = function () { Election.vote(c.id); };
      box.appendChild(w);
    });
  },

  vote: function (id) {
    if (!Deleg.mine()) return App.toast('위임장을 제출한 세대만 투표할 수 있습니다');
    var e = S.election;
    if (e.myVote === id) return App.toast('이미 이 후보에게 투표하셨습니다');
    if (e.myVote) { e.cands.filter(function (c) { return c.id === e.myVote; })[0].v--; }
    e.cands.filter(function (c) { return c.id === id; })[0].v++;
    e.myVote = id;
    DB.save();
    this.paint();
    App.toast('투표가 완료되었습니다');
  }
};

/* ══════════════════════════════════════════════════════════════
   계약 분석 · 법률 상담
   ══════════════════════════════════════════════════════════════ */
var Legal = {
  paint: function () {
    var n = { high:0, mid:0, low:0 };
    S.risks.forEach(function (r) { n[r.lv]++; });
    $('lgSum').innerHTML =
      '<div class="r1"><b class="num">' + n.high + '</b><span>즉시 대응 필요</span></div>' +
      '<div class="r2"><b class="num">' + n.mid + '</b><span>협의 권고</span></div>' +
      '<div class="r3"><b class="num">' + n.low + '</b><span>참고</span></div>';

    var box = $('lgList'); box.innerHTML = '';
    S.risks.forEach(function (r) {
      var lb = r.lv === 'high' ? '위험' : r.lv === 'mid' ? '주의' : '참고';
      var cl = r.lv === 'high' ? 'b' : r.lv === 'mid' ? 'o' : 'n';
      box.appendChild(el('div', 'risk ' + r.lv,
        '<div class="risk-h"><div class="risk-c">' + esc(r.c) +
        ' <span class="pill ' + cl + '" style="margin-left:5px">' + lb + '</span></div>' +
        '<div class="risk-t">' + esc(r.t) + '</div></div>' +
        '<div class="risk-b">' + esc(r.b) +
        '<span class="jl"><b>법무법인 제이엘 의견</b><br>' + esc(r.jl) + '</span></div>'));
    });
    this.paintMine();
  },

  paintMine: function () {
    var wrap = $('lgMineWrap');
    if (!S.asks.length) { wrap.hidden = true; return; }
    wrap.hidden = false;
    var box = $('lgMine'); box.innerHTML = '';
    S.asks.forEach(function (a) {
      box.appendChild(el('div', 'row',
        '<div class="tick">⚖️</div>' +
        '<div class="rl"><div class="rt" style="font-size:.9rem">' + esc(a.cat) + '</div>' +
        '<div class="rd">' + esc(a.q.slice(0, 60)) + (a.q.length > 60 ? '…' : '') + '</div>' +
        '<div class="rm"><span class="pill ' + (a.st === '접수' ? 'o' : 'g') + '">' + esc(a.st) + '</span>' +
        '<span>' + ago(a.at) + '</span></div></div>'));
    });
  },

  ask: function () {
    var q = $('lgQ').value.trim();
    if (!q) return App.toast('질문 내용을 입력해 주세요');
    if ($('lgTel').value.replace(/\D/g, '').length < 10) return App.toast('연락처를 확인해 주세요');
    S.asks.unshift({ cat:$('lgCat').value, q:q, st:'접수', at:Date.now() });
    DB.save();
    $('lgQ').value = '';
    this.paintMine();
    App.toast('상담이 접수되었습니다. 영업일 기준 2일 내 회신됩니다');
    window.scrollTo(0, document.body.scrollHeight);
  }
};

/* ══════════════════════════════════════════════════════════════
   자료실
   ══════════════════════════════════════════════════════════════ */
var Docs = {
  cat: '전체',
  init: function () {
    var cats = ['전체'].concat(S.docs.map(function (d) { return d.cat; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; }));
    var segs = $('dcSegs'); segs.innerHTML = '';
    cats.forEach(function (c) {
      var b = el('button', 'seg' + (c === Docs.cat ? ' on' : ''), c);
      b.onclick = function () { Docs.cat = c; Docs.init(); };
      segs.appendChild(b);
    });
    var box = $('dcRows'); box.innerHTML = '';
    S.docs.filter(function (d) { return Docs.cat === '전체' || d.cat === Docs.cat; })
      .forEach(function (d) {
        var b = el('button', 'row');
        b.innerHTML =
          '<div class="tick">' + (d.k === 'PDF' ? '📕' : d.k === 'HWP' ? '📘' : '🗂️') + '</div>' +
          '<div class="rl"><div class="rt" style="font-size:.92rem">' + esc(d.t) + '</div>' +
          '<div class="rm"><span class="pill n">' + esc(d.cat) + '</span><span>' + esc(d.d) +
          '</span><span>' + esc(d.k) + ' · ' + esc(d.sz) + '</span></div></div>' +
          '<div class="ar">⤓</div>';
        b.onclick = function () { App.toast('데모 화면이므로 실제 파일은 없습니다'); };
        box.appendChild(b);
      });
  }
};

/* ══════════════════════════════════════════════════════════════
   명의변경 신고
   ══════════════════════════════════════════════════════════════ */
var Transfer = {
  init: function () {
    var sel = $('tfDong'); sel.innerHTML = '<option value="">선택</option>';
    C.dongs.forEach(function (r) {
      var o = document.createElement('option');
      o.value = r[0]; o.textContent = r[0] + '동';
      sel.appendChild(o);
    });
  },
  send: function () {
    var d = $('tfDong').value, h = $('tfHo').value.trim();
    if (!d) return App.toast('동을 선택해 주세요');
    if (!/^\d{3,4}$/.test(h)) return App.toast('호수를 숫자로 입력해 주세요');
    if (!$('tfName').value.trim()) return App.toast('새 소유자 성명을 입력해 주세요');
    var had = S.recs.some(function (r) { return r.dong === d && r.ho === h; });
    S.transfers.unshift({ dong:d, ho:h, kind:$('tfKind').value,
      name:$('tfName').value.trim().charAt(0) + '○○',
      date:$('tfDate').value || '-', voided:had, at:Date.now() });
    if (had) S.recs = S.recs.filter(function (r) { return !(r.dong === d && r.ho === h); });
    DB.save();
    App.paintHome();
    App.sheet('신고 접수 완료',
      '<div style="font-size:.88rem;color:var(--tx-2);line-height:1.75">' +
      esc(d) + '동 ' + esc(h) + '호 명의변경이 접수되었습니다.<br><br>' +
      (had
        ? '<b style="color:var(--warn)">기존 위임장이 효력을 잃어 자동 해지되었습니다.</b><br>' +
          '새 소유자께서 위임장을 다시 제출하셔야 총회 의결권이 인정됩니다.'
        : '해당 세대는 위임장 접수 이력이 없어 별도 해지 처리는 없습니다.') +
      '</div>');
    $('tfHo').value = ''; $('tfName').value = '';
  }
};

/* ══════════════════════════════════════════════════════════════
   회비
   ══════════════════════════════════════════════════════════════ */
var FEE_PER = 20000;

var Fee = {
  init: function () {
    var sel = $('feDong'); sel.innerHTML = '<option value="">선택</option>';
    C.dongs.forEach(function (r) {
      var o = document.createElement('option');
      o.value = r[0]; o.textContent = r[0] + '동';
      sel.appendChild(o);
    });
  },

  paid: function (d, h) { return !!S.fees[d + '-' + h]; },

  paint: function () {
    var keys = Object.keys(S.fees);
    var n = keys.length, pct = Math.round(n / TOTAL * 100);
    $('feeRate').textContent = pct + '%';
    setTimeout(function () { $('feeBar').style.width = pct + '%'; }, 250);
    $('feeSum').innerHTML =
      '<div><span>납부</span><b class="num" style="color:var(--ok)">' + n.toLocaleString() + '세대</b></div>' +
      '<div><span>미납</span><b class="num" style="color:var(--warn)">' + (TOTAL - n).toLocaleString() + '세대</b></div>' +
      '<div><span>누적 회비</span><b class="num">' + (n * FEE_PER).toLocaleString() + '원</b></div>';
    $('feeNote').innerHTML =
      '세대당 <b class="num">' + FEE_PER.toLocaleString() + '원</b> · 재적 ' + TOTAL.toLocaleString() + '세대 기준<br>' +
      '미납 세대는 임원 화면에서 명단으로 내려받아 안내할 수 있습니다.';

    var heat = $('feeHeat'); heat.innerHTML = '';
    C.dongs.forEach(function (row) {
      var d = row[0], tot = row[1];
      var k = keys.filter(function (x) { return x.split('-')[0] === d; }).length;
      var p = Math.round(k / tot * 100);
      var c = el('div', 'hcell' + (p >= 70 ? ' hi' : p < 45 ? ' lo' : ''),
        '<div class="fill" style="height:0"></div><div class="d">' + esc(d) + '동</div>' +
        '<div class="p num">' + p + '%</div><div class="n num">' + k + '/' + tot + '</div>');
      heat.appendChild(c);
      setTimeout(function () { c.querySelector('.fill').style.height = p + '%'; }, 220);
    });

    var b = $('budBox'); b.innerHTML = '';
    S.budget.forEach(function (x) {
      b.appendChild(el('div', 'row',
        '<div class="tick">' + (x.type === 'in' ? '↓' : '↑') + '</div>' +
        '<div class="rl"><div class="rt" style="font-size:.9rem">' + esc(x.t) +
        (x.rc ? '<span class="rcpt">영수증</span>' : '') +
        (x.st === '대기' ? '<span class="pill o" style="margin-left:6px">승인대기</span>' : '') +
        '</div><div class="rm"><span>' + esc(x.d) + '</span></div></div>' +
        '<div class="rr num" style="font-weight:800;font-size:.9rem;color:' +
        (x.type === 'in' ? 'var(--ok)' : 'var(--tx)') + '">' + won(x.a) + '</div>'));
    });
  },

  check: function () {
    var d = $('feDong').value, h = $('feHo').value.trim();
    if (!d) return App.toast('동을 선택해 주세요');
    if (!/^\d{3,4}$/.test(h)) return App.toast('호수를 숫자로 입력해 주세요');
    var f = S.fees[d + '-' + h];
    var box = $('feResult');
    box.hidden = false;
    box.innerHTML = f
      ? '<div class="ck yes"><div class="ci">✓</div><div class="ct">회비 납부 완료</div>' +
        '<div class="cs">' + esc(d) + '동 ' + esc(h) + '호 · ' + f.amt.toLocaleString() + '원<br>' +
        new Date(f.at).toLocaleDateString('ko-KR') + ' 입금 확인</div></div>'
      : '<div class="ck no"><div class="ci">!</div><div class="ct">미납 세대입니다</div>' +
        '<div class="cs">' + esc(d) + '동 ' + esc(h) + '호 · 회비 ' + FEE_PER.toLocaleString() + '원<br>' +
        '○○은행 123-456-789012 ' + esc(C.org) + '</div></div>';
  }
};

/* ══════════════════════════════════════════════════════════════
   대표성 증명서 · 문서 출력
   ══════════════════════════════════════════════════════════════ */
var Cert = {
  open: function () {
    var done = S.recs.length, pct = (done / TOTAL * 100).toFixed(1);
    var joint = S.recs.filter(function (r) { return r.joint; }).length;
    var dates = S.recs.map(function (r) { return r.at; });
    var from = new Date(Math.min.apply(null, dates)).toLocaleDateString('ko-KR');
    var to   = new Date(Math.max.apply(null, dates)).toLocaleDateString('ko-KR');

    var body =
      '<table>' +
      '<tr><th>단지명</th><td>' + esc(C.apt) + '</td></tr>' +
      '<tr><th>소재지</th><td>' + esc(C.address) + '</td></tr>' +
      '<tr><th>단체명</th><td>' + esc(C.org) + '</td></tr>' +
      '<tr><th>재적 세대수</th><td class="num">' + TOTAL.toLocaleString() + ' 세대</td></tr>' +
      '<tr><th>위임장 접수 세대</th><td class="num big">' + done.toLocaleString() + ' 세대 (' + pct + '%)</td></tr>' +
      '<tr><th>공동명의 접수</th><td class="num">' + joint.toLocaleString() + ' 세대</td></tr>' +
      '<tr><th>접수 기간</th><td>' + from + ' ~ ' + to + '</td></tr>' +
      '<tr><th>접수 방식</th><td>전자 위임장 (자필 전자서명)</td></tr>' +
      '</table>' +
      '<div class="stmt">위 단체는 ' + esc(C.apt) + ' 분양계약자 ' + TOTAL.toLocaleString() +
      '세대 중 <b>' + done.toLocaleString() + '세대(' + pct + '%)</b>로부터 ' +
      '입주예정자협의회의 구성·운영 및 시공사·시행사에 대한 협의 권한을 적법하게 위임받았음을 확인합니다.<br><br>' +
      '각 위임장은 「전자문서 및 전자거래 기본법」 제4조에 따라 서면 위임장과 동일한 효력을 가지며, ' +
      '위임인의 자필 전자서명 원본 ' + done.toLocaleString() + '건이 보관되어 있습니다.</div>';

    this.render('위임 현황 확인서', '위임 현황 확인서', body, true);
  },

  render: function (title, head, body, sealed) {
    var d = new Date();
    $('certPage').innerHTML =
      '<h1>' + esc(head) + '</h1>' +
      '<div class="sub">' + esc(C.org) + '</div>' +
      body +
      '<div class="date">' + d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일</div>' +
      '<div class="sign">' + esc(C.org) + '<br><b>회 장   김 ○ ○   (인)</b></div>' +
      (sealed
        ? '<div class="sign" style="margin-top:8mm">법률자문<br><b>법무법인 제이엘   (인)</b></div>'
        : '') +
      '<div class="foot">본 문서는 ' + esc(C.org) +
      ' 전자 위임장 시스템의 기록을 근거로 자동 작성되었습니다.' +
      (C.demo ? '<br>※ 데모 화면이므로 기재된 수치는 예시입니다.' : '') +
      '<br>발급일시 ' + d.toLocaleString('ko-KR') + '</div>';
    $('certWrap').hidden = false;
    document.body.classList.add('printing');
    window.scrollTo(0, 0);
  },

  close: function () {
    $('certWrap').hidden = true;
    document.body.classList.remove('printing');
  }
};


/* ══════════════════════════════════════════════════════════════
   입주민 한마디 — 짧은 단문 피드
   ══════════════════════════════════════════════════════════════ */
var STAGS = ['궁금', '정보', '응원', '건의'];

var Say = {
  tag: '궁금', filter: '전체',

  init: function () {
    var box = $('sayTags'); box.innerHTML = '';
    STAGS.forEach(function (t) {
      var b = el('button', 'stag' + (t === Say.tag ? ' on' : ''), '#' + t);
      b.onclick = function () { Say.tag = t; Say.init(); };
      box.appendChild(b);
    });
    var f = $('sayFilter'); f.innerHTML = '';
    ['전체'].concat(STAGS).forEach(function (t) {
      var b = el('button', 'seg' + (t === Say.filter ? ' on' : ''), t === '전체' ? '전체' : '#' + t);
      b.onclick = function () { Say.filter = t; Say.init(); };
      f.appendChild(b);
    });
    var m = Deleg.mine();
    $('sayMeAv').textContent = m ? m.dong : '?';
    this.paint();
  },

  count: function () {
    var n = $('sayText').value.length;
    var e = $('sayLen');
    e.textContent = n + ' / 150';
    e.classList.toggle('over', n > 140);
  },

  me: function () {
    var m = Deleg.mine();
    return m ? m.dong + '동 주민' : '입주예정자';
  },

  paint: function () {
    var list = S.says.filter(function (x) {
      return Say.filter === '전체' || x.tag === Say.filter;
    });
    $('sayCnt').textContent = S.says.length + '개';
    var box = $('sayFeed'); box.innerHTML = '';
    if (!list.length) { box.innerHTML = '<div class="empty">아직 한마디가 없습니다.</div>'; return; }
    list.forEach(function (x) { box.appendChild(Say.card(x)); });
  },

  card: function (x) {
    var liked = !!S.sayLikes[x.id];
    var w = el('div', 'saycard');
    var reps = x.r.map(function (r) {
      return '<div class="sc-re-i"><div class="sc-re-av">' +
        esc(r.n === '익명' ? '익' : r.n.charAt(0)) + '</div>' +
        '<div class="sc-re-b"><i>' + esc(r.n) + '</i>' + esc(r.b) +
        '<s>' + ago(r.at) + '</s></div></div>';
    }).join('');

    w.innerHTML =
      '<div class="sc-h">' +
      '<div class="say-av" style="width:34px;height:34px;border-radius:11px;font-size:.74rem">' +
      esc(x.anon ? '익' : x.n.slice(0, 3)) + '</div>' +
      '<div><div class="sc-n">' + esc(x.n) + '</div>' +
      '<div class="sc-t">' + ago(x.at) + '</div></div>' +
      '<span class="sc-tag">#' + esc(x.tag) + '</span></div>' +
      '<p class="sc-b">' + esc(x.b) + '</p>' +
      '<div class="sc-f">' +
      '<button class="lk' + (liked ? ' on' : '') + '">' + (liked ? '❤️' : '🤍') +
      ' <span class="num">' + x.l + '</span></button>' +
      '<button class="rp">💬 <span class="num">' + x.r.length + '</span></button></div>' +
      (reps ? '<div class="sc-re">' + reps + '</div>' : '') +
      '<div class="sc-rein" hidden>' +
      '<input placeholder="답글 달기"><button class="btn sm">등록</button></div>';

    w.querySelector('.lk').onclick = function () { Say.like(x.id); };
    var rein = w.querySelector('.sc-rein');
    w.querySelector('.rp').onclick = function () {
      rein.hidden = !rein.hidden;
      if (!rein.hidden) rein.querySelector('input').focus();
    };
    var inp = rein.querySelector('input');
    var go = function () {
      var t = inp.value.trim();
      if (!t) return;
      x.r.push({ n: Say.me(), b: t, at: Date.now() });
      DB.save(); Say.paint(); App.toast('답글을 남겼습니다');
    };
    rein.querySelector('button').onclick = go;
    inp.onkeydown = function (e) { if (e.key === 'Enter') go(); };
    return w;
  },

  like: function (id) {
    var x = S.says.filter(function (s2) { return s2.id === id; })[0];
    if (S.sayLikes[id]) { x.l--; delete S.sayLikes[id]; }
    else { x.l++; S.sayLikes[id] = 1; }
    DB.save();
    this.paint();
  },

  post: function () {
    var t = $('sayText').value.trim();
    if (!t) return App.toast('한마디를 입력해 주세요');
    if (t.length > 150) return App.toast('150자 이내로 적어주세요');
    var anon = $('sayAnon').checked;
    S.says.unshift({ id:'u' + Date.now(), tag:Say.tag, n:anon ? '익명' : Say.me(),
      anon:anon, b:t, at:Date.now(), l:0, r:[] });
    DB.save();
    $('sayText').value = '';
    this.count();
    this.filter = '전체';
    this.init();
    App.toast('한마디가 등록되었습니다');
    window.scrollTo(0, 0);
  }
};

/* ══════════════════════════════════════════════════════════════
   카카오 알림톡 (데모 — 실제 발송 없음)
   ══════════════════════════════════════════════════════════════ */
var AT_PRICE = 9;

var Notify = {
  targets: function () {
    var feePaid = Object.keys(S.fees);
    var unpaid = S.recs.filter(function (r) { return feePaid.indexOf(r.dong + '-' + r.ho) < 0; }).length;
    return [
      { k:'all',   t:'전체 접수 세대',        n:S.recs.length },
      { k:'nodel', t:'위임장 미제출 세대',    n:Math.max(0, TOTAL - S.recs.length) },
      { k:'fee',   t:'회비 미납 세대',        n:unpaid },
      { k:'as',    t:'총회 참석 미응답 세대',  n:Math.max(0, S.recs.length - 132) }
    ];
  },

  tpls: function () {
    var a = S.assembly;
    var days = Math.max(0, Math.ceil((new Date(a.date) - new Date()) / 86400000));
    return [
      { k:'as', t:'총회 개최 안내',
        m:'[' + C.org + ']\n\n' + a.no + ' 개최를 안내드립니다.\n\n' +
          '▪ 일시 : ' + a.date + ' ' + a.time + '\n' +
          '▪ 장소 : ' + a.place + '\n' +
          '▪ 남은 기간 : D-' + days + '\n\n' +
          '참석이 어려우신 세대는 전자 위임장을 제출해 주시기 바랍니다.',
        b:'참석 여부 등록하기' },
      { k:'del', t:'위임장 제출 독려',
        m:'[' + C.org + ']\n\n' + C.apt + ' 전자 위임장 접수가 진행 중입니다.\n\n' +
          '현재 ' + S.recs.length.toLocaleString() + '세대가 참여하셨습니다.\n' +
          '동·호수 선택 후 서명까지 약 1분이면 완료됩니다.\n\n' +
          '앱 설치 없이 아래 링크로 바로 접수하실 수 있습니다.',
        b:'위임장 제출하기' },
      { k:'fee', t:'회비 납부 안내',
        m:'[' + C.org + ']\n\n협의회 운영 회비 납부를 안내드립니다.\n\n' +
          '▪ 금액 : 세대당 20,000원\n' +
          '▪ 계좌 : ○○은행 123-456-789012\n' +
          '▪ 예금주 : ' + C.org + '\n\n' +
          '납부하신 내역은 플랫폼에서 전 세대가 확인하실 수 있습니다.',
        b:'우리 집 납부 확인' },
      { k:'no', t:'새 공지 등록 알림',
        m:'[' + C.org + ']\n\n새로운 공지사항이 등록되었습니다.\n\n' +
          '▪ ' + S.notices[0].t + '\n▪ 등록일 : ' + S.notices[0].d + '\n\n' +
          '자세한 내용은 플랫폼에서 확인해 주세요.',
        b:'공지 확인하기' }
    ];
  },

  init: function () {
    var ts = $('atTarget'); ts.innerHTML = '';
    this.targets().forEach(function (x, i) {
      var o = document.createElement('option');
      o.value = i; o.textContent = x.t + ' (' + x.n.toLocaleString() + '명)';
      ts.appendChild(o);
    });
    var tp = $('atTpl'); tp.innerHTML = '';
    this.tpls().forEach(function (x, i) {
      var o = document.createElement('option');
      o.value = i; o.textContent = x.t;
      tp.appendChild(o);
    });
    $('ktProf').textContent = C.emblem;
    $('ktName').textContent = C.org;
    this.preview();
  },

  preview: function () {
    var t = this.targets()[+$('atTarget').value || 0];
    var p = this.tpls()[+$('atTpl').value || 0];
    $('ktMsg').textContent = p.m;
    $('ktBtn').textContent = p.b;
    $('atN').textContent = t.n.toLocaleString() + '명';
    $('atCost').textContent = (t.n * AT_PRICE).toLocaleString() + '원';
  },

  send: function () {
    var t = this.targets()[+$('atTarget').value || 0];
    var p = this.tpls()[+$('atTpl').value || 0];
    if (!t.n) return App.toast('발송 대상이 없습니다');

    var btn = $('atGo'), hint = $('atHint');
    btn.disabled = true;
    var i = 0;
    var timer = setInterval(function () {
      i += Math.ceil(t.n / 12);
      if (i >= t.n) i = t.n;
      btn.textContent = '발송 중… ' + i.toLocaleString() + ' / ' + t.n.toLocaleString();
      hint.textContent = '카카오 비즈메시지 서버로 전송하고 있습니다.';
      if (i >= t.n) {
        clearInterval(timer);
        var fail = Math.round(t.n * 0.018);
        S.atLog.unshift({ t:p.t, target:t.t, n:t.n, ok:t.n - fail, fail:fail,
          cost:(t.n - fail) * AT_PRICE, at:Date.now() });
        DB.save();
        btn.disabled = false;
        btn.textContent = '알림톡 발송';
        hint.textContent = '데모 화면이므로 실제로 발송되지 않습니다.';
        Notify.log();
        App.sheet('발송 완료',
          '<div style="font-size:.88rem;color:var(--tx-2);line-height:1.8">' +
          '<b style="color:var(--tx)">' + esc(p.t) + '</b> · ' + esc(t.t) + '<br><br>' +
          '성공 <b style="color:var(--ok)">' + (t.n - fail).toLocaleString() + '건</b> · ' +
          '실패 <b style="color:var(--warn)">' + fail.toLocaleString() + '건</b><br>' +
          '(실패 = 카카오톡 미사용 · 번호 변경 세대 — 문자로 자동 대체 발송)<br><br>' +
          '집행 비용 <b style="color:var(--tx)">' + ((t.n - fail) * AT_PRICE).toLocaleString() + '원</b><br><br>' +
          '<span style="color:var(--tx-3);font-size:.82rem">※ 데모 화면입니다. 실제 발송은 카카오 비즈니스 채널 개설 후 가능합니다.</span></div>');
      }
    }, 170);
  },

  log: function () {
    var w = $('atLogWrap');
    if (!S.atLog.length) { w.hidden = true; return; }
    w.hidden = false;
    var box = $('atLog'); box.innerHTML = '';
    S.atLog.forEach(function (x) {
      box.appendChild(el('div', 'row',
        '<div class="tick">💬</div><div class="rl">' +
        '<div class="rt" style="font-size:.9rem">' + esc(x.t) + '</div>' +
        '<div class="rm"><span>' + esc(x.target) + '</span>' +
        '<span class="num">성공 ' + x.ok.toLocaleString() + '</span>' +
        '<span class="num">실패 ' + x.fail.toLocaleString() + '</span>' +
        '<span>' + ago(x.at) + '</span></div></div>' +
        '<div class="rr num" style="font-weight:800;color:var(--tx)">' + x.cost.toLocaleString() + '원</div>'));
    });
  }
};

/* ══════════════════════════════════════════════════════════════
   내 접수 확인
   ══════════════════════════════════════════════════════════════ */
var Check = {
  init: function () {
    var sel = $('ckDong');
    sel.innerHTML = '<option value="">선택</option>';
    C.dongs.forEach(function (r) {
      var o = document.createElement('option');
      o.value = r[0]; o.textContent = r[0] + '동';
      sel.appendChild(o);
    });
  },

  run: function () {
    var d = $('ckDong').value, h = $('ckHo').value.trim();
    if (!d) return App.toast('동을 선택해 주세요');
    if (!/^\d{3,4}$/.test(h)) return App.toast('호수를 숫자로 입력해 주세요');
    if (!/^\d{6}$/.test($('ckBirth').value.replace(/\D/g, '')))
      return App.toast('생년월일 6자리를 입력해 주세요');

    var hit = null;
    for (var i = 0; i < S.recs.length; i++) {
      if (S.recs[i].dong === d && S.recs[i].ho === h) { hit = S.recs[i]; break; }
    }
    var box = $('ckResult');
    box.hidden = false;
    if (hit) {
      box.innerHTML =
        '<div class="ck yes"><div class="ci">✓</div>' +
        '<div class="ct">접수 완료된 세대입니다</div>' +
        '<div class="cs">' + esc(d) + '동 ' + esc(h) + '호 · ' + esc(hit.name) +
        (hit.joint ? ' · ' + esc(hit.name2) + ' (공동명의)' : '') + '<br>' +
        new Date(hit.at).toLocaleDateString('ko-KR') + ' 접수</div></div>';
    } else {
      box.innerHTML =
        '<div class="ck no"><div class="ci">!</div>' +
        '<div class="ct">아직 접수되지 않았습니다</div>' +
        '<div class="cs">' + esc(d) + '동 ' + esc(h) + '호<br>' +
        '지금 제출하시면 1분이면 끝납니다.</div>' +
        '<button class="btn" style="margin-top:16px" onclick="App.go(\'delegate\')">위임장 제출하러 가기</button></div>';
    }
  }
};

window.App = App; window.Deleg = Deleg; window.Admin = Admin;
window.Check = Check; window.Board = Board; window.Assembly = Assembly;
window.Election = Election; window.Legal = Legal; window.Docs = Docs;
window.Transfer = Transfer; window.Fee = Fee; window.Cert = Cert;
window.Say = Say; window.Notify = Notify;
document.addEventListener('DOMContentLoaded', function () {
  App.init();
  /* 웹폰트는 화면이 그려진 뒤에 따로 불러옵니다 (로딩 지연 방지) */
  var f = document.createElement('link');
  f.rel = 'stylesheet';
  f.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css';
  document.head.appendChild(f);
});
})();
