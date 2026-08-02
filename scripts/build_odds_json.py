#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Barvision 2026 赔率计算引擎：输入 Excel → odds.json
用法:  python build_odds_json.py [输入xlsx] [输出json]
默认:  python build_odds_json.py barvision_2026_odds.xlsx odds.json  (输入统一命名 barvision_2026_odds.xlsx)

输入 Excel(每赛事一张表 SF1/SF2/Wildcard/GF)列:序号|来源|歌曲|表演者|BBL周(0501..0821)|噪音(host)|威·本心(host)|输入1..N
参数在「参数」表。odds.json 为生成文件,可整份覆盖。
趋势(排名升降)通过对比上一份 odds.json 自动生成——保留旧文件即可。
默认路径(仓库内固定位置,可从仓库根直接 `python scripts/build_odds_json.py` 运行):
  输入 xlsx / 输出 odds.json / 趋势基准 odds_prev.json 均在 data/barvision/odds/
"""
import sys, json, math, os, openpyxl

# 相对本脚本定位 data/barvision/odds/(仓库固定位置),无论从哪个 cwd 运行都正确
_ODDS_DIR = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "barvision", "odds"))

XLSX = sys.argv[1] if len(sys.argv) > 1 else os.path.join(_ODDS_DIR, "barvision_2026_odds.xlsx")
OUT  = sys.argv[2] if len(sys.argv) > 2 else os.path.join(_ODDS_DIR, "odds.json")

# 假博彩公司名(每位投票人固定一个,跨盘口一致——像真庄家)
FAKE = ["BETSWORLD","ODDSMAX","CROWNPLAY","VANTA","NORDIQ","LUMEN","APEX","KESTREL","MERIDIAN","ONYX",
        "PULSAR","TRIDENT","HALCYON","OBELISK","ZENITH","CIPHER","VERTEX","MONARCH","QUASAR","IRONCLAD",
        "SABLE","ATLAS","NIMBUS","COBALT","GALEBET","STAKEHAUS","VELVET","EMBERBET","NOVA","RIVET",
        "HOLLOWAY","KINGFISHER","SOLARIS","TEMPEST","GRANITE","ORACLE","MIRAGE","CARDINAL","FATHOM","LYNX"]

# 赛事 → 盘口: (id, label, K名额, 强度类型, chance列头, 是否β拉伸, 个人赔率公式)
CHL={"winner":"winning chance","qualify":"qualifying chance","top3":"top 3 chance","top10":"top 10 chance"}
# 顺序：Grand Final(总冠军=Barvision 2026)置首；SF/Wildcard 盘口内 To qualify 置首
EVENTS = {
 "gf":      ("Barvision 2026", [("winner",1,"champ",0),("top3",3,"blend",1),("top10",10,"qual",1)]),
 "sf1":     ("Semi-Final 1",  [("qualify",12,"qual",1),("winner",1,"champ",0),("top3",3,"blend",1)]),
 "sf2":     ("Semi-Final 2",  [("qualify",12,"qual",1),("winner",1,"champ",0),("top3",3,"blend",1)]),
 "wildcard":("Wildcard Round",[("qualify",3,"qual",1),("winner",1,"champ",0)]),
}
SHEET={"sf1":"SF1","sf2":"SF2","wildcard":"Wildcard","gf":"GF"}
DISCLAIMER="本赔率由成员预测投票与BarboardLab历史数据生成，仅供娱乐，请以实际晋级结果为准。"

def chance_text(p):
    if p is None: return ""
    if p<=0 or p<0.01: return "<1%"
    return f"{round(p*100)}%"

def hajek_topk(shares, K):
    """PL 前K名概率近似:solve φ s.t. Σ(1-e^{-φs})=K, 返回 [1-e^{-φs}]."""
    if K<=0 or not shares: return [0.0]*len(shares)
    lo,hi=0.0,500.0
    def S(phi): return sum(1-math.exp(-phi*s) for s in shares)
    if S(hi)<K: hi=5000.0
    for _ in range(80):
        mid=(lo+hi)/2
        if S(mid)<K: lo=mid
        else: hi=mid
    phi=(lo+hi)/2
    return [1-math.exp(-phi*s) for s in shares]

def load_params(wb):
    p={}
    if "参数" in wb.sheetnames:
        ws=wb["参数"]
        for r in range(1,ws.max_row+1):
            k=ws.cell(r,1).value; v=ws.cell(r,2).value
            if k is not None: p[str(k).strip()]=v
    d=dict(a_c=0.3,a_q=0.6,b=0.3,c=0.1,k_qual=6,k_top3=3,beta=0.75,smoothing=0.005,budget=200,gf_bbl_k=3)
    d.update({k:p[k] for k in d if k in p and p[k] is not None})
    return d

def read_event(ws):
    # locate columns by header
    hdr=[ws.cell(1,c).value for c in range(1,ws.max_column+1)]
    def has(x): return x in hdr
    weekcols=[c for c in range(1,len(hdr)+1) if isinstance(hdr[c-1],str) and hdr[c-1].isdigit() and len(hdr[c-1])==4]
    votecols=[c for c in range(1,len(hdr)+1) if isinstance(hdr[c-1],str) and (("host" in hdr[c-1]) or hdr[c-1].startswith("输入"))]
    n=sum(1 for r in range(2,ws.max_row+1) if ws.cell(r,3).value)
    songs=[]; bbl=[]; votes=[]
    for r in range(2,2+n):
        songs.append((ws.cell(r,1).value,ws.cell(r,2).value,ws.cell(r,3).value,ws.cell(r,4).value))
        bbl.append([ws.cell(r,c).value or 0 for c in weekcols])
        votes.append([ws.cell(r,c).value or 0 for c in votecols])
    return songs,bbl,votes,len(weekcols)

def compute_event(eid, songs, bbl, votes, nweeks, P):
    GF = (eid=='gf')
    n=len(songs); V=len(votes[0]) if votes else 0
    rw=[0.5**((nweeks-1-j)/4.0) for j in range(nweeks)]
    chips=[sum(votes[i]) for i in range(n)]
    W=sum(chips); alpha=P["smoothing"]*max(W,1)
    pshare=[(chips[i]+alpha)/(W+n*alpha) for i in range(n)]
    def wpavg(s):  # recency present-avg
        num=sum(s[j]*rw[j] for j in range(nweeks)); den=sum((1 if s[j]>0 else 0)*rw[j] for j in range(nweeks))
        return num/den if den>0 else 0.0
    cbbl=[wpavg(bbl[i]) for i in range(n)]
    qbbl=[sum((1 if bbl[i][j]>0 else 0)*rw[j] for j in range(nweeks)) for i in range(n)]
    mc=max(cbbl) or 1; mq=max(qbbl) or 1
    cbbln=[x/mc for x in cbbl]; qbbln=[x/mq for x in qbbl]
    bread=[sum(1 for v in votes[i] if v>=10) for i in range(n)]; mb=max(bread) or 1
    hhi=[ (sum(v*v for v in votes[i])/(chips[i]**2) if chips[i]>0 else 0) for i in range(n)]
    if GF:  # 决赛投票前:纯 BBL 驱动,用指数倾斜拉梯度(gf_bbl_k,票进来后可调小)
        gk=P["gf_bbl_k"]
        champ=[pshare[i]*math.exp(gk*cbbln[i]) for i in range(n)]
        qual =[pshare[i]*math.exp(gk*qbbln[i])*(1+P["b"]*bread[i]/mb)*(1-P["c"]*hhi[i]) for i in range(n)]
    else:
        champ=[pshare[i]*(1+P["a_c"]*cbbln[i]) for i in range(n)]
        qual =[pshare[i]*(1+P["a_q"]*qbbln[i])*(1+P["b"]*bread[i]/mb)*(1-P["c"]*hhi[i]) for i in range(n)]
    blend=[math.sqrt(max(champ[i],1e-12)*max(qual[i],1e-12)) for i in range(n)]
    def share(x): s=sum(x); return [v/s for v in x] if s>0 else [0]*len(x)
    STR={"champ":champ,"qual":qual,"blend":blend}
    SH={k:share(v) for k,v in STR.items()}
    return dict(songs=songs,chips=chips,votes=votes,V=V,pshare=pshare,SH=SH,budget=P["budget"],
                k_qual=P["k_qual"],k_top3=P["k_top3"],beta=P["beta"])

def per_member_odd(chip, budget, mode, k):
    if chip==0: v=99.0
    elif mode=="win": v=budget/chip
    else: v=1/(1-math.exp(-k*chip/budget))
    return round(min(99,max(1.01,v)),2)

def build_market(eid,mid,K,stype,stretch,E,names):
    _K=K
    songs=E["songs"]; sh=E["SH"][stype]; n=len(songs)
    p = sh[:] if mid=="winner" else hajek_topk(sh,K)
    if stretch: p=[min(0.99,1-(1-x)**E["beta"]) for x in p]
    else: p=[min(0.99,x) for x in p]
    mode = "win" if mid=="winner" else ("k3" if mid=="top3" else "k6")
    k = E["k_top3"] if mode=="k3" else E["k_qual"]
    idx=sorted(range(n),key=lambda i:-p[i])
    rows=[]
    for rank,i in enumerate(idx,1):
        no,src,song,art=songs[i]
        odds={}
        for vi in range(E["V"]):
            if any(E["votes"][r][vi]>0 for r in range(n)):  # active voter only
                odds[names[vi]]=per_member_odd(E["votes"][i][vi],E["budget"],mode,k)
        rows.append({"rank":rank,"source":src,"song":song,"artist":art,
                     "chance":round(p[i],4),"chanceText":chance_text(p[i]),"odds":odds})
    bookmakers=[names[vi] for vi in range(E["V"]) if any(E["votes"][r][vi]>0 for r in range(n))]
    return {"id":mid,"label":mid.capitalize() if mid not in("qualify","top3","top10") else
            {"qualify":"To qualify","top3":"Top 3","top10":"Top 10"}[mid],
            "chanceLabel":CHL[mid],"highlightTop":_K,"bookmakers":bookmakers,"rows":rows}

def main():
    try: sys.stdout.reconfigure(encoding="utf-8")  # Windows 控制台默认 GBK,无法输出 ✓/中文
    except Exception: pass
    wb=openpyxl.load_workbook(XLSX,data_only=True); P=load_params(wb)
    prev={}
    PREV=os.path.join(_ODDS_DIR,"odds_prev.json")
    if os.path.exists(PREV):
        try:
            old=json.load(open(PREV,encoding="utf-8"))
            for e in old.get("events",[]):
                for m in e.get("markets",[]):
                    for r in m.get("rows",[]):
                        prev[(e["id"],m["id"],r["song"])]=r["rank"]
        except Exception: pass
    events=[]
    for eid,(ename,mkts) in EVENTS.items():
        if SHEET[eid] not in wb.sheetnames: continue
        songs,bbl,votes,nw=read_event(wb[SHEET[eid]])
        E=compute_event(eid,songs,bbl,votes,nw,P)
        names=FAKE[:E["V"]]
        markets=[]
        for mid,K,stype,stretch in mkts:
            m=build_market(eid,mid,K,stype,stretch,E,names)
            for r in m["rows"]:
                pr=prev.get((eid,mid,r["song"]))
                if pr is None: r["trend"]={"dir":"new","delta":0}
                else:
                    d=pr-r["rank"]; r["trend"]={"dir":"up" if d>0 else("down" if d<0 else "same"),"delta":abs(d)}
            markets.append(m)
        events.append({"id":eid,"name":ename,"markets":markets})
    data={"meta":{"contest":"Barvision Chongqing 2026","disclaimer":DISCLAIMER,
                  "note":"chanceText 含<1%规则直接显示;source=选送成员;trend=对比上一份odds.json的排名升降;"
                         "高亮(前端两套):①每家公司列内高亮其最优前3赔率(排除99,并列超3整组不亮);②歌名卡片:若该行在本盘口 highlightTop(N)名内则高亮(并列超N整组不亮)。"},
          "events":events}
    json.dump(data,open(OUT,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
    print(f"✓ {OUT}:{len(events)}赛事 / {sum(len(e['markets']) for e in events)}盘口")

if __name__=="__main__": main()
