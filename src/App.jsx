import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// HOLY WEEK EXPERIENCE PLATFORM — 聖週體驗平台 v4
// Readability overhaul: high-contrast text, light color variants
// ============================================================

// Each day now has:
//   color  = saturated mid-tone (for borders, backgrounds, fills)
//   light  = bright readable version (for ALL text on dark bg)
//   bg     = subtle tinted background
const D = [
  {
    day:0, weekday:"週日", name:"棕枝主日", nameEn:"Palm Sunday",
    color:"#4A7C59", light:"#7BC98E", bg:"#4A7C5912",
    icon:"🌿", location:"橄欖山 → 耶路撒冷",
    story:"耶穌騎著驢駒進入耶路撒冷。群眾揮舞棕枝高喊「和散那」，以為他是來推翻羅馬統治的政治彌賽亞。但耶穌選擇的坐騎——一頭驢駒——卻暗示了一個完全不同的王國。",
    storyExp:"想像你站在耶路撒冷的街道上。一個你聽說過的老師正在進城。人群在歡呼。你不確定為什麼，但你被那股能量吸引了過去。",
    soulQ:"你是否曾經對某人寄予了錯誤的期待？",
    scriptureKey:"馬可福音 11:1-11",
    scriptures:[
      {ref:"馬可福音 11:7-10",text:"他們把驢駒牽到耶穌那裡，把自己的衣服搭在上面，耶穌就騎上。有許多人把衣服鋪在路上，也有人把田間的樹枝砍下來，鋪在路上。前行後隨的人都喊著說：「和散那！奉主名來的是應當稱頌的！那將要來的我祖大衛之國是應當稱頌的！高高在上和散那！」"},
      {ref:"撒迦利亞 9:9",text:"錫安的民哪，應當大大喜樂！耶路撒冷的民哪，應當歡呼！看哪，你的王來到你這裡！他是公義的，並且施行拯救，謙謙和和地騎著驢，就是騎著驢的駒子。",hl:true},
      {ref:"路加福音 19:41-42",text:"耶穌快到耶路撒冷，看見城，就為它哀哭，說：「巴不得你在這日子知道關係你平安的事；無奈這事現在是隱藏的，叫你的眼看不出來。」"},
    ],
    study:"四福音書對進城的記載有微妙差異：馬太提到兩頭驢，馬可和路加只提一頭。這不是矛盾，而是不同的敘事焦點。撒迦利亞 9:9 的預言在此精確應驗——和平之君騎的不是戰馬，而是驢駒。",
    apol:"四福音書中驢的數量不同是否矛盾？馬太提到母驢和驢駒，其他福音書只聚焦於耶穌實際騎乘的驢駒——這是詳略之別，不是事實衝突。歷史學家指出，多位獨立目擊者記錄同一事件時，細節差異反而是真實性的標誌。",
    apolExp:"一個兩千年前的事件，怎麼可能被準確記錄？有趣的是，四本記載這件事的文獻在細節上有些微不同——就像四個目擊者描述同一場車禍。歷史學家反而認為，這些差異正是真實性的證據：如果是捏造的，故事會完全一致。",
    ct:{
      scene:"你是耶路撒冷街頭的一員。一個叫耶穌的人騎著驢駒進城，群眾揮舞棕枝在歡呼。有人說他是彌賽亞，有人說他是先知，也有人冷眼旁觀。你站在人群中，必須做出回應——",
      choices:[
        {text:"加入歡呼的人群",result:"你和眾人一起高喊「和散那」。腎上腺素飆升，你感覺自己正在見證歷史。但五天後，同一群人將喊出「釘他十字架」。群眾的熱情來得快，去得更快——真正的信仰，大概不是這種感覺。",nudge:"是什麼讓同一群人在五天內徹底翻轉？繼續明天的旅程，你會看到這個轉折是怎麼發生的。"},
        {text:"站在一旁觀察",result:"你退到街邊，仔細觀察。你注意到耶穌的眼神——在歡呼聲中，他似乎帶著一種深沉的悲傷。路加福音記載，他在這個時刻為耶路撒冷哭了。一個即將被萬人擁戴的人，為什麼會哭？",nudge:"他看到了這些歡呼的人看不到的東西。往下滑到「深入探索」，經文分析會告訴你。"},
        {text:"轉身離開",result:"不過是又一個自稱彌賽亞的人罷了。在羅馬統治下，這種人隔幾年就冒出一個。但有什麼東西讓你忍不住回頭再看了一眼——也許是他臉上那種不像革命領袖的安靜。",nudge:"歷史上自稱彌賽亞的人確實很多，但只有這一位的故事被記住了兩千年。為什麼？答案藏在接下來幾天的旅程裡。"},
      ],
    },
    micro:"今天，找一個你平常不會注意的人，真誠地問候他們。",
    group:"「和散那」意為「拯救我們」。你內心最深處的「和散那」是什麼？你最希望被拯救脫離什麼？",
    sermon:"棕枝主日揭示了一個永恆的張力：我們要的王，和神差來的王，往往不是同一位。群眾要的是政治解放者，神差來的是靈魂的救贖者。真正的「和散那」，不是要神來滿足我們的期待，而是放下期待，接受他自己。",
  },
  {
    day:1, weekday:"週一", name:"潔淨聖殿", nameEn:"Temple Cleansing",
    color:"#8B4513", light:"#D4956A", bg:"#8B451312",
    icon:"🏛️", location:"聖殿山",
    story:"耶穌走進聖殿，推翻了兌換銀錢之人的桌子。這不是失控的暴怒，而是先知性的行動——他在宣告：這個本應讓萬民親近神的地方，已經變成了一個排他的商業機構。",
    storyExp:"有人走進一座城市裡最宏偉的宗教建築，開始掀桌子。所有人都嚇呆了。但他說的話讓在場的人停下來思考：這個地方是否已經偏離了它存在的初衷？",
    soulQ:"你生命中有什麼東西，已經從「工具」變成了「偶像」？",
    scriptureKey:"馬可福音 11:15-19",
    scriptures:[
      {ref:"馬可福音 11:15-17",text:"他們來到耶路撒冷。耶穌進入聖殿，趕出殿裡做買賣的人，推倒兌換銀錢之人的桌子和賣鴿子之人的凳子，也不許人拿著器具從殿裡經過。便教訓他們說：「經上不是記著說：『我的殿必稱為萬國禱告的殿』嗎？你們倒使它成為賊窩了。」"},
      {ref:"以賽亞書 56:7",text:"我必領他們到我的聖山，使他們在禱告我的殿中喜樂。他們的燔祭和平安祭，在我壇上必蒙悅納，因我的殿必稱為萬民禱告的殿。",hl:true},
      {ref:"馬可福音 11:18",text:"祭司長和文士聽見這話，就想法子要除滅耶穌，卻又怕他，因為眾人都希奇他的教訓。"},
    ],
    study:"耶穌引用以賽亞書 56:7「萬國禱告的殿」和耶利米書 7:11「賊窩」——前者指向聖殿的普世使命，後者指控宗教領袖的腐敗。潔淨聖殿不是反對商業，而是反對以宗教之名行排斥之實。",
    apol:"耶穌掀桌子是否構成「暴力」？這是先知性的象徵行動，類似舊約先知以西結的行為藝術。沒有任何記載顯示他傷害了任何人。他的憤怒針對的是系統性的不公義——當宗教成為壓迫的工具，沈默才是真正的暴力。",
    apolExp:"一個宣揚「愛」的老師，卻在公共場合掀桌子？這看起來很矛盾。但如果你仔細看，他掀的不是隨便什麼桌子——而是那些利用窮人、壟斷信仰通道的商人的桌子。有時候，對不公義的憤怒，本身就是一種愛的表現。",
    ct:{
      scene:"你是聖殿裡的一個普通人。你來這裡是為了獻祭禱告，但你必須先用高額匯率兌換聖殿專用貨幣，再用離譜的價格買一隻鴿子。這時，一個人走進來開始掀桌子——",
      choices:[
        {text:"內心暗暗叫好",result:"終於有人說出你一直想說的話了。每次來聖殿都覺得哪裡不對勁——明明是來親近神的，為什麼感覺像在被剝削？但這份暗爽之後，一個更深的問題浮現：如果連聖殿都被腐蝕了，我還能在哪裡找到神？",nudge:"這個問題不只屬於兩千年前。今天的宗教機構也面臨同樣的考驗。往下滑到護教議題，看看「暴力與公義」的討論。"},
        {text:"擔心他會被逮捕",result:"你知道這裡的規矩——聖殿的權力結構根深蒂固。這個人在挑戰整個系統，他不可能全身而退。你是對的：從這一刻起，宗教領袖開始密謀除掉他。有時候，做對的事情是要付代價的。",nudge:"他知道這麼做的後果，但他還是做了。是什麼給了他這樣的勇氣？週五的故事會給你答案。"},
        {text:"覺得他太過激了",result:"你理解他的不滿，但掀桌子？也太過了吧。有話好好說不行嗎？但轉念一想——如果好好說有用的話，這個系統早就改變了。剩下的選擇，只有沈默或行動。",nudge:"「合理的抗議」和「過激的行為」之間的界線在哪裡？護教議題區有更多思考角度。"},
      ],
    },
    micro:"檢視你的生活：有什麼好的事物已經在不知不覺中佔據了神的位置？寫下來，然後試著放下。",
    group:"如果耶穌今天走進我們的教會，他會「掀翻」什麼？",
    sermon:"潔淨聖殿的核心不是暴力，而是 grief——一種深沉的悲傷。耶穌看到本該讓人親近神的地方，反而成了障礙。我們的傳統、制度、甚至事工，是否已經從「橋樑」變成了「圍牆」？",
  },
  {
    day:2, weekday:"週二", name:"橄欖山論述", nameEn:"Olivet Discourse",
    color:"#1B3A4B", light:"#6BAFD4", bg:"#1B3A4B12",
    icon:"⛰️", location:"橄欖山",
    story:"門徒問耶穌：世界末日什麼時候來？耶穌的回答出人意料——他沒有給出時間表，而是說：「你們要警醒。」末日不是用來計算的，而是用來活出當下的。",
    storyExp:"如果有人告訴你，這個世界的運作方式即將被徹底改變——不是明天，不是明年，但一定會發生——你會怎麼過今天？這就是那天下午在山上發生的對話。",
    soulQ:"如果你知道明天是最後一天，今天你會做什麼不同的事？",
    scriptureKey:"馬可福音 13",
    scriptures:[
      {ref:"馬可福音 13:1-2",text:"耶穌從殿裡出來的時候，有一個門徒對他說：「夫子，請看，這是何等的石頭！何等的殿宇！」耶穌對他說：「你看見這大殿宇嗎？將來在這裡沒有一塊石頭留在石頭上，不被拆毀了。」"},
      {ref:"馬可福音 13:32-33",text:"「但那日子，那時辰，沒有人知道，連天上的使者也不知道，子也不知道，惟有父知道。你們要謹慎，警醒祈禱，因為你們不曉得那日期幾時來到。」",hl:true},
      {ref:"馬可福音 13:35-37",text:"「所以，你們要警醒；因為你們不知道家主什麼時候來，或晚上，或半夜，或雞叫，或早晨。恐怕他忽然來到，看見你們睡著了。我對你們所說的話，也是對眾人說：要警醒！」"},
    ],
    study:"馬可福音 13 章是釋經學上最具爭議的段落之一。「這世代還沒有過去，這些事都要成就」——最合理的理解是「雙重應驗」：近期指向主後 70 年聖殿被毀，遠期指向基督再來。",
    apol:"耶穌說「這世代還沒有過去」，但兩千年過去了——這是否是一個失敗的預言？「這世代」最可能指的是主後 70 年聖殿被毀——這確實在那一代人中應驗了。預言的「雙重應驗」結構在舊約中也有先例。",
    apolExp:"兩千年前有人預言「世界末日快到了」，結果兩千年過去了，世界還在。這算不算一個失敗的預言？不一定。其中一部分——關於聖殿被毀滅的預言——在四十年後就精確應驗了。另一部分呢？也許還在等待中。",
    ct:{
      scene:"你是門徒之一，坐在橄欖山上。眼前是壯麗的耶路撒冷和金光閃閃的聖殿。耶穌剛剛說了一句讓你脊背發涼的話：「這些建築，將來沒有一塊石頭留在另一塊石頭上。」你想問——",
      choices:[
        {text:"「什麼時候會發生？」",result:"這是最自然的問題，門徒也確實這樣問了。但耶穌的回答讓人意外：他沒有給出日期，反而講了一長串關於「要警醒、要預備」的話。你期待的是一張時間表，他給你的是一種生活方式。",nudge:"「警醒」和「焦慮」只有一線之隔。往下滑到今天的微行動，它會幫你落地這個概念。"},
        {text:"「我們該怎麼辦？」",result:"你跳過了時間問題，直接問行動。耶穌用了僕人等候主人回來的比喻回答你：好好做你被託付的事。不是恐慌，不是躺平，而是帶著使命感活每一天。",nudge:"你被「託付」了什麼？深入探索的經文分析會幫你拆解這段話的結構。"},
        {text:"沉默不語，看著聖殿",result:"你沒有說話。你只是看著那座你從小仰望的建築，試圖想像它變成廢墟的樣子。你做不到。有些東西看起來永遠不會改變——直到它改變的那一天。主後 70 年，羅馬軍隊真的拆毀了聖殿。",nudge:"你生命中有什麼「聖殿」——看似永遠不會倒的東西？往下滑，今天的靈魂問題會陪你想這件事。"},
      ],
    },
    micro:"寫下三件你一直拖延的重要事情。選一件，今天就開始。不是完成它，只是開始。",
    group:"「警醒」在日常生活中是什麼樣子？和「焦慮」有什麼不同？",
    sermon:"門徒問「什麼時候」，耶穌回答「怎麼活」。這不是迴避問題，而是重新定義問題。末世論的真正目的不是讓我們計算日期，而是讓我們帶著 urgency 活在當下。",
  },
  {
    day:3, weekday:"週三", name:"背叛之日", nameEn:"Day of Betrayal",
    color:"#4A0E2E", light:"#D47AA0", bg:"#4A0E2E12",
    icon:"💔", location:"伯大尼 → 大祭司府",
    story:"兩個極端的場景：一位無名女子打碎珍貴香膏膏抹耶穌，猶大卻走向大祭司商量出賣的價錢。愛的揮霍與背叛的算計，在同一天發生。",
    storyExp:"一個女人做了一件「浪費」的事——把價值一年薪水的香水倒在一個人身上。在場所有人都在批評她。但那個被倒香水的人卻說：「她做了一件美事。」",
    soulQ:"你上一次為了愛做了一件在別人看來「不值得」的事是什麼時候？",
    scriptureKey:"馬可福音 14:1-11",
    scriptures:[
      {ref:"馬可福音 14:3-6",text:"耶穌在伯大尼長大痲瘋的西門家裡坐席的時候，有一個女人拿著一玉瓶至貴的真哪噠香膏來，打破玉瓶，把膏澆在耶穌的頭上。有幾個人心中很不喜悅，說：「何用這樣枉費香膏呢？這香膏可以賣三十多兩銀子賙濟窮人。」他們就向那女人生氣。耶穌說：「由她吧！為什麼難為她呢？她在我身上做的是一件美事。」"},
      {ref:"馬可福音 14:8-9",text:"「她所做的，是盡她所能的；她是為我安葬的事把香膏預先澆在我身上。我實在告訴你們，普天之下，無論在什麼地方傳這福音，也要述說這女人所做的，以為記念。」",hl:true},
      {ref:"馬可福音 14:10-11",text:"十二門徒之中，有一個加略人猶大去見祭司長，要把耶穌交給他們。他們聽見就歡喜，又應許給他銀子；他就尋思如何得便把耶穌交給他們。"},
    ],
    study:"香膏的價值約 300 得拿利——一個普通工人一整年的工資。馬可故意將這個奢侈的愛的行動與猶大 30 塊銀幣的背叛並置，形成強烈的文學對比。",
    apol:"猶大的背叛是否是「命中注定」的？如果是，審判他是否公平？聖經同時肯定神的主權與人的自由意志：耶穌說「人子必要照所寫的去世」（主權），但又說「賣人子的人有禍了」（責任）。",
    apolExp:"如果這一切是「命中注定」的，那猶大有選擇嗎？一種思考方式是：就像你的父母可能預見你會犯某個錯誤，但這個「預見」並不是「導致」你犯錯的原因。知道一件事會發生，和使一件事發生，是兩回事。",
    ct:{
      scene:"你是猶大。你跟隨耶穌三年了。你親眼見過神蹟，也聽過那些改變人心的教導。但三年過去了，他似乎完全沒有奪取政權的打算。大祭司的人找到你，開出了一個價碼——",
      choices:[
        {text:"拒絕交易，繼續跟隨",result:"你把大祭司的人打發走了。但你內心的失望並沒有消失。接下來的日子，你繼續跟在耶穌身邊，帶著一個日漸沈重的問題：如果他不是我以為的那種彌賽亞，我這三年算什麼？忠誠有時候意味著帶著疑惑繼續走。",nudge:"你是否也曾對神（或對人）感到失望，卻選擇留下來？明天的「最後晚餐」會讓你看到，耶穌怎麼面對一個他知道即將背叛他的人。"},
        {text:"接受 30 塊銀幣",result:"30 塊銀幣。舊約裡一個奴隸的賠償金。你告訴自己這不是背叛，這是「逼」耶穌出手。但你心裡知道，你只是在為自己的失望找一個出口。背叛的本質，往往不是恨，而是受傷後的報復。",nudge:"猶大的故事沒有 happy ending，但背後的心理——失望、合理化、自我欺騙——離我們每個人都不遠。往下滑到護教議題，看看「命運與自由意志」的討論。"},
        {text:"直接離開，不做任何事",result:"你選擇了沉默的離開。不背叛，但也不再跟隨。只是——消失了。這是第三種選擇，也是大多數人的選擇。沒有戲劇性的決裂，只是慢慢地、安靜地，不再出現。缺席，有時候就是一種回答。",nudge:"「慢慢消失」也許是現代人最常見的信仰離開方式。你身邊有這樣的人嗎？往下滑到故事牆，歡迎你匿名分享。"},
      ],
    },
    micro:"今天，為你生命中某個「不值得」的人做一件慷慨的事——不計算回報。",
    group:"猶大的第三個選擇——「慢慢消失」——是否比直接背叛更常見？你見過這種現象嗎？",
    sermon:"在伯大尼的同一張餐桌上，愛與背叛同時在醞釀。打碎香膏的女人不計成本，猶大卻在計算價格。對耶穌的回應，最終只有兩種——不顧一切的愛，或精打細算的背離。沒有中間地帶。",
  },
  {
    day:4, weekday:"週四", name:"最後晚餐", nameEn:"Last Supper",
    color:"#6B3FA0", light:"#B48AE0", bg:"#6B3FA012",
    icon:"🍷", location:"馬可樓",
    story:"耶穌和門徒共進逾越節晚餐。他拿起餅和酒，賦予它們全新的意義：「這是我的身體...這是我的血。」一頓普通的晚餐，成為兩千年來無數信徒最神聖的記憶。",
    storyExp:"一群朋友的最後一頓晚餐。主人知道這是最後一次了，但其他人還不知道。他把一塊普通的餅遞給每個人，說了一句他們永遠不會忘記的話。",
    soulQ:"如果今晚是你與最重要的人的最後一頓飯，你想對他們說什麼？",
    scriptureKey:"馬可福音 14:12-31",
    scriptures:[
      {ref:"馬可福音 14:22-24",text:"他們吃的時候，耶穌拿起餅來，祝了福，就擘開，遞給他們，說：「你們拿著吃，這是我的身體。」又拿起杯來，祝謝了，遞給他們；他們都喝了。耶穌說：「這是我立約的血，為多人流出來的。」",hl:true},
      {ref:"哥林多前書 11:23-26",text:"我當日傳給你們的，原是從主領受的，就是主耶穌被賣的那一夜，拿起餅來，祝謝了，就擘開，說：「這是我的身體，為你們捨的，你們應當如此行，為的是記念我。」"},
      {ref:"約翰福音 13:34-35",text:"我賜給你們一條新命令，乃是叫你們彼此相愛；我怎樣愛你們，你們也要怎樣相愛。你們若有彼此相愛的心，眾人因此就認出你們是我的門徒了。"},
    ],
    study:"「這是我的身體」引發了基督教歷史上最大的神學辯論。天主教「變質說」認為餅酒實質轉變；改革宗強調「屬靈同在」；浸信會視為象徵。但所有立場都同意：聖餐是「記念」的行動。",
    apol:"「這是我的身體」是字面意思還是比喻？天主教主張「變質說」，改革宗強調「屬靈同在」，浸信會視為「象徵記念」。三個立場各有堅實的神學基礎，反映基督教內部多元而豐富的理解傳統。",
    apolExp:"一塊餅、一杯酒——這個簡單的儀式為什麼能延續兩千年，被數十億人重複？也許是因為它把一個宏大的故事壓縮進了最日常的動作裡。每次有人掰開一塊餅，那個最後的夜晚就再次被想起。",
    ct:{
      scene:"你坐在馬可樓裡。逾越節晚餐已經開始了。耶穌剛剛做了一件讓所有人都不舒服的事——他站起來，脫了外衣，拿了一條毛巾，開始逐一為門徒洗腳。現在，他走到你面前，蹲了下來——",
      choices:[
        {text:"讓他洗",result:"你不自在。你的老師跪在地上碰你帶著塵土的腳。但你讓他做了。當水流過你的腳趾，你突然理解了一件事：這個人對「權力」的定義，和你認知的完全不同。在他的國度裡，最大的那個人，做的是最小的事。",nudge:"「領導就是服務」——往下滑到深入探索，看看這段經文的完整分析。"},
        {text:"像彼得一樣拒絕",result:"「你永遠不能洗我的腳！」你說。但耶穌說：「我若不洗你，你就與我無份了。」接受別人的服事，有時候比服事別人更難。因為它要求你承認自己需要幫助。",nudge:"接受恩典為什麼比付出更難？這個問題會在週五達到頂點——當一切代價都已經被付清，你能做的只有接受。"},
        {text:"注意到猶大的表情",result:"你的眼光掠過房間，落在猶大身上。耶穌也在洗他的腳。他知道猶大即將做什麼，但他還是蹲下來，捧起了那雙即將帶領士兵來逮捕他的腳。你看到的是一種你從未見過的愛的形式：給不配得的人。",nudge:"耶穌為背叛者洗腳。這是整個聖週最安靜也最震撼的畫面。明天，你會看到那雙被洗過的腳走上十字架。"},
      ],
    },
    dinner:{
      intro:"邀請 2-6 位朋友共進一頓簡單的晚餐。不需要是正式的聖餐禮——只需要真誠的對話和分享。",
      steps:[
        {time:"開始",act:"每人帶一道菜。入座後，先安靜一分鐘，感受「在一起」本身的價值。"},
        {time:"15分鐘",act:"分享：你生命中最重要的一頓飯是什麼？為什麼？"},
        {time:"30分鐘",act:"一起讀馬可福音 14:22-25。耶穌在最後的時刻選擇了吃飯——為什麼「一起吃飯」這麼重要？"},
        {time:"45分鐘",act:"每人完成這個句子：「如果這是我最後一次和你們吃飯，我想說...」"},
        {time:"結束",act:"一起掰一塊餅（或任何主食），分給彼此。安靜中結束。"},
      ],
    },
    micro:"今晚，認真地和家人一起吃一頓飯。放下手機，看著對方的眼睛。",
    group:"聖餐/擘餅對你而言是「例行公事」還是真正的「記念」？如何讓它重新活過來？",
    sermon:"耶穌在生命最後的夜晚選擇做的事是——吃飯。不是發表宣言，不是組織抵抗，而是和朋友坐下來，掰餅，倒酒。最神聖的時刻，往往藏在最日常的行動裡。",
  },
  {
    day:5, weekday:"週五", name:"受難日", nameEn:"Good Friday",
    color:"#5C1A1A", light:"#E07070", bg:"#5C1A1A12",
    icon:"✝️", location:"客西馬尼 → 各各他", blackout:true,
    story:"從深夜的逮捕到清晨的審判，從鞭打到釘十字架。在下午三點，耶穌喊出：「我的神，我的神，為什麼離棄我？」然後，他說了最後兩個字：「成了。」",
    storyExp:"一個無辜的人被處死了。他的朋友全部逃跑了。但行刑的羅馬士兵——一個見過無數死亡的軍人——在那一刻說了一句話：「這人真是神的兒子。」",
    soulQ:"「成了」——你生命中有什麼痛苦，需要聽到這兩個字？",
    scriptureKey:"馬可福音 14:32-15:47",
    scriptures:[
      {ref:"馬可福音 15:33-34",text:"從午正到申初，遍地都黑暗了。申初的時候，耶穌大聲喊著說：「以羅伊！以羅伊！拉馬撒巴各大尼？」翻出來就是：「我的神！我的神！為什麼離棄我？」",hl:true},
      {ref:"馬可福音 15:37-39",text:"耶穌大聲喊叫，氣就斷了。殿裡的幔子從上到下裂為兩半。對面站著的百夫長看見耶穌這樣喊叫斷氣，就說：「這人真是神的兒子！」"},
      {ref:"以賽亞書 53:5",text:"哪知他為我們的過犯受害，為我們的罪孽壓傷。因他受的刑罰，我們得平安；因他受的鞭傷，我們得醫治。"},
    ],
    study:"耶穌在十字架上引用了詩篇 22:1。但詩篇 22 的結尾是得勝的宣告。耶穌不是在絕望中死去，而是在引用一首從苦難走向勝利的詩。十字架上的黑暗不是故事的結局，而是高潮前最深的低谷。",
    apol:"「昏迷假說」認為耶穌沒有真正死亡。但羅馬兵丁是受過訓練的劊子手，誤判死亡意味著他們自己會被處死。且約翰福音記載刺穿肋旁流出「血和水」——現代醫學指出這是心包積液的徵兆，是死亡的確切證據。",
    apolExp:"一個被鞭打、釘十字架、長矛刺穿肋旁的人，有可能只是「昏過去」嗎？幾乎所有歷史學家——包括不信基督教的學者——都同意：耶穌確實死在十字架上。真正的問題不是「他死了嗎」，而是「之後發生了什麼」。",
    ct:{
      scene:"你是十字架下的一個旁觀者。上午九點，釘刑開始。天空逐漸變暗。到了下午三點，那個人用盡最後的力氣喊了一句話——然後，安靜了。",
      choices:[
        {text:"留在十字架下",result:"大部分人已經散去了。你留了下來。他在被釘的時候說「父啊，赦免他們」。你見過很多死亡，但這次不一樣。你的腦海裡不斷迴盪一個問題：如果他真的是他所宣稱的那個人呢？",nudge:"連行刑的百夫長都承認了：「這人真是神的兒子。」往下滑到護教議題，看看十字架死亡的醫學與歷史證據。"},
        {text:"轉頭離開",result:"你受不了了。不是因為血腥——而是因為那種奇怪的安靜。被釘的人通常會咒罵、嘶吼。但這個人幾乎沒有。他甚至在為釘他的人禱告。你快步離開，但你知道，今晚你不會睡好。",nudge:"你離開了，但那個畫面會跟著你。有些真相就是這樣——你可以轉身，但你無法假裝沒看見。明天是沈默的週六。"},
        {text:"和那個百夫長對視",result:"你的目光和負責行刑的百夫長交會了。你在他眼中看到了震動。他低聲說了一句：「這人真是神的兒子。」一個劊子手的信仰告白。有時候，離真相最近的人，是那些被迫直視它的人。",nudge:"這個百夫長的那句話被四本福音書中的三本保留了下來。有些話只需要被說一次，就足以改變歷史。後天是復活節——故事還沒有結束。"},
      ],
    },
    micro:"今天下午 3-6 點，嘗試放下所有娛樂。在安靜中，思考「成了」對你的意義。",
    group:"耶穌在十字架上經歷了「被神離棄」的感受。你是否經歷過感覺神不在的時刻？",
    sermon:"十字架最令人震撼的不是痛苦的程度，而是「我的神，為什麼離棄我」。神的兒子經歷了與神分離的絕望——在你最黑暗的時刻，當你覺得神不在的時候，耶穌已經去過那裡了。「成了」不只是結束，更是完成。",
  },
  {
    day:6, weekday:"週六", name:"神聖安息日", nameEn:"Holy Saturday",
    color:"#555555", light:"#AAAAAA", bg:"#55555512",
    icon:"🕯️", location:"墳墓", letter:true,
    story:"福音書在這一天完全沉默。沒有記載。沒有神蹟。沒有天使的聲音。只有一座被封住的墳墓，和一群絕望的門徒。這是信仰中最被忽略、卻最真實的一天——等待的日子。",
    storyExp:"什麼都沒有發生。你等著的那個答案還沒有來。你信任的那個人已經走了。你周圍的人都在說「結束了」。而你能做的只有——等。",
    soulQ:"你現在正在經歷什麼樣的「週六」——那個答案還沒有來的等待？",
    scriptureKey:"多經文綜合",
    scriptures:[
      {ref:"馬太福音 27:62-66",text:"次日，就是預備日的第二天，祭司長和法利賽人聚集來見彼拉多，說：「大人，我們記得那誘惑人的還活著的時候曾說：『三日後我要復活。』因此，請吩咐人將墳墓把守妥當，直到第三日。」"},
      {ref:"彼得前書 3:18-19",text:"因基督也曾一次為罪受苦，就是義的代替不義的，為要引我們到神面前。按著肉體說，他被治死；按著靈性說，他復活了。他藉這靈曾去傳道給那些在監獄裡的靈聽。"},
      {ref:"詩篇 130:5-6",text:"我等候耶和華，我的心等候；我也仰望他的話。我的心等候主，勝於守夜的，等候天亮，勝於守夜的，等候天亮。",hl:true},
    ],
    study:"神聖週六是福音書的「空白頁」。使徒信經中「降在陰間」引發了長期神學討論：彼得前書 3:19 提到基督向「監獄裡的靈」傳道。核心信息是：即便在死亡中，神仍在工作——在我們看不見的地方。",
    apol:"使徒信經中「降在陰間」是什麼意思？三種主要解讀：(1) 基督進入亡者的世界宣告勝利；(2) 形容他承受了神的忿怒（加爾文）；(3) 確認他真的死了。這個教義提醒我們：基督的救贖工作，連死亡的領域都觸及了。",
    apolExp:"那天什麼都沒有發生——至少從外面看是這樣。但基督教的古老信條說了一句很有意思的話：他「降在陰間」。也許「什麼都沒發生」的時候，恰恰是最重要的事情正在發生的時候。",
    ct:{
      scene:"你是門徒之一。昨天，你親眼看見耶穌死了。今天是安息日。你躲在一間上了鎖的房間裡，和其他門徒擠在一起。空氣中瀰漫著恐懼和絕望——",
      choices:[
        {text:"試圖鼓勵其他人",result:"「他說過三天後會復活，記得嗎？」你說。房間裡沒有人回應。在這個房間裡，沒有人還相信那些話了。但你堅持把它說出來，不是因為你確定，而是因為你需要聽到這句話，哪怕是從自己嘴裡。",nudge:"在「什麼證據都沒有」的時候仍然相信——這是信心最純粹的樣子。往下滑，用「給週六自己的信」寫下你正在等待的事。"},
        {text:"獨自在角落裡沈默",result:"你什麼都不想說。不是因為憤怒，而是因為空。昨天之前，你的人生有一個清晰的方向——跟隨他。現在方向沒了。原來「失去方向」的感覺不是恐慌，而是一種很深的安靜。",nudge:"如果你也正在經歷某種「沈默」——往下滑，給「週六的自己」寫封信。"},
        {text:"想要出去，但不敢",result:"你走到門前，手放在門閂上。你在兩種恐懼之間猶豫：出去的恐懼，和留下來帶著這種絕望繼續活下去的恐懼。你最後沒有開門。有時候，不是勇氣讓我們留下來，而是我們根本不知道該往哪裡去。",nudge:"「不知道該往哪裡去」——這是大多數人在人生低谷的真實感受。好消息是：門徒也是這樣度過週六的。而週日來了。"},
      ],
    },
    micro:"今天不要試圖「填滿」安靜。讓自己經歷「不知道答案」的感覺，不要急著找出路。",
    group:"教會往往從週五直接跳到週日，忽略了週六。但大多數人的生命，活在「週六」的時間遠多於「週日」。我們如何在等待中保持信心？",
    sermon:"我們不喜歡週六。我們喜歡答案、解決方案、happy ending。但信仰的真實面貌，大部分時間看起來像週六——你知道神在，但你感覺不到。週六教我們：信心不是「知道結局」，而是「在不知道的時候繼續等待」。",
  },
  {
    day:7, weekday:"週日", name:"復活節", nameEn:"Easter Sunday",
    color:"#B08D3B", light:"#E8C86A", bg:"#B08D3B12",
    icon:"✨", location:"空墳墓",
    story:"清晨。幾位女性來到墳墓前，準備膏抹耶穌的身體。但石頭已經被移開了。墳墓是空的。一位天使說：「他不在這裡。他已經復活了。」這句話改變了一切。",
    storyExp:"天剛亮。你失去了你最重要的人。三天了。你帶著最後的禮物去到他被安葬的地方——卻發現門開了，裡面是空的。然後有人告訴你：他活著。",
    soulQ:"你生命中有什麼，你以為已經「死了」，但或許正在等待「復活」？",
    scriptureKey:"馬可福音 16 + 平行經文",
    scriptures:[
      {ref:"馬可福音 16:1-6",text:"過了安息日，抹大拉的馬利亞和雅各的母親馬利亞並撒羅米，買了香膏要去膏耶穌的身體。七日的第一日清早，出太陽的時候，她們來到墳墓那裡…那少年人對她們說：「不要驚恐！你們尋找那釘十字架的拿撒勒人耶穌，他已經復活了，不在這裡。請看安放他的地方。」",hl:true},
      {ref:"馬可福音 16:7",text:"「你們可以去告訴他的門徒和彼得，說：『他在你們以先往加利利去。在那裡你們要見他，正如他從前所告訴你們的。』」"},
      {ref:"哥林多前書 15:3-6",text:"我當日所領受又傳給你們的：第一，就是基督照聖經所說，為我們的罪死了，而且埋葬了；又照聖經所說，第三天復活了，並且顯給磯法看，然後顯給十二使徒看；後來一時顯給五百多弟兄看。"},
    ],
    study:"復活的歷史證據遠比許多人想像的強。空墳墓、門徒的轉變、保羅的歸信、雅各的歸信——這些獨立的證據線索匯聚在一起，使「復活確實發生了」成為最具解釋力的歷史假說。",
    apol:"復活有歷史證據嗎？四條獨立證據線：(1) 空墳墓——連反對者都承認；(2) 目擊者——保羅記錄了超過 500 位見證人；(3) 門徒的轉變——懦夫變殉道者；(4) 教會的誕生——在最敵對的環境中迅速擴展。",
    apolExp:"一個人從死裡復活——這聽起來像童話。但歷史學家面對的問題是：如果沒有發生，你怎麼解釋接下來的事？一群漁夫在領袖被處死後冒著生命危險宣告「他復活了」。幾乎所有人最後都被殺了——但沒有一個人改口。人不會為自己知道是謊言的東西去死。",
    ct:{
      scene:"你是抹大拉的馬利亞。天還沒亮，你帶著香料來到墳墓——這是你最後能為他做的事了。但當你走近，你發現那塊巨大的封墓石已經被移開了——",
      choices:[
        {text:"衝進墳墓裡",result:"你跑進去。墳墓是空的。但不是被盜墓的那種空——裹屍布整齊地折疊在石台上，頭巾另外捲著放在一邊。盜墓賊不會折衣服。你的手在發抖。你的大腦在拼命尋找合理的解釋，但你的心已經知道了。",nudge:"「裹屍布整齊折疊」這個細節排除了匆忙盜屍的可能性。往下滑到護教議題，看看復活的完整歷史證據。"},
        {text:"轉身跑回去告訴其他人",result:"你轉身就跑。衝進門徒躲藏的房間，上氣不接下氣：「他不在墳墓裡了！」彼得和約翰對望一眼，然後兩個人同時站起來，開始奔跑。在那個清晨，你——一個在那個時代幾乎沒有社會地位的女性——成為了人類歷史上最重要消息的第一個傳遞者。",nudge:"如果這個故事是編造的，作者絕對不會選擇女性作為第一個見證人——這反而成為真實性的有力證據。護教議題區有更多分析。"},
        {text:"在墳墓外哭泣",result:"你坐在地上哭泣。然後，有人叫你的名字。不是「女人」，不是「門徒」，而是你的名字：「馬利亞。」你認出了那個聲音。你慢慢轉過頭。他站在那裡。活著的。你能做的只有一個字：「拉波尼」——我的老師。",nudge:"復活的耶穌第一個顯現的對象，是一個在哭泣的女人。也許這就是復活最深的意義：它總是先來到最破碎的地方。你的「破碎處」是什麼？故事牆在等你分享。"},
      ],
    },
    micro:"拿出你昨天寫的信讀一遍。然後寫下：「因為復活，我相信＿＿＿還沒有結束。」",
    group:"如果復活是真的，它如何改變你面對生命中「墳墓」的方式？",
    sermon:"復活不只是「一個人從死裡復活」的神蹟故事。它是一個宣告：死亡不是最後的定論。你的失敗、你的失去、你的「週六」——都不是結局。那塊被移開的石頭在說：沒有任何墳墓可以關住神的工作。",
  },
];

