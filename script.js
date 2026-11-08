// 0. إدارة اتصال الشبكة
function updateNetworkStatus() {
  const netBadge = document.getElementById('netStatus');
  const netText = document.getElementById('netStatusText');
  if (navigator.onLine) {
    netBadge.className = 'network-badge online';
    netText.textContent = 'النظام متصل وجاهز للاستجابة السحابية والفورية';
  } else {
    netBadge.className = 'network-badge offline';
    netText.textContent = '⚠️ وضع انقطاع الشبكة: المحرك المحلي نشط بكامل طاقته';
  }
}
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// 1. مؤقت الطوارئ وسجل الأحداث
let chronoTimer = null;
let chronoSeconds = 0;
let chronoRunning = false;

function toggleChrono() {
  const btn = document.getElementById('chronoToggleBtn');
  if (chronoRunning) {
    clearInterval(chronoTimer);
    chronoRunning = false;
    btn.innerText = 'استئناف';
  } else {
    chronoRunning = true;
    btn.innerText = 'إيقاف';
    chronoTimer = setInterval(() => {
      chronoSeconds++;
      const mins = String(Math.floor(chronoSeconds / 60)).padStart(2, '0');
      const secs = String(chronoSeconds % 60).padStart(2, '0');
      document.getElementById('chronoTimer').textContent = `${mins}:${secs}`;
    }, 1000);
  }
}

function resetChrono() {
  clearInterval(chronoTimer);
  chronoRunning = false;
  chronoSeconds = 0;
  document.getElementById('chronoTimer').textContent = '00:00';
  document.getElementById('chronoToggleBtn').innerText = 'بدء المؤقت';
  document.getElementById('chronoLogList').innerHTML = '<div style="text-align: center; color: var(--text-muted);">تم تصفير سجل الأحداث...</div>';
}

function logChronoEvent(eventName) {
  if (!chronoRunning && chronoSeconds === 0) toggleChrono();
  const mins = String(Math.floor(chronoSeconds / 60)).padStart(2, '0');
  const secs = String(chronoSeconds % 60).padStart(2, '0');
  const timeStr = `${mins}:${secs}`;
  
  const logList = document.getElementById('chronoLogList');
  if (logList.children[0]?.innerText?.includes('سجل الأحداث') || logList.children[0]?.innerText?.includes('تم تصفير')) {
    logList.innerHTML = '';
  }

  const item = document.createElement('div');
  item.className = 'chrono-log-item';
  item.innerHTML = `<span>⚡ ${eventName}</span><strong style="color:var(--accent); font-family:monospace;">${timeStr}</strong>`;
  logList.prepend(item);
}

function logCustomChronoEvent() {
  const input = document.getElementById('customChronoEvent');
  const text = input.value.trim();
  if (!text) return;
  logChronoEvent(text);
  input.value = '';
}

// 2. إدارة الفئات العمرية
let currentAge = 'adult';

function setAgeCategory(age) {
  currentAge = age;
  document.querySelectorAll('.age-pill').forEach(el => el.classList.remove('active'));
  
  const cprTitle = document.getElementById('cprTitleText');
  const cprSub = document.getElementById('cprSubText');
  const chokingTitle = document.getElementById('chokingTitle');
  const chokingBody = document.getElementById('chokingBody');

  if (age === 'adult') {
    document.getElementById('ageAdult').classList.add('active');
    cprTitle.innerText = 'إيقاع ضغطات الصدر (للبالغين)';
    cprSub.innerText = 'بكعب اليدين بمنتصف الصدر (عمق 5-6 سم)';
    chokingTitle.innerText = 'الغصة وانسداد مجرى التنفس (للبالغين)';
    chokingBody.innerHTML = `
      <div class="guide-step"><div class="guide-step-num">1</div><div class="guide-step-text">شجّع المصاب على السعال بقوة ما دام يصدر صوتاً.</div></div>
      <div class="guide-step"><div class="guide-step-num">2</div><div class="guide-step-text">وجّه جذعه للأمام واضربه 5 ضربات متتالية بين لوحي الكتف بكعب يدك.</div></div>
      <div class="guide-step"><div class="guide-step-num">3</div><div class="guide-step-text">قف خلفه وضع قبضة يدك فوق السرة مباشرة واضغط للداخل والأعلى (مناورة هيمليك) 5 مرات.</div></div>
      <div class="caution-note">⚠️ إذا سقط المصاب فاقداً للوعي، ابدأ بالإنعاش القلبي فوراً.</div>
    `;
  } else if (age === 'child') {
    document.getElementById('ageChild').classList.add('active');
    cprTitle.innerText = 'إيقاع ضغطات الصدر (للأطفال 1-12 سنة)';
    cprSub.innerText = 'بيد واحدة فقط بمنتصف الصدر (عمق ~5 سم)';
    chokingTitle.innerText = 'الغصة وانسداد مجرى التنفس (للأطفال 1-12 سنة)';
    chokingBody.innerHTML = `
      <div class="guide-step"><div class="guide-step-num">1</div><div class="guide-step-text">انزل لمستوى طول الطفل وشجعه على السعال إن كان قادراً.</div></div>
      <div class="guide-step"><div class="guide-step-num">2</div><div class="guide-step-text">انحنِ بجذعه للأمام واضربه 5 ضربات ظهرية خفيفة بين الكتفين.</div></div>
      <div class="guide-step"><div class="guide-step-num">3</div><div class="guide-step-text">قف خلفه أو اركع وطبق ضغطات بطنية بقوة تناسب حجم جسده.</div></div>
      <div class="caution-note">⚠️ راقب علامات تحول الشفاه للون الأزرق واطلب الإسعاف 997 فوراً.</div>
    `;
  } else if (age === 'infant') {
    document.getElementById('ageInfant').classList.add('active');
    cprTitle.innerText = 'إيقاع ضغطات الصدر (للرضع دون سنة)';
    cprSub.innerText = 'بإصبعين فقط بمنتصف الصدر أسفل حلمتي الثدي (عمق ~4 سم)';
    chokingTitle.innerText = 'الغصة وانسداد مجرى التنفس (للرضيع دون سنة)';
    chokingBody.innerHTML = `
      <div class="guide-step"><div class="guide-step-num">1</div><div class="guide-step-text">احمل الرضيع على ساعدك مع توجيه وجهه للأسفل وإسناد فكه ورأسه بحذر.</div></div>
      <div class="guide-step"><div class="guide-step-num">2</div><div class="guide-step-text">اضرب 5 ضربات بكعب يدك بلطف بين لوحي كتفه مع إبقاء رأسه منخفضاً.</div></div>
      <div class="guide-step"><div class="guide-step-num">3</div><div class="guide-step-text">اقلبه على ظهرك فوق ساعدك واضغط 5 ضغطات بإصبعين فقط بمنتصف الصدر.</div></div>
      <div class="caution-note">⚠️ تجنب مناورة هيمليك وضغطات البطن للرضع تماماً لتجنب تمزق الكبد.</div>
    `;
  }
}

