// ════════════ REQUESTS ════════════
function RequestsView({user}) {
  const [f,sF]=useState({});const [sc,sSc]=useState(false);const [sel,sSel]=useState(null);const [toast,sT]=useState(null);const [tick,sTick]=useState(0);
  let list=[...DB.requests];if(f.status)list=list.filter(r=>r.status===f.status);if(f.dept)list=list.filter(r=>r.dept===f.dept);if(f.q){const q=f.q;list=list.filter(r=>r.ref.includes(q)||r.company.includes(q)||r.title.includes(q));}
  if(user.role!=="admin")list=list.filter(r=>r.dept===user.department||r.assigned===user.id);

  // Auto-escalation: overdue requests get escalated priority
  DB.requests.forEach(r=>{if(r.due&&r.due<dt()&&!["completed","rejected"].includes(r.status)&&r.priority!=="urgent"){r._overdue=true;}});

  // KPI stats
  const all=DB.requests;
  const stats={total:all.length,new_c:all.filter(x=>x.status==="new").length,review:all.filter(x=>x.status==="in_review").length,pending:all.filter(x=>x.status==="pending").length,done:all.filter(x=>x.status==="completed").length,rej:all.filter(x=>x.status==="rejected").length,overdue:all.filter(x=>x.due&&x.due<dt()&&!["completed","rejected"].includes(x.status)).length};

  // Days calc helper
  const daysAgo=(d)=>{if(!d)return"—";const diff=Math.floor((new Date()-new Date(d))/(1000*60*60*24));return diff<=0?"اليوم":diff===1?"أمس":diff+" يوم";};

  return (
    <div>
      {toast&&<Ts{...toast}onDone={()=>sT(null)}/>}

      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:18}}>
        <div onClick={()=>sF({})} style={{...cd,padding:"14px 16px",cursor:"pointer",borderTop:`3px solid ${C.gold}`}}><div style={{fontSize:10,color:C.muted}}>الإجمالي</div><div style={{fontSize:22,fontWeight:800,color:C.green}}>{stats.total}</div></div>
        <div onClick={()=>sF({status:"new"})} style={{...cd,padding:"14px 16px",cursor:"pointer",background:f.status==="new"?"#eff6ff":"#fff"}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:"#3b82f6"}}/><span style={{fontSize:10,color:C.muted}}>جديد</span></div><div style={{fontSize:22,fontWeight:800,color:"#3b82f6"}}>{stats.new_c}</div></div>
        <div onClick={()=>sF({status:"in_review"})} style={{...cd,padding:"14px 16px",cursor:"pointer",background:f.status==="in_review"?"#fffbeb":"#fff"}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:"#d97706"}}/><span style={{fontSize:10,color:C.muted}}>قيد المراجعة</span></div><div style={{fontSize:22,fontWeight:800,color:"#d97706"}}>{stats.review}</div></div>
        <div onClick={()=>sF({status:"completed"})} style={{...cd,padding:"14px 16px",cursor:"pointer",background:f.status==="completed"?C.greenLight:"#fff"}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:C.green}}/><span style={{fontSize:10,color:C.muted}}>مكتمل</span></div><div style={{fontSize:22,fontWeight:800,color:C.green}}>{stats.done}</div></div>
        <div onClick={()=>sF({status:"rejected"})} style={{...cd,padding:"14px 16px",cursor:"pointer",background:f.status==="rejected"?"#fef2f2":"#fff"}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:C.danger}}/><span style={{fontSize:10,color:C.muted}}>مرفوض</span></div><div style={{fontSize:22,fontWeight:800,color:C.danger}}>{stats.rej}</div></div>
        {stats.overdue>0&&<div style={{...cd,padding:"14px 16px",background:"#fef2f2",border:`1px solid #fca5a5`,cursor:"pointer"}} onClick={()=>sF({status:""})}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:13}}>🔴</span><span style={{fontSize:10,color:C.danger,fontWeight:700}}>متأخر!</span></div><div style={{fontSize:22,fontWeight:800,color:C.danger}}>{stats.overdue}</div></div>}
      </div>

      {/* Pipeline Visual — stages distribution bar */}
      <div style={{...cd,padding:"12px 18px",marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8}}>توزيع حالات المعاملات</div>
        <div style={{display:"flex",height:10,borderRadius:5,overflow:"hidden",gap:1}}>
          {[{k:"new",c:"#3b82f6"},{k:"in_review",c:"#d97706"},{k:"pending",c:"#7c3aed"},{k:"approved",c:"#059669"},{k:"completed",c:C.green},{k:"rejected",c:C.danger}].map(s=>{const cnt=all.filter(x=>x.status===s.k).length;const pct=stats.total?cnt/stats.total*100:0;return pct>0?<div key={s.k} style={{width:`${pct}%`,background:s.c,minWidth:pct>0?3:0,borderRadius:1}} title={`${ST[s.k]?.l}: ${cnt}`}/>:null;})}
        </div>
        <div style={{display:"flex",gap:12,marginTop:6,flexWrap:"wrap"}}>{[{k:"new",c:"#3b82f6"},{k:"in_review",c:"#d97706"},{k:"pending",c:"#7c3aed"},{k:"completed",c:C.green},{k:"rejected",c:C.danger}].map(s=>{const cnt=all.filter(x=>x.status===s.k).length;return cnt>0?<span key={s.k} style={{fontSize:9,color:C.muted,display:"flex",alignItems:"center",gap:3}}><span style={{width:7,height:7,borderRadius:2,background:s.c}}/>{ST[s.k]?.l} ({cnt})</span>:null;})}</div>
      </div>

      {/* Filters + Actions */}
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}><input style={{...inp,width:190}} placeholder="بحث بالمرجع أو الشركة..." value={f.q||""} onChange={e=>sF(x=>({...x,q:e.target.value}))}/><select style={{...inp,width:120}} value={f.status||""} onChange={e=>sF(x=>({...x,status:e.target.value}))}><option value="">كل الحالات</option>{Object.entries(ST).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select><select style={{...inp,width:120}} value={f.dept||""} onChange={e=>sF(x=>({...x,dept:e.target.value}))}><option value="">كل الأقسام</option>{Object.entries(DEPT).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select><div style={{flex:1}}/><button onClick={()=>sSc(true)} style={bG}>+ طلب جديد</button></div>

      {/* Request Table — enhanced with assignee, days elapsed, overdue flag */}
      <div style={cd}>{list.length===0?<Em t="لا توجد طلبات"/>:<Tb h={["المرجع","العنوان","الشركة","القسم","المسؤول","المرحلة","الحالة","الأولوية","المهلة","منذ"]}>
        {list.map(r=>{
          const assignee=DB.users.find(u=>u.id===r.assigned);
          const isOverdue=r.due&&r.due<dt()&&!["completed","rejected"].includes(r.status);
          return <tr key={r.id} onClick={()=>sSel(r.id)} style={{borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:isOverdue?"#fef8f8":"transparent"}} onMouseEnter={e=>{e.currentTarget.style.background=isOverdue?"#fef2f2":"#f8faf8"}} onMouseLeave={e=>{e.currentTarget.style.background=isOverdue?"#fef8f8":"transparent"}}>
            <Tc mono bold color={C.green}>{r.ref}</Tc>
            <Tc style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.title}</Tc>
            <Tc color={C.muted}>{r.company}</Tc>
            <Tc>{DEPT[r.dept]?.i} {DEPT[r.dept]?.l}</Tc>
            <Tc color={C.muted} style={{fontSize:10}}>{assignee?.full_name||"—"}</Tc>
            <Tc style={{fontSize:10}}>{r.stage}</Tc>
            <td style={{padding:"10px 9px"}}><Bg map={ST} value={r.status}/></td>
            <td style={{padding:"10px 9px"}}>{isOverdue?<span style={{padding:"2px 8px",borderRadius:5,fontSize:9,fontWeight:700,color:"#fff",background:C.danger,display:"inline-flex",alignItems:"center",gap:3}}>🔴 متأخر</span>:<Bg map={PR} value={r.priority}/>}</td>
            <Tc color={isOverdue?C.danger:C.muted} bold={isOverdue}>{r.due||"—"}</Tc>
            <Tc color={C.light} style={{fontSize:10}}>{daysAgo(r.at?.slice(0,10))}</Tc>
          </tr>;
        })}
      </Tb>}</div>
      <Mo isOpen={sc} onClose={()=>sSc(false)} title="📨 طلب معاملة جديدة"><FIM investorField withDocs fields={[{k:"type",l:"النوع",type:"select",opts:RTYP},{k:"dept",l:"القسم",type:"select",opts:Object.entries(DEPT).map(([k,v])=>({v:k,l:v.l}))},{k:"title",l:"العنوان *",span:2},{k:"company",l:"الشركة/المستثمر *"},{k:"priority",l:"الأولوية",type:"select",opts:Object.entries(PR).map(([k,v])=>({v:k,l:v.l}))},{k:"due",l:"الموعد النهائي",type:"date"},{k:"desc",l:"الوصف",type:"textarea",span:2}]} init={{type:"subscription",title:"",company:"",dept:"ishtitab",priority:"medium",desc:"",due:"",inv_id:""}} req={["title","company"]} onSave={fm=>{const id=DB._n.r++;DB.requests.unshift({...fm,id,ref:rid("TXN-2025"),status:"new",stage:"تقديم الطلب",inv_id:fm.inv_id?Number(fm.inv_id):null,by:user.id,assigned:user.id,at:tm(),docs:fm._docs||[]});if(fm._docs)fm._docs.forEach(d=>{d.request_id=id;});sSc(false);sTick(t=>t+1);sT({message:"تم إنشاء الطلب",type:"success"});}} onClose={()=>sSc(false)}/></Mo>
      <Mo isOpen={!!sel} onClose={()=>sSel(null)} title="تفاصيل المعاملة" wide><ReqDetail user={user} rid={sel} onClose={()=>sSel(null)} onUp={()=>{sTick(t=>t+1);sT({message:"تم التحديث",type:"success"});}}/></Mo>
    </div>
  );
}

