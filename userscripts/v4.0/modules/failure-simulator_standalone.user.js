// ==UserScript==
// @name                GeoFS-V4.0_Failure-Simulator
// @name:vi             GeoFS-V4.0_Trình-Mô-Phỏng-Lỗi
// @name:zh-CN          GeoFS-V4.0_故障模拟器
// @name:zh-TW          GeoFS-V4.0_故障模擬器
// @name:ja             GeoFS-V4.0_故障シミュレータ
// @name:ko             GeoFS-V4.0_실패-시뮬레이터
// @name:fr             GeoFS-V4.0_Simulateur-De-Panne
// @name:de             GeoFS-V4.0_Fehlersimulator
// @name:es             GeoFS-V4.0_Simulador-De-Fallas
// @name:pt-BR          GeoFS-V4.0_Simulador-De-Falha
// @name:pt-PT          GeoFS-V4.0_Simulador-De-Falhas
// @name:ru             GeoFS-V4.0_Симулятор-Неудач
// @name:ar             GeoFS-V4.0_محاكي-الفشل
// @name:tr             GeoFS-V4.0_Arıza-Simülatörü
// @name:id             GeoFS-V4.0_Simulator-Kegagalan
// @name:th             GeoFS-V4.0_เครื่องจำลองความล้มเหลว
// @name:pl             GeoFS-V4.0_Symulator-Awarii
// @name:nl             GeoFS-V4.0_Mislukkingssimulator
// @name:it             GeoFS-V4.0_Simulatore-Di-Guasti
// @name:sv             GeoFS-V4.0_Felsimulator
// @name:da             GeoFS-V4.0_Fejlsimulator
// @name:fi             GeoFS-V4.0_Vika-Simulaattori
// @name:nb             GeoFS-V4.0_Feilsimulator
// @name:cs             GeoFS-V4.0_Simulátor-Selhání
// @name:hu             GeoFS-V4.0_Hibaszimulátor
// @name:ro             GeoFS-V4.0_Simulator-De-Eșec
// @name:uk             GeoFS-V4.0_Симулятор-Відмов
// @name:hi             GeoFS-V4.0_विफलता-सिम्युलेटर
// @name:bn             GeoFS-V4.0_ব্যর্থতার-সিমুলেটর
// @name:fa             GeoFS-V4.0_شبیه-ساز-شکست
// @name:he             GeoFS-V4.0_סימולטור-כשל
// @name:ms             GeoFS-V4.0_Simulator-Kegagalan
// @name:fil            GeoFS-V4.0_Simulator-Ng-Pagkabigo
// @name:el             GeoFS-V4.0_Failure-Simulator
// @name:hr             GeoFS-V4.0_Simulator-Kvara
// @name:sk             GeoFS-V4.0_Simulátor-Porúch
// @name:bg             GeoFS-V4.0_Симулатор-На-Повреда
// @name:sr             GeoFS-V4.0_Симулатор-Неуспеха
// @name:lt             GeoFS-V4.0_Gedimų-Simuliatorius
// @name:lv             GeoFS-V4.0_Neveiksmju-Simulators
// @name:et             GeoFS-V4.0_Rikete-Simulaator
// @name:sl             GeoFS-V4.0_Simulator-Napak
// @name:ca             GeoFS-V4.0_Simulador-De-Fallades
// @name:af             GeoFS-V4.0_Mislukkingssimulator
// @name:sw             GeoFS-V4.0_Simulator-Ya-Kushindwa
// @name:zu             GeoFS-V4.0_Isifanisi-Sokuhluleka
// @name:mn             GeoFS-V4.0_Бүтэлгүйтэл-Симулятор
// @name:my             GeoFS-V4.0_ပျက်ကွက်-Simulator
// @name:km             GeoFS-V4.0_ម៉ាស៊ីនក្លែងធ្វើបរាជ័យ
// @name:lo             GeoFS-V4.0_ເຄື່ອງຈຳລອງຄວາມລົ້ມເຫລວ
// @name:ur             GeoFS-V4.0_ناکامی-سمیلیٹر
// @description         Advanced emergency training engine delivering realistic, unpredictable system failures. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:vi      Công cụ đào tạo khẩn cấp tiên tiến cung cấp các lỗi hệ thống thực tế, không thể đoán trước. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:zh-CN   先进的应急培训引擎提供真实的、不可预测的系统故障。 © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:zh-TW   先進的緊急訓練引擎提供真實的、不可預測的系統故障。 © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:ja      高度な緊急訓練エンジンにより、現実的で予測不可能なシステム障害が発生します。 © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:ko      현실적이고 예측 불가능한 시스템 오류를 제공하는 고급 비상 훈련 엔진. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:fr      Moteur de formation d’urgence avancé fournissant des pannes de système réalistes et imprévisibles. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:de      Fortschrittliche Notfall-Trainings-Engine, die realistische, unvorhersehbare Systemausfälle liefert. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:es      Motor de entrenamiento de emergencia avanzado que ofrece fallas del sistema realistas e impredecibles. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:pt-BR   Mecanismo avançado de treinamento de emergência que oferece falhas de sistema realistas e imprevisíveis. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:pt-PT   Mecanismo avançado de treino de emergência que oferece falhas de sistema realistas e imprevisíveis. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:ru      Усовершенствованная система обучения чрезвычайным ситуациям, обеспечивающая реалистичные и непредсказуемые сбои системы. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:ar      محرك تدريب متقدم على حالات الطوارئ يقدم حالات فشل واقعية وغير متوقعة للنظام. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:tr      Gerçekçi, öngörülemeyen sistem arızaları sağlayan gelişmiş acil durum eğitim motoru. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:id      Mesin pelatihan darurat tingkat lanjut menghasilkan kegagalan sistem yang realistis dan tidak dapat diprediksi. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:th      Advanced emergency training engine delivering realistic, unpredictable system failures. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:pl      Zaawansowany silnik szkoleniowy w sytuacjach awaryjnych zapewniający realistyczne, nieprzewidywalne awarie systemu. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:nl      Geavanceerde noodtrainingsengine die realistische, onvoorspelbare systeemstoringen oplevert. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:it      Motore avanzato di formazione sulle emergenze che fornisce guasti di sistema realistici e imprevedibili. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:sv      Avancerad nödutbildningsmotor som levererar realistiska, oförutsägbara systemfel. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:da      Avanceret nødtræningsmotor, der leverer realistiske, uforudsigelige systemfejl. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:fi      Edistyksellinen hätäkoulutusmoottori, joka tuottaa realistisia, arvaamattomia järjestelmävirheitä. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:nb      Avansert nødopplæringsmotor som leverer realistiske, uforutsigbare systemfeil. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:cs      Pokročilý nouzový tréninkový motor poskytující realistická, nepředvídatelná selhání systému. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:hu      Fejlett vészhelyzeti képzési motor, amely valósághű, előre nem látható rendszerhibákat biztosít. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:ro      Motor avansat de instruire în caz de urgență care oferă defecțiuni realiste, imprevizibile ale sistemului. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:uk      Удосконалений механізм навчання в екстрених ситуаціях, що забезпечує реалістичні, непередбачувані збої системи. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:hi      उन्नत आपातकालीन प्रशिक्षण इंजन यथार्थवादी, अप्रत्याशित सिस्टम विफलताएँ प्रदान करता है। © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:bn      উন্নত জরুরী প্রশিক্ষণ ইঞ্জিন বাস্তবসম্মত, অপ্রত্যাশিত সিস্টেম ব্যর্থতা প্রদান করে। © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:fa      موتور آموزش اضطراری پیشرفته که خرابی های واقعی و غیرقابل پیش بینی سیستم را ارائه می دهد. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:he      מנוע אימון חירום מתקדם המספק תקלות מערכת מציאותיות ובלתי צפויות. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:ms      Enjin latihan kecemasan lanjutan memberikan kegagalan sistem yang realistik dan tidak dapat diramalkan. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:fil     Advanced na makina ng pagsasanay na pang-emergency na naghahatid ng makatotohanan, hindi mahuhulaan na mga pagkabigo ng system. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:el      Προηγμένη μηχανή εκπαίδευσης έκτακτης ανάγκης που παρέχει ρεαλιστικές, απρόβλεπτες βλάβες του συστήματος. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:hr      Napredni motor za obuku u hitnim slučajevima koji pruža realne, nepredvidive kvarove sustava. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:sk      Pokročilý núdzový tréningový motor poskytujúci realistické, nepredvídateľné zlyhania systému. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:bg      Усъвършенстван двигател за обучение при спешни случаи, осигуряващ реалистични, непредвидими системни повреди. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:sr      Напредни механизам за обуку у хитним случајевима пружа реалистичне, непредвидиве системске кварове. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:lt      Pažangus avarinio mokymo variklis, užtikrinantis realius, nenuspėjamus sistemos gedimus. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:lv      Uzlabots avārijas apmācību dzinējs, kas nodrošina reālistiskas, neparedzamas sistēmas kļūmes. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:et      Täiustatud hädaolukorra koolitusmootor, mis pakub realistlikke ja ettearvamatuid süsteemitõrkeid. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:sl      Napreden motor za usposabljanje v sili, ki zagotavlja realistične, nepredvidljive sistemske okvare. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:ca      Motor avançat d'entrenament d'emergència que ofereix errors realistes i impredictibles del sistema. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:af      Gevorderde noodopleidingsenjin wat realistiese, onvoorspelbare stelselfoute lewer. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:sw      Injini ya mafunzo ya dharura ya hali ya juu inayotoa hitilafu za mfumo za kweli, zisizotabirika. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:zu      Injini yokuqeqeshwa kwezimo eziphuthumayo esezingeni eliphezulu iletha ukwehluleka kwesistimu okungokoqobo, okungalindelekile. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:mn      Яаралтай тусламжийн сургалтын дэвшилтэт хөдөлгүүр нь бодитой, урьдчилан тааварлах боломжгүй системийн доголдлыг хүргэдэг. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:my      လက်တွေ့ကျသော၊ ကြိုတင်မှန်းဆ၍မရသော စနစ်ကျရှုံးမှုများကို ပေးစွမ်းနိုင်သော အဆင့်မြင့် အရေးပေါ်လေ့ကျင့်ရေးအင်ဂျင်။ © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:km      ម៉ាស៊ីនហ្វឹកហ្វឺនសង្គ្រោះបន្ទាន់កម្រិតខ្ពស់ផ្តល់នូវភាពប្រាកដនិយម និងមិនអាចទាយទុកជាមុនបាន។ © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:lo      ເຄື່ອງຈັກການຝຶກອົບຮົມສຸກເສີນແບບພິເສດທີ່ສະຫນອງຄວາມລົ້ມເຫຼວຂອງລະບົບທີ່ບໍ່ສາມາດຄາດເດົາໄດ້ທີ່ແທ້ຈິງ. © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.
// @description:ur      جدید ترین ایمرجنسی ٹریننگ انجن حقیقت پسندانہ، غیر متوقع نظام کی ناکامیوں کو فراہم کرتا ہے۔ © 2026 AMFI-Disable. Part of the GeoFS-V4.0_Ecosystem.

