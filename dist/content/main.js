"use strict";(()=>{var Pe=["V1","VR","V2","Vref","Vfe","Vne"];function oe(n,e){let t=Pe.flatMap(i=>n?.[i]!==void 0?[`${i} ${n[i]} kt`]:e?.[i]!==void 0?[`${i} Mach ${e[i]}`]:[]);return t.length?`V-Speeds: ${t.join(" \xB7 ")}`:""}var We={1:{name:"Piper Cub",category:"ga-piston",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:340,mtow:550,maxFuel:45,vSpeeds:{vr:38,vref:50,vne:106}},2:{name:"Cessna 172",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:757,mtow:1157,maxFuel:160,vSpeeds:{vr:55,vref:65,vfe:85,vne:163}},3:{name:"Alphajet PAF",category:"fighter",engineCount:2,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:3515,mtow:8e3,maxFuel:1520,vSpeeds:{vr:115,vref:120,vfe:210,vne:540}},4:{name:"Boeing 737-700",category:"airliner-twin",engineCount:2,maxFlaps:8,hasGear:!0,hasSpoilers:!0,oew:37340,mtow:70080,maxFuel:20816,vSpeeds:{v1:130,vr:136,v2:144,vref:130,vfe:230,vne:340}},5:{name:"Embraer Phenom 100",category:"airliner-twin",engineCount:2,maxFlaps:4,hasGear:!0,hasSpoilers:!0,oew:3235,mtow:4750,maxFuel:1272,vSpeeds:{v1:98,vr:102,v2:110,vref:99,vfe:180,vne:275}},6:{name:"de Havilland Canada DHC-6 Twin Otter",category:"turboprop",engineCount:2,maxFlaps:4,hasGear:!1,hasSpoilers:!1,oew:3121,mtow:5670,maxFuel:1175,vSpeeds:{vr:65,vref:75,vfe:105,vne:170}},7:{name:"F-16 Fighting Falcon",category:"fighter",engineCount:1,maxFlaps:0,hasGear:!0,hasSpoilers:!0,oew:8570,mtow:19200,maxFuel:3175,vSpeeds:{vr:140,vref:148,vne:800}},8:{name:"Pitts Special S1",category:"ga-piston",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:326,mtow:521,maxFuel:60,vSpeeds:{vr:58,vref:70,vne:182}},9:{name:"Eurocopter EC135",category:"rotorcraft",engineCount:2,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:1455,mtow:2910,maxFuel:560,vSpeeds:{vref:60,vne:155}},10:{name:"Airbus A380",category:"airliner-quad",engineCount:4,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:277e3,mtow:575e3,maxFuel:253983,vSpeeds:{v1:145,vr:155,v2:165,vref:142,vfe:222,vne:340}},11:{name:"Alisport Silent 2 Electro",category:"specialized",engineCount:1,maxFlaps:0,hasGear:!0,hasSpoilers:!0,oew:205,mtow:300,maxFuel:0,vSpeeds:{vr:35,vref:45,vne:118}},12:{name:"Pilatus PC-7 Mk-I",category:"turboprop",engineCount:1,maxFlaps:2,hasGear:!0,hasSpoilers:!1,oew:1330,mtow:2700,maxFuel:360,vSpeeds:{vr:75,vref:85,vfe:130,vne:270}},13:{name:"de Havilland Canada DHC-2 Beaver",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:1361,mtow:2313,maxFuel:359,vSpeeds:{vr:52,vref:65,vfe:95,vne:156}},14:{name:"Colomban MC-15 Cri-cri",category:"ga-piston",engineCount:2,maxFlaps:1,hasGear:!1,hasSpoilers:!1,oew:80,mtow:170,maxFuel:18,vSpeeds:{vr:42,vref:52,vfe:80,vne:140}},15:{name:"Lockheed P-38 Lightning F-5B",category:"ga-piston",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!1,oew:5800,mtow:9800,maxFuel:1100,vSpeeds:{vr:95,vref:105,vfe:160,vne:390}},16:{name:"Douglas DC-3",category:"ga-piston",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!1,oew:7650,mtow:11430,maxFuel:1800,vSpeeds:{vr:78,vref:85,vfe:112,vne:211}},18:{name:"Sukhoi Su-35",category:"fighter",engineCount:2,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:18400,mtow:34500,maxFuel:11500,vSpeeds:{vr:130,vref:142,vfe:250,vne:755}},19:{name:"Concorde (V3)",category:"supersonic",engineCount:4,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:78700,mtow:185e3,maxFuel:95600,vSpeeds:{v1:165,vr:195,v2:220,vref:162,vne:1350}},20:{name:"Concorde",category:"supersonic",engineCount:4,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:78700,mtow:185e3,maxFuel:95600,vSpeeds:{v1:165,vr:195,v2:220,vref:162,vne:1350}},21:{name:"Piper PA-28 161 Warrior II",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:612,mtow:1107,maxFuel:145,vSpeeds:{vr:55,vref:63,vfe:103,vne:160}},22:{name:"Cessna 152",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:490,mtow:757,maxFuel:98,vSpeeds:{vr:50,vref:60,vfe:85,vne:149}},23:{name:"Piper PA-28 Warrior II",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:612,mtow:1107,maxFuel:145,vSpeeds:{vr:55,vref:63,vfe:103,vne:160}},24:{name:"Airbus A350-900",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:142400,mtow:28e4,maxFuel:112600,vSpeeds:{v1:142,vr:148,v2:156,vref:138,vfe:230,vne:340}},25:{name:"Boeing 777-300ER",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:167800,mtow:351500,maxFuel:145538,vSpeeds:{v1:152,vr:160,v2:168,vref:146,vfe:235,vne:330}},27:{name:"Boeing F/A-18F Super Hornet",category:"fighter",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!0,oew:14552,mtow:29937,maxFuel:6200,vSpeeds:{vr:135,vref:138,vfe:250,vne:750}},28:{name:"Beechcraft Baron B55",category:"ga-piston",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!1,oew:1431,mtow:2313,maxFuel:322,vSpeeds:{vr:78,vref:90,vfe:122,vne:223}},29:{name:"Dassault Rafale",category:"fighter",engineCount:2,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:10300,mtow:24500,maxFuel:4700,vSpeeds:{vr:125,vref:132,vne:750}},31:{name:"Potez 25",category:"ga-piston",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:1490,mtow:2558,maxFuel:250,vSpeeds:{vr:48,vref:58,vne:130}},32:{name:"Northrop T-38 Talon",category:"fighter",engineCount:2,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:3270,mtow:5670,maxFuel:1800,vSpeeds:{vr:145,vref:155,vfe:240,vne:710}},240:{name:"Boeing 777-200ER",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:138100,mtow:297550,maxFuel:137460,vSpeeds:{v1:146,vr:154,v2:162,vref:140,vfe:235,vne:330}},242:{name:"Airbus A321neo",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:50100,mtow:97e3,maxFuel:26e3,vSpeeds:{v1:138,vr:143,v2:149,vref:135,vfe:230,vne:350}},243:{name:"Airbus A319-100",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:40800,mtow:75500,maxFuel:18600,vSpeeds:{v1:130,vr:135,v2:142,vref:128,vfe:230,vne:350}},244:{name:"Airbus A320neo",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:44300,mtow:79e3,maxFuel:19046,vSpeeds:{v1:132,vr:138,v2:145,vref:130,vfe:230,vne:350}},1013:{name:"ATR 42-600",category:"turboprop",engineCount:2,maxFlaps:4,hasGear:!0,hasSpoilers:!1,oew:11700,mtow:18600,maxFuel:4500,vSpeeds:{v1:96,vr:100,v2:108,vref:104,vfe:175,vne:250}},1015:{name:"Challenger 650",category:"airliner-twin",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!0,oew:12300,mtow:21863,maxFuel:9072,vSpeeds:{v1:118,vr:124,v2:132,vref:122,vfe:215,vne:340}},1016:{name:"CRJ900",category:"airliner-twin",engineCount:2,maxFlaps:4,hasGear:!0,hasSpoilers:!0,oew:21433,mtow:38330,maxFuel:8800,vSpeeds:{v1:128,vr:134,v2:142,vref:130,vfe:220,vne:335}},2808:{name:"Supermarine Spitfire Mk IX",category:"ga-piston",engineCount:1,maxFlaps:1,hasGear:!0,hasSpoilers:!1,oew:2300,mtow:4300,maxFuel:380,vSpeeds:{vr:85,vref:90,vfe:140,vne:390}},2843:{name:"Airbus A321-200",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:48500,mtow:93500,maxFuel:24e3,vSpeeds:{v1:136,vr:142,v2:148,vref:134,vfe:230,vne:350}},2844:{name:"Falcon 9 (SpaceX)",category:"specialized",engineCount:9,maxFlaps:0,hasGear:!0,hasSpoilers:!0,oew:22200,mtow:549054,maxFuel:395700,vSpeeds:{vr:180,vref:160,vne:1500}},2948:{name:"North American XB-70 Valkyrie",category:"supersonic",engineCount:6,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:115031,mtow:245847,maxFuel:14e4,vSpeeds:{v1:170,vr:200,v2:225,vref:175,vne:1800}},2953:{name:"Space Shuttle Atlantis",category:"specialized",engineCount:3,maxFlaps:1,hasGear:!0,hasSpoilers:!0,oew:78e3,mtow:11e4,maxFuel:0,vSpeeds:{vr:195,vref:195,vne:450}},2973:{name:"Airbus A350-1000 XWB",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:155e3,mtow:319e3,maxFuel:125e3,vSpeeds:{v1:148,vr:155,v2:162,vref:143,vfe:230,vne:340}},2988:{name:"North American X-15",category:"specialized",engineCount:1,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:6620,mtow:15420,maxFuel:8300,vSpeeds:{vr:210,vref:200,vfe:320,vne:2e3}},3179:{name:"Boeing 787-10",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:135500,mtow:254e3,maxFuel:101e3,vSpeeds:{v1:146,vr:152,v2:160,vref:141,vfe:235,vne:340}},4341:{name:"Spirit of St. Louis",category:"ga-piston",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:975,mtow:2380,maxFuel:1200,vSpeeds:{vr:55,vref:62,vne:115}},4402:{name:"Boeing 777-200F",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:144400,mtow:347800,maxFuel:145e3,vSpeeds:{v1:150,vr:158,v2:166,vref:144,vfe:235,vne:330}},5038:{name:"Lockheed L-1011-1 TriStar",category:"airliner-twin",engineCount:3,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:105100,mtow:195045,maxFuel:68e3,vSpeeds:{v1:140,vr:148,v2:156,vref:138,vfe:230,vne:345}},5073:{name:"Bombardier Learjet 45 XR",category:"airliner-twin",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!0,oew:6212,mtow:9752,maxFuel:2700,vSpeeds:{v1:116,vr:122,v2:129,vref:118,vfe:200,vne:330}},5086:{name:"Airbus A321-211",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:48500,mtow:93500,maxFuel:23700,vSpeeds:{v1:136,vr:142,v2:148,vref:134,vfe:230,vne:350}},5156:{name:"Airbus A318-112",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:39500,mtow:68e3,maxFuel:18600,vSpeeds:{v1:126,vr:132,v2:138,vref:125,vfe:230,vne:350}},5193:{name:"Boeing 747-8i",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:220128,mtow:447700,maxFuel:191e3,vSpeeds:{v1:154,vr:164,v2:174,vref:150,vfe:240,vne:365}},5203:{name:"Boeing 737-600",category:"airliner-twin",engineCount:2,maxFlaps:8,hasGear:!0,hasSpoilers:!0,oew:37340,mtow:65990,maxFuel:20816,vSpeeds:{v1:128,vr:134,v2:141,vref:128,vfe:230,vne:340}},5211:{name:"Boeing 747SP",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:152780,mtow:317500,maxFuel:15e4,vSpeeds:{v1:142,vr:152,v2:162,vref:138,vfe:235,vne:365}},5229:{name:"F-35B Lightning II",category:"fighter",engineCount:1,maxFlaps:0,hasGear:!0,hasSpoilers:!0,oew:14700,mtow:27200,maxFuel:6125,vSpeeds:{vr:132,vref:138,vne:750}},5314:{name:"Boeing 747-100 SCA",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:162400,mtow:322050,maxFuel:145e3,vSpeeds:{v1:144,vr:154,v2:164,vref:142,vfe:235,vne:360}},5409:{name:"Boeing 747-400D",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:181e3,mtow:396890,maxFuel:173472,vSpeeds:{v1:148,vr:158,v2:168,vref:144,vfe:235,vne:365}},5431:{name:"Northrop YF-23",category:"fighter",engineCount:2,maxFlaps:0,hasGear:!0,hasSpoilers:!0,oew:14900,mtow:29e3,maxFuel:8600,vSpeeds:{vr:138,vref:144,vne:820}},5486:{name:"Aviat A-1B Husky",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:531,mtow:907,maxFuel:190,vSpeeds:{vr:42,vref:52,vfe:80,vne:132}},5499:{name:"CubCrafters CC19 XCub",category:"ga-piston",engineCount:1,maxFlaps:3,hasGear:!1,hasSpoilers:!1,oew:552,mtow:1043,maxFuel:150,vSpeeds:{vr:40,vref:50,vfe:82,vne:145}},5516:{name:"Boeing 747-400 LCF",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:180530,mtow:364235,maxFuel:16e4,vSpeeds:{v1:148,vr:158,v2:168,vref:144,vfe:235,vne:350}},5527:{name:"Boeing 747-400",category:"airliner-quad",engineCount:4,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:183520,mtow:396890,maxFuel:173472,vSpeeds:{v1:150,vr:160,v2:170,vref:146,vfe:235,vne:365}},5551:{name:"Comac C919-100",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:42e3,mtow:71500,maxFuel:15600,vSpeeds:{v1:132,vr:138,v2:145,vref:130,vfe:225,vne:340}},5566:{name:"Embraer E175",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:21886,mtow:38790,maxFuel:9335,vSpeeds:{v1:124,vr:130,v2:138,vref:122,vfe:215,vne:320}},5585:{name:"Boeing 767-300ER",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:90010,mtow:186880,maxFuel:72900,vSpeeds:{v1:142,vr:149,v2:157,vref:138,vfe:235,vne:360}},5642:{name:"Tupolev Tu-144",category:"supersonic",engineCount:4,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:99200,mtow:207e3,maxFuel:95e3,vSpeeds:{v1:168,vr:192,v2:215,vref:165,vne:1350}},5678:{name:"Boeing 757-200",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:58440,mtow:115680,maxFuel:34500,vSpeeds:{v1:138,vr:144,v2:152,vref:132,vfe:235,vne:350}},5712:{name:"McDonnell Douglas MD-11",category:"airliner-twin",engineCount:3,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:117356,mtow:286e3,maxFuel:116926,vSpeeds:{v1:150,vr:158,v2:166,vref:149,vfe:235,vne:355}},5791:{name:"Lockheed C-5M Galaxy",category:"airliner-quad",engineCount:4,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:172370,mtow:381e3,maxFuel:150800,vSpeeds:{v1:138,vr:146,v2:155,vref:136,vfe:225,vne:350}},5847:{name:"Boeing 727-200",category:"airliner-twin",engineCount:3,maxFlaps:8,hasGear:!0,hasSpoilers:!0,oew:45360,mtow:95e3,maxFuel:30600,vSpeeds:{v1:134,vr:140,v2:148,vref:132,vfe:230,vne:350}}};var yt=[{match:"a320",spec:{name:"Airbus A320",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:42600,mtow:78e3,maxFuel:19150,vSpeeds:{v1:132,vr:138,v2:145,vref:130,vfe:230,vne:350}}},{match:"a330",spec:{name:"Airbus A330-300",category:"airliner-twin",engineCount:2,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:124500,mtow:242e3,maxFuel:78e3,vSpeeds:{v1:138,vr:146,v2:154,vref:136,vfe:225,vne:330}}},{match:"a340",spec:{name:"Airbus A340-600",category:"airliner-quad",engineCount:4,maxFlaps:5,hasGear:!0,hasSpoilers:!0,oew:177800,mtow:38e4,maxFuel:155e3,vSpeeds:{v1:150,vr:158,v2:168,vref:144,vfe:230,vne:330}}},{match:"737 max",spec:{name:"Boeing 737 MAX 8",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:45070,mtow:82190,maxFuel:20730,vSpeeds:{v1:136,vr:142,v2:149,vref:135,vfe:230,vne:340}}},{match:"737",spec:{name:"Boeing 737-800",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:41413,mtow:79015,maxFuel:20894,vSpeeds:{v1:135,vr:141,v2:148,vref:134,vfe:230,vne:340}}},{match:"757",spec:{name:"Boeing 757-200",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:57840,mtow:115680,maxFuel:34700,vSpeeds:{v1:138,vr:144,v2:152,vref:132,vfe:235,vne:350}}},{match:"767",spec:{name:"Boeing 767-300ER",category:"airliner-twin",engineCount:2,maxFlaps:6,hasGear:!0,hasSpoilers:!0,oew:90010,mtow:186880,maxFuel:73e3,vSpeeds:{v1:142,vr:149,v2:157,vref:138,vfe:235,vne:360}}},{match:"atr 72",spec:{name:"ATR 72-600",category:"turboprop",engineCount:2,maxFlaps:4,hasGear:!0,hasSpoilers:!1,oew:13500,mtow:23e3,maxFuel:5e3,vSpeeds:{v1:98,vr:103,v2:112,vref:106,vfe:175,vne:250}}},{match:"q400",spec:{name:"Dash 8 Q400",category:"turboprop",engineCount:2,maxFlaps:4,hasGear:!0,hasSpoilers:!1,oew:17819,mtow:29574,maxFuel:5318,vSpeeds:{v1:105,vr:110,v2:118,vref:112,vfe:180,vne:285}}},{match:"king air",spec:{name:"Beechcraft King Air 350i",category:"turboprop",engineCount:2,maxFlaps:3,hasGear:!0,hasSpoilers:!1,oew:4513,mtow:6804,maxFuel:1640,vSpeeds:{v1:96,vr:100,v2:108,vref:102,vfe:170,vne:263}}},{match:"f-16",spec:{name:"F-16C Fighting Falcon",category:"fighter",engineCount:1,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:8570,mtow:19200,maxFuel:3200,vSpeeds:{vr:140,vref:148,vne:800}}},{match:"f-22",spec:{name:"F-22A Raptor",category:"fighter",engineCount:2,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:19700,mtow:38e3,maxFuel:8200,vSpeeds:{vr:135,vref:140,vne:800}}},{match:"f-35",spec:{name:"F-35A Lightning II",category:"fighter",engineCount:1,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:13290,mtow:31750,maxFuel:8278,vSpeeds:{vr:138,vref:145,vne:750}}},{match:"typhoon",spec:{name:"Eurofighter Typhoon",category:"fighter",engineCount:2,maxFlaps:2,hasGear:!0,hasSpoilers:!0,oew:11e3,mtow:23500,maxFuel:4500,vSpeeds:{vr:130,vref:136,vne:800}}},{match:"sr-71",spec:{name:"Lockheed SR-71 Blackbird",category:"supersonic",engineCount:2,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:30600,mtow:78e3,maxFuel:46180,vSpeeds:{v1:170,vr:210,v2:235,vref:175,vne:1900}}},{match:"zlin",spec:{name:"Zlin Z-50",category:"ga-piston",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:570,mtow:840,maxFuel:45,vSpeeds:{vr:55,vref:65,vne:190}}},{match:"r44",spec:{name:"Robinson R44",category:"rotorcraft",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:657,mtow:1134,maxFuel:140,vSpeeds:{vref:55,vne:130}}},{match:"bell 407",spec:{name:"Bell 407",category:"rotorcraft",engineCount:1,maxFlaps:0,hasGear:!1,hasSpoilers:!1,oew:1210,mtow:2268,maxFuel:390,vSpeeds:{vref:60,vne:140}}},{match:"uh-60",spec:{name:"Sikorsky UH-60 Black Hawk",category:"rotorcraft",engineCount:2,maxFlaps:0,hasGear:!0,hasSpoilers:!1,oew:4819,mtow:9979,maxFuel:1100,vSpeeds:{vref:65,vne:159}}}];function Ne(n){if(n==null)return null;let e=String(n).trim().match(/^(?:geofs\s*)?(?:v)?(\d+)(?:[.\-_\sa-z].*)?$/i);if(!e)return null;let t=Number(e[1]);return t===3||t===4?t:null}function wt(n,e,t,i){let s=n.toLowerCase();return/\b(?:helicopter|rotorcraft|robinson|alouette|ec135|h145|r[- ]?(?:22|44|66)|uh[- ]?60|mi[- ]?8|bo[- ]?105|bell[ -]?(?:206|407)|black hawk|chinook|apache|ch[- ]?47|ah[- ]?64)\b/.test(s)?"rotorcraft":s.includes("concorde")||s.includes("xb-70")||s.includes("tu-144")||s.includes("sr-71")?"supersonic":s.includes("shuttle")||s.includes("falcon 9")||s.includes("x-15")?"specialized":s.includes("f-18")||s.includes("f/a-18")||s.includes("f-35")||s.includes("su-35")||s.includes("rafale")||s.includes("f-16")||s.includes("f-22")||s.includes("yf-23")||s.includes("t-38")||s.includes("typhoon")||s.includes("gripen")||s.includes("f-15")?"fighter":s.includes("atr")||s.includes("dash")||s.includes("q400")||s.includes("king air")||s.includes("pc-12")?"turboprop":t>=4&&e>8e4?"airliner-quad":e>15e3||i>25e3?"airliner-twin":"ga-piston"}var le=class{lastAcRef;lastDefinition;cachedProfile=null;overrides={};setAircraftOverrides(e){this.overrides=e??{},this.cachedProfile=null}getMajorVersion(){return Ne(window.geofs?.version)}isNight(){let e=window.weather?.localTime;if(typeof e=="number"&&Number.isFinite(e)){let i=(e%24+24)%24;return i<6||i>=19}let t=window.geofs?.environment;if(t&&typeof t.sunElevation=="number")return t.sunElevation<-.02;if(t&&typeof t.time=="number"){let i=(t.time%24+24)%24;return i<6||i>=19}return!1}getAircraftProfile(){let e=window.geofs?.aircraft?.instance,t=e?.id??e?.aircraftRecord?.id;if(!e||t==null)return this.lastAcRef=void 0,this.cachedProfile=null,null;if(e===this.lastAcRef&&e.definition===this.lastDefinition&&this.cachedProfile?.id===String(t))return this.cachedProfile;let i=String(t),s=e.definition||{},a=window.geofs?.aircraftList?.[i]||e.aircraftRecord,r=String(a?.name||s.externalName||s.name||e.name||`Aircraft ${i}`),l=Object.hasOwn(We,i)?We[i]:void 0,o=l??yt.find(x=>r.toLowerCase().includes(x.match))?.spec,d=Array.isArray(e.engines)&&e.engines.length>0?e.engines.length:o?.engineCount??1,c;if(o)c={id:i,...o,vSpeeds:void 0,name:l?o.name:r,engineCount:d,isDynamic:!l};else{let x=Number(s.mass||e.setup?.mass||1200),b=Number.isFinite(x)&&x>0?x:1200,E=Number(s.maxThrust),T=Number.isFinite(E)&&E>=0?E:0,A=s.hasGear!==void 0?!!s.hasGear:!!s.gearPositions?.length||e.parts?.gear!==void 0,S=s.hasAirbrakes!==void 0?!!s.hasAirbrakes:e.parts?.airbrakes!==void 0||e.parts?.spoilers!==void 0,C=s.flapsSteps??(s.flapsPositions?Math.max(0,s.flapsPositions.length-1):0),g=wt(r,b,d,T);c={id:i,name:r,category:g,engineCount:d,maxFlaps:C,hasGear:A,hasSpoilers:S,oew:Math.round(b*.55),mtow:Math.round(b*1.25),maxFuel:Math.round(b*.35),isDynamic:!0}}let p={},u={},h=e.definition?.Vspeeds;for(let x of Pe){let b=h?.[x.toUpperCase()]??h?.[x];if(b===void 0&&!h){let E=o?.vSpeeds[x.toLowerCase()];E!==void 0&&(p[x]=E)}typeof b!="number"||!Number.isFinite(b)||b<=0||(b<10?u[x]=b:p[x]=b)}let m=[i,r.toLowerCase(),c.name.toLowerCase()].map(x=>Object.hasOwn(this.overrides,x)?this.overrides[x]:void 0).find(Boolean);return c={...c,...m,vSpeeds:{...p,...m?.vSpeeds},machSpeeds:u},this.lastAcRef=e,this.lastDefinition=e.definition,this.cachedProfile=c,c}getThrottles(){let e=window.controls,t=window.geofs?.aircraft?.instance;if(!e)return[0];let i=Array.isArray(t?.engines)?t.engines.length:1;if(i>=2){let s=[];for(let a=1;a<=Math.min(i,4);a++){let r=e[`throttle${a}`];typeof r=="number"&&Number.isFinite(r)&&s.push(r)}if(s.length===i)return s;if(typeof e.throttleLeft=="number"&&Number.isFinite(e.throttleLeft)&&typeof e.throttleRight=="number"&&Number.isFinite(e.throttleRight))return[e.throttleLeft,e.throttleRight]}return[typeof e.throttle=="number"&&Number.isFinite(e.throttle)?e.throttle:0]}setThrottle(e){if(typeof e!="number"||!Number.isFinite(e))return;let t=window.controls;if(!t)return;let i=Math.max(-1,Math.min(1,e));typeof t.manipulatorSetters?.setThrottle=="function"?t.manipulatorSetters.setThrottle(i):t.throttle=i,t.throttleLeft!==void 0&&(t.throttleLeft=i),t.throttleRight!==void 0&&(t.throttleRight=i),t.throttle1!==void 0&&(t.throttle1=i),t.throttle2!==void 0&&(t.throttle2=i),t.throttle3!==void 0&&(t.throttle3=i),t.throttle4!==void 0&&(t.throttle4=i)}stopEngines(){let e=window.geofs?.aircraft?.instance;if(typeof e?.stopEngines=="function")e.stopEngines();else if(typeof e?.stopEngine=="function")e.stopEngine();else return!1;return!0}setFlaps(e){if(!Number.isFinite(e))return;let t=window.geofs?.aircraft?.instance,i=window.controls;i?.flaps&&typeof i.setters?.setFlaps?.set=="function"?(i.flaps.target=e,i.setters.setFlaps.set()):typeof t?.setFlaps=="function"&&t.setFlaps(e)}toggleGear(){window.controls?.setters?.setGear?.set?.()}isCrashed(e,t){if(e?.crashed||window.geofs?.crashed||t?.crashed||e?.animationValue?.crashed)return!0;if(typeof document<"u"&&typeof document.querySelector=="function"){let s=document.querySelector(".geofs-crash, .geofs-crash-overlay");if(s instanceof HTMLElement){let a=typeof getComputedStyle=="function"?getComputedStyle(s):null;if(a?a.display!=="none"&&a.visibility!=="hidden":s.offsetParent!==null)return!0}}return!1}buildTelemetrySnapshot(e,t){let i=window.geofs?.animation?.values||{},s=window.geofs?.aircraft?.instance,a=s?.llaLocation||[0,0,0],r=this.getAircraftProfile(),l=r?.category==="rotorcraft",o=window.controls?.throttle,d=i.rotorTorque??i.torque,c=(p,u=0)=>typeof p=="number"&&Number.isFinite(p)?p:u;return Object.freeze({timestamp:Date.now(),dt:c(e,.016),simMajor:t,paused:!!window.geofs?.isPaused?.(),isNight:this.isNight(),aircraft:r,kias:c(i.kias,0),mach:c(i.mach,0),altitude:c(i.altitude,0),aglFeet:c(i.haglFeet,0),vs:c(i.verticalSpeed,0),heading:c(i.heading360,0),groundSpeed:c(i.groundSpeedKnt,c(i.groundSpeed,0)),gForce:c(i.loadFactor,1),aoa:c(i.aoa,0),pitch:c(i.atilt,c(i.pitch,0)),roll:c(i.aroll,c(i.roll,0)),groundContact:!!s?.groundContact,crashed:this.isCrashed(s,i),autopilotOn:!!window.geofs?.autopilot?.on,reverserActive:!!(i.reverser||window.controls?.reversers),throttles:this.getThrottles(),collective:l&&typeof o=="number"&&Number.isFinite(o)?Math.min(1,Math.max(0,o)):null,rotorTorque:l&&typeof d=="number"&&Number.isFinite(d)?d:null,parkingBrake:!!i.parkingBrake,gearDown:c(i.gearPosition,0)<.5,flapsTarget:c(i.flapsTarget,0),airbrakesPosition:Number.isFinite(i.airbrakesPosition)?Number(i.airbrakesPosition):void 0,glideslopeDeviation:i.NAVVNAV&&Number.isFinite(i.NAVGlideAngleDeviation)?Number(i.NAVGlideAngleDeviation):void 0,lightsOn:!!i.lights,lat:c(a[0],0),lon:c(a[1],0)})}};var de=class{constructor(e,t){this.sim=e;this.simMajor=t}listeners=new Set;rafId=null;lastTickMs=0;lastSnapshot=null;start(){if(this.rafId!==null)return;this.lastTickMs=performance.now();let e=t=>{let i=Math.max(.001,Math.min((t-this.lastTickMs)/1e3,.25));this.lastTickMs=t;let s=this.sim.buildTelemetrySnapshot(i,this.simMajor);this.lastSnapshot=s;for(let a of this.listeners)try{a(s)}catch(r){console.error("[GeoFS Extension] Telemetry subscriber error:",r)}this.rafId=requestAnimationFrame(e)};this.rafId=requestAnimationFrame(e)}stop(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null)}subscribe(e){return this.listeners.add(e),()=>{this.listeners.delete(e)}}getLatest(){return this.lastSnapshot}};var ce=class{ctx=null;muted=!1;ensureContext(){if(this.muted||typeof window>"u")return null;let e=window.AudioContext||window.webkitAudioContext;return e?(this.ctx||(this.ctx=new e),this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{}),this.ctx):null}setMuted(e){this.muted=e}playTone(e,t,i="sine",s=.08){let a=this.ensureContext();if(!a)return;let r=a.createOscillator(),l=a.createGain();r.type=i,r.frequency.setValueAtTime(e,a.currentTime),l.gain.setValueAtTime(1e-4,a.currentTime),l.gain.exponentialRampToValueAtTime(s,a.currentTime+.015),l.gain.exponentialRampToValueAtTime(1e-4,a.currentTime+t),r.connect(l),l.connect(a.destination),r.start(),r.stop(a.currentTime+t+.02)}playChime(){this.playTone(880,.14,"sine",.07),setTimeout(()=>this.playTone(1174.66,.2,"sine",.06),110)}playGpwsAlert(){this.playTone(440,.12,"square",.06),setTimeout(()=>this.playTone(620,.14,"square",.06),130)}playGpwsCallout(e){if(!this.muted)if(e==="PULL_UP")this.playGpwsAlert();else if(e==="RETARD")this.playTone(523.25,.1,"triangle",.06),setTimeout(()=>this.playTone(392,.14,"triangle",.06),110);else{let t={50:784,40:740,30:698,20:659,10:587};this.playTone(t[e],.09,"sine",.05)}}destroy(){this.ctx&&(this.ctx.close().catch(()=>{}),this.ctx=null)}};function Oe(){if(typeof navigator>"u")return"windows";let n=(navigator.platform||navigator.userAgent||"").toLowerCase();return n.includes("mac")?"mac":n.includes("linux")?"linux":"windows"}function De(n){return n?n.replace(/⌘/g,"Cmd+").replace(/⌃/g,"Ctrl+").replace(/⌥/g,"Alt+").replace(/⇧/g,"Shift+").split("+").map(e=>e.trim()).filter(Boolean).map((e,t,i)=>{if(t<i.length-1){let s=e.toLowerCase();if(s==="shift")return"Shift";if(s==="ctrl"||s==="control")return"Ctrl";if(s==="alt"||s==="option")return"Alt";if(s==="cmd"||s==="meta")return"Cmd"}return e.length===1?e.toUpperCase():e}).join("+"):""}function St(n){return n?n.startsWith("Key")&&n.length===4?n.slice(3).toLowerCase():n.startsWith("Digit")&&n.length===6?n.slice(5):n.toLowerCase():""}function Ie(n){let e=n.code||"";if(e==="ShiftLeft"||e==="ShiftRight"||e==="ControlLeft"||e==="ControlRight"||e==="AltLeft"||e==="AltRight"||e==="MetaLeft"||e==="MetaRight")return null;let t="";if(e.startsWith("Key")&&e.length===4?t=e.slice(3).toUpperCase():e.startsWith("Digit")&&e.length===6?t=e.slice(5):e?t=e:n.key&&(t=n.key.length===1?n.key.toUpperCase():n.key),!t)return null;let i=[];return n.metaKey&&i.push("Cmd"),n.ctrlKey&&i.push("Ctrl"),n.altKey&&i.push("Alt"),n.shiftKey&&i.push("Shift"),[...i,t].join("+")}function Et(n,e){let t=De(e);if(!t)return!1;let i=t.split("+").map(c=>c.trim().toLowerCase()),s=i[i.length-1],a=i.includes("shift"),r=i.includes("ctrl"),l=i.includes("alt"),o=i.includes("cmd")||i.includes("meta");return(n.code&&St(n.code)===s||typeof n.key=="string"&&n.key.toLowerCase()===s)&&n.shiftKey===a&&n.ctrlKey===r&&n.altKey===l&&n.metaKey===o}var ue=class{os=Oe();bindings=new Map;listening=!1;onKeyDown=e=>{if(e.repeat||e.defaultPrevented)return;let t=e.target;if(!(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable))){for(let i of this.bindings.values())if(Et(e,i.combo)){e.preventDefault(),i.handler();return}}};start(){this.listening||typeof window>"u"||(window.addEventListener("keydown",this.onKeyDown),this.listening=!0)}register(e,t,i){return this.bindings.set(e,{combo:t,handler:i}),()=>this.bindings.delete(e)}updateCombo(e,t){let i=this.bindings.get(e);i&&(i.combo=t)}destroy(){this.listening&&typeof window<"u"&&(window.removeEventListener("keydown",this.onKeyDown),this.listening=!1),this.bindings.clear()}};var Tt={PageUp:{key:"PageUp",code:"PageUp",keyCode:33},PageDown:{key:"PageDown",code:"PageDown",keyCode:34},End:{key:"End",code:"End",keyCode:35},Home:{key:"Home",code:"Home",keyCode:36},Insert:{key:"Insert",code:"Insert",keyCode:45},Delete:{key:"Delete",code:"Delete",keyCode:46},Numpad0:{key:"0",code:"Numpad0",keyCode:96,location:3},Numpad1:{key:"1",code:"Numpad1",keyCode:97,location:3},Numpad2:{key:"2",code:"Numpad2",keyCode:98,location:3},Numpad3:{key:"3",code:"Numpad3",keyCode:99,location:3},Numpad4:{key:"4",code:"Numpad4",keyCode:100,location:3},Numpad5:{key:"5",code:"Numpad5",keyCode:101,location:3},Numpad6:{key:"6",code:"Numpad6",keyCode:102,location:3},Numpad7:{key:"7",code:"Numpad7",keyCode:103,location:3},Numpad8:{key:"8",code:"Numpad8",keyCode:104,location:3},Numpad9:{key:"9",code:"Numpad9",keyCode:105,location:3}},At={"Alt+ArrowUp":"PageUp","Alt+ArrowDown":"PageDown","Alt+Backspace":"Delete","Alt+ArrowLeft":"Home","Alt+ArrowRight":"End","Alt+1":"Numpad1","Alt+2":"Numpad2","Alt+3":"Numpad3","Alt+4":"Numpad4","Alt+5":"Numpad5","Alt+6":"Numpad6","Alt+7":"Numpad7","Alt+8":"Numpad8","Alt+9":"Numpad9","Alt+0":"Numpad0"},Ct={};function Ft(n){return n==="auto"?Oe():n}function Mt(n,e,t={}){let s=Ft(n)==="mac"?e==="magic"?{...Ct}:{...At}:{};for(let[a,r]of Object.entries(t)){let l=De(a);l&&r?s[l]=r:l&&r===""&&delete s[l]}return s}var pe=class{enabled=!0;remaps={};listening=!1;activeTranslations=new Map;dispatchSynthetic(e,t,i=!1){if(typeof document>"u")return;let s={key:t.key,code:t.code,location:t.location??0,repeat:i,bubbles:!0,cancelable:!0,keyCode:t.keyCode,which:t.keyCode},a=new KeyboardEvent(e,s);document.dispatchEvent(a)}onKeyDown=e=>{if(!this.enabled||!e.isTrusted)return;let t=e.target;if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable))return;let i=Ie(e);if(!i)return;let s=this.remaps[i];if(!s)return;let a=Tt[s]??{key:s,code:s,keyCode:0};e.preventDefault(),e.stopImmediatePropagation();let r=e.code||i;this.activeTranslations.set(r,a),this.dispatchSynthetic("keydown",a,e.repeat)};onKeyUp=e=>{if(!e.isTrusted)return;let t=e.code||Ie(e)||"",i=this.activeTranslations.get(t);i&&(this.activeTranslations.delete(t),e.preventDefault(),e.stopImmediatePropagation(),this.dispatchSynthetic("keyup",i,!1))};updateConfig(e){this.enabled=e.enabled,this.remaps=Mt(e.osProfile,e.macKeyboardType,e.customRemaps),this.enabled||this.releaseAllActive()}releaseAllActive(){for(let e of this.activeTranslations.values())this.dispatchSynthetic("keyup",e,!1);this.activeTranslations.clear()}start(){this.listening||typeof window>"u"||(window.addEventListener("keydown",this.onKeyDown,{capture:!0}),window.addEventListener("keyup",this.onKeyUp,{capture:!0}),this.listening=!0)}destroy(){this.releaseAllActive(),this.listening&&typeof window<"u"&&(window.removeEventListener("keydown",this.onKeyDown,{capture:!0}),window.removeEventListener("keyup",this.onKeyUp,{capture:!0}),this.listening=!1)}};var Ye={"1080p":1,"1440p":1.1,"4k":1.35,ultrawide:1.08,laptop:.9},kt={"1080p":"1080p FHD","1440p":"1440p QHD","4k":"4K UHD",ultrawide:"Ultrawide",laptop:"Laptop"};function Lt(n=typeof window<"u"?window:void 0){let e=Math.max(0,Number(n?.screen?.width??n?.innerWidth??1920)||1920),t=Math.max(0,Number(n?.screen?.height??n?.innerHeight??1080)||1080),i=Math.max(1,Number(n?.devicePixelRatio??1)||1),s=Math.round(e*i),a=Math.round(t*i),r=t>0?e/t:16/9,l=!!n?.screen?.isExtended,o="1080p";r>=2.05?o="ultrawide":e>=3e3||s>=3600&&i<=1.5?o="4k":e>=2200||s>=2500&&i<=1.5?o="1440p":(e<1200||e<=1536&&i>=1.5)&&(o="laptop");let d=l||e>=1920&&i<=1.5||o==="ultrawide"||o==="4k",c=Ye[o],p=o==="laptop"?"Laptop":d?"External / Desktop":"Desktop";return{preset:o,scale:c,label:`${kt[o]} (${p})`,resolution:`${e}\xD7${t}${i>1?` @${Number(i.toFixed(2))}x`:""}`,dpr:i,isExternalLike:d}}function Xe(n){let e=Lt();return n==="auto"?{preset:e.preset,scale:e.scale,detected:e}:{preset:n,scale:Ye[n]??1,detected:e}}var he=["info","checks","fuel","land"],fe=class{styleEl=null;hudRoot=null;hudTabsEl=null;hudBodyEl=null;edgeHandleEl=null;minBtnEl=null;tabPanels=new Map;activeTabId=null;currentTheme="dark";currentPreset="auto";mountedControls=new Map;syncedAutopilotPads=new Map;dragCleanups=new Set;trackedElements=new Set;resizeObserver=null;resizeListener=null;hudMinimized=!1;hudHidden=!1;nextZIndex=2147483006;bringToFront(e){e&&(this.nextZIndex>=2147483500&&(this.nextZIndex=2147483010),e.style.zIndex=String(this.nextZIndex++))}init(){typeof document>"u"||(this.injectStyles(),this.setupViewportGuards(),this.ensureHud())}setTheme(e){this.currentTheme=e,typeof document<"u"&&document.documentElement.setAttribute("data-geofs-ext-theme",e)}setCalibratorPreset(e){this.currentPreset=e;let{scale:t}=Xe(e);typeof document<"u"&&document.documentElement.style.setProperty("--geofs-ext-scale",String(t))}mountControl(e,t,i){return this.unmountControl(e),i.dataset.geofsExtControl=e,this.resolveZoneHost(t).appendChild(i),this.mountedControls.set(e,i),()=>this.unmountControl(e)}unmountControl(e){let t=this.mountedControls.get(e);if(t){this.syncedAutopilotPads.delete(t);for(let[i,s]of this.syncedAutopilotPads)(s.wrapper===t||t.contains(i))&&this.syncedAutopilotPads.delete(i);t.remove(),this.mountedControls.delete(e)}}syncAutopilotPad(e,t,i=!1){if(typeof document>"u"||typeof window>"u"||!e.isConnected)return;let s=Date.now(),a=this.syncedAutopilotPads.get(e);if(!i&&a&&s-a.lastCheckMs<1e3)return;let l=(e.closest(".geofs-autopilot-bar")??document.querySelector(".geofs-autopilot-bar"))?.querySelector(".geofs-autopilot-pad:not(#autothrottle-button):not(#opEngineBarBtn)")??null;if(!l){this.syncedAutopilotPads.set(e,{wrapper:t,sig:"",lastCheckMs:s});return}let o=l.getBoundingClientRect();if(o.width<=0||o.height<=0){this.syncedAutopilotPads.set(e,{wrapper:t,sig:a?.sig??"",lastCheckMs:s});return}let d=getComputedStyle(l),c=l.querySelector(".control-pad-label")??l,p=getComputedStyle(c),u=x=>`${Number(x.toFixed(2))}px`,h=[["--geofs-ext-ap-width",u(o.width)],["--geofs-ext-ap-height",u(o.height)],["--geofs-ext-ap-radius",d.borderRadius||"15px"],["--geofs-ext-ap-margin",d.margin||"0 10px"],["--geofs-ext-ap-valign",d.verticalAlign||"middle"],["--geofs-ext-ap-font-family",p.fontFamily||"inherit"],["--geofs-ext-ap-font-size",p.fontSize||"12px"],["--geofs-ext-ap-font-weight",p.fontWeight||"400"],["--geofs-ext-ap-letter-spacing",p.letterSpacing||"normal"]],m=h.map(([,x])=>x).join("|");if(this.syncedAutopilotPads.set(e,{wrapper:t,sig:m,lastCheckMs:s}),a?.sig!==m){for(let[x,b]of h)e.style.setProperty(x,b);t&&t.style.setProperty("--geofs-ext-ap-valign",d.verticalAlign||"middle")}}registerHudTab(e,t,i,s=!1){return this.ensureHud(),this.tabPanels.set(e,{label:t,el:i}),this.renderTabs(),(s||!this.activeTabId)&&this.selectTab(e),this.clampAll(),()=>{if(this.tabPanels.delete(e),this.activeTabId===e){let a=this.orderedTabEntries();this.activeTabId=a[0]?.[0]??null}this.renderTabs(),this.activeTabId?this.selectTab(this.activeTabId):this.hudBodyEl&&(this.hudBodyEl.innerHTML="")}}openHudTab(e){this.ensureHud(),!(!this.hudRoot||!this.tabPanels.has(e))&&(this.hudHidden=!1,this.hudRoot.style.display="flex",this.hudMinimized&&this.setHudMinimized(!1),this.selectTab(e),this.bringToFront(this.hudRoot),this.syncEdgeHandle(),this.clampElementToViewport(this.hudRoot))}toggleHudVisibility(){if(this.ensureHud(),!this.hudRoot)return!1;let e=Number.parseFloat(this.hudRoot.style.left||""),t=this.hudMinimized&&Number.isFinite(e)&&e<=16;return this.hudHidden||t?(this.hudHidden=!1,this.setHudMinimized(!1),this.syncEdgeHandle(),this.bringToFront(this.hudRoot),this.clampElementToViewport(this.hudRoot),!0):(this.hudHidden=!0,this.syncEdgeHandle(),!1)}showToast(e,t="info"){if(typeof document>"u"||!document.body)return;let i=this.ensureToastRegion(),s=document.createElement("div");s.className=`geofs-ext-toast geofs-ext-toast--${t}`,s.textContent=e,i.appendChild(s),setTimeout(()=>{s.remove(),i&&!i.childElementCount&&i.remove()},t==="critical"?8500:4500)}showPromptBanner(e,t,i,s=2e4){if(typeof document>"u"||!document.body)return()=>{};let a=this.ensureToastRegion();a.querySelector(`[data-prompt-id="${e}"]`)?.remove();let l=document.createElement("div");l.className="geofs-ext-prompt",l.dataset.promptId=e,l.setAttribute("role","alertdialog");let o=document.createElement("div");o.className="geofs-ext-prompt-text",o.textContent=t;let d=document.createElement("div");d.className="geofs-ext-prompt-actions";let c,p=()=>{clearTimeout(c),l.remove(),a.childElementCount||a.remove()};for(let u of i){let h=document.createElement("button");h.type="button",h.dataset.actionId=u.id,h.className=`geofs-ext-prompt-btn geofs-ext-prompt-btn--${u.variant??"neutral"}`,h.textContent=u.label,h.addEventListener("click",m=>{m.stopPropagation(),p(),u.onClick()}),d.appendChild(h)}return l.append(o,d),a.appendChild(l),s>0&&(c=setTimeout(p,s)),p}ensureToastRegion(){let e=document.getElementById("geofs-ext-toasts");return e||(e=document.createElement("div"),e.id="geofs-ext-toasts",e.setAttribute("aria-live","polite"),document.body.appendChild(e)),e}resolveZoneHost(e){let t={top:[".geofs-ui-top","#geofs-ui-top"],bottom:[".geofs-ui-bottom"],autopilot:[".geofs-autopilot-bar"],right:[".geofs-ui-right",".geofs-radio-stack"],corner:[]};for(let a of t[e]){let r=document.querySelector(a);if(r)return r}let i=`geofs-ext-zone-${e}`,s=document.getElementById(i);return s||(s=document.createElement("div"),s.id=i,s.className=`geofs-ext-zone geofs-ext-zone--${e}`,document.body.appendChild(s)),s}clampElementToViewport(e){if(typeof window>"u"||!e.isConnected||e.classList.contains("addonpack-card")&&!e.classList.contains("active"))return;let t=e.style;if(t.display==="none")return;let i=e.getBoundingClientRect();if(i.width<=0&&i.height<=0)return;let s=Math.max(0,window.innerWidth-i.width),a=Math.max(0,window.innerHeight-i.height);if(t.left&&t.left!=="auto"){let r=Number.parseFloat(t.left);if(Number.isFinite(r)){let l=Math.max(0,Math.min(r,s));l!==r&&(t.left=`${Math.round(l)}px`)}}else i.left<0&&(t.left="0px",t.right="auto");if(t.top&&t.top!=="auto"){let r=Number.parseFloat(t.top);if(Number.isFinite(r)){let l=Math.max(0,Math.min(r,a));l!==r&&(t.top=`${Math.round(l)}px`)}}else i.top<0&&(t.top="0px",t.bottom="auto")}clampAll(){for(let e of this.trackedElements)this.clampElementToViewport(e)}setupViewportGuards(){typeof window>"u"||(typeof ResizeObserver<"u"&&!this.resizeObserver&&(this.resizeObserver=new ResizeObserver(e=>{for(let t of e)this.clampElementToViewport(t.target)})),this.resizeListener||(this.resizeListener=()=>{this.currentPreset==="auto"&&this.setCalibratorPreset("auto"),this.clampAll();for(let[e,t]of Array.from(this.syncedAutopilotPads.entries())){if(!e.isConnected){this.syncedAutopilotPads.delete(e);continue}this.syncAutopilotPad(e,t.wrapper,!0)}},window.addEventListener("resize",this.resizeListener),typeof window.screen<"u"&&"onchange"in window.screen&&window.screen.addEventListener?.("change",this.resizeListener)))}makeDraggable(e,t,i,s){if(typeof document>"u"||typeof window>"u")return()=>{};let a=s?.axis??"both",r=!1,l=!1,o=0,d=0,c=0,p=0,u=0,h=0;this.trackedElements.add(e),this.resizeObserver?.observe(e);try{let g=localStorage.getItem(t);if(g){let{left:w,top:f}=JSON.parse(g),v=w?Number.parseFloat(w):NaN,y=f?Number.parseFloat(f):NaN;a==="vertical"?Number.isFinite(y)&&(e.style.left="0px",e.style.top=`${Math.max(0,y)}px`,e.style.bottom="auto",e.style.right="auto",this.clampElementToViewport(e)):Number.isFinite(v)&&Number.isFinite(y)&&(e.style.left=`${Math.max(0,v)}px`,e.style.top=`${Math.max(0,y)}px`,e.style.bottom="auto",e.style.right="auto",e.style.transformOrigin="top left",this.clampElementToViewport(e))}}catch{}let m=i??e,x=m===e&&e.tagName==="BUTTON",b=g=>{if(g.button!==0)return;delete e.dataset.justDragged;let w=g.target;if(!w?.closest("input, a, select, textarea, label")){if(w?.closest("button")){let f=!!w.closest(".geofs-ext-hud-header");if(!e.classList.contains("is-minimized")&&!x&&!f)return}r=!0,l=!1,o=g.clientX,d=g.clientY}},E=g=>{if(!r)return;if(!l){if((a==="vertical"?Math.abs(g.clientY-d):Math.hypot(g.clientX-o,g.clientY-d))<4)return;l=!0,window.getSelection()?.removeAllRanges();let y=e.getBoundingClientRect();c=o-y.left,p=d-y.top,u=y.width||e.offsetWidth,h=y.height||e.offsetHeight,a==="vertical"?e.style.left="0px":(e.style.left=`${Math.round(y.left)}px`,e.style.transformOrigin="top left"),e.style.top=`${Math.round(y.top)}px`,e.style.bottom="auto",e.style.right="auto",e.classList.add("is-dragging"),document.documentElement.classList.add("geofs-ext-dragging")}let w=Math.max(0,window.innerHeight-h),f=Math.max(0,Math.min(g.clientY-p,w));if(a==="vertical")e.style.left="0px",e.style.top=`${Math.round(f)}px`;else{let v=Math.max(0,window.innerWidth-u),y=Math.max(0,Math.min(g.clientX-c,v));e.style.left=`${Math.round(y)}px`,e.style.top=`${Math.round(f)}px`}},T=()=>{if(r&&(r=!1,e.style.cursor="",e.classList.remove("is-dragging"),document.documentElement.classList.remove("geofs-ext-dragging"),l)){l=!1,e.dataset.justDragged="1",setTimeout(()=>{delete e.dataset.justDragged},0);try{let g=a==="vertical"?{top:e.style.top}:{left:e.style.left,top:e.style.top};localStorage.setItem(t,JSON.stringify(g))}catch{}e===this.hudRoot&&this.syncEdgeHandle()}},A=g=>{e.dataset.justDragged==="1"&&(g.preventDefault(),g.stopImmediatePropagation(),g.stopPropagation(),delete e.dataset.justDragged)},S=()=>{this.bringToFront(e)};m.addEventListener("mousedown",b),e.addEventListener("mousedown",S,!0),document.addEventListener("mousemove",E),document.addEventListener("mouseup",T),window.addEventListener("blur",T),e.addEventListener("click",A,!0);let C=()=>{r&&(r=!1,l=!1,e.style.cursor="",e.classList.remove("is-dragging"),document.documentElement.classList.remove("geofs-ext-dragging")),m.removeEventListener("mousedown",b),e.removeEventListener("mousedown",S,!0),document.removeEventListener("mousemove",E),document.removeEventListener("mouseup",T),window.removeEventListener("blur",T),e.removeEventListener("click",A,!0),this.resizeObserver?.unobserve(e),this.trackedElements.delete(e),this.dragCleanups.delete(C)};return this.dragCleanups.add(C),C}applyHudMinimizedState(e){if(!this.hudRoot||!this.hudTabsEl||!this.hudBodyEl||!this.minBtnEl)return;this.hudMinimized=e,this.hudRoot.classList.toggle("is-minimized",e),this.minBtnEl.textContent=e?"HUD":"\u2212";let t=e?"Restore HUD":"Minimize HUD";this.minBtnEl.setAttribute("aria-label",t),this.minBtnEl.dataset.hudTip=t,this.hudTabsEl.style.display=e?"none":"flex",this.hudBodyEl.style.display=e?"none":"block"}setHudMinimized(e){this.hudRoot&&(this.applyHudMinimizedState(e),this.syncEdgeHandle(),this.clampElementToViewport(this.hudRoot))}syncEdgeHandle(){if(!this.edgeHandleEl||!this.hudRoot)return;let e=Number.parseFloat(this.hudRoot.style.left||""),t=this.hudMinimized&&Number.isFinite(e)&&e<=16,i=this.hudHidden||t;if(this.edgeHandleEl.style.display=i?"flex":"none",this.hudRoot.style.display=i?"none":"flex",i){if(t&&this.hudRoot.style.top){this.edgeHandleEl.style.top=this.hudRoot.style.top,this.edgeHandleEl.style.bottom="auto";try{localStorage.setItem("geofs_ext_edge_tab_top",JSON.stringify({top:this.edgeHandleEl.style.top}))}catch{}}this.edgeHandleEl.style.left="0px",this.edgeHandleEl.style.right="auto",this.clampElementToViewport(this.edgeHandleEl)}}bindHudTip(e){let t=()=>{if(typeof window>"u")return;let i=e.getBoundingClientRect();e.dataset.tipV=i.bottom+32>window.innerHeight?"above":"below",i.right>window.innerWidth-110?e.dataset.tipH="right":i.left<110?e.dataset.tipH="left":e.dataset.tipH="center"};return e.addEventListener("mouseenter",t),e.addEventListener("focus",t),()=>{e.removeEventListener("mouseenter",t),e.removeEventListener("focus",t)}}setupEdgeTabInteraction(e){if(typeof document>"u"||typeof window>"u")return()=>{};let t=16,i=!1,s=!1,a=!1,r=0,l=0,o=0,d=0,c=40;this.trackedElements.add(e),this.resizeObserver?.observe(e);try{let b=localStorage.getItem("geofs_ext_edge_tab_top");if(b){let{top:E}=JSON.parse(b),T=E?Number.parseFloat(E):NaN;Number.isFinite(T)&&(e.style.left="0px",e.style.top=`${Math.max(0,T)}px`,e.style.bottom="auto",e.style.right="auto",this.clampElementToViewport(e))}}catch{}let p=b=>{if(b.button!==0)return;delete e.dataset.justDragged,i=!0,s=!1,a=!1,r=b.clientX,l=b.clientY;let E=e.getBoundingClientRect();o=b.clientX-E.left,d=b.clientY-E.top,c=E.height||e.offsetHeight||40},u=b=>{if(!i)return;if(!s){if(Math.hypot(b.clientX-r,b.clientY-l)<4)return;s=!0,window.getSelection()?.removeAllRanges(),e.classList.add("is-dragging"),document.documentElement.classList.add("geofs-ext-dragging")}let E=b.clientX-o,T=b.clientY-d;if(E>t&&this.hudRoot){a||(a=!0,this.hudHidden=!1,this.applyHudMinimizedState(!0),e.style.display="none",this.hudRoot.style.display="flex",this.hudRoot.style.right="auto",this.hudRoot.style.bottom="auto",this.hudRoot.style.transformOrigin="top left",this.hudRoot.classList.add("is-dragging"),this.bringToFront(this.hudRoot));let A=this.hudRoot.getBoundingClientRect(),S=A.width||40,C=A.height||40,g=Math.max(0,window.innerWidth-S),w=Math.max(0,window.innerHeight-C),f=Math.max(0,Math.min(E,g)),v=Math.max(0,Math.min(T,w));this.hudRoot.style.left=`${Math.round(f)}px`,this.hudRoot.style.top=`${Math.round(v)}px`}else{a&&this.hudRoot&&(a=!1,this.hudRoot.classList.remove("is-dragging"),this.hudRoot.style.display="none",e.style.display="flex");let A=Math.max(0,window.innerHeight-c),S=Math.max(0,Math.min(T,A));e.style.left="0px",e.style.right="auto",e.style.bottom="auto",e.style.top=`${Math.round(S)}px`}},h=()=>{if(i&&(i=!1,e.classList.remove("is-dragging"),this.hudRoot?.classList.remove("is-dragging"),document.documentElement.classList.remove("geofs-ext-dragging"),s))if(s=!1,e.dataset.justDragged="1",setTimeout(()=>{delete e.dataset.justDragged},0),a&&this.hudRoot){this.hudRoot.dataset.justDragged="1",setTimeout(()=>{this.hudRoot&&delete this.hudRoot.dataset.justDragged},0);try{localStorage.setItem("geofs_ext_hud_pos",JSON.stringify({left:this.hudRoot.style.left,top:this.hudRoot.style.top}))}catch{}}else{try{localStorage.setItem("geofs_ext_edge_tab_top",JSON.stringify({top:e.style.top}))}catch{}this.hudRoot&&(this.hudRoot.style.top=e.style.top)}},m=b=>{e.dataset.justDragged==="1"&&(b.preventDefault(),b.stopImmediatePropagation(),b.stopPropagation(),delete e.dataset.justDragged)};e.addEventListener("mousedown",p),document.addEventListener("mousemove",u),document.addEventListener("mouseup",h),window.addEventListener("blur",h),e.addEventListener("click",m,!0);let x=()=>{i&&(i=!1,s=!1,a=!1,e.classList.remove("is-dragging"),this.hudRoot?.classList.remove("is-dragging"),document.documentElement.classList.remove("geofs-ext-dragging")),e.removeEventListener("mousedown",p),document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",h),window.removeEventListener("blur",h),e.removeEventListener("click",m,!0),this.resizeObserver?.unobserve(e),this.trackedElements.delete(e),this.dragCleanups.delete(x)};return this.dragCleanups.add(x),x}ensureHud(){if(typeof document>"u"||this.hudRoot||!document.body)return;let e=document.getElementById("flightDataDisplay");e&&!e.classList.contains("geofs-ext-hud")&&e.remove();let t=document.getElementById("hudMinimizeBtn");t&&!t.classList.contains("unified-hud-edge-tab")&&t.remove();let i=document.createElement("div");i.id="flightDataDisplay",i.className="geofs-ext-hud";let s=document.createElement("div");s.className="geofs-ext-hud-header";let a=document.createElement("span");a.className="geofs-ext-hud-grip",a.dataset.hudTip="Drag HUD",a.setAttribute("aria-label","Drag HUD"),a.innerHTML='<svg width="6" height="12" viewBox="0 0 6 12" aria-hidden="true" focusable="false"><circle cx="1.5" cy="2" r="1"/><circle cx="4.5" cy="2" r="1"/><circle cx="1.5" cy="6" r="1"/><circle cx="4.5" cy="6" r="1"/><circle cx="1.5" cy="10" r="1"/><circle cx="4.5" cy="10" r="1"/></svg>';let r=document.createElement("div");r.id="hud-unified-tabs",r.className="unified-tabs";let l=document.createElement("button");l.type="button",l.className="geofs-ext-hud-min",l.dataset.hudTip="Minimize HUD",l.setAttribute("aria-label","Minimize HUD"),l.textContent="\u2212",l.addEventListener("click",c=>{c.stopPropagation(),i.dataset.justDragged!=="1"&&this.setHudMinimized(!this.hudMinimized)}),s.append(a,r,l);let o=document.createElement("div");o.className="geofs-ext-hud-body",i.append(s,o),document.body.appendChild(i);let d=document.createElement("button");d.id="hudMinimizeBtn",d.type="button",d.className="unified-hud-edge-tab",d.dataset.hudTip="Click to expand \xB7 Drag out for HUD circle",d.setAttribute("aria-label","Expand or drag Flight HUD"),d.textContent="\u25B8",d.style.display="none",d.addEventListener("click",()=>{d.dataset.justDragged!=="1"&&(d.style.top&&(i.style.top=d.style.top),this.hudHidden=!1,this.setHudMinimized(!1))}),document.body.appendChild(d),this.hudRoot=i,this.hudTabsEl=r,this.hudBodyEl=o,this.minBtnEl=l,this.edgeHandleEl=d,this.makeDraggable(i,"geofs_ext_hud_pos"),this.setupEdgeTabInteraction(d),this.dragCleanups.add(this.bindHudTip(a)),this.dragCleanups.add(this.bindHudTip(l)),this.clampElementToViewport(i),this.syncEdgeHandle()}orderedTabEntries(){let e=Array.from(this.tabPanels.entries());return e.sort(([t],[i])=>{let s=he.indexOf(t),a=he.indexOf(i),r=s>=0?s:he.length,l=a>=0?a:he.length;return r-l}),e}renderTabs(){if(!this.hudTabsEl)return;this.hudTabsEl.innerHTML="";let e=this.orderedTabEntries();for(let[t,{label:i}]of e){let s=document.createElement("button");s.type="button",s.id=`tab-btn-${t}`,s.className=`unified-tab ${this.activeTabId===t?"active is-active":""}`,s.textContent=i,s.setAttribute("aria-label",i),s.addEventListener("click",a=>{a.stopPropagation(),this.selectTab(t)}),this.hudTabsEl.appendChild(s)}}selectTab(e){let t=this.tabPanels.get(e);!t||!this.hudBodyEl||(this.activeTabId=e,this.hudBodyEl.innerHTML="",this.hudBodyEl.appendChild(t.el),this.renderTabs(),this.hudRoot&&this.clampElementToViewport(this.hudRoot))}injectStyles(){if(this.styleEl||typeof document>"u")return;let e=document.createElement("style");e.id="geofs-ext-styles",e.textContent=`
      :root {
        --geofs-ext-scale: 1;
        --geofs-ext-bg: rgba(0, 0, 0, 0.8);
        --geofs-ext-fg: #ffffff;
        --geofs-ext-muted: rgba(255, 255, 255, 0.65);
        --geofs-ext-border: #888888;
        --geofs-ext-accent: #4caf50;
      }
      :root[data-geofs-ext-theme="light"] {
        --geofs-ext-bg: rgba(248, 250, 252, 0.92);
        --geofs-ext-fg: #0f172a;
        --geofs-ext-muted: #475569;
        --geofs-ext-border: #64748b;
        --geofs-ext-accent: #16a34a;
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
        gap: 3px;
        flex: 1;
        min-width: 0;
        margin: 0;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab {
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
        font-size: 9.5px;
        font-weight: 700;
        text-transform: uppercase;
        cursor: grab;
        text-align: center;
        line-height: 1.2;
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
    `,document.head?.appendChild(e),this.styleEl=e}destroy(){for(let e of Array.from(this.dragCleanups))e();for(let e of this.mountedControls.values())e.remove();this.mountedControls.clear(),this.syncedAutopilotPads.clear(),this.trackedElements.clear(),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.resizeListener&&typeof window<"u"&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null),this.hudRoot?.remove(),this.hudRoot=null,this.edgeHandleEl?.remove(),this.edgeHandleEl=null,document.getElementById("geofs-ext-toasts")?.remove();for(let e of["top","bottom","right","corner","autopilot"])document.getElementById(`geofs-ext-zone-${e}`)?.remove();this.styleEl?.remove(),this.styleEl=null}};var ge=class{constructor(e,t){this.simMajor=e;this.baseContext=t}registry=new Map;active=new Set;eventBus=new Map;settingsUpdate=Promise.resolve();reportedUnsupported=new Set;register(e){this.registry.set(e.id,e)}getModules(){return Array.from(this.registry.values())}isActive(e){return this.active.has(e)}applySettings(e){let t=this.settingsUpdate.then(()=>this.reconcileSettings(e));return this.settingsUpdate=t.catch(i=>{this.baseContext.emitDiag?.("MODULE_SETTINGS_ERROR",{level:"error",error:String(i)})}),t}async reconcileSettings(e){for(let[t,i]of this.registry){let s=i.supportedMajors.includes(this.simMajor),a=e.modules[t]??i.defaultEnabled;!s&&a&&!this.reportedUnsupported.has(t)&&(this.reportedUnsupported.add(t),this.baseContext.emitDiag?.("MODULE_UNSUPPORTED_ERROR",{level:"error",moduleId:t,simMajor:this.simMajor}));let r=s&&a;if(r&&!this.active.has(t))await this.enable(t);else if(!r&&this.active.has(t))await this.disable(t);else if(r&&this.active.has(t))try{i.onSettingsChange?.(e)}catch(l){this.baseContext.emitDiag?.("MODULE_SETTINGS_ERROR",{level:"error",moduleId:t,error:String(l)})}}}async enable(e){let t=this.registry.get(e);if(!t||this.active.has(e)||!t.supportedMajors.includes(this.simMajor))return;let i={...this.baseContext,simMajor:this.simMajor,emitEvent:(s,a)=>this.emit(s,a),onEvent:(s,a)=>this.on(s,a)};try{await t.init(i),this.active.add(e)}catch(s){this.baseContext.emitDiag?.("MODULE_INIT_ERROR",{level:"error",moduleId:e,error:String(s)})}}async disable(e){let t=this.registry.get(e);if(!(!t||!this.active.has(e)))try{await t.destroy()}catch(i){this.baseContext.emitDiag?.("MODULE_DESTROY_ERROR",{level:"error",moduleId:e,error:String(i)})}finally{this.active.delete(e)}}dispatchTelemetry(e){for(let t of this.active){let i=this.registry.get(t);if(i?.update)try{i.update(e)}catch(s){this.baseContext.emitDiag?.("MODULE_UPDATE_ERROR",{level:"error",moduleId:t,error:String(s)})}}}async destroyAll(){for(let e of Array.from(this.active))await this.disable(e);this.eventBus.clear()}emit(e,t){let i=this.eventBus.get(e);if(i)for(let s of i)try{s(t)}catch(a){console.error(`[GeoFS Extension] Event handler error (${e}):`,a)}}on(e,t){let i=this.eventBus.get(e);return i||(i=new Set,this.eventBus.set(e,i)),i.add(t),()=>i?.delete(t)}};function te(n){return`
  :where(${n}) {
    background-color: #000000;
    border: 1px solid #888888;
    box-shadow: 0 0 5px #000000;
  }
  ${n} {
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
  ${n}:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: #ffffff;
  }
  ${n}:hover .control-pad-label,
  :where(${n}.is-open .control-pad-label) {
    color: #ffffff;
  }
  ${n}.is-open {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: #ffffff;
  }
  ${n} .control-pad-label {
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
  :where(${n} .control-pad-label) {
    color: rgba(255, 255, 255, 0.78);
  }
  :where(${n}.green-pad .control-pad-label),
  :where(${n}.amber-pad .control-pad-label),
  :where(${n}.red-pad .control-pad-label) {
    color: #ffffff;
  }
  ${n}.green-pad {
    background-color: rgba(46, 125, 50, 0.38) !important;
    border-color: #4caf50 !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5) !important;
  }
  ${n}.green-pad:hover {
    background-color: rgba(56, 142, 60, 0.52) !important;
  }
  ${n}.amber-pad {
    background-color: rgba(245, 158, 11, 0.22) !important;
    border-color: #fbbf24 !important;
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.38) !important;
  }
  ${n}.red-pad {
    background-color: rgba(220, 38, 38, 0.28) !important;
  }
  `}var Z=Math.PI/180,Rt=180/Math.PI;function L(n,e,t){return Math.max(e,Math.min(t,n))}function V(n){if(!Number.isFinite(n))return 0;let e=n%360;return e<0?e+360:e}function ie(n,e){let t=V(n)-V(e);return t>180&&(t-=360),t<-180&&(t+=360),t}function Ze(n){let e=Math.max(0,n);if(e<=36089){let i=1-68756e-10*e;return Math.pow(Math.max(.1,i),4.25588)}return .297076*Math.exp(-(e-36089)/20806)}function Je(n){let e=Math.max(0,n),t=e<=36089?288.15-.0019812*e:216.65;return 661.4786*Math.sqrt(Math.max(.5,t/288.15))}function Ge(n,e){let t=Math.max(.04,Ze(e));return n/Math.sqrt(t)}function Pt(n,e){let t=Math.max(.04,Ze(e));return n*Math.sqrt(t)}function Nt(n,e){return Ge(n,e)/Je(e)}function He(n,e){let t=n*Je(e);return Pt(t,e)}function me(n,e){let t=L(n,100,600),i=L(e,.3,2.5),s=0,a=6e4;for(let r=0;r<20;r++){let l=(s+a)*.5;Nt(t,l)<i?s=l:a=l}return Math.round((s+a)*.5)}function be(n,e,t,i){let s=n*Z,a=t*Z,r=(i-e)*Z,l=Math.sin(r)*Math.cos(a),o=Math.cos(s)*Math.sin(a)-Math.sin(s)*Math.cos(a)*Math.cos(r);return V(Math.atan2(l,o)*Rt)}function Be(n,e,t,i){let s=n*Z,a=t*Z,r=(t-n)*Z,l=(i-e)*Z,o=Math.sin(r*.5)*Math.sin(r*.5)+Math.cos(s)*Math.cos(a)*Math.sin(l*.5)*Math.sin(l*.5);return 3440.065*(2*Math.atan2(Math.sqrt(o),Math.sqrt(Math.max(0,1-o))))}var J=class{constructor(e,t,i,s,a,r=50){this.kp=e;this.ki=t;this.kd=i;this.minOut=s;this.maxOut=a;this.maxIntegral=r}integral=0;prevError=0;hasPrev=!1;reset(){this.integral=0,this.prevError=0,this.hasPrev=!1}step(e,t){let i=L(t,.005,.5);this.integral=L(this.integral+e*i,-this.maxIntegral,this.maxIntegral);let s=this.hasPrev?(e-this.prevError)/i:0;this.prevError=e,this.hasPrev=!0;let a=this.kp*e+this.ki*this.integral+this.kd*s;return L(a,this.minOut,this.maxOut)}};function Qe(n,e,t,i,s){let a=Be(e,t,n.fixLat,n.fixLon),r=be(e,t,n.fixLat,n.fixLon),l=V(n.inboundCourseDeg),o=V(l+180),d=L(n.legMinutes,.5,5)*60;if(n.phase==="inbound"){n.legElapsedSec+=s,a<.6&&n.legElapsedSec>10&&(n.phase="turn-outbound",n.legElapsedSec=0);let p=L(ie(r,l)*1.4,-30,30);return{targetHeadingDeg:V(r+p*.25),distToFixNm:a,bearingToFixDeg:r}}return n.phase==="turn-outbound"?(n.legElapsedSec+=s,(Math.abs(ie(o,i))<12||n.legElapsedSec>70)&&(n.phase="outbound",n.legElapsedSec=0),{targetHeadingDeg:o,distToFixNm:a,bearingToFixDeg:r}):n.phase==="outbound"?(n.legElapsedSec+=s,n.legElapsedSec>=d&&(n.phase="turn-inbound",n.legElapsedSec=0),{targetHeadingDeg:o,distToFixNm:a,bearingToFixDeg:r}):(n.legElapsedSec+=s,(Math.abs(ie(l,i))<15||n.legElapsedSec>70)&&(n.phase="inbound",n.legElapsedSec=0),{targetHeadingDeg:l,distToFixNm:a,bearingToFixDeg:r})}var Ot=`
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
  ${te("#ap-pp-button.ext-ap-pp-pad")}
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
`,ve=class{id="autopilot-pp";name="AP++ (Beta)";description="Unified Autopilot++ flight management: VNAV/FLCH, Mach crossover, racetrack HOLD, LAT/LON, Autoland & Envelope Protection.";supportedMajors=[3,4];defaultEnabled=!1;ctx=null;barEl=null;padEl=null;fmaLineEl=null;unmounts=[];engaged=!1;speedMode="kts";lateralMode="hdg";verticalMode="alt";targetKias=250;targetMach=.78;targetAltFt=1e4;targetHdgDeg=0;targetVsFpm=0;autoVs=!0;targetLat=0;targetLon=0;waypointName="CUSTOM";landingArmed=!1;landingRetarded=!1;envelopeProtection=!0;holdConfig={fixLat:0,fixLon:0,inboundCourseDeg:0,legMinutes:1,turnDir:"R",phase:"inbound",legElapsedSec:0};fma={thr:"OFF",vert:"OFF",lat:"OFF",protection:null};lastTelemetry=null;lastEmitMs=0;stickOverrideSec=0;activeFailures=new Set;rollPid=new J(.032,.001,.015,-.8,.8,10);pitchPid=new J(.038,.004,.018,-.8,.8,12);speedPitchPid=new J(.18,.012,.04,-12,16,20);throttlePid=new J(.015,.003,.004,0,1,30);init(e){if(this.ctx=e,typeof document<"u"){let t=document.createElement("style");t.id="geofs-ext-ap-pp-styles",t.textContent=Ot,document.head?.append(t),this.unmounts.push(()=>t.remove());let i=document.createElement("div");i.className="ext-ap-pp-bar",i.innerHTML=`
      <div class="control-pad ext-ap-pp-pad" id="ap-pp-button"
           role="button" tabindex="0" aria-pressed="false"
           title="AP++ (Beta): Toggle master autopilot & open Side Panel">
        <div class="control-pad-label transp-pad ext-ap-pp-label">
          <span class="ext-ap-pp-title-row">AP++ <span class="ext-ap-pp-beta">BETA</span></span>
          <span class="ext-ap-pp-fma">STBY</span>
        </div>
      </div>
    `;let s=i.querySelector("#ap-pp-button");this.fmaLineEl=i.querySelector(".ext-ap-pp-fma"),s.addEventListener("click",a=>{a.stopPropagation(),this.toggleMaster(),window.postMessage({type:"GEOFS_EXT_OPEN_SIDEPANEL"},"*")}),s.addEventListener("keydown",a=>{a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),a.repeat||s.click())}),this.barEl=i,this.padEl=s,this.unmounts.push(e.anchors.mountControl("autopilot-pp-pad","autopilot",i)),e.anchors.syncAutopilotPad(s,i,!0)}if(typeof window<"u"){let t=i=>{if(i.source!==window||!i.data||typeof i.data!="object")return;let s=i.data;s.type==="GEOFS_EXT_AP_PP_COMMAND"&&s.command&&this.handleCommand(s.command)};window.addEventListener("message",t),this.unmounts.push(()=>window.removeEventListener("message",t))}this.unmounts.push(e.onEvent("failure:triggered",({type:t})=>{t&&(this.activeFailures.add(t),t==="electrical"&&this.engaged?this.disengage("ELEC FAIL"):t==="pitot"&&this.engaged&&(this.verticalMode==="flch"||this.verticalMode==="vnav")&&(this.verticalMode="alt"),this.emitSnapshot(!0))})),this.unmounts.push(e.onEvent("failure:cleared",({type:t})=>{t&&(this.activeFailures.delete(t),this.emitSnapshot(!0))})),e.emitEvent("failure:request-active"),this.renderPad(),this.emitSnapshot(!0)}update(e){if(this.lastTelemetry=e,this.padEl&&this.barEl&&this.ctx?.anchors.syncAutopilotPad(this.padEl,this.barEl),e.paused||e.crashed)return;let t=L(e.dt||.05,.01,.25);if(this.engaged&&this.checkStickOverride(t)){this.disengage("STICK DISC"),this.fma.protection="STICK DISC",this.ctx?.anchors.showToast("AP++ Disconnected: Manual Stick Input"),this.emitSnapshot(!0);return}if(!this.engaged){this.fma.protection&&this.fma.protection!=="STICK DISC"&&(this.fma.protection=null),e.timestamp-this.lastEmitMs>=400&&this.emitSnapshot(!1);return}if(this.activeFailures.has("electrical")){this.disengage("ELEC FAIL");return}let i=this.envelopeProtection?this.evaluateEnvelope(e):null;this.fma.protection=i,this.stepThrottleChannel(e,t,i),this.stepLateralChannel(e,t),this.stepVerticalChannel(e,t,i),this.updateFmaLabels(),this.renderPad(),e.timestamp-this.lastEmitMs>=250&&this.emitSnapshot(!1)}onSettingsChange(e){this.renderPad()}destroy(){this.engaged&&this.disengage();for(let e of this.unmounts)e();this.unmounts=[],this.barEl=null,this.padEl=null,this.fmaLineEl=null,this.ctx=null}handleCommand(e){switch(e.type){case"engage":this.engage();break;case"disengage":this.disengage();break;case"toggle":this.toggleMaster();break;case"setSpeed":Number.isFinite(e.value)&&e.value>0&&(this.speedMode==="mach"?this.targetMach=L(e.value,.2,3):this.targetKias=L(Math.round(e.value),40,999));break;case"setSpeedMode":this.speedMode=e.mode;break;case"setHeading":this.targetHdgDeg=V(e.deg),window.geofs?.autopilot?.values&&(window.geofs.autopilot.values.course=this.targetHdgDeg);break;case"setLateralMode":this.lateralMode=e.mode,e.mode==="hold"&&this.lastTelemetry&&this.initHoldAtCurrent(this.lastTelemetry),this.rollPid.reset();break;case"setAltitude":Number.isFinite(e.feet)&&(this.targetAltFt=L(Math.round(e.feet),0,8e4),window.geofs?.autopilot?.values&&(window.geofs.autopilot.values.altitude=this.targetAltFt));break;case"setVs":e.fpm===null?this.autoVs=!0:Number.isFinite(e.fpm)&&(this.autoVs=!1,this.targetVsFpm=L(Math.round(e.fpm),-6e3,6e3));break;case"setVerticalMode":this.verticalMode=e.mode,this.pitchPid.reset(),this.speedPitchPid.reset();break;case"setLatLon":Number.isFinite(e.lat)&&Number.isFinite(e.lon)&&(this.targetLat=L(e.lat,-90,90),this.targetLon=L(e.lon,-180,180),this.waypointName=e.name?.trim()||"LAT/LON",this.lateralMode="latlon");break;case"holdHere":{this.lastTelemetry?this.initHoldAtCurrent(this.lastTelemetry,e.legMinutes,e.turnDir):(e.legMinutes&&(this.holdConfig.legMinutes=L(e.legMinutes,.5,5)),e.turnDir&&(this.holdConfig.turnDir=e.turnDir)),this.lateralMode="hold",this.engaged||this.engage();break}case"setHoldConfig":e.legMinutes&&Number.isFinite(e.legMinutes)&&(this.holdConfig.legMinutes=L(e.legMinutes,.5,5)),e.turnDir&&(this.holdConfig.turnDir=e.turnDir);break;case"holdPresent":this.lastTelemetry&&((e.axis==="alt"||e.axis==="all")&&(this.targetAltFt=Math.round(this.lastTelemetry.altitude/50)*50,this.verticalMode="alt"),(e.axis==="hdg"||e.axis==="all")&&(this.targetHdgDeg=Math.round(V(this.lastTelemetry.heading)),this.lateralMode="hdg"),(e.axis==="spd"||e.axis==="all")&&(this.targetKias=Math.max(60,Math.round(this.lastTelemetry.kias)),this.speedMode="kts")),this.engaged||this.engage();break;case"setLandingArm":this.landingArmed=e.armed,e.armed||(this.landingRetarded=!1);break;case"setEnvelopeProtection":this.envelopeProtection=e.enabled,e.enabled||(this.fma.protection=null);break}this.updateFmaLabels(),this.renderPad(),this.emitSnapshot(!0)}toggleMaster(){this.engaged?this.disengage():this.engage()}engage(){if(this.activeFailures.has("electrical")){this.ctx?.anchors.showToast("AP++ Unavailable: Electrical Failure");return}this.engaged=!0,this.stickOverrideSec=0,this.fma.protection=null,this.rollPid.reset(),this.pitchPid.reset(),this.speedPitchPid.reset(),this.throttlePid.reset(),this.lastTelemetry&&(this.targetAltFt<=0&&(this.targetAltFt=Math.max(500,Math.round(this.lastTelemetry.altitude/100)*100)),this.lateralMode==="hdg"&&this.targetHdgDeg===0&&(this.targetHdgDeg=Math.round(V(this.lastTelemetry.heading))),this.targetKias<=0&&(this.targetKias=Math.max(120,Math.round(this.lastTelemetry.kias)))),this.ctx?.emitDiag?.("AP_PP_ENGAGED",{lat:this.lateralMode,vert:this.verticalMode,spd:this.speedMode}),this.updateFmaLabels(),this.renderPad(),this.emitSnapshot(!0)}disengage(e){this.engaged=!1,this.landingRetarded=!1;try{window.geofs?.autopilot?.turnOff?.()}catch{}this.ctx?.emitDiag?.("AP_PP_DISENGAGED",{reason:e??"manual"}),this.updateFmaLabels(),this.renderPad(),this.emitSnapshot(!0)}initHoldAtCurrent(e,t,i){this.holdConfig={fixLat:e.lat,fixLon:e.lon,inboundCourseDeg:Math.round(V(e.heading)),legMinutes:t?L(t,.5,5):this.holdConfig.legMinutes,turnDir:i??this.holdConfig.turnDir,phase:"outbound",legElapsedSec:0}}checkStickOverride(e){let t=window.controls;if(!t)return!1;let i=Math.abs(Number(t.rawRoll??0)),s=Math.abs(Number(t.rawPitch??0));return Math.max(i,s)>.25?(this.stickOverrideSec+=e,this.stickOverrideSec>=.3):(this.stickOverrideSec=0,!1)}evaluateEnvelope(e){if(e.groundContact)return null;let t=e.aircraft?.vSpeeds?.Vne??380,i=e.aircraft?.machSpeeds?.Vne??.92;return e.aoa>14.5||e.aglFeet>100&&e.kias<85&&e.aircraft?.category!=="rotorcraft"?"ALPHA FLOOR":e.kias>t*.98||e.mach>i*.99?"OVERSPEED":Math.abs(e.roll)>33?"BANK LIMIT":null}stepThrottleChannel(e,t,i){if(this.activeFailures.has("pitot"))return;if(i==="ALPHA FLOOR"){this.ctx?.sim.setThrottle(1);return}if(i==="OVERSPEED"){this.ctx?.sim.setThrottle(.05);return}if(this.landingArmed&&!this.landingRetarded&&e.aglFeet<=27&&!e.groundContact){this.landingRetarded=!0,this.verticalMode="flare",this.ctx?.sim.setThrottle(0);return}if(this.landingRetarded){this.ctx?.sim.setThrottle(0),e.groundContact&&window.controls?.airbrakes&&(window.controls.airbrakes.positionTarget=1);return}if(this.verticalMode==="flch"||this.verticalMode==="vnav"){let o=this.targetAltFt-e.altitude;if(Math.abs(o)>350){this.ctx?.sim.setThrottle(o>0?.92:.04);return}}if(this.speedMode==="off")return;let s=me(this.targetKias,this.targetMach),r=(this.speedMode==="mach"||this.verticalMode==="vnav"&&e.altitude>=s?He(this.targetMach,e.altitude):this.targetKias)-e.kias,l=this.throttlePid.step(r,t);this.ctx?.sim.setThrottle(L(l,0,1))}stepLateralChannel(e,t){let i=this.activeFailures.has("hydraulics")||this.activeFailures.has("controls"),s=this.lateralMode==="hold"&&e.kias<180||i?15:25;if(this.lateralMode==="off")return;if(this.lateralMode==="hdg"&&window.geofs?.autopilot&&Math.abs(e.roll)<=30){let c=window.geofs.autopilot;c.values&&(c.values.course=this.targetHdgDeg);return}let a=this.targetHdgDeg;this.lateralMode==="hold"?a=Qe(this.holdConfig,e.lat,e.lon,e.heading,t).targetHeadingDeg:(this.lateralMode==="latlon"||this.lateralMode==="wpt")&&(a=be(e.lat,e.lon,this.targetLat,this.targetLon));let r=ie(a,e.heading),o=L(r*.9,-s,s)-e.roll,d=this.rollPid.step(o,t)*(i?.5:1);window.controls&&(window.controls.roll=L(d,-.7,.7))}stepVerticalChannel(e,t,i){let s=window.controls;if(!s)return;if(i==="ALPHA FLOOR"){let d=this.pitchPid.step(-2-e.pitch,t);s.pitch=L(d,-.6,.6);return}if(i==="OVERSPEED"){let d=this.pitchPid.step(6-e.pitch,t);s.pitch=L(d,-.6,.6);return}if(this.verticalMode==="off")return;if(this.verticalMode==="flare"){let d=e.groundContact?0:3.5;s.pitch=L(this.pitchPid.step(d-e.pitch,t),-.4,.5);return}if(this.verticalMode==="alt"&&window.geofs?.autopilot?.values){window.geofs.autopilot.values.altitude=this.targetAltFt;return}let a=this.targetAltFt-e.altitude;if((this.verticalMode==="flch"||this.verticalMode==="vnav")&&Math.abs(a)>350){let d=me(this.targetKias,this.targetMach),c=this.speedMode==="mach"||e.altitude>=d?He(this.targetMach,e.altitude):this.targetKias,p=e.kias-c,u=a>0?7.5:-4.5,h=L(u+this.speedPitchPid.step(p,t),-14,18);s.pitch=L(this.pitchPid.step(h-e.pitch,t),-.6,.6);return}let r=this.targetVsFpm;this.verticalMode==="gs"&&Number.isFinite(e.glideslopeDeviation)?r=L(-700+Number(e.glideslopeDeviation)*250,-1800,500):(this.autoVs||this.verticalMode==="flch"||this.verticalMode==="vnav")&&(r=L(a*2.5,-2400,2400));let l=r-e.vs,o=L(e.pitch+l*.0035,-12,16);s.pitch=L(this.pitchPid.step(o-e.pitch,t),-.6,.6)}updateFmaLabels(){if(!this.engaged){this.fma={thr:"OFF",vert:"OFF",lat:"OFF",protection:this.fma.protection};return}let e=this.landingRetarded?"IDLE":this.fma.protection==="ALPHA FLOOR"?"TOGA":this.verticalMode==="flch"||this.verticalMode==="vnav"?this.targetAltFt>(this.lastTelemetry?.altitude??0)?"THR CLB":"THR IDLE":this.speedMode==="mach"?"MACH":this.speedMode==="kts"?"SPD":"MAN",t=this.verticalMode==="off"?"OFF":this.verticalMode==="flare"?"FLARE":this.verticalMode==="flch"?"FLCH":this.verticalMode==="vnav"?"VNAV":this.verticalMode==="gs"?"G/S":this.verticalMode==="vs"?this.autoVs?"V/S AUTO":"V/S":"ALT",i=this.lateralMode==="off"?"OFF":this.lateralMode==="hold"?`HOLD ${this.holdConfig.phase==="inbound"?"IN":this.holdConfig.phase==="outbound"?"OUT":"TRN"}`:this.lateralMode==="latlon"?"LAT/LON":this.lateralMode==="wpt"?"WPT":this.lateralMode==="loc"?"LOC":"HDG";this.fma={thr:e,vert:t,lat:i,protection:this.fma.protection}}renderPad(){this.padEl&&(this.padEl.classList.toggle("pad-active",this.engaged),this.padEl.setAttribute("aria-pressed",String(this.engaged)),this.fmaLineEl&&(this.fmaLineEl.textContent=this.engaged?`${this.fma.thr}\xB7${this.fma.lat}`:"STBY"))}getSnapshot(){let e=this.lastTelemetry,t=e?Math.round(Ge(e.kias,e.altitude)):0,i=me(this.targetKias,this.targetMach),s=null,a=null;if(e&&(this.lateralMode==="hold"||this.lateralMode==="latlon"||this.lateralMode==="wpt")){let l=this.lateralMode==="hold"?this.holdConfig.fixLat:this.targetLat,o=this.lateralMode==="hold"?this.holdConfig.fixLon:this.targetLon;s=Number(Be(e.lat,e.lon,l,o).toFixed(1)),a=Math.round(be(e.lat,e.lon,l,o))}let r=this.activeFailures.has("electrical")?"Electrical Failure":this.activeFailures.has("pitot")?"Pitot-Static Failure":this.activeFailures.has("hydraulics")?"Hydraulic Degradation":null;return{engaged:this.engaged,beta:!0,speedMode:this.speedMode,lateralMode:this.lateralMode,verticalMode:this.verticalMode,targetKias:this.targetKias,targetMach:Number(this.targetMach.toFixed(2)),targetAltFt:this.targetAltFt,targetHdgDeg:this.targetHdgDeg,targetVsFpm:this.targetVsFpm,autoVs:this.autoVs,targetLat:this.targetLat,targetLon:this.targetLon,waypointName:this.waypointName,landingArmed:this.landingArmed,landingRetarded:this.landingRetarded,envelopeProtection:this.envelopeProtection,ktas:t,crossoverAltFt:i,distanceToFixNm:s,bearingToFixDeg:a,holdConfig:{...this.holdConfig},fma:{...this.fma},degradedReason:r}}emitSnapshot(e){this.ctx&&(e||this.lastTelemetry&&this.lastTelemetry.timestamp-this.lastEmitMs>=250)&&(this.lastEmitMs=this.lastTelemetry?.timestamp??Date.now(),this.ctx.emitEvent("autopilot-pp:state",this.getSnapshot()))}};var et=`
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
`,tt=`
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
  ${te("#autothrottle-button.ext-autothrottle-pad")}
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
`;function z(n,e,t){return Math.max(e,Math.min(t,n))}var xe=class{id="autothrottle";name="Autothrottle";description="GeoFS native PID speed controller with KTS/MACH, landing arm, and OP-SYNC safety.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;engaged=!1;hasEngaged=!1;machMode=!1;landingArmed=!1;landingRetarded=!1;aircraftId=null;targetKias=250;targetMach=.78;reverse;previousSpeed=null;acceleration=0;electricalFailure=!1;opSyncEngaged=!1;opPromptActive=!1;opPromptDismiss=null;sessionOpSyncChoice=null;bar=null;disengageTimer;restoreThrottleAxis;unmounts=[];init(e){this.ctx=e;let t=document.createElement("div");t.className="ext-autothrottle-bar",t.innerHTML=et;let i=document.createElement("style");i.id="geofs-ext-autothrottle-styles",i.textContent=tt,document.head?.append(i),this.unmounts.push(()=>i.remove()),this.bar=t;for(let l of t.querySelectorAll("a, .ext-autothrottle-pad"))l.tabIndex=0,l.setAttribute("role","button"),l.addEventListener("keydown",o=>{o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),o.repeat||l.click())}),l.addEventListener("click",o=>{o.stopPropagation(),l.id==="autothrottle-button"?this.toggle():l.dataset.step?this.adjustSpeed(l.dataset.step==="1"?1:-1):l.dataset.speedMode?this.setMode(l.dataset.speedMode==="mach"):l.dataset.arm&&(this.landingArmed=l.dataset.arm==="on",this.landingArmed||(this.landingRetarded=!1),this.renderControls())});let s=t.querySelector("input");s.addEventListener("focus",()=>{this.machMode&&(s.value=String(Number(this.targetMach.toFixed(4)))),s.select()}),s.addEventListener("click",()=>s.select());let a=()=>{let l=Number.parseFloat(s.value);!Number.isFinite(l)||l<=0||this.setTarget(l)};s.addEventListener("input",a),s.addEventListener("blur",()=>this.renderControls()),s.addEventListener("change",()=>{a(),this.renderControls()}),this.unmounts.push(e.anchors.mountControl("autothrottle-pad","autopilot",t)),this.attachToAutopilotBar(),this.upgradeTooltips(),this.renderControls();let r=e.getSettings().keybindings.toggleAutothrottle;this.unmounts.push(e.keybinds.register("autothrottle-toggle",r,()=>this.toggle())),this.unmounts.push(e.onEvent("failure:triggered",({type:l})=>{l==="electrical"&&(this.electricalFailure=!0,this.engaged&&this.stop())})),this.unmounts.push(e.onEvent("failure:cleared",({type:l})=>{l==="electrical"&&(this.electricalFailure=!1)})),e.emitEvent("failure:request-active")}upgradedTooltips=new Set;upgradeTooltips(){if(!this.bar||!window.componentHandler?.upgradeElement)return;let e=[];for(let t of this.bar.querySelectorAll(".mdl-tooltip"))if(!this.upgradedTooltips.has(t))try{window.componentHandler.upgradeElement(t),this.upgradedTooltips.add(t),e.push(t)}catch{}e.length>0&&this.unmounts.push(()=>{try{window.componentHandler?.downgradeElements?.(e)}catch{}for(let t of e)this.upgradedTooltips.delete(t)})}attachToAutopilotBar(){if(!this.bar)return;let e=document.querySelector(".geofs-autopilot-bar");e&&this.bar.parentElement!==e&&(e.append(this.bar),this.upgradeTooltips()),this.bar.hidden=!1;let t=this.bar.querySelector("#autothrottle-button");t&&this.ctx?.anchors.syncAutopilotPad(t,this.bar)}setTarget(e){this.machMode?this.targetMach=z(e,.01,10):this.targetKias=z(Math.round(e),1,9999),window.geofs?.autopilot?.setSpeed?.(this.machMode?this.targetMach:this.targetKias)}setMode(e){if(e!==this.machMode){let t=window.geofs?.animation?.values,i=t?.kias??0,s=t?.mach??0,a=i>50&&s>.05?z(i/s,250,1e3):661.47;this.machMode=e,this.previousSpeed=null,this.applyNativeMode(),this.setTarget(e?this.targetKias/a:this.targetMach*a)}this.renderControls()}applyNativeMode(){window.geofs?.autopilot?.setSpeedMode?.(this.machMode?"mach":this.ctx?.sim.getMajorVersion()===3?"knots":"kias")}adjustSpeed(e){let t=this.machMode?Number((this.targetMach+e*.01).toFixed(6)):this.targetKias+e*(this.targetKias<100?5:10);this.setTarget(t),this.renderControls()}suppressThrottleAxis(){let e=window.controls?.axisSetters?.throttle,t=e?.process;if(!e||!t)return;let i=()=>{};e.process=i,this.restoreThrottleAxis=()=>{e.process===i&&(e.process=t)}}toggle(){if(!this.ctx)return;if(this.engaged){this.stop(),this.ctx.anchors.showToast("Autothrottle Disengaged");return}let t=window.geofs?.autopilot,i=t?.PIDs?.throttle,s=this.ctx.sim.buildTelemetrySnapshot(.016,this.ctx.sim.getMajorVersion()??4);if(!s.aircraft||s.crashed||s.aircraft.category==="rotorcraft"||this.electricalFailure||!i){this.ctx.emitDiag?.("AUTOTHROTTLE_ERROR",{level:"error",aircraftId:s.aircraft?.id??null,category:s.aircraft?.category??null,crashed:s.crashed,electricalFailure:this.electricalFailure,hasPid:!!i});return}if(t?.on&&t.turnOff?.(),!t?.on){if(clearTimeout(this.disengageTimer),this.bar?.querySelector("#autothrottle-button")?.classList.remove("red-pad"),!this.hasEngaged){this.machMode=t?.speedMode==="mach";let a=t?.values?.speed,r=this.machMode?s.mach||.8:s.kias||250;this.setTarget(a&&a>0?a:r),this.hasEngaged=!0}this.applyNativeMode(),this.setTarget(this.machMode?this.targetMach:this.targetKias),this.suppressThrottleAxis(),this.engaged=!0,this.aircraftId=s.aircraft.id,this.landingArmed=!1,this.landingRetarded=!1,this.previousSpeed=null,this.acceleration=0,this.sessionOpSyncChoice=null,this.opPromptActive=!1,this.opSyncEngaged=!1,i.initialize?.(s.throttles[0]??0,s.kias),this.ctx.audio.playChime(),this.ctx.anchors.showToast(`Autothrottle Engaged (${this.machMode?`M ${this.targetMach.toFixed(2)}`:`${this.targetKias} KTS`})`),this.renderControls(),this.ctx.emitEvent("autothrottle:state",{engaged:!0})}}dismissOpPrompt(){this.opPromptDismiss?.(),this.opPromptDismiss=null,this.opPromptActive=!1}update(e){if(this.attachToAutopilotBar(),!this.engaged||!this.ctx)return;let t=window.geofs,i=t?.aircraft?.instance,s=e.aircraft,a=i?.definition,r=t?.autopilot?.PIDs?.throttle;if(!s||s.id!==this.aircraftId||s.category==="rotorcraft"||!r||!a||e.crashed||e.autopilotOn||this.electricalFailure){this.stop();return}if(e.paused)return;if(this.landingArmed){if(!e.groundContact&&e.aglFeet>0&&e.aglFeet<=27&&!this.landingRetarded){this.landingRetarded=!0,this.ctx.sim.setThrottle(0),this.ctx.anchors.showToast("Autothrottle Retard (27 ft RA)");return}if(this.landingRetarded&&!e.groundContact){this.ctx.sim.setThrottle(0);return}if(e.groundContact){this.ctx.sim.setThrottle(0),window.controls?.airbrakes&&(window.controls.airbrakes.target=1,window.controls.setters?.setAirbrakes?.set?.()),this.stop(),this.ctx.anchors.showToast("Autothrottle Auto-Retard & Spoilers Deployed");return}}let l=O=>t?.utils?.machToKnots?.(O)??O*661.47,o=this.machMode?l(this.targetMach):this.targetKias,d=this.machMode?l(e.mach):e.kias;if(!Number.isFinite(o)||!Number.isFinite(d)||d<-500||d>25e3)return;this.reverse?.definition!==a&&this.restoreReverse();let c=z(.8-(e.mach||d/661.47)*.05,.1,.8);!this.reverse&&o<d*c?(this.reverse={definition:a,original:a.reverse},a.reverse=!0):this.reverse&&d<=o*1.05&&this.restoreReverse(),this.bar?.querySelector(".ext-autothrottle-reverse")?.toggleAttribute("hidden",!this.reverse);let p=this.ctx.getSettings(),u=Math.abs(o-d),h=(i?.setup?.mass??1e3)<1e4?200:500,m=Math.max(25,p.opDeltaThresholdKts??150),x=u>=m||o>h||!!(this.reverse&&d>h),b=Math.min(u,5e3),E=b>1e3?b/25*(1+b/1e4):b/100,T=z((this.reverse?Math.min(d,2500):Math.min(o,5e3))/500+E,1,250),A=p.opSyncPolicy??"ask",S=A==="ask"&&this.sessionOpSyncChoice?this.sessionOpSyncChoice:A,C=null;x?S==="ask"?this.opPromptActive||(this.opPromptActive=!0,this.ctx.emitDiag?.("OPSYNC_PROMPT",{deltaKts:Math.round(u),targetKts:Math.round(o),speedKts:Math.round(d)}),this.opPromptDismiss=this.ctx.anchors.showPromptBanner("op-sync-prompt",`Large speed delta (${Math.round(u)} kts). Allow A/THR to engage OP Engines?`,[{id:"allow-once",label:"Allow Once",variant:"primary",onClick:()=>{this.sessionOpSyncChoice="allow",this.opPromptActive=!1,this.opPromptDismiss=null,this.ctx?.emitDiag?.("OPSYNC_DECISION",{choice:"allow-once"})}},{id:"keep-standard",label:"Keep Standard",variant:"neutral",onClick:()=>{this.sessionOpSyncChoice="never",this.opPromptActive=!1,this.opPromptDismiss=null,this.ctx?.emitDiag?.("OPSYNC_DECISION",{choice:"keep-standard"})}},{id:"always-allow",label:"Always Allow",variant:"primary",onClick:()=>{this.opPromptActive=!1,this.opPromptDismiss=null,this.ctx?.updateSettings({opSyncPolicy:"allow"}),this.ctx?.emitDiag?.("OPSYNC_DECISION",{choice:"always-allow"})}},{id:"never-allow",label:"Never Allow",variant:"danger",onClick:()=>{this.opPromptActive=!1,this.opPromptDismiss=null,this.ctx?.updateSettings({opSyncPolicy:"never"}),this.ctx?.emitDiag?.("OPSYNC_DECISION",{choice:"never-allow"})}}],0)):S==="allow"?(this.dismissOpPrompt(),C=T):this.dismissOpPrompt():this.dismissOpPrompt();let g=C!==null;g!==this.opSyncEngaged&&(this.opSyncEngaged=g,this.ctx.emitEvent("autothrottle:opsync-state",{active:g}),this.ctx.emitDiag?.(g?"OPSYNC_ENGAGED":"OPSYNC_RELEASED",{desired:C}));let w=1;this.ctx.emitEvent("autothrottle:boost",{desired:C,report:O=>{w=O}});let f=Number.isFinite(w)&&w>=1?w:1,v=z(Number.isFinite(e.dt)?e.dt:.016,.001,.1),y=this.previousSpeed===null?0:(d-this.previousSpeed)/v;this.previousSpeed=d,Math.abs(y*v)<2e3&&(this.acceleration=this.acceleration*.8+y*.2);let F=z(u/1e3,0,1),M=(50/(f+49)*(1-F)+F)*(1+.2*Math.sin(Math.min(u/150,Math.PI/2))),k=t?.api?.renderingSettings?.physicsDeltaMs,R=k&&k>0?z(Math.floor(v*1e3/k),1,10):1;r.set(o,this.reverse?-1:0,1);let N=r.compute(d,v/R);if(this.reverse&&(N=-Math.abs(N)),f>1&&this.acceleration>100&&(N*=100/this.acceleration),Number.isFinite(N)){let O=z(Number.isFinite(p.autothrottleResponsiveness)?p.autothrottleResponsiveness:1,.5,2),I=z(N*M*O,this.reverse?-1:0,this.reverse?0:1);Number.isFinite(I)&&this.ctx.sim.setThrottle(I)}}restoreReverse(){if(!this.reverse)return;let{definition:e,original:t}=this.reverse;t===void 0?delete e.reverse:e.reverse=t,this.reverse=void 0}stop(){if(!this.engaged)return;this.engaged=!1,this.landingArmed=!1,this.landingRetarded=!1,this.sessionOpSyncChoice=null,this.dismissOpPrompt(),this.opSyncEngaged&&(this.opSyncEngaged=!1,this.ctx?.emitEvent("autothrottle:opsync-state",{active:!1}),this.ctx?.emitDiag?.("OPSYNC_RELEASED",{desired:null})),this.restoreReverse(),this.restoreThrottleAxis?.(),this.restoreThrottleAxis=void 0;let e=this.bar?.querySelector("#autothrottle-button");e?.classList.add("red-pad"),clearTimeout(this.disengageTimer),this.disengageTimer=setTimeout(()=>e?.classList.remove("red-pad"),3e3),this.renderControls(),this.ctx?.emitEvent("autothrottle:state",{engaged:!1})}renderControls(){let e=this.bar;if(!e)return;let t=e.querySelector("#autothrottle-button");t.classList.toggle("green-pad",this.engaged),t.classList.toggle("amber-pad",!this.engaged&&this.landingArmed),t.setAttribute("aria-pressed",String(this.engaged)),e.querySelector(".ext-autothrottle-controls")?.toggleAttribute("hidden",!this.engaged),e.querySelector(".ext-autothrottle-reverse")?.toggleAttribute("hidden",!this.reverse);let i=e.querySelector("input");(typeof document>"u"||document.activeElement!==i)&&(i.value=this.machMode?this.targetMach.toFixed(2):String(this.targetKias)),i.removeAttribute("maxlength"),this.machMode||(i.maxLength=4);for(let s of e.querySelectorAll("[data-speed-mode], [data-arm]")){let a=s.dataset.arm==="off",r=s.dataset.arm?this.landingArmed!==a:this.machMode===(s.dataset.speedMode==="mach");s.classList.toggle("active",r),s.classList.toggle("green-pad",r),s.setAttribute("aria-pressed",String(r))}}onSettingsChange(e){this.ctx?.keybinds.updateCombo("autothrottle-toggle",e.keybindings.toggleAutothrottle),e.opSyncPolicy!=="ask"&&(this.dismissOpPrompt(),this.sessionOpSyncChoice=null)}destroy(){this.stop(),this.electricalFailure=!1;for(let e of this.unmounts)e();this.unmounts=[],clearTimeout(this.disengageTimer),this.disengageTimer=void 0,this.bar=null,this.hasEngaged=!1,this.ctx=null}};var it=["Mystery Flying Object","Classified Area 51 Project","Paper Plane with Jet Engines","UFO (Unidentified Flying Object)","Identity Obscured by Clouds","Skunkworks Prototype","Experimental Lawn Ornament","Ghost Flight 99","Stealthy Pizza Delivery","Aerodynamic Brick"];function Dt(n){let e=0;for(let t=0;t<n.length;t++)e=e*31+n.charCodeAt(t)>>>0;return it[e%it.length]}function j(n,e){return`
    <div style="min-width:0;overflow:hidden;padding:3px 4px;background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.22);border-radius:6px;">
      <div style="font-size:8px;color:#9ca3af;letter-spacing:0.4px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${n}</div>
      <div data-field="${e}" style="font-size:11px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">--</div>
    </div>
  `}var ye=class{id="information-display";name="Information Display";description="GeoFS Native HUD telemetry grid with registry badge, trend indicators, glideslope, and multi-engine % THR.";supportedMajors=[3,4];defaultEnabled=!0;rootEl=null;unmountTab=null;cells=new Map;lastAcKey="";lastKias=0;trend="";init(e){let t=document.createElement("div");t.style.cssText="display:flex;flex-direction:column;gap:5px;width:100%;",t.innerHTML=`
      <div id="hud-ac-header" style="padding-bottom:6px;border-bottom:1px solid rgba(136,136,136,0.35);">
        <div id="hud-ac-name" data-field="ac-name" style="font-size:11px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Loading Aircraft...</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:3px;">
          <span id="hud-ac-id-badge" data-field="ac-id" style="display:inline-block;font-size:9px;padding:1px 5px;background:#dddddd;color:#000000;border-radius:3px;font-weight:800;white-space:nowrap;">ID: --</span>
          <span data-field="ac-cat" style="font-size:9px;color:#aaaaaa;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">--</span>
        </div>
      </div>
      <div class="hud-section-header" style="font-size:9px;font-weight:700;color:#aaaaaa;text-transform:uppercase;letter-spacing:0.6px;">Performance</div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;">
        ${j("KTS KIAS","kias")}
        ${j("FT ALT","alt")}
        ${j("FPM V/S","vs")}
        ${j("DEG HDG","hdg")}
        <div style="grid-column:span 2;min-width:0;overflow:hidden;padding:3px 4px;background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.22);border-radius:6px;display:flex;justify-content:space-between;align-items:center;gap:6px;">
          <span data-field="power-label" style="font-size:8px;color:#9ca3af;letter-spacing:0.4px;text-transform:uppercase;white-space:nowrap;">% THR</span>
          <strong data-field="thr" style="font-size:11px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">--</strong>
        </div>
      </div>
      <div class="hud-section-header" style="font-size:9px;font-weight:700;color:#aaaaaa;text-transform:uppercase;letter-spacing:0.6px;margin-top:2px;">Additional Data</div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;">
        ${j("M MACH","mach")}
        ${j("DEG AOA","aoa")}
        ${j("G G-FORCE","g")}
        ${j("FT AGL","agl")}
        ${j("KTS GS","gs")}
        ${j("DEG GSLOPE","glideslope")}
      </div>
      <div style="display:flex;justify-content:space-between;gap:6px;font-size:9px;color:#cccccc;padding-top:2px;border-top:1px solid rgba(136,136,136,0.25);">
        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">FLAPS: <strong data-field="flaps">--</strong></span>
        <span style="white-space:nowrap;">GEAR: <strong data-field="gear">--</strong></span>
        <span style="white-space:nowrap;">BRK: <strong data-field="brk">--</strong></span>
      </div>
      <div data-field="rotor-torque" hidden style="font-size:9px;color:#38bdf8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
      <div data-field="v-speeds" style="font-size:9px;color:#aaaaaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
    `,t.querySelectorAll("[data-field]").forEach(i=>{let s=i.dataset.field;s&&this.cells.set(s,i)}),this.rootEl=t,this.unmountTab=e.anchors.registerHudTab("info","INFO",t,!0)}update(e){if(!this.rootEl)return;let t=e.aircraft,i=t?`${t.id}:${t.name}:${t.isDynamic}`:"none";if(i!==this.lastAcKey){this.lastAcKey=i;let h=this.cells.get("ac-name"),m=this.cells.get("ac-id");if(t&&h&&m){let x=t.isDynamic&&t.name===`Aircraft ${t.id}`;if(!t.isDynamic)h.textContent=t.name,h.title=t.name,m.style.background="#dddddd",m.style.color="#000000",m.textContent=`REG: ${t.id}`;else if(!x)h.textContent=t.name,h.title=`${t.name} (Dynamic Profile)`,m.style.background="#38bdf8",m.style.color="#000000",m.textContent=`AUTO: ${t.id}`;else{let b=Dt(t.id);h.textContent=`${b} (${t.name})`,h.title=`${b} (${t.name})`,m.style.background="#94a3b8",m.style.color="#000000",m.textContent=`ID: ${t.id}`}}else h&&m&&(h.textContent="No Aircraft",m.style.background="#94a3b8",m.textContent="ID: --")}Math.abs(e.kias-this.lastKias)>.1?(this.trend=e.kias>this.lastKias?" \u25B2":" \u25BC",this.lastKias=e.kias):Math.abs(e.kias-this.lastKias)<.01&&(this.trend=""),this.setText("ac-cat",t?.category??"--"),this.setText("kias",`${e.kias.toFixed(1)}${this.trend}`),this.setText("mach",e.mach.toFixed(2)),this.setText("alt",`${Math.round(e.altitude).toLocaleString()}`);let s=e.vs>100?"#22c55e":e.vs<-1e3?"#ef4444":"#ffffff";this.setText("vs",`${Math.round(e.vs)}`,s),this.setText("hdg",`${Math.round(e.heading).toString().padStart(3,"0")}\xB0`),this.setText("agl",`${Math.round(e.aglFeet).toLocaleString()}`),this.setText("gs",`${e.groundSpeed.toFixed(1)}`),this.setText("glideslope",e.glideslopeDeviation===void 0?"--":`${e.glideslopeDeviation.toFixed(1)}\xB0`);let a=e.aoa>16?"#ef4444":e.aoa>12?"#eab308":"#ffffff";this.setText("aoa",`${e.aoa.toFixed(1)}\xB0`,a);let r=e.gForce>3||e.gForce<-1?"#ef4444":"#ffffff";this.setText("g",e.gForce.toFixed(1),r),this.setText("flaps",`${e.flapsTarget}/${t?.maxFlaps??0}`),this.setText("gear",e.gearDown?"DOWN":"UP",e.gearDown?"#22c55e":"#ffffff"),this.setText("brk",e.parkingBrake?"PARK":"OFF",e.parkingBrake?"#eab308":"#ffffff");let l=oe(t?.vSpeeds,t?.machSpeeds);this.setText("v-speeds",l);let o=this.cells.get("v-speeds");o&&(o.hidden=!l,o.title=l);let d=t?.category==="rotorcraft",c=this.cells.get("rotor-torque");if(c&&(c.hidden=!d),this.setText("power-label",d?"% COLL":"% THR"),d){this.setText("thr",e.collective===null?"\u2014":`${Math.round(e.collective*100)}%`),this.setText("rotor-torque",`Rotor Torque: ${e.rotorTorque??"\u2014"}`);return}let p=e.reverserActive?"[REV] ":"",u=e.throttles.map(h=>`${Math.round(h*100)}%`).join("/");this.setText("thr",`${p}${u}`,e.reverserActive?"#f97316":"#ffffff")}setText(e,t,i=""){let s=this.cells.get(e);s&&(s.textContent!==t&&(s.textContent=t),s.style.color=i)}destroy(){this.unmountTab?.(),this.unmountTab=null,this.cells.clear(),this.lastAcKey="",this.lastKias=0,this.trend="",this.rootEl=null}};function It(n,e,t,i){if(!Number.isFinite(t)||t<=0||!Number.isFinite(i)||i<=0)return null;let s=d=>{if(Array.isArray(d)&&d.length===3&&d.every(c=>typeof c=="number"&&Number.isFinite(c)&&c>0))return[d[0],d[1],d[2]];if(d&&typeof d=="object"){let c=d,p=x=>{if(typeof x=="number"&&Number.isFinite(x)&&x>0)return x;if(typeof x=="function")try{let b=x.call(d);if(typeof b=="number"&&Number.isFinite(b)&&b>0)return b}catch{return null}return null},u=p(c.x),h=p(c.y),m=p(c.z);if(u!==null&&h!==null&&m!==null)return[u,h,m]}return null},a=null,r=n;for(let d of["inertia","localInertia","inertiaTensor"]){let c=s(r?.[d]);if(c){a=c;break}}if(!a&&typeof r?.getInvInertiaDiagLocal=="function")try{let d=s(r.getInvInertiaDiagLocal());if(d){let c=[1/d[0],1/d[1],1/d[2]];c.every(p=>Number.isFinite(p)&&p>0)&&(a=c)}}catch{a=null}if(!a){let d=s(e?.inertiaTensor);d&&(t>100&&Math.min(...d)<=5||(a=d))}if(!a)return null;let l=Math.max(.25,Math.min(4,i/t)),o=[a[0]*l,a[1]*l,a[2]*l];return o.every(d=>Number.isFinite(d)&&d>0)?{base:a,scaled:o}:null}function Gt(n,e,t=!1){if(n.engine?.on===!1)return 0;let i=e.aircraft,s=i?.name??"";if(i?.id==="2953"||/atlantis/i.test(s))return 0;let a=Number(n.definition?.maxThrust),r=Number.isFinite(a)&&a>0?a:0,l=n.engines,o=b=>b.on===!1?0:typeof b.currentThrust=="number"&&Number.isFinite(b.currentThrust)?Math.abs(b.currentThrust):typeof b.thrust=="number"&&Number.isFinite(b.thrust)?Math.max(0,b.thrust):0,d=l?.reduce((b,E)=>b+o(E),0)??0;if(e.simMajor===4&&!l?.length&&(d=Object.values(n.parts??{}).reduce((b,E)=>b+o(E),0)),d<=0&&r>0){let b=e.throttles.length?e.throttles:[0],E=b.reduce((T,A)=>T+(Number.isFinite(A)?Math.abs(A):0),0)/b.length;d=r*E}let c=Number.isFinite(e.altitude)?e.altitude:0,p=/shuttle|rocket|x-15/i.test(s)?.85:r>5e4?.0075:.0095,u=t?Math.max(.1,1-c/5e4)**1.1:1,h=e.reverserActive||e.throttles.some(b=>Number.isFinite(b)&&b<-.05),m=e.simMajor===4&&h?1.35:1,x=d*p*u*m;return Number.isFinite(x)&&x>=0?x:0}var Y=[["fuelDynamicSfc","ALTITUDE BURN","Scales fuel consumption with air density, altitude, and multi-throttle reverse thrust"],["fuelRealisticTanks","REAL TANKS","Drains center tank first, then wing tanks with roll imbalance physics"],["fuelAutoRefuel","AUTO-REFUEL","Automatically maintains 100% fuel load"]];function Ht(n,e){let t=Number.isFinite(e)&&e>0?e:0,i=Math.max(0,n.center-t),s=Math.max(0,t-n.center)/2;return{center:i,left:Math.max(0,n.left-s),right:Math.max(0,n.right-s)}}var Bt=`
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
`,we=class{id="fuel-simulator";name="Fuel Simulator";description="Multi-engine specific fuel consumption physics with tank burn, flameout lock, and mass sync.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;unmountTab=null;styleEl=null;aircraft;massTarget;massSyncElapsed=0;fuelKg=0;maxFuelKg=0;flameoutTriggered=!1;tanks={left:0,center:0,right:0};lowAlert=!1;bingoAlert=!1;panel=null;weightEl=null;tanksEl=null;statusEl=null;slider=null;sliderLabelEl=null;barFillEl=null;pctEl=null;burnEl=null;init(e){if(this.ctx=e,typeof document<"u"){let s=document.createElement("style");s.id="geofs-ext-fuel-styles",s.textContent=Bt,document.head?.appendChild(s),this.styleEl=s}let t=document.createElement("div");t.className="geofs-ext-fuel-root",t.innerHTML=`
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
        <button type="button" class="geofs-ext-fuel-btn" data-role="fuelDynamicSfc" title="${Y[0][2]}">${Y[0][1]}</button>
        <button type="button" class="geofs-ext-fuel-btn" data-role="fuelRealisticTanks" title="${Y[1][2]}">${Y[1][1]}</button>
        <button type="button" class="geofs-ext-fuel-btn" data-role="fuelAutoRefuel" title="${Y[2][2]}">${Y[2][1]}</button>
        <button type="button" class="geofs-ext-fuel-btn" data-role="refuel" style="border-color:#4caf50;color:#ffffff;">REFUEL 100%</button>
      </div>
      <div data-role="status" style="font-size:9px;font-weight:700;color:#4caf50;text-align:center;letter-spacing:0.6px;white-space:nowrap;">SYSTEMS LIVE</div>
    `,this.pctEl=t.querySelector('[data-role="pct"]'),this.barFillEl=t.querySelector('[data-role="bar-fill"]'),this.burnEl=t.querySelector('[data-role="burn"]'),this.weightEl=t.querySelector('[data-role="weight"]'),this.tanksEl=t.querySelector('[data-role="tanks"]'),this.slider=t.querySelector('[data-role="slider"]'),this.sliderLabelEl=t.querySelector('[data-role="slider-label"]'),this.statusEl=t.querySelector('[data-role="status"]'),this.panel=t;let i=s=>{if(!this.aircraft||this.maxFuelKg<=0||!Number.isFinite(s))return;let a=Math.max(0,Math.min(100,s));this.fuelKg=a/100*this.maxFuelKg,this.fuelKg>0&&this.restoreFuelEngine(),this.distributeFuel(),this.massSyncElapsed=1,this.sliderLabelEl&&(this.sliderLabelEl.textContent=`${Math.round(a)}%`),e.anchors.showToast(`Fuel set to ${Math.round(a)}%`)};this.slider?.addEventListener("input",()=>{this.sliderLabelEl&&(this.sliderLabelEl.textContent=`${Math.round(this.slider?.valueAsNumber??100)}%`)}),this.slider?.addEventListener("change",()=>i(this.slider?.valueAsNumber??100)),t.querySelector('[data-role="refuel"]')?.addEventListener("click",()=>i(100));for(let[s]of Y)t.querySelector(`[data-role="${s}"]`)?.addEventListener("click",()=>{e.updateSettings({[s]:!e.getSettings()[s]})});this.onSettingsChange(e.getSettings()),this.unmountTab=e.anchors.registerHudTab("fuel","FUEL",t)}onSettingsChange(e){for(let[t]of Y){let i=this.panel?.querySelector(`[data-role="${t}"]`);i?.classList.toggle("is-active",!!e[t]),i?.setAttribute("aria-pressed",String(!!e[t]))}}distributeFuel(){this.tanks={left:this.fuelKg*.3,center:this.fuelKg*.4,right:this.fuelKg*.3}}update(e){let t=window.geofs?.aircraft?.instance,i=e.aircraft;if(t!==this.aircraft){this.restoreMass(),this.aircraft=t;let h=typeof i?.maxFuel=="number"&&Number.isFinite(i.maxFuel)&&i.maxFuel>0?i.maxFuel:0;this.fuelKg=this.maxFuelKg=h,this.flameoutTriggered=!1,this.distributeFuel(),this.lowAlert=this.bingoAlert=!1,this.massSyncElapsed=1}if(!t?.definition||!i)return;let s=Number.isFinite(i.maxFuel)&&i.maxFuel>0?i.maxFuel:0;if(this.maxFuelKg!==s){let h=this.maxFuelKg>0?this.fuelKg/this.maxFuelKg:1;this.maxFuelKg=s,this.fuelKg=h*this.maxFuelKg,this.distributeFuel(),this.fuelKg>0&&this.restoreFuelEngine()}if(this.maxFuelKg<=0){this.restoreMass(),this.pctEl&&(this.pctEl.textContent="\u2014"),this.burnEl&&(this.burnEl.textContent="\u2014"),this.weightEl&&(this.weightEl.textContent="\u2014"),this.tanksEl&&(this.tanksEl.textContent="Tanks L/C/R: \u2014");return}if(e.paused||e.crashed){this.pctEl&&(this.pctEl.textContent=`${(this.fuelKg/this.maxFuelKg*100).toFixed(1)}%`),this.burnEl&&(this.burnEl.textContent="0 kg/h");return}let a=this.ctx?.getSettings(),r=Number.isFinite(e.dt)&&e.dt>0?Math.min(e.dt,1):0,l=Gt(t,e,!!a?.fuelDynamicSfc),o=l*r/3600,d=Number.isFinite(o)&&o>0?Math.min(this.fuelKg,o):0;this.fuelKg=Number.isFinite(this.fuelKg)?Math.max(0,this.fuelKg-d):this.maxFuelKg;let c=i.id==="2953"||/atlantis/i.test(i.name);if(a?.fuelAutoRefuel||c)this.fuelKg=this.maxFuelKg,this.restoreFuelEngine(),this.distributeFuel();else if(a?.fuelRealisticTanks){this.tanks=Ht(this.tanks,d);let h=this.tanks.left-this.tanks.right,m=t.object3d?.worldRotation?.[0];if(!e.groundContact&&e.kias>=10&&Array.isArray(m)&&m.length>=3&&Number.isFinite(h)&&Math.abs(h)>10&&Number.isFinite(m[0])&&Number.isFinite(m[1])&&Number.isFinite(m[2])){let x=Math.hypot(m[0],m[1],m[2]),b=Math.max(-5,Math.min(5,h*1e-6));if(x>.001&&Number.isFinite(x)&&Number.isFinite(b)){let E=1/x;t.rigidBody?.applyTorque?.([m[0]*E*b,m[1]*E*b,m[2]*E*b])}}}else this.distributeFuel();if(this.fuelKg<=0&&(this.fuelKg=0,!this.flameoutTriggered&&t.engine?.on!==!1&&(this.flameoutTriggered=this.ctx?.sim.stopEngines()??!1,this.flameoutTriggered&&(this.ctx?.emitEvent("fuel:exhausted",{aircraftId:i.id}),this.ctx?.anchors.showToast("FUEL EXHAUSTED \u2014 ENGINE FLAMEOUT","critical"))),this.flameoutTriggered&&this.ctx?.sim.setThrottle(0)),!c&&(this.massSyncElapsed+=r,this.massSyncElapsed>=1)){this.massSyncElapsed=0;let h=Math.max(i.mtow*.1,i.mtow-i.oew-i.maxFuel)*.5,m=i.oew+h+this.fuelKg;Number.isFinite(m)&&m>0&&(this.syncMass(t,m),this.weightEl&&(this.weightEl.textContent=`${Math.round(m).toLocaleString()} kg`))}let p=this.fuelKg/this.maxFuelKg*100;p<5&&!this.bingoAlert?(this.ctx?.anchors.showToast("Bingo Fuel \u2014 Emergency Declared","critical"),this.bingoAlert=!0):p<15&&!this.lowAlert?(this.ctx?.anchors.showToast("Low Fuel Alert","warn"),this.lowAlert=!0):p>16&&(this.lowAlert=this.bingoAlert=!1),this.slider&&(typeof document>"u"||document.activeElement!==this.slider)&&(this.slider.value=String(Math.round(p)),this.sliderLabelEl&&(this.sliderLabelEl.textContent=`${Math.round(p)}%`)),this.pctEl&&(this.pctEl.textContent=`${p.toFixed(1)}%`),this.barFillEl&&(this.barFillEl.style.width=`${Math.max(0,Math.min(100,p)).toFixed(1)}%`,this.barFillEl.style.background=p<5?"#ef4444":p<15?"#eab308":"#4caf50");let u=Math.round(this.fuelKg>0?l:0);this.burnEl&&(this.burnEl.textContent=`${u.toLocaleString()} kg/h`),this.tanksEl&&(this.tanksEl.textContent=`Tanks L/C/R: ${Math.round(this.tanks.left)} / ${Math.round(this.tanks.center)} / ${Math.round(this.tanks.right)} kg`),this.statusEl&&(this.fuelKg<=0?(this.statusEl.textContent="EMPTY \u2014 THROTTLE LOCKED",this.statusEl.style.color="#ef4444"):p<5?(this.statusEl.textContent="BINGO FUEL EMERGENCY",this.statusEl.style.color="#ef4444"):p<15?(this.statusEl.textContent="LOW FUEL ADVISORY",this.statusEl.style.color="#eab308"):(this.statusEl.textContent="SYSTEMS LIVE",this.statusEl.style.color="#4caf50")),this.ctx?.emitEvent("fuel:state",{pct:p,burnKgHr:u})}syncMass(e,t){let i=e.rigidBody,s=e.definition;if((i!==this.massTarget?.body||s!==this.massTarget?.definition)&&this.restoreMass(),!s||!Number.isFinite(t)||t<=0)return;let a=Math.max(1,Math.min(1e7,t)),r=s.mass,l=Math.abs((r??0)-a)>5;if(!this.massTarget){let d=typeof i?.mass=="number"&&Number.isFinite(i.mass)&&i.mass>0?i.mass:r;this.massTarget={definition:s,originalDefinitionMass:r,body:i,originalMass:d,originalInertia:null,lastBodyMass:d,calledSetMassProps:!1}}s.mass=a;let o=!1;if(i&&typeof i.setMassProps=="function"&&this.massTarget.originalMass!==void 0){let d=It(i,s,this.massTarget.originalMass,a);if(d){this.massTarget.originalInertia||(this.massTarget.originalInertia=d.base);let c=this.massTarget.lastBodyMass??this.massTarget.originalMass;(!this.massTarget.calledSetMassProps||Math.abs(c-a)>25)&&(i.setMassProps(a,d.scaled),this.massTarget.calledSetMassProps=!0,this.massTarget.lastBodyMass=a,o=!0)}}(l||o)&&this.ctx?.emitDiag?.("FUEL_MASS_SYNC",{massKg:Math.round(a),fuelKg:Math.round(this.fuelKg),rigidBodySynced:this.massTarget.calledSetMassProps})}restoreMass(){let e=this.massTarget;e&&(e.originalDefinitionMass===void 0?delete e.definition.mass:e.definition.mass=e.originalDefinitionMass,e.calledSetMassProps&&e.body&&typeof e.body.setMassProps=="function"&&e.originalMass!==void 0&&e.originalInertia&&e.body.setMassProps(e.originalMass,e.originalInertia)),this.massTarget=void 0}restoreFuelEngine(){!this.flameoutTriggered||!this.aircraft||this.aircraft.crashed||this.aircraft===window.geofs?.aircraft?.instance&&(this.aircraft.startEngines?this.aircraft.startEngines():this.aircraft.startEngine?.(),this.flameoutTriggered=!1)}destroy(){this.restoreMass(),this.aircraft=void 0,this.unmountTab?.(),this.unmountTab=null,this.styleEl?.remove(),this.styleEl=null,this.pctEl=null,this.barFillEl=null,this.burnEl=null,this.weightEl=null,this.tanksEl=null,this.statusEl=null,this.slider=null,this.sliderLabelEl=null,this.panel=null,this.ctx=null}};var st=["thrust","afterBurnerThrust","reverseThrust"];function P(n,e,t){return Math.max(e,Math.min(t,n))}function nt(n){return n>=1e12?`${(n/1e12).toFixed(1)}T`:n>=1e9?`${(n/1e9).toFixed(1)}B`:n>=1e6?`${(n/1e6).toFixed(1)}M`:Math.round(n).toLocaleString()}function Kt(n,e=.03){let t=Number(n?.rawRoll??n?.roll??0),i=Number(n?.rawPitch??n?.pitch??0),s=Number(n?.rawYaw??n?.yaw??0),a=Number.isFinite(t)?t:0,r=Number.isFinite(i)?i:0,l=Number.isFinite(s)?s:0,o=Math.max(Math.abs(a),Math.abs(r),Math.abs(l))>e;return{roll:a,pitch:r,yaw:l,controlling:o}}var Ke=class{targetPitch=null;targetRoll=null;wasControlling=!1;pitchIntegral=0;rollIntegral=0;prevPitchDeg=null;prevRollDeg=null;lastCmdPitch=0;lastCmdRoll=0;reset(){this.targetPitch=null,this.targetRoll=null,this.wasControlling=!1,this.pitchIntegral=0,this.rollIntegral=0,this.prevPitchDeg=null,this.prevRollDeg=null,this.lastCmdPitch=0,this.lastCmdRoll=0}step(e){let{rigidBody:t,controls:i,pitchDeg:s,rollDeg:a,kias:r,multiplier:l,sasStrength:o,groundContact:d,autopilotOn:c}=e;if(d||c)return this.reset(),{mode:"hold",controlling:!1,nextAngularVelocity:null};let p=Kt(i),u=i?.rawPitch===void 0&&i?.pitch!==void 0,h=i?.rawRoll===void 0&&i?.roll!==void 0,m=u?Math.abs((i?.pitch??0)-this.lastCmdPitch)>.03:Math.abs(p.pitch)>.03,x=h?Math.abs((i?.roll??0)-this.lastCmdRoll)>.03:Math.abs(p.roll)>.03,b=Math.abs(p.yaw)>.03,E=m||x||b,T=Number.isFinite(s)?s:0,A=Number.isFinite(a)?a:0,S=Number.isFinite(r)?r:0,C=Number.isFinite(l)&&l>=1?l:1,g=P(Number.isFinite(o)&&o>0?o:1,.25,2.5),w=t?.getAngularVelocity?.(),f=Array.isArray(w)&&w.length>=3&&Number.isFinite(w[0])&&Number.isFinite(w[1])&&Number.isFinite(w[2]);if(E){if(this.targetPitch=null,this.targetRoll=null,this.pitchIntegral=0,this.rollIntegral=0,this.prevPitchDeg=null,this.prevRollDeg=null,this.lastCmdPitch=0,this.lastCmdRoll=0,this.wasControlling=!0,!f||!t?.setAngularVelocity)return{mode:"maneuver",controlling:!0,nextAngularVelocity:null};let G=Math.min(.45,Math.log10(Math.max(1,C))*.08),q=S>300?Math.max(.4,300/S):1,X=P(1-(.12+G)*g*.5,.35,.92),U=P(3.2/Math.max(1,Math.log10(Math.max(1,C)))/g*q,.35,4),H=[P(w[0]*X,-U,U),P(w[1]*X,-U,U),P(w[2]*X,-U,U)];return t.setAngularVelocity(H),{mode:"maneuver",controlling:!0,nextAngularVelocity:H}}(this.wasControlling||this.targetPitch===null||this.targetRoll===null)&&(this.targetPitch=T,this.targetRoll=P(A,-65,65),this.pitchIntegral=0,this.rollIntegral=0,this.prevPitchDeg=T,this.prevRollDeg=A,this.wasControlling=!1);let v=Number.isFinite(this.targetPitch)?this.targetPitch:T,y=Number.isFinite(this.targetRoll)?this.targetRoll:P(A,-65,65),F=P(v-T,-30,30),M=P(y-A,-30,30),k=this.prevPitchDeg!==null?P((T-this.prevPitchDeg)/.02,-120,120):0,R=this.prevRollDeg!==null?P((A-this.prevRollDeg)/.02,-180,180):0;this.prevPitchDeg=T,this.prevRollDeg=A;let N=.5/Math.max(.5,g);if(this.pitchIntegral=P(this.pitchIntegral+F*.02,-N,N),this.rollIntegral=P(this.rollIntegral+M*.02,-N,N),i){let G=S>220?P(220/S,.35,1):1,q=P((F*.045+this.pitchIntegral*.85-k*.015)*g*G,-.8,.8),X=P((M*.04+this.rollIntegral*.75-R*.014)*g*G,-.8,.8);i.pitch=q,i.roll=X,this.lastCmdPitch=q,this.lastCmdRoll=X}if(!f||!t?.setAngularVelocity)return{mode:"hold",controlling:!1,nextAngularVelocity:null};if(Math.abs(F)<.15&&Math.abs(M)<.15&&Math.abs(k)<.5&&Math.abs(R)<.5){let G=[0,0,0];return t.setAngularVelocity(G),{mode:"hold",controlling:!1,nextAngularVelocity:G}}let I=P(.88-.06*g,.65,.92),K=[P(w[0]*I,-.8,.8),P(w[1]*I,-.8,.8),P(w[2]*I,-.5,.5)];return K.every(Number.isFinite)&&t.setAngularVelocity(K),{mode:"hold",controlling:!1,nextAngularVelocity:K}}},Ue=class{originals=new Map;apply(e,t){if(!Number.isFinite(t)||t<=0)return;let i=new Set(Object.values(e??{}).filter(s=>Number.isFinite(s?.thrust)));for(let[s,a]of this.originals)i.has(s)||(Object.assign(s,a),this.originals.delete(s));for(let s of i){let a=this.originals.get(s);if(!a){a={};for(let r of st)Number.isFinite(s[r])&&(a[r]=s[r]);this.originals.set(s,a)}for(let r of st){let l=a[r];if(l!==void 0){let o=l*t;Number.isFinite(o)&&(s[r]=o)}}}}restore(){for(let[e,t]of this.originals)Object.assign(e,t);this.originals.clear()}},_e=class{original;apply(e,t){!Number.isFinite(t)||t<=0||(this.original?.definition!==e&&(this.restore(),this.original={definition:e,thrust:e.zeroThrustAltitude,rpm:e.zeroRPMAltitude}),e.zeroThrustAltitude=t,e.zeroRPMAltitude=t)}restore(){if(!this.original)return;let{definition:e,thrust:t,rpm:i}=this.original;t===void 0?delete e.zeroThrustAltitude:e.zeroThrustAltitude=t,i===void 0?delete e.zeroRPMAltitude:e.zeroRPMAltitude=i,this.original=void 0}},Se=[1,2,5,10,50,100,500,1e3,5e3,1e4,1e5,1e6,1e7,1e8,1e9],Q=[3e6,1e7,1e8,1e9,1e10,1e11,1e12],Ut=`
  ${te("#opEngineBarBtn.geofs-ext-op-bar-btn")}
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
`,Ee=class{id="overpowered-engines";name="Overpowered Engines";description="Native GeoFS thrust multiplier, ceiling bypass, OP-SYNC policy & closed-loop SAS.";supportedMajors=[3,4];defaultEnabled=!1;ctx=null;aircraft;thrustEnabled=!1;ceilingEnabled=!1;atEngaged=!1;opSyncActive=!1;automaticMultiplier=null;sasElapsed=0;thrust=new Ue;ceiling=new _e;sas=new Ke;torque=new Map;barBtn=null;card=null;isListeningKey=!1;unmounts=[];init(e){if(this.ctx=e,typeof document<"u"){let t=document.createElement("style");t.id="geofs-ext-op-styles",t.textContent=Ut,document.head?.appendChild(t),this.unmounts.push(()=>t.remove());let i=document.createElement("div");i.id="opEngineBarBtn",i.className="control-pad geofs-ext-op-bar-btn",i.setAttribute("role","button"),i.tabIndex=0,i.innerHTML='<div class="control-pad-label transp-pad">OP ENG</div>',i.title="Toggle Overpowered Engines & SAS Card",i.addEventListener("keydown",u=>{u.key!=="Enter"&&u.key!==" "||(u.preventDefault(),u.repeat||i.click())}),i.addEventListener("click",u=>{if(u.stopPropagation(),!this.card)return;let h=this.card.style.display==="none"||!this.card.style.display;this.card.style.display=h?"block":"none",h&&(e.anchors.bringToFront(this.card),e.anchors.clampElementToViewport(this.card))}),this.barBtn=i,this.unmounts.push(e.anchors.mountControl("op-engines-pad","autopilot",i)),this.attachToAutopilotBar();let s=document.createElement("div");s.id="opEngineCard",s.style.display="none";let a=e.getSettings();s.innerHTML=`
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
                    <span style="white-space:nowrap;flex-shrink:0;"><input type="number" id="opMultInput" data-role="multiplier" min="1" max="1000000000" step="any" value="${a.opThrustMultiplier}"> x</span>
                  </div>
                  <input type="range" id="opMultSlider" data-role="mult-slider" class="op-slider" min="0" max="${Se.length-1}" step="1" value="${this.getThrustIndex(a.opThrustMultiplier)}">
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
                  <strong id="opCeilingReadout" data-role="ceiling-readout" style="color:#ffffff;">${nt(a.opCeilingFeet)} ft</strong>
                </div>
                <input type="range" id="opCeilingSlider" data-role="limit-slider" class="op-slider" min="0" max="${Q.length-1}" step="1" value="${this.getCeilingIndex(a.opCeilingFeet)}">
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
            <button type="button" id="opKeybindBtn" class="op-pill" style="flex-shrink:0;" title="Click to rebind Overpowered Thrust hotkey">${a.keybindings.toggleOpEngines}</button>
            <div style="flex:1;min-width:0;text-align:right;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              <span id="opStatusMsg" style="color:#aaaaaa;font-style:italic;display:${a.opStability?"none":"inline"};">Hotkey toggles thrust</span>
              <span id="opSASMsg" style="color:#4caf50;font-weight:700;display:${a.opStability?"inline":"none"};">SAS ACTIVE (Attitude Hold)</span>
            </div>
          </div>
        </div>
      `,document.body?.appendChild(s),this.card=s;let r=s.querySelector("#opEngineHeader")??s;this.unmounts.push(e.anchors.makeDraggable(s,"geofs_ext_op_card_pos",r)),this.unmounts.push(()=>s.remove()),s.querySelector('[data-role="close"]')?.addEventListener("click",()=>{s.style.display="none"}),s.querySelector('[data-role="thrust"]')?.addEventListener("click",()=>this.toggle()),s.querySelector('[data-role="ceiling"]')?.addEventListener("click",()=>{this.atEngaged||(this.ceilingEnabled=!this.ceilingEnabled,this.ceilingEnabled||this.ceiling.restore(),this.render())}),s.querySelector('[data-role="sas"]')?.addEventListener("click",()=>{let u=!e.getSettings().opStability;this.sas.reset(),e.updateSettings({opStability:u}),e.emitEvent("overpowered:sas-state",{active:u}),e.emitDiag?.(u?"SAS_ACTIVE":"SAS_DISENGAGED")});let l=s.querySelector('[data-role="multiplier"]'),o=s.querySelector('[data-role="mult-slider"]');l?.addEventListener("input",()=>{if(this.thrustEnabled||this.opSyncActive)return;let u=Number.parseFloat(l.value);Number.isFinite(u)&&u>=1&&(e.updateSettings({opThrustMultiplier:Math.min(1e9,u)}),o&&(o.value=String(this.getThrustIndex(u))))}),o?.addEventListener("input",()=>{if(this.thrustEnabled||this.opSyncActive)return;let u=Se[Number(o.value)]??1;e.updateSettings({opThrustMultiplier:u}),l&&(l.value=String(u))});let d=s.querySelector('[data-role="limit-slider"]');d?.addEventListener("input",()=>{if(this.ceilingEnabled||this.atEngaged)return;let u=Q[Number(d.value)]??Q[0];e.updateSettings({opCeilingFeet:u})});for(let u of s.querySelectorAll("[data-opsync]"))u.addEventListener("click",()=>{let h=u.dataset.opsync;e.updateSettings({opSyncPolicy:h})});let c=s.querySelector("#opKeybindBtn"),p=u=>{if(!this.isListeningKey||(u.preventDefault(),u.stopPropagation(),["Shift","Control","Alt","Meta"].includes(u.key)))return;this.isListeningKey=!1,document.removeEventListener("keydown",p,!0);let h=[];u.ctrlKey&&h.push("Ctrl"),u.shiftKey&&h.push("Shift"),u.altKey&&h.push("Alt"),u.metaKey&&h.push("Meta");let m=u.key.length===1?u.key.toUpperCase():u.key;h.includes(m)||h.push(m);let x=h.join("+");e.updateSettings({keybindings:{...e.getSettings().keybindings,toggleOpEngines:x}})};this.unmounts.push(()=>document.removeEventListener("keydown",p,!0)),c?.addEventListener("click",()=>{this.isListeningKey||(this.isListeningKey=!0,c.textContent="PRESS KEY...",document.addEventListener("keydown",p,!0))}),s.querySelectorAll('[data-role="thrust-lock-overlay"]').forEach(u=>{u.addEventListener("click",()=>{e.anchors.showToast("OP Engines thrust is auto-managed by Autothrottle OP-SYNC.","warn")})}),s.querySelector("#opCeilingLockOverlay")?.addEventListener("click",()=>{e.anchors.showToast("OP Engines ceiling is managed while A/THR is active.","warn")})}this.render(),this.unmounts.push(e.keybinds.register("op-toggle",e.getSettings().keybindings.toggleOpEngines,()=>this.toggle())),this.unmounts.push(e.onEvent("autothrottle:state",t=>{this.atEngaged=t.engaged,this.atEngaged||(this.automaticMultiplier=null,this.opSyncActive=!1),this.render()})),this.unmounts.push(e.onEvent("autothrottle:opsync-state",({active:t})=>{this.opSyncActive=!!t,this.render()})),this.unmounts.push(e.onEvent("autothrottle:boost",({desired:t,report:i})=>{let s=e.getSettings();if(t===null||!Number.isFinite(t)||t<=0)this.automaticMultiplier=null;else{let a=this.thrustEnabled?s.opThrustMultiplier??1:1,r=this.automaticMultiplier??a,l=Number.isFinite(r)&&r>=1?r:1,o=P(t,1,250),d=P(l+(o-l)*.15,1,250);this.automaticMultiplier=Number.isFinite(d)&&d>=1?d:1}i(this.automaticMultiplier??(this.thrustEnabled?s.opThrustMultiplier??1:1))})),e.emitEvent("overpowered:sas-state",{active:!!e.getSettings().opStability})}attachToAutopilotBar(){if(!this.barBtn)return;let e=document.querySelector(".geofs-autopilot-bar");e&&this.barBtn.parentElement!==e&&e.append(this.barBtn),this.ctx?.anchors.syncAutopilotPad(this.barBtn)}getThrustIndex(e){return Se.reduce((t,i,s)=>Math.abs(i-e)<Math.abs(Se[t]-e)?s:t,0)}getCeilingIndex(e){return Q.reduce((t,i,s)=>Math.abs(i-e)<Math.abs(Q[t]-e)?s:t,0)}onSettingsChange(e){this.ctx?.keybinds.updateCombo("op-toggle",e.keybindings.toggleOpEngines),e.opStability||(this.restoreTorque(),this.sas.reset()),this.ctx?.emitEvent("overpowered:sas-state",{active:!!e.opStability}),this.render()}toggle(){this.atEngaged&&this.opSyncActive||(this.thrustEnabled=!this.thrustEnabled,this.thrustEnabled||this.thrust.restore(),this.render())}update(e){this.attachToAutopilotBar();let t=window.geofs?.aircraft?.instance,i=this.ctx?.getSettings();if(t!==this.aircraft&&(this.restore(),this.sas.reset(),this.aircraft&&(this.thrustEnabled=!1,this.ceilingEnabled=!1,this.automaticMultiplier=null,this.render()),this.aircraft=t),!t||!i||e.crashed){this.restore();return}let s=this.automaticMultiplier,a=s??(this.thrustEnabled?i.opThrustMultiplier??1:1);if(this.thrustEnabled||s!==null?this.thrust.apply(t.parts,a):this.thrust.restore(),(this.ceilingEnabled||s!==null)&&t.definition?this.ceiling.apply(t.definition,i.opCeilingFeet??Q[0]):this.ceiling.restore(),i.opStability&&!e.paused){let r=new Set(Object.values(t.parts??{}));for(let[l,o]of this.torque)r.has(l)||(l.torque=o,this.torque.delete(l));for(let l of r)typeof l?.torque=="number"&&(this.torque.has(l)||this.torque.set(l,l.torque),l.torque=0);this.sasElapsed+=e.dt,this.sasElapsed>=.02&&(this.sasElapsed%=.02,this.sas.step({rigidBody:t.rigidBody,controls:window.controls,pitchDeg:e.pitch,rollDeg:e.roll,kias:e.kias,multiplier:a,sasStrength:i.sasStrength??1,groundContact:e.groundContact,autopilotOn:e.autopilotOn}))}}render(){let e=this.ctx?.getSettings();if(!e)return;if(this.barBtn){let S=this.thrustEnabled||this.opSyncActive||!!e.opStability,C=!!(this.card&&this.card.style.display!=="none"&&this.card.style.display!=="");this.barBtn.classList.toggle("green-pad",S),this.barBtn.classList.toggle("is-open",!S&&C),this.barBtn.setAttribute("aria-pressed",String(this.thrustEnabled||this.opSyncActive)),this.barBtn.setAttribute("aria-expanded",String(C))}let t=this.card;if(!t)return;let i=this.opSyncActive,s=this.atEngaged||this.opSyncActive,a=t.querySelector("#opEngineHeaderText");a&&(a.textContent=i?"OP ENG [AUTO-MANAGED BY A/THR]":"Overpowered Engines",a.style.color=i?"#a855f7":"#ffffff"),t.querySelectorAll(".op-thrust-lock-target").forEach(S=>{S.style.opacity=i?"0.45":"1",S.style.pointerEvents=i?"none":"auto"}),t.querySelectorAll('[data-role="thrust-lock-overlay"]').forEach(S=>{S.style.display=i?"block":"none"});let r=t.querySelector("#opCeilingSection"),l=t.querySelector("#opCeilingLockOverlay");r&&(r.style.opacity=s?"0.45":"1",r.style.pointerEvents=s?"none":"auto"),l&&(l.style.display=s?"block":"none");let o=t.querySelector('[data-role="thrust"]');o&&(o.textContent=this.thrustEnabled||i?"THRUST: ACTIVE":"ACTIVATE THRUST",o.classList.toggle("green-pad",this.thrustEnabled||i),o.disabled=i);let d=t.querySelector('[data-role="sas"]');d&&(d.classList.toggle("green-pad",!!e.opStability),d.setAttribute("aria-pressed",String(!!e.opStability)));let c=t.querySelector('[data-role="ceiling"]');c&&(c.textContent=this.ceilingEnabled||this.opSyncActive?"CEILING: BYPASSED":"BYPASS ATMOSPHERE",c.classList.toggle("green-pad",this.ceilingEnabled||this.opSyncActive));let p=this.automaticMultiplier??e.opThrustMultiplier??1,u=t.querySelector('[data-role="multiplier"]');u&&(typeof document>"u"||document.activeElement!==u)&&(u.value=this.automaticMultiplier!==null?p.toFixed(1):String(p),u.disabled=this.thrustEnabled||i);let h=t.querySelector('[data-role="mult-slider"]');h&&(h.value=String(this.getThrustIndex(p)),h.disabled=this.thrustEnabled||i);let m=e.opCeilingFeet??Q[0],x=t.querySelector('[data-role="ceiling-readout"]');x&&(x.textContent=`${nt(m)} ft`);let b=t.querySelector('[data-role="limit-slider"]');b&&(b.value=String(this.getCeilingIndex(m)),b.disabled=this.ceilingEnabled||s);for(let S of t.querySelectorAll("[data-opsync]")){let C=(e.opSyncPolicy??"ask")===S.dataset.opsync;S.classList.toggle("is-active",C),S.setAttribute("aria-pressed",String(C))}let E=t.querySelector("#opKeybindBtn");E&&!this.isListeningKey&&(E.textContent=e.keybindings.toggleOpEngines);let T=t.querySelector("#opStatusMsg");T&&(T.style.display=e.opStability?"none":"inline");let A=t.querySelector("#opSASMsg");A&&(A.style.display=e.opStability?"inline":"none")}restoreTorque(){for(let[e,t]of this.torque)e.torque=t;this.torque.clear(),this.sasElapsed=0}restore(){this.thrust.restore(),this.ceiling.restore(),this.restoreTorque()}destroy(){this.restore(),this.sas.reset(),this.aircraft=void 0,this.thrustEnabled=!1,this.ceilingEnabled=!1,this.atEngaged=!1,this.opSyncActive=!1,this.automaticMultiplier=null,this.isListeningKey=!1;for(let e of this.unmounts)e();this.unmounts=[],this.barBtn=null,this.card=null,this.ctx=null}};var at={"pre-takeoff":"PRE-T/O","pre-cruise":"PRE-CRZ","pre-landing":"PRE-LDG","pre-chocks-on":"CHOCKS"};var rt=[{id:"cold-start",title:"Cold & Dark Engine Start Guide",steps:["Set Parking Brake ON and verify Fuel Quantity & Balance in FUEL tab.","Battery Master & Nav/Beacon Lights ON; start APU for jets before Bleed Air.","Advance Engine Masters / Mixture Rich sequentially and verify positive oil pressure & RPM."]},{id:"rto",title:"Rejected Takeoff (Before V1)",steps:["Immediately retard thrust levers to IDLE and disengage Autothrottle.","Apply Maximum Wheel Braking and full Reverse Thrust (if fitted).","Extend Spoilers / Speedbrakes fully and bring aircraft to a full stop before inspecting brakes."]},{id:"go-around",title:"Go-Around / Missed Approach",steps:["Apply TO/GA thrust smoothly and pitch up to +12 to +15 deg.","Retract one notch of flaps immediately, then retract Gear on positive rate of climb.","Accelerate cleanly to climb speed, retract remaining flaps on schedule, and re-arm approach."]},{id:"crosswind",title:"Crosswind Takeoff & Landing",steps:["Apply upwind aileron correction on takeoff roll and delay liftoff slightly past Vr.","On approach, fly crabbed or wing-low into the wind, align nose with runway before touchdown.","Lower windward wing slightly on rollout to keep upwind tires planted."]},{id:"short-field",title:"Short-Field Operations",steps:["Hold brakes while running power up to max takeoff thrust before releasing brakes.","Fly exact Vref over threshold at FULL flaps; aim directly for first 500 ft of runway.","Retract flaps after touchdown if needed to place maximum weight on main wheels for braking."]},{id:"mountain",title:"Mountain / High-Altitude Ops",steps:["Expect longer takeoff ground roll (higher TAS for same KIAS) due to low air density.","Monitor ALTITUDE BURN in FUEL tab and step-climb efficiently.","Execute steep approaches carefully without overspeeding Vfe flap limits."]}];function _t(n){return!n||n.includes("&")?null:["parkingBrake","parkingBrake:off","gear","gear:down","gear:up","flaps","flaps:0","flaps:full","airbrakes","airbrakes:arm","airbrakes:off","lightsOn"].includes(n)||/^flaps:\d+$/.test(n)?n:null}function ot(n){return _t(n)!==null}function $t(n,e,t){if(n==="parkingBrake")return e.parkingBrake;if(n==="parkingBrake:off")return!e.parkingBrake;if(n==="gear"||n==="gear:down")return!t.hasGear||e.gearDown;if(n==="gear:up")return!t.hasGear||!e.gearDown;if(n==="flaps")return t.maxFlaps<=0||e.flapsTarget>0;if(n==="flaps:0")return e.flapsTarget===0;if(n==="flaps:full")return t.maxFlaps<=0||e.flapsTarget>=t.maxFlaps;if(n.startsWith("flaps:")){let i=Number(n.slice(6));return t.maxFlaps<=0||e.flapsTarget>=Math.min(t.maxFlaps,i)}if(n==="airbrakes"||n==="airbrakes:arm")return!t.hasSpoilers||(e.airbrakesPosition??0)>0;if(n==="airbrakes:off")return!t.hasSpoilers||(e.airbrakesPosition??0)<=.05;if(n==="lightsOn")return e.lightsOn;if(n==="airborne")return!e.groundContact&&e.aglFeet>=35;if(n==="groundStopped")return e.groundContact&&e.groundSpeed<=3;if(n==="enginesOff"){let i=Math.max(...e.throttles.map(s=>Math.abs(s)),0);return e.groundContact&&e.groundSpeed<=3&&i<=.05}if(n==="vref"){let i=t.vSpeeds?.Vref??(t.category==="ga-piston"?65:138);return!e.groundContact&&e.aglFeet<=2e3&&e.kias<=i+15&&e.kias>=25}return n.startsWith("kias>=")?e.kias>=Number(n.slice(6)):n.startsWith("kias<=")?e.kias<=Number(n.slice(6)):n.startsWith("mach>=")?e.mach>=Number(n.slice(6)):n.startsWith("altitude>=")?e.altitude>=Number(n.slice(10)):n.startsWith("agl<=")?e.aglFeet<=Number(n.slice(5)):n.startsWith("throttle>=")?e.throttles.reduce((s,a)=>s+a,0)/Math.max(1,e.throttles.length)>=Number(n.slice(10)):!1}function lt(n,e,t){return!n||!t?!1:n.split("&").every(i=>$t(i.trim(),e,t))}function Vt(n){let e=n.name.toLowerCase();if(e.includes("a318")||e.includes("a319")||e.includes("a320")||e.includes("a321")||e.includes("a330")||e.includes("a340")||e.includes("a350")||e.includes("a380"))return{toStep:Math.min(n.maxFlaps,1),toLabel:"CONF 1+F",appStep:n.maxFlaps,ldgLabel:"CONF FULL"};if(e.includes("737"))return{toStep:Math.min(n.maxFlaps,2),toLabel:"FLAPS 5",appStep:n.maxFlaps,ldgLabel:"FLAPS 30/40"};if(e.includes("747"))return{toStep:Math.min(n.maxFlaps,2),toLabel:"FLAPS 10",appStep:n.maxFlaps,ldgLabel:"FLAPS 30"};if(e.includes("777")||e.includes("787")||e.includes("757")||e.includes("767"))return{toStep:Math.min(n.maxFlaps,2),toLabel:"FLAPS 5/15",appStep:n.maxFlaps,ldgLabel:"FLAPS 30"};if(e.includes("atr")||e.includes("q400")||e.includes("king air")||e.includes("twin otter")||e.includes("pc-7"))return{toStep:Math.min(n.maxFlaps,1),toLabel:"FLAPS 15",appStep:n.maxFlaps,ldgLabel:"FLAPS FULL"};if(n.maxFlaps<=0)return{toStep:0,toLabel:"UP (CLEAN WING)",appStep:0,ldgLabel:"DELTA / NO-FLAP TRIM"};let t=Math.max(1,Math.min(n.maxFlaps,Math.round(n.maxFlaps/3)));return{toStep:t,toLabel:`NOTCH ${t}/${n.maxFlaps}`,appStep:n.maxFlaps,ldgLabel:`FULL (${n.maxFlaps}/${n.maxFlaps})`}}function dt(n){let e=Math.round(n.vSpeeds?.VR??(n.category==="ga-piston"?55:n.category==="fighter"?135:140)),t=Math.round(n.vSpeeds?.Vref??(n.category==="ga-piston"?65:n.category==="fighter"?140:136)),i=n.name.toLowerCase(),s=n.id,a=Vt(n),r=/a3\d\d/.test(i),l=/(747|757|767|777|787)/.test(i),o=i.includes("737");if(n.category==="rotorcraft")return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${n.name} Collective - FULL DOWN`,desc:"Verify minimum collective pitch prior to rotor spin-up.",sync:"throttle>=0"},{text:"Anti-Collision & Nav Lights - ON",desc:"Alert ramp personnel of spinning rotors.",sync:"lightsOn"},{text:"Rotor RPM 100% & Pedals Check",desc:"Confirm nominal Nr and cyclic freedom before hover."},{text:"Hover Check (5-15 ft AGL)",desc:"Check CG balance and directional stability in hover."}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Translational Lift (> 20 KTS)",desc:"Smoothly transition forward past effective translational lift.",sync:"kias>=20"},{text:"Landing Gear - UP (If Retractable)",desc:n.hasGear?"Retract gear once clear of obstacles.":"Fixed skids verified.",sync:n.hasGear?"gear:up":void 0},{text:"Climb & Cruise Altitude (>= 500 ft)",desc:"Verify clear vertical obstacle clearance.",sync:"altitude>=500"},{text:"Cruise Airspeed (> 70 KTS)",desc:"Trim cyclic for steady cruise speed.",sync:"kias>=70"}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:`Approach Decel (<= ${Math.max(55,t)} KTS)`,desc:"Capture steady approach profile toward helipad.",sync:`kias<=${Math.max(55,t)}`},{text:"Landing Gear - DOWN / SKIDS CHECK",desc:n.hasGear?"Confirm gear down and locked.":"Verify fixed skid alignment.",sync:n.hasGear?"gear:down":void 0},{text:"Lights & Final Descent (AGL <= 150 ft)",desc:"Confirm clear LZ and escape route.",sync:"agl<=150"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Touchdown & Zero Ground Speed",desc:"Set skids firmly before lowering collective.",sync:"groundStopped"},{text:"Collective Full Down & Idle",desc:"Lower collective smoothly to flat pitch.",sync:"enginesOff"},{text:"Fuel Valve / Battery - OFF",desc:"Complete rotor brake and shutdown.",sync:"groundStopped"}]}];if(s==="11"||i.includes("silent")||i.includes("jantar"))return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:"Spoilers / Airbrakes - CLOSED & LOCKED",desc:"Double-check airbrake lever locked forward prior to launch.",sync:"airbrakes:off"},{text:"Controls Free & Canopy Latched",desc:"Verify full roll, pitch, and yaw authority."},{text:`Target Rotation / Liftoff Speed (${e} KTS)`,desc:"Rotate gently cleanly onto tow / electric climb."}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Gear - UP & LOCKED",desc:"Retract main wheel after leaving circuit.",sync:"gear:up"},{text:"Thermaling / Cruise Altitude (>= 1,500 ft)",desc:"Establish energy margin for cross-country soar.",sync:"altitude>=1500"},{text:`Cruise Speed (>= ${Math.max(45,e+10)} KTS)`,desc:"Fly MacCready best L/D speed.",sync:`kias>=${Math.max(45,e+10)}`}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:"Undercarriage - DOWN",desc:"Confirm main wheel extended prior to base leg.",sync:"gear:down"},{text:`Approach Speed (<= ${t+10} KTS)`,desc:"Fly stable approach at target speed.",sync:`kias<=${t+10}`},{text:"Airbrakes - MODULATE APPROACH",desc:"Use spoilers smoothly to control glidepath.",sync:"airbrakes"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Full Stop on Field",desc:"Keep wings level until wheel comes to a stop.",sync:"groundStopped"},{text:"Master / Sustainer - OFF",desc:"Secure glider battery and canopy."}]}];if(s==="2844"||s==="2953"||s==="2988"||n.category==="specialized"){let d=s==="2953"||i.includes("atlantis");return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${n.name} Hold-Down / Brakes`,desc:"Check vehicle attitude and launch clear.",sync:"parkingBrake"},{text:"Flaps / Body Flap - T/O TRIM",desc:n.maxFlaps>0?`Set takeoff flap notch (${a.toLabel}).`:"Elevons & RCS neutral.",sync:n.maxFlaps>0?"flaps:0":void 0},{text:"Main Propulsion - FULL THRUST",desc:`Smoothly advance throttle to 100% for liftoff (Vr ~${e} KTS).`,sync:"throttle>=0.90"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Gear - UP",desc:"Retract undercarriage once positive climb verified.",sync:"gear:up"},{text:"High-Altitude Profile (>= 35,000 ft)",desc:"Follow energy corridor above 35,000 ft.",sync:"altitude>=35000"},{text:d?"Hypersonic Entry / Energy (>= 250 KTS)":"Supersonic / Boost Profile (M >= 1.50)",desc:"Verify velocity stability prior to coast/entry.",sync:d?"kias>=250":"mach>=1.50"}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:`Steep Glide Intercept (<= ${t+25} KTS)`,desc:"Capture steep -18 deg outer glideslope corridor.",sync:`kias<=${t+25}`},{text:"Landing Gear - DOWN (Below 300 ft AGL)",desc:"Deploy heavy landing gear cleanly before flare.",sync:"gear:down"},{text:"Speedbrake - AS REQUIRED FOR ENERGY",desc:"Modulate speedbrake to nail aiming point.",sync:n.hasSpoilers?"airbrakes":void 0}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Wheel Stop & Drag Chute",desc:"Full stop on lakebed or long runway.",sync:"groundStopped"},{text:"Propulsion & APU - SECURED",desc:"All engines and hydraulic systems off.",sync:"enginesOff"}]}]}if(n.category==="supersonic")return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${n.name} Parking Brake - SET`,desc:"Confirm runway alignment prior to reheat check.",sync:"parkingBrake"},{text:"External & Landing Lights - ON",desc:"Max visibility during high-speed departure.",sync:"lightsOn"},{text:"Reheat / Afterburners - MAX FOR T/O",desc:`Smoothly engage full thrust; rotate at ${e} KTS.`,sync:"throttle>=0.95"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Undercarriage - UP & LOCKED",desc:"Retract below 270 KTS immediately after positive climb.",sync:"gear:up"},{text:"Supercruise Altitude (>= 45,000 ft)",desc:"Climb smoothly into supersonic cruise block.",sync:"altitude>=45000"},{text:"Mach Cruise Established (M >= 1.80)",desc:"Stabilize at Concorde/XB-70 Mach 2.0+ cruise.",sync:"mach>=1.80"}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:"Decelerate Subsonic Before Approach",desc:"Pass below 250 KTS prior to final vectoring.",sync:"kias<=250"},{text:"Landing Gear - DOWN (3 Green)",desc:"Confirm gear extended cleanly by 1,500 ft AGL.",sync:"gear:down"},{text:`Delta Vortex Approach (Vref ${t} KTS)`,desc:"Hold high nose attitude (12-13 deg pitch) with autothrottle.",sync:"vref"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Full Stop & Parking Brake - SET",desc:"Engage reverse idle and apply firm wheel brakes.",sync:"groundStopped&parkingBrake"},{text:"Fuel Master Switches - OFF",desc:"Shut down all powerplants and secure avionics.",sync:"enginesOff"}]}];if(n.category==="fighter")return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${n.name} Parking Brake Check`,desc:"Hold brakes while checking engine gauges.",sync:"parkingBrake"},...n.maxFlaps>0?[{text:`Takeoff Flaps - ${a.toLabel}`,desc:"Set combat takeoff flap configuration.",sync:`flaps:${a.toStep}`}]:[{text:"Automatic Leading-Edge Slats - ARMED",desc:"Flight control computer auto-schedules maneuvering slats."}],{text:"Lights & Speedbrake Closed",desc:"Ensure speedbrake retracted cleanly for runway roll.",sync:n.hasSpoilers?"airbrakes:off":"lightsOn"},{text:"MIL / AB Thrust Selected",desc:`Rotate briskly at ${e} KTS.`,sync:"throttle>=0.85"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Landing Gear - UP (< 250 KTS)",desc:"Retract promptly before gear overspeed limit.",sync:"gear:up"},{text:"Flaps - UP / CLEAN",desc:"Retract takeoff flaps accelerating past 230 KTS.",sync:"flaps:0"},{text:"Tactical Cruise Altitude (>= 15,000 ft)",desc:"Level off at assigned flight level.",sync:"altitude>=15000"},{text:"Cruise Mach / Speed (>= 300 KTS)",desc:"Verify steady cruise speed and G-limit clearance.",sync:"kias>=300"}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:`Pattern Entry Speed (<= ${Math.max(220,t+60)} KTS)`,desc:"Extend speedbrake on downwind break as required.",sync:`kias<=${Math.max(220,t+60)}`},{text:"Landing Gear - DOWN & LOCKED",desc:"Deploy below 250 KTS; check 3 green.",sync:"gear:down"},...n.maxFlaps>0?[{text:`Landing Flaps - ${a.ldgLabel}`,desc:"Configure full flaps on base turn.",sync:"flaps:full"}]:[],{text:`On-Speed AOA / Vref (${t} KTS)`,desc:"Fly E-bracket velocity vector directly to runway.",sync:"vref"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Speedbrake & Flaps Retracted",desc:"Clean aircraft Clear of Active Runway.",sync:n.maxFlaps>0?"flaps:0":"airbrakes:off"},{text:"Full Stop & Parking Brake - SET",desc:"Secure ejection seat pin prior to cutoff.",sync:"groundStopped&parkingBrake"},{text:"Throttles OFF & Master Battery Off",desc:"Shut down turbine(s) cleanly.",sync:"enginesOff"}]}];if(n.category==="airliner-twin"||n.category==="airliner-quad"){let d=l||i.includes("a350")||i.includes("a380")?.82:.76,c=l||i.includes("a350")||i.includes("a380")?28e3:24e3,p=r?`CONF (${a.toLabel}) & T.O CONFIG`:o?"Takeoff Flaps - FLAPS 5":`Takeoff Flaps - ${a.toLabel}`,u=r?"ENG MASTER 1 & 2 - OFF":o?"Fuel Control Switches - CUTOFF":`${n.engineCount}x Fuel Cutoff - OFF`;return[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${n.name} Parking Brake Set`,desc:"Hold position for pushback/runup check before brake release.",sync:"parkingBrake"},{text:p,desc:`Configure ${n.name} takeoff flaps (V2 / VR ${e} KTS).`,sync:`flaps:${a.toStep}`},{text:"Spoilers / Speedbrake - RETRACTED (0)",desc:"Verify ground spoilers down prior to takeoff.",sync:n.hasSpoilers?"airbrakes:off":void 0},{text:"Landing & Strobe Lights - ON",desc:"Required prior to entering active runway.",sync:"lightsOn"},{text:"TO/GA or FLEX Thrust Applied",desc:"Verify symmetric N1/EPR spool across all engines.",sync:"throttle>=0.80"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[{text:"Landing Gear - UP & OFF",desc:"Retract on positive rate of climb.",sync:"gear:up"},{text:"Flaps - UP / CLEAN",desc:"Retract flaps cleanly above minimum clean speed.",sync:"flaps:0"},{text:`Climb to Cruise Level (>= ${(c/100).toFixed(0)} FL)`,desc:`Level off at FL${(c/100).toFixed(0)}+ / verify cabin press.`,sync:`altitude>=${c}`},{text:`Cruise Mach Established (M >= ${d.toFixed(2)})`,desc:"Confirm A/THR Mach hold and ALTITUDE BURN nominal.",sync:`mach>=${d.toFixed(2)}`}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:"Speed Brake - ARMED",desc:"Arm ground spoilers for automatic touchdown deployment.",sync:n.hasSpoilers?"airbrakes":void 0},{text:"Landing Gear - DOWN (3 Green)",desc:"Confirm gear locked down prior to outer marker / 1,500 ft.",sync:"gear:down"},{text:`Landing Flaps - ${a.ldgLabel}`,desc:`Full landing configuration for ${n.name}.`,sync:"flaps:full"},{text:`Stabilized on Vref (${t} KTS)`,desc:"On glidepath with A/THR LANDING mode armed if desired.",sync:"vref"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[{text:"Speedbrakes DOWN & Flaps UP",desc:"Clean wing after vacating runway onto taxiway.",sync:"flaps:0&airbrakes:off"},{text:"Aircraft Stopped & Parking Brake - SET",desc:"Set brake on arrival stand once chocks ready.",sync:"groundStopped&parkingBrake"},{text:u,desc:"Cut fuel masters, confirm N1 spool down & beacon OFF.",sync:"enginesOff"}]}]}return n.category==="turboprop"?[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${n.name} Parking Brake - SET`,desc:"Runup torque and prop feather check complete.",sync:"parkingBrake"},...n.maxFlaps>0?[{text:`Takeoff Flaps - ${a.toLabel}`,desc:"Set takeoff flap notch.",sync:`flaps:${a.toStep}`}]:[],{text:"Recognition / Strobe Lights - ON",desc:"Clear departure runway.",sync:"lightsOn"},{text:"Takeoff Power Applied",desc:`Smooth power advance; rotate cleanly at ${e} KTS.`,sync:"throttle>=0.85"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[...n.hasGear?[{text:"Landing Gear - UP",desc:"Retract gear with positive rate of climb.",sync:"gear:up"}]:[],...n.maxFlaps>0?[{text:"Flaps - 0 / CLEAN",desc:"Accelerate past climb flap retraction speed.",sync:"flaps:0"}]:[],{text:"Turboprop Cruise Alt (>= 10,000 ft)",desc:"Climb to economical turboprop cruise block.",sync:"altitude>=10000"},{text:"Cruise Airspeed (>= 150 KTS)",desc:"Confirm prop sync ON and torque balanced.",sync:"kias>=150"}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[...n.hasGear?[{text:"Undercarriage - DOWN",desc:"Check 3 green lights prior to final.",sync:"gear:down"}]:[],...n.maxFlaps>0?[{text:`Landing Flaps - ${a.ldgLabel}`,desc:"Set full approach/landing flaps.",sync:"flaps:full"}]:[],{text:`Stabilized Approach Vref (${t} KTS)`,desc:"Hold target Vref down the glideslope.",sync:"vref"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[...n.maxFlaps>0?[{text:"Flaps - UP (0)",desc:"Retract flaps after clearing runway.",sync:"flaps:0"}]:[],{text:"Full Stop & Parking Brake - SET",desc:"Confirm beta/reverse idle before chocking.",sync:"groundStopped&parkingBrake"},{text:"Condition Levers - FUEL CUTOFF",desc:"Shut down turboprop engines cleanly.",sync:"enginesOff"}]}]:[{gateId:"pre-takeoff",title:"PRE-TAKEOFF",items:[{text:`${n.name} Parking Brake & Controls Check`,desc:"Full & free control deflection verified.",sync:"parkingBrake"},...n.maxFlaps>0?[{text:`Takeoff Flaps - ${a.toLabel}`,desc:`Short/standard takeoff flaps (VR ${e} KTS).`,sync:`flaps:${a.toStep}`}]:[{text:"Elevator & Rudder Trim - SET T/O",desc:`Clean wing aircraft; neutral trim (VR ${e} KTS).`}],{text:"Mixture RICH & Beacon/Landing Light ON",desc:"Ensure full rich mixture for takeoff.",sync:"lightsOn"},{text:"Full Power Takeoff Check",desc:"Verify full RPM / manifold pressure cleanly.",sync:"throttle>=0.85"}]},{gateId:"pre-cruise",title:"PRE-CRUISE",items:[...n.hasGear?[{text:"Landing Gear - UP",desc:"Retract undercarriage once runway clear.",sync:"gear:up"}]:[],...n.maxFlaps>0?[{text:"Flaps - UP (0)",desc:"Retract flaps above safe climb speed.",sync:"flaps:0"}]:[],{text:"Cruise Altitude (>= 2,500 ft)",desc:"Reach planned VFR/IFR cruising level.",sync:"altitude>=2500"},{text:`Cruise Speed (>= ${Math.max(70,e+20)} KTS)`,desc:"Level off, trim pitch, and lean mixture.",sync:`kias>=${Math.max(70,e+20)}`}]},{gateId:"pre-landing",title:"PRE-LANDING",items:[{text:"GUMPS: Gas / Mixture RICH",desc:"Select fullest tank and full rich mixture."},...n.hasGear?[{text:"Undercarriage - DOWN & WELDED",desc:"Verify gear indicator green before final.",sync:"gear:down"}]:[],...n.maxFlaps>0?[{text:`Landing Flaps - ${a.ldgLabel}`,desc:`Below Vfe speed; configure ${a.ldgLabel}.`,sync:"flaps:full"}]:[],{text:`Target Approach Speed Vref (${t} KTS)`,desc:`Establish stabilized ${t} KTS final approach.`,sync:"vref"}]},{gateId:"pre-chocks-on",title:"PRE-CHOCKS-ON",items:[...n.maxFlaps>0?[{text:"Flaps - UP (0)",desc:"Retract flaps after vacating runway.",sync:"flaps:0"}]:[],{text:"Full Stop & Parking Brake - SET",desc:"Apply wheel brakes and tie down / chock.",sync:"groundStopped&parkingBrake"},{text:"Mixture IDLE CUT-OFF & Master OFF",desc:"Stop propeller and switch off mags & avionics.",sync:"enginesOff"}]}]}var zt=`
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
`;function jt(n,e,t,i){if(!n||!t)return!1;let s=window.controls;if(n==="parkingBrake"||n==="parkingBrake:off"){let a=n==="parkingBrake";return e.parkingBrake!==a?(typeof s?.setters?.setParkingBrake?.set=="function"?s.setters.setParkingBrake.set():s&&(s.brakes=a?1:0),!0):!1}if(n==="gear"||n==="gear:down"||n==="gear:up"){let a=n!=="gear:up";return t.hasGear&&e.gearDown!==a?(i.sim.toggleGear(),!0):!1}if(n==="flaps")return i.sim.setFlaps(e.flapsTarget>0?e.flapsTarget:Math.min(t.maxFlaps,1)),!0;if(n==="flaps:0")return i.sim.setFlaps(0),!0;if(n==="flaps:full")return i.sim.setFlaps(t.maxFlaps),!0;if(n.startsWith("flaps:")){let a=Number(n.slice(6));if(Number.isFinite(a))return i.sim.setFlaps(Math.min(t.maxFlaps,Math.max(0,a))),!0}if(n==="airbrakes"||n==="airbrakes:arm"||n==="airbrakes:off"){let a=n!=="airbrakes:off";if(s?.airbrakes)return s.airbrakes.target=a?1:0,s.setters?.setAirbrakes?.set?.(),!0}if(n==="lightsOn"&&s){if(e.lightsOn)return!1;let a=s.setters;if(typeof a?.setLights?.set=="function")return a.setLights.set(),!0;let r=s.toggleLights??window.geofs?.aircraft?.instance?.toggleLights;return typeof r=="function"?(r(),!0):!1}return!1}var Te=class{id="checklist-system";name="Checklist System";description="4 mandatory flight-gate checklists with live auto-checks, situational guide & emergency QRH overrides.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;rootEl=null;unmounts=[];activePhase=0;autoAdvance=!1;showGuide=!1;phaseTitles=[];emergencies=new Map;lastAircraftKey="";lastTelemetry=null;lastRender="";lastEmittedPhase="";manualDone=new Set;init(e){if(this.ctx=e,this.autoAdvance=!!e.getSettings().checklistAutoAdvance,typeof document<"u"){let a=document.createElement("style");a.id="geofs-ext-checklist-styles",a.textContent=zt,document.head?.appendChild(a),this.unmounts.push(()=>a.remove())}let t=document.createElement("div");t.className="geofs-ext-chk-root",this.rootEl=t,this.unmounts.push(e.anchors.registerHudTab("checks","CHECKS",t));let i=()=>{this.phaseTitles.length&&(this.activePhase=(this.activePhase+1)%this.phaseTitles.length,this.lastRender="",e.anchors.openHudTab("checks"),e.anchors.showToast(`Checklist Phase: ${this.phaseTitles[this.activePhase]}`))},s=e.getSettings().keybindings.toggleChecklist;this.unmounts.push(e.keybinds.register("checklist-cycle",s,i)),this.unmounts.push(e.onEvent("failure:triggered",({type:a,procedure:r,recoverable:l})=>{r&&(this.emergencies.set(a,{type:a,procedure:r,recoverable:l!==!1,contingency:!1}),this.activePhase=4+Array.from(this.emergencies.keys()).indexOf(a),this.lastRender="",e.anchors.openHudTab("checks"))})),this.unmounts.push(e.onEvent("failure:contingency",({type:a,procedure:r})=>{if(!r)return;let l=this.emergencies.get(a);this.emergencies.set(a,{type:a,procedure:r,recoverable:!1,contingency:!0}),l||(this.activePhase=4+Array.from(this.emergencies.keys()).indexOf(a)),this.lastRender="",e.anchors.openHudTab("checks")})),this.unmounts.push(e.onEvent("failure:cleared",({type:a})=>{this.emergencies.delete(a)&&(this.lastRender="")})),e.emitEvent("failure:request-active")}onSettingsChange(e){this.ctx?.keybinds.updateCombo("checklist-cycle",e.keybindings.toggleChecklist),this.autoAdvance!==!!e.checklistAutoAdvance&&(this.autoAdvance=!!e.checklistAutoAdvance,this.lastRender="")}update(e){if(this.lastTelemetry=e,!this.rootEl||!this.ctx)return;let t=e.aircraft;if(!t){this.lastRender&&this.rootEl.replaceChildren(),this.lastRender="",this.lastAircraftKey="";return}let i=`${t.id}:${t.name}:${t.maxFlaps}:${JSON.stringify(t.vSpeeds??{})}`;i!==this.lastAircraftKey&&(this.lastAircraftKey=i,this.manualDone.clear(),this.activePhase=0,this.emergencies.clear(),this.lastRender="");let s=dt(t),a=Array.from(this.emergencies.values()),r=s.map(g=>g.gateId?at[g.gateId]:g.title);this.phaseTitles=[...r,...a.map(g=>`QRH:${g.procedure.title.slice(0,8)}`)],this.activePhase>=this.phaseTitles.length&&(this.activePhase=0);let l=this.activePhase>=s.length,o=l?a[this.activePhase-s.length]:void 0,d=o?o.procedure:s[this.activePhase],c=d.items.map((g,w)=>{let f=`${o?`em-${o.type}-${o.contingency?"cont":"qrh"}`:`gate-${this.activePhase}`}-${w}`,v=ot(g.sync),y=!o&&lt(g.sync,e,t),F=this.manualDone.has(f)||y;return{id:f,item:g,hardware:v,autoDone:y,checked:F}}),p=c.filter(g=>!g.checked).length,u=`${d.title}:${p}`;if(u!==this.lastEmittedPhase&&(this.lastEmittedPhase=u,this.ctx.emitEvent("checklist:phase",{phase:d.title,pending:p})),this.autoAdvance&&!l&&c.length>0&&p===0&&this.activePhase<s.length-1){this.activePhase+=1,this.lastRender="";return}let h=oe(t.vSpeeds,t.machSpeeds),m=JSON.stringify([i,this.activePhase,this.autoAdvance,this.showGuide,this.phaseTitles,o?.contingency??!1,o?.recoverable??!1,h,c.map(g=>[g.id,g.checked])]);if(m===this.lastRender)return;this.lastRender=m,this.rootEl.replaceChildren();let x=document.createElement("div");x.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:4px;";let b=document.createElement("span");b.style.cssText="font-size:10px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",b.textContent=`${t.name} (${p} left)`,b.title=t.name;let E=document.createElement("span");E.style.cssText="display:inline-flex;gap:3px;flex-shrink:0;";let T=document.createElement("button");T.type="button",T.className=`geofs-ext-chk-btn ${this.autoAdvance?"is-active":""}`,T.textContent="AUTO",T.title="Auto-advance through mandatory phases",T.addEventListener("click",()=>{this.autoAdvance=!this.autoAdvance,this.ctx?.updateSettings({checklistAutoAdvance:this.autoAdvance}),this.lastRender=""});let A=document.createElement("button");A.type="button",A.className=`geofs-ext-chk-btn ${this.showGuide?"is-active":""}`,A.textContent="GUIDE",A.title="Toggle Situational Procedure Guide",A.addEventListener("click",()=>{this.showGuide=!this.showGuide,this.lastRender=""});let S=document.createElement("button");S.type="button",S.className="geofs-ext-chk-btn",S.textContent="RST",S.title="Reset All Checklist Items",S.addEventListener("click",()=>{this.manualDone.clear(),this.lastRender=""}),E.append(T,A,S),x.append(b,E),this.rootEl.appendChild(x);let C=document.createElement("div");if(C.className="geofs-ext-chk-phases",this.phaseTitles.forEach((g,w)=>{let f=document.createElement("button");f.type="button";let v=w>=s.length;f.className=`geofs-ext-chk-phase ${!this.showGuide&&w===this.activePhase?"is-active":""} ${v?"is-emergency":""}`,f.textContent=g,f.title=g,f.addEventListener("click",()=>{this.showGuide=!1,this.activePhase=w,this.lastRender=""}),C.appendChild(f)}),this.rootEl.appendChild(C),h){let g=document.createElement("div");g.style.cssText="font-size:9px;color:#aaaaaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",g.textContent=h,g.title=h,this.rootEl.appendChild(g)}if(o&&!this.showGuide){let g=document.createElement("div");g.style.cssText="padding:5px 7px;border-radius:6px;background:rgba(239,68,68,0.18);border:1px solid #ef4444;display:flex;flex-direction:column;gap:5px;";let w=document.createElement("div");if(w.style.cssText="font-size:10px;font-weight:700;color:#fca5a5;",w.textContent=o.contingency?`CONTINGENCY SOLUTION: ${o.procedure.title}`:`EMERGENCY QRH: ${o.procedure.title}`,g.appendChild(w),o.recoverable){let f=document.createElement("button");f.type="button",f.className="geofs-ext-chk-recovery",f.textContent="ATTEMPT RECOVERY",f.addEventListener("click",()=>{this.ctx?.emitEvent("failure:attempt-recovery",{type:o.type})}),g.appendChild(f)}this.rootEl.appendChild(g)}if(this.showGuide){let g=document.createElement("div");g.style.cssText="display:flex;flex-direction:column;gap:4px;";let w=document.createElement("div");w.style.cssText="font-size:9.5px;font-weight:700;color:#4caf50;text-transform:uppercase;letter-spacing:0.4px;",w.textContent="Situational Procedures Guide",g.appendChild(w);let f=[];for(let v of rt){let y=document.createElement("details");y.style.cssText="background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.25);border-radius:6px;padding:4px 6px;";let F=document.createElement("summary");F.style.cssText="font-size:10px;font-weight:700;color:#ffffff;cursor:grab;",F.textContent=v.title,y.appendChild(F);let M=document.createElement("ul");M.style.cssText="margin:4px 0 2px 14px;padding:0;font-size:9px;color:#cccccc;line-height:1.3;";for(let k of v.steps){let R=document.createElement("li");R.textContent=k,M.appendChild(R)}y.appendChild(M),y.addEventListener("toggle",()=>{if(y.open)for(let k of f)k!==y&&k.open&&(k.open=!1)}),f.push(y),g.appendChild(y)}this.rootEl.appendChild(g);return}for(let g of c){let w=document.createElement("div");w.className=`geofs-ext-chk-item ${g.checked?"is-done":""}`,w.setAttribute("role","checkbox"),w.setAttribute("aria-checked",String(g.checked)),w.tabIndex=0;let f=document.createElement("span");f.className="geofs-ext-chk-box",f.textContent=g.checked?"\u2713":"";let v=document.createElement("div");v.style.cssText="flex:1;min-width:0;";let y=document.createElement("div");y.style.cssText="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:10.5px;font-weight:700;color:#ffffff;";let F=document.createElement("span");if(F.textContent=g.item.text,g.checked&&(F.style.textDecoration="line-through"),y.appendChild(F),g.item.sync){let R=document.createElement("span");R.style.cssText="font-size:9px;flex-shrink:0;color:"+(g.hardware?"#facc15":"#38bdf8")+";",R.textContent=g.hardware?"\u26A1":"\u23F1",R.title=g.hardware?"Click to execute simulator control":"Auto-verified by live flight telemetry",y.appendChild(R)}let M=document.createElement("div");M.style.cssText="font-size:8.5px;font-style:italic;color:#aaaaaa;margin-top:1px;line-height:1.25;",M.textContent=g.item.desc,v.append(y,M),w.append(f,v);let k=()=>{if(g.hardware&&this.lastTelemetry&&this.ctx){!jt(g.item.sync,this.lastTelemetry,t,this.ctx)&&!g.autoDone&&this.ctx.anchors.showToast("Control unavailable \u2014 toggle manually in GeoFS","warn"),this.manualDone.delete(g.id),this.lastRender="";return}this.manualDone.has(g.id)?this.manualDone.delete(g.id):this.manualDone.add(g.id),this.lastRender=""};w.addEventListener("click",k),w.addEventListener("keydown",R=>{(R.key==="Enter"||R.key===" ")&&(R.preventDefault(),k())}),this.rootEl.appendChild(w)}}destroy(){for(let e of this.unmounts)e();this.unmounts=[],this.rootEl=null,this.lastRender="",this.lastEmittedPhase="",this.lastAircraftKey="",this.lastTelemetry=null,this.manualDone.clear(),this.emergencies.clear(),this.activePhase=0,this.phaseTitles=[],this.ctx=null}};var se="https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/",qt="https://raw.githubusercontent.com/Ariakim-Taiyo/GeoFs-737-Immersion-SFX/main/737_autopilot_disconnect.mp3",Ve=new Set(["4","22","5203"]),Ae=new Set(["240","25","4402"]),ze=new Set(["2865","2870","2871","242","2843","2899","24","2973"]);function ee(n,e,t,i,s,a){return{id:n,file:se+e,effects:{volume:{value:"rpm",ramp:t,ratio:100},pitch:{value:"rpm",ramp:i,offset:s,ratio:a}}}}var ct=[[1e3,900],[500,400],[400,300],[300,200],[200,100],[100,50],[50,40],[40,30],[30,20],[20,10],[10,5]],$e=n=>"geofs-ext-realism-"+n;function ut(){return!!window.audio?.sounds?.[$e("50")]}function pt(n){let e=String(n.id),t=Ve.has(e),i=Ae.has(e),s=ze.has(e);if(!t&&!i&&!s)return;let a=window.audio,r=a?.sounds,l=a?.soundplayer,o=n.definition?.sounds;if(!r||!l?.stopSound||!o?.length)return;let d=new Map,c=v=>{let y=r[v.id];if(y)try{l.stopSound?.(y)}catch{}d.set(v.id,{original:y,replacement:v}),r[v.id]=v};if((t?["englowfront.ogg","engmidfront.ogg","enghighestfront.ogg","737rolling.mp3"]:i?["777enginelow.mp3","777enginemid.mp3","777enginehigh.mp3","777enginehigh.mp3"]:["neo2.mp3","neo2.mp3","neo3.mp3"]).forEach((v,y)=>{let F=r[o[y]?.id];if(!F?.effects?.volume||!F.effects.pitch)return;let M={...F.effects.volume,lastValue:null,ratio:100},k={...F.effects.pitch,lastValue:null};i&&y===0&&(M.ramp=[100,500,2e3,1e4]),(s||t)&&(M.value="rpm",k.value="rpm"),c({id:F.id,loop:F.loop,file:se+v,effects:{volume:M,pitch:k}})}),i||s){let y=r[o[i?4:3]?.id];y?.effects?.volume&&c({...y,effects:{...y.effects,volume:{...y.effects.volume,lastValue:null,ratio:100}}})}if(s){let v=r[o[5]?.id];v?.id==="startup"&&c({id:v.id,file:se+"startupneo.mp3"}),c(ee("rpm4","neo2.mp3",[800,950,2500,3500],[0,2e4,2e4,2e4],1,1)),c(ee("rpm5","neo2.mp3",[1e3,2500,1e4,1e4],[0,2e4,2e4,2e4],1,1.5)),c(ee("rpm6","neo3.mp3",[6e3,2e4,2e4,2e4],[1e3,2e4,2e4,2e4],1,1.5))}else t&&(c(ee("rpmback","enghighback.ogg",[6e3,1e4,2e4,5e4],[1e3,2e4,2e4,2e4],1,1)),c(ee("rpmback1","enghighback.ogg",[100,500,2e3,1e4],[1e3,2e4,2e4,2e4],1,1)),c(ee("rpmin1","lowcab.ogg",[800,950,2500,3500],[0,2e4,2e4,2e4],1,1)),c(ee("rpmin2","midcab.ogg",[1e3,2500,1e4,1e4],[0,2e4,2e4,2e4],1,1)),c({id:"buzzsaw",file:se+"buzzsawcab.ogg",effects:{volume:{value:"rpm",ramp:[3e3,1e4,2e4,2e4],ratio:60}}}));let u=new Map([["flaps",t?"737flaps.mp3":"777flap.mp3"],["tooLowFlaps","tlf.mp3"],["terrain","tlt.mp3"],["pullUp","pullup.mp3"]]);(i||s)&&u.set("gear","tlg.mp3"),i?u.set("bank","bankangle.mp3"):s?(u.set("retard","retard.mp3"),u.set("stall","https://sage-narwhal-290a3c.netlify.app/airbusstall.mp3"),u.set("ptu","ptu.mp3"),u.set("tcas","traffic.mp3"),u.set("tcasClimb","climb.mp3"),u.set("tcasDescend","descend.mp3"),u.set("tcasClear","clear.mp3")):t&&(u.set("reverse","737reverse.mp3"),u.set("overspeed","sounds_overspeed.mp3"),u.set("touchHard","hardtouch1.mp3"),u.set("touchSoft","softtouch1.mp3"),u.set("tcas","traffic.mp3"),u.set("tcasClimb","climb.mp3"),u.set("tcasDescend","descend.mp3"),u.set("tcasClear","clear.mp3"));for(let[v]of ct){let y=i||t?v===500?"500correct.mp3":`${v}gpws_merged.mp3`:v===100?"100abtrue.mp3":`${v}ab.mp3`;u.set(String(v),y)}for(let[v,y]of u){let F=$e(v);c({id:F,file:y.startsWith("https://")?y:se+y,effects:{play:{value:F}}})}let h,m;if(t&&window.geofs?.autopilot?.turnOff){let v=window.geofs.autopilot,y=v.turnOff;m=new Audio(qt),m.preload="none",m.addEventListener("error",()=>{m=void 0},{once:!0}),v.turnOff=()=>{y?.call(v),a.on!==!1&&!window.geofs?.isPaused?.()&&m?.play().catch(()=>{})},h=()=>{window.geofs?.autopilot&&(window.geofs.autopilot.turnOff=y),m?.pause(),m=void 0}}let x=new Map,b=0,E=null,T=!0,A=!1,S=0,C=0,g=!1;return{update:(v,y)=>{if(a.sounds!==r)return;let F=x.get(y);F||(F=new Map,x.set(y,F));let M=(H,_)=>{let $=$e(H);F.has($)||F.set($,y[$]),y[$]=Number(_)},k=typeof y.climbrate=="number"?y.climbrate:v.vs,R=!v.groundContact&&!v.crashed,N=v.aglFeet,O=y.gearPosition===0,I=R&&O&&(N<=5e3&&k<=-2e3||N<=1e3&&k<=-5e3),K=R&&N<=500&&y.gearPosition===1&&k<0&&!I,G=R&&N<=1e3&&y.flapsPosition===0&&k<0&&!I,q=R&&!K&&!G&&k<=-1;M("flaps",typeof y.flapsPosition=="number"&&typeof y.flapsTarget=="number"&&y.flapsPosition!==y.flapsTarget),(i||s)&&M("gear",K),M("tooLowFlaps",G),M("terrain",R&&O&&N<=1e3&&k<=-100&&k>=-5e3&&!q&&!K&&!G),M("pullUp",I);let U=N-(i?16.152139372973117:s?12.232906828403847:0);for(let[H,_]of ct)M(String(H),q&&U>_&&U<=H);if(i&&M("bank",R&&Math.abs(v.roll)>35),s){let H=typeof y.rpm=="number"?y.rpm:0;if(M("retard",q&&U>5&&U<=20&&(v.throttles[0]??0)>=.1),M("stall",N>20&&!!n.stalling),M("ptu",H>400&&H<2400),v.timestamp-b>=1e3){let _=window.weather?.currentWindSpeed??0,$=q&&E!==null&&Math.abs(_-E)>=5;F.has("isWindWarn")||F.set("isWindWarn",y.isWindWarn),y.isWindWarn=Number($),E=_,b=v.timestamp}}if(s||t){let H=Object.values(window.multiplayer?.visibleUsers??{}),_=typeof y.altitudeMeters=="number"?y.altitudeMeters:v.altitude*.3048,$=!1,ne=!1;for(let ae of H)if(typeof ae.distance=="number"&&ae.distance<=1e3&&ae.referencePoint?.lla){let re=ae.referencePoint.lla[2];re>=_&&re<=_+100?ne=!0:re<=_&&re>=_-100&&($=!0)}$||ne?A=!0:A&&(A=!1,S=v.timestamp+3e3),M("tcas",$||ne),M("tcasClimb",$),M("tcasDescend",ne),M("tcasClear",v.timestamp<S)}if(t){let H=typeof y.rpm=="number"?y.rpm:0;M("reverse",!!y.reverser||H<0),M("overspeed",v.kias>340||v.mach>.82),!T&&v.groundContact&&(g=Math.abs(k)>300,C=v.timestamp+1500),T=v.groundContact,M("touchHard",v.timestamp<C&&g),M("touchSoft",v.timestamp<C&&!g)}},restore:()=>{h?.();for(let[v,y]of x)for(let[F,M]of y)M===void 0?delete v[F]:v[F]=M;if(a.sounds===r)for(let[v,{original:y,replacement:F}]of d)r[v]===F&&(l.stopSound?.(F),y?r[v]=y:delete r[v])}}}function Wt(n){let e=n===4?"in":"varying",t=n===4?"texture":"texture2D",i=n===4?"out_FragColor":"gl_FragColor";return`
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
  `}var Yt=new Set(["21","2","2808","1","8","12","13","40","1069","2750","4251","1022","1026","14","16"]),ht=new Set(["2948","2581","2808","3460","2988"]),Xt=new Set(["9","52","2840","4090"]);function D(n,e){return n?.[e]??e!=="performanceMode"}function Zt(){let n=window.geofs?.animation?.values?.view,e=window.geofs?.camera?.currentModeName;return n==="cockpit"||e==="cockpit"}var Ce=class{id="realism-pack";name="Realism Pack";description="Background G-force shaders, camera shake, 777/A320/737 SFX, and flight physics.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;optionKey="";lastSimMajor=null;stage=null;removeStage;uniforms={strength:0};overGSeconds=0;blackoutActive=!1;nextBreath=0;nextWind=0;nextPhysics=0;nextRotor=0;spinSample;nextSpin=0;nextSpinToast=0;next777Impulse=0;cameraOffset;aircraft;restores=[];captured=new WeakMap;spoilerArmed=!1;breath;wind;aircraftSounds;checkedAircraftSounds=!1;onKeyDown=e=>{if(!D(this.ctx?.getSettings().realismOptions,"spoilerArming")||e.key!=="Shift"||e.repeat||e.defaultPrevented||typeof HTMLElement<"u"&&e.target instanceof HTMLElement&&e.target.matches("input, textarea, select, [contenteditable]"))return;let t=window.geofs?.aircraft?.instance;t&&!t.groundContact&&window.controls?.airbrakes?.position===0&&(this.spoilerArmed=!0,this.ctx?.anchors.showToast("Spoilers Armed"))};init(e){this.ctx=e,this.lastSimMajor=e.simMajor??null,this.onSettingsChange(e.getSettings()),typeof document<"u"&&document.addEventListener("keydown",this.onKeyDown)}onSettingsChange(e){let t=e.realismOptions,i=JSON.stringify(t??{});i!==this.optionKey&&(this.optionKey=i,this.restoreAircraft(),D(t,"gBreath")||this.breath?.pause(),D(t,"windAudio")||this.wind?.pause(),D(t,"soundExpansion")||this.resetAircraftSounds(),D(t,"blackout")||(this.uniforms.strength=0,this.overGSeconds=0,this.blackoutActive=!1,this.stage&&(this.stage.enabled=!1)),this.emitRealismDiag(t))}emitRealismDiag(e){let t=this.lastSimMajor,i=t===4;this.ctx?.emitDiag?.("REALISM_STATE",{simMajor:t,blackout:D(e,"blackout"),soundExpansion:D(e,"soundExpansion"),vortexStatus:i?"V4_UNSUPPORTED":D(e,"vortexEffects")?"ACTIVE":"OFF",carrierStatus:i?"V4_UNSUPPORTED":D(e,"carrierOps")?"ACTIVE":"OFF"}),i&&this.ctx?.emitDiag?.("REALISM_FEATURE_ERROR",{level:"error",simMajor:4,features:["vortexEffects","carrierOps"],message:"Vortex Effects and Carrier Ops require GeoFS V3.9"})}ensureStage(e){if(this.stage)return;let t=window.Cesium?.PostProcessStage,i=window.geofs?.api?.viewer?.scene?.postProcessStages,s=window.geofs?.fx?.atmosphere?.atmospherePostProcessStage;if(!(!t||!i?.add)&&!(s&&!s._ready))try{let a=i.add(new t({fragmentShader:Wt(e),uniforms:{strength:()=>this.uniforms.strength}}));a&&(a.enabled=!1,this.stage=a,this.removeStage=()=>i.remove?.(a))}catch(a){console.warn("[GeoFS Extension] Could not initialize the blackout effect:",a)}}setValue(e,t,i){let s=this.captured.get(e);if(s||this.captured.set(e,s=new Set),!s.has(t)){s.add(t);let a=e[t],r=Object.hasOwn(e,t);this.restores.push(()=>{r?e[t]=a:delete e[t]})}e[t]=i}update(e){let t=window.geofs,i=t?.aircraft?.instance,s=t?.animation?.values;if(this.lastSimMajor!==e.simMajor&&(this.lastSimMajor=e.simMajor,this.emitRealismDiag(this.ctx?.getSettings().realismOptions)),this.aircraft!==i&&(this.resetAircraftSounds(),this.restoreAircraft(),this.aircraft=i),!i||!s||e.paused||e.crashed){this.stage&&(this.stage.enabled=!1);return}let a=e.timestamp,r=e.gForce,l=Zt(),o=e.aircraft?.id??"",d=this.ctx?.getSettings().realismOptions;if(!this.breath){let w=this.ctx?.getAudioUrl?.("");w&&typeof Audio<"u"&&(this.breath=new Audio(w+"cutgbreath.mp3"),this.wind=new Audio(w+"wind.mp3"),this.breath.preload=this.wind.preload="none")}!l||!D(d,"gBreath")?this.breath?.pause():a>=this.nextBreath&&(this.nextBreath=a+3500,r>=3&&this.breath?.play().catch(()=>{}),r>6&&this.ctx?.anchors.showToast("High G-Load \u2014 Pilot Strain Detected","warn")),a>=this.nextWind&&(this.nextWind=a+1e3,!this.checkedAircraftSounds&&D(d,"soundExpansion")&&(Ve.has(o)||Ae.has(o)||ze.has(o)?i.definition?.sounds?.length&&window.audio?.soundplayer?.stopSound&&window.audio?.sounds&&Object.keys(window.audio.sounds).length>0&&(this.aircraftSounds=pt(i),this.aircraftSounds&&(this.checkedAircraftSounds=!0)):this.checkedAircraftSounds=!0),l&&Number(s.accZ)>=50&&D(d,"windAudio")&&this.wind?.play().catch(()=>{})),this.aircraftSounds?.update(e,s);let p=(Number.isFinite(e.dt)&&e.dt>0?Math.min(e.dt,.25):.016)/.01,u=Number.isFinite(r)?r:1,h=D(d,"blackout");l&&h?u>9?(this.overGSeconds+=.05*p,this.overGSeconds>.1&&(this.blackoutActive=!0),this.blackoutActive&&(this.uniforms.strength=Math.min(1,this.uniforms.strength+.001*(u-5)/10*p))):(this.overGSeconds=0,this.uniforms.strength=Math.max(0,this.uniforms.strength-5e-4*p),this.uniforms.strength||(this.blackoutActive=!1)):(this.overGSeconds=0,this.uniforms.strength=0,this.blackoutActive=!1);let m=l&&h&&this.uniforms.strength>0;m&&this.ensureStage(e.simMajor),this.stage&&(this.stage.enabled=m);let x=t?.camera,b=Number.isFinite(e.aoa)?e.aoa:0,E=Number.isFinite(e.kias)?e.kias:0,T=o==="4"||e.groundContact||E<30||b>=85?0:Math.max(0,b-10)*2e-4,A=Math.max(0,E-450)*1e-5,S=Math.abs(u-1)>2?Math.abs(u-1)*1e-4:0,C=T+A+S,g=Number.isFinite(C)?Math.min(.05,C):0;if(g>0&&D(d,"cameraShake")&&x?.translate&&!this.cameraOffset){let w=g*Math.random();if(Number.isFinite(w)&&w>0){x.translate(w,w,w);let f=()=>x.translate?.(-w,-w,-w),v=setTimeout(()=>{this.cameraOffset=void 0,f()},5);this.cameraOffset={undo:f,timer:v}}}if(a>=this.nextPhysics){if(this.nextPhysics=a+100,Yt.has(o)&&D(d,"propwash"))for(let f of i.airfoils??[])this.setValue(f,"propwash",f.forceDirection===2?.005:.01);let w=i.definition;w?.maxRPM===1e4&&typeof s.rpm=="number"&&Number.isFinite(s.rpm)&&D(d,"engineInertia")&&this.setValue(w,"engineInertia",s.rpm<6e3?.2:s.rpm<7e3?.5:1),this.spoilerArmed&&e.groundContact&&(window.controls?.airbrakes&&(window.controls.airbrakes.target=1),this.spoilerArmed=!1)}if(a>=this.nextRotor){this.nextRotor=a+1e3;let w=t?.api?.renderingSettings;w&&D(d,"performanceMode")&&(this.setValue(w,"degradedCollisions",!0),this.setValue(w,"lowResRunways",!0)),D(d,"bladeCollisions")&&Xt.has(o)&&Math.abs(Number(s.aroll)||e.roll)>70&&e.aglFeet<=5&&t?.preferences?.crashDetection&&i.crash?.()}if(ht.has(o)&&D(d,"spinFix")&&!e.groundContact&&e.aglFeet>50){let w=Number(s.atilt)||e.pitch;if(Number.isFinite(w)){if(this.spinSample&&a>=this.spinSample.time+500){if(Math.abs((w-this.spinSample.pitch+540)%360-180)>50){let v=i.rigidBody,y=v?.getAngularVelocity?.();if(Array.isArray(y)&&y.length>=3&&y.every(F=>typeof F=="number"&&Number.isFinite(F))){let F=[Math.max(-2,Math.min(2,y[0]*.5)),Math.max(-2,Math.min(2,y[1]*.5)),Math.max(-2,Math.min(2,y[2]*.5))];v?.setAngularVelocity?.(F)}a>=this.nextSpinToast&&(this.nextSpinToast=a+3e3,this.ctx?.anchors.showToast("Spin Recovery Active"))}this.spinSample=void 0}a>=this.nextSpin&&(this.nextSpin=a+1e3,this.spinSample={time:a,pitch:w})}}else ht.has(o)&&(this.spinSample=void 0);Ae.has(o)&&D(d,"engineInertia")&&this.update777Effects(i,s,e)}update777Effects(e,t,i){let s=i.timestamp,a=i.aglFeet,r=i.kias,l=e.rigidBody;if(s>=this.next777Impulse){this.next777Impulse=s+100;let S=Number.isFinite(i.dt)&&i.dt>0?Math.min(i.dt,.25):.02,C=Math.max(.25,Math.min(2.5,S/.02));if(!i.groundContact&&Number.isFinite(a)&&a>=5&&a<=80&&Number.isFinite(r)&&r>=80&&r<=450&&(!Number.isFinite(i.vs)||i.vs<1500)&&(!Number.isFinite(i.gForce)||i.gForce<1.8)){let g=Math.max(0,Math.min(2500,(80-a)*20*C));Number.isFinite(g)&&g>0&&l?.applyCentralImpulse?.([0,0,g])}if(!i.groundContact&&Number.isFinite(a)&&a>=50&&Number.isFinite(r)&&r>=60&&r<=450&&Number.isFinite(i.aoa)&&i.aoa>12&&i.aoa<75){let g=Number(t.heading360),w=Number.isFinite(g)?g:i.heading;if(Number.isFinite(w)){let f=w*(Math.PI/180),v=Math.min(1500,Math.random()*(i.aoa-12)*50*C);Number.isFinite(v)&&v>0&&l?.applyTorqueImpulse?.([v*Math.sin(f),v*Math.cos(f),0])}}}let o=Number.isFinite(r)?r:0,d=Number(t.yaw),c=Number.isFinite(d)?d:0;this.setValue(t,"tiller",o>=50?c/(o/5):c);let p=Number.isFinite(Number(t.airbrakesPosition))?Number(t.airbrakesPosition):0;this.setValue(t,"spoilersShake",p===1?1-Math.random()/20*(o/200):p),this.setValue(t,"flapsShake",t.flapsPosition===6?Math.random()/20*(o/100):0);let u=Number(t.accZ),h=Number.isFinite(u)?u:9.81,m=Number(e.parts?.wingleft?.lift),x=Number(e.parts?.wingright?.lift),b=Number.isFinite(m)?m:0,E=Number.isFinite(x)?x:0;if(this.setValue(t,"liftLeftWing",-b/2e5+h/20),this.setValue(t,"liftRightWing",-E/2e5+h/20),Number.isFinite(a)&&a<=18){let S=16.152139372973117*Math.max(0,a)/15;this.setValue(t,"gearTilt",Math.max(18.5,Math.min(20,S)))}let T=e.setup?.parts;if(T){let S=T[106]?.animations?.[1];S&&this.setValue(S,"value","tiller");for(let w=60;w<=73;w++){let f=T[w]?.animations?.[0];f&&this.setValue(f,"value","spoilersShake")}let C=[[3,1],[4,1],[5,0],[6,0],[7,1]];for(let[w,f]of C){let v=T[w]?.animations?.[f];v&&this.setValue(v,"value","liftLeftWing")}let g=[[8,1],[9,0],[10,0]];for(let[w,f]of g){let v=T[w]?.animations?.[f];v&&this.setValue(v,"value","liftRightWing")}}let A=e.definition?.parts;if(A)for(let S of[87,98]){let C=A[S]?.animations?.[0];C&&(this.setValue(C,"value","gearTilt"),this.setValue(C,"offset",-27),"lt"in C&&this.setValue(C,"lt",void 0))}}resetAircraftSounds(){this.aircraftSounds?.restore(),this.aircraftSounds=void 0,this.checkedAircraftSounds=!1}restoreAircraft(){for(let e of this.restores.reverse())e();this.restores=[],this.captured=new WeakMap,this.spoilerArmed=!1,this.spinSample=void 0,this.next777Impulse=0}destroy(){typeof document<"u"&&document.removeEventListener("keydown",this.onKeyDown),this.optionKey="",this.lastSimMajor=null,this.resetAircraftSounds(),this.removeStage?.(),this.stage=null,this.removeStage=void 0,this.restoreAircraft(),this.aircraft=void 0,this.cameraOffset&&(clearTimeout(this.cameraOffset.timer),this.cameraOffset.undo(),this.cameraOffset=void 0),this.breath?.pause(),this.wind?.pause(),this.breath=this.wind=void 0,this.uniforms.strength=0,this.blackoutActive=!1,this.overGSeconds=0,this.ctx=null}};var Jt={gearFront:"Nose Gear",gearLeft:"Left Main Gear",gearRight:"Right Main Gear",ailerons:"Ailerons",elevators:"Elevators",rudder:"Rudder",flaps:"Flaps",brakes:"Brakes",spoilers:"Spoilers",electrical:"Electrical",fuelLeak:"Fuel Leak",structural:"Structural",pressurization:"Pressurization",mcas:"MCAS",pitotStatic:"Pitot-Static"},Qt={gearFront:"Nose/Tail wheel collapse. May cause steering loss and ground loops.",gearLeft:"Left main landing gear collapse. Aircraft will tilt heavily to the left.",gearRight:"Right main landing gear collapse. Aircraft will tilt heavily to the right.",ailerons:"Roll surface jam. Total loss of roll control; aircraft will be hard to level.",elevators:"Pitch surface jam. Loss of pitch control; aircraft may become unstable.",rudder:"Yaw surface jam. Loss of directional control; critical during crosswinds.",flaps:"Hydraulic loss preventing flap extension. Higher landing speeds expected.",brakes:"Wheel brakes non-functional. Requires long runway or reverse thrust to stop.",spoilers:"Speedbrakes fail to deploy. Difficult to slow down after touchdown.",electrical:"Total instrument blackout. Autopilot and glass cockpit parts go dark.",fuelLeak:"Critical fuel loss. Engines will starve and flame out in 120 seconds.",structural:"Airframe damage. Severe vibrations and speed-limited stability.",pressurization:"Cabin decompression above 9,000 ft causing severe turbulence.",mcas:"Erroneous stabilizer commands cycling nose-down trim repeatedly.",pitotStatic:"Air data sensor failure. Airspeed and altitude instruments read zero."};function B(n,e,t){let i=Object.hasOwn(n,e),s=n[e];return{apply:()=>{n[e]=t},restore:()=>{i?n[e]=s:delete n[e]}}}var ei={gearFront:[0,/front|nose|tail|steer/],gearLeft:[1,/left|l_g|main l|l-gear/],gearRight:[2,/right|r_g|main r|r-gear/]};function W(n){return n.startsWith("engine")?`Engine ${Number(n.slice(6))+1}`:Jt[n]}function je(n){return n!=="structural"}function ti(n){return n==="structural"?0:n==="gearFront"||n==="gearLeft"||n==="gearRight"?.7:n==="fuelLeak"||n==="flaps"||n==="brakes"||n==="spoilers"?.75:1}function ii(n,e,t){let i=Math.max(0,Math.min(1,e/100*ti(n)));return i>0&&t<i}function ft(n){if(n.startsWith("engine")){let e=Number(n.slice(6))+1;return{title:`ENG ${e} FAILURE`,items:[{text:`THR LEVER ${e} - IDLE`,desc:"Reduce fuel flow and check for engine fire."},{text:`FUEL COCK ${e} - OFF`,desc:"Isolate damaged engine from fuel manifold."},{text:"IGNITION & APU BLEED - SELECT RELIGHT",desc:"Prepare APU cross-bleed for in-flight restart attempt."},{text:"AIRSPEED - MAINTAIN V2 / BEST L/D",desc:"Fly symmetric rudder toward live engine."}]}}switch(n){case"gearFront":case"gearLeft":case"gearRight":return{title:`${W(n).toUpperCase()} FAULT`,items:[{text:"LANDING GEAR LEVER - CYCLE DOWN",desc:"Verify hydraulic pressure and downlock pins."},{text:"ALTERNATE GEAR EXTEND - PULL",desc:"Release mechanical uplift latches via free-fall."},{text:"INDICATION LIGHTS - CHECK 3 GREEN",desc:"Confirm green downlock before committing to landing."}]};case"ailerons":return{title:"AILERON JAM",items:[{text:"HYDRAULIC AILERON BYPASS - ACTUATE",desc:"Switch to secondary servo actuator loop."},{text:"USE RUDDER TO KEEP WINGS LEVEL",desc:"Avoid abrupt roll inputs while troubleshooting."}]};case"elevators":return{title:"ELEVATOR JAM",items:[{text:"STAB TRIM - SELECT BACKUP",desc:"Switch pitch authority to electric stabilizer trim."},{text:"USE THRUST TO CONTROL PITCH",desc:"Increase thrust pitches nose up; idle lowers nose."}]};case"rudder":return{title:"RUDDER JAM",items:[{text:"YAW DAMPER - OFF",desc:"Disconnect yaw damper servo from rudder actuator."},{text:"DIFFERENTIAL THRUST - AS REQ",desc:"Maintain directional alignment using asymmetric thrust."}]};case"flaps":return{title:"FLAPS JAM / HYD LOSS",items:[{text:"ALTN FLAP MOTOR - ENGAGE",desc:"Use electric backup drive to cycle flap position."},{text:"COMPUTE NO-FLAP VREF (+15 KTS)",desc:"Increase approach target speed if slats/flaps stay jammed."}]};case"brakes":return{title:"WHEEL BRAKES FAILURE",items:[{text:"ANTI-SKID / ALT BRAKE ACCUM - CYCLE",desc:"Pressurize standby brake accumulator."},{text:"PREPARE MAX REVERSE & SPOILERS",desc:"Ensure full spoilers immediately upon touchdown."}]};case"spoilers":return{title:"SPOILERS INOPERATIVE",items:[{text:"HYDRAULIC SYS B - RESET",desc:"Check spoiler servo valve solenoid."},{text:"FLY STABILIZED ON VREF",desc:"Avoid floating in flare due to reduced rollout drag."}]};case"electrical":return{title:"TOTAL ELECTRICAL FAILURE",items:[{text:"APU - START IMMEDIATELY",desc:"Establish emergency backup electrical generation."},{text:"BUS TIE & GEN 1/2 - CYCLE RESET",desc:"Restore main instrument & autopilot busses."},{text:"STANDBY COMPASS & VISUAL FLY",desc:"Maintain aircraft pitch & bank visually until restored."}]};case"fuelLeak":return{title:"MAJOR FUEL LEAK",items:[{text:"FUEL CROSSFEED - CLOSED",desc:"Isolate undamaged wing tank from leaking supply."},{text:"LEAK VALVE ISOLATION - ATTEMPT RECOVERY",desc:"Engines flame out in 120s unless isolated."},{text:"LAND - NEAREST SUITABLE FIELD",desc:"Declare emergency with ATC immediately."}]};case"structural":return{title:"STRUCTURAL AIRFRAME DAMAGE",items:[{text:"AIRSPEED - REDUCE BELOW 220 KTS",desc:"Permanent structural compromise; minimize aerodynamic load."},{text:"AVOID > 1.5G MANEUVERS",desc:"Shallow bank turns only; divert immediately."}]};case"pressurization":return{title:"CABIN DEPRESSURIZATION",items:[{text:"OXYGEN MASKS - ON & 100%",desc:"Establish supplemental breathing above 10,000 ft."},{text:"EMERGENCY DESCENT <= 10,000 FT",desc:"Idle thrust, extend speedbrakes, descend cleanly."},{text:"OUTFLOW VALVE - MANUAL CLOSE",desc:"Attempt cabin pressure seal restoration."}]};case"mcas":return{title:"UNCOMMANDED NOSE DOWN TRIM",items:[{text:"STAB TRIM CUTOUT - CUTOUT",desc:"Disconnect runaway stabilizer trim motor."},{text:"CONTROL COLUMN - PULL TO LEVEL",desc:"Manually arrest nose-down pitch excursion."},{text:"TRIM WHEEL - MANUAL RESET",desc:"Re-trim airframe manually."}]};case"pitotStatic":return{title:"PITOT-STATIC SENSOR FAILURE",items:[{text:"PITOT / PROBE HEAT - HIGH",desc:"Clear icing obstruction from primary pitot tubes."},{text:"ALTERNATE STATIC SOURCE - OPEN",desc:"Switch ADC to standby static port."},{text:"FLY PITCH + POWER ATTITUDE",desc:"Hold +4 deg pitch / 65% thrust if sensors stay frozen."}]};default:return{title:`${W(n).toUpperCase()} ABNORMAL`,items:[{text:"MAINTAIN AIRCRAFT CONTROL & AIRSPEED",desc:"Establish safe altitude and monitor primary flight instruments."},{text:"DIVERT TO NEAREST SUITABLE AIRPORT",desc:"Prepare emergency crew & abnormal landing briefing."}]}}}function si(n){if(n.startsWith("engine")){let e=Number(n.slice(6))+1;return{title:`ENG ${e} UNRECOVERABLE CONTINGENCY`,items:[{text:`ENG ${e} MASTER - STAY OFF`,desc:"Do not attempt further restarts; fire risk."},{text:"TRIM RUDDER TOWARD LIVE ENGINE",desc:"Maintain coordinated flight and climb gradient."},{text:"FLY SINGLE-ENGINE LANDING VREF+5",desc:"Expect reduced go-around climb capability."}]}}switch(n){case"gearFront":case"gearLeft":case"gearRight":return{title:`${W(n).toUpperCase()} ABNORMAL LANDING`,items:[{text:"DUMP / BURN FUEL TO LIGHT WEIGHT",desc:"Reduce touchdown speed and impact energy."},{text:"HOLD AFFECTED SIDE OFF UNTIL LOW SPEED",desc:"Lower nose/wing gently during rollout."},{text:"FUEL & BATTERY MASTER - OFF ON TOUCHDOWN",desc:"Eliminate post-slide spark hazards."}]};case"ailerons":return{title:"NO-AILERON CONTINGENCY",items:[{text:"BANK EXCLUSIVELY WITH RUDDER",desc:"Coordinate gentle yaw inputs to keep wings level."},{text:"WIDE FINAL ALIGNMENT ONLY",desc:"Avoid low-altitude S-turns on short final."}]};case"elevators":return{title:"NO-ELEVATOR CONTINGENCY",items:[{text:"FLY GLIDEPATH USING THROTTLE",desc:"Small throttle pulses smoothly adjust vertical speed."},{text:"FLAPS - MINIMUM REQUIRED",desc:"Avoid large configuration pitch moments."}]};case"rudder":return{title:"JAMMED RUDDER CONTINGENCY",items:[{text:"SELECT RUNWAY INTO WIND",desc:"Avoid crosswind landing beyond bank capability."},{text:"USE ASYMMETRIC BRAKES BELOW 60 KTS",desc:"Maintain centerline after nosewheel lowers."}]};case"flaps":return{title:"NO-FLAP CONTINGENCY LANDING",items:[{text:"APPROACH SPEED - VREF + 15 KTS",desc:"Compensate for lost high-lift boundary margin."},{text:"SHALLOW FLARE & LONG RUNWAY",desc:"Higher ground speed increases stopping distance."}]};case"brakes":return{title:"BRAKELESS ROLLOUT SOLUTION",items:[{text:"TOUCH DOWN NEAR RUNWAY THRESHOLD",desc:"Maximize available rollout pavement."},{text:"MAX REVERSE + SPOILERS ON TOUCHDOWN",desc:"Keep reverse active down to taxi speed."}]};case"spoilers":return{title:"NO-SPOILER ROLLOUT SOLUTION",items:[{text:"TOUCH DOWN ON VREF WITH FIRM CONTACT",desc:"Firm contact minimizes float and aquaplaning."},{text:"MAX WHEEL BRAKES & REVERSE",desc:"Maintain continuous braking until taxi speed."}]};case"electrical":return{title:"TOTAL BLACKOUT CONTINGENCY",items:[{text:"FLY PITCH & HORIZON VISUALLY",desc:"Autopilot and A/THR remain offline permanently."},{text:"DAYLIGHT VMC DIVERT",desc:"Land at nearest visual runway immediately."}]};case"fuelLeak":return{title:"FUEL STARVATION CONTINGENCY",items:[{text:"ESTABLISH BEST GLIDE SPEED",desc:"Clean configuration (flaps 0, gear UP) for max range."},{text:"SELECT EMERGENCY LANDING FIELD NOW",desc:"Prepare deadstick approach before total flameout."}]};case"pressurization":return{title:"UNPRESSURIZED CRUISE SOLUTION",items:[{text:"REMAIN AT OR BELOW 10,000 FT MSL",desc:"Clear mountains; monitor increased ALTITUDE BURN."},{text:"DIVERT TO NEAREST SUITABLE AIRPORT",desc:"Plan unhurried VMC/ILS approach."}]};case"mcas":return{title:"MCAS DISCONNECT SOLUTION",items:[{text:"KEEP STAB TRIM CUTOUT OFF",desc:"Do not re-engage electric stab trim for rest of flight."},{text:"EXTEND FLAPS TO DAMP PITCH SENSITIVITY",desc:"MCAS stays inhibited when flaps > 0."}]};case"pitotStatic":return{title:"UNRELIABLE AIRSPEED TABLE SOLUTION",items:[{text:"CLIMB: +10 DEG PITCH / 85% N1",desc:"Disregard primary ASI and Altimeter."},{text:"APPROACH: +3 DEG PITCH / 58% N1",desc:"Cross-check HUD AGL & Ground Speed on final."}]};default:return ft(n)}}function ni(n,e,t){let i=[B(n,"target",e),B(n,"position",t),B(n,"positionTarget",t),B(n,"delta",0)];return{apply:()=>i.forEach(s=>s.apply()),restore:()=>i.forEach(s=>s.restore())}}function ai(n){let e=window.geofs?.fx,t=e?.ParticleEmitter,i=n.object3d?.worldPosition,s=n.points?.contrailAnchor??(i&&{worldPosition:i});if(!(!t||!s))try{let a=new t({anchor:s,duration:1e10,rate:.03,life:1e4,easing:"easeOutQuart",startScale:.01,endScale:.2,randomizeStartScale:.01,randomizeEndScale:.15,startOpacity:1,endOpacity:.2,startRotation:"random",texture:"whitesmoke"}),r=window.Cesium?.Color,l=r&&new r(.1,.1,.1,1);return{apply:()=>{for(let o of Object.values(e.particles??{}))o?._emitter===a&&l&&o.setColor?.(l)},restore:()=>{a.destroy();for(let o of Object.values(e.particles??{}))o?._emitter===a&&o.destroy()}}}catch(a){console.warn("[GeoFS Extension] Could not start engine smoke:",a);return}}var ri=[["gear","Landing Gear",["gearFront","gearLeft","gearRight"]],["ctrl","Flight Controls",["ailerons","elevators","rudder"]],["hyd","Hydraulics & Systems",["flaps","brakes","spoilers"]],["adv","Advanced Emergencies",["electrical","fuelLeak","structural","pressurization","mcas","pitotStatic"]]],oi=`
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
`,Fe=class{id="failure-simulator";name="Failure Simulator";description="Draggable modal failures with probability rolls, emergency QRH overrides, and verified recovery.";supportedMajors=[3,4];defaultEnabled=!1;ctx=null;aircraft;active=new Map;chances=new Map;collapsedSections=new Set;nextProbabilityMs=0;pill=null;modal=null;bodyEl=null;probBtn=null;probInfoEl=null;styleEl=null;restoreWeather;lastAltitude=0;lastTimestamp=0;unmounts=[];init(e){this.ctx=e;let t=e.getSettings().failureSystemChances??{};for(let[i,s]of Object.entries(t))typeof s=="number"&&Number.isFinite(s)&&this.chances.set(i,Math.max(0,Math.min(1,s)));if(this.unmounts.push(e.onEvent("failure:request-active",()=>{for(let i of this.active.keys())this.emitFailure(i)})),this.unmounts.push(e.onEvent("failure:attempt-recovery",({type:i})=>{this.attemptRecovery(i)})),typeof document<"u"){let i=document.createElement("style");i.id="geofs-ext-failure-styles",i.textContent=oi,document.head?.appendChild(i),this.styleEl=i;let s=document.createElement("button");s.type="button",s.id="fail-btn",s.className="geofs-ext-fail-pill",s.textContent="FAILURES",s.title="Open Failure Simulator Modal (Drag to move)",document.body?.appendChild(s),this.pill=s,this.unmounts.push(e.anchors.makeDraggable(s,"geofs_ext_fail_pill_pos",s)),this.unmounts.push(()=>s.remove()),s.addEventListener("click",()=>{if(s.dataset.justDragged==="1"||!this.modal)return;let l=this.modal.style.display==="none"||!this.modal.style.display;this.modal.style.display=l?"flex":"none",l&&(this.render(),e.anchors.bringToFront(this.modal),e.anchors.clampElementToViewport(this.modal))});let a=document.createElement("div");a.id="geofs-failure-menu",a.style.display="none",a.innerHTML=`
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
      `,document.body?.appendChild(a),this.modal=a,this.bodyEl=a.querySelector('[data-role="sections"]'),this.probBtn=a.querySelector("#enBtn"),this.probInfoEl=a.querySelector('[data-role="prob-info"]');let r=a.querySelector("#fail-header")??a;this.unmounts.push(e.anchors.makeDraggable(a,"geofs_ext_fail_modal_pos",r)),this.unmounts.push(()=>a.remove()),a.querySelector('[data-role="close"]')?.addEventListener("click",()=>{a.style.display="none"}),a.querySelector('[data-role="clear-all"]')?.addEventListener("click",()=>this.clear()),this.probBtn?.addEventListener("click",()=>{e.updateSettings({failureProbabilitiesEnabled:!e.getSettings().failureProbabilitiesEnabled})})}this.aircraft=window.geofs?.aircraft?.instance,this.syncProbabilityUi(e.getSettings()),this.render()}updatePillBadge(){if(!this.pill)return;let e=this.active.size;this.pill.textContent=e>0?`FAILURES (${e})`:"FAILURES",this.pill.classList.toggle("has-failures",e>0)}syncProbabilityUi(e){if(this.probBtn){let t=!!e.failureProbabilitiesEnabled;this.probBtn.textContent=t?"DISABLE PROBABILITY":"ENABLE PROBABILITY",this.probBtn.className=`geofs-ext-fail-btn ${t?"geofs-ext-fail-btn--danger":"geofs-ext-fail-btn--ok"}`,this.probBtn.setAttribute("aria-pressed",String(t))}if(this.probInfoEl){let t=Math.max(10,e.failureProbabilityIntervalSec||60),i=e.failureProbabilitiesEnabled&&this.nextProbabilityMs>this.lastTimestamp?Math.ceil((this.nextProbabilityMs-this.lastTimestamp)/1e3):t,s=e.failureProbabilitiesEnabled?`Roll every ${t}s \xB7 Next: ${i}s`:`Probability off (${t}s cycle)`;this.probInfoEl.innerHTML=`<span>${s}</span><span>Recovery: ${e.failureRecoveryChancePct??60}%</span>`}}persistChances(){let e={};for(let[t,i]of this.chances.entries())i>0&&(e[t]=Number(i.toFixed(3)));this.ctx?.updateSettings({failureSystemChances:e})}render(){if(this.updatePillBadge(),!this.bodyEl)return;let e=this.aircraft?.engines?.length??(this.aircraft?.engine?1:0),t=Array.from({length:e},(s,a)=>`engine${a}`),i=[...ri,["eng","Engines",t]];this.bodyEl.replaceChildren(...i.filter(([,,s])=>s.length>0).map(([s,a,r])=>{let l=document.createElement("div"),o=this.collapsedSections.has(s),d=document.createElement("div");d.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:5px 9px;background:rgba(255,255,255,0.06);border:1px solid rgba(136,136,136,0.3);border-radius:10px;cursor:pointer;";let c=document.createElement("div");c.style.cssText="display:flex;align-items:center;gap:6px;";let p=document.createElement("span");p.style.cssText=`font-size:9px;transition:transform 0.15s;transform:${o?"rotate(0deg)":"rotate(90deg)"};`,p.textContent="\u25B6";let u=document.createElement("span");u.style.cssText="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;",u.textContent=a,c.append(p,u);let h=document.createElement("div");h.style.cssText="display:flex;gap:4px;";for(let E of["AUTO","FAIL","FIX"]){let T=document.createElement("button");T.type="button",T.className=`geofs-ext-fail-btn ${E==="FAIL"?"geofs-ext-fail-btn--danger":E==="FIX"?"geofs-ext-fail-btn--ok":""}`,T.textContent=E,T.setAttribute("aria-label",`${E} ${a}`),T.addEventListener("click",A=>{A.stopPropagation();for(let S of r)E==="AUTO"?this.chances.set(S,Number((Math.random()*(s==="adv"?.05:.1)).toFixed(2))):E==="FAIL"?this.fail(S,!1):this.active.has(S)&&this.fix(S);E==="AUTO"&&this.persistChances(),this.render()}),h.appendChild(T)}d.append(c,h),d.addEventListener("click",()=>{this.collapsedSections.has(s)?this.collapsedSections.delete(s):this.collapsedSections.add(s),this.render()});let m=r.length,x=m<=1?1:m===2||m===4?2:3,b=document.createElement("div");b.dataset.sectionGridCols=String(x),b.style.cssText=`display:${o?"none":"grid"};grid-template-columns:repeat(${x},minmax(0,1fr));gap:5px;padding-top:5px;`;for(let E of r)b.appendChild(this.systemRow(E));return l.append(d,b),l}))}systemRow(e){let t=this.active.has(e),i=Math.round((this.chances.get(e)??0)*100),s=e.startsWith("engine")?"Thrust loss and heavy smoke. Expect yaw asymmetry and reduced climb performance.":Qt[e],a=document.createElement("div");a.dataset.failureType=e,a.title=s,a.style.cssText="min-width:0;padding:6px 7px;background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.28);border-radius:10px;display:flex;flex-direction:column;gap:4px;";let r=document.createElement("div");r.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:4px;min-width:0;";let l=document.createElement("div");l.style.cssText="display:flex;align-items:center;gap:5px;flex:1;min-width:0;";let o=document.createElement("div");o.id=`led-${e}`,o.className=`geofs-ext-fail-led ${t?"is-failed":""}`;let d=document.createElement("span");d.style.cssText="font-size:10px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",d.textContent=W(e),l.append(o,d);let c=document.createElement("span");c.style.cssText="font-size:9px;color:#aaaaaa;flex-shrink:0;",c.textContent=`${i}%`,r.append(l,c);let p=document.createElement("input");p.type="range",p.min="0",p.max="100",p.step="1",p.value=String(i),p.style.cssText="width:100%;height:4px;margin:0;accent-color:#4caf50;cursor:pointer;",p.setAttribute("aria-label",`${W(e)} probability percentage`),p.addEventListener("input",()=>{c.textContent=`${p.value}%`,this.chances.set(e,Math.max(0,Math.min(100,Number(p.value)||0))/100)}),p.addEventListener("change",()=>this.persistChances());let u=document.createElement("div");u.style.cssText="display:flex;gap:3px;";let h=document.createElement("button");h.type="button",h.dataset.action="fail",h.className="geofs-ext-fail-btn geofs-ext-fail-btn--danger",h.style.cssText="flex:1;min-width:0;padding:3px 2px;font-size:8.5px;",h.textContent="FAIL",h.disabled=t,h.addEventListener("click",()=>this.fail(e));let m=document.createElement("button");m.type="button",m.dataset.action="recover",m.className="geofs-ext-fail-btn geofs-ext-fail-btn--warn",m.style.cssText="flex:1;min-width:0;padding:3px 2px;font-size:8.5px;",m.textContent="REC",m.disabled=!t||!je(e),m.title=je(e)?"Roll probability recovery via QRH procedure":"Permanent airframe damage cannot be repaired in flight",m.addEventListener("click",()=>this.attemptRecovery(e));let x=document.createElement("button");return x.type="button",x.dataset.action="fix",x.className="geofs-ext-fail-btn geofs-ext-fail-btn--ok",x.style.cssText="flex:1;min-width:0;padding:3px 2px;font-size:8.5px;",x.textContent="FIX",x.disabled=!t,x.addEventListener("click",()=>{this.fix(e),this.render()}),u.append(h,m,x),a.append(r,p,u),a}effect(e,t){let i=Date.now(),s=(a,r=1e3,l)=>({...a,intervalMs:r,dueAt:i,verifyRestored:l});if(e.startsWith("engine")){let a=Number(e.slice(6)),r=t.engines?.[a]??(a===0?t.engine:void 0);if(!r)return;let l=r.thrust,o=B(r,"thrust",0),d=ai(r);return s({apply:()=>{o.apply(),d?.apply()},restore:()=>{o.restore(),d?.restore()}},50,()=>r.thrust===l)}switch(e){case"gearFront":case"gearLeft":case"gearRight":{let[a,r]=ei[e],l=t.suspensions??[],o=(l.filter(p=>r.test(p.name?.toLowerCase()??"")).at(-1)??l[a])?.collisionPoints?.[0];if(!o)return;let d=o[2],c=Math.max((Number.isFinite(d)?d:-2.5)+2,.5);return s(B(o,2,c),1e3,()=>o[2]===d)}case"ailerons":case"elevators":case"rudder":{let a=e==="rudder"?e:e.slice(0,-1),r=[],l=(t.airfoils??[]).flatMap(o=>!o.object3d||!o.name?.toLowerCase().includes(a)?[]:(r.push({object3d:o.object3d,orig:o.object3d._scale}),[B(o.object3d,"_scale",[0,0,0])]));return l.length?s({apply:()=>l.forEach(o=>o.apply()),restore:()=>l.forEach(o=>o.restore())},1e3,()=>r.every(o=>JSON.stringify(o.object3d?._scale)===JSON.stringify(o.orig))):void 0}case"flaps":case"spoilers":{let a=e==="flaps"?window.controls?.flaps:window.controls?.airbrakes,r=a?.position;if(!a||typeof r!="number"||!Number.isFinite(r))return;let l=e==="flaps"?Math.max(0,t.definition?.flapsSteps??0):1,o=Math.max(0,Math.min(l,e==="flaps"?Math.round(a.target??0):r));return s(ni(a,o,r),50,()=>a.delta!==0)}case"brakes":return window.controls&&s(B(window.controls,"brakes",0),500);case"electrical":{let a=window.geofs?.autopilot,r=window.instruments,l=r?.visible!==!1,o=(t.cockpitSetup?.parts??[]).slice(1,6).flatMap(d=>d?.object3d?[B(d.object3d,"_scale",[0,0,0])]:[]);return s({apply:()=>{a?.turnOff?.(),r?.hide?.(),o.forEach(d=>d.apply())},restore:()=>{o.forEach(d=>d.restore()),l&&r?.show?.()}},1e3,()=>!l||r?.visible!==!1)}case"pitotStatic":{let a=window.instruments,r=a?.update;if(!a||!r)return;let l=function(...o){let d=window.geofs?.animation?.values;if(!d)return r.apply(this,o);let c=B(d,"kias",0),p=B(d,"altitude",0);try{return c.apply(),p.apply(),r.apply(this,o)}finally{c.restore(),p.restore()}};return s({apply:()=>{a.update===r&&(a.update=l)},restore:()=>{a.update===l&&(a.update=r)}},1e3,()=>a.update===r)}case"fuelLeak":{let a=!1;return{intervalMs:1e3,dueAt:i+12e4,apply:()=>{t.engine?.on!==!1&&(a=(this.ctx?.sim.stopEngines()??!1)||a)},restore:()=>{!a||t.crashed||t!==window.geofs?.aircraft?.instance||(t.startEngines?t.startEngines():t.startEngine?.())}}}case"structural":case"pressurization":{let a=window.weather?.definition;return a?(this.restoreWeather??=B(a,"turbulences",3).restore,s({apply:()=>this.applyWeather(),restore:()=>this.applyWeather()},1e3)):void 0}case"mcas":{let a=window.controls;if(!a)return;let r=a.elevatorTrimMin,l=B(a,"elevatorTrimMin",-10),o=B(a,"elevatorTrim",a.elevatorTrim);return s({apply:d=>{l.apply(),d&&!d.autopilotOn&&a.flaps?.position===0&&(d.timestamp-i)%1e4<5e3&&(a.elevatorTrim??0)>-10&&(a.elevatorTrim=(a.elevatorTrim??0)-.01)},restore:()=>{l.restore(),o.restore()}},50,()=>a.elevatorTrimMin===r)}}}applyWeather(){let e=window.weather?.definition;e&&this.active.has("structural")?e.turbulences=3:e&&this.active.has("pressurization")?e.turbulences=Math.max(0,(this.lastAltitude-9e3)/5e3):(this.restoreWeather?.(),this.restoreWeather=void 0)}emitFailure(e){this.ctx?.emitEvent("failure:triggered",{type:e,procedure:ft(e),recoverable:je(e)})}attemptRecovery(e,t){if(!this.active.has(e)||!this.ctx)return!1;let i=this.ctx.getSettings().failureRecoveryChancePct??60,s=t??Math.random();return ii(e,i,s)&&this.fix(e)?(this.ctx.anchors.showToast(`${W(e)} RECOVERED & RESTORED`,"info"),this.render(),!0):(this.ctx.emitDiag?.("RECOVERY_FAILED",{type:e}),this.ctx.anchors.showToast(`${W(e)} recovery failed \u2014 Contingency checklist loaded`,"critical"),this.ctx.emitEvent("failure:contingency",{type:e,procedure:si(e)}),this.render(),!1)}fail(e,t=!0){if(!this.aircraft||this.aircraft.crashed||this.active.has(e))return;let i=this.effect(e,this.aircraft);if(!i){this.ctx?.emitDiag?.("FAILURE_SYSTEM_ERROR",{level:"error",type:e,system:W(e),reason:"Target control surface or system missing on current aircraft"});return}this.active.set(e,i),e!=="fuelLeak"&&i.apply(),this.ctx?.audio.playGpwsAlert(),this.ctx?.anchors.showToast(`${W(e)} failure`,"critical"),this.ctx?.emitDiag?.("FAILURE_TRIGGERED",{type:e}),this.emitFailure(e),t&&this.render()}fix(e){let t=this.active.get(e);if(!t)return!1;this.active.delete(e),t.restore();let i=t.verifyRestored?t.verifyRestored():!0;return this.ctx?.emitDiag?.("RESTORE_VERIFIED",{type:e,verified:i}),this.ctx?.emitEvent("failure:cleared",{type:e}),i}clear(){for(let e of[...this.active.keys()].reverse())this.fix(e);this.render()}onSettingsChange(e){this.syncProbabilityUi(e)}update(e){let t=window.geofs?.aircraft?.instance;if(t!==this.aircraft&&(this.clear(),this.aircraft=t,this.render()),e.paused||e.crashed||!this.ctx)return;this.lastAltitude=e.altitude,this.lastTimestamp=e.timestamp;for(let a of this.active.values())e.timestamp>=a.dueAt&&(a.apply(e),a.dueAt=e.timestamp+a.intervalMs);let i=this.ctx.getSettings(),s=Math.max(1e4,(i.failureProbabilityIntervalSec||60)*1e3);if(!i.failureProbabilitiesEnabled)this.nextProbabilityMs=0;else if(this.nextProbabilityMs===0)this.nextProbabilityMs=e.timestamp+s;else if(e.timestamp>=this.nextProbabilityMs){this.nextProbabilityMs=e.timestamp+s;for(let[a,r]of this.chances)r>0&&Math.random()<r&&this.fail(a)}this.modal&&this.modal.style.display!=="none"&&this.syncProbabilityUi(i)}destroy(){this.clear();for(let e of this.unmounts)e();this.unmounts=[],this.styleEl?.remove(),this.styleEl=null,this.pill=null,this.modal=null,this.bodyEl=null,this.probBtn=null,this.probInfoEl=null,this.aircraft=void 0,this.ctx=null,this.nextProbabilityMs=0}};var li="data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="22" fill="none" stroke="#ffffff" stroke-width="7"/><line x1="16" y1="64" x2="42" y2="64" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/><line x1="86" y1="64" x2="112" y2="64" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/><line x1="64" y1="20" x2="64" y2="42" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/></svg>');function di(n,e,t,i){let s=e.x-n.x,a=e.y-n.y,r=e.z-n.z;if(i<=0||i>5||s===0&&a===0&&r===0)return null;let l=1.5/i,o={x:t.x+s*l,y:t.y+a*l,z:t.z+r*l};return Object.values(o).every(Number.isFinite)?o:null}function ci(n,e,t){let s=e.fpvResolutionMode==="lowres"||e.fpvResolutionMode==="auto"&&t<=.6?"lowres":"hires",a=s==="lowres"?"fpv_lowres.png":"fpv_hires.png";return{url:n?.getAssetUrl?.(a)||li,variant:s}}function gt(n){return n<-.06?"night":n<.08?"twilight":"day"}function qe(n){let e=(n%24+24)%24;return e<5.5||e>=19.5?"night":e<7||e>=18?"twilight":"day"}function mt(){let n=typeof window<"u"?window:void 0,e=n?.geofs,t="day",i=e?.environment?.sunElevation;if(typeof i=="number"&&Number.isFinite(i))t=gt(i);else{let s=e?.camera?.lla||e?.aircraft?.instance?.llaLocation,a=e?.api?.viewer?.clock?.currentTime,r=n?.Cesium,l=!1;if(a&&r)try{let o=r.Simon1994PlanetaryPositions?.computeSunPositionInEarthInertialFrame?.(a),d=r.Transforms?.computeIcrfToFixedMatrix?.(a)||r.Transforms?.computeTemeToPseudoFixedMatrix?.(a);if(o&&d&&r.Matrix3?.multiplyByVector&&r.Cartesian3?.fromDegrees&&s?.every(Number.isFinite)){let c=r.Matrix3.multiplyByVector(d,o,new r.Cartesian3),p=r.Cartesian3.fromDegrees(s[1],s[0],s[2]??0),u=Math.hypot(c.x,c.y,c.z),h=Math.hypot(p.x,p.y,p.z);if(u>0&&h>0){let m=(c.x*p.x+c.y*p.y+c.z*p.z)/(u*h);Number.isFinite(m)&&(t=gt(m),l=!0)}}if(!l&&r.JulianDate?.toDate){let c=r.JulianDate.toDate(a);if(c instanceof Date&&Number.isFinite(c.getTime())){let p=c.getUTCHours()+c.getUTCMinutes()/60+c.getUTCSeconds()/3600,u=s&&Number.isFinite(s[1])?s[1]:0;t=qe(p+u/15),l=!0}}}catch{}if(!l){let o=n?.weather?.localTime,d=e?.environment?.time;typeof o=="number"&&Number.isFinite(o)?t=qe(o):typeof d=="number"&&Number.isFinite(d)?t=qe(d):(e?.night===!0||typeof document<"u"&&document.body?.classList?.contains("geofs-night"))&&(t="night")}}return t==="night"?{phase:t,color:"#ffffff",textShadow:"0 1px 2px rgba(0, 0, 0, 0.9)"}:t==="twilight"?{phase:t,color:"#f8fafc",textShadow:"0 1px 2px rgba(0, 0, 0, 0.85)"}:{phase:t,color:"#000000",textShadow:"none"}}function ui(n,e){let t=Number.isFinite(n.vs)?n.vs:0,i=Number.isFinite(n.aoa)?n.aoa:0,s=Number.isFinite(n.kias)?n.kias:0,a=n.aglFeet===void 0||!Number.isFinite(n.aglFeet)||n.aglFeet>20,r=!n.groundContact&&a&&s>=35,l=i>18&&i<75&&s<180;if(!!(r&&(e?.stalling||l)))return{isWarning:!0,hue:0};let d=t>=0?120+Math.min(1,t/3e3)*80:120-Math.min(1,Math.abs(t)/5e3)*90;return{isWarning:!1,hue:Math.round(d)}}var Me=class{id="flight-path-vector";name="Flight Path Vector";description="GeoFS V3.9 Cesium 3D FPV billboard with bundled hi-res reticle and Glideslope widget.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;visible=!0;lastCameraCartesian=null;lastSample;cesiumEntity=null;currentAssetVariant=null;svgEl=null;birdEl=null;glideslopeEl=null;glideslopeSpan=null;unmounts=[];init(e){this.visible=!0,this.ctx=e,typeof document<"u"&&this.ensureGlideslopeWidget();let t=e.getSettings().keybindings.toggleFpv;this.unmounts.push(e.keybinds.register("fpv-toggle",t,()=>this.toggle()))}onSettingsChange(e){this.ctx?.keybinds.updateCombo("fpv-toggle",e.keybindings.toggleFpv),this.currentAssetVariant=null}toggle(){this.visible=!this.visible,this.lastCameraCartesian=null,this.lastSample=void 0,this.cesiumEntity&&(this.cesiumEntity.show=this.visible),this.birdEl&&(this.birdEl.style.display="none"),this.svgEl&&(this.svgEl.style.display=this.visible?"block":"none"),this.glideslopeEl&&(this.glideslopeEl.style.display=this.visible?"inline-block":"none")}ensureGlideslopeWidget(){if(typeof document>"u"||!document.body)return null;let e=document.getElementById("flightDataDisplay0");e||(e=document.createElement("div"),e.id="flightDataDisplay0",document.body.appendChild(e)),e.style.cssText='position:fixed;bottom:40px;right:calc(10px + 48px + 16px);height:36px;min-width:64px;padding:0 16px;display:inline-block;background:0 0;border:none;border-radius:0;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none;font-family:"Roboto","Helvetica","Arial",sans-serif;font-size:14px;font-weight:400;text-transform:uppercase;overflow:hidden;will-change:box-shadow;transition:box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);text-align:center;line-height:36px;vertical-align:middle;z-index:9999;pointer-events:none;';let t=mt(),i=e.querySelector("span");return i||(e.innerHTML=`<span style="background: 0 0; border: none; border-radius: 2px; color: ${t.color}; text-shadow: ${t.textShadow}; display: inline-block; padding: 0 8px; transition: color .3s ease, text-shadow .3s ease;">Glideslope N/A</span>`,i=e.querySelector("span")),i&&(i.style.color=t.color,i.style.textShadow=t.textShadow,i.dataset.timePhase=t.phase),this.glideslopeEl=e,this.glideslopeSpan=i,e}ensureSvgFallback(){if(this.svgEl||typeof document>"u"||!document.body)return;let e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("viewBox","0 0 100 100"),e.style.cssText="position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147482000;";let t=document.createElementNS("http://www.w3.org/2000/svg","g");t.innerHTML=`
      <circle cx="50" cy="50" r="1.4" fill="none" stroke="#22c55e" stroke-width="0.35" />
      <line x1="46.5" y1="50" x2="48.6" y2="50" stroke="#22c55e" stroke-width="0.35" />
      <line x1="51.4" y1="50" x2="53.5" y2="50" stroke="#22c55e" stroke-width="0.35" />
      <line x1="50" y1="48.6" x2="50" y2="47.1" stroke="#22c55e" stroke-width="0.35" />
    `,t.style.display="none",e.appendChild(t),document.body.appendChild(e),this.svgEl=e,this.birdEl=t}update(e){let t=window.geofs,i=t?.aircraft?.instance,s=t?.camera?.lla,a=window.Cesium?.Cartesian3?.fromDegrees;if(this.updateGlideslopeReadout(e),!this.visible||e.paused||e.crashed||!i||!s?.every(Number.isFinite)||!a){this.cesiumEntity&&(this.cesiumEntity.show=!1),this.birdEl&&(this.birdEl.style.display="none"),this.lastCameraCartesian=null,this.lastSample=void 0;return}let{isWarning:r,hue:l}=ui(e,i),o=t?.api?.viewer?.entities,d=Math.max(.25,Number(t?.api?.renderingSettings?.resolutionScale)||1),c=this.ctx?.getSettings();if(o?.add&&c){let F=a(s[1],s[0],s[2]);if(!F||!Object.values(F).every(Number.isFinite))return;let{url:M,variant:k}=ci(this.ctx,c,d);if(!this.cesiumEntity){let O=(Number(t?.animation?.values?.groundElevationFeet)||0)/3.2808399,I=a(s[1],s[0],Number.isFinite(O)?O:s[2])||F;this.cesiumEntity=o.add({position:I,billboard:{image:M,scale:.03*(1/d),color:window.Cesium?.Color?.LIME}}),this.currentAssetVariant=k,this.ctx?.emitDiag?.("FPV_BILLBOARD_READY",{variant:k,howFar:c.fpvProjectionFactor??15})}let R=Math.max(1,Math.min(100,Number(c.fpvProjectionFactor)||15)),N=null;if(this.lastCameraCartesian){let O=F.x-this.lastCameraCartesian.x,I=F.y-this.lastCameraCartesian.y,K=F.z-this.lastCameraCartesian.z;if(Number.isFinite(O)&&Number.isFinite(I)&&Number.isFinite(K)&&(O!==0||I!==0||K!==0)){let G={x:F.x+R*O,y:F.y+R*I,z:F.z+R*K};Object.values(G).every(Number.isFinite)&&(N=G)}}if(this.lastCameraCartesian=F,this.cesiumEntity.show=this.visible,this.cesiumEntity.billboard){this.currentAssetVariant!==k&&(this.cesiumEntity.billboard.image=M,this.currentAssetVariant=k),this.cesiumEntity.billboard.scale=.03*(1/d);let O=window.Cesium?.Color;this.cesiumEntity.billboard.color=r?O?.RED??"red":O?.fromHsl?.(l/360,1,.5)??O?.LIME??"lime"}N&&(this.cesiumEntity.position=N);return}this.ensureSvgFallback();let p=this.birdEl,u=this.svgEl,h=i.llaLocation,m=t?.api?.viewer?.scene,x=m?.canvas,b=window.Cesium?.SceneTransforms,E=b?.worldToWindowCoordinates??b?.wgs84ToWindowCoordinates;if(!p||!u||!h?.every(Number.isFinite)||!x||!E){p&&(p.style.display="none");return}let T=a(h[1],h[0],h[2]),A=this.lastSample;this.lastSample={aircraft:i,position:T,time:e.timestamp};let S=A?.aircraft===i?di(A.position,T,a(s[1],s[0],s[2]),(e.timestamp-A.time)/1e3):null,C=S&&E(m,S);if(!C||!Number.isFinite(C.x)||!Number.isFinite(C.y)){p.style.display="none";return}let g=u.getBoundingClientRect(),w=x.getBoundingClientRect(),f=Math.min(g.width,g.height);if(f<=0)return;let v=(w.left+C.x-g.left-g.width/2)*100/f,y=(w.top+C.y-g.top-g.height/2)*100/f;p.style.display="",p.setAttribute("transform",`translate(${v.toFixed(2)} ${y.toFixed(2)})`);for(let F of p.children)F.setAttribute("stroke",`hsl(${l}, 100%, 50%)`)}updateGlideslopeReadout(e){let t=this.glideslopeEl??this.ensureGlideslopeWidget();if(!t)return;t.style.display=this.visible?"inline-block":"none";let i=window.geofs,s=i?.animation?.getValue?.("NAV1Direction"),a=Number(i?.animation?.getValue?.("NAV1Distance")),r="N/A";if(s&&Number.isFinite(a)&&(s==="to"||a!==600)&&Number.isFinite(e.aglFeet)){let d=s==="to"?a+600:Math.abs(a-600);if(d>0){let c=Math.atan(e.aglFeet*.3048/d)*(180/Math.PI);Number.isFinite(c)&&(r=c.toFixed(1))}}else typeof e.glideslopeDeviation=="number"&&Number.isFinite(e.glideslopeDeviation)&&(r=e.glideslopeDeviation.toFixed(1));let l=mt(),o=this.glideslopeSpan??t.querySelector("span");o?o.textContent=`Glideslope ${r}`:(t.innerHTML=`<span style="background: 0 0; border: none; border-radius: 2px; color: ${l.color}; text-shadow: ${l.textShadow}; display: inline-block; padding: 0 8px; transition: color .3s ease, text-shadow .3s ease;">Glideslope ${r}</span>`,o=t.querySelector("span"),this.glideslopeSpan=o),o&&(o.style.color=l.color,o.style.textShadow=l.textShadow,o.dataset.timePhase=l.phase)}destroy(){for(let e of this.unmounts)e();if(this.unmounts=[],this.cesiumEntity){try{window.geofs?.api?.viewer?.entities?.remove?.(this.cesiumEntity)}catch{}this.cesiumEntity=null}this.lastCameraCartesian=null,this.lastSample=void 0,this.currentAssetVariant=null,this.svgEl?.remove(),this.svgEl=null,this.birdEl=null,this.glideslopeEl?.remove(),this.glideslopeEl=null,this.glideslopeSpan=null,this.ctx=null}};var pi={Butter:["A flawless touchdown! Absolutely buttery smooth.","Beautifully greased landing. A work of art!","Stunning touchdown! Passengers barely felt the wheels kiss the tarmac."],Silky:["Extremely smooth landing. Silky transition from air to ground.","Superb landing technique. Very gentle touchdown.","Excellent greaser! That was beautifully managed."],Great:["Great landing! A solid, controlled touchdown.","Very clean arrival. Standard professional landing.","Well within limits. Comfortable touchdown."],Firm:["A bit firm, but a positive touchdown.","Firm landing. Definitely felt the gear compress.","A positive touchdown to prevent aquaplaning."],Hard:["Hard landing. Heavily compressed struts.","Ouch! That was a rough touchdown.","Hard arrival. Structural inspection might be needed."],"Bone Shaker":["Bone-shaking touchdown! That will rattle some teeth.","Extremely hard impact. Main gear struts bottomed out.","Severe hard landing. Cabin doors popped open!"],Crash:["CRASH! Structural failure occurred on impact.","Catastrophic touchdown. The gear has disintegrated.","Hull loss landing. Major emergency response triggered."]},hi={perfect:["Passengers are applauding! Some are weeping with joy.","A quiet cabin filled with smiles. The perfect flight.","Cabin crew are beaming. High praise all around."],good:["Passengers are pleased. A comfortable and safe arrival.","Standard relaxed sighs in the cabin as the spoilers deploy.","Very happy passengers. Standard arrival."],nervous:["A few gasps in the cabin. People checking their seatbelts.","Some nervous looks exchanged. A bit of a jolt.","Nervous giggles as the cabin realizes they're down."],angry:["Audible groans from the back. Bags shifted in the overhead bins.","Spilled drinks and angry murmurs throughout the cabin.","A passenger is complaining about neck pain."],lawsuit:["Lawsuits pending. Whiplash alerts activated!","Chaos in the cabin. Sirens, screaming, and lawyer phone calls.","The FAA and legal teams have already been notified."]};function bt(n,e,t){let i=Math.abs(e),s=n==="Crash"||i>=800||t>=3?"lawsuit":i>=500||t===2?"angry":i>=300||t===1?"nervous":i<160?"perfect":"good",a=r=>r[Math.floor(Math.random()*r.length)];return{qualityFeedback:a(pi[n==="Smooth"?"Great":n]),passengerFeedback:a(hi[s])}}var ke=class{samples=[];record(e,t=!1){let i=this.samples.at(-1);if(!t&&i&&e.timestamp-i.timestampMs<250)return;let s={timestampMs:e.timestamp,lat:e.lat,lon:e.lon,altitudeFt:e.altitude,aglFt:e.aglFeet,kias:e.kias,groundSpeedKts:e.groundSpeed,vsFpm:e.vs,headingDeg:e.heading,pitchDeg:e.pitch,rollDeg:e.roll,gForce:e.gForce,groundContact:e.groundContact};for(this.samples.push(s);this.samples.length>121||this.samples[0].timestampMs<e.timestamp-3e4;)this.samples.shift()}finish(e){this.record(e,!0);let t=this.samples;return this.reset(),t}reset(){this.samples=[]}};function fi(n){let e=Math.abs(n);return e<80?"Butter":e<160?"Silky":e<300?"Great":e<500?"Firm":e<800?"Hard":e<1100?"Bone Shaker":"Crash"}function gi(n,e,t,i,s){let a=(l,o)=>Math.max(0,Math.min(o,l)),r=a((Math.abs(n)-50)/70,5)+a(Math.abs(e-1)*2,2)+Math.min(i*2,6)+a(Math.abs(t)/10,1.5)+(s?0:1);return a(10-r,10)}function mi(){let n=window.geofs,e=n?.aircraft?.instance?.llaLocation;if(!e||!n?.runways?.getNearestRunway||!n.utils?.distanceBetweenLocations)return!1;try{let t=n.runways.getNearestRunway(e);return!t?.aimingPointLla1||!t.aimingPointLla2?!1:Math.min(n.utils.distanceBetweenLocations(e,t.aimingPointLla1),n.utils.distanceBetweenLocations(e,t.aimingPointLla2))<600}catch{return!1}}function bi(n){return n==="Butter"||n==="Silky"?"badge-butter":n==="Great"||n==="Smooth"||n==="Firm"?"badge-acceptable":n==="Crash"?"badge-crash":"badge-hard"}function vi(n){let e=Math.abs(n.vsFpm),t=n.bounces??0;return n.rating==="Crash"||e>=800||t>=3?"#7f1d1d":e>=500||t===2?"#ef4444":e>=300||t===1?"#eab308":e<160?"#22c55e":"#84cc16"}var Le=class{id="landing-statistics";name="Landing Statistics";description="Slide-in touchdown score card, GPWS callouts, rating badges, and Chrome logbook sync.";supportedMajors=[3,4];defaultEnabled=!0;ctx=null;wasAirborne=!1;crashLatched=!1;airborneStartTime=null;lastLandingTime=0;aircraftId=null;replay=new ke;reportTimer;report=null;reportDragCleanup=null;reportOpen=!1;reportDuration=null;lastGroundHeight;calibratedVsFpm;lastApproach=null;bounces=0;inTouchdownZone=!1;gpwsFired=new Set;sessionRecords=[];sounds;listEl=null;timerCheckboxEl=null;secondsInputEl=null;unmountTab=null;styleEl=null;init(e){if(this.ctx=e,this.injectStyles(),typeof document>"u")return;let t=document.createElement("div");t.style.cssText="display:flex;flex-direction:column;gap:6px;";let i=document.createElement("div");i.style.cssText="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:10px;";let s=document.createElement("input");s.type="checkbox",s.checked=e.getSettings().landingReportAutoClose??!0,s.addEventListener("change",()=>e.updateSettings({landingReportAutoClose:s.checked})),this.timerCheckboxEl=s;let a=document.createElement("label");a.style.cssText="display:flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap;",a.append(s," Auto-close");let r=document.createElement("div");r.style.cssText="display:flex;align-items:center;gap:3px;white-space:nowrap;";let l=document.createElement("input");l.type="number",l.min="1",l.max="3600",l.value=String(e.getSettings().landingReportSeconds??15),l.style.cssText="width:44px;background:#000;color:#fff;border:1px solid #888;border-radius:6px;padding:1px 4px;font-size:10px;",l.setAttribute("aria-label","Landing report duration in seconds"),l.addEventListener("change",()=>{let p=Math.max(1,Math.min(3600,l.valueAsNumber||15));l.value=String(p),e.updateSettings({landingReportSeconds:p})}),this.secondsInputEl=l;let o=document.createElement("span");o.textContent="s",r.append(l,o),i.append(a,r);let d=document.createElement("div");d.style.cssText="font-weight:700;font-size:11px;letter-spacing:0.4px;text-transform:uppercase;color:#ddd;",d.textContent="Session Touchdowns";let c=document.createElement("div");c.style.cssText="display:flex;flex-direction:column;gap:4px;font-size:10px;",c.textContent="No landings recorded in this session.",this.listEl=c,t.append(i,d,c),this.unmountTab=e.anchors.registerHudTab("land","LAND",t)}injectStyles(){if(this.styleEl||typeof document>"u"||!document.head||document.getElementById("geofs-ext-landing-stats-styles"))return;let e=document.createElement("style");e.id="geofs-ext-landing-stats-styles",e.textContent=`
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
    `,document.head.appendChild(e),this.styleEl=e}update(e){if(e.paused||!this.ctx||window.geofs?.cautiousWithTerrain)return;let t=e.aircraft?.id??null;if(t!==this.aircraftId&&(this.aircraftId=t,this.wasAirborne=!1,this.crashLatched=!1,this.airborneStartTime=null,this.lastLandingTime=0,this.closeReport(),this.lastGroundHeight=void 0,this.calibratedVsFpm=void 0,this.lastApproach=null,this.gpwsFired.clear(),this.replay.reset()),!t)return;let i=window.geofs?.aircraft?.instance,s=window.geofs?.animation?.values,a=i?.collisionPoints?.at(-2)?.worldPosition?.[2]??0,r=typeof s?.altitude=="number"&&typeof s.groundElevationFeet=="number"?s.altitude-s.groundElevationFeet+a*3.2808399:e.aglFeet,l=this.lastGroundHeight;if(Number.isFinite(r)&&(!l||r!==l.feet)&&(l&&e.timestamp>l.time&&(this.calibratedVsFpm=(r-l.feet)*6e4/(e.timestamp-l.time)),this.lastGroundHeight={feet:r,time:e.timestamp}),e.crashed){let o=!this.crashLatched&&this.wasAirborne;if(this.crashLatched=!0,this.airborneStartTime=null,!o){this.wasAirborne=!1,this.lastApproach=null,this.gpwsFired.clear(),this.replay.reset();return}}else if(this.crashLatched){let o=!e.groundContact&&e.aglFeet>=15,d=e.groundContact&&Math.abs(e.vs)<50&&e.groundSpeed<5;if(!o&&!d)return;this.crashLatched=!1}if(!e.groundContact&&!e.crashed){this.airborneStartTime===null&&(this.airborneStartTime=e.timestamp);let o=e.timestamp-this.airborneStartTime,d=Math.max(e.groundSpeed,e.kias)>=15;if((this.reportOpen?e.timestamp-this.lastLandingTime>=400&&(e.aglFeet>=3||o>=250&&d):e.aglFeet>=10||o>=1500&&d)&&(this.wasAirborne=!0),this.wasAirborne&&(this.lastApproach=e,this.replay.record(e)),e.aglFeet>80&&this.gpwsFired.clear(),this.wasAirborne&&!ut()&&e.vs<-100){let u=[{ft:50,callout:"50"},{ft:40,callout:"40"},{ft:30,callout:"30"},{ft:20,callout:"20"},{ft:10,callout:"10"}].filter(m=>e.aglFeet<=m.ft),h=u.at(-1);if(h&&!this.gpwsFired.has(h.ft)){for(let m of u)this.gpwsFired.add(m.ft);this.ctx.audio.playGpwsCallout(h.callout),h.ft===20&&(e.throttles[0]??0)>.15&&this.ctx.audio.playGpwsCallout("RETARD")}}return}if(this.airborneStartTime=null,this.wasAirborne){if(this.wasAirborne=!1,this.gpwsFired.clear(),!e.crashed&&r>=500){this.replay.reset();return}if(!e.crashed&&e.timestamp-this.lastLandingTime<400){this.replay.reset();return}this.lastLandingTime=e.timestamp;let o=this.reportOpen;this.bounces=o?this.bounces+1:0,o||(this.inTouchdownZone=mi());let d=this.lastApproach??e;this.lastApproach=null;let c=typeof s?.accZ=="number"&&Number.isFinite(s.accZ)?s.accZ/9.80665:e.gForce,p=e.crashed?"Crash":fi(d.vs),u={id:`${e.timestamp}-${Math.random().toString(36).slice(2,7)}`,timestamp:new Date(e.timestamp).toISOString(),aircraftId:e.aircraft?.id||"unknown",aircraftName:e.aircraft?.name||"Unknown Aircraft",vsFpm:Math.round(d.vs),gForce:Number(c.toFixed(2)),rollDeg:Number(d.roll.toFixed(1)),groundSpeedKts:Math.round(e.groundSpeed),rating:p,calibratedVsFpm:this.calibratedVsFpm,indicatedAirspeedKts:d.kias,trueAirspeedKts:typeof i?.trueAirSpeed=="number"?i.trueAirSpeed*1.94384449:void 0,pitchDeg:Math.abs(typeof s?.atilt=="number"?s.atilt:e.pitch),...bt(p,d.vs,this.bounces),bounces:this.bounces,inTouchdownZone:this.inTouchdownZone,score:gi(d.vs,c,d.roll,this.bounces,this.inTouchdownZone),lat:Number(e.lat.toFixed(4)),lon:Number(e.lon.toFixed(4)),replay:this.replay.finish(e)};this.sessionRecords=[u,...this.sessionRecords].slice(0,10),this.renderSessionList(),this.showReport(u,o);let h=this.ctx.getAudioUrl?.("");if(h&&!this.sounds&&typeof Audio<"u"){this.sounds={soft:new Audio(h+"soft_landing.wav"),hard:new Audio(h+"hard_landing.wav"),crash:new Audio(h+"crash_landing.wav")};for(let x of Object.values(this.sounds))x.preload="none"}let m=this.sounds;if(m){for(let b of Object.values(m))b.pause(),b.currentTime=0;(p==="Crash"?m.crash:p==="Firm"||p==="Hard"||p==="Bone Shaker"?m.hard:m.soft).play().catch(()=>{})}this.ctx.anchors.showToast(`${o?`Bounce #${this.bounces}`:"Touchdown"}: ${u.vsFpm} fpm | ${u.gForce}G | ${p}`,p==="Crash"?"critical":p==="Hard"||p==="Bone Shaker"?"warn":"info"),this.ctx.emitDiag?.("LANDING_RECORDED",{rating:u.rating,vsFpm:u.vsFpm,gForce:u.gForce,score:u.score,bounces:u.bounces}),typeof window<"u"&&typeof window.postMessage=="function"&&window.postMessage({type:"GEOFS_EXT_LANDING_RECORD",record:u},"*")}}showReport(e,t){if(typeof document>"u"||!document.body)return;this.closeReport();let i=document.createElement("section");i.id="statsCard",i.className="addonpack-card",i.setAttribute("aria-label","Landing Statistics");let s=document.createElement("div");s.className="addonpack-card-header";let a=document.createElement("span");a.textContent=`Landing Statistics \xB7 ${e.aircraftName}`;let r=document.createElement("button");r.type="button",r.className="addonpack-close-btn",r.textContent="\xD7",r.setAttribute("aria-label","Close landing report"),r.addEventListener("click",T=>{T.stopPropagation(),this.closeReport()}),s.append(a,r);let l=document.createElement("div");l.className="addonpack-card-content";let o=document.createElement("div");o.className="stats-main-row";let d=document.createElement("div");d.className="addonpack-score-circle";let c=document.createElement("span");c.className="score-value",c.textContent=e.score!==void 0?e.score.toFixed(1):"\u2014";let p=document.createElement("span");p.className="score-label",p.textContent="/ 10",d.append(c,p);let u=document.createElement("div");u.className=`addonpack-badge ${bi(e.rating)}`,u.textContent=`${e.rating.toUpperCase()}${t?" (BOUNCE)":""}`,o.append(d,u);let h=document.createElement("div");h.className="stats-grid";let m=[["Pre-Impact V/S",`${e.vsFpm} fpm`],["Touchdown G-Force",`${e.gForce.toFixed(2)} G`],["Calibrated V/S",e.calibratedVsFpm===void 0?"\u2014":`${e.calibratedVsFpm.toFixed(1)} fpm`],["Indicated Airspeed",e.indicatedAirspeedKts===void 0?"\u2014":`${e.indicatedAirspeedKts.toFixed(1)} kt`],["True Airspeed",e.trueAirspeedKts===void 0?"\u2014":`${e.trueAirspeedKts.toFixed(1)} kt`],["Ground Speed",`${e.groundSpeedKts} kt`],["Roll",`${e.rollDeg.toFixed(1)}\xB0`],["Pitch",e.pitchDeg===void 0?"\u2014":`${e.pitchDeg.toFixed(1)}\xB0`],["Touchdown Zone",e.inTouchdownZone?"On Target":"Off Target"],["Bounces",String(e.bounces??0)]];for(let[T,A]of m){let S=document.createElement("div");S.className="stat-item";let C=document.createElement("span");C.className="stat-label",C.textContent=T;let g=document.createElement("span");g.className="stat-value",g.textContent=A,S.append(C,g),h.appendChild(S)}let x=document.createElement("div");x.className="feedback-box",x.style.borderLeftColor=vi(e);let b=document.createElement("div");b.style.fontWeight="700",b.textContent=e.qualityFeedback??"";let E=document.createElement("div");E.style.marginTop="2px",E.textContent=e.passengerFeedback??"",x.append(b,E),l.append(o,h,x),i.append(s,l),document.body.appendChild(i),this.reportDragCleanup=this.ctx?.anchors.makeDraggable(i,"geofs_ext_landing_report_pos",s)??null,this.report=i,this.reportOpen=!0,i.offsetWidth,i.classList.add("active"),this.ctx?.anchors.bringToFront(i),this.ctx?.anchors.clampElementToViewport(i),this.scheduleReportClose()}onSettingsChange(){let e=this.ctx?.getSettings();this.timerCheckboxEl&&e&&(this.timerCheckboxEl.checked=e.landingReportAutoClose??!0),this.secondsInputEl&&e&&(this.secondsInputEl.value=String(e.landingReportSeconds??15)),this.reportOpen&&this.scheduleReportClose()}scheduleReportClose(){let e=this.ctx?.getSettings(),t=e?.landingReportAutoClose===!1?null:Math.max(1,Math.min(3600,e?.landingReportSeconds||15));t!==this.reportDuration&&(clearTimeout(this.reportTimer),this.reportDuration=t,this.reportTimer=t===null?void 0:setTimeout(()=>this.closeReport(),t*1e3))}closeReport(){clearTimeout(this.reportTimer),this.reportTimer=void 0,this.reportDragCleanup?.(),this.reportDragCleanup=null,this.report?.remove(),this.report=null,this.reportDuration=null,this.reportOpen=!1}renderSessionList(){if(this.listEl){this.listEl.innerHTML="";for(let e of this.sessionRecords.slice(0,5)){let t=document.createElement("div");t.style.cssText="border-bottom:1px solid rgba(136,136,136,0.3);padding-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",t.textContent=`${e.rating} \u2022 ${e.vsFpm} fpm \u2022 ${e.gForce}G \u2022 ${e.groundSpeedKts} kt \u2022 ${e.score?.toFixed(1)??"\u2014"}/10`,t.title=t.textContent,this.listEl.appendChild(t)}}}destroy(){if(this.unmountTab?.(),this.unmountTab=null,this.listEl=null,this.timerCheckboxEl=null,this.secondsInputEl=null,this.wasAirborne=!1,this.aircraftId=null,this.closeReport(),this.styleEl?.remove(),this.styleEl=null,this.lastGroundHeight=void 0,this.calibratedVsFpm=void 0,this.lastApproach=null,this.gpwsFired.clear(),this.sessionRecords=[],this.sounds)for(let e of Object.values(this.sounds))e.pause();this.sounds=void 0,this.replay.reset(),this.ctx=null}};var Re=class{id="satellite-imagery";name="Satellite Imagery";description="User-configurable map tile provider (Esri, OSM, Custom URL).";supportedMajors=[3,4];defaultEnabled=!1;ctx=null;origProvider=null;init(e){this.ctx=e;let t=window.geofs?.api?.viewer;this.origProvider||(this.origProvider=t?.imageryLayers?.get?.(0)?.imageryProvider??null),this.applyProvider(e.getSettings())}onSettingsChange(e){this.applyProvider(e)}applyProvider(e){let t=window.Cesium,i=window.geofs?.api?.setImageryProvider;if(!t||!i)return;if(e.imageryProvider==="native"){if(this.origProvider)try{i(this.origProvider,!1),this.ctx?.anchors.showToast("Imagery restored to GeoFS Native"),this.ctx?.emitDiag?.("IMAGERY_CHANGED",{provider:"native"})}catch(r){console.warn("[GeoFS Extension] Failed to restore native imagery:",r)}return}if(e.imageryProvider==="bing"&&e.customImageryToken&&t.BingMapsImageryProvider){try{let r=new t.BingMapsImageryProvider({url:"https://dev.virtualearth.net",key:e.customImageryToken,mapStyle:"Aerial"});i(r,!1),this.ctx?.anchors.showToast("Imagery switched to BING AERIAL"),this.ctx?.emitDiag?.("IMAGERY_CHANGED",{provider:"bing"})}catch(r){console.warn("[GeoFS Extension] Failed to apply Bing imagery:",r)}return}if(!t.UrlTemplateImageryProvider)return;let s="",a="Custom Imagery";if(e.imageryProvider==="osm")s="https://tile.openstreetmap.org/{z}/{x}/{y}.png",a="OpenStreetMap contributors";else if(e.imageryProvider==="esri"&&e.customImageryToken)s=`https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=${encodeURIComponent(e.customImageryToken)}`,a="Powered by Esri";else if(e.imageryProvider==="custom"&&e.customImageryUrl)s=e.customImageryUrl;else return;try{let r=new t.UrlTemplateImageryProvider({url:s,maximumLevel:19,credit:t.Credit?new t.Credit(a,!0):void 0});i(r,!1),this.ctx?.anchors.showToast(`Imagery switched to ${e.imageryProvider.toUpperCase()}`),this.ctx?.emitDiag?.("IMAGERY_CHANGED",{provider:e.imageryProvider})}catch(r){console.warn("[GeoFS Extension] Failed to apply imagery provider:",r)}}destroy(){if(this.origProvider)try{window.geofs?.api?.setImageryProvider?.(this.origProvider,!1)}catch{}this.origProvider=null,this.ctx=null}};function vt(){return[new xe,new ve,new ye,new we,new Ee,new Te,new Ce,new Fe,new Me,new Le,new Re]}var xi={gBreath:!0,windAudio:!0,soundExpansion:!0,blackout:!0,cameraShake:!0,propwash:!0,vortexEffects:!0,spinFix:!0,bladeCollisions:!0,engineInertia:!0,spoilerArming:!0,carrierOps:!0,performanceMode:!1},yi={modules:{autothrottle:!0,"autopilot-pp":!1,"information-display":!0,"fuel-simulator":!0,"overpowered-engines":!1,"checklist-system":!0,"realism-pack":!0,"failure-simulator":!1,"flight-path-vector":!0,"landing-statistics":!0,"satellite-imagery":!1},themeMode:"auto",calibratorPreset:"auto",keybindings:{toggleAutothrottle:"Shift+A",toggleOpEngines:"Shift+O",toggleHud:"Shift+H",toggleFpv:"Shift+F",toggleChecklist:"Shift+C"},imageryProvider:"native",customImageryUrl:"",customImageryToken:"",aircraftOverrides:{},showStartupDiagnostics:!0,sidePanelAutoTelemetry:!0,hudPositionFallback:!0,keyboardOsProfile:"auto",macKeyboardType:null,simKeyTranslatorEnabled:!0,simKeyRemaps:{}},wi={autothrottleResponsiveness:1,opSyncPolicy:"ask",opDeltaThresholdKts:150,opThrustMultiplier:1,opCeilingFeet:3e6,opStability:!1,sasStrength:1,checklistAutoAdvance:!0,checklistEnforceMandatoryGates:!0,fuelDynamicSfc:!1,fuelRealisticTanks:!1,fuelAutoRefuel:!1,failureProbabilitiesEnabled:!1,failureProbabilityIntervalSec:60,failureSystemChances:{},failureRecoveryChancePct:60,landingReportAutoClose:!0,landingReportSeconds:15,fpvProjectionFactor:15,fpvResolutionMode:"auto",realismOptions:{...xi}},xt={...yi,...wi};(function(){let e=Date.now(),t=!1,i=!1,s=()=>{if(t)return;let r=Ne(window.geofs?.version);if(r&&window.geofs?.aircraft?.instance&&document.body){t=!0,a(r);return}let l=Date.now()-e;!(/geofs\.php/i.test(window.location.pathname)||window.geofs)&&l>15e3||(l>6e4&&!i&&(i=!0,console.warn("[GeoFS Extension] Still waiting for GeoFS simulator instance...")),!(l>6e5)&&setTimeout(s,l<6e4?250:1e3))},a=r=>{let l=(o,d)=>{let c=d&&typeof d=="object"&&"level"in d?d.level:void 0,p=c==="error"||c==="warn"?c:o.endsWith("_ERROR")?"error":"info",u={time:new Date().toISOString(),code:o,level:p,payload:d};Array.isArray(window.__geofsExtDiag)||(window.__geofsExtDiag=[]),window.__geofsExtDiag.push(u),window.__geofsExtDiag.length>100&&window.__geofsExtDiag.shift(),console.info(`[GeoFS-EXT][DIAG]${p==="error"?"[ERROR]":""} ${o}`,d??""),window.postMessage({type:"GEOFS_EXT_DIAG",entry:u},"*")};try{l("UI_SCRIPT_LOADED",{simMajor:r,rawVersion:String(window.geofs?.version??""),path:window.location.pathname});let o={...xt},d,c,p=new le,u=new ce,h=new ue,m=new pe,x=new fe,b=new de(p,r),E=f=>({...o,...f,modules:f.modules?{...o.modules,...f.modules}:o.modules,keybindings:f.keybindings?{...o.keybindings,...f.keybindings}:o.keybindings,simKeyRemaps:f.simKeyRemaps?{...f.simKeyRemaps}:o.simKeyRemaps,failureSystemChances:f.failureSystemChances?{...o.failureSystemChances,...f.failureSystemChances}:o.failureSystemChances,realismOptions:f.realismOptions?{...o.realismOptions,...f.realismOptions}:o.realismOptions}),T=f=>{x.setTheme(f.themeMode==="light"?"light":"dark"),x.setCalibratorPreset(f.calibratorPreset),m.updateConfig({enabled:f.simKeyTranslatorEnabled,osProfile:f.keyboardOsProfile,macKeyboardType:f.macKeyboardType,customRemaps:f.simKeyRemaps})},A=new ge(r,{sim:p,audio:u,anchors:x,keybinds:h,getAudioUrl:f=>d?d+f:void 0,getAssetUrl:f=>c?c+f:void 0,emitDiag:l,getSettings:()=>o,updateSettings:f=>{o=E(f),window.postMessage({type:"GEOFS_EXT_SETTINGS_PATCH",patch:f},"*"),T(o),A.applySettings(o)}}),S={fuelPct:100,burnKgHr:0,activeFailures:new Set,opSyncActive:!1,sasActive:!1,checklistPhase:"PRE-TAKEOFF",checklistPending:0,apPp:null};x.init(),h.start(),m.start(),h.register("hud-toggle",o.keybindings.toggleHud,()=>{x.toggleHudVisibility()});for(let f of vt())A.register(f);let C=A.on.bind(A);C("fuel:state",f=>{f&&Number.isFinite(f.pct)&&(S.fuelPct=f.pct),f&&Number.isFinite(f.burnKgHr)&&(S.burnKgHr=f.burnKgHr)}),C("failure:triggered",({type:f})=>{f&&S.activeFailures.add(f)}),C("failure:cleared",({type:f})=>{f&&S.activeFailures.delete(f)}),C("autothrottle:opsync-state",({active:f})=>{S.opSyncActive=!!f}),C("overpowered:sas-state",({active:f})=>{S.sasActive=!!f}),C("checklist:phase",({phase:f,pending:v})=>{f&&(S.checklistPhase=f),Number.isFinite(v)&&(S.checklistPending=v)}),C("autopilot-pp:state",f=>{S.apPp=f??null}),window.__geofsExt={manager:A,sim:p,bus:b,anchors:x,emitDiag:l,getSettings:()=>o};let g=0;b.subscribe(f=>{A.dispatchTelemetry(f),f.timestamp-g>=250&&(g=f.timestamp,window.postMessage({type:"GEOFS_EXT_LIVE_TELEMETRY",telemetry:{simMajor:f.simMajor,aircraftProfile:f.aircraft,kias:Math.round(f.kias),altitude:Math.round(f.altitude),vs:Math.round(f.vs),agl:Math.round(f.aglFeet),mach:Number(f.mach.toFixed(2)),fuelPct:Number(S.fuelPct.toFixed(1)),burnKgHr:Math.round(S.burnKgHr),activeFailures:Array.from(S.activeFailures),opSyncActive:S.opSyncActive,sasActive:S.sasActive||!!o.opStability,checklistPhase:S.checklistPhase,checklistPending:S.checklistPending,apPp:S.apPp}},"*"))});let w=!1;window.addEventListener("message",f=>{if(f.source!==window||!f.data||typeof f.data!="object")return;let v=f.data;v.type==="GEOFS_EXT_SETTINGS"&&v.settings&&(typeof v.audioBase=="string"&&/^chrome-extension:\/\/[a-p]{32}\/audio\/$/.test(v.audioBase)&&(d=v.audioBase),typeof v.assetBase=="string"&&/^chrome-extension:\/\/[a-p]{32}\/assets\/$/.test(v.assetBase)&&(c=v.assetBase),o=v.settings,p.setAircraftOverrides(o.aircraftOverrides),h.updateCombo("hud-toggle",o.keybindings.toggleHud),T(o),A.applySettings(o).then(()=>{w||(w=!0,l("UI_MOUNT",{simMajor:r,activeModules:A.getModules().filter(y=>A.isActive(y.id)).map(y=>y.id)}),o.showStartupDiagnostics&&x.showToast(`GeoFS Extension Active (GeoFS V${r})`))}))}),p.setAircraftOverrides(o.aircraftOverrides),T(o),A.applySettings(o).then(()=>{w||l("UI_BOOT",{simMajor:r})}),b.start(),window.postMessage({type:"GEOFS_EXT_REQUEST_SETTINGS"},"*"),setTimeout(()=>{w||window.postMessage({type:"GEOFS_EXT_REQUEST_SETTINGS"},"*")},1e3)}catch(o){l("UI_BOOT_ERROR",{simMajor:r,message:o instanceof Error?o.message:String(o)}),console.error("[GeoFS Extension] Bootstrap failed:",o)}};s()})();})();