// ============================================================
// TYPOGRAPHY & COLOR CONSTANTS (high contrast)
// ============================================================
const T = {
  body: "rgba(255,255,255,0.88)",       // main prose — high readability
  bodyAlt: "rgba(255,255,255,0.78)",     // secondary prose
  sub: "rgba(255,255,255,0.55)",         // timestamps, hints
  faint: "rgba(255,255,255,0.35)",       // very subtle
  scripture: "rgba(255,255,255,0.92)",   // scripture text — near white
  scriptureAlt: "rgba(255,255,255,0.80)",
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [view, setView] = useState("onboard");
  const [persona, setPersona] = useState(null);
  const [selDay, setSelDay] = useState(null);
  const [done, setDone] = useState([]);
  const [walls, setWalls] = useState({});
  const [letter, setLetter] = useState("");
  const [sealed, setSealed] = useState(false);
  const [choices, setChoices] = useState({});
  const [share, setShare] = useState(null);
  const [xStudy, setXStudy] = useState(false);
  const [xDinner, setXDinner] = useState(false);
  const [xGroup, setXGroup] = useState(false);
  const [timer, setTimer] = useState(0);
  const [ticking, setTicking] = useState(false);
  const [blackout, setBlackout] = useState(false);
  const [wallIn, setWallIn] = useState("");
  const [xApol, setXApol] = useState(false);
  const [xScr, setXScr] = useState(true);
  const [postEaster, setPostEaster] = useState(false);
  const cvs = useRef(null);

  const todayIdx = () => {
    const diff = Math.floor((new Date() - new Date(2026,2,29)) / 864e5);
    return diff >= 0 && diff <= 7 ? diff : null;
  };

  useEffect(() => {
    if (selDay === 5) { const h = new Date().getHours(); if (h >= 15 && h < 18) setBlackout(true); }
  }, [selDay]);

  useEffect(() => {
    if (!ticking || timer <= 0) return;
    const id = setInterval(() => setTimer(t => { if (t <= 1) { setTicking(false); return 0; } return t - 1; }), 1000);
    return () => clearInterval(id);
  }, [ticking, timer]);

  const reset = () => { setView("onboard"); setPersona(null); setSelDay(null); setDone([]); setChoices({}); setWalls({}); setLetter(""); setSealed(false); setXStudy(false); setXApol(false); setXDinner(false); setXGroup(false); setWallIn(""); setXScr(true); };
  const openDay = i => { setSelDay(i); setView("day"); setXStudy(false); setXApol(false); setXDinner(false); setXGroup(false); setXScr(true); };

  const mkShare = useCallback((d, type) => {
    const c = cvs.current; if (!c) return;
    const x = c.getContext("2d"); c.width = 1080; c.height = 1080;
    const g = x.createLinearGradient(0,0,1080,1080); g.addColorStop(0,d.color); g.addColorStop(1,"#1a1525");
    x.fillStyle = g; x.fillRect(0,0,1080,1080);
    x.fillStyle = "rgba(255,255,255,0.04)";
    for (let i=0;i<15;i++){x.beginPath();x.arc(Math.random()*1080,Math.random()*1080,Math.random()*80+30,0,Math.PI*2);x.fill();}
    x.fillStyle = "rgba(255,255,255,0.95)"; x.font = "bold 36px serif"; x.textAlign = "center";
    x.fillText(`${d.weekday} · ${d.name}`, 540, 200);
    x.font = "24px sans-serif"; x.fillStyle = "rgba(255,255,255,0.6)"; x.fillText(d.nameEn, 540, 250);
    const txt = type==="soul"?d.soulQ:type==="scripture"?d.scriptureKey:(d.apol||"").substring(0,60)+"...";
    x.fillStyle = "rgba(255,255,255,0.95)"; x.font = "italic 42px serif";
    let ln="",y=460; for(const ch of txt){const t=ln+ch;if(x.measureText(t).width>800){x.fillText(ln,540,y);ln=ch;y+=56;}else ln=t;} x.fillText(ln,540,y);
    x.fillStyle = "rgba(255,255,255,0.4)"; x.font = "22px sans-serif"; x.fillText("聖週體驗 · iM行動教會",540,980);
    setShare(c.toDataURL());
  }, []);

  // ==================== BLACKOUT ====================
  if (blackout) return (
    <div style={{position:"fixed",inset:0,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",cursor:"pointer",zIndex:9999}} onClick={()=>setBlackout(false)}>
      <div style={{fontSize:"72px",color:"#fff",fontFamily:"serif",letterSpacing:"24px"}}>成了</div>
      <div style={{fontSize:"24px",color:"rgba(255,255,255,0.4)",fontFamily:"serif",marginTop:"24px",letterSpacing:"8px"}}>It is finished.</div>
      <div style={{position:"absolute",bottom:40,color:"rgba(255,255,255,0.2)",fontSize:"14px",fontFamily:"sans-serif"}}>輕觸任意處繼續</div>
    </div>
  );

  // ==================== SHARE ====================
  if (share) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",zIndex:9999,padding:"20px"}}>
      <img src={share} alt="" style={{maxWidth:"360px",width:"100%",borderRadius:"12px",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}/>
      <div style={{display:"flex",gap:"12px",marginTop:"24px"}}>
        <button onClick={()=>{const a=document.createElement("a");a.href=share;a.download="holy-week-card.png";a.click()}} style={{...btn,background:"#fff",color:"#222"}}>下載圖片</button>
        <button onClick={()=>setShare(null)} style={{...btn,background:"transparent",color:"#fff",border:"1px solid rgba(255,255,255,0.4)"}}>返回</button>
      </div>
    </div>
  );

  // ==================== ONBOARD ====================
  if (view === "onboard") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#12101c 0%,#1e1530 40%,#141820 100%)",color:"#fff",fontFamily:"'Georgia',serif"}}>
      <div style={{maxWidth:"600px",margin:"0 auto",padding:"60px 24px"}}>
        <div style={{textAlign:"center",marginBottom:"48px"}}>
          <div style={{fontSize:"13px",letterSpacing:"6px",color:T.sub,marginBottom:"16px",fontFamily:"sans-serif"}}>iM行動教會 · WECHURCH</div>
          <h1 style={{fontSize:"42px",fontWeight:300,lineHeight:1.3,margin:"0 0 12px",color:"#fff"}}>聖週體驗</h1>
          <div style={{fontSize:"16px",color:T.sub,letterSpacing:"3px",fontFamily:"sans-serif"}}>HOLY WEEK EXPERIENCE</div>
          <div style={{width:"60px",height:"2px",background:"linear-gradient(90deg,#D4AF37,#E8C86A)",margin:"32px auto",borderRadius:"1px"}}/>
          <p style={{fontSize:"18px",color:T.bodyAlt,lineHeight:1.8,maxWidth:"440px",margin:"0 auto"}}>從棕枝主日到復活節，<br/>走過耶穌生命最後一週的旅程。</p>
        </div>
        <p style={{fontSize:"14px",color:T.sub,textAlign:"center",marginBottom:"24px",fontFamily:"sans-serif"}}>選擇最符合你的身份</p>
        {[
          {id:"explorer",icon:"🌍",t:"好奇者",en:"Explorer",d:"我對信仰感到好奇，想透過故事了解這一週發生了什麼",f:"故事化敘事 · 零術語 · 沉浸體驗"},
          {id:"disciple",icon:"📖",t:"追隨者",en:"Disciple",d:"我已經是基督徒，想要更深入地經歷聖週",f:"經文連結 · 深度查經 · 靈修反思"},
          {id:"leader",icon:"🔥",t:"帶領者",en:"Leader",d:"我是小組長或傳道人，需要帶領他人經歷聖週",f:"完整查經 · 討論引導 · 講台素材"},
        ].map(p=>(
          <button key={p.id} onClick={()=>{setPersona(p.id);setView("journey")}} style={{display:"block",width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"16px",padding:"24px",marginBottom:"12px",cursor:"pointer",textAlign:"left",transition:"all 0.3s",color:"#fff"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.09)";e.currentTarget.style.borderColor="rgba(212,175,55,0.5)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
              <span style={{fontSize:"32px"}}>{p.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:"20px",fontWeight:600,marginBottom:"2px",color:"#fff"}}>{p.t}<span style={{fontSize:"14px",color:T.sub,marginLeft:"8px",fontFamily:"sans-serif"}}>{p.en}</span></div>
                <div style={{fontSize:"14px",color:T.bodyAlt,lineHeight:1.6,fontFamily:"sans-serif"}}>{p.d}</div>
                <div style={{fontSize:"12px",color:"#D4AF37",marginTop:"6px",fontFamily:"sans-serif",opacity:0.8}}>{p.f}</div>
              </div>
              <span style={{color:T.faint,fontSize:"20px"}}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // ==================== JOURNEY MAP ====================
  if (view === "journey") {
    const ti = todayIdx();
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#0e0e18 0%,#161220 100%)",color:"#fff",fontFamily:"'Georgia',serif"}}>
        <div style={{padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div>
            <div style={{fontSize:"12px",color:T.sub,fontFamily:"sans-serif",letterSpacing:"2px"}}>聖週體驗</div>
            <div style={{fontSize:"14px",color:"#E8C86A",fontFamily:"sans-serif"}}>{persona==="explorer"?"🌍 好奇者":persona==="disciple"?"📖 追隨者":"🔥 帶領者"}</div>
          </div>
          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            <span style={{fontSize:"12px",color:T.sub,fontFamily:"sans-serif"}}>{done.length}/8</span>
            <button onClick={()=>setPostEaster(true)} style={sm}>旅程回顧</button>
            <button onClick={reset} style={sm}>切換身份</button>
          </div>
        </div>
        <div style={{padding:"0 24px",marginTop:"12px"}}>
          <div style={{display:"flex",gap:"4px"}}>{D.map((d,i)=><div key={i} style={{flex:1,height:"3px",borderRadius:"2px",background:done.includes(i)?d.light:"rgba(255,255,255,0.1)",transition:"background 0.5s"}}/>)}</div>
        </div>
        {ti!==null&&<div style={{margin:"20px 24px 0",padding:"20px",background:D[ti].bg,border:`1px solid ${D[ti].light}30`,borderRadius:"16px",cursor:"pointer"}} onClick={()=>openDay(ti)}>
          <div style={{fontSize:"12px",color:D[ti].light,fontFamily:"sans-serif",letterSpacing:"2px",marginBottom:"8px"}}>今日旅程 · TODAY</div>
          <div style={{fontSize:"28px",marginBottom:"4px",color:"#fff"}}>{D[ti].icon} {D[ti].name}</div>
          <div style={{fontSize:"14px",color:T.sub,fontFamily:"sans-serif"}}>{D[ti].location}</div>
        </div>}
        <div style={{padding:"24px"}}>
          <div style={{fontSize:"13px",color:T.faint,fontFamily:"sans-serif",letterSpacing:"2px",marginBottom:"16px"}}>旅程地圖 · JOURNEY MAP</div>
          {D.map((d,i)=>(
            <button key={i} onClick={()=>openDay(i)} style={{display:"flex",width:"100%",alignItems:"center",gap:"16px",padding:"16px",marginBottom:"8px",background:ti===i?d.bg:"rgba(255,255,255,0.02)",border:`1px solid ${ti===i?d.light+"30":"rgba(255,255,255,0.06)"}`,borderRadius:"12px",cursor:"pointer",transition:"all 0.3s",color:"#fff",textAlign:"left"}}
              onMouseEnter={e=>{e.currentTarget.style.background=d.bg;e.currentTarget.style.transform="translateX(4px)"}}
              onMouseLeave={e=>{e.currentTarget.style.background=ti===i?d.bg:"rgba(255,255,255,0.02)";e.currentTarget.style.transform="none"}}>
              <div style={{width:"44px",height:"44px",borderRadius:"12px",background:done.includes(i)?d.color:"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0,color:done.includes(i)?"#fff":"inherit"}}>{done.includes(i)?"✓":d.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:"11px",color:T.sub,fontFamily:"sans-serif"}}>{d.weekday} · {d.nameEn}</div>
                <div style={{fontSize:"18px",fontWeight:500,color:"#fff"}}>{d.name}</div>
                <div style={{fontSize:"12px",color:T.sub,fontFamily:"sans-serif",marginTop:"2px"}}>{d.location}</div>
              </div>
              <span style={{color:T.faint,fontSize:"18px",flexShrink:0}}>→</span>
            </button>
          ))}
        </div>
        {postEaster&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:9000,overflow:"auto",padding:"40px 24px"}}>
          <div style={{maxWidth:"540px",margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px"}}>
              <h2 style={{fontSize:"28px",margin:0,fontWeight:300,color:"#fff"}}>✨ 旅程回顧</h2>
              <button onClick={()=>setPostEaster(false)} style={{...sm,fontSize:"18px",width:"36px",height:"36px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>✕</button>
            </div>
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:"16px",padding:"24px",marginBottom:"16px"}}>
              <div style={{fontSize:"48px",textAlign:"center",marginBottom:"8px",color:"#fff"}}>{done.length}/8</div>
              <div style={{textAlign:"center",fontSize:"14px",color:T.sub,fontFamily:"sans-serif"}}>完成天數</div>
            </div>
            {Object.keys(choices).length>0&&<div style={{background:"rgba(255,255,255,0.05)",borderRadius:"16px",padding:"24px",marginBottom:"16px"}}>
              <div style={{fontSize:"16px",marginBottom:"12px",color:"#E8C86A"}}>你的選擇</div>
              {Object.entries(choices).map(([di,ch])=><div key={di} style={{padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:"12px",color:D[di].light,fontFamily:"sans-serif",marginBottom:"4px"}}>{D[di].name}</div>
                <div style={{fontSize:"14px",fontFamily:"sans-serif",color:T.body}}>「{ch}」</div>
              </div>)}
            </div>}
            {sealed&&letter&&<div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.3)",borderRadius:"16px",padding:"24px",marginBottom:"16px"}}>
              <div style={{fontSize:"16px",marginBottom:"12px",color:"#E8C86A"}}>📬 給週六自己的信</div>
              <div style={{fontSize:"15px",color:T.body,lineHeight:1.8,fontFamily:"sans-serif",whiteSpace:"pre-wrap"}}>{letter}</div>
            </div>}
            <div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:"14px",color:T.sub,fontFamily:"sans-serif"}}>因為復活，故事還沒有結束。</div></div>
          </div>
        </div>}
      </div>
    );
  }

  // ==================== DAY DETAIL ====================
  if (view === "day" && selDay !== null) {
    const d = D[selDay];
    const isE = persona === "explorer";
    const isL = persona === "leader";

    return (
      <div style={{minHeight:"100vh",background:`linear-gradient(180deg,${d.bg} 0%,#0e0e18 25%)`,color:"#fff",fontFamily:"'Georgia',serif"}}>
        {/* HERO */}
        <div style={{padding:"20px 24px 40px"}}>
          <button onClick={()=>setView("journey")} style={{...sm,marginBottom:"20px"}}>← 返回旅程</button>
          <div style={{fontSize:"12px",color:d.light,fontFamily:"sans-serif",letterSpacing:"3px",marginBottom:"8px"}}>{d.weekday} · {d.nameEn}</div>
          <div style={{fontSize:"48px",marginBottom:"4px"}}>{d.icon}</div>
          <h1 style={{fontSize:"36px",fontWeight:300,margin:"8px 0",lineHeight:1.2,color:"#fff"}}>{d.name}</h1>
          <div style={{fontSize:"14px",color:T.sub,fontFamily:"sans-serif"}}>📍 {d.location}</div>
          {d.scriptureKey&&<div style={{fontSize:"13px",color:d.light,fontFamily:"sans-serif",marginTop:"8px"}}>📖 {d.scriptureKey}</div>}
        </div>

        <div style={{maxWidth:"640px",margin:"0 auto",padding:"0 24px 80px"}}>

          {/* 1. STORY */}
          <Sec t="今日故事" c={d.light}><p style={prose}>{isE?d.storyExp:d.story}</p></Sec>

          {/* 1.5. SCRIPTURE */}
          <Sec t="今日經文" c={d.light}>
            <button onClick={()=>setXScr(!xScr)} style={{...xBtn(d.light),marginBottom:xScr?"16px":0}}>{xScr?"收起經文 ↑":"展開今日經文 📖"}</button>
            {xScr&&d.scriptures.map((s,i)=>(
              <div key={i} style={{padding:"16px 20px",marginBottom:"8px",background:s.hl?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.03)",borderRadius:"12px",borderLeft:`3px solid ${s.hl?d.light:d.light+"50"}`}}>
                <div style={{fontSize:"12px",color:d.light,fontFamily:"sans-serif",marginBottom:"8px",fontWeight:600,letterSpacing:"1px"}}>{s.ref}</div>
                <p style={{margin:0,fontSize:s.hl?"16px":"15px",color:s.hl?T.scripture:T.scriptureAlt,lineHeight:1.9}}>{s.text}</p>
              </div>
            ))}
          </Sec>

          {/* 2. CHOICE THEATER */}
          <Sec t="選擇劇場" c={d.light}>
            <p style={{...prose,fontStyle:"italic",color:T.bodyAlt}}>{d.ct.scene}</p>
            {choices[selDay]?(<div style={{marginTop:"12px"}}>
              <div style={{padding:"20px",background:"rgba(255,255,255,0.05)",borderRadius:"12px",borderLeft:`3px solid ${d.light}`}}>
                <div style={{fontSize:"13px",color:d.light,fontFamily:"sans-serif",marginBottom:"10px",fontWeight:600}}>你的選擇：{choices[selDay]}</div>
                <p style={{...prose,margin:"0 0 16px"}}>{d.ct.choices.find(c=>c.text===choices[selDay])?.result}</p>
                <div style={{padding:"14px 16px",background:"rgba(255,255,255,0.04)",borderRadius:"8px",border:`1px solid ${d.light}20`}}>
                  <p style={{margin:0,fontSize:"14px",color:T.bodyAlt,lineHeight:1.7,fontFamily:"sans-serif"}}>💡 {d.ct.choices.find(c=>c.text===choices[selDay])?.nudge}</p>
                </div>
              </div>
            </div>):(
              <div style={{display:"flex",flexDirection:"column",gap:"8px",marginTop:"16px"}}>{d.ct.choices.map((c,i)=>(
                <button key={i} onClick={()=>setChoices({...choices,[selDay]:c.text})} style={{padding:"16px 20px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",color:"#fff",fontSize:"15px",cursor:"pointer",textAlign:"left",fontFamily:"'Georgia',serif",transition:"all 0.3s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.09)";e.currentTarget.style.borderColor=d.light+"60"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}}>{c.text}</button>
              ))}</div>
            )}
          </Sec>

          {/* 3. APOLOGETICS */}
          <Sec t={isE?"這個故事是真的嗎？":"護教議題"} c={d.light}>
            <button onClick={()=>setXApol(!xApol)} style={{...xBtn(d.light),marginBottom:xApol?"16px":0}}>{xApol?"收起 ↑":isE?"歷史上真的發生過這件事嗎？ 🤔":"歷史與神學議題探討 🔍"}</button>
            {xApol&&<div style={{padding:"20px",background:"rgba(255,255,255,0.04)",borderRadius:"12px",borderLeft:`3px solid ${d.light}50`}}><p style={{...prose,margin:0,fontSize:"15px"}}>{isE?d.apolExp:d.apol}</p></div>}
          </Sec>

          {/* 4. STUDY GUIDE */}
          {(persona==="disciple"||isL)&&<Sec t="深入探索 · 四聲道查經" c={d.light}>
            <button onClick={()=>setXStudy(!xStudy)} style={{...xBtn(d.light),marginBottom:xStudy?"16px":0}}>{xStudy?"收起查經內容 ↑":"展開深度查經 📖"}</button>
            {xStudy&&<div>
              <div style={{padding:"20px",background:"rgba(255,255,255,0.04)",borderRadius:"12px",marginBottom:"12px",borderLeft:`3px solid ${d.light}50`}}>
                <div style={{fontSize:"12px",color:d.light,fontFamily:"sans-serif",letterSpacing:"2px",marginBottom:"10px"}}>經文分析</div>
                <p style={{...prose,margin:0,fontSize:"15px"}}>{d.study}</p>
              </div>
              <div style={{padding:"20px",background:"rgba(255,255,255,0.04)",borderRadius:"12px",borderLeft:`3px solid ${d.light}50`}}>
                <div style={{fontSize:"12px",color:d.light,fontFamily:"sans-serif",letterSpacing:"2px",marginBottom:"10px"}}>三分鐘講台版</div>
                <p style={{...prose,margin:0,fontSize:"15px"}}>{d.sermon}</p>
              </div>
            </div>}
          </Sec>}

          {/* DINNER */}
          {d.dinner&&<Sec t="最後晚餐共食指南" c={d.light}>
            <button onClick={()=>setXDinner(!xDinner)} style={{...xBtn(d.light),marginBottom:xDinner?"16px":0}}>{xDinner?"收起指南 ↑":"展開共食指南 🍷"}</button>
            {xDinner&&<div style={{padding:"20px",background:"rgba(255,255,255,0.04)",borderRadius:"12px",borderLeft:`3px solid ${d.light}50`}}>
              <p style={{...prose,color:T.bodyAlt,fontSize:"14px"}}>{d.dinner.intro}</p>
              {d.dinner.steps.map((s,i)=><div key={i} style={{display:"flex",gap:"12px",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{minWidth:"70px",fontSize:"13px",color:d.light,fontFamily:"sans-serif",fontWeight:600}}>{s.time}</div>
                <div style={{fontSize:"14px",color:T.body,fontFamily:"sans-serif",lineHeight:1.6}}>{s.act}</div>
              </div>)}
            </div>}
          </Sec>}

          {/* LETTER */}
          {d.letter&&<Sec t="給週六的自己寫封信" c={d.light}>
            {sealed?<div style={{textAlign:"center",padding:"32px",background:"rgba(255,255,255,0.04)",borderRadius:"16px"}}>
              <div style={{fontSize:"48px",marginBottom:"12px"}}>📬</div>
              <p style={{fontSize:"16px",color:T.bodyAlt,fontFamily:"sans-serif"}}>信已密封。復活節那天再來開啟。</p>
              <button onClick={()=>setSealed(false)} style={{...sm,marginTop:"12px",color:d.light}}>提前開啟</button>
            </div>:<>
              <p style={{...prose,color:T.sub,fontSize:"14px"}}>寫下你正在等待的事。這封信將在復活節揭曉。</p>
              <textarea value={letter} onChange={e=>setLetter(e.target.value)} placeholder="親愛的自己，我正在等待..." style={{...inp,minHeight:"120px",resize:"vertical"}}/>
              <button onClick={()=>{if(letter.trim())setSealed(true)}} style={{...btn,background:d.color,marginTop:"8px",color:"#fff"}} disabled={!letter.trim()}>密封這封信 📬</button>
            </>}
          </Sec>}

          {/* LEADER */}
          {isL&&<Sec t="小組帶領工具" c={d.light}>
            <button onClick={()=>setXGroup(!xGroup)} style={{...xBtn(d.light),marginBottom:xGroup?"16px":0}}>{xGroup?"收起工具 ↑":"展開小組工具 🔥"}</button>
            {xGroup&&<div>
              <div style={{padding:"20px",background:"rgba(255,255,255,0.04)",borderRadius:"12px",marginBottom:"12px",textAlign:"center"}}>
                <div style={{fontSize:"12px",color:T.sub,fontFamily:"sans-serif",marginBottom:"8px"}}>討論計時器</div>
                <div style={{fontSize:"48px",fontFamily:"monospace",color:timer<=10&&ticking?"#f87171":"#fff",margin:"8px 0"}}>{String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}</div>
                <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}}>{[3,5,10].map(m=><button key={m} onClick={()=>{setTimer(m*60);setTicking(false)}} style={{...sm,color:d.light}}>{m}分鐘</button>)}<button onClick={()=>setTicking(!ticking)} style={{...sm,background:ticking?"rgba(248,113,113,0.15)":"rgba(255,255,255,0.08)",color:ticking?"#f87171":d.light}}>{ticking?"暫停":"開始"}</button></div>
              </div>
              <div style={{padding:"20px",background:"rgba(255,255,255,0.04)",borderRadius:"12px",marginBottom:"12px",borderLeft:`3px solid ${d.light}50`}}>
                <div style={{fontSize:"12px",color:d.light,fontFamily:"sans-serif",letterSpacing:"2px",marginBottom:"10px"}}>小組討論題</div>
                <p style={{...prose,margin:0,fontStyle:"italic",fontSize:"17px"}}>「{d.group}」</p>
              </div>
              <div style={{padding:"16px 20px",background:"rgba(255,255,255,0.04)",borderRadius:"12px",borderLeft:`3px solid ${d.light}`}}>
                <div style={{fontSize:"12px",color:d.light,fontFamily:"sans-serif",letterSpacing:"2px",marginBottom:"8px"}}>帶領提示</div>
                <p style={{...prose,margin:0,fontSize:"13px",color:T.bodyAlt}}>先讓組員回應靈魂問題（3 分鐘安靜思考），再進入選擇劇場做破冰。接著開放討論題，鼓勵分享經歷而非「正確答案」。最後以微行動收尾。</p>
              </div>
            </div>}
          </Sec>}

          {/* 5. SOUL Q + MICRO */}
          <Sec t="靈魂問題" c={d.light}>
            <div style={{padding:"24px",background:"rgba(255,255,255,0.04)",border:`1px solid ${d.light}25`,borderRadius:"16px",textAlign:"center"}}>
              <p style={{fontSize:"20px",fontStyle:"italic",lineHeight:1.8,margin:0,color:T.scripture}}>「{d.soulQ}」</p>
            </div>
          </Sec>
          <Sec t="今日微行動" c={d.light}>
            <div style={{padding:"16px 20px",background:"rgba(255,255,255,0.04)",borderRadius:"12px",display:"flex",gap:"12px",alignItems:"flex-start"}}>
              <span style={{fontSize:"20px",flexShrink:0}}>⚡</span>
              <p style={{margin:0,fontSize:"15px",color:T.body,lineHeight:1.7,fontFamily:"sans-serif"}}>{d.micro}</p>
            </div>
          </Sec>

          {/* 6. STORY WALL */}
          <Sec t="匿名故事牆" c={d.light}>
            <p style={{fontSize:"13px",color:T.sub,fontFamily:"sans-serif",marginBottom:"12px"}}>回應今天的靈魂問題，或分享你的感受。所有回應都是匿名的。</p>
            <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
              <input value={wallIn} onChange={e=>setWallIn(e.target.value)} placeholder="寫下你的回應..." style={inp} onKeyDown={e=>{if(e.key==="Enter"&&wallIn.trim()){const ex=walls[selDay]||[];setWalls({...walls,[selDay]:[...ex,{t:wallIn.trim(),ts:new Date().toLocaleString()}]});setWallIn("")}}}/>
              <button onClick={()=>{if(wallIn.trim()){const ex=walls[selDay]||[];setWalls({...walls,[selDay]:[...ex,{t:wallIn.trim(),ts:new Date().toLocaleString()}]});setWallIn("")}}} style={{...btn,background:d.color,color:"#fff",flexShrink:0,padding:"10px 20px"}}>發送</button>
            </div>
            {(walls[selDay]||[]).map((en,i)=><div key={i} style={{padding:"12px 16px",background:"rgba(255,255,255,0.03)",borderRadius:"10px",marginBottom:"6px",borderLeft:`3px solid ${d.light}40`}}>
              <p style={{margin:0,fontSize:"14px",color:T.body,fontFamily:"sans-serif",lineHeight:1.6}}>{en.t}</p>
              <div style={{fontSize:"11px",color:T.faint,marginTop:"4px",fontFamily:"sans-serif"}}>匿名 · {en.ts}</div>
            </div>)}
            {(!walls[selDay]||walls[selDay].length===0)&&<div style={{textAlign:"center",padding:"20px",color:T.faint,fontSize:"14px",fontFamily:"sans-serif"}}>成為第一個分享的人</div>}
          </Sec>

          {/* EXPLORER CTA */}
          {isE&&<Sec t="" c={d.light}><div style={{textAlign:"center",padding:"24px",background:"rgba(255,255,255,0.03)",borderRadius:"16px",border:"1px solid rgba(255,255,255,0.08)"}}>
            <p style={{fontSize:"16px",color:T.bodyAlt,marginBottom:"16px",fontFamily:"sans-serif"}}>想更深入了解這個故事？</p>
            <button onClick={()=>{setPersona("disciple");setXStudy(true);window.scrollTo({top:0,behavior:"smooth"})}} style={{...btn,background:"rgba(255,255,255,0.08)",color:"#fff",border:`1px solid ${d.light}50`,marginBottom:"8px"}}>切換到追隨者視角，解鎖深度查經 📖</button>
            <p style={{fontSize:"12px",color:T.sub,margin:"12px 0 0",fontFamily:"sans-serif"}}>或聯繫 iM行動教會，和真人聊聊 →</p>
          </div></Sec>}

          {/* BOTTOM */}
          <div style={{textAlign:"center",padding:"32px 0",borderTop:"1px solid rgba(255,255,255,0.08)",marginTop:"20px"}}>
            <p style={{fontSize:"13px",color:T.sub,fontFamily:"sans-serif",marginBottom:"16px"}}>{selDay<7?`明天的旅程：${D[selDay+1].icon} ${D[selDay+1].name}`:"✨ 旅程完成"}</p>
            <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>mkShare(d,"soul")} style={{...btn,background:"transparent",border:"1px solid rgba(255,255,255,0.18)",color:T.bodyAlt,fontSize:"13px"}}>分享靈魂問題</button>
              <button onClick={()=>mkShare(d,"scripture")} style={{...btn,background:"transparent",border:"1px solid rgba(255,255,255,0.18)",color:T.bodyAlt,fontSize:"13px"}}>分享經文卡片</button>
              <button onClick={()=>{if(!done.includes(selDay))setDone([...done,selDay]);setView("journey")}} style={{...btn,background:d.color,color:"#fff"}}>完成今日旅程 ✓</button>
            </div>
          </div>
        </div>
        <canvas ref={cvs} style={{display:"none"}}/>
      </div>
    );
  }
  return null;
}

// ============================================================
// COMPONENTS & STYLES
// ============================================================
function Sec({t,c,children}){return <div style={{marginBottom:"28px"}}>{t&&<div style={{fontSize:"13px",color:c||"rgba(255,255,255,0.55)",fontFamily:"sans-serif",letterSpacing:"2px",marginBottom:"12px",textTransform:"uppercase"}}>{t}</div>}{children}</div>}

const prose = { fontSize:"16px", color:"rgba(255,255,255,0.88)", lineHeight:1.9, margin:"0 0 12px" };
const btn = { padding:"12px 24px", borderRadius:"10px", border:"none", fontSize:"15px", cursor:"pointer", fontFamily:"sans-serif", transition:"all 0.3s", display:"inline-block" };
const sm = { padding:"6px 12px", borderRadius:"6px", border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:"12px", cursor:"pointer", fontFamily:"sans-serif", transition:"all 0.2s" };
const inp = { width:"100%", padding:"12px 16px", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.06)", color:"#fff", fontSize:"14px", fontFamily:"sans-serif", outline:"none", boxSizing:"border-box" };
const xBtn = (c) => ({ padding:"12px 24px", borderRadius:"10px", border:`1px solid ${c}40`, background:"rgba(255,255,255,0.04)", color:c, fontSize:"15px", cursor:"pointer", fontFamily:"sans-serif", transition:"all 0.3s", width:"100%", display:"block", textAlign:"center" });