// 3. الصوت والتفاعل
let recognition = null;
let isListening = false;

// ---- القراءة الصوتية للحلول ----
let arabicVoice = null;
let speakToken = 0;       // رقم يميّز كل قراءة حتى لا تتداخل القراءات
let speakingKey = null;   // أي زر/بطاقة تُقرأ الآن
let lastAiSpeech = '';    // نص آخر إجابة من المستشار (لزر الاستماع)
let voiceWarned = false;

function pickArabicVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  arabicVoice = voices.find(v => v.lang === 'ar-SA')
    || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ar'))
    || null;
}
if ('speechSynthesis' in window) {
  pickArabicVoice();
  window.speechSynthesis.onvoiceschanged = pickArabicVoice;
}

// تنظيف النص ليُقرأ بشكل سليم (إزالة الرموز والإنجليزي بين الأقواس وقراءة أرقام الطوارئ رقماً رقماً)
function cleanForSpeech(text) {
  return String(text)
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\([A-Za-z\s&\/.\-]+\)/g, '')
    .replace(/30\s*:\s*2/g, 'ثلاثين ضغطة ثم نفسين')
    .replace(/الـ\s*CPR/g, 'الإنعاش القلبي')
    .replace(/\bCPR\b/g, 'الإنعاش القلبي')
    .replace(/(\d+)\s*-\s*(\d+)/g, '$1 إلى $2')
    .replace(/~/g, 'حوالي ')
    .replace(/\b(997|998|993|911)\b/g, (m) => m.split('').join(' '))
    .replace(/[*#_`]/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// تقسيم النص لجمل قصيرة (المتصفحات تقطع القراءة الطويلة)
function splitForSpeech(text) {
  const out = [];
  (text.match(/[^.!؟?؛]+[.!؟?؛]?/g) || [text]).forEach(sentence => {
    const s = sentence.trim();
    if (!s) return;
    if (s.length <= 140) { out.push(s); return; }
    let buf = '';
    (s.match(/[^،,]+[،,]?/g) || [s]).forEach(piece => {
      if ((buf + piece).length > 140 && buf) { out.push(buf.trim()); buf = piece; }
      else buf += piece;
    });
    if (buf.trim()) out.push(buf.trim());
  });
  return out;
}

function speakText(text, key = null) {
  if (!('speechSynthesis' in window)) return false;
  const chunks = splitForSpeech(cleanForSpeech(text));
  if (!chunks.length) return false;

  const myToken = ++speakToken;
  window.speechSynthesis.cancel();
  speakingKey = key;

  const finish = () => {
    if (myToken === speakToken) { speakingKey = null; updateSpeakUI(); }
  };
  chunks.forEach((chunk, i) => {
    const u = new SpeechSynthesisUtterance(chunk);
    u.lang = 'ar-SA';
    if (arabicVoice) u.voice = arabicVoice;
    u.rate = 0.95;
    if (i === chunks.length - 1) u.onend = finish;
    u.onerror = finish;
    window.speechSynthesis.speak(u);
  });
  updateSpeakUI();
  return true;
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    speakToken++;
    window.speechSynthesis.cancel();
  }
  speakingKey = null;
  updateSpeakUI();
}

function toggleListen(key, text) {
  if (!('speechSynthesis' in window)) {
    alert('القراءة الصوتية غير مدعومة في متصفحك.');
    return;
  }
  if (speakingKey === key) { stopSpeaking(); return; }
  if (!voiceWarned && window.speechSynthesis.getVoices().length > 0 && !arabicVoice) {
    voiceWarned = true;
    alert('لم أجد صوتاً عربياً في جهازك؛ قد تكون القراءة بصوت غير عربي. يمكنك تحميل صوت عربي من إعدادات النظام.');
  }
  speakText(text, key);
}

function isAutoRead() {
  try { return localStorage.getItem('NAJDAH_AUTO_READ') !== 'off'; } catch (e) { return true; }
}

function toggleAutoRead() {
  const next = isAutoRead() ? 'off' : 'on';
  try { localStorage.setItem('NAJDAH_AUTO_READ', next); } catch (e) {}
  if (next === 'off') stopSpeaking();
  updateSpeakUI();
}

// نص البطاقة كما يظهر الآن (يراعي تغيّر الفئة العمرية في الغصة)
function getCardSpeech(card) {
  const spans = card.querySelectorAll('.case-title-wrap span');
  const title = spans[1] ? spans[1].innerText : '';
  const ordinals = ['أولاً', 'ثانياً', 'ثالثاً', 'رابعاً', 'خامساً', 'سادساً'];
  const steps = Array.from(card.querySelectorAll('.guide-step-text')).map((el, i) =>
    `${ordinals[i] || ('الخطوة ' + (i + 1))}: ${el.innerText.trim().replace(/[.\s]+$/, '')}`
  );
  const caution = card.querySelector('.caution-note');
  let text = `${title}. ${steps.join('. ')}.`;
  if (caution) text += ` تحذير: ${caution.innerText.trim()}`;
  return text;
}

function addAiListenButton(output) {
  const row = document.createElement('div');
  row.className = 'ai-listen-row';
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'listen-btn';
  b.dataset.key = 'ai';
  b.dataset.label = 'استمع للخطوات';
  b.onclick = () => toggleListen('ai', lastAiSpeech);
  row.appendChild(b);
  output.appendChild(row);
  updateSpeakUI();
}

function updateSpeakUI() {
  document.querySelectorAll('.listen-btn[data-key]').forEach(b => {
    const speaking = speakingKey === b.dataset.key;
    b.classList.toggle('speaking', speaking);
    const icon = speaking ? '⏹' : '🔊';
    b.textContent = b.dataset.label ? `${icon} ${speaking ? 'إيقاف' : b.dataset.label}` : icon;
  });
  const bar = document.getElementById('speakStopBar');
  if (bar) bar.classList.toggle('show', speakingKey !== null);
  const auto = document.getElementById('autoReadBtn');
  if (auto) auto.textContent = isAutoRead() ? '🔊 قراءة تلقائية: تشغيل' : '🔇 قراءة تلقائية: إيقاف';
}

function initListenFeature() {
  // تنسيق الأزرار (مضاف من هنا حتى لا تحتاج تعديل style.css)
  const style = document.createElement('style');
  style.textContent = `
    .listen-btn{background:transparent;border:1px solid var(--border,#30363d);color:inherit;border-radius:10px;padding:2px 9px;font-size:.85rem;font-family:inherit;cursor:pointer;line-height:1.6;margin-inline-start:6px;flex-shrink:0}
    .listen-btn.speaking{background:var(--primary,#e5484d);border-color:var(--primary,#e5484d);color:#fff}
    .ai-listen-row{margin-top:10px}
    #speakStopBar{display:none;position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:9999;background:var(--primary,#e5484d);color:#fff;border:none;border-radius:999px;padding:10px 20px;font-family:inherit;font-weight:800;font-size:.95rem;box-shadow:0 6px 20px rgba(0,0,0,.45);cursor:pointer}
    #speakStopBar.show{display:block}
  `;
  document.head.appendChild(style);

  // زر 🔊 في ترويسة كل بروتوكول
  document.querySelectorAll('#protocolsList .case-card').forEach((card, i) => {
    const wrap = card.querySelector('.case-title-wrap');
    if (!wrap) return;
    const key = 'card-' + i;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'listen-btn';
    b.dataset.key = key;
    b.title = 'استمع للخطوات';
    b.setAttribute('aria-label', 'استمع للبروتوكول');
    b.addEventListener('click', (e) => {
      e.stopPropagation(); // حتى لا تنفتح/تنغلق البطاقة
      toggleListen(key, getCardSpeech(card));
    });
    wrap.appendChild(b);
  });

  // زر تشغيل/إيقاف القراءة التلقائية لإجابات المستشار
  const aiTitle = document.querySelector('.ai-header .ai-title');
  if (aiTitle) {
    const a = document.createElement('button');
    a.type = 'button';
    a.id = 'autoReadBtn';
    a.className = 'listen-btn';
    a.onclick = toggleAutoRead;
    aiTitle.appendChild(a);
  }

  // شريط إيقاف القراءة العائم
  const bar = document.createElement('button');
  bar.type = 'button';
  bar.id = 'speakStopBar';
  bar.textContent = '⏹ إيقاف القراءة';
  bar.onclick = stopSpeaking;
  document.body.appendChild(bar);

  updateSpeakUI();
}

function toggleVoiceInput() {
  const voiceBtn = document.getElementById('voiceBtn');
  const input = document.getElementById('aiQuery');

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('التعرف على الصوت غير مدعوم في متصفحك.');
    return;
  }

  if (isListening) {
    recognition.stop();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'ar-SA';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.add('recording');
    input.placeholder = 'استمع إليك الآن...';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    processTriage();
  };

  recognition.onend = () => {
    isListening = false;
    voiceBtn.classList.remove('recording');
    input.placeholder = 'صف الحالة بالعامية أو تحدث صوتياً...';
  };

  recognition.onerror = () => {
    isListening = false;
    voiceBtn.classList.remove('recording');
  };

  recognition.start();
}

