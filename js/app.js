// ── CURSOR ────────────────────────────────────────────────────────────────
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
(function a(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(a)})();
function cursorHover(els){els.forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.width='18px';cur.style.height='18px';ring.style.width='52px';ring.style.height='52px';ring.style.opacity='1'});
  el.addEventListener('mouseleave',()=>{cur.style.width='10px';cur.style.height='10px';ring.style.width='36px';ring.style.height='36px';ring.style.opacity='.5'});
});}
document.querySelectorAll('button,.tab').forEach(el=>cursorHover([el]));

// ── API KEYS (SECURE CONFIG) ──────────────────────────────────────────────
let TMDB_KEY = localStorage.getItem('tmdb_key') || 'f45fbdd7b24f1341eb132d1d53f5bf98';
let GROQ_KEY = localStorage.getItem('groq_key') || window.GROQ_KEY || '';

function saveKeys() {
  const input = prompt('Enter your Groq API Key (from https://console.groq.com):', GROQ_KEY);
  if (input) {
    GROQ_KEY = input.trim();
    localStorage.setItem('groq_key', GROQ_KEY);
  }
}

// Show mood bar always (keys are always set)
function updateMoodBar(){
  document.getElementById('moodBar').classList.add('open');
}
updateMoodBar();

// ── TMDB ──────────────────────────────────────────────────────────────────
let posterCache={};
const TMDB_IMG='https://image.tmdb.org/t/p/w500';

async function fetchPoster(m){
  if(posterCache[m.id]!==undefined)return posterCache[m.id];
  if(!TMDB_KEY){posterCache[m.id]=null;return null;}
  try{
    const tv=(m.type==='SERIES'||m.type==='MINI');
    const url=`https://api.themoviedb.org/3/search/${tv?'tv':'movie'}?api_key=${TMDB_KEY}&query=${encodeURIComponent(m.title)}&language=en-US&page=1`;
    const res=await fetch(url);if(!res.ok)throw 0;
    const {results=[]}=await res.json();
    const yearKey=tv?'first_air_date':'release_date';
    const match=results.find(x=>(x[yearKey]||'').startsWith(m.year))||results[0];
    posterCache[m.id]=match?.poster_path?TMDB_IMG+match.poster_path:null;
  }catch{posterCache[m.id]=null;}
  return posterCache[m.id];
}

