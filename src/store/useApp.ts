import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BOXES } from '../data/boxes';
import { USERS } from '../data/users';
import { Box, Level, User } from '../types';
const levelForXP = (xp:number):Level => xp>=900?'Founder':xp>=250?'Builder':'Explorer';
export interface GraduationKit { company:string; equity:Record<string,number>; roles:Record<string,string>; vesting:string; checklist:string[]; }
export interface AppState { kits:Record<string,GraduationKit>; updateKit:(id:string,kit:GraduationKit)=>void; setCommitment:(level:Level)=>void; }
export interface AppState { loggedIn:boolean; currentUser:User|null; users:User[]; boxes:Box[]; currentBoxId:string; onboardingComplete:boolean; onboarding:{role:string;skills:string[];hours:number;goal:string;level:Level;timezone:string}; toast:string|null; inactivity:boolean; addXP:(amount:number)=>void; login:(user:User)=>void; completeOnboarding:(data:AppState['onboarding'])=>void; setCurrentBox:(id:string)=>void; addMessage:(boxId:string,text:string,from?:string|'AI')=>void; toggleTask:(boxId:string,taskId:string)=>void; vote:(boxId:string,ideaId:string)=>void; joinBox:(boxId:string)=>void; fastForward:(boxId:string)=>void; setToast:(message:string|null)=>void; setInactivity:(v:boolean)=>void; resetDemo:()=>void; logout:()=>void; }
const initial: Pick<AppState, 'loggedIn'|'currentUser'|'users'|'boxes'|'currentBoxId'|'onboardingComplete'|'onboarding'|'toast'|'inactivity'> = { loggedIn:false,currentUser:null,users:USERS,boxes:BOXES,currentBoxId:'214',onboardingComplete:false,onboarding:{role:'Developer',skills:['React','Node'],hours:12,goal:'Startup',level:'Builder',timezone:'IST (UTC+5:30)'},toast:null,inactivity:false };
const appStore=create<AppState>()(persist((set,get)=>({ ...initial,kits:{},
 updateKit:(id,kit)=>set(s=>({kits:{...s.kits,[id]:kit}})),
 setCommitment:(level)=>set(s=>({onboarding:{...s.onboarding,level},currentUser:s.currentUser?{...s.currentUser,level}:null,users:s.users.map(u=>u.id===s.currentUser?.id?{...u,level}:u)})),
 addXP:(amount)=>set(s=>{if(!s.currentUser)return s; const finishing=amount>=100&&!s.currentUser.badges.includes('Sprint Finisher'); const user={...s.currentUser,xp:s.currentUser.xp+amount,reputation:Math.min(100,s.currentUser.reputation+(finishing?8:0)),badges:finishing?Array.from(new Set([...s.currentUser.badges,'Sprint Finisher','Reliable Crew'])):s.currentUser.badges}; return {currentUser:user,users:s.users.map(u=>u.id===user.id?user:u),toast:finishing?'Sprint Finisher unlocked · +100 XP · +8 reputation':`+${amount} XP earned`};}),
 login:(user)=>set({loggedIn:true,currentUser:user,currentBoxId:'214'}),
 completeOnboarding:(data)=>set(s=>{if(!s.currentUser)return s; const user={...s.currentUser,role:data.role as User['role'],skills:data.skills,hoursPerWeek:data.hours,level:data.level,timezone:data.timezone,badges:Array.from(new Set([...s.currentUser.badges,'First Launch'])),xp:s.currentUser.xp+50}; return {onboarding:data,onboardingComplete:true,currentUser:user,users:s.users.map(u=>u.id===user.id?user:u),toast:'First Launch badge unlocked · +50 XP'};}),
 setCurrentBox:(id)=>set({currentBoxId:id}),
 addMessage:(boxId,text,from='me')=>{const state=get();const first=from===state.currentUser?.id&&!state.boxes.some(b=>b.messages.some(m=>m.from===from));set(s=>({boxes:s.boxes.map(b=>b.id===boxId?{...b,messages:[...b.messages,{id:crypto.randomUUID(),from,text,time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}],health:Math.min(100,b.health+1)}:b)}));if(first)get().addXP(15);},
 toggleTask:(boxId,taskId)=>{const b=get().boxes.find(x=>x.id===boxId); const task=b?.tasks.find(t=>t.id===taskId); if(!task)return; set(s=>({boxes:s.boxes.map(x=>x.id===boxId?{...x,tasks:x.tasks.map(t=>t.id===taskId?{...t,done:!t.done}:t),health:Math.min(100,x.health+(task.done?-2:4))}:x)})); if(!task.done)get().addXP(25);},
 vote:(boxId,ideaId)=>{set(s=>({boxes:s.boxes.map(b=>b.id===boxId?{...b,ideas:b.ideas.map(i=>i.id===ideaId?{...i,votes:i.votes+1}:i)}:b),toast:'Vote locked in · +10 XP'}));get().addXP(10);},
 joinBox:(boxId)=>{const u=get().currentUser;const box=get().boxes.find(b=>b.id===boxId);if(!u||!box)return;if(box.slots.some(s=>s.filledBy===u.id)){set({currentBoxId:boxId});return;}const open=box.slots.findIndex(s=>!s.filledBy&&s.role===u.role);const seat=open>=0?open:box.slots.findIndex(s=>!s.filledBy);if(seat<0){set({currentBoxId:boxId,toast:'This crew is full. You can preview the room.'});return;}set(s=>({currentBoxId:boxId,boxes:s.boxes.map(b=>b.id===boxId?{...b,status:b.slots.filter(s=>!s.filledBy).length===1?'Sprinting':b.status,slots:b.slots.map((slot,i)=>i===seat?{...slot,filledBy:u.id,role:u.role}:slot)}:b),currentUser:{...u,badges:Array.from(new Set([...u.badges,'Team Player']))},toast:'Request accepted · your crew seat is reserved'}));get().addXP(30);},
 fastForward:(boxId)=>set(s=>({boxes:s.boxes.map(b=>b.id===boxId?{...b,sprintDay:14,status:'Completed',health:Math.min(100,b.health+8)}:b)})),
 setToast:(toast)=>set({toast}),setInactivity:(inactivity)=>set({inactivity}),
  resetDemo:()=>set({...initial,kits:{}}),logout:()=>set({loggedIn:false,currentUser:null,onboardingComplete:false}),
 }),{name:'startupbox-demo',partialize:s=>({loggedIn:s.loggedIn,currentUser:s.currentUser,users:s.users,boxes:s.boxes,currentBoxId:s.currentBoxId,onboardingComplete:s.onboardingComplete,onboarding:s.onboarding,inactivity:s.inactivity,kits:s.kits})}));
export function useApp<T>(selector: (state: AppState) => T): T;
export function useApp(): AppState;
export function useApp<T>(selector?: (state: AppState) => T): AppState | T {
  return selector ? appStore(selector) : appStore(s => s);
}
useApp.getState = appStore.getState;
