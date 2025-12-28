import { Card, Era, GameState, Leader, MapState } from './types';

// --- VISUAL ASSETS (Unsplash Source IDs) ---
const IMAGES = {
  WAR: 'https://images.unsplash.com/photo-1598556776374-184918a22129?q=80&w=600&auto=format&fit=crop', // Sword/Dark
  PALACE: 'https://images.unsplash.com/photo-1549484961-0592873199ce?q=80&w=600&auto=format&fit=crop', // Mosque/Arch
  REVOLT: 'https://images.unsplash.com/photo-1620662766737-234b3f811564?q=80&w=600&auto=format&fit=crop', // Fire/Smoke
  ECONOMY: 'https://images.unsplash.com/photo-1629814406001-987827878696?q=80&w=600&auto=format&fit=crop', // Gold/Texture
  PAPER: 'https://images.unsplash.com/photo-1585365576721-e00f576e271c?q=80&w=600&auto=format&fit=crop', // Old Paper
  SEA: 'https://images.unsplash.com/photo-1500320821405-8fc1732209ca?q=80&w=600&auto=format&fit=crop', // Dark Sea
  MODERN: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop', // Abstract Tech
  CROWD: 'https://images.unsplash.com/photo-1531651008558-ed1740375b39?q=80&w=600&auto=format&fit=crop' // People
};

const assignImage = (card: Card): string => {
  const r = card.role.toLowerCase();
  const t = card.text.toLowerCase();
  
  // Specific checks
  if (t.includes('deniz') || t.includes('gemi') || t.includes('donanma')) return IMAGES.SEA;
  if (t.includes('savaş') || t.includes('ordu') || t.includes('asker') || r.includes('komutan')) return IMAGES.WAR;
  if (t.includes('isyan') || t.includes('ayaklanma') || t.includes('darbe')) return IMAGES.REVOLT;
  if (t.includes('para') || t.includes('vergi') || t.includes('ekonomi') || t.includes('hazien')) return IMAGES.ECONOMY;
  if (t.includes('antlaşma') || t.includes('ferman') || t.includes('anayasa')) return IMAGES.PAPER;
  if (card.minYear && card.minYear > 1950) return IMAGES.MODERN;
  
  // Role based fallbacks
  if (r.includes('sultan') || r.includes('padişah') || r.includes('vezir')) return IMAGES.PALACE;
  if (r.includes('halk') || r.includes('köylü')) return IMAGES.CROWD;
  
  return IMAGES.PALACE; // Default
};

