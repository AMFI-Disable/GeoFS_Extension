"use strict";(()=>{var it=["V1","VR","V2","Vref","Vfe","Vne"];function pe(r,e){let t=it.flatMap(i=>r?.[i]!==void 0?[`${i} ${r[i]} kt`]:e?.[i]!==void 0?[`${i} Mach ${e[i]}`]:[]);return t.length?`V-Speeds: ${t.join(" \xB7 ")}`:""}var Ct={1:{name:"Piper Cub",category:"ga-piston",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:340,mtow:550,maxFuel:45,vSpeeds:{vr:38,vref:50,vne:106}},2:{name:"Cessna 172",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:757,mtow:1157,maxFuel:160,vSpeeds:{vr:55,vref:65,vfe:85,vne:163}},3:{name:"Alphajet PAF",category:"fighter",engineCount:2,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:3515,mtow:8e3,maxFuel:1520,vSpeeds:{vr:115,vref:120,vfe:210,vne:540}},4:{name:"Boeing 737-700",category:"airliner-twin",engineCount:2,maxFlaps:8,hasGear:!0,hasSpoilers:!0,oew:37340,mtow:70080,maxFuel:20816,vSpeeds:{v1:130,vr:136,v2:144,vref:130,vfe:230,vne:340}},5:{name:"Embraer Phenom 100",category:"airliner-twin",engineCount:2,maxFlaps:4,hasGear:!0,hasSpoilers:!0,oew:3235,mtow:4750,maxFuel:1272,vSpeeds:{v1:98,vr:102,v2:110,vref:99,vfe:180,vne:275}},6:{name:"de Havilland Canada DHC-6 Twin Otter",category:"turboprop",engineCount:2,maxFlaps:4,hasGear:!1,hasSpoilers:!1,oew:3121,mtow:5670,maxFuel:1175,vSpeeds:{vr:65,vref:75,vfe:105,vne:170}},7:{name:"F-16 Fighting Falcon",category:"fighter",engineCount:1,maxFlaps:0,hasGear:!0,hasSpoilers:!0,oew:8570,mtow:19200,maxFuel:3175,vSpeeds:{vr:140,vref:148,vne:800}},8:{name:"Pitts Special S1",category:"ga-piston",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:326,mtow:521,maxFuel:60,vSpeeds:{vr:58,vref:70,vne:182}},9:{name:"Eurocopter EC135",category:"rotorcraft",engineCount:2,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:1455,mtow:2910,maxFuel:560,vSpeeds:{vref:60,vne:155}},10:{name:"Airbus A380",category:"airliner-quad",engineCount:4,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:277e3,mtow:575e3,maxFuel:253983,vSpeeds:{v1:145,vr:155,v2:165,vref:142,vfe:222,vne:340}},11:{name:"Alisport Silent 2 Electro",category:"specialized",engineCount:1,maxFlaps:0,hasGear:!0,hasSpoilers:!0,oew:205,mtow:300,maxFuel:0,vSpeeds:{vr:35,vref:45,vne:118}},12:{name:"Pilatus PC-7 Mk-I",category:"turboprop",engineCount:1,maxFlaps:2,hasGear:!0,hasSpoilers:!1,oew:1330,mtow:2700,maxFuel:360,vSpeeds:{vr:75,vref:85,vfe:130,vne:270}},13:{name:"de Havilland Canada DHC-2 Beaver",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:1361,mtow:2313,maxFuel:359,vSpeeds:{vr:52,vref:65,vfe:95,vne:156}},14:{name:"Colomban MC-15 Cri-cri",category:"ga-piston",engineCount:2,maxFlaps:1,hasGear:!1,hasSpoilers:!1,oew:80,mtow:170,maxFuel:18,vSpeeds:{vr:42,vref:52,vfe:80,vne:140}},15:{name:"Lockheed P-38 Lightning F-5B",category:"ga-piston",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!1,oew:5800,mtow:9800,maxFuel:1100,vSpeeds:{vr:95,vref:105,vfe:160,vne:390}},16:{name:"Douglas DC-3",category:"ga-piston",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!1,oew:7650,mtow:11430,maxFuel:1800,vSpeeds:{vr:78,vref:85,vfe:112,vne:211}},18:{name:"Sukhoi Su-35",category:"fighter",engineCount:2,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:18400,mtow:34500,maxFuel:11500,vSpeeds:{vr:130,vref:142,vfe:250,vne:755}},19:{name:"Concorde (V3)",category:"supersonic",engineCount:4,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:78700,mtow:185e3,maxFuel:95600,vSpeeds:{v1:165,vr:195,v2:220,vref:162,vne:1350}},20:{name:"Concorde",category:"supersonic",engineCount:4,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:78700,mtow:185e3,maxFuel:95600,vSpeeds:{v1:165,vr:195,v2:220,vref:162,vne:1350}},21:{name:"Piper PA-28 161 Warrior II",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:612,mtow:1107,maxFuel:145,vSpeeds:{vr:55,vref:63,vfe:103,vne:160}},22:{name:"Cessna 152",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:490,mtow:757,maxFuel:98,vSpeeds:{vr:50,vref:60,vfe:85,vne:149}},23:{name:"Piper PA-28 Warrior II",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:612,mtow:1107,maxFuel:145,vSpeeds:{vr:55,vref:63,vfe:103,vne:160}},24:{name:"Airbus A350-900",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:142400,mtow:28e4,maxFuel:112600,vSpeeds:{v1:142,vr:148,v2:156,vref:138,vfe:230,vne:340}},25:{name:"Boeing 777-300ER",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:167800,mtow:351500,maxFuel:145538,vSpeeds:{v1:152,vr:160,v2:168,vref:146,vfe:235,vne:330}},27:{name:"Boeing F/A-18F Super Hornet",category:"fighter",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!0,oew:14552,mtow:29937,maxFuel:6200,vSpeeds:{vr:135,vref:138,vfe:250,vne:750}},28:{name:"Beechcraft Baron B55",category:"ga-piston",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!1,oew:1431,mtow:2313,maxFuel:322,vSpeeds:{vr:78,vref:90,vfe:122,vne:223}},29:{name:"Dassault Rafale",category:"fighter",engineCount:2,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:10300,mtow:24500,maxFuel:4700,vSpeeds:{vr:125,vref:132,vne:750}},31:{name:"Potez 25",category:"ga-piston",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:1490,mtow:2558,maxFuel:250,vSpeeds:{vr:48,vref:58,vne:130}},32:{name:"Northrop T-38 Talon",category:"fighter",engineCount:2,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:3270,mtow:5670,maxFuel:1800,vSpeeds:{vr:145,vref:155,vfe:240,vne:710}},240:{name:"Boeing 777-200ER",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:138100,mtow:297550,maxFuel:137460,vSpeeds:{v1:146,vr:154,v2:162,vref:140,vfe:235,vne:330}},242:{name:"Airbus A321neo",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:50100,mtow:97e3,maxFuel:26e3,vSpeeds:{v1:138,vr:143,v2:149,vref:135,vfe:230,vne:350}},243:{name:"Airbus A319-100",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:40800,mtow:75500,maxFuel:18600,vSpeeds:{v1:130,vr:135,v2:142,vref:128,vfe:230,vne:350}},244:{name:"Airbus A320neo",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:44300,mtow:79e3,maxFuel:19046,vSpeeds:{v1:132,vr:138,v2:145,vref:130,vfe:230,vne:350}},1013:{name:"ATR 42-600",category:"turboprop",engineCount:2,maxFlaps:4,hasGear:!0,hasSpoilers:!1,oew:11700,mtow:18600,maxFuel:4500,vSpeeds:{v1:96,vr:100,v2:108,vref:104,vfe:175,vne:250}},1015:{name:"Challenger 650",category:"airliner-twin",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!0,oew:12300,mtow:21863,maxFuel:9072,vSpeeds:{v1:118,vr:124,v2:132,vref:122,vfe:215,vne:340}},1016:{name:"CRJ900",category:"airliner-twin",engineCount:2,maxFlaps:4,hasGear:!0,hasSpoilers:!0,oew:21433,mtow:38330,maxFuel:8800,vSpeeds:{v1:128,vr:134,v2:142,vref:130,vfe:220,vne:335}},2808:{name:"Supermarine Spitfire Mk IX",category:"ga-piston",engineCount:1,maxFlaps:1,hasGear:!0,hasSpoilers:!1,oew:2300,mtow:4300,maxFuel:380,vSpeeds:{vr:85,vref:90,vfe:140,vne:390}},2843:{name:"Airbus A321-200",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:48500,mtow:93500,maxFuel:24e3,vSpeeds:{v1:136,vr:142,v2:148,vref:134,vfe:230,vne:350}},2844:{name:"Falcon 9 (SpaceX)",category:"specialized",engineCount:9,maxFlaps:0,hasGear:!0,hasSpoilers:!0,oew:22200,mtow:549054,maxFuel:395700,vSpeeds:{vr:180,vref:160,vne:1500}},2948:{name:"North American XB-70 Valkyrie",category:"supersonic",engineCount:6,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:115031,mtow:245847,maxFuel:14e4,vSpeeds:{v1:170,vr:200,v2:225,vref:175,vne:1800}},2953:{name:"Space Shuttle Atlantis",category:"specialized",engineCount:3,maxFlaps:1,hasGear:!0,hasSpoilers:!0,oew:78e3,mtow:11e4,maxFuel:0,vSpeeds:{vr:195,vref:195,vne:450}},2973:{name:"Airbus A350-1000 XWB",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:155e3,mtow:319e3,maxFuel:125e3,vSpeeds:{v1:148,vr:155,v2:162,vref:143,vfe:230,vne:340}},2988:{name:"North American X-15",category:"specialized",engineCount:1,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:6620,mtow:15420,maxFuel:8300,vSpeeds:{vr:210,vref:200,vfe:320,vne:2e3}},3179:{name:"Boeing 787-10",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:135500,mtow:254e3,maxFuel:101e3,vSpeeds:{v1:146,vr:152,v2:160,vref:141,vfe:235,vne:340}},4341:{name:"Spirit of St. Louis",category:"ga-piston",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:975,mtow:2380,maxFuel:1200,vSpeeds:{vr:55,vref:62,vne:115}},4402:{name:"Boeing 777-200F",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:144400,mtow:347800,maxFuel:145e3,vSpeeds:{v1:150,vr:158,v2:166,vref:144,vfe:235,vne:330}},5038:{name:"Lockheed L-1011-1 TriStar",category:"airliner-twin",engineCount:3,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:105100,mtow:195045,maxFuel:68e3,vSpeeds:{v1:140,vr:148,v2:156,vref:138,vfe:230,vne:345}},5073:{name:"Bombardier Learjet 45 XR",category:"airliner-twin",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!0,oew:6212,mtow:9752,maxFuel:2700,vSpeeds:{v1:116,vr:122,v2:129,vref:118,vfe:200,vne:330}},5086:{name:"Airbus A321-211",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:48500,mtow:93500,maxFuel:23700,vSpeeds:{v1:136,vr:142,v2:148,vref:134,vfe:230,vne:350}},5156:{name:"Airbus A318-112",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:39500,mtow:68e3,maxFuel:18600,vSpeeds:{v1:126,vr:132,v2:138,vref:125,vfe:230,vne:350}},5193:{name:"Boeing 747-8i",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:220128,mtow:447700,maxFuel:191e3,vSpeeds:{v1:154,vr:164,v2:174,vref:150,vfe:240,vne:365}},5203:{name:"Boeing 737-600",category:"airliner-twin",engineCount:2,maxFlaps:8,hasGear:!0,hasSpoilers:!0,oew:37340,mtow:65990,maxFuel:20816,vSpeeds:{v1:128,vr:134,v2:141,vref:128,vfe:230,vne:340}},5211:{name:"Boeing 747SP",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:152780,mtow:317500,maxFuel:15e4,vSpeeds:{v1:142,vr:152,v2:162,vref:138,vfe:235,vne:365}},5229:{name:"F-35B Lightning II",category:"fighter",engineCount:1,maxFlaps:0,hasGear:!0,hasSpoilers:!0,oew:14700,mtow:27200,maxFuel:6125,vSpeeds:{vr:132,vref:138,vne:750}},5314:{name:"Boeing 747-100 SCA",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:162400,mtow:322050,maxFuel:145e3,vSpeeds:{v1:144,vr:154,v2:164,vref:142,vfe:235,vne:360}},5409:{name:"Boeing 747-400D",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:181e3,mtow:396890,maxFuel:173472,vSpeeds:{v1:148,vr:158,v2:168,vref:144,vfe:235,vne:365}},5431:{name:"Northrop YF-23",category:"fighter",engineCount:2,maxFlaps:0,hasGear:!0,hasSpoilers:!0,oew:14900,mtow:29e3,maxFuel:8600,vSpeeds:{vr:138,vref:144,vne:820}},5486:{name:"Aviat A-1B Husky",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:531,mtow:907,maxFuel:190,vSpeeds:{vr:42,vref:52,vfe:80,vne:132}},5499:{name:"CubCrafters CC19 XCub",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:552,mtow:1043,maxFuel:150,vSpeeds:{vr:40,vref:50,vfe:82,vne:145}},5516:{name:"Boeing 747-400 LCF",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:180530,mtow:364235,maxFuel:16e4,vSpeeds:{v1:148,vr:158,v2:168,vref:144,vfe:235,vne:350}},5527:{name:"Boeing 747-400",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:183520,mtow:396890,maxFuel:173472,vSpeeds:{v1:150,vr:160,v2:170,vref:146,vfe:235,vne:365}},5551:{name:"Comac C919-100",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:42e3,mtow:71500,maxFuel:15600,vSpeeds:{v1:132,vr:138,v2:145,vref:130,vfe:225,vne:340}},5566:{name:"Embraer E175",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:21886,mtow:38790,maxFuel:9335,vSpeeds:{v1:124,vr:130,v2:138,vref:122,vfe:215,vne:320}},5585:{name:"Boeing 767-300ER",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:90010,mtow:186880,maxFuel:72900,vSpeeds:{v1:142,vr:149,v2:157,vref:138,vfe:235,vne:360}},5642:{name:"Tupolev Tu-144",category:"supersonic",engineCount:4,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:99200,mtow:207e3,maxFuel:95e3,vSpeeds:{v1:168,vr:192,v2:215,vref:165,vne:1350}},5678:{name:"Boeing 757-200",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:58440,mtow:115680,maxFuel:34500,vSpeeds:{v1:138,vr:144,v2:152,vref:132,vfe:235,vne:350}},5712:{name:"McDonnell Douglas MD-11",category:"airliner-twin",engineCount:3,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:117356,mtow:286e3,maxFuel:116926,vSpeeds:{v1:150,vr:158,v2:166,vref:149,vfe:235,vne:355}},5791:{name:"Lockheed C-5M Galaxy",category:"airliner-quad",engineCount:4,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:172370,mtow:381e3,maxFuel:150800,vSpeeds:{v1:138,vr:146,v2:155,vref:136,vfe:225,vne:350}},5847:{name:"Boeing 727-200",category:"airliner-twin",engineCount:3,maxFlaps:8,hasGear:!0,hasSpoilers:!0,oew:45360,mtow:95e3,maxFuel:30600,vSpeeds:{v1:134,vr:140,v2:148,vref:132,vfe:230,vne:350}}};var di=[{match:"a320",spec:{name:"Airbus A320",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:42600,mtow:78e3,maxFuel:19150,vSpeeds:{v1:132,vr:138,v2:145,vref:130,vfe:230,vne:350}}},{match:"a330",spec:{name:"Airbus A330-300",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:124500,mtow:242e3,maxFuel:78e3,vSpeeds:{v1:138,vr:146,v2:154,vref:136,vfe:225,vne:330}}},{match:"a340",spec:{name:"Airbus A340-600",category:"airliner-quad",engineCount:4,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:177800,mtow:38e4,maxFuel:155e3,vSpeeds:{v1:150,vr:158,v2:168,vref:144,vfe:230,vne:330}}},{match:"737 max",spec:{name:"Boeing 737 MAX 8",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:45070,mtow:82190,maxFuel:20730,vSpeeds:{v1:136,vr:142,v2:149,vref:135,vfe:230,vne:340}}},{match:"737",spec:{name:"Boeing 737-800",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:41413,mtow:79015,maxFuel:20894,vSpeeds:{v1:135,vr:141,v2:148,vref:134,vfe:230,vne:340}}},{match:"757",spec:{name:"Boeing 757-200",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:57840,mtow:115680,maxFuel:34700,vSpeeds:{v1:138,vr:144,v2:152,vref:132,vfe:235,vne:350}}},{match:"767",spec:{name:"Boeing 767-300ER",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:90010,mtow:186880,maxFuel:73e3,vSpeeds:{v1:142,vr:149,v2:157,vref:138,vfe:235,vne:360}}},{match:"atr 72",spec:{name:"ATR 72-600",category:"turboprop",engineCount:2,maxFlaps:4,hasGear:!0,hasSpoilers:!1,oew:13500,mtow:23e3,maxFuel:5e3,vSpeeds:{v1:98,vr:103,v2:112,vref:106,vfe:175,vne:250}}},{match:"q400",spec:{name:"Dash 8 Q400",category:"turboprop",engineCount:2,maxFlaps:4,hasGear:!0,hasSpoilers:!1,oew:17819,mtow:29574,maxFuel:5318,vSpeeds:{v1:105,vr:110,v2:118,vref:112,vfe:180,vne:285}}},{match:"king air",spec:{name:"Beechcraft King Air 350i",category:"turboprop",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!1,oew:4513,mtow:6804,maxFuel:1640,vSpeeds:{v1:96,vr:100,v2:108,vref:102,vfe:170,vne:263}}},{match:"f-16",spec:{name:"F-16C Fighting Falcon",category:"fighter",engineCount:1,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:8570,mtow:19200,maxFuel:3200,vSpeeds:{vr:140,vref:148,vne:800}}},{match:"f-22",spec:{name:"F-22A Raptor",category:"fighter",engineCount:2,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:19700,mtow:38e3,maxFuel:8200,vSpeeds:{vr:135,vref:140,vne:800}}},{match:"f-35",spec:{name:"F-35A Lightning II",category:"fighter",engineCount:1,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:13290,mtow:31750,maxFuel:8278,vSpeeds:{vr:138,vref:145,vne:750}}},{match:"typhoon",spec:{name:"Eurofighter Typhoon",category:"fighter",engineCount:2,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:11e3,mtow:23500,maxFuel:4500,vSpeeds:{vr:130,vref:136,vne:800}}},{match:"sr-71",spec:{name:"Lockheed SR-71 Blackbird",category:"supersonic",engineCount:2,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:30600,mtow:78e3,maxFuel:46180,vSpeeds:{v1:170,vr:210,v2:235,vref:175,vne:1900}}},{match:"zlin",spec:{name:"Zlin Z-50",category:"ga-piston",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:570,mtow:840,maxFuel:45,vSpeeds:{vr:55,vref:65,vne:190}}},{match:"r44",spec:{name:"Robinson R44",category:"rotorcraft",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:657,mtow:1134,maxFuel:140,vSpeeds:{vref:55,vne:130}}},{match:"bell 407",spec:{name:"Bell 407",category:"rotorcraft",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:1210,mtow:2268,maxFuel:390,vSpeeds:{vref:60,vne:140}}},{match:"uh-60",spec:{name:"Sikorsky UH-60 Black Hawk",category:"rotorcraft",engineCount:2,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:4819,mtow:9979,maxFuel:1100,vSpeeds:{vref:65,vne:159}}}];function nt(r){if(r==null)return null;let e=String(r).trim().match(/^(?:geofs\s*)?(?:v)?(\d+)(?:[.\-_\sa-z].*)?$/i);if(!e)return null;let t=Number(e[1]);return t===3||t===4?t:null}function ci(r,e,t,i){let n=r.toLowerCase();return/\b(?:helicopter|rotorcraft|robinson|alouette|ec135|h145|r[- ]?(?:22|44|66)|uh[- ]?60|mi[- ]?8|bo[- ]?105|bell[ -]?(?:206|407)|black hawk|chinook|apache|ch[- ]?47|ah[- ]?64)\b/.test(n)?"rotorcraft":n.includes("concorde")||n.includes("xb-70")||n.includes("tu-144")||n.includes("sr-71")?"supersonic":n.includes("shuttle")||n.includes("falcon 9")||n.includes("x-15")?"specialized":n.includes("f-18")||n.includes("f/a-18")||n.includes("f-35")||n.includes("su-35")||n.includes("rafale")||n.includes("f-16")||n.includes("f-22")||n.includes("yf-23")||n.includes("t-38")||n.includes("typhoon")||n.includes("gripen")||n.includes("f-15")?"fighter":n.includes("atr")||n.includes("dash")||n.includes("q400")||n.includes("king air")||n.includes("pc-12")?"turboprop":t>=4&&e>8e4?"airliner-quad":e>15e3||i>25e3?"airliner-twin":"ga-piston"}var he=class{lastAcRef;lastDefinition;cachedProfile=null;overrides={};setAircraftOverrides(e){this.overrides=e??{},this.cachedProfile=null}getMajorVersion(){return nt(window.geofs?.version)}isNight(){let e=window.geofs?.animation?.values?.night;if(typeof e=="boolean")return e;if(typeof e=="number"&&Number.isFinite(e))return e>0;let t=window.weather?.localTime;if(typeof t=="number"&&Number.isFinite(t)){let n=(t%24+24)%24;return n<6||n>=19}let i=window.geofs?.environment;if(i&&typeof i.sunElevation=="number")return i.sunElevation<-.02;if(i&&typeof i.time=="number"){let n=(i.time%24+24)%24;return n<6||n>=19}return!1}getLitRunways(){return window.geofs?.fx?.litRunways??null}getNearRunways(){return window.geofs?.runways?.nearRunways??null}getCesiumScene(){return window.geofs?.api?.viewer?.scene??null}getAircraftProfile(){let e=window.geofs?.aircraft?.instance,t=e?.id??e?.aircraftRecord?.id;if(!e||t==null)return this.lastAcRef=void 0,this.cachedProfile=null,null;if(e===this.lastAcRef&&e.definition===this.lastDefinition&&this.cachedProfile?.id===String(t))return this.cachedProfile;let i=String(t),n=e.definition||{},s=window.geofs?.aircraftList?.[i]||e.aircraftRecord,a=String(s?.name||n.externalName||n.name||e.name||`Aircraft ${i}`),o=Object.hasOwn(Ct,i)?Ct[i]:void 0,l=o??di.find(g=>a.toLowerCase().includes(g.match))?.spec,d=Array.isArray(e.engines)&&e.engines.length>0?e.engines.length:l?.engineCount??1,c;if(l)c={id:i,...l,vSpeeds:void 0,name:o?l.name:a,engineCount:d,isDynamic:!o};else{let g=Number(n.mass||e.setup?.mass||1200),b=Number.isFinite(g)&&g>0?g:1200,x=Number(n.maxThrust),T=Number.isFinite(x)&&x>=0?x:0,A=n.hasGear!==void 0?!!n.hasGear:!!n.gearPositions?.length||e.parts?.gear!==void 0,w=n.hasAirbrakes!==void 0?!!n.hasAirbrakes:e.parts?.airbrakes!==void 0||e.parts?.spoilers!==void 0,C=n.flapsSteps??(n.flapsPositions?Math.max(0,n.flapsPositions.length-1):0),m=ci(a,b,d,T);c={id:i,name:a,category:m,engineCount:d,maxFlaps:C,hasGear:A,hasSpoilers:w,oew:Math.round(b*.55),mtow:Math.round(b*1.25),maxFuel:Math.round(b*.35),isDynamic:!0}}let u={},p={},f=e.definition?.Vspeeds;for(let g of it){let b=f?.[g.toUpperCase()]??f?.[g];if(b===void 0&&!f){let x=l?.vSpeeds[g.toLowerCase()];x!==void 0&&(u[g]=x)}typeof b!="number"||!Number.isFinite(b)||b<=0||(b<10?p[g]=b:u[g]=b)}let h=[i,a.toLowerCase(),c.name.toLowerCase()].map(g=>Object.hasOwn(this.overrides,g)?this.overrides[g]:void 0).find(Boolean);return c={...c,...h,vSpeeds:{...u,...h?.vSpeeds},machSpeeds:p},this.lastAcRef=e,this.lastDefinition=e.definition,this.cachedProfile=c,c}getThrottles(){let e=window.controls,t=window.geofs?.aircraft?.instance;if(!e)return[0];let i=Array.isArray(t?.engines)?t.engines.length:1;if(i>=2){let n=[];for(let s=1;s<=Math.min(i,4);s++){let a=e[`throttle${s}`];typeof a=="number"&&Number.isFinite(a)&&n.push(a)}if(n.length===i)return n;if(typeof e.throttleLeft=="number"&&Number.isFinite(e.throttleLeft)&&typeof e.throttleRight=="number"&&Number.isFinite(e.throttleRight))return[e.throttleLeft,e.throttleRight]}return[typeof e.throttle=="number"&&Number.isFinite(e.throttle)?e.throttle:0]}setThrottle(e){if(typeof e!="number"||!Number.isFinite(e))return;let t=window.controls;if(!t)return;let i=Math.max(-1,Math.min(1,e));typeof t.manipulatorSetters?.setThrottle=="function"?t.manipulatorSetters.setThrottle(i):t.throttle=i,t.throttleLeft!==void 0&&(t.throttleLeft=i),t.throttleRight!==void 0&&(t.throttleRight=i),t.throttle1!==void 0&&(t.throttle1=i),t.throttle2!==void 0&&(t.throttle2=i),t.throttle3!==void 0&&(t.throttle3=i),t.throttle4!==void 0&&(t.throttle4=i)}stopEngines(){let e=window.geofs?.aircraft?.instance;if(typeof e?.stopEngines=="function")e.stopEngines();else if(typeof e?.stopEngine=="function")e.stopEngine();else return!1;return!0}setFlaps(e){if(!Number.isFinite(e))return;let t=window.geofs?.aircraft?.instance,i=window.controls;i?.flaps&&typeof i.setters?.setFlaps?.set=="function"?(i.flaps.target=e,i.setters.setFlaps.set()):typeof t?.setFlaps=="function"&&t.setFlaps(e)}toggleGear(){window.controls?.setters?.setGear?.set?.()}isCrashed(e,t){if(e?.crashed||window.geofs?.crashed||t?.crashed||e?.animationValue?.crashed)return!0;if(typeof document<"u"&&typeof document.querySelector=="function"){let n=document.querySelector(".geofs-crash, .geofs-crash-overlay");if(n instanceof HTMLElement){let s=typeof getComputedStyle=="function"?getComputedStyle(n):null;if(s?s.display!=="none"&&s.visibility!=="hidden":n.offsetParent!==null)return!0}}return!1}buildTelemetrySnapshot(e,t){let i=window.geofs?.animation?.values||{},n=window.geofs?.aircraft?.instance,s=n?.llaLocation||[0,0,0],a=this.getAircraftProfile(),o=a?.category==="rotorcraft",l=window.controls?.throttle,d=i.rotorTorque??i.torque,c=(u,p=0)=>typeof u=="number"&&Number.isFinite(u)?u:p;return Object.freeze({timestamp:Date.now(),dt:c(e,.016),simMajor:t,paused:!!window.geofs?.isPaused?.(),isNight:this.isNight(),aircraft:a,kias:c(i.kias,0),mach:c(i.mach,0),altitude:c(i.altitude,0),aglFeet:c(i.haglFeet,0),vs:c(i.verticalSpeed,0),heading:c(i.heading360,0),groundSpeed:c(i.groundSpeedKnt,c(i.groundSpeed,0)),gForce:c(i.loadFactor,1),aoa:c(i.aoa,0),pitch:c(i.atilt,c(i.pitch,0)),roll:c(i.aroll,c(i.roll,0)),groundContact:!!n?.groundContact,crashed:this.isCrashed(n,i),autopilotOn:!!window.geofs?.autopilot?.on,reverserActive:!!(i.reverser||window.controls?.reversers),throttles:this.getThrottles(),collective:o&&typeof l=="number"&&Number.isFinite(l)?Math.min(1,Math.max(0,l)):null,rotorTorque:o&&typeof d=="number"&&Number.isFinite(d)?d:null,parkingBrake:!!i.parkingBrake,gearDown:c(i.gearPosition,0)<.5,flapsTarget:c(i.flapsTarget,0),airbrakesPosition:Number.isFinite(i.airbrakesPosition)?Number(i.airbrakesPosition):void 0,glideslopeDeviation:i.NAVVNAV&&Number.isFinite(i.NAVGlideAngleDeviation)?Number(i.NAVGlideAngleDeviation):void 0,lightsOn:!!i.lights,lat:c(s[0],0),lon:c(s[1],0)})}};var fe=class{constructor(e,t){this.sim=e;this.simMajor=t}listeners=new Set;rafId=null;lastTickMs=0;lastSnapshot=null;start(){if(this.rafId!==null)return;this.lastTickMs=performance.now();let e=t=>{let i=Math.max(.001,Math.min((t-this.lastTickMs)/1e3,.25));this.lastTickMs=t;let n=this.sim.buildTelemetrySnapshot(i,this.simMajor);this.lastSnapshot=n;for(let s of this.listeners)try{s(n)}catch(a){console.error("[GeoFS Extension] Telemetry subscriber error:",a)}this.rafId=requestAnimationFrame(e)};this.rafId=requestAnimationFrame(e)}stop(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null)}subscribe(e){return this.listeners.add(e),()=>{this.listeners.delete(e)}}getLatest(){return this.lastSnapshot}};var ge=class{ctx=null;muted=!1;ensureContext(){if(this.muted||typeof window>"u")return null;let e=window.AudioContext||window.webkitAudioContext;return e?(this.ctx||(this.ctx=new e),this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{}),this.ctx):null}setMuted(e){this.muted=e}playTone(e,t,i="sine",n=.08){let s=this.ensureContext();if(!s)return;let a=s.createOscillator(),o=s.createGain();a.type=i,a.frequency.setValueAtTime(e,s.currentTime),o.gain.setValueAtTime(1e-4,s.currentTime),o.gain.exponentialRampToValueAtTime(n,s.currentTime+.015),o.gain.exponentialRampToValueAtTime(1e-4,s.currentTime+t),a.connect(o),o.connect(s.destination),a.start(),a.stop(s.currentTime+t+.02)}playChime(){this.playTone(880,.14,"sine",.07),setTimeout(()=>this.playTone(1174.66,.2,"sine",.06),110)}playGpwsAlert(){this.playTone(440,.12,"square",.06),setTimeout(()=>this.playTone(620,.14,"square",.06),130)}playGpwsCallout(e){if(!this.muted)if(e==="PULL_UP")this.playGpwsAlert();else if(e==="RETARD")this.playTone(523.25,.1,"triangle",.06),setTimeout(()=>this.playTone(392,.14,"triangle",.06),110);else{let t={50:784,40:740,30:698,20:659,10:587};this.playTone(t[e],.09,"sine",.05)}}destroy(){this.ctx&&(this.ctx.close().catch(()=>{}),this.ctx=null)}};function st(){if(typeof navigator>"u")return"windows";let r=(navigator.platform||navigator.userAgent||"").toLowerCase();return r.includes("mac")?"mac":r.includes("linux")?"linux":"windows"}function rt(r){return r?r.replace(/⌘/g,"Cmd+").replace(/⌃/g,"Ctrl+").replace(/⌥/g,"Alt+").replace(/⇧/g,"Shift+").split("+").map(e=>e.trim()).filter(Boolean).map((e,t,i)=>{if(t<i.length-1){let n=e.toLowerCase();if(n==="shift")return"Shift";if(n==="ctrl"||n==="control")return"Ctrl";if(n==="alt"||n==="option")return"Alt";if(n==="cmd"||n==="meta")return"Cmd"}return e.length===1?e.toUpperCase():e}).join("+"):""}function ui(r){return r?r.startsWith("Key")&&r.length===4?r.slice(3).toLowerCase():r.startsWith("Digit")&&r.length===6?r.slice(5):r.toLowerCase():""}function ot(r){let e=r.code||"";if(e==="ShiftLeft"||e==="ShiftRight"||e==="ControlLeft"||e==="ControlRight"||e==="AltLeft"||e==="AltRight"||e==="MetaLeft"||e==="MetaRight")return null;let t="";if(e.startsWith("Key")&&e.length===4?t=e.slice(3).toUpperCase():e.startsWith("Digit")&&e.length===6?t=e.slice(5):e?t=e:r.key&&(t=r.key.length===1?r.key.toUpperCase():r.key),!t)return null;let i=[];return r.metaKey&&i.push("Cmd"),r.ctrlKey&&i.push("Ctrl"),r.altKey&&i.push("Alt"),r.shiftKey&&i.push("Shift"),[...i,t].join("+")}function pi(r,e){let t=rt(e);if(!t)return!1;let i=t.split("+").map(c=>c.trim().toLowerCase()),n=i[i.length-1],s=i.includes("shift"),a=i.includes("ctrl"),o=i.includes("alt"),l=i.includes("cmd")||i.includes("meta");return(r.code&&ui(r.code)===n||typeof r.key=="string"&&r.key.toLowerCase()===n)&&r.shiftKey===s&&r.ctrlKey===a&&r.altKey===o&&r.metaKey===l}var me=class{os=st();bindings=new Map;consumedCodes=new Set;listening=!1;onKeyDown=e=>{if(e.repeat||e.defaultPrevented)return;let t=e.target;if(!(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable))){for(let i of this.bindings.values())if(pi(e,i.combo)){e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),e.code&&this.consumedCodes.add(e.code),i.handler();return}}};onKeyPressOrUp=e=>{!e.code||!this.consumedCodes.has(e.code)||(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),e.type==="keyup"&&this.consumedCodes.delete(e.code))};start(){this.listening||typeof window>"u"||(window.addEventListener("keydown",this.onKeyDown,{capture:!0}),window.addEventListener("keypress",this.onKeyPressOrUp,{capture:!0}),window.addEventListener("keyup",this.onKeyPressOrUp,{capture:!0}),this.listening=!0)}register(e,t,i){return this.bindings.set(e,{combo:t,handler:i}),()=>this.bindings.delete(e)}updateCombo(e,t){let i=this.bindings.get(e);i&&(i.combo=t)}destroy(){this.listening&&typeof window<"u"&&(window.removeEventListener("keydown",this.onKeyDown,{capture:!0}),window.removeEventListener("keypress",this.onKeyPressOrUp,{capture:!0}),window.removeEventListener("keyup",this.onKeyPressOrUp,{capture:!0}),this.listening=!1),this.consumedCodes.clear(),this.bindings.clear()}};var hi={PageUp:{key:"PageUp",code:"PageUp",keyCode:33},PageDown:{key:"PageDown",code:"PageDown",keyCode:34},End:{key:"End",code:"End",keyCode:35},Home:{key:"Home",code:"Home",keyCode:36},Insert:{key:"Insert",code:"Insert",keyCode:45},Delete:{key:"Delete",code:"Delete",keyCode:46},Numpad0:{key:"0",code:"Numpad0",keyCode:96,location:3},Numpad1:{key:"1",code:"Numpad1",keyCode:97,location:3},Numpad2:{key:"2",code:"Numpad2",keyCode:98,location:3},Numpad3:{key:"3",code:"Numpad3",keyCode:99,location:3},Numpad4:{key:"4",code:"Numpad4",keyCode:100,location:3},Numpad5:{key:"5",code:"Numpad5",keyCode:101,location:3},Numpad6:{key:"6",code:"Numpad6",keyCode:102,location:3},Numpad7:{key:"7",code:"Numpad7",keyCode:103,location:3},Numpad8:{key:"8",code:"Numpad8",keyCode:104,location:3},Numpad9:{key:"9",code:"Numpad9",keyCode:105,location:3}},fi={"Alt+ArrowUp":"PageUp","Alt+ArrowDown":"PageDown","Alt+Backspace":"Delete","Alt+ArrowLeft":"Home","Alt+ArrowRight":"End","Alt+1":"Numpad1","Alt+2":"Numpad2","Alt+3":"Numpad3","Alt+4":"Numpad4","Alt+5":"Numpad5","Alt+6":"Numpad6","Alt+7":"Numpad7","Alt+8":"Numpad8","Alt+9":"Numpad9","Alt+0":"Numpad0"},gi={};function mi(r){return r==="auto"?st():r}function bi(r,e,t={}){let n=mi(r)==="mac"?e==="magic"?{...gi}:{...fi}:{};for(let[s,a]of Object.entries(t)){let o=rt(s);o&&a?n[o]=a:o&&a===""&&delete n[o]}return n}var be=class{enabled=!0;remaps={};listening=!1;activeTranslations=new Map;dispatchSynthetic(e,t,i=!1){if(typeof document>"u")return;let n={key:t.key,code:t.code,location:t.location??0,repeat:i,bubbles:!0,cancelable:!0,keyCode:t.keyCode,which:t.keyCode},s=new KeyboardEvent(e,n);document.dispatchEvent(s)}onKeyDown=e=>{if(!this.enabled||!e.isTrusted)return;let t=e.target;if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable))return;let i=ot(e);if(!i)return;let n=this.remaps[i];if(!n)return;let s=hi[n]??{key:n,code:n,keyCode:0};e.preventDefault(),e.stopImmediatePropagation();let a=e.code||i;this.activeTranslations.set(a,s),this.dispatchSynthetic("keydown",s,e.repeat)};onKeyUp=e=>{if(!e.isTrusted)return;let t=e.code||ot(e)||"",i=this.activeTranslations.get(t);i&&(this.activeTranslations.delete(t),e.preventDefault(),e.stopImmediatePropagation(),this.dispatchSynthetic("keyup",i,!1))};updateConfig(e){this.enabled=e.enabled,this.remaps=bi(e.osProfile,e.macKeyboardType,e.customRemaps),this.enabled||this.releaseAllActive()}releaseAllActive(){for(let e of this.activeTranslations.values())this.dispatchSynthetic("keyup",e,!1);this.activeTranslations.clear()}start(){this.listening||typeof window>"u"||(window.addEventListener("keydown",this.onKeyDown,{capture:!0}),window.addEventListener("keyup",this.onKeyUp,{capture:!0}),this.listening=!0)}destroy(){this.releaseAllActive(),this.listening&&typeof window<"u"&&(window.removeEventListener("keydown",this.onKeyDown,{capture:!0}),window.removeEventListener("keyup",this.onKeyUp,{capture:!0}),this.listening=!1)}};var Mt={"1080p":1,"1440p":1.1,"4k":1.35,ultrawide:1.08,laptop:.9},vi={"1080p":"1080p FHD","1440p":"1440p QHD","4k":"4K UHD",ultrawide:"Ultrawide",laptop:"Laptop"};function xi(r=typeof window<"u"?window:void 0){let e=Math.max(0,Number(r?.screen?.width??r?.innerWidth??1920)||1920),t=Math.max(0,Number(r?.screen?.height??r?.innerHeight??1080)||1080),i=Math.max(1,Number(r?.devicePixelRatio??1)||1),n=Math.round(e*i),s=Math.round(t*i),a=t>0?e/t:16/9,o=!!r?.screen?.isExtended,l="1080p";a>=2.05?l="ultrawide":e>=3e3||n>=3600&&i<=1.5?l="4k":e>=2200||n>=2500&&i<=1.5?l="1440p":(e<1200||e<=1536&&i>=1.5)&&(l="laptop");let d=o||e>=1920&&i<=1.5||l==="ultrawide"||l==="4k",c=Mt[l],u=l==="laptop"?"Laptop":d?"External / Desktop":"Desktop";return{preset:l,scale:c,label:`${vi[l]} (${u})`,resolution:`${e}\xD7${t}${i>1?` @${Number(i.toFixed(2))}x`:""}`,dpr:i,isExternalLike:d}}function kt(r){let e=xi();return r==="auto"?{preset:e.preset,scale:e.scale,detected:e}:{preset:r,scale:Mt[r]??1,detected:e}}var le=["info","checks","fuel","land"],Ft="geofs_ext_hud_tabs_state",ve=class{styleEl=null;hudRoot=null;hudTabsEl=null;hudBodyEl=null;hudMenuEl=null;edgeHandleEl=null;minBtnEl=null;tabPanels=new Map;detachedPanels=new Map;hudState={order:[...le],closed:[],pinned:[],detached:[],dockPreset:"top-right"};hudMenuOpen=!1;draggingTabId=null;savedActiveTabId=null;activeTabId=null;currentTheme="dark";currentPreset="auto";mountedControls=new Map;syncedAutopilotPads=new Map;dragCleanups=new Set;trackedElements=new Set;resizeObserver=null;resizeListener=null;hudMinimized=!1;hudHidden=!1;nextZIndex=2147483006;bringToFront(e){e&&(this.nextZIndex>=2147483500&&(this.nextZIndex=2147483010),e.style.zIndex=String(this.nextZIndex++))}init(){typeof document>"u"||(this.loadHudState(),this.injectStyles(),this.setupViewportGuards(),this.ensureHud())}setTheme(e){this.currentTheme=e,typeof document<"u"&&document.documentElement.setAttribute("data-geofs-ext-theme",e)}setCalibratorPreset(e){this.currentPreset=e;let{scale:t}=kt(e);typeof document<"u"&&document.documentElement.style.setProperty("--geofs-ext-scale",String(t))}mountControl(e,t,i){return this.unmountControl(e),i.dataset.geofsExtControl=e,this.resolveZoneHost(t).appendChild(i),this.mountedControls.set(e,i),()=>this.unmountControl(e)}unmountControl(e){let t=this.mountedControls.get(e);if(t){this.syncedAutopilotPads.delete(t);for(let[i,n]of this.syncedAutopilotPads)(n.wrapper===t||t.contains(i))&&this.syncedAutopilotPads.delete(i);t.remove(),this.mountedControls.delete(e)}}syncAutopilotPad(e,t,i=!1){if(typeof document>"u"||typeof window>"u"||!e.isConnected)return;let n=Date.now(),s=this.syncedAutopilotPads.get(e);if(!i&&s&&n-s.lastCheckMs<1e3)return;let o=(e.closest(".geofs-autopilot-bar")??document.querySelector(".geofs-autopilot-bar"))?.querySelector(".geofs-autopilot-pad:not(#autothrottle-button):not(#opEngineBarBtn)")??null;if(!o){this.syncedAutopilotPads.set(e,{wrapper:t,sig:"",lastCheckMs:n});return}let l=o.getBoundingClientRect();if(l.width<=0||l.height<=0){this.syncedAutopilotPads.set(e,{wrapper:t,sig:s?.sig??"",lastCheckMs:n});return}let d=getComputedStyle(o),c=o.querySelector(".control-pad-label")??o,u=getComputedStyle(c),p=g=>`${Number(g.toFixed(2))}px`,f=[["--geofs-ext-ap-width",p(l.width)],["--geofs-ext-ap-height",p(l.height)],["--geofs-ext-ap-radius",d.borderRadius||"15px"],["--geofs-ext-ap-margin",d.margin||"0 10px"],["--geofs-ext-ap-valign",d.verticalAlign||"middle"],["--geofs-ext-ap-font-family",u.fontFamily||"inherit"],["--geofs-ext-ap-font-size",u.fontSize||"12px"],["--geofs-ext-ap-font-weight",u.fontWeight||"400"],["--geofs-ext-ap-letter-spacing",u.letterSpacing||"normal"]],h=f.map(([,g])=>g).join("|");if(this.syncedAutopilotPads.set(e,{wrapper:t,sig:h,lastCheckMs:n}),s?.sig!==h){for(let[g,b]of f)e.style.setProperty(g,b);t&&t.style.setProperty("--geofs-ext-ap-valign",d.verticalAlign||"middle")}}registerHudTab(e,t,i,n=!1,s){this.ensureHud();let a=!!s?.defaultClosed;return this.tabPanels.set(e,{label:t,el:i,defaultClosed:a}),this.hudState.order.includes(e)||(this.hudState.order.push(e),a&&!this.hudState.closed.includes(e)&&!this.hudState.detached.includes(e)&&this.hudState.closed.push(e)),this.hudState.detached.includes(e)?this.mountDetachedPanel(e):this.hudState.closed.includes(e)||(this.savedActiveTabId===e?(this.savedActiveTabId=null,this.selectTab(e)):(n&&!this.savedActiveTabId||!this.activeTabId)&&this.selectTab(e)),this.renderTabs(),this.renderHudMenu(),this.clampAll(),()=>{if(this.unmountDetachedPanel(e),this.tabPanels.delete(e),this.activeTabId===e){let o=this.visibleDockedEntries();this.activeTabId=o[0]?.[0]??null}this.renderTabs(),this.renderHudMenu(),this.activeTabId?this.selectTab(this.activeTabId):this.hudBodyEl&&(this.hudBodyEl.innerHTML="")}}openHudTab(e){if(this.ensureHud(),!(!this.hudRoot||!this.tabPanels.has(e))){if(this.hudState.detached.includes(e)){let t=this.detachedPanels.get(e)?.el;if(t){t.style.display="flex",this.bringToFront(t),this.clampElementToViewport(t);return}this.hudState.detached=this.hudState.detached.filter(i=>i!==e)}this.hudState.closed=this.hudState.closed.filter(t=>t!==e),this.saveHudState(),this.hudHidden=!1,this.hudRoot.style.display="flex",this.hudMinimized&&this.setHudMinimized(!1),this.selectTab(e),this.bringToFront(this.hudRoot),this.syncEdgeHandle(),this.clampElementToViewport(this.hudRoot),this.renderHudMenu()}}closeHudTab(e){if(!this.tabPanels.has(e)||this.hudState.pinned.includes(e))return;if(this.hudState.detached.includes(e)){this.unmountDetachedPanel(e),this.hudState.detached=this.hudState.detached.filter(i=>i!==e),this.hudState.closed.includes(e)||this.hudState.closed.push(e),this.saveHudState(),this.renderTabs(),this.renderHudMenu();return}let t=this.visibleDockedEntries();if(!(t.length<=1&&t[0]?.[0]===e)){if(this.hudState.closed.includes(e)||this.hudState.closed.push(e),this.activeTabId===e){let i=this.visibleDockedEntries()[0]?.[0]??null;this.activeTabId=i}this.saveHudState(),this.renderTabs(),this.activeTabId?this.selectTab(this.activeTabId):this.hudBodyEl&&(this.hudBodyEl.innerHTML=""),this.renderHudMenu()}}pinHudTab(e,t){if(!this.tabPanels.has(e))return;let i=this.hudState.pinned.includes(e),n=t??!i;n&&!i?(this.hudState.pinned.push(e),this.hudState.closed=this.hudState.closed.filter(s=>s!==e)):!n&&i&&(this.hudState.pinned=this.hudState.pinned.filter(s=>s!==e)),this.saveHudState(),this.renderTabs(),this.renderHudMenu()}detachHudTab(e){if(this.tabPanels.has(e)){if(this.hudState.closed=this.hudState.closed.filter(t=>t!==e),this.hudState.detached.includes(e)||this.hudState.detached.push(e),this.activeTabId===e){let t=this.visibleDockedEntries().find(([i])=>i!==e)?.[0]??null;this.activeTabId=t}this.saveHudState(),this.mountDetachedPanel(e),this.renderTabs(),this.activeTabId?this.selectTab(this.activeTabId):this.hudBodyEl&&(this.hudBodyEl.innerHTML=""),this.renderHudMenu()}}redockHudTab(e){this.tabPanels.has(e)&&(this.unmountDetachedPanel(e),this.hudState.detached=this.hudState.detached.filter(t=>t!==e),this.hudState.closed=this.hudState.closed.filter(t=>t!==e),this.saveHudState(),this.openHudTab(e))}reorderHudTab(e,t){if(e===t||!this.tabPanels.has(e)||!this.tabPanels.has(t))return;let i=[...this.hudState.order];i.includes(e)||i.push(e),i.includes(t)||i.push(t);let n=i.indexOf(e),s=i.indexOf(t);n<0||s<0||(i.splice(n,1),i.splice(s,0,e),this.hudState.order=i,this.saveHudState(),this.renderTabs(),this.renderHudMenu())}setHudDockPreset(e){this.hudState.dockPreset=e,this.saveHudState();try{localStorage.removeItem("geofs_ext_hud_pos")}catch{}this.hudRoot&&(this.applyDockPresetStyles(this.hudRoot,e),this.syncEdgeHandle(),this.clampElementToViewport(this.hudRoot)),this.renderHudMenu()}resetHudLayout(){for(let i of Array.from(this.detachedPanels.keys()))this.unmountDetachedPanel(i);let e=[];for(let[i,n]of this.tabPanels.entries())n.defaultClosed&&e.push(i);this.hudState={order:[...le,...Array.from(this.tabPanels.keys()).filter(i=>!le.includes(i))],closed:e,pinned:[],detached:[],dockPreset:"top-right"},this.saveHudState();try{localStorage.removeItem("geofs_ext_hud_pos")}catch{}this.hudRoot&&this.applyDockPresetStyles(this.hudRoot,"top-right");let t=this.visibleDockedEntries()[0]?.[0]??null;this.activeTabId=t,this.renderTabs(),t&&this.selectTab(t),this.renderHudMenu()}getHudTabsState(){return{order:[...this.hudState.order],closed:[...this.hudState.closed],pinned:[...this.hudState.pinned],detached:[...this.hudState.detached],dockPreset:this.hudState.dockPreset,activeTabId:this.activeTabId}}toggleHudVisibility(){if(this.ensureHud(),!this.hudRoot)return!1;let e=Number.parseFloat(this.hudRoot.style.left||""),t=this.hudMinimized&&Number.isFinite(e)&&e<=16;return this.hudHidden||t?(this.hudHidden=!1,this.setHudMinimized(!1),this.syncEdgeHandle(),this.bringToFront(this.hudRoot),this.clampElementToViewport(this.hudRoot),!0):(this.hudHidden=!0,this.syncEdgeHandle(),this.saveHudState(),!1)}showToast(e,t="info"){if(typeof document>"u"||!document.body)return;let i=this.ensureToastRegion(),n=document.createElement("div");n.className=`geofs-ext-toast geofs-ext-toast--${t}`,n.textContent=e,i.appendChild(n),setTimeout(()=>{n.remove(),i&&!i.childElementCount&&i.remove()},t==="critical"?8500:4500)}showPromptBanner(e,t,i,n=2e4){if(typeof document>"u"||!document.body)return()=>{};let s=this.ensureToastRegion();s.querySelector(`[data-prompt-id="${e}"]`)?.remove();let o=document.createElement("div");o.className="geofs-ext-prompt",o.dataset.promptId=e,o.setAttribute("role","alertdialog");let l=document.createElement("div");l.className="geofs-ext-prompt-text",l.textContent=t;let d=document.createElement("div");d.className="geofs-ext-prompt-actions";let c,u=()=>{clearTimeout(c),o.remove(),s.childElementCount||s.remove()};for(let p of i){let f=document.createElement("button");f.type="button",f.dataset.actionId=p.id,f.className=`geofs-ext-prompt-btn geofs-ext-prompt-btn--${p.variant??"neutral"}`,f.textContent=p.label,f.addEventListener("click",h=>{h.stopPropagation(),u(),p.onClick()}),d.appendChild(f)}return o.append(l,d),s.appendChild(o),n>0&&(c=setTimeout(u,n)),u}ensureToastRegion(){let e=document.getElementById("geofs-ext-toasts");return e||(e=document.createElement("div"),e.id="geofs-ext-toasts",e.setAttribute("aria-live","polite"),document.body.appendChild(e)),e}resolveZoneHost(e){let t={top:[".geofs-ui-top","#geofs-ui-top"],bottom:[".geofs-ui-bottom"],autopilot:[".geofs-autopilot-bar"],right:[".geofs-ui-right",".geofs-radio-stack"],corner:[]};for(let s of t[e]){let a=document.querySelector(s);if(a)return a}let i=`geofs-ext-zone-${e}`,n=document.getElementById(i);return n||(n=document.createElement("div"),n.id=i,n.className=`geofs-ext-zone geofs-ext-zone--${e}`,document.body.appendChild(n)),n}clampElementToViewport(e){if(typeof window>"u"||!e.isConnected||e.classList.contains("addonpack-card")&&!e.classList.contains("active"))return;let t=e.style;if(t.display==="none")return;let i=e.getBoundingClientRect();if(i.width<=0&&i.height<=0)return;let n=Math.max(0,window.innerWidth-i.width),s=Math.max(0,window.innerHeight-i.height);if(t.left&&t.left!=="auto"){let a=Number.parseFloat(t.left);if(Number.isFinite(a)){let o=Math.max(0,Math.min(a,n));o!==a&&(t.left=`${Math.round(o)}px`)}}else i.left<0&&(t.left="0px",t.right="auto");if(t.top&&t.top!=="auto"){let a=Number.parseFloat(t.top);if(Number.isFinite(a)){let o=Math.max(0,Math.min(a,s));o!==a&&(t.top=`${Math.round(o)}px`)}}else i.top<0&&(t.top="0px",t.bottom="auto")}clampAll(){for(let e of this.trackedElements)this.clampElementToViewport(e)}setupViewportGuards(){typeof window>"u"||(typeof ResizeObserver<"u"&&!this.resizeObserver&&(this.resizeObserver=new ResizeObserver(e=>{for(let t of e)this.clampElementToViewport(t.target)})),this.resizeListener||(this.resizeListener=()=>{this.currentPreset==="auto"&&this.setCalibratorPreset("auto"),this.clampAll();for(let[e,t]of Array.from(this.syncedAutopilotPads.entries())){if(!e.isConnected){this.syncedAutopilotPads.delete(e);continue}this.syncAutopilotPad(e,t.wrapper,!0)}},window.addEventListener("resize",this.resizeListener),typeof window.screen<"u"&&"onchange"in window.screen&&window.screen.addEventListener?.("change",this.resizeListener)))}makeDraggable(e,t,i,n){if(typeof document>"u"||typeof window>"u")return()=>{};let s=n?.axis??"both",a=!1,o=!1,l=0,d=0,c=0,u=0,p=0,f=0;this.trackedElements.add(e),this.resizeObserver?.observe(e);try{let m=localStorage.getItem(t);if(m){let{left:v,top:M}=JSON.parse(m),S=v?Number.parseFloat(v):NaN,E=M?Number.parseFloat(M):NaN;s==="vertical"?Number.isFinite(E)&&(e.style.left="0px",e.style.top=`${Math.max(0,E)}px`,e.style.bottom="auto",e.style.right="auto",this.clampElementToViewport(e)):Number.isFinite(S)&&Number.isFinite(E)&&(e.style.left=`${Math.max(0,S)}px`,e.style.top=`${Math.max(0,E)}px`,e.style.bottom="auto",e.style.right="auto",e.style.transformOrigin="top left",this.clampElementToViewport(e))}}catch{}let h=i??e,g=h===e&&e.tagName==="BUTTON",b=m=>{if(m.button!==0)return;delete e.dataset.justDragged;let v=m.target;if(!v?.closest("input, a, select, textarea, label, .geofs-ext-hud-menu, .geofs-ext-hud-add, .geofs-ext-tab-close")&&!v?.closest(".unified-tab")){if(v?.closest("button")){let M=!!v.closest(".geofs-ext-hud-header");if(!e.classList.contains("is-minimized")&&!g&&!M)return}m.preventDefault(),a=!0,o=!1,l=m.clientX,d=m.clientY}},x=m=>{if(!a)return;if(!o){if((s==="vertical"?Math.abs(m.clientY-d):Math.hypot(m.clientX-l,m.clientY-d))<4)return;o=!0,window.getSelection()?.removeAllRanges();let E=e.getBoundingClientRect();c=l-E.left,u=d-E.top,p=E.width||e.offsetWidth,f=E.height||e.offsetHeight,s==="vertical"?e.style.left="0px":(e.style.left=`${Math.round(E.left)}px`,e.style.transformOrigin="top left"),e.style.top=`${Math.round(E.top)}px`,e.style.bottom="auto",e.style.right="auto",e.classList.add("is-dragging"),document.documentElement.classList.add("geofs-ext-dragging")}let v=Math.max(0,window.innerHeight-f),M=Math.max(0,Math.min(m.clientY-u,v));if(s==="vertical")e.style.left="0px",e.style.top=`${Math.round(M)}px`;else{let S=Math.max(0,window.innerWidth-p),E=Math.max(0,Math.min(m.clientX-c,S));e.style.left=`${Math.round(E)}px`,e.style.top=`${Math.round(M)}px`}},T=()=>{if(a&&(a=!1,e.style.cursor="",e.classList.remove("is-dragging"),document.documentElement.classList.remove("geofs-ext-dragging"),o)){o=!1,e.dataset.justDragged="1",setTimeout(()=>{delete e.dataset.justDragged},0);try{let m=s==="vertical"?{top:e.style.top}:{left:e.style.left,top:e.style.top};localStorage.setItem(t,JSON.stringify(m))}catch{}e===this.hudRoot&&this.syncEdgeHandle()}},A=m=>{e.dataset.justDragged==="1"&&(m.preventDefault(),m.stopImmediatePropagation(),m.stopPropagation(),delete e.dataset.justDragged)},w=()=>{this.bringToFront(e)};h.addEventListener("mousedown",b),e.addEventListener("mousedown",w,!0),document.addEventListener("mousemove",x),document.addEventListener("mouseup",T),window.addEventListener("blur",T),e.addEventListener("click",A,!0);let C=()=>{a&&(a=!1,o=!1,e.style.cursor="",e.classList.remove("is-dragging"),document.documentElement.classList.remove("geofs-ext-dragging")),h.removeEventListener("mousedown",b),e.removeEventListener("mousedown",w,!0),document.removeEventListener("mousemove",x),document.removeEventListener("mouseup",T),window.removeEventListener("blur",T),e.removeEventListener("click",A,!0),this.resizeObserver?.unobserve(e),this.trackedElements.delete(e),this.dragCleanups.delete(C)};return this.dragCleanups.add(C),C}applyHudMinimizedState(e){if(!this.hudRoot||!this.hudTabsEl||!this.hudBodyEl||!this.minBtnEl)return;this.hudMinimized=e,this.hudRoot.classList.toggle("is-minimized",e),this.minBtnEl.textContent=e?"HUD":"\u2212";let t=e?"Restore HUD":"Minimize HUD";this.minBtnEl.setAttribute("aria-label",t),this.minBtnEl.dataset.hudTip=t,this.hudTabsEl.style.display=e?"none":"flex",this.hudBodyEl.style.display=e?"none":"block"}setHudMinimized(e){this.hudRoot&&(this.applyHudMinimizedState(e),this.syncEdgeHandle(),this.clampElementToViewport(this.hudRoot),this.saveHudState())}syncEdgeHandle(){if(!this.edgeHandleEl||!this.hudRoot)return;let e=Number.parseFloat(this.hudRoot.style.left||""),t=this.hudMinimized&&Number.isFinite(e)&&e<=16,i=this.hudHidden||t;if(this.edgeHandleEl.style.display=i?"flex":"none",this.hudRoot.style.display=i?"none":"flex",i){if(t&&this.hudRoot.style.top){this.edgeHandleEl.style.top=this.hudRoot.style.top,this.edgeHandleEl.style.bottom="auto";try{localStorage.setItem("geofs_ext_edge_tab_top",JSON.stringify({top:this.edgeHandleEl.style.top}))}catch{}}this.edgeHandleEl.style.left="0px",this.edgeHandleEl.style.right="auto",this.clampElementToViewport(this.edgeHandleEl)}}bindHudTip(e){let t=()=>{if(typeof window>"u")return;let i=e.getBoundingClientRect();e.dataset.tipV=i.bottom+32>window.innerHeight?"above":"below",i.right>window.innerWidth-110?e.dataset.tipH="right":i.left<110?e.dataset.tipH="left":e.dataset.tipH="center"};return e.addEventListener("mouseenter",t),e.addEventListener("focus",t),()=>{e.removeEventListener("mouseenter",t),e.removeEventListener("focus",t)}}setupEdgeTabInteraction(e){if(typeof document>"u"||typeof window>"u")return()=>{};let t=16,i=!1,n=!1,s=!1,a=0,o=0,l=0,d=0,c=40;this.trackedElements.add(e),this.resizeObserver?.observe(e);try{let b=localStorage.getItem("geofs_ext_edge_tab_top");if(b){let{top:x}=JSON.parse(b),T=x?Number.parseFloat(x):NaN;Number.isFinite(T)&&(e.style.left="0px",e.style.top=`${Math.max(0,T)}px`,e.style.bottom="auto",e.style.right="auto",this.clampElementToViewport(e))}}catch{}let u=b=>{if(b.button!==0)return;delete e.dataset.justDragged,i=!0,n=!1,s=!1,a=b.clientX,o=b.clientY;let x=e.getBoundingClientRect();l=b.clientX-x.left,d=b.clientY-x.top,c=x.height||e.offsetHeight||40},p=b=>{if(!i)return;if(!n){if(Math.hypot(b.clientX-a,b.clientY-o)<4)return;n=!0,window.getSelection()?.removeAllRanges(),e.classList.add("is-dragging"),document.documentElement.classList.add("geofs-ext-dragging")}let x=b.clientX-l,T=b.clientY-d;if(x>t&&this.hudRoot){s||(s=!0,this.hudHidden=!1,this.applyHudMinimizedState(!0),e.style.display="none",this.hudRoot.style.display="flex",this.hudRoot.style.right="auto",this.hudRoot.style.bottom="auto",this.hudRoot.style.transformOrigin="top left",this.hudRoot.classList.add("is-dragging"),this.bringToFront(this.hudRoot));let A=this.hudRoot.getBoundingClientRect(),w=A.width||40,C=A.height||40,m=Math.max(0,window.innerWidth-w),v=Math.max(0,window.innerHeight-C),M=Math.max(0,Math.min(x,m)),S=Math.max(0,Math.min(T,v));this.hudRoot.style.left=`${Math.round(M)}px`,this.hudRoot.style.top=`${Math.round(S)}px`}else{s&&this.hudRoot&&(s=!1,this.hudRoot.classList.remove("is-dragging"),this.hudRoot.style.display="none",e.style.display="flex");let A=Math.max(0,window.innerHeight-c),w=Math.max(0,Math.min(T,A));e.style.left="0px",e.style.right="auto",e.style.bottom="auto",e.style.top=`${Math.round(w)}px`}},f=()=>{if(i&&(i=!1,e.classList.remove("is-dragging"),this.hudRoot?.classList.remove("is-dragging"),document.documentElement.classList.remove("geofs-ext-dragging"),n))if(n=!1,e.dataset.justDragged="1",setTimeout(()=>{delete e.dataset.justDragged},0),s&&this.hudRoot){this.hudRoot.dataset.justDragged="1",setTimeout(()=>{this.hudRoot&&delete this.hudRoot.dataset.justDragged},0);try{localStorage.setItem("geofs_ext_hud_pos",JSON.stringify({left:this.hudRoot.style.left,top:this.hudRoot.style.top}))}catch{}}else{try{localStorage.setItem("geofs_ext_edge_tab_top",JSON.stringify({top:e.style.top}))}catch{}this.hudRoot&&(this.hudRoot.style.top=e.style.top)}},h=b=>{e.dataset.justDragged==="1"&&(b.preventDefault(),b.stopImmediatePropagation(),b.stopPropagation(),delete e.dataset.justDragged)};e.addEventListener("mousedown",u),document.addEventListener("mousemove",p),document.addEventListener("mouseup",f),window.addEventListener("blur",f),e.addEventListener("click",h,!0);let g=()=>{i&&(i=!1,n=!1,s=!1,e.classList.remove("is-dragging"),this.hudRoot?.classList.remove("is-dragging"),document.documentElement.classList.remove("geofs-ext-dragging")),e.removeEventListener("mousedown",u),document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",f),window.removeEventListener("blur",f),e.removeEventListener("click",h,!0),this.resizeObserver?.unobserve(e),this.trackedElements.delete(e),this.dragCleanups.delete(g)};return this.dragCleanups.add(g),g}ensureHud(){if(typeof document>"u"||this.hudRoot||!document.body)return;let e=document.getElementById("flightDataDisplay");e&&!e.classList.contains("geofs-ext-hud")&&e.remove();let t=document.getElementById("hudMinimizeBtn");t&&!t.classList.contains("unified-hud-edge-tab")&&t.remove();let i=document.createElement("div");i.id="flightDataDisplay",i.className="geofs-ext-hud";let n=document.createElement("div");n.className="geofs-ext-hud-header";let s=document.createElement("span");s.className="geofs-ext-hud-grip",s.dataset.hudTip="Drag HUD",s.setAttribute("aria-label","Drag HUD"),s.innerHTML='<svg width="6" height="12" viewBox="0 0 6 12" aria-hidden="true" focusable="false"><circle cx="1.5" cy="2" r="1"/><circle cx="4.5" cy="2" r="1"/><circle cx="1.5" cy="6" r="1"/><circle cx="4.5" cy="6" r="1"/><circle cx="1.5" cy="10" r="1"/><circle cx="4.5" cy="10" r="1"/></svg>';let a=document.createElement("div");a.id="hud-unified-tabs",a.className="unified-tabs";let o=document.createElement("button");o.type="button",o.className="geofs-ext-hud-min",o.dataset.hudTip="Minimize HUD",o.setAttribute("aria-label","Minimize HUD"),o.textContent="\u2212",o.addEventListener("click",u=>{u.stopPropagation(),i.dataset.justDragged!=="1"&&this.setHudMinimized(!this.hudMinimized)}),n.append(s,a,o);let l=document.createElement("div");l.className="geofs-ext-hud-body";let d=document.createElement("div");d.className="geofs-ext-hud-menu",d.style.display="none",i.append(n,d,l),document.body.appendChild(i);let c=document.createElement("button");c.id="hudMinimizeBtn",c.type="button",c.className="unified-hud-edge-tab",c.dataset.hudTip="Click to expand \xB7 Drag out for HUD circle",c.setAttribute("aria-label","Expand or drag Flight HUD"),c.textContent="\u25B8",c.style.display="none",c.addEventListener("click",()=>{c.dataset.justDragged!=="1"&&(c.style.top&&(i.style.top=c.style.top),this.hudHidden=!1,this.setHudMinimized(!1))}),document.body.appendChild(c),this.hudRoot=i,this.hudTabsEl=a,this.hudBodyEl=l,this.hudMenuEl=d,this.minBtnEl=o,this.edgeHandleEl=c,this.applyDockPresetStyles(i,this.hudState.dockPreset),this.makeDraggable(i,"geofs_ext_hud_pos"),this.setupEdgeTabInteraction(c),this.dragCleanups.add(this.bindHudTip(s)),this.dragCleanups.add(this.bindHudTip(o)),this.hudMinimized&&this.applyHudMinimizedState(!0),this.clampElementToViewport(i),this.syncEdgeHandle()}loadHudState(){try{let e=localStorage.getItem(Ft);if(!e)return;let t=JSON.parse(e),i=n=>n==="top-right"||n==="top-left"||n==="bottom-right"||n==="bottom-left";this.hudState={order:Array.isArray(t.order)?t.order.filter(n=>typeof n=="string"):[...le],closed:Array.isArray(t.closed)?t.closed.filter(n=>typeof n=="string"):[],pinned:Array.isArray(t.pinned)?t.pinned.filter(n=>typeof n=="string"):[],detached:Array.isArray(t.detached)?t.detached.filter(n=>typeof n=="string"):[],dockPreset:i(t.dockPreset)?t.dockPreset:"top-right"},this.savedActiveTabId=typeof t.activeTabId=="string"?t.activeTabId:null,this.hudMinimized=!!t.hudMinimized,this.hudHidden=!!t.hudHidden}catch{}}saveHudState(){try{let e={...this.hudState,activeTabId:this.activeTabId,hudMinimized:this.hudMinimized,hudHidden:this.hudHidden};localStorage.setItem(Ft,JSON.stringify(e))}catch{}}applyDockPresetStyles(e,t){e.style.top="auto",e.style.right="auto",e.style.bottom="auto",e.style.left="auto",t==="top-right"?(e.style.top="70px",e.style.right="20px",e.style.transformOrigin="top right"):t==="top-left"?(e.style.top="70px",e.style.left="20px",e.style.transformOrigin="top left"):t==="bottom-right"?(e.style.bottom="20px",e.style.right="20px",e.style.transformOrigin="bottom right"):(e.style.bottom="20px",e.style.left="20px",e.style.transformOrigin="bottom left")}orderedTabEntries(){let e=Array.from(this.tabPanels.entries()),t=new Set(this.hudState.pinned);return e.sort(([i],[n])=>{let s=t.has(i)?0:1,a=t.has(n)?0:1;if(s!==a)return s-a;let o=this.hudState.order.indexOf(i),l=this.hudState.order.indexOf(n),d=o>=0?o:this.hudState.order.length+le.length,c=l>=0?l:this.hudState.order.length+le.length;return d-c}),e}visibleDockedEntries(){let e=new Set(this.hudState.closed),t=new Set(this.hudState.detached);return this.orderedTabEntries().filter(([i])=>!e.has(i)&&!t.has(i))}mountDetachedPanel(e){if(typeof document>"u"||!document.body)return;let t=this.tabPanels.get(e);if(!t)return;this.unmountDetachedPanel(e);let i=document.createElement("div");i.id=`geofs-ext-detached-${e}`,i.className="geofs-ext-detached-panel";let n=document.createElement("div");n.className="geofs-ext-detached-header";let s=document.createElement("span");s.className="geofs-ext-detached-title",s.textContent=t.label;let a=document.createElement("span");a.className="geofs-ext-detached-actions";let o=document.createElement("button");o.type="button",o.className="geofs-ext-detached-btn",o.textContent="\u2199",o.title="Re-dock to HUD",o.setAttribute("aria-label",`Re-dock ${t.label}`),o.addEventListener("click",u=>{u.stopPropagation(),this.redockHudTab(e)});let l=document.createElement("button");l.type="button",l.className="geofs-ext-detached-btn",l.textContent="\xD7",l.title="Close detached panel",l.setAttribute("aria-label",`Close ${t.label}`),l.addEventListener("click",u=>{u.stopPropagation(),this.closeHudTab(e)}),a.append(o,l),n.append(s,a);let d=document.createElement("div");d.className="geofs-ext-detached-body",d.appendChild(t.el),i.append(n,d),document.body.appendChild(i),this.bringToFront(i);let c=this.makeDraggable(i,`geofs_ext_hud_detached_${e}`,n);this.detachedPanels.set(e,{el:i,cleanupDrag:c}),this.clampElementToViewport(i)}unmountDetachedPanel(e){let t=this.detachedPanels.get(e);t&&(t.cleanupDrag(),t.el.remove(),this.detachedPanels.delete(e))}renderTabs(){if(!this.hudTabsEl)return;this.hudTabsEl.innerHTML="";let e=this.visibleDockedEntries(),t=new Set(this.hudState.pinned);for(let[n,{label:s}]of e){let a=t.has(n),o=document.createElement("button");o.type="button",o.id=`tab-btn-${n}`,o.className=`unified-tab ${this.activeTabId===n?"active is-active":""} ${a?"is-pinned":""}`,o.draggable=!0,o.setAttribute("aria-label",s),o.title=a?`${s} (Pinned \u2014 drag to reorder)`:`${s} (Drag to reorder)`;let l=document.createElement("span");if(l.className="geofs-ext-tab-label",l.textContent=a?`\u2022 ${s}`:s,o.appendChild(l),!a&&e.length>1){let d=document.createElement("span");d.className="geofs-ext-tab-close",d.setAttribute("role","button"),d.setAttribute("aria-label",`Close ${s} tab`),d.title=`Close ${s}`,d.textContent="\xD7",d.addEventListener("click",c=>{c.stopPropagation(),c.preventDefault(),this.closeHudTab(n)}),o.appendChild(d)}o.addEventListener("click",d=>{d.stopPropagation(),this.hudMenuOpen=!1,this.hudMenuEl&&(this.hudMenuEl.style.display="none"),this.selectTab(n)}),o.addEventListener("dragstart",d=>{this.draggingTabId=n,o.classList.add("is-tab-dragging"),d.dataTransfer?.setData("text/plain",n),d.dataTransfer&&(d.dataTransfer.effectAllowed="move")}),o.addEventListener("dragover",d=>{!this.draggingTabId||this.draggingTabId===n||(d.preventDefault(),o.classList.add("is-drag-over"))}),o.addEventListener("dragleave",()=>{o.classList.remove("is-drag-over")}),o.addEventListener("drop",d=>{d.preventDefault(),o.classList.remove("is-drag-over");let c=this.draggingTabId||d.dataTransfer?.getData("text/plain");c&&c!==n&&this.reorderHudTab(c,n)}),o.addEventListener("dragend",()=>{this.draggingTabId=null,o.classList.remove("is-tab-dragging","is-drag-over")}),this.hudTabsEl.appendChild(o)}let i=document.createElement("button");i.type="button",i.id="hud-tab-add-btn",i.className=`geofs-ext-hud-add ${this.hudMenuOpen?"is-open":""}`,i.textContent="+",i.title="Open tabs, pin/detach modules & dock presets",i.setAttribute("aria-label","Open tab or dock preset"),i.setAttribute("aria-expanded",String(this.hudMenuOpen)),i.addEventListener("click",n=>{n.stopPropagation(),this.hudMenuOpen=!this.hudMenuOpen,this.renderTabs(),this.renderHudMenu()}),this.hudTabsEl.appendChild(i)}renderHudMenu(){if(!this.hudMenuEl)return;if(!this.hudMenuOpen){this.hudMenuEl.style.display="none";return}this.hudMenuEl.style.display="flex",this.hudMenuEl.innerHTML="";let e=document.createElement("div");e.className="geofs-ext-hud-menu-title",e.textContent="HUD Modules & Tabs",this.hudMenuEl.appendChild(e);let t=new Set(this.hudState.closed),i=new Set(this.hudState.pinned),n=new Set(this.hudState.detached);for(let[d,{label:c}]of this.orderedTabEntries()){let u=document.createElement("div");u.className="geofs-ext-hud-menu-row";let p=document.createElement("button");p.type="button",p.className="geofs-ext-hud-menu-name";let f=t.has(d),h=n.has(d),g=i.has(d);p.textContent=`${c}${h?" (Detached)":f?" (Closed)":""}`,p.addEventListener("click",A=>{A.stopPropagation(),this.hudMenuOpen=!1,this.openHudTab(d),this.renderTabs()});let b=document.createElement("span");b.className="geofs-ext-hud-menu-actions";let x=document.createElement("button");x.type="button",x.className=`geofs-ext-hud-menu-chip ${g?"is-active":""}`,x.textContent=g?"Unpin":"Pin",x.addEventListener("click",A=>{A.stopPropagation(),this.pinHudTab(d)});let T=document.createElement("button");T.type="button",T.className=`geofs-ext-hud-menu-chip ${h?"is-active":""}`,T.textContent=h?"Dock":"Detach",T.addEventListener("click",A=>{A.stopPropagation(),h?this.redockHudTab(d):this.detachHudTab(d)}),b.append(x,T),u.append(p,b),this.hudMenuEl.appendChild(u)}let s=document.createElement("div");s.className="geofs-ext-hud-menu-title",s.textContent="Dock Presets",this.hudMenuEl.appendChild(s);let a=document.createElement("div");a.className="geofs-ext-hud-preset-grid";let o=[["top-left","Top-Left"],["top-right","Top-Right"],["bottom-left","Bot-Left"],["bottom-right","Bot-Right"]];for(let[d,c]of o){let u=document.createElement("button");u.type="button",u.className=`geofs-ext-hud-menu-chip ${this.hudState.dockPreset===d?"is-active":""}`,u.textContent=c,u.addEventListener("click",p=>{p.stopPropagation(),this.setHudDockPreset(d)}),a.appendChild(u)}this.hudMenuEl.appendChild(a);let l=document.createElement("button");l.type="button",l.className="geofs-ext-hud-menu-reset",l.textContent="Reset Default Layout",l.addEventListener("click",d=>{d.stopPropagation(),this.hudMenuOpen=!1,this.resetHudLayout()}),this.hudMenuEl.appendChild(l)}selectTab(e){let t=this.tabPanels.get(e);!t||!this.hudBodyEl||this.hudState.detached.includes(e)||(this.hudState.closed=this.hudState.closed.filter(i=>i!==e),this.activeTabId=e,this.hudBodyEl.innerHTML="",this.hudBodyEl.appendChild(t.el),this.renderTabs(),this.saveHudState(),this.hudRoot&&this.clampElementToViewport(this.hudRoot))}injectStyles(){if(this.styleEl||typeof document>"u")return;let e=document.createElement("style");e.id="geofs-ext-styles",e.textContent=`
      :root {
        --geofs-ext-scale: 1;
        --geofs-ext-bg: rgba(0, 0, 0, 0.8);
        --geofs-ext-fg: #ffffff;
        --geofs-ext-muted: rgba(255, 255, 255, 0.58);
        --geofs-ext-border: #888888;
        --geofs-ext-divider: rgba(255, 255, 255, 0.14);
        --geofs-ext-accent: #ffc107;
        --geofs-ext-blue: #0d5f8d;
        --geofs-ext-sky: #00bbff;
        --geofs-ext-radar-bg: #000000;
      }
      :root[data-geofs-ext-theme="light"] {
        --geofs-ext-bg: rgba(255, 255, 255, 0.92);
        --geofs-ext-fg: #000000;
        --geofs-ext-muted: rgba(0, 0, 0, 0.56);
        --geofs-ext-border: rgba(0, 0, 0, 0.22);
        --geofs-ext-divider: rgba(0, 0, 0, 0.12);
        --geofs-ext-accent: #0d5f8d;
        --geofs-ext-blue: #0d5f8d;
        --geofs-ext-sky: #0d5f8d;
        --geofs-ext-radar-bg: #ffffff;
      }
      html.geofs-ext-dragging,
      html.geofs-ext-dragging *,
      html.geofs-ext-dragging #flightDataDisplay.geofs-ext-hud,
      html.geofs-ext-dragging #flightDataDisplay.geofs-ext-hud * {
        cursor: grabbing !important;
        user-select: none !important;
      }
      .is-dragging {
        transition: none !important;
      }
      #flightDataDisplay.geofs-ext-hud, .geofs-ext-native-card {
        box-sizing: border-box;
        position: fixed;
        top: 70px;
        right: 20px;
        width: 250px;
        min-width: 250px;
        max-width: 250px;
        height: auto;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        padding: 8px;
        z-index: 2147483000;
        display: flex;
        flex-direction: column;
        gap: 0;
        transform: scale(var(--geofs-ext-scale));
        transform-origin: top right;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        user-select: none;
        touch-action: none;
      }
      html:not(.geofs-ext-dragging) #flightDataDisplay.geofs-ext-hud,
      html:not(.geofs-ext-dragging) #flightDataDisplay.geofs-ext-hud * {
        cursor: grab !important;
      }
      #flightDataDisplay.geofs-ext-hud * {
        box-sizing: border-box;
      }
      #flightDataDisplay.geofs-ext-hud {
        overflow: visible;
      }
      #flightDataDisplay.geofs-ext-hud .mdl-tooltip {
        display: none !important;
      }
      #flightDataDisplay.geofs-ext-hud > .geofs-ext-hud-header {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        width: 100%;
        height: auto;
        min-height: 22px;
        gap: 3px;
        margin-bottom: 6px;
        cursor: grab;
        user-select: none;
      }
      .geofs-ext-hud-grip {
        position: relative;
        width: 10px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--geofs-ext-muted);
        fill: currentColor;
        cursor: grab;
      }
      .geofs-ext-hud-grip:hover {
        color: var(--geofs-ext-fg);
      }
      #flightDataDisplay.geofs-ext-hud #hud-unified-tabs.unified-tabs {
        display: flex;
        align-items: stretch;
        gap: 2px;
        flex: 1;
        min-width: 0;
        margin: 0;
        overflow-x: auto;
        scrollbar-width: none;
      }
      #flightDataDisplay.geofs-ext-hud #hud-unified-tabs.unified-tabs::-webkit-scrollbar {
        display: none;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
        flex: 1 1 auto;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: transparent;
        color: var(--geofs-ext-muted);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        padding: 4px 3px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        cursor: pointer !important;
        text-align: center;
        line-height: 1.2;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab * {
        cursor: pointer !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-tab-label {
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-tab-close {
        display: none;
        flex-shrink: 0;
        font-size: 10px;
        line-height: 1;
        opacity: 0.75;
        padding: 0 1px;
        border-radius: 50%;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab:hover .geofs-ext-tab-close,
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-active .geofs-ext-tab-close {
        display: inline-flex;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-tab-close:hover {
        opacity: 1;
        color: #ff6b6b;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-drag-over {
        border-color: #22d3ee;
        box-shadow: 0 0 6px rgba(34, 211, 238, 0.45);
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-tab-dragging {
        opacity: 0.5;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab:hover {
        border-color: var(--geofs-ext-fg);
        color: var(--geofs-ext-fg);
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab.active,
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-active {
        background: var(--geofs-ext-accent);
        border-color: var(--geofs-ext-accent);
        border-radius: 15px;
        color: #ffffff;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-add {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 22px;
        padding: 0;
        background: transparent;
        color: var(--geofs-ext-muted);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        cursor: pointer !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-add:hover,
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-add.is-open {
        border-color: var(--geofs-ext-fg);
        color: var(--geofs-ext-fg);
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized .geofs-ext-hud-menu {
        display: none !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-menu {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 6px;
        padding: 6px;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 8px;
        background: rgba(17, 19, 24, 0.96);
        cursor: default !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-menu * {
        cursor: default !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-menu button {
        cursor: pointer !important;
      }
      .geofs-ext-hud-menu-title {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: var(--geofs-ext-muted);
      }
      .geofs-ext-hud-menu-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
      }
      .geofs-ext-hud-menu-name {
        flex: 1;
        min-width: 0;
        text-align: left;
        background: transparent;
        border: none;
        padding: 2px 0;
        color: var(--geofs-ext-fg);
        font-size: 10px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .geofs-ext-hud-menu-name:hover {
        color: #22d3ee;
      }
      .geofs-ext-hud-menu-actions {
        display: inline-flex;
        gap: 3px;
        flex-shrink: 0;
      }
      .geofs-ext-hud-preset-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px;
      }
      .geofs-ext-hud-menu-chip {
        background: rgba(255, 255, 255, 0.05);
        color: var(--geofs-ext-fg);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 4px;
        padding: 2px 5px;
        font-size: 9px;
        font-weight: 700;
      }
      .geofs-ext-hud-menu-chip.is-active {
        border-color: #10b981;
        color: #10b981;
      }
      .geofs-ext-hud-menu-reset {
        background: transparent;
        color: var(--geofs-ext-muted);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 4px;
        padding: 3px 6px;
        font-size: 9.5px;
        font-weight: 700;
      }
      .geofs-ext-hud-menu-reset:hover {
        color: var(--geofs-ext-fg);
        border-color: var(--geofs-ext-fg);
      }
      .geofs-ext-detached-panel {
        box-sizing: border-box;
        position: fixed;
        top: 110px;
        right: 280px;
        width: 250px;
        min-width: 240px;
        max-width: 260px;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 12px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        padding: 8px;
        z-index: 2147483002;
        display: flex;
        flex-direction: column;
        gap: 6px;
        transform: scale(var(--geofs-ext-scale));
        transform-origin: top left;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      }
      .geofs-ext-detached-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        cursor: grab;
        user-select: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        padding-bottom: 4px;
      }
      .geofs-ext-detached-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.4px;
        text-transform: uppercase;
      }
      .geofs-ext-detached-actions {
        display: inline-flex;
        gap: 4px;
      }
      .geofs-ext-detached-btn {
        background: #000000;
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 4px;
        width: 18px;
        height: 18px;
        padding: 0;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
      }
      .geofs-ext-hud-min {
        position: relative;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #000000;
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        min-width: 20px;
        height: 22px;
        padding: 0 4px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        cursor: grab;
        text-align: center;
      }
      #flightDataDisplay.geofs-ext-hud > .geofs-ext-hud-body {
        flex: 0 0 auto;
        width: 100%;
        max-height: none;
        overflow: visible;
        cursor: grab;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized {
        width: 40px;
        min-width: 40px;
        max-width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized > .geofs-ext-hud-header {
        margin-bottom: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized .geofs-ext-hud-grip {
        display: none;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized .geofs-ext-hud-min {
        border: none;
        background: transparent;
        padding: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 10px;
        line-height: 1;
      }
      [data-hud-tip]:hover::after,
      [data-hud-tip]:focus-visible::after {
        content: attr(data-hud-tip);
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        background: rgba(0, 0, 0, 0.92);
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 6px;
        padding: 3px 7px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 10px;
        font-weight: 600;
        line-height: 1.2;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
        z-index: 2147483050;
      }
      [data-hud-tip][data-tip-v="above"]:hover::after,
      [data-hud-tip][data-tip-v="above"]:focus-visible::after {
        top: auto;
        bottom: calc(100% + 4px);
      }
      [data-hud-tip][data-tip-h="left"]:hover::after,
      [data-hud-tip][data-tip-h="left"]:focus-visible::after {
        left: 0;
        right: auto;
      }
      [data-hud-tip][data-tip-h="center"]:hover::after,
      [data-hud-tip][data-tip-h="center"]:focus-visible::after {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
      }
      html.geofs-ext-dragging [data-hud-tip]::after,
      .is-dragging [data-hud-tip]::after,
      .is-dragging[data-hud-tip]::after {
        display: none !important;
      }
      #hudMinimizeBtn.unified-hud-edge-tab {
        position: fixed;
        left: 0;
        top: calc(50% - 20px);
        width: 24px;
        height: 40px;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-left: none;
        border-radius: 0 7px 7px 0;
        z-index: 2147483001;
        align-items: center;
        justify-content: center;
        cursor: grab;
        user-select: none;
        touch-action: none;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        font-weight: 700;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
      }
      #hudMinimizeBtn.unified-hud-edge-tab[data-hud-tip]:hover::after,
      #hudMinimizeBtn.unified-hud-edge-tab[data-hud-tip]:focus-visible::after {
        top: 50%;
        bottom: auto;
        left: calc(100% + 6px);
        right: auto;
        transform: translateY(-50%);
      }
      .geofs-ext-zone {
        position: fixed;
        z-index: 2147483000;
        display: flex;
        gap: 6px;
        transform: scale(var(--geofs-ext-scale));
      }
      .geofs-ext-zone--top { top: 10px; left: 50%; transform: translateX(-50%) scale(var(--geofs-ext-scale)); }
      .geofs-ext-zone--bottom { bottom: 14px; left: 50%; transform: translateX(-50%) scale(var(--geofs-ext-scale)); }
      .geofs-ext-zone--autopilot {
        bottom: 14px;
        left: 50%;
        transform: translateX(-50%) scale(var(--geofs-ext-scale));
        background: var(--geofs-ext-bg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        padding: 4px 8px;
        align-items: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
      }
      .geofs-ext-zone--right { top: 45%; right: 12px; flex-direction: column; transform-origin: right center; }
      .geofs-ext-zone--corner { bottom: 14px; right: 106px; transform-origin: bottom right; }
      .geofs-ext-pad {
        box-sizing: border-box;
        background: #000000;
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        padding: 4px 10px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
      }
      .geofs-ext-pad.is-active,
      .geofs-ext-pad.green-pad {
        border-color: #4caf50;
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.45);
        color: #ffffff;
      }
      #geofs-ext-toasts {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: min(320px, calc(100vw - 40px));
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        pointer-events: none;
      }
      .geofs-ext-toast {
        box-sizing: border-box;
        max-width: 100%;
        background: rgba(40, 40, 40, 0.96);
        color: #eeeeee;
        border: 1px solid #777777;
        border-radius: 4px;
        padding: 8px 12px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        line-height: 1.35;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        overflow-wrap: anywhere;
      }
      .geofs-ext-toast--warn { border-color: #eab308; color: #ffd37a; }
      .geofs-ext-toast--critical { border-color: #ef4444; color: #ff8d8d; }
      .geofs-ext-prompt {
        box-sizing: border-box;
        pointer-events: auto;
        width: 100%;
        background: rgba(0, 0, 0, 0.9);
        color: #ffffff;
        border: 1px solid #888888;
        border-radius: 15px;
        padding: 10px 12px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      }
      .geofs-ext-prompt-text {
        margin-bottom: 8px;
        line-height: 1.35;
      }
      .geofs-ext-prompt-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        justify-content: flex-end;
      }
      .geofs-ext-prompt-btn {
        background: #000000;
        color: #ffffff;
        border: 1px solid #888888;
        border-radius: 15px;
        padding: 4px 9px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 10px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
      }
      .geofs-ext-prompt-btn--primary { border-color: #4caf50; color: #4caf50; }
      .geofs-ext-prompt-btn--danger { border-color: #ef4444; color: #ff6b6b; }
    `,document.head?.appendChild(e),this.styleEl=e}destroy(){for(let e of Array.from(this.dragCleanups))e();for(let e of this.mountedControls.values())e.remove();this.mountedControls.clear(),this.syncedAutopilotPads.clear(),this.trackedElements.clear(),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeListener&&typeof window<"u"&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null);for(let e of Array.from(this.detachedPanels.keys()))this.unmountDetachedPanel(e);this.hudMenuEl=null,this.hudRoot?.remove(),this.hudRoot=null,this.edgeHandleEl?.remove(),this.edgeHandleEl=null,document.getElementById("geofs-ext-toasts")?.remove();for(let e of["top","bottom","right","corner","autopilot"])document.getElementById(`geofs-ext-zone-${e}`)?.remove();this.styleEl?.remove(),this.styleEl=null}};var xe=class{constructor(e,t){this.simMajor=e;this.baseContext=t}registry=new Map;active=new Set;eventBus=new Map;settingsUpdate=Promise.resolve();reportedUnsupported=new Set;register(e){this.registry.set(e.id,e)}getModules(){return Array.from(this.registry.values())}isActive(e){return this.active.has(e)}applySettings(e){let t=this.settingsUpdate.then(()=>this.reconcileSettings(e));return this.settingsUpdate=t.catch(i=>{this.baseContext.emitDiag?.("MODULE_SETTINGS_ERROR",{level:"error",error:String(i)})}),t}async reconcileSettings(e){for(let[t,i]of this.registry){let n=i.supportedMajors.includes(this.simMajor),s=e.modules[t]??i.defaultEnabled;!n&&s&&!this.reportedUnsupported.has(t)&&(this.reportedUnsupported.add(t),this.baseContext.emitDiag?.("MODULE_UNSUPPORTED_ERROR",{level:"error",moduleId:t,simMajor:this.simMajor}));let a=n&&s;if(a&&!this.active.has(t))await this.enable(t);else if(!a&&this.active.has(t))await this.disable(t);else if(a&&this.active.has(t))try{i.onSettingsChange?.(e)}catch(o){this.baseContext.emitDiag?.("MODULE_SETTINGS_ERROR",{level:"error",moduleId:t,error:String(o)})}}}async enable(e){let t=this.registry.get(e);if(!t||this.active.has(e)||!t.supportedMajors.includes(this.simMajor))return;let i={...this.baseContext,simMajor:this.simMajor,emitEvent:(n,s)=>this.emit(n,s),onEvent:(n,s)=>this.on(n,s)};try{await t.init(i),this.active.add(e)}catch(n){this.baseContext.emitDiag?.("MODULE_INIT_ERROR",{level:"error",moduleId:e,error:String(n)})}}async disable(e){let t=this.registry.get(e);if(!(!t||!this.active.has(e)))try{await t.destroy()}catch(i){this.baseContext.emitDiag?.("MODULE_DESTROY_ERROR",{level:"error",moduleId:e,error:String(i)})}finally{this.active.delete(e)}}dispatchTelemetry(e){for(let t of this.active){let i=this.registry.get(t);if(i?.update)try{i.update(e)}catch(n){this.baseContext.emitDiag?.("MODULE_UPDATE_ERROR",{level:"error",moduleId:t,error:String(n)})}}}async destroyAll(){for(let e of Array.from(this.active))await this.disable(e);this.eventBus.clear()}emit(e,t){let i=this.eventBus.get(e);if(i)for(let n of i)try{n(t)}catch(s){console.error(`[GeoFS Extension] Event handler error (${e}):`,s)}}on(e,t){let i=this.eventBus.get(e);return i||(i=new Set,this.eventBus.set(e,i)),i.add(t),()=>i?.delete(t)}};function de(r){return`
  :where(${r}) {
    background-color: #000000;
    border: 1px solid #888888;
    box-shadow: 0 0 5px #000000;
  }
  ${r} {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: var(--geofs-ext-ap-height, 27px);
    min-width: 0;
    min-height: var(--geofs-ext-ap-height, 27px);
    padding: 0 12px;
    margin: var(--geofs-ext-ap-margin, 0 10px);
    border-radius: var(--geofs-ext-ap-radius, 15px);
    vertical-align: var(--geofs-ext-ap-valign, middle);
    cursor: pointer;
    pointer-events: all;
    text-align: center;
    white-space: nowrap;
    flex: 0 0 auto;
    font-weight: 400;
    transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
  }
  ${r}:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: #ffffff;
  }
  ${r}:hover .control-pad-label,
  :where(${r}.is-open .control-pad-label) {
    color: #ffffff;
  }
  ${r}.is-open {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: #ffffff;
  }
  ${r} .control-pad-label {
    pointer-events: none;
    line-height: 1.15;
    font-family: var(--geofs-ext-ap-font-family, "Roboto", "Helvetica", "Arial", sans-serif);
    font-size: var(--geofs-ext-ap-font-size, 12px);
    font-weight: var(--geofs-ext-ap-font-weight, 400);
    letter-spacing: var(--geofs-ext-ap-letter-spacing, normal);
    text-align: center;
    white-space: nowrap;
    transition: color 150ms ease;
  }
  :where(${r} .control-pad-label) {
    color: rgba(255, 255, 255, 0.78);
  }
  :where(${r}.green-pad .control-pad-label),
  :where(${r}.amber-pad .control-pad-label),
  :where(${r}.red-pad .control-pad-label) {
    color: #ffffff;
  }
  ${r}.green-pad {
    background-color: rgba(46, 125, 50, 0.38) !important;
    border-color: #4caf50 !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5) !important;
  }
  ${r}.green-pad:hover {
    background-color: rgba(56, 142, 60, 0.52) !important;
  }
  ${r}.amber-pad {
    background-color: rgba(245, 158, 11, 0.22) !important;
    border-color: #fbbf24 !important;
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.38) !important;
  }
  ${r}.red-pad {
    background-color: rgba(220, 38, 38, 0.28) !important;
  }
  `}var ie=Math.PI/180,Lt=180/Math.PI;function R(r,e,t){return Math.max(e,Math.min(t,r))}function z(r){if(!Number.isFinite(r))return 0;let e=r%360;return e<0?e+360:e}function ce(r,e){let t=z(r)-z(e);return t>180&&(t-=360),t<-180&&(t+=360),t}function Pt(r){let e=Math.max(0,r);if(e<=36089){let i=1-68756e-10*e;return Math.pow(Math.max(.1,i),4.25588)}return .297076*Math.exp(-(e-36089)/20806)}function Rt(r){let e=Math.max(0,r),t=e<=36089?288.15-.0019812*e:216.65;return 661.4786*Math.sqrt(Math.max(.5,t/288.15))}function ye(r,e){let t=Math.max(.04,Pt(e));return r/Math.sqrt(t)}function yi(r,e){let t=Math.max(.04,Pt(e));return r*Math.sqrt(t)}function wi(r,e){return ye(r,e)/Rt(e)}function at(r,e){let t=r*Rt(e);return yi(t,e)}function we(r,e){let t=R(r,100,600),i=R(e,.3,2.5),n=0,s=6e4;for(let a=0;a<20;a++){let o=(n+s)*.5;wi(t,o)<i?n=o:s=o}return Math.round((n+s)*.5)}function Se(r,e,t,i){let n=r*ie,s=t*ie,a=(i-e)*ie,o=Math.sin(a)*Math.cos(s),l=Math.cos(n)*Math.sin(s)-Math.sin(n)*Math.cos(s)*Math.cos(a);return z(Math.atan2(o,l)*Lt)}function Ee(r,e,t,i){let n=r*ie,s=t*ie,a=(t-r)*ie,o=(i-e)*ie,l=Math.sin(a*.5)*Math.sin(a*.5)+Math.cos(n)*Math.cos(s)*Math.sin(o*.5)*Math.sin(o*.5);return 3440.065*(2*Math.atan2(Math.sqrt(l),Math.sqrt(Math.max(0,1-l))))}var se=class{constructor(e,t,i,n,s,a=50){this.kp=e;this.ki=t;this.kd=i;this.minOut=n;this.maxOut=s;this.maxIntegral=a}integral=0;prevError=0;hasPrev=!1;reset(){this.integral=0,this.prevError=0,this.hasPrev=!1}step(e,t){let i=R(t,.005,.5);this.integral=R(this.integral+e*i,-this.maxIntegral,this.maxIntegral);let n=this.hasPrev?(e-this.prevError)/i:0;this.prevError=e,this.hasPrev=!0;let s=this.kp*e+this.ki*this.integral+this.kd*n;return R(s,this.minOut,this.maxOut)}};function Dt(r,e,t){let i=z(r-e),n=t==="L"?z(360-i):i;return n>=110&&n<180?"teardrop":n>=180&&n<290?"parallel":"direct"}function Si(r,e,t,i){if(!Number.isFinite(t)||t<=.5||!Number.isFinite(i))return 0;let n=Math.max(45,Number.isFinite(e)?e:120),s=(i-r)*ie,a=t*Math.sin(s),o=Math.asin(R(a/n,-.44,.44))*Lt;return Math.round(R(o,-26,26))}function Nt(r,e,t,i,n,s){let a=Ee(e,t,r.fixLat,r.fixLon),o=Se(e,t,r.fixLat,r.fixLon),l=z(r.inboundCourseDeg),d=z(l+180),c=R(r.legMinutes,.5,5)*60,u=g=>s?Si(g,s.tasKts,s.windSpeedKts,s.windDirFromDeg):0;if(r.phase==="entry-teardrop"){r.legElapsedSec+=n;let g=z(d+(r.turnDir==="R"?-30:30)),b=u(g);return r.wcaDeg=b,r.legElapsedSec>=c&&(r.phase="turn-inbound",r.legElapsedSec=0),{targetHeadingDeg:z(g+b),distToFixNm:a,bearingToFixDeg:o}}if(r.phase==="entry-parallel"){r.legElapsedSec+=n;let g=u(d);return r.wcaDeg=g,r.legElapsedSec>=c&&(r.phase="inbound",r.legElapsedSec=0),{targetHeadingDeg:z(d+g),distToFixNm:a,bearingToFixDeg:o}}if(r.phase==="inbound"){r.legElapsedSec+=n;let g=u(l);r.wcaDeg=g,a<.6&&r.legElapsedSec>10&&(r.phase="turn-outbound",r.legElapsedSec=0);let b=R(ce(o,l)*1.4,-30,30);return{targetHeadingDeg:z(o+b*.25+g),distToFixNm:a,bearingToFixDeg:o}}if(r.phase==="turn-outbound"){r.legElapsedSec+=n;let g=u(d);r.wcaDeg=g;let b=z(d+g);return(Math.abs(ce(b,i))<12||r.legElapsedSec>70)&&(r.phase="outbound",r.legElapsedSec=0),{targetHeadingDeg:b,distToFixNm:a,bearingToFixDeg:o}}if(r.phase==="outbound"){r.legElapsedSec+=n;let g=u(d);return r.wcaDeg=g,r.legElapsedSec>=c&&(r.phase="turn-inbound",r.legElapsedSec=0),{targetHeadingDeg:z(d+g),distToFixNm:a,bearingToFixDeg:o}}r.legElapsedSec+=n;let p=u(l);r.wcaDeg=p;let f=z(l+p);return(Math.abs(ce(f,i))<15||r.legElapsedSec>70)&&(r.phase="inbound",r.legElapsedSec=0),{targetHeadingDeg:f,distToFixNm:a,bearingToFixDeg:o}}var Ei=`
  .ext-ap-pp-bar,
  .ext-ap-pp-bar * {
    box-sizing: border-box;
  }
  .ext-ap-pp-bar {
    display: inline-flex;
    align-items: center;
    vertical-align: var(--geofs-ext-ap-valign, middle);
    pointer-events: all;
  }
  ${de("#ap-pp-button.ext-ap-pp-pad")}
  #ap-pp-button.ext-ap-pp-pad {
    position: relative;
  }
  #ap-pp-button .ext-ap-pp-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.05;
    gap: 1px;
  }
  #ap-pp-button .ext-ap-pp-title-row {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
  #ap-pp-button .ext-ap-pp-beta {
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.4px;
    padding: 0 3px;
    border-radius: 3px;
    background: rgba(245, 158, 11, 0.25);
    border: 1px solid rgba(245, 158, 11, 0.7);
    color: #fbbf24;
  }
  #ap-pp-button .ext-ap-pp-fma {
    font-size: 8px;
    letter-spacing: 0.3px;
    opacity: 0.85;
    font-family: monospace;
  }
`,Ae=class{id="autopilot-pp";name="AP++ (Beta)";description="Unified Autopilot++ flight management: VNAV/FLCH, Mach crossover, racetrack HOLD, LAT/LON, Autoland & Envelope Protection.";supportedMajors=[3,4];defaultEnabled=!1;ctx=null;barEl=null;padEl=null;fmaLineEl=null;hudFmaEl=null;syncHudTab=null;unmounts=[];engaged=!1;speedMode="kts";lateralMode="hdg";verticalMode="alt";targetKias=250;targetMach=.78;targetAltFt=1e4;targetHdgDeg=0;targetVsFpm=0;autoVs=!0;targetLat=0;targetLon=0;waypointName="CUSTOM";routeWaypoints=[];routeIndex=0;landingArmed=!1;landingRetarded=!1;envelopeProtection=!0;hoverMode=!1;holdConfig={fixLat:0,fixLon:0,inboundCourseDeg:0,legMinutes:1,turnDir:"R",phase:"inbound",legElapsedSec:0};fma={thr:"OFF",vert:"OFF",lat:"OFF",protection:null};lastTelemetry=null;lastEmitMs=0;stickOverrideSec=0;activeFailures=new Set;rollPid=new se(.032,.001,.015,-.8,.8,10);pitchPid=new se(.038,.004,.018,-.8,.8,12);speedPitchPid=new se(.18,.012,.04,-12,16,20);throttlePid=new se(.015,.003,.004,0,1,30);init(e){if(this.ctx=e,typeof document<"u"){let t=document.createElement("style");t.id="geofs-ext-ap-pp-styles",t.textContent=Ei,document.head?.append(t),this.unmounts.push(()=>t.remove());let i=document.createElement("div");i.className="ext-ap-pp-bar",i.innerHTML=`
      <div class="control-pad ext-ap-pp-pad" id="ap-pp-button"
           role="button" tabindex="0" aria-pressed="false"
           title="AP++ (Beta): Toggle master autopilot & open Side Panel">
        <div class="control-pad-label transp-pad ext-ap-pp-label">
          <span class="ext-ap-pp-title-row">AP++ <span class="ext-ap-pp-beta">BETA</span></span>
          <span class="ext-ap-pp-fma">STBY</span>
        </div>
      </div>
    `;let n=i.querySelector("#ap-pp-button");if(this.fmaLineEl=i.querySelector(".ext-ap-pp-fma"),n.addEventListener("click",s=>{s.stopPropagation(),this.toggleMaster(),window.postMessage({type:"GEOFS_EXT_OPEN_SIDEPANEL"},"*")}),n.addEventListener("keydown",s=>{s.key!=="Enter"&&s.key!==" "||(s.preventDefault(),s.repeat||n.click())}),this.barEl=i,this.padEl=n,this.unmounts.push(e.anchors.mountControl("autopilot-pp-pad","autopilot",i)),e.anchors.syncAutopilotPad(n,i,!0),typeof e.anchors?.registerHudTab=="function"){let s=document.createElement("div");s.style.cssText="display:flex;flex-direction:column;gap:5px;font-size:10px;color:#e5e7eb;";let a=document.createElement("div");a.style.cssText="font-family:monospace;font-size:10px;font-weight:700;color:#fbbf24;display:flex;justify-content:space-between;",a.textContent="AP++ STBY",this.hudFmaEl=a;let o=document.createElement("div");o.style.cssText="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;";let l=(g,b)=>{let x=document.createElement("button");return x.type="button",x.textContent=g,x.style.cssText="background:rgba(255,255,255,0.06);color:#e5e7eb;border:1px solid rgba(255,255,255,0.16);border-radius:4px;padding:4px 4px;font-size:9px;font-weight:700;cursor:pointer;",x.addEventListener("click",b),x},d=l("AP++",()=>this.handleCommand({type:"toggle"})),c=l("HOLD ALL",()=>this.handleCommand({type:"holdPresent",axis:"all"})),u=l("RACETRACK",()=>this.handleCommand({type:"holdHere"})),p=l("LDG ARM",()=>this.handleCommand({type:"setLandingArm",armed:!this.landingArmed})),f=l("HOVER",()=>this.handleCommand({type:"setHoverMode",enabled:!this.hoverMode})),h=l("PROT",()=>this.handleCommand({type:"setEnvelopeProtection",enabled:!this.envelopeProtection}));o.append(d,c,u,p,f,h),this.syncHudTab=()=>{a.textContent=this.engaged?`${this.fma.thr} \xB7 ${this.fma.vert} \xB7 ${this.fma.lat}${this.fma.protection?` [${this.fma.protection}]`:""}`:"AP++ STBY";let g=(b,x)=>{b.style.borderColor=x?"#10b981":"rgba(255,255,255,0.16)",b.style.color=x?"#10b981":"#a1a1aa"};g(d,this.engaged),g(u,this.engaged&&this.lateralMode==="hold"),g(p,this.landingArmed),g(f,this.engaged&&this.hoverMode),g(h,this.envelopeProtection)},s.append(a,o),this.unmounts.push(e.anchors.registerHudTab("ap-pp","AP++",s,!1,{defaultClosed:!0}))}}if(typeof window<"u"){let t=i=>{if(i.source!==window||!i.data||typeof i.data!="object")return;let n=i.data;n.type==="GEOFS_EXT_AP_PP_COMMAND"&&n.command&&this.handleCommand(n.command)};window.addEventListener("message",t),this.unmounts.push(()=>window.removeEventListener("message",t))}this.unmounts.push(e.onEvent("failure:triggered",({type:t})=>{t&&(this.activeFailures.add(t),t==="electrical"&&this.engaged?this.disengage("ELEC FAIL"):t==="pitot"&&this.engaged&&(this.verticalMode==="flch"||this.verticalMode==="vnav")&&(this.verticalMode="alt"),this.emitSnapshot(!0))})),this.unmounts.push(e.onEvent("failure:cleared",({type:t})=>{t&&(this.activeFailures.delete(t),this.emitSnapshot(!0))})),e.emitEvent("failure:request-active"),this.renderPad(),this.emitSnapshot(!0)}update(e){if(this.lastTelemetry=e,this.padEl&&this.barEl&&this.ctx?.anchors.syncAutopilotPad(this.padEl,this.barEl),e.paused||e.crashed)return;let t=R(e.dt||.05,.01,.25);if(this.engaged&&this.checkStickOverride(t)){this.disengage("STICK DISC"),this.fma.protection="STICK DISC",this.ctx?.anchors.showToast("AP++ Disconnected: Manual Stick Input"),this.emitSnapshot(!0);return}if(!this.engaged){this.fma.protection&&this.fma.protection!=="STICK DISC"&&(this.fma.protection=null),e.timestamp-this.lastEmitMs>=400&&this.emitSnapshot(!1);return}if(this.activeFailures.has("electrical")){this.disengage("ELEC FAIL");return}let i=this.envelopeProtection?this.evaluateEnvelope(e):null;this.fma.protection=i,this.syncNativeAutopilot(),this.stepThrottleChannel(e,t,i),this.stepLateralChannel(e,t),this.stepVerticalChannel(e,t,i),this.updateFmaLabels(),this.renderPad(),e.timestamp-this.lastEmitMs>=250&&this.emitSnapshot(!1)}onSettingsChange(e){this.renderPad()}destroy(){this.engaged&&this.disengage();for(let e of this.unmounts)e();this.unmounts=[],this.barEl=null,this.padEl=null,this.fmaLineEl=null,this.ctx=null}handleCommand(e){switch(e.type){case"engage":this.engage();break;case"disengage":this.disengage();break;case"toggle":this.toggleMaster();break;case"setSpeed":Number.isFinite(e.value)&&e.value>0&&(this.speedMode==="mach"?this.targetMach=R(e.value,.2,3):this.targetKias=R(Math.round(e.value),40,999));break;case"setSpeedMode":this.speedMode=e.mode;break;case"setHeading":this.targetHdgDeg=z(e.deg),window.geofs?.autopilot&&(window.geofs.autopilot.setCourse?.(this.targetHdgDeg),window.geofs.autopilot.values&&(window.geofs.autopilot.values.course=this.targetHdgDeg));break;case"setLateralMode":this.lateralMode=e.mode,e.mode==="hold"&&this.lastTelemetry&&this.initHoldAtCurrent(this.lastTelemetry),this.rollPid.reset();break;case"setAltitude":Number.isFinite(e.feet)&&(this.targetAltFt=R(Math.round(e.feet),0,8e4),window.geofs?.autopilot&&(window.geofs.autopilot.setAltitude?.(this.targetAltFt),window.geofs.autopilot.values&&(window.geofs.autopilot.values.altitude=this.targetAltFt)));break;case"setVs":e.fpm===null?this.autoVs=!0:Number.isFinite(e.fpm)&&(this.autoVs=!1,this.targetVsFpm=R(Math.round(e.fpm),-6e3,6e3));break;case"setVerticalMode":this.verticalMode=e.mode,this.pitchPid.reset(),this.speedPitchPid.reset();break;case"setLatLon":Number.isFinite(e.lat)&&Number.isFinite(e.lon)&&(this.targetLat=R(e.lat,-90,90),this.targetLon=R(e.lon,-180,180),this.waypointName=e.name?.trim()||"LAT/LON",this.lateralMode="latlon");break;case"setRoute":{let t=(e.waypoints||[]).filter(i=>Number.isFinite(i.lat)&&Number.isFinite(i.lon));if(t.length>0){this.routeWaypoints=t.map(n=>({ident:n.ident||"WPT",lat:R(n.lat,-90,90),lon:R(n.lon,-180,180),altitudeFt:n.altitudeFt})),this.routeIndex=0;let i=this.routeWaypoints[0];this.targetLat=i.lat,this.targetLon=i.lon,this.waypointName=i.ident,this.lateralMode="wpt",i.altitudeFt&&i.altitudeFt>0&&(this.targetAltFt=R(Math.round(i.altitudeFt),0,8e4)),this.ctx?.anchors.showToast(`LNAV Route Loaded (${this.routeWaypoints.length} WPTs) \u2192 ${i.ident}`)}break}case"advanceWaypoint":if(this.routeIndex+1<this.routeWaypoints.length){this.routeIndex++;let t=this.routeWaypoints[this.routeIndex];this.targetLat=t.lat,this.targetLon=t.lon,this.waypointName=t.ident,this.ctx?.anchors.showToast(`LNAV \u2192 ${t.ident} (${this.routeIndex+1}/${this.routeWaypoints.length})`)}break;case"clearRoute":this.routeWaypoints=[],this.routeIndex=0,this.lateralMode==="wpt"&&(this.lateralMode="hdg");break;case"holdHere":{this.lastTelemetry?this.initHoldAtCurrent(this.lastTelemetry,e.legMinutes,e.turnDir):(e.legMinutes&&(this.holdConfig.legMinutes=R(e.legMinutes,.5,5)),e.turnDir&&(this.holdConfig.turnDir=e.turnDir)),this.lateralMode="hold",this.engaged||this.engage();break}case"setHoldConfig":e.legMinutes&&Number.isFinite(e.legMinutes)&&(this.holdConfig.legMinutes=R(e.legMinutes,.5,5)),e.turnDir&&(this.holdConfig.turnDir=e.turnDir);break;case"holdPresent":this.lastTelemetry&&((e.axis==="alt"||e.axis==="all")&&(this.targetAltFt=Math.round(this.lastTelemetry.altitude/50)*50,this.verticalMode="alt"),(e.axis==="hdg"||e.axis==="all")&&(this.targetHdgDeg=Math.round(z(this.lastTelemetry.heading)),this.lateralMode="hdg"),(e.axis==="spd"||e.axis==="all")&&(this.targetKias=Math.max(60,Math.round(this.lastTelemetry.kias)),this.speedMode="kts")),this.engaged||this.engage();break;case"setLandingArm":this.landingArmed=e.armed,e.armed||(this.landingRetarded=!1);break;case"setEnvelopeProtection":this.envelopeProtection=e.enabled,e.enabled||(this.fma.protection=null);break;case"setHoverMode":this.hoverMode=e.enabled,e.enabled&&!this.engaged&&this.engage();break}this.engaged&&this.syncNativeAutopilot(),this.updateFmaLabels(),this.renderPad(),this.emitSnapshot(!0)}toggleMaster(){this.engaged?this.disengage():this.engage()}engage(){if(this.activeFailures.has("electrical")){this.ctx?.anchors.showToast("AP++ Unavailable: Electrical Failure");return}this.engaged=!0,this.stickOverrideSec=0,this.fma.protection=null,this.rollPid.reset(),this.pitchPid.reset(),this.speedPitchPid.reset(),this.throttlePid.reset(),this.lastTelemetry&&(this.targetAltFt<=0&&(this.targetAltFt=Math.max(500,Math.round(this.lastTelemetry.altitude/100)*100)),this.lateralMode==="hdg"&&this.targetHdgDeg===0&&(this.targetHdgDeg=Math.round(z(this.lastTelemetry.heading))),this.targetKias<=0&&(this.targetKias=Math.max(120,Math.round(this.lastTelemetry.kias)))),this.syncNativeAutopilot(),this.ctx?.emitDiag?.("AP_PP_ENGAGED",{lat:this.lateralMode,vert:this.verticalMode,spd:this.speedMode}),this.updateFmaLabels(),this.renderPad(),this.emitSnapshot(!0)}syncNativeAutopilot(){let e=window.geofs?.autopilot;if(!e)return;let t=this.engaged&&!this.hoverMode&&!this.landingArmed&&this.lateralMode==="hdg"&&this.verticalMode==="alt";try{t?(e.on||e.turnOn?.(),this.lateralMode==="hdg"&&(e.setCourse?.(this.targetHdgDeg),e.values&&(e.values.course=this.targetHdgDeg)),this.verticalMode==="alt"&&(e.setAltitude?.(this.targetAltFt),e.values&&(e.values.altitude=this.targetAltFt))):e.on&&e.turnOff?.()}catch{}}disengage(e){this.engaged=!1,this.landingRetarded=!1;try{window.geofs?.autopilot?.turnOff?.()}catch{}this.ctx?.emitDiag?.("AP_PP_DISENGAGED",{reason:e??"manual"}),this.updateFmaLabels(),this.renderPad(),this.emitSnapshot(!0)}initHoldAtCurrent(e,t,i){let n=Math.round(z(e.heading)),s=i??this.holdConfig.turnDir,a=Dt(e.heading,n,s),o=a==="teardrop"?"entry-teardrop":a==="parallel"?"entry-parallel":"outbound";this.holdConfig={fixLat:e.lat,fixLon:e.lon,inboundCourseDeg:n,legMinutes:t?R(t,.5,5):this.holdConfig.legMinutes,turnDir:s,entryType:a,wcaDeg:0,phase:o,legElapsedSec:0}}checkStickOverride(e){let t=window.controls;if(!t)return!1;let i=Math.abs(Number(t.rawRoll??0)),n=Math.abs(Number(t.rawPitch??0));return Math.max(i,n)>.25?(this.stickOverrideSec+=e,this.stickOverrideSec>=.3):(this.stickOverrideSec=0,!1)}evaluateEnvelope(e){if(e.groundContact)return null;let t=e.aircraft?.vSpeeds?.Vne??380,i=e.aircraft?.machSpeeds?.Vne??.92;return e.aoa>14.5||e.aglFeet>100&&e.kias<85&&e.aircraft?.category!=="rotorcraft"&&!this.hoverMode?"ALPHA FLOOR":e.kias>t*.98||e.mach>i*.99?"OVERSPEED":Math.abs(e.roll)>33?"BANK LIMIT":null}stepThrottleChannel(e,t,i){if(this.activeFailures.has("pitot"))return;if(this.hoverMode){let l=this.targetAltFt-e.altitude,c=R(l*1.5,-600,600)-e.vs,u=R(.54+c*45e-5,.05,.98);this.ctx?.sim.setThrottle(u);return}if(i==="ALPHA FLOOR"){this.ctx?.sim.setThrottle(1);return}if(i==="OVERSPEED"){this.ctx?.sim.setThrottle(.05);return}if(this.landingArmed&&!this.landingRetarded&&e.aglFeet<=27&&!e.groundContact){this.landingRetarded=!0,this.verticalMode="flare",this.ctx?.sim.setThrottle(0);return}if(this.landingRetarded){this.ctx?.sim.setThrottle(0),e.groundContact&&window.controls?.airbrakes&&(window.controls.airbrakes.positionTarget=1);return}if(this.verticalMode==="flch"||this.verticalMode==="vnav"){let l=this.targetAltFt-e.altitude;if(Math.abs(l)>350){this.ctx?.sim.setThrottle(l>0?.92:.04);return}}if(this.speedMode==="off")return;let n=we(this.targetKias,this.targetMach),a=(this.speedMode==="mach"||this.verticalMode==="vnav"&&e.altitude>=n?at(this.targetMach,e.altitude):this.targetKias)-e.kias,o=this.throttlePid.step(a,t);this.ctx?.sim.setThrottle(R(o,0,1))}stepLateralChannel(e,t){let i=this.activeFailures.has("hydraulics")||this.activeFailures.has("controls"),n=this.lateralMode==="hold"&&e.kias<180||i?15:25;if(this.hoverMode){let c=this.rollPid.step(0-e.roll,t);window.controls&&(window.controls.roll=R(c,-.5,.5));return}if(this.lateralMode==="off")return;if(this.landingArmed&&e.groundContact){let c=this.rollPid.step(0-e.roll,t);window.controls&&(window.controls.roll=R(c,-.4,.4));return}if(this.lateralMode==="hdg"&&window.geofs?.autopilot&&Math.abs(e.roll)<=30){let c=window.geofs.autopilot;c.values&&(c.values.course=this.targetHdgDeg);return}let s=this.targetHdgDeg;if(this.lateralMode==="hold"){let c=Number(window.weather?.currentWindSpeed??0),u=Number(window.weather?.currentWindDirection??0);s=Nt(this.holdConfig,e.lat,e.lon,e.heading,t,{tasKts:ye(e.kias,e.altitude),windSpeedKts:Number.isFinite(c)?c:0,windDirFromDeg:Number.isFinite(u)?u:0}).targetHeadingDeg}else if(this.lateralMode==="latlon"||this.lateralMode==="wpt"){if(this.lateralMode==="wpt"&&this.routeWaypoints.length>0){let c=Ee(e.lat,e.lon,this.targetLat,this.targetLon),u=Math.max(.8,Math.max(0,e.groundSpeed)/3600*15);if(c<=u&&this.routeIndex+1<this.routeWaypoints.length){this.routeIndex++;let p=this.routeWaypoints[this.routeIndex];this.targetLat=p.lat,this.targetLon=p.lon,this.waypointName=p.ident,p.altitudeFt&&p.altitudeFt>0&&this.verticalMode==="vnav"&&(this.targetAltFt=R(Math.round(p.altitudeFt),0,8e4)),this.ctx?.anchors.showToast(`LNAV \u2192 ${p.ident} (${this.routeIndex+1}/${this.routeWaypoints.length})`)}}s=Se(e.lat,e.lon,this.targetLat,this.targetLon)}let a=ce(s,e.heading),l=R(a*.9,-n,n)-e.roll,d=this.rollPid.step(l,t)*(i?.5:1);window.controls&&(window.controls.roll=R(d,-.7,.7))}stepVerticalChannel(e,t,i){let n=window.controls;if(!n)return;if(this.hoverMode){let d=R(-e.groundSpeed*.12,-8,8);n.pitch=R(this.pitchPid.step(d-e.pitch,t),-.5,.5);return}if(i==="ALPHA FLOOR"){let d=this.pitchPid.step(-2-e.pitch,t);n.pitch=R(d,-.6,.6);return}if(i==="OVERSPEED"){let d=this.pitchPid.step(6-e.pitch,t);n.pitch=R(d,-.6,.6);return}if(this.verticalMode==="off")return;if(this.landingArmed&&e.aglFeet<=50&&!e.groundContact&&this.verticalMode!=="flare"&&(this.verticalMode="flare"),this.verticalMode==="flare"){let d=R((50-e.aglFeet)/50,0,1),c=e.groundContact?0:1.5+d*3;n.pitch=R(this.pitchPid.step(c-e.pitch,t),-.4,.5);return}if(this.verticalMode==="alt"&&window.geofs?.autopilot?.values){window.geofs.autopilot.values.altitude=this.targetAltFt;return}let s=this.targetAltFt-e.altitude;if((this.verticalMode==="flch"||this.verticalMode==="vnav")&&Math.abs(s)>350){let d=we(this.targetKias,this.targetMach),c=this.speedMode==="mach"||e.altitude>=d?at(this.targetMach,e.altitude):this.targetKias,u=e.kias-c,p=s>0?7.5:-4.5,f=R(p+this.speedPitchPid.step(u,t),-14,18);n.pitch=R(this.pitchPid.step(f-e.pitch,t),-.6,.6);return}let a=this.targetVsFpm;this.verticalMode==="gs"&&Number.isFinite(e.glideslopeDeviation)?a=R(-700+Number(e.glideslopeDeviation)*250,-1800,500):(this.autoVs||this.verticalMode==="flch"||this.verticalMode==="vnav")&&(a=R(s*2.5,-2400,2400));let o=a-e.vs,l=R(e.pitch+o*.0035,-12,16);n.pitch=R(this.pitchPid.step(l-e.pitch,t),-.6,.6)}updateFmaLabels(){if(!this.engaged){this.fma={thr:"OFF",vert:"OFF",lat:"OFF",protection:this.fma.protection};return}if(this.hoverMode){this.fma={thr:"HOV",vert:"ALT HOV",lat:"LVL",protection:this.fma.protection};return}let e=this.landingRetarded?"IDLE":this.fma.protection==="ALPHA FLOOR"?"TOGA":this.verticalMode==="flch"||this.verticalMode==="vnav"?this.targetAltFt>(this.lastTelemetry?.altitude??0)?"THR CLB":"THR IDLE":this.speedMode==="mach"?"MACH":this.speedMode==="kts"?"SPD":"MAN",t=this.verticalMode==="off"?"OFF":this.verticalMode==="flare"?"FLARE":this.verticalMode==="flch"?"FLCH":this.verticalMode==="vnav"?"VNAV":this.verticalMode==="gs"?"G/S":this.verticalMode==="vs"?this.autoVs?"V/S AUTO":"V/S":"ALT",i=this.lateralMode==="off"?"OFF":this.lateralMode==="hold"?`HOLD ${this.holdConfig.phase==="inbound"?"IN":this.holdConfig.phase==="outbound"?"OUT":"TRN"}`:this.lateralMode==="latlon"?"LAT/LON":this.lateralMode==="wpt"?"WPT":this.lateralMode==="loc"?"LOC":"HDG";this.fma={thr:e,vert:t,lat:i,protection:this.fma.protection}}renderPad(){this.padEl&&(this.padEl.classList.toggle("pad-active",this.engaged),this.padEl.setAttribute("aria-pressed",String(this.engaged)),this.fmaLineEl&&(this.fmaLineEl.textContent=this.engaged?`${this.fma.thr}\xB7${this.fma.lat}`:"STBY"))}getSnapshot(){let e=this.lastTelemetry,t=e?Math.round(ye(e.kias,e.altitude)):0,i=we(this.targetKias,this.targetMach),n=null,s=null;if(e&&(this.lateralMode==="hold"||this.lateralMode==="latlon"||this.lateralMode==="wpt")){let o=this.lateralMode==="hold"?this.holdConfig.fixLat:this.targetLat,l=this.lateralMode==="hold"?this.holdConfig.fixLon:this.targetLon;n=Number(Ee(e.lat,e.lon,o,l).toFixed(1)),s=Math.round(Se(e.lat,e.lon,o,l))}let a=this.activeFailures.has("electrical")?"Electrical Failure":this.activeFailures.has("pitot")?"Pitot-Static Failure":this.activeFailures.has("hydraulics")?"Hydraulic Degradation":null;return{engaged:this.engaged,beta:!0,speedMode:this.speedMode,lateralMode:this.lateralMode,verticalMode:this.verticalMode,targetKias:this.targetKias,targetMach:Number(this.targetMach.toFixed(2)),targetAltFt:this.targetAltFt,targetHdgDeg:this.targetHdgDeg,targetVsFpm:this.targetVsFpm,autoVs:this.autoVs,targetLat:this.targetLat,targetLon:this.targetLon,waypointName:this.waypointName,routeIndex:this.routeWaypoints.length>0?this.routeIndex:void 0,routeLength:this.routeWaypoints.length>0?this.routeWaypoints.length:void 0,landingArmed:this.landingArmed,landingRetarded:this.landingRetarded,envelopeProtection:this.envelopeProtection,hoverMode:this.hoverMode,isRotorcraft:e?.aircraft?.category==="rotorcraft"||e?.collective!==null&&e?.collective!==void 0,ktas:t,crossoverAltFt:i,distanceToFixNm:n,bearingToFixDeg:s,holdConfig:{...this.holdConfig},fma:{...this.fma},degradedReason:a}}emitSnapshot(e){this.ctx&&(e||this.lastTelemetry&&this.lastTelemetry.timestamp-this.lastEmitMs>=250)&&(this.lastEmitMs=this.lastTelemetry?.timestamp??Date.now(),this.ctx.emitEvent("autopilot-pp:state",this.getSnapshot()))}};var It=`
  <div class="control-pad ext-autothrottle-control-pad ext-autothrottle-pad" id="autothrottle-button"
       role="button" tabindex="0" aria-pressed="false" title="Toggle autothrottle on/off">
    <div class="control-pad-label transp-pad">A/THR</div>
  </div>
  <div class="ext-autothrottle-controls" hidden>
    <div class="geofs-autopilot-control ext-autothrottle-control">
      <div class="ext-autothrottle-value-row">
        <div class="ext-autothrottle-reverse" hidden>[REV]</div>
        <a class="ext-autothrottle-numberDown numberDown" data-step="-1" aria-label="Decrease target speed">-</a><input
          class="ext-autothrottle-numberValue numberValue ext-autothrottle-speed" type="text"
          inputmode="decimal" aria-label="Autothrottle target speed" value="0"><a
          class="ext-autothrottle-numberUp numberUp" data-step="1" aria-label="Increase target speed">+</a>
      </div>
      <span class="ext-autothrottle-switch" role="group" aria-label="Speed mode">
        <a class="ext-autothrottle-switchLeft switchLeft" data-speed-mode="knots">KTS</a><a
          class="ext-autothrottle-switchRight switchRight" data-speed-mode="mach">M.</a>
      </span>
    </div>
    <div class="geofs-autopilot-control ext-autothrottle-control ext-autothrottle-landing">
      <div class="ext-autothrottle-value-row">
        <span class="ext-autothrottle-landing-label">LANDING</span>
      </div>
      <span class="ext-autothrottle-switch" id="autothrottle-landing-mode-switch" role="group" aria-label="Landing mode"
            title="Landing mode: when armed, throttle retards to idle by 27 ft RA and deploys spoilers on touchdown">
        <a class="ext-autothrottle-switchLeft switchLeft" data-arm="off">OFF</a><a
          class="ext-autothrottle-switchRight switchRight" data-arm="on">ARM</a>
      </span>
    </div>
  </div>
  <div class="mdl-tooltip" id="autothrottle-tooltip" for="autothrottle-button">Toggle autothrottle on/off</div>
  <div class="mdl-tooltip" id="autothrottle-landing-mode-tooltip" for="autothrottle-landing-mode-switch">Landing mode: when armed, throttle retards to idle at 27 ft RA and deploys spoilers on touchdown</div>
`,Ot=`
  .ext-autothrottle-bar,
  .ext-autothrottle-bar * {
    box-sizing: border-box;
  }
  .ext-autothrottle-bar {
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    vertical-align: var(--geofs-ext-ap-valign, middle);
    pointer-events: all;
    font-weight: 400;
  }
  .ext-autothrottle-bar [hidden] {
    display: none !important;
  }
  ${de("#autothrottle-button.ext-autothrottle-pad")}
  .ext-autothrottle-controls {
    margin-right: 10px;
    display: inline-flex;
    align-items: flex-start;
    gap: 8px;
  }
  .ext-autothrottle-bar .ext-autothrottle-control {
    position: relative;
    margin: 0 5px;
    text-align: center;
    color: #ffffff;
    line-height: 25px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    vertical-align: top;
  }
  .ext-autothrottle-value-row {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    line-height: 25px;
  }
  .ext-autothrottle-bar a {
    user-select: none;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    background: #000000;
    border: 1px solid #ffffff;
    box-shadow: 0 0 5px #000000;
    text-decoration: none;
    font-weight: 400;
  }
  .ext-autothrottle-control .numberDown,
  .ext-autothrottle-control .numberUp {
    position: relative;
    width: 30px;
    height: 25px;
    line-height: 23px;
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    vertical-align: top;
  }
  .ext-autothrottle-control .numberDown {
    border-radius: 15px 0 0 15px;
    margin-right: -5px;
    z-index: 1;
  }
  .ext-autothrottle-control .numberUp {
    border-radius: 0 15px 15px 0;
    margin-left: -5px;
    z-index: 1;
  }
  .ext-autothrottle-control .ext-autothrottle-speed {
    position: relative;
    z-index: 2;
    font: 20px/25px 'LCD-Bold', monospace;
    letter-spacing: 1px;
    vertical-align: top;
    background: #000000;
    color: #ffffff;
    text-align: right;
    width: 50px;
    height: 25px;
    padding: 0 5px;
    margin: 0;
    border: 1px solid #ffffff;
    border-radius: 0;
    box-shadow: 0 0 5px #000000;
  }
  .ext-autothrottle-switch {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    margin: 2px 0 0;
  }
  .ext-autothrottle-switch a {
    position: relative;
    width: 35px;
    height: 17px;
    line-height: 15px;
    text-align: center;
    font-weight: 400;
    font-size: 10px;
  }
  .ext-autothrottle-switchLeft {
    border-radius: 15px 0 0 15px;
    margin-right: -3px;
    z-index: 1;
  }
  .ext-autothrottle-switchRight {
    border-radius: 0 15px 15px 0;
  }
  .ext-autothrottle-landing {
    text-align: center;
  }
  .ext-autothrottle-landing-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    font-family: 'LCD-Bold', monospace;
    font-size: 20px;
    font-weight: 400;
    line-height: 25px;
    letter-spacing: 1px;
    color: #ffffff;
    text-shadow: 0 0 5px #000000;
    white-space: nowrap;
    user-select: none;
  }
  .ext-autothrottle-bar .green-pad {
    border-color: #4caf50 !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.45) !important;
    z-index: 2;
  }
  .ext-autothrottle-bar .red-pad {
    border-color: #ef4444 !important;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.45) !important;
  }
  .ext-autothrottle-reverse {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 8px;
    color: #ef4444;
    font-weight: 900;
    letter-spacing: 1px;
    text-shadow: 0 0 5px #ef4444;
    white-space: nowrap;
  }
  .ext-autothrottle-bar .mdl-tooltip:not(.is-active) {
    position: fixed;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
`;function Y(r,e,t){return Math.max(e,Math.min(t,r))}var Te=class{id="autothrottle";name="Autothrottle";description="GeoFS native PID speed controller with KTS/MACH, landing arm, and OP-SYNC safety.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;engaged=!1;hasEngaged=!1;machMode=!1;landingArmed=!1;landingRetarded=!1;aircraftId=null;targetKias=250;targetMach=.78;reverse;previousSpeed=null;acceleration=0;electricalFailure=!1;opSyncEngaged=!1;opPromptActive=!1;opPromptDismiss=null;sessionOpSyncChoice=null;bar=null;disengageTimer;restoreThrottleAxis;unmounts=[];init(e){this.ctx=e;let t=document.createElement("div");t.className="ext-autothrottle-bar",t.innerHTML=It;let i=document.createElement("style");i.id="geofs-ext-autothrottle-styles",i.textContent=Ot,document.head?.append(i),this.unmounts.push(()=>i.remove()),this.bar=t;for(let o of t.querySelectorAll("a, .ext-autothrottle-pad"))o.tabIndex=0,o.setAttribute("role","button"),o.addEventListener("keydown",l=>{l.key!=="Enter"&&l.key!==" "||(l.preventDefault(),l.repeat||o.click())}),o.addEventListener("click",l=>{l.stopPropagation(),o.id==="autothrottle-button"?this.toggle():o.dataset.step?this.adjustSpeed(o.dataset.step==="1"?1:-1):o.dataset.speedMode?this.setMode(o.dataset.speedMode==="mach"):o.dataset.arm&&(this.landingArmed=o.dataset.arm==="on",this.landingArmed||(this.landingRetarded=!1),this.renderControls())});let n=t.querySelector("input");n.addEventListener("focus",()=>{this.machMode&&(n.value=String(Number(this.targetMach.toFixed(4)))),n.select()}),n.addEventListener("click",()=>n.select());let s=()=>{let o=Number.parseFloat(n.value);!Number.isFinite(o)||o<=0||this.setTarget(o)};n.addEventListener("input",s),n.addEventListener("blur",()=>this.renderControls()),n.addEventListener("change",()=>{s(),this.renderControls()}),this.unmounts.push(e.anchors.mountControl("autothrottle-pad","autopilot",t)),this.attachToAutopilotBar(),this.upgradeTooltips(),this.renderControls();let a=e.getSettings().keybindings.toggleAutothrottle;this.unmounts.push(e.keybinds.register("autothrottle-toggle",a,()=>this.toggle())),this.unmounts.push(e.onEvent("failure:triggered",({type:o})=>{o==="electrical"&&(this.electricalFailure=!0,this.engaged&&this.stop())})),this.unmounts.push(e.onEvent("failure:cleared",({type:o})=>{o==="electrical"&&(this.electricalFailure=!1)})),e.emitEvent("failure:request-active")}upgradedTooltips=new Set;upgradeTooltips(){if(!this.bar||!window.componentHandler?.upgradeElement)return;let e=[];for(let t of this.bar.querySelectorAll(".mdl-tooltip"))if(!this.upgradedTooltips.has(t))try{window.componentHandler.upgradeElement(t),this.upgradedTooltips.add(t),e.push(t)}catch{}e.length>0&&this.unmounts.push(()=>{try{window.componentHandler?.downgradeElements?.(e)}catch{}for(let t of e)this.upgradedTooltips.delete(t)})}attachToAutopilotBar(){if(!this.bar)return;let e=document.querySelector(".geofs-autopilot-bar");e&&this.bar.parentElement!==e&&(e.append(this.bar),this.upgradeTooltips()),this.bar.hidden=!1;let t=this.bar.querySelector("#autothrottle-button");t&&this.ctx?.anchors.syncAutopilotPad(t,this.bar)}setTarget(e){this.machMode?this.targetMach=Y(e,.01,10):this.targetKias=Y(Math.round(e),1,9999),window.geofs?.autopilot?.setSpeed?.(this.machMode?this.targetMach:this.targetKias)}setMode(e){if(e!==this.machMode){let t=window.geofs?.animation?.values,i=t?.kias??0,n=t?.mach??0,s=i>50&&n>.05?Y(i/n,250,1e3):661.47;this.machMode=e,this.previousSpeed=null,this.applyNativeMode(),this.setTarget(e?this.targetKias/s:this.targetMach*s)}this.renderControls()}applyNativeMode(){window.geofs?.autopilot?.setSpeedMode?.(this.machMode?"mach":this.ctx?.sim.getMajorVersion()===3?"knots":"kias")}adjustSpeed(e){let t=this.machMode?Number((this.targetMach+e*.01).toFixed(6)):this.targetKias+e*(this.targetKias<100?5:10);this.setTarget(t),this.renderControls()}suppressThrottleAxis(){let e=window.controls?.axisSetters?.throttle,t=e?.process;if(!e||!t)return;let i=()=>{};e.process=i,this.restoreThrottleAxis=()=>{e.process===i&&(e.process=t)}}toggle(){if(!this.ctx)return;if(this.engaged){this.stop(),this.ctx.anchors.showToast("Autothrottle Disengaged");return}let t=window.geofs?.autopilot,i=t?.PIDs?.throttle,n=this.ctx.sim.buildTelemetrySnapshot(.016,this.ctx.sim.getMajorVersion()??4);if(!n.aircraft||n.crashed||n.aircraft.category==="rotorcraft"||this.electricalFailure||!i){this.ctx.emitDiag?.("AUTOTHROTTLE_ERROR",{level:"error",aircraftId:n.aircraft?.id??null,category:n.aircraft?.category??null,crashed:n.crashed,electricalFailure:this.electricalFailure,hasPid:!!i});return}if(t?.on&&t.turnOff?.(),!t?.on){if(clearTimeout(this.disengageTimer),this.bar?.querySelector("#autothrottle-button")?.classList.remove("red-pad"),!this.hasEngaged){this.machMode=t?.speedMode==="mach";let s=t?.values?.speed,a=this.machMode?n.mach||.8:n.kias||250;this.setTarget(s&&s>0?s:a),this.hasEngaged=!0}this.applyNativeMode(),this.setTarget(this.machMode?this.targetMach:this.targetKias),this.suppressThrottleAxis(),this.engaged=!0,this.aircraftId=n.aircraft.id,this.landingArmed=!1,this.landingRetarded=!1,this.previousSpeed=null,this.acceleration=0,this.sessionOpSyncChoice=null,this.opPromptActive=!1,this.opSyncEngaged=!1,i.initialize?.(n.throttles[0]??0,n.kias),this.ctx.audio.playChime(),this.ctx.anchors.showToast(`Autothrottle Engaged (${this.machMode?`M ${this.targetMach.toFixed(2)}`:`${this.targetKias} KTS`})`),this.renderControls(),this.ctx.emitEvent("autothrottle:state",{engaged:!0})}}dismissOpPrompt(){this.opPromptDismiss?.(),this.opPromptDismiss=null,this.opPromptActive=!1}update(e){if(this.attachToAutopilotBar(),!this.engaged||!this.ctx)return;let t=window.geofs,i=t?.aircraft?.instance,n=e.aircraft,s=i?.definition,a=t?.autopilot?.PIDs?.throttle;if(!n||n.id!==this.aircraftId||n.category==="rotorcraft"||!a||!s||e.crashed||e.autopilotOn||this.electricalFailure){this.stop();return}if(e.paused)return;if(this.landingArmed){if(!e.groundContact&&e.aglFeet>0&&e.aglFeet<=27&&!this.landingRetarded){this.landingRetarded=!0,this.ctx.sim.setThrottle(0),this.ctx.anchors.showToast("Autothrottle Retard (27 ft RA)");return}if(this.landingRetarded&&!e.groundContact){this.ctx.sim.setThrottle(0);return}if(e.groundContact){this.ctx.sim.setThrottle(0),window.controls?.airbrakes&&(window.controls.airbrakes.target=1,window.controls.setters?.setAirbrakes?.set?.()),this.stop(),this.ctx.anchors.showToast("Autothrottle Auto-Retard & Spoilers Deployed");return}}let o=I=>t?.utils?.machToKnots?.(I)??I*661.47,l=this.machMode?o(this.targetMach):this.targetKias,d=this.machMode?o(e.mach):e.kias;if(!Number.isFinite(l)||!Number.isFinite(d)||d<-500||d>25e3)return;this.reverse?.definition!==s&&this.restoreReverse();let c=Y(.8-(e.mach||d/661.47)*.05,.1,.8);!this.reverse&&l<d*c?(this.reverse={definition:s,original:s.reverse},s.reverse=!0):this.reverse&&d<=l*1.05&&this.restoreReverse(),this.bar?.querySelector(".ext-autothrottle-reverse")?.toggleAttribute("hidden",!this.reverse);let u=this.ctx.getSettings(),p=Math.abs(l-d),f=(i?.setup?.mass??1e3)<1e4?200:500,h=Math.max(25,u.opDeltaThresholdKts??150),g=p>=h||l>f||!!(this.reverse&&d>f),b=Math.min(p,5e3),x=b>1e3?b/25*(1+b/1e4):b/100,T=Y((this.reverse?Math.min(d,2500):Math.min(l,5e3))/500+x,1,250),A=u.opSyncPolicy??"ask",w=A==="ask"&&this.sessionOpSyncChoice?this.sessionOpSyncChoice:A,C=null;g?w==="ask"?this.opPromptActive||(this.opPromptActive=!0,this.ctx.emitDiag?.("OPSYNC_PROMPT",{deltaKts:Math.round(p),targetKts:Math.round(l),speedKts:Math.round(d)}),this.opPromptDismiss=this.ctx.anchors.showPromptBanner("op-sync-prompt",`Large speed delta (${Math.round(p)} kts). Allow A/THR to engage OP Engines?`,[{id:"allow-once",label:"Allow Once",variant:"primary",onClick:()=>{this.sessionOpSyncChoice="allow",this.opPromptActive=!1,this.opPromptDismiss=null,this.ctx?.emitDiag?.("OPSYNC_DECISION",{choice:"allow-once"})}},{id:"keep-standard",label:"Keep Standard",variant:"neutral",onClick:()=>{this.sessionOpSyncChoice="never",this.opPromptActive=!1,this.opPromptDismiss=null,this.ctx?.emitDiag?.("OPSYNC_DECISION",{choice:"keep-standard"})}},{id:"always-allow",label:"Always Allow",variant:"primary",onClick:()=>{this.opPromptActive=!1,this.opPromptDismiss=null,this.ctx?.updateSettings({opSyncPolicy:"allow"}),this.ctx?.emitDiag?.("OPSYNC_DECISION",{choice:"always-allow"})}},{id:"never-allow",label:"Never Allow",variant:"danger",onClick:()=>{this.opPromptActive=!1,this.opPromptDismiss=null,this.ctx?.updateSettings({opSyncPolicy:"never"}),this.ctx?.emitDiag?.("OPSYNC_DECISION",{choice:"never-allow"})}}],0)):w==="allow"?(this.dismissOpPrompt(),C=T):this.dismissOpPrompt():this.dismissOpPrompt();let m=C!==null;m!==this.opSyncEngaged&&(this.opSyncEngaged=m,this.ctx.emitEvent("autothrottle:opsync-state",{active:m}),this.ctx.emitDiag?.(m?"OPSYNC_ENGAGED":"OPSYNC_RELEASED",{desired:C}));let v=1;this.ctx.emitEvent("autothrottle:boost",{desired:C,report:I=>{v=I}});let M=Number.isFinite(v)&&v>=1?v:1,S=Y(Number.isFinite(e.dt)?e.dt:.016,.001,.1),E=this.previousSpeed===null?0:(d-this.previousSpeed)/S;this.previousSpeed=d,Math.abs(E*S)<2e3&&(this.acceleration=this.acceleration*.8+E*.2);let k=Y(p/1e3,0,1),F=(50/(M+49)*(1-k)+k)*(1+.2*Math.sin(Math.min(p/150,Math.PI/2))),y=t?.api?.renderingSettings?.physicsDeltaMs,L=y&&y>0?Y(Math.floor(S*1e3/y),1,10):1;a.set(l,this.reverse?-1:0,1);let D=a.compute(d,S/L);if(this.reverse&&(D=-Math.abs(D)),M>1&&this.acceleration>100&&(D*=100/this.acceleration),Number.isFinite(D)){let I=Y(Number.isFinite(u.autothrottleResponsiveness)?u.autothrottleResponsiveness:1,.5,2),_=Y(D*F*I,this.reverse?-1:0,this.reverse?0:1);Number.isFinite(_)&&this.ctx.sim.setThrottle(_)}}restoreReverse(){if(!this.reverse)return;let{definition:e,original:t}=this.reverse;t===void 0?delete e.reverse:e.reverse=t,this.reverse=void 0}stop(){if(!this.engaged)return;this.engaged=!1,this.landingArmed=!1,this.landingRetarded=!1,this.sessionOpSyncChoice=null,this.dismissOpPrompt(),this.opSyncEngaged&&(this.opSyncEngaged=!1,this.ctx?.emitEvent("autothrottle:opsync-state",{active:!1}),this.ctx?.emitDiag?.("OPSYNC_RELEASED",{desired:null})),this.restoreReverse(),this.restoreThrottleAxis?.(),this.restoreThrottleAxis=void 0;let e=this.bar?.querySelector("#autothrottle-button");e?.classList.add("red-pad"),clearTimeout(this.disengageTimer),this.disengageTimer=setTimeout(()=>e?.classList.remove("red-pad"),3e3),this.renderControls(),this.ctx?.emitEvent("autothrottle:state",{engaged:!1})}renderControls(){let e=this.bar;if(!e)return;let t=e.querySelector("#autothrottle-button");t.classList.toggle("green-pad",this.engaged),t.classList.toggle("amber-pad",!this.engaged&&this.landingArmed),t.setAttribute("aria-pressed",String(this.engaged)),e.querySelector(".ext-autothrottle-controls")?.toggleAttribute("hidden",!this.engaged),e.querySelector(".ext-autothrottle-reverse")?.toggleAttribute("hidden",!this.reverse);let i=e.querySelector("input");(typeof document>"u"||document.activeElement!==i)&&(i.value=this.machMode?this.targetMach.toFixed(2):String(this.targetKias)),i.removeAttribute("maxlength"),this.machMode||(i.maxLength=4);for(let n of e.querySelectorAll("[data-speed-mode], [data-arm]")){let s=n.dataset.arm==="off",a=n.dataset.arm?this.landingArmed!==s:this.machMode===(n.dataset.speedMode==="mach");n.classList.toggle("active",a),n.classList.toggle("green-pad",a),n.setAttribute("aria-pressed",String(a))}}onSettingsChange(e){this.ctx?.keybinds.updateCombo("autothrottle-toggle",e.keybindings.toggleAutothrottle),e.opSyncPolicy!=="ask"&&(this.dismissOpPrompt(),this.sessionOpSyncChoice=null)}destroy(){this.stop(),this.electricalFailure=!1;for(let e of this.unmounts)e();this.unmounts=[],clearTimeout(this.disengageTimer),this.disengageTimer=void 0,this.bar=null,this.hasEngaged=!1,this.ctx=null}};var Ht=["Mystery Flying Object","Classified Area 51 Project","Paper Plane with Jet Engines","UFO (Unidentified Flying Object)","Identity Obscured by Clouds","Skunkworks Prototype","Experimental Lawn Ornament","Ghost Flight 99","Stealthy Pizza Delivery","Aerodynamic Brick"];function Ai(r){let e=0;for(let t=0;t<r.length;t++)e=e*31+r.charCodeAt(t)>>>0;return Ht[e%Ht.length]}function X(r,e){return`
    <div style="min-width:0;overflow:hidden;padding:2px 2px;">
      <div style="font-size:8px;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));letter-spacing:0.5px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r}</div>
      <div data-field="${e}" style="font-size:12px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--geofs-ext-fg,#ffffff);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">--</div>
    </div>
  `}var Ce=class{id="information-display";name="Information Display";description="GeoFS Native HUD telemetry grid with registry badge, trend indicators, glideslope, and multi-engine % THR.";supportedMajors=[3,4];defaultEnabled=!0;rootEl=null;unmountTab=null;cells=new Map;lastAcKey="";lastKias=0;trend="";activePushMode="off";init(e){let t=document.createElement("div");t.style.cssText="display:flex;flex-direction:column;gap:5px;width:100%;color:var(--geofs-ext-fg,#ffffff);",t.innerHTML=`
      <div id="hud-ac-header" style="padding-bottom:5px;border-bottom:1px solid var(--geofs-ext-divider,rgba(255,255,255,0.14));">
        <div id="hud-ac-name" data-field="ac-name" style="font-size:11px;font-weight:700;color:var(--geofs-ext-fg,#ffffff);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Loading Aircraft...</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:3px;">
          <span id="hud-ac-id-badge" data-field="ac-id" style="display:inline-block;font-size:9px;padding:1px 5px;background:#0d5f8d;color:#ffffff;border-radius:2px;font-weight:700;white-space:nowrap;">ID: --</span>
          <span data-field="ac-cat" style="font-size:9px;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">--</span>
        </div>
      </div>
      <div class="hud-section-header" style="font-size:8.5px;font-weight:700;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));text-transform:uppercase;letter-spacing:0.6px;">Performance</div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3px 8px;">
        ${X("KTS KIAS","kias")}
        ${X("FT ALT","alt")}
        ${X("FPM V/S","vs")}
        ${X("DEG HDG","hdg")}
        <div style="grid-column:span 2;min-width:0;overflow:hidden;padding:3px 2px;border-top:1px solid var(--geofs-ext-divider,rgba(255,255,255,0.14));display:flex;justify-content:space-between;align-items:center;gap:6px;">
          <span data-field="power-label" style="font-size:8px;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));letter-spacing:0.5px;text-transform:uppercase;white-space:nowrap;">% THR</span>
          <strong data-field="thr" style="font-size:11px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--geofs-ext-fg,#ffffff);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">--</strong>
        </div>
      </div>
      <div class="hud-section-header" style="font-size:8.5px;font-weight:700;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));text-transform:uppercase;letter-spacing:0.6px;margin-top:1px;padding-top:3px;border-top:1px solid var(--geofs-ext-divider,rgba(255,255,255,0.14));">Additional Data</div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 8px;">
        ${X("M MACH","mach")}
        ${X("DEG AOA","aoa")}
        ${X("G G-FORCE","g")}
        ${X("FT AGL","agl")}
        ${X("KTS GS","gs")}
        ${X("DEG GSLOPE","glideslope")}
      </div>
      <div style="display:flex;justify-content:space-between;gap:6px;font-size:9px;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));padding-top:4px;border-top:1px solid var(--geofs-ext-divider,rgba(255,255,255,0.14));">
        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">FLAPS: <strong data-field="flaps" style="color:var(--geofs-ext-fg,#ffffff);">--</strong></span>
        <span style="white-space:nowrap;">GEAR: <strong data-field="gear" style="color:var(--geofs-ext-fg,#ffffff);">--</strong></span>
        <span style="white-space:nowrap;">BRK: <strong data-field="brk" style="color:var(--geofs-ext-fg,#ffffff);">--</strong></span>
      </div>
      <div data-field="rotor-torque" hidden style="font-size:9px;color:var(--geofs-ext-sky,#00bbff);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
      <div data-field="v-speeds" style="font-size:9px;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
      <div style="display:flex;gap:2px;padding-top:3px;border-top:1px solid var(--geofs-ext-divider,rgba(255,255,255,0.14));">
        <button type="button" data-toggle="metar" style="flex:1;background:transparent;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));border:none;border-bottom:2px solid transparent;padding:3px 4px;font-size:8.5px;font-weight:700;cursor:pointer;">METAR</button>
        <button type="button" data-toggle="minimap" style="flex:1;background:transparent;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));border:none;border-bottom:2px solid transparent;padding:3px 4px;font-size:8.5px;font-weight:700;cursor:pointer;">MINI-MAP</button>
        <button type="button" data-toggle="tug" style="flex:1;background:transparent;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));border:none;border-bottom:2px solid transparent;padding:3px 4px;font-size:8.5px;font-weight:700;cursor:pointer;">TUG</button>
      </div>
      <div data-panel="metar" hidden style="font-size:8.5px;line-height:1.35;color:var(--geofs-ext-fg,#ffffff);padding:4px 2px;word-break:break-word;">--</div>
      <div data-panel="minimap" hidden style="background:var(--geofs-ext-radar-bg,#000000);border:1px solid var(--geofs-ext-divider,rgba(255,255,255,0.14));border-radius:6px;padding:3px;">
        <svg data-field="minimap-svg" viewBox="-90 -48 180 96" style="width:100%;height:88px;display:block;"></svg>
        <div data-field="minimap-info" style="font-size:8px;color:var(--geofs-ext-muted,rgba(255,255,255,0.58));text-align:center;margin-top:2px;">No runway nearby</div>
      </div>
      <div data-panel="tug" hidden style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:3px;padding:3px 0;">
        <button type="button" data-push="left" style="background:var(--geofs-ext-divider,rgba(255,255,255,0.12));color:var(--geofs-ext-fg,#ffffff);border:none;border-radius:3px;padding:3px 2px;font-size:8px;font-weight:700;cursor:pointer;">L</button>
        <button type="button" data-push="straight" style="background:var(--geofs-ext-divider,rgba(255,255,255,0.12));color:var(--geofs-ext-fg,#ffffff);border:none;border-radius:3px;padding:3px 2px;font-size:8px;font-weight:700;cursor:pointer;">BACK</button>
        <button type="button" data-push="right" style="background:var(--geofs-ext-divider,rgba(255,255,255,0.12));color:var(--geofs-ext-fg,#ffffff);border:none;border-radius:3px;padding:3px 2px;font-size:8px;font-weight:700;cursor:pointer;">R</button>
        <button type="button" data-push="off" style="background:#d50000;color:#ffffff;border:none;border-radius:3px;padding:3px 2px;font-size:8px;font-weight:700;cursor:pointer;">STOP</button>
        <button type="button" data-walk-toggle style="background:#0d5f8d;color:#ffffff;border:none;border-radius:3px;padding:3px 2px;font-size:8px;font-weight:700;cursor:pointer;" title="Pre-Flight Walkaround (Alt+W)">WALK</button>
      </div>
    `,t.querySelectorAll("[data-field]").forEach(u=>{let p=u.dataset.field;p&&this.cells.set(p,u)});let i=t.querySelector('[data-toggle="metar"]'),n=t.querySelector('[data-toggle="minimap"]'),s=t.querySelector('[data-toggle="tug"]'),a=t.querySelector('[data-panel="metar"]'),o=t.querySelector('[data-panel="minimap"]'),l=t.querySelector('[data-panel="tug"]'),d=[[i,a],[n,o],[s,l]],c=u=>{let p=d[u]?.[1];if(!p)return;let f=p.hidden;d.forEach(([h,g],b)=>{if(!g||!h)return;let x=b===u?f:!1;g.hidden=!x,h.style.color=x?"var(--geofs-ext-accent,#ffc107)":"var(--geofs-ext-muted,rgba(255,255,255,0.58))",h.style.borderBottomColor=x?"var(--geofs-ext-accent,#ffc107)":"transparent"})};i?.addEventListener("click",()=>c(0)),n?.addEventListener("click",()=>c(1)),s?.addEventListener("click",()=>c(2)),t.querySelectorAll("[data-push]").forEach(u=>{u.addEventListener("click",()=>{let p=u.dataset.push||"off";this.activePushMode=p,t.querySelectorAll("[data-push]").forEach(f=>{let h=f.dataset.push==="off",g=!h&&f.dataset.push===p;f.style.outline=g?"1px solid #ffc107":"none",f.style.color=h?"#ffffff":g?"#ffc107":"var(--geofs-ext-fg,#ffffff)"}),window.dispatchEvent(new CustomEvent("geofs-ext:pushback",{detail:{mode:p}}))})}),t.querySelector("[data-walk-toggle]")?.addEventListener("click",()=>{window.dispatchEvent(new CustomEvent("geofs-ext:walkaround"))}),this.rootEl=t,this.unmountTab=e.anchors.registerHudTab("info","INFO",t,!0)}update(e){if(!this.rootEl)return;let t=e.aircraft,i=t?`${t.id}:${t.name}:${t.isDynamic}`:"none";if(i!==this.lastAcKey){this.lastAcKey=i;let f=this.cells.get("ac-name"),h=this.cells.get("ac-id");if(t&&f&&h){let g=t.isDynamic&&t.name===`Aircraft ${t.id}`;if(!t.isDynamic)f.textContent=t.name,f.title=t.name,h.style.background="#0d5f8d",h.style.color="#ffffff",h.textContent=`REG: ${t.id}`;else if(!g)f.textContent=t.name,f.title=`${t.name} (Dynamic Profile)`,h.style.background="#00bbff",h.style.color="#000000",h.textContent=`AUTO: ${t.id}`;else{let b=Ai(t.id);f.textContent=`${b} (${t.name})`,f.title=`${b} (${t.name})`,h.style.background="var(--geofs-ext-surface)",h.style.color="var(--geofs-ext-fg)",h.textContent=`ID: ${t.id}`}}else f&&h&&(f.textContent="No Aircraft",h.style.background="var(--geofs-ext-surface)",h.style.color="var(--geofs-ext-fg)",h.textContent="ID: --")}Math.abs(e.kias-this.lastKias)>.1?(this.trend=e.kias>this.lastKias?" \u25B2":" \u25BC",this.lastKias=e.kias):Math.abs(e.kias-this.lastKias)<.01&&(this.trend=""),this.setText("ac-cat",t?.category??"--"),this.setText("kias",`${e.kias.toFixed(1)}${this.trend}`),this.setText("mach",e.mach.toFixed(2)),this.setText("alt",`${Math.round(e.altitude).toLocaleString()}`);let n=e.vs>100?"#16a34a":e.vs<-1e3?"#d50000":"var(--geofs-ext-fg)";this.setText("vs",`${Math.round(e.vs)}`,n),this.setText("hdg",`${Math.round(e.heading).toString().padStart(3,"0")}\xB0`),this.setText("agl",`${Math.round(e.aglFeet).toLocaleString()}`),this.setText("gs",`${e.groundSpeed.toFixed(1)}`),this.setText("glideslope",e.glideslopeDeviation===void 0?"--":`${e.glideslopeDeviation.toFixed(1)}\xB0`);let s=e.aoa>16?"#d50000":e.aoa>12?"#d97706":"var(--geofs-ext-fg)";this.setText("aoa",`${e.aoa.toFixed(1)}\xB0`,s);let a=e.gForce>3||e.gForce<-1?"#d50000":"var(--geofs-ext-fg)";this.setText("g",e.gForce.toFixed(1),a),this.setText("flaps",`${e.flapsTarget}/${t?.maxFlaps??0}`),this.setText("gear",e.gearDown?"DOWN":"UP",e.gearDown?"#16a34a":"var(--geofs-ext-fg)"),this.setText("brk",e.parkingBrake?"PARK":"OFF",e.parkingBrake?"#d97706":"var(--geofs-ext-fg)");let o=pe(t?.vSpeeds,t?.machSpeeds);this.setText("v-speeds",o);let l=this.cells.get("v-speeds");l&&(l.hidden=!o,l.title=o);let d=t?.category==="rotorcraft",c=this.cells.get("rotor-torque");if(c&&(c.hidden=!d),this.setText("power-label",d?"% COLL":"% THR"),d){this.setText("thr",e.collective===null?"\u2014":`${Math.round(e.collective*100)}%`),this.setText("rotor-torque",`Rotor Torque: ${e.rotorTorque??"\u2014"}`);return}let u=e.reverserActive?"[REV] ":"",p=e.throttles.map(f=>`${Math.round(f*100)}%`).join("/");this.setText("thr",`${u}${p}`,e.reverserActive?"#d97706":"var(--geofs-ext-fg)"),this.updateMetarAndMinimap(e)}updateMetarAndMinimap(e){let t=this.rootEl?.querySelector('[data-toggle="tug"]'),i=this.rootEl?.querySelector('[data-panel="tug"]'),n=!e.groundContact&&e.aglFeet>50;t&&(t.hidden=n,n&&i&&!i.hidden&&(i.hidden=!0,t.style.color="var(--geofs-ext-muted)",t.style.borderBottomColor="transparent"));let s=this.rootEl?.querySelector('[data-panel="metar"]'),a=window.geofs?.runways?.nearRunways,o="",l=1/0,d=[];if(a&&Number.isFinite(e.lat)&&Number.isFinite(e.lon)){let p=Math.max(.1,Math.cos(e.lat*Math.PI/180)),f=60,h=60*p,g=6;for(let b of Object.values(a)){let x=b?.threshold1,T=b?.threshold2;if(!Array.isArray(x)||!Array.isArray(T)||x.length<2||T.length<2)continue;let A=(x[1]-e.lon)*h*g,w=-(x[0]-e.lat)*f*g,C=(T[1]-e.lon)*h*g,m=-(T[0]-e.lat)*f*g,v=Math.hypot((A+C)/2,(w+m)/2)/g;v<l&&(l=v,o=b.icao??"RWY"),v<=20&&d.push({x1:A,y1:w,x2:C,y2:m,icao:b.icao??""})}}if(s&&!s.hidden){let p=window.geofs?.environment?.metar,f=window.weather?.currentWindSpeed;if(p?.raw)s.textContent=`${o?`[${o}] `:""}${p.raw}`;else{let h=[];o&&h.push(`NEAR: ${o} (${l.toFixed(1)} NM)`),typeof p?.temp=="number"&&h.push(`${Math.round(p.temp)}\xB0C`),typeof f=="number"&&h.push(`WIND ${Math.round(f)}KT`),typeof p?.visibility=="number"&&h.push(`VIS ${Math.round(p.visibility)}M`),typeof p?.clouds=="number"&&h.push(`CLD ${Math.round(p.clouds)}%`),s.textContent=h.length>0?h.join(" \xB7 "):"METAR unavailable"}}let c=this.rootEl?.querySelector('[data-panel="minimap"]'),u=this.cells.get("minimap-svg");if(c&&!c.hidden&&u){let p=d.map(m=>`<line x1="${m.x1.toFixed(1)}" y1="${m.y1.toFixed(1)}" x2="${m.x2.toFixed(1)}" y2="${m.y2.toFixed(1)}" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/>`).join(""),f=[],h=0,g=window.geofs?.multiplayer?.users;if(g&&Number.isFinite(e.lat)&&Number.isFinite(e.lon)){let m=Math.max(.1,Math.cos(e.lat*Math.PI/180)),v=6;for(let M of Object.values(g)){let S=M?.lla??M?.lastUpdate?.co;if(!Array.isArray(S)||S.length<2)continue;let E=Number(S[0]),k=Number(S[1]);if(!Number.isFinite(E)||!Number.isFinite(k))continue;let F=(k-e.lon)*60*m*v,y=-(E-e.lat)*60*v,L=Math.hypot(F,y)/v;if(L>20||L<.01)continue;h++;let D=Number.isFinite(S[2])?Number(S[2])*3.28084:e.altitude,I=Math.round((D-e.altitude)/100),_=`${I>=0?"+":""}${I}`;f.push(`<g transform="translate(${F.toFixed(1)},${y.toFixed(1)})"><polygon points="0,-3 3,0 0,3 -3,0" fill="#f59e0b"/><text x="4" y="2.5" font-size="6" fill="#fbbf24" font-weight="700">${_}</text></g>`)}}let b=this.rootEl?.querySelector('[data-panel="tug"]'),x=!!(b&&!b.hidden||this.activePushMode!=="off"),T="";if(x){let m=this.activePushMode;T=`<path d="${m==="left"?"M 0 5 Q 0 22 -18 22":m==="right"?"M 0 5 Q 0 22 18 22":"M 0 5 L 0 26"}" fill="none" stroke="${m==="off"?"rgba(56,189,248,0.55)":"#38bdf8"}" stroke-width="1.6" stroke-dasharray="3,2" stroke-linecap="round"/>`}let A=Number.isFinite(e.heading)?e.heading:0;u.innerHTML=`
        <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(148,163,184,0.22)" stroke-width="0.8" stroke-dasharray="2,2"/>
        <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(148,163,184,0.14)" stroke-width="0.8"/>
        ${p}
        ${f.join("")}
        <g transform="rotate(${A.toFixed(1)})">
          ${T}
          <polygon points="0,-6 4,5 0,2 -4,5" fill="#10b981"/>
        </g>
      `;let w=o?`${o} \xB7 ${l.toFixed(1)} NM`:"No runway < 20 NM",C=h>0?` \xB7 ${h} TFC`:"";this.setText("minimap-info",`${w}${C}`)}}setText(e,t,i=""){let n=this.cells.get(e);n&&(n.textContent!==t&&(n.textContent=t),n.style.color=i)}destroy(){this.unmountTab?.(),this.unmountTab=null,this.cells.clear(),this.lastAcKey="",this.lastKias=0,this.trend="",this.rootEl=null}};function Ti(r,e,t,i){if(!Number.isFinite(t)||t<=0||!Number.isFinite(i)||i<=0)return null;let n=d=>{if(Array.isArray(d)&&d.length===3&&d.every(c=>typeof c=="number"&&Number.isFinite(c)&&c>0))return[d[0],d[1],d[2]];if(d&&typeof d=="object"){let c=d,u=g=>{if(typeof g=="number"&&Number.isFinite(g)&&g>0)return g;if(typeof g=="function")try{let b=g.call(d);if(typeof b=="number"&&Number.isFinite(b)&&b>0)return b}catch{return null}return null},p=u(c.x),f=u(c.y),h=u(c.z);if(p!==null&&f!==null&&h!==null)return[p,f,h]}return null},s=null,a=r;for(let d of["inertia","localInertia","inertiaTensor"]){let c=n(a?.[d]);if(c){s=c;break}}if(!s&&typeof a?.getInvInertiaDiagLocal=="function")try{let d=n(a.getInvInertiaDiagLocal());if(d){let c=[1/d[0],1/d[1],1/d[2]];c.every(u=>Number.isFinite(u)&&u>0)&&(s=c)}}catch{s=null}if(!s){let d=n(e?.inertiaTensor);d&&(t>100&&Math.min(...d)<=5||(s=d))}if(!s)return null;let o=Math.max(.25,Math.min(4,i/t)),l=[s[0]*o,s[1]*o,s[2]*o];return l.every(d=>Number.isFinite(d)&&d>0)?{base:s,scaled:l}:null}function Ci(r,e,t=!1){if(r.engine?.on===!1)return 0;let i=e.aircraft,n=i?.name??"";if(i?.id==="2953"||/atlantis/i.test(n))return 0;let s=Number(r.definition?.maxThrust),a=Number.isFinite(s)&&s>0?s:0,o=r.engines,l=b=>b.on===!1?0:typeof b.currentThrust=="number"&&Number.isFinite(b.currentThrust)?Math.abs(b.currentThrust):typeof b.thrust=="number"&&Number.isFinite(b.thrust)?Math.max(0,b.thrust):0,d=o?.reduce((b,x)=>b+l(x),0)??0;if(e.simMajor===4&&!o?.length&&(d=Object.values(r.parts??{}).reduce((b,x)=>b+l(x),0)),d<=0&&a>0){let b=e.throttles.length?e.throttles:[0],x=b.reduce((T,A)=>T+(Number.isFinite(A)?Math.abs(A):0),0)/b.length;d=a*x}let c=Number.isFinite(e.altitude)?e.altitude:0,u=/shuttle|rocket|x-15/i.test(n)?.85:a>5e4?.0075:.0095,p=t?Math.max(.1,1-c/5e4)**1.1:1,f=e.reverserActive||e.throttles.some(b=>Number.isFinite(b)&&b<-.05),h=e.simMajor===4&&f?1.35:1,g=d*u*p*h;return Number.isFinite(g)&&g>=0?g:0}var ne=[["fuelDynamicSfc","ALTITUDE BURN","Scales fuel consumption with air density, altitude, and multi-throttle reverse thrust"],["fuelRealisticTanks","REAL TANKS","Drains center tank first, then wing tanks with roll imbalance physics"],["fuelAutoRefuel","AUTO-REFUEL","Automatically maintains 100% fuel load"]];function Mi(r,e){let t=Number.isFinite(e)&&e>0?e:0,i=Math.max(0,r.center-t),n=Math.max(0,t-r.center)/2;return{center:i,left:Math.max(0,r.left-n),right:Math.max(0,r.right-n)}}var ki=`
  .geofs-ext-fuel-root {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    font-family: Helvetica, Arial, sans-serif;
  }
  .geofs-ext-fuel-bar-track {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 3px;
  }
  .geofs-ext-fuel-bar-fill {
    height: 100%;
    background: #4caf50;
    transition: width 0.2s ease, background 0.2s ease;
  }
  .geofs-ext-fuel-btn {
    background: #000000;
    color: #cccccc;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 5px 6px;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .geofs-ext-fuel-btn.is-active {
    background: rgba(34, 197, 94, 0.2);
    border-color: #4caf50;
    color: #ffffff;
  }
`,Me=class{id="fuel-simulator";name="Fuel Simulator";description="Multi-engine specific fuel consumption physics with tank burn, flameout lock, and mass sync.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;unmountTab=null;styleEl=null;aircraft;massTarget;massSyncElapsed=0;fuelKg=0;maxFuelKg=0;flameoutTriggered=!1;tanks={left:0,center:0,right:0};lowAlert=!1;bingoAlert=!1;panel=null;weightEl=null;tanksEl=null;statusEl=null;slider=null;sliderLabelEl=null;barFillEl=null;pctEl=null;burnEl=null;init(e){if(this.ctx=e,typeof document<"u"){let n=document.createElement("style");n.id="geofs-ext-fuel-styles",n.textContent=ki,document.head?.appendChild(n),this.styleEl=n}let t=document.createElement("div");t.className="geofs-ext-fuel-root",t.innerHTML=`
      <div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:10px;color:#aaaaaa;text-transform:uppercase;">Fuel Quantity</span>
          <strong data-role="pct" style="font-size:18px;font-weight:700;color:#ffffff;">--%</strong>
        </div>
        <div class="geofs-ext-fuel-bar-track"><div data-role="bar-fill" class="geofs-ext-fuel-bar-fill" style="width:100%;"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;font-size:11px;">
        <div>
          <div style="font-size:9px;color:#aaaaaa;text-transform:uppercase;">Burn Rate</div>
          <strong data-role="burn" style="font-size:12px;white-space:nowrap;">0 kg/h</strong>
        </div>
        <div>
          <div style="font-size:9px;color:#aaaaaa;text-transform:uppercase;">Gross Weight</div>
          <strong data-role="weight" style="font-size:12px;white-space:nowrap;">\u2014</strong>
        </div>
      </div>
      <div data-role="tanks" style="font-size:9px;color:#9ca3af;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Tanks L/C/R: \u2014</div>
      <div>
        <input type="range" min="0" max="100" step="1" value="100" data-role="slider" style="width:100%;margin:0;accent-color:#4caf50;cursor:pointer;">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:#aaaaaa;margin-top:2px;">
          <span>SET FUEL</span><span data-role="slider-label">100%</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;">
        <button type="button" class="geofs-ext-fuel-btn" data-role="fuelDynamicSfc" title="${ne[0][2]}">${ne[0][1]}</button>
        <button type="button" class="geofs-ext-fuel-btn" data-role="fuelRealisticTanks" title="${ne[1][2]}">${ne[1][1]}</button>
        <button type="button" class="geofs-ext-fuel-btn" data-role="fuelAutoRefuel" title="${ne[2][2]}">${ne[2][1]}</button>
        <button type="button" class="geofs-ext-fuel-btn" data-role="refuel" style="border-color:#4caf50;color:#ffffff;">REFUEL 100%</button>
      </div>
      <div data-role="status" style="font-size:9px;font-weight:700;color:#4caf50;text-align:center;letter-spacing:0.6px;white-space:nowrap;">SYSTEMS LIVE</div>
    `,this.pctEl=t.querySelector('[data-role="pct"]'),this.barFillEl=t.querySelector('[data-role="bar-fill"]'),this.burnEl=t.querySelector('[data-role="burn"]'),this.weightEl=t.querySelector('[data-role="weight"]'),this.tanksEl=t.querySelector('[data-role="tanks"]'),this.slider=t.querySelector('[data-role="slider"]'),this.sliderLabelEl=t.querySelector('[data-role="slider-label"]'),this.statusEl=t.querySelector('[data-role="status"]'),this.panel=t;let i=n=>{if(!this.aircraft||this.maxFuelKg<=0||!Number.isFinite(n))return;let s=Math.max(0,Math.min(100,n));this.fuelKg=s/100*this.maxFuelKg,this.fuelKg>0&&this.restoreFuelEngine(),this.distributeFuel(),this.massSyncElapsed=1,this.sliderLabelEl&&(this.sliderLabelEl.textContent=`${Math.round(s)}%`),e.anchors.showToast(`Fuel set to ${Math.round(s)}%`)};this.slider?.addEventListener("input",()=>{this.sliderLabelEl&&(this.sliderLabelEl.textContent=`${Math.round(this.slider?.valueAsNumber??100)}%`)}),this.slider?.addEventListener("change",()=>i(this.slider?.valueAsNumber??100)),t.querySelector('[data-role="refuel"]')?.addEventListener("click",()=>i(100));for(let[n]of ne)t.querySelector(`[data-role="${n}"]`)?.addEventListener("click",()=>{e.updateSettings({[n]:!e.getSettings()[n]})});this.onSettingsChange(e.getSettings()),this.unmountTab=e.anchors.registerHudTab("fuel","FUEL",t)}onSettingsChange(e){for(let[t]of ne){let i=this.panel?.querySelector(`[data-role="${t}"]`);i?.classList.toggle("is-active",!!e[t]),i?.setAttribute("aria-pressed",String(!!e[t]))}}distributeFuel(){this.tanks={left:this.fuelKg*.3,center:this.fuelKg*.4,right:this.fuelKg*.3}}update(e){let t=window.geofs?.aircraft?.instance,i=e.aircraft;if(t!==this.aircraft){this.restoreMass(),this.aircraft=t;let f=typeof i?.maxFuel=="number"&&Number.isFinite(i.maxFuel)&&i.maxFuel>0?i.maxFuel:0;this.fuelKg=this.maxFuelKg=f,this.flameoutTriggered=!1,this.distributeFuel(),this.lowAlert=this.bingoAlert=!1,this.massSyncElapsed=1}if(!t?.definition||!i)return;let n=Number.isFinite(i.maxFuel)&&i.maxFuel>0?i.maxFuel:0;if(this.maxFuelKg!==n){let f=this.maxFuelKg>0?this.fuelKg/this.maxFuelKg:1;this.maxFuelKg=n,this.fuelKg=f*this.maxFuelKg,this.distributeFuel(),this.fuelKg>0&&this.restoreFuelEngine()}if(this.maxFuelKg<=0){this.restoreMass(),this.pctEl&&(this.pctEl.textContent="\u2014"),this.burnEl&&(this.burnEl.textContent="\u2014"),this.weightEl&&(this.weightEl.textContent="\u2014"),this.tanksEl&&(this.tanksEl.textContent="Tanks L/C/R: \u2014");return}if(e.paused||e.crashed){this.pctEl&&(this.pctEl.textContent=`${(this.fuelKg/this.maxFuelKg*100).toFixed(1)}%`),this.burnEl&&(this.burnEl.textContent="0 kg/h");return}let s=this.ctx?.getSettings(),a=Number.isFinite(e.dt)&&e.dt>0?Math.min(e.dt,1):0,o=Ci(t,e,!!s?.fuelDynamicSfc),l=o*a/3600,d=Number.isFinite(l)&&l>0?Math.min(this.fuelKg,l):0;this.fuelKg=Number.isFinite(this.fuelKg)?Math.max(0,this.fuelKg-d):this.maxFuelKg;let c=i.id==="2953"||/atlantis/i.test(i.name);if(s?.fuelAutoRefuel||c)this.fuelKg=this.maxFuelKg,this.restoreFuelEngine(),this.distributeFuel();else if(s?.fuelRealisticTanks){this.tanks=Mi(this.tanks,d);let f=this.tanks.left-this.tanks.right,h=t.object3d?.worldRotation?.[0];if(!e.groundContact&&e.kias>=10&&Array.isArray(h)&&h.length>=3&&Number.isFinite(f)&&Math.abs(f)>10&&Number.isFinite(h[0])&&Number.isFinite(h[1])&&Number.isFinite(h[2])){let g=Math.hypot(h[0],h[1],h[2]),b=Math.max(-5,Math.min(5,f*1e-6));if(g>.001&&Number.isFinite(g)&&Number.isFinite(b)){let x=1/g;t.rigidBody?.applyTorque?.([h[0]*x*b,h[1]*x*b,h[2]*x*b])}}}else this.distributeFuel();if(this.fuelKg<=0&&(this.fuelKg=0,!this.flameoutTriggered&&t.engine?.on!==!1&&(this.flameoutTriggered=this.ctx?.sim.stopEngines()??!1,this.flameoutTriggered&&(this.ctx?.emitEvent("fuel:exhausted",{aircraftId:i.id}),this.ctx?.anchors.showToast("FUEL EXHAUSTED \u2014 ENGINE FLAMEOUT","critical"))),this.flameoutTriggered&&this.ctx?.sim.setThrottle(0)),!c&&(this.massSyncElapsed+=a,this.massSyncElapsed>=1)){this.massSyncElapsed=0;let f=Math.max(i.mtow*.1,i.mtow-i.oew-i.maxFuel)*.5,h=i.oew+f+this.fuelKg;Number.isFinite(h)&&h>0&&(this.syncMass(t,h),this.weightEl&&(this.weightEl.textContent=`${Math.round(h).toLocaleString()} kg`))}let u=this.fuelKg/this.maxFuelKg*100;u<5&&!this.bingoAlert?(this.ctx?.anchors.showToast("Bingo Fuel \u2014 Emergency Declared","critical"),this.bingoAlert=!0):u<15&&!this.lowAlert?(this.ctx?.anchors.showToast("Low Fuel Alert","warn"),this.lowAlert=!0):u>16&&(this.lowAlert=this.bingoAlert=!1),this.slider&&(typeof document>"u"||document.activeElement!==this.slider)&&(this.slider.value=String(Math.round(u)),this.sliderLabelEl&&(this.sliderLabelEl.textContent=`${Math.round(u)}%`)),this.pctEl&&(this.pctEl.textContent=`${u.toFixed(1)}%`),this.barFillEl&&(this.barFillEl.style.width=`${Math.max(0,Math.min(100,u)).toFixed(1)}%`,this.barFillEl.style.background=u<5?"#ef4444":u<15?"#eab308":"#4caf50");let p=Math.round(this.fuelKg>0?o:0);this.burnEl&&(this.burnEl.textContent=`${p.toLocaleString()} kg/h`),this.tanksEl&&(this.tanksEl.textContent=`Tanks L/C/R: ${Math.round(this.tanks.left)} / ${Math.round(this.tanks.center)} / ${Math.round(this.tanks.right)} kg`),this.statusEl&&(this.fuelKg<=0?(this.statusEl.textContent="EMPTY \u2014 THROTTLE LOCKED",this.statusEl.style.color="#ef4444"):u<5?(this.statusEl.textContent="BINGO FUEL EMERGENCY",this.statusEl.style.color="#ef4444"):u<15?(this.statusEl.textContent="LOW FUEL ADVISORY",this.statusEl.style.color="#eab308"):(this.statusEl.textContent="SYSTEMS LIVE",this.statusEl.style.color="#4caf50")),this.ctx?.emitEvent("fuel:state",{pct:u,burnKgHr:p})}syncMass(e,t){let i=e.rigidBody,n=e.definition;if((i!==this.massTarget?.body||n!==this.massTarget?.definition)&&this.restoreMass(),!n||!Number.isFinite(t)||t<=0)return;let s=Math.max(1,Math.min(1e7,t)),a=n.mass,o=Math.abs((a??0)-s)>5;if(!this.massTarget){let d=typeof i?.mass=="number"&&Number.isFinite(i.mass)&&i.mass>0?i.mass:a;this.massTarget={definition:n,originalDefinitionMass:a,body:i,originalMass:d,originalInertia:null,lastBodyMass:d,calledSetMassProps:!1}}n.mass=s;let l=!1;if(i&&typeof i.setMassProps=="function"&&this.massTarget.originalMass!==void 0){let d=Ti(i,n,this.massTarget.originalMass,s);if(d){this.massTarget.originalInertia||(this.massTarget.originalInertia=d.base);let c=this.massTarget.lastBodyMass??this.massTarget.originalMass;(!this.massTarget.calledSetMassProps||Math.abs(c-s)>25)&&(i.setMassProps(s,d.scaled),this.massTarget.calledSetMassProps=!0,this.massTarget.lastBodyMass=s,l=!0)}}(o||l)&&this.ctx?.emitDiag?.("FUEL_MASS_SYNC",{massKg:Math.round(s),fuelKg:Math.round(this.fuelKg),rigidBodySynced:this.massTarget.calledSetMassProps})}restoreMass(){let e=this.massTarget;e&&(e.originalDefinitionMass===void 0?delete e.definition.mass:e.definition.mass=e.originalDefinitionMass,e.calledSetMassProps&&e.body&&typeof e.body.setMassProps=="function"&&e.originalMass!==void 0&&e.originalInertia&&e.body.setMassProps(e.originalMass,e.originalInertia)),this.massTarget=void 0}restoreFuelEngine(){!this.flameoutTriggered||!this.aircraft||this.aircraft.crashed||this.aircraft===window.geofs?.aircraft?.instance&&(this.aircraft.startEngines?this.aircraft.startEngines():this.aircraft.startEngine?.(),this.flameoutTriggered=!1)}destroy(){this.restoreMass(),this.aircraft=void 0,this.unmountTab?.(),this.unmountTab=null,this.styleEl?.remove(),this.styleEl=null,this.pctEl=null,this.barFillEl=null,this.burnEl=null,this.weightEl=null,this.tanksEl=null,this.statusEl=null,this.slider=null,this.sliderLabelEl=null,this.panel=null,this.ctx=null}};var Gt=["thrust","afterBurnerThrust","reverseThrust"];function H(r,e,t){return Math.max(e,Math.min(t,r))}function _t(r){return r>=1e12?`${(r/1e12).toFixed(1)}T`:r>=1e9?`${(r/1e9).toFixed(1)}B`:r>=1e6?`${(r/1e6).toFixed(1)}M`:Math.round(r).toLocaleString()}function Fi(r,e=.03){let t=Number(r?.rawRoll??r?.roll??0),i=Number(r?.rawPitch??r?.pitch??0),n=Number(r?.rawYaw??r?.yaw??0),s=Number.isFinite(t)?t:0,a=Number.isFinite(i)?i:0,o=Number.isFinite(n)?n:0,l=Math.max(Math.abs(s),Math.abs(a),Math.abs(o))>e;return{roll:s,pitch:a,yaw:o,controlling:l}}var lt=class{targetPitch=null;targetRoll=null;wasControlling=!1;pitchIntegral=0;rollIntegral=0;prevPitchDeg=null;prevRollDeg=null;lastCmdPitch=0;lastCmdRoll=0;reset(){this.targetPitch=null,this.targetRoll=null,this.wasControlling=!1,this.pitchIntegral=0,this.rollIntegral=0,this.prevPitchDeg=null,this.prevRollDeg=null,this.lastCmdPitch=0,this.lastCmdRoll=0}step(e){let{rigidBody:t,controls:i,pitchDeg:n,rollDeg:s,kias:a,multiplier:o,sasStrength:l,groundContact:d,autopilotOn:c}=e;if(d||c)return this.reset(),{mode:"hold",controlling:!1,nextAngularVelocity:null};let u=Fi(i),p=i?.rawPitch===void 0&&i?.pitch!==void 0,f=i?.rawRoll===void 0&&i?.roll!==void 0,h=p?Math.abs((i?.pitch??0)-this.lastCmdPitch)>.03:Math.abs(u.pitch)>.03,g=f?Math.abs((i?.roll??0)-this.lastCmdRoll)>.03:Math.abs(u.roll)>.03,b=Math.abs(u.yaw)>.03,x=h||g||b,T=Number.isFinite(n)?n:0,A=Number.isFinite(s)?s:0,w=Number.isFinite(a)?a:0,C=Number.isFinite(o)&&o>=1?o:1,m=H(Number.isFinite(l)&&l>0?l:1,.25,2.5),v=t?.getAngularVelocity?.(),M=Array.isArray(v)&&v.length>=3&&Number.isFinite(v[0])&&Number.isFinite(v[1])&&Number.isFinite(v[2]);if(x){if(this.targetPitch=null,this.targetRoll=null,this.pitchIntegral=0,this.rollIntegral=0,this.prevPitchDeg=null,this.prevRollDeg=null,this.lastCmdPitch=0,this.lastCmdRoll=0,this.wasControlling=!0,!M||!t?.setAngularVelocity)return{mode:"maneuver",controlling:!0,nextAngularVelocity:null};let B=Math.min(.45,Math.log10(Math.max(1,C))*.08),$=w>300?Math.max(.4,300/w):1,q=H(1-(.12+B)*m*.5,.35,.92),K=H(3.2/Math.max(1,Math.log10(Math.max(1,C)))/m*$,.35,4),N=[H(v[0]*q,-K,K),H(v[1]*q,-K,K),H(v[2]*q,-K,K)];return t.setAngularVelocity(N),{mode:"maneuver",controlling:!0,nextAngularVelocity:N}}(this.wasControlling||this.targetPitch===null||this.targetRoll===null)&&(this.targetPitch=T,this.targetRoll=H(A,-65,65),this.pitchIntegral=0,this.rollIntegral=0,this.prevPitchDeg=T,this.prevRollDeg=A,this.wasControlling=!1);let S=Number.isFinite(this.targetPitch)?this.targetPitch:T,E=Number.isFinite(this.targetRoll)?this.targetRoll:H(A,-65,65),k=H(S-T,-30,30),F=H(E-A,-30,30),y=this.prevPitchDeg!==null?H((T-this.prevPitchDeg)/.02,-120,120):0,L=this.prevRollDeg!==null?H((A-this.prevRollDeg)/.02,-180,180):0;this.prevPitchDeg=T,this.prevRollDeg=A;let D=.5/Math.max(.5,m);if(this.pitchIntegral=H(this.pitchIntegral+k*.02,-D,D),this.rollIntegral=H(this.rollIntegral+F*.02,-D,D),i){let B=w>220?H(220/w,.35,1):1,$=H((k*.045+this.pitchIntegral*.85-y*.015)*m*B,-.8,.8),q=H((F*.04+this.rollIntegral*.75-L*.014)*m*B,-.8,.8);i.pitch=$,i.roll=q,this.lastCmdPitch=$,this.lastCmdRoll=q}if(!M||!t?.setAngularVelocity)return{mode:"hold",controlling:!1,nextAngularVelocity:null};if(Math.abs(k)<.15&&Math.abs(F)<.15&&Math.abs(y)<.5&&Math.abs(L)<.5){let B=[0,0,0];return t.setAngularVelocity(B),{mode:"hold",controlling:!1,nextAngularVelocity:B}}let _=H(.88-.06*m,.65,.92),V=[H(v[0]*_,-.8,.8),H(v[1]*_,-.8,.8),H(v[2]*_,-.5,.5)];return V.every(Number.isFinite)&&t.setAngularVelocity(V),{mode:"hold",controlling:!1,nextAngularVelocity:V}}},dt=class{originals=new Map;apply(e,t){if(!Number.isFinite(t)||t<=0)return;let i=new Set(Object.values(e??{}).filter(n=>Number.isFinite(n?.thrust)));for(let[n,s]of this.originals)i.has(n)||(Object.assign(n,s),this.originals.delete(n));for(let n of i){let s=this.originals.get(n);if(!s){s={};for(let a of Gt)Number.isFinite(n[a])&&(s[a]=n[a]);this.originals.set(n,s)}for(let a of Gt){let o=s[a];if(o!==void 0){let l=o*t;Number.isFinite(l)&&(n[a]=l)}}}}restore(){for(let[e,t]of this.originals)Object.assign(e,t);this.originals.clear()}},ct=class{original;apply(e,t){!Number.isFinite(t)||t<=0||(this.original?.definition!==e&&(this.restore(),this.original={definition:e,thrust:e.zeroThrustAltitude,rpm:e.zeroRPMAltitude}),e.zeroThrustAltitude=t,e.zeroRPMAltitude=t)}restore(){if(!this.original)return;let{definition:e,thrust:t,rpm:i}=this.original;t===void 0?delete e.zeroThrustAltitude:e.zeroThrustAltitude=t,i===void 0?delete e.zeroRPMAltitude:e.zeroRPMAltitude=i,this.original=void 0}},ke=[1,2,5,10,50,100,500,1e3,5e3,1e4,1e5,1e6,1e7,1e8,1e9],re=[3e6,1e7,1e8,1e9,1e10,1e11,1e12],Li=`
  ${de("#opEngineBarBtn.geofs-ext-op-bar-btn")}
  #opEngineCard .op-native-btn.green-pad {
    border-color: #4caf50 !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5) !important;
  }
  #opEngineCard {
    box-sizing: border-box;
    position: fixed;
    bottom: 120px;
    left: 540px;
    width: 320px;
    min-width: 320px;
    max-width: min(320px, calc(100vw - 24px));
    background: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    z-index: 2147483002;
    overflow: hidden;
    user-select: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  #opEngineCard * {
    box-sizing: border-box;
  }
  #opEngineHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(136, 136, 136, 0.45);
    background: rgba(0, 0, 0, 0.5);
    cursor: grab;
    user-select: none;
    touch-action: none;
  }
  #opEngineHeaderText {
    flex: 1;
    min-width: 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    color: #ffffff;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .op-card-body {
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .op-btn-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  #opEngineCard .op-native-btn {
    background: #000000;
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 7px 10px;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 0 5px #000000;
    white-space: nowrap;
    text-align: center;
  }
  #opEngineCard .op-native-btn:hover {
    border-color: #ffffff;
  }
  #opEngineCard .op-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
    font-size: 10px;
    color: #cccccc;
    text-transform: uppercase;
    white-space: nowrap;
  }
  #opMultInput {
    background: #000000;
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 6px;
    width: 72px;
    text-align: center;
    font-weight: 700;
    font-size: 12px;
    padding: 2px 4px;
  }
  .op-slider {
    width: 100%;
    margin: 0;
    accent-color: #4caf50;
    cursor: pointer;
  }
  .op-lock-wrap {
    position: relative;
  }
  .op-lock-overlay {
    display: none;
    position: absolute;
    inset: 0;
    z-index: 5;
    cursor: not-allowed;
  }
  .op-policy-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding-top: 8px;
    border-top: 1px solid rgba(136, 136, 136, 0.35);
    font-size: 10px;
  }
  .op-policy-pills {
    display: inline-flex;
    gap: 4px;
  }
  #opEngineCard .op-pill {
    background: #000000;
    color: #aaaaaa;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }
  #opEngineCard .op-pill.is-active {
    border-color: #4caf50;
    color: #ffffff;
    background: rgba(76, 175, 80, 0.2);
  }
`,Fe=class{id="overpowered-engines";name="Overpowered Engines";description="Native GeoFS thrust multiplier, ceiling bypass, OP-SYNC policy & closed-loop SAS.";supportedMajors=[3,4];defaultEnabled=!1;ctx=null;aircraft;thrustEnabled=!1;ceilingEnabled=!1;atEngaged=!1;opSyncActive=!1;automaticMultiplier=null;sasElapsed=0;thrust=new dt;ceiling=new ct;sas=new lt;torque=new Map;barBtn=null;card=null;isListeningKey=!1;unmounts=[];init(e){if(this.ctx=e,typeof document<"u"){let t=document.createElement("style");t.id="geofs-ext-op-styles",t.textContent=Li,document.head?.appendChild(t),this.unmounts.push(()=>t.remove());let i=document.createElement("div");i.id="opEngineBarBtn",i.className="control-pad geofs-ext-op-bar-btn",i.setAttribute("role","button"),i.tabIndex=0,i.innerHTML='<div class="control-pad-label transp-pad">OP ENG</div>',i.title="Toggle Overpowered Engines & SAS Card",i.addEventListener("keydown",p=>{p.key!=="Enter"&&p.key!==" "||(p.preventDefault(),p.repeat||i.click())}),i.addEventListener("click",p=>{if(p.stopPropagation(),!this.card)return;let f=this.card.style.display==="none"||!this.card.style.display;this.card.style.display=f?"block":"none";try{localStorage.setItem("geofs_ext_op_card_open",f?"1":"0")}catch{}f&&(e.anchors.bringToFront(this.card),e.anchors.clampElementToViewport(this.card))}),this.barBtn=i,this.unmounts.push(e.anchors.mountControl("op-engines-pad","autopilot",i)),this.attachToAutopilotBar();let n=document.createElement("div");n.id="opEngineCard",n.style.display="none";let s=e.getSettings();n.innerHTML=`
        <div id="opEngineHeader">
          <span id="opEngineHeaderText">Overpowered Engines</span>
          <button type="button" data-role="close" style="background:none;border:none;color:#cccccc;cursor:pointer;font-size:14px;line-height:1;padding:0 2px;" aria-label="Close Overpowered Engines card">\u2715</button>
        </div>
        <div class="op-card-body">
          <div id="opThrustContainer">
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div class="op-btn-row">
                <div class="op-lock-wrap" style="flex:1;">
                  <div id="opThrustLockOverlay" data-role="thrust-lock-overlay" class="op-lock-overlay" title="Auto-managed by Autothrottle OP-SYNC"></div>
                  <div class="op-thrust-lock-target">
                    <button type="button" id="opThrustBtn" data-role="thrust" class="op-native-btn" style="width:100%;">ACTIVATE THRUST</button>
                  </div>
                </div>
                <button type="button" id="opSASBtn" data-role="sas" class="op-native-btn" style="width:50px;" title="Closed-Loop Stability Augmentation System">SAS</button>
              </div>
              <div class="op-lock-wrap">
                <div data-role="thrust-lock-overlay" class="op-lock-overlay" title="Auto-managed by Autothrottle OP-SYNC"></div>
                <div class="op-thrust-lock-target">
                  <div class="op-label-row">
                    <span>Thrust Multiplier</span>
                    <span style="white-space:nowrap;flex-shrink:0;"><input type="number" id="opMultInput" data-role="multiplier" min="1" max="1000000000" step="any" value="${s.opThrustMultiplier}"> x</span>
                  </div>
                  <input type="range" id="opMultSlider" data-role="mult-slider" class="op-slider" min="0" max="${ke.length-1}" step="1" value="${this.getThrustIndex(s.opThrustMultiplier)}">
                </div>
              </div>
            </div>
          </div>

          <div id="opCeilingContainer" class="op-lock-wrap">
            <div id="opCeilingLockOverlay" class="op-lock-overlay" title="Locked while A/THR manages flight envelope"></div>
            <div id="opCeilingSection" style="display:flex;flex-direction:column;gap:8px;">
              <button type="button" id="opCeilingBtn" data-role="ceiling" class="op-native-btn" style="width:100%;">BYPASS ATMOSPHERE</button>
              <div>
                <div class="op-label-row">
                  <span>Altitude Ceiling</span>
                  <strong id="opCeilingReadout" data-role="ceiling-readout" style="color:#ffffff;">${_t(s.opCeilingFeet)} ft</strong>
                </div>
                <input type="range" id="opCeilingSlider" data-role="limit-slider" class="op-slider" min="0" max="${re.length-1}" step="1" value="${this.getCeilingIndex(s.opCeilingFeet)}">
              </div>
            </div>
          </div>

          <div class="op-policy-row">
            <span style="color:#aaaaaa;text-transform:uppercase;font-weight:700;" title="Controls whether A/THR prompts or automatically engages OP Engines on large speed deltas">OP-SYNC</span>
            <div class="op-policy-pills">
              <button type="button" class="op-pill" data-opsync="ask">Ask</button>
              <button type="button" class="op-pill" data-opsync="allow">Auto</button>
              <button type="button" class="op-pill" data-opsync="never">Off</button>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0;">
            <button type="button" id="opKeybindBtn" class="op-pill" style="flex-shrink:0;" title="Click to rebind Overpowered Thrust hotkey">${s.keybindings.toggleOpEngines}</button>
            <div style="flex:1;min-width:0;text-align:right;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              <span id="opStatusMsg" style="color:#aaaaaa;font-style:italic;display:${s.opStability?"none":"inline"};">Hotkey toggles thrust</span>
              <span id="opSASMsg" style="color:#4caf50;font-weight:700;display:${s.opStability?"inline":"none"};">SAS ACTIVE (Attitude Hold)</span>
            </div>
          </div>
        </div>
      `,document.body?.appendChild(n),this.card=n;let a=n.querySelector("#opEngineHeader")??n;this.unmounts.push(e.anchors.makeDraggable(n,"geofs_ext_op_card_pos",a)),this.unmounts.push(()=>n.remove()),n.querySelector('[data-role="close"]')?.addEventListener("click",()=>{n.style.display="none";try{localStorage.setItem("geofs_ext_op_card_open","0")}catch{}});try{localStorage.getItem("geofs_ext_op_card_open")==="1"&&(n.style.display="block",e.anchors.bringToFront(n),e.anchors.clampElementToViewport(n))}catch{}n.querySelector('[data-role="thrust"]')?.addEventListener("click",()=>this.toggle()),n.querySelector('[data-role="ceiling"]')?.addEventListener("click",()=>{this.atEngaged||(this.ceilingEnabled=!this.ceilingEnabled,this.ceilingEnabled||this.ceiling.restore(),this.render())}),n.querySelector('[data-role="sas"]')?.addEventListener("click",()=>{let p=!e.getSettings().opStability;this.sas.reset(),e.updateSettings({opStability:p}),e.emitEvent("overpowered:sas-state",{active:p}),e.emitDiag?.(p?"SAS_ACTIVE":"SAS_DISENGAGED")});let o=n.querySelector('[data-role="multiplier"]'),l=n.querySelector('[data-role="mult-slider"]');o?.addEventListener("input",()=>{if(this.thrustEnabled||this.opSyncActive)return;let p=Number.parseFloat(o.value);Number.isFinite(p)&&p>=1&&(e.updateSettings({opThrustMultiplier:Math.min(1e9,p)}),l&&(l.value=String(this.getThrustIndex(p))))}),l?.addEventListener("input",()=>{if(this.thrustEnabled||this.opSyncActive)return;let p=ke[Number(l.value)]??1;e.updateSettings({opThrustMultiplier:p}),o&&(o.value=String(p))});let d=n.querySelector('[data-role="limit-slider"]');d?.addEventListener("input",()=>{if(this.ceilingEnabled||this.atEngaged)return;let p=re[Number(d.value)]??re[0];e.updateSettings({opCeilingFeet:p})});for(let p of n.querySelectorAll("[data-opsync]"))p.addEventListener("click",()=>{let f=p.dataset.opsync;e.updateSettings({opSyncPolicy:f})});let c=n.querySelector("#opKeybindBtn"),u=p=>{if(!this.isListeningKey||(p.preventDefault(),p.stopPropagation(),["Shift","Control","Alt","Meta"].includes(p.key)))return;this.isListeningKey=!1,document.removeEventListener("keydown",u,!0);let f=[];p.ctrlKey&&f.push("Ctrl"),p.shiftKey&&f.push("Shift"),p.altKey&&f.push("Alt"),p.metaKey&&f.push("Meta");let h=p.key.length===1?p.key.toUpperCase():p.key;f.includes(h)||f.push(h);let g=f.join("+");e.updateSettings({keybindings:{...e.getSettings().keybindings,toggleOpEngines:g}})};this.unmounts.push(()=>document.removeEventListener("keydown",u,!0)),c?.addEventListener("click",()=>{this.isListeningKey||(this.isListeningKey=!0,c.textContent="PRESS KEY...",document.addEventListener("keydown",u,!0))}),n.querySelectorAll('[data-role="thrust-lock-overlay"]').forEach(p=>{p.addEventListener("click",()=>{e.anchors.showToast("OP Engines thrust is auto-managed by Autothrottle OP-SYNC.","warn")})}),n.querySelector("#opCeilingLockOverlay")?.addEventListener("click",()=>{e.anchors.showToast("OP Engines ceiling is managed while A/THR is active.","warn")})}this.render(),this.unmounts.push(e.keybinds.register("op-toggle",e.getSettings().keybindings.toggleOpEngines,()=>this.toggle())),this.unmounts.push(e.onEvent("autothrottle:state",t=>{this.atEngaged=t.engaged,this.atEngaged||(this.automaticMultiplier=null,this.opSyncActive=!1),this.render()})),this.unmounts.push(e.onEvent("autothrottle:opsync-state",({active:t})=>{this.opSyncActive=!!t,this.render()})),this.unmounts.push(e.onEvent("autothrottle:boost",({desired:t,report:i})=>{let n=e.getSettings();if(t===null||!Number.isFinite(t)||t<=0)this.automaticMultiplier=null;else{let s=this.thrustEnabled?n.opThrustMultiplier??1:1,a=this.automaticMultiplier??s,o=Number.isFinite(a)&&a>=1?a:1,l=H(t,1,250),d=H(o+(l-o)*.15,1,250);this.automaticMultiplier=Number.isFinite(d)&&d>=1?d:1}i(this.automaticMultiplier??(this.thrustEnabled?n.opThrustMultiplier??1:1))})),e.emitEvent("overpowered:sas-state",{active:!!e.getSettings().opStability})}attachToAutopilotBar(){if(!this.barBtn)return;let e=document.querySelector(".geofs-autopilot-bar");e&&this.barBtn.parentElement!==e&&e.append(this.barBtn),this.ctx?.anchors.syncAutopilotPad(this.barBtn)}getThrustIndex(e){return ke.reduce((t,i,n)=>Math.abs(i-e)<Math.abs(ke[t]-e)?n:t,0)}getCeilingIndex(e){return re.reduce((t,i,n)=>Math.abs(i-e)<Math.abs(re[t]-e)?n:t,0)}onSettingsChange(e){this.ctx?.keybinds.updateCombo("op-toggle",e.keybindings.toggleOpEngines),e.opStability||(this.restoreTorque(),this.sas.reset()),this.ctx?.emitEvent("overpowered:sas-state",{active:!!e.opStability}),this.render()}toggle(){this.atEngaged&&this.opSyncActive||(this.thrustEnabled=!this.thrustEnabled,this.thrustEnabled||this.thrust.restore(),this.render())}update(e){this.attachToAutopilotBar();let t=window.geofs?.aircraft?.instance,i=this.ctx?.getSettings();if(t!==this.aircraft&&(this.restore(),this.sas.reset(),this.aircraft&&(this.thrustEnabled=!1,this.ceilingEnabled=!1,this.automaticMultiplier=null,this.render()),this.aircraft=t),!t||!i||e.crashed){this.restore();return}let n=this.automaticMultiplier,s=n??(this.thrustEnabled?i.opThrustMultiplier??1:1);if(this.thrustEnabled||n!==null?this.thrust.apply(t.parts,s):this.thrust.restore(),(this.ceilingEnabled||n!==null)&&t.definition?this.ceiling.apply(t.definition,i.opCeilingFeet??re[0]):this.ceiling.restore(),i.opStability&&!e.paused){let a=new Set(Object.values(t.parts??{}));for(let[o,l]of this.torque)a.has(o)||(o.torque=l,this.torque.delete(o));for(let o of a)typeof o?.torque=="number"&&(this.torque.has(o)||this.torque.set(o,o.torque),o.torque=0);this.sasElapsed+=e.dt,this.sasElapsed>=.02&&(this.sasElapsed%=.02,this.sas.step({rigidBody:t.rigidBody,controls:window.controls,pitchDeg:e.pitch,rollDeg:e.roll,kias:e.kias,multiplier:s,sasStrength:i.sasStrength??1,groundContact:e.groundContact,autopilotOn:e.autopilotOn}))}}render(){let e=this.ctx?.getSettings();if(!e)return;if(this.barBtn){let w=this.thrustEnabled||this.opSyncActive||!!e.opStability,C=!!(this.card&&this.card.style.display!=="none"&&this.card.style.display!=="");this.barBtn.classList.toggle("green-pad",w),this.barBtn.classList.toggle("is-open",!w&&C),this.barBtn.setAttribute("aria-pressed",String(this.thrustEnabled||this.opSyncActive)),this.barBtn.setAttribute("aria-expanded",String(C))}let t=this.card;if(!t)return;let i=this.opSyncActive,n=this.atEngaged||this.opSyncActive,s=t.querySelector("#opEngineHeaderText");s&&(s.textContent=i?"OP ENG [AUTO-MANAGED BY A/THR]":"Overpowered Engines",s.style.color=i?"#a855f7":"#ffffff"),t.querySelectorAll(".op-thrust-lock-target").forEach(w=>{w.style.opacity=i?"0.45":"1",w.style.pointerEvents=i?"none":"auto"}),t.querySelectorAll('[data-role="thrust-lock-overlay"]').forEach(w=>{w.style.display=i?"block":"none"});let a=t.querySelector("#opCeilingSection"),o=t.querySelector("#opCeilingLockOverlay");a&&(a.style.opacity=n?"0.45":"1",a.style.pointerEvents=n?"none":"auto"),o&&(o.style.display=n?"block":"none");let l=t.querySelector('[data-role="thrust"]');l&&(l.textContent=this.thrustEnabled||i?"THRUST: ACTIVE":"ACTIVATE THRUST",l.classList.toggle("green-pad",this.thrustEnabled||i),l.disabled=i);let d=t.querySelector('[data-role="sas"]');d&&(d.classList.toggle("green-pad",!!e.opStability),d.setAttribute("aria-pressed",String(!!e.opStability)));let c=t.querySelector('[data-role="ceiling"]');c&&(c.textContent=this.ceilingEnabled||this.opSyncActive?"CEILING: BYPASSED":"BYPASS ATMOSPHERE",c.classList.toggle("green-pad",this.ceilingEnabled||this.opSyncActive));let u=this.automaticMultiplier??e.opThrustMultiplier??1,p=t.querySelector('[data-role="multiplier"]');p&&(typeof document>"u"||document.activeElement!==p)&&(p.value=this.automaticMultiplier!==null?u.toFixed(1):String(u),p.disabled=this.thrustEnabled||i);let f=t.querySelector('[data-role="mult-slider"]');f&&(f.value=String(this.getThrustIndex(u)),f.disabled=this.thrustEnabled||i);let h=e.opCeilingFeet??re[0],g=t.querySelector('[data-role="ceiling-readout"]');g&&(g.textContent=`${_t(h)} ft`);let b=t.querySelector('[data-role="limit-slider"]');b&&(b.value=String(this.getCeilingIndex(h)),b.disabled=this.ceilingEnabled||n);for(let w of t.querySelectorAll("[data-opsync]")){let C=(e.opSyncPolicy??"ask")===w.dataset.opsync;w.classList.toggle("is-active",C),w.setAttribute("aria-pressed",String(C))}let x=t.querySelector("#opKeybindBtn");x&&!this.isListeningKey&&(x.textContent=e.keybindings.toggleOpEngines);let T=t.querySelector("#opStatusMsg");T&&(T.style.display=e.opStability?"none":"inline");let A=t.querySelector("#opSASMsg");A&&(A.style.display=e.opStability?"inline":"none")}restoreTorque(){for(let[e,t]of this.torque)e.torque=t;this.torque.clear(),this.sasElapsed=0}restore(){this.thrust.restore(),this.ceiling.restore(),this.restoreTorque()}destroy(){this.restore(),this.sas.reset(),this.aircraft=void 0,this.thrustEnabled=!1,this.ceilingEnabled=!1,this.atEngaged=!1,this.opSyncActive=!1,this.automaticMultiplier=null,this.isListeningKey=!1;for(let e of this.unmounts)e();this.unmounts=[],this.barBtn=null,this.card=null,this.ctx=null}};var Bt={"pre-takeoff":"PRE-T/O","pre-cruise":"PRE-CRZ","pre-landing":"PRE-LDG","pre-chocks-on":"CHOCKS"};var Kt=[{id:"cold-start",title:"Cold & Dark Engine Start Guide",steps:["Set Parking Brake ON and verify Fuel Quantity & Balance in FUEL tab.","Battery Master & Nav/Beacon Lights ON; start APU for jets before Bleed Air.","Advance Engine Masters / Mixture Rich sequentially and verify positive oil pressure & RPM."]},{id:"rto",title:"Rejected Takeoff (Before V1)",steps:["Immediately retard thrust levers to IDLE and disengage Autothrottle.","Apply Maximum Wheel Braking and full Reverse Thrust (if fitted).","Extend Spoilers / Speedbrakes fully and bring aircraft to a full stop before inspecting brakes."]},{id:"go-around",title:"Go-Around / Missed Approach",steps:["Apply TO/GA thrust smoothly and pitch up to +12 to +15 deg.","Retract one notch of flaps immediately, then retract Gear on positive rate of climb.","Accelerate cleanly to climb speed, retract remaining flaps on schedule, and re-arm approach."]},{id:"crosswind",title:"Crosswind Takeoff & Landing",steps:["Apply upwind aileron correction on takeoff roll and delay liftoff slightly past Vr.","On approach, fly crabbed or wing-low into the wind, align nose with runway before touchdown.","Lower windward wing slightly on rollout to keep upwind tires planted."]},{id:"short-field",title:"Short-Field Operations",steps:["Hold brakes while running power up to max takeoff thrust before releasing brakes.","Fly exact Vref over threshold at FULL flaps; aim directly for first 500 ft of runway.","Retract flaps after touchdown if needed to place maximum weight on main wheels for braking."]},{id:"mountain",title:"Mountain / High-Altitude Ops",steps:["Expect longer takeoff ground roll (higher TAS for same KIAS) due to low air density.","Monitor ALTITUDE BURN in FUEL tab and step-climb efficiently.","Execute steep approaches carefully without overspeeding Vfe flap limits."]}];function Pi(r){return!r||r.includes("&")?null:["parkingBrake","parkingBrake:off","gear","gear:down","gear:up","flaps","flaps:0","flaps:full","airbrakes","airbrakes:arm","airbrakes:off","lightsOn"].includes(r)||/^flaps:\d+$/.test(r)?r:null}function zt(r){return Pi(r)!==null}function Ri(r,e,t){if(r==="parkingBrake")return e.parkingBrake;if(r==="parkingBrake:off")return!e.parkingBrake;if(r==="gear"||r==="gear:down")return!t.hasGear||e.gearDown;if(r==="gear:up")return!t.hasGear||!e.gearDown;if(r==="flaps")return t.maxFlaps<=0||e.flapsTarget>0;if(r==="flaps:0")return e.flapsTarget===0;if(r==="flaps:full")return t.maxFlaps<=0||e.flapsTarget>=t.maxFlaps;if(r.startsWith("flaps:")){let i=Number(r.slice(6));return t.maxFlaps<=0||e.flapsTarget>=Math.min(t.maxFlaps,i)}if(r==="airbrakes"||r==="airbrakes:arm")return!t.hasSpoilers||(e.airbrakesPosition??0)>0;if(r==="airbrakes:off")return!t.hasSpoilers||(e.airbrakesPosition??0)<=.05;if(r==="lightsOn")return e.lightsOn;if(r==="airborne")return!e.groundContact&&e.aglFeet>=35;if(r==="groundStopped")return e.groundContact&&e.groundSpeed<=3;if(r==="enginesOff"){let i=Math.max(...e.throttles.map(n=>Math.abs(n)),0);return e.groundContact&&e.groundSpeed<=3&&i<=.05}if(r==="vref"){let i=t.vSpeeds?.Vref??(t.category==="ga-piston"?65:138);return!e.groundContact&&e.aglFeet<=2e3&&e.kias<=i+15&&e.kias>=25}return r.startsWith("kias>=")?e.kias>=Number(r.slice(6)):r.startsWith("kias<=")?e.kias<=Number(r.slice(6)):r.startsWith("mach>=")?e.mach>=Number(r.slice(6)):r.startsWith("altitude>=")?e.altitude>=Number(r.slice(10)):r.startsWith("agl<=")?e.aglFeet<=Number(r.slice(5)):r.startsWith("throttle>=")?e.throttles.reduce((n,s)=>n+s,0)/Math.max(1,e.throttles.length)>=Number(r.slice(10)):!1}function Ut(r,e,t){return!r||!t?!1:r.split("&").every(i=>Ri(i.trim(),e,t))}function Di(r){let e=r.name.toLowerCase();if(e.includes("a318")||e.includes("a319")||e.includes("a320")||e.includes("a321")||e.includes("a330")||e.includes("a340")||e.includes("a350")||e.includes("a380"))return{toStep:Math.min(r.maxFlaps,1),toLabel:"CONF 1+F",appStep:r.maxFlaps,ldgLabel:"CONF FULL"};if(e.includes("737"))return{toStep:Math.min(r.maxFlaps,2),toLabel:"FLAPS 5",appStep:r.maxFlaps,ldgLabel:"FLAPS 30/40"};if(e.includes("747"))return{toStep:Math.min(r.maxFlaps,2),toLabel:"FLAPS 10",appStep:r.maxFlaps,ldgLabel:"FLAPS 30"};if(e.includes("777")||e.includes("787")||e.includes("757")||e.includes("767"))return{toStep:Math.min(r.maxFlaps,2),toLabel:"FLAPS 5/15",appStep:r.maxFlaps,ldgLabel:"FLAPS 30"};if(e.includes("atr")||e.includes("q400")||e.includes("king air")||e.includes("twin otter")||e.includes("pc-7"))return{toStep:Math.min(r.maxFlaps,1),toLabel:"FLAPS 15",appStep:r.maxFlaps,ldgLabel:"FLAPS FULL"};if(r.maxFlaps<=0)return{toStep:0,toLabel:"UP (CLEAN WING)",appStep:0,ldgLabel:"DELTA / NO-FLAP TRIM"};let t=Math.max(1,Math.min(r.maxFlaps,Math.round(r.maxFlaps/3)));return{toStep:t,toLabel:`NOTCH ${t}/${r.maxFlaps}`,appStep:r.maxFlaps,ldgLabel:`FULL (${r.maxFlaps}/${r.maxFlaps})`}}function Vt(r){let e=Math.round(r.vSpeeds?.VR??(r.category==="ga-piston"?55:r.category==="fighter"?135:140)),t=Math.round(r.vSpeeds?.Vref??(r.category==="ga-piston"?65:r.category==="fighter"?140:136)),i=r.name.toLowerCase(),n=r.id,s=Di(r),a=/a3\d\d/.test(i),o=/(747|757|767|777|787)/.test(i),l=i.includes("737");if(r.category==="rotorcraft")return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${r.name} Collective - FULL DOWN`,desc:"Verify minimum collective pitch prior to rotor spin-up.",sync:"throttle>=0"},{text:"Anti-Collision & Nav Lights - ON",desc:"Alert ramp personnel of spinning rotors.",sync:"lightsOn"},{text:"Rotor RPM 100% & Pedals Check",desc:"Confirm nominal Nr and cyclic freedom before hover."},{text:"Hover Check (5-15 ft AGL)",desc:"Check CG balance and directional stability in hover."}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Translational Lift (> 20 KTS)",desc:"Smoothly transition forward past effective translational lift.",sync:"kias>=20"},{text:"Landing Gear - UP (If Retractable)",desc:r.hasGear?"Retract gear once clear of obstacles.":"Fixed skids verified.",sync:r.hasGear?"gear:up":void 0},{text:"Climb & Cruise Altitude (>= 500 ft)",desc:"Verify clear vertical obstacle clearance.",sync:"altitude>=500"},{text:"Cruise Airspeed (> 70 KTS)",desc:"Trim cyclic for steady cruise speed.",sync:"kias>=70"}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:`Approach Decel (<= ${Math.max(55,t)} KTS)`,desc:"Capture steady approach profile toward helipad.",sync:`kias<=${Math.max(55,t)}`},{text:"Landing Gear - DOWN / SKIDS CHECK",desc:r.hasGear?"Confirm gear down and locked.":"Verify fixed skid alignment.",sync:r.hasGear?"gear:down":void 0},{text:"Lights & Final Descent (AGL <= 150 ft)",desc:"Confirm clear LZ and escape route.",sync:"agl<=150"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Touchdown & Zero Ground Speed",desc:"Set skids firmly before lowering collective.",sync:"groundStopped"},{text:"Collective Full Down & Idle",desc:"Lower collective smoothly to flat pitch.",sync:"enginesOff"},{text:"Fuel Valve / Battery - OFF",desc:"Complete rotor brake and shutdown.",sync:"groundStopped"}]}];if(n==="11"||i.includes("silent")||i.includes("jantar"))return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:"Spoilers / Airbrakes - CLOSED & LOCKED",desc:"Double-check airbrake lever locked forward prior to launch.",sync:"airbrakes:off"},{text:"Controls Free & Canopy Latched",desc:"Verify full roll, pitch, and yaw authority."},{text:`Target Rotation / Liftoff Speed (${e} KTS)`,desc:"Rotate gently cleanly onto tow / electric climb."}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Gear - UP & LOCKED",desc:"Retract main wheel after leaving circuit.",sync:"gear:up"},{text:"Thermaling / Cruise Altitude (>= 1,500 ft)",desc:"Establish energy margin for cross-country soar.",sync:"altitude>=1500"},{text:`Cruise Speed (>= ${Math.max(45,e+10)} KTS)`,desc:"Fly MacCready best L/D speed.",sync:`kias>=${Math.max(45,e+10)}`}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:"Undercarriage - DOWN",desc:"Confirm main wheel extended prior to base leg.",sync:"gear:down"},{text:`Approach Speed (<= ${t+10} KTS)`,desc:"Fly stable approach at target speed.",sync:`kias<=${t+10}`},{text:"Airbrakes - MODULATE APPROACH",desc:"Use spoilers smoothly to control glidepath.",sync:"airbrakes"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Full Stop on Field",desc:"Keep wings level until wheel comes to a stop.",sync:"groundStopped"},{text:"Master / Sustainer - OFF",desc:"Secure glider battery and canopy."}]}];if(n==="2844"||n==="2953"||n==="2988"||r.category==="specialized"){let d=n==="2953"||i.includes("atlantis");return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${r.name} Hold-Down / Brakes`,desc:"Check vehicle attitude and launch clear.",sync:"parkingBrake"},{text:"Flaps / Body Flap - T/O TRIM",desc:r.maxFlaps>0?`Set takeoff flap notch (${s.toLabel}).`:"Elevons & RCS neutral.",sync:r.maxFlaps>0?"flaps:0":void 0},{text:"Main Propulsion - FULL THRUST",desc:`Smoothly advance throttle to 100% for liftoff (Vr ~${e} KTS).`,sync:"throttle>=0.90"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Gear - UP",desc:"Retract undercarriage once positive climb verified.",sync:"gear:up"},{text:"High-Altitude Profile (>= 35,000 ft)",desc:"Follow energy corridor above 35,000 ft.",sync:"altitude>=35000"},{text:d?"Hypersonic Entry / Energy (>= 250 KTS)":"Supersonic / Boost Profile (M >= 1.50)",desc:"Verify velocity stability prior to coast/entry.",sync:d?"kias>=250":"mach>=1.50"}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:`Steep Glide Intercept (<= ${t+25} KTS)`,desc:"Capture steep -18 deg outer glideslope corridor.",sync:`kias<=${t+25}`},{text:"Landing Gear - DOWN (Below 300 ft AGL)",desc:"Deploy heavy landing gear cleanly before flare.",sync:"gear:down"},{text:"Speedbrake - AS REQUIRED FOR ENERGY",desc:"Modulate speedbrake to nail aiming point.",sync:r.hasSpoilers?"airbrakes":void 0}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Wheel Stop & Drag Chute",desc:"Full stop on lakebed or long runway.",sync:"groundStopped"},{text:"Propulsion & APU - SECURED",desc:"All engines and hydraulic systems off.",sync:"enginesOff"}]}]}if(r.category==="supersonic")return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${r.name} Parking Brake - SET`,desc:"Confirm runway alignment prior to reheat check.",sync:"parkingBrake"},{text:"External & Landing Lights - ON",desc:"Max visibility during high-speed departure.",sync:"lightsOn"},{text:"Reheat / Afterburners - MAX FOR T/O",desc:`Smoothly engage full thrust; rotate at ${e} KTS.`,sync:"throttle>=0.95"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Undercarriage - UP & LOCKED",desc:"Retract below 270 KTS immediately after positive climb.",sync:"gear:up"},{text:"Supercruise Altitude (>= 45,000 ft)",desc:"Climb smoothly into supersonic cruise block.",sync:"altitude>=45000"},{text:"Mach Cruise Established (M >= 1.80)",desc:"Stabilize at Concorde/XB-70 Mach 2.0+ cruise.",sync:"mach>=1.80"}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:"Decelerate Subsonic Before Approach",desc:"Pass below 250 KTS prior to final vectoring.",sync:"kias<=250"},{text:"Landing Gear - DOWN (3 Green)",desc:"Confirm gear extended cleanly by 1,500 ft AGL.",sync:"gear:down"},{text:`Delta Vortex Approach (Vref ${t} KTS)`,desc:"Hold high nose attitude (12-13 deg pitch) with autothrottle.",sync:"vref"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Full Stop & Parking Brake - SET",desc:"Engage reverse idle and apply firm wheel brakes.",sync:"groundStopped&parkingBrake"},{text:"Fuel Master Switches - OFF",desc:"Shut down all powerplants and secure avionics.",sync:"enginesOff"}]}];if(r.category==="fighter")return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${r.name} Parking Brake Check`,desc:"Hold brakes while checking engine gauges.",sync:"parkingBrake"},...r.maxFlaps>0?[{text:`Takeoff Flaps - ${s.toLabel}`,desc:"Set combat takeoff flap configuration.",sync:`flaps:${s.toStep}`}]:[{text:"Automatic Leading-Edge Slats - ARMED",desc:"Flight control computer auto-schedules maneuvering slats."}],{text:"Lights & Speedbrake Closed",desc:"Ensure speedbrake retracted cleanly for runway roll.",sync:r.hasSpoilers?"airbrakes:off":"lightsOn"},{text:"MIL / AB Thrust Selected",desc:`Rotate briskly at ${e} KTS.`,sync:"throttle>=0.85"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Landing Gear - UP (< 250 KTS)",desc:"Retract promptly before gear overspeed limit.",sync:"gear:up"},{text:"Flaps - UP / CLEAN",desc:"Retract takeoff flaps accelerating past 230 KTS.",sync:"flaps:0"},{text:"Tactical Cruise Altitude (>= 15,000 ft)",desc:"Level off at assigned flight level.",sync:"altitude>=15000"},{text:"Cruise Mach / Speed (>= 300 KTS)",desc:"Verify steady cruise speed and G-limit clearance.",sync:"kias>=300"}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:`Pattern Entry Speed (<= ${Math.max(220,t+60)} KTS)`,desc:"Extend speedbrake on downwind break as required.",sync:`kias<=${Math.max(220,t+60)}`},{text:"Landing Gear - DOWN & LOCKED",desc:"Deploy below 250 KTS; check 3 green.",sync:"gear:down"},...r.maxFlaps>0?[{text:`Landing Flaps - ${s.ldgLabel}`,desc:"Configure full flaps on base turn.",sync:"flaps:full"}]:[],{text:`On-Speed AOA / Vref (${t} KTS)`,desc:"Fly E-bracket velocity vector directly to runway.",sync:"vref"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Speedbrake & Flaps Retracted",desc:"Clean aircraft Clear of Active Runway.",sync:r.maxFlaps>0?"flaps:0":"airbrakes:off"},{text:"Full Stop & Parking Brake - SET",desc:"Secure ejection seat pin prior to cutoff.",sync:"groundStopped&parkingBrake"},{text:"Throttles OFF & Master Battery Off",desc:"Shut down turbine(s) cleanly.",sync:"enginesOff"}]}];if(r.category==="airliner-twin"||r.category==="airliner-quad"){let d=o||i.includes("a350")||i.includes("a380")?.82:.76,c=o||i.includes("a350")||i.includes("a380")?28e3:24e3,u=a?`CONF (${s.toLabel}) & T.O CONFIG`:l?"Takeoff Flaps - FLAPS 5":`Takeoff Flaps - ${s.toLabel}`,p=a?"ENG MASTER 1 & 2 - OFF":l?"Fuel Control Switches - CUTOFF":`${r.engineCount}x Fuel Cutoff - OFF`;return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${r.name} Parking Brake Set`,desc:"Hold position for pushback/runup check before brake release.",sync:"parkingBrake"},{text:u,desc:`Configure ${r.name} takeoff flaps (V2 / VR ${e} KTS).`,sync:`flaps:${s.toStep}`},{text:"Spoilers / Speedbrake - RETRACTED (0)",desc:"Verify ground spoilers down prior to takeoff.",sync:r.hasSpoilers?"airbrakes:off":void 0},{text:"Landing & Strobe Lights - ON",desc:"Required prior to entering active runway.",sync:"lightsOn"},{text:"TO/GA or FLEX Thrust Applied",desc:"Verify symmetric N1/EPR spool across all engines.",sync:"throttle>=0.80"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Landing Gear - UP & OFF",desc:"Retract on positive rate of climb.",sync:"gear:up"},{text:"Flaps - UP / CLEAN",desc:"Retract flaps cleanly above minimum clean speed.",sync:"flaps:0"},{text:`Climb to Cruise Level (>= ${(c/100).toFixed(0)} FL)`,desc:`Level off at FL${(c/100).toFixed(0)}+ / verify cabin press.`,sync:`altitude>=${c}`},{text:`Cruise Mach Established (M >= ${d.toFixed(2)})`,desc:"Confirm A/THR Mach hold and ALTITUDE BURN nominal.",sync:`mach>=${d.toFixed(2)}`}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:"Speed Brake - ARMED",desc:"Arm ground spoilers for automatic touchdown deployment.",sync:r.hasSpoilers?"airbrakes":void 0},{text:"Landing Gear - DOWN (3 Green)",desc:"Confirm gear locked down prior to outer marker / 1,500 ft.",sync:"gear:down"},{text:`Landing Flaps - ${s.ldgLabel}`,desc:`Full landing configuration for ${r.name}.`,sync:"flaps:full"},{text:`Stabilized on Vref (${t} KTS)`,desc:"On glidepath with A/THR LANDING mode armed if desired.",sync:"vref"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Speedbrakes DOWN & Flaps UP",desc:"Clean wing after vacating runway onto taxiway.",sync:"flaps:0&airbrakes:off"},{text:"Aircraft Stopped & Parking Brake - SET",desc:"Set brake on arrival stand once chocks ready.",sync:"groundStopped&parkingBrake"},{text:p,desc:"Cut fuel masters, confirm N1 spool down & beacon OFF.",sync:"enginesOff"}]}]}return r.category==="turboprop"?[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${r.name} Parking Brake - SET`,desc:"Runup torque and prop feather check complete.",sync:"parkingBrake"},...r.maxFlaps>0?[{text:`Takeoff Flaps - ${s.toLabel}`,desc:"Set takeoff flap notch.",sync:`flaps:${s.toStep}`}]:[],{text:"Recognition / Strobe Lights - ON",desc:"Clear departure runway.",sync:"lightsOn"},{text:"Takeoff Power Applied",desc:`Smooth power advance; rotate cleanly at ${e} KTS.`,sync:"throttle>=0.85"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[...r.hasGear?[{text:"Landing Gear - UP",desc:"Retract gear with positive rate of climb.",sync:"gear:up"}]:[],...r.maxFlaps>0?[{text:"Flaps - 0 / CLEAN",desc:"Accelerate past climb flap retraction speed.",sync:"flaps:0"}]:[],{text:"Turboprop Cruise Alt (>= 10,000 ft)",desc:"Climb to economical turboprop cruise block.",sync:"altitude>=10000"},{text:"Cruise Airspeed (>= 150 KTS)",desc:"Confirm prop sync ON and torque balanced.",sync:"kias>=150"}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[...r.hasGear?[{text:"Undercarriage - DOWN",desc:"Check 3 green lights prior to final.",sync:"gear:down"}]:[],...r.maxFlaps>0?[{text:`Landing Flaps - ${s.ldgLabel}`,desc:"Set full approach/landing flaps.",sync:"flaps:full"}]:[],{text:`Stabilized Approach Vref (${t} KTS)`,desc:"Hold target Vref down the glideslope.",sync:"vref"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[...r.maxFlaps>0?[{text:"Flaps - UP (0)",desc:"Retract flaps after clearing runway.",sync:"flaps:0"}]:[],{text:"Full Stop & Parking Brake - SET",desc:"Confirm beta/reverse idle before chocking.",sync:"groundStopped&parkingBrake"},{text:"Condition Levers - FUEL CUTOFF",desc:"Shut down turboprop engines cleanly.",sync:"enginesOff"}]}]:[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${r.name} Parking Brake & Controls Check`,desc:"Full & free control deflection verified.",sync:"parkingBrake"},...r.maxFlaps>0?[{text:`Takeoff Flaps - ${s.toLabel}`,desc:`Short/standard takeoff flaps (VR ${e} KTS).`,sync:`flaps:${s.toStep}`}]:[{text:"Elevator & Rudder Trim - SET T/O",desc:`Clean wing aircraft; neutral trim (VR ${e} KTS).`}],{text:"Mixture RICH & Beacon/Landing Light ON",desc:"Ensure full rich mixture for takeoff.",sync:"lightsOn"},{text:"Full Power Takeoff Check",desc:"Verify full RPM / manifold pressure cleanly.",sync:"throttle>=0.85"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[...r.hasGear?[{text:"Landing Gear - UP",desc:"Retract undercarriage once runway clear.",sync:"gear:up"}]:[],...r.maxFlaps>0?[{text:"Flaps - UP (0)",desc:"Retract flaps above safe climb speed.",sync:"flaps:0"}]:[],{text:"Cruise Altitude (>= 2,500 ft)",desc:"Reach planned VFR/IFR cruising level.",sync:"altitude>=2500"},{text:`Cruise Speed (>= ${Math.max(70,e+20)} KTS)`,desc:"Level off, trim pitch, and lean mixture.",sync:`kias>=${Math.max(70,e+20)}`}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:"GUMPS: Gas / Mixture RICH",desc:"Select fullest tank and full rich mixture."},...r.hasGear?[{text:"Undercarriage - DOWN & WELDED",desc:"Verify gear indicator green before final.",sync:"gear:down"}]:[],...r.maxFlaps>0?[{text:`Landing Flaps - ${s.ldgLabel}`,desc:`Below Vfe speed; configure ${s.ldgLabel}.`,sync:"flaps:full"}]:[],{text:`Target Approach Speed Vref (${t} KTS)`,desc:`Establish stabilized ${t} KTS final approach.`,sync:"vref"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[...r.maxFlaps>0?[{text:"Flaps - UP (0)",desc:"Retract flaps after vacating runway.",sync:"flaps:0"}]:[],{text:"Full Stop & Parking Brake - SET",desc:"Apply wheel brakes and tie down / chock.",sync:"groundStopped&parkingBrake"},{text:"Mixture IDLE CUT-OFF & Master OFF",desc:"Stop propeller and switch off mags & avionics.",sync:"enginesOff"}]}]}var Ni=`
  .geofs-ext-chk-root {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    font-family: Helvetica, Arial, sans-serif;
  }
  .geofs-ext-chk-phases {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 3px;
  }
  .geofs-ext-chk-phase {
    background: #000000;
    color: #cccccc;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 3px 2px;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .geofs-ext-chk-phase.is-active {
    background: #4caf50;
    border-color: #4caf50;
    color: #ffffff;
  }
  .geofs-ext-chk-phase.is-emergency {
    border-color: #ef4444;
    color: #ff8d8d;
  }
  .geofs-ext-chk-phase.is-emergency.is-active {
    background: #ef4444;
    border-color: #ef4444;
    color: #ffffff;
  }
  .geofs-ext-chk-item {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding: 4px 5px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(136, 136, 136, 0.25);
    cursor: pointer;
  }
  .geofs-ext-chk-item.is-done {
    border-color: rgba(76, 175, 80, 0.5);
    opacity: 0.72;
  }
  .geofs-ext-chk-box {
    width: 12px;
    height: 12px;
    border: 1px solid #888888;
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 900;
    flex-shrink: 0;
    margin-top: 1px;
    color: #4caf50;
  }
  .geofs-ext-chk-item.is-done .geofs-ext-chk-box {
    background: #4caf50;
    border-color: #4caf50;
    color: #ffffff;
  }
  .geofs-ext-chk-btn {
    background: #000000;
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 3px 7px;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }
  .geofs-ext-chk-btn.is-active {
    border-color: #4caf50;
    color: #4caf50;
  }
  .geofs-ext-chk-recovery {
    width: 100%;
    padding: 5px 8px;
    background: #000000;
    border: 1px solid #eab308;
    border-radius: 15px;
    color: #facc15;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
  }
`;function Ii(r,e,t,i){if(!r||!t)return!1;let n=window.controls;if(r==="parkingBrake"||r==="parkingBrake:off"){let s=r==="parkingBrake";return e.parkingBrake!==s?(typeof n?.setters?.setParkingBrake?.set=="function"?n.setters.setParkingBrake.set():n&&(n.brakes=s?1:0),!0):!1}if(r==="gear"||r==="gear:down"||r==="gear:up"){let s=r!=="gear:up";return t.hasGear&&e.gearDown!==s?(i.sim.toggleGear(),!0):!1}if(r==="flaps")return i.sim.setFlaps(e.flapsTarget>0?e.flapsTarget:Math.min(t.maxFlaps,1)),!0;if(r==="flaps:0")return i.sim.setFlaps(0),!0;if(r==="flaps:full")return i.sim.setFlaps(t.maxFlaps),!0;if(r.startsWith("flaps:")){let s=Number(r.slice(6));if(Number.isFinite(s))return i.sim.setFlaps(Math.min(t.maxFlaps,Math.max(0,s))),!0}if(r==="airbrakes"||r==="airbrakes:arm"||r==="airbrakes:off"){let s=r!=="airbrakes:off";if(n?.airbrakes)return n.airbrakes.target=s?1:0,n.setters?.setAirbrakes?.set?.(),!0}if(r==="lightsOn"&&n){if(e.lightsOn)return!1;let s=n.setters;if(typeof s?.setLights?.set=="function")return s.setLights.set(),!0;let a=n.toggleLights??window.geofs?.aircraft?.instance?.toggleLights;return typeof a=="function"?(a(),!0):!1}return!1}var Le=class{id="checklist-system";name="Checklist System";description="4 mandatory flight-gate checklists with live auto-checks, situational guide & emergency QRH overrides.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;rootEl=null;unmounts=[];activePhase=0;autoAdvance=!1;showGuide=!1;phaseTitles=[];emergencies=new Map;lastAircraftKey="";lastTelemetry=null;lastRender="";lastEmittedPhase="";manualDone=new Set;init(e){this.ctx=e,this.autoAdvance=!!e.getSettings().checklistAutoAdvance;try{let s=localStorage.getItem("geofs_ext_checklist_state");if(s){let a=JSON.parse(s);typeof a.activePhase=="number"&&Number.isFinite(a.activePhase)&&(this.activePhase=Math.max(0,Math.min(3,Math.floor(a.activePhase)))),typeof a.showGuide=="boolean"&&(this.showGuide=a.showGuide)}}catch{}if(typeof document<"u"){let s=document.createElement("style");s.id="geofs-ext-checklist-styles",s.textContent=Ni,document.head?.appendChild(s),this.unmounts.push(()=>s.remove())}let t=document.createElement("div");t.className="geofs-ext-chk-root",this.rootEl=t,this.unmounts.push(e.anchors.registerHudTab("checks","CHECKS",t));let i=()=>{if(this.phaseTitles.length){this.activePhase=(this.activePhase+1)%this.phaseTitles.length,this.lastRender="";try{localStorage.setItem("geofs_ext_checklist_state",JSON.stringify({activePhase:Math.min(3,this.activePhase),showGuide:this.showGuide}))}catch{}e.anchors.openHudTab("checks"),e.anchors.showToast(`Checklist Phase: ${this.phaseTitles[this.activePhase]}`)}},n=e.getSettings().keybindings.toggleChecklist;this.unmounts.push(e.keybinds.register("checklist-cycle",n,i)),this.unmounts.push(e.onEvent("failure:triggered",({type:s,procedure:a,recoverable:o})=>{if(!a)return;let l=o!==!1;this.emergencies.set(s,{type:s,procedure:a,recoverable:l,contingency:!l}),this.activePhase=4+Array.from(this.emergencies.keys()).indexOf(s),this.lastRender="",e.anchors.openHudTab("checks")})),this.unmounts.push(e.onEvent("failure:contingency",({type:s,procedure:a})=>{if(!a)return;let o=this.emergencies.get(s);this.emergencies.set(s,{type:s,procedure:a,recoverable:!1,contingency:!0}),o||(this.activePhase=4+Array.from(this.emergencies.keys()).indexOf(s)),this.lastRender="",e.anchors.openHudTab("checks")})),this.unmounts.push(e.onEvent("failure:cleared",({type:s})=>{this.emergencies.delete(s)&&(this.lastRender="")})),e.emitEvent("failure:request-active")}onSettingsChange(e){this.ctx?.keybinds.updateCombo("checklist-cycle",e.keybindings.toggleChecklist),this.autoAdvance!==!!e.checklistAutoAdvance&&(this.autoAdvance=!!e.checklistAutoAdvance,this.lastRender="")}update(e){if(this.lastTelemetry=e,!this.rootEl||!this.ctx)return;let t=e.aircraft;if(!t){this.lastRender&&this.rootEl.replaceChildren(),this.lastRender="",this.lastAircraftKey="";return}let i=`${t.id}:${t.name}:${t.maxFlaps}:${JSON.stringify(t.vSpeeds??{})}`;i!==this.lastAircraftKey&&(this.lastAircraftKey=i,this.manualDone.clear(),this.activePhase=0,this.emergencies.clear(),this.lastRender="");let n=Vt(t),s=Array.from(this.emergencies.values()),a=n.map(m=>m.gateId?Bt[m.gateId]:m.title);this.phaseTitles=[...a,...s.map(m=>`QRH:${m.procedure.title.slice(0,8)}`)],this.activePhase>=this.phaseTitles.length&&(this.activePhase=0);let o=this.activePhase>=n.length,l=o?s[this.activePhase-n.length]:void 0,d=l?l.procedure:n[this.activePhase],c=d.items.map((m,v)=>{let M=`${l?`em-${l.type}-${l.contingency?"cont":"qrh"}`:`gate-${this.activePhase}`}-${v}`,S=zt(m.sync),E=!l&&Ut(m.sync,e,t),k=this.manualDone.has(M)||E;return{id:M,item:m,hardware:S,autoDone:E,checked:k}}),u=c.filter(m=>!m.checked).length,p=`${d.title}:${u}`;if(p!==this.lastEmittedPhase&&(this.lastEmittedPhase=p,this.ctx.emitEvent("checklist:phase",{phase:d.title,pending:u})),this.autoAdvance&&!o&&c.length>0&&u===0&&this.activePhase<n.length-1){this.activePhase+=1,this.lastRender="";return}let f=pe(t.vSpeeds,t.machSpeeds),h=JSON.stringify([i,this.activePhase,this.autoAdvance,this.showGuide,this.phaseTitles,l?.contingency??!1,l?.recoverable??!1,f,c.map(m=>[m.id,m.checked])]);if(h===this.lastRender)return;this.lastRender=h,this.rootEl.replaceChildren();let g=document.createElement("div");g.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:4px;";let b=document.createElement("span");b.style.cssText="font-size:10px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",b.textContent=`${t.name} (${u} left)`,b.title=t.name;let x=document.createElement("span");x.style.cssText="display:inline-flex;gap:3px;flex-shrink:0;";let T=document.createElement("button");T.type="button",T.className=`geofs-ext-chk-btn ${this.autoAdvance?"is-active":""}`,T.textContent="AUTO",T.title="Auto-advance through mandatory phases",T.addEventListener("click",()=>{this.autoAdvance=!this.autoAdvance,this.ctx?.updateSettings({checklistAutoAdvance:this.autoAdvance}),this.lastRender=""});let A=document.createElement("button");A.type="button",A.className=`geofs-ext-chk-btn ${this.showGuide?"is-active":""}`,A.textContent="GUIDE",A.title="Toggle Situational Procedure Guide",A.addEventListener("click",()=>{this.showGuide=!this.showGuide,this.lastRender="";try{localStorage.setItem("geofs_ext_checklist_state",JSON.stringify({activePhase:Math.min(3,this.activePhase),showGuide:this.showGuide}))}catch{}});let w=document.createElement("button");w.type="button",w.className="geofs-ext-chk-btn",w.textContent="RST",w.title="Reset All Checklist Items",w.addEventListener("click",()=>{this.manualDone.clear(),this.lastRender=""}),x.append(T,A,w),g.append(b,x),this.rootEl.appendChild(g);let C=document.createElement("div");if(C.className="geofs-ext-chk-phases",this.phaseTitles.forEach((m,v)=>{let M=document.createElement("button");M.type="button";let S=v>=n.length;M.className=`geofs-ext-chk-phase ${!this.showGuide&&v===this.activePhase?"is-active":""} ${S?"is-emergency":""}`,M.textContent=m,M.title=m,M.addEventListener("click",()=>{this.showGuide=!1,this.activePhase=v,this.lastRender="";try{localStorage.setItem("geofs_ext_checklist_state",JSON.stringify({activePhase:Math.min(3,this.activePhase),showGuide:!1}))}catch{}}),C.appendChild(M)}),this.rootEl.appendChild(C),f){let m=document.createElement("div");m.style.cssText="font-size:9px;color:#aaaaaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",m.textContent=f,m.title=f,this.rootEl.appendChild(m)}if(l&&!this.showGuide){let m=document.createElement("div");m.style.cssText="padding:5px 7px;border-radius:6px;background:rgba(239,68,68,0.18);border:1px solid #ef4444;display:flex;flex-direction:column;gap:5px;";let v=document.createElement("div");if(v.style.cssText="font-size:10px;font-weight:700;color:#fca5a5;",v.textContent=l.contingency?`CONTINGENCY SOLUTION: ${l.procedure.title}`:`EMERGENCY QRH: ${l.procedure.title}`,m.appendChild(v),l.recoverable){let M=document.createElement("button");M.type="button",M.className="geofs-ext-chk-recovery",M.textContent="ATTEMPT RECOVERY",M.addEventListener("click",()=>{this.ctx?.emitEvent("failure:attempt-recovery",{type:l.type})}),m.appendChild(M)}this.rootEl.appendChild(m)}if(this.showGuide){let m=document.createElement("div");m.style.cssText="display:flex;flex-direction:column;gap:4px;";let v=document.createElement("div");v.style.cssText="font-size:9.5px;font-weight:700;color:#4caf50;text-transform:uppercase;letter-spacing:0.4px;",v.textContent="Situational Procedures Guide",m.appendChild(v);let M=[];for(let S of Kt){let E=document.createElement("details");E.style.cssText="background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.25);border-radius:6px;padding:4px 6px;";let k=document.createElement("summary");k.style.cssText="font-size:10px;font-weight:700;color:#ffffff;cursor:grab;",k.textContent=S.title,E.appendChild(k);let F=document.createElement("ul");F.style.cssText="margin:4px 0 2px 14px;padding:0;font-size:9px;color:#cccccc;line-height:1.3;";for(let y of S.steps){let L=document.createElement("li");L.textContent=y,F.appendChild(L)}E.appendChild(F),E.addEventListener("toggle",()=>{if(E.open)for(let y of M)y!==E&&y.open&&(y.open=!1)}),M.push(E),m.appendChild(E)}this.rootEl.appendChild(m);return}for(let m of c){let v=document.createElement("div");v.className=`geofs-ext-chk-item ${m.checked?"is-done":""}`,v.setAttribute("role","checkbox"),v.setAttribute("aria-checked",String(m.checked)),v.tabIndex=0;let M=document.createElement("span");M.className="geofs-ext-chk-box",M.textContent=m.checked?"\u2713":"";let S=document.createElement("div");S.style.cssText="flex:1;min-width:0;";let E=document.createElement("div");E.style.cssText="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:10.5px;font-weight:700;color:#ffffff;";let k=document.createElement("span");if(k.textContent=m.item.text,m.checked&&(k.style.textDecoration="line-through"),E.appendChild(k),m.item.sync){let L=document.createElement("span");L.style.cssText="font-size:9px;flex-shrink:0;color:"+(m.hardware?"#facc15":"#38bdf8")+";",L.textContent=m.hardware?"\u26A1":"\u23F1",L.title=m.hardware?"Click to execute simulator control":"Auto-verified by live flight telemetry",E.appendChild(L)}let F=document.createElement("div");F.style.cssText="font-size:8.5px;font-style:italic;color:#aaaaaa;margin-top:1px;line-height:1.25;",F.textContent=m.item.desc,S.append(E,F),v.append(M,S);let y=()=>{if(m.hardware&&this.lastTelemetry&&this.ctx){!Ii(m.item.sync,this.lastTelemetry,t,this.ctx)&&!m.autoDone&&this.ctx.anchors.showToast("Control unavailable \u2014 toggle manually in GeoFS","warn"),this.manualDone.delete(m.id),this.lastRender="";return}this.manualDone.has(m.id)?this.manualDone.delete(m.id):this.manualDone.add(m.id),this.lastRender=""};v.addEventListener("click",y),v.addEventListener("keydown",L=>{(L.key==="Enter"||L.key===" ")&&(L.preventDefault(),y())}),this.rootEl.appendChild(v)}}destroy(){for(let e of this.unmounts)e();this.unmounts=[],this.rootEl=null,this.lastRender="",this.lastEmittedPhase="",this.lastAircraftKey="",this.lastTelemetry=null,this.manualDone.clear(),this.emergencies.clear(),this.activePhase=0,this.phaseTitles=[],this.ctx=null}};var ue="https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/",Oi="https://raw.githubusercontent.com/Ariakim-Taiyo/GeoFs-737-Immersion-SFX/main/737_autopilot_disconnect.mp3",pt=new Set(["4","22","5203"]),Pe=new Set(["240","25","4402"]),ht=new Set(["2865","2870","2871","242","2843","2899","24","2973"]);function oe(r,e,t,i,n,s){return{id:r,file:ue+e,effects:{volume:{value:"rpm",ramp:t,ratio:100},pitch:{value:"rpm",ramp:i,offset:n,ratio:s}}}}var $t=[[1e3,900],[500,400],[400,300],[300,200],[200,100],[100,50],[50,40],[40,30],[30,20],[20,10],[10,5]],ut=r=>"geofs-ext-realism-"+r;function Re(){return!!window.audio?.sounds?.[ut("50")]}function jt(r){let e=String(r.id),t=pt.has(e),i=Pe.has(e),n=ht.has(e);if(!t&&!i&&!n)return;let s=window.audio,a=s?.sounds,o=s?.soundplayer,l=r.definition?.sounds;if(!a||!o?.stopSound||!l?.length)return;let d=new Map,c=S=>{let E=a[S.id];if(E)try{o.stopSound?.(E)}catch{}d.set(S.id,{original:E,replacement:S}),a[S.id]=S};if((t?["englowfront.ogg","engmidfront.ogg","enghighestfront.ogg","737rolling.mp3"]:i?["777enginelow.mp3","777enginemid.mp3","777enginehigh.mp3","777enginehigh.mp3"]:["neo2.mp3","neo2.mp3","neo3.mp3"]).forEach((S,E)=>{let k=a[l[E]?.id];if(!k?.effects?.volume||!k.effects.pitch)return;let F={...k.effects.volume,lastValue:null,ratio:100},y={...k.effects.pitch,lastValue:null};i&&E===0&&(F.ramp=[100,500,2e3,1e4]),(n||t)&&(F.value="rpm",y.value="rpm"),c({id:k.id,loop:k.loop,file:ue+S,effects:{volume:F,pitch:y}})}),i||n){let E=a[l[i?4:3]?.id];E?.effects?.volume&&c({...E,effects:{...E.effects,volume:{...E.effects.volume,lastValue:null,ratio:100}}})}if(n){let S=a[l[5]?.id];S?.id==="startup"&&c({id:S.id,file:ue+"startupneo.mp3"}),c(oe("rpm4","neo2.mp3",[800,950,2500,3500],[0,2e4,2e4,2e4],1,1)),c(oe("rpm5","neo2.mp3",[1e3,2500,1e4,1e4],[0,2e4,2e4,2e4],1,1.5)),c(oe("rpm6","neo3.mp3",[6e3,2e4,2e4,2e4],[1e3,2e4,2e4,2e4],1,1.5))}else t&&(c(oe("rpmback","enghighback.ogg",[6e3,1e4,2e4,5e4],[1e3,2e4,2e4,2e4],1,1)),c(oe("rpmback1","enghighback.ogg",[100,500,2e3,1e4],[1e3,2e4,2e4,2e4],1,1)),c(oe("rpmin1","lowcab.ogg",[800,950,2500,3500],[0,2e4,2e4,2e4],1,1)),c(oe("rpmin2","midcab.ogg",[1e3,2500,1e4,1e4],[0,2e4,2e4,2e4],1,1)),c({id:"buzzsaw",file:ue+"buzzsawcab.ogg",effects:{volume:{value:"rpm",ramp:[3e3,1e4,2e4,2e4],ratio:60}}}));let p=new Map([["flaps",t?"737flaps.mp3":"777flap.mp3"],["tooLowFlaps","tlf.mp3"],["terrain","tlt.mp3"],["pullUp","pullup.mp3"]]);(i||n)&&p.set("gear","tlg.mp3"),i?p.set("bank","bankangle.mp3"):n?(p.set("retard","retard.mp3"),p.set("stall","https://sage-narwhal-290a3c.netlify.app/airbusstall.mp3"),p.set("ptu","ptu.mp3"),p.set("tcas","traffic.mp3"),p.set("tcasClimb","climb.mp3"),p.set("tcasDescend","descend.mp3"),p.set("tcasClear","clear.mp3")):t&&(p.set("reverse","737reverse.mp3"),p.set("overspeed","sounds_overspeed.mp3"),p.set("touchHard","hardtouch1.mp3"),p.set("touchSoft","softtouch1.mp3"),p.set("tcas","traffic.mp3"),p.set("tcasClimb","climb.mp3"),p.set("tcasDescend","descend.mp3"),p.set("tcasClear","clear.mp3"));for(let[S]of $t){let E=i||t?S===500?"500correct.mp3":`${S}gpws_merged.mp3`:S===100?"100abtrue.mp3":`${S}ab.mp3`;p.set(String(S),E)}for(let[S,E]of p){let k=ut(S);c({id:k,file:E.startsWith("https://")?E:ue+E,effects:{play:{value:k}}})}let f,h;if(t&&window.geofs?.autopilot?.turnOff){let S=window.geofs.autopilot,E=S.turnOff;h=new Audio(Oi),h.preload="none",h.addEventListener("error",()=>{h=void 0},{once:!0}),S.turnOff=()=>{E?.call(S),s.on!==!1&&!window.geofs?.isPaused?.()&&h?.play().catch(()=>{})},f=()=>{window.geofs?.autopilot&&(window.geofs.autopilot.turnOff=E),h?.pause(),h=void 0}}let g=new Map,b=0,x=null,T=!0,A=!1,w=0,C=0,m=!1;return{update:(S,E)=>{if(s.sounds!==a)return;let k=g.get(E);k||(k=new Map,g.set(E,k));let F=(N,O)=>{let j=ut(N);k.has(j)||k.set(j,E[j]),E[j]=Number(O)},y=typeof E.climbrate=="number"?E.climbrate:S.vs,L=!S.groundContact&&!S.crashed,D=S.aglFeet,I=E.gearPosition===0,_=L&&I&&(D<=5e3&&y<=-2e3||D<=1e3&&y<=-5e3),V=L&&D<=500&&E.gearPosition===1&&y<0&&!_,B=L&&D<=1e3&&E.flapsPosition===0&&y<0&&!_,$=L&&!V&&!B&&y<=-1;F("flaps",typeof E.flapsPosition=="number"&&typeof E.flapsTarget=="number"&&E.flapsPosition!==E.flapsTarget),(i||n)&&F("gear",V),F("tooLowFlaps",B),F("terrain",L&&I&&D<=1e3&&y<=-100&&y>=-5e3&&!$&&!V&&!B),F("pullUp",_);let K=D-(i?16.152139372973117:n?12.232906828403847:0);for(let[N,O]of $t)F(String(N),$&&K>O&&K<=N);if(i&&F("bank",L&&Math.abs(S.roll)>35),n){let N=typeof E.rpm=="number"?E.rpm:0;if(F("retard",$&&K>5&&K<=20&&(S.throttles[0]??0)>=.1),F("stall",D>20&&!!r.stalling),F("ptu",N>400&&N<2400),S.timestamp-b>=1e3){let O=window.weather?.currentWindSpeed??0,j=$&&x!==null&&Math.abs(O-x)>=5;k.has("isWindWarn")||k.set("isWindWarn",E.isWindWarn),E.isWindWarn=Number(j),x=O,b=S.timestamp}}if(n||t){let N=Object.values(window.multiplayer?.visibleUsers??{}),O=typeof E.altitudeMeters=="number"?E.altitudeMeters:S.altitude*.3048,j=!1,ee=!1;for(let te of N)if(typeof te.distance=="number"&&te.distance<=1e3&&te.referencePoint?.lla){let ae=te.referencePoint.lla[2];ae>=O&&ae<=O+100?ee=!0:ae<=O&&ae>=O-100&&(j=!0)}j||ee?A=!0:A&&(A=!1,w=S.timestamp+3e3),F("tcas",j||ee),F("tcasClimb",j),F("tcasDescend",ee),F("tcasClear",S.timestamp<w)}if(t){let N=typeof E.rpm=="number"?E.rpm:0;F("reverse",!!E.reverser||N<0),F("overspeed",S.kias>340||S.mach>.82),!T&&S.groundContact&&(m=Math.abs(y)>300,C=S.timestamp+1500),T=S.groundContact,F("touchHard",S.timestamp<C&&m),F("touchSoft",S.timestamp<C&&!m)}},restore:()=>{f?.();for(let[S,E]of g)for(let[k,F]of E)F===void 0?delete S[k]:S[k]=F;if(s.sounds===a)for(let[S,{original:E,replacement:k}]of d)a[S]===k&&(o.stopSound?.(k),E?a[S]=E:delete a[S])}}}var ft=[500,400,300,200,100,50,40,30,20,10],De=class{prevHagl=1/0;prevKias=0;triggeredAlts=new Set;triggeredVSpeeds=new Set;lastWarningMs={};audioCtx=null;onAlert;constructor(e){this.onAlert=e}reset(){this.prevHagl=1/0,this.prevKias=0,this.triggeredAlts.clear(),this.triggeredVSpeeds.clear(),this.lastWarningMs={}}update(e,t){if(!t||e.paused||e.crashed)return null;let i=e.aglFeet,n=e.vs,s=e.kias,a=e.timestamp;if(Number.isFinite(s)&&Number.isFinite(i)){(e.groundContact&&s<30||i>800)&&this.triggeredVSpeeds.clear();let l=e.aircraft?.vSpeeds,d=s>this.prevKias&&e.throttles.some(c=>c>.5);if(l&&d&&i<200){let c=[["v1",l.V1,"V1","V1"],["vr",l.VR,"ROTATE","Rotate"],["v2",l.V2,"V2","V2"]];for(let[u,p,f,h]of c)if(typeof p=="number"&&Number.isFinite(p)&&!this.triggeredVSpeeds.has(u)&&this.prevKias<p&&s>=p){this.triggeredVSpeeds.add(u),this.prevKias=s,this.prevHagl=i;let g={kind:"vspeed",text:f,level:"info"};return this.speak(h,!1),this.onAlert?.(g),g}}this.prevKias=s}if(Re()||!Number.isFinite(i)||!Number.isFinite(n))return null;if(e.groundContact)return this.prevHagl=i,null;i>1200&&this.triggeredAlts.clear();let o=null;if(i<1e3&&n<-3500?this.canWarn("pullUp",a,3e3)&&(o={kind:"warning",text:"PULL UP",level:"warn"},this.speak("Pull up",!0),this.playTone(880,.16)):i<2500&&n<-2500?this.canWarn("sinkRate",a,4e3)&&(o={kind:"warning",text:"SINK RATE",level:"warn"},this.speak("Sink rate",!0),this.playTone(660,.14)):e.aircraft?.hasGear!==!1&&i<500&&!e.gearDown&&n<-300&&this.canWarn("gear",a,6e3)?(o={kind:"warning",text:"TOO LOW, GEAR",level:"warn"},this.speak("Too low, gear",!0),this.playTone(540,.14)):(Math.abs(e.roll)>38&&i<2500||Math.abs(e.roll)>48)&&this.canWarn("bank",a,5e3)&&(o={kind:"warning",text:"BANK ANGLE",level:"warn"},this.speak("Bank angle",!1),this.playTone(580,.12)),!o&&n<-100&&Number.isFinite(this.prevHagl))for(let l=ft.length-1;l>=0;l--){let d=ft[l];if(!this.triggeredAlts.has(d)&&this.prevHagl>d&&i<=d){for(let c=0;c<=l;c++)this.triggeredAlts.add(ft[c]);o={kind:"altitude",text:String(d),level:"info"},this.speak(String(d),!1);break}}return this.prevHagl=i,o&&this.onAlert?.(o),o}canWarn(e,t,i){let n=this.lastWarningMs[e]??-1/0;return t-n<i?!1:(this.lastWarningMs[e]=t,!0)}speak(e,t){try{let i=typeof window<"u"?window.speechSynthesis:void 0;if(!i||typeof SpeechSynthesisUtterance>"u")return;t&&i.cancel();let n=new SpeechSynthesisUtterance(e);n.rate=t?1.15:1.05,n.pitch=t?1.05:.95,n.volume=.8,i.speak(n)}catch{}}playTone(e,t){try{let i=typeof window<"u"?window.AudioContext||window.webkitAudioContext:void 0;if(!i)return;this.audioCtx||(this.audioCtx=new i),this.audioCtx.state==="suspended"&&this.audioCtx.resume();let n=this.audioCtx.createOscillator(),s=this.audioCtx.createGain();n.type="triangle",n.frequency.value=e,s.gain.setValueAtTime(.06,this.audioCtx.currentTime),s.gain.exponentialRampToValueAtTime(.001,this.audioCtx.currentTime+t),n.connect(s),s.connect(this.audioCtx.destination),n.start(),n.stop(this.audioCtx.currentTime+t)}catch{}}dispose(){this.reset();try{typeof window<"u"&&window.speechSynthesis?.cancel()}catch{}this.audioCtx&&(this.audioCtx.close().catch(()=>{}),this.audioCtx=null)}};function Hi(r){let e=r===4?"in":"varying",t=r===4?"texture":"texture2D",i=r===4?"out_FragColor":"gl_FragColor";return`
    uniform sampler2D colorTexture;
    ${e} vec2 v_textureCoordinates;
    uniform float strength;
    vec4 vignette(float s, vec2 coordinate, vec2 texCoord) {
        vec2 uv = coordinate.xy / czm_viewport.zw;
        uv *= 1.0 - uv.yx;
        float vig = clamp((uv.x * uv.y) * 15.0, 0.0, 1.0);
        vig = s > 0.0001 ? pow(max(vig, 0.0001), s) : 1.0;
        return mix(vec4(0.0, 0.0, 0.0, 1.0), ${t}(colorTexture, texCoord), vig);
    }
    vec4 grayOut(float s, vec2 coordinate, vec2 texCoord) {
      vec4 initialCol = vignette(s * 20.0, coordinate, texCoord);
      vec4 grayCol = vec4(vec3(initialCol.r), 1.0);
      return mix(initialCol, grayCol, clamp(s * 3.0, 0.0, 1.0));
    }
    vec4 blur(float s, vec2 coordinate, vec2 texCoord) {
      float uvRadius = s * 0.005;
      vec2 pxRadius = vec2(uvRadius) * czm_viewport.zw;
      vec4 initialCol  = grayOut(s, coordinate, texCoord);
      vec4 blurCol1    = grayOut(s, coordinate + vec2(pxRadius.x, 0.0), clamp(texCoord + vec2(uvRadius, 0.0), 0.0, 1.0));
      vec4 blurCol2    = grayOut(s, coordinate + vec2(-pxRadius.x, 0.0), clamp(texCoord + vec2(-uvRadius, 0.0), 0.0, 1.0));
      vec4 blurCol3    = grayOut(s, coordinate + vec2(0.0, pxRadius.y), clamp(texCoord + vec2(0.0, uvRadius), 0.0, 1.0));
      vec4 blurCol4    = grayOut(s, coordinate + vec2(0.0, -pxRadius.y), clamp(texCoord + vec2(0.0, -uvRadius), 0.0, 1.0));
      return mix(initialCol, (blurCol1 + blurCol2 + blurCol3 + blurCol4) / 4.0, clamp(s * 2.0, 0.0, 1.0));
    }
    void main() {
      if (strength <= 0.0001) {
        ${i} = ${t}(colorTexture, v_textureCoordinates);
        return;
      }
      ${i} = blur(strength, gl_FragCoord.xy, v_textureCoordinates);
    }
  `}var Gi=new Set(["21","2","2808","1","8","12","13","40","1069","2750","4251","1022","1026","14","16"]),Wt=new Set(["2948","2581","2808","3460","2988"]),_i=new Set(["9","52","2840","4090"]);var Bi=new Set(["performanceMode","taxiwayLights","nightVfrLidar","windThermals","slewMode"]);function G(r,e){return r?.[e]??!Bi.has(e)}function Ki(){let r=window.geofs?.animation?.values?.view,e=window.geofs?.camera?.currentModeName;return r==="cockpit"||e==="cockpit"}var Ne=class{id="realism-pack";name="Realism Pack";description="Background G-force shaders, camera shake, 777/A320/737 SFX, and flight physics.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;optionKey="";lastSimMajor=null;stage=null;removeStage;uniforms={strength:0};overGSeconds=0;blackoutActive=!1;nextBreath=0;nextWind=0;nextPhysics=0;nextRotor=0;spinSample;nextSpin=0;nextSpinToast=0;next777Impulse=0;cameraOffset;aircraft;restores=[];captured=new WeakMap;spoilerArmed=!1;breath;wind;aircraftSounds;checkedAircraftSounds=!1;unmountTab=null;syncHudTab=null;genericGpws=new De(e=>{e.kind==="warning"&&this.ctx?.anchors.showToast(`GPWS: ${e.text}`,"warn")});onKeyDown=e=>{if(!G(this.ctx?.getSettings().realismOptions,"spoilerArming")||e.key!=="Shift"||e.repeat||e.defaultPrevented||typeof HTMLElement<"u"&&e.target instanceof HTMLElement&&e.target.matches("input, textarea, select, [contenteditable]"))return;let t=window.geofs?.aircraft?.instance;t&&!t.groundContact&&window.controls?.airbrakes?.position===0&&(this.spoilerArmed=!0,this.ctx?.anchors.showToast("Spoilers Armed"))};init(e){if(this.ctx=e,this.lastSimMajor=e.simMajor??null,this.onSettingsChange(e.getSettings()),typeof document<"u"&&(document.addEventListener("keydown",this.onKeyDown),typeof e.anchors?.registerHudTab=="function")){let t=document.createElement("div");t.style.cssText="display:flex;flex-direction:column;gap:5px;font-size:10px;color:#e5e7eb;";let i=[["gBreath","G-Breath"],["blackout","Blackout"],["windAudio","Wind SFX"],["cameraShake","Shake"],["soundExpansion","737/777 SFX"],["genericGpws","GPWS"],["spoilerArming","Spoilers"],["engineInertia","Inertia"],["performanceMode","Perf Mode"]],n=document.createElement("div");n.style.cssText="font-size:9px;color:#a1a1aa;display:flex;justify-content:space-between;",n.innerHTML=`<span>REALISM PACK</span><span>${this.lastSimMajor===4?"V4 (Vortex/Carrier N/A)":"V3 FULL"}</span>`;let s=document.createElement("div");s.style.cssText="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;";let a=new Map;for(let[l,d]of i){let c=document.createElement("button");c.type="button",c.textContent=d,c.style.cssText="background:rgba(255,255,255,0.06);color:#e5e7eb;border:1px solid rgba(255,255,255,0.16);border-radius:4px;padding:4px 4px;font-size:9px;font-weight:700;cursor:pointer;",c.addEventListener("click",()=>{let u=e.getSettings().realismOptions??{};e.updateSettings({realismOptions:{...u,[l]:!G(u,l)}})}),a.set(l,c),s.appendChild(c)}let o=()=>{let l=e.getSettings().realismOptions;for(let[d,c]of a){let u=G(l,d);c.style.borderColor=u?"#10b981":"rgba(255,255,255,0.16)",c.style.color=u?"#10b981":"#a1a1aa"}};this.syncHudTab=o,o(),t.append(n,s),this.unmountTab=e.anchors.registerHudTab("realism","REALISM",t,!1,{defaultClosed:!0})}}onSettingsChange(e){let t=e.realismOptions;this.syncHudTab?.();let i=JSON.stringify({options:t??{}});i!==this.optionKey&&(this.optionKey=i,this.restoreAircraft(),G(t,"gBreath")||this.breath?.pause(),G(t,"windAudio")||this.wind?.pause(),G(t,"soundExpansion")||this.resetAircraftSounds(),G(t,"blackout")||(this.uniforms.strength=0,this.overGSeconds=0,this.blackoutActive=!1,this.stage&&(this.stage.enabled=!1)),this.emitRealismDiag(t))}emittedV4UnsupportedNotice=!1;emitRealismDiag(e){let t=this.lastSimMajor,i=t===4;this.ctx?.emitDiag?.("REALISM_STATE",{simMajor:t,blackout:G(e,"blackout"),soundExpansion:G(e,"soundExpansion"),vortexStatus:i?"V4_UNSUPPORTED":G(e,"vortexEffects")?"ACTIVE":"OFF",carrierStatus:i?"V4_UNSUPPORTED":G(e,"carrierOps")?"ACTIVE":"OFF"}),i&&!this.emittedV4UnsupportedNotice&&(this.emittedV4UnsupportedNotice=!0,this.ctx?.emitDiag?.("REALISM_FEATURE_ERROR",{level:"info",simMajor:4,features:["vortexEffects","carrierOps"],message:"Vortex Effects and Carrier Ops require GeoFS V3.9"}))}ensureStage(e){if(this.stage)return;let t=window.Cesium?.PostProcessStage,i=window.geofs?.api?.viewer?.scene?.postProcessStages,n=window.geofs?.fx?.atmosphere?.atmospherePostProcessStage;if(!(!t||!i?.add)&&!(n&&!n._ready))try{let s=i.add(new t({fragmentShader:Hi(e),uniforms:{strength:()=>this.uniforms.strength}}));s&&(s.enabled=!1,this.stage=s,this.removeStage=()=>i.remove?.(s))}catch(s){console.warn("[GeoFS Extension] Could not initialize the blackout effect:",s)}}setValue(e,t,i){let n=this.captured.get(e);if(n||this.captured.set(e,n=new Set),!n.has(t)){n.add(t);let s=e[t],a=Object.hasOwn(e,t);this.restores.push(()=>{a?e[t]=s:delete e[t]})}e[t]=i}update(e){let t=window.geofs,i=t?.aircraft?.instance,n=t?.animation?.values;if(this.lastSimMajor!==e.simMajor&&(this.lastSimMajor=e.simMajor,this.emitRealismDiag(this.ctx?.getSettings().realismOptions)),this.aircraft!==i&&(this.resetAircraftSounds(),this.genericGpws.reset(),this.restoreAircraft(),this.aircraft=i),!i||!n||e.paused||e.crashed){this.stage&&(this.stage.enabled=!1);return}let s=e.timestamp,a=e.gForce,o=Ki(),l=e.aircraft?.id??"",d=this.ctx?.getSettings().realismOptions;if(!this.breath){let v=this.ctx?.getAudioUrl?.("");v&&typeof Audio<"u"&&(this.breath=new Audio(v+"cutgbreath.mp3"),this.wind=new Audio(v+"wind.mp3"),this.breath.preload=this.wind.preload="none")}!o||!G(d,"gBreath")?this.breath?.pause():s>=this.nextBreath&&(this.nextBreath=s+3500,a>=3&&this.breath?.play().catch(()=>{}),a>6&&this.ctx?.anchors.showToast("High G-Load \u2014 Pilot Strain Detected","warn")),s>=this.nextWind&&(this.nextWind=s+1e3,!this.checkedAircraftSounds&&G(d,"soundExpansion")&&(pt.has(l)||Pe.has(l)||ht.has(l)?i.definition?.sounds?.length&&window.audio?.soundplayer?.stopSound&&window.audio?.sounds&&Object.keys(window.audio.sounds).length>0&&(this.aircraftSounds=jt(i),this.aircraftSounds&&(this.checkedAircraftSounds=!0)):this.checkedAircraftSounds=!0),o&&Number(n.accZ)>=50&&G(d,"windAudio")&&this.wind?.play().catch(()=>{})),this.aircraftSounds?.update(e,n),this.genericGpws.update(e,G(d,"genericGpws"));let u=(Number.isFinite(e.dt)&&e.dt>0?Math.min(e.dt,.25):.016)/.01,p=Number.isFinite(a)?a:1,f=G(d,"blackout");o&&f?p>9?(this.overGSeconds+=.05*u,this.overGSeconds>.1&&(this.blackoutActive=!0),this.blackoutActive&&(this.uniforms.strength=Math.min(1,this.uniforms.strength+.001*(p-5)/10*u))):(this.overGSeconds=0,this.uniforms.strength=Math.max(0,this.uniforms.strength-5e-4*u),this.uniforms.strength||(this.blackoutActive=!1)):(this.overGSeconds=0,this.uniforms.strength=0,this.blackoutActive=!1);let h=o&&f&&this.uniforms.strength>0;h&&this.ensureStage(e.simMajor),this.stage&&(this.stage.enabled=h);let g=t?.camera,b=Number.isFinite(e.aoa)?e.aoa:0,x=Number.isFinite(e.kias)?e.kias:0,T=l==="4"||e.groundContact||x<30||b>=85?0:Math.max(0,b-10)*2e-4,A=Math.max(0,x-450)*1e-5,w=Math.abs(p-1)>2?Math.abs(p-1)*1e-4:0,C=T+A+w,m=Number.isFinite(C)?Math.min(.05,C):0;if(m>0&&G(d,"cameraShake")&&g?.translate&&!this.cameraOffset){let v=m*Math.random();if(Number.isFinite(v)&&v>0){g.translate(v,v,v);let M=()=>g.translate?.(-v,-v,-v),S=setTimeout(()=>{this.cameraOffset=void 0,M()},5);this.cameraOffset={undo:M,timer:S}}}if(s>=this.nextPhysics){if(this.nextPhysics=s+100,Gi.has(l)&&G(d,"propwash"))for(let M of i.airfoils??[])this.setValue(M,"propwash",M.forceDirection===2?.005:.01);let v=i.definition;v?.maxRPM===1e4&&typeof n.rpm=="number"&&Number.isFinite(n.rpm)&&G(d,"engineInertia")&&this.setValue(v,"engineInertia",n.rpm<6e3?.2:n.rpm<7e3?.5:1),this.spoilerArmed&&e.groundContact&&(window.controls?.airbrakes&&(window.controls.airbrakes.target=1),this.spoilerArmed=!1)}if(s>=this.nextRotor){this.nextRotor=s+1e3;let v=t?.api?.renderingSettings;v&&G(d,"performanceMode")&&(this.setValue(v,"degradedCollisions",!0),this.setValue(v,"lowResRunways",!0)),G(d,"bladeCollisions")&&_i.has(l)&&Math.abs(Number(n.aroll)||e.roll)>70&&e.aglFeet<=5&&t?.preferences?.crashDetection&&i.crash?.()}if(Wt.has(l)&&G(d,"spinFix")&&!e.groundContact&&e.aglFeet>50){let v=Number(n.atilt)||e.pitch;if(Number.isFinite(v)){if(this.spinSample&&s>=this.spinSample.time+500){if(Math.abs((v-this.spinSample.pitch+540)%360-180)>50){let S=i.rigidBody,E=S?.getAngularVelocity?.();if(Array.isArray(E)&&E.length>=3&&E.every(k=>typeof k=="number"&&Number.isFinite(k))){let k=[Math.max(-2,Math.min(2,E[0]*.5)),Math.max(-2,Math.min(2,E[1]*.5)),Math.max(-2,Math.min(2,E[2]*.5))];S?.setAngularVelocity?.(k)}s>=this.nextSpinToast&&(this.nextSpinToast=s+3e3,this.ctx?.anchors.showToast("Spin Recovery Active"))}this.spinSample=void 0}s>=this.nextSpin&&(this.nextSpin=s+1e3,this.spinSample={time:s,pitch:v})}}else Wt.has(l)&&(this.spinSample=void 0);Pe.has(l)&&G(d,"engineInertia")&&this.update777Effects(i,n,e)}update777Effects(e,t,i){let n=i.timestamp,s=i.aglFeet,a=i.kias,o=e.rigidBody;if(n>=this.next777Impulse){this.next777Impulse=n+100;let w=Number.isFinite(i.dt)&&i.dt>0?Math.min(i.dt,.25):.02,C=Math.max(.25,Math.min(2.5,w/.02));if(!i.groundContact&&Number.isFinite(s)&&s>=5&&s<=80&&Number.isFinite(a)&&a>=80&&a<=450&&(!Number.isFinite(i.vs)||i.vs<1500)&&(!Number.isFinite(i.gForce)||i.gForce<1.8)){let m=Math.max(0,Math.min(2500,(80-s)*20*C));Number.isFinite(m)&&m>0&&o?.applyCentralImpulse?.([0,0,m])}if(!i.groundContact&&Number.isFinite(s)&&s>=50&&Number.isFinite(a)&&a>=60&&a<=450&&Number.isFinite(i.aoa)&&i.aoa>12&&i.aoa<75){let m=Number(t.heading360),v=Number.isFinite(m)?m:i.heading;if(Number.isFinite(v)){let M=v*(Math.PI/180),S=Math.min(1500,Math.random()*(i.aoa-12)*50*C);Number.isFinite(S)&&S>0&&o?.applyTorqueImpulse?.([S*Math.sin(M),S*Math.cos(M),0])}}}let l=Number.isFinite(a)?a:0,d=Number(t.yaw),c=Number.isFinite(d)?d:0;this.setValue(t,"tiller",l>=50?c/(l/5):c);let u=Number.isFinite(Number(t.airbrakesPosition))?Number(t.airbrakesPosition):0;this.setValue(t,"spoilersShake",u===1?1-Math.random()/20*(l/200):u),this.setValue(t,"flapsShake",t.flapsPosition===6?Math.random()/20*(l/100):0);let p=Number(t.accZ),f=Number.isFinite(p)?p:9.81,h=Number(e.parts?.wingleft?.lift),g=Number(e.parts?.wingright?.lift),b=Number.isFinite(h)?h:0,x=Number.isFinite(g)?g:0;if(this.setValue(t,"liftLeftWing",-b/2e5+f/20),this.setValue(t,"liftRightWing",-x/2e5+f/20),Number.isFinite(s)&&s<=18){let w=16.152139372973117*Math.max(0,s)/15;this.setValue(t,"gearTilt",Math.max(18.5,Math.min(20,w)))}let T=e.setup?.parts;if(T){let w=T[106]?.animations?.[1];w&&this.setValue(w,"value","tiller");for(let v=60;v<=73;v++){let M=T[v]?.animations?.[0];M&&this.setValue(M,"value","spoilersShake")}let C=[[3,1],[4,1],[5,0],[6,0],[7,1]];for(let[v,M]of C){let S=T[v]?.animations?.[M];S&&this.setValue(S,"value","liftLeftWing")}let m=[[8,1],[9,0],[10,0]];for(let[v,M]of m){let S=T[v]?.animations?.[M];S&&this.setValue(S,"value","liftRightWing")}}let A=e.definition?.parts;if(A)for(let w of[87,98]){let C=A[w]?.animations?.[0];C&&(this.setValue(C,"value","gearTilt"),this.setValue(C,"offset",-27),"lt"in C&&this.setValue(C,"lt",void 0))}}resetAircraftSounds(){this.aircraftSounds?.restore(),this.aircraftSounds=void 0,this.checkedAircraftSounds=!1}restoreAircraft(){for(let e of this.restores.reverse())e();this.restores=[],this.captured=new WeakMap,this.spoilerArmed=!1,this.spinSample=void 0,this.next777Impulse=0}destroy(){this.unmountTab?.(),this.unmountTab=null,this.syncHudTab=null,typeof document<"u"&&document.removeEventListener("keydown",this.onKeyDown),this.optionKey="",this.lastSimMajor=null,this.resetAircraftSounds(),this.genericGpws.dispose(),this.removeStage?.(),this.stage=null,this.removeStage=void 0,this.restoreAircraft(),this.aircraft=void 0,this.cameraOffset&&(clearTimeout(this.cameraOffset.timer),this.cameraOffset.undo(),this.cameraOffset=void 0),this.breath?.pause(),this.wind?.pause(),this.breath=this.wind=void 0,this.uniforms.strength=0,this.blackoutActive=!1,this.overGSeconds=0,this.ctx=null}};var zi={gearFront:"Nose Gear",gearLeft:"Left Main Gear",gearRight:"Right Main Gear",ailerons:"Ailerons",elevators:"Elevators",rudder:"Rudder",flaps:"Flaps",brakes:"Brakes",spoilers:"Spoilers",electrical:"Electrical",fuelLeak:"Fuel Leak",structural:"Structural",pressurization:"Pressurization",mcas:"MCAS",pitotStatic:"Pitot-Static"},Ui={gearFront:"Nose/Tail wheel collapse. May cause steering loss and ground loops.",gearLeft:"Left main landing gear collapse. Aircraft will tilt heavily to the left.",gearRight:"Right main landing gear collapse. Aircraft will tilt heavily to the right.",ailerons:"Roll surface jam. Total loss of roll control; aircraft will be hard to level.",elevators:"Pitch surface jam. Loss of pitch control; aircraft may become unstable.",rudder:"Yaw surface jam. Loss of directional control; critical during crosswinds.",flaps:"Hydraulic loss preventing flap extension. Higher landing speeds expected.",brakes:"Wheel brakes non-functional. Requires long runway or reverse thrust to stop.",spoilers:"Speedbrakes fail to deploy. Difficult to slow down after touchdown.",electrical:"Total instrument blackout. Autopilot and glass cockpit parts go dark.",fuelLeak:"Critical fuel loss. Engines will starve and flame out in 120 seconds.",structural:"Airframe damage. Severe vibrations and speed-limited stability.",pressurization:"Cabin decompression above 9,000 ft causing severe turbulence.",mcas:"Erroneous stabilizer commands cycling nose-down trim repeatedly.",pitotStatic:"Air data sensor failure. Airspeed and altitude instruments read zero."};function W(r,e,t){let i=Object.hasOwn(r,e),n=r[e];return{apply:()=>{r[e]=t},restore:()=>{i?r[e]=n:delete r[e]}}}var Vi={gearFront:[0,/front|nose|tail|steer/],gearLeft:[1,/left|l_g|main l|l-gear/],gearRight:[2,/right|r_g|main r|r-gear/]};function Q(r){return r.startsWith("engine")?`Engine ${Number(r.slice(6))+1}`:zi[r]}function gt(r){return r!=="structural"}function $i(r){return r==="structural"?0:r==="gearFront"||r==="gearLeft"||r==="gearRight"?.7:r==="fuelLeak"||r==="flaps"||r==="brakes"||r==="spoilers"?.75:1}function ji(r,e,t){let i=Math.max(0,Math.min(1,e/100*$i(r)));return i>0&&t<i}function qt(r){if(r.startsWith("engine")){let e=Number(r.slice(6))+1;return{title:`ENG ${e} FAILURE`,items:[{text:`THR LEVER ${e} - IDLE`,desc:"Reduce fuel flow and check for engine fire."},{text:`FUEL COCK ${e} - OFF`,desc:"Isolate damaged engine from fuel manifold."},{text:"IGNITION & APU BLEED - SELECT RELIGHT",desc:"Prepare APU cross-bleed for in-flight restart attempt."},{text:"AIRSPEED - MAINTAIN V2 / BEST L/D",desc:"Fly symmetric rudder toward live engine."}]}}switch(r){case"gearFront":case"gearLeft":case"gearRight":return{title:`${Q(r).toUpperCase()} FAULT`,items:[{text:"LANDING GEAR LEVER - CYCLE DOWN",desc:"Verify hydraulic pressure and downlock pins."},{text:"ALTERNATE GEAR EXTEND - PULL",desc:"Release mechanical uplift latches via free-fall."},{text:"INDICATION LIGHTS - CHECK 3 GREEN",desc:"Confirm green downlock before committing to landing."}]};case"ailerons":return{title:"AILERON JAM",items:[{text:"HYDRAULIC AILERON BYPASS - ACTUATE",desc:"Switch to secondary servo actuator loop."},{text:"USE RUDDER TO KEEP WINGS LEVEL",desc:"Avoid abrupt roll inputs while troubleshooting."}]};case"elevators":return{title:"ELEVATOR JAM",items:[{text:"STAB TRIM - SELECT BACKUP",desc:"Switch pitch authority to electric stabilizer trim."},{text:"USE THRUST TO CONTROL PITCH",desc:"Increase thrust pitches nose up; idle lowers nose."}]};case"rudder":return{title:"RUDDER JAM",items:[{text:"YAW DAMPER - OFF",desc:"Disconnect yaw damper servo from rudder actuator."},{text:"DIFFERENTIAL THRUST - AS REQ",desc:"Maintain directional alignment using asymmetric thrust."}]};case"flaps":return{title:"FLAPS JAM / HYD LOSS",items:[{text:"ALTN FLAP MOTOR - ENGAGE",desc:"Use electric backup drive to cycle flap position."},{text:"COMPUTE NO-FLAP VREF (+15 KTS)",desc:"Increase approach target speed if slats/flaps stay jammed."}]};case"brakes":return{title:"WHEEL BRAKES FAILURE",items:[{text:"ANTI-SKID / ALT BRAKE ACCUM - CYCLE",desc:"Pressurize standby brake accumulator."},{text:"PREPARE MAX REVERSE & SPOILERS",desc:"Ensure full spoilers immediately upon touchdown."}]};case"spoilers":return{title:"SPOILERS INOPERATIVE",items:[{text:"HYDRAULIC SYS B - RESET",desc:"Check spoiler servo valve solenoid."},{text:"FLY STABILIZED ON VREF",desc:"Avoid floating in flare due to reduced rollout drag."}]};case"electrical":return{title:"TOTAL ELECTRICAL FAILURE",items:[{text:"APU - START IMMEDIATELY",desc:"Establish emergency backup electrical generation."},{text:"BUS TIE & GEN 1/2 - CYCLE RESET",desc:"Restore main instrument & autopilot busses."},{text:"STANDBY COMPASS & VISUAL FLY",desc:"Maintain aircraft pitch & bank visually until restored."}]};case"fuelLeak":return{title:"MAJOR FUEL LEAK",items:[{text:"FUEL CROSSFEED - CLOSED",desc:"Isolate undamaged wing tank from leaking supply."},{text:"LEAK VALVE ISOLATION - ATTEMPT RECOVERY",desc:"Engines flame out in 120s unless isolated."},{text:"LAND - NEAREST SUITABLE FIELD",desc:"Declare emergency with ATC immediately."}]};case"structural":return{title:"STRUCTURAL AIRFRAME DAMAGE",items:[{text:"AIRSPEED - REDUCE BELOW 220 KTS",desc:"Permanent structural compromise; minimize aerodynamic load."},{text:"AVOID > 1.5G MANEUVERS",desc:"Shallow bank turns only; divert immediately."}]};case"pressurization":return{title:"CABIN DEPRESSURIZATION",items:[{text:"OXYGEN MASKS - ON & 100%",desc:"Establish supplemental breathing above 10,000 ft."},{text:"EMERGENCY DESCENT <= 10,000 FT",desc:"Idle thrust, extend speedbrakes, descend cleanly."},{text:"OUTFLOW VALVE - MANUAL CLOSE",desc:"Attempt cabin pressure seal restoration."}]};case"mcas":return{title:"UNCOMMANDED NOSE DOWN TRIM",items:[{text:"STAB TRIM CUTOUT - CUTOUT",desc:"Disconnect runaway stabilizer trim motor."},{text:"CONTROL COLUMN - PULL TO LEVEL",desc:"Manually arrest nose-down pitch excursion."},{text:"TRIM WHEEL - MANUAL RESET",desc:"Re-trim airframe manually."}]};case"pitotStatic":return{title:"PITOT-STATIC SENSOR FAILURE",items:[{text:"PITOT / PROBE HEAT - HIGH",desc:"Clear icing obstruction from primary pitot tubes."},{text:"ALTERNATE STATIC SOURCE - OPEN",desc:"Switch ADC to standby static port."},{text:"FLY PITCH + POWER ATTITUDE",desc:"Hold +4 deg pitch / 65% thrust if sensors stay frozen."}]};default:return{title:`${Q(r).toUpperCase()} ABNORMAL`,items:[{text:"MAINTAIN AIRCRAFT CONTROL & AIRSPEED",desc:"Establish safe altitude and monitor primary flight instruments."},{text:"DIVERT TO NEAREST SUITABLE AIRPORT",desc:"Prepare emergency crew & abnormal landing briefing."}]}}}function Wi(r){if(r.startsWith("engine")){let e=Number(r.slice(6))+1;return{title:`ENG ${e} UNRECOVERABLE CONTINGENCY`,items:[{text:`ENG ${e} MASTER - STAY OFF`,desc:"Do not attempt further restarts; fire risk."},{text:"TRIM RUDDER TOWARD LIVE ENGINE",desc:"Maintain coordinated flight and climb gradient."},{text:"FLY SINGLE-ENGINE LANDING VREF+5",desc:"Expect reduced go-around climb capability."}]}}switch(r){case"gearFront":case"gearLeft":case"gearRight":return{title:`${Q(r).toUpperCase()} ABNORMAL LANDING`,items:[{text:"DUMP / BURN FUEL TO LIGHT WEIGHT",desc:"Reduce touchdown speed and impact energy."},{text:"HOLD AFFECTED SIDE OFF UNTIL LOW SPEED",desc:"Lower nose/wing gently during rollout."},{text:"FUEL & BATTERY MASTER - OFF ON TOUCHDOWN",desc:"Eliminate post-slide spark hazards."}]};case"ailerons":return{title:"NO-AILERON CONTINGENCY",items:[{text:"BANK EXCLUSIVELY WITH RUDDER",desc:"Coordinate gentle yaw inputs to keep wings level."},{text:"WIDE FINAL ALIGNMENT ONLY",desc:"Avoid low-altitude S-turns on short final."}]};case"elevators":return{title:"NO-ELEVATOR CONTINGENCY",items:[{text:"FLY GLIDEPATH USING THROTTLE",desc:"Small throttle pulses smoothly adjust vertical speed."},{text:"FLAPS - MINIMUM REQUIRED",desc:"Avoid large configuration pitch moments."}]};case"rudder":return{title:"JAMMED RUDDER CONTINGENCY",items:[{text:"SELECT RUNWAY INTO WIND",desc:"Avoid crosswind landing beyond bank capability."},{text:"USE ASYMMETRIC BRAKES BELOW 60 KTS",desc:"Maintain centerline after nosewheel lowers."}]};case"flaps":return{title:"NO-FLAP CONTINGENCY LANDING",items:[{text:"APPROACH SPEED - VREF + 15 KTS",desc:"Compensate for lost high-lift boundary margin."},{text:"SHALLOW FLARE & LONG RUNWAY",desc:"Higher ground speed increases stopping distance."}]};case"brakes":return{title:"BRAKELESS ROLLOUT SOLUTION",items:[{text:"TOUCH DOWN NEAR RUNWAY THRESHOLD",desc:"Maximize available rollout pavement."},{text:"MAX REVERSE + SPOILERS ON TOUCHDOWN",desc:"Keep reverse active down to taxi speed."}]};case"spoilers":return{title:"NO-SPOILER ROLLOUT SOLUTION",items:[{text:"TOUCH DOWN ON VREF WITH FIRM CONTACT",desc:"Firm contact minimizes float and aquaplaning."},{text:"MAX WHEEL BRAKES & REVERSE",desc:"Maintain continuous braking until taxi speed."}]};case"electrical":return{title:"TOTAL BLACKOUT CONTINGENCY",items:[{text:"FLY PITCH & HORIZON VISUALLY",desc:"Autopilot and A/THR remain offline permanently."},{text:"DAYLIGHT VMC DIVERT",desc:"Land at nearest visual runway immediately."}]};case"fuelLeak":return{title:"FUEL STARVATION CONTINGENCY",items:[{text:"ESTABLISH BEST GLIDE SPEED",desc:"Clean configuration (flaps 0, gear UP) for max range."},{text:"SELECT EMERGENCY LANDING FIELD NOW",desc:"Prepare deadstick approach before total flameout."}]};case"pressurization":return{title:"UNPRESSURIZED CRUISE SOLUTION",items:[{text:"REMAIN AT OR BELOW 10,000 FT MSL",desc:"Clear mountains; monitor increased ALTITUDE BURN."},{text:"DIVERT TO NEAREST SUITABLE AIRPORT",desc:"Plan unhurried VMC/ILS approach."}]};case"mcas":return{title:"MCAS DISCONNECT SOLUTION",items:[{text:"KEEP STAB TRIM CUTOUT OFF",desc:"Do not re-engage electric stab trim for rest of flight."},{text:"EXTEND FLAPS TO DAMP PITCH SENSITIVITY",desc:"MCAS stays inhibited when flaps > 0."}]};case"pitotStatic":return{title:"UNRELIABLE AIRSPEED TABLE SOLUTION",items:[{text:"CLIMB: +10 DEG PITCH / 85% N1",desc:"Disregard primary ASI and Altimeter."},{text:"APPROACH: +3 DEG PITCH / 58% N1",desc:"Cross-check HUD AGL & Ground Speed on final."}]};default:return qt(r)}}function qi(r,e,t){let i=[W(r,"target",e),W(r,"position",t),W(r,"positionTarget",t),W(r,"delta",0)];return{apply:()=>i.forEach(n=>n.apply()),restore:()=>i.forEach(n=>n.restore())}}function Yi(r){let e=window.geofs?.fx,t=e?.ParticleEmitter,i=r.object3d?.worldPosition,n=r.points?.contrailAnchor??(i&&{worldPosition:i});if(!(!t||!n))try{let s=new t({anchor:n,duration:1e10,rate:.03,life:1e4,easing:"easeOutQuart",startScale:.01,endScale:.2,randomizeStartScale:.01,randomizeEndScale:.15,startOpacity:1,endOpacity:.2,startRotation:"random",texture:"whitesmoke"}),a=window.Cesium?.Color,o=a&&new a(.1,.1,.1,1);return{apply:()=>{for(let l of Object.values(e.particles??{}))l?._emitter===s&&o&&l.setColor?.(o)},restore:()=>{s.destroy();for(let l of Object.values(e.particles??{}))l?._emitter===s&&l.destroy()}}}catch(s){console.warn("[GeoFS Extension] Could not start engine smoke:",s);return}}var Xi=[["gear","Landing Gear",["gearFront","gearLeft","gearRight"]],["ctrl","Flight Controls",["ailerons","elevators","rudder"]],["hyd","Hydraulics & Systems",["flaps","brakes","spoilers"]],["adv","Advanced Emergencies",["electrical","fuelLeak","structural","pressurization","mcas","pitotStatic"]]],Zi=`
  @keyframes geofsExtPulseRed {
    from { box-shadow: 0 0 4px #ef4444; }
    to { box-shadow: 0 0 12px #ef4444; }
  }
  .geofs-ext-fail-pill {
    position: fixed;
    right: 15px;
    bottom: 15px;
    z-index: 2147483003;
    padding: 5px 14px;
    background: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    font-family: Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 10px;
    cursor: grab;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
    user-select: none;
    touch-action: none;
    white-space: nowrap;
  }
  .geofs-ext-fail-pill.has-failures {
    border-color: #ef4444;
    color: #ff8d8d;
    animation: geofsExtPulseRed 1s infinite alternate;
  }
  #geofs-failure-menu {
    box-sizing: border-box;
    position: fixed;
    left: 50px;
    top: 60px;
    width: 460px;
    min-width: 460px;
    max-width: min(460px, calc(100vw - 24px));
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #888888;
    border-radius: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
    color: #ffffff;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    z-index: 2147483004;
    display: none;
    flex-direction: column;
    overflow: visible;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  #geofs-failure-menu * {
    box-sizing: border-box;
  }
  .geofs-ext-fail-led {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 5px #22c55e;
    flex-shrink: 0;
  }
  .geofs-ext-fail-led.is-failed {
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
    animation: geofsExtPulseRed 1s infinite alternate;
  }
  .geofs-ext-fail-btn {
    background: #000000;
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 3px 6px;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    text-align: center;
  }
  .geofs-ext-fail-btn--danger {
    border-color: #ef4444;
    color: #ff6b6b;
  }
  .geofs-ext-fail-btn--ok {
    border-color: #4caf50;
    color: #4ade80;
  }
  .geofs-ext-fail-btn--warn {
    border-color: #eab308;
    color: #facc15;
  }
`,Ie=class{id="failure-simulator";name="Failure Simulator";description="Draggable modal failures with probability rolls, emergency QRH overrides, and verified recovery.";supportedMajors=[3,4];defaultEnabled=!1;ctx=null;aircraft;active=new Map;chances=new Map;collapsedSections=new Set;nextProbabilityMs=0;pill=null;modal=null;bodyEl=null;probBtn=null;probInfoEl=null;styleEl=null;restoreWeather;lastAltitude=0;lastTimestamp=0;unmounts=[];init(e){this.ctx=e;let t=e.getSettings().failureSystemChances??{};for(let[i,n]of Object.entries(t))typeof n=="number"&&Number.isFinite(n)&&this.chances.set(i,Math.max(0,Math.min(1,n)));if(this.unmounts.push(e.onEvent("failure:request-active",()=>{for(let i of this.active.keys())this.emitFailure(i)})),this.unmounts.push(e.onEvent("failure:attempt-recovery",({type:i})=>{this.attemptRecovery(i)})),typeof document<"u"){let i=document.createElement("style");i.id="geofs-ext-failure-styles",i.textContent=Zi,document.head?.appendChild(i),this.styleEl=i;let n=document.createElement("button");n.type="button",n.id="fail-btn",n.className="geofs-ext-fail-pill",n.textContent="FAILURES",n.title="Open Failure Simulator Modal (Drag to move)",document.body?.appendChild(n),this.pill=n,this.unmounts.push(e.anchors.makeDraggable(n,"geofs_ext_fail_pill_pos",n)),this.unmounts.push(()=>n.remove());let s=l=>{a.style.display=l?"flex":"none";try{localStorage.setItem("geofs_ext_fail_modal_open",l?"1":"0")}catch{}l&&(this.render(),e.anchors.bringToFront(a),e.anchors.clampElementToViewport(a))};n.addEventListener("click",()=>{if(n.dataset.justDragged==="1"||!this.modal)return;let l=this.modal.style.display==="none"||!this.modal.style.display;s(l)});let a=document.createElement("div");a.id="geofs-failure-menu",a.style.display="none",a.innerHTML=`
        <div id="fail-header" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(0,0,0,0.5);border-bottom:1px solid rgba(136,136,136,0.45);border-radius:15px 15px 0 0;cursor:grab;user-select:none;touch-action:none;">
          <span style="font-weight:700;font-size:11px;letter-spacing:0.6px;color:#ffffff;">FAILURE SIMULATOR</span>
          <button type="button" data-role="close" style="background:none;border:none;color:#cccccc;cursor:pointer;font-size:14px;line-height:1;padding:0 2px;">\u2715</button>
        </div>
        <div style="padding:8px 12px;border-bottom:1px solid rgba(136,136,136,0.3);display:flex;flex-direction:column;gap:6px;">
          <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;">
            <button type="button" id="enBtn" class="geofs-ext-fail-btn geofs-ext-fail-btn--ok" style="padding:6px 8px;font-size:9.5px;">ENABLE PROBABILITY</button>
            <button type="button" data-role="clear-all" class="geofs-ext-fail-btn geofs-ext-fail-btn--danger" style="padding:6px 8px;font-size:9.5px;">CLEAR ALL FAILURES</button>
          </div>
          <div data-role="prob-info" style="font-size:9.5px;color:#aaaaaa;display:flex;justify-content:space-between;white-space:nowrap;">
            <span>Probability rolls off</span>
            <span>Recovery: 60%</span>
          </div>
        </div>
        <div data-role="sections" style="padding:8px 12px;display:flex;flex-direction:column;gap:6px;overflow:visible;"></div>
      `,document.body?.appendChild(a),this.modal=a,this.bodyEl=a.querySelector('[data-role="sections"]'),this.probBtn=a.querySelector("#enBtn"),this.probInfoEl=a.querySelector('[data-role="prob-info"]');let o=a.querySelector("#fail-header")??a;this.unmounts.push(e.anchors.makeDraggable(a,"geofs_ext_fail_modal_pos",o)),this.unmounts.push(()=>a.remove()),a.querySelector('[data-role="close"]')?.addEventListener("click",()=>{s(!1)});try{localStorage.getItem("geofs_ext_fail_modal_open")==="1"&&s(!0)}catch{}a.querySelector('[data-role="clear-all"]')?.addEventListener("click",()=>this.clear()),this.probBtn?.addEventListener("click",()=>{e.updateSettings({failureProbabilitiesEnabled:!e.getSettings().failureProbabilitiesEnabled})})}this.aircraft=window.geofs?.aircraft?.instance,this.syncProbabilityUi(e.getSettings()),this.render()}updatePillBadge(){if(!this.pill)return;let e=this.active.size;this.pill.textContent=e>0?`FAILURES (${e})`:"FAILURES",this.pill.classList.toggle("has-failures",e>0)}syncProbabilityUi(e){if(this.probBtn){let t=!!e.failureProbabilitiesEnabled;this.probBtn.textContent=t?"DISABLE PROBABILITY":"ENABLE PROBABILITY",this.probBtn.className=`geofs-ext-fail-btn ${t?"geofs-ext-fail-btn--danger":"geofs-ext-fail-btn--ok"}`,this.probBtn.setAttribute("aria-pressed",String(t))}if(this.probInfoEl){let t=Math.max(10,e.failureProbabilityIntervalSec||60),i=e.failureProbabilitiesEnabled&&this.nextProbabilityMs>this.lastTimestamp?Math.ceil((this.nextProbabilityMs-this.lastTimestamp)/1e3):t,n=e.failureProbabilitiesEnabled?`Roll every ${t}s \xB7 Next: ${i}s`:`Probability off (${t}s cycle)`;this.probInfoEl.innerHTML=`<span>${n}</span><span>Recovery: ${e.failureRecoveryChancePct??60}%</span>`}}persistChances(){let e={};for(let[t,i]of this.chances.entries())i>0&&(e[t]=Number(i.toFixed(3)));this.ctx?.updateSettings({failureSystemChances:e})}render(){if(this.updatePillBadge(),!this.bodyEl)return;let e=this.aircraft?.engines?.length??(this.aircraft?.engine?1:0),t=Array.from({length:e},(n,s)=>`engine${s}`),i=[...Xi,["eng","Engines",t]];this.bodyEl.replaceChildren(...i.filter(([,,n])=>n.length>0).map(([n,s,a])=>{let o=document.createElement("div"),l=this.collapsedSections.has(n),d=document.createElement("div");d.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:5px 9px;background:rgba(255,255,255,0.06);border:1px solid rgba(136,136,136,0.3);border-radius:10px;cursor:pointer;";let c=document.createElement("div");c.style.cssText="display:flex;align-items:center;gap:6px;";let u=document.createElement("span");u.style.cssText=`font-size:9px;transition:transform 0.15s;transform:${l?"rotate(0deg)":"rotate(90deg)"};`,u.textContent="\u25B6";let p=document.createElement("span");p.style.cssText="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;",p.textContent=s,c.append(u,p);let f=document.createElement("div");f.style.cssText="display:flex;gap:4px;";for(let x of["AUTO","FAIL","FIX"]){let T=document.createElement("button");T.type="button",T.className=`geofs-ext-fail-btn ${x==="FAIL"?"geofs-ext-fail-btn--danger":x==="FIX"?"geofs-ext-fail-btn--ok":""}`,T.textContent=x,T.setAttribute("aria-label",`${x} ${s}`),T.addEventListener("click",A=>{A.stopPropagation();for(let w of a)x==="AUTO"?this.chances.set(w,Number((Math.random()*(n==="adv"?.05:.1)).toFixed(2))):x==="FAIL"?this.fail(w,!1):this.active.has(w)&&this.fix(w);x==="AUTO"&&this.persistChances(),this.render()}),f.appendChild(T)}d.append(c,f),d.addEventListener("click",()=>{this.collapsedSections.has(n)?this.collapsedSections.delete(n):this.collapsedSections.add(n),this.render()});let h=a.length,g=h<=1?1:h===2||h===4?2:3,b=document.createElement("div");b.dataset.sectionGridCols=String(g),b.style.cssText=`display:${l?"none":"grid"};grid-template-columns:repeat(${g},minmax(0,1fr));gap:5px;padding-top:5px;`;for(let x of a)b.appendChild(this.systemRow(x));return o.append(d,b),o}))}systemRow(e){let t=this.active.has(e),i=Math.round((this.chances.get(e)??0)*100),n=e.startsWith("engine")?"Thrust loss and heavy smoke. Expect yaw asymmetry and reduced climb performance.":Ui[e],s=document.createElement("div");s.dataset.failureType=e,s.title=n,s.style.cssText="min-width:0;padding:6px 7px;background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.28);border-radius:10px;display:flex;flex-direction:column;gap:4px;";let a=document.createElement("div");a.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:4px;min-width:0;";let o=document.createElement("div");o.style.cssText="display:flex;align-items:center;gap:5px;flex:1;min-width:0;";let l=document.createElement("div");l.id=`led-${e}`,l.className=`geofs-ext-fail-led ${t?"is-failed":""}`;let d=document.createElement("span");d.style.cssText="font-size:10px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",d.textContent=Q(e),o.append(l,d);let c=document.createElement("span");c.style.cssText="font-size:9px;color:#aaaaaa;flex-shrink:0;",c.textContent=`${i}%`,a.append(o,c);let u=document.createElement("input");u.type="range",u.min="0",u.max="100",u.step="1",u.value=String(i),u.style.cssText="width:100%;height:4px;margin:0;accent-color:#4caf50;cursor:pointer;",u.setAttribute("aria-label",`${Q(e)} probability percentage`),u.addEventListener("input",()=>{c.textContent=`${u.value}%`,this.chances.set(e,Math.max(0,Math.min(100,Number(u.value)||0))/100)}),u.addEventListener("change",()=>this.persistChances());let p=document.createElement("div");p.style.cssText="display:flex;gap:3px;";let f=document.createElement("button");f.type="button",f.dataset.action="fail",f.className="geofs-ext-fail-btn geofs-ext-fail-btn--danger",f.style.cssText="flex:1;min-width:0;padding:3px 2px;font-size:8.5px;",f.textContent="FAIL",f.disabled=t,f.addEventListener("click",()=>this.fail(e));let h=document.createElement("button");h.type="button",h.dataset.action="recover",h.className="geofs-ext-fail-btn geofs-ext-fail-btn--warn",h.style.cssText="flex:1;min-width:0;padding:3px 2px;font-size:8.5px;",h.textContent="REC",h.disabled=!t||!gt(e),h.title=gt(e)?"Roll probability recovery via QRH procedure":"Permanent airframe damage cannot be repaired in flight",h.addEventListener("click",()=>this.attemptRecovery(e));let g=document.createElement("button");return g.type="button",g.dataset.action="fix",g.className="geofs-ext-fail-btn geofs-ext-fail-btn--ok",g.style.cssText="flex:1;min-width:0;padding:3px 2px;font-size:8.5px;",g.textContent="FIX",g.disabled=!t,g.addEventListener("click",()=>{this.fix(e),this.render()}),p.append(f,h,g),s.append(a,u,p),s}effect(e,t){let i=Date.now(),n=(s,a=1e3,o)=>({...s,intervalMs:a,dueAt:i,verifyRestored:o});if(e.startsWith("engine")){let s=Number(e.slice(6)),a=t.engines?.[s]??(s===0?t.engine:void 0);if(!a)return;let o=a.thrust,l=W(a,"thrust",0),d=Yi(a);return n({apply:()=>{l.apply(),d?.apply()},restore:()=>{l.restore(),d?.restore()}},50,()=>a.thrust===o)}switch(e){case"gearFront":case"gearLeft":case"gearRight":{let[s,a]=Vi[e],o=t.suspensions??[],l=(o.filter(u=>a.test(u.name?.toLowerCase()??"")).at(-1)??o[s])?.collisionPoints?.[0];if(!l)return;let d=l[2],c=Math.max((Number.isFinite(d)?d:-2.5)+2,.5);return n(W(l,2,c),1e3,()=>l[2]===d)}case"ailerons":case"elevators":case"rudder":{let s=e==="rudder"?e:e.slice(0,-1),a=[],o=(t.airfoils??[]).flatMap(l=>!l.object3d||!l.name?.toLowerCase().includes(s)?[]:(a.push({object3d:l.object3d,orig:l.object3d._scale}),[W(l.object3d,"_scale",[0,0,0])]));return o.length?n({apply:()=>o.forEach(l=>l.apply()),restore:()=>o.forEach(l=>l.restore())},1e3,()=>a.every(l=>JSON.stringify(l.object3d?._scale)===JSON.stringify(l.orig))):void 0}case"flaps":case"spoilers":{let s=e==="flaps"?window.controls?.flaps:window.controls?.airbrakes,a=s?.position;if(!s||typeof a!="number"||!Number.isFinite(a))return;let o=e==="flaps"?Math.max(0,t.definition?.flapsSteps??0):1,l=Math.max(0,Math.min(o,e==="flaps"?Math.round(s.target??0):a));return n(qi(s,l,a),50,()=>s.delta!==0)}case"brakes":return window.controls&&n(W(window.controls,"brakes",0),500);case"electrical":{let s=window.geofs?.autopilot,a=window.instruments,o=a?.visible!==!1,l=(t.cockpitSetup?.parts??[]).slice(1,6).flatMap(d=>d?.object3d?[W(d.object3d,"_scale",[0,0,0])]:[]);return n({apply:()=>{s?.turnOff?.(),a?.hide?.(),l.forEach(d=>d.apply())},restore:()=>{l.forEach(d=>d.restore()),o&&a?.show?.()}},1e3,()=>!o||a?.visible!==!1)}case"pitotStatic":{let s=window.instruments,a=s?.update;if(!s||!a)return;let o=function(...l){let d=window.geofs?.animation?.values;if(!d)return a.apply(this,l);let c=W(d,"kias",0),u=W(d,"altitude",0);try{return c.apply(),u.apply(),a.apply(this,l)}finally{c.restore(),u.restore()}};return n({apply:()=>{s.update===a&&(s.update=o)},restore:()=>{s.update===o&&(s.update=a)}},1e3,()=>s.update===a)}case"fuelLeak":{let s=!1;return{intervalMs:1e3,dueAt:i+12e4,apply:()=>{t.engine?.on!==!1&&(s=(this.ctx?.sim.stopEngines()??!1)||s)},restore:()=>{!s||t.crashed||t!==window.geofs?.aircraft?.instance||(t.startEngines?t.startEngines():t.startEngine?.())}}}case"structural":case"pressurization":{let s=window.weather?.definition;return s?(this.restoreWeather??=W(s,"turbulences",3).restore,n({apply:()=>this.applyWeather(),restore:()=>this.applyWeather()},1e3)):void 0}case"mcas":{let s=window.controls;if(!s)return;let a=s.elevatorTrimMin,o=W(s,"elevatorTrimMin",-10),l=W(s,"elevatorTrim",s.elevatorTrim);return n({apply:d=>{o.apply(),d&&!d.autopilotOn&&s.flaps?.position===0&&(d.timestamp-i)%1e4<5e3&&(s.elevatorTrim??0)>-10&&(s.elevatorTrim=(s.elevatorTrim??0)-.01)},restore:()=>{o.restore(),l.restore()}},50,()=>s.elevatorTrimMin===a)}}}applyWeather(){let e=window.weather?.definition;e&&this.active.has("structural")?e.turbulences=3:e&&this.active.has("pressurization")?e.turbulences=Math.max(0,(this.lastAltitude-9e3)/5e3):(this.restoreWeather?.(),this.restoreWeather=void 0)}emitFailure(e){this.ctx?.emitEvent("failure:triggered",{type:e,procedure:qt(e),recoverable:gt(e)})}attemptRecovery(e,t){if(!this.active.has(e)||!this.ctx)return!1;let i=this.ctx.getSettings().failureRecoveryChancePct??60,n=t??Math.random();return ji(e,i,n)&&this.fix(e)?(this.ctx.anchors.showToast(`${Q(e)} RECOVERED & RESTORED`,"info"),this.render(),!0):(this.ctx.emitDiag?.("RECOVERY_FAILED",{type:e}),this.ctx.anchors.showToast(`${Q(e)} recovery failed \u2014 Contingency checklist loaded`,"critical"),this.ctx.emitEvent("failure:contingency",{type:e,procedure:Wi(e)}),this.render(),!1)}fail(e,t=!0){if(!this.aircraft||this.aircraft.crashed||this.active.has(e))return;let i=this.effect(e,this.aircraft);if(!i){this.ctx?.emitDiag?.("FAILURE_SYSTEM_ERROR",{level:"error",type:e,system:Q(e),reason:"Target control surface or system missing on current aircraft"});return}this.active.set(e,i),e!=="fuelLeak"&&i.apply(),this.ctx?.audio.playGpwsAlert(),this.ctx?.anchors.showToast(`${Q(e)} failure`,"critical"),this.ctx?.emitDiag?.("FAILURE_TRIGGERED",{type:e}),this.emitFailure(e),t&&this.render()}fix(e){let t=this.active.get(e);if(!t)return!1;this.active.delete(e),t.restore();let i=t.verifyRestored?t.verifyRestored():!0;return this.ctx?.emitDiag?.("RESTORE_VERIFIED",{type:e,verified:i}),this.ctx?.emitEvent("failure:cleared",{type:e}),i}clear(){for(let e of[...this.active.keys()].reverse())this.fix(e);this.render()}onSettingsChange(e){this.syncProbabilityUi(e)}update(e){let t=window.geofs?.aircraft?.instance;if(t!==this.aircraft&&(this.clear(),this.aircraft=t,this.render()),e.paused||e.crashed||!this.ctx)return;this.lastAltitude=e.altitude,this.lastTimestamp=e.timestamp;for(let s of this.active.values())e.timestamp>=s.dueAt&&(s.apply(e),s.dueAt=e.timestamp+s.intervalMs);let i=this.ctx.getSettings(),n=Math.max(1e4,(i.failureProbabilityIntervalSec||60)*1e3);if(!i.failureProbabilitiesEnabled)this.nextProbabilityMs=0;else if(this.nextProbabilityMs===0)this.nextProbabilityMs=e.timestamp+n;else if(e.timestamp>=this.nextProbabilityMs){this.nextProbabilityMs=e.timestamp+n;for(let[s,a]of this.chances)a>0&&Math.random()<a&&this.fail(s)}this.modal&&this.modal.style.display!=="none"&&this.syncProbabilityUi(i)}destroy(){this.clear();for(let e of this.unmounts)e();this.unmounts=[],this.styleEl?.remove(),this.styleEl=null,this.pill=null,this.modal=null,this.bodyEl=null,this.probBtn=null,this.probInfoEl=null,this.aircraft=void 0,this.ctx=null,this.nextProbabilityMs=0}};var Ji="data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="22" fill="none" stroke="#ffffff" stroke-width="7"/><line x1="16" y1="64" x2="42" y2="64" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/><line x1="86" y1="64" x2="112" y2="64" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/><line x1="64" y1="20" x2="64" y2="42" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/></svg>');function Qi(r,e,t,i){let n=e.x-r.x,s=e.y-r.y,a=e.z-r.z;if(i<=0||i>5||n===0&&s===0&&a===0)return null;let o=1.5/i,l={x:t.x+n*o,y:t.y+s*o,z:t.z+a*o};return Object.values(l).every(Number.isFinite)?l:null}function en(r,e,t){let n=e.fpvResolutionMode==="lowres"||e.fpvResolutionMode==="auto"&&t<=.6?"lowres":"hires",s=n==="lowres"?"fpv_lowres.png":"fpv_hires.png";return{url:r?.getAssetUrl?.(s)||Ji,variant:n}}function Yt(r){return r<-.06?"night":r<.08?"twilight":"day"}function mt(r){let e=(r%24+24)%24;return e<5.5||e>=19.5?"night":e<7||e>=18?"twilight":"day"}function Xt(){let r=typeof window<"u"?window:void 0,e=r?.geofs,t="day",i=e?.environment?.sunElevation;if(typeof i=="number"&&Number.isFinite(i))t=Yt(i);else{let n=e?.camera?.lla||e?.aircraft?.instance?.llaLocation,s=e?.api?.viewer?.clock?.currentTime,a=r?.Cesium,o=!1;if(s&&a)try{let l=a.Simon1994PlanetaryPositions?.computeSunPositionInEarthInertialFrame?.(s),d=a.Transforms?.computeIcrfToFixedMatrix?.(s)||a.Transforms?.computeTemeToPseudoFixedMatrix?.(s);if(l&&d&&a.Matrix3?.multiplyByVector&&a.Cartesian3?.fromDegrees&&n?.every(Number.isFinite)){let c=a.Matrix3.multiplyByVector(d,l,new a.Cartesian3),u=a.Cartesian3.fromDegrees(n[1],n[0],n[2]??0),p=Math.hypot(c.x,c.y,c.z),f=Math.hypot(u.x,u.y,u.z);if(p>0&&f>0){let h=(c.x*u.x+c.y*u.y+c.z*u.z)/(p*f);Number.isFinite(h)&&(t=Yt(h),o=!0)}}if(!o&&a.JulianDate?.toDate){let c=a.JulianDate.toDate(s);if(c instanceof Date&&Number.isFinite(c.getTime())){let u=c.getUTCHours()+c.getUTCMinutes()/60+c.getUTCSeconds()/3600,p=n&&Number.isFinite(n[1])?n[1]:0;t=mt(u+p/15),o=!0}}}catch{}if(!o){let l=r?.weather?.localTime,d=e?.environment?.time;typeof l=="number"&&Number.isFinite(l)?t=mt(l):typeof d=="number"&&Number.isFinite(d)?t=mt(d):(e?.night===!0||typeof document<"u"&&document.body?.classList?.contains("geofs-night"))&&(t="night")}}return t==="night"?{phase:t,color:"#ffffff",textShadow:"0 1px 2px rgba(0, 0, 0, 0.9)"}:t==="twilight"?{phase:t,color:"#f8fafc",textShadow:"0 1px 2px rgba(0, 0, 0, 0.85)"}:{phase:t,color:"#000000",textShadow:"none"}}function tn(r,e){let t=Number.isFinite(r.vs)?r.vs:0,i=Number.isFinite(r.aoa)?r.aoa:0,n=Number.isFinite(r.kias)?r.kias:0,s=r.aglFeet===void 0||!Number.isFinite(r.aglFeet)||r.aglFeet>20,a=!r.groundContact&&s&&n>=35,o=i>18&&i<75&&n<180;if(!!(a&&(e?.stalling||o)))return{isWarning:!0,hue:0};let d=t>=0?120+Math.min(1,t/3e3)*80:120-Math.min(1,Math.abs(t)/5e3)*90;return{isWarning:!1,hue:Math.round(d)}}var Oe=class{id="flight-path-vector";name="Flight Path Vector";description="GeoFS V3.9 Cesium 3D FPV billboard with bundled hi-res reticle and Glideslope widget.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;visible=!0;lastCameraCartesian=null;lastSample;cesiumEntity=null;currentAssetVariant=null;svgEl=null;birdEl=null;glideslopeEl=null;glideslopeSpan=null;unmounts=[];init(e){this.visible=!0,this.ctx=e,typeof document<"u"&&this.ensureGlideslopeWidget();let t=e.getSettings().keybindings.toggleFpv;this.unmounts.push(e.keybinds.register("fpv-toggle",t,()=>this.toggle()))}onSettingsChange(e){this.ctx?.keybinds.updateCombo("fpv-toggle",e.keybindings.toggleFpv),this.currentAssetVariant=null}toggle(){this.visible=!this.visible,this.lastCameraCartesian=null,this.lastSample=void 0,this.cesiumEntity&&(this.cesiumEntity.show=this.visible),this.birdEl&&(this.birdEl.style.display="none"),this.svgEl&&(this.svgEl.style.display=this.visible?"block":"none"),this.glideslopeEl&&(this.glideslopeEl.style.display=this.visible?"inline-block":"none")}ensureGlideslopeWidget(){if(typeof document>"u"||!document.body)return null;let e=document.getElementById("flightDataDisplay0");e||(e=document.createElement("div"),e.id="flightDataDisplay0",document.body.appendChild(e)),e.style.cssText='position:fixed;bottom:40px;right:calc(10px + 48px + 16px);height:36px;min-width:64px;padding:0 16px;display:inline-block;background:0 0;border:none;border-radius:0;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none;font-family:"Roboto","Helvetica","Arial",sans-serif;font-size:14px;font-weight:400;text-transform:uppercase;overflow:hidden;will-change:box-shadow;transition:box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);text-align:center;line-height:36px;vertical-align:middle;z-index:9999;pointer-events:none;';let t=Xt(),i=e.querySelector("span");return i||(e.innerHTML=`<span style="background: 0 0; border: none; border-radius: 2px; color: ${t.color}; text-shadow: ${t.textShadow}; display: inline-block; padding: 0 8px; transition: color .3s ease, text-shadow .3s ease;">Glideslope N/A</span>`,i=e.querySelector("span")),i&&(i.style.color=t.color,i.style.textShadow=t.textShadow,i.dataset.timePhase=t.phase),this.glideslopeEl=e,this.glideslopeSpan=i,e}ensureSvgFallback(){if(this.svgEl||typeof document>"u"||!document.body)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("viewBox","0 0 100 100"),e.style.cssText="position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147482000;";let t=document.createElementNS("http://www.w3.org/2000/svg","g");t.innerHTML=`
      <circle cx="50" cy="50" r="1.4" fill="none" stroke="#22c55e" stroke-width="0.35" />
      <line x1="46.5" y1="50" x2="48.6" y2="50" stroke="#22c55e" stroke-width="0.35" />
      <line x1="51.4" y1="50" x2="53.5" y2="50" stroke="#22c55e" stroke-width="0.35" />
      <line x1="50" y1="48.6" x2="50" y2="47.1" stroke="#22c55e" stroke-width="0.35" />
    `,t.style.display="none",e.appendChild(t),document.body.appendChild(e),this.svgEl=e,this.birdEl=t}update(e){let t=window.geofs,i=t?.aircraft?.instance,n=t?.camera?.lla,s=window.Cesium?.Cartesian3?.fromDegrees;if(this.updateGlideslopeReadout(e),!this.visible||e.paused||e.crashed||!i||!n?.every(Number.isFinite)||!s){this.cesiumEntity&&(this.cesiumEntity.show=!1),this.birdEl&&(this.birdEl.style.display="none"),this.lastCameraCartesian=null,this.lastSample=void 0;return}let{isWarning:a,hue:o}=tn(e,i),l=t?.api?.viewer?.entities,d=Math.max(.25,Number(t?.api?.renderingSettings?.resolutionScale)||1),c=this.ctx?.getSettings();if(l?.add&&c){let k=s(n[1],n[0],n[2]);if(!k||!Object.values(k).every(Number.isFinite))return;let{url:F,variant:y}=en(this.ctx,c,d);if(!this.cesiumEntity){let I=(Number(t?.animation?.values?.groundElevationFeet)||0)/3.2808399,_=s(n[1],n[0],Number.isFinite(I)?I:n[2])||k;this.cesiumEntity=l.add({position:_,billboard:{image:F,scale:.03*(1/d),color:window.Cesium?.Color?.LIME}}),this.currentAssetVariant=y,this.ctx?.emitDiag?.("FPV_BILLBOARD_READY",{variant:y,howFar:c.fpvProjectionFactor??15})}let L=Math.max(1,Math.min(100,Number(c.fpvProjectionFactor)||15)),D=null;if(this.lastCameraCartesian){let I=k.x-this.lastCameraCartesian.x,_=k.y-this.lastCameraCartesian.y,V=k.z-this.lastCameraCartesian.z;if(Number.isFinite(I)&&Number.isFinite(_)&&Number.isFinite(V)&&(I!==0||_!==0||V!==0)){let B={x:k.x+L*I,y:k.y+L*_,z:k.z+L*V};Object.values(B).every(Number.isFinite)&&(D=B)}}if(this.lastCameraCartesian=k,this.cesiumEntity.show=this.visible,this.cesiumEntity.billboard){this.currentAssetVariant!==y&&(this.cesiumEntity.billboard.image=F,this.currentAssetVariant=y),this.cesiumEntity.billboard.scale=.03*(1/d);let I=window.Cesium?.Color;this.cesiumEntity.billboard.color=a?I?.RED??"red":I?.fromHsl?.(o/360,1,.5)??I?.LIME??"lime"}D&&(this.cesiumEntity.position=D);return}this.ensureSvgFallback();let u=this.birdEl,p=this.svgEl,f=i.llaLocation,h=t?.api?.viewer?.scene,g=h?.canvas,b=window.Cesium?.SceneTransforms,x=b?.worldToWindowCoordinates??b?.wgs84ToWindowCoordinates;if(!u||!p||!f?.every(Number.isFinite)||!g||!x){u&&(u.style.display="none");return}let T=s(f[1],f[0],f[2]),A=this.lastSample;this.lastSample={aircraft:i,position:T,time:e.timestamp};let w=A?.aircraft===i?Qi(A.position,T,s(n[1],n[0],n[2]),(e.timestamp-A.time)/1e3):null,C=w&&x(h,w);if(!C||!Number.isFinite(C.x)||!Number.isFinite(C.y)){u.style.display="none";return}let m=p.getBoundingClientRect(),v=g.getBoundingClientRect(),M=Math.min(m.width,m.height);if(M<=0)return;let S=(v.left+C.x-m.left-m.width/2)*100/M,E=(v.top+C.y-m.top-m.height/2)*100/M;u.style.display="",u.setAttribute("transform",`translate(${S.toFixed(2)} ${E.toFixed(2)})`);for(let k of u.children)k.setAttribute("stroke",`hsl(${o}, 100%, 50%)`)}updateGlideslopeReadout(e){let t=this.glideslopeEl??this.ensureGlideslopeWidget();if(!t)return;t.style.display=this.visible?"inline-block":"none";let i=window.geofs,n=i?.animation?.getValue?.("NAV1Direction"),s=Number(i?.animation?.getValue?.("NAV1Distance")),a="N/A";if(n&&Number.isFinite(s)&&(n==="to"||s!==600)&&Number.isFinite(e.aglFeet)){let d=n==="to"?s+600:Math.abs(s-600);if(d>0){let c=Math.atan(e.aglFeet*.3048/d)*(180/Math.PI);Number.isFinite(c)&&(a=c.toFixed(1))}}else typeof e.glideslopeDeviation=="number"&&Number.isFinite(e.glideslopeDeviation)&&(a=e.glideslopeDeviation.toFixed(1));let o=Xt(),l=this.glideslopeSpan??t.querySelector("span");l?l.textContent=`Glideslope ${a}`:(t.innerHTML=`<span style="background: 0 0; border: none; border-radius: 2px; color: ${o.color}; text-shadow: ${o.textShadow}; display: inline-block; padding: 0 8px; transition: color .3s ease, text-shadow .3s ease;">Glideslope ${a}</span>`,l=t.querySelector("span"),this.glideslopeSpan=l),l&&(l.style.color=o.color,l.style.textShadow=o.textShadow,l.dataset.timePhase=o.phase)}destroy(){for(let e of this.unmounts)e();if(this.unmounts=[],this.cesiumEntity){try{window.geofs?.api?.viewer?.entities?.remove?.(this.cesiumEntity)}catch{}this.cesiumEntity=null}this.lastCameraCartesian=null,this.lastSample=void 0,this.currentAssetVariant=null,this.svgEl?.remove(),this.svgEl=null,this.birdEl=null,this.glideslopeEl?.remove(),this.glideslopeEl=null,this.glideslopeSpan=null,this.ctx=null}};var nn={Butter:["A flawless touchdown! Absolutely buttery smooth.","Beautifully greased landing. A work of art!","Stunning touchdown! Passengers barely felt the wheels kiss the tarmac."],Silky:["Extremely smooth landing. Silky transition from air to ground.","Superb landing technique. Very gentle touchdown.","Excellent greaser! That was beautifully managed."],Great:["Great landing! A solid, controlled touchdown.","Very clean arrival. Standard professional landing.","Well within limits. Comfortable touchdown."],Firm:["A bit firm, but a positive touchdown.","Firm landing. Definitely felt the gear compress.","A positive touchdown to prevent aquaplaning."],Hard:["Hard landing. Heavily compressed struts.","Ouch! That was a rough touchdown.","Hard arrival. Structural inspection might be needed."],"Bone Shaker":["Bone-shaking touchdown! That will rattle some teeth.","Extremely hard impact. Main gear struts bottomed out.","Severe hard landing. Cabin doors popped open!"],Crash:["CRASH! Structural failure occurred on impact.","Catastrophic touchdown. The gear has disintegrated.","Hull loss landing. Major emergency response triggered."]},sn={perfect:["Passengers are applauding! Some are weeping with joy.","A quiet cabin filled with smiles. The perfect flight.","Cabin crew are beaming. High praise all around."],good:["Passengers are pleased. A comfortable and safe arrival.","Standard relaxed sighs in the cabin as the spoilers deploy.","Very happy passengers. Standard arrival."],nervous:["A few gasps in the cabin. People checking their seatbelts.","Some nervous looks exchanged. A bit of a jolt.","Nervous giggles as the cabin realizes they're down."],angry:["Audible groans from the back. Bags shifted in the overhead bins.","Spilled drinks and angry murmurs throughout the cabin.","A passenger is complaining about neck pain."],lawsuit:["Lawsuits pending. Whiplash alerts activated!","Chaos in the cabin. Sirens, screaming, and lawyer phone calls.","The FAA and legal teams have already been notified."]};function Zt(r,e,t){let i=Math.abs(e),n=r==="Crash"||i>=800||t>=3?"lawsuit":i>=500||t===2?"angry":i>=300||t===1?"nervous":i<160?"perfect":"good",s=a=>a[Math.floor(Math.random()*a.length)];return{qualityFeedback:s(nn[r==="Smooth"?"Great":r]),passengerFeedback:s(sn[n])}}var rn=.0005399568034557236,He=class{sawGroundBeforeTakeoff=!1;airborne=!1;teleportOrSlewDetected=!1;lastLat=null;lastLon=null;maxAltFt=0;maxGForce=1;departureMaxBankDeg=0;approach500Stable=!0;approach500Checked=!1;reset(){this.sawGroundBeforeTakeoff=!1,this.airborne=!1,this.teleportOrSlewDetected=!1,this.lastLat=null,this.lastLon=null,this.maxAltFt=0,this.maxGForce=1,this.departureMaxBankDeg=0,this.approach500Stable=!0,this.approach500Checked=!1}sample(e,t=!1){if(t&&(this.teleportOrSlewDetected=!0),this.lastLat!==null&&this.lastLon!==null&&Number.isFinite(e.lat)&&Number.isFinite(e.lon)){let i=Math.max(.2,Math.cos(e.lat*Math.PI/180));Math.hypot((e.lat-this.lastLat)*111320,(e.lon-this.lastLon)*111320*i)*rn>5&&(this.teleportOrSlewDetected=!0)}if(this.lastLat=e.lat,this.lastLon=e.lon,e.groundContact&&e.aglFeet<30){this.airborne||(this.sawGroundBeforeTakeoff=!0);return}!this.airborne&&e.aglFeet>50&&(this.airborne=!0),this.airborne&&(this.maxAltFt=Math.max(this.maxAltFt,e.altitude),Number.isFinite(e.gForce)&&(this.maxGForce=Math.max(this.maxGForce,Math.abs(e.gForce))),e.aglFeet<=1500&&(this.departureMaxBankDeg=Math.max(this.departureMaxBankDeg,Math.abs(e.roll))),e.aglFeet<=550&&e.aglFeet>=400&&e.vs<0&&(this.approach500Checked=!0,(Math.abs(e.vs)>1300||Math.abs(e.roll)>25)&&(this.approach500Stable=!1)))}evaluate(e){let t=this.sawGroundBeforeTakeoff&&this.airborne&&!this.teleportOrSlewDetected,i=e.score/10*5;this.approach500Stable||(i-=.4),this.maxGForce>2.4&&(i-=.3),e.rating==="Crash"&&(i=1);let n=Math.max(1,Math.min(5,Math.round(i))),s=this.sawGroundBeforeTakeoff?this.departureMaxBankDeg>32?`Aggressive initial bank (${Math.round(this.departureMaxBankDeg)}\xB0)`:"Clean runway departure & climb-out":"Mid-air spawn (untracked departure)",a=this.teleportOrSlewDetected?"Slew/teleport discontinuity detected":this.maxGForce>2.4?`High cruise G-load (${this.maxGForce.toFixed(1)}G)`:`Smooth cruise discipline (peak ${Math.round(this.maxAltFt)} ft)`,o=this.approach500Checked?this.approach500Stable?"Stabilized 500 ft AGL gate":"Unstabilized 500 ft AGL gate (high sink/bank)":"Short pattern / direct final",l=`${e.rating} (${e.vsFpm} fpm${e.bounces?`, ${e.bounces} bounce`:""}${e.inTouchdownZone?", TDZ":", off-TDZ"})`;return{authenticFlight:t,stars:n,phaseCritique:{departure:s,cruise:a,approach:o,touchdown:l}}}};var Ge=class{samples=[];record(e,t=!1){let i=this.samples.at(-1);if(!t&&i&&e.timestamp-i.timestampMs<250)return;let n={timestampMs:e.timestamp,lat:e.lat,lon:e.lon,altitudeFt:e.altitude,aglFt:e.aglFeet,kias:e.kias,groundSpeedKts:e.groundSpeed,vsFpm:e.vs,headingDeg:e.heading,pitchDeg:e.pitch,rollDeg:e.roll,gForce:e.gForce,groundContact:e.groundContact};for(this.samples.push(n);this.samples.length>121||this.samples[0].timestampMs<e.timestamp-3e4;)this.samples.shift()}finish(e){this.record(e,!0);let t=this.samples;return this.reset(),t}reset(){this.samples=[]}};function on(r){let e=Math.abs(r);return e<80?"Butter":e<160?"Silky":e<300?"Great":e<500?"Firm":e<800?"Hard":e<1100?"Bone Shaker":"Crash"}function an(r,e,t,i,n){let s=(o,l)=>Math.max(0,Math.min(l,o)),a=s((Math.abs(r)-50)/70,5)+s(Math.abs(e-1)*2,2)+Math.min(i*2,6)+s(Math.abs(t)/10,1.5)+(n?0:1);return s(10-a,10)}function ln(){let r=window.geofs,e=r?.aircraft?.instance?.llaLocation;if(!e||!r?.runways?.getNearestRunway||!r.utils?.distanceBetweenLocations)return!1;try{let t=r.runways.getNearestRunway(e);return!t?.aimingPointLla1||!t.aimingPointLla2?!1:Math.min(r.utils.distanceBetweenLocations(e,t.aimingPointLla1),r.utils.distanceBetweenLocations(e,t.aimingPointLla2))<600}catch{return!1}}function dn(r){return r==="Butter"||r==="Silky"?"badge-butter":r==="Great"||r==="Smooth"||r==="Firm"?"badge-acceptable":r==="Crash"?"badge-crash":"badge-hard"}function cn(r){let e=Math.abs(r.vsFpm),t=r.bounces??0;return r.rating==="Crash"||e>=800||t>=3?"#7f1d1d":e>=500||t===2?"#ef4444":e>=300||t===1?"#eab308":e<160?"#22c55e":"#84cc16"}var _e=class{id="landing-statistics";name="Landing Statistics";description="Slide-in touchdown score card, GPWS callouts, rating badges, and Chrome logbook sync.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;wasAirborne=!1;crashLatched=!1;airborneStartTime=null;lastLandingTime=0;aircraftId=null;replay=new Ge;evaluator=new He;reportTimer;report=null;reportDragCleanup=null;reportOpen=!1;reportDuration=null;lastGroundHeight;calibratedVsFpm;lastApproach=null;bounces=0;inTouchdownZone=!1;gpwsFired=new Set;sessionRecords=[];sounds;listEl=null;timerCheckboxEl=null;secondsInputEl=null;unmountTab=null;styleEl=null;init(e){if(this.ctx=e,this.injectStyles(),typeof document>"u")return;let t=document.createElement("div");t.style.cssText="display:flex;flex-direction:column;gap:6px;";let i=document.createElement("div");i.style.cssText="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:10px;";let n=document.createElement("input");n.type="checkbox",n.checked=e.getSettings().landingReportAutoClose??!0,n.addEventListener("change",()=>e.updateSettings({landingReportAutoClose:n.checked})),this.timerCheckboxEl=n;let s=document.createElement("label");s.style.cssText="display:flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap;",s.append(n," Auto-close");let a=document.createElement("div");a.style.cssText="display:flex;align-items:center;gap:3px;white-space:nowrap;";let o=document.createElement("input");o.type="number",o.min="1",o.max="3600",o.value=String(e.getSettings().landingReportSeconds??15),o.style.cssText="width:44px;background:#000;color:#fff;border:1px solid #888;border-radius:6px;padding:1px 4px;font-size:10px;",o.setAttribute("aria-label","Landing report duration in seconds"),o.addEventListener("change",()=>{let u=Math.max(1,Math.min(3600,o.valueAsNumber||15));o.value=String(u),e.updateSettings({landingReportSeconds:u})}),this.secondsInputEl=o;let l=document.createElement("span");l.textContent="s",a.append(o,l),i.append(s,a);let d=document.createElement("div");d.style.cssText="font-weight:700;font-size:11px;letter-spacing:0.4px;text-transform:uppercase;color:#ddd;",d.textContent="Session Touchdowns";let c=document.createElement("div");c.style.cssText="display:flex;flex-direction:column;gap:4px;font-size:10px;",c.textContent="No landings recorded in this session.",this.listEl=c,t.append(i,d,c),this.unmountTab=e.anchors.registerHudTab("land","LAND",t)}injectStyles(){if(this.styleEl||typeof document>"u"||!document.head||document.getElementById("geofs-ext-landing-stats-styles"))return;let e=document.createElement("style");e.id="geofs-ext-landing-stats-styles",e.textContent=`
      #statsCard.addonpack-card {
        box-sizing: border-box;
        position: fixed;
        left: 20px;
        bottom: 60px;
        width: 330px;
        min-width: 330px;
        max-width: min(330px, calc(100vw - 24px));
        background: var(--geofs-ext-bg, rgba(0, 0, 0, 0.8));
        color: var(--geofs-ext-fg, #ffffff);
        border: 1px solid var(--geofs-ext-border, #888888);
        border-radius: 15px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        z-index: 2147483000;
        display: flex;
        flex-direction: column;
        transform: translateX(-120%);
        transition: transform 0.35s ease, opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
      }
      #statsCard.addonpack-card * { box-sizing: border-box; }
      #statsCard.addonpack-card.active {
        transform: translateX(0);
        opacity: 1;
        pointer-events: auto;
      }
      #statsCard .addonpack-card-header {
        padding: 10px 14px;
        background: rgba(255, 255, 255, 0.04);
        border-bottom: 1px solid rgba(136, 136, 136, 0.45);
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        cursor: grab;
        user-select: none;
        touch-action: none;
      }
      #statsCard .addonpack-card-header span {
        flex: 1;
        min-width: 0;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        color: #dddddd;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #statsCard .addonpack-close-btn {
        background: #000000;
        color: #ffffff;
        border: 1px solid #888888;
        border-radius: 15px;
        width: 22px;
        height: 22px;
        padding: 0;
        line-height: 20px;
        text-align: center;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      #statsCard .addonpack-card-content {
        padding: 12px 14px 14px;
      }
      #statsCard .stats-main-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        gap: 10px;
      }
      #statsCard .addonpack-score-circle {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 2px solid #dddddd;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      #statsCard .score-value {
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
        line-height: 1.1;
      }
      #statsCard .score-label {
        font-size: 9px;
        color: rgba(255, 255, 255, 0.78);
        text-transform: uppercase;
        font-weight: 700;
      }
      #statsCard .addonpack-badge {
        flex: 1;
        min-width: 0;
        padding: 10px 8px;
        border-radius: 12px;
        text-align: center;
        font-weight: 900;
        font-size: 13px;
        letter-spacing: 0.7px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #statsCard .badge-butter { background: linear-gradient(135deg, #22c55e, #16a34a); color: #ffffff; }
      #statsCard .badge-acceptable { background: linear-gradient(135deg, #eab308, #ca8a04); color: #000000; }
      #statsCard .badge-hard { background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; }
      #statsCard .badge-crash { background: linear-gradient(135deg, #7f1d1d, #450a0a); color: #ffffff; }
      #statsCard .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px 10px;
        margin-bottom: 10px;
      }
      #statsCard .stat-item {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      #statsCard .stat-label {
        font-size: 9px;
        color: rgba(100, 200, 255, 0.7);
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #statsCard .stat-value {
        font-size: 12px;
        color: #ffffff;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #statsCard .feedback-box {
        padding: 8px 10px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.35);
        border-left: 4px solid #22c55e;
        font-size: 10px;
        line-height: 1.35;
        color: #e2e8f0;
      }
    `,document.head.appendChild(e),this.styleEl=e}update(e){if(e.paused||!this.ctx||window.geofs?.cautiousWithTerrain)return;let t=e.aircraft?.id??null;if(t!==this.aircraftId&&(this.aircraftId=t,this.wasAirborne=!1,this.crashLatched=!1,this.airborneStartTime=null,this.lastLandingTime=0,this.closeReport(),this.lastGroundHeight=void 0,this.calibratedVsFpm=void 0,this.lastApproach=null,this.gpwsFired.clear(),this.replay.reset(),this.evaluator.reset()),!t)return;this.evaluator.sample(e,!!this.ctx.getSettings().realismOptions?.slewMode);let i=window.geofs?.aircraft?.instance,n=window.geofs?.animation?.values,s=i?.collisionPoints?.at(-2)?.worldPosition?.[2]??0,a=typeof n?.altitude=="number"&&typeof n.groundElevationFeet=="number"?n.altitude-n.groundElevationFeet+s*3.2808399:e.aglFeet,o=this.lastGroundHeight;if(Number.isFinite(a)&&(!o||a!==o.feet)&&(o&&e.timestamp>o.time&&(this.calibratedVsFpm=(a-o.feet)*6e4/(e.timestamp-o.time)),this.lastGroundHeight={feet:a,time:e.timestamp}),e.crashed){let l=!this.crashLatched&&this.wasAirborne;if(this.crashLatched=!0,this.airborneStartTime=null,!l){this.wasAirborne=!1,this.lastApproach=null,this.gpwsFired.clear(),this.replay.reset();return}}else if(this.crashLatched){let l=!e.groundContact&&e.aglFeet>=15,d=e.groundContact&&Math.abs(e.vs)<50&&e.groundSpeed<5;if(!l&&!d)return;this.crashLatched=!1}if(!e.groundContact&&!e.crashed){this.airborneStartTime===null&&(this.airborneStartTime=e.timestamp);let l=e.timestamp-this.airborneStartTime,d=Math.max(e.groundSpeed,e.kias)>=15;if((this.reportOpen?e.timestamp-this.lastLandingTime>=400&&(e.aglFeet>=3||l>=250&&d):e.aglFeet>=10||l>=1500&&d)&&(this.wasAirborne=!0),this.wasAirborne&&(this.lastApproach=e,this.replay.record(e)),e.aglFeet>80&&this.gpwsFired.clear(),this.wasAirborne&&!Re()&&e.vs<-100){let p=[{ft:50,callout:"50"},{ft:40,callout:"40"},{ft:30,callout:"30"},{ft:20,callout:"20"},{ft:10,callout:"10"}].filter(h=>e.aglFeet<=h.ft),f=p.at(-1);if(f&&!this.gpwsFired.has(f.ft)){for(let h of p)this.gpwsFired.add(h.ft);this.ctx.audio.playGpwsCallout(f.callout),f.ft===20&&(e.throttles[0]??0)>.15&&this.ctx.audio.playGpwsCallout("RETARD")}}return}if(this.airborneStartTime=null,this.wasAirborne){if(this.wasAirborne=!1,this.gpwsFired.clear(),!e.crashed&&a>=500){this.replay.reset();return}if(!e.crashed&&e.timestamp-this.lastLandingTime<400){this.replay.reset();return}this.lastLandingTime=e.timestamp;let l=this.reportOpen;this.bounces=l?this.bounces+1:0,l||(this.inTouchdownZone=ln());let d=this.lastApproach??e;this.lastApproach=null;let c=typeof n?.accZ=="number"&&Number.isFinite(n.accZ)?n.accZ/9.80665:e.gForce,u=e.crashed?"Crash":on(d.vs),p=an(d.vs,c,d.roll,this.bounces,this.inTouchdownZone),f=this.evaluator.evaluate({rating:u,score:p,vsFpm:Math.round(d.vs),bounces:this.bounces,inTouchdownZone:this.inTouchdownZone});l||this.evaluator.reset();let h={id:`${e.timestamp}-${Math.random().toString(36).slice(2,7)}`,timestamp:new Date(e.timestamp).toISOString(),aircraftId:e.aircraft?.id||"unknown",aircraftName:e.aircraft?.name||"Unknown Aircraft",vsFpm:Math.round(d.vs),gForce:Number(c.toFixed(2)),rollDeg:Number(d.roll.toFixed(1)),groundSpeedKts:Math.round(e.groundSpeed),rating:u,calibratedVsFpm:this.calibratedVsFpm,indicatedAirspeedKts:d.kias,trueAirspeedKts:typeof i?.trueAirSpeed=="number"?i.trueAirSpeed*1.94384449:void 0,pitchDeg:Math.abs(typeof n?.atilt=="number"?n.atilt:e.pitch),...Zt(u,d.vs,this.bounces),bounces:this.bounces,inTouchdownZone:this.inTouchdownZone,score:p,authenticFlight:f.authenticFlight,stars:f.stars,phaseCritique:f.phaseCritique,lat:Number(e.lat.toFixed(4)),lon:Number(e.lon.toFixed(4)),replay:this.replay.finish(e)};this.sessionRecords=[h,...this.sessionRecords].slice(0,10),this.renderSessionList(),this.showReport(h,l);let g=this.ctx.getAudioUrl?.("");if(g&&!this.sounds&&typeof Audio<"u"){this.sounds={soft:new Audio(g+"soft_landing.wav"),hard:new Audio(g+"hard_landing.wav"),crash:new Audio(g+"crash_landing.wav")};for(let x of Object.values(this.sounds))x.preload="none"}let b=this.sounds;if(b){for(let T of Object.values(b))T.pause(),T.currentTime=0;(u==="Crash"?b.crash:u==="Firm"||u==="Hard"||u==="Bone Shaker"?b.hard:b.soft).play().catch(()=>{})}this.ctx.anchors.showToast(`${l?`Bounce #${this.bounces}`:"Touchdown"}: ${h.vsFpm} fpm | ${h.gForce}G | ${u}`,u==="Crash"?"critical":u==="Hard"||u==="Bone Shaker"?"warn":"info"),this.ctx.emitDiag?.("LANDING_RECORDED",{rating:h.rating,vsFpm:h.vsFpm,gForce:h.gForce,score:h.score,bounces:h.bounces}),typeof window<"u"&&typeof window.postMessage=="function"&&window.postMessage({type:"GEOFS_EXT_LANDING_RECORD",record:h},"*")}}showReport(e,t){if(typeof document>"u"||!document.body)return;this.closeReport();let i=document.createElement("section");i.id="statsCard",i.className="addonpack-card",i.setAttribute("aria-label","Landing Statistics");let n=document.createElement("div");n.className="addonpack-card-header";let s=document.createElement("span");s.textContent=`Landing Statistics \xB7 ${e.aircraftName}`;let a=document.createElement("button");a.type="button",a.className="addonpack-close-btn",a.textContent="\xD7",a.setAttribute("aria-label","Close landing report"),a.addEventListener("click",A=>{A.stopPropagation(),this.closeReport()}),n.append(s,a);let o=document.createElement("div");o.className="addonpack-card-content";let l=document.createElement("div");l.className="stats-main-row";let d=document.createElement("div");d.className="addonpack-score-circle";let c=document.createElement("span");c.className="score-value",c.textContent=e.score!==void 0?e.score.toFixed(1):"\u2014";let u=document.createElement("span");u.className="score-label",u.textContent="/ 10",d.append(c,u);let p=e.stars?"\u2605".repeat(e.stars)+"\u2606".repeat(5-e.stars):"",f=document.createElement("div");f.className=`addonpack-badge ${dn(e.rating)}`,f.textContent=`${e.rating.toUpperCase()}${t?" (BOUNCE)":""}${p?` \xB7 ${p}`:""}`,l.append(d,f);let h=document.createElement("div");h.className="stats-grid";let g=[["Pre-Impact V/S",`${e.vsFpm} fpm`],["Touchdown G-Force",`${e.gForce.toFixed(2)} G`],["Calibrated V/S",e.calibratedVsFpm===void 0?"\u2014":`${e.calibratedVsFpm.toFixed(1)} fpm`],["Indicated Airspeed",e.indicatedAirspeedKts===void 0?"\u2014":`${e.indicatedAirspeedKts.toFixed(1)} kt`],["True Airspeed",e.trueAirspeedKts===void 0?"\u2014":`${e.trueAirspeedKts.toFixed(1)} kt`],["Ground Speed",`${e.groundSpeedKts} kt`],["Roll",`${e.rollDeg.toFixed(1)}\xB0`],["Pitch",e.pitchDeg===void 0?"\u2014":`${e.pitchDeg.toFixed(1)}\xB0`],["Touchdown Zone",e.inTouchdownZone?"On Target":"Off Target"],["Flight Session",e.authenticFlight?"Authentic":"Practice"]];for(let[A,w]of g){let C=document.createElement("div");C.className="stat-item";let m=document.createElement("span");m.className="stat-label",m.textContent=A;let v=document.createElement("span");v.className="stat-value",v.textContent=w,C.append(m,v),h.appendChild(C)}let b=document.createElement("div");b.className="feedback-box",b.style.borderLeftColor=cn(e);let x=document.createElement("div");x.style.fontWeight="700",x.textContent=e.qualityFeedback??"";let T=document.createElement("div");if(T.style.marginTop="2px",T.textContent=e.passengerFeedback??"",b.append(x,T),e.phaseCritique){let A=document.createElement("div");A.style.cssText="margin-top:4px;font-size:10px;color:#cbd5e1;line-height:1.35;",A.textContent=`${e.phaseCritique.departure} \u2022 ${e.phaseCritique.approach}`,b.appendChild(A)}o.append(l,h,b),i.append(n,o),document.body.appendChild(i),this.reportDragCleanup=this.ctx?.anchors.makeDraggable(i,"geofs_ext_landing_report_pos",n)??null,this.report=i,this.reportOpen=!0,i.offsetWidth,i.classList.add("active"),this.ctx?.anchors.bringToFront(i),this.ctx?.anchors.clampElementToViewport(i),this.scheduleReportClose()}onSettingsChange(){let e=this.ctx?.getSettings();this.timerCheckboxEl&&e&&(this.timerCheckboxEl.checked=e.landingReportAutoClose??!0),this.secondsInputEl&&e&&(this.secondsInputEl.value=String(e.landingReportSeconds??15)),this.reportOpen&&this.scheduleReportClose()}scheduleReportClose(){let e=this.ctx?.getSettings(),t=e?.landingReportAutoClose===!1?null:Math.max(1,Math.min(3600,e?.landingReportSeconds||15));t!==this.reportDuration&&(clearTimeout(this.reportTimer),this.reportDuration=t,this.reportTimer=t===null?void 0:setTimeout(()=>this.closeReport(),t*1e3))}closeReport(){clearTimeout(this.reportTimer),this.reportTimer=void 0,this.reportDragCleanup?.(),this.reportDragCleanup=null,this.report?.remove(),this.report=null,this.reportDuration=null,this.reportOpen=!1}renderSessionList(){if(this.listEl){this.listEl.innerHTML="";for(let e of this.sessionRecords.slice(0,5)){let t=document.createElement("div");t.style.cssText="border-bottom:1px solid rgba(136,136,136,0.3);padding-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";let i=e.stars?`${"\u2605".repeat(e.stars)} `:"",n=e.authenticFlight?"AUTH":"PRAC";t.textContent=`${i}[${n}] ${e.rating} \u2022 ${e.vsFpm} fpm \u2022 ${e.gForce}G \u2022 ${e.score?.toFixed(1)??"\u2014"}/10`,t.title=t.textContent,this.listEl.appendChild(t)}}}destroy(){if(this.unmountTab?.(),this.unmountTab=null,this.listEl=null,this.timerCheckboxEl=null,this.secondsInputEl=null,this.wasAirborne=!1,this.aircraftId=null,this.closeReport(),this.styleEl?.remove(),this.styleEl=null,this.lastGroundHeight=void 0,this.calibratedVsFpm=void 0,this.lastApproach=null,this.gpwsFired.clear(),this.sessionRecords=[],this.sounds)for(let e of Object.values(this.sounds))e.pause();this.sounds=void 0,this.replay.reset(),this.ctx=null}};var Be=class{id="satellite-imagery";name="Satellite Imagery";description="User-configurable map tile provider (Esri, OSM, Custom URL).";supportedMajors=[3,4];defaultEnabled=!1;ctx=null;origProvider=null;init(e){this.ctx=e;let t=window.geofs?.api?.viewer;this.origProvider||(this.origProvider=t?.imageryLayers?.get?.(0)?.imageryProvider??null),this.applyProvider(e.getSettings())}onSettingsChange(e){this.applyProvider(e)}applyProvider(e){let t=window.Cesium,i=window.geofs?.api?.setImageryProvider;if(!t||!i)return;if(e.imageryProvider==="native"){if(this.origProvider)try{i(this.origProvider,!1),this.ctx?.anchors.showToast("Imagery restored to GeoFS Native"),this.ctx?.emitDiag?.("IMAGERY_CHANGED",{provider:"native"})}catch(a){console.warn("[GeoFS Extension] Failed to restore native imagery:",a)}return}if(e.imageryProvider==="bing"&&e.customImageryToken&&t.BingMapsImageryProvider){try{let a=new t.BingMapsImageryProvider({url:"https://dev.virtualearth.net",key:e.customImageryToken,mapStyle:"Aerial"});i(a,!1),this.ctx?.anchors.showToast("Imagery switched to BING AERIAL"),this.ctx?.emitDiag?.("IMAGERY_CHANGED",{provider:"bing"})}catch(a){console.warn("[GeoFS Extension] Failed to apply Bing imagery:",a)}return}if(!t.UrlTemplateImageryProvider)return;let n="",s="Custom Imagery";if(e.imageryProvider==="osm")n="https://tile.openstreetmap.org/{z}/{x}/{y}.png",s="OpenStreetMap contributors";else if(e.imageryProvider==="esri"&&e.customImageryToken)n=`https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=${encodeURIComponent(e.customImageryToken)}`,s="Powered by Esri";else if(e.imageryProvider==="custom"&&e.customImageryUrl)n=e.customImageryUrl;else return;try{let a=new t.UrlTemplateImageryProvider({url:n,maximumLevel:19,credit:t.Credit?new t.Credit(s,!0):void 0});i(a,!1),this.ctx?.anchors.showToast(`Imagery switched to ${e.imageryProvider.toUpperCase()}`),this.ctx?.emitDiag?.("IMAGERY_CHANGED",{provider:e.imageryProvider})}catch(a){console.warn("[GeoFS Extension] Failed to apply imagery provider:",a)}}destroy(){if(this.origProvider)try{window.geofs?.api?.setImageryProvider?.(this.origProvider,!1)}catch{}this.origProvider=null,this.ctx=null}};var un="https://raw.githubusercontent.com/machpoint82/geofs-gate-spawner/refs/heads/main/gates.json",Jt=[{key:"codeF",label:"Code F",test:r=>r.width_code==="F"},{key:"codeE",label:"Code E",test:r=>r.width_code==="E"},{key:"heavy",label:"Heavy",test:r=>Array.isArray(r.airplane_types)&&r.airplane_types.includes("heavy")},{key:"cargo",label:"Cargo",test:r=>r.operation_type==="cargo"},{key:"ga",label:"GA",test:r=>r.operation_type==="general_aviation"}];function pn(r,e,t,i){let s=r*Math.PI/180,a=e*Math.PI/180,o=t*Math.PI/180,l=i/6371e3,d=Math.asin(Math.sin(s)*Math.cos(l)+Math.cos(s)*Math.sin(l)*Math.cos(o)),c=a+Math.atan2(Math.sin(o)*Math.sin(l)*Math.cos(s),Math.cos(l)-Math.sin(s)*Math.sin(d));return{lat:d*180/Math.PI,lon:c*180/Math.PI}}function Ke(r){return String(r.ref||r.name||`${r.lat.toFixed(4)},${r.lon.toFixed(4)}`)}function hn(r,e,t){let i=e.trim().toLowerCase();return r.filter(n=>{if(i&&!Ke(n).toLowerCase().includes(i))return!1;for(let s of Jt)if(t.has(s.key)&&!s.test(n))return!1;return!0})}function fn(r){let e=window.geofs?.aircraft?.instance;if(!e?.place)return!1;let t=(r.heading+180)%360,i=pn(r.lat,r.lon,t,6),n=0;try{let a=window.geofs?.getGroundAltitude,o=a?.([i.lat,i.lon,100]);o?.location&&Number.isFinite(o.location[2])&&(n=o.location[2])}catch{n=0}e.place([i.lat,i.lon,n],[r.heading,0,0]),e.rigidBody&&(e.rigidBody.v_linearVelocity=[0,0,0],e.rigidBody.v_angularVelocity=[0,0,0],e.rigidBody.v_totalForce=[0,0,0],e.rigidBody.v_totalTorque=[0,0,0]),e.groundContact=!0;let s=window.controls?.setters?.setParkingBrake?.set;if(typeof s=="function"&&!window.geofs?.animation?.values?.parkingBrake)try{s()}catch{}return!0}var ze=class{id="gate-spawner";name="Gate Spawner";description="Spawn parked at real airport gates/stands worldwide with size & category filters.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;unmountTab=null;gatesDb=null;loading=!1;abortController=null;activeFilters=new Set;init(e){if(this.ctx=e,typeof document>"u"||typeof e.anchors?.registerHudTab!="function")return;let t=document.createElement("div");t.style.cssText="display:flex;flex-direction:column;gap:5px;font-size:10px;color:#e5e7eb;";let i=document.createElement("div");i.style.cssText="display:flex;gap:4px;align-items:center;";let n=document.createElement("input");n.type="text",n.placeholder="ICAO (e.g. EGLL)",n.style.cssText="flex:1;min-width:0;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(136,136,136,0.35);border-radius:4px;padding:3px 6px;font-size:10px;text-transform:uppercase;";let s=document.createElement("button");s.type="button",s.textContent="Load",s.style.cssText="background:#1d4ed8;color:#fff;border:none;border-radius:4px;padding:3px 7px;font-size:9.5px;font-weight:700;cursor:pointer;",i.append(n,s);let a=document.createElement("input");a.type="text",a.placeholder="Filter gate (e.g. B12)",a.style.cssText="width:100%;box-sizing:border-box;background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(136,136,136,0.28);border-radius:4px;padding:3px 6px;font-size:9.5px;";let o=document.createElement("div");o.style.cssText="display:flex;flex-wrap:wrap;gap:3px;";for(let h of Jt){let g=document.createElement("button");g.type="button",g.textContent=h.label,g.style.cssText="background:rgba(255,255,255,0.06);color:#cbd5e1;border:1px solid rgba(136,136,136,0.3);border-radius:999px;padding:1px 6px;font-size:8.5px;cursor:pointer;",g.addEventListener("click",()=>{this.activeFilters.has(h.key)?(this.activeFilters.delete(h.key),g.style.borderColor="rgba(136,136,136,0.3)",g.style.color="#cbd5e1"):(this.activeFilters.add(h.key),g.style.borderColor="#10b981",g.style.color="#10b981"),p()}),o.appendChild(g)}let l=document.createElement("select");l.size=4,l.style.cssText="width:100%;background:rgba(0,0,0,0.5);color:#fff;border:1px solid rgba(136,136,136,0.35);border-radius:4px;font-size:9.5px;padding:2px;";let d=document.createElement("button");d.type="button",d.textContent="Spawn At Selected Gate",d.style.cssText="width:100%;background:#10b981;color:#052e16;border:none;border-radius:4px;padding:4px 6px;font-size:9.5px;font-weight:800;cursor:pointer;";let c=document.createElement("div");c.style.cssText="font-size:8.5px;color:#94a3b8;",c.textContent="Click Load to fetch gate database on demand.";let u=[],p=()=>{if(l.innerHTML="",!this.gatesDb)return;let h=n.value.trim().toUpperCase(),g=this.gatesDb[h]??[];u=hn(g,a.value,this.activeFilters);for(let b=0;b<u.length;b++){let x=document.createElement("option");x.value=String(b),x.textContent=`${Ke(u[b])} (HDG ${Math.round(u[b].heading)}\xB0)`,l.appendChild(x)}h&&g.length===0?c.textContent=`No gates found for ${h}.`:h?c.textContent=`${u.length} / ${g.length} gates at ${h}.`:c.textContent=`Loaded ${Object.keys(this.gatesDb).length} airports. Enter ICAO.`},f=async()=>{if(this.gatesDb){p();return}if(!this.loading){this.loading=!0,c.textContent="Downloading gates database...",this.abortController=typeof AbortController<"u"?new AbortController:null;try{let h=await fetch(un,{signal:this.abortController?.signal});if(!h.ok)throw new Error(`HTTP ${h.status}`);this.gatesDb=await h.json(),p()}catch{c.textContent="Could not load gates database."}finally{this.loading=!1}}};s.addEventListener("click",()=>{f()}),n.addEventListener("input",p),n.addEventListener("keydown",h=>{h.key==="Enter"&&f()}),a.addEventListener("input",p),d.addEventListener("click",()=>{let h=Number(l.value),g=Number.isFinite(h)?u[h]:void 0;if(!g){c.textContent="Select a gate first.";return}fn(g)?(this.ctx?.anchors.showToast(`Spawned at gate ${Ke(g)}`),c.textContent=`Parked at ${Ke(g)}.`):c.textContent="Aircraft not ready to place."}),t.append(i,a,o,l,d,c),this.unmountTab=e.anchors.registerHudTab("gates","GATES",t,!1,{defaultClosed:!0})}update(e){}destroy(){this.abortController?.abort(),this.abortController=null,this.loading=!1,this.unmountTab?.(),this.unmountTab=null,this.gatesDb=null,this.activeFilters.clear(),this.ctx=null}};var xt={nav:!0,beacon:!0,strobe:!0,landing:!0,taxi:!0,turnoff:!0,logo:!0},gn={landing:{tilt:-3.5,coneInner:5,coneOuter:14,range:650,falloff:18e-5,intensity:1.25,color:[1,.96,.88]},taxi:{tilt:-6,coneInner:10,coneOuter:28,range:280,falloff:6e-4,intensity:.9,color:[1,.94,.84]},turnoff:{tilt:-5,coneInner:8,coneOuter:26,range:220,falloff:8e-4,intensity:.85,color:[1,.94,.84]}},Z={red:[1,.12,.08],green:[.15,1,.3],white:[1,.95,.88],yellow:[1,.72,.25],amber:[1,.65,.2],orange:[1,.55,.15],blue:[.3,.5,1]},P=(r,e,t,i,n)=>({type:r,x:e,y:t,z:i,...n}),mn={2:{name:"Cessna 172",headlightIntensity:2,lamps:[P("landing",0,2.1,-.8,{tilt:-9,range:200,coneOuter:15,coneInner:4}),P("taxi",0,2.1,-.8,{tilt:-9,coneOuter:30,coneInner:4,strength:.7})]},4:{name:"Boeing 737-700",headlightIntensity:2,lamps:[P("taxi",0,13.4,-1.85,{tilt:-5,strength:.6}),P("landing",2.2,5,-.5,{tilt:-1,yaw:2,mirror:!0}),P("turnoff",2.5,4.8,-.4,{yaw:20,mirror:!0,strength:.7})]},5:{name:"Embraer Phenom 100",headlightIntensity:1.6,lamps:[P("landing",.77,1.5,-.35,{tilt:-1,yaw:4,mirror:!0,strength:1.5}),P("taxi",.77,1.5,-.35,{mirror:!0,tilt:-1,yaw:3,coneOuter:19,coneInner:10,strength:.7})]},6:{name:"DHC-6 Twin Otter",headlightIntensity:1.6,lamps:[P("taxi",-.3,3.4,-1.05,{tilt:-5,strength:.9}),P("landing",3.6,-.1,1.27,{tilt:-11,yaw:2,mirror:!0,strength:.8,coneOuter:15,coneInner:4})]},7:{name:"F-16 Fighting Falcon",headlightIntensity:2,lamps:[P("taxi",.28,3.5,-1.03,{strength:.8,coneOuter:30,coneInner:10}),P("landing",.28,3.5,-1.2,{coneOuter:15,coneInner:4,strength:1.3})]},9:{name:"Eurocopter EC135",headlightIntensity:2,lamps:[]},10:{name:"Airbus A380",headlightIntensity:2,lamps:[P("taxi",0,29.1,-2.9,{tilt:-6,strength:.8}),P("landing",5.06,13.2,.2,{tilt:-1.5,yaw:2,mirror:!0,strength:.8}),P("turnoff",.2,28.8,-2.43,{yaw:22,mirror:!0,strength:.7})]},12:{name:"Pilatus PC-7 Mk-I",headlightIntensity:1.8,lamps:[P("landing",1.2,-.12,-.3,{tilt:-1,yaw:4,mirror:!0,strength:1.2})]},16:{name:"Douglas DC-3",headlightIntensity:2,lamps:[P("landing",5.55,.5,-.58,{yaw:2,mirror:!0,tilt:-20,coneOuter:20,coneInner:4,strength:.8,range:800})]},17:{name:"McDonnell Douglas DC-10-40",headlightIntensity:2,lamps:[P("taxi",.18,22.7,-1.5,{tilt:-6,strength:.7,mirror:!0,coneOuter:35,coneInner:10}),P("landing",2.48,25,.4,{tilt:-1.5,yaw:8,mirror:!0,range:300,strength:.8}),P("turnoff",3.6,9,.5,{mirror:!0,yaw:30,strength:1.5,range:250}),P("landing",.18,22.7,-1.5,{mirror:!0,strength:1})]},18:{name:"Sukhoi Su-35",headlightIntensity:2,lamps:[P("landing",.13,5,-.25,{yaw:5,mirror:!0,strength:.9,tilt:-4,coneOuter:15,coneInner:4}),P("taxi",0,5.1,-.82,{coneOuter:35,coneInner:10,tilt:-4,strength:.8,range:400})]},20:{name:"Concorde",headlightIntensity:2,lamps:[P("taxi",.3,16.3,-.6,{strength:.7,mirror:!0}),P("landing",1.2,13.9,-.25,{yaw:2,mirror:!0,strength:1.4}),P("turnoff",.85,26.85,-.1,{mirror:!0,strength:1,coneOuter:30,coneInner:12,yaw:35})]},22:{name:"Cessna 152",headlightIntensity:2,lamps:[P("landing",0,1.5,-.1,{range:250,coneOuter:15,coneInner:4,strength:.8,tilt:-4}),P("taxi",0,1.5,-.1,{mirror:!0,coneOuter:30,coneInner:10,strength:.3})]},24:{name:"Airbus A350-900",headlightIntensity:2,lamps:[P("taxi",0,27.6,-2.6,{tilt:-6,strength:.9}),P("landing",4.2,9,-.2,{tilt:-1.5,yaw:6,mirror:!0,coneOuter:13,coneInner:4,range:700,strength:1.3}),P("turnoff",.14,27.5,-2.77,{yaw:30,mirror:!0,strength:1.4,coneOuter:30,coneInner:1,range:200}),P("landing",.28,27.3,-1.84,{mirror:!0,strength:.8})]},25:{name:"Boeing 777-300ER",headlightIntensity:2,lamps:[P("landing",3.8,7.3,.3,{tilt:-1.5,yaw:2,mirror:!0}),P("turnoff",3.9,7.3,.3,{yaw:20,mirror:!0,strength:.8,range:200}),P("taxi",.26,28.8,-2.2,{mirror:!0,strength:.5}),P("landing",.232,28.8,-1.9,{mirror:!0,strength:1})]},27:{name:"Boeing F/A-18F Super Hornet",headlightIntensity:2,lamps:[P("taxi",0,5.3,-1,{strength:.8,coneOuter:35,coneInner:10}),P("landing",0,5.3,-1,{coneOuter:15,coneInner:4})]},28:{name:"Beechcraft Baron B55",headlightIntensity:1.8,lamps:[P("taxi",0,2,-.63,{tilt:-4,strength:1,coneOuter:35,coneInner:10}),P("landing",4.9,.5,.08,{tilt:-5,yaw:1,mirror:!0,range:250,strength:.9})]},29:{name:"Dassault Rafale",headlightIntensity:2,lamps:[P("landing",.14,3.9,-.98,{yaw:3,mirror:!0,strength:1,coneOuter:15,coneInner:4}),P("taxi",.14,3.9,-.98,{mirror:!0,yaw:10,strength:.7,coneOuter:30,coneInner:10})]},6012:{name:"Airbus A330-300",headlightIntensity:2,lamps:[P("taxi",.25,22.7,-1.6,{strength:.5,mirror:!0}),P("landing",3.3,5.9,.2,{yaw:4,mirror:!0,coneOuter:9,coneInner:4}),P("landing",.25,22.7,-1.6,{mirror:!0,strength:.6,coneOuter:8,coneInner:4,tilt:-1.5}),P("turnoff",.2,22.7,-2.35,{mirror:!0,strength:1,yaw:25})]}};function ii(r){switch(r){case"coldAndDark":return{nav:!0,beacon:!1,strobe:!1,landing:!1,taxi:!1,turnoff:!1,logo:!0};case"takeoff":return{nav:!0,beacon:!0,strobe:!0,landing:!0,taxi:!1,turnoff:!1,logo:!0};case"allOff":return{nav:!1,beacon:!1,strobe:!1,landing:!1,taxi:!1,turnoff:!1,logo:!1};case"allOn":default:return{...xt}}}function J(r){let e=Math.hypot(r.x,r.y,r.z);return e<1e-9?{x:0,y:0,z:1}:{x:r.x/e,y:r.y/e,z:r.z/e}}function Qt(r,e){return{x:r.y*e.z-r.z*e.y,y:r.z*e.x-r.x*e.z,z:r.x*e.y-r.y*e.x}}function bn(r,e){return r.x*e.x+r.y*e.y+r.z*e.z}var vn=6378137,ei=.00669437999014;function yt(r,e,t){let i=r*Math.PI/180,n=e*Math.PI/180,s=Math.sin(i),a=Math.cos(i),o=vn/Math.sqrt(1-ei*s*s);return{x:(o+t)*a*Math.cos(n),y:(o+t)*a*Math.sin(n),z:(o*(1-ei)+t)*s}}function bt(r,e,t,i,n){let s=r*Math.PI/180,a=e*Math.PI/180,o=Math.sin(s),l=Math.cos(s),d=Math.sin(a),c=Math.cos(a),u={x:-d,y:c,z:0},p={x:-o*c,y:-o*d,z:l},f={x:l*c,y:l*d,z:o};return J({x:u.x*t+p.x*i+f.x*n,y:u.y*t+p.y*i+f.y*n,z:u.z*t+p.z*i+f.z*n})}function ti(r,e,t,i){return{x:r.pos.x+r.right.x*e+r.fwd.x*t+r.up.x*i,y:r.pos.y+r.right.y*e+r.fwd.y*t+r.up.y*i,z:r.pos.z+r.right.z*e+r.fwd.z*t+r.up.z*i}}function xn(r,e,t){let i=e*Math.PI/180,n=t*Math.PI/180,s=Math.cos(i)*Math.cos(n),a=Math.cos(i)*Math.sin(n),o=Math.sin(i);return J({x:r.fwd.x*s+r.right.x*a+r.up.x*o,y:r.fwd.y*s+r.right.y*a+r.up.y*o,z:r.fwd.z*s+r.right.z*a+r.up.z*o})}function wt(r){if(!r)return null;let e=Number(r.boundingSphereRadius)||20,t=r.llaLocation,i=r.htr,s=(typeof window<"u"?window.Cesium:void 0)?.Matrix4,a=r.object3d?.model,o=a?._model?.modelMatrix??a?.modelMatrix;if(o&&s?.getTranslation&&s?.getColumn){let T={x:0,y:0,z:0};s.getTranslation(o,T);let A={x:0,y:0,z:0,w:0},w={x:0,y:0,z:0,w:0},C={x:0,y:0,z:0,w:0};s.getColumn(o,0,A),s.getColumn(o,1,w),s.getColumn(o,2,C);let m=J(A),v=J(w),M=J(C);if(t&&i&&Number.isFinite(Number(i[0]))){let S=Number(i[0])*Math.PI/180,E=bt(Number(t[0]),Number(t[1]),Math.sin(S),Math.cos(S),0),k=[v,{x:-v.x,y:-v.y,z:-v.z},m,{x:-m.x,y:-m.y,z:-m.z}],F=v,y=-2;for(let L of k){let D=bn(L,E);D>y&&(y=D,F=L)}v=F,m=J(Qt(v,M))}return{pos:T,fwd:v,right:m,up:M,radius:e}}if(!t||!i)return null;let l=Number(t[0]),d=Number(t[1]),c=Number(t[2])||0,u=Number(i[0])*Math.PI/180,p=Number(i[1])*Math.PI/180,f=(Number(i[2])||0)*Math.PI/180;if(!Number.isFinite(l)||!Number.isFinite(d)||!Number.isFinite(u)||!Number.isFinite(p))return null;let h=yt(l,d,c),g=bt(l,d,Math.sin(u)*Math.cos(p),Math.cos(u)*Math.cos(p),Math.sin(p)),b=bt(l,d,Math.cos(u),-Math.sin(u),0),x=J(Qt(b,g));if(f!==0){let T=Math.cos(f),A=Math.sin(f),w=b,C=x;b=J({x:w.x*T-C.x*A,y:w.y*T-C.y*A,z:w.z*T-C.z*A}),x=J({x:C.x*T+w.x*A,y:C.y*T+w.y*A,z:C.z*T+w.z*A})}return{pos:h,fwd:g,right:b,up:x,radius:e}}function yn(r,e){let t=0,i=0,n=!1,s=0;for(let l of r.collisionPoints??[]){let d=l?.worldPosition;Array.isArray(d)&&d.length>=3&&d.every(c=>typeof c=="number"&&Number.isFinite(c))&&(Math.abs(d[0])<1&&d[2]<-.5&&(!n||d[1]>t)&&(t=d[1],i=d[2],n=!0),Math.abs(d[0])<8&&d[2]<s&&(s=d[2]))}n&&t<e*.2&&(n=!1);let a=n?t+.4:Math.min(40,Math.max(1.5,e*.47)),o=n?i-.6:s<0?Math.max(s*.9,-3):-Math.min(3,Math.max(.4,e*.05));return{headlightIntensity:2,lamps:[P("taxi",0,a,o,{strength:.6}),P("landing",Math.min(6,Math.max(.8,e*.085)),a*.22,o+.6,{yaw:2,mirror:!0})]}}function vt(r,e){let t=r;return t&&typeof t.length=="number"&&t.length>=16?{x:t[0]*e.x+t[4]*e.y+t[8]*e.z+t[12],y:t[1]*e.x+t[5]*e.y+t[9]*e.z+t[13],z:t[2]*e.x+t[6]*e.y+t[10]*e.z+t[14]}:e}function wn(r,e){let t=r;return t&&typeof t.length=="number"&&t.length>=16?J({x:t[0]*e.x+t[4]*e.y+t[8]*e.z,y:t[1]*e.x+t[5]*e.y+t[9]*e.z,z:t[2]*e.x+t[6]*e.y+t[10]*e.z}):e}function Sn(r){let e=[r.color,r.light,r.name,r.type,r.id].filter(n=>typeof n=="string").join(" ").toLowerCase();if(/landing|taxi|ldg|turnoff|headlight|spot/.test(e))return null;let t=Z.white;for(let[n,s]of Object.entries(Z))if(e.includes(n)){t=s;break}let i=e.includes("beacon")||e.includes("strobe")&&t===Z.red?"beacon":e.includes("strobe")?"strobe":"nav";return{color:t,group:i}}function ni(r){let{inst:e,viewMatrix:t,switches:i,headlightMode:n,isNight:s,gearDown:a,nowMs:o}=r,l=[],d=[];if(!e)return{points:l,spots:d};let c=wt(e),u=o%1e3/1e3,p=u<.07||u>.16&&u<.23,f=o%1200<180,h=e.lights,g=!1;if(h&&typeof h=="object"){let x=Array.isArray(h)?h:Object.values(h);for(let T of x){if(!T||typeof T!="object")continue;let A=T,w=Sn(A);if(!w||!i[w.group])continue;let C=A.lightBillboard??A._billboard??A.billboard??A.primitive,m=C?._actualPosition??C?.position;if(m&&Number.isFinite(m.x)&&Number.isFinite(m.y)&&Number.isFinite(m.z)){if(g=!0,!(w.group==="strobe"?p:w.group==="beacon"?f:!0))continue;let M=vt(t,m);l.push({x:M.x,y:M.y,z:M.z,w:w.group==="strobe"?1.8:w.group==="beacon"?1.4:1,r:w.color[0],g:w.color[1],b:w.color[2]})}}}if(c&&!g){let x=Math.max(4.5,c.radius*.52),T=Math.max(3.5,c.radius*.45),A=(w,C,m,v,M)=>{let S=ti(c,w,C,m),E=vt(t,S);l.push({x:E.x,y:E.y,z:E.z,w:M,r:v[0],g:v[1],b:v[2]})};i.nav&&(A(-x,0,.2,Z.red,1),A(x,0,.2,Z.green,1),A(0,-T,.6,Z.white,.85)),i.beacon&&f&&(A(0,.4,1.8,Z.red,1.4),A(0,.4,-1.2,Z.red,1.2)),i.strobe&&p&&(A(-x,-.2,.2,Z.white,1.8),A(x,-.2,.2,Z.white,1.8)),i.logo&&s&&a&&A(0,-T*.9,2.2,[1,.95,.85],.7)}if(c&&(n==="on"||n==="auto"&&s)&&a){let x=String(e.id??e.aircraftRecord?.id??""),T=mn[x]??yn(e,c.radius),A=T.headlightIntensity;for(let w of T.lamps){if(!i[w.type])continue;let C=gn[w.type],m=w.tilt??C.tilt,v=w.yaw??0,M=w.color??C.color,S=Math.cos(Math.min(w.coneInner??C.coneInner,(w.coneOuter??C.coneOuter)-.5)*Math.PI/180),E=Math.cos((w.coneOuter??C.coneOuter)*Math.PI/180),k=w.range??C.range,F=w.falloff??C.falloff,y=(w.strength??1)*C.intensity*A,L=(D,I)=>{let _=ti(c,D,w.y,w.z),V=xn(c,m,I),B=vt(t,_),$=wn(t,V);d.push({x:B.x,y:B.y,z:B.z,w:y,dx:$.x,dy:$.y,dz:$.z,cosInner:S,cosOuter:E,range:k,falloff:F,r:M[0],g:M[1],b:M[2]})};w.mirror?(L(-Math.abs(w.x),-v),L(Math.abs(w.x),v)):L(w.x,v)}}return{points:l,spots:d}}function En(r,e){if(e===4)return!0;let i=String(r??"").match(/^(\d+)\.(\d+)/);return i?Number(i[1])>1||Number(i[2])>=102:e!==3}var si=`
    uniform sampler2D colorTexture;
    uniform sampler2D depthTexture;
    in vec2 v_textureCoordinates;

    #define MAX_LIGHTS 16
    #define MAX_RW_LIGHTS 48
    #define MAX_SPOTS 12

    uniform vec4 u_lightPosEC[MAX_LIGHTS];
    uniform vec3 u_lightColor[MAX_LIGHTS];
    uniform int u_count;

    uniform vec4 u_rwPosEC[MAX_RW_LIGHTS];
    uniform vec3 u_rwColor[MAX_RW_LIGHTS];
    uniform int u_rwCount;

    uniform vec4 u_spotPosEC[MAX_SPOTS];
    uniform vec3 u_spotDirEC[MAX_SPOTS];
    uniform vec4 u_spotCone[MAX_SPOTS];
    uniform vec3 u_spotColor[MAX_SPOTS];
    uniform int u_spotCount;

    uniform float u_logDepth;
    uniform float u_intensity;
    uniform float u_range;
    uniform float u_falloff;
    uniform float u_halo;
    uniform float u_core;
    uniform float u_lampSize;
    uniform float u_pixelAngle;
    uniform float u_spotGlare;
    uniform float u_dayFactor;
    uniform float u_nearFade;

    vec3 rayAt(vec2 uv) {
      vec4 n = czm_inverseProjection * vec4(uv * 2.0 - 1.0, -1.0, 1.0);
      return normalize(n.xyz / n.w);
    }

    vec4 surfaceAt(vec2 uv) {
      float raw = czm_unpackDepth(texture(depthTexture, uv));
      if (raw >= 0.9999999) return vec4(0.0);
      vec3 p;
      if (u_logDepth > 0.5) {
        float zLin = pow(2.0, raw * czm_log2FarDepthFromNearPlusOne) - 1.0 + czm_currentFrustum.x;
        vec3 r = rayAt(uv);
        p = r * (zLin / max(-r.z, 1e-4));
      } else {
        float d = czm_readDepth(depthTexture, uv);
        vec4 e = czm_windowToEyeCoordinates(uv * czm_viewport.zw + czm_viewport.xy, d);
        p = e.xyz / e.w;
      }
      if (length(p) > 500000.0) return vec4(0.0);
      return vec4(p, 1.0);
    }

    vec3 normalAt(vec2 uv, vec3 p) {
      vec2 px = 1.0 / czm_viewport.zw;
      vec4 r = surfaceAt(uv + vec2(px.x, 0.0));
      vec4 l = surfaceAt(uv - vec2(px.x, 0.0));
      vec4 t = surfaceAt(uv + vec2(0.0, px.y));
      vec4 b = surfaceAt(uv - vec2(0.0, px.y));
      vec3 dx1 = r.xyz - p;
      vec3 dx2 = p - l.xyz;
      vec3 dy1 = t.xyz - p;
      vec3 dy2 = p - b.xyz;
      vec3 dx = (r.w < 0.5) ? dx2 : (l.w < 0.5) ? dx1 : (dot(dx1, dx1) < dot(dx2, dx2) ? dx1 : dx2);
      vec3 dy = (t.w < 0.5) ? dy2 : (b.w < 0.5) ? dy1 : (dot(dy1, dy1) < dot(dy2, dy2) ? dy1 : dy2);
      vec3 n = cross(dx, dy);
      float len = length(n);
      if (len < 1e-8) return -normalize(p);
      n /= len;
      if (dot(n, -p) < 0.0) n = -n;
      return n;
    }

    float lampVisibility(vec3 L) {
      vec4 clip = czm_projection * vec4(L, 1.0);
      if (clip.w <= 0.0) return 0.0;
      vec2 uv = clip.xy / clip.w * 0.5 + 0.5;
      if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 1.0;
      float dl = length(L);
      float bias = 0.35 + dl * 0.002;
      vec2 px = 1.5 / czm_viewport.zw;
      float v = 0.0;
      vec4 s;
      s = surfaceAt(uv);                     v += (s.w < 0.5 || length(s.xyz) > dl - bias) ? 1.0 : 0.0;
      s = surfaceAt(uv + vec2(px.x, 0.0));   v += (s.w < 0.5 || length(s.xyz) > dl - bias) ? 1.0 : 0.0;
      s = surfaceAt(uv - vec2(px.x, 0.0));   v += (s.w < 0.5 || length(s.xyz) > dl - bias) ? 1.0 : 0.0;
      s = surfaceAt(uv + vec2(0.0, px.y));   v += (s.w < 0.5 || length(s.xyz) > dl - bias) ? 1.0 : 0.0;
      s = surfaceAt(uv - vec2(0.0, px.y));   v += (s.w < 0.5 || length(s.xyz) > dl - bias) ? 1.0 : 0.0;
      return v / 5.0;
    }

    vec3 lampGlow(vec3 L, vec3 c, float sizeM, float bloomK, vec3 rayDir) {
      float t = dot(L, rayDir);
      if (t <= 0.3) return vec3(0.0);
      float ang = length(L - rayDir * t) / t;
      if (ang > 0.25) return vec3(0.0);
      float r = max(sizeM / t, u_pixelAngle * 1.2);
      float x = ang / r;
      float maxX = mix(14.0, 5.0, clamp(t / 800.0, 0.0, 1.0));
      if (x > maxX) return vec3(0.0);
      float vis = lampVisibility(L);
      if (vis <= 0.0) return vec3(0.0);
      float farK = 1.0 / (1.0 + t / 350.0);
      float core = 1.0 - smoothstep(0.65, 1.0, x);
      float bloom = (exp(-x * x * 0.3) * 0.6 + 0.35 / (1.0 + x * x * 0.2)) * (1.0 - smoothstep(maxX * 0.65, maxX, x));
      float peak = max(c.r, max(c.g, c.b));
      vec3 coreCol = mix(c, vec3(peak), 0.55);
      return vis * (coreCol * core * u_core + c * bloom * bloomK * farK);
    }

    void main() {
      vec4 color = texture(colorTexture, v_textureCoordinates);
      if (u_count <= 0 && u_rwCount <= 0 && u_spotCount <= 0) {
        out_FragColor = color;
        return;
      }

      vec3 rayDir = rayAt(v_textureCoordinates);
      vec4 surf = surfaceAt(v_textureCoordinates);
      bool sky = surf.w < 0.5;
      vec3 posEC = surf.xyz;
      vec3 n = sky ? -rayDir : normalAt(v_textureCoordinates, posEC);

      vec3 upEC = normalize(czm_viewRotation * normalize(czm_viewerPositionWC));
      float sunElev = dot(normalize(czm_sunDirectionEC), upEC);
      float night = mix(u_dayFactor, 1.0, 1.0 - smoothstep(-0.08, 0.12, sunElev));

      float range2 = u_range * u_range;
      float nearK = sky ? 0.0 : smoothstep(u_nearFade * 0.5, u_nearFade, length(posEC));
      vec3 add = vec3(0.0);

      for (int i = 0; i < MAX_LIGHTS; i++) {
        if (i >= u_count) break;
        vec4 L = u_lightPosEC[i];
        if (L.w <= 0.0) continue;
        vec3 c = u_lightColor[i] * L.w;
        if (!sky) {
          vec3 d = L.xyz - posEC;
          float dist2 = dot(d, d);
          if (dist2 < range2) {
            float att = 1.0 / (1.0 + dist2 * u_falloff);
            float edge = 1.0 - smoothstep(0.4 * range2, range2, dist2);
            float ndl = clamp(dot(n, d * inversesqrt(dist2 + 0.0001)) * 0.9 + 0.1, 0.0, 1.0);
            add += c * att * edge * ndl * nearK;
          }
        }
        add += lampGlow(L.xyz, c, u_lampSize, u_halo, rayDir);
      }

      if (!sky) {
        float rwRange2 = 22500.0;
        for (int k = 0; k < MAX_RW_LIGHTS; k++) {
          if (k >= u_rwCount) break;
          vec4 R = u_rwPosEC[k];
          if (R.w <= 0.0) continue;
          vec3 d = R.xyz - posEC;
          float dist2 = dot(d, d);
          if (dist2 < rwRange2) {
            float att = 1.0 / (1.0 + dist2 * 0.015);
            float edge = 1.0 - smoothstep(0.35 * rwRange2, rwRange2, dist2);
            float ndl = clamp(dot(n, d * inversesqrt(dist2 + 0.0001)) * 0.8 + 0.2, 0.0, 1.0);
            add += u_rwColor[k] * R.w * att * edge * ndl;
          }
        }
      }

      for (int j = 0; j < MAX_SPOTS; j++) {
        if (j >= u_spotCount) break;
        vec4 S = u_spotPosEC[j];
        if (S.w <= 0.0) continue;
        vec3 D = u_spotDirEC[j];
        vec4 K = u_spotCone[j];
        vec3 c = u_spotColor[j] * S.w;
        if (!sky) {
          vec3 d = posEC - S.xyz;
          float dist = length(d);
          if (dist > 0.5 && dist < K.z) {
            vec3 dn = d / dist;
            float cone = smoothstep(K.y, K.x, dot(dn, D));
            if (cone > 0.0) {
              float att = 1.0 / (1.0 + dist * dist * K.w);
              float edge = 1.0 - smoothstep(0.6 * K.z, K.z, dist);
              float ndl = max(dot(n, -dn), 0.0);
              add += c * cone * att * edge * ndl * nearK;
            }
          }
        }
        float tl = max(length(S.xyz), 0.001);
        float facing = max(smoothstep(K.y, 1.0, dot(-S.xyz / tl, D)), 0.06);
        add += lampGlow(S.xyz, c * facing, u_lampSize * 1.3, u_spotGlare, rayDir);
      }

      add *= u_intensity * night;
    #ifdef HAS_ISNAN
      if (any(isnan(add)) || any(isinf(add))) add = vec3(0.0);
    #else
      if (!(add.x == add.x && add.y == add.y && add.z == add.z)) add = vec3(0.0);
    #endif
      add = max(add, vec3(0.0));
      add = add / (1.0 + 0.2 * add);
      out_FragColor = vec4(color.rgb + add, color.a);
    }
`;function An(r){return r?`#define HAS_ISNAN
`+si:si.replace(/\bin vec2 v_textureCoordinates;/g,"varying vec2 v_textureCoordinates;").replace(/\btexture\(/g,"texture2D(").replace(/\bout_FragColor\b/g,"gl_FragColor")}var Ue=class{stage=null;removeStage=null;lightPosArr=[];lightColArr=[];rwPosArr=[];rwColArr=[];spotPosArr=[];spotDirArr=[];spotConeArr=[];spotColArr=[];count=0;rwCount=0;spotCount=0;intensity=1.5;dayFactor=.08;initArrays(){if(this.spotColArr.length===12)return!0;this.lightPosArr=[],this.lightColArr=[],this.rwPosArr=[],this.rwColArr=[],this.spotPosArr=[],this.spotDirArr=[],this.spotConeArr=[],this.spotColArr=[];let e=window.Cesium,t=e?.Cartesian4,i=e?.Cartesian3,n=(a,o,l,d)=>{if(typeof t=="function")try{return new t(a,o,l,d)}catch{}return{x:a,y:o,z:l,w:d}},s=(a,o,l)=>{if(typeof i=="function")try{return new i(a,o,l)}catch{}return{x:a,y:o,z:l}};for(let a=0;a<16;a++)this.lightPosArr.push(n(0,0,0,0)),this.lightColArr.push(s(0,0,0));for(let a=0;a<48;a++)this.rwPosArr.push(n(0,0,0,0)),this.rwColArr.push(s(0,0,0));for(let a=0;a<12;a++)this.spotPosArr.push(n(0,0,0,0)),this.spotDirArr.push(s(0,0,1)),this.spotConeArr.push(n(1,.9,600,1e-4)),this.spotColArr.push(s(0,0,0));return!0}ensureStage(e){if(this.stage)return!0;let t=window.Cesium?.PostProcessStage,i=window.geofs?.api?.viewer?.scene,n=i?.postProcessStages,s=window.geofs?.fx?.atmosphere?.atmospherePostProcessStage;if(!t||!n?.add||s&&s._ready===!1)return!1;this.initArrays();let a=En(window.Cesium?.VERSION,e);try{let o=n.add(new t({fragmentShader:An(a),uniforms:{u_lightPosEC:()=>this.lightPosArr,u_lightColor:()=>this.lightColArr,u_count:()=>this.count,u_rwPosEC:()=>this.rwPosArr,u_rwColor:()=>this.rwColArr,u_rwCount:()=>this.rwCount,u_spotPosEC:()=>this.spotPosArr,u_spotDirEC:()=>this.spotDirArr,u_spotCone:()=>this.spotConeArr,u_spotColor:()=>this.spotColArr,u_spotCount:()=>this.spotCount,u_logDepth:()=>i?.logarithmicDepthBuffer?1:0,u_intensity:()=>this.intensity,u_range:()=>55,u_falloff:()=>.04,u_halo:()=>.45,u_core:()=>1.3,u_lampSize:()=>.25,u_pixelAngle:()=>{let l=i?.canvas?.clientHeight||window.innerHeight||900;return(i?.camera?.frustum?.fovy||i?.camera?.frustum?.fov||1.047)/Math.max(1,l)},u_spotGlare:()=>.55,u_dayFactor:()=>this.dayFactor,u_nearFade:()=>1.2}}));if(o)return o.enabled=!1,this.stage=o,this.removeStage=()=>n.remove?.(o),!0}catch{return!1}return!1}setData(e,t,i,n,s){this.initArrays(),this.intensity=n,this.dayFactor=s;let a=Math.min(e.length,16);for(let d=0;d<a;d++){let c=e[d];this.lightPosArr[d].x=c.x,this.lightPosArr[d].y=c.y,this.lightPosArr[d].z=c.z,this.lightPosArr[d].w=c.w,this.lightColArr[d].x=c.r,this.lightColArr[d].y=c.g,this.lightColArr[d].z=c.b}for(let d=a;d<16;d++)this.lightPosArr[d].w=0;this.count=a;let o=Math.min(t.length,48);for(let d=0;d<o;d++){let c=t[d];this.rwPosArr[d].x=c.x,this.rwPosArr[d].y=c.y,this.rwPosArr[d].z=c.z,this.rwPosArr[d].w=c.w,this.rwColArr[d].x=c.r,this.rwColArr[d].y=c.g,this.rwColArr[d].z=c.b}for(let d=o;d<48;d++)this.rwPosArr[d].w=0;this.rwCount=o;let l=Math.min(i.length,12);for(let d=0;d<l;d++){let c=i[d];this.spotPosArr[d].x=c.x,this.spotPosArr[d].y=c.y,this.spotPosArr[d].z=c.z,this.spotPosArr[d].w=c.w,this.spotDirArr[d].x=c.dx,this.spotDirArr[d].y=c.dy,this.spotDirArr[d].z=c.dz,this.spotConeArr[d].x=c.cosInner,this.spotConeArr[d].y=c.cosOuter,this.spotConeArr[d].z=c.range,this.spotConeArr[d].w=c.falloff,this.spotColArr[d].x=c.r,this.spotColArr[d].y=c.g,this.spotColArr[d].z=c.b}for(let d=l;d<12;d++)this.spotPosArr[d].w=0;this.spotCount=l}setEnabled(e){this.stage&&(this.stage.enabled=e)}hasStage(){return this.stage!==null}dispose(){this.stage&&(this.stage.enabled=!1),this.removeStage?.(),this.stage=null,this.removeStage=null,this.count=0,this.rwCount=0,this.spotCount=0}};var Ve={red:[1,.16,.1],yellow:[1,.74,.24],green:[.16,1,.36],white:[1,.94,.84]};function Cn(r){let e=(r??"").toLowerCase();return e.includes("red")?Ve.red:e.includes("yellow")||e.includes("amber")?Ve.yellow:e.includes("green")?Ve.green:Ve.white}function Mn(r,e,t=280,i=48){if(!r||!e)return[];let n=t*t,s=[];for(let a of Object.values(r)){let o=a?.lights;if(Array.isArray(o))for(let l of o){let d=l?._billboard?._billboard,c=d?._actualPosition??d?.position;if(!c||!Number.isFinite(c.x)||!Number.isFinite(c.y)||!Number.isFinite(c.z))continue;let u=c.x-e.x,p=c.y-e.y,f=c.z-e.z,h=u*u+p*p+f*f;if(h>n)continue;let[g,b,x]=Cn(d?._imageId);s.push({x:c.x,y:c.y,z:c.z,r:g,g:b,b:x,strength:2.4,dist2:h})}}return s.length>i&&(s.sort((a,o)=>a.dist2-o.dist2),s.length=i),s}function kn(r,e){let t=e,i=!!(t&&typeof t.length=="number"&&t.length>=16);return r.map(n=>!i||!t?{x:n.x,y:n.y,z:n.z,w:n.strength,r:n.r,g:n.g,b:n.b}:{x:t[0]*n.x+t[4]*n.y+t[8]*n.z+t[12],y:t[1]*n.x+t[5]*n.y+t[9]*n.z+t[13],z:t[2]*n.x+t[6]*n.y+t[10]*n.z+t[14],w:n.strength,r:n.r,g:n.g,b:n.b})}var $e=class{cached=[];lastScanMs=0;update(e,t,i,n){return n-this.lastScanMs>=1e3&&(this.lastScanMs=n,this.cached=Mn(e,t)),this.cached.length===0?[]:kn(this.cached,i)}reset(){this.cached=[],this.lastScanMs=0}};var Fn="https://overpass-api.de/api/interpreter",Ln=720*60*60*1e3,Pn="geofs_ext_osm_twy_";function Rn(r,e){let t=Math.floor(r*10)/10,i=Math.floor(e*10)/10;return`${Pn}${t.toFixed(1)}_${i.toFixed(1)}`}function Dn(r,e,t=5e3){return`[out:json][timeout:15];way["aeroway"="taxiway"](around:${Math.round(t)},${r.toFixed(5)},${e.toFixed(5)});out geom;`}function Nn(r,e,t,i){let s=(t-r)*Math.PI/180,a=(i-e)*Math.PI/180,o=Math.sin(s/2)*Math.sin(s/2)+Math.cos(r*Math.PI/180)*Math.cos(t*Math.PI/180)*Math.sin(a/2)*Math.sin(a/2);return 2*6371e3*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}function In(r,e,t){let i=Math.cos(r*Math.PI/180),n=111320,s=111320*Math.max(.1,i),a=(e-t.lon1)*s,o=(r-t.lat1)*n,l=(t.lon2-t.lon1)*s,d=(t.lat2-t.lat1)*n,c=l*l+d*d;if(c<1e-6)return Math.hypot(a,o);let u=Math.max(0,Math.min(1,(a*l+o*d)/c));return Math.hypot(a-u*l,o-u*d)}function On(r){if(!r)return[];let e=[];for(let t of Object.values(r)){let i=t?.threshold1,n=t?.threshold2;Array.isArray(i)&&i.length>=2&&Array.isArray(n)&&n.length>=2&&Number.isFinite(i[0])&&Number.isFinite(i[1])&&Number.isFinite(n[0])&&Number.isFinite(n[1])&&e.push({lat1:i[0],lon1:i[1],lat2:n[0],lon2:n[1]})}return e}function Hn(r,e,t=30,i=60,n=11){let s=r?.elements;if(!Array.isArray(s))return[];let a=new Map;for(let l of s)l.type==="node"&&Number.isFinite(l.lat)&&Number.isFinite(l.lon)&&a.set(l.id,{lat:l.lat,lon:l.lon});let o=[];for(let l of s){if(l.type!=="way")continue;let d=Array.isArray(l.geometry)&&l.geometry.length>=2?l.geometry:(l.nodes??[]).map(p=>a.get(p)).filter(p=>!!p);if(d.length<2)continue;let c=0,u=0;for(let p=0;p<d.length-1;p++){let f=d[p],h=d[p+1],g=Nn(f.lat,f.lon,h.lat,h.lon);if(g<1)continue;let b=h.lat-f.lat,x=h.lon-f.lon,T=Math.max(.1,Math.cos(f.lat*Math.PI/180)),A=x*111320*T,w=b*111320,C=Math.hypot(A,w)||1,m=A/C*(n/111320),v=-w/C*(n/(111320*T)),M=c===0?0:t-c;for(;M<=g;){let E=M/g,k=f.lat+b*E,F=f.lon+x*E,y=e.some(L=>In(k,F,L)<=60);o.push({lat:k,lon:F,kind:y?"centerline-yellow":"centerline-green"}),M+=t}c=(c+g)%t;let S=u===0?0:i-u;for(;S<=g;){let E=S/g,k=f.lat+b*E,F=f.lon+x*E;o.push({lat:k+m,lon:F+v,kind:"edge-blue"}),o.push({lat:k-m,lon:F-v,kind:"edge-blue"}),S+=i}u=(u+g)%i}}return o}function St(r){if(typeof document>"u")return"";let e=document.createElement("canvas");e.width=16,e.height=16;let t=e.getContext("2d");if(!t)return"";let i=t.createRadialGradient(8,8,1,8,8,7.5);return i.addColorStop(0,"#ffffff"),i.addColorStop(.35,r),i.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=i,t.fillRect(0,0,16,16),e.toDataURL()}var je=class{collection=null;lastTileKey="";abortController=null;icons=null;loadingTile="";async update(e,t,i,n=Date.now()){if(!Number.isFinite(e)||!Number.isFinite(t))return;let s=Rn(e,t);if(s===this.lastTileKey||s===this.loadingTile)return;let a=this.readCache(s,n);if(a){this.lastTileKey=s,this.renderLights(a);return}this.loadingTile=s,this.abortController?.abort();let o=typeof AbortController<"u"?new AbortController:null;this.abortController=o;try{let l=Dn(e,t,5e3),d=await fetch(Fn,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:`data=${encodeURIComponent(l)}`,signal:o?.signal});if(!d.ok)return;let c=await d.json(),u=On(i),p=Hn(c,u);this.writeCache(s,p,n),this.loadingTile===s&&(this.lastTileKey=s,this.renderLights(p))}catch{}finally{this.loadingTile===s&&(this.loadingTile="")}}readCache(e,t){try{let i=typeof globalThis<"u"?globalThis.localStorage:void 0,n=i?.getItem(e);if(!n)return null;let s=JSON.parse(n);return!s||typeof s.savedAt!="number"||!Array.isArray(s.points)?null:t-s.savedAt>Ln?(i?.removeItem(e),null):s.points}catch{return null}}writeCache(e,t,i){try{(typeof globalThis<"u"?globalThis.localStorage:void 0)?.setItem(e,JSON.stringify({savedAt:i,points:t}))}catch{}}ensureCollection(){if(this.collection)return;let e=window.geofs?.api?.viewer?.scene,i=window.Cesium?.BillboardCollection;if(!e?.primitives?.add||!i)return;let n=new i({scene:e});e.primitives.add(n),this.collection=n}renderLights(e){if(this.ensureCollection(),!this.collection?.add)return;this.collection.removeAll?.(),this.icons||(this.icons={"centerline-green":St("#22c55e"),"centerline-yellow":St("#fbbf24"),"edge-blue":St("#3b82f6")});let t=window.Cesium,i=t?.Cartesian3,n=t?.NearFarScalar,s=t?.DistanceDisplayCondition,a=t?.HeightReference;for(let o of e){let l=window.geofs?.getGroundAltitude&&Number(window.geofs.getGroundAltitude?.(o.lat,o.lon)?.location?.[2])||0,d=i?.fromDegrees?i.fromDegrees(o.lon,o.lat,l+.35):yt(o.lat,o.lon,l+.35);this.collection.add({position:d,image:this.icons[o.kind],scale:o.kind==="edge-blue"?.45:.5,heightReference:a?.CLAMP_TO_GROUND,scaleByDistance:n?new n(50,1,4500,.25):void 0,distanceDisplayCondition:s?new s(0,6e3):void 0})}}dispose(){this.abortController?.abort(),this.abortController=null,this.loadingTile="",this.lastTileKey="",this.collection&&(this.collection.removeAll?.(),window.geofs?.api?.viewer?.scene?.primitives?.remove?.(this.collection),this.collection=null)}};var Gn=3.280839895;function _n(r,e){let t=Math.max(0,Math.min(2e4,Number.isFinite(r)?r:0)),i=.15,n=.72,s=1;if(t<3e3){let o=t/3e3;i=.15,n=.55+o*.45,s=1-o*.35}else if(t<6e3){let o=(t-3e3)/3e3;i=.15+o*.45,n=1,s=.65*(1-o)}else if(t<1e4){let o=(t-6e3)/4e3;i=.6+o*.4,n=1-o*.2,s=.05}else if(t<15e3){let o=(t-1e4)/5e3;i=1,n=.8-o*.5,s=.05}else{let o=(t-15e3)/5e3;i=1-o*.25,n=.3*(1-o),s=.05}let a=e;return typeof a=="function"?new a(i,n,s,.92):{red:i,green:n,blue:s,alpha:.92}}var We=class{collection=null;lastScanAt=0;lastScanPos=null;options;constructor(e={}){this.options={mode:e.mode??"auto",radiusMeters:e.radiusMeters??14e3,maxPoints:e.maxPoints??1200,scanIntervalMs:e.scanIntervalMs??4e3,moveThresholdMeters:e.moveThresholdMeters??800}}setMode(e){this.options.mode=e,e==="off"&&this.collection&&(this.collection.show=!1)}update(e,t,i,n,s){if(!(e&&(this.options.mode==="on"||this.options.mode==="auto"&&t)))return this.collection&&(this.collection.show=!1),0;if(!Number.isFinite(i)||!Number.isFinite(n))return 0;let o=this.ensureCollection();if(!o)return 0;o.show=!0;let l=this.lastScanPos?Math.hypot((i-this.lastScanPos.lat)*111320,(n-this.lastScanPos.lon)*111320*Math.max(.2,Math.cos(i*Math.PI/180))):1/0;return s-this.lastScanAt<this.options.scanIntervalMs&&l<this.options.moveThresholdMeters?o.length??0:(this.lastScanAt=s,this.lastScanPos={lat:i,lon:n},this.scanTerrainAround(o,i,n))}ensureCollection(){if(this.collection)return this.collection;let e=window.Cesium,t=window.geofs?.api?.viewer?.scene?.primitives;if(!e?.PointPrimitiveCollection||!t?.add)return null;try{let i=new e.PointPrimitiveCollection;return t.add(i),this.collection=i,i}catch{return null}}scanTerrainAround(e,t,i){let n=window.Cesium,s=window.geofs?.getGroundAltitude;if(!n?.Cartesian3?.fromDegrees)return 0;e.removeAll();let a=Math.max(.2,Math.cos(t*Math.PI/180)),o=20,l=Math.max(12,Math.floor(this.options.maxPoints/o)),d=0;for(let c=1;c<=o;c++){let u=c/o,p=this.options.radiusMeters*Math.sqrt(u);for(let f=0;f<l&&!(d>=this.options.maxPoints);f++){let h=(f+c%2*.5)/l*Math.PI*2,g=p*Math.cos(h)/111320,b=p*Math.sin(h)/(111320*a),x=t+g,T=i+b,A=this.sampleTerrainMeters(x,T,s);if(A===null)continue;let w=A*Gn,C=_n(w,n.Color),m=n.Cartesian3.fromDegrees(T,x,A+2);e.add({position:m,color:C,pixelSize:2.5}),d++}}return d}sampleTerrainMeters(e,t,i){if(typeof i=="function")try{let l=i(e,t)?.location?.[2];if(typeof l=="number"&&Number.isFinite(l))return l}catch{}let s=window.geofs?.api?.viewer?.scene?.globe,a=window.Cesium?.Cartographic;if(s?.getHeight&&a?.fromDegrees)try{let o=s.getHeight(a.fromDegrees(t,e));if(typeof o=="number"&&Number.isFinite(o))return o}catch{return null}return null}dispose(){if(this.collection){try{this.collection.show=!1,this.collection.removeAll(),window.geofs?.api?.viewer?.scene?.primitives?.remove?.(this.collection)}catch{}this.collection=null}this.lastScanAt=0,this.lastScanPos=null}};function Bn(r,e){let t=Math.max(0,Math.min(1,r)),i=t<.5?t*2:1,n=t<.5?.9:1-(t-.5)*1.4,s=.12,a=e;return typeof a=="function"?new a(i,n,s,.85):{red:i,green:n,blue:s,alpha:.85}}var qe=class{collection=null;lastUpdateAt=0;update(e,t,i,n,s){if(!e)return this.collection&&(this.collection.show=!1),0;if(!Number.isFinite(t)||!Number.isFinite(i))return 0;let a=window.geofs?.debug;if(typeof a?.drawAtmosphere=="function"&&s-this.lastUpdateAt>=2e3)try{a.drawAtmosphere()}catch{}let o=this.ensureCollection();return o?(o.show=!0,s-this.lastUpdateAt<3e3?o.length??0:(this.lastUpdateAt=s,this.renderThermalsGrid(o,t,i,n))):0}ensureCollection(){if(this.collection)return this.collection;let e=window.Cesium,t=window.geofs?.api?.viewer?.scene?.primitives;if(!e?.PointPrimitiveCollection||!t?.add)return null;try{let i=new e.PointPrimitiveCollection;return t.add(i),this.collection=i,i}catch{return null}}renderThermalsGrid(e,t,i,n){let s=window.Cesium;if(!s?.Cartesian3?.fromDegrees)return 0;e.removeAll();let a=Math.max(.2,Math.cos(t*Math.PI/180)),o=window.weather?.getLocalThermal,l=window.geofs?.getGroundAltitude,d=Math.max(300,n*.3048),c=8e3,u=6,p=0;for(let f=-u;f<=u;f++)for(let h=-u;h<=u;h++){let g=h/u*c/111320,b=f/u*c/(111320*a),x=t+g,T=i+b,A=0;if(typeof o=="function")try{let C=Number(o(x,T));Number.isFinite(C)&&(A=Math.max(0,Math.min(1,C/5)))}catch{A=0}else{let C=l?.(x,T)?.location?.[2]??0,m=l?.(x+.004,T)?.location?.[2]??C,v=Math.abs(C-m)/445,M=Math.max(0,Math.sin(x*120)*Math.cos(T*120));A=Math.max(0,Math.min(1,v*1.8+M*.65))}if(A<.35)continue;let w=Bn(A,s.Color);for(let C=0;C<3;C++){let m=Math.max(150,d-250+C*250);e.add({position:s.Cartesian3.fromDegrees(T,x,m),color:w,pixelSize:4+A*4}),p++}}return p}dispose(){if(this.collection){try{this.collection.show=!1,this.collection.removeAll(),window.geofs?.api?.viewer?.scene?.primitives?.remove?.(this.collection)}catch{}this.collection=null}this.lastUpdateAt=0}};function U(r,e){return e==="taxiwayLights"||e==="nightVfrLidar"||e==="windThermals"?r?.[e]??!1:r?.[e]??!0}function Kn(){if(typeof window>"u")return!1;let r=window;return!!(r.immersiveAirports||r.ImmersiveAirports||r.IA_CONFIG||window.geofs?.immersiveAirports||typeof document<"u"&&document.querySelector('[id*="immersive-airport" i], [id*="immersiveAirport" i], [class*="immersive-airport" i], script[src*="immersive" i][src*="airport" i]'))}var Ye=class{id="visuals-lighting";name="Visuals & Lighting";description="Aircraft ground headlights, runway glow, OSM taxiway lights, Night VFR LiDAR & glider thermals.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;optionKey="";lightShader=new Ue;runwayGlow=new $e;taxiwayLights=new je;lidar=new We;windThermals=new qe;lightSwitches={...xt};nextTaxiwayUpdate=0;nextCompatCheck=0;immersiveAirportsDetected=!1;unmountTab=null;syncHudTab=null;unbindLightsKey=null;applyLightPreset(e){this.lightSwitches=ii(e),this.syncHudTab?.();let t=e==="coldAndDark"?"Cold & Dark":e==="takeoff"?"Takeoff":e;this.ctx?.anchors.showToast(`Lights: ${t}`)}init(e){if(this.ctx=e,this.onSettingsChange(e.getSettings()),this.unbindLightsKey=e.keybinds?.register?.("visuals-lights-toggle",e.getSettings().keybindings?.toggleLandingLights??"Shift+L",()=>{let t=!(this.lightSwitches.landing||this.lightSwitches.taxi);this.lightSwitches={...this.lightSwitches,landing:t,taxi:t,turnoff:t},this.syncHudTab?.(),this.ctx?.anchors.showToast(t?"Landing & Taxi Lights ON":"Landing & Taxi Lights OFF")})??null,typeof document<"u"&&typeof e.anchors?.registerHudTab=="function"){let t=document.createElement("div");t.style.cssText="display:flex;flex-direction:column;gap:5px;font-size:10px;color:#e5e7eb;";let i=[["aircraftLights","Acft Lights"],["runwayGlow","RWY Glow"],["taxiwayLights","TWY Lights"],["nightVfrLidar","LiDAR"],["windThermals","Thermals"]],n=document.createElement("div");n.style.cssText="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;";let s=new Map;for(let[d,c]of i){let u=document.createElement("button");u.type="button",u.textContent=c,u.style.cssText="background:rgba(255,255,255,0.06);color:#e5e7eb;border:1px solid rgba(255,255,255,0.16);border-radius:4px;padding:4px 4px;font-size:9px;font-weight:700;cursor:pointer;",u.addEventListener("click",()=>{let p=e.getSettings().realismOptions??{};e.updateSettings({realismOptions:{...p,[d]:!U(p,d)}})}),s.set(d,u),n.appendChild(u)}let a=document.createElement("div");a.style.cssText="display:flex;gap:4px;";let o=(d,c)=>{let u=document.createElement("button");return u.type="button",u.textContent=d,u.style.cssText="flex:1;background:rgba(255,255,255,0.04);color:#cbd5e1;border:1px solid rgba(255,255,255,0.14);border-radius:4px;padding:3px 4px;font-size:8.5px;font-weight:700;cursor:pointer;",u.addEventListener("click",()=>this.applyLightPreset(c)),u};a.append(o("Cold & Dark","coldAndDark"),o("Takeoff","takeoff"),o("All On","allOn"));let l=()=>{let d=e.getSettings().realismOptions;for(let[c,u]of s){let p=U(d,c);u.style.borderColor=p?"#10b981":"rgba(255,255,255,0.16)",u.style.color=p?"#10b981":"#a1a1aa"}};this.syncHudTab=l,l(),t.append(n,a),this.unmountTab=e.anchors.registerHudTab("lights","LIGHTS",t,!1,{defaultClosed:!0})}}onSettingsChange(e){let t=e.realismOptions;this.ctx?.keybinds?.updateCombo?.("visuals-lights-toggle",e.keybindings?.toggleLandingLights??"Shift+L"),this.syncHudTab?.();let i=JSON.stringify({aircraftLights:U(t,"aircraftLights"),runwayGlow:U(t,"runwayGlow"),taxiwayLights:U(t,"taxiwayLights"),nightVfrLidar:U(t,"nightVfrLidar"),windThermals:U(t,"windThermals"),lightIntensity:e.lightIntensity,headlightMode:e.headlightMode});i!==this.optionKey&&(this.optionKey=i,!U(t,"aircraftLights")&&!U(t,"runwayGlow")&&this.lightShader.setEnabled(!1),U(t,"runwayGlow")||this.runwayGlow.reset(),U(t,"taxiwayLights")||this.taxiwayLights.dispose(),U(t,"nightVfrLidar")||this.lidar.dispose(),U(t,"windThermals")||this.windThermals.dispose())}update(e){let t=window.geofs,i=t?.aircraft?.instance;if(!i||e.paused||e.crashed){this.lightShader.setEnabled(!1);return}if(e.timestamp>=this.nextCompatCheck){this.nextCompatCheck=e.timestamp+5e3;let c=Kn();c!==this.immersiveAirportsDetected&&(this.immersiveAirportsDetected=c,c&&(this.runwayGlow.reset(),this.taxiwayLights.dispose(),this.ctx?.emitDiag?.("COMPANION_DETECTED",{companion:"Immersive Airports",yielded:["runwayGlow","taxiwayLights"]})),this.syncHudTab?.())}let n=this.ctx?.getSettings(),s=n?.realismOptions,a=U(s,"aircraftLights"),o=!this.immersiveAirportsDetected&&U(s,"runwayGlow"),l=!this.immersiveAirportsDetected&&U(s,"taxiwayLights"),d=!!this.ctx?.sim.isNight();if(a||o){this.lightShader.ensureStage(e.simMajor);let c=t?.api?.viewer?.scene?.camera?.viewMatrix,u=n?.headlightMode??"auto",p=e.aircraft?.hasGear===!1?!0:e.gearDown,f=a?ni({inst:i,viewMatrix:c,switches:this.lightSwitches,headlightMode:u,isNight:d,gearDown:p,nowMs:e.timestamp}):{points:[],spots:[]},h=o?wt(i):null,g=o?this.runwayGlow.update(t?.fx?.litRunways,h?.pos??null,c,e.timestamp):[],b=Number.isFinite(n?.lightIntensity)?Number(n?.lightIntensity):1.5,x=u==="on"?.55:.08;this.lightShader.setData(f.points,g,f.spots,b,x),this.lightShader.setEnabled(f.points.length>0||g.length>0||f.spots.length>0)}else this.lightShader.setEnabled(!1);l&&e.timestamp>=this.nextTaxiwayUpdate&&(this.nextTaxiwayUpdate=e.timestamp+3e3,this.taxiwayLights.update(e.lat,e.lon,t?.runways?.nearRunways)),this.lidar.update(U(s,"nightVfrLidar"),d,e.lat,e.lon,e.timestamp),this.windThermals.update(U(s,"windThermals"),e.lat,e.lon,e.altitude,e.timestamp)}destroy(){this.unbindLightsKey?.(),this.unbindLightsKey=null,this.unmountTab?.(),this.unmountTab=null,this.syncHudTab=null,this.optionKey="",this.lightShader.dispose(),this.runwayGlow.reset(),this.taxiwayLights.dispose(),this.lidar.dispose(),this.windThermals.dispose(),this.nextTaxiwayUpdate=0,this.nextCompatCheck=0,this.immersiveAirportsDetected=!1,this.ctx=null}};var Xe=class{lastMiddleClickAt=0;attached=!1;enabled=!0;onReset;constructor(e){this.onReset=e}handleMouseDown=e=>{if(!this.enabled||e.button!==1)return;let t=e.target;if(t&&typeof t.matches=="function"&&t.matches("input, textarea, select, [contenteditable]"))return;let i=Date.now();if(i-this.lastMiddleClickAt<=320){this.lastMiddleClickAt=0;let n=window.geofs?.camera?.reset;typeof n=="function"&&(n.call(window.geofs?.camera),this.onReset?.())}else this.lastMiddleClickAt=i};setEnabled(e){this.enabled=e,e||(this.lastMiddleClickAt=0)}attach(){this.attached||typeof document>"u"||(document.addEventListener("mousedown",this.handleMouseDown,!1),this.attached=!0)}dispose(){this.attached&&typeof document<"u"&&document.removeEventListener("mousedown",this.handleMouseDown,!1),this.attached=!1,this.lastMiddleClickAt=0}};var ri=Math.PI/180,zn=180/Math.PI,Un=3.280839895,Ze=class{active=!1;lat=0;lon=0;altMeters=0;headingRad=0;tiltRad=0;rollRad=0;savedGravity=null;heldKeys=new Set;bannerEl=null;listenersAttached=!1;isActive(){return this.active}toggle(e){return this.active?this.deactivate():this.activate(),e?.(this.active),this.active}activate(){let e=window.geofs?.aircraft?.instance,t=e?.llaLocation;if(!e||!t||t.length<3)return!1;this.lat=Number(t[0])||0,this.lon=Number(t[1])||0,this.altMeters=Number(t[2])||0;let i=Number(window.geofs?.animation?.values?.heading360)||0;this.headingRad=i*ri,this.tiltRad=0,this.rollRad=0;let s=e.rigidBody?.gravityForce;return this.savedGravity=Array.isArray(s)&&s.length>=3?[Number(s[0])||0,Number(s[1])||0,Number(s[2])||0]:null,this.active=!0,this.attachKeyListeners(),this.ensureBanner(),this.renderBanner(),!0}deactivate(){if(!this.active)return;this.active=!1,this.heldKeys.clear(),this.detachKeyListeners(),this.removeBanner();let e=window.geofs?.aircraft?.instance,t=e?.rigidBody;if(t&&this.savedGravity&&(t.gravityForce=this.savedGravity),this.savedGravity=null,e&&!e.groundContact&&t?.applyCentralImpulse){let n=e.object3d?.getWorldFrame?.()?.[1],s=Number(e.definition?.mass)||1e4,a=Number(e.definition?.minimumSpeed)||60;if(n&&n.length>=3){let o=a/2*s;t.applyCentralImpulse([n[0]*o,n[1]*o,n[2]*o])}}}update(e){if(!this.active)return;let t=window.geofs?.aircraft?.instance;if(!t){this.deactivate();return}let i=Number.isFinite(e.dt)&&e.dt>0?Math.min(e.dt,.2):.016,n=Math.max(1,Math.log10(Math.max(10,Math.abs(e.aglFeet)*.25))),s=.0025*n*i,a=35*n*i,o=45*ri*i,l=0,d=0,c=0;this.heldKeys.has("KeyI")&&(l+=s),this.heldKeys.has("KeyK")&&(l-=s),this.heldKeys.has("KeyL")&&(d+=s),this.heldKeys.has("KeyJ")&&(d-=s),this.heldKeys.has("KeyU")&&(c+=a),(this.heldKeys.has("Enter")||this.heldKeys.has("KeyN"))&&(c-=a),this.heldKeys.has("Comma")&&(this.headingRad-=o),this.heldKeys.has("Period")&&(this.headingRad+=o),this.heldKeys.has("ArrowUp")&&(this.tiltRad+=o),this.heldKeys.has("ArrowDown")&&(this.tiltRad-=o),this.heldKeys.has("ArrowLeft")&&(this.rollRad+=o),this.heldKeys.has("ArrowRight")&&(this.rollRad-=o),this.headingRad=(this.headingRad%(Math.PI*2)+Math.PI*2)%(Math.PI*2);let u=Math.cos(this.headingRad)*l-Math.sin(this.headingRad)*d,p=Math.sin(this.headingRad)*l+Math.cos(this.headingRad)*d;this.lat=Math.max(-85,Math.min(85,this.lat+u)),this.lon=(this.lon+p+540)%360-180,e.groundContact&&c<0||(this.altMeters=Math.max(-50,this.altMeters+c)),this.applyPose(t),this.renderBanner()}applyPose(e){e.llaLocation=[this.lat,this.lon,this.altMeters],e.object3d?.setInitialRotation?.([this.tiltRad,this.rollRad,this.headingRad]);let i=e.rigidBody;i&&(Array.isArray(i.v_acceleration)&&(i.v_acceleration=[0,0,0]),Array.isArray(i.v_angularAcceleration)&&(i.v_angularAcceleration=[0,0,0]),Array.isArray(i.v_linearVelocity)&&(i.v_linearVelocity=[0,0,0]),Array.isArray(i.v_angularVelocity)&&(i.v_angularVelocity=[0,0,0]),Array.isArray(i.gravityForce)&&(i.gravityForce=[0,0,0]))}onKeyDown=e=>{if(!this.active)return;let t=e.target;t&&typeof t.matches=="function"&&t.matches("input, textarea, select, [contenteditable]")||["KeyI","KeyJ","KeyK","KeyL","KeyU","KeyN","Enter","Comma","Period","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)&&(this.heldKeys.add(e.code),e.preventDefault())};onKeyUp=e=>{this.heldKeys.delete(e.code)};attachKeyListeners(){this.listenersAttached||typeof document>"u"||(document.addEventListener("keydown",this.onKeyDown),document.addEventListener("keyup",this.onKeyUp),this.listenersAttached=!0)}detachKeyListeners(){!this.listenersAttached||typeof document>"u"||(document.removeEventListener("keydown",this.onKeyDown),document.removeEventListener("keyup",this.onKeyUp),this.listenersAttached=!1)}ensureBanner(){if(typeof document>"u"||!document.body)return;let e=document.getElementById("geofs-ext-mode-banner");e||(e=document.createElement("div"),e.id="geofs-ext-mode-banner",document.body.appendChild(e)),e.style.cssText="position:fixed;top:8px;left:10px;z-index:2147483640;padding:4px 8px;border-radius:4px;background:rgba(15,23,42,0.84);border:1px solid rgba(239,68,68,0.6);color:#f87171;font:700 11px ui-monospace,SFMono-Regular,Menlo,monospace;pointer-events:none;",this.bannerEl=e}renderBanner(){if(!this.bannerEl)return;let e=(this.altMeters*Un).toFixed(0),t=Math.round(this.headingRad*zn);this.bannerEl.textContent=`SLEW  LAT ${this.lat.toFixed(4)}  LON ${this.lon.toFixed(4)}  ALT ${e} FT  HDG ${t}\xB0  [I/J/K/L U/N ,/.]`}removeBanner(){this.bannerEl?.remove(),this.bannerEl=null}dispose(){this.deactivate()}};var Je=class{mode="off";lastTickMs=0;lat=0;lon=0;altMeters=0;headingDeg=0;getMode(){return this.mode}setMode(e){let t=this.mode;if(this.mode=e,this.lastTickMs=Date.now(),e!=="off"){let n=window.geofs?.aircraft?.instance?.llaLocation;t==="off"&&Array.isArray(n)&&n.length>=2&&(this.lat=Number(n[0])||0,this.lon=Number(n[1])||0,this.altMeters=Number(n[2])||0,this.headingDeg=Number(window.geofs?.animation?.values?.heading360)||0),this.stepPose(.05)}}stop(){this.mode="off"}update(e){if(this.mode==="off"||e.paused||e.crashed)return!1;if(!!!(e.groundContact||window.geofs?.aircraft?.instance?.groundContact||window.geofs?.animation?.values?.groundContact)&&e.aglFeet>60||e.kias>25)return this.mode="off",!1;let i=e.timestamp||Date.now(),n=Math.min(.2,Math.max(.01,(i-this.lastTickMs)/1e3));return this.lastTickMs=i,this.stepPose(n)}stepPose(e){let t=window.geofs?.aircraft?.instance;if(!t||!Array.isArray(t.llaLocation))return!1;!Number.isFinite(this.lat)||this.lat===0&&this.lon===0?(this.lat=Number(t.llaLocation[0])||0,this.lon=Number(t.llaLocation[1])||0,this.altMeters=Number(t.llaLocation[2])||0,this.headingDeg=Number(window.geofs?.animation?.values?.heading360)||0):this.altMeters=Number(t.llaLocation[2])||this.altMeters;let i=this.mode==="left"?-6:this.mode==="right"?6:0;this.headingDeg=(this.headingDeg+i*e+360)%360;let n=t.htr;Array.isArray(n)&&n.length>=1&&(n[0]=this.headingDeg);let s=(this.headingDeg+180)*Math.PI/180,a=4,o=Math.cos(s)*a*e,l=Math.sin(s)*a*e,d=Math.max(.2,Math.cos(this.lat*Math.PI/180));this.lat+=o/111320,this.lon+=l/(111320*d),t.llaLocation[0]=this.lat,t.llaLocation[1]=this.lon,t.llaLocation[2]=this.altMeters;let c=t.setLocation;if(typeof c=="function")try{c.call(t,[this.lat,this.lon,this.altMeters])}catch{}let u=t.rigidBody;return u&&(Array.isArray(u.v_linearVelocity)&&(u.v_linearVelocity=[0,0,0]),Array.isArray(u.v_angularVelocity)&&(u.v_angularVelocity=[0,0,0])),!0}dispose(){this.mode="off"}};var Vn="geofs-ext-shortcut-overlay",Qe=class{el=null;keyListener=null;getKeybinds;constructor(e){this.getKeybinds=e}attach(){this.keyListener||(this.keyListener=e=>{let t=e.target;t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)||(e.key==="?"||e.shiftKey&&e.key==="/"?(e.preventDefault(),this.toggle()):e.key==="Escape"&&this.el&&!this.el.hidden&&this.hide())},window.addEventListener("keydown",this.keyListener))}toggle(){this.el&&!this.el.hidden?this.hide():this.show()}show(){let e=this.getKeybinds()??{},t=[["Toggle Autothrottle",e.toggleAutothrottle||"Alt+A"],["Toggle OP Engines",e.toggleOpEngines||"Alt+O"],["Toggle Shared HUD",e.toggleHud||"Alt+H"],["Toggle Flight Path Vector",e.toggleFpv||"Alt+F"],["Open / Advance Checklists",e.toggleChecklist||"Alt+C"],["Toggle Landing Lights",e.toggleLandingLights||"Alt+L"],["Toggle FSX Slew Mode",e.toggleSlewMode||"Alt+Y"],["Pre-Flight Walkaround","Alt+W"],["Camera Reset","Double Middle-Click"],["Shortcut Cheatsheet","? (Shift+/)"]];if(!this.el){let i=document.createElement("div");i.id=Vn,i.style.cssText=["position:fixed","top:50%","left:50%","transform:translate(-50%,-50%)","z-index:2147483640","width:320px","max-width:92vw","background:rgba(15,23,42,0.94)","color:#f8fafc","border:1px solid rgba(148,163,184,0.35)","border-radius:12px","padding:14px 16px","font-family:system-ui,-apple-system,sans-serif","box-shadow:0 20px 50px rgba(0,0,0,0.65)","backdrop-filter:blur(10px)"].join(";"),document.body.appendChild(i),this.el=i}this.el.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:1px solid rgba(148,163,184,0.2);padding-bottom:6px;">
        <span style="font-size:12px;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;">Keyboard Shortcuts</span>
        <button type="button" data-close-shortcuts style="background:none;border:none;color:#94a3b8;font-size:14px;cursor:pointer;line-height:1;">\u2715</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:11px;">
        ${t.map(([i,n])=>`
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <span style="color:#cbd5e1;">${i}</span>
              <kbd style="background:rgba(255,255,255,0.08);border:1px solid rgba(148,163,184,0.3);border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;color:#38bdf8;white-space:nowrap;">${n}</kbd>
            </div>
          `).join("")}
      </div>
    `,this.el.querySelector("[data-close-shortcuts]")?.addEventListener("click",()=>this.hide()),this.el.hidden=!1}hide(){this.el&&(this.el.hidden=!0)}dispose(){this.keyListener&&(window.removeEventListener("keydown",this.keyListener),this.keyListener=null),this.el?.remove(),this.el=null}};var et=class{active=!1;offsetX=12;offsetY=0;offsetZ=1.7;savedMode=0;heldKeys=new Set;bannerEl=null;listenersAttached=!1;isActive(){return this.active}toggle(e){return this.active?this.deactivate():this.activate(),e?.(this.active),this.active}activate(){let e=window.geofs?.camera;return e?(this.savedMode=typeof e.currentMode=="number"?e.currentMode:0,this.offsetX=14,this.offsetY=4,this.offsetZ=1.8,this.active=!0,this.attachListeners(),this.showBanner(),!0):!1}deactivate(){if(this.active){this.active=!1,this.heldKeys.clear(),this.detachListeners(),this.removeBanner();try{let e=window.geofs?.camera;e?.set?.(this.savedMode),e?.reset?.()}catch{}}}update(e){if(!this.active)return;if(e.kias>25&&!e.groundContact){this.deactivate();return}let t=Number.isFinite(e.dt)&&e.dt>0?Math.min(e.dt,.2):.03,i=this.heldKeys.has("ShiftLeft")||this.heldKeys.has("ShiftRight")?9:4.2;this.heldKeys.has("KeyW")&&(this.offsetY+=i*t),this.heldKeys.has("KeyS")&&(this.offsetY-=i*t),this.heldKeys.has("KeyD")&&(this.offsetX+=i*t),this.heldKeys.has("KeyA")&&(this.offsetX-=i*t),this.heldKeys.has("KeyE")&&(this.offsetZ=Math.min(18,this.offsetZ+2.5*t)),this.heldKeys.has("KeyQ")&&(this.offsetZ=Math.max(.8,this.offsetZ-2.5*t)),this.offsetX=Math.max(-120,Math.min(120,this.offsetX)),this.offsetY=Math.max(-120,Math.min(120,this.offsetY));let n=window.geofs?.camera;if(n?.currentDefinition&&(n.currentDefinition.position=[this.offsetX,this.offsetY,this.offsetZ]),this.bannerEl){let s=Math.hypot(this.offsetX,this.offsetY).toFixed(0);this.bannerEl.textContent=`WALKAROUND \xB7 DIST ${s}m \xB7 EYE ${this.offsetZ.toFixed(1)}m \xB7 [WASD Move \xB7 Q/E Height \xB7 Alt+W Exit]`}}onKeyDown=e=>{if(!this.active)return;let t=e.target;t&&typeof t.matches=="function"&&t.matches("input, textarea, select, [contenteditable]")||(["KeyW","KeyA","KeyS","KeyD","KeyQ","KeyE","ShiftLeft","ShiftRight"].includes(e.code)?(this.heldKeys.add(e.code),e.code!=="ShiftLeft"&&e.code!=="ShiftRight"&&e.preventDefault()):e.code==="Escape"&&this.deactivate())};onKeyUp=e=>{this.heldKeys.delete(e.code)};attachListeners(){this.listenersAttached||typeof document>"u"||(document.addEventListener("keydown",this.onKeyDown,{capture:!0}),document.addEventListener("keyup",this.onKeyUp,{capture:!0}),this.listenersAttached=!0)}detachListeners(){!this.listenersAttached||typeof document>"u"||(document.removeEventListener("keydown",this.onKeyDown,{capture:!0}),document.removeEventListener("keyup",this.onKeyUp,{capture:!0}),this.listenersAttached=!1)}showBanner(){if(typeof document>"u"||!document.body)return;let e=document.getElementById("geofs-ext-mode-banner");e||(e=document.createElement("div"),e.id="geofs-ext-mode-banner",document.body.appendChild(e)),e.style.cssText="position:fixed;top:8px;left:10px;z-index:2147483640;padding:4px 8px;border-radius:4px;background:rgba(15,23,42,0.88);border:1px solid rgba(56,189,248,0.6);color:#38bdf8;font:700 11px ui-monospace,SFMono-Regular,Menlo,monospace;pointer-events:none;",this.bannerEl=e}removeBanner(){this.bannerEl?.remove(),this.bannerEl=null}dispose(){this.deactivate()}};function Et(r){return r?.slewMode??!1}function $n(r){return r?.cameraReset??!0}var tt=class{id="sim-utilities";name="Sim Utilities";description="FSX-style Slew Mode (Shift+Y), Pushback Tug, Pre-Flight Walkaround (Shift+W), Shortcut Overlay (?), and camera reset.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;slewMode=new Ze;pushback=new Je;walkaround=new et;shortcutOverlay=new Qe(()=>this.ctx?.getSettings().keybindings);cameraReset=new Xe(()=>{this.ctx?.anchors.showToast("Camera Reset")});unbindSlewKey=null;unbindWalkKey=null;pushbackEventHandler=null;shortcutEventHandler=null;walkaroundEventHandler=null;init(e){this.ctx=e,this.cameraReset.attach(),this.shortcutOverlay.attach(),this.onSettingsChange(e.getSettings()),this.pushbackEventHandler=t=>{let i=t.detail?.mode??"off";this.pushback.setMode(i),this.ctx?.anchors.showToast(i==="off"?"Pushback Stopped":`Pushback: ${i.toUpperCase()}`)},this.shortcutEventHandler=()=>{this.shortcutOverlay.toggle()},this.walkaroundEventHandler=()=>{let t=this.walkaround.toggle();this.ctx?.anchors.showToast(t?"Walkaround ON (WASD)":"Walkaround OFF")},window.addEventListener("geofs-ext:pushback",this.pushbackEventHandler),window.addEventListener("geofs-ext:shortcuts",this.shortcutEventHandler),window.addEventListener("geofs-ext:walkaround",this.walkaroundEventHandler),this.unbindSlewKey=e.keybinds?.register?.("utilities-slew-toggle",e.getSettings().keybindings?.toggleSlewMode??"Alt+Y",()=>{let t=e.getSettings().realismOptions??{},i=!Et(t);e.updateSettings({realismOptions:{...t,slewMode:i}}),this.ctx?.anchors.showToast(i?"Slew Mode ON":"Slew Mode OFF")})??null,this.unbindWalkKey=e.keybinds?.register?.("utilities-walkaround-toggle","Alt+W",()=>{let t=this.walkaround.toggle();this.ctx?.anchors.showToast(t?"Walkaround ON (WASD)":"Walkaround OFF")})??null}onSettingsChange(e){let t=e.realismOptions;this.ctx?.keybinds?.updateCombo?.("utilities-slew-toggle",e.keybindings?.toggleSlewMode??"Alt+Y"),this.cameraReset.setEnabled($n(t));let i=Et(t);i&&!this.slewMode.isActive()?this.slewMode.activate():!i&&this.slewMode.isActive()&&this.slewMode.deactivate()}update(e){e.paused||e.crashed||(Et(this.ctx?.getSettings().realismOptions)&&this.slewMode.update(e),this.pushback.update(e),this.walkaround.update(e))}destroy(){this.pushbackEventHandler&&(window.removeEventListener("geofs-ext:pushback",this.pushbackEventHandler),this.pushbackEventHandler=null),this.shortcutEventHandler&&(window.removeEventListener("geofs-ext:shortcuts",this.shortcutEventHandler),this.shortcutEventHandler=null),this.walkaroundEventHandler&&(window.removeEventListener("geofs-ext:walkaround",this.walkaroundEventHandler),this.walkaroundEventHandler=null),this.unbindSlewKey?.(),this.unbindSlewKey=null,this.unbindWalkKey?.(),this.unbindWalkKey=null,this.pushback.dispose(),this.walkaround.dispose(),this.shortcutOverlay.dispose(),this.slewMode.dispose(),this.cameraReset.dispose(),this.ctx=null}};function oi(){return[new Te,new Ae,new Ce,new Me,new Fe,new Le,new Ne,new Ye,new Ie,new Oe,new _e,new Be,new ze,new tt]}var jn={gBreath:!0,windAudio:!0,soundExpansion:!0,blackout:!0,cameraShake:!0,propwash:!0,vortexEffects:!0,spinFix:!0,bladeCollisions:!0,engineInertia:!0,spoilerArming:!0,carrierOps:!0,performanceMode:!1,aircraftLights:!0,runwayGlow:!0,taxiwayLights:!1,genericGpws:!0,nightVfrLidar:!1,windThermals:!1,cameraReset:!0,slewMode:!1},Wn={modules:{autothrottle:!0,"autopilot-pp":!1,"information-display":!0,"fuel-simulator":!0,"overpowered-engines":!1,"checklist-system":!0,"realism-pack":!0,"visuals-lighting":!0,"failure-simulator":!1,"flight-path-vector":!0,"landing-statistics":!0,"satellite-imagery":!1,"gate-spawner":!0,"sim-utilities":!0},themeMode:"auto",calibratorPreset:"auto",keybindings:{toggleAutothrottle:"Alt+A",toggleOpEngines:"Alt+O",toggleHud:"Alt+H",toggleFpv:"Alt+F",toggleChecklist:"Alt+C",toggleLandingLights:"Alt+L",toggleSlewMode:"Alt+Y"},imageryProvider:"native",customImageryUrl:"",customImageryToken:"",aircraftOverrides:{},showStartupDiagnostics:!0,sidePanelAutoTelemetry:!0,hudPositionFallback:!0,keyboardOsProfile:"auto",macKeyboardType:null,simKeyTranslatorEnabled:!0,simKeyRemaps:{}},qn={autothrottleResponsiveness:1,opSyncPolicy:"ask",opDeltaThresholdKts:150,opThrustMultiplier:1,opCeilingFeet:3e6,opStability:!1,sasStrength:1,checklistAutoAdvance:!0,checklistEnforceMandatoryGates:!0,fuelDynamicSfc:!1,fuelRealisticTanks:!1,fuelAutoRefuel:!1,failureProbabilitiesEnabled:!1,failureProbabilityIntervalSec:60,failureSystemChances:{},failureRecoveryChancePct:60,landingReportAutoClose:!0,landingReportSeconds:15,fpvProjectionFactor:15,fpvResolutionMode:"auto",lightIntensity:1.5,headlightMode:"auto",realismOptions:{...jn}},ai={...Wn,...qn};(function(){let e=Date.now(),t=!1,i=!1,n=()=>{if(t)return;let a=nt(window.geofs?.version);if(a&&window.geofs?.aircraft?.instance&&document.body){t=!0,s(a);return}let o=Date.now()-e;!(/geofs\.php/i.test(window.location.pathname)||window.geofs)&&o>15e3||(o>6e4&&!i&&(i=!0,console.warn("[GeoFS Extension] Still waiting for GeoFS simulator instance...")),!(o>6e5)&&setTimeout(n,o<6e4?250:1e3))},s=a=>{let o=(l,d)=>{let c=d&&typeof d=="object"&&"level"in d?d.level:void 0,u=c==="error"||c==="warn"?c:l.endsWith("_ERROR")?"error":"info",p={time:new Date().toISOString(),code:l,level:u,payload:d};Array.isArray(window.__geofsExtDiag)||(window.__geofsExtDiag=[]),window.__geofsExtDiag.push(p),window.__geofsExtDiag.length>100&&window.__geofsExtDiag.shift(),console.info(`[GeoFS-EXT][DIAG]${u==="error"?"[ERROR]":""} ${l}`,d??""),window.postMessage({type:"GEOFS_EXT_DIAG",entry:p},"*")};try{o("UI_SCRIPT_LOADED",{simMajor:a,rawVersion:String(window.geofs?.version??""),path:window.location.pathname});let l={...ai},d,c,u=new he,p=new ge,f=new me,h=new be,g=new ve,b=new fe(u,a),x=y=>({...l,...y,modules:y.modules?{...l.modules,...y.modules}:l.modules,keybindings:y.keybindings?{...l.keybindings,...y.keybindings}:l.keybindings,simKeyRemaps:y.simKeyRemaps?{...y.simKeyRemaps}:l.simKeyRemaps,failureSystemChances:y.failureSystemChances?{...l.failureSystemChances,...y.failureSystemChances}:l.failureSystemChances,realismOptions:y.realismOptions?{...l.realismOptions,...y.realismOptions}:l.realismOptions}),T=null,A=(y,L)=>{let D=y.themeMode==="light"?"light":y.themeMode==="dark"||L?"dark":"light";D!==T&&(T=D,g.setTheme(D))},w=y=>{A(y,u.isNight()),g.setCalibratorPreset(y.calibratorPreset),h.updateConfig({enabled:y.simKeyTranslatorEnabled,osProfile:y.keyboardOsProfile,macKeyboardType:y.macKeyboardType,customRemaps:y.simKeyRemaps})},C=new xe(a,{sim:u,audio:p,anchors:g,keybinds:f,getAudioUrl:y=>d?d+y:void 0,getAssetUrl:y=>c?c+y:void 0,emitDiag:o,getSettings:()=>l,updateSettings:y=>{l=x(y),window.postMessage({type:"GEOFS_EXT_SETTINGS_PATCH",patch:y},"*"),w(l),C.applySettings(l)}}),m={fuelPct:100,burnKgHr:0,activeFailures:new Set,opSyncActive:!1,sasActive:!1,checklistPhase:"PRE-TAKEOFF",checklistPending:0,apPp:null};g.init(),f.start(),h.start(),f.register("hud-toggle",l.keybindings.toggleHud,()=>{g.toggleHudVisibility()});for(let y of oi())C.register(y);let v=C.on.bind(C);v("fuel:state",y=>{y&&Number.isFinite(y.pct)&&(m.fuelPct=y.pct),y&&Number.isFinite(y.burnKgHr)&&(m.burnKgHr=y.burnKgHr)}),v("failure:triggered",({type:y})=>{y&&m.activeFailures.add(y)}),v("failure:cleared",({type:y})=>{y&&m.activeFailures.delete(y)}),v("autothrottle:opsync-state",({active:y})=>{m.opSyncActive=!!y}),v("overpowered:sas-state",({active:y})=>{m.sasActive=!!y}),v("checklist:phase",({phase:y,pending:L})=>{y&&(m.checklistPhase=y),Number.isFinite(L)&&(m.checklistPending=L)}),v("autopilot-pp:state",y=>{m.apPp=y??null}),window.__geofsExt={manager:C,sim:u,bus:b,anchors:g,emitDiag:o,getSettings:()=>l};let M=0,S=0,E=null,k=(y,L,D,I)=>{if(!Number.isFinite(y)||!Number.isFinite(L))return null;let _=Math.max(.15,Math.cos(y*Math.PI/180)),V=[],B=window.geofs?.multiplayer?.users;if(B)for(let[K,N]of Object.entries(B)){let O=N?.lla??N?.lastUpdate?.co;if(!Array.isArray(O)||O.length<2)continue;let j=Number(O[0]),ee=Number(O[1]);if(!Number.isFinite(j)||!Number.isFinite(ee))continue;let te=Math.hypot((j-y)*60,(ee-L)*60*_);if(te<.005||te>220)continue;let ae=Number.isFinite(O[2])?Math.round(Number(O[2])*3.28084):0,li=Number.isFinite(N?.htr?.[0])?Math.round(Number(N.htr[0])):Number.isFinite(O[3])?Math.round(Number(O[3])):0,At=Number(N?.st?.as??N?.lastUpdate?.st?.as??0),Tt=Number(N?.st?.vs??N?.lastUpdate?.st?.vs??0);V.push({id:String(N?.id??K),callsign:String(N?.callsign||N?.cs||`FLT-${K.slice(0,5)}`).trim(),aircraft:String(N?.aircraftName||N?.ac||N?.lastUpdate?.ac||"ACFT"),lat:j,lon:ee,altFt:ae,heading:(li%360+360)%360,speedKts:Number.isFinite(At)?Math.round(At):0,vsFpm:Number.isFinite(Tt)?Math.round(Tt):0,distNm:te})}V.sort((K,N)=>K.distNm-N.distNm);let $=[],q=window.geofs?.runways?.nearRunways;if(q)for(let K of Object.values(q)){let N=K?.threshold1,O=K?.threshold2;if(!(!Array.isArray(N)||!Array.isArray(O)||N.length<2||O.length<2)&&($.push({icao:K.icao||"RWY",t1:[Number(N[0]),Number(N[1])],t2:[Number(O[0]),Number(O[1])]}),$.length>=24))break}return{lat:y,lon:L,heading:Math.round(D),groundSpeed:Math.round(I),traffic:V.slice(0,40).map(({distNm:K,...N})=>N),runways:$}};b.subscribe(y=>{A(l,y.isNight),C.dispatchTelemetry(y),y.timestamp-S>=1e3&&(S=y.timestamp,E=k(y.lat,y.lon,y.heading,y.groundSpeed)),y.timestamp-M>=250&&(M=y.timestamp,window.postMessage({type:"GEOFS_EXT_LIVE_TELEMETRY",telemetry:{simMajor:y.simMajor,aircraftProfile:y.aircraft,kias:Math.round(y.kias),altitude:Math.round(y.altitude),vs:Math.round(y.vs),agl:Math.round(y.aglFeet),mach:Number(y.mach.toFixed(2)),fuelPct:Number(m.fuelPct.toFixed(1)),burnKgHr:Math.round(m.burnKgHr),activeFailures:Array.from(m.activeFailures),opSyncActive:m.opSyncActive,sasActive:m.sasActive||!!l.opStability,checklistPhase:m.checklistPhase,checklistPending:m.checklistPending,apPp:m.apPp,radar:E}},"*"))});let F=!1;window.addEventListener("message",y=>{if(y.source!==window||!y.data||typeof y.data!="object")return;let L=y.data;L.type==="GEOFS_EXT_SETTINGS"&&L.settings&&(typeof L.audioBase=="string"&&/^chrome-extension:\/\/[a-p]{32}\/audio\/$/.test(L.audioBase)&&(d=L.audioBase),typeof L.assetBase=="string"&&/^chrome-extension:\/\/[a-p]{32}\/assets\/$/.test(L.assetBase)&&(c=L.assetBase),l=L.settings,u.setAircraftOverrides(l.aircraftOverrides),f.updateCombo("hud-toggle",l.keybindings.toggleHud),w(l),C.applySettings(l).then(()=>{F||(F=!0,o("UI_MOUNT",{simMajor:a,activeModules:C.getModules().filter(D=>C.isActive(D.id)).map(D=>D.id)}),l.showStartupDiagnostics&&g.showToast(`GeoFS Extension Active (GeoFS V${a})`))}))}),u.setAircraftOverrides(l.aircraftOverrides),w(l),C.applySettings(l).then(()=>{F||o("UI_BOOT",{simMajor:a})}),b.start(),window.postMessage({type:"GEOFS_EXT_REQUEST_SETTINGS"},"*"),setTimeout(()=>{F||window.postMessage({type:"GEOFS_EXT_REQUEST_SETTINGS"},"*")},1e3)}catch(l){o("UI_BOOT_ERROR",{simMajor:a,message:l instanceof Error?l.message:String(l)}),console.error("[GeoFS Extension] Bootstrap failed:",l)}};n()})();})();