// 4. محرك الذكاء الاصطناعي الصوتي والمحلي
const localEmergencyKnowledge = [
  // ===== الحالات الجديدة (26 - 35) =====
  // ملاحظة: المفتاح الذي فيه (+) يعني أن كل أجزائه لازم تكون موجودة في كلام المستخدم
  {
    keys: ['انعاش', 'إنعاش', 'cpr', 'سي بي ار', 'توقف القلب', 'توقف قلب', 'ما فيه نبض', 'مافي نبض', 'ضغطات الصدر', 'ما يتنفس+نبض', 'لا يتنفس+نبض'],
    title: 'الإنعاش القلبي الرئوي للبالغين (CPR)',
    steps: [
      'تأكد من الأمان وهزّ كتف المصاب ونادِه؛ إن لم يستجب ولا يتنفس طبيعياً اتصل بالإسعاف 997 واطلب جهاز الصدمات (AED).',
      'اضغط بكعب يدك على منتصف الصدر بعمق 5 - 6 سم بمعدل 100 - 120 ضغطة في الدقيقة مع ترك الصدر يرتد بين الضغطات.',
      'بعد كل 30 ضغطة أعطِ نَفَسَيْن إنقاذيين إن كنت مدرباً، وإلا فاستمر بالضغطات حتى وصول الإسعاف.'
    ]
  },
  {
    keys: ['التواء', 'التوى', 'التوت', 'كاحل', 'شد عضلي', 'رباط متمزق'],
    title: 'الالتواء والشد العضلي',
    steps: [
      'أوقف النشاط وأرح المفصل ولا تحمّل عليه وزنك.',
      'ضع كمادة باردة ملفوفة بقماش 15 - 20 دقيقة كل ساعتين تقريباً خلال أول 48 ساعة.',
      'لف المفصل بضماد مرن غير مشدود وارفع الطرف أعلى من القلب، وتوجه للطوارئ إن ظهر تشوه أو تنميل أو تعذّر الوقوف.'
    ]
  },
  {
    keys: ['صدمة نزفية', 'نزيف داخلي', 'هبوط ضغط حاد', 'نبض ضعيف', 'جلد بارد ورطب', 'هبوط الدورة', 'شحوب'],
    title: 'الصدمة وهبوط الدورة الدموية',
    steps: [
      'اتصل بالإسعاف 997 فوراً وأوقف أي نزيف ظاهر بالضغط المباشر.',
      'أرقد المصاب على ظهره وارفع رجليه نحو 30 سم إن لم يكن هناك اشتباه بإصابة رأس أو عمود فقري أو كسر بالساقين.',
      'غطّه ببطانية خفيفة وراقب تنفسه ووعيه، ولا تعطه أي طعام أو شراب.'
    ]
  },
  {
    keys: ['جرح بالصدر', 'جرح في الصدر', 'طعنة بالصدر', 'طعنه بالصدر', 'رصاصة بالصدر', 'رصاصه بالصدر', 'ضلع', 'ضلوع', 'اصابة الصدر', 'إصابة الصدر'],
    title: 'إصابات الصدر والجروح النافذة',
    steps: [
      'اتصل بالإسعاف 997 فوراً وأجلس المصاب نصف جالس إن كان واعياً.',
      'إذا كان الجرح يسحب الهواء غطِّه ببلاستيك نظيف ولصّقه من ثلاث جهات فقط، أو اضغط عليه بكفك مغطاة بقفاز.',
      'لا تنزع أي جسم مغروس ولا تغلق الجرح من الجهات الأربع، وراقب تنفسه.'
    ]
  },
  {
    keys: ['عضة', 'عضه', 'عضني', 'عضها', 'عضه كلب', 'كلب', 'داء الكلب', 'سعار', 'خدش قط'],
    title: 'عضات الحيوانات',
    steps: [
      'ابتعد عن الحيوان واغسل الجرح بالماء الجاري والصابون 15 دقيقة على الأقل.',
      'اضغط بشاش نظيف إن كان هناك نزيف ثم غطِّ الجرح بضمادة معقمة.',
      'توجه للمستشفى في نفس اليوم لتقييم الحاجة لمصل داء الكلب ولقاح الكزاز، ولا تخيّط الجرح ولا تغلقه بإحكام.'
    ]
  },
  {
    keys: ['جسم غريب', 'دخل بالاذن', 'دخل في الاذن', 'دخل بالأذن', 'دخل في الأذن', 'دخل بالانف', 'دخل في الانف', 'دخل بالأنف', 'دخل في الأنف', 'حشرة بالاذن', 'حشرة في الاذن', 'بطارية زر', 'خرزة'],
    title: 'جسم غريب في الأذن أو الأنف',
    steps: [
      'أبقِ المصاب هادئاً، وإن كان الجسم في الأنف فاطلب منه التنفس من الفم وعدم الشهيق بقوة.',
      'إن كان في الأذن أمِل الرأس نحو الجهة المصابة ليخرج الجسم بالجاذبية.',
      'إن لم يخرج توجه للطوارئ، وبشكل عاجل جداً إذا كان بطارية زر أو مغناطيساً، ولا تستخدم الملقط أو أعواد القطن.'
    ]
  },
  {
    keys: ['سخونة', 'محموم', ...['طفل', 'ولد', 'بنت', 'رضيع', 'ابن'].flatMap(w => [`حرارة+${w}`, `حرارته+${w}`, `حمى+${w}`])],
    title: 'ارتفاع الحرارة والحمى عند الأطفال',
    steps: [
      'قِس الحرارة بميزان دقيق وألبس الطفل ملابس خفيفة وأعطه سوائل بكميات صغيرة متكررة.',
      'يمكن مسح جسمه بإسفنجة مبللة بماء فاتر، وإن احتجت خافضاً للحرارة فاتبع جرعة العبوة حسب وزنه أو استشر الصيدلي.',
      'توجه للطوارئ إن كان الرضيع أقل من 3 أشهر وحرارته 38 فأكثر، أو ظهر تشنج أو تيبّس رقبة أو طفح لا يختفي بالضغط أو خمول شديد.'
    ]
  },
  {
    keys: ['تسمم غذائي', 'اسهال', 'إسهال', 'استفراغ', 'جفاف', 'اكل فاسد', 'أكل فاسد', 'مغص'],
    title: 'التسمم الغذائي والجفاف',
    steps: [
      'عوّض السوائل برشفات صغيرة متكررة من محلول معالجة الجفاف الفموي أو ماء نظيف.',
      'أوقف الأكل الصلب حتى يهدأ القيء ثم ابدأ بأطعمة خفيفة كالأرز والموز.',
      'توجه للطوارئ إن وُجد دم بالبراز أو القيء، أو حرارة عالية، أو لم يبل المصاب منذ 8 ساعات، أو كان رضيعاً أو مسناً.'
    ]
  },
  {
    keys: ['تشنجات الحر', 'تشنج الحر', 'اعياء حراري', 'إعياء حراري', 'ارهاق حراري', 'إرهاق حراري', 'انهاك حراري'],
    title: 'الإجهاد الحراري وتشنجات الحر',
    steps: [
      'انقل المصاب إلى مكان مظلل أو مكيف وأرقده وارفع رجليه قليلاً وفك ملابسه الضيقة.',
      'أعطه ماءً بارداً أو مشروباً يحتوي أملاحاً برشفات إن كان واعياً ولا يتقيأ.',
      'برّد جسمه بمنشفة مبللة مع التهوية، واطلب الإسعاف 997 فوراً إن تشوش وعيه أو توقف تعرقه وصار جلده حاراً وجافاً.'
    ]
  },
  {
    keys: ['ولادة', 'ولاده', 'تولد', 'مخاض', 'الطلق', 'حامل', 'المولود', 'الجنين'],
    title: 'الولادة الطارئة خارج المستشفى',
    steps: [
      'اتصل بالإسعاف 997 فوراً وأرقد الأم على ظهرها مع ثني ركبتيها وإسنادها بوسائد، وحضّر مناشف نظيفة.',
      'عند ظهور رأس المولود اسنده بلطف دون سحب أو شدّ.',
      'بعد خروجه جفف جسمه وضعه على صدر الأم وغطِّهما ببطانية، ولا تسحب الحبل السري ولا تقصّه.'
    ]
  },
  // ===== الحالات الأصلية =====
  {
    keys: ['بلع', 'تسمم', 'منظف', 'كلور', 'شرب', 'دواء', 'فلاش', 'كلوركس', 'كيماوي', 'صابون', 'ديتول'],
    title: 'طوارئ التسمم والمواد الكيميائية',
    steps: [
      'لا تجبر المصاب على التقيؤ إطلاقاً لتفادي مضاعفة حروق المريء.',
      'احتفظ بعبوة المادة المبتلعة لقراءتها لطبيب الإسعاف.',
      'اتصل بمركز السموم أو الإسعاف فوراً (997).'
    ]
  },
  {
    keys: ['صرع', 'تشنج', 'تشنجات', 'يرتعش', 'يتنافض', 'يابس', 'متخشب', 'رعشة'],
    title: 'التعامل مع نوبات الصرع والتشنجات',
    steps: [
      'أبعد الأدوات الخطرة والحادة من محيط المصاب فوراً.',
      'ضع وسادة أو قطعة ملابس ناعمة تحت رأسه لحمايته.',
      'لا تضع أي شيء في فمه نهائياً واقلبه على جنبه فور هدوء النوبة.'
    ]
  },
  {
    keys: ['عقرب', 'ثعبان', 'حية', 'لدغة', 'مقروص', 'ملدوغ', 'قرصة', 'داب'],
    title: 'لدغات العقارب والأفاعي',
    steps: [
      'هدئ المصاب تماماً لمنع تسارع نبضات القلب وانتشار السم.',
      'أبقِ الطرف الملدوغ منخفضاً عن مستوى القلب وانزع الحلي.',
      'لا تجرح موضع اللدغة ولا تمص السم بفمك وانقله للطوارئ فوراً.'
    ]
  },
  {
    keys: ['غصة', 'اختناق', 'مشرق', 'شرقان', 'بلع', 'كتمة', 'مكتوم', 'ما يتنفس'],
    title: 'الغصة وانسداد مجرى التنفس',
    steps: [
      'شجع المصاب على السعال بقوة إن كان يصدر صوتاً.',
      'اضرب 5 ضربات متتالية بين لوحي الكتف بكعب يدك.',
      'طبق مناورة هيمليك بالضغط على أعلى السرة للداخل وللأعلى 5 مرات.'
    ]
  },
  {
    keys: ['نزيف', 'دم', 'يكب دم', 'جرح', 'طعن', 'شريان', 'ينزف'],
    title: 'النزيف الشديد وتضميد الجروح',
    steps: [
      'اضغط مباشرة وبكامل ثقلك بقماش معقم فوق الجرح.',
      'لا تنزع القماش إذا تشبع بالدم بل ضع ضمادة إضافية فوقه.',
      'ارفع الطرف المصاب أعلى من القلب إن لم يكن هناك كسر.'
    ]
  },
  {
    keys: ['شمس', 'حرارة', 'اجهاد حراري', 'ضربة شمس'],
    title: 'ضربة الشمس والإجهاد الحراري',
    steps: [
      'انقل المصاب فوراً إلى مكان مظلل وبارد.',
      'رش جسده بالماء الفاتر وهَوِّه بالمروحة وضع كمادات تحت الإبط والرقبة.',
      'اطلب الإسعاف 997 إذا توقف التعرق أو أصيب بهذيان.'
    ]
  },
  {
    keys: ['كهرباء', 'تكهرب', 'صعق', 'التماس'],
    title: 'الصعق والتيار الكهربائي',
    steps: [
      'افصل القاطع الرئيسي فوراً ولا تلمس المصاب بيدك وهو متصل بالتيار.',
      'ادفع المصاب بأداة عازلة خشبية جافة.',
      'افحص نبضه وتنفسه وابدأ بالـ CPR إذا توقف القلب.'
    ]
  },
  {
    keys: ['غرق', 'مسبح', 'بحر', 'غريق'],
    title: 'حالات الغرق وإنقاذ التنفس',
    steps: [
      'أخرج الغريق من الماء بحذر وثبت الرقبة.',
      'ابدأ فوراً بـ 5 أنفاس إنقاذية ثم استمر بدورات CPR (30:2).',
      'جفف جسده وغطه ببطانية دافئة تفادياً لانخفاض الحرارة.'
    ]
  },
  // ===== باقي الحالات (من البطاقات 3 - 25) =====
  {
    keys: ['حرق', 'حروق', 'احترق', 'انحرق', 'ماء مغلي', 'ماء حار', 'زيت حار', 'زيت مغلي', 'لهب', 'نيران'],
    title: 'الحروق السطحية والعميقة',
    steps: [
      'برّد مكان الحرق فوراً بماء جارٍ فاتر (15 - 25 درجة مئوية) لمدة 15 إلى 20 دقيقة متواصلة.',
      'انزع الخواتم والأساور والملابس غير الملتصقة بالجلد قبل حدوث التورم.',
      'غطِّ الحرق برفق بشاش معقم غير لاصق أو كيس نايلون نظيف، ولا تضع ثلجاً أو معجون أسنان أو دهوناً.'
    ]
  },
  {
    keys: ['نوبة قلبية', 'جلطة', 'ذبحة', 'الم الصدر', 'الم بالصدر', 'الم في الصدر', 'وجع الصدر', 'وجع بالصدر', 'ثقل بالصدر', 'ماسك صدره', 'الم+صدر', 'وجع+صدر', 'وجع+قلب', 'الم+قلب'],
    title: 'الاشتباه في نوبة أو جلطة قلبية',
    steps: [
      'أجلس المريض في وضعية نصف جالس ولا تسمح له بالمشي أو القيادة.',
      'اتصل بالإسعاف فوراً (997).',
      'دعه يمضغ حبة أسبرين إن لم تكن لديه حساسية، وكن مستعداً للإنعاش القلبي إذا فقد الوعي.'
    ]
  },
  {
    keys: ['سكتة', 'سكتة دماغية', 'جلطة دماغية', 'جلطة بالراس', 'جلطة في الراس', 'شلل', 'ميلان الفم', 'فمه مايل', 'وجهه مايل', 'ما يقدر يتكلم', 'كلامه ثقيل', 'كلام مخربط', 'مفلوج', 'يده طايحة', 'ضعف نصفي'],
    title: 'الاشتباه بالسكتة الدماغية',
    steps: [
      'افحص الوجه (ميلان الابتسامة) والذراعين (سقوط طرف) والكلام (ثقل أو تداخل).',
      'سجّل وقت بدء الأعراض فوراً واتصل بالإسعاف 997.',
      'أبقِ المريض مستلقياً مع رفع رأسه قليلاً ولا تعطه أي طعام أو شراب أو دواء.'
    ]
  },
  {
    keys: ['هبوط السكر', 'هبوط سكر', 'انخفاض السكر', 'سكر منخفض', 'سكر طايح', 'غيبوبة سكر', 'سكر+دايخ', 'سكر+رعشة', 'سكر+تعرق', 'سكر+طايح', 'سكر+ما يركز', 'انسولين+دايخ'],
    title: 'هبوط السكر الحاد',
    steps: [
      'إن كان واعياً قدّم له نصف كوب عصير أو ملعقة عسل أو ماءً محلى بالسكر.',
      'انتظر 15 دقيقة ثم افحص وعيه أو مستوى السكر مرة أخرى.',
      'إن كان فاقداً للوعي لا تسكب أي سوائل في فمه؛ ضعه على جنبه واتصل بالإسعاف 997.'
    ]
  },
  {
    keys: ['كسر', 'كسور', 'مكسور', 'عظم طالع', 'مخلوع', 'سقط من فوق', 'طاح من فوق', 'حادث سيارة', 'حادث سير', 'العمود الفقري', 'نخاع'],
    title: 'الكسور وإصابات العمود الفقري',
    steps: [
      'ثبّت الطرف المكسور في موضعه ولا تحاول رد العظام أبداً.',
      'اصنع جبيرة مؤقتة بوسادة أو كرتون واربطها برفق فوق وتحت الكسر.',
      'في حوادث السقوط والسيارات ثبّت الرأس والرقبة ولا تحرك المصاب إلا عند وجود خطر داهم كالحريق.'
    ]
  },
  {
    keys: ['حساسية', 'حساسية مفرطة', 'صدمة تحسسية', 'تحسسية', 'انافيلاكسيس', 'ايبينفرين', 'انتفاخ الحلق', 'تورم+حلق', 'تورم+وجه', 'تورم+شفاه', 'انتفاخ+وجه', 'انتفاخ+شفاه', 'حساسية+تنفس', 'حساسية+ضيق', 'حساسية+حلق'],
    title: 'الصدمة التحسسية المفرطة',
    steps: [
      'ابحث عن قلم الإبينفرين الذاتي (EpiPen) واحقنه في منتصف الفخذ الخارجي.',
      'اتصل بالإسعاف 997 فوراً واذكر أنها صدمة حساسية مهددة للتنفس.',
      'أرقد المصاب على ظهره وارفع رجليه، وأجلسه إن تعسر تنفسه، ولا تدعه يقف أو يمشي.'
    ]
  },
  {
    keys: ['ربو', 'ربوية', 'بخاخ', 'فنتولين', 'ضيق التنفس', 'ضيق تنفس', 'ضيق نفس', 'صفير+صدر', 'ما يكمل جملة'],
    title: 'نوبة الربو الحادة',
    steps: [
      'أجلس المريض مائلاً للأمام وساعده على أخذ 4 بخات من بخاخ الفنتولين بفارق دقيقة بين كل بخة.',
      'إن لم تتحسن الأعراض بعد 4 دقائق أعطه 4 بخات أخرى وكرر حتى وصول الإسعاف.',
      'اتصل بالإسعاف 997 فوراً إن عجز عن نطق جملة كاملة أو ازرقت أطرافه، ولا تجعله يستلقي.'
    ]
  },
  {
    keys: ['رعاف', 'انف+دم', 'انف+نزيف', 'انف+ينزف', 'خشم+دم', 'خشم+نزيف', 'خشم+ينزف'],
    title: 'الرعاف والنزيف الأنفي',
    steps: [
      'انحنِ بالرأس للأمام قليلاً وليس للخلف.',
      'اضغط على الجزء اللين من الأنف أسفل العظم لمدة 10 دقائق متواصلة وتنفس من الفم.',
      'ضع كمادة باردة على جسر الأنف، وتوجه للطوارئ إن استمر النزيف أكثر من 20 دقيقة أو أعقب ضربة رأس قوية.'
    ]
  },
  {
    keys: ['بتر', 'مبتور', 'بتر اصبع', 'اصبع+مقطوع', 'يد+مقطوع', 'رجل+مقطوع', 'اصبع+طار'],
    title: 'بتر الأطراف والأصابع',
    steps: [
      'أوقف النزيف بالضغط المباشر الشديد أو رباط ضاغط وسجل الوقت.',
      'لف الجزء المبتور بشاش معقم مبلل قليلاً وضعه في كيس بلاستيكي محكم.',
      'ضع الكيس داخل كيس آخر فيه ماء وثلج، ولا تضع العضو مباشرة على الثلج، واتصل بالإسعاف 997.'
    ]
  },
  {
    keys: ['عين', 'شظية', 'عمى', 'عين+كلور', 'عين+منظف', 'عين+كيماوي', 'عين+صابون', 'عين+مادة', 'عين+زجاج'],
    title: 'دخول أجسام وكيماويات في العين',
    steps: [
      'في حالة الكيماويات والمنظفات اغسل العين بماء جارٍ نظيف 15 - 20 دقيقة فوراً.',
      'في حالة الشظايا لا تفرك العين ولا تحاول نزع الجسم العالق.',
      'غطِّ العين بكوب ورقي دون ملامستها وتوجه للطوارئ.'
    ]
  },
  {
    keys: ['انخفاض الحرارة', 'انخفاض حرارة', 'هبوط الحرارة', 'هبوط حرارة', 'هيبوثيرميا', 'تجمد', 'متجمد', 'برد قارس', 'برد شديد', 'ارتجاف+برد', 'يرتجف+برد'],
    title: 'انخفاض حرارة الجسم الشديد',
    steps: [
      'انقل المصاب لمكان دافئ وانزع الملابس المبللة وجفف جسده.',
      'لفه ببطانيات جافة مع تدفئة الجذع والصدر والرقبة أولاً.',
      'قدّم مشروباً دافئاً حلواً فقط إن كان واعياً، ولا تفرك أطرافه ولا تعرضه لحرارة مباشرة مفاجئة.'
    ]
  },
  {
    keys: ['دخان', 'حريق', 'اكسيد الكربون', 'تسريب غاز', 'غاز', 'فحم', 'دفاية', 'صخام', 'اختناق بالدخان', 'اختناق بالغاز', 'تسمم بالغاز', 'غاز+دوخة', 'غاز+دايخ', 'غاز+صداع', 'فحم+دوخة', 'فحم+دايخ'],
    title: 'استنشاق الدخان وغاز أول أكسيد الكربون',
    steps: [
      'أخرج المصاب فوراً إلى الهواء النقي دون تعريض نفسك للخطر.',
      'فك الملابس الضاغطة حول الرقبة والصدر وافحص مجرى الهواء.',
      'اتصل بالدفاع المدني 998 والإسعاف 997 وكن مستعداً للإنعاش القلبي.'
    ]
  },
  {
    keys: ['ارتجاج', 'ارتجاج دماغ', 'راس+ضربة', 'راس+طاح', 'راس+خبطة', 'راس+سقط', 'راس+ارتطم', 'دم من الاذن'],
    title: 'ضربات الرأس وارتجاج الدماغ',
    steps: [
      'ثبّت رأس وعنق المصاب في خط مستقيم ولا تحركه.',
      'راقب علامات الخطر: قيء متكرر، فقدان وعي ولو لثوانٍ، خروج سائل أو دم من الأذن أو الأنف.',
      'ضع كمادة باردة ملفوفة بقماش على الكدمة دون ضغط، وتوجه للطوارئ فوراً إذا ظهر تلعثم أو تشوش.'
    ]
  },
  {
    keys: ['=سن+طاح', '=سن+طايح', '=سن+مكسور', '=سن+مقلوع', '=سن+سقط', '=سن+خلع', 'ضرس+طاح', 'ضرس+طايح', 'ضرس+مكسور', 'ضرس+سقط', 'خلع سن', 'سن مقلوع'],
    title: 'سقوط الأسنان جراء صدمة',
    steps: [
      'امسك السن من التاج الأبيض فقط ولا تلمس الجذر أو تفركه.',
      'إن كان متسخاً اشطفه بلطف بحليب بارد أو محلول ملحي.',
      'احفظه في كوب حليب وتوجه لطبيب الأسنان خلال ساعة، ولا تضعه في ماء الصنبور.'
    ]
  },
  {
    keys: ['اغماء', 'اغمي', 'غاب عن الوعي', 'غاب وعيه', 'فقد الوعي', 'فاقد الوعي', 'دايخ', 'دوخة', 'سينكوب', 'هبوط ضغط', 'غشاوة'],
    title: 'الإغماء وفقدان الوعي المؤقت',
    steps: [
      'أرقد المصاب على ظهره وارفع رجليه نحو 30 سم.',
      'فك الأزرار والياقة وافتح النوافذ للتهوية.',
      'إن لم يستعد وعيه خلال دقيقة ضعه في وضعية الإفاقة الجانبية واتصل بالإسعاف 997.'
    ]
  },
  {
    keys: ['هلع', 'نوبة هلع', 'فرط التنفس', 'فرط تنفس', 'بانيك', 'رعب', 'خفقان', 'تنميل+خوف'],
    title: 'نوبات الهلع وفرط التنفس',
    steps: [
      'طمئنه بصوت هادئ وأكد له أنه بأمان وأن الأعراض ستزول بعد دقائق.',
      'وجّهه للتنفس البطيء: شهيق من الأنف 4 ثوانٍ، حبس ثانيتين، زفير بطيء 6 ثوانٍ.',
      'ساعده على تشتيت تركيزه برصد 5 أشياء يراها و4 أشياء يلمسها، ولا تستخدم الأكياس الورقية للتنفس.'
    ]
  },
  {
    keys: ['قنديل', 'قناديل', 'سمكة صخرية', 'لسعة بحرية', 'لسعة+بحر', 'لدغة+بحر'],
    title: 'لدغات قناديل البحر والكائنات البحرية',
    steps: [
      'اشطف موضع اللدغة بخل طعام مخفف أو ماء البحر المالح، ولا تستخدم الماء العذب.',
      'أزل المجسات العالقة بملقط أو بطاقة بلاستيكية دون لمسها بيدك.',
      'اغمر العضو في ماء ساخن قدر التحمل (40 - 45 مئوية) لمدة 20 دقيقة.'
    ]
  }
];

