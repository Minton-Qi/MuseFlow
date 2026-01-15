import { Topic } from "./types";

// 写作题库 - 平衡自我探索与创意创作 (备用数据)
// Writing prompts - Balanced self-exploration and creative writing (fallback data)
const fallbackTopicsDatabase: Topic[] = [
  // === 自我探索 Self-Exploration ===
  {
    id: "1",
    title: "内心独白",
    prompt: "当所有人都离开后，你内心最深处的声音在对你说什么？",
    category: "reflection",
    inspiration: {
      angles: [
        "独处时刻：在完全独处时，你的真实想法是什么？",
        "内心对话：你对自己有什么未曾说出口的话？",
        "真实自我：卸下所有面具后，你是谁？"
      ],
      examples: [
        "「在深夜，内心那个声音总会出现：你真的快乐吗？还是只是在扮演大家期待的角色？它问得我哑口无言。」"
      ]
    }
  },
  {
    id: "2",
    title: "情绪的形状",
    prompt: "如果悲伤有形状，它在你心中是什么样子的？",
    category: "emotion",
    inspiration: {
      angles: [
        "具象化：用视觉意象描述一种情绪。",
        "深度探索：这种情绪在你身体里如何呈现？",
        "接纳过程：学会和这种情绪共处。"
      ],
      examples: [
        "「悲伤是一片灰色湖面，平静却深邃。我不再试图逃离它，而是坐在岸边，等待雾散去。」"
      ]
    }
  },
  {
    id: "3",
    title: "未愈合的伤口",
    prompt: "写下你心中一个尚未愈合的伤口，不必急于修复，只需看见它。",
    category: "emotion",
    inspiration: {
      angles: [
        "诚实面对：承认伤口的存在，本身就是疗愈的开始。",
        "细节回顾：发生了什么？当时的感受是什么？",
        "当前状态：它现在如何影响你？"
      ],
      examples: [
        "「那是十年前的背叛，伤口已经结痂，但偶尔还会隐隐作痛。我不再强迫自己'放下'，只是学习带着它继续前行。」"
      ]
    }
  },
  {
    id: "4",
    title: "成功的定义",
    prompt: "在这个社会定义成功之外，你心中的成功是什么？",
    category: "philosophical",
    inspiration: {
      angles: [
        "解构期待：抛开世俗标准，成功对你意味着什么？",
        "重新定义：是内心的平静？真实的表达？还是与人的联结？",
        "实践路径：你如何在自己的定义中生活？"
      ],
      examples: [
        "「社会说成功是财富和地位，但我认为成功是：在深夜能坦然面对自己，问心无愧。」"
      ]
    }
  },
  {
    id: "5",
    title: "给自己的一封信",
    prompt: "以温柔的态度，给现在的自己写一封信。",
    category: "emotion",
    inspiration: {
      angles: [
        "温柔视角：像对待好朋友一样对待自己。",
        "鼓励肯定：告诉现在的自己：你已经做得很好了。",
        "理解包容：接纳所有的不完美和挣扎。"
      ],
      examples: [
        "「亲爱的自己：我知道你很累，很迷茫，但请相信，每一步都算数。你不必完美，你只需做你自己。」"
      ]
    }
  },
  {
    id: "6",
    title: "痛苦的礼物",
    prompt: "回顾一次痛苦经历，它教会了你什么？",
    category: "emotion",
    inspiration: {
      angles: [
        "回顾创伤：不必详细描述，只需记住它的教训。",
        "转化视角：痛苦如何成为成长的养分？",
        "感恩成长：感谢那时的自己熬过来了。"
      ],
      examples: [
        "「那次失去教会我：无常是生命的本质。我不再紧抓不放，学会了珍惜当下每一次相遇。」"
      ]
    }
  },
  {
    id: "7",
    title: "生命的意义",
    prompt: "此时此刻，你认为生命的意义是什么？",
    category: "philosophical",
    inspiration: {
      angles: [
        "个人定义：不要用教科书的话，说出你真实的想法。",
        "变化性：这个答案会随着时间改变吗？",
        "生活实践：你如何活出这个意义？"
      ],
      examples: [
        "「生命的意义就是不断地认识自己。在每一次痛苦、喜悦、迷茫中，我离真实的自己更近一点。」"
      ]
    }
  },
  {
    id: "8",
    title: "此时此刻",
    prompt: "停下一切，感受当下。你现在的真实状态是什么？",
    category: "reflection",
    inspiration: {
      angles: [
        "身体觉察：身体的感受如何？",
        "情绪状态：内心平静？焦虑？还是疲惫？",
        "诚实面对：不要逃避，如实记录。"
      ],
      examples: [
        "「此刻，我的肩膀很紧，心有点慌。我承认，我在担心明天的考试。承认后，反而松了一口气。」"
      ]
    }
  },
  {
    id: "9",
    title: "善待自己",
    prompt: "今天你做了哪件善待自己的小事？",
    category: "emotion",
    inspiration: {
      angles: [
        "自我关怀：你如何照顾自己的身心？",
        "小事的意义：不必宏大，微小的善意也重要。",
        "养成习惯：每天给自己一点温柔。"
      ],
      examples: [
        "「今天我允许自己偷懒，没有完成计划。我对自己说：累了就休息，这不是懒惰，是爱自己的表现。」"
      ]
    }
  },

  // === 创意写作 Creative Writing ===
  {
    id: "10",
    title: "梦境之地",
    prompt: "描写一个你从未去过但经常梦见的地方。",
    category: "imagination",
    inspiration: {
      angles: [
        "尝试调动五感：那里的空气闻起来是什么样的？脚下踩着什么质感的东西？",
        "考虑时间设定：这个地方存在于过去、未来，还是一个超越时空的维度？",
        "思考情感联结：为什么这个地方会反复出现在你的梦中？它在向你传达什么？"
      ],
      examples: [
        "「那是一片永远悬停在黄昏时度的草原，天空呈现出渐变的紫罗兰色，草尖上挂着的露珠在即将沉没的日光中闪烁。」"
      ]
    }
  },
  {
    id: "11",
    title: "颜色的声音",
    prompt: "如果在这个世界上，颜色有声音，那蓝色听起来像什么？",
    category: "creative",
    inspiration: {
      angles: [
        "通感描写：蓝色是尖锐的高音，还是低沉的叹息？是乐器的声音，还是自然之声？",
        "情绪联想：当你听到「蓝色的声音」时，内心会产生怎样的感受？平静？忧伤？辽阔？",
        "场景设定：不同场景下的蓝色声音是否不同？比如海洋的蓝、天空的蓝、深夜的蓝。"
      ],
      examples: [
        "「蓝色听起来像是大提琴最轻柔的那一弓，在空旷的音乐厅里缓缓荡开，带着微微的颤音。」",
        "「蓝色，是雨滴敲击玻璃窗的节奏，清脆却不刺耳，像一首没有歌词的摇篮曲。」"
      ]
    }
  },
  {
    id: "12",
    title: "钥匙",
    prompt: "你手中有一把神秘的钥匙，它能打开任何一扇门。你会打开哪扇门？",
    category: "imagination",
    inspiration: {
      angles: [
        "门的象征：这扇门代表什么？是过去的遗憾、未来的可能，还是某个秘密？",
        "门后世界：门后是什么景象？是真实的场景，还是抽象的存在？",
        "行动描述：你如何走向这扇门？打开的瞬间发生了什么？"
      ],
      examples: [
        "「那是一扇古老的木门，钥匙插进去时发出清脆的声响。门后是我童年的家，奶奶还在厨房忙碌，一切仿佛回到了从前。」"
      ]
    }
  },
  {
    id: "13",
    title: "雨夜咖啡馆",
    prompt: "在一个雨夜的咖啡馆里，你注意到了对面坐着的陌生人。描述你观察到的细节。",
    category: "creative",
    inspiration: {
      angles: [
        "观察细节：这个人的外貌、动作、神态有什么特别之处？",
        "想象空间：你对他/她有什么想象？他在等待什么？在逃避什么？",
        "氛围营造：雨夜的咖啡馆有怎样独特的氛围？"
      ],
      examples: [
        "「窗外的雨把世界模糊成一片水彩，咖啡馆里流淌着爵士乐。他对面的座位一直空着，咖啡已经凉了，但他每隔几分钟还是会看一眼手机，然后又放下。」"
      ]
    }
  },
  {
    id: "14",
    title: "物品的视角",
    prompt: "以一件随身物品的视角，讲述你的一天。",
    category: "creative",
    inspiration: {
      angles: [
        "物品选择：手机？钥匙？手表？还是钱包？",
        "观察视角：它看到了什么你忽略的细节？",
        "情感投射：它对你有什么想法？"
      ],
      examples: [
        "「我是她的手机。从早上七点的闹钟开始，我见证了她的一天：匆忙的早餐、紧张的会议、深夜的崩溃。我记住了所有秘密，却无法诉说。」"
      ]
    }
  },
  {
    id: "15",
    title: "书店的一角",
    prompt: "在书店的角落，你发现了一本没有作者名字的书。翻开第一页，写了什么？",
    category: "imagination",
    inspiration: {
      angles: [
        "书店氛围：这个角落有什么特别？安静？神秘？",
        "书的外观：这本无名书是什么样子？",
        "内容创意：第一页的文字是什么？是故事？诗歌？还是预言？"
      ],
      examples: [
        "「那本书泛黄的书页上只有一行字：『找到这本书的人，正是我一直在等待的读者。』我的心脏突然漏跳了一拍。」"
      ]
    }
  },
  {
    id: "16",
    title: "动物的眼睛",
    prompt: "想象你能听懂动物的语言。在公园的长椅上，一只流浪猫对你说了什么？",
    category: "imagination",
    inspiration: {
      angles: [
        "对话设定：这只猫是什么性格？高傲？温柔？还是愤世嫉俗？",
        "视角转换：从动物的眼睛看，人类世界是什么样子的？",
        "情感深度：这段对话让你对生命有什么新的理解？"
      ],
      examples: [
        "「它慵懒地舔了舔爪子，说：你们人类总以为自己是主角，其实在我眼里，你们不过是忙碌的配角罢了。」"
      ]
    }
  },
  {
    id: "17",
    title: "季节的告别",
    prompt: "用文字描写一个季节的离去和另一个季节的到来。",
    category: "creative",
    inspiration: {
      angles: [
        "感官变化：从视觉、听觉、触觉描写季节交替的细节。",
        "情感投射：季节更替让你联想到什么？",
        "意象选择：用哪些具体意象代表季节？"
      ],
      examples: [
        "「夏天的最后一片叶子落下时，秋意已悄然渗入空气。蝉鸣渐弱，凉风初起，世界像换了一幅画，从浓烈转为淡雅。」"
      ]
    }
  },
  {
    id: "18",
    title: "如果文字有颜色",
    prompt: "如果每个汉字都有对应的颜色，你觉得「爱」「恨」「希望」「遗憾」分别是什么颜色？",
    category: "creative",
    inspiration: {
      angles: [
        "通感联想：为什么这些字会对应特定的颜色？是基于字形、读音，还是含义？",
        "情感表达：每种颜色的饱和度、明暗如何体现这个字的情感内涵？",
        "延伸思考：文字的颜色会随着语境变化吗？"
      ],
      examples: [
        "「『爱』是暖橙色，像清晨透过窗帘的第一缕阳光；『希望』是嫩绿色，像春天破土而出的新芽；『遗憾』是淡紫色，美丽却带着忧伤。」"
      ]
    }
  },
  {
    id: "19",
    title: "城市的声音",
    prompt: "闭上眼睛，聆听你所在城市的声音。用文字重现这些声音。",
    category: "creative",
    inspiration: {
      angles: [
        "层次描写：从远到近，从模糊到清晰，声音是如何分层的？",
        "情感色彩：这些声音给你什么感觉？喧嚣？宁静？孤独？温暖？",
        "意象联想：每个声音让你联想到什么画面？"
      ],
      examples: [
        "「早高峰的地铁像一支移动的交响乐：报站声是女高音，车轮摩擦声是低音贝斯，人们交谈声像此起彼伏的小提琴，共同奏出城市苏醒的乐章。」"
      ]
    }
  },
  {
    id: "20",
    title: "如果拥有超能力",
    prompt: "如果能拥有一种超能力 24 小时，你会选择什么？为什么？",
    category: "imagination",
    inspiration: {
      angles: [
        "能力选择：飞行？读心术？时间旅行？还是其他？",
        "使用计划：你会用这 24 小时做什么？",
        "深层动机：为什么选择这个能力？它反映了你内心什么渴望？"
      ],
      examples: [
        "「我想拥有隐身能力。不是为了做什么特别的事，只是想偷一点时间，从世界的注视中消失，真正地做一次自己。」"
      ]
    }
  },
  {
    id: "21",
    title: "秘密花园",
    prompt: "你内心有一个只有自己知道的秘密花园。描述它是什么样子的。",
    category: "imagination",
    inspiration: {
      angles: [
        "场景构建：这个花园有什么？花草、建筑，还是其他？",
        "象征意义：花园里的元素代表你内心的什么？",
        "进入方式：你如何进入这个秘密空间？"
      ],
      examples: [
        "「我的秘密花园在一片森林深处。那里没有时间，只有永恒的黄昏。一棵巨大的古树下，埋藏着我所有的秘密和愿望。」"
      ]
    }
  },

  // === 反思与成长 Reflection & Growth ===
  {
    id: "22",
    title: "给十年前的自己",
    prompt: "给十年前的自己写一张 50 字的明信片。",
    category: "reflection",
    inspiration: {
      angles: [
        "时间视角：站在现在回望过去，你最想告诉那时的自己什么？",
        "情感表达：是鼓励、安慰、提醒，还是仅仅是问候？",
        "字数限制：50 字很珍贵，每一字都要有分量，你会选择哪些关键信息？"
      ],
      examples: [
        "「亲爱的我：别怕那些选择，每一个转弯都带你来到此刻。保持善良，也要学会保护自己。十年后的你，还不错。」",
        "「嘿，别那么焦虑。你现在担心的事，十年后大多不成问题。好好享受此刻的阳光吧。」"
      ]
    }
  },
  {
    id: "23",
    title: "与未来的对话",
    prompt: "想象十年后的你坐在面前，你们会聊些什么？",
    category: "reflection",
    inspiration: {
      angles: [
        "对话内容：你会问未来的自己什么问题？他/她会如何回答？",
        "对比变化：想象十年后的自己在外表、心态、生活上有什么变化。",
        "情感表达：是期待？恐惧？好奇？还是平静的接受？"
      ],
      examples: [
        "「我问他：你过上自己想要的生活了吗？他笑了笑，说：生活的答案永远在路上，但我学会了不再问终点在哪里，而是享受每一步。」"
      ]
    }
  },
  {
    id: "24",
    title: "改变的勇气",
    prompt: "回顾过去一年，你在哪些方面发生了变化？哪些改变是你主动选择的？",
    category: "reflection",
    inspiration: {
      angles: [
        "外在变化：生活方式、环境、关系有什么改变？",
        "内在成长：心态、认知、价值观如何演进？",
        "成长意义：这些变化意味着什么？"
      ],
      examples: [
        "「三年前的我总想要证明自己，现在学会了接纳自己的节奏。这种平静，比任何成就都珍贵。」"
      ]
    }
  },
  {
    id: "25",
    title: "老物件的故事",
    prompt: "描述一件你家中存放超过十年的老物件，讲述它见证的故事。",
    category: "emotion",
    inspiration: {
      angles: [
        "物象描写：仔细观察这件物品的细节——它的质感、颜色、痕迹。",
        "时间叙事：它见证了你家中的哪些重要时刻？经历了怎样的变迁？",
        "情感联结：为什么这件物品被保留下来？它对你意味着什么？"
      ],
      examples: [
        "「那把旧藤椅的扶手已经磨得发亮，藤条间夹杂着我小时候塞进去的图画纸。每次坐上去，它都会发出轻微的吱呀声，像是一位老人在回忆往事。」"
      ]
    }
  },
  {
    id: "26",
    title: "未寄出的信",
    prompt: "写一封你永远不会寄出的信。",
    category: "emotion",
    inspiration: {
      angles: [
        "收信人：可以是一个已经失去联系的人、过去的自己，甚至是未来的某人。",
        "情感表达：因为知道不会寄出，所以可以更坦诚。你想说哪些平时无法说出口的话？",
        "写作风格：是温柔的、愤怒的、遗憾的，还是释然的？"
      ],
      examples: [
        "「有些话当时没有说，后来就再也没机会说了。今天，我决定把它们写下来，不是为了寄给你，而是为了放过我自己。」"
      ]
    }
  },
  {
    id: "27",
    title: "童年的味道",
    prompt: "描述一种让你想起童年的味道，以及与之相关的记忆。",
    category: "emotion",
    inspiration: {
      angles: [
        "感官描写：这种味道是怎样的？是食物的香气、自然的气息，还是某种特别的味道？",
        "记忆联结：它让你想起童年的哪些场景？谁在你身边？发生了什么？",
        "情感表达：回忆起这段童年时光，你内心涌起怎样的情感？"
      ],
      examples: [
        "「是外婆家灶台上熬的红豆汤的味道。每次闻到这股甜香，我就看见夏天的午后，知了在窗外叫个不停，外婆在厨房忙碌，我坐在小板凳上看书。」"
      ]
    }
  },
  {
    id: "28",
    title: "深夜独处",
    prompt: "描述一个深夜独自醒来的时刻，你在想什么？",
    category: "reflection",
    inspiration: {
      angles: [
        "氛围营造：深夜的环境是怎样的？安静？还是有细微的声音？",
        "思绪流动：你的思绪飘向哪里？过去？未来？还是某个具体的人？",
        "情感状态：孤独？平静？焦虑？还是某种难以名状的感受？"
      ],
      examples: [
        "「凌晨三点，世界沉睡。我听见自己的心跳，在寂静中格外清晰。思绪像潮水般涌来——关于明天，关于昨天，关于那些无法言说的遗憾。」"
      ]
    }
  },
  {
    id: "29",
    title: "未完成的约定",
    prompt: "写下你和某人的一个约定，它至今还未完成。发生了什么？",
    category: "emotion",
    inspiration: {
      angles: [
        "约定内容：是什么约定？和谁的约定？",
        "未完成原因：时间？距离？还是其他变故？",
        "情感处理：遗憾？释然？还是等待？"
      ],
      examples: [
        "「我们约定三十岁时一起去 Iceland 看极光。现在三十岁了，她在地球的另一端结婚生子，而我独自一人看着极光的照片。」"
      ]
    }
  },
  {
    id: "30",
    title: "第一次",
    prompt: "描述你人生中印象深刻的「第一次」经历。",
    category: "emotion",
    inspiration: {
      angles: [
        "事件选择：第一次旅行？第一次心碎？第一次独立？",
        "感官记忆：当时的细节你记得多少？气味、声音、触感？",
        "情感变化：从紧张到完成，心路历程是怎样的？"
      ],
      examples: [
        "「第一次独自旅行，在异国的街头迷路了。恐慌之后是兴奋——原来我可以在陌生的地方找到方向，就像在人生中一样。」"
      ]
    }
  },

  // === 哲学思考 Philosophical ===
  {
    id: "31",
    title: "如果时间可以暂停",
    prompt: "如果有一天你获得了暂停时间的能力，你会选择在哪个时刻按下暂停键？",
    category: "philosophical",
    inspiration: {
      angles: [
        "场景选择：是珍贵的欢聚时刻？是宁静的独处时光？还是某个特别的瞬间？",
        "行为描述：暂停的时间里，你会做什么？观察？思考？还是仅仅是享受？",
        "深层思考：为什么选择这个时刻？它对你意味着什么？"
      ],
      examples: [
        "「我会选择在家人围坐餐桌的那个傍晚暂停。热气腾腾的饭菜，父亲的笑声，母亲唠叨的日常，所有美好都凝固在那个瞬间，我可以在房间里慢慢走动，记住每一张脸上的表情。」"
      ]
    }
  },
  {
    id: "32",
    title: "假如生命只剩一天",
    prompt: "如果得知生命只剩下二十四小时，你会如何度过？",
    category: "philosophical",
    inspiration: {
      angles: [
        "优先排序：在这最后一天里，什么对你最重要？",
        "具体行动：不是泛泛而谈，而是具体描述你会做什么、见谁、去哪里。",
        "情感处理：恐惧、平静、遗憾、释然——你会经历怎样的心路历程？"
      ],
      examples: [
        "「我不会去旅行或完成什么宏大愿望。我会回家，给爸妈做顿饭，翻看旧相册，和最好的朋友通个电话。在平凡中，完成最后的告别。」"
      ]
    }
  },
  {
    id: "33",
    title: "如果时间倒流",
    prompt: "如果能回到人生中的某个时刻重新体验一次，你会选择什么时候？",
    category: "philosophical",
    inspiration: {
      angles: [
        "时刻选择：是幸福的瞬间，还是遗憾的时刻？",
        "改变意图：你会做出不同的选择吗？还是仅仅重新感受？",
        "深层思考：为什么这个时刻如此重要？"
      ],
      examples: [
        "「我想回到那个夏日的傍晚，蝉鸣声里，我第一次遇见她。我不会改变任何决定，只是想更仔细地记住那一刻心动的感觉。」"
      ]
    }
  },
  {
    id: "34",
    title: "人生的剧本",
    prompt: "如果人生是一部电影，你是编剧。你会给现在的场景写什么样的剧情？",
    category: "philosophical",
    inspiration: {
      angles: [
        "场景设定：现在的情节是怎样的？起承转合在哪个阶段？",
        "角色塑造：你在这个剧本中是什么角色？主角？配角？",
        "走向预期：接下来的剧情你希望如何发展？"
      ],
      examples: [
        "「现在应该是电影中的转折点——前半段的铺垫已经完成，主角即将做出重要选择。我知道这个选择会让剧情走向完全不同的方向。」"
      ]
    }
  },
  {
    id: "35",
    title: "理想与现实",
    prompt: "你理想中的生活是什么样子？现实中的生活又是怎样？两者的差距给你什么感受？",
    category: "philosophical",
    inspiration: {
      angles: [
        "理想描绘：理想生活有哪些具体细节？",
        "现实呈现：现实生活的真实状况如何？",
        "应对态度：如何面对这个差距？接受？抗争？和解？"
      ],
      examples: [
        "「理想中的生活是慢节奏的，有足够时间读书、发呆。现实却是被工作填满。但我在缝隙中偷来的阅读时光，反而显得格外珍贵。」"
      ]
    }
  }
];

