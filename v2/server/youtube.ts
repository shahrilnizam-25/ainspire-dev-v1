import { dimensionLabelsByLang, type AssessmentAnswer } from '../src/data/assessment';
export type LearningVideo = { title: string; description: string; videoTitle: string; videoUrl: string; thumbnailUrl: string; channelTitle: string; relevanceStatement: string; videoSource: 'curated' | 'youtube-api'; searchQuery: string; searchUrl: string; searchStatus: 'live' | 'curated-no-key' | 'curated-fallback' };
const CURATED = {
 foundations: {id:'G2fqAlgmoPo',title:'Introduction to Generative AI',channel:'Google Cloud Tech'},
 prompting: {id:'GElCu2kUlRs',title:'Prompt Engineering Fundamentals',channel:'Microsoft Developer'},
 building: {id:'0Y5Luf5sRQA',title:'Building Text Generation Applications',channel:'Microsoft Developer'},
 overview: {id:'k7HaeJs-N-o',title:'Generative AI for Beginners — Full Series',channel:'Microsoft Developer'},
};
// Source-verified links: Google Cloud Tech and Microsoft's official course repository.
const TOPICS: Record<string,string> = {aiExposure:'generative AI fundamentals introduction',aiApplication:'practical AI workflow prompt engineering tutorial',criticalJudgement:'responsible AI output evaluation verification',aiProblemSolving:'AI use case problem definition solution design',growthAspiration:'AI skills adoption learning pathway'};
function card(id:string,title:string,channel:string,description:string,source:'curated'|'youtube-api',query:string,status:LearningVideo['searchStatus']):LearningVideo {return {title,description,videoTitle:title,videoUrl:`https://www.youtube.com/watch?v=${id}`,thumbnailUrl:`/api/youtube-thumbnail/${id}`,channelTitle:channel,relevanceStatement:description,videoSource:source,searchQuery:query,searchUrl:`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,searchStatus:status};}
export async function getLearningVideos(persona:string,answers:AssessmentAnswer[],lang:'EN'|'BM'):Promise<LearningVideo[]> {
 const bm=lang==='BM';const weak=answers.filter(a=>a.dimension!=='aiContributionStyle' && a.dimension!=='growthAspiration').sort((a,b)=>a.score-b.score).slice(0,2);
 const focus=weak.map(a=>dimensionLabelsByLang[lang][a.dimension]).join(' + ');
 const reason=bm ? `Fokus pembelajaran: ${focus}. Dipilih untuk menyokong dimensi keupayaan dengan skor terendah anda.` : `Learning focus: ${focus}. Selected to support your lowest-scoring capability dimensions.`;
 const keys=[process.env.YOUTUBE_API_KEY,process.env.YOUTUBE_API_KEY_BACKUP].filter((k):k is string=>!!k);
 const query=`${weak.map(a=>TOPICS[a.dimension]).filter(Boolean).join(' ')} ${persona==='builder'?'AI application tutorial':persona==='strategist'||persona==='visionary'?'AI business use cases':'AI beginners tutorial'}`;
 for(const key of keys) {
  try {
   const params=new URLSearchParams({part:'snippet',type:'video',maxResults:'5',safeSearch:'strict',order:'relevance',videoEmbeddable:'true',videoSyndicated:'true',relevanceLanguage:'en',regionCode:'MY',q:query,key});
   const r=await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`,{signal:AbortSignal.timeout(4000)});if(!r.ok)continue;
   const data=await r.json() as {items?:Array<{id?:{videoId?:string};snippet?:{title?:string;channelTitle?:string}}>};
   const cards=(data.items??[]).flatMap(v=>{const id=v.id?.videoId;return id&&/^[\w-]{11}$/.test(id)&&v.snippet?.title?[card(id,v.snippet.title,v.snippet.channelTitle??'YouTube',reason,'youtube-api',query,'live')]:[];});
   if(cards.length) return cards.slice(0,2);
  } catch { /* Use the next configured key, then curated resources. */ }
 }
 const resources=weak[0]?.dimension==='aiExposure'?[CURATED.foundations,CURATED.prompting]:persona==='builder'?[CURATED.prompting,CURATED.building]:persona==='explorer'?[CURATED.foundations,CURATED.prompting]:[CURATED.overview,CURATED.prompting];
 return resources.map(v=>card(v.id,v.title,v.channel,reason,'curated',query,keys.length?'curated-fallback':'curated-no-key'));
}
