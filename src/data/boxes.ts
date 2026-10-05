import { Box } from '../types';
const chat = [
  {id:'m1',from:'sam',text:'Welcome crew! Let’s turn the fuzzy idea into a tiny test this week.',time:'09:04'},
  {id:'m2',from:'priya',text:'I sketched a simple onboarding flow. Sharing after standup.',time:'09:12'},
  {id:'m3',from:'maya',text:'I found three communities where our first users hang out.',time:'09:18'},
  {id:'m4',from:'leo',text:'The API spike is looking good. I can demo the happy path tomorrow.',time:'09:26'},
  {id:'m5',from:'sam',text:'Perfect. Let’s protect scope and ship the smallest useful loop.',time:'09:31'},
  {id:'m6',from:'priya',text:'Vote is open on the three ideas below ✨',time:'09:35'},
  {id:'m7',from:'AI',text:'Daily signal: momentum is strong. One clear decision today will unblock design + build.',time:'09:40'},
  {id:'m8',from:'maya',text:'I’m in for idea two — the commitment matching angle feels sharp.',time:'09:42'},
];
const tasks = (prefix: string) => [
  {id:`${prefix}1`,title:'Define the one-sentence promise',owner:'sam',dueDay:2,done:true},
  {id:`${prefix}2`,title:'Map the first-time user flow',owner:'priya',dueDay:3,done:false},
  {id:`${prefix}3`,title:'Build clickable prototype',owner:'alex',dueDay:5,done:false},
  {id:`${prefix}4`,title:'Interview three target users',owner:'maya',dueDay:6,done:false},
  {id:`${prefix}5`,title:'Ship the smallest technical spike',owner:'leo',dueDay:7,done:false},
  {id:`${prefix}6`,title:'Review learnings and pick a bet',owner:'sam',dueDay:9,done:false},
];
export const BOXES: Box[] = [
  {id:'214',name:'Box #214',type:'Startup',level:'Builder',slots:[{role:'PM',filledBy:'sam'},{role:'Developer',filledBy:'leo'},{role:'Developer'},{role:'Designer',filledBy:'priya'},{role:'Marketing',filledBy:'maya'}],status:'Open',sprintDay:3,health:82,idea:'The commitment-aware teammate network',tasks:tasks('a'),messages:chat,ideas:[{id:'i1',title:'Commitment-aware teammate matching',votes:4},{id:'i2',title:'AI cofounder chemistry check',votes:3},{id:'i3',title:'Sprint accountability circles',votes:2}]},
  {id:'108',name:'Local Loop',type:'Hackathon',level:'Explorer',slots:[{role:'PM',filledBy:'aisha'},{role:'Developer',filledBy:'omar'},{role:'Designer'}],status:'Open',sprintDay:1,health:67,idea:'Offline-first neighborhood help',tasks:tasks('b'),messages:chat.slice(0,3),ideas:[{id:'a',title:'Local skill swaps',votes:2},{id:'b',title:'Community quests',votes:1},{id:'c',title:'Trusted circles',votes:1}]},
  {id:'309',name:'Signal Studio',type:'Agency',level:'Builder',slots:[{role:'PM',filledBy:'aisha'},{role:'Developer',filledBy:'omar'},{role:'Designer',filledBy:'jules'},{role:'Marketing'}],status:'Open',sprintDay:1,health:74,idea:'A launch studio for indie founders',tasks:tasks('c'),messages:chat.slice(1,4),ideas:[{id:'a',title:'Launch sprints',votes:4},{id:'b',title:'Brand clinic',votes:2},{id:'c',title:'Growth office hours',votes:1}]},
  {id:'511',name:'Field Notes',type:'Research',level:'Founder',slots:[{role:'PM',filledBy:'daniel'},{role:'Developer',filledBy:'leo'},{role:'Designer',filledBy:'jules'},{role:'Marketing',filledBy:'ben'}],status:'Open',sprintDay:9,health:91,idea:'Research ops for small teams',tasks:tasks('d'),messages:chat.slice(0,5),ideas:[{id:'a',title:'Research repository',votes:5},{id:'b',title:'Insight exchange',votes:2},{id:'c',title:'Expert panels',votes:1}]},
  {id:'712',name:'Pocket Pilot',type:'Content',level:'Explorer',slots:[{role:'PM',filledBy:'aisha'},{role:'Developer',filledBy:'omar'},{role:'Designer',filledBy:'nora'},{role:'Marketing',filledBy:'sofia'}],status:'Sprinting',sprintDay:3,health:76,idea:'Tiny learning loops',tasks:tasks('e'),messages:chat.slice(2,7),ideas:[{id:'a',title:'Micro lessons',votes:3},{id:'b',title:'Daily prompts',votes:3},{id:'c',title:'Peer feedback',votes:2}]},
  {id:'813',name:'Greenlight',type:'Startup',level:'Founder',slots:[{role:'PM',filledBy:'daniel'},{role:'Developer',filledBy:'leo'},{role:'Designer',filledBy:'jules'},{role:'Marketing',filledBy:'ben'}],status:'Full',sprintDay:1,health:88,idea:'Climate action dashboards',tasks:tasks('f'),messages:chat.slice(0,5),ideas:[{id:'a',title:'Impact dashboards',votes:3},{id:'b',title:'Team challenges',votes:3},{id:'c',title:'Local pledges',votes:1}]},
  {id:'914',name:'Orbit Notes',type:'Startup',level:'Builder',slots:[{role:'PM',filledBy:'sam'},{role:'Developer',filledBy:'omar'},{role:'Designer',filledBy:'priya'},{role:'Marketing',filledBy:'maya'}],status:'Completed',sprintDay:14,health:96,idea:'A calmer team workspace',tasks:tasks('g'),messages:chat,ideas:[{id:'a',title:'Calm workspace',votes:6},{id:'b',title:'Async rituals',votes:2},{id:'c',title:'Team pulse',votes:1}]},
  {id:'101',name:'Foundry Five',type:'Hackathon',level:'Builder',slots:[{role:'PM',filledBy:'aisha'},{role:'Developer',filledBy:'alex'},{role:'Designer',filledBy:'nora'},{role:'Marketing',filledBy:'ben'}],status:'Completed',sprintDay:14,health:90,idea:'Tools for student builders',tasks:tasks('h'),messages:chat.slice(0,6),ideas:[{id:'a',title:'Builder toolkit',votes:5},{id:'b',title:'Mentor matching',votes:3},{id:'c',title:'Demo day',votes:2}]},
];