// --- LEADERS (Kronolojik Sıra) ---
export const LEADERS: Leader[] = [
  // KURULUŞ
  { name: 'Osman Bey', startYear: 1299, endYear: 1326, title: 'Bey', era: Era.FOUNDATION, mapState: 'small', description: 'Bir rüya ile başlayan devlet.' },
  { name: 'Orhan Gazi', startYear: 1326, endYear: 1362, title: 'Sultan', era: Era.FOUNDATION, mapState: 'growing', description: 'Bursa\'nın fethi ve ilk akçe.' },
  { name: 'I. Murad', startYear: 1362, endYear: 1389, title: 'Hüdavendigar', era: Era.FOUNDATION, mapState: 'growing', description: 'Rumeli\'ye geçiş ve şehadet.' },
  { name: 'Yıldırım Bayezid', startYear: 1389, endYear: 1402, title: 'Sultan', era: Era.FOUNDATION, mapState: 'growing', description: 'Niğbolu zaferi ve Ankara hüznü.' },
  { name: 'Çelebi Mehmed', startYear: 1413, endYear: 1421, title: 'Sultan', era: Era.FOUNDATION, mapState: 'small', description: 'Devletin ikinci kurucusu.' },
  { name: 'II. Murad', startYear: 1421, endYear: 1451, title: 'Sultan', era: Era.FOUNDATION, mapState: 'growing', description: 'Varna zaferi ve ilim.' },
  
  // YÜKSELME
  { name: 'Fatih Sultan Mehmed', startYear: 1451, endYear: 1481, title: 'Fatih', era: Era.RISE, mapState: 'growing', description: 'Bir çağ açıp bir çağ kapayan.' },
  { name: 'II. Bayezid', startYear: 1481, endYear: 1512, title: 'Veli', era: Era.RISE, mapState: 'growing', description: 'Sofu Sultan, Cem Sultan olayı.' },
  { name: 'Yavuz Sultan Selim', startYear: 1512, endYear: 1520, title: 'Yavuz', era: Era.RISE, mapState: 'peak', description: '8 yılda 80 yıllık iş.' },
  { name: 'Kanuni Sultan Süleyman', startYear: 1520, endYear: 1566, title: 'Muhteşem', era: Era.RISE, mapState: 'peak', description: 'Cihan padişahı.' },
  { name: 'II. Selim', startYear: 1566, endYear: 1574, title: 'Sarı', era: Era.RISE, mapState: 'peak', description: 'Ordunun başında sefere çıkmayan ilk sultan.' },
  { name: 'III. Murad', startYear: 1574, endYear: 1595, title: 'Sultan', era: Era.RISE, mapState: 'peak', description: 'Doğuda en geniş sınırlar.' },

  // DURAKLAMA
  { name: 'I. Ahmed', startYear: 1603, endYear: 1617, title: 'Sultan', era: Era.STAGNATION, mapState: 'stagnant', description: 'Kafes sistemi ve Sultanahmet.' },
  { name: 'IV. Murad', startYear: 1623, endYear: 1640, title: 'Bağdat Fatihi', era: Era.STAGNATION, mapState: 'stagnant', description: 'Demir yumruk ve yasaklar.' },
  { name: 'IV. Mehmed', startYear: 1648, endYear: 1687, title: 'Avcı', era: Era.STAGNATION, mapState: 'stagnant', description: 'En uzun saltanat, Viyana bozgunu.' },
  
  // GERİLEME
  { name: 'III. Ahmed', startYear: 1703, endYear: 1730, title: 'Sultan', era: Era.DECLINE, mapState: 'shrinking', description: 'Lale Devri\'nin estetik sultanı.' },
  { name: 'I. Mahmud', startYear: 1730, endYear: 1754, title: 'Sultan', era: Era.DECLINE, mapState: 'shrinking', description: 'Batı tarzı ilk askeri ıslahatlar.' },
  { name: 'III. Selim', startYear: 1789, endYear: 1807, title: 'Bestekar', era: Era.DISSOLUTION, mapState: 'shrinking', description: 'Nizam-ı Cedid ve Kabakçı isyanı.' },
  
  // DAĞILMA
  { name: 'II. Mahmud', startYear: 1808, endYear: 1839, title: 'Adli', era: Era.DISSOLUTION, mapState: 'shrinking', description: 'Gavur Padişah lakaplı reformist.' },
  { name: 'Abdülmecid', startYear: 1839, endYear: 1861, title: 'Sultan', era: Era.DISSOLUTION, mapState: 'shrinking', description: 'Tanzimat ve Islahat fermanları.' },
  { name: 'II. Abdülhamid', startYear: 1876, endYear: 1909, title: 'Ulu Hakan', era: Era.DISSOLUTION, mapState: 'shrinking', description: 'Denge siyaseti ve eğitim hamlesi.' },
  { name: 'V. Mehmed Reşad', startYear: 1909, endYear: 1918, title: 'Sultan', era: Era.DISSOLUTION, mapState: 'shrinking', description: 'İttihatçıların gölgesinde Cihan Harbi.' },
  { name: 'VI. Mehmed Vahdettin', startYear: 1918, endYear: 1922, title: 'Son Padişah', era: Era.DISSOLUTION, mapState: 'shrinking', description: 'İmparatorluğun hazin sonu.' },

  // CUMHURİYET
  { name: 'Mustafa Kemal Atatürk', startYear: 1923, endYear: 1938, title: 'Ebedi Şef', era: Era.REPUBLIC_EARLY, mapState: 'republic', description: 'Türkiye Cumhuriyeti\'nin kurucusu.' },
  { name: 'İsmet İnönü', startYear: 1938, endYear: 1950, title: 'Milli Şef', era: Era.REPUBLIC_EARLY, mapState: 'republic', description: 'II. Dünya Savaşı diplomasisi.' },
  { name: 'Adnan Menderes', startYear: 1950, endYear: 1960, title: 'Başbakan', era: Era.REPUBLIC_MULTI, mapState: 'republic', description: 'Demokrasiye geçiş ve tarım kalkınması.' },
  { name: 'Cemal Gürsel', startYear: 1960, endYear: 1966, title: 'Cumhurbaşkanı', era: Era.REPUBLIC_MULTI, mapState: 'republic', description: 'Darbe sonrası toparlanma.' },
  { name: 'Süleyman Demirel', startYear: 1965, endYear: 1980, title: 'Başbakan', era: Era.REPUBLIC_MULTI, mapState: 'republic', description: 'Büyük Türkiye, Barajlar ve koalisyonlar.' }, // Yıllar basitleştirildi
  { name: 'Bülent Ecevit', startYear: 1974, endYear: 1979, title: 'Başbakan', era: Era.REPUBLIC_MULTI, mapState: 'republic', description: 'Kıbrıs Barış Harekatı, Karaoğlan.' },
  { name: 'Kenan Evren', startYear: 1980, endYear: 1983, title: 'Devlet Başkanı', era: Era.REPUBLIC_MULTI, mapState: 'republic', description: '12 Eylül rejimi.' },
  { name: 'Turgut Özal', startYear: 1983, endYear: 1993, title: 'Başbakan/CB', era: Era.REPUBLIC_MULTI, mapState: 'republic', description: 'Türkiye\'nin dışa açılması.' },
  { name: 'Tansu Çiller', startYear: 1993, endYear: 1996, title: 'Başbakan', era: Era.REPUBLIC_MULTI, mapState: 'republic', description: 'İlk kadın başbakan, ekonomik krizler.' },
  { name: 'Necmettin Erbakan', startYear: 1996, endYear: 1997, title: 'Başbakan', era: Era.REPUBLIC_MULTI, mapState: 'republic', description: '28 Şubat süreci.' },
  { name: 'Bülent Ecevit (DSP)', startYear: 1999, endYear: 2002, title: 'Başbakan', era: Era.MODERN, mapState: 'republic', description: 'Deprem ve ekonomik kriz.' },
  { name: 'R. Tayyip Erdoğan', startYear: 2003, endYear: 2025, title: 'Başbakan/CB', era: Era.MODERN, mapState: 'republic', description: 'Yeni Türkiye vizyonu.' },
];

export const INITIAL_STATE: GameState = {
  stats: { people: 50, military: 50, economy: 50, authority: 50 },
  hiddenStats: { coupRisk: 0, rebellionRisk: 0, corruption: 0, spyInfluence: 0 },
  year: 1299,
  currentLeader: LEADERS[0],
  turnCount: 1,
  currentCard: null,
  gameOver: false,
  gameOverReason: '',
  gameOverTitle: '',
  delayedQueue: [],
  history: [],
};

const e = (p=0, m=0, ec=0, a=0, cr=0, rr=0, cor=0, spy=0) => ({
  people: p, military: m, economy: ec, authority: a,
  coupRisk: cr, rebellionRisk: rr, corruption: cor, spyInfluence: spy
});

