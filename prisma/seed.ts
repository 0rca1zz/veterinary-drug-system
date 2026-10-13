/**
 * 种子数据（演示数据）
 * ============================================================
 * 本系统仅供动物医学学习与临床辅助参考，不替代执业兽医诊断。
 * 所有疾病、兽药、剂量、关联均为【演示数据】，不代表真实临床用药依据。
 * 规则引擎仅做候选药物筛选与禁忌/风险提示，不自动开处方、不生成治疗方案。
 * ============================================================
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------- 动物种类 ----------
const animals = [
  { name: "犬", code: "dog" },
  { name: "猫", code: "cat" },
  { name: "猪", code: "pig" },
  { name: "牛", code: "cattle" },
  { name: "羊", code: "sheep" },
  { name: "家禽", code: "poultry" },
];

// ---------- 药物分类 ----------
const categories = [
  { name: "抗生素" },
  { name: "抗寄生虫药" },
  { name: "解热镇痛抗炎药" },
  { name: "糖皮质激素" },
  { name: "抗真菌药" },
  { name: "止泻/肠道调节剂" },
  { name: "耳科用药" },
  { name: "眼科用药" },
  { name: "皮肤科用药" },
  { name: "泌尿系统用药" },
  { name: "呼吸系统用药" },
  { name: "消化系统用药" },
  { name: "维生素与营养补充剂" },
  { name: "疫苗" },
];

// ---------- 疾病 ----------
type DiseaseSeed = {
  name: string;
  speciesCode: string;
  category: string;
  description: string;
  cause: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  examinations: string;
  recommendedDrugCategories: string;
  notes: string;
};

const diseases: DiseaseSeed[] = [
  // ===== 犬 =====
  {
    name: "犬细小病毒性肠炎",
    speciesCode: "dog",
    category: "传染病",
    description: "由犬细小病毒引起的急性高度接触性传染病，以出血性肠炎和心肌炎为特征，幼犬高发。",
    cause: "犬细小病毒（CPV-2）经粪口传播，感染肠道上皮细胞与心肌细胞。",
    symptoms: "剧烈呕吐、血性腹泻、食欲废绝、脱水、精神沉郁；幼犬可见心肌炎型急性死亡。",
    diagnosis: "病史与典型症状；CPV 抗原快速检测；血常规见白细胞显著减少。",
    treatment: "以支持疗法为主：补液纠正脱水与电解质紊乱、止吐、控制继发感染、维持营养。",
    examinations: "CPV 抗原检测、血常规、血气与电解质。",
    recommendedDrugCategories: "止泻/肠道调节剂,抗生素,维生素与营养补充剂",
    notes: "高传染性，需隔离消毒；幼犬应按时接种疫苗。",
  },
  {
    name: "犬瘟热",
    speciesCode: "dog",
    category: "传染病",
    description: "由犬瘟热病毒引起的高度接触性传染病，表现为呼吸道、消化道、神经系统与皮肤多系统症状。",
    cause: "犬瘟热病毒（CDV）经飞沫与接触传播。",
    symptoms: "双相热、流涕咳嗽、眼鼻分泌物、呕吐腹泻、神经症状（抽搐、共济失调）、足垫硬化。",
    diagnosis: "典型症状与病史；CDV 抗原/抗体检测；血常规与脑脊液检查。",
    treatment: "以支持与对症治疗为主：控制继发感染、维持营养与补液、控制神经症状。",
    examinations: "CDV 检测、血常规、神经系统检查。",
    recommendedDrugCategories: "抗生素,维生素与营养补充剂,疫苗",
    notes: "预后与神经症状密切相关；预防靠疫苗接种。",
  },
  {
    name: "犬皮肤真菌病",
    speciesCode: "dog",
    category: "皮肤病",
    description: "由小孢子菌、毛癣菌等皮肤癣菌引起的皮肤真菌感染，具传染性。",
    cause: "犬小孢子菌、石膏样小孢子菌、须毛癣菌等感染角质层与毛干。",
    symptoms: "圆形脱毛斑、鳞屑、红斑、毛干断裂，常见于头面、四肢。",
    diagnosis: "伍德氏灯检查、皮肤刮片镜检、真菌培养。",
    treatment: "局部抗真菌药浴与外用药，配合全身抗真菌药；环境消毒。",
    examinations: "伍德氏灯、皮肤刮片、真菌培养。",
    recommendedDrugCategories: "抗真菌药,皮肤科用药",
    notes: "人畜共患，注意防护；治疗周期较长。",
  },
  {
    name: "犬肠胃炎",
    speciesCode: "dog",
    category: "消化系统疾病",
    description: "犬胃肠黏膜的急性或慢性炎症，表现为呕吐、腹泻等消化道症状。",
    cause: "饮食不当、细菌/病毒/寄生虫感染、异物、药物刺激等。",
    symptoms: "呕吐、腹泻（稀便至血便）、腹痛、食欲减退、脱水。",
    diagnosis: "病史与体格检查；粪便检查；必要时血常规、影像学。",
    treatment: "禁食或易消化饮食、补液、止吐止泻、保护胃肠黏膜、控制感染。",
    examinations: "粪便检查、血常规、腹部影像学。",
    recommendedDrugCategories: "止泻/肠道调节剂,抗生素,消化系统用药",
    notes: "幼犬与老年犬脱水风险高，需及时补液。",
  },
  {
    name: "犬外耳炎",
    speciesCode: "dog",
    category: "耳科疾病",
    description: "犬外耳道皮肤的炎症，常见于垂耳犬与耳道狭窄个体。",
    cause: "细菌、酵母菌、耳螨感染或过敏、异物、潮湿等。",
    symptoms: "摇头、抓耳、耳道红肿、分泌物增多、异味、疼痛。",
    diagnosis: "耳镜检查、耳道分泌物涂片镜检与培养。",
    treatment: "清洁耳道、局部耳用滴剂抗感染抗炎，必要时全身用药。",
    examinations: "耳镜检查、分泌物细胞学与培养。",
    recommendedDrugCategories: "耳科用药,抗生素,抗真菌药",
    notes: "需坚持疗程，防止复发。",
  },
  {
    name: "犬传染性肝炎",
    speciesCode: "dog",
    category: "传染病",
    description: "由犬腺病毒Ⅰ型引起的急性传染病，以肝脏损伤与角膜混浊为特征。",
    cause: "犬腺病毒Ⅰ型（CAV-1）经口感染，侵害肝细胞与血管内皮。",
    symptoms: "发热、食欲废绝、呕吐、腹痛、黄疸、角膜混浊（蓝眼）。",
    diagnosis: "典型症状、病史；CAV 检测；肝功能与凝血检查。",
    treatment: "支持疗法：护肝、补液、控制继发感染。",
    examinations: "肝功能、凝血功能、CAV 检测。",
    recommendedDrugCategories: "维生素与营养补充剂,抗生素",
    notes: "康复期仍可排毒；疫苗接种可预防。",
  },
  {
    name: "犬钩端螺旋体病",
    speciesCode: "dog",
    category: "传染病",
    description: "由致病性钩端螺旋体引起的人畜共患病，主要损害肾与肝。",
    cause: "钩端螺旋体经污染的水源、尿液接触感染。",
    symptoms: "发热、呕吐、黄疸、出血倾向、急性肾衰竭、血红蛋白尿。",
    diagnosis: "血清学检测、PCR、尿液暗视野镜检、肝肾功能检查。",
    treatment: "抗生素治疗（清除病原）联合支持疗法（补液、护肾肝）。",
    examinations: "血清学、PCR、肝肾功能。",
    recommendedDrugCategories: "抗生素,维生素与营养补充剂",
    notes: "人畜共患病，接触病犬需防护。",
  },
  // ===== 猫 =====
  {
    name: "猫瘟（猫泛白细胞减少症）",
    speciesCode: "cat",
    category: "传染病",
    description: "由猫细小病毒引起的高度接触性传染病，以白细胞急剧减少与出血性肠炎为特征。",
    cause: "猫细小病毒（FPV）经粪口与接触传播。",
    symptoms: "高热、呕吐、血性腹泻、脱水、白细胞显著减少、精神沉郁。",
    diagnosis: "FPV 抗原检测、血常规（白细胞减少）。",
    treatment: "以支持疗法为主：补液、止吐、控制继发感染、营养支持。",
    examinations: "FPV 抗原检测、血常规。",
    recommendedDrugCategories: "抗生素,维生素与营养补充剂,疫苗",
    notes: "未免疫幼猫高发，死亡率高。",
  },
  {
    name: "猫鼻支气管炎（猫鼻支）",
    speciesCode: "cat",
    category: "呼吸系统疾病",
    description: "由猫疱疹病毒与杯状病毒等引起的上呼吸道感染综合征。",
    cause: "猫疱疹病毒Ⅰ型（FHV-1）、猫杯状病毒（FCV），经飞沫与接触传播。",
    symptoms: "打喷嚏、流涕、结膜炎、眼鼻分泌物、发热、食欲减退、口腔溃疡。",
    diagnosis: "临床症状、病原 PCR 检测。",
    treatment: "对症支持：清理分泌物、抗继发感染、营养支持，必要时抗病毒。",
    examinations: "病原 PCR、眼鼻分泌物检查。",
    recommendedDrugCategories: "抗生素,眼科用药,疫苗",
    notes: "疱疹病毒带毒后易复发。",
  },
  {
    name: "猫口炎",
    speciesCode: "cat",
    category: "口腔疾病",
    description: "猫口腔黏膜的慢性炎症，可累及牙龈、舌与咽部，疼痛明显。",
    cause: "免疫介导、牙菌斑、病毒感染（杯状病毒）等多因素。",
    symptoms: "流涎、口臭、进食困难、牙龈红肿溃疡、消瘦。",
    diagnosis: "口腔检查、牙科 X 线、必要时活检。",
    treatment: "抗炎止痛、控制继发感染、口腔清洁；顽固病例需拔牙。",
    examinations: "口腔检查、牙科 X 线。",
    recommendedDrugCategories: "糖皮质激素,抗生素,皮肤科用药",
    notes: "常需长期管理，疼痛控制重要。",
  },
  {
    name: "猫皮肤真菌病",
    speciesCode: "cat",
    category: "皮肤病",
    description: "由皮肤癣菌引起的猫皮肤真菌感染，最常见为犬小孢子菌。",
    cause: "犬小孢子菌等皮肤癣菌感染。",
    symptoms: "脱毛、鳞屑、圆形斑片、断毛，常见于头面部与耳周。",
    diagnosis: "伍德氏灯、皮肤刮片、真菌培养。",
    treatment: "局部抗真菌药浴与外用药，配合全身抗真菌药。",
    examinations: "伍德氏灯、皮肤刮片、真菌培养。",
    recommendedDrugCategories: "抗真菌药,皮肤科用药",
    notes: "人畜共患，注意防护与消毒。",
  },
  {
    name: "猫结膜炎",
    speciesCode: "cat",
    category: "眼科疾病",
    description: "猫结膜的炎症，可为感染性（病毒/细菌）或过敏性。",
    cause: "猫疱疹病毒、衣原体、支原体、细菌或过敏刺激。",
    symptoms: "结膜充血、水肿、流泪、分泌物增多、眯眼。",
    diagnosis: "眼科检查、眼分泌物细胞学与培养、病原 PCR。",
    treatment: "局部眼药抗感染/抗炎，清洁分泌物；针对病因治疗。",
    examinations: "眼科检查、分泌物检查。",
    recommendedDrugCategories: "眼科用药,抗生素",
    notes: "避免使用含糖皮质激素的复方制剂于角膜溃疡病例。",
  },
  {
    name: "猫泌尿系统综合征（FLUTD）",
    speciesCode: "cat",
    category: "泌尿系统疾病",
    description: "猫下泌尿道疾病综合征，包括特发性膀胱炎、尿石症、尿道阻塞等。",
    cause: "多因素：应激、饮食、肥胖、饮水不足、结石等。",
    symptoms: "尿频、血尿、排尿困难、乱尿、尿闭（公猫危重）。",
    diagnosis: "尿检、影像学（X 线/超声）、尿液培养。",
    treatment: "解除阻塞、镇痛、抗感染、增加饮水、饮食管理。",
    examinations: "尿常规、尿沉渣、影像学。",
    recommendedDrugCategories: "抗生素,解热镇痛抗炎药,泌尿系统用药",
    notes: "尿闭为急症，需立即导尿。",
  },
  {
    name: "猫传染性腹膜炎（FIP）",
    speciesCode: "cat",
    category: "传染病",
    description: "由猫冠状病毒突变引起的全身性免疫介导性疾病，分湿性与干性。",
    cause: "猫冠状病毒（FCoV）突变株感染。",
    symptoms: "湿性：胸腹腔积液、腹围增大；干性：眼、神经、肝脾肉芽肿。",
    diagnosis: "临床特征、渗出液分析、抗体滴度、组织病理。",
    treatment: "以抗病毒与免疫调节为主，配合支持疗法。",
    examinations: "渗出液分析、血清学、超声。",
    recommendedDrugCategories: "糖皮质激素,维生素与营养补充剂",
    notes: "本演示库仅列支持用药，具体诊疗请遵兽医。",
  },
  // ===== 猪 =====
  {
    name: "猪繁殖与呼吸综合征（蓝耳病）",
    speciesCode: "pig",
    category: "传染病",
    description: "由猪繁殖与呼吸综合征病毒引起的病毒性传染病，造成繁殖障碍与呼吸道症状。",
    cause: "PRRSV 感染，经呼吸道、接触与垂直传播。",
    symptoms: "母猪流产、死胎、弱仔；仔猪呼吸困难、发热、生长迟缓。",
    diagnosis: "血清学与 PCR 检测、临床与剖检特征。",
    treatment: "无特效药，以控制继发感染、支持疗法与生物安全为主。",
    examinations: "PRRSV PCR、血清学。",
    recommendedDrugCategories: "抗生素,维生素与营养补充剂,疫苗",
    notes: "免疫抑制性疾病，注意继发感染防控。",
  },
  {
    name: "仔猪腹泻",
    speciesCode: "pig",
    category: "消化系统疾病",
    description: "仔猪常见消化道疾病，由细菌、病毒或寄生虫等引起。",
    cause: "大肠杆菌、轮状病毒、球虫、管理不当等。",
    symptoms: "水样腹泻、脱水、消瘦、生长迟缓。",
    diagnosis: "粪便检查、病原检测、剖检。",
    treatment: "补液防脱水、止泻、控制感染、改善饲养管理。",
    examinations: "粪便检查、病原检测。",
    recommendedDrugCategories: "止泻/肠道调节剂,抗生素",
    notes: "早补液是降低死亡率的关键。",
  },
  {
    name: "猪圆环病毒病",
    speciesCode: "pig",
    category: "传染病",
    description: "由猪圆环病毒2型引起的多系统疾病，造成断奶仔猪衰竭综合征。",
    cause: "PCV-2 感染，诱发免疫抑制。",
    symptoms: "消瘦、淋巴结肿大、呼吸困难、腹泻、皮肤苍白。",
    diagnosis: "PCR 检测、病理组织学。",
    treatment: "无特效药，控制继发感染与支持疗法。",
    examinations: "PCV-2 PCR、病理检查。",
    recommendedDrugCategories: "抗生素,维生素与营养补充剂",
    notes: "免疫抑制明显，需综合防控。",
  },
  {
    name: "猪丹毒",
    speciesCode: "pig",
    category: "传染病",
    description: "由猪丹毒杆菌引起的急性或慢性传染病，以皮肤菱形疹为特征。",
    cause: "猪丹毒杆菌经消化道或皮肤伤口感染。",
    symptoms: "高热、皮肤菱形红斑（打火印）、关节炎、心内膜炎。",
    diagnosis: "临床特征、细菌培养。",
    treatment: "抗生素治疗，青霉素类为首选。",
    examinations: "细菌培养、药敏试验。",
    recommendedDrugCategories: "抗生素",
    notes: "人畜共患，接触需防护。",
  },
  {
    name: "猪喘气病（支原体肺炎）",
    speciesCode: "pig",
    category: "呼吸系统疾病",
    description: "由猪肺炎支原体引起的慢性呼吸道传染病，以咳嗽与生长迟缓为主。",
    cause: "猪肺炎支原体感染。",
    symptoms: "阵发性干咳、呼吸困难、生长缓慢。",
    diagnosis: "临床症状、血清学、PCR、剖检。",
    treatment: "大环内酯类、四环素类等抗支原体药物，配合管理。",
    examinations: "血清学、PCR。",
    recommendedDrugCategories: "抗生素,呼吸系统用药",
    notes: "慢病消耗，影响饲料转化率。",
  },
  // ===== 牛 =====
  {
    name: "奶牛乳房炎",
    speciesCode: "cattle",
    category: "乳腺疾病",
    description: "奶牛乳腺的炎症，是奶牛最常见的疾病之一，影响产奶量与奶品质。",
    cause: "细菌感染（链球菌、葡萄球菌、大肠杆菌等）为主，与挤奶卫生相关。",
    symptoms: "乳房红肿热痛、乳汁异常（凝块、变色）、全身症状。",
    diagnosis: "乳房检查、乳汁体细胞计数、细菌培养。",
    treatment: "抗生素治疗、抗炎、增加挤奶频率、干奶期管理。",
    examinations: "乳汁体细胞计数、细菌培养与药敏。",
    recommendedDrugCategories: "抗生素,解热镇痛抗炎药",
    notes: "注意弃奶期与休药期。",
  },
  {
    name: "牛病毒性腹泻",
    speciesCode: "cattle",
    category: "传染病",
    description: "由牛病毒性腹泻病毒引起的传染病，造成腹泻、繁殖障碍与免疫抑制。",
    cause: "BVDV 感染，经接触与垂直传播。",
    symptoms: "发热、腹泻、口腔溃疡、流产、黏膜病。",
    diagnosis: "血清学、PCR、抗原检测。",
    treatment: "以支持疗法与控制继发感染为主。",
    examinations: "BVDV 检测。",
    recommendedDrugCategories: "抗生素,维生素与营养补充剂",
    notes: "持续性感染牛是重要传染源。",
  },
  {
    name: "犊牛腹泻",
    speciesCode: "cattle",
    category: "消化系统疾病",
    description: "犊牛常见消化道疾病，由细菌、病毒或寄生虫等引起。",
    cause: "大肠杆菌、轮状病毒、隐孢子虫、管理不当等。",
    symptoms: "水样腹泻、脱水、精神沉郁、酸中毒。",
    diagnosis: "粪便检查、病原检测、血气。",
    treatment: "补液纠正脱水与酸中毒、止泻、控制感染。",
    examinations: "粪便检查、血气电解质。",
    recommendedDrugCategories: "止泻/肠道调节剂,抗生素",
    notes: "口服补液盐及时使用可显著降低死亡率。",
  },
  {
    name: "牛蹄叶炎",
    speciesCode: "cattle",
    category: "蹄病",
    description: "牛蹄真皮的炎症，引起跛行与蹄部疼痛。",
    cause: "瘤胃酸中毒、高精料日粮、产后应激等。",
    symptoms: "跛行、站立姿势异常、蹄部发热疼痛。",
    diagnosis: "临床检查、蹄部检查。",
    treatment: "镇痛抗炎、修蹄、调整日粮、改善垫料。",
    examinations: "蹄部检查、步态评估。",
    recommendedDrugCategories: "解热镇痛抗炎药",
    notes: "预防重点在合理日粮与修蹄。",
  },
  // ===== 羊 =====
  {
    name: "羊口疮（羊传染性脓疱）",
    speciesCode: "sheep",
    category: "传染病",
    description: "由羊口疮病毒引起的接触性传染病，以口唇部脓疱与结痂为特征。",
    cause: "羊口疮病毒（Orf virus）经皮肤破损感染。",
    symptoms: "口唇、鼻部丘疹、水疱、脓疱、结痂。",
    diagnosis: "典型症状、病毒检测。",
    treatment: "局部消毒护理、控制继发感染、支持疗法。",
    examinations: "临床检查、病毒检测。",
    recommendedDrugCategories: "皮肤科用药,抗生素,维生素与营养补充剂",
    notes: "人畜共患，接触需防护。",
  },
  {
    name: "羊腐蹄病",
    speciesCode: "sheep",
    category: "蹄病",
    description: "由坏死梭杆菌与节瘤拟杆菌等引起的蹄部传染病。",
    cause: "坏死梭杆菌、节瘤拟杆菌等感染，潮湿环境高发。",
    symptoms: "跛行、蹄部肿胀溃烂、恶臭。",
    diagnosis: "临床检查、细菌培养。",
    treatment: "修蹄、局部消毒、抗生素治疗。",
    examinations: "蹄部检查、细菌培养。",
    recommendedDrugCategories: "抗生素,解热镇痛抗炎药",
    notes: "保持圈舍干燥、定期修蹄。",
  },
  {
    name: "羊快疫",
    speciesCode: "sheep",
    category: "传染病",
    description: "由腐败梭菌引起的急性致死性传染病，发病急、死亡快。",
    cause: "腐败梭菌经消化道感染。",
    symptoms: "突然死亡、腹胀、腹泻、痉挛。",
    diagnosis: "剖检特征、细菌学检查。",
    treatment: "发病急，治疗困难，重在预防与紧急处理。",
    examinations: "剖检、细菌学检查。",
    recommendedDrugCategories: "抗生素,维生素与营养补充剂",
    notes: "预防靠疫苗接种与饲养管理。",
  },
  {
    name: "羊肝片吸虫病",
    speciesCode: "sheep",
    category: "寄生虫病",
    description: "由肝片吸虫寄生于肝胆管引起的寄生虫病。",
    cause: "肝片吸虫感染，中间宿主为椎实螺。",
    symptoms: "消瘦、贫血、下颌水肿、腹泻、黄疸。",
    diagnosis: "粪便虫卵检查、血清学。",
    treatment: "驱虫治疗，配合支持疗法。",
    examinations: "粪便虫卵检查。",
    recommendedDrugCategories: "抗寄生虫药",
    notes: "注意牧场螺类防控与轮牧。",
  },
  // ===== 家禽 =====
  {
    name: "鸡新城疫",
    speciesCode: "poultry",
    category: "传染病",
    description: "由新城疫病毒引起的急性高度接触性传染病，以呼吸道与神经症状为特征。",
    cause: "新城疫病毒（NDV）经呼吸道与消化道传播。",
    symptoms: "呼吸困难、绿色下痢、神经症状（扭颈）、产蛋下降。",
    diagnosis: "临床症状、病毒分离、血清学。",
    treatment: "无特效药，以预防接种与生物安全为主。",
    examinations: "病毒检测、血清学。",
    recommendedDrugCategories: "疫苗,维生素与营养补充剂,抗生素",
    notes: "法定报告疫病，重在免疫预防。",
  },
  {
    name: "禽流感",
    speciesCode: "poultry",
    category: "传染病",
    description: "由 A 型流感病毒引起的禽类传染病，高致病性毒株危害巨大。",
    cause: "A 型流感病毒（H5/H7 等高致病性毒株）。",
    symptoms: "呼吸困难、肿头、产蛋骤降、出血、高死亡率。",
    diagnosis: "病毒检测、血清学。",
    treatment: "高致病性禽流感依法处置，重在防控。",
    examinations: "病毒检测、血清学。",
    recommendedDrugCategories: "维生素与营养补充剂,抗生素",
    notes: "法定报告疫病，严禁自行治疗。",
  },
  {
    name: "鸡球虫病",
    speciesCode: "poultry",
    category: "寄生虫病",
    description: "由艾美耳属球虫寄生于肠道引起的寄生虫病，以血便与生长受阻为特征。",
    cause: "艾美耳属球虫感染，经卵囊传播。",
    symptoms: "血便、精神沉郁、羽毛蓬乱、生长迟缓、死亡率升高。",
    diagnosis: "粪便卵囊检查、剖检。",
    treatment: "抗球虫药物（地克珠利、妥曲珠利等），配合管理。",
    examinations: "粪便卵囊检查。",
    recommendedDrugCategories: "抗寄生虫药",
    notes: "注意轮换用药与垫料干燥。",
  },
  {
    name: "鸡白痢",
    speciesCode: "poultry",
    category: "传染病",
    description: "由鸡白痢沙门氏菌引起的雏鸡传染病，垂直传播为主。",
    cause: "鸡白痢沙门氏菌感染。",
    symptoms: "白痢、糊肛、怕冷扎堆、死亡率高。",
    diagnosis: "细菌培养、血清学（全血平板凝集）。",
    treatment: "抗生素治疗，净化种鸡群。",
    examinations: "细菌培养、血清学。",
    recommendedDrugCategories: "抗生素",
    notes: "种鸡群净化是防控关键。",
  },
  {
    name: "鸡大肠杆菌病",
    speciesCode: "poultry",
    category: "传染病",
    description: "由致病性大肠杆菌引起的禽类细菌病，常继发于其他疾病。",
    cause: "致病性大肠杆菌感染。",
    symptoms: "气囊炎、心包炎、肝周炎、败血症。",
    diagnosis: "细菌培养、剖检特征。",
    treatment: "抗生素治疗（需药敏）、改善饲养管理。",
    examinations: "细菌培养与药敏。",
    recommendedDrugCategories: "抗生素",
    notes: "常为继发感染，注意控制原发病。",
  },
];

// ---------- 药物 ----------
type DrugSeed = {
  genericName: string;
  brandName: string | null;
  categoryName: string;
  targetSpeciesCodes: string[];
  indications: string;
  contraindications: string;
  adverseEffects: string;
  pregnancyWarning: string | null;
  requiresPrescription: boolean;
  description: string;
};

const drugs: DrugSeed[] = [
  // ===== 抗生素 =====
  {
    genericName: "阿莫西林",
    brandName: "阿莫仙",
    categoryName: "抗生素",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep"],
    indications: "敏感菌引起的呼吸道、消化道、泌尿生殖道与皮肤软组织感染。",
    contraindications: "对青霉素类过敏者禁用。",
    adverseEffects: "胃肠道反应、过敏反应。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "广谱青霉素类抗生素（演示数据）。",
  },
  {
    genericName: "阿莫西林克拉维酸钾",
    brandName: "速诺",
    categoryName: "抗生素",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫敏感菌引起的皮肤、呼吸道、泌尿道与牙周感染。",
    contraindications: "对青霉素类过敏者禁用。",
    adverseEffects: "胃肠道反应、过敏反应。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "β-内酰胺酶抑制剂复方抗生素（演示数据）。",
  },
  {
    genericName: "头孢噻呋",
    brandName: "治菌素",
    categoryName: "抗生素",
    targetSpeciesCodes: ["pig", "cattle", "sheep"],
    indications: "猪牛羊呼吸道、泌尿道与皮肤软组织细菌感染。",
    contraindications: "对头孢菌素过敏者禁用。",
    adverseEffects: "注射部位反应、过敏反应。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "第三代头孢菌素类抗生素（演示数据）。",
  },
  {
    genericName: "恩诺沙星",
    brandName: "拜有利",
    categoryName: "抗生素",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep", "poultry"],
    indications: "敏感菌引起的呼吸道、消化道、泌尿生殖道与皮肤感染。",
    contraindications: "对氟喹诺酮类过敏者禁用；幼龄动物慎用。",
    adverseEffects: "胃肠道反应、幼龄动物软骨损伤。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "氟喹诺酮类广谱抗菌药（演示数据）。",
  },
  {
    genericName: "多西环素",
    brandName: "强力霉素",
    categoryName: "抗生素",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫呼吸道感染、衣原体/支原体/立克次体感染、钩端螺旋体病。",
    contraindications: "幼龄动物慎用（牙齿着色）；孕期禁用。",
    adverseEffects: "胃肠道反应、光敏反应。",
    pregnancyWarning: "孕期禁用（影响胎儿骨骼与牙齿发育）",
    requiresPrescription: true,
    description: "四环素类广谱抗生素（演示数据）。",
  },
  {
    genericName: "泰乐菌素",
    brandName: "泰乐",
    categoryName: "抗生素",
    targetSpeciesCodes: ["pig", "cattle", "poultry"],
    indications: "猪牛羊禽支原体肺炎、呼吸道与肠道感染。",
    contraindications: "对大环内酯类过敏者禁用。",
    adverseEffects: "注射部位反应、胃肠道反应。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "大环内酯类抗生素，抗支原体作用强（演示数据）。",
  },
  {
    genericName: "阿米卡星",
    brandName: "丁胺卡那霉素",
    categoryName: "抗生素",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫革兰阴性菌引起的严重感染。",
    contraindications: "肾功能不全、脱水动物慎用；低体重动物慎用。",
    adverseEffects: "耳毒性、肾毒性。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: true,
    description: "氨基糖苷类抗生素（演示数据）。",
  },
  {
    genericName: "土霉素",
    brandName: "土霉素",
    categoryName: "抗生素",
    targetSpeciesCodes: ["pig", "cattle", "sheep", "poultry"],
    indications: "猪牛羊禽呼吸道、肠道与局部细菌感染。",
    contraindications: "幼龄动物与孕期慎用。",
    adverseEffects: "胃肠道紊乱、牙齿着色。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: true,
    description: "四环素类广谱抗生素（演示数据）。",
  },
  {
    genericName: "复方磺胺甲噁唑",
    brandName: "复方新诺明",
    categoryName: "抗生素",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep"],
    indications: "敏感菌引起的呼吸道、泌尿道与肠道感染。",
    contraindications: "对磺胺类过敏者禁用；脱水动物慎用。",
    adverseEffects: "结晶尿、过敏反应、血液学异常。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "磺胺类与增效剂复方制剂（演示数据）。",
  },
  {
    genericName: "林可霉素",
    brandName: "洁霉素",
    categoryName: "抗生素",
    targetSpeciesCodes: ["pig", "cattle", "sheep", "poultry"],
    indications: "猪牛羊禽革兰阳性菌、厌氧菌与支原体感染。",
    contraindications: "对林可霉素过敏者禁用。",
    adverseEffects: "胃肠道反应、假膜性肠炎。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "林可酰胺类抗生素（演示数据）。",
  },
  {
    genericName: "庆大霉素",
    brandName: "庆大霉素",
    categoryName: "抗生素",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep"],
    indications: "革兰阴性菌引起的感染。",
    contraindications: "肾功能不全、幼龄动物慎用。",
    adverseEffects: "耳毒性、肾毒性。",
    pregnancyWarning: "孕期禁用",
    requiresPrescription: true,
    description: "氨基糖苷类抗生素（演示数据）。",
  },
  {
    genericName: "甲硝唑",
    brandName: "灭滴灵",
    categoryName: "抗生素",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫厌氧菌感染、贾第鞭毛虫等原虫感染、炎症性肠病辅助治疗。",
    contraindications: "肝功能不全慎用。",
    adverseEffects: "胃肠道反应、神经症状（高剂量）。",
    pregnancyWarning: "孕早期慎用",
    requiresPrescription: true,
    description: "硝基咪唑类抗菌/抗原虫药（演示数据）。",
  },
  // ===== 抗寄生虫药 =====
  {
    genericName: "伊维菌素",
    brandName: "害获灭",
    categoryName: "抗寄生虫药",
    targetSpeciesCodes: ["cattle", "sheep", "pig"],
    indications: "牛、羊、猪体内外寄生虫（线虫、螨、虱等）。",
    contraindications: "柯利牧羊犬及 MDR1 缺陷犬种禁用；小型犬慎用。",
    adverseEffects: "神经毒性（过量时）。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "大环内酯类广谱抗寄生虫药（演示数据）。",
  },
  {
    genericName: "吡喹酮",
    brandName: "吡喹酮",
    categoryName: "抗寄生虫药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫绦虫与吸虫感染。",
    contraindications: "4周龄以下幼犬猫慎用。",
    adverseEffects: "胃肠道反应、嗜睡。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "广谱抗绦虫/吸虫药（演示数据）。",
  },
  {
    genericName: "芬苯达唑",
    brandName: "丙硫苯咪唑",
    categoryName: "抗寄生虫药",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep"],
    indications: "犬猫猪牛羊线虫、绦虫与部分吸虫感染。",
    contraindications: "孕早期慎用。",
    adverseEffects: "胃肠道反应。",
    pregnancyWarning: "孕早期慎用",
    requiresPrescription: true,
    description: "苯并咪唑类广谱驱虫药（演示数据）。",
  },
  {
    genericName: "米尔贝肟",
    brandName: "犬心保",
    categoryName: "抗寄生虫药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫心丝虫预防、肠道线虫驱除。",
    contraindications: "心丝虫阳性犬需先评估。",
    adverseEffects: "少见，偶有胃肠道反应。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "大环内酯类驱虫药（演示数据）。",
  },
  {
    genericName: "塞拉菌素",
    brandName: "大宠爱",
    categoryName: "抗寄生虫药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫跳蚤、螨虫、心丝虫与肠道线虫。",
    contraindications: "6周龄以下幼龄动物慎用。",
    adverseEffects: "局部脱毛、瘙痒。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "外用大环内酯类抗寄生虫药（演示数据）。",
  },
  {
    genericName: "莫昔克丁",
    brandName: "莫克丁",
    categoryName: "抗寄生虫药",
    targetSpeciesCodes: ["cattle", "sheep", "dog", "cat"],
    indications: "牛羊犬猫体内外寄生虫。",
    contraindications: "柯利犬及 MDR1 缺陷犬种慎用。",
    adverseEffects: "神经毒性（过量时）。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "大环内酯类抗寄生虫药（演示数据）。",
  },
  {
    genericName: "地克珠利",
    brandName: "球虫净",
    categoryName: "抗寄生虫药",
    targetSpeciesCodes: ["poultry", "pig", "cattle", "sheep"],
    indications: "禽畜球虫病防治。",
    contraindications: "无特殊。",
    adverseEffects: "少见。",
    pregnancyWarning: null,
    requiresPrescription: false,
    description: "三嗪类抗球虫药（演示数据）。",
  },
  {
    genericName: "妥曲珠利",
    brandName: "百球清",
    categoryName: "抗寄生虫药",
    targetSpeciesCodes: ["poultry", "pig", "cattle", "sheep"],
    indications: "禽畜球虫病治疗。",
    contraindications: "无特殊。",
    adverseEffects: "少见。",
    pregnancyWarning: null,
    requiresPrescription: false,
    description: "三嗪类抗球虫药（演示数据）。",
  },
  {
    genericName: "左旋咪唑",
    brandName: "驱虫净",
    categoryName: "抗寄生虫药",
    targetSpeciesCodes: ["cattle", "sheep", "pig", "poultry"],
    indications: "畜禽线虫驱除，兼有免疫调节作用。",
    contraindications: "孕晚期慎用。",
    adverseEffects: "流涎、呕吐（过量时）。",
    pregnancyWarning: "孕晚期慎用",
    requiresPrescription: true,
    description: "咪唑并噻唑类驱虫药（演示数据）。",
  },
  // ===== 解热镇痛抗炎药 =====
  {
    genericName: "卡洛芬",
    brandName: "卡洛芬",
    categoryName: "解热镇痛抗炎药",
    targetSpeciesCodes: ["dog"],
    indications: "犬骨关节炎、术后疼痛与炎症。",
    contraindications: "胃肠道溃疡、肝肾功能不全、低体重犬慎用。",
    adverseEffects: "胃肠道溃疡、肝毒性。",
    pregnancyWarning: "孕期禁用",
    requiresPrescription: true,
    description: "犬用非甾体抗炎药（演示数据）。",
  },
  {
    genericName: "美洛昔康",
    brandName: "美达佳",
    categoryName: "解热镇痛抗炎药",
    targetSpeciesCodes: ["dog", "cat", "cattle", "pig"],
    indications: "犬猫牛羊猪的疼痛、炎症与发热。",
    contraindications: "胃肠道溃疡、脱水、肾功能不全慎用。",
    adverseEffects: "胃肠道反应、肾毒性。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: true,
    description: "非甾体抗炎药（演示数据）。",
  },
  {
    genericName: "酮洛芬",
    brandName: "酮洛芬",
    categoryName: "解热镇痛抗炎药",
    targetSpeciesCodes: ["cattle", "pig", "dog", "cat"],
    indications: "畜禽的疼痛、炎症与发热。",
    contraindications: "胃肠道溃疡慎用。",
    adverseEffects: "胃肠道反应。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: true,
    description: "非甾体抗炎药（演示数据）。",
  },
  {
    genericName: "氟尼辛葡甲胺",
    brandName: "氟尼辛",
    categoryName: "解热镇痛抗炎药",
    targetSpeciesCodes: ["cattle", "pig"],
    indications: "牛、猪的炎症、发热与疼痛（如乳房炎、蹄叶炎）。",
    contraindications: "脱水、肾功能不全慎用。",
    adverseEffects: "胃肠道溃疡、肾毒性。",
    pregnancyWarning: "孕期禁用",
    requiresPrescription: true,
    description: "非甾体抗炎药（演示数据）。",
  },
  {
    genericName: "阿司匹林",
    brandName: "阿司匹林",
    categoryName: "解热镇痛抗炎药",
    targetSpeciesCodes: ["dog"],
    indications: "犬的解热镇痛、抗炎。",
    contraindications: "猫禁用（水杨酸代谢缓慢）；胃肠道溃疡慎用。",
    adverseEffects: "胃肠道刺激、出血倾向。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: true,
    description: "水杨酸类解热镇痛药（演示数据）。",
  },
  {
    genericName: "托芬那酸",
    brandName: "托芬那酸",
    categoryName: "解热镇痛抗炎药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫的解热镇痛抗炎。",
    contraindications: "胃肠道溃疡慎用。",
    adverseEffects: "胃肠道反应。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "非甾体抗炎药（演示数据）。",
  },
  // ===== 糖皮质激素 =====
  {
    genericName: "泼尼松龙",
    brandName: "泼尼松龙",
    categoryName: "糖皮质激素",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "免疫介导性疾病、过敏、炎症性疾病的抗炎治疗。",
    contraindications: "全身真菌感染、未控制感染慎用。",
    adverseEffects: "多饮多尿、食欲亢进、免疫抑制。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: true,
    description: "中效糖皮质激素（演示数据）。",
  },
  {
    genericName: "地塞米松",
    brandName: "地塞米松",
    categoryName: "糖皮质激素",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep"],
    indications: "严重炎症、过敏、休克等。",
    contraindications: "全身真菌感染、孕期慎用。",
    adverseEffects: "免疫抑制、多饮多尿。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: true,
    description: "长效糖皮质激素（演示数据）。",
  },
  // ===== 抗真菌药 =====
  {
    genericName: "伊曲康唑",
    brandName: "斯皮仁诺",
    categoryName: "抗真菌药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫皮肤真菌病与全身性真菌感染。",
    contraindications: "肝功能不全慎用。",
    adverseEffects: "肝毒性、胃肠道反应。",
    pregnancyWarning: "孕期禁用",
    requiresPrescription: true,
    description: "三唑类广谱抗真菌药（演示数据）。",
  },
  {
    genericName: "酮康唑",
    brandName: "里素劳",
    categoryName: "抗真菌药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫皮肤真菌感染。",
    contraindications: "肝功能不全慎用。",
    adverseEffects: "肝毒性、胃肠道反应。",
    pregnancyWarning: "孕期禁用",
    requiresPrescription: true,
    description: "咪唑类抗真菌药（演示数据）。",
  },
  {
    genericName: "特比萘芬",
    brandName: "兰美抒",
    categoryName: "抗真菌药",
    targetSpeciesCodes: ["dog", "cat", "cattle", "sheep"],
    indications: "犬猫牛羊皮肤真菌感染。",
    contraindications: "无特殊。",
    adverseEffects: "胃肠道反应。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "丙烯胺类抗真菌药（演示数据）。",
  },
  // ===== 止泻/肠道调节剂 =====
  {
    genericName: "蒙脱石散",
    brandName: "思密达",
    categoryName: "止泻/肠道调节剂",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep"],
    indications: "急慢性腹泻，保护肠道黏膜、吸附毒素。",
    contraindications: "便秘动物慎用。",
    adverseEffects: "便秘（过量时）。",
    pregnancyWarning: null,
    requiresPrescription: false,
    description: "肠道黏膜保护剂（演示数据）。",
  },
  {
    genericName: "复合益生菌",
    brandName: "益生菌",
    categoryName: "止泻/肠道调节剂",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep", "poultry"],
    indications: "肠道菌群失调、腹泻恢复期调理。",
    contraindications: "无特殊。",
    adverseEffects: "少见。",
    pregnancyWarning: null,
    requiresPrescription: false,
    description: "活菌类肠道调节剂（演示数据）。",
  },
  // ===== 耳科用药 =====
  {
    genericName: "复方咪康唑耳用滴剂",
    brandName: "耳肤灵",
    categoryName: "耳科用药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫外耳炎（细菌/真菌/螨混合感染）。",
    contraindications: "鼓膜穿孔者禁用。",
    adverseEffects: "局部刺激。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "复方耳用滴剂（演示数据）。",
  },
  // ===== 眼科用药 =====
  {
    genericName: "妥布霉素滴眼液",
    brandName: "托百士",
    categoryName: "眼科用药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫细菌性结膜炎、角膜炎。",
    contraindications: "对氨基糖苷类过敏者禁用。",
    adverseEffects: "局部刺激。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "氨基糖苷类眼用抗生素（演示数据）。",
  },
  {
    genericName: "氯霉素滴眼液",
    brandName: "氯霉素",
    categoryName: "眼科用药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫细菌性眼部感染。",
    contraindications: "造血功能异常者慎用。",
    adverseEffects: "局部刺激。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "广谱眼用抗生素（演示数据）。",
  },
  // ===== 皮肤科用药 =====
  {
    genericName: "葡萄糖酸氯己定",
    brandName: "洗必泰",
    categoryName: "皮肤科用药",
    targetSpeciesCodes: ["dog", "cat", "cattle", "sheep", "poultry"],
    indications: "皮肤与黏膜消毒、局部感染辅助治疗。",
    contraindications: "黏膜敏感部位慎用。",
    adverseEffects: "局部刺激。",
    pregnancyWarning: null,
    requiresPrescription: false,
    description: "局部消毒剂（演示数据）。",
  },
  // ===== 泌尿系统用药 =====
  {
    genericName: "呋塞米",
    brandName: "速尿",
    categoryName: "泌尿系统用药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "心源性、肾源性水肿与肺水肿。",
    contraindications: "脱水、电解质紊乱、无尿慎用。",
    adverseEffects: "低钾血症、脱水。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: true,
    description: "袢利尿剂（演示数据）。",
  },
  // ===== 呼吸系统用药 =====
  {
    genericName: "盐酸氨溴索",
    brandName: "沐舒坦",
    categoryName: "呼吸系统用药",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep"],
    indications: "呼吸道疾病痰液黏稠时的祛痰。",
    contraindications: "无特殊。",
    adverseEffects: "少见。",
    pregnancyWarning: null,
    requiresPrescription: false,
    description: "祛痰药（演示数据）。",
  },
  {
    genericName: "盐酸溴己新",
    brandName: "溴己新",
    categoryName: "呼吸系统用药",
    targetSpeciesCodes: ["pig", "cattle", "poultry"],
    indications: "畜禽呼吸道疾病的祛痰。",
    contraindications: "无特殊。",
    adverseEffects: "少见。",
    pregnancyWarning: null,
    requiresPrescription: false,
    description: "祛痰药（演示数据）。",
  },
  // ===== 消化系统用药 =====
  {
    genericName: "西咪替丁",
    brandName: "西咪替丁",
    categoryName: "消化系统用药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫胃炎、胃溃疡的抑酸治疗。",
    contraindications: "肝肾功能不全慎用。",
    adverseEffects: "少见。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "H2受体拮抗剂（演示数据）。",
  },
  {
    genericName: "奥美拉唑",
    brandName: "洛赛克",
    categoryName: "消化系统用药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫胃酸过多、胃食管反流、胃溃疡。",
    contraindications: "肝功能不全慎用。",
    adverseEffects: "少见。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "质子泵抑制剂（演示数据）。",
  },
  {
    genericName: "甲氧氯普胺",
    brandName: "胃复安",
    categoryName: "消化系统用药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫呕吐、胃排空迟缓。",
    contraindications: "胃肠道梗阻、癫痫慎用。",
    adverseEffects: "锥体外系症状（高剂量）。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "止吐与促胃动力药（演示数据）。",
  },
  {
    genericName: "多潘立酮",
    brandName: "吗丁啉",
    categoryName: "消化系统用药",
    targetSpeciesCodes: ["dog", "cat"],
    indications: "犬猫胃动力不足、呕吐。",
    contraindications: "胃肠道出血、梗阻慎用。",
    adverseEffects: "少见。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "外周多巴胺受体拮抗剂（演示数据）。",
  },
  // ===== 维生素与营养补充剂 =====
  {
    genericName: "复合维生素B",
    brandName: "维B",
    categoryName: "维生素与营养补充剂",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep", "poultry"],
    indications: "B族维生素缺乏、支持疗法、食欲不振。",
    contraindications: "无特殊。",
    adverseEffects: "少见。",
    pregnancyWarning: null,
    requiresPrescription: false,
    description: "B族维生素补充剂（演示数据）。",
  },
  {
    genericName: "维生素C",
    brandName: "维C",
    categoryName: "维生素与营养补充剂",
    targetSpeciesCodes: ["dog", "cat", "pig", "cattle", "sheep", "poultry"],
    indications: "维生素C缺乏、应激、辅助支持。",
    contraindications: "无特殊。",
    adverseEffects: "少见。",
    pregnancyWarning: null,
    requiresPrescription: false,
    description: "维生素补充剂（演示数据）。",
  },
  {
    genericName: "葡萄糖酸钙",
    brandName: "葡萄糖酸钙",
    categoryName: "维生素与营养补充剂",
    targetSpeciesCodes: ["cattle", "sheep", "dog", "cat"],
    indications: "低钙血症（如产后瘫痪）、钙补充。",
    contraindications: "高钙血症、洋地黄中毒慎用。",
    adverseEffects: "静脉注射过快致心律失常。",
    pregnancyWarning: null,
    requiresPrescription: true,
    description: "钙补充剂（演示数据）。",
  },
  // ===== 疫苗 =====
  {
    genericName: "犬瘟热-细小病毒二联苗",
    brandName: "卫佳伍",
    categoryName: "疫苗",
    targetSpeciesCodes: ["dog"],
    indications: "犬瘟热与犬细小病毒病的预防。",
    contraindications: "发热、免疫抑制犬慎用。",
    adverseEffects: "局部反应、过敏（少见）。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: false,
    description: "犬用病毒疫苗（演示数据）。",
  },
  {
    genericName: "猫三联疫苗",
    brandName: "妙三多",
    categoryName: "疫苗",
    targetSpeciesCodes: ["cat"],
    indications: "猫瘟、猫疱疹病毒与猫杯状病毒预防。",
    contraindications: "发热、免疫抑制猫慎用。",
    adverseEffects: "局部反应、过敏（少见）。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: false,
    description: "猫用病毒疫苗（演示数据）。",
  },
  {
    genericName: "猪繁殖与呼吸综合征疫苗",
    brandName: "蓝耳苗",
    categoryName: "疫苗",
    targetSpeciesCodes: ["pig"],
    indications: "猪蓝耳病的预防。",
    contraindications: "发热、免疫抑制猪慎用。",
    adverseEffects: "局部反应。",
    pregnancyWarning: "孕期慎用",
    requiresPrescription: false,
    description: "猪用病毒疫苗（演示数据）。",
  },
  {
    genericName: "鸡新城疫疫苗",
    brandName: "新城疫苗",
    categoryName: "疫苗",
    targetSpeciesCodes: ["poultry"],
    indications: "鸡新城疫的预防。",
    contraindications: "发病禽群慎用。",
    adverseEffects: "应激反应。",
    pregnancyWarning: null,
    requiresPrescription: false,
    description: "禽用病毒疫苗（演示数据）。",
  },
];

// ---------- 疾病-药物关联 ----------
type LinkSeed = {
  diseaseName: string;
  drugName: string;
  recommendLevel: string;
  reason: string;
};

const diseaseDrugs: LinkSeed[] = [
  { diseaseName: "犬细小病毒性肠炎", drugName: "蒙脱石散", recommendLevel: "一线", reason: "保护肠道黏膜、吸附毒素，缓解腹泻" },
  { diseaseName: "犬细小病毒性肠炎", drugName: "复合益生菌", recommendLevel: "辅助", reason: "恢复期调节肠道菌群" },
  { diseaseName: "犬细小病毒性肠炎", drugName: "甲硝唑", recommendLevel: "二线", reason: "控制继发厌氧菌感染" },
  { diseaseName: "犬细小病毒性肠炎", drugName: "阿莫西林克拉维酸钾", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "犬瘟热", drugName: "犬瘟热-细小病毒二联苗", recommendLevel: "辅助", reason: "用于未感染犬的免疫预防" },
  { diseaseName: "犬瘟热", drugName: "恩诺沙星", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "犬瘟热", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法、营养补充" },
  { diseaseName: "犬皮肤真菌病", drugName: "伊曲康唑", recommendLevel: "一线", reason: "全身抗真菌治疗" },
  { diseaseName: "犬皮肤真菌病", drugName: "特比萘芬", recommendLevel: "二线", reason: "替代性全身抗真菌治疗" },
  { diseaseName: "犬皮肤真菌病", drugName: "葡萄糖酸氯己定", recommendLevel: "辅助", reason: "局部药浴消毒" },
  { diseaseName: "犬肠胃炎", drugName: "蒙脱石散", recommendLevel: "一线", reason: "保护肠道黏膜、止泻" },
  { diseaseName: "犬肠胃炎", drugName: "复合益生菌", recommendLevel: "辅助", reason: "调节肠道菌群" },
  { diseaseName: "犬肠胃炎", drugName: "甲硝唑", recommendLevel: "二线", reason: "控制厌氧菌与原虫感染" },
  { diseaseName: "犬肠胃炎", drugName: "西咪替丁", recommendLevel: "辅助", reason: "抑制胃酸、保护胃黏膜" },
  { diseaseName: "犬外耳炎", drugName: "复方咪康唑耳用滴剂", recommendLevel: "一线", reason: "局部抗细菌/真菌/螨" },
  { diseaseName: "犬外耳炎", drugName: "恩诺沙星", recommendLevel: "二线", reason: "控制严重继发细菌感染" },
  { diseaseName: "犬传染性肝炎", drugName: "复合维生素B", recommendLevel: "辅助", reason: "护肝支持" },
  { diseaseName: "犬传染性肝炎", drugName: "恩诺沙星", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "犬钩端螺旋体病", drugName: "多西环素", recommendLevel: "一线", reason: "清除钩端螺旋体病原" },
  { diseaseName: "犬钩端螺旋体病", drugName: "阿莫西林", recommendLevel: "二线", reason: "替代性抗菌治疗" },
  { diseaseName: "猫瘟（猫泛白细胞减少症）", drugName: "猫三联疫苗", recommendLevel: "辅助", reason: "用于未感染猫的免疫预防" },
  { diseaseName: "猫瘟（猫泛白细胞减少症）", drugName: "恩诺沙星", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "猫瘟（猫泛白细胞减少症）", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法" },
  { diseaseName: "猫鼻支气管炎（猫鼻支）", drugName: "多西环素", recommendLevel: "一线", reason: "抗衣原体/支原体继发感染" },
  { diseaseName: "猫鼻支气管炎（猫鼻支）", drugName: "妥布霉素滴眼液", recommendLevel: "辅助", reason: "控制眼部分泌物与细菌感染" },
  { diseaseName: "猫鼻支气管炎（猫鼻支）", drugName: "猫三联疫苗", recommendLevel: "辅助", reason: "用于未感染猫的免疫预防" },
  { diseaseName: "猫口炎", drugName: "泼尼松龙", recommendLevel: "一线", reason: "免疫抑制抗炎" },
  { diseaseName: "猫口炎", drugName: "阿莫西林克拉维酸钾", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "猫口炎", drugName: "葡萄糖酸氯己定", recommendLevel: "辅助", reason: "口腔局部清洁消毒" },
  { diseaseName: "猫皮肤真菌病", drugName: "伊曲康唑", recommendLevel: "一线", reason: "全身抗真菌治疗" },
  { diseaseName: "猫皮肤真菌病", drugName: "特比萘芬", recommendLevel: "二线", reason: "替代性全身抗真菌治疗" },
  { diseaseName: "猫结膜炎", drugName: "妥布霉素滴眼液", recommendLevel: "一线", reason: "局部抗细菌感染" },
  { diseaseName: "猫结膜炎", drugName: "氯霉素滴眼液", recommendLevel: "二线", reason: "替代性局部抗感染" },
  { diseaseName: "猫泌尿系统综合征（FLUTD）", drugName: "阿莫西林克拉维酸钾", recommendLevel: "一线", reason: "控制尿路细菌感染" },
  { diseaseName: "猫泌尿系统综合征（FLUTD）", drugName: "美洛昔康", recommendLevel: "辅助", reason: "镇痛抗炎" },
  { diseaseName: "猫泌尿系统综合征（FLUTD）", drugName: "呋塞米", recommendLevel: "辅助", reason: "利尿、促进排石" },
  { diseaseName: "猫传染性腹膜炎（FIP）", drugName: "泼尼松龙", recommendLevel: "辅助", reason: "免疫抑制抗炎" },
  { diseaseName: "猫传染性腹膜炎（FIP）", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法" },
  { diseaseName: "猪繁殖与呼吸综合征（蓝耳病）", drugName: "泰乐菌素", recommendLevel: "二线", reason: "控制继发细菌/支原体感染" },
  { diseaseName: "猪繁殖与呼吸综合征（蓝耳病）", drugName: "猪繁殖与呼吸综合征疫苗", recommendLevel: "辅助", reason: "用于免疫预防" },
  { diseaseName: "猪繁殖与呼吸综合征（蓝耳病）", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法" },
  { diseaseName: "仔猪腹泻", drugName: "蒙脱石散", recommendLevel: "一线", reason: "止泻、保护肠黏膜" },
  { diseaseName: "仔猪腹泻", drugName: "复合益生菌", recommendLevel: "辅助", reason: "调节肠道菌群" },
  { diseaseName: "仔猪腹泻", drugName: "阿莫西林", recommendLevel: "二线", reason: "控制继发大肠杆菌感染" },
  { diseaseName: "仔猪腹泻", drugName: "恩诺沙星", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "猪圆环病毒病", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法" },
  { diseaseName: "猪圆环病毒病", drugName: "阿莫西林", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "猪丹毒", drugName: "阿莫西林", recommendLevel: "一线", reason: "青霉素类对猪丹毒杆菌敏感" },
  { diseaseName: "猪丹毒", drugName: "林可霉素", recommendLevel: "二线", reason: "替代性抗菌治疗" },
  { diseaseName: "猪喘气病（支原体肺炎）", drugName: "泰乐菌素", recommendLevel: "一线", reason: "大环内酯类抗支原体" },
  { diseaseName: "猪喘气病（支原体肺炎）", drugName: "土霉素", recommendLevel: "二线", reason: "四环素类抗支原体" },
  { diseaseName: "猪喘气病（支原体肺炎）", drugName: "恩诺沙星", recommendLevel: "二线", reason: "氟喹诺酮类抗支原体" },
  { diseaseName: "奶牛乳房炎", drugName: "头孢噻呋", recommendLevel: "一线", reason: "广谱抗乳房炎病原菌" },
  { diseaseName: "奶牛乳房炎", drugName: "阿莫西林", recommendLevel: "二线", reason: "青霉素类抗菌" },
  { diseaseName: "奶牛乳房炎", drugName: "林可霉素", recommendLevel: "二线", reason: "抗革兰阳性菌" },
  { diseaseName: "牛病毒性腹泻", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法" },
  { diseaseName: "牛病毒性腹泻", drugName: "恩诺沙星", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "犊牛腹泻", drugName: "蒙脱石散", recommendLevel: "一线", reason: "止泻、保护肠黏膜" },
  { diseaseName: "犊牛腹泻", drugName: "复合益生菌", recommendLevel: "辅助", reason: "调节肠道菌群" },
  { diseaseName: "犊牛腹泻", drugName: "阿莫西林", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "牛蹄叶炎", drugName: "氟尼辛葡甲胺", recommendLevel: "一线", reason: "镇痛抗炎" },
  { diseaseName: "牛蹄叶炎", drugName: "酮洛芬", recommendLevel: "二线", reason: "替代性镇痛抗炎" },
  { diseaseName: "羊口疮（羊传染性脓疱）", drugName: "葡萄糖酸氯己定", recommendLevel: "辅助", reason: "局部消毒护理" },
  { diseaseName: "羊口疮（羊传染性脓疱）", drugName: "阿莫西林", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "羊口疮（羊传染性脓疱）", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法" },
  { diseaseName: "羊腐蹄病", drugName: "土霉素", recommendLevel: "一线", reason: "抗腐蹄病原菌" },
  { diseaseName: "羊腐蹄病", drugName: "林可霉素", recommendLevel: "二线", reason: "抗厌氧菌" },
  { diseaseName: "羊腐蹄病", drugName: "氟尼辛葡甲胺", recommendLevel: "辅助", reason: "镇痛抗炎" },
  { diseaseName: "羊快疫", drugName: "阿莫西林", recommendLevel: "二线", reason: "紧急抗菌处理" },
  { diseaseName: "羊快疫", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法" },
  { diseaseName: "羊肝片吸虫病", drugName: "芬苯达唑", recommendLevel: "一线", reason: "驱肝片吸虫" },
  { diseaseName: "羊肝片吸虫病", drugName: "伊维菌素", recommendLevel: "二线", reason: "广谱驱虫" },
  { diseaseName: "羊肝片吸虫病", drugName: "左旋咪唑", recommendLevel: "二线", reason: "驱线虫" },
  { diseaseName: "鸡新城疫", drugName: "鸡新城疫疫苗", recommendLevel: "一线", reason: "免疫预防" },
  { diseaseName: "鸡新城疫", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法" },
  { diseaseName: "鸡新城疫", drugName: "恩诺沙星", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "禽流感", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法" },
  { diseaseName: "禽流感", drugName: "恩诺沙星", recommendLevel: "二线", reason: "控制继发细菌感染" },
  { diseaseName: "鸡球虫病", drugName: "地克珠利", recommendLevel: "一线", reason: "抗球虫" },
  { diseaseName: "鸡球虫病", drugName: "妥曲珠利", recommendLevel: "一线", reason: "抗球虫" },
  { diseaseName: "鸡球虫病", drugName: "复合维生素B", recommendLevel: "辅助", reason: "支持疗法" },
  { diseaseName: "鸡白痢", drugName: "恩诺沙星", recommendLevel: "一线", reason: "抗沙门氏菌" },
  { diseaseName: "鸡白痢", drugName: "阿莫西林", recommendLevel: "二线", reason: "替代性抗菌" },
  { diseaseName: "鸡白痢", drugName: "土霉素", recommendLevel: "二线", reason: "替代性抗菌" },
  { diseaseName: "鸡大肠杆菌病", drugName: "恩诺沙星", recommendLevel: "一线", reason: "抗大肠杆菌" },
  { diseaseName: "鸡大肠杆菌病", drugName: "林可霉素", recommendLevel: "二线", reason: "替代性抗菌" },
  { diseaseName: "鸡大肠杆菌病", drugName: "土霉素", recommendLevel: "二线", reason: "替代性抗菌" },
];

// ---------- 禁忌症规则 ----------
type ContraSeed = {
  drugName: string;
  type: string;
  description: string;
  species?: string;
  minAgeWeeks?: number;
  maxAgeWeeks?: number;
  minWeightKg?: number;
  maxWeightKg?: number;
  pregnancy?: boolean;
  severity: string;
};

const contraindications: ContraSeed[] = [
  { drugName: "恩诺沙星", type: "age", description: "12周龄以下幼龄动物慎用（影响软骨发育）", minAgeWeeks: 12, severity: "慎用" },
  { drugName: "恩诺沙星", type: "species", description: "猫高剂量使用可致视网膜毒性，需严格控制剂量", species: "cat", severity: "慎用" },
  { drugName: "多西环素", type: "age", description: "8周龄以下幼龄动物慎用（牙齿着色）", minAgeWeeks: 8, severity: "慎用" },
  { drugName: "多西环素", type: "pregnancy", description: "孕期禁用（影响胎儿骨骼与牙齿发育）", pregnancy: true, severity: "禁用" },
  { drugName: "土霉素", type: "age", description: "幼龄动物慎用（牙齿着色）", minAgeWeeks: 8, severity: "慎用" },
  { drugName: "土霉素", type: "pregnancy", description: "孕期慎用", pregnancy: true, severity: "慎用" },
  { drugName: "阿司匹林", type: "species", description: "猫禁用（水杨酸代谢缓慢，易中毒）", species: "cat", severity: "禁用" },
  { drugName: "卡洛芬", type: "pregnancy", description: "孕期禁用", pregnancy: true, severity: "禁用" },
  { drugName: "卡洛芬", type: "weight", description: "体重小于2kg的犬慎用", minWeightKg: 2, severity: "慎用" },
  { drugName: "地塞米松", type: "pregnancy", description: "孕期慎用", pregnancy: true, severity: "慎用" },
  { drugName: "庆大霉素", type: "pregnancy", description: "孕期禁用（耳/肾毒性）", pregnancy: true, severity: "禁用" },
  { drugName: "庆大霉素", type: "age", description: "幼龄动物慎用", minAgeWeeks: 8, severity: "慎用" },
  { drugName: "阿米卡星", type: "weight", description: "体重小于1.5kg的动物慎用", minWeightKg: 1.5, severity: "慎用" },
  { drugName: "阿米卡星", type: "age", description: "幼龄动物慎用", minAgeWeeks: 8, severity: "慎用" },
  { drugName: "氟尼辛葡甲胺", type: "pregnancy", description: "孕期禁用", pregnancy: true, severity: "禁用" },
  { drugName: "美洛昔康", type: "pregnancy", description: "孕期慎用", pregnancy: true, severity: "慎用" },
  { drugName: "伊维菌素", type: "other", description: "柯利牧羊犬及 MDR1 缺陷犬种禁用", severity: "禁用" },
  { drugName: "伊维菌素", type: "weight", description: "体重小于2kg的犬慎用", minWeightKg: 2, severity: "慎用" },
  { drugName: "甲硝唑", type: "pregnancy", description: "孕早期慎用", pregnancy: true, severity: "慎用" },
  { drugName: "呋塞米", type: "pregnancy", description: "孕期慎用", pregnancy: true, severity: "慎用" },
  { drugName: "伊曲康唑", type: "pregnancy", description: "孕期禁用", pregnancy: true, severity: "禁用" },
  { drugName: "酮康唑", type: "pregnancy", description: "孕期禁用", pregnancy: true, severity: "禁用" },
  { drugName: "芬苯达唑", type: "pregnancy", description: "孕早期慎用", pregnancy: true, severity: "慎用" },
];

// ---------- 药物相互作用 ----------
type InterSeed = {
  drugA: string;
  drugB: string;
  severity: string;
  description: string;
};

const interactions: InterSeed[] = [
  { drugA: "卡洛芬", drugB: "地塞米松", severity: "high", description: "非甾体抗炎药与糖皮质激素联用显著增加胃肠道溃疡出血风险" },
  { drugA: "美洛昔康", drugB: "卡洛芬", severity: "high", description: "两种非甾体抗炎药联用增加肾与胃肠道毒性" },
  { drugA: "阿司匹林", drugB: "卡洛芬", severity: "high", description: "增加胃肠道溃疡与出血风险" },
  { drugA: "庆大霉素", drugB: "呋塞米", severity: "high", description: "增加耳毒性与肾毒性风险" },
  { drugA: "阿米卡星", drugB: "呋塞米", severity: "high", description: "增加耳毒性与肾毒性风险" },
  { drugA: "庆大霉素", drugB: "阿米卡星", severity: "high", description: "氨基糖苷类联用毒性叠加" },
  { drugA: "多西环素", drugB: "葡萄糖酸钙", severity: "medium", description: "四环素类与钙螯合，降低药物吸收" },
  { drugA: "多西环素", drugB: "蒙脱石散", severity: "medium", description: "吸附剂降低四环素类吸收" },
  { drugA: "伊维菌素", drugB: "酮康唑", severity: "high", description: "酮康唑抑制 P-糖蛋白，增加伊维菌素毒性" },
  { drugA: "恩诺沙星", drugB: "地塞米松", severity: "medium", description: "氟喹诺酮类与糖皮质激素联用增加肌腱/软骨损伤风险" },
  { drugA: "地塞米松", drugB: "呋塞米", severity: "medium", description: "增加低钾血症风险" },
  { drugA: "甲氧氯普胺", drugB: "西咪替丁", severity: "low", description: "促胃动力药加速胃排空，降低西咪替丁吸收" },
  { drugA: "甲硝唑", drugB: "西咪替丁", severity: "medium", description: "西咪替丁抑制甲硝唑代谢，可能增加神经毒性" },
];

// ---------- 参考资料 ----------
type RefSeed = {
  title: string;
  source: string;
  url?: string;
  entityType: string;
  note?: string;
};

const references: RefSeed[] = [
  { title: "《中华人民共和国兽药典》", source: "中国兽药典委员会", entityType: "general", note: "兽药质量标准权威依据（演示参考）" },
  { title: "《兽医药理学》", source: "全国农业高等院校统编教材", entityType: "general", note: "兽药作用机制与合理用药（演示参考）" },
  { title: "《犬猫临床用药手册》", source: "临床兽医参考书", entityType: "general", note: "犬猫常用药物剂量与禁忌（演示参考）" },
  { title: "《猪病学》", source: "养殖兽医参考书", entityType: "general", note: "猪病诊断与防控（演示参考）" },
  { title: "《禽病学》", source: "养殖兽医参考书", entityType: "general", note: "禽病诊断与防控（演示参考）" },
  { title: "《奶牛疾病学》", source: "养殖兽医参考书", entityType: "general", note: "奶牛常见疾病诊疗（演示参考）" },
];

// ---------- 主函数 ----------
async function main() {
  console.log("开始清空旧数据…");
  await prisma.reference.deleteMany();
  await prisma.drugInteraction.deleteMany();
  await prisma.contraindication.deleteMany();
  await prisma.diseaseDrug.deleteMany();
  await prisma.drug.deleteMany();
  await prisma.drugCategory.deleteMany();
  await prisma.disease.deleteMany();
  await prisma.animal.deleteMany();

  console.log("写入动物种类…");
  const animalMap: Record<string, string> = {};
  for (const a of animals) {
    const rec = await prisma.animal.create({ data: a });
    animalMap[a.code] = rec.id;
  }

  console.log("写入药物分类…");
  const categoryMap: Record<string, string> = {};
  for (const c of categories) {
    const rec = await prisma.drugCategory.create({ data: c });
    categoryMap[c.name] = rec.id;
  }

  console.log("写入疾病…");
  const diseaseMap: Record<string, string> = {};
  for (const d of diseases) {
    const { speciesCode, ...rest } = d;
    const rec = await prisma.disease.create({
      data: { ...rest, speciesId: animalMap[speciesCode], isDemo: true },
    });
    diseaseMap[d.name] = rec.id;
  }

  console.log("写入药物…");
  const drugMap: Record<string, string> = {};
  for (const drug of drugs) {
    const { categoryName, targetSpeciesCodes, ...rest } = drug;
    const rec = await prisma.drug.create({
      data: {
        ...rest,
        isDemo: true,
        categoryId: categoryMap[categoryName],
        targetSpecies: {
          connect: targetSpeciesCodes.map((code) => ({ code })),
        },
      },
    });
    drugMap[drug.genericName] = rec.id;
  }

  console.log("写入疾病-药物关联…");
  for (const dd of diseaseDrugs) {
    await prisma.diseaseDrug.create({
      data: {
        diseaseId: diseaseMap[dd.diseaseName],
        drugId: drugMap[dd.drugName],
        recommendLevel: dd.recommendLevel,
        reason: dd.reason,
      },
    });
  }

  console.log("写入禁忌症规则…");
  for (const c of contraindications) {
    const { drugName, ...rest } = c;
    await prisma.contraindication.create({
      data: { ...rest, drugId: drugMap[drugName] },
    });
  }

  console.log("写入药物相互作用…");
  for (const i of interactions) {
    await prisma.drugInteraction.create({
      data: {
        drugAId: drugMap[i.drugA],
        drugBId: drugMap[i.drugB],
        severity: i.severity,
        description: i.description,
      },
    });
  }

  console.log("写入参考资料…");
  for (const r of references) {
    await prisma.reference.create({ data: r });
  }

  const counts = {
    animals: await prisma.animal.count(),
    diseases: await prisma.disease.count(),
    drugs: await prisma.drug.count(),
    categories: await prisma.drugCategory.count(),
    links: await prisma.diseaseDrug.count(),
    contraindications: await prisma.contraindication.count(),
    interactions: await prisma.drugInteraction.count(),
    references: await prisma.reference.count(),
  };
  console.log("种子数据写入完成：", JSON.stringify(counts, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
