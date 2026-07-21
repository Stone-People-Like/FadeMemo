/**
 * About 产品介绍组件
 * 展示《记·忘》产品概念报告全文，包含核心理念、损坏引擎、
 * 五种记忆挑战模式、技术构成、路线图等内容
 */

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-amber-600/5 to-transparent" />

      <div className="container relative max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            产品介绍
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-white text-balance md:text-5xl">
            记 · 忘
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            一份越不回顾就越模糊的笔记
          </p>
          <p className="mt-2 text-sm text-slate-500">
            产品概念报告 · v0.1 · 概念验证阶段 · 2026年07月21日
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16 space-y-16 text-slate-300"
        >
          {/* 一句话说清楚 */}
          <Section title="一、一句话说清楚这个项目">
            <p>这是一个笔记工具——但不是普通的笔记工具。</p>
            <p>你记下来的内容会随着时间慢慢"坏掉"：字会消失、数字会变错、句子会变得模糊不清。</p>
            <p>想要让它们恢复原状？唯一的方法就是——你自己回忆起来，填上去。</p>
            <p>它不追求帮你"存住"信息，而是逼你"记住"信息。</p>
            <Highlight>这不是一个笔记工具，这是一个披着笔记外衣的学习工具。</Highlight>
          </Section>

          {/* 为什么需要 */}
          <Section title="二、为什么需要这样一个工具">
            <SubTitle>现状的问题</SubTitle>
            <ul className="list-disc space-y-2 pl-5">
              <li>大部分人记笔记＝把信息从别处复制粘贴到一个地方</li>
              <li>记完就再也不看——"存了就等于会了"是大脑最大的骗局</li>
              <li>现有的学习工具（背单词 App、题库）和"你自己记的笔记"是分裂的</li>
              <li>考试前翻笔记，发现跟看陌生人写的一样——因为从没主动回忆过</li>
            </ul>
            <SubTitle>这个工具想做的事</SubTitle>
            <ul className="list-disc space-y-2 pl-5">
              <li>把你的笔记变成一个"活的东西"——不看它就会生锈</li>
              <li>每次修复都是一次主动回忆，这是公认最高效的学习方式</li>
              <li>让"记"和"学"合二为一，不再分裂</li>
            </ul>
          </Section>

          {/* 核心理念 */}
          <Section title="三、核心理念：存储和记忆本来就是矛盾的">
            <p>传统笔记工具的底层逻辑是：只要存得够完整、够精确，就永远不需要去记它。</p>
            <p>但你想想看：</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>你记了密码管理器里所有密码——但你一个也背不出来</li>
              <li>你存了整本教材的笔记——但考试时什么都想不起来</li>
              <li>你保存了某次对话的完整聊天记录——但需要时还是得去搜</li>
            </ul>
            <p>存储越完美，大脑越不需要参与。大脑越不参与，记忆越脆弱。</p>
            <p>这个工具反过来：笔记越完整，你越不需要去记它；笔记越残缺，你越需要去回忆它。前者让你省心但忘记，后者让你费力但记住。</p>
            <Highlight>工具的目标不是"帮你记住一切"，而是"让你真正记得住你在乎的东西"。</Highlight>
          </Section>

          {/* 损坏引擎 */}
          <Section title="四、损坏引擎：让笔记和脑子同步遗忘">
            <SubTitle>4.1 艾宾浩斯遗忘曲线</SubTitle>
            <p>每个人都知道"刚学的东西忘得最快，经常回顾就忘得慢"。这是艾宾浩斯一个多世纪前发现的规律，有牢靠的科学研究支撑。</p>
            <p>我们的损坏引擎直接套用这个公式：</p>
            <CodeBlock>记忆保留率 = e^( - 距离上次回顾的时间 / 笔记的"记忆强度" )</CodeBlock>
            <ul className="list-disc space-y-2 pl-5">
              <li>一条新笔记，昨天还记得清清楚楚，今天不看就模糊了一小块</li>
              <li>一条经常回顾的老笔记，一星期不看也只掉了一点点</li>
              <li>答错一次，笔记的记忆强度减半——你会发现它损坏得越来越快</li>
            </ul>

            <SubTitle>4.2 损坏等级：从完整到遗忘（0-10级）</SubTitle>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ["0", "完好无损", "内容完全正常，和刚写的时候一样"],
                ["1", "轻微磨损", "有一两个数字偏了一点点"],
                ["2", "轻度损坏", "关键数字偏了3-5，或有错别字"],
                ["3", "明显受损", "核心概念被替换成近似的"],
                ["4", "比较严重", "时间、地点、人名同时出错"],
                ["5", "显著损坏", "核心信息全错，只剩几个词"],
                ["6", "重度损坏", "只剩不到一半内容原样"],
                ["7", "非常严重", "只剩半句话和标题提示"],
                ["8", "临界状态", "只剩标题和标签"],
                ["9", "濒危", '只显示\u201C这是一条关于XXX的笔记\u201D'],
                ["10", "彻底遗忘", "你已经忘了这条笔记的内容"],
              ].map(([lvl, label, desc]) => (
                <div key={lvl} className="rounded-lg border border-white/5 bg-ink-900/40 p-3">
                  <span className="font-display text-lg font-semibold text-amber-400">{lvl}</span>
                  <span className="ml-2 text-sm font-medium text-white">{label}</span>
                  <p className="mt-1 text-xs text-slate-400">{desc}</p>
                </div>
              ))}
            </div>

            <SubTitle>4.3 等级怎么升降</SubTitle>
            <p><span className="font-semibold text-green-400">答对时：</span>第一次答对降2级，第二次答对降1级</p>
            <p><span className="font-semibold text-red-400">答错时：</span>第一次答错升1级，连续三次答错升3级——强制展示原文</p>
            <p><span className="font-semibold text-slate-400">自然遗忘：</span>超过24h升1级，48h再升2级，72h再升3级，之后按艾宾浩斯曲线节奏</p>
            <Highlight>答对的奖励（降2级）大于答错的惩罚（升1级）。只要经常回顾，笔记就能维持健康状态。</Highlight>
          </Section>

          {/* 五种挑战模式 */}
          <Section title="五、五种记忆挑战模式">
            <div className="space-y-6">
              {[
                { title: "模式一：错误检测", desc: "故意把原文中的事实改成错的，你来判断对错。错误改法'似是而非'——数字外形相近、同世纪、同类别，让你真正需要动脑辨别。" },
                { title: "模式二：信息填空", desc: "挖掉关键信息，你来填。优先挖掉时间、地点、人名、数字、关键概念。连续填错3次则暂时展示原始内容。" },
                { title: "模式三：对比判断", desc: "同时展示两段内容，一段真一段假，你来选出真的。两个信息都'看起来挺对'——但其中一个细节是错的，训练精细辨别能力。" },
                { title: "模式四：时序重组", desc: "如果笔记包含多个按时间发生的事件，打乱顺序，你来重新排列。测试的是因果理解，而非孤立记忆。" },
                { title: "模式五：缩写还原", desc: "给你一个缩略版本（骨架），你把它展开成完整表述。帮你把被动记忆变成主动输出。" },
              ].map((mode) => (
                <div key={mode.title} className="rounded-xl border border-white/10 bg-ink-900/40 p-5">
                  <h4 className="font-display text-lg font-semibold text-white">{mode.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{mode.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 技术构成 */}
          <Section title="六、技术构成（人话版）">
            <p>这个工具不依赖网络——完全在你的电脑上运行。不需要服务器、不需要注册账号、不需要联网。</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                { title: "界面", tech: "Flutter", desc: "写笔记、看损坏、填空修复。跨平台框架，一次代码跑 Windows/Mac/Linux/手机" },
                { title: "大脑", tech: "Go", desc: "计算艾宾浩斯曲线、挖空位置、评分反馈。启动快、资源占用低" },
                { title: "存储", tech: "Hive", desc: "本地数据库，直接嵌入界面层。所有笔记存你电脑上" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-ink-900/40 p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">{item.tech}</span>
                  <h4 className="mt-1 font-display text-lg font-semibold text-white">{item.title}</h4>
                  <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 为什么不用AI */}
          <Section title="七、为什么先不用 AI？">
            <div className="space-y-4">
              {[
                { title: "不确定性", desc: "规则驱动下逻辑清晰、预期明确。AI 驱动下今天残缺明天模糊后天换句子——用户无法建立信任。" },
                { title: "AI 猜得不一定准", desc: "AI 可能把'地球围绕太阳转'挖空了——你觉得理所当然的常识，AI 觉得'这个容易忘'。规则引擎不会犯这种低级错误。" },
                { title: "离线能力", desc: "本地跑 AI 需要下载 2-4GB 模型，风扇起飞，每次操作等 1-3 秒。规则引擎毫秒级响应，零额外依赖。" },
                { title: "复杂度陷阱", desc: "一个还没验证的项目，优先把核心机制做对、做好、做稳。AI 可以后面再加，但核心的损坏逻辑必须在项目第一天就确定。" },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-white/5 bg-ink-900/40 p-4">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
            <Highlight>决定：先做规则引擎，跑稳了以后再考虑让 AI 辅助出题。规则兜底，AI 锦上添花。</Highlight>
          </Section>

          {/* 可能遇到的问题 */}
          <Section title="八、可能遇到的问题">
            <div className="space-y-4">
              {[
                { title: "「记了也白记」的恐惧", desc: "核心内容永不丢失。损坏只是展示层面的'伪装'——Hive 数据库里存的是完好的原始内容。关掉'损坏模式'，笔记完好如初。" },
                { title: "标记关键信息太麻烦", desc: "编辑器自动检测并标记。你写'1789年7月14日'，系统自动识别为日期——零额外操作。" },
                { title: "答错挫败感太强", desc: "答对奖励（降2级）＞答错惩罚（升1级）。坚持回顾的人会发现笔记越来越'耐用'。" },
                { title: "适用范围窄", desc: "每条笔记可以有'类型'标签。学习型笔记启用损坏模式，工具型笔记永远完好。" },
                { title: "多设备同步", desc: "第一版只做本地单设备。同步涉及复杂的损坏状态冲突处理，等产品稳定后再考虑。" },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-white/5 bg-ink-900/40 p-4">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 路线图 */}
          <Section title="九、实现路线图">
            <div className="space-y-4">
              {[
                { phase: "第一阶段", goal: "核心骨架", time: "2-3周", items: "能写笔记、能显示损坏、能填空修复。Go 后端 + Flutter 界面 + Hive 存储 + 基础损坏引擎 + 信息填空模式 + 智能标注规则引擎" },
                { phase: "第二阶段", goal: "模式完整", time: "1-2周", items: "五种挑战模式全部上线：错误检测、对比判断、时序重组、缩写还原。完整的评分体系" },
                { phase: "第三阶段", goal: "体验打磨", time: "2-3周", items: "损坏动画、修复反馈、统计面板、参数调节、批量导入、类型标签" },
                { phase: "第四阶段", goal: "可选升级", time: "待定", items: "AI 辅助出题、多设备同步、移动端、社区模板库、间隔提醒" },
              ].map((item) => (
                <div key={item.phase} className="rounded-xl border border-white/10 bg-ink-900/40 p-5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">{item.phase}</span>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <h4 className="mt-3 font-display text-lg font-semibold text-white">{item.goal}</h4>
                  <p className="mt-2 text-sm text-slate-400">{item.items}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 最后说几句 */}
          <Section title="十、最后说几句">
            <p>这个项目最让人兴奋的地方是：它对人诚实。</p>
            <p>市面上几乎所有笔记工具都在做同一件事——帮你把信息存得更好、更快、更全。但它们从来不告诉你一个真相：存下来 ≠ 学会了。</p>
            <p>这个工具不追求"帮你存"，它追求"让你记住"。它不给你虚假的安全感。它会直白地告诉你：你不回顾，就会失去。</p>
            <p>这听上去有点残忍，但这就是真实记忆的运作方式。</p>
            <blockquote className="mt-6 border-l-2 border-amber-500/50 pl-4 italic text-slate-400">
              你很奇怪笔记为什么能记住你忘了什么？<br />
              它不能。它只是诚实地提醒了你。
            </blockquote>
            <p className="mt-6 text-center text-slate-500">— 全文完 —</p>
          </Section>
        </motion.div>
      </div>
    </section>
  );
}

/** 章节标题 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

/** 子标题 */
function SubTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="mt-6 font-display text-lg font-semibold text-slate-200">{children}</h4>;
}

/** 高亮提示块 */
function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <p className="text-sm font-medium text-amber-300">{children}</p>
    </div>
  );
}

/** 代码块 */
function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-ink-950 px-4 py-3 font-mono text-sm text-amber-300">
      {children}
    </div>
  );
}