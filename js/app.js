// ── SECURE CONFIG & TMDB ───────────────────────────────────────────────────
let TMDB_KEY = localStorage.getItem('tmdb_key') || 'f45fbdd7b24f1341eb132d1d53f5bf98';
let GROQ_KEY = localStorage.getItem('groq_key') || window.GROQ_KEY || '';

let posterCache = {};
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

async function fetchPoster(m) {
  if (posterCache[m.id] !== undefined) return posterCache[m.id];
  if (!TMDB_KEY) { posterCache[m.id] = null; return null; }
  try {
    const tv = (m.type === 'SERIES' || m.type === 'MINI');
    const url = `https://api.themoviedb.org/3/search/${tv ? 'tv' : 'movie'}?api_key=${TMDB_KEY}&query=${encodeURIComponent(m.title)}&language=en-US&page=1`;
    const res = await fetch(url);
    if (!res.ok) throw 0;
    const { results = [] } = await res.json();
    const yearKey = tv ? 'first_air_date' : 'release_date';
    const match = results.find(x => (x[yearKey] || '').startsWith(m.year)) || results[0];
    posterCache[m.id] = match?.poster_path ? TMDB_IMG + match.poster_path : null;
  } catch {
    posterCache[m.id] = null;
  }
  return posterCache[m.id];
}