// 从数据库获取话题 (推荐方式)
// Fetch topics from database (recommended approach)
export async function fetchTopicsFromDatabase(options?: {
  category?: string
  limit?: number
}): Promise<Topic[]> {
  try {
    const params = new URLSearchParams()
    if (options?.category) params.append('category', options.category)
    if (options?.limit) params.append('limit', options.limit.toString())

    const response = await fetch(`/api/topics?${params.toString()}`, {
      cache: 'no-store' // Always fetch fresh data
    })

    if (!response.ok) {
      console.error('Failed to fetch topics from database, using fallback')
      return fallbackTopicsDatabase
    }

    const { topics } = await response.json()
    return topics || fallbackTopicsDatabase
  } catch (error) {
    console.error('Error fetching topics:', error)
    return fallbackTopicsDatabase
  }
}

// 客户端随机获取话题 (从数据库)
// Client-side: Get random topics from database
export async function getRandomTopics(
  count: number = 3,
  excludeIds: string[] = []
): Promise<Topic[]> {
  try {
    // 获取所有 topics 以确保最大的随机性和新鲜度
    // Fetch all topics to ensure maximum randomness and freshness
    const allTopics = await fetchTopicsFromDatabase({ limit: 100 })

    // 过滤掉最近显示过的 topics
    // Filter out recently shown topics
    const availableTopics = allTopics.filter(topic => !excludeIds.includes(topic.id))

    // 如果可用的 topics 不够，就使用全部 topics
    // If not enough available topics, use all topics
    const topicsToRandomize = availableTopics.length >= count
      ? availableTopics
      : allTopics

    // Fisher-Yates 洗牌算法 (更好的随机性)
    // Fisher-Yates shuffle algorithm (better randomness)
    const shuffled = [...topicsToRandomize]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled.slice(0, count)
  } catch (error) {
    console.error('Error getting random topics:', error)
    const available = fallbackTopicsDatabase.filter(t => !excludeIds.includes(t.id))
    const shuffled = available.length >= count ? available : fallbackTopicsDatabase
    return shuffled.slice(0, count)
  }
}

// 根据 ID 获取话题 (从数据库)
// Get topic by ID from database
export async function getTopicById(id: string): Promise<Topic | undefined> {
  try {
    const topics = await fetchTopicsFromDatabase()
    return topics.find(topic => topic.id === id)
  } catch (error) {
    console.error('Error getting topic by ID:', error)
    return fallbackTopicsDatabase.find(topic => topic.id === id)
  }
}

// 向后兼容：同步版本的随机获取 (使用缓存数据)
// Backward compatibility: Synchronous version (uses fallback data)
export function getRandomTopicsSync(count: number = 3): Topic[] {
  const shuffled = [...fallbackTopicsDatabase].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// 向后兼容：同步版本的按ID获取 (使用缓存数据)
// Backward compatibility: Synchronous version by ID (uses fallback data)
export function getTopicByIdSync(id: string): Topic | undefined {
  return fallbackTopicsDatabase.find(topic => topic.id === id)
}

// Category emoji mapping
export const categoryEmojis: Record<string, string> = {
  imagination: "🌙",
  creative: "✨",
  reflection: "💭",
  emotion: "💫",
  philosophical: "🌊"
};