// @namespace           https://greasyfork.org/users/1594049
// @version             1.0.1
// @author              AMFI-Disable
// @homepageURL         https://sites.google.com/view/geofs-v40-ecosystem/home
// @icon                https://www.geo-fs.com/images/icons/favicon.ico
// @match               https://beta.geo-fs.com/geofs.php*
// @match               https://www.geo-fs.com/geofs.php*
// @require             https://update.greasyfork.org/scripts/604885/code.js
// @require             https://update.greasyfork.org/scripts/604887/code.js
// @grant               none
// @license             MIT
// @copyright           2026, AMFI-Disable (https://greasyfork.org/users/1594049)
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          safari
// @compatible          brave
// @compatible          opera
// @run-at              document-idle
// ==/UserScript==

// Wait for GeoFS to report its version before executing any module code.
// Unknown, older, and newer versions never activate this V4.0 release.
(function waitForGeoFSVersion() {
    const version = window.geofs?.version;
    if (version === undefined || version === null || version === '') {
        setTimeout(waitForGeoFSVersion, 250);
        return;
    }
    if (!/^(?:v)?4(?:\.\d+)*$/i.test(String(version).trim())) {
        console.warn('[GeoFS-V4.0_Failure-Simulator] Inactive: GeoFS ' + version + ' is not V4.0.');
        return;
    }


(() => {
    /**
     * Runtime Version Guard: GeoFS-V4.0 Suite Compatibility
     * Allows this module to execute only when GeoFS reports version 4.0.
     */
    function isUnsupportedGeoFS() {
        const raw = window.geofs?.version;
        return !/^(?:v)?4(?:\.\d+)*$/i.test(String(raw ?? '').trim());
    }

    if (isUnsupportedGeoFS()) {
        console.warn("[GeoFS-V4.0_Failure-Simulator] Inactive: GeoFS v" + window.geofs?.version + " detected (suite only supports GeoFS v4.0).");
        return;
    }

    class FailureSimulator {
        /**
         * System Constructor: State Initialization
         * Registers aircraft-specific component maps and initializes failure registries.
         */
        constructor() {
            if (!window.geofs || !window.geofs.aircraft || !window.geofs.aircraft.instance) return;
            const ac = window.geofs.aircraft.instance;
            this.aId = ac.id;
            this.enabled = false;
            this.activeFailures = new Map();
            this.engineFX = new Map();
            this.gearOriginals = new Map();
            this.controlOriginals = new Map();
            this.pitotWrapper = null;
            this.probabilityTimer = null;
            this.mcasTime = 0;
            this.mcasActive = false;
            this.mcasRandT = 0;

            this.fails = {
                landingGear: { front: false, left: false, right: false },
                fuelLeak: false,
                flightCtrl: { ailerons: false, elevators: false, rudder: false },
                electrical: false,
                structural: false,
                hydraulic: { flaps: false, brakes: false, spoilers: false },
                pressurization: false,
                pitotStatic: false,
                mcas: false,
                engines: []
            };

            this.chances = {
                landingGear: { gearFront: 0, left: 0, right: 0 },
                fuelLeak: 0,
                flightCtrl: { ailerons: 0, elevators: 0, rudder: 0 },
                electrical: 0,
                structural: 0,
                hydraulic: { flaps: 0, brakes: 0, spoilers: 0 },
                pressurization: 0,
                pitotStatic: 0,
                mcas: 0,
                engines: []
            };

            for (let i = 0; i < (ac.engines?.length || 0); i++) {
                this.fails.engines.push({i: false});
                this.chances.engines.push(0);
            }
        }



        updateLED(failId, isActive) {
            const led = document.getElementById(`led-${failId}`);
            if (led) {
                led.style.background = isActive ? "#ef4444" : "#22c55e";
                led.style.boxShadow = isActive ? "0 0 10px #ef4444" : "0 0 5px #22c55e";
                led.classList.toggle("pulse-red", isActive);
            }
        }

        addFailureEmergency(title, items) {
            const checklist = window.checklistSystem;
            const displayTitle = "⚠️ " + title.toUpperCase();
            if (checklist?.addEmergency && !checklist.emergencies?.some(entry => entry.title === displayTitle)) {
                checklist.addEmergency(title, items);
            }
        }

        removeFailureEmergency(title) {
            const checklist = window.checklistSystem;
            if (!Array.isArray(checklist?.emergencies)) return;
            const displayTitle = "⚠️ " + title.toUpperCase();
            const indexMap = new Map();
            const retained = [];
            checklist.emergencies.forEach((entry, index) => {
                if (entry.title !== displayTitle) { indexMap.set(index, retained.length); retained.push(entry); }
            });
            if (retained.length === checklist.emergencies.length) return;
            if (checklist.completedItems && typeof checklist.completedItems.forEach === "function") {
                const mapped = new Set();
                checklist.completedItems.forEach(id => {
                    const match = /^emg-(\d+)-(\d+)$/.exec(id);
                    if (!match) mapped.add(id);
                    else if (indexMap.has(Number(match[1]))) mapped.add(`emg-${indexMap.get(Number(match[1]))}-${match[2]}`);
                });
                checklist.completedItems = mapped;
            }
            checklist.emergencies = retained;
            checklist.updateUI?.();
        }

        jamControl(name, control) {
            if (!control || !Number.isFinite(control.position)) return;
            const saved = {control, target: control.target, delta: control.delta,
                hadPositionTarget: Object.prototype.hasOwnProperty.call(control, "positionTarget"), positionTarget: control.positionTarget};
            this.controlOriginals.set(name, saved);
            const position = control.position;
            const max = name === "flaps" ? Number(window.geofs.aircraft.instance.definition?.flapsSteps) : 1;
            const safeMax = Number.isFinite(max) && max >= 0 ? max : 0;
            const heldTarget = name === "flaps" ? Math.max(0, Math.min(safeMax, Math.round(control.target || 0))) : Math.max(0, Math.min(1, position));
            const hold = () => { control.target = heldTarget; control.position = position; control.positionTarget = position; control.delta = 0; };
            hold();
            this.activeFailures.set(name, setInterval(hold, 50));
        }

        restoreControl(name) {
            const saved = this.controlOriginals.get(name);
            if (!saved) return;
            const {control} = saved;
            control.target = saved.target;
            if (saved.hadPositionTarget) control.positionTarget = saved.positionTarget;
            else delete control.positionTarget;
            if (saved.delta === undefined) delete control.delta;
            else control.delta = saved.delta;
            this.controlOriginals.delete(name);
        }

        /**
         * Failure Implementation: Deterministic System Degradation
         * Triggers physical consequences for specific airframe components and
         * manages the transition to emergency operating states.
         */
        fail(system) {
            const ac = window.geofs.aircraft.instance;
            // Update UI status indicators (LED)
            this.updateLED(system, true);

            if (system.includes("engine")) {
                const idx = parseInt(system.replace("engine", ""));
                if (!this.fails.engines[idx].i) {
                    // Engine Fire & Flameout Simulation
                    if (window.V40_NOTIF) window.V40_NOTIF.critical(`🔥 ENGINE ${idx+1} FAILURE - SHUT DOWN IMMEDIATELY`);
                    this.fails.engines[idx].i = true;
                    ac.engines[idx]._p_thrust = ac.engines[idx].thrust; // Cache nominal thrust
                    ac.engines[idx].thrust = 0; // Trigger flameout

                    // Emergency Checklist Integration: Dynamic Procedural Injection
                    if (window.checklistSystem) {
                        this.addFailureEmergency(`ENG ${idx+1} FAILURE`, [
                            { text: `THR LEVER ${idx+1} - IDLE`, desc: "Reduce fuel flow and check for engine fire." },
                            { text: `FUEL COCK ${idx+1} - OFF`, desc: "Isolate engine from fuel supply." },
                            { text: "ENGINE MASTER - OFF", desc: "Shut down ignition systems." },
                            { text: "AIRSPEED - MAINTAIN V2", desc: "Ensure safe climb speed on remaining engine." }
                        ]);
                    }

                    // Visual FX: Smoke and particle emission
                    try {
                        const emitter = new window.geofs.fx.ParticleEmitter({
                            off: 0,
                            anchor: ac.engines[idx].points.contrailAnchor || {worldPosition: ac.engines[idx].object3d.worldPosition},
                            duration: 1E10,
                            rate: 0.03,
                            life: 1E4,
                            easing: "easeOutQuart",
                            startScale: 0.01,
                            endScale: 0.2,
                            randomizeStartScale: 0.01,
                            randomizeEndScale: 0.15,
                            startOpacity: 1,
                            endOpacity: 0.2,
                            startRotation: "random",
                            texture: "whitesmoke"
                        });
                        const colorInt = setInterval(() => { window.geofs.fx.setParticlesColor(new window.Cesium.Color(0.1, 0.1, 0.1, 1)); }, 20);
                        this.engineFX.set(idx, { emitter, colorInt });
                    } catch(e) { console.warn("Smoke FX failed to init"); }
                    }
            } else {
                // System Registry: Deterministic Component Failure Logic
                switch(system) {
                    case "gearFront":
                        // Nose Gear Collapse: Static suspension offset injection
                        if (!this.fails.landingGear.front) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ NOSE GEAR COLLAPSE - STEERING LOST");
                            this.fails.landingGear.front = true;
                            let fG = 0;
                            // Search for primary steering suspension
                            (ac.suspensions || []).forEach((s, i) => {
                                const n = s.name ? s.name.toLowerCase() : "";
                                if(n.includes("front") || n.includes("nose") || n.includes("tail") || n.includes("steer")) fG = i; 
                            });
                            const point = ac.suspensions?.[fG]?.collisionPoints?.[0];
                            if (point) {
                                this.gearOriginals.set("gearFront", { point, height: point[2] });
                                const collapsedZ = Math.max((Number.isFinite(point[2]) ? point[2] : -2.5) + 2, 0.5);
                                this.activeFailures.set("gearFront", setInterval(() => { point[2] = collapsedZ; }, 1000));
                            }
                        }
                        break;
                    case "gearLeft":
                        if (!this.fails.landingGear.left) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ LEFT MAIN GEAR FAILURE");
                            this.fails.landingGear.left = true;
                            let lG = 1;
                            (ac.suspensions || []).forEach((s, i) => {
                                const n = s.name ? s.name.toLowerCase() : "";
                                if(n.includes("left") || n.includes("l_g") || n.includes("main l") || n.includes("l-gear")) lG = i; 
                            });
                            const point = ac.suspensions?.[lG]?.collisionPoints?.[0];
                            if (point) {
                                this.gearOriginals.set("gearLeft", { point, height: point[2] });
                                const collapsedZ = Math.max((Number.isFinite(point[2]) ? point[2] : -2.5) + 2, 0.5);
                                this.activeFailures.set("gearLeft", setInterval(() => { point[2] = collapsedZ; }, 1000));
                            }
                        }
                        break;
                    case "gearRight":
                        if (!this.fails.landingGear.right) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ RIGHT MAIN GEAR FAILURE");
                            this.fails.landingGear.right = true;
                            let rG = 2;
                            (ac.suspensions || []).forEach((s, i) => {
                                const n = s.name ? s.name.toLowerCase() : "";
                                if(n.includes("right") || n.includes("r_g") || n.includes("main r") || n.includes("r-gear")) rG = i; 
                            });
                            const point = ac.suspensions?.[rG]?.collisionPoints?.[0];
                            if (point) {
                                this.gearOriginals.set("gearRight", { point, height: point[2] });
                                const collapsedZ = Math.max((Number.isFinite(point[2]) ? point[2] : -2.5) + 2, 0.5);
                                this.activeFailures.set("gearRight", setInterval(() => { point[2] = collapsedZ; }, 1000));
                            }
                        }
                        break;
                    case "ailerons":
                        if (!this.fails.flightCtrl.ailerons) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ AILERON JAM - ROLL CONTROL LOST");
                            this.fails.flightCtrl.ailerons = true;
                            this.activeFailures.set("ailerons", setInterval(() => { ac.airfoils.forEach(a => { if(a.name.toLowerCase().includes("aileron")) a.object3d._scale = [0,0,0]; }); }, 1000));
                        }
                        break;
                    case "elevators":
                        if (!this.fails.flightCtrl.elevators) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ ELEVATOR JAM - PITCH CONTROL LOST");
                            this.fails.flightCtrl.elevators = true;
                            this.activeFailures.set("elevators", setInterval(() => { ac.airfoils.forEach(a => { if(a.name.toLowerCase().includes("elevator")) a.object3d._scale = [0,0,0]; }); }, 1000));
                        }
                        break;
                    case "rudder":
                        if (!this.fails.flightCtrl.rudder) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ RUDDER JAM - YAW CONTROL LOST");
                            this.fails.flightCtrl.rudder = true;
                            this.activeFailures.set("rudder", setInterval(() => { ac.airfoils.forEach(a => { if(a.name.toLowerCase().includes("rudder")) a.object3d._scale = [0,0,0]; }); }, 1000));
                        }
                        break;
                    case "flaps":
                        if (!this.fails.hydraulic.flaps) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ HYDRAULIC FAILURE - FLAPS INOPERATIVE");
                            this.fails.hydraulic.flaps = true;
                            this.jamControl("flaps", window.controls?.flaps);
                        }
                        break;
                    case "brakes":
                        if (!this.fails.hydraulic.brakes) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ HYDRAULIC FAILURE - BRAKES INOPERATIVE");
                            this.fails.hydraulic.brakes = true;
                            this.activeFailures.set("brakes", setInterval(() => { window.controls.brakes = 0; }, 500));
                        }
                        break;
                    case "spoilers":
                        if (!this.fails.hydraulic.spoilers) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ HYDRAULIC FAILURE - SPOILERS INOPERATIVE");
                            this.fails.hydraulic.spoilers = true;
                            this.jamControl("spoilers", window.controls?.airbrakes);
                        }
                        break;
                    case "mcas":
                        /**
                         * MCAS Failure Simulation: Uncommanded Trim Cycles
                         * Implements repeated nose-down trim pulses. Requires manual 
                         * column override or stabilizer trim cutout.
                         */
                        if (!this.fails.mcas) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("🚨 MCAS FAILURE - UNCOMMANDED NOSE DOWN");
                            this.fails.mcas = true;
                            
                            // Procedural Injection: Emergency Checklist
                            if (window.checklistSystem) {
                                this.addFailureEmergency("UNCOMMANDED NOSE DOWN TRIM", [
                                    { text: "STAB TRIM CUTOUT - CUTOUT", desc: "Disconnect electrical trim motors." },
                                    { text: "CONTROL COLUMN - PULL", desc: "Manually override nose-down movement." },
                                    { text: "TRIM WHEEL - MANUAL", desc: "Use physical trim wheel to level the aircraft." }
                                ]);
                            }

                            this.mcasTime = Date.now();
                            this.mcasRandT = 5000;
                            this.mcasActive = true;
                            window.controls.elevatorTrimMin = -10;
                            this.activeFailures.set("mcas", setInterval(() => {
                                // Logic: Inhibit MCAS if autopilot is active or flaps are extended
                                if (!window.geofs.autopilot.on && window.controls.flaps.position === 0) {
                                    if (this.mcasActive && (Date.now() <= this.mcasTime + this.mcasRandT)) {
                                        if (window.controls.elevatorTrim > window.controls.elevatorTrimMin) window.controls.elevatorTrim -= 0.01;
                                    } else if (this.mcasActive) { this.mcasActive = false; this.mcasTime = Date.now(); }
                                    else if (!this.mcasActive && (Date.now() >= this.mcasTime + 5000)) { this.mcasActive = true; this.mcasTime = Date.now(); }
                                }
                            }, 50));
                        }
                        break;
                    case "electrical":
                        if (!this.fails.electrical) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚡ TOTAL ELECTRICAL FAILURE - INSTRUMENTS LOST");
                            this.fails.electrical = true;
                            this.activeFailures.set("electrical", setInterval(() => { 
                                window.geofs.autopilot.turnOff(); 
                                window.instruments.hide(); 
                                if (ac.cockpitSetup) {
                                    for (let i = 1; i <= 5; i++) {
                                        if (ac.cockpitSetup.parts[i] && ac.cockpitSetup.parts[i].object3d) ac.cockpitSetup.parts[i].object3d._scale = [0,0,0];
                                    }
                                }
                            }, 1000));
                        }
                        break;
                    case "fuelLeak":
                        /**
                         * Fuel Starvation Engine
                         * Simulates a critical tank leak. Triggers absolute engine 
                         * flameout after a fixed 120-second grace period.
                         */
                        if (!this.fails.fuelLeak) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⛽ MAJOR FUEL LEAK - ENGINES STARVING");
                            this.fails.fuelLeak = true;

                            if (window.checklistSystem) {
                                this.addFailureEmergency("MAJOR FUEL LEAK", [
                                    { text: "FUEL CROSSFEED - OFF", desc: "Prevent leak from draining both tanks." },
                                    { text: "LAND - ASAP", desc: "Aircraft will lose all power in 120 seconds." },
                                    { text: "ENGINES - SHUT DOWN ON ROLLOUT", desc: "Prevent ground fire." }
                                ]);
                            }

                            // Starvation Sequence: Total engine shutdown in 120s
                            this.activeFailures.set("fuelLeak", setTimeout(() => {
                                this.activeFailures.delete("fuelLeak");
                                if (!this.fails.fuelLeak || window.geofs.aircraft.instance !== ac) return;
                                const stop = () => {
                                    if (window.geofs.aircraft.instance !== ac) {
                                        clearInterval(this.activeFailures.get("fuelKill"));
                                        this.activeFailures.delete("fuelKill");
                                        return;
                                    }
                                    if (typeof ac.stopEngines === "function") ac.stopEngines();
                                };
                                stop();
                                this.activeFailures.set("fuelKill", setInterval(stop, 1000));
                            }, 120000));
                        }
                        break;
                    case "structural":
                        if (!this.fails.structural) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ STRUCTURAL INTEGRITY LOSS - SPEED LIMIT RECOMMENDED");
                            this.fails.structural = true;
                            this.activeFailures.set("structural", setInterval(() => { window.weather.definition.turbulences = 3; }, 1000));
                        }
                        break;
                    case "pressurization":
                        if (!this.fails.pressurization) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("💨 CABIN DEPRESSURIZATION - DESCEND IMMEDIATELY");
                            this.fails.pressurization = true;
                            this.activeFailures.set("pressurization", setInterval(() => {
                                if (window.geofs.animation.values.altitude > 9000) window.weather.definition.turbulences = (window.geofs.animation.values.altitude - 9000) / 5000;
                                else window.weather.definition.turbulences = 0;
                            }, 1000));
                        }
                        break;
                    case "pitotStatic":
                        if (!this.fails.pitotStatic) {
                            if (window.V40_NOTIF) window.V40_NOTIF.critical("⚠️ PITOT-STATIC FAILURE - INSTRUMENT DATA UNRELIABLE");
                            this.fails.pitotStatic = true;
                            const instruments = window.instruments;
                            if (typeof instruments?.update === "function") {
                                const original = instruments.update;
                                const simulator = this;
                                const wrapper = function(...args) {
                                    const values = window.geofs?.animation?.values;
                                    if (!simulator.fails.pitotStatic || !values) return original.apply(this, args);
                                    const kias = values.kias, altitude = values.altitude;
                                    try { values.kias = 0; values.altitude = 0; return original.apply(this, args); }
                                    finally { values.kias = kias; values.altitude = altitude; }
                                };
                                this.pitotWrapper = { instruments, original, wrapper };
                                instruments.update = wrapper;
                            }
                        }
                        break;
                }
            }
        }

        /**
         * Reverts component state to nominal parameters and clears any
         * active emergency logic or visual FX.
         * 
         * @param {string} system - The identifier of the system to restore.
         */
        fix(system) {
            const ac = window.geofs.aircraft.instance;
            // Restore UI status indicator (LED)
            this.updateLED(system, false);

            // Clear persistent failure loops
            if (this.activeFailures.has(system)) { 
                clearInterval(this.activeFailures.get(system)); 
                this.activeFailures.delete(system); 
            }
            
            if (system.includes("engine")) {
                const idx = parseInt(system.replace("engine", ""));
                if (!this.fails.engines[idx]?.i || !ac.engines?.[idx]) return;
                this.fails.engines[idx].i = false;
                this.removeFailureEmergency(`ENG ${idx+1} FAILURE`);
                // Restore nominal thrust coefficients
                ac.engines[idx].thrust = ac.engines[idx]._p_thrust ?? 0;
                
                // Cleanup Visual FX
                if (this.engineFX.has(idx)) {
                    const fx = this.engineFX.get(idx);
                    clearInterval(fx.colorInt);
                    if (fx.emitter) fx.emitter.destroy();
                    this.engineFX.delete(idx);
                }
                if (window.V40_NOTIF) window.V40_NOTIF.success(`Engine ${idx+1} Restored.`);
            } else {
                // Restoration Registry: Reset physical state per component
                switch(system) {
                    case "gearFront": {
                        this.fails.landingGear.front = false;
                        const saved = this.gearOriginals.get("gearFront");
                        if (saved) saved.point[2] = saved.height;
                        this.gearOriginals.delete("gearFront");
                        break;
                    }
                    case "gearLeft": {
                        this.fails.landingGear.left = false;
                        const saved = this.gearOriginals.get("gearLeft");
                        if (saved) saved.point[2] = saved.height;
                        this.gearOriginals.delete("gearLeft");
                        break;
                    }
                    case "gearRight": {
                        this.fails.landingGear.right = false;
                        const saved = this.gearOriginals.get("gearRight");
                        if (saved) saved.point[2] = saved.height;
                        this.gearOriginals.delete("gearRight");
                        break;
                    }
                    case "ailerons": this.fails.flightCtrl.ailerons = false; ac.airfoils.forEach(a => { if(a.name.toLowerCase().includes("aileron")) a.object3d._scale = [1,1,1]; }); break;
                    case "elevators": this.fails.flightCtrl.elevators = false; ac.airfoils.forEach(a => { if(a.name.toLowerCase().includes("elevator")) a.object3d._scale = [1,1,1]; }); break;
                    case "rudder": this.fails.flightCtrl.rudder = false; ac.airfoils.forEach(a => { if(a.name.toLowerCase().includes("rudder")) a.object3d._scale = [1,1,1]; }); break;
                    case "flaps": this.fails.hydraulic.flaps = false; this.restoreControl("flaps"); break;
                    case "brakes": this.fails.hydraulic.brakes = false; break;
                    case "spoilers": this.fails.hydraulic.spoilers = false; this.restoreControl("spoilers"); break;
                    case "mcas": if (this.fails.mcas) this.removeFailureEmergency("UNCOMMANDED NOSE DOWN TRIM"); this.fails.mcas = false; window.controls.elevatorTrimMin = -1; break;
                    case "electrical": 
                        this.fails.electrical = false; 
                        if (ac.cockpitSetup) ac.cockpitSetup.parts.forEach(p => { if(p && p.object3d) p.object3d._scale = [1,1,1]; }); 
                        if (window.instruments) window.instruments.show(); 
                        break;
                    case "fuelLeak":
                        if (this.fails.fuelLeak) this.removeFailureEmergency("MAJOR FUEL LEAK");
                        this.fails.fuelLeak = false;
                        clearInterval(this.activeFailures.get("fuelKill"));
                        this.activeFailures.delete("fuelKill");
                        break;
                    case "structural": this.fails.structural = false; window.weather.definition.turbulences = 0; break;
                    case "pressurization": this.fails.pressurization = false; window.weather.definition.turbulences = 0; break;
                    case "pitotStatic": {
                        this.fails.pitotStatic = false;
                        const saved = this.pitotWrapper;
                        if (saved && saved.instruments.update === saved.wrapper) saved.instruments.update = saved.original;
                        this.pitotWrapper = null;
                        break;
                    }
                }
                if (window.V40_NOTIF) window.V40_NOTIF.success(`${system.toUpperCase()} Restored.`);
            }
        }

        /**
         * Probability Engine: Stochastic Failure Simulation
         * Periodic background task that evaluates system failure chances.
         */
        tick() {
            if (this.enabled) {
                // Evaluate the registered paths using the same identifiers as the buttons.
                for (const [group, entries] of Object.entries(this.chances)) {
                    if (Array.isArray(entries)) {
                        entries.forEach((chance, index) => { if (Math.random() < chance) this.fail(`engine${index}`); });
                    } else if (entries && typeof entries === "object") {
                        for (const [key, chance] of Object.entries(entries)) {
                            const system = group === "landingGear" ? ({ left: "gearLeft", right: "gearRight" }[key] || key) : key;
                            if (Math.random() < chance) this.fail(system);
                        }
                    } else if (Math.random() < entries) this.fail(group);
                }
                this.probabilityTimer = setTimeout(() => this.tick(), 60000);
            }
        }

        toggleProbability() {
            this.enabled = !this.enabled;
            clearTimeout(this.probabilityTimer);
            this.probabilityTimer = null;
            if (this.enabled) this.tick();
            const btn = document.getElementById('enBtn');
            if (btn) {
                btn.innerText = this.enabled ? "DISABLE PROBABILITY" : "ENABLE PROBABILITY";
                btn.style.background = this.enabled ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)";
            }
        }

        setProbability(path, val, sliderId) {
            const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
            let target = this.chances;
            for (let i = 0; i < parts.length - 1; i++) target = target[parts[i]];
            target[parts[parts.length - 1]] = val;
            
            const slider = document.getElementById(`slide-${sliderId}`);
            const valDisplay = document.getElementById(`val${sliderId}`);
            if (slider) slider.value = val;
            if (valDisplay) valDisplay.innerText = (val * 100).toFixed(0) + "%";
        }

        groupAuto(groupId) {
            if (window.V40_NOTIF) window.V40_NOTIF.info(`Auto-probability active for group: ${groupId.toUpperCase()}`);
            if (groupId === "gear") { ["1", "2", "3"].forEach(id => this.setProbability(id=="1"?"landingGear.gearFront":id=="2"?"landingGear.left":"landingGear.right", Math.random() * 0.1, id)); }
            if (groupId === "ctrl") { ["4", "5", "6"].forEach((id, i) => this.setProbability(["flightCtrl.ailerons", "flightCtrl.elevators", "flightCtrl.rudder"][i], Math.random() * 0.1, id)); }
            if (groupId === "hyd") { ["11", "12", "13"].forEach((id, i) => this.setProbability(["hydraulic.flaps", "hydraulic.brakes", "hydraulic.spoilers"][i], Math.random() * 0.1, id)); }
            if (groupId === "adv") { ["14", "7", "8", "9", "10", "15"].forEach((id, i) => this.setProbability(["electrical", "fuelLeak", "structural", "pressurization", "mcas", "pitotStatic"][i], Math.random() * 0.05, id)); }
            if (groupId === "eng") { for (let i = 0; i < (window.geofs.aircraft.instance.engines?.length || 0); i++) this.setProbability(`engines[${i}]`, Math.random() * 0.1, `Eng${i}`); }
        }

        groupFail(groupId) {
            let systems = [];
            if (groupId === "gear") systems = ["gearFront", "gearLeft", "gearRight"];
            if (groupId === "ctrl") systems = ["ailerons", "elevators", "rudder"];
            if (groupId === "hyd") systems = ["flaps", "brakes", "spoilers"];
            if (groupId === "adv") systems = ["electrical", "fuelLeak", "structural", "pressurization", "mcas", "pitotStatic"];
            if (groupId === "eng") { for (let i = 0; i < (window.geofs.aircraft.instance.engines?.length || 0); i++) systems.push("engine" + i); }
            systems.forEach(s => this.fail(s));
        }

        groupFix(groupId) {
            let systems = [];
            if (groupId === "gear") systems = ["gearFront", "gearLeft", "gearRight"];
            if (groupId === "ctrl") systems = ["ailerons", "elevators", "rudder"];
            if (groupId === "hyd") systems = ["flaps", "brakes", "spoilers"];
            if (groupId === "adv") systems = ["electrical", "fuelLeak", "structural", "pressurization", "mcas", "pitotStatic"];
            if (groupId === "eng") { for (let i = 0; i < (window.geofs.aircraft.instance.engines?.length || 0); i++) systems.push("engine" + i); }
            systems.forEach(s => this.fix(s));
        }

        toggleSection(groupId) {
            const content = document.getElementById(`sect-content-${groupId}`);
            const arrow = document.getElementById(`sect-arrow-${groupId}`);
            if (content) {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                if (arrow) arrow.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
            }
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .pulse-red { animation: pulseRed 1s infinite alternate; }
        @keyframes pulseRed { from { box-shadow: 0 0 5px #ef4444; } to { box-shadow: 0 0 15px #ef4444; } }
        .sect-header:hover { background: rgba(255, 255, 255, 0.15); }
    `;
    document.head.appendChild(style);

    function initDraggable(el, handle, storageKey) {
        let isDragging = false, startX, startY;
        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
            isDragging = true;
            startX = e.clientX - el.offsetLeft;
            startY = e.clientY - el.offsetTop;
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', stop);
        });
        function move(e) {
            if (!isDragging) return;
            let newX = e.clientX - startX;
            let newY = e.clientY - startY;
            const maxX = window.innerWidth - el.offsetWidth;
            const maxY = window.innerHeight - el.offsetHeight;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            el.style.left = newX + 'px';
            el.style.top = newY + 'px';
            el.style.right = 'auto'; el.style.bottom = 'auto';
        }
        function stop() { 
            if (!isDragging) return;
            isDragging = false; 
            document.removeEventListener('mousemove', move); 
            document.removeEventListener('mouseup', stop); 
            if (storageKey) {
                localStorage.setItem(storageKey, JSON.stringify({ left: el.style.left, top: el.style.top }));
            }
        }

        const keepVisible = () => {
            if (!el.isConnected) return;
            const rect = el.getBoundingClientRect();
            if (rect.left < 0 || rect.top < 0 || rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
                el.style.left = Math.max(0, Math.min(rect.left, window.innerWidth - rect.width)) + 'px';
                el.style.top = Math.max(0, Math.min(rect.top, window.innerHeight - rect.height)) + 'px';
                el.style.right = 'auto'; el.style.bottom = 'auto';
            }
        };
        window.addEventListener('resize', keepVisible);
        requestAnimationFrame(keepVisible);

        // Load Position
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const pos = JSON.parse(saved);
                    if (pos && typeof pos.left === 'string' && pos.left.includes('px') &&
                        typeof pos.top === 'string' && pos.top.includes('px')) {
                        const leftVal = parseFloat(pos.left);
                        const topVal = parseFloat(pos.top);
                        if (!isNaN(leftVal) && !isNaN(topVal) && 
                            leftVal >= 0 && leftVal < window.innerWidth &&
                            topVal >= 0 && topVal < window.innerHeight) {
                            el.style.left = pos.left;
                            el.style.top = pos.top;
                            el.style.right = 'auto'; el.style.bottom = 'auto';
                        }
                    }
                } catch(e) {}
            }
        }
    }

    function buildRow(title, desc, id, failId, path) {
        return `
        <div style="margin-bottom: 8px; padding: 10px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <div id="led-${failId}" style="width:8px; height:8px; border-radius:50%; background:#22c55e; box-shadow:0 0 5px #22c55e; transition:0.3s;"></div>
                    <span style="font-size:11px; font-weight:bold; color:#dddddd;">${title}</span>
                </div>
                <span id="val${id}" style="font-size:10px; color:rgba(255,255,255,0.4);">0%</span>
            </div>
            <div style="font-size:10px; color:rgba(255,255,255,0.4); margin-bottom:8px; font-style:italic; line-height:1.2;">${desc}</div>
            <input type="range" id="slide-${id}" min="0" max="1" step="0.01" value="0" style="width:100%; height:4px; margin-bottom:10px;" oninput="window.failureSimulator.setProbability('${path}', parseFloat(this.value), '${id}')">
            <div style="display:flex; gap:5px;">
                <button onclick="window.failureSimulator.fail('${failId}')" style="flex:1; padding:5px; background:rgba(239,68,68,0.2); border:1px solid #ef4444; color:#ff6b6b; font-size:10px; cursor:pointer;">FAIL</button>
                <button onclick="window.failureSimulator.fix('${failId}')" style="flex:1; padding:5px; background:rgba(34,197,94,0.2); border:1px solid #22c55e; color:#4ade80; font-size:10px; cursor:pointer;">FIX</button>
            </div>
        </div>`;
    }

    window.openFailureSimulatorMenu = () => {
        if (!window.failureSimulator) window.failureSimulator = new FailureSimulator();
        let menu = document.getElementById('geofs-failure-menu');
        if (!menu) {
            menu = document.createElement("div");
            menu.id = "geofs-failure-menu";
            menu.style.cssText = "position:fixed; left:50px; top:100px; width:420px; background:rgba(26,26,26,0.95); border:1px solid rgba(255, 255, 255, 0.12); border-radius:12px; z-index:2000001; color:white; display:none; flex-direction:column; box-shadow: 0 10px 40px rgba(0,0,0,0.6); backdrop-filter: blur(14px); padding:20px;";
            
            let html = `
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; cursor:move;" id="fail-header">
                    <span style="font-weight:bold; font-size:12px; letter-spacing:1px; color:#dddddd;">⚠️ FAILURE SIMULATOR</span>
                    <button onclick="document.getElementById('geofs-failure-menu').style.display='none'" style="background:none; border:none; color:white; cursor:pointer; font-size:18px;">✕</button>
                </div>
                <div style="max-height:70vh; overflow-y:auto; padding-right:5px;">
                    <button id="enBtn" onclick="window.failureSimulator.toggleProbability()" style="width:100%; padding:12px; margin-bottom:20px; background:rgba(34,197,94,0.2); border:1px solid #22c55e; color:white; cursor:pointer; font-weight:bold; border-radius:8px;">ENABLE PROBABILITY</button>
            `;

            const section = (title, groupId, contentHtml) => `
                <div style="margin-bottom:15px;">
                    <div class="sect-header" onclick="window.failureSimulator.toggleSection('${groupId}')" style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:rgba(255, 255, 255, 0.05); border-radius:8px; cursor:pointer; transition:0.2s;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span id="sect-arrow-${groupId}" style="font-size:10px; transition:0.3s; transform:rotate(90deg);">▶</span>
                            <span style="font-size:10px; color:#dddddd; text-transform:uppercase; letter-spacing:2px; font-weight:900;">${title}</span>
                        </div>
                        <div style="display:flex; gap:3px;" onclick="event.stopPropagation()">
                            <button onclick="window.failureSimulator.groupAuto('${groupId}')" style="padding:2px 6px; font-size:10px; background:rgba(255, 255, 255, 0.15); border:1px solid #dddddd; color:#dddddd; cursor:pointer; border-radius:4px; font-weight:bold;">AUTO</button>
                            <button onclick="window.failureSimulator.groupFail('${groupId}')" style="padding:2px 6px; font-size:10px; background:rgba(239,68,68,0.1); border:1px solid #ef4444; color:#ff6b6b; cursor:pointer; border-radius:4px; font-weight:bold;">FAIL</button>
                            <button onclick="window.failureSimulator.groupFix('${groupId}')" style="padding:2px 6px; font-size:10px; background:rgba(34,197,94,0.1); border:1px solid #22c55e; color:#4ade80; cursor:pointer; border-radius:4px; font-weight:bold;">FIX</button>
                        </div>
                    </div>
                    <div id="sect-content-${groupId}" style="padding:10px 5px 0 5px;">${contentHtml}</div>
                </div>`;
            
            const gearHtml = buildRow("Nose Gear", "Nose/Tail wheel collapse. May cause steering loss and ground loops.", "1", "gearFront", "landingGear.gearFront") + 
                           buildRow("Left Main Gear", "Left main landing gear collapse. Aircraft will tilt heavily to the left.", "2", "gearLeft", "landingGear.left") + 
                           buildRow("Right Main Gear", "Right main landing gear collapse. Aircraft will tilt heavily to the right.", "3", "gearRight", "landingGear.right");
            html += section("Landing Gear", "gear", gearHtml);

            const ctrlHtml = buildRow("Ailerons", "Roll surface jam. Total loss of roll control; aircraft will be hard to level.", "4", "ailerons", "flightCtrl.ailerons") + 
                           buildRow("Elevators", "Pitch surface jam. Loss of pitch control; aircraft may become unstable.", "5", "elevators", "flightCtrl.elevators") + 
                           buildRow("Rudder", "Yaw surface jam. Loss of directional control; critical during crosswinds.", "6", "rudder", "flightCtrl.rudder");
            html += section("Flight Controls", "ctrl", ctrlHtml);

            const hydHtml = buildRow("Flaps Jam", "Hydraulic loss preventing flap extension. Higher landing speeds expected.", "11", "flaps", "hydraulic.flaps") + 
                          buildRow("Brakes Failure", "Wheel brakes non-functional. Requires long runway or glass to stop.", "12", "brakes", "hydraulic.brakes") + 
                          buildRow("Spoilers Jam", "Speedbrakes fail to deploy. Difficult to slow down after touchdown.", "13", "spoilers", "hydraulic.spoilers");
            html += section("Hydraulics & Systems", "hyd", hydHtml);

            const advHtml = buildRow("Electrical Failure", "Total instrument blackout. Autopilot and glass cockpit parts will go dark.", "14", "electrical", "electrical") + 
                          buildRow("Fuel Tank Leak", "Critical fuel loss. Engines will starve and flame out in exactly 2 minutes.", "7", "fuelLeak", "fuelLeak") + 
                          buildRow("Structural Integrity", "Airframe damage. Severe vibrations and speed-limited structural stability.", "8", "structural", "structural") + 
                          buildRow("Cabin Pressure", "Decompression. Higher altitudes will cause severe pilot disorientation.", "9", "pressurization", "pressurization") + 
                          buildRow("MCAS System", "Erroneous trim commands. System will repeatedly cycle nose-down trim.", "10", "mcas", "mcas") + 
                          buildRow("Pitot-Static", "Sensor failure. All primary flight instruments will read zero.", "15", "pitotStatic", "pitotStatic");
            html += section("Advanced Emergencies", "adv", advHtml);

            const numEng = (window.geofs.aircraft.instance.engines?.length || 0);
            let engHtml = "";
            for (let i = 0; i < numEng; i++) engHtml += buildRow(`Engine ${i+1}`, "Thrust loss and heavy smoke. Expect heavy yaw and loss of climb performance.", `Eng${i}`, `engine${i}`, `engines[${i}]`);
            html += section("Engines", "eng", engHtml);

            html += `</div>`;
            menu.innerHTML = html;
            document.body.appendChild(menu);
            initDraggable(menu, document.getElementById('fail-header'), 'geofs-failure-menu-pos');
        }
        menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
    };

    window.initFailures = () => {
        if (isUnsupportedGeoFS()) return;
        if (document.getElementById('fail-btn')) return;
        const btn = document.createElement('div');
        btn.id = 'fail-btn';
        btn.style.cssText = "position:fixed; right:15px; bottom:15px; z-index:2000000; padding:5px 15px; background:rgba(0,0,0,0.7); color:white; border:1px solid #888; border-radius:15px; font-weight:bold; font-size:10px; cursor:move; box-shadow:0 4px 15px rgba(0,0,0,0.5);";
        btn.innerText = "FAILURES";
        
        let hasMoved = false;
        initDraggable(btn, btn, 'geofs-failure-btn-pos');
        btn.addEventListener('mousedown', () => hasMoved = false);
        btn.addEventListener('mousemove', () => hasMoved = true);
        btn.addEventListener('mouseup', () => { if(!hasMoved) window.openFailureSimulatorMenu(); });
        
        document.body.appendChild(btn);
    };

    function check() {
        if (isUnsupportedGeoFS()) {
            console.warn("[GeoFS-V4.0_Failure-Simulator] Inactive: GeoFS v" + window.geofs?.version + " detected (suite only supports GeoFS v4.0).");
            return;
        }
        if (window.geofs && window.geofs.aircraft && window.geofs.aircraft.instance) window.initFailures();
        else setTimeout(check, 1000);
    }
    if (window.SafeInit) {
        window.SafeInit('GeoFS-V4.0_Failure-Simulator', check);
    } else {
        check();
    }
})();



})();