// محرك المطابقة الذكي: يعطي كل حالة نقاطاً ويختار الأعلى (بدل أول حالة تطابق)
const AR_PREFIXES = ['وال', 'بال', 'كال', 'فال', 'لل', 'ال', 'و', 'ب', 'ل', 'ف', 'ك'];

// هل الكلمة (token) تطابق المفتاح؟ مع تجاهل السوابق (ال، بال، و...) واللواحق القصيرة (ه، ها، ي...)
function tokenMatchesKey(token, key, exact = false) {
  const candidates = [token];
  for (const p of AR_PREFIXES) {
    if (token.startsWith(p) && token.length - p.length >= 2) candidates.push(token.slice(p.length));
  }
  if (exact) return candidates.some(c => c === key);
  const maxSuffix = key.length >= 3 ? 2 : 1;
  return candidates.some(c => c === key || (c.startsWith(key) && c.length - key.length <= maxSuffix));
}

// نقاط مفتاح واحد: كلما كان أطول وأدق زادت نقاطه. المفتاح بعلامة (+) يحتاج كل أجزائه، والكلمة التي تبدأ بـ (=) تُطابق حرفياً.
function keyScore(query, tokens, rawKey) {
  const parts = rawKey.split('+').map(p => normalizeArabic(p)).filter(Boolean);
  let total = 0;
  for (const part of parts) {
    const exact = part.startsWith('=');
    const word = exact ? part.slice(1) : part;
    const ok = word.includes(' ') ? query.includes(word) : tokens.some(t => tokenMatchesKey(t, word, exact));
    if (!ok) return 0;
    total += word.replace(/\s/g, '').length;
  }
  return parts.length > 1 ? total + 2 : total;
}

