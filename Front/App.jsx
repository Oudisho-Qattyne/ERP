// ════════════ MAIN APP ════════════
export default function HassiaERP() {
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [col,setCol]=useState(false);
  // Cross-module popups from dashboard
  const [dashReqId,setDashReqId]=useState(null);
  const [dashInv,setDashInv]=useState(null);

  if (!user) return <Login onLogin={setUser} />;

  const navItems=NAV.filter(n=>{if(["users","audit"].includes(n.id))return user.role==="admin";return true;});
  const cur=navItems.find(n=>n.id===page);
  const unread=DB.notifications.filter(n=>n.uid===user.id&&!n.read).length;

  const renderPage=()=>{
    switch(page){
      case "dashboard":return <Dashboard onNav={setPage} onOpenRequest={id=>setDashReqId(id)} onOpenInvestor={inv=>setDashInv(inv)}/>;
      case "requests":return <RequestsView user={user}/>;
      case "contracts":return <ContractsView/>;
      case "invoices":return <InvoicesView/>;
      case "legal":return <LegalView/>;
      case "hr":return <HRView/>;
      case "investors":return <InvestorsView/>;
      case "pipeline":return <PipelineView/>;
      case "interactions":return <InteractionsView user={user}/>;
      case "plots":return <PlotsView/>;
      case "assets":return <AssetsView/>;
      case "reports":return <ReportsView/>;
      case "users":return <UsersView cu={user}/>;
      case "notifications":return <NotifView cu={user}/>;
      case "audit":return <AuditView cu={user}/>;
      default:return <Dashboard onNav={setPage} onOpenRequest={id=>setDashReqId(id)} onOpenInvestor={inv=>setDashInv(inv)}/>;
    }
  };

  return (
    <div dir="rtl" style={{fontFamily:F,display:"flex",height:"100vh",background:C.bg,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#b8c5b8;border-radius:10px}
        input:focus,select:focus,textarea:focus{border-color:${C.green}!important;box-shadow:0 0 0 3px ${C.green}12!important}
        table tr:hover td{background:#f8faf8}
      `}</style>

      {/* Sidebar */}
      <aside style={{width:col?60:228,background:`linear-gradient(180deg,${C.greenDark} 0%,#0a3820 50%,${C.greenDark} 100%)`,display:"flex",flexDirection:"column",transition:"width 0.25s ease",overflow:"hidden",flexShrink:0,borderLeft:`1px solid ${C.gold}20`}}>
        <div style={{padding:col?"14px 0":"16px 16px",borderBottom:`1px solid rgba(255,255,255,0.06)`,display:"flex",alignItems:"center",justifyContent:col?"center":"flex-start",gap:9}}>
          <div style={{width:32,height:32,borderRadius:7,background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:C.greenDark,flexShrink:0,boxShadow:`0 2px 8px ${C.gold}30`}}>🦅</div>
          {!col&&<div><div style={{fontSize:12,fontWeight:800,color:"#fff",letterSpacing:"0.3px"}}>حسياء</div><div style={{fontSize:8,color:"rgba(255,255,255,0.4)"}}>نظام الإدارة الموحد</div></div>}
        </div>
        <nav style={{flex:1,padding:"5px 5px",display:"flex",flexDirection:"column",gap:0,overflowY:"auto"}}>
          {NG.map(g=>{const items=navItems.filter(n=>n.g===g.id);if(!items.length)return null;return <div key={g.id}>{g.l&&!col&&<div style={{fontSize:8,fontWeight:700,color:"rgba(255,255,255,0.2)",padding:"12px 10px 3px",letterSpacing:1.5,textTransform:"uppercase"}}>{g.l}</div>}{g.l&&col&&<div style={{height:1,background:"rgba(255,255,255,0.04)",margin:"6px 5px"}}/>}{items.map(item=>{const isA=page===item.id;const hasN=item.id==="notifications"&&unread>0;return <button key={item.id} onClick={()=>setPage(item.id)} title={item.l} style={{display:"flex",alignItems:"center",gap:8,padding:col?"8px 0":"7px 10px",justifyContent:col?"center":"flex-start",borderRadius:5,border:"none",cursor:"pointer",background:isA?`rgba(201,168,76,0.1)`:"transparent",color:isA?C.gold:"rgba(255,255,255,0.45)",fontSize:11,fontWeight:isA?700:500,fontFamily:F,transition:"all 0.15s",width:"100%",position:"relative",borderRight:isA?`2px solid ${C.gold}`:"2px solid transparent"}}><span style={{fontSize:13,flexShrink:0}}>{item.i}</span>{!col&&<span>{item.l}</span>}{hasN&&<span style={{position:"absolute",top:4,left:col?7:5,width:6,height:6,borderRadius:"50%",background:"#ef4444",border:`1.5px solid ${C.greenDark}`}}/>}</button>})}</div>;})}
        </nav>
        <div style={{padding:"7px 5px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",gap:2}}>
          <button onClick={()=>setUser(null)} style={{display:"flex",alignItems:"center",gap:8,padding:col?"8px 0":"7px 10px",justifyContent:col?"center":"flex-start",borderRadius:5,border:"none",cursor:"pointer",background:"transparent",color:"#ef4444",fontSize:11,fontWeight:600,fontFamily:F,width:"100%"}}><span style={{fontSize:13}}>🚪</span>{!col&&<span>خروج</span>}</button>
          <button onClick={()=>setCol(!col)} style={{width:"100%",padding:5,borderRadius:5,border:"none",background:"rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:12}}>{col?"→":"←"}</button>
        </div>
      </aside>

      <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <header style={{background:"#fff",padding:"0 22px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:3,height:22,background:C.gold,borderRadius:2}}/><h1 style={{fontSize:15,fontWeight:800,color:C.text,margin:0}}>{cur?.i} {cur?.l}</h1></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {unread>0&&<button onClick={()=>setPage("notifications")} style={{padding:"3px 12px",borderRadius:6,border:`1px solid #fca5a5`,background:"#fef2f2",color:C.danger,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:F}}>🔔 {unread}</button>}
            <div style={{width:30,height:30,borderRadius:7,background:`linear-gradient(135deg,${C.green},${C.greenDark})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700}}>{user.full_name?.[0]==="م"?user.full_name?.[2]:user.full_name?.[0]}</div>
            <div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{user.full_name}</div><div style={{fontSize:9,color:C.light}}>{user.position||ROLES[user.role]}</div></div>
          </div>
        </header>
        <div style={{flex:1,overflow:"auto",padding:20}}>{renderPage()}</div>
        <div style={{padding:"5px 22px",borderTop:`1px solid ${C.border}`,background:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{fontSize:9,color:C.light}}>المدينة الصناعية في حسياء — محافظة حمص — الجمهورية العربية السورية</span>
          <span style={{fontSize:9,color:C.light}}>الإصدار 2.0 — جميع الحقوق محفوظة © ٢٠٢٥</span>
        </div>
      </main>
      {/* Cross-module popups from Dashboard */}
      <Mo isOpen={!!dashReqId} onClose={()=>setDashReqId(null)} title="تفاصيل المعاملة" wide>
        <ReqDetail user={user} rid={dashReqId} onClose={()=>setDashReqId(null)} onUp={()=>setDashReqId(null)}/>
      </Mo>
      <Mo isOpen={!!dashInv} onClose={()=>setDashInv(null)} title={"ملف المستثمر — "+(dashInv?.name||"")} wide>
        {dashInv&&<InvProfile inv={dashInv}/>}
      </Mo>
    </div>
  );
}
