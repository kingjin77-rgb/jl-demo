/* 춘천 아테라 에듀파크 입주예정자협의회 — 단지 설정
   동 수와 동별 세대수는 잠정입니다. 입주자모집공고문 확인 후 교체하십시오. */
window.CONFIG = {
  type: 'newbuild',

  apt:      '춘천 아테라 에듀파크',
  org:      '춘천 아테라 에듀파크 입주예정자협의회',
  emblem:   '아',
  address:  '강원특별자치도 춘천시 동면 만천리 768-50 일원',
  builder:  '아테라건설(주)',
  owner:    '(주)아테라씨씨',
  moveIn:   '2027년 6월 예정',
  moveInDate: '2027-06-01',
  totalUnits: 477,

  /* 동별 세대수 — 합계 477세대 · 동별 배분은 잠정(공고문 확인 필요) */
  dongs: [
    ['101', 120], ['102', 119], ['103', 119], ['104', 119]
  ],

  types: [
    { t:'84㎡A', u:210 },
    { t:'84㎡B', u:150 },
    { t:'101㎡', u:80 },
    { t:'115㎡', u:37 }
  ],

  progress: 35,
  progressNote: '지상 골조 진행중 (2026년 9월 기준)',

  agree:
    '본인은 위 아파트의 분양계약자로서, 입주예정자협의회의 구성 및 운영, ' +
    '시공사·시행사에 대한 하자 및 품질 관련 협의, 협의회 회의에서의 의결권 행사에 관한 ' +
    '일체의 권한을 입주예정자협의회에 위임합니다. 본 전자서명은 ' +
    '「전자문서 및 전자거래 기본법」에 따라 서면 위임장과 동일한 효력을 가집니다.',

  meeting:      '전체회의',
  meetingShort: '회의',
  meetingNo:    '제1차 정기회의',
  quorum: 50,
  noticeDays: 14,

  heroLight: true,
  theme: { acc:'#1B5E4A', acc2:'#3A8C70', ink:'#07160F', ink2:'#12261C', glow:'rgba(58,140,112,.34)' },

  worker: 'https://trepark-jl.treparkjl.workers.dev',
  repo:   'chuncheon-atera',
  demo: false,
  pin:  '1234'
};
