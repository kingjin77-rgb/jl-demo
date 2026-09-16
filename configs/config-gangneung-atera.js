/* 강릉 아테라 입주예정자협의회 — 단지 설정
   동 수는 확인되었고 동별 배분은 균등 배분입니다. 공고문 확인 후 교체하십시오. */
window.CONFIG = {
  type: 'newbuild',

  apt:      '강릉 아테라',
  org:      '강릉 아테라 입주예정자협의회',
  emblem:   '강',
  address:  '강원특별자치도 강릉시 회산동 일원',
  builder:  '금호건설(주)',
  owner:    '(주)아테라씨씨',
  moveIn:   '2027년 4월 예정',
  moveInDate: '2027-04-01',
  totalUnits: 329,

  /* 동별 세대수 — 합계 329세대 */
  dongs: [
    ['101', 110], ['102', 110], ['103', 109]
  ],

  types: [
    { t:'84㎡', u:180 },
    { t:'101㎡', u:89 },
    { t:'134㎡', u:40 },
    { t:'166㎡', u:20 }
  ],

  progress: 40,
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
  theme: { acc:'#1C4E80', acc2:'#3E7CB8', ink:'#061423', ink2:'#0F2540', glow:'rgba(62,124,184,.34)' },

  worker: 'https://trepark-jl.treparkjl.workers.dev',
  repo:   'gangneung-atera',
  demo: false,
  pin:  '1234'
};
