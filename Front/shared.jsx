// ════════════ COMPONENTS ════════════
function Bg({map,value}){const s=map[value]||{l:value||"—",c:"#6b7280",b:"#f3f4f6"};return <span style={{padding:"2px 10px",borderRadius:5,fontSize:10,fontWeight:600,color:s.c,background:s.b,display:"inline-flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}><span style={{width:5,height:5,borderRadius:"50%",background:s.c}}/>{s.l}</span>;}
function Rt({r}){if(!r)return <span style={{color:C.light,fontSize:10}}>—</span>;const c=r[0]==="A"?C.green:r[0]==="B"?C.navy:C.danger;return <span style={{padding:"1px 8px",borderRadius:5,fontSize:11,fontWeight:800,color:c,background:`${c}10`,border:`1.5px solid ${c}25`,letterSpacing:1}}>{r}</span>;}
function Em({t}){return <div style={{textAlign:"center",padding:36,color:C.light,fontSize:13}}>{t||"لا توجد بيانات"}</div>;}
function Fl({l,children,span}){return <div style={{marginBottom:13,gridColumn:span?"span "+span:undefined}}><label style={{display:"block",fontSize:12,fontWeight:600,color:C.text,marginBottom:4}}>{l}</label>{children}</div>;}
function Tb({h,children}){return <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",direction:"rtl",textAlign:"right"}}><thead><tr style={{borderBottom:`2px solid ${C.border}`,background:"#f8faf8"}}>{h.map(x=><th key={x} style={{padding:"9px 9px",fontSize:10,fontWeight:700,color:C.muted,whiteSpace:"nowrap"}}>{x}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;}
function Tc({children,mono,bold,color,style:sx}){return <td style={{padding:"10px 9px",fontSize:12,fontWeight:bold?600:400,color:color||C.text,fontFamily:mono?"monospace":F,...sx}}>{children}</td>;}
function Mo({isOpen,onClose,title,children,wide}){if(!isOpen)return null;return <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}><div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(13,74,40,0.4)",backdropFilter:"blur(4px)"}}/><div style={{position:"relative",background:"#fff",borderRadius:14,maxWidth:wide?940:560,width:"94%",maxHeight:"88vh",overflow:"hidden",boxShadow:"0 25px 60px rgba(0,0,0,0.2)",direction:"rtl",display:"flex",flexDirection:"column"}}><div style={{padding:"16px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.greenDark}}><h3 style={{fontSize:15,fontWeight:700,color:"#fff",margin:0}}>{title}</h3><button onClick={onClose} style={{width:30,height:30,borderRadius:6,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",cursor:"pointer",fontSize:15,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div><div style={{padding:"22px 24px",overflow:"auto",flex:1}}>{children}</div></div></div>;}
function Ts({message,type,onDone}){useEffect(()=>{const t=setTimeout(onDone,3500);return()=>clearTimeout(t);},[onDone]);return <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:{success:C.green,error:C.danger,warning:C.warning}[type]||C.green,color:"#fff",padding:"11px 28px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:F,boxShadow:"0 8px 30px rgba(0,0,0,0.2)",direction:"rtl"}}>{type==="success"?"✓":"ℹ"} {message}</div>;}
function SC({icon,label,value,color,sub,gold}){return <div style={{...cd,padding:"16px 18px",borderTop:gold?`3px solid ${C.gold}`:"none"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}><span style={{fontSize:17}}>{icon}</span><span style={{fontSize:11,color:C.muted}}>{label}</span></div><div style={{fontSize:21,fontWeight:800,color:color||C.text}}>{value}</div>{sub&&<div style={{fontSize:10,color:C.light,marginTop:2}}>{sub}</div>}</div>;}
function Tabs({tabs,active,onChange}){return <div style={{display:"flex",gap:0,borderBottom:`2px solid ${C.border}`,marginBottom:18}}>{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} style={{padding:"9px 18px",fontSize:12,fontWeight:active===t.id?700:500,color:active===t.id?C.greenDark:C.muted,borderBottom:active===t.id?`3px solid ${C.gold}`:"3px solid transparent",background:"transparent",border:"none",cursor:"pointer",fontFamily:F,marginBottom:"-2px"}}>{t.icon&&<span style={{marginLeft:5}}>{t.icon}</span>}{t.l}</button>)}</div>;}

function DocList({docs}) {
  if (!docs || docs.length === 0) return null;
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
      {docs.map((d,i) => (
        <div key={d.id||d.name||i} style={{padding:"6px 12px",background:C.greenLight,borderRadius:6,display:"flex",alignItems:"center",gap:8,border:`1px solid ${C.border}`,fontSize:11}}>
          <span>📄</span>
          <div><div style={{fontWeight:600,color:C.text}}>{d.name}</div><div style={{fontSize:9,color:C.muted}}>{d.date||d.uploaded_at}{d.status==="expired"?<span style={{color:C.danger}}> • منتهي</span>:""}</div></div>
        </div>
      ))}
    </div>
  );
}

function DocUpload({docs,onChange,investorId,label}) {
  const [docType,setDocType]=useState("general");
  const [localDocs,setLocalDocs]=useState(docs||[]);
  const fileRef=React.createRef();
  const docTypes=[{v:"general",l:"عام"},{v:"legal",l:"قانوني"},{v:"financial",l:"مالي"},{v:"technical",l:"فني"},{v:"license",l:"ترخيص"},{v:"environmental",l:"بيئي"},{v:"safety",l:"سلامة"},{v:"contract",l:"عقد"},{v:"meeting",l:"محضر اجتماع"}];
  
  useEffect(()=>{if(docs)setLocalDocs(docs);},[docs]);

  const handleAdd=()=>{
    const file=fileRef.current?.files?.[0];
    if(!file)return;
    const newDoc={id:Date.now(),name:file.name,type:docType,date:dt(),status:"valid",hasFile:true,fileSize:file.size};
    const updated=[...localDocs,newDoc];
    setLocalDocs(updated);
    if(onChange)onChange(updated);
    if(investorId){
      const inv=DB.investors.find(x=>x.id===investorId);
      if(inv){inv.documents=[...(inv.documents||[]),newDoc];}
    }
    fileRef.current.value="";
  };

  return (
    <div style={{background:"#f8faf8",borderRadius:8,padding:14,border:`1px dashed ${C.border}`}}>
      <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>{label||"📎 المرفقات والوثائق"}</div>
      <div style={{display:"flex",gap:6,marginBottom:4,alignItems:"center"}}>
        <select style={{...inp,width:100,padding:"7px 8px",fontSize:11}} value={docType} onChange={e=>setDocType(e.target.value)}>{docTypes.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt" style={{flex:1,fontSize:11,fontFamily:F,color:C.text,padding:"6px 0"}}/>
        <button type="button" onClick={handleAdd} style={{...bP,fontSize:11,padding:"7px 14px",whiteSpace:"nowrap"}}>📎 رفع ملف</button>
      </div>
      {localDocs.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>{localDocs.map((d,i)=>(
        <div key={d.id||i} style={{padding:"6px 12px",background:d.hasFile?C.greenLight:"#f3f4f6",borderRadius:6,display:"flex",alignItems:"center",gap:8,border:`1px solid ${C.border}`,fontSize:11}}>
          <span>{d.hasFile?"📄":"📋"}</span>
          <div><div style={{fontWeight:600,color:C.text}}>{d.name}</div><div style={{fontSize:9,color:C.muted}}>{d.date}{d.hasFile&&<span style={{color:C.green}}> • ملف مرفق</span>}{d.status==="expired"&&<span style={{color:C.danger}}> • منتهي</span>}</div></div>
        </div>
      ))}</div>}
    </div>
  );
}

function FIM({fields,init,req=[],onSave,onClose,withDocs,investorField}) {
  const [fm,sF]=useState(init);
  const [e,sE]=useState("");
  const [docs,sDocs]=useState([]);
  const set=(k,v)=>{
    sF(f=>{
      const upd={...f,[k]:v};
      // Auto-fill company name when investor selected
      if(investorField && k==="inv_id" && v){
        const inv=DB.investors.find(x=>x.id===Number(v));
        if(inv && fields.find(fi=>fi.k==="company")) upd.company=inv.name;
      }
      return upd;
    });
  };
  const go=()=>{for(const r of req){if(!fm[r]?.toString().trim()){sE("يرجى ملء الحقول المطلوبة *");return;}}onSave({...fm,_docs:docs});};
  const invOpts=DB.investors.map(i=>({v:String(i.id),l:i.name+" ("+i.sector+")"}));
  return (
    <div>
      {investorField && (
        <Fl l="اختيار المستثمر" span={2}>
          <select style={{...inp,borderColor:C.gold}} value={fm.inv_id||""} onChange={e=>set("inv_id",e.target.value)}>
            <option value="">— اختر المستثمر —</option>
            {invOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </Fl>
      )}
      <div style={{display:"grid",gridTemplateColumns:fields.length>3?"1fr 1fr":"1fr",gap:"0 12px"}}>
        {fields.map(f => (
          <Fl key={f.k} l={f.l} span={f.span}>
            {f.type==="select" ? <select style={inp} value={fm[f.k]} onChange={e=>set(f.k,e.target.value)}>{f.opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>
            : f.type==="textarea" ? <textarea style={{...inp,minHeight:45,resize:"vertical"}} value={fm[f.k]} onChange={e=>set(f.k,e.target.value)} />
            : <input style={inp} type={f.type||"text"} value={fm[f.k]} onChange={e=>set(f.k,e.target.value)} />}
          </Fl>
        ))}
      </div>
      {withDocs && (
        <div style={{marginTop:8,marginBottom:12}}>
          <DocUpload docs={docs} onChange={sDocs} investorId={fm.inv_id?Number(fm.inv_id):null} />
        </div>
      )}
      {e && <div style={{color:C.danger,fontSize:12,marginBottom:10}}>{e}</div>}
      <div style={{display:"flex",gap:10,marginTop:4}}>
        <button onClick={go} style={{...bG,flex:1}}>حفظ</button>
        <button onClick={onClose} style={bS}>إلغاء</button>
      </div>
    </div>
  );
}

