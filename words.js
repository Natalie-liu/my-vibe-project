// Default high-frequency SAT vocabulary database with Chinese translations
const DEFAULT_WORDS = [
  {
    word: "abate",
    pos: "verb",
    definition: "To become less active, less intense, or less in amount.",
    chinese: "减少，减轻，缓和",
    synonyms: ["decrease", "subside", "decline", "dwindle"],
    example: "As the hurricane moved inland, the rain and wind began to abate."
  },
  {
    word: "aberration",
    pos: "noun",
    definition: "A departure from what is normal, usual, or expected, typically one that is unwelcome.",
    chinese: "偏差，反常，异常",
    synonyms: ["anomaly", "deviation", "irregularity", "eccentricity"],
    example: "The sudden drop in temperature was a weather aberration for this time of year."
  },
  {
    word: "abstain",
    pos: "verb",
    definition: "To restrain oneself from doing or enjoying something.",
    chinese: "戒除，弃权，避开",
    synonyms: ["refrain", "desist", "forbear", "avoid"],
    example: "She chose to abstain from eating sweets while preparing for the marathon."
  },
  {
    word: "adversity",
    pos: "noun",
    definition: "A state of misfortune, hardship, or difficulty.",
    chinese: "逆境，不幸，灾难",
    synonyms: ["hardship", "misfortune", "tribulation", "distress"],
    example: "She showed incredible resilience and grace in the face of severe adversity."
  },
  {
    word: "aesthetic",
    pos: "adjective",
    definition: "Concerned with beauty or the appreciation of beauty.",
    chinese: "美学的，审美的",
    synonyms: ["artistic", "visual", "appealing", "tasteful"],
    example: "The minimalist design of the website was highly praised for its clean aesthetic."
  },
  {
    word: "amicable",
    pos: "adjective",
    definition: "Characterized by friendship and goodwill; friendly.",
    chinese: "友好的，和睦的",
    synonyms: ["friendly", "cordial", "harmonious", "peaceable"],
    example: "Despite their differences, the business partners reached an amicable agreement."
  },
  {
    word: "anachronistic",
    pos: "adjective",
    definition: "Belonging or appropriate to a period other than that in which it exists, especially a thing that is old-fashioned.",
    chinese: "时代错误的，过时的",
    synonyms: ["outdated", "archaic", "obsolete", "chronological error"],
    example: "The use of a typewriter in a modern, paperless office felt highly anachronistic."
  },
  {
    word: "arid",
    pos: "adjective",
    definition: "Having little or no rain; too dry or barren to support vegetation.",
    chinese: "干旱的，贫瘠的，枯燥的",
    synonyms: ["dry", "parched", "sterile", "barren"],
    example: "The Sahara desert is one of the most arid regions on Earth."
  },
  {
    word: "benevolent",
    pos: "adjective",
    definition: "Well-meaning and kindly; serving a charitable rather than a profit-making purpose.",
    chinese: "仁慈的，慈善的，好意的",
    synonyms: ["kind", "generous", "altruistic", "philanthropic"],
    example: "A benevolent donor provided the funds needed to build the new library wing."
  },
  {
    word: "boisterous",
    pos: "adjective",
    definition: "Noisy, energetic, and cheerful; rowdy.",
    chinese: "喧闹的，狂暴的，精力旺盛的",
    synonyms: ["rowdy", "clamorous", "exuberant", "unruly"],
    example: "The boisterous crowd cheered loudly when the home team scored the winning goal."
  },
  {
    word: "brazen",
    pos: "adjective",
    definition: "Bold and without shame; audacious.",
    chinese: "厚颜无耻的，傲慢的",
    synonyms: ["audacious", "shameless", "insolent", "bold"],
    example: "The thief made a brazen attempt to steal the painting in broad daylight."
  },
  {
    word: "capricious",
    pos: "adjective",
    definition: "Given to sudden and unaccountable changes of mood or behavior.",
    chinese: "变化莫测的，任性的，反常的",
    synonyms: ["fickle", "erratic", "unpredictable", "volatile"],
    example: "The administration's capricious policies made it difficult for local businesses to plan."
  },
  {
    word: "collaborate",
    pos: "verb",
    definition: "To work jointly on an activity or project, especially to produce or create something.",
    chinese: "合作，勾结",
    synonyms: ["cooperate", "unite", "team up", "conspire"],
    example: "Artists and engineers collaborated to create the interactive museum exhibit."
  },
  {
    word: "compromise",
    pos: "verb",
    definition: "To settle a dispute by mutual concession, or to accept standards that are lower than desirable.",
    chinese: "妥协，折中，危害",
    synonyms: ["agreement", "concession", "negotiate", "jeopardize"],
    example: "To maintain peace, they had to compromise on several terms of the contract."
  },
  {
    word: "condescending",
    pos: "adjective",
    definition: "Showing or implying a patronizing superiority.",
    chinese: "屈尊的，居高临下的",
    synonyms: ["patronizing", "snobbish", "arrogant", "supercilious"],
    example: "His condescending tone during the meeting alienated his colleagues."
  },
  {
    word: "conditional",
    pos: "adjective",
    definition: "Subject to one or more conditions or requirements being met; made or granted on certain terms.",
    chinese: "有条件的，暂定的",
    synonyms: ["contingent", "dependent", "provisional", "qualified"],
    example: "The job offer was conditional on his passing the final security clearance."
  },
  {
    word: "conformist",
    pos: "noun",
    definition: "A person who conforms to accepted behavior or established practices.",
    chinese: "遵从者，墨守成规者",
    synonyms: ["traditionalist", "follower", "conventionalist"],
    example: "Refusing to follow standard fashion trends, she was far from a conformist."
  },
  {
    word: "conundrum",
    pos: "noun",
    definition: "A confusing and difficult problem or question.",
    chinese: "谜语，难题",
    synonyms: ["puzzle", "riddle", "dilemma", "enigma"],
    example: "How to reduce carbon emissions while maintaining economic growth is a global conundrum."
  },
  {
    word: "convergence",
    pos: "noun",
    definition: "The process of state of converging; coming together from different directions to meet.",
    chinese: "汇聚，融合，交会",
    synonyms: ["junction", "intersection", "merging", "union"],
    example: "The convergence of technology and biology has led to major medical breakthroughs."
  },
  {
    word: "deleterious",
    pos: "adjective",
    definition: "Causing harm or damage.",
    chinese: "有害的，有毒的",
    synonyms: ["harmful", "damaging", "detrimental", "adverse"],
    example: "Smoking has extremely deleterious effects on long-term respiratory health."
  },
  {
    word: "demagogue",
    pos: "noun",
    definition: "A political leader who seeks support by appealing to the desires and prejudices of ordinary people rather than by using rational argument.",
    chinese: "煽动者，蛊惑人心的政客",
    synonyms: ["rabble-rouser", "firebrand", "agitator"],
    example: "The politician was accused of being a demagogue who inflamed passions for votes."
  },
  {
    word: "digression",
    pos: "noun",
    definition: "A temporary departure from the main subject in speech or writing.",
    chinese: "离题，偏离",
    synonyms: ["deviation", "detour", "aside", "divergence"],
    example: "After a brief digression about his childhood, the professor returned to the math lecture."
  },
  {
    word: "diligent",
    pos: "adjective",
    definition: "Having or showing care and conscientiousness in one's work or duties.",
    chinese: "勤勉的，用功的，细心的",
    synonyms: ["industrious", "hardworking", "assiduous", "meticulous"],
    example: "Through diligent study, she managed to score in the 99th percentile on the SAT."
  },
  {
    word: "discredit",
    pos: "verb",
    definition: "To harm the good reputation of someone or something, or to cause an idea to be disbelieved.",
    chinese: "败坏名声，怀疑，使不信任",
    synonyms: ["disprove", "debunk", "dishonor", "refute"],
    example: "The scientist worked tirelessly to discredit the fraudulent research paper."
  },
  {
    word: "disdain",
    pos: "noun",
    definition: "The feeling that someone or something is unworthy of one's consideration or respect; contempt.",
    chinese: "鄙视，轻蔑",
    synonyms: ["contempt", "scorn", "derision", "dislike"],
    example: "She looked at the poorly constructed model with clear disdain."
  },
  {
    word: "divergent",
    pos: "adjective",
    definition: "Tending to be different or develop in different directions.",
    chinese: "分歧的，偏离的，不同的",
    synonyms: ["differing", "varying", "conflicting", "deviant"],
    example: "The two economists had highly divergent views on how to control inflation."
  },
  {
    word: "empathy",
    pos: "noun",
    definition: "The ability to understand and share the feelings of another.",
    chinese: "同理心，感同身受",
    synonyms: ["compassion", "understanding", "sympathy", "sensitivity"],
    example: "A doctor needs not only technical skill but also deep empathy for their patients."
  },
  {
    word: "emulate",
    pos: "verb",
    definition: "To match or surpass a person or achievement, typically by imitation.",
    chinese: "效仿，模仿，努力赶上",
    synonyms: ["imitate", "copy", "mirror", "mimic"],
    example: "Young basketball players often try to emulate the style and moves of their favorite stars."
  },
  {
    word: "enervating",
    pos: "adjective",
    definition: "Causing one to feel drained of energy or vitality; weakening.",
    chinese: "使人衰弱的，使人失去活力的",
    synonyms: ["exhausting", "draining", "fatiguing", "weakening"],
    example: "The humid heat of the tropical island was extremely enervating for the hikers."
  },
  {
    word: "ephemeral",
    pos: "adjective",
    definition: "Lasting for a very short time.",
    chinese: "短暂的，朝生暮死的",
    synonyms: ["fleeting", "transient", "temporary", "short-lived"],
    example: "The beauty of cherry blossoms is notoriously ephemeral, lasting only a few days."
  },
  {
    word: "evanescent",
    pos: "adjective",
    definition: "Soon passing out of sight, memory, or existence; quickly fading or disappearing.",
    chinese: "易逝的，逐渐消失的",
    synonyms: ["vanishing", "fading", "transitory", "fleeting"],
    example: "A rainbow is an evanescent spectacle that disappears as quickly as it forms."
  },
  {
    word: "exemplary",
    pos: "adjective",
    definition: "Serving as a desirable model; representing the best of its kind.",
    chinese: "典范的，可作楷模的",
    synonyms: ["model", "praiseworthy", "admirable", "outstanding"],
    example: "The student received an award for her exemplary community service record."
  },
  {
    word: "extenuating",
    pos: "adjective",
    definition: "Serving to make an offense or mistake seem less serious or more forgivable.",
    chinese: "减轻罪行的，情有可原的",
    synonyms: ["mitigating", "excusing", "justifying"],
    example: "The judge reduced the sentence due to extenuating circumstances surrounding the case."
  },
  {
    word: "florid",
    pos: "adjective",
    definition: "Having a red or flushed complexion, or elaborately/excessively complicated or ornate.",
    chinese: "绚丽的，脸色红润的，繁复的",
    synonyms: ["ornate", "flowery", "flushed", "elaborate"],
    example: "His writing style was so florid that it was difficult to identify his main argument."
  },
  {
    word: "fortuitous",
    pos: "adjective",
    definition: "Happening by accident or chance rather than design; fortunate.",
    chinese: "偶然的，幸运的",
    synonyms: ["accidental", "coincidental", "lucky", "providential"],
    example: "Their meeting at the airport was entirely fortuitous, as neither knew the other was traveling."
  },
  {
    word: "foster",
    pos: "verb",
    definition: "To encourage or promote the development of something, typically something good.",
    chinese: "培养，促进，收养",
    synonyms: ["nurture", "encourage", "promote", "cultivate"],
    example: "The teacher worked hard to foster a collaborative learning environment in her classroom."
  },
  {
    word: "frugal",
    pos: "adjective",
    definition: "Sparing or economical with regard to money or food.",
    chinese: "节约的，朴素的",
    synonyms: ["thrifty", "economical", "prudent", "sparing"],
    example: "By living a frugal lifestyle, they managed to pay off their student loans in three years."
  },
  {
    word: "hackneyed",
    pos: "adjective",
    definition: "Lacking significance through having been overused; unoriginal and trite.",
    chinese: "陈腐的，老套的",
    synonyms: ["cliché", "trite", "banal", "platitudinous"],
    example: "The romantic comedy was filled with hackneyed plot lines and cheesy dialogues."
  },
  {
    word: "haughty",
    pos: "adjective",
    definition: "Arrogantly superior and disdainful.",
    chinese: "傲慢的，自大的",
    synonyms: ["arrogant", "proud", "supercilious", "conceited"],
    example: "The haughty clerk refused to help the customers she deemed not wealthy enough."
  },
  {
    word: "hedonist",
    pos: "noun",
    definition: "A person who believes that the pursuit of pleasure is the most important thing in life.",
    chinese: "享乐主义者",
    synonyms: ["pleasure-seeker", "sybarite", "epicurean"],
    example: "Living in a resort villa and dining out every night, he was a true hedonist."
  },
  {
    word: "impetuous",
    pos: "adjective",
    definition: "Acting or done quickly and without thought or care.",
    chinese: "冲动的，鲁莽的，狂暴的",
    synonyms: ["impulsive", "rash", "hasty", "reckless"],
    example: "His impetuous decision to quit his job without another lined up left him in financial trouble."
  },
  {
    word: "impute",
    pos: "verb",
    definition: "To represent something, especially something undesirable, as being done or caused by someone; attribute.",
    chinese: "归咎于，归因于",
    synonyms: ["attribute", "ascribe", "assign", "blame"],
    example: "The critics imputed the failure of the movie entirely to its poor script."
  },
  {
    word: "incompatible",
    pos: "adjective",
    definition: "So opposed in character as to be incapable of existing together.",
    chinese: "不兼容的，不合的，矛盾的",
    synonyms: ["discordant", "conflicting", "irreconcilable", "mismatched"],
    example: "Their work schedules were completely incompatible, so they rarely saw each other."
  },
  {
    word: "inconsequential",
    pos: "adjective",
    definition: "Not important or significant.",
    chinese: "琐碎的，不重要的",
    synonyms: ["trivial", "insignificant", "minor", "negligible"],
    example: "The minor editing error was inconsequential to the overall quality of the thesis."
  },
  {
    word: "evitable",
    pos: "adjective",
    definition: "Capable of being avoided or prevented.",
    chinese: "可避免的",
    synonyms: ["avoidable", "preventable", "eludible"],
    example: "The crisis was entirely evitable if standard protocols had been followed."
  },
  {
    word: "inevitable",
    pos: "adjective",
    definition: "Certain to happen; unavoidable.",
    chinese: "不可避免的，必然的",
    synonyms: ["unavoidable", "escapable", "certain", "fated"],
    example: "As the sun set, it became inevitable that the temperature would drop rapidly."
  },
  {
    word: "integrity",
    pos: "noun",
    definition: "The quality of being honest and having strong moral principles.",
    chinese: "正直，诚实，完整",
    synonyms: ["honesty", "probity", "rectitude", "sincerity"],
    example: "A leader with integrity admits their mistakes rather than trying to cover them up."
  },
  {
    word: "intrepid",
    pos: "adjective",
    definition: "Fearless and adventurous.",
    chinese: "无畏的，勇敢的",
    synonyms: ["fearless", "dauntless", "valiant", "brave"],
    example: "The intrepid explorer ventured deep into the uncharted cavern."
  },
  {
    word: "intuitive",
    pos: "adjective",
    definition: "Using or based on what one feels to be true without conscious reasoning.",
    chinese: "直觉的，凭直觉获知的",
    synonyms: ["instinctive", "innate", "visceral", "spontaneous"],
    example: "The interface of the smartphone app was so intuitive that even kids could use it."
  },
  {
    word: "jubilation",
    pos: "noun",
    definition: "A feeling of great happiness and triumph.",
    chinese: "欢庆，狂喜，庆祝",
    synonyms: ["exultation", "triumph", "rejoicing", "joy"],
    example: "There was widespread jubilation in the streets when the peace treaty was announced."
  },
  {
    word: "lobbyist",
    pos: "noun",
    definition: "A person who takes part in an organized attempt to influence legislators.",
    chinese: "游说者，说客",
    synonyms: ["activist", "influencer", "campaigner"],
    example: "The environmental lobbyist worked hard to persuade senators to vote for the green energy bill."
  },
  {
    word: "longevity",
    pos: "noun",
    definition: "Long life or long existence/service.",
    chinese: "长寿，寿命，长期任职",
    synonyms: ["durability", "endurance", "long life", "permanence"],
    example: "Healthy eating and regular exercise are key contributing factors to longevity."
  },
  {
    word: "mundane",
    pos: "adjective",
    definition: "Lacking interest or excitement; dull or ordinary.",
    chinese: "世俗的，平凡的，单调的",
    synonyms: ["ordinary", "humdrum", "routine", "commonplace"],
    example: "While she dreamed of visiting distant galaxies, her daily work was quite mundane."
  },
  {
    word: "nonchalant",
    pos: "adjective",
    definition: "Feeling or appearing casually calm and relaxed; not displaying anxiety, interest, or enthusiasm.",
    chinese: "冷漠的，若无其事的",
    synonyms: ["indifferent", "cool", "apathetic", "composed"],
    example: "He gave a nonchalant shrug when told he had won the grand raffle prize."
  },
  {
    word: "novice",
    pos: "noun",
    definition: "A person new to and inexperienced in a job or situation.",
    chinese: "新手，初学者",
    synonyms: ["beginner", "neophyte", "amateur", "tyro"],
    example: "Even a novice gardener can grow cherry tomatoes if they follow basic instructions."
  },
  {
    word: "opulent",
    pos: "adjective",
    definition: "Ostentatiously rich and luxurious or lavish.",
    chinese: "豪华的，富裕的，丰饶的",
    synonyms: ["luxurious", "lavish", "wealthy", "grandose"],
    example: "The palace was famous for its opulent decorations, complete with gold-leaf ceilings."
  },
  {
    word: "orator",
    pos: "noun",
    definition: "A public speaker, especially one who is eloquent or skilled.",
    chinese: "演说家，演讲者",
    synonyms: ["speaker", "rhetorician", "lecturer"],
    example: "Martin Luther King Jr. is remembered as one of the most powerful orators in American history."
  },
  {
    word: "ostentatious",
    pos: "adjective",
    definition: "Characterized by vulgar or pretentious display; designed to impress or attract notice.",
    chinese: "招摇的，卖弄的，豪华的",
    synonyms: ["showy", "pretentious", "gaudy", "flashy"],
    example: "His large gold watch was an ostentatious display of his sudden wealth."
  },
  {
    word: "parched",
    pos: "adjective",
    definition: "Dried out with heat.",
    chinese: "焦干的，极渴的",
    synonyms: ["dry", "arid", "dehydrated", "scorched"],
    example: "The soil was parched and cracked after three months without a single drop of rain."
  },
  {
    word: "perfidious",
    pos: "adjective",
    definition: "Deceitful and untrustworthy.",
    chinese: "背信弃义的，不忠实的",
    synonyms: ["treacherous", "deceitful", "unfaithful", "disloyal"],
    example: "The general was betrayed by a perfidious advisor who leaked military secrets to the enemy."
  },
  {
    word: "precocious",
    pos: "adjective",
    definition: "Having developed certain abilities or proclivities at an earlier age than usual.",
    chinese: "早熟的，智慧超前的",
    synonyms: ["gifted", "advanced", "mature", "developed"],
    example: "The precocious child was playing complex Mozart sonatas on the piano at age four."
  },
  {
    word: "pretentious",
    pos: "adjective",
    definition: "Attempting to impress by affecting greater importance, talent, culture, etc., than is actually possessed.",
    chinese: "自命不凡的，炫耀的，做作的",
    synonyms: ["affected", "ostentatious", "pompous", "showy"],
    example: "The restaurant's pretentious menu used overly complex terms for simple dishes."
  },
  {
    word: "procrastinate",
    pos: "verb",
    definition: "To delay or postpone action; put off doing something.",
    chinese: "拖延，耽搁",
    synonyms: ["delay", "stall", "postpone", "dither"],
    example: "If you procrastinate on studying, you will find it hard to master the vocab before the test."
  },
  {
    word: "prosaic",
    pos: "adjective",
    definition: "Having the style or diction of prose; lacking poetic beauty; commonplace or unromantic.",
    chinese: "散文的，平淡的，无聊的",
    synonyms: ["mundane", "commonplace", "dull", "uninspired"],
    example: "Instead of a grand romance, their marriage proposal was a very prosaic conversation over dinner."
  },
  {
    word: "prosperity",
    pos: "noun",
    definition: "The state of being prosperous; wealth and success.",
    chinese: "繁荣，兴旺，成功",
    synonyms: ["affluence", "wealth", "success", "fortunes"],
    example: "The new trade agreement brought a period of peace and prosperity to the region."
  },
  {
    word: "provocative",
    pos: "adjective",
    definition: "Causing annoyance, anger, or another strong reaction, especially deliberately.",
    chinese: "挑衅的，激起兴趣的",
    synonyms: ["stimulating", "annoying", "inciting", "vexing"],
    example: "The artist's provocative paintings sparked a heated public debate about censorship."
  },
  {
    word: "prudent",
    pos: "adjective",
    definition: "Acting with or showing care and thought for the future.",
    chinese: "谨慎的，精明的",
    synonyms: ["wise", "cautious", "judicious", "sensible"],
    example: "It is prudent to save a portion of your income each month for emergencies."
  },
  {
    word: "querulous",
    pos: "adjective",
    definition: "Complaining in a petulant or whining manner.",
    chinese: "爱抱怨的，易怒的",
    synonyms: ["complaining", "peevish", "whiny", "grumbling"],
    example: "The querulous customer kept sending back her soup, complaining it was either too hot or too cold."
  },
  {
    word: "rancor",
    pos: "noun",
    definition: "Bitterness or resentfulness, especially when long-standing.",
    chinese: "深仇，积怨，怨恨",
    synonyms: ["bitterness", "animosity", "resentment", "hostility"],
    example: "Even after the lawsuit was settled, there was still deep rancor between the two former friends."
  },
  {
    word: "reclusive",
    pos: "adjective",
    definition: "Avoiding the company of other people; solitary.",
    chinese: "隐遁的，孤独的，隐居的",
    synonyms: ["solitary", "cloistered", "isolated", "hermit-like"],
    example: "The reclusive author lived in a cabin in the woods and rarely granted interviews."
  },
  {
    word: "resilient",
    pos: "adjective",
    definition: "Able to withstand or recover quickly from difficult conditions.",
    chinese: "有弹性的，适应力强的，迅速恢复的",
    synonyms: ["hardy", "strong", "adaptable", "buoyant"],
    example: "The local economy proved resilient, bouncing back quickly after the recession."
  },
  {
    word: "reverence",
    pos: "noun",
    definition: "Deep respect for someone or something.",
    chinese: "敬畏，尊敬",
    synonyms: ["respect", "veneration", "admiring", "awe"],
    example: "The monks walked through the ancient temple ruins with quiet reverence."
  },
  {
    word: "sagacity",
    pos: "noun",
    definition: "The quality of being sagacious; keen mental discernment and soundness of judgment.",
    chinese: "睿智，聪慧，有远见",
    synonyms: ["wisdom", "discernment", "shrewdness", "prudence"],
    example: "The tribal elder was sought out by many for her deep sagacity and conflict-resolution skills."
  },
  {
    word: "scrutinize",
    pos: "verb",
    definition: "To examine or inspect closely and thoroughly.",
    chinese: "仔细检查，细阅",
    synonyms: ["examine", "inspect", "dissect", "analyze"],
    example: "The accountant was hired to scrutinize the company's financial records for discrepancies."
  },
  {
    word: "spurious",
    pos: "adjective",
    definition: "Not being what it purports to be; false or fake.",
    chinese: "伪造的，假的，欺骗性的",
    synonyms: ["false", "fake", "bogus", "fraudulent"],
    example: "The dealer was arrested for selling spurious Roman coins to unsuspecting tourists."
  },
  {
    word: "submissive",
    pos: "adjective",
    definition: "Ready to conform to the authority or will of others; meekly obedient or passive.",
    chinese: "顺从的，恭顺的",
    synonyms: ["compliant", "obedient", "passive", "yielding"],
    example: "Instead of standing up for her rights, she took a submissive attitude during negotiations."
  },
  {
    word: "substantiate",
    pos: "verb",
    definition: "To provide evidence to support or prove the truth of.",
    chinese: "证实，证明",
    synonyms: ["prove", "verify", "corroborate", "validate"],
    example: "The prosecutor presented security footage to substantiate the witness's testimony."
  },
  {
    word: "subtle",
    pos: "adjective",
    definition: "So delicate or precise as to be difficult to analyze or describe.",
    chinese: "微妙的，精细的，狡猾的",
    synonyms: ["understated", "delicate", "elusive", "nuanced"],
    example: "The chef added a subtle hint of lavender to the lemon tart to elevate its flavor profile."
  },
  {
    word: "superficial",
    pos: "adjective",
    definition: "Existing or occurring at or on the surface, or lacking depth of character or understanding.",
    chinese: "表面的，肤浅的",
    synonyms: ["shallow", "cursory", "surface-level", "insincere"],
    example: "The scratches on the table were superficial and did not damage the structural wood."
  },
  {
    word: "superfluous",
    pos: "adjective",
    definition: "Unnecessary, especially through being more than enough.",
    chinese: "多余的，累赘的",
    synonyms: ["redundant", "excessive", "unneeded", "surplus"],
    example: "The article was too long and contained many superfluous details about the minor characters."
  },
  {
    word: "surreptitious",
    pos: "adjective",
    definition: "Kept secret, especially because it would not be approved of.",
    chinese: "鬼鬼祟祟的，秘密的",
    synonyms: ["secretive", "stealthy", "clandestine", "covert"],
    example: "The dog made a surreptitious attempt to snatch the steak off the counter when we looked away."
  },
  {
    word: "tactful",
    pos: "adjective",
    definition: "Having or showing tact; diplomatic and sensitive in dealing with others or difficult issues.",
    chinese: "机智的，得体的",
    synonyms: ["diplomatic", "polite", "sensitive", "discreet"],
    example: "Instead of telling him his art was bad, the teacher gave a tactful suggestion for improvement."
  },
  {
    word: "tenacious",
    pos: "adjective",
    definition: "Tending to keep a firm hold of something; clinging or adhering closely; extremely persistent.",
    chinese: "顽强的，固执的，粘性强的",
    synonyms: ["persistent", "stubborn", "determined", "resolute"],
    example: "The tenacious defense attorney refused to give up until her client was fully exonerated."
  },
  {
    word: "transient",
    pos: "adjective",
    definition: "Lasting only for a short time; impermanent.",
    chinese: "短暂的，瞬时的",
    synonyms: ["fleeting", "temporary", "brief", "ephemeral"],
    example: "The heavy morning fog was transient, clearing up completely by nine o'clock."
  },
  {
    word: "venerable",
    pos: "adjective",
    definition: "Accorded a great deal of respect, especially because of age, wisdom, or character.",
    chinese: "值得尊敬的，庄严的",
    synonyms: ["respected", "honored", "revered", "distinguished"],
    example: "The venerable supreme court justice was widely praised for her lifetime of service."
  },
  {
    word: "vindicate",
    pos: "verb",
    definition: "To clear someone of blame or suspicion, or show to be right, reasonable, or justified.",
    chinese: "证明无罪，辩护，证实",
    synonyms: ["exonerate", "absolve", "acquit", "justify"],
    example: "The DNA evidence served to vindicate the man who had been falsely accused of the crime."
  },
  {
    word: "wary",
    pos: "adjective",
    definition: "Feeling or showing caution about possible dangers or problems.",
    chinese: "机警的，谨慎的",
    synonyms: ["cautious", "careful", "circumspect", "guarded"],
    example: "Be wary of online deals that seem too good to be true, as they are often scams."
  }
];

// Attach to window context
if (typeof window !== 'undefined') {
  window.DEFAULT_WORDS = DEFAULT_WORDS;
}