// ── DATA: 85 HISTORICAL MASTERPIECES ──────────────────────────────────────
const MOVIES = [
  // ── UNBELIEVABLE ACCOUNTS ──
  {id:1,  cat:"shocking",type:"FILM",  year:"2002",rating:"8.1",title:"Catch Me If You Can",        desc:"Frank Abagnale Jr. conned millions impersonating a pilot, doctor and lawyer — all before turning 21. DiCaprio at his most electric.",truth:"Frank Abagnale successfully forged $2.5 million in Pan Am payroll checks across 26 countries, evading the FBI until his capture in France in 1969.",ac:"#8b4513"},
  {id:2,  cat:"shocking",type:"SERIES",year:"2021",rating:"8.5",title:"The Serpent",                desc:"Charles Sobhraj — charming, multilingual, terrifying — preyed on backpackers across Southeast Asia and evaded justice for decades.",truth:"Sobhraj drugged, robbed and murdered at least a dozen Western tourists along the 1970s Hippie Trail, escaping prisons repeatedly before being captured in Kathmandu.",ac:"#1a4a2e"},
  {id:3,  cat:"shocking",type:"SERIES",year:"2018",rating:"8.2",title:"Waco",                       desc:"David Koresh and the 51-day FBI standoff that ended in catastrophic fire. A portrait of faith, charisma, and power colliding.",truth:"The 1993 siege of the Branch Davidian compound in Mount Carmel ended in the tragic deaths of 76 Davidians and 4 ATF agents.",ac:"#4a1010"},
  {id:4,  cat:"shocking",type:"SERIES",year:"2019",rating:"8.4",title:"The Act",                    desc:"Gypsy Rose Blanchard was kept sick by her own mother for years — Munchausen by proxy ending in a crime no one saw coming.",truth:"Dee Dee Blanchard subjected Gypsy Rose to decades of unnecessary surgeries and wheelchair confinement until Gypsy orchestrated her murder in 2015.",ac:"#2a1040"},
  {id:5,  cat:"shocking",type:"SERIES",year:"2022",rating:"7.9",title:"The Dropout",                desc:"Elizabeth Holmes dropped out of Stanford, charmed billionaires, and built a medical empire on a complete lie.",truth:"Theranos raised over $700 million based on fraudulent blood-testing technology before being exposed by Wall Street Journal reporter John Carreyrou.",ac:"#0e3a50"},
  {id:6,  cat:"shocking",type:"FILM",  year:"2003",rating:"7.5",title:"Monster",                    desc:"Charlize Theron won the Oscar vanishing into Aileen Wuornos — a serial killer whose life was as tragic as her crimes.",truth:"Aileen Wuornos confessed to shooting six men along Florida highways between 1989 and 1990 and was executed by lethal injection in 2002.",ac:"#2a1010"},
  {id:43, cat:"shocking",type:"SERIES",year:"2017",rating:"8.7",title:"Dirty Money",                desc:"Explosive documentary series exposing corporate corruption — from Volkswagen's emissions scandal to payday loan empires.",truth:"Exposes systemic white-collar financial crimes that exploited regulatory loopholes across global industries.",ac:"#0a1a28"},
  {id:44, cat:"shocking",type:"SERIES",year:"2022",rating:"8.0",title:"The Tinder Swindler",        desc:"Simon Leviev posed as a billionaire diamond mogul on Tinder, romancing women across Europe to fund his lavish lies.",truth:"Shimon Hayut swindled an estimated $10 million from victims across Europe using a classic Ponzi scheme dynamic.",ac:"#1c0a28"},
  {id:45, cat:"shocking",type:"SERIES",year:"2023",rating:"7.8",title:"Madoff: The Monster of Wall Street",desc:"Bernie Madoff orchestrated history's largest Ponzi scheme — $65 billion stolen and decades of looking the other way.",truth:"Madoff ran the fraudulent investment fund for nearly four decades before confessing to his sons in December 2008.",ac:"#0a1830"},
  {id:46, cat:"shocking",type:"SERIES",year:"2022",rating:"7.6",title:"The Puppet Master",          desc:"Robert Hendy-Freegard impersonated an MI5 agent for years, psychologically manipulating victims into funding his fake spy life.",truth:"Hendy-Freegard conned multiple victims out of hundreds of thousands of pounds by convincing them they were in danger from IRA assassins.",ac:"#1a1428"},
  {id:47, cat:"shocking",type:"FILM",  year:"2017",rating:"7.4",title:"I, Tonya",                   desc:"Margot Robbie as Tonya Harding — a gifted skater from a brutal home, destroyed by the most infamous scandal in sports history.",truth:"The 1994 baton attack on Nancy Kerrigan resulted in Harding being permanently banned from figure skating.",ac:"#081828"},

  // ── MUSIC & CULTURAL LEGENDS ──
  {id:7,  cat:"music",   type:"FILM",  year:"2018",rating:"7.9",title:"Bohemian Rhapsody",          desc:"From Farrokh Bulsara in Zanzibar to Freddie Mercury at Live Aid — the breathtaking rise of rock's greatest voice.",truth:"Queen's 1985 Live Aid performance at Wembley Stadium is widely recognized as one of the single greatest live rock concerts in history.",ac:"#5a2e08"},
  {id:8,  cat:"music",   type:"FILM",  year:"2019",rating:"7.3",title:"Rocketman",                  desc:"A musical odyssey through Elton John's life — from awkward piano prodigy to global icon.",truth:"Chronicles Elton John's legendary partnership with lyricist Bernie Taupin and his triumphant struggle with sobriety in 1990.",ac:"#102050"},
  {id:9,  cat:"music",   type:"FILM",  year:"2022",rating:"7.8",title:"Elvis",                      desc:"Baz Luhrmann's portrait of Presley and his manipulative manager Colonel Tom Parker.",truth:"Explores Presley's musical roots in Memphis Black gospel and R&B, and Parker's complex financial control.",ac:"#380808"},
  {id:10, cat:"music",   type:"FILM",  year:"2004",rating:"7.7",title:"Ray",                        desc:"Jamie Foxx's Oscar-winning transformation into Ray Charles — genius, addiction, and American soul.",truth:"Ray Charles pioneered soul music by blending blues, rhythm, and gospel at Atlantic Records in the 1950s.",ac:"#081808"},
  {id:11, cat:"music",   type:"FILM",  year:"2015",rating:"7.8",title:"Straight Outta Compton",     desc:"Ice Cube, Dr. Dre and Eazy-E — three men from Compton who revolutionized hip-hop culture with N.W.A.",truth:"N.W.A transformed American youth culture in 1988, facing direct censorship attempts from the FBI for their anti-police brutality anthems.",ac:"#0a0a0a"},
  {id:12, cat:"music",   type:"FILM",  year:"2024",rating:"7.8",title:"Bob Marley: One Love",       desc:"The life and legend of Bob Marley — from Jamaica to a global symbol of peace and resistance.",truth:"Follows Marley's survival of an assassination attempt in Kingston in 1976 and the creation of his iconic Exodus album.",ac:"#1a3808"},
  {id:13, cat:"music",   type:"SERIES",year:"2023",rating:"8.1",title:"Daisy Jones & The Six",      desc:"A chronicle of a 1970s rock band's rise and implosion — inspired directly by Fleetwood Mac.",truth:"Draws on the legendary interpersonal friction during the recording of Fleetwood Mac's 1977 masterpiece Rumours.",ac:"#301020"},
  {id:48, cat:"music",   type:"FILM",  year:"2014",rating:"8.7",title:"Whiplash",                   desc:"A young jazz drummer at an elite conservatory meets a conductor who terrorizes students into greatness.",truth:"Inspired by director Damien Chazelle's real-life experiences in a fiercely competitive high school jazz band.",ac:"#1a0808"},
  {id:49, cat:"music",   type:"FILM",  year:"2007",rating:"7.5",title:"La Vie en Rose",             desc:"Marion Cotillard's Oscar-winning portrayal of Edith Piaf — the sparrow of Paris.",truth:"Piaf rose from extreme poverty in Paris to international superstardom before her untimely death in 1963.",ac:"#300818"},
  {id:50, cat:"music",   type:"FILM",  year:"2023",rating:"7.1",title:"Maestro",                    desc:"Bradley Cooper's immersive portrait of Leonard Bernstein — conductor, composer, and musical force.",truth:"Covers Bernstein's historic 1943 New York Philharmonic debut and his decades-long complex marriage to Felicia Montealegre.",ac:"#08101c"},

  // ── SCIENTIFIC GENIUS ──
  {id:14, cat:"science", type:"FILM",  year:"2023",rating:"8.3",title:"Oppenheimer",                desc:"J. Robert Oppenheimer led the Manhattan Project to build the atomic bomb, then fought the arms race.",truth:"The Trinity test in July 1945 unleashed atomic weapons on the world, leading to Oppenheimer's 1954 security hearing during the Red Scare.",ac:"#503808"},
  {id:15, cat:"science", type:"FILM",  year:"2014",rating:"8.0",title:"The Imitation Game",         desc:"Alan Turing cracked the Nazi Enigma code at Bletchley Park, laying foundations for modern computers.",truth:"Turing's Bombe machine deciphered encrypted German Enigma messages, shortening the war in Europe by an estimated two years.",ac:"#082030"},
  {id:16, cat:"science", type:"FILM",  year:"2016",rating:"7.8",title:"Hidden Figures",             desc:"Three brilliant Black women mathematicians at NASA whose orbital calculations launched John Glenn into space.",truth:"Katherine Johnson calculated the trajectories for Mercury and Apollo 11 missions by hand, overcoming systemic racial segregation.",ac:"#082818"},
  {id:17, cat:"science", type:"FILM",  year:"2001",rating:"8.2",title:"A Beautiful Mind",           desc:"John Nash — Nobel Prize-winning pioneer in non-cooperative game theory who persevered through schizophrenia.",truth:"Nash formulated the Nash Equilibrium in 1950 and was awarded the Nobel Memorial Prize in Economic Sciences in 1994.",ac:"#101040"},
  {id:18, cat:"science", type:"FILM",  year:"2014",rating:"7.7",title:"The Theory of Everything",   desc:"Stephen Hawking's breakthroughs in black hole radiation and theoretical physics alongside Jane Wilde.",truth:"Hawking was diagnosed with ALS at age 21 and defied medical expectations for over five decades, authoring A Brief History of Time.",ac:"#081428"},
  {id:55, cat:"science", type:"FILM",  year:"1995",rating:"7.6",title:"Apollo 13",                  desc:"An oxygen tank explosion strands astronauts in deep space. Mission Control races against time to bring them home.",truth:"On April 13, 1970, an oxygen tank ruptured in space. Flight Director Gene Kranz and NASA engineers engineered survival protocols on the fly.",ac:"#101830"},
  {id:56, cat:"science", type:"FILM",  year:"2015",rating:"7.4",title:"The Man Who Knew Infinity",  desc:"Srinivasa Ramanujan — self-taught Indian mathematical genius who revolutionized number theory at Cambridge.",truth:"Ramanujan independently compiled nearly 3,900 identities and equations, collaborating with G.H. Hardy at Trinity College.",ac:"#0c1820"},

  // ── DARK CRIME & HEISTS ──
  {id:19, cat:"crime",   type:"SERIES",year:"2015",rating:"8.8",title:"Narcos",                     desc:"The rise and fall of Pablo Escobar and the Medellín Cartel's global cocaine empire.",truth:"The DEA and Colombian Search Bloc waged a multi-year manhunt resulting in Escobar's death on a Medellín rooftop in December 1993.",ac:"#280808"},
  {id:20, cat:"crime",   type:"FILM",  year:"1990",rating:"8.7",title:"Goodfellas",                 desc:"Henry Hill's thirty-year life inside the Lucchese crime family — the glory, paranoia, and downfall.",truth:"Based on Nicholas Pileggi's Wiseguy, detailing the 1978 Lufthansa heist of $5.8 million at JFK Airport.",ac:"#0a0818"},
  {id:21, cat:"crime",   type:"FILM",  year:"1973",rating:"7.9",title:"Serpico",                    desc:"Frank Serpico — the honest NYPD detective who blew the whistle on systemic police bribery and corruption.",truth:"Serpico was shot in the face in 1971 and later testified before the Knapp Commission, prompting sweeping NYPD integrity reforms.",ac:"#101808"},
  {id:24, cat:"crime",   type:"FILM",  year:"2015",rating:"7.8",title:"The Big Short",              desc:"A handful of eccentric financial outsiders predict the 2008 subprime mortgage collapse.",truth:"Michael Burry, Steve Eisman, and Greg Lippmann recognized the mortgage bond bubble and shorted collateralized debt obligations for billions.",ac:"#081418"},
  {id:59, cat:"crime",   type:"SERIES",year:"2018",rating:"8.6",title:"Mindhunter",                 desc:"FBI agents in the late 1970s pioneer psychological profiling by interviewing imprisoned serial killers.",truth:"Based on FBI agent John E. Douglas and Robert Ressler's work founding the Behavioral Science Unit in Quantico.",ac:"#0c1014"},
  {id:60, cat:"crime",   type:"FILM",  year:"1997",rating:"7.7",title:"Donnie Brasco",              desc:"FBI undercover agent Joe Pistone spends six years infiltrated inside the Bonanno crime family.",truth:"Pistone's undercover operation yielded over 200 indictments and nearly brought down the Five Families of New York.",ac:"#0a0c10"},

  // ── WAR & EPIC SURVIVAL ──
  {id:25, cat:"war",     type:"MINI",  year:"2019",rating:"9.4",title:"Chernobyl",                  desc:"The 1986 Soviet nuclear catastrophe — the reactor explosion, political silence, and firefighters' sacrifice.",truth:"Valery Legasov and Boris Shcherbina led the liquidation efforts at Reactor 4, exposing the flawed positive-void coefficient in RBMK reactors.",ac:"#081008"},
  {id:27, cat:"war",     type:"FILM",  year:"1993",rating:"9.0",title:"Schindler's List",           desc:"Oskar Schindler — a German industrialist who risked his life and fortune to save 1,200 Jews during the Holocaust.",truth:"Schindler bribed Nazi officials and spent his personal fortune to employ Jewish refugees in his enamelware and munitions factories.",ac:"#0e0e0e"},
  {id:29, cat:"war",     type:"MINI",  year:"2001",rating:"9.4",title:"Band of Brothers",           desc:"The true journey of Easy Company, 506th Parachute Infantry Regiment, from Normandy to Hitler's Eagle's Nest.",truth:"Based on historian Stephen Ambrose's research with surviving veterans of the 101st Airborne Division in World War II.",ac:"#101408"},
  {id:30, cat:"war",     type:"FILM",  year:"2017",rating:"7.9",title:"Dunkirk",                    desc:"Operation Dynamo: 338,000 Allied soldiers evacuated from the beaches of France by civilian flotillas under air attack.",truth:"Between May 26 and June 4, 1940, over 800 civilian 'Little Ships' joined Royal Navy destroyers to rescue Allied troops.",ac:"#0c1420"},
  {id:62, cat:"war",     type:"MINI",  year:"2010",rating:"9.2",title:"The Pacific",                desc:"The brutal island-hopping campaigns in the Pacific theatre from Guadalcanal to Iwo Jima and Okinawa.",truth:"Tracks the real memoirs of Marines Eugene Sledge, Robert Leckie, and Medal of Honor recipient John Basilone.",ac:"#101820"},
  {id:65, cat:"war",     type:"FILM",  year:"1998",rating:"8.6",title:"Saving Private Ryan",        desc:"The D-Day landings on Omaha Beach and the search for one surviving paratrooper across occupied France.",truth:"Inspired by the real Niland brothers of New York, whose surviving brother was pulled from combat following the deaths of his siblings.",ac:"#101210"},

  // ── ROYAL CHRONICLES ──
  {id:31, cat:"royals",  type:"SERIES",year:"2016",rating:"8.7",title:"The Crown",                  desc:"Queen Elizabeth II across seven decades of political crises, wars, and constitutional shifts.",truth:"Meticulously dramatizes the British royal family's interactions with eleven prime ministers from Churchill to Thatcher.",ac:"#081420"},
  {id:32, cat:"royals",  type:"FILM",  year:"2023",rating:"6.4",title:"Napoleon",                   desc:"Bonaparte's meteoric ascent from artillery officer to French Emperor, driven by tactical genius and Josephine.",truth:"Napoleon fought over 70 battles, transformed civil law with the Napoleonic Code, and fell after the Battle of Waterloo in 1815.",ac:"#200808"},
  {id:36, cat:"royals",  type:"FILM",  year:"2010",rating:"8.0",title:"The King's Speech",          desc:"King George VI struggles to overcome a debilitating stammer with the help of Australian therapist Lionel Logue.",truth:"Logue coached the King through his crucial 1939 radio broadcast declaring war on Germany, cementing their lifelong friendship.",ac:"#081818"},
  {id:69, cat:"royals",  type:"FILM",  year:"1998",rating:"7.8",title:"Elizabeth",                  desc:"The young Elizabeth Tudor ascends to the English throne amidst religious turmoil, assassination plots, and foreign threats.",truth:"Elizabeth I ruled England for 44 years, establishing religious stability and defeating the Spanish Armada in 1588.",ac:"#281810"},

  // ── POWER & POLITICS ──
  {id:75, cat:"politics",type:"FILM",  year:"2012",rating:"8.5",title:"Lincoln",                    desc:"Abraham Lincoln battles Congress to pass the 13th Amendment abolishing slavery before the Civil War ends.",truth:"Lincoln used federal patronage, strategic diplomacy, and relentless oratory to secure the crucial two-thirds majority in January 1865.",ac:"#101018"},
  {id:76, cat:"politics",type:"FILM",  year:"2008",rating:"7.4",title:"Frost/Nixon",                desc:"David Frost conducts the legendary 1977 television interviews with disgraced former president Richard Nixon.",truth:"Nixon admitted to Frost on camera: 'When the president does it, that means that it is not illegal,' watched by 45 million Americans.",ac:"#181010"},
  {id:81, cat:"politics",type:"FILM",  year:"1976",rating:"8.0",title:"All the President's Men",   desc:"Bob Woodward and Carl Bernstein investigate the Watergate break-in, unravelling White House cover-ups.",truth:"Their reporting for The Washington Post, aided by the source 'Deep Throat' (Mark Felt), led directly to Nixon's 1974 resignation.",ac:"#0c1010"},
  {id:84, cat:"politics",type:"FILM",  year:"2013",rating:"7.5",title:"Mandela: Long Walk to Freedom",desc:"Nelson Mandela's journey from anti-apartheid lawyer to 27 years on Robben Island and South Africa's presidency.",truth:"Mandela was inaugurated as South Africa's first democratically elected president in 1994, leading national reconciliation through truth.",ac:"#1a1008"},
  {id:85, cat:"politics",type:"FILM",  year:"2014",rating:"7.3",title:"Selma",                      desc:"Dr. Martin Luther King Jr.'s 1965 voting rights marches from Selma to Montgomery in the face of brutal state violence.",truth:"Bloody Sunday on the Edmund Pettus Bridge galvanized national conscience and propelled President Johnson to sign the Voting Rights Act of 1965.",ac:"#0c1008"},
];