function findBestProtocol(query) {
  const tokens = query.split(/[\s،,.؟?!]+/).filter(Boolean);
  let best = null;
  let bestScore = 0;
  for (const item of localEmergencyKnowledge) {
    let top = 0;
    let hits = 0;
    for (const k of item.keys) {
      const sc = keyScore(query, tokens, k);
      if (sc > 0) { hits++; if (sc > top) top = sc; }
    }
    const score = top > 0 ? top + (hits - 1) : 0;
    if (score > bestScore) { bestScore = score; best = item; }
  }
  return best;
}

async function processTriage() {
  const input = document.getElementById('aiQuery');
  const output = document.getElementById('aiOutput');
  const btn = document.getElementById('aiBtn');
  const query = normalizeArabic(input.value.trim().toLowerCase());

  if (!query) return;

  stopSpeaking();

  btn.disabled = true;
  output.classList.add('show');
  output.innerHTML = '⚡ جاري صياغة الخطوات الإسعافية...';

  const userApiKey = localStorage.getItem('NAJDAH_GEMINI_API_KEY');

  if (userApiKey && navigator.onLine) {
    try {
      const prompt = `أنت طبيب طوارئ في تطبيق "نجدة". الحالة: "${query}" للمصاب فئة: (${currentAge}).
      1. ابدأ فوراً بـ 3 خطوات مرقمة وموجزة جداً.
      2. أضف سطر تحذير واحد يبدأ بـ "⚠️ تنبيه:".
      3. ابتعد عن المقدمات والترحيب.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${userApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const res = data.candidates[0].content.parts[0].text;
        output.innerHTML = res.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        lastAiSpeech = res;
        addAiListenButton(output);
        if (isAutoRead()) speakText(res, 'ai');
        btn.disabled = false;
        return;
      }
    } catch (e) {}
  }

  setTimeout(() => {
    let match = findBestProtocol(query);
    let resultHtml = '';
    let spoken = '';

    if (match) {
      resultHtml = `
        <strong style="color: #ff6b6b; font-size: 1rem; display:block; margin-bottom: 0.5rem;">🚨 بروتوكول: ${match.title}</strong>
        <ol style="margin-right: 1.2rem;">
          ${match.steps.map(s => `<li style="margin-bottom: 5px;">${s}</li>`).join('')}
        </ol>
        <div class="caution-note">⚠️ اتصل بالرقم <strong>997</strong> فوراً ولا تترك المصاب وحيداً.</div>
      `;
      spoken = `${match.title}. ${match.steps.join('. ')}. اتصل بالرقم 997 فوراً ولا تترك المصاب وحيداً.`;
    } else {
      resultHtml = `
        <strong style="color: #ffc83b;">📋 توجيه عام لحالات الطوارئ:</strong>
        <ol style="margin-right: 1.2rem; margin-top: 5px;">
          <li>أمّن محيط الحادث وافحص وعي المصاب.</li>
          <li>تحقق من مجرى التنفس وحركة الصدر.</li>
          <li>اتصل بالرقم <strong>911</strong> أو <strong>997</strong> فوراً.</li>
        </ol>
      `;
      spoken = 'أمّن المكان، افحص وعي المصاب وتنفسه، واتصل بالإسعاف فوراً.';
    }

    output.innerHTML = resultHtml;
    lastAiSpeech = spoken;
    addAiListenButton(output);
    if (isAutoRead()) speakText(spoken, 'ai');
    btn.disabled = false;
  }, 250);
}

function setupApiKey() {
  const current = localStorage.getItem('NAJDAH_GEMINI_API_KEY') || '';
  const key = prompt('أدخل مفتاح Gemini API للربط السحابي:', current);
  if (key !== null) localStorage.setItem('NAJDAH_GEMINI_API_KEY', key.trim());
}

// 5. بندول الـ CPR
let cprInterval = null;
let audioCtx = null;

function playBeep() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {}
}

function toggleCPR() {
  const btn = document.getElementById('cprBtn');
  const indicator = document.getElementById('cprIndicator');

  if (cprInterval) {
    clearInterval(cprInterval);
    cprInterval = null;
    btn.innerText = 'تشغيل';
    btn.style.background = '#21262d';
    indicator.classList.remove('pulsing');
  } else {
    btn.innerText = 'إيقاف';
    btn.style.background = 'var(--primary)';
    cprInterval = setInterval(() => {
      indicator.classList.toggle('pulsing');
      playBeep();
    }, 545);
  }
}

// 6. الفلترة والتطبيع الذكي للغة العربية
let activeCategory = 'all';

function normalizeArabic(text) {
  if (!text) return '';
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .trim()
    .toLowerCase();
}

function selectCategory(category, chipElement) {
  activeCategory = category;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chipElement.classList.add('active');
  filterProtocols();
}

function clearSearch() {
  const input = document.getElementById('protocolFilter');
  input.value = '';
  document.getElementById('clearSearchBtn').style.display = 'none';
  filterProtocols();
}

function filterProtocols() {
  const rawTerm = document.getElementById('protocolFilter').value;
  const term = normalizeArabic(rawTerm);
  const clearBtn = document.getElementById('clearSearchBtn');
  const cards = document.querySelectorAll('#protocolsList .case-card');
  const matchText = document.getElementById('matchCountText');
  let visibleCount = 0;

  clearBtn.style.display = rawTerm ? 'block' : 'none';

  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category') || 'all';
    const cardTitle = normalizeArabic(card.querySelector('.case-title-wrap').innerText);
    const cardBody = normalizeArabic(card.querySelector('.case-body').innerText);
    const cardKeywords = normalizeArabic(card.getAttribute('data-keywords') || '');

    const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
    const matchesQuery = !term || cardTitle.includes(term) || cardBody.includes(term) || cardKeywords.includes(term);

    if (matchesCategory && matchesQuery) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (visibleCount === cards.length) {
    matchText.textContent = `عرض كافة البروتوكولات المعتمدة (${visibleCount} حالة حاسمة)`;
  } else {
    matchText.textContent = `تم العثور على (${visibleCount}) بروتوكول مطابق للبحث`;
  }
}

function toggleAccordion(header) {
  header.parentElement.classList.toggle('active');
}

window.addEventListener('DOMContentLoaded', () => {
  updateNetworkStatus();
  initListenFeature();
});