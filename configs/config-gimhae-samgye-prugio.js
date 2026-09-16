/* 김해 삼계 푸르지오 센트럴파크 입주예정자협의회 — 단지 설정
   동 수는 확인되었고 동별 배분은 균등 배분입니다. 공고문 확인 후 교체하십시오. */
window.CONFIG = {
  type: 'newbuild',

  apt:      '김해 삼계 푸르지오 센트럴파크',
  org:      '김해 삼계 푸르지오 센트럴파크 입주예정자협의회',
  emblem:   '김',
  address:  '경상남도 김해시 삼계동 일원',
  builder:  '대우건설(주)',
  owner:    '대우건설(주)',
  moveIn:   '2027년 4월 예정',
  moveInDate: '2027-04-01',
  totalUnits: 630,

  /* 동별 세대수 — 합계 630세대 */
  dongs: [
    ['101', 105], ['102', 105], ['103', 105], ['104', 105],
    ['105', 105], ['106', 105]
  ],

  types: [
    { t:'59㎡', u:150 },
    { t:'75㎡', u:120 },
    { t:'84㎡A', u:240 },
    { t:'84㎡B', u:120 }
  ],

  progress: 45,
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
  theme: { acc:'#0E7C5A', acc2:'#2FA47C', ink:'#04140F', ink2:'#0C2A20', glow:'rgba(47,164,124,.34)' },

  worker: 'https://trepark-jl.treparkjl.workers.dev',
  repo:   'gimhae-samgye-prugio',
  demo: false,
  pin:  '1234'
};