window.ALL_MOVIES = MOVIES;

// ── CATEGORIES & LABELS ───────────────────────────────────────────────────
const CATS = [
  {id:"all",label:"All Masterpieces"},
  {id:"shocking",label:"Unbelievable"},
  {id:"music",label:"Music & Culture"},
  {id:"science",label:"Science & Genius"},
  {id:"crime",label:"Dark Crime"},
  {id:"war",label:"War & Survival"},
  {id:"royals",label:"Royal Chronicles"},
  {id:"politics",label:"Power & Politics"},
];

const LABELS = {
  all: ["Complete", "Archive"],
  shocking: ["Unbelievable", "Accounts"],
  music: ["Cultural", "Legends"],
  science: ["Scientific", "Genius"],
  crime: ["Dark Crime", "& Heists"],
  war: ["War &", "Survival"],
  royals: ["Royal", "Chronicles"],
  politics: ["Power &", "Politics"],
};

let active = "all";

// ── INITIALIZE TABS ───────────────────────────────────────────────────────
const tabsEl = document.getElementById('tabs');
if (tabsEl) {
  CATS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'tab' + (c.id === 'all' ? ' active' : '');
    b.dataset.cat = c.id;
    b.textContent = c.label;
    b.onclick = () => {
      active = c.id;
      document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x.dataset.cat === c.id));
      document.querySelectorAll('.mood-btn').forEach(x => x.classList.remove('active'));
      document.getElementById('searchInput').value = '';
      document.getElementById('aiSearchResult').classList.remove('show');
      render();
    };
    tabsEl.appendChild(b);
  });
}