// --- RAW CARD DATA ---
const RAW_CARDS: Card[] = [
  // ... (Same card data as before, but without image property hardcoded)
  // --- KURULUŞ DÖNEMİ (1299-1453) ---
  {
    id: 'k_seyh', character: 'Şeyh Edebali', role: 'Manevi Rehber',
    text: 'Ey Oğul! İnsanı yaşat ki devlet yaşasın.',
    leftChoice: 'Sert olacağım.', rightChoice: 'Adil olacağım.',
    leftEffects: e(-10, 10, 0, 10, 0, 10), rightEffects: e(15, -5, 5, 5),
    minYear: 1299, maxYear: 1320
  },
  {
    id: 'k_tekfur', character: 'Bilecik Tekfuru', role: 'Bizanslı',
    text: 'Düğünüme davetlisin Osman Bey. Gelini almak ister misin?',
    leftChoice: 'Tuzak bu!', rightChoice: 'Kaleyi fethet.',
    leftEffects: e(0, 0, -5, -5), rightEffects: e(5, 10, 10, 10),
    minYear: 1299, maxYear: 1320
  },
  {
    id: 'k_orhan_akce', character: 'Alaeddin Paşa', role: 'Vezir',
    text: 'Beyim, kendi adımıza gümüş para (akçe) bastırmalıyız. Bağımsızlık alametidir.',
    leftChoice: 'Erken daha.', rightChoice: 'Bastır.',
    leftEffects: e(0, 0, -5, -5), rightEffects: e(5, 0, 10, 15),
    minYear: 1326, maxYear: 1330
  },
  {
    id: 'k_kare', character: 'Karesioğulları', role: 'Beylik',
    text: 'İç karışıklık yaşıyoruz. Bize katılmak için yardım edin.',
    leftChoice: 'Bırak yesinler.', rightChoice: 'Donanmayı al.',
    leftEffects: e(0, 0, 0, 0), rightEffects: e(0, 15, 5, 5),
    minYear: 1340, maxYear: 1350
  },
  {
    id: 'k_rumeli', character: 'Süleyman Paşa', role: 'Şehzade',
    text: 'Sallarla karşıya geçip Çimpe Kalesi\'ni alabilirim.',
    leftChoice: 'Tehlikeli.', rightChoice: 'Avrupa\'ya geç!',
    leftEffects: e(0, 0, 0, -5), rightEffects: e(5, 10, 0, 10),
    minYear: 1350, maxYear: 1360
  },
  {
    id: 'k_yeniceri', character: 'Çandarlı Kara Halil', role: 'Kazasker',
    text: 'Hristiyan esirlerden daimi bir ordu kuralım (Pençik/Devşirme).',
    leftChoice: 'Töreye aykırı.', rightChoice: 'Ocağı kur.',
    leftEffects: e(5, -10, 0, -5), rightEffects: e(-5, 20, -5, 15, 5),
    minYear: 1360, maxYear: 1370
  },
  {
    id: 'k_kosova', character: 'Miloş Obiliç', role: 'Sırp Şövalyesi',
    text: 'Sultanım, size biat etmek için yaklaşıyorum... (Hançer saklıyor)',
    leftChoice: 'Yaklaştırma.', rightChoice: 'Huzura al.',
    leftEffects: e(0, 0, 0, 5), rightEffects: e(-10, 5, 0, -20, 0, 0, 0, 0),
    minYear: 1389, maxYear: 1389, yearJump: 1
  },
  {
    id: 'k_timur', character: 'Timur Lenk', role: 'Emir',
    text: 'Anadolu beyleri otağıma sığındı. Mektuplarıma küstahça cevap verme Bayezid!',
    leftChoice: 'Savaş meydanına!', rightChoice: 'Alttan al.',
    leftEffects: e(-10, -20, -20, -20, 0, 20), rightEffects: e(-5, -5, -5, -10, 10),
    minYear: 1400, maxYear: 1402
  },
  {
    id: 'k_fetret', character: 'Şehzade Musa', role: 'Kardeş',
    text: 'Edirne\'de ben sultanım. Çekil aradan Mehmed!',
    leftChoice: 'Savaş.', rightChoice: 'Bölüşelim.',
    leftEffects: e(-5, 5, -5, 10, 0, -10), rightEffects: e(5, -10, -10, -10, 0, 20),
    minYear: 1402, maxYear: 1413
  },
  {
    id: 'k_varna', character: 'Papa IV. Eugenius', role: 'Düşman',
    text: 'Edirne-Segedin antlaşmasını bozduk! Haçlılar geliyor.',
    leftChoice: 'Tahtı oğluma bıraktım.', rightChoice: 'Ordunun başına geç.',
    leftEffects: e(-10, -10, 0, -10, 10), rightEffects: e(10, 15, -5, 15),
    minYear: 1444, maxYear: 1444
  },
  {
    id: 'y_urban', character: 'Urban Usta', role: 'Mühendis',
    text: 'Surları delecek devasa toplar dökebilirim Sultanım. Ama pahalı.',
    leftChoice: 'Hazineyi aç.', rightChoice: 'Gerek yok.',
    leftEffects: e(0, 10, -15, 5), rightEffects: e(0, -10, 5, -5),
    minYear: 1451, maxYear: 1453
  },
  {
    id: 'y_fetih', character: 'Bizans İmparatoru', role: 'Düşman',
    text: 'Haliç\'e zincir gerdik. Giremezsin Türk!',
    leftChoice: 'Gemileri karadan yürüt.', rightChoice: 'Kuşatmayı kaldır.',
    leftEffects: e(15, 10, -10, 20), rightEffects: e(-10, -5, 5, -20, 10),
    minYear: 1453, maxYear: 1453, yearJump: 2
  },
  {
    id: 'y_kanun', character: 'Fatih Sultan Mehmed', role: 'Padişah',
    text: 'Devletin bekası için kardeş katli vaciptir (Kanunname-i Ali Osman).',
    leftChoice: 'İmzala.', rightChoice: 'Reddet.',
    leftEffects: e(-5, 10, 0, 20, 0, -20), rightEffects: e(5, -5, 0, -10, 15, 20),
    minYear: 1470, maxYear: 1480
  },
  {
    id: 'y_cem', character: 'Cem Sultan', role: 'Şehzade',
    text: 'Bursa\'da hutbe okuttum. Taht benim hakkımdır Bayezid!',
    leftChoice: 'Sürgüne zorla.', rightChoice: 'Savaş.',
    leftEffects: e(0, -5, -10, -5, 0, 10, 0, 10), rightEffects: e(-5, -10, -5, 5),
    minYear: 1481, maxYear: 1495
  },
  {
    id: 'y_safevi', character: 'Şah İsmail', role: 'Safevi',
    text: 'Anadolu\'da Şiiliği yayıyorum. Müritlerim ayaklanıyor.',
    leftChoice: 'Mektup yaz.', rightChoice: 'Çaldıran\'a yürü.',
    leftEffects: e(0, 0, 0, -5, 0, 15), rightEffects: e(-5, 15, -5, 15, 0, -15),
    minYear: 1512, maxYear: 1514
  },
  {
    id: 'y_misir', character: 'Memlük Sultanı', role: 'Rakip',
    text: 'Hicaz yolları bizim kontrolümüzde.',
    leftChoice: 'Ridaniye\'ye geç.', rightChoice: 'Bekle.',
    leftEffects: e(5, 10, 20, 20), rightEffects: e(0, 0, -5, -5),
    minYear: 1516, maxYear: 1517
  },
  {
    id: 'y_mohac', character: 'Macar Kralı', role: 'Düşman',
    text: 'Elçini öldürdük Süleyman. Ne yapabilirsin?',
    leftChoice: '2 saatte yok et.', rightChoice: 'Protesto et.',
    leftEffects: e(5, 15, -10, 15), rightEffects: e(-10, -5, 0, -10),
    minYear: 1526, maxYear: 1526
  },
  {
    id: 'y_viyana', character: 'Pargalı İbrahim', role: 'Sadrazam',
    text: 'Kış yaklaşıyor Sultanım. Viyana surları çok sağlam.',
    leftChoice: 'Kuşatmayı kaldır.', rightChoice: 'Sonuna kadar!',
    leftEffects: e(0, 0, 5, -5), rightEffects: e(-10, -15, -10, -5),
    minYear: 1529, maxYear: 1529
  },
  {
    id: 'y_kapit', character: 'Fransız Elçisi', role: 'Diplomat',
    text: 'Almanlara karşı ittifak yapalım. Bize ticari ayrıcalık (Kapitülasyon) verin.',
    leftChoice: 'Ver (Geçici).', rightChoice: 'Reddet.',
    leftEffects: e(0, 0, 5, 5, 0, 0, 5), rightEffects: e(0, 0, -5, -5),
    minYear: 1535, maxYear: 1540
  },
  {
    id: 'y_mustafa', character: 'Rüstem Paşa', role: 'Sadrazam',
    text: 'Şehzade Mustafa askerin sevgilisi oldu. Tahtınızı istiyor olabilir.',
    leftChoice: 'Oğlumu boğdur.', rightChoice: 'İnanma.',
    leftEffects: e(-15, 10, 0, 10, 0, -10), rightEffects: e(15, -10, 0, -5, 10),
    minYear: 1553, maxYear: 1553
  },
  {
    id: 'y_kibris', character: 'Lala Mustafa Paşa', role: 'Serdar',
    text: 'Kıbrıs korsan yatağı oldu. Venedik\'ten almalıyız.',
    leftChoice: 'Sefer eyle.', rightChoice: 'Donanmayı yorma.',
    leftEffects: e(5, 10, -10, 10), rightEffects: e(-5, -5, 5, -5),
    minYear: 1570, maxYear: 1571
  },
  {
    id: 'y_sokullu', character: 'Sokullu Mehmed Paşa', role: 'Sadrazam',
    text: 'Don-Volga kanalı projesi ile Rusları durdurabiliriz.',
    leftChoice: 'Destekle.', rightChoice: 'Gereksiz.',
    leftEffects: e(0, 5, -10, 5), rightEffects: e(0, -5, 5, -10, 0, 0, 0, 10),
    minYear: 1569, maxYear: 1575
  },
  {
    id: 'd_kafes', character: 'I. Ahmed', role: 'Sultan',
    text: 'Kardeş katlini durdurup "Ekber ve Erşed" sistemini getireceğim.',
    leftChoice: 'Kabul.', rightChoice: 'Eski usül.',
    leftEffects: e(5, -5, 0, -5, 10), rightEffects: e(-5, 5, 0, 5, 0, 10),
    minYear: 1603, maxYear: 1610
  },
  {
    id: 'd_genc_osman', character: 'II. Osman', role: 'Sultan',
    text: 'Yeniçeriler yozlaştı. Hacca gidip Anadolu\'dan yeni ordu toplayacağım.',
    leftChoice: 'Gizli tut.', rightChoice: 'Duyur.',
    leftEffects: e(0, 5, 0, 5), rightEffects: e(0, -20, 0, -20, 20),
    minYear: 1618, maxYear: 1622
  },
  {
    id: 'd_tütün', character: 'IV. Murad', role: 'Sultan',
    text: 'İstanbul yangın yeri! Tütün ve kahveyi yasaklıyorum. Gece feneri olmayanı vurun.',
    leftChoice: 'Yasakla.', rightChoice: 'Halkı sıkma.',
    leftEffects: e(-10, 5, 0, 20, -5), rightEffects: e(5, -5, 0, -10, 10),
    minYear: 1630, maxYear: 1640
  },
  {
    id: 'd_tarhuncu', character: 'Tarhuncu Ahmed', role: 'Sadrazam',
    text: 'Bütçe açık veriyor. Saray masraflarını kısmalıyız.',
    leftChoice: 'Kabul.', rightChoice: 'İdam et.',
    leftEffects: e(5, 0, 15, -5, 0, 0, -10), rightEffects: e(-5, 0, -15, 5, 0, 0, 10),
    minYear: 1650, maxYear: 1655
  },
  {
    id: 'd_koprulu', character: 'Köprülü Mehmed', role: 'Vezir',
    text: 'Sadrazam olurum ama şartlarım var. İşime karışılmayacak.',
    leftChoice: 'Kabul.', rightChoice: 'Haddini bil.',
    leftEffects: e(0, 10, 10, 15, -10), rightEffects: e(0, -10, -10, -10, 10),
    minYear: 1656, maxYear: 1660
  },
  {
    id: 'd_viyana2', character: 'Merzifonlu Kara Mustafa', role: 'Sadrazam',
    text: 'Viyana düşmek üzere. Yağma yapmayalım, teslim olsunlar.',
    leftChoice: 'Saldır!', rightChoice: 'Bekle.',
    leftEffects: e(0, -10, -5, -5), rightEffects: e(-10, -30, -15, -20),
    minYear: 1683, maxYear: 1683
  },
  {
    id: 'd_karlofca', character: 'Diplomat', role: 'Elçi',
    text: 'Kutsal İttifak\'a yenildik. Macaristan\'ı verip barış imzalayalım.',
    leftChoice: 'Asla!', rightChoice: 'İmzala.',
    leftEffects: e(-5, -20, -10, -10, 0, 10), rightEffects: e(5, 0, 5, -15),
    minYear: 1699, maxYear: 1699
  },
  {
    id: 'g_lale', character: 'Nevşehirli Damat İbrahim', role: 'Sadrazam',
    text: 'Savaşlardan yorulduk. Saraylar yapalım, eğlenelim (Lale Devri).',
    leftChoice: 'İsraf.', rightChoice: 'Sefa sür.',
    leftEffects: e(5, 0, 5, 0), rightEffects: e(-10, -10, -15, -5, 0, 20),
    minYear: 1718, maxYear: 1730
  },
  {
    id: 'g_matbaa', character: 'İbrahim Müteferrika', role: 'Macar Devşirme',
    text: 'Avrupa\'da matbaa var. Kitap basmak için izin verin.',
    leftChoice: 'Hattatlar kızar.', rightChoice: 'Kurulsun.',
    leftEffects: e(-5, 0, 0, -5), rightEffects: e(5, 0, 5, 0, 0, 5),
    minYear: 1727, maxYear: 1730
  },
  {
    id: 'g_rus', character: 'Katerina', role: 'Çariçe',
    text: 'Kırım bağımsız olmalı (Küçük Kaynarca).',
    leftChoice: 'Savaş.', rightChoice: 'İmzala.',
    leftEffects: e(-5, -15, -10, 0), rightEffects: e(-10, 0, -5, -20),
    minYear: 1774, maxYear: 1774
  },
  {
    id: 'g_nizam', character: 'III. Selim', role: 'Sultan',
    text: 'Yeniçeriler talim yapmıyor. Nizam-ı Cedid ordusunu kurmalıyız.',
    leftChoice: 'Ocağı kızdırma.', rightChoice: 'Kur.',
    leftEffects: e(0, -5, 0, -5), rightEffects: e(0, 10, -10, 5, 15),
    minYear: 1793, maxYear: 1807
  },
  {
    id: 'g_sened', character: 'Alemdar Mustafa Paşa', role: 'Ayan',
    text: 'Ayanlarla Sened-i İttifak imzalayın. Otoriteniz kısıtlanacak ama destek alacaksınız.',
    leftChoice: 'Yırt at.', rightChoice: 'İmzala.',
    leftEffects: e(0, 0, 0, 10, 0, 10), rightEffects: e(0, 5, 0, -10),
    minYear: 1808, maxYear: 1808
  },
  {
    id: 'g_yunan', character: 'Lord Byron', role: 'Şair',
    text: 'Yunanistan bağımsızlık istiyor. Avrupa onları destekliyor.',
    leftChoice: 'Bastır.', rightChoice: 'Navarin\'e dikkat.',
    leftEffects: e(-5, -10, -5, 0), rightEffects: e(0, -15, 0, -5),
    minYear: 1821, maxYear: 1827
  },
  {
    id: 'g_misir_vali', character: 'Kavalalı Mehmed Ali', role: 'Vali',
    text: 'Oğlum İbrahim Paşa Kütahya\'ya dayandı. Şam ve Adana\'yı da isterim!',
    leftChoice: 'Rus\'tan yardım iste.', rightChoice: 'Savaş.',
    leftEffects: e(-5, 0, 0, -10, 0, 0, 0, 20), rightEffects: e(-10, -20, -10, -10),
    minYear: 1833, maxYear: 1839
  },
  {
    id: 'g_balta', character: 'İngiliz Elçisi', role: 'Diplomat',
    text: 'Mısır sorununda yardım ederiz ama gümrükleri sıfırlayın (Balta Limanı).',
    leftChoice: 'Yerli sanayi biter.', rightChoice: 'İmzala.',
    leftEffects: e(0, -10, 5, 10), rightEffects: e(5, 10, -30, -5, 0, 0, 0, 30),
    minYear: 1838, maxYear: 1838
  },
  {
    id: 'dg_tanzimat', character: 'Mustafa Reşit Paşa', role: 'Hariciye Nazırı',
    text: 'Gülhane Parkı\'nda ferman okuyalım. Herkes kanun önünde eşit olsun.',
    leftChoice: 'Gelenek bozulur.', rightChoice: 'İlan et.',
    leftEffects: e(-5, 0, 0, -5), rightEffects: e(10, 0, -5, 5, -5),
    minYear: 1839, maxYear: 1839
  },
  {
    id: 'dg_kirim', character: 'Florence Nightingale', role: 'Hemşire',
    text: 'Ruslarla savaştayız. İngiliz ve Fransızlar yanımızda. İlk dış borcu alalım mı?',
    leftChoice: 'Borç alma.', rightChoice: 'Al.',
    leftEffects: e(0, -10, 0, 5), rightEffects: e(0, 10, 10, -5, 0, 0, 0, 10),
    minYear: 1853, maxYear: 1856
  },
  {
    id: 'dg_mesrutiyet', character: 'Mithat Paşa', role: 'Jön Türk',
    text: 'Kanun-i Esasi hazır. Meclis-i Mebusan\'ı açın Sultanım.',
    leftChoice: 'Sürgün.', rightChoice: 'Aç.',
    leftEffects: e(-5, 0, 0, 10, 5), rightEffects: e(10, 0, -5, -10),
    minYear: 1876, maxYear: 1876
  },
  {
    id: 'dg_93harbi', character: 'Gazi Osman Paşa', role: 'Komutan',
    text: 'Plevne\'de direniyoruz. Ruslar Yeşilköy\'e kadar geldi!',
    leftChoice: 'Teslim ol.', rightChoice: 'Ayastefanos?',
    leftEffects: e(-10, -20, -10, -20), rightEffects: e(-5, -10, -5, -20),
    minYear: 1877, maxYear: 1878
  },
  {
    id: 'dg_duyun', character: 'Alacaklı Devletler', role: 'Konsorsiyum',
    text: 'Borçlarınızı ödeyemiyorsunuz. Muharrem Kararnamesi ile gelirlere el koyuyoruz.',
    leftChoice: 'Reddet.', rightChoice: 'Düyun-u Umumiye.',
    leftEffects: e(0, -20, -10, 0, 0, 0, 0, 50), rightEffects: e(-10, 0, 5, -20, 0, 0, 0, 30),
    minYear: 1881, maxYear: 1881
  },
  {
    id: 'dg_hicaz', character: 'II. Abdülhamid', role: 'Sultan',
    text: 'Müslümanların desteği için Hicaz Demiryolu\'nu yapmalıyız. Almanlar yardım edecek.',
    leftChoice: 'Pahalı.', rightChoice: 'Yapılsın.',
    leftEffects: e(0, 0, 5, -5), rightEffects: e(10, 5, -10, 10, 0, 0, 0, 10),
    minYear: 1900, maxYear: 1908
  },
  {
    id: 'dg_31mart', character: 'Derviş Vahdeti', role: 'İsyancı',
    text: 'Şeriat isterük! Meclisi basın, alaylı askerleri kışkırtın.',
    leftChoice: 'Bastır (Hareket Ordusu).', rightChoice: 'Taviz ver.',
    leftEffects: e(5, 10, 0, 10, -20), rightEffects: e(-10, -10, -10, -20, 20),
    minYear: 1909, maxYear: 1909
  },
  {
    id: 'dg_trablus', character: 'Binbaşı Enver', role: 'Gönüllü',
    text: 'İtalyanlar Trablusgarp\'a çıktı. Gidip yerel halkı örgütleyelim.',
    leftChoice: 'Gemi yok, gitme.', rightChoice: 'Gizlice git.',
    leftEffects: e(-5, 0, 0, -5), rightEffects: e(5, 5, 0, 5),
    minYear: 1911, maxYear: 1911
  },
  {
    id: 'dg_balkan', character: 'Nazım Paşa', role: 'Harbiye Nazırı',
    text: 'Dört Balkan devleti birleşip saldırdı. Orduda siyaset var, emir komuta bozuk.',
    leftChoice: 'Edirne\'yi bırak.', rightChoice: 'Savun.',
    leftEffects: e(-20, -20, -10, -20, 10), rightEffects: e(-10, -10, -10, -10),
    minYear: 1912, maxYear: 1913
  },
  {
    id: 'dg_ww1', character: 'Enver Paşa', role: 'Başkomutan Vekili',
    text: 'Gobben ve Breslau gemileri bize sığındı. Rus limanlarını vuralım mı?',
    leftChoice: 'Hayır, tarafsız kal.', rightChoice: 'Ateş!',
    leftEffects: e(0, 0, 0, 0), rightEffects: e(-10, 20, -20, 0, 0, 0, 0, 20),
    minYear: 1914, maxYear: 1914
  },
  {
    id: 'dg_canakkale', character: 'Mustafa Kemal', role: 'Yarbay',
    text: 'Ben size taarruzu değil, ölmeyi emrediyorum!',
    leftChoice: 'Geri çekil.', rightChoice: 'Hücum!',
    leftEffects: e(-50, -50, -20, -50), rightEffects: e(20, 10, -10, 20),
    minYear: 1915, maxYear: 1915
  },
  {
    id: 'dg_mondros', character: 'Rauf Bey', role: 'Bakan',
    text: 'Ordular terhis edilecek, tüneller İtilaf devletlerine verilecek.',
    leftChoice: 'İmzala.', rightChoice: 'Reddet.',
    leftEffects: e(-20, -30, 0, -20, 0, 0, 0, 50), rightEffects: e(10, 10, -10, 10),
    minYear: 1918, maxYear: 1918
  },
  {
    id: 'dg_sevr', character: 'Damat Ferit', role: 'Sadrazam',
    text: 'Barış antlaşması (Sevr) çok ağır ama saltanatı korumak için mecburuz.',
    leftChoice: 'Asla kabul edilemez!', rightChoice: 'İmzala.',
    leftEffects: e(20, 20, 0, 20), rightEffects: e(-30, -30, -10, -50),
    minYear: 1920, maxYear: 1920
  },
  {
    id: 'c_lozan', character: 'İsmet Paşa', role: 'Delegasyon Başkanı',
    text: 'Kapitülasyonlar kalkmalı, tam bağımsızlık istiyoruz.',
    leftChoice: 'Taviz ver.', rightChoice: 'Rest çek (Dön).',
    leftEffects: e(0, 0, 10, -10, 0, 0, 0, 20), rightEffects: e(10, 0, -5, 20),
    minYear: 1923, maxYear: 1923
  },
  {
    id: 'c_sapka', character: 'Mustafa Kemal Atatürk', role: 'Cumhurbaşkanı',
    text: 'Medeni milletler gibi giyineceğiz. Fes kalkacak, şapka gelecek.',
    leftChoice: 'Halk hazır değil.', rightChoice: 'Devrim!',
    leftEffects: e(-5, 0, 0, -5), rightEffects: e(5, 0, 0, 10, 0, 10),
    minYear: 1925, maxYear: 1925
  },
  {
    id: 'c_alfabe', character: 'Mustafa Kemal Atatürk', role: 'Cumhurbaşkanı',
    text: 'Arap harfleri Türk diline uymuyor. Latin esaslı yeni Türk alfabesine geçeceğiz.',
    leftChoice: 'Çok zor.', rightChoice: 'Bir gecede.',
    leftEffects: e(0, 0, 0, -5), rightEffects: e(10, 0, -10, 10),
    minYear: 1928, maxYear: 1928
  },
  {
    id: 'c_ekonomi', character: 'Celal Bayar', role: 'İktisat Vekili',
    text: 'Özel sektör zayıf. Fabrikaları devlet kurmalı (Devletçilik).',
    leftChoice: 'Liberal kal.', rightChoice: 'Sümerbank\'ı kur.',
    leftEffects: e(0, 0, -5, 0), rightEffects: e(5, 5, 10, 5),
    minYear: 1930, maxYear: 1938
  },
  {
    id: 'c_hatay', character: 'Tayfur Sökmen', role: 'Hatay CB',
    text: 'Hatay anavatana katılmak istiyor. Fransa ile gerilebiliriz.',
    leftChoice: 'Bekle.', rightChoice: 'Ordu sınıra!',
    leftEffects: e(-5, 0, 0, -5), rightEffects: e(10, 5, 0, 10),
    minYear: 1938, maxYear: 1939
  },
  {
    id: 'c_ww2', character: 'İsmet İnönü', role: 'Milli Şef',
    text: 'Dünya yanıyor. Almanya ve Müttefikler bizi savaşa çekmek istiyor.',
    leftChoice: 'Savaşa gir.', rightChoice: 'Tarafsızlık.',
    leftEffects: e(-20, -30, -30, -10), rightEffects: e(-10, 0, -10, 10),
    minYear: 1939, maxYear: 1945
  },
  {
    id: 'c_cokparti', character: 'Nuri Demirağ', role: 'Sanayici',
    text: 'Tek parti yönetimi yordu. Milli Kalkınma Partisi\'ni kuruyorum.',
    leftChoice: 'Yasakla.', rightChoice: 'Demokrasiye geç.',
    leftEffects: e(-10, 0, 0, 5, 0, 10), rightEffects: e(10, 0, 5, -5),
    minYear: 1945, maxYear: 1946
  },
  {
    id: 'c_truman', character: 'ABD Başkanı', role: 'Müttefik',
    text: 'Sovyet tehdidine karşı yardım (Truman Doktrini) öneriyoruz. Üslerinizi açın.',
    leftChoice: 'Bağımsızlık!', rightChoice: 'Kabul et.',
    leftEffects: e(5, -10, -5, 5, 10), rightEffects: e(0, 10, 10, -5, 0, 0, 0, 20),
    minYear: 1947, maxYear: 1949
  },
  {
    id: 'cp_ezan', character: 'Adnan Menderes', role: 'Başbakan',
    text: 'Halk ezanın tekrar Arapça okunmasını istiyor.',
    leftChoice: 'Türkçe kalsın.', rightChoice: 'Arapça olsun.',
    leftEffects: e(-10, 0, 0, 5), rightEffects: e(10, 0, 0, -5),
    minYear: 1950, maxYear: 1950
  },
  {
    id: 'cp_kore', character: 'NATO', role: 'İttifak',
    text: 'NATO\'ya girmek istiyorsanız Kore\'ye asker gönderin.',
    leftChoice: 'Bizim savaşımız değil.', rightChoice: 'Tugay gönder.',
    leftEffects: e(5, 0, 0, 0), rightEffects: e(0, 5, 0, 5, 0, 0, 0, 10),
    minYear: 1950, maxYear: 1952
  },
  {
    id: 'cp_67eylul', character: 'Provokatör', role: 'Casus',
    text: 'Atatürk\'ün evine bomba atıldı haberi yayalım. Rum dükkanlarını yağmalatalım.',
    leftChoice: 'Dur de.', rightChoice: 'Göz yum.',
    leftEffects: e(5, 0, 0, 5), rightEffects: e(-10, 0, -20, -10, 0, 0, 0, 10),
    minYear: 1955, maxYear: 1955
  },
  {
    id: 'cp_darbe60', character: 'Alparslan Türkeş', role: 'Albay',
    text: 'Şartlar olgunlaştı. Ordu yönetime el koyuyor (27 Mayıs).',
    leftChoice: 'Anayasayı koru.', rightChoice: 'Teslim ol.',
    leftEffects: e(5, -20, 0, 0, 0, 20), rightEffects: e(-5, 10, -5, 10, -20),
    minYear: 1960, maxYear: 1960
  },
  {
    id: 'cp_devrim', character: 'Mühendisler', role: 'TCDD',
    text: 'İlk yerli otomobil "Devrim"i yaptık. Seri üretime geçelim mi?',
    leftChoice: 'Benzini yok, boşver.', rightChoice: 'Üret.',
    leftEffects: e(0, 0, 0, 0), rightEffects: e(5, 0, 10, 5),
    minYear: 1961, maxYear: 1962
  },
  {
    id: 'cp_6filo', character: 'Deniz Gezmiş', role: 'Öğrenci Lideri',
    text: 'Amerikan 6. Filosu Dolmabahçe\'de. Onları denize dökeceğiz!',
    leftChoice: 'Polisi gönder.', rightChoice: 'Karışma.',
    leftEffects: e(-5, 0, 0, 5, 0, 10), rightEffects: e(5, 0, 0, -5, 0, 0, 0, -10),
    minYear: 1968, maxYear: 1968
  },
  {
    id: 'cp_muhtira', character: 'Genelkurmay', role: 'Ordu',
    text: 'Hükümet anarşiyi önleyemiyor (12 Mart Muhtırası). İstifa et Demirel.',
    leftChoice: 'Diren.', rightChoice: 'Şapkamı alır giderim.',
    leftEffects: e(0, -10, 0, 0, 10), rightEffects: e(0, 5, 0, -5),
    minYear: 1971, maxYear: 1971
  },
  {
    id: 'cp_kibris', character: 'Bülent Ecevit', role: 'Başbakan',
    text: 'Ayşe tatile çıksın mı? (Kıbrıs Barış Harekatı)',
    leftChoice: 'Dünya ne der?', rightChoice: 'Çıkarma yap.',
    leftEffects: e(-5, 0, 0, -10), rightEffects: e(20, 10, -10, 10, 0, 0, 0, -10),
    minYear: 1974, maxYear: 1974
  },
  {
    id: 'cp_sag_sol', character: 'Karanlık Güçler', role: 'Provokatör',
    text: 'Sağ-sol çatışmasını körükleyelim. Günde 20 kişi ölsün.',
    leftChoice: 'Önlemler al.', rightChoice: 'İzle.',
    leftEffects: e(0, 0, 0, 5, -5), rightEffects: e(-10, 0, -10, -10, 20, 20),
    minYear: 1977, maxYear: 1979
  },
  {
    id: 'cp_darbe80', character: 'Kenan Evren', role: 'Genelkurmay Bşk.',
    text: 'Kaybolan devlet otoritesini yeniden tesis etmek için... (12 Eylül).',
    leftChoice: 'Demokrasi!', rightChoice: 'Netekim.',
    leftEffects: e(0, -20, 0, 0, 0, 20), rightEffects: e(-10, 20, 0, 20, -30, -30),
    minYear: 1980, maxYear: 1980
  },
  {
    id: 'cp_ozal', character: 'Turgut Özal', role: 'Başbakan',
    text: 'Döviz serbest olsun, turizm başlasın. Çağ atlayacağız.',
    leftChoice: 'Devletçi kal.', rightChoice: 'Dışa açıl.',
    leftEffects: e(0, 0, -5, 0), rightEffects: e(5, 0, 15, 0, 0, 0, 10),
    minYear: 1983, maxYear: 1990
  },
  {
    id: 'cp_gumruk', character: 'Tansu Çiller', role: 'Başbakan',
    text: 'Avrupa ile Gümrük Birliği\'ne girelim. Sanayimiz rekabete açılsın.',
    leftChoice: 'Erken.', rightChoice: 'İmzala.',
    leftEffects: e(0, 0, 0, 0), rightEffects: e(0, 0, 5, 0, 0, 0, 0, 10),
    minYear: 1995, maxYear: 1996
  },
  {
    id: 'cp_28subat', character: 'Genelkurmay', role: 'Ordu',
    text: 'İrtica başbakanlık konutunda! Post-modern bir uyarı verelim.',
    leftChoice: 'Dik dur.', rightChoice: 'İmza at.',
    leftEffects: e(5, -10, 0, 5, 20), rightEffects: e(-5, 10, 0, -5, -10),
    minYear: 1997, maxYear: 1997
  },
  {
    id: 'cp_deprem', character: 'Kızılay', role: 'STK',
    text: 'Marmara yıkıldı (17 Ağustos). Devlet enkaz altında.',
    leftChoice: 'Çaresiziz.', rightChoice: 'Yaraları sar.',
    leftEffects: e(-20, 0, -10, -10), rightEffects: e(-10, 0, -20, -5),
    minYear: 1999, maxYear: 1999
  },
  {
    id: 'cp_anayasa', character: 'Ahmet Necdet Sezer', role: 'Cumhurbaşkanı',
    text: 'Anayasa kitapçığını Başbakana fırlattım. Siyasi kriz!',
    leftChoice: 'Sakin ol.', rightChoice: 'Kriz patlasın.',
    leftEffects: e(0, 0, 0, 5), rightEffects: e(-10, 0, -30, -10),
    minYear: 2001, maxYear: 2001
  },
  {
    id: 'm_ab', character: 'AB Komisyonu', role: 'Brüksel',
    text: 'Müzakere tarihi için idamı kaldırın, reform yapın.',
    leftChoice: 'İşine bak.', rightChoice: 'Uyum yasaları.',
    leftEffects: e(5, 0, -5, 5, 0, 0, 0, -10), rightEffects: e(0, -5, 5, -5, 0, 0, 0, 10),
    minYear: 2002, maxYear: 2005
  },
  {
    id: 'm_para', character: 'Merkez Bankası', role: 'Bürokrat',
    text: 'Paradan 6 sıfırı atalım. Enflasyonla mücadele simgesi.',
    leftChoice: 'Kalsın.', rightChoice: 'At.',
    leftEffects: e(0, 0, -5, 0), rightEffects: e(5, 0, 5, 5),
    minYear: 2005, maxYear: 2005
  },
  {
    id: 'm_davos', character: 'R. Tayyip Erdoğan', role: 'Başbakan',
    text: 'Moderatör konuşmama izin vermiyor. "One Minute!"',
    leftChoice: 'Sus.', rightChoice: 'Terk et.',
    leftEffects: e(-5, 0, 0, -5), rightEffects: e(15, 0, 0, 10, 0, 0, 0, -10),
    minYear: 2009, maxYear: 2009
  },
  {
    id: 'm_gezi', character: 'Eylemciler', role: 'Halk',
    text: 'Parkta ağaçları kestirmeyiz! Olaylar büyüyor.',
    leftChoice: 'Polis müdahalesi.', rightChoice: 'Dinle.',
    leftEffects: e(-10, 5, -5, 5, 0, 10), rightEffects: e(5, -5, 0, -5),
    minYear: 2013, maxYear: 2013
  },
  {
    id: 'm_15temmuz', character: 'FETÖ', role: 'Hain',
    text: 'Köprüleri tuttuk. Yönetime el koyuyoruz!',
    leftChoice: 'Saklan.', rightChoice: 'Meydanlara in!',
    leftEffects: e(-20, -20, -20, -50, 50), rightEffects: e(20, 10, -10, 20, -50, 0, 0, -20),
    minYear: 2016, maxYear: 2016
  },
  {
    id: 'm_sistem', character: 'Devlet Bahçeli', role: 'Lider',
    text: 'Parlamenter sistem tıkandı. Cumhurbaşkanlığı Hükümet Sistemi\'ne geçelim.',
    leftChoice: 'Hayır.', rightChoice: 'Referandum.',
    leftEffects: e(0, 0, 0, 0), rightEffects: e(0, 0, 0, 10),
    minYear: 2017, maxYear: 2017
  },
  {
    id: 'm_pandemi', character: 'Fahrettin Koca', role: 'Bakan',
    text: 'Virüs geldi. Tam kapanma yapalım mı?',
    leftChoice: 'Ekonomi durur.', rightChoice: 'Kapan.',
    leftEffects: e(-10, 0, 5, -5), rightEffects: e(5, 0, -15, 5),
    minYear: 2020, maxYear: 2021
  },
  {
    id: 'm_togg', character: 'Mühendisler', role: 'TOGG',
    text: 'Yerli otomobil banttan iniyor. Şarj istasyonları yetersiz.',
    leftChoice: 'Erteleyin.', rightChoice: 'Yollara çıkar.',
    leftEffects: e(0, 0, 0, 0), rightEffects: e(5, 0, 5, 5),
    minYear: 2022, maxYear: 2023
  },
  {
    id: 'm_yuzyil', character: 'Seçmen', role: 'Halk',
    text: 'Cumhuriyetin 100. yılı. Türkiye Yüzyılı vizyonu.',
    leftChoice: 'Değişim.', rightChoice: 'İstikrar.',
    leftEffects: e(5, 0, 0, 0), rightEffects: e(0, 5, 0, 5),
    minYear: 2023, maxYear: 2023
  },
  {
    id: 'm_2025', character: 'Yapay Zeka', role: 'Gelecek',
    text: 'Teknoloji devrimi kapıda. Türkiye\'yi veri üssü yapalım mı?',
    leftChoice: 'Riskli.', rightChoice: 'Yatırım yap.',
    leftEffects: e(0, 0, 0, 0), rightEffects: e(0, 5, 10, 5),
    minYear: 2025, maxYear: 2025
  }
];

// --- PROCESSED CARDS (With Images) ---
export const CARDS = RAW_CARDS.map(card => ({
  ...card,
  image: assignImage(card)
}));