// ── GROQ ──────────────────────────────────────────────────────────────────
async function groq(messages,max_tokens=400,temperature=0.75){
  if(!GROQ_KEY){ saveKeys(); }
  if(!GROQ_KEY)throw new Error('Please set a Groq API key (console.groq.com) to use AI features.');
  const res=await fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`},
    body:JSON.stringify({model:'llama-3.1-8b-instant',messages,max_tokens,temperature})
  });
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.error?.message||`HTTP ${res.status}`);}
  const d=await res.json();
  return d.choices?.[0]?.message?.content||'';
}

// ── DATA ──────────────────────────────────────────────────────────────────
const MOVIES=[
  // ── SHOCKING ──
  {id:1,  cat:"shocking",type:"FILM",  year:"2002",rating:"8.1",title:"Catch Me If You Can",        desc:"Frank Abagnale Jr. conned millions impersonating a pilot, doctor and lawyer — all before turning 21. DiCaprio at his most electric.",ac:"#8b4513"},
  {id:2,  cat:"shocking",type:"SERIES",year:"2021",rating:"8.5",title:"The Serpent",                desc:"Charles Sobhraj — charming, multilingual, terrifying — preyed on backpackers across Southeast Asia and evaded justice for decades.",ac:"#1a4a2e"},
  {id:3,  cat:"shocking",type:"SERIES",year:"2018",rating:"8.2",title:"Waco",                       desc:"David Koresh and the 51-day FBI standoff that ended in catastrophic fire. A portrait of faith, charisma, and power colliding.",ac:"#4a1010"},
  {id:4,  cat:"shocking",type:"SERIES",year:"2019",rating:"8.4",title:"The Act",                    desc:"Gypsy Rose Blanchard was kept sick by her own mother for years — Munchausen by proxy ending in a crime no one saw coming.",ac:"#2a1040"},
  {id:5,  cat:"shocking",type:"SERIES",year:"2022",rating:"7.9",title:"The Dropout",                desc:"Elizabeth Holmes dropped out of Stanford, charmed billionaires, and built a medical empire on a complete lie.",ac:"#0e3a50"},
  {id:6,  cat:"shocking",type:"FILM",  year:"2003",rating:"7.5",title:"Monster",                    desc:"Charlize Theron won the Oscar vanishing into Aileen Wuornos — a serial killer whose life was as tragic as her crimes.",ac:"#2a1010"},
  {id:43, cat:"shocking",type:"SERIES",year:"2017",rating:"8.7",title:"Dirty Money",                desc:"Netflix's explosive documentary series exposing corporate corruption — from Volkswagen's emissions scandal to payday loan empires.",ac:"#0a1a28"},
  {id:44, cat:"shocking",type:"SERIES",year:"2022",rating:"8.0",title:"The Tinder Swindler",        desc:"Simon Leviev posed as a billionaire diamond mogul on Tinder, romancing women across Europe to fund his lavish lies.",ac:"#1c0a28"},
  {id:45, cat:"shocking",type:"SERIES",year:"2023",rating:"7.8",title:"Madoff: The Monster of Wall Street",desc:"Bernie Madoff orchestrated history's largest Ponzi scheme — $65 billion stolen, thousands of lives destroyed, and decades of looking the other way.",ac:"#0a1830"},
  {id:46, cat:"shocking",type:"SERIES",year:"2022",rating:"7.6",title:"The Puppet Master",          desc:"Robert Hendy-Freegard impersonated an MI5 agent for years, psychologically manipulating victims into funding his fake spy life.",ac:"#1a1428"},
  {id:47, cat:"shocking",type:"FILM",  year:"2017",rating:"7.4",title:"I, Tonya",                   desc:"Margot Robbie as Tonya Harding — a gifted skater from a brutal home, destroyed by the most infamous scandal in sports history.",ac:"#081828"},

  // ── MUSIC ──
  {id:7,  cat:"music",   type:"FILM",  year:"2018",rating:"7.9",title:"Bohemian Rhapsody",          desc:"From Farrokh Bulsara in Zanzibar to Freddie Mercury at Live Aid — the heartbreaking rise of one of rock's greatest voices.",ac:"#5a2e08"},
  {id:8,  cat:"music",   type:"FILM",  year:"2019",rating:"7.3",title:"Rocketman",                  desc:"A fantastical musical odyssey through Elton John's life — from awkward piano prodigy to one of the biggest stars on earth.",ac:"#102050"},
  {id:9,  cat:"music",   type:"FILM",  year:"2022",rating:"7.8",title:"Elvis",                      desc:"Baz Luhrmann's fever-dream portrait of Presley and his manipulative manager — a man who changed music but lost himself.",ac:"#380808"},
  {id:10, cat:"music",   type:"FILM",  year:"2004",rating:"7.7",title:"Ray",                        desc:"Jamie Foxx's Oscar-winning transformation into Ray Charles — genius, addiction, turbulence and the sound that defined American music.",ac:"#081808"},
  {id:11, cat:"music",   type:"FILM",  year:"2015",rating:"7.8",title:"Straight Outta Compton",     desc:"Ice Cube, Dr. Dre and Eazy-E — three men from Compton who created N.W.A and exploded America's idea of what music could say.",ac:"#0a0a0a"},
  {id:12, cat:"music",   type:"FILM",  year:"2024",rating:"7.8",title:"Bob Marley: One Love",       desc:"The life and legend of Bob Marley — from the hills of Jamaica to a global symbol of peace, love and resistance.",ac:"#1a3808"},
  {id:13, cat:"music",   type:"SERIES",year:"2023",rating:"8.1",title:"Daisy Jones & The Six",      desc:"A deeply real-feeling chronicle of a 1970s rock band's rise and implosion — inspired by Fleetwood Mac.",ac:"#301020"},
  {id:48, cat:"music",   type:"FILM",  year:"2014",rating:"8.7",title:"Whiplash",                   desc:"A young jazz drummer at an elite conservatory meets a conductor who terrorizes students into greatness — inspired by director Damien Chazelle's own brutal teacher.",ac:"#1a0808"},
  {id:49, cat:"music",   type:"FILM",  year:"2007",rating:"7.5",title:"La Vie en Rose",             desc:"Marion Cotillard's Oscar-winning portrayal of Édith Piaf — the sparrow of Paris, who sang through poverty, addiction and loss.",ac:"#300818"},
  {id:50, cat:"music",   type:"FILM",  year:"2023",rating:"7.1",title:"Maestro",                    desc:"Bradley Cooper's immersive portrait of Leonard Bernstein — conductor, composer, and one of the most complicated men in American music.",ac:"#08101c"},
  {id:51, cat:"music",   type:"SERIES",year:"2022",rating:"8.3",title:"Pam & Tommy",                desc:"The true story of Pamela Anderson and Tommy Lee's stolen sex tape — and how it accidentally invented the internet economy.",ac:"#200810"},
  {id:52, cat:"music",   type:"FILM",  year:"1988",rating:"7.5",title:"Bird",                       desc:"Clint Eastwood's haunting biopic of Charlie Parker — the jazz genius who blew the saxophone like God and destroyed himself doing it.",ac:"#0a0810"},

  // ── SCIENCE ──
  {id:14, cat:"science", type:"FILM",  year:"2023",rating:"8.3",title:"Oppenheimer",                desc:"J. Robert Oppenheimer built the bomb that ended WWII — then spent his life haunted by it. Cillian Murphy is career-defining.",ac:"#503808"},
  {id:15, cat:"science", type:"FILM",  year:"2014",rating:"8.0",title:"The Imitation Game",         desc:"Alan Turing cracked the Nazi Enigma code and helped win WWII — then was prosecuted by the government he saved for being gay.",ac:"#082030"},
  {id:16, cat:"science", type:"FILM",  year:"2016",rating:"7.8",title:"Hidden Figures",             desc:"Three Black women mathematicians at NASA whose calculations launched humans into orbit — erased from history for decades.",ac:"#082818"},
  {id:17, cat:"science", type:"FILM",  year:"2001",rating:"8.2",title:"A Beautiful Mind",           desc:"John Nash — Nobel Prize-winning genius in game theory who battled paranoid schizophrenia, unsure of what was real.",ac:"#101040"},
  {id:18, cat:"science", type:"FILM",  year:"2014",rating:"7.7",title:"The Theory of Everything",   desc:"Stephen Hawking's journey from Cambridge student to the world's most famous scientist, told through his first wife's eyes.",ac:"#081428"},
  {id:53, cat:"science", type:"FILM",  year:"2015",rating:"8.0",title:"The Martian",                desc:"Based on Andy Weir's real-science novel — astronaut Mark Watney is stranded on Mars and must science his way to survival.",ac:"#381408"},
  {id:54, cat:"science", type:"SERIES",year:"2019",rating:"8.6",title:"Unbelievable",               desc:"Based on a Pulitzer-winning ProPublica investigation — a teenager's rape report is dismissed, and two detectives slowly unravel the truth.",ac:"#0e1828"},
  {id:55, cat:"science", type:"FILM",  year:"1995",rating:"7.6",title:"Apollo 13",                  desc:"An oxygen tank explosion nearly strands three astronauts in space. NASA's finest hour — engineers who refused to lose.",ac:"#101830"},
  {id:56, cat:"science", type:"FILM",  year:"2015",rating:"7.4",title:"The Man Who Knew Infinity",  desc:"Srinivasa Ramanujan — the self-taught Indian mathematician who arrived at Cambridge with no formal training and revolutionized mathematics.",ac:"#0c1820"},

  // ── CRIME ──
  {id:19, cat:"crime",   type:"SERIES",year:"2015",rating:"8.8",title:"Narcos",                     desc:"Pablo Escobar turned Colombia into his personal kingdom, made billions in cocaine, and terrorized a continent.",ac:"#280808"},
  {id:20, cat:"crime",   type:"FILM",  year:"1990",rating:"8.7",title:"Goodfellas",                 desc:"Henry Hill's life inside the mob — Scorsese at his most electric, detailing the glamour, violence, and collapse of organized crime.",ac:"#0a0818"},
  {id:21, cat:"crime",   type:"FILM",  year:"1973",rating:"7.9",title:"Serpico",                    desc:"Al Pacino as Frank Serpico — the only honest cop in a corrupt NYPD who blew the whistle and paid nearly with his life.",ac:"#101808"},
  {id:22, cat:"crime",   type:"SERIES",year:"2013",rating:"9.5",title:"Breaking Bad",               desc:"Walter White — chemistry teacher turned drug kingpin. The most chillingly real portrait of moral collapse ever filmed.",ac:"#201400"},
  {id:23, cat:"crime",   type:"SERIES",year:"2021",rating:"8.2",title:"Inventing Anna",             desc:"Anna Delvey convinced New York's elite she was a German heiress — and nearly pulled off the ultimate con before it unraveled.",ac:"#180828"},
  {id:24, cat:"crime",   type:"FILM",  year:"2015",rating:"7.8",title:"The Big Short",              desc:"A handful of outsiders foresaw the 2008 financial collapse and bet against the entire US mortgage market — and were right.",ac:"#081418"},
  {id:57, cat:"crime",   type:"SERIES",year:"2022",rating:"8.1",title:"Monster: Jeffrey Dahmer Story",desc:"Ryan Murphy's unflinching portrait of Milwaukee's most notorious serial killer — the victims, the community, and a system that failed them.",ac:"#0a1008"},
  {id:58, cat:"crime",   type:"FILM",  year:"2007",rating:"8.0",title:"American Gangster",          desc:"Frank Lucas built a heroin empire smuggling drugs inside US soldiers' coffins from Vietnam — and Denzel Washington plays every inch of him.",ac:"#180c08"},
  {id:59, cat:"crime",   type:"SERIES",year:"2018",rating:"8.6",title:"Mindhunter",                 desc:"The true story of FBI agents who pioneered criminal profiling by interviewing America's most notorious serial killers in the 1970s.",ac:"#0c1014"},
  {id:60, cat:"crime",   type:"FILM",  year:"1997",rating:"7.7",title:"Donnie Brasco",              desc:"FBI undercover agent Joe Pistone spent six years embedded in the New York mob — and nearly lost himself in the process.",ac:"#0a0c10"},
  {id:61, cat:"crime",   type:"MINI",  year:"2018",rating:"8.9",title:"The Assassination of Gianni Versace",desc:"The murder of fashion icon Gianni Versace and the killer who stalked America's rich and famous for years while the FBI looked away.",ac:"#280818"},

  // ── WAR ──
  {id:25, cat:"war",     type:"MINI",  year:"2019",rating:"9.4",title:"Chernobyl",                  desc:"The 1986 Soviet nuclear disaster — the meltdown, the cover-up, and the human cost of institutional lies.",ac:"#081008"},
  {id:26, cat:"war",     type:"FILM",  year:"2017",rating:"7.4",title:"Darkest Hour",               desc:"May 1940. Europe is falling. Churchill must decide: negotiate with Hitler or fight knowing it could mean the end of the Empire.",ac:"#181818"},
  {id:27, cat:"war",     type:"FILM",  year:"1993",rating:"9.0",title:"Schindler's List",           desc:"Oskar Schindler — a war profiteer who saved over 1,000 Jewish lives. Spielberg's devastating, irreplaceable masterpiece.",ac:"#0e0e0e"},
  {id:28, cat:"war",     type:"FILM",  year:"2014",rating:"7.3",title:"American Sniper",            desc:"Chris Kyle — the most lethal sniper in US history — four tours in Iraq, 160 confirmed kills, and a war he could never leave.",ac:"#201408"},
  {id:29, cat:"war",     type:"MINI",  year:"2001",rating:"9.4",title:"Band of Brothers",           desc:"The true story of Easy Company from D-Day to the Eagle's Nest. One of the greatest war epics ever committed to screen.",ac:"#101408"},
  {id:30, cat:"war",     type:"FILM",  year:"2017",rating:"7.9",title:"Dunkirk",                    desc:"300,000 Allied soldiers stranded on a beach, the enemy closing in. Nolan rebuilds the most desperate rescue mission in history.",ac:"#0c1420"},
  {id:62, cat:"war",     type:"MINI",  year:"2010",rating:"9.2",title:"The Pacific",                desc:"The brutal, largely forgotten war in the Pacific — told through three Marines' lives from Guadalcanal to Okinawa.",ac:"#101820"},
  {id:63, cat:"war",     type:"FILM",  year:"1987",rating:"8.5",title:"Full Metal Jacket",          desc:"Stanley Kubrick's searing, two-act Vietnam War portrait — boot camp brutality giving way to the chaos of Hue City in 1968.",ac:"#141010"},
  {id:64, cat:"war",     type:"FILM",  year:"2001",rating:"7.8",title:"Black Hawk Down",            desc:"The true story of 18 US soldiers killed in Mogadishu, Somalia in 1993 — a battle that lasted 18 hours and changed American foreign policy.",ac:"#181410"},
  {id:65, cat:"war",     type:"FILM",  year:"1998",rating:"8.6",title:"Saving Private Ryan",        desc:"Spielberg reconstructs D-Day with terrifying realism, then sends a squad across France to find one surviving brother.",ac:"#101210"},

  // ── ROYALS ──
  {id:31, cat:"royals",  type:"SERIES",year:"2016",rating:"8.7",title:"The Crown",                  desc:"Queen Elizabeth II across seven decades — wars, scandals, divorces, and the crushing weight of a crown.",ac:"#081420"},
  {id:32, cat:"royals",  type:"FILM",  year:"2023",rating:"6.4",title:"Napoleon",                   desc:"Ridley Scott's grand portrait of Bonaparte — from the shadow of the guillotine to Waterloo, with Joaquin Phoenix.",ac:"#200808"},
  {id:33, cat:"royals",  type:"FILM",  year:"2006",rating:"7.1",title:"Marie Antoinette",           desc:"Sofia Coppola treats the doomed queen as a teenager trapped in gilded captivity — sun-drenched and surprisingly sympathetic.",ac:"#381018"},
  {id:34, cat:"royals",  type:"SERIES",year:"2020",rating:"8.1",title:"The Great",                  desc:"Catherine the Great seizes power from her buffoonish husband — darkly funny, sharp, and full of real historical venom.",ac:"#281408"},
  {id:35, cat:"royals",  type:"MINI",  year:"2019",rating:"8.2",title:"Catherine the Great",        desc:"Helen Mirren as the formidable Russian empress in her final years — love affairs, political ruthlessness, iron-willed authority.",ac:"#101828"},
  {id:36, cat:"royals",  type:"FILM",  year:"2010",rating:"8.0",title:"The King's Speech",          desc:"King George VI's struggle to overcome a crippling stammer before addressing the nation in the darkest hour of WWII.",ac:"#081818"},
  {id:66, cat:"royals",  type:"FILM",  year:"2006",rating:"7.6",title:"The Queen",                  desc:"Helen Mirren's Oscar-winning portrayal of Elizabeth II in the days after Diana's death — and the clash between tradition and the modern world.",ac:"#0c1820"},
  {id:67, cat:"royals",  type:"FILM",  year:"2021",rating:"6.9",title:"Spencer",                    desc:"Kristen Stewart inhabits Princess Diana during one agonizing Christmas at Sandringham — a woman slowly being erased.",ac:"#181018"},
  {id:68, cat:"royals",  type:"SERIES",year:"2022",rating:"7.7",title:"The Empress",                desc:"The story of the young Sisi — Elisabeth of Austria — thrown into the glamour and suffocation of the Habsburg court.",ac:"#281028"},
  {id:69, cat:"royals",  type:"FILM",  year:"1998",rating:"7.8",title:"Elizabeth",                  desc:"Cate Blanchett's electrifying debut as the young Elizabeth I — navigating plots, marriage pressure, and the price of absolute power.",ac:"#281810"},

  // ── SPORTS ──
  {id:37, cat:"sports",  type:"FILM",  year:"2019",rating:"8.1",title:"Ford v Ferrari",             desc:"Carroll Shelby and Ken Miles build a car to beat Ferrari at Le Mans 1966. The greatest racing film ever made.",ac:"#280808"},
  {id:38, cat:"sports",  type:"FILM",  year:"2011",rating:"7.6",title:"Moneyball",                  desc:"Billy Beane revolutionized baseball by using statistics over gut — and changed the way every sport on earth would be managed.",ac:"#082018"},
  {id:39, cat:"sports",  type:"FILM",  year:"2023",rating:"7.5",title:"The Iron Claw",              desc:"The Von Erich wrestling dynasty — brothers chasing glory under their father's shadow, where every triumph brings tragedy.",ac:"#181018"},
  {id:40, cat:"sports",  type:"FILM",  year:"2005",rating:"7.8",title:"The World's Fastest Indian",  desc:"Burt Munro spent decades rebuilding a 1920 Indian motorcycle in his shed — then broke the land speed record at age 68.",ac:"#201408"},
  {id:41, cat:"sports",  type:"FILM",  year:"2013",rating:"8.1",title:"Rush",                       desc:"The epic rivalry between James Hunt and Niki Lauda in the 1976 Formula One season — speed, danger and two opposite men.",ac:"#380c08"},
  {id:70, cat:"sports",  type:"FILM",  year:"2023",rating:"8.3",title:"AIR",                        desc:"The true story of Nike's desperate gamble to sign an unknown rookie named Michael Jordan — a bet that changed sports marketing forever.",ac:"#101010"},
  {id:71, cat:"sports",  year:"2021",  type:"SERIES",rating:"8.2",title:"The Last Dance",           desc:"The definitive inside story of Michael Jordan and the 1997-98 Chicago Bulls — sports, ego, dynasty, and a coach who held it all together.",ac:"#0a0a14"},
  {id:72, cat:"sports",  type:"FILM",  year:"2022",rating:"7.7",title:"Hustle",                     desc:"Based partly on real scouts' lives — an NBA scout discovers a Spanish street player and bets his career to bring him to the league.",ac:"#0c1820"},
  {id:73, cat:"sports",  type:"FILM",  year:"2009",rating:"7.6",title:"The Blind Side",             desc:"The real story of Michael Oher — a homeless teenager taken in by a Tennessee family who becomes an NFL star.",ac:"#100c08"},
  {id:74, cat:"sports",  type:"FILM",  year:"1995",rating:"8.1",title:"Braveheart",                 desc:"William Wallace — the Scottish rebel who united clans against English rule and became one of history's great freedom fighters.",ac:"#101808"},

  // ── POLITICS ──
  {id:75, cat:"politics",type:"FILM",  year:"2012",rating:"8.5",title:"Lincoln",                    desc:"Daniel Day-Lewis inhabits Abraham Lincoln during the final months of the Civil War — fighting Congress for the 13th Amendment.",ac:"#101018"},
  {id:76, cat:"politics",type:"FILM",  year:"2008",rating:"7.4",title:"Frost/Nixon",                desc:"In 1977, TV host David Frost secured the only interview Nixon ever gave after his resignation — and it became a battle of wills.",ac:"#181010"},
  {id:77, cat:"politics",type:"SERIES",year:"2018",rating:"8.3",title:"The Crown (S3-S4)",          desc:"The Thatcher years, Charles and Diana's disintegrating marriage, and the transformation of Britain — monarchy meets modernity.",ac:"#101428"},
  {id:78, cat:"politics",type:"FILM",  year:"2019",rating:"8.0",title:"The Two Popes",              desc:"Pope Benedict and the future Pope Francis in an extraordinary series of conversations about faith, guilt, and the future of the Church.",ac:"#181410"},
  {id:79, cat:"politics",type:"SERIES",year:"2015",rating:"8.8",title:"The People v. O.J. Simpson", desc:"Ryan Murphy's electrifying retelling of the trial of the century — how race, celebrity, and media turned justice into spectacle.",ac:"#100810"},
  {id:80, cat:"politics",type:"FILM",  year:"2018",rating:"7.7",title:"Vice",                       desc:"Christian Bale becomes Dick Cheney — the most powerful Vice President in US history, and the man who quietly rewrote the rules of government.",ac:"#0a0c14"},
  {id:81, cat:"politics",type:"FILM",  year:"1976",rating:"8.0",title:"All the President's Men",   desc:"Woodward and Bernstein unravel Watergate — the two Washington Post reporters who brought down a president armed only with sources and stubbornness.",ac:"#0c1010"},
  {id:82, cat:"politics",type:"SERIES",year:"2021",rating:"7.9",title:"Impeachment: American Crime Story",desc:"Monica Lewinsky, Linda Tripp, Paula Jones — Ryan Murphy's retelling of the Clinton impeachment from the women at its center.",ac:"#180c1a"},
  {id:83, cat:"politics",type:"FILM",  year:"2017",rating:"7.9",title:"The Post",                   desc:"Katharine Graham and Ben Bradlee race to publish the Pentagon Papers against the government and their own fears — Streep and Hanks.",ac:"#0c1018"},
  {id:84, cat:"politics",type:"FILM",  year:"2013",rating:"7.5",title:"Mandela: Long Walk to Freedom",desc:"Nelson Mandela's extraordinary arc from young lawyer to prisoner to the president who dismantled apartheid and forgave his jailers.",ac:"#1a1008"},
  {id:85, cat:"politics",type:"FILM",  year:"2014",rating:"7.3",title:"Selma",                      desc:"Martin Luther King Jr.'s campaign to secure voting rights for Black Americans in 1965 — the march from Selma to Montgomery that changed America.",ac:"#0c1008"},
];

const MOVIES_INDEX = MOVIES.map(m=>`${m.id}|${m.title}|${m.year}|${m.cat}|${m.type}|${m.rating}|${m.desc}`).join('\n');

const CATS=[
  {id:"all",label:"All",icon:"★"},{id:"shocking",label:"Shocking",icon:"⚡"},
  {id:"music",label:"Music",icon:"♪"},{id:"science",label:"Science",icon:"◎"},
  {id:"crime",label:"Crime",icon:"◆"},{id:"war",label:"War",icon:"✦"},
  {id:"royals",label:"Royals",icon:"♛"},{id:"sports",label:"Sports",icon:"◉"},
  {id:"politics",label:"Politics",icon:"⚖"},
];
const LABELS={
  all:["Complete","Collection"],shocking:["Too Strange","to be Fiction"],
  music:["Icons of","Sound & Stage"],science:["Minds That Changed","Everything"],
  crime:["Power, Blood","& Consequence"],war:["Fire, Duty","& Survival"],
  royals:["Crowns &","Fallen Empires"],sports:["Blood, Speed","& Glory"],
  politics:["Power, Truth","& Consequence"],
};
const typeCol=t=>t==="FILM"?"#d4a017":t==="SERIES"?"#5bc4d4":"#d47a9a";
let active="all";

// ── TABS ──────────────────────────────────────────────────────────────────
const tabsEl=document.getElementById('tabs');
CATS.forEach(c=>{
  const b=document.createElement('button');
  b.className='tab'+(c.id==='all'?' active':'');
  b.dataset.cat=c.id;b.textContent=`${c.icon} ${c.label}`;
  b.onclick=()=>{
    active=c.id;
    document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.cat===c.id));
    clearMood();clearSearch();render();
  };
  tabsEl.appendChild(b);
  cursorHover([b]);
});

// ── RENDER ────────────────────────────────────────────────────────────────
function renderList(list){
  const grid=document.getElementById('grid');
  grid.innerHTML='';
  list.forEach((m,i)=>{
    const card=mkCard(m);
    card.style.animation=`cardIn .4s ${i*.025}s both`;
    grid.appendChild(card);
    cursorHover([card]);
    loadCardPoster(m,card);
  });
}

function render(){
  const list=active==='all'?MOVIES:MOVIES.filter(m=>m.cat===active);
  const idx=CATS.findIndex(c=>c.id===active);
  const[l1,l2]=LABELS[active];
  document.getElementById('secIdx').textContent=String(idx).padStart(2,'0');
  document.getElementById('secM').textContent=l1;
  document.getElementById('secI').textContent=l2;
  document.getElementById('secCount').innerHTML=list.length+'&nbsp;Titles';
  document.getElementById('navCount').textContent=list.length+' titles';
  renderList(list);
}

// ── CARD ──────────────────────────────────────────────────────────────────
function mkCard(m){
  const card=document.createElement('div');card.className='card';
  const fb=document.createElement('div');fb.className='card-fb';
  fb.style.background=`linear-gradient(145deg,${m.ac} 0%,#0a0a0b 100%)`;
  fb.innerHTML=`<span class="card-fb-letter">${m.title[0]}</span><span class="card-fb-name">${m.title}</span>`;
  card.appendChild(fb);
  const badge=document.createElement('div');badge.className='card-badge';badge.style.color=typeCol(m.type);badge.style.borderColor=typeCol(m.type)+'55';badge.textContent=m.type;card.appendChild(badge);
  const rat=document.createElement('div');rat.className='card-rating';rat.textContent=`★ ${m.rating}`;card.appendChild(rat);
  const strip=document.createElement('div');strip.className='card-strip';strip.innerHTML=`<div class="card-strip-title">${m.title}</div><div class="card-strip-year">${m.year}</div>`;card.appendChild(strip);
  const hov=document.createElement('div');hov.className='card-hover';hov.innerHTML=`<div class="card-htitle">${m.title}</div><div class="card-hyear">${m.year}</div><div class="card-hdesc">${m.desc}</div><span class="card-hcta">View Details →</span>`;card.appendChild(hov);
  if(true){const aib=document.createElement('div');aib.className='card-ai-badge';aib.textContent='⚡ AI';card.appendChild(aib);}
  card.onclick=()=>openModal(m);
  return card;
}

async function loadCardPoster(m,card){
  const url=await fetchPoster(m);if(!url)return;
  const img=document.createElement('img');img.className='card-img';img.alt=m.title;
  img.onload=()=>{
    const fb=card.querySelector('.card-fb');
    if(fb){fb.classList.add('hidden');setTimeout(()=>fb.remove(),500);}
    img.classList.add('loaded');
    card.insertBefore(img,card.firstChild);
  };
  img.src=url;
}

// ── AI SEARCH ────────────────────────────────────────────────────────────
document.getElementById('searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch();});

async function doSearch(){
  const q=document.getElementById('searchInput').value.trim();
  if(!q)return;
  if(!GROQ_KEY){
    // Fallback: simple title filter
    const lower=q.toLowerCase();
    const results=MOVIES.filter(m=>m.title.toLowerCase().includes(lower)||m.desc.toLowerCase().includes(lower)||m.cat.includes(lower));
    clearSearch();renderList(results);
    document.getElementById('navCount').textContent=results.length+' results';
    return;
  }
  document.getElementById('searchBtn').textContent='Searching…';
  clearMood();
  try{
    const prompt=`You are helping search a movie database. The user searched: "${q}"

Here is the full catalog (id|title|year|cat|type|rating|desc):
${MOVIES_INDEX}

Return a JSON object with:
- "summary": A 1-2 sentence response explaining what you found and why (vivid, cinephile tone, no markdown)
- "ids": array of matching movie IDs (numbers) ordered by relevance, max 12

Only return valid JSON, nothing else.`;

    const raw=await groq([{role:'user',content:prompt}],300,0.4);
    let data;
    try{data=JSON.parse(raw.replace(/```json|```/g,'').trim());}
    catch{data={summary:'Found some matches.',ids:MOVIES.filter(m=>m.title.toLowerCase().includes(q.toLowerCase())).map(m=>m.id)};}

    const matched=data.ids.map(id=>MOVIES.find(m=>m.id===id)).filter(Boolean);
    document.getElementById('aiSearchText').textContent=data.summary||'';
    const matchDiv=document.getElementById('asrMatches');
    matchDiv.innerHTML='';
    matched.slice(0,6).forEach(m=>{
      const btn=document.createElement('button');btn.className='asr-match';btn.textContent=m.title;
      btn.onclick=()=>openModal(m);matchDiv.appendChild(btn);cursorHover([btn]);
    });
    document.getElementById('aiSearchResult').classList.add('show');
    renderList(matched);
    document.getElementById('navCount').textContent=matched.length+' results';
    document.getElementById('secM').textContent='Search';
    document.getElementById('secI').textContent=`"${q}"`;
    document.getElementById('secCount').innerHTML=matched.length+'&nbsp;Titles';
  }catch(e){
    document.getElementById('aiSearchText').textContent='Search error: '+e.message;
    document.getElementById('aiSearchResult').classList.add('show');
  }
  document.getElementById('searchBtn').textContent='Search';
}

function clearSearch(){
  document.getElementById('aiSearchResult').classList.remove('show');
  document.getElementById('searchInput').value='';
}

// ── MOOD RECOMMENDATIONS ──────────────────────────────────────────────────
let activeMoodBtn=null;
async function doMood(btn,mood){
  if(activeMoodBtn===btn){clearMood();render();return;}
  if(activeMoodBtn)activeMoodBtn.classList.remove('active');
  btn.classList.add('active');activeMoodBtn=btn;
  clearSearch();
  btn.textContent='⏳ '+btn.textContent.replace(/^⏳\s*/,'');
  try{
    const prompt=`You are a film recommendation engine. The user wants: "${mood}"

Catalog (id|title|year|cat|type|rating|desc):
${MOVIES_INDEX}

Return JSON only:
- "label": short catchy label for this mood selection (max 5 words)
- "ids": array of 6-10 movie IDs ordered by fit

Only valid JSON, no markdown.`;

    const raw=await groq([{role:'user',content:prompt}],200,0.5);
    let data;
    try{data=JSON.parse(raw.replace(/```json|```/g,'').trim());}catch{data={label:mood,ids:MOVIES.map(m=>m.id).slice(0,8)};}

    const matched=data.ids.map(id=>MOVIES.find(m=>m.id===id)).filter(Boolean);
    const ml=document.getElementById('moodLabel');
    ml.textContent=`⚡ ${data.label||mood} — ${matched.length} titles`;
    ml.classList.add('show');
    document.getElementById('secM').textContent='Mood Pick';
    document.getElementById('secI').textContent=data.label||mood;
    document.getElementById('secCount').innerHTML=matched.length+'&nbsp;Titles';
    document.getElementById('navCount').textContent=matched.length+' titles';
    document.getElementById('secIdx').textContent='✦';
    renderList(matched);
  }catch(e){console.error(e);}
  btn.textContent=btn.textContent.replace(/^⏳\s*/,'');
}

function clearMood(){
  if(activeMoodBtn)activeMoodBtn.classList.remove('active');
  activeMoodBtn=null;
  document.getElementById('moodLabel').classList.remove('show');
}

// ── MODAL ─────────────────────────────────────────────────────────────────
const modalBg=document.getElementById('modal-bg');
let currentMovie=null;

async function openModal(m){
  currentMovie=m;
  // Reset chat + deeper
  document.getElementById('chatMsgs').innerHTML='';
  document.getElementById('chatInput').value='';
  document.getElementById('chatSend').disabled=false;
  document.getElementById('mAiDesc').classList.remove('show');
  document.getElementById('mAiDescText').textContent='';
  document.getElementById('btnDeeper').classList.remove('loading');

  // Poster
  const wrap=document.getElementById('mImgWrap');wrap.innerHTML='';
  const fb=document.createElement('div');fb.className='modal-poster-fb';
  fb.style.background=`linear-gradient(145deg,${m.ac} 0%,#0a0a0b 100%)`;fb.textContent=m.title[0];
  wrap.appendChild(fb);
  fetchPoster(m).then(url=>{
    if(!url)return;
    const img=document.createElement('img');img.className='modal-poster';img.alt=m.title;
    img.onload=()=>fb.replaceWith(img);img.src=url;
  });

  // Info
  document.getElementById('mType').textContent=m.type;
  document.getElementById('mCat').textContent=m.cat.toUpperCase();
  document.getElementById('mCat').style.color=typeCol(m.type);
  document.getElementById('mScore').textContent=`★ ${m.rating}`;
  document.getElementById('mTitle').textContent=m.title;
  document.getElementById('mYear').textContent=m.year;
  document.getElementById('mDesc').textContent=m.desc;

  // Quick prompts
  const qps=[
    'How historically accurate is this?',
    'What happened to the real person?',
    'Why should I watch this?',
    'What are the best scenes?',
  ];
  const qpDiv=document.getElementById('quickPrompts');qpDiv.innerHTML='';
  qps.forEach(q=>{
    const b=document.createElement('button');b.className='qp';b.textContent=q;
    b.onclick=()=>{document.getElementById('chatInput').value=q;sendChat();};
    qpDiv.appendChild(b);cursorHover([b]);
  });

  // Similar titles
  loadSimilar(m);

  modalBg.classList.add('open');document.body.style.overflow='hidden';
}

function closeModal(){modalBg.classList.remove('open');document.body.style.overflow='';currentMovie=null;}
document.getElementById('modal-close').onclick=closeModal;
modalBg.onclick=e=>{if(e.target===modalBg)closeModal();};
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
document.getElementById('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}});

// ── AI DEEP DIVE ──────────────────────────────────────────────────────────
async function loadDeeper(){
  if(!currentMovie)return;
  if(!GROQ_KEY){addChatMsg('ai','Enter your Groq API key to use AI features.');return;}
  const btn=document.getElementById('btnDeeper');
  btn.classList.add('loading');btn.disabled=true;
  try{
    const m=currentMovie;
    const text=await groq([{role:'system',content:`You are a passionate film critic and historian. Write a deep-dive paragraph (4-6 sentences) about "${m.title}" (${m.year}). Cover: the real story behind it, what makes it exceptional, one surprising historical fact, and why it lingers. No markdown, pure prose, vivid and literary.`}],350,0.85);
    document.getElementById('mAiDescText').textContent=text;
    document.getElementById('mAiDesc').classList.add('show');
    btn.style.display='none';
  }catch(e){
    document.getElementById('mAiDescText').textContent='Error: '+e.message;
    document.getElementById('mAiDesc').classList.add('show');
  }
  btn.classList.remove('loading');btn.disabled=false;
}

// ── SIMILAR TITLES ────────────────────────────────────────────────────────
async function loadSimilar(m){
  const sc=document.getElementById('similarCards');
  sc.innerHTML='<span class="similar-loading">Finding similar titles…</span>';
  let ids;
  if(GROQ_KEY){
    try{
      const raw=await groq([{role:'user',content:`Given this film: "${m.title}" (${m.year}, cat:${m.cat}, desc:${m.desc})

From this catalog (id|title|year|cat|type|rating|desc):
${MOVIES_INDEX}

Return JSON only: {"ids":[array of 5 most similar movie IDs, excluding id ${m.id}]}
No markdown.`}],120,0.4);
      const d=JSON.parse(raw.replace(/```json|```/g,'').trim());
      ids=d.ids;
    }catch{ids=fallbackSimilar(m);}
  }else{ids=fallbackSimilar(m);}

  const similar=ids.map(id=>MOVIES.find(x=>x.id===id)).filter(Boolean).slice(0,5);
  sc.innerHTML='';
  similar.forEach(s=>{
    const c=document.createElement('div');c.className='sim-card';
    c.innerHTML=`<div class="sim-fb" style="background:linear-gradient(145deg,${s.ac},#0a0a0b)">${s.title[0]}</div><div class="sim-title">${s.title}</div>`;
    c.onclick=()=>openModal(s);sc.appendChild(c);cursorHover([c]);
    // Load poster
    fetchPoster(s).then(url=>{
      if(!url)return;
      const img=document.createElement('img');img.className='sim-img';img.alt=s.title;
      img.onload=()=>{c.querySelector('.sim-fb').replaceWith(img);};img.src=url;
    });
  });
}

function fallbackSimilar(m){
  return MOVIES.filter(x=>x.id!==m.id&&x.cat===m.cat).slice(0,5).map(x=>x.id);
}

// ── AI CHAT ───────────────────────────────────────────────────────────────
async function sendChat(){
  if(!currentMovie)return;
  const inp=document.getElementById('chatInput');
  const q=inp.value.trim();if(!q)return;
  if(!GROQ_KEY){addChatMsg('ai','⚠ Enter your Groq API key in the banner above.');return;}
  inp.value='';
  addChatMsg('user',q);
  const load=addChatMsg('ai','',true);
  document.getElementById('chatSend').disabled=true;
  try{
    const m=currentMovie;
    const sys=`You are an expert film critic and historian. Context: "${m.title}" (${m.year}, ${m.type}, ${m.cat}, ★${m.rating}). About it: ${m.desc}. Answer questions about the film, historical accuracy, the real people involved, themes, and context. Be concise, vivid, and insightful. 3-4 sentences max. No markdown.`;
    const answer=await groq([{role:'system',content:sys},{role:'user',content:q}],300,0.75);
    load.remove();addChatMsg('ai',answer);
  }catch(e){load.remove();addChatMsg('ai','Error: '+e.message);}
  finally{document.getElementById('chatSend').disabled=false;}
}

function addChatMsg(role,text,loading=false){
  const box=document.getElementById('chatMsgs');
  const el=document.createElement('div');
  el.className='chat-msg '+(loading?'loading':role);
  if(!loading)el.textContent=text;
  box.appendChild(el);box.scrollTop=box.scrollHeight;
  return el;
}

// ── INIT ──────────────────────────────────────────────────────────────────
render();
// Keys are always hardcoded — always show connected
document.getElementById('bannerStatus').textContent='✓ Keys loaded';
document.getElementById('bannerStatus').className='banner-status ok';