// ════════════ SIGNATURE PAD ════════════
function SignaturePad({onSign,label,signatureData,signerName}) {
  const canvasRef=React.useRef(null);
  const [drawing,setDrawing]=useState(false);
  const [signed,setSigned]=useState(!!signatureData);
  const [sigData,setSigData]=useState(signatureData||null);

  const getPos=(e)=>{
    const rect=canvasRef.current.getBoundingClientRect();
    const touch=e.touches?e.touches[0]:e;
    return{x:touch.clientX-rect.left,y:touch.clientY-rect.top};
  };
  const startDraw=(e)=>{e.preventDefault();setDrawing(true);const ctx=canvasRef.current.getContext("2d");const p=getPos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);};
  const draw=(e)=>{if(!drawing)return;e.preventDefault();const ctx=canvasRef.current.getContext("2d");const p=getPos(e);ctx.lineWidth=2;ctx.lineCap="round";ctx.strokeStyle=C.greenDark;ctx.lineTo(p.x,p.y);ctx.stroke();};
  const endDraw=()=>{if(!drawing)return;setDrawing(false);const data=canvasRef.current.toDataURL("image/png");setSigData(data);setSigned(true);if(onSign)onSign(data);};
  const clear=()=>{const ctx=canvasRef.current.getContext("2d");ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);setSigned(false);setSigData(null);if(onSign)onSign(null);};

  // Display existing signature
  useEffect(()=>{
    if(signatureData&&canvasRef.current){
      const img=new Image();
      img.onload=()=>{const ctx=canvasRef.current.getContext("2d");ctx.drawImage(img,0,0);};
      img.src=signatureData;
    }
  },[signatureData]);

  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>✍️ {label||"التوقيع"}</span>
        {signed&&<span style={{fontSize:9,color:C.green,fontWeight:600,display:"flex",alignItems:"center",gap:3}}><span style={{width:6,height:6,borderRadius:"50%",background:C.green}}/>تم التوقيع</span>}
      </div>
      <div style={{position:"relative",border:`2px ${signed?"solid":"dashed"} ${signed?C.green:C.border}`,borderRadius:8,overflow:"hidden",background:"#fff"}}>
        <canvas ref={canvasRef} width={460} height={100}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
          style={{width:"100%",height:100,cursor:"crosshair",display:"block",touchAction:"none"}}
        />
        {!signed&&!drawing&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",color:C.light,fontSize:12}}>وقّع هنا بالماوس أو اللمس</div>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
        <button onClick={clear} type="button" style={{fontSize:10,color:C.muted,background:"none",border:"none",cursor:"pointer",fontFamily:F,textDecoration:"underline"}}>مسح التوقيع</button>
        {signed&&<span style={{fontSize:9,color:C.muted}}>📅 {new Date().toLocaleDateString("ar-SY")} — {signerName||""}</span>}
      </div>
    </div>
  );
}

