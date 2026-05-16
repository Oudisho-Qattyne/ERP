// ════════════ AUDIT ════════════
function AuditView({cu}) {
  if(cu?.role!=="admin")return <Em t="متاحة للمدير العام فقط"/>;
  const lb={create:"إنشاء",update:"تحديث",delete:"حذف",login:"تسجيل دخول",pay:"تسجيل دفع"};
  return <div style={cd}><Tb h={["المستخدم","الإجراء","الجدول","المعرف","التاريخ"]}>{DB.auditLog.map(l=><tr key={l.id} style={{borderBottom:`1px solid ${C.border}`}}><Tc bold>{l.who}</Tc><Tc><span style={{padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:600,background:C.greenLight,color:C.green}}>{lb[l.action]||l.action}</span></Tc><Tc color={C.muted}>{l.table}</Tc><Tc color={C.light}>{l.rec||"—"}</Tc><Tc color={C.muted}>{l.at}</Tc></tr>)}</Tb></div>;
}