// ── RENDER ENGINE ─────────────────────────────────────────────────────────
function renderList(list) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #64748b; font-family: \'JetBrains Mono\', monospace;">No historical titles matching criteria found.</div>';
    return;
  }

  list.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card';

    // Fallback letter box
    const fb = document.createElement('div');
    fb.className = 'card-fb';
    fb.style.background = `linear-gradient(145deg, ${m.ac || '#111827'} 0%, #07080c 100%)`;
    fb.innerHTML = `<span class="card-fb-letter">${m.title[0]}</span><span class="card-fb-name">${m.title}</span>`;
    card.appendChild(fb);

    // Badges
    const badge = document.createElement('div');
    badge.className = 'card-badge';
    badge.style.color = '#d4af37';
    badge.style.borderColor = 'rgba(212,175,55,0.4)';
    badge.textContent = m.type || 'FILM';
    card.appendChild(badge);

    const rat = document.createElement('div');
    rat.className = 'card-rating';
    rat.textContent = `★ ${m.rating}`;
    card.appendChild(rat);

    // Bottom strip
    const strip = document.createElement('div');
    strip.className = 'card-strip';
    strip.innerHTML = `<div class="card-strip-title">${m.title}</div><div class="card-strip-year">${m.year} &middot; ${m.cat.toUpperCase()}</div>`;
    card.appendChild(strip);

    card.onclick = () => openModal(m);
    grid.appendChild(card);

    // Fetch TMDB Poster
    fetchPoster(m).then(url => {
      if (!url) return;
      const img = document.createElement('img');
      img.className = 'card-img';
      img.alt = m.title;
      img.loading = 'lazy';
      img.onload = () => {
        fb.classList.add('hidden');
        card.insertBefore(img, card.firstChild);
      };
      img.src = url;
    });
  });
}