// Display saved signature (read-only)
function SignatureDisplay({data,name,date}) {
  if(!data)return null;
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 10px",background:"#f0fdf4",borderRadius:6,border:`1px solid ${C.green}25`,marginTop:4}}>
      <img src={data} alt="توقيع" style={{height:28,borderRadius:3}}/>
      <div><div style={{fontSize:9,fontWeight:600,color:C.green}}>✍️ {name}</div><div style={{fontSize:8,color:C.muted}}>{date}</div></div>
    </div>
  );
}

function ReqDetail({user,rid:reqId,onClose,onUp}) {
  const [cm,sCm]=useState("");const [rs,sRs]=useState("");const [sr,sSr]=useState(false);const [tick,sTick]=useState(0);
  const [advNotes,setAdvNotes]=useState("");const [showAdvForm,setShowAdvForm]=useState(false);const [showRetForm,setShowRetForm]=useState(false);const [retNotes,setRetNotes]=useState("");
  const [advSig,setAdvSig]=useState(null);const [retSig,setRetSig]=useState(null);const [rejSig,setRejSig]=useState(null);
  const d=DB.requests.find(r=>r.id===reqId);
  const [reqDocs,setReqDocs]=useState(d?.docs||[]);
  if(!d)return <Em t="غير موجود"/>;
  const stages=DB.stages.filter(s=>s.rid===reqId);const comments=DB.comments.filter(c=>c.rid===reqId).sort((a,b)=>(b.at>a.at?1:-1));const canAct=!["completed","rejected"].includes(d.status);
  const activeStage=stages.find(s=>s.status==="active");
  const assignee=DB.users.find(u=>u.id===d.assigned);
  const inv=d.inv_id?DB.investors.find(x=>x.id===d.inv_id):null;
  const isOverdue=d.due&&d.due<dt()&&canAct;

  // SLA: days elapsed for each stage
  const daysElapsed=(from,to)=>{if(!from)return 0;const end=to?new Date(to):new Date();return Math.max(0,Math.floor((end-new Date(from))/(1000*60*60*24)));};
  const totalDays=daysElapsed(d.at?.slice(0,10));

  // Required documents per stage
  const stageReqDocs={"المراجعة الفنية":["تقرير فني","مخطط الموقع"],"التقييم المالي":["القوائم المالية","دراسة الجدوى"],"المراجعة القانونية":["وثائق الشركة","السجل التجاري"],"موافقة الإدارة العامة":["ملخص تنفيذي"]};
  const curReqDocs=activeStage?stageReqDocs[activeStage.name]||[]:[];
  const missingDocs=curReqDocs.filter(rd=>!reqDocs.some(d=>d.name.includes(rd)));

  // Advance with notes + signature
  const adv=()=>{
    if(!advSig){return;}
    const a=stages.find(s=>s.status==="active");if(!a)return;
    a.status="done";a.done_at=dt();a.notes=advNotes||null;a.signature=advSig;a.signed_by=user.full_name;a.signed_at=tm();
    const n=stages.find(s=>s.order===a.order+1);
    if(n){n.status="active";d.stage=n.name;d.status="in_review";}
    else{
      d.status="completed";
      // AUTO-ACTIONS on completion
      if(d.type==="subscription"){
        DB.contracts.unshift({id:DB._n.c++,num:rid("CON-2025"),inv_id:d.inv_id,company:d.company,type:"land_lease",value:0,start:dt(),end:"",plots:"",status:"draft",docs:[]});
        DB.comments.push({id:DB._n.cm++,rid:reqId,text:"⚡ تم إنشاء مسودة عقد تلقائياً بعد اكتمال الطلب",type:"auto",at:tm(),by:"النظام",dept:""});
      }
      if(d.type==="payment"){
        DB.invoices.unshift({id:DB._n.i++,num:rid("INV-2025"),inv_id:d.inv_id,company:d.company,type:"annual_fee",amount:0,due:"",paid:null,status:"pending"});
        DB.comments.push({id:DB._n.cm++,rid:reqId,text:"⚡ تم إنشاء فاتورة تلقائياً بعد اكتمال طلب السداد",type:"auto",at:tm(),by:"النظام",dept:""});
      }
    }
    DB.comments.push({id:DB._n.cm++,rid:reqId,text:`✓ تمت الموافقة على "${a.name}"${advNotes?" — "+advNotes:""} → ${n?n.name:"مكتمل"}`,type:"stage",at:tm(),by:user.full_name,dept:user.department});
    setAdvNotes("");setShowAdvForm(false);onUp();
  };

  // Return to previous stage (requires signature)
  const returnToPrev=()=>{
    if(!retNotes.trim()||!retSig)return;
    const a=stages.find(s=>s.status==="active");if(!a||a.order<=1)return;
    a.status="pending";
    const prev=stages.find(s=>s.order===a.order-1);
    if(prev){prev.status="active";prev.done_at=null;d.stage=prev.name;}
    DB.comments.push({id:DB._n.cm++,rid:reqId,text:`↩ إعادة إلى "${prev.name}": ${retNotes}`,type:"return",at:tm(),by:user.full_name,dept:user.department});
    setRetNotes("");setShowRetForm(false);onUp();
  };

  // Reject (requires signature)
  const rej=()=>{if(!rs.trim()||!rejSig)return;d.status="rejected";d.rejSignature=rejSig;d.rejSignedBy=user.full_name;d.rejSignedAt=tm();stages.forEach(s=>{if(["active","pending"].includes(s.status))s.status="skipped";});DB.comments.push({id:DB._n.cm++,rid:reqId,text:"✗ رفض: "+rs,type:"reject",at:tm(),by:user.full_name,dept:user.department,signature:rejSig});onUp();onClose();};

  // Reassign
  const reassign=(uid)=>{d.assigned=Number(uid);DB.comments.push({id:DB._n.cm++,rid:reqId,text:`↻ تم تحويل المعاملة إلى: ${DB.users.find(u=>u.id===Number(uid))?.full_name}`,type:"assign",at:tm(),by:user.full_name,dept:user.department});sTick(t=>t+1);};

  const addCm=()=>{if(!cm.trim())return;DB.comments.push({id:DB._n.cm++,rid:reqId,text:cm.trim(),type:"comment",at:tm(),by:user.full_name,dept:user.department});sCm("");sTick(t=>t+1);};

  const cmIcon={"comment":"💬","stage":"✓","reject":"✗","return":"↩","auto":"⚡","assign":"↻"};
  const cmColor={"comment":"#f8faf8","stage":C.greenLight,"reject":"#fef2f2","return":"#fffbeb","auto":"#f0fdf4","assign":"#eff6ff"};
  const cmBorder={"comment":C.green,"stage":C.gold,"reject":C.danger,"return":C.warning,"auto":"#059669","assign":"#3b82f6"};

  return (
    <div>
      {/* Header with full info */}
      <div style={{background:isOverdue?"#fef2f2":C.greenLight,borderRadius:8,padding:16,marginBottom:16,border:isOverdue?`1px solid #fca5a5`:`1px solid ${C.border}`}}>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
          <span style={{fontSize:14,fontWeight:800,color:C.green,fontFamily:"monospace"}}>{d.ref}</span>
          <Bg map={ST} value={d.status}/>
          {isOverdue?<span style={{padding:"2px 8px",borderRadius:5,fontSize:9,fontWeight:700,color:"#fff",background:C.danger}}>🔴 متأخر!</span>:<Bg map={PR} value={d.priority}/>}
          <span style={{fontSize:10,color:C.muted,background:"#fff",padding:"1px 7px",borderRadius:4}}>{DEPT[d.dept]?.i} {DEPT[d.dept]?.l}</span>
          <span style={{fontSize:10,color:C.muted,background:"#fff",padding:"1px 7px",borderRadius:4}}>📅 {d.at?.slice(0,10)}</span>
          {d.due&&<span style={{fontSize:10,color:isOverdue?C.danger:C.muted,fontWeight:isOverdue?700:400,background:"#fff",padding:"1px 7px",borderRadius:4}}>⏰ المهلة: {d.due}</span>}
        </div>
        <h4 style={{fontSize:15,fontWeight:700,color:C.text,margin:"0 0 3px"}}>{d.title}</h4>
        <div style={{fontSize:11,color:C.muted,display:"flex",gap:12,flexWrap:"wrap"}}>
          <span>🏢 {d.company}</span>
          {inv&&<span style={{color:C.green,fontWeight:600}}>• ملف: {inv.name}</span>}
          <span>⏱ منذ {totalDays} يوم</span>
        </div>
      </div>
      {d.desc&&<div style={{fontSize:12,color:C.text,lineHeight:1.8,padding:12,border:`1px solid ${C.border}`,borderRadius:7,marginBottom:16}}>{d.desc}</div>}

      {/* Assignee + Reassign */}
      <div style={{display:"flex",gap:12,marginBottom:16,alignItems:"center",padding:"10px 14px",background:"#f8faf8",borderRadius:8,border:`1px solid ${C.border}`}}>
        <span style={{fontSize:11,fontWeight:700,color:C.text}}>المسؤول الحالي:</span>
        <span style={{fontSize:12,fontWeight:600,color:C.green}}>{assignee?.full_name||"غير معين"}</span>
        {user.role==="admin"&&<><span style={{color:C.light}}>|</span><span style={{fontSize:11,color:C.muted}}>تحويل إلى:</span><select style={{...inp,width:160,padding:"4px 8px",fontSize:11}} value={d.assigned||""} onChange={e=>reassign(e.target.value)}>{DB.users.filter(u=>u.active).map(u=><option key={u.id} value={u.id}>{u.full_name} — {DEPT[u.department]?.l||"عام"}</option>)}</select></>}
      </div>

      {/* Documents */}
      <div style={{marginBottom:16}}>
        <DocUpload docs={reqDocs} onChange={(newDocs)=>{d.docs=newDocs;setReqDocs([...newDocs]);}} investorId={d.inv_id} label={`📎 مرفقات المعاملة (${reqDocs.length})`} />
        {/* Required docs warning */}
        {canAct&&curReqDocs.length>0&&<div style={{marginTop:8,padding:"8px 12px",background:missingDocs.length>0?"#fffbeb":"#f0fdf4",borderRadius:6,border:`1px solid ${missingDocs.length>0?"#fcd34d":"#86efac"}`}}>
          <div style={{fontSize:11,fontWeight:700,color:missingDocs.length>0?C.warning:C.green,marginBottom:4}}>{missingDocs.length>0?"⚠️ مستندات مطلوبة لهذه المرحلة:":"✓ جميع المستندات المطلوبة مكتملة"}</div>
          {curReqDocs.map(rd=>{const found=reqDocs.some(d=>d.name.includes(rd));return <div key={rd} style={{fontSize:10,color:found?C.green:C.warning,display:"flex",alignItems:"center",gap:4}}><span>{found?"✅":"⬜"}</span>{rd}</div>;})}
        </div>}
      </div>

      {/* Workflow with SLA timers */}
      {stages.length>0&&<div style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><h5 style={{fontSize:12,fontWeight:700,margin:0}}>سير العمل — مراحل المعاملة</h5><span style={{fontSize:10,color:C.muted,background:C.greenLight,padding:"2px 8px",borderRadius:4}}>⏱ إجمالي: {totalDays} يوم</span></div>
        <div style={{background:"#f8faf8",borderRadius:8,padding:14}}>{stages.map((s,i)=>{
          const done=s.status==="done",act=s.status==="active",skip=s.status==="skipped";
          const sDays=done?daysElapsed(stages[i-1]?.done_at||d.at?.slice(0,10),s.done_at):act?daysElapsed(i>0?stages[i-1]?.done_at:d.at?.slice(0,10)):0;
          return <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",opacity:skip?0.4:1}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:done?C.green:act?C.green:skip?C.danger:"#d1d5db",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,border:act?`3px solid ${C.gold}`:"none",boxShadow:act?"0 0 8px rgba(201,168,76,0.3)":"none"}}>{done?"✓":skip?"✗":act?"●":i+1}</div>
              {i<stages.length-1&&<div style={{width:2,height:30,background:done?C.green:"#d1d5db"}}/>}
            </div>
            <div style={{paddingTop:2,flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,fontWeight:done||act?700:400,color:done||act?C.text:C.light}}>{s.name} <span style={{fontSize:9,color:C.muted}}>({DEPT[s.dept]?.l||s.dept})</span></span>
                {(done||act)&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:4,fontWeight:600,background:sDays>5?"#fef2f2":sDays>2?"#fffbeb":"#f0fdf4",color:sDays>5?C.danger:sDays>2?C.warning:C.green}}>{sDays} يوم</span>}
              </div>
              {s.notes&&<div style={{fontSize:10,color:C.muted,fontStyle:"italic",marginTop:2}}>📝 {s.notes}</div>}
              {s.done_at&&<div style={{fontSize:9,color:C.light}}>اكتمل: {s.done_at}</div>}
              {s.signature&&<SignatureDisplay data={s.signature} name={s.signed_by} date={s.signed_at||s.done_at}/>}
            </div>
          </div>;
        })}</div>
      </div>}

      {/* Action Buttons — Advance, Return, Reject */}
      {canAct&&<div style={{marginBottom:18}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <button onClick={()=>{setShowAdvForm(!showAdvForm);setShowRetForm(false);sSr(false);}} style={{...bP,flex:1,background:showAdvForm?"#059669":C.green}}>✓ موافقة وتقديم</button>
          {activeStage&&activeStage.order>1&&<button onClick={()=>{setShowRetForm(!showRetForm);setShowAdvForm(false);sSr(false);}} style={{...bP,flex:1,background:showRetForm?C.warning:"#d97706"}}>↩ إعادة للمرحلة السابقة</button>}
          <button onClick={()=>{sSr(!sr);setShowAdvForm(false);setShowRetForm(false);}} style={{...bP,background:sr?"#991b1b":C.danger,flex:1}}>✗ رفض</button>
        </div>

        {/* Advance form with notes */}
        {showAdvForm&&<div style={{background:C.greenLight,borderRadius:8,padding:14,marginBottom:10,border:`1px solid ${C.green}30`}}>
          <Fl l="ملاحظات الموافقة (اختياري)"><textarea style={{...inp,minHeight:40}} value={advNotes} onChange={e=>setAdvNotes(e.target.value)} placeholder="سبب الموافقة أو ملاحظات للمرحلة التالية..."/></Fl>
          {missingDocs.length>0&&<div style={{fontSize:10,color:C.warning,marginBottom:8}}>⚠️ هناك مستندات مطلوبة ناقصة. أضف "استثناء" في الملاحظات لتجاوز.</div>}
          <SignaturePad onSign={setAdvSig} label="توقيع الموافقة *" signerName={user.full_name}/>
          <button onClick={adv} disabled={!advSig} style={{...bP,width:"100%",opacity:advSig?1:0.4}}>✓ تأكيد الموافقة والانتقال {stages.find(s=>s.order===(activeStage?.order||0)+1)?"إلى: "+stages.find(s=>s.order===(activeStage?.order||0)+1).name:"— إكمال المعاملة"}</button>
          {!advSig&&<div style={{fontSize:10,color:C.danger,marginTop:4,textAlign:"center"}}>يجب التوقيع قبل المتابعة</div>}
        </div>}

        {/* Return form */}
        {showRetForm&&<div style={{background:"#fffbeb",borderRadius:8,padding:14,marginBottom:10,border:`1px solid #fcd34d`}}>
          <Fl l="سبب الإعادة *"><textarea style={{...inp,minHeight:40,borderColor:"#fcd34d"}} value={retNotes} onChange={e=>setRetNotes(e.target.value)} placeholder="ما الذي يجب تصحيحه أو إكماله..."/></Fl>
          <SignaturePad onSign={setRetSig} label="توقيع الإعادة *" signerName={user.full_name}/>
          <button onClick={returnToPrev} disabled={!retNotes.trim()||!retSig} style={{...bP,background:C.warning,width:"100%",opacity:(retNotes.trim()&&retSig)?1:0.4}}>↩ تأكيد الإعادة إلى: {stages.find(s=>s.order===(activeStage?.order||0)-1)?.name}</button>
        </div>}

        {/* Reject form */}
        {sr&&<div style={{background:"#fef2f2",borderRadius:7,padding:12,marginBottom:10,border:`1px solid #fca5a5`}}>
          <Fl l="سبب الرفض *"><textarea style={{...inp,minHeight:40,borderColor:"#fca5a5"}} value={rs} onChange={e=>sRs(e.target.value)} placeholder="السبب التفصيلي للرفض..."/></Fl>
          <SignaturePad onSign={setRejSig} label="توقيع الرفض *" signerName={user.full_name}/>
          <button onClick={rej} disabled={!rs.trim()||!rejSig} style={{...bP,background:C.danger,width:"100%",opacity:(rs.trim()&&rejSig)?1:0.4}}>✗ تأكيد الرفض النهائي</button>
        </div>}
      </div>}

      {/* Activity Timeline — separate from comments */}
      <h5 style={{fontSize:12,fontWeight:700,marginBottom:8}}>💬 النشاط والتعليقات</h5>
      <div style={{display:"flex",gap:8,marginBottom:12}}><input style={{...inp,flex:1}} value={cm} onChange={e=>sCm(e.target.value)} placeholder="أضف تعليقاً..." onKeyDown={e=>e.key==="Enter"&&addCm()}/><button onClick={addCm} style={bP}>إرسال</button></div>
      {comments.length===0?<Em t="لا يوجد نشاط"/>:comments.map(c=>(
        <div key={c.id} style={{padding:"10px 14px",background:cmColor[c.type]||"#f8faf8",borderRadius:7,marginBottom:6,borderRight:`3px solid ${cmBorder[c.type]||C.green}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:11,fontWeight:600,color:C.text}}>{cmIcon[c.type]||"💬"} {c.by} <span style={{fontWeight:400,color:C.muted}}>— {c.dept?DEPT[c.dept]?.l:c.by==="النظام"?"تلقائي":""}</span></span>
            <span style={{fontSize:9,color:C.light}}>{c.at}</span>
          </div>
          <div style={{fontSize:11,color:C.text,lineHeight:1.6,marginTop:2}}>{c.text}</div>
          {c.signature&&<SignatureDisplay data={c.signature} name={c.by} date={c.at}/>}
        </div>
      ))}
    </div>
  );
}