function render() {
  const list = active === 'all' ? MOVIES : MOVIES.filter(m => m.cat === active);
  const idx = CATS.findIndex(c => c.id === active);
  const [l1, l2] = LABELS[active] || ["Curated", "Archive"];

  if (document.getElementById('secIdx')) document.getElementById('secIdx').textContent = String(idx >= 0 ? idx : 0).padStart(2, '0');
  if (document.getElementById('secM')) document.getElementById('secM').textContent = l1;
  if (document.getElementById('secI')) document.getElementById('secI').textContent = l2;
  if (document.getElementById('secCount')) document.getElementById('secCount').textContent = list.length + ' Titles';
  if (document.getElementById('navCount')) document.getElementById('navCount').textContent = list.length + ' Titles';

  renderList(list);
}

// ── SEARCH ────────────────────────────────────────────────────────────────
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });
}

function doSearch() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!q) {
    render();
    return;
  }
  const filtered = MOVIES.filter(m =>
    m.title.toLowerCase().includes(q) ||
    (m.desc && m.desc.toLowerCase().includes(q)) ||
    (m.truth && m.truth.toLowerCase().includes(q)) ||
    (m.year && m.year.toString().includes(q))
  );

  if (document.getElementById('secM')) document.getElementById('secM').textContent = 'Search';
  if (document.getElementById('secI')) document.getElementById('secI').textContent = `"${q}"`;
  if (document.getElementById('secCount')) document.getElementById('secCount').textContent = `${filtered.length} Matches`;
  renderList(filtered);
}

// ── THEME MOOD FILTER ─────────────────────────────────────────────────────
function doMood(btn, query) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const terms = query.toLowerCase().split(' ');
  const filtered = MOVIES.filter(m => {
    const text = (m.title + ' ' + m.desc + ' ' + m.truth + ' ' + m.cat).toLowerCase();
    return terms.some(t => t.length > 3 && text.includes(t));
  });

  const list = filtered.length ? filtered : MOVIES.slice(0, 15);
  if (document.getElementById('secM')) document.getElementById('secM').textContent = 'Thematic';
  if (document.getElementById('secI')) document.getElementById('secI').textContent = btn.textContent;
  if (document.getElementById('secCount')) document.getElementById('secCount').textContent = `${list.length} Curated`;
  renderList(list);
}

// ── MODAL ─────────────────────────────────────────────────────────────────
const modalBg = document.getElementById('modal-bg');

function openModal(m) {
  if (!modalBg) return;

  const wrap = document.getElementById('mImgWrap');
  wrap.innerHTML = `<div class="card-fb" style="width:240px;height:340px;border-radius:10px;background:linear-gradient(145deg, ${m.ac || '#1e293b'}, #07080c);display:flex;align-items:center;justify-content:center;color:#d4af37;font-family:'Cinzel',serif;font-size:72px;">${m.title[0]}</div>`;

  fetchPoster(m).then(url => {
    if (!url) return;
    wrap.innerHTML = `<img src="${url}" alt="${m.title}" style="width:100%;border-radius:10px;box-shadow:0 12px 35px rgba(0,0,0,0.8);border:1px solid rgba(212,175,55,0.3)"/>`;
  });

  document.getElementById('mType').textContent = m.type || 'FEATURE';
  document.getElementById('mCat').textContent = m.cat.toUpperCase();
  document.getElementById('mScore').textContent = `★ ${m.rating} / 10`;
  document.getElementById('mTitle').textContent = m.title;
  document.getElementById('mYear').textContent = `Released: ${m.year} &middot; Historical Category: ${m.cat.toUpperCase()}`;
  document.getElementById('mDesc').textContent = m.desc;
  document.getElementById('mTruth').textContent = m.truth || 'Verified against original biographical memoirs and historical archives.';

  modalBg.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalBg) return;
  modalBg.classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOnBg(e) {
  if (e.target && e.target.id === 'modal-bg') closeModal();
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── BOOTSTRAP ─────────────────────────────────────────────────────────────
render();
console.log('Real Stories Historical Cinema Archive loaded: 85 masterworks.');
