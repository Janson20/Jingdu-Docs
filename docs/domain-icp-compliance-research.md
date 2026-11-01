# 域名与 ICP 备案合规调研报告

> **2026-11-01 补记**：主站已迁移至 `jingdu.org`，本文保留原始调研对象与结论不再改写（`.io` / `.qzz.io` 不可备案、`.org` 同样不可备案的判断依然成立）。
>
> 调研对象：`jingdu.qzz.io`（`.io` 后缀 / `.qzz.io` 免费二级域名）主站，境外服务器。
> 目标：单独注册一个顶级域名作文件分发（CDN/OSS）域名，当前走「免备案 + 海外 CDN」，希望**保留未来切换中国大陆 CDN 节点的可能性**。
> 调研日期：2026-10-11。所有结论均附来源 URL；无法核实的明确标注「未核实」。

---

## 0. 结论速览（先看这段）

| 问题 | 结论 | 硬/软 |
| --- | --- | --- |
| `.io` 能否在中国大陆备案 | **不能**（工信部已批复顶级域名列表中**没有** `.IO`） | **硬约束** |
| `.qzz.io` 免费二级域名 | 同上，且非自有注册域名，双重不可备案 | **硬约束** |
| `.io` 能否在国内注册商注册 | **不能**（注册局未获工信部许可） | **硬约束** |
| 传闻中「不能备案」的 `.me/.cc/.tv/.xyz` | **传闻错误**，这四个均在工信部已批复列表中，**可以备案** | — |
| 境外注册商域名能否备案 | **不能直接备案**，须**转入**中国境内有资质注册商 | **硬约束** |
| 备案是否绑定服务器位置 | **是**，遵循「谁接入谁备案」，必须有境内接入商资源 | **硬约束** |
| 阿里云 CDN「全球（不含中国内地）」是否要备案 | **明确不要求**（已取得官方原文） | — |
| 同一域名未来能否补备案再切内地 | 域名后缀/注册商合规时**可以**；`.io` 则**永远不行** | 关键决策点 |

**一句话结论：如果保留「未来上中国大陆 CDN」的可能性，新域名必须落在工信部已批复的后缀（首选 `.com` / `.net` / `.cn` / `.com.cn`），并且最终要能转入国内注册商。`.io` 这条路线是死路，不可逆。**

---

## 1. 哪些顶级域名（TLD）在中国大陆无法完成 ICP 备案

### 1.1 工信部是否发布过「不予备案的域名后缀」名单？

**没有「不予备案」的否定名单，只有一份「已批复」的肯定名单。**

- 官方**正面清单**：工信部「中国互联网域名体系」页面（`https://domain.miit.gov.cn/` → 中国互联网域名体系）。
- 备案能否通过的依据是「**是否被列入**该清单」，而不是「是否被列入黑名单」。

阿里云官方文档明确表述（原文）：

> 访问[工信部网站](https://domain.miit.gov.cn/)的**中国互联网域名体系**页面，查看已批复的域名后缀（顶级域名），**未列入域名后缀列表中的域名无法进行 ICP 备案**。

来源：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>

华为云口径一致（原文）：

> 备案使用的域名对应的**顶级域必须是通过工信部批复的顶级域**

来源：<https://support.huaweicloud.com/icprb-icp/ICP备案产品介绍-pdf.pdf>

> **因此：判断某后缀能否备案的方法是「去工信部清单里查有没有它」，而不是「找有没有禁止名单」。未核实到工信部发布过任何形式的后缀黑名单。**

### 1.2 `.io` 后缀能否在中国大陆备案？（最关键一条）

**结论：不能。这是本次调研中最确定的结论。**

依据一：工信部「中国互联网域名体系」页面「其他顶级域名 → 英文顶级域名」清单中**没有 `.IO`**。
清单节选（已逐一核对，`.IO` 不存在）：

```
.REN .WANG .CITIC .TOP .SOHU .XIN .COM .NET .CLUB .XYZ .VIP .SITE .SHOP .INK
.INFO .MOBI .RED .PRO .KIM .LTD .GROUP .BIZ .AUTO .LINK .WORK .LAW .BEER
.STORE .TECH .FUN .ONLINE .ART .DESIGN .WIKI .LOVE .CENTER .VIDEO .SOCIAL
.TEAM .SHOW .COOL .ZONE .WORLD .TODAY .CITY .CHAT .COMPANY .LIVE .FUND .GOLD
.PLUS .GURU .RUN .PUB .EMAIL .LIFE .CO .FASHION .FIT .LUXE .YOGA .BAIDU
.CLOUD .HOST .SPACE .PRESS .WEBSITE .ARCHI .ASIA .BIO .BLACK .BLUE .GREEN
.LOTTO .ORGANIC .PET .PINK .POKER .PROMO .SKI .VOTE .VOTO .ICU .FANS .UNICOM
.JPMORGAN .CHASE .CC .BAND .CAB .CAFE .CASH .FAN .FYI .GAMES .MARKET .MBA
.NEWS .MEDIA .SALE .SHOPPING .STUDIO .TAX .TECHNOLOGY .VIN .BABY .COLLEGE
.MONSTER .PROTECTION .RENT .SECURITY .STORAGE .THEATRE .BOND .CYOU .UNO
.SCHOOL .GLOBAL .ME .PW .HK .TV .SAXO .CLICK .AUTOS .BEAUTY .BOATS .CAR
.CARS .HAIR .HOMES .MAKEUP .MOTORCYCLES .QUEST .SKIN .TICKETS .YACHTS
.KIDS .BEER .LAW .WORK .FASHION .LUXE .YOGA .FIT .INK .WIKI
```

来源：<https://domain.miit.gov.cn/chinayu.jsp> 与 <https://domain.miit.gov.cn/indexd.html>

依据二：阿里云官方备案文档同样给出「域名后缀列表」附录，其英文顶级域名清单亦**无 `.IO`**。
来源：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>

依据三：腾讯云代理域名注册服务机构后缀信息（DNSPod 官方文档）中，两大注册商（烟台帝思普、广州云讯）代理的**全部后缀列表里都没有 `.io`**。
来源：<https://docs.dnspod.cn/all/domains-tlds-list/>

依据四：阿里云对注册局的官方表述——域名后缀未取得域名注册管理机构许可时，阿里云**无法提供注册、过户、转入、交易、账号间转移**服务：

> 根据**《互联网域名管理办法》**规定，域名属于**尚未取得域名注册管理机构许可的顶级域名**，阿里云无法对其提供域名注册、过户、转入、域名交易和账号（ID）间转移服务。相关存量已注册域名，如您需对该域名进行过户或交易等操作，建议您将域名**转出到海外注册商**进行管理。

来源：<https://help.aliyun.com/zh/dws/domain-name-suffixes-supported-for-registration>

**推论**：`.io` 域名一旦在境外注册，**无法转入国内注册商** → 而备案要求「域名注册商为已批复机构」→ 因此 `.io` **不可能**完成中国大陆 ICP 备案，且此路不可逆。

### 1.3 逐条核实「流传的不能备案后缀」名单

| 后缀 | 流传说法 | 核实结果 | 依据 |
| --- | --- | --- | --- |
| `.io` | 不能备案 | ✅ **正确，不能备案**（不在清单，注册局无许可） | [工信部域名体系](https://domain.miit.gov.cn/indexd.html)、[阿里云](https://help.aliyun.com/zh/dws/domain-name-suffixes-supported-for-registration) |
| `.me` | 不能备案 | ❌ **说法错误，可以备案**（清单中有 `.ME`） | [工信部域名体系](https://domain.miit.gov.cn/indexd.html) |
| `.cc` | 不能备案 | ❌ **说法错误，可以备案**（清单中有 `.CC`；DNSPod 明确归属广州云讯） | [工信部](https://domain.miit.gov.cn/indexd.html)、[DNSPod](https://docs.dnspod.cn/all/domains-tlds-list/) |
| `.tv` | 不能备案 | ❌ **说法错误，可以备案**（清单中有 `.TV`；DNSPod 明确归属广州云讯） | [工信部](https://domain.miit.gov.cn/indexd.html)、[DNSPod](https://docs.dnspod.cn/all/domains-tlds-list/) |
| `.xyz` | 不能备案 | ❌ **说法错误，可以备案**（清单中有 `.XYZ`；腾讯云明确「.xyz 需要实名制审核」） | [工信部](https://domain.miit.gov.cn/indexd.html)、[腾讯云](https://cloud.tencent.com/document/product/242/8580) |
| `.top` | 不能备案 | ❌ **说法错误，可以备案**（清单中有 `.TOP`） | [工信部](https://domain.miit.gov.cn/indexd.html) |
| `.club` | 不能备案 | ❌ **说法错误，可以备案**（清单中有 `.CLUB`） | [工信部](https://domain.miit.gov.cn/indexd.html) |
| `.win` | 不能备案 | ⚠️ **倾向不能**：工信部清单与 DNSPod 注册商清单中**均未出现 `.WIN`**；但**未核实**到官方点名说明。**未核实** | [工信部](https://domain.miit.gov.cn/indexd.html)、[DNSPod](https://docs.dnspod.cn/all/domains-tlds-list/) |
| `.org` | 不能备案 | ✅ **正确，不能备案**。工信部页面**无独立 `.ORG` 顶级域**（仅 `.CN` 下的 `ORG` 二级域）；阿里云明确点名见下 | 见 1.4 |

> **重要提醒**：`.me` / `.cc` / `.tv` / `.xyz` / `.top` / `.club` 这些流传「不能备案」的后缀，**实际上是可备案的**。这是本次调研对常见误传的主要纠正。真正不能备案的典型后缀是 `.io`、`.im`、`.org`、`.win`（后两者见下）。

### 1.4 `.com` / `.net` / `.cn` / `.org` / `.com.cn` 的备案支持情况

| 后缀 | 能否备案 | 官方依据 |
| --- | --- | --- |
| `.com` | ✅ **可以** | 在工信部英文顶级域名清单中（`.COM`）；DNSPod 归属烟台帝思普 |
| `.net` | ✅ **可以** | 在清单中（`.NET`）；DNSPod 归属烟台帝思普 |
| `.cn` | ✅ **可以** | `.CN` 是中国国家顶级域名（工信部令第43号第六条）；DNSPod 归属广州云讯 |
| `.com.cn` | ✅ **可以** | 国家顶级域名 `.CN` 的类别二级域，工信部域名体系明列 `COM`；DNSPod 归属广州云讯 |
| `.org.cn` | ✅ **可以** | 国家顶级域名 `.CN` 的类别二级域；DNSPod 归属广州云讯 |
| `.net.cn` / `.gov.cn` / `.ac.cn` | ✅ **可以** | 同为 `.CN` 类别二级域 |
| **`.org`** | ❌ **不可以** | 阿里云官方明确点名。见下方原文 |

工信部令第43号第六条原文：

> **“.CN”和“.中国”是中国的国家顶级域名。**

来源：<https://www.gov.cn/gongbao/content/2017/content_5241917.htm>

`.org` 不能备案的**官方点名原文**（阿里云「限制条件」文档）：

> 部分顶级域名（例如 **.org**）**尚未取得域名注册管理机构许可**，阿里云无法为这类域名提供注册、续费等服务。

来源：<https://help.aliyun.com/zh/dws/product-overview/limits>

> ⚠️ **注意一处官方来源间的不一致**：阿里云备案文档的「域名后缀列表」附录里**列有 `.ORG`**（<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>），但工信部「中国互联网域名体系」页面**没有独立 `.ORG` 顶级域**，且阿里云另一篇文档明确说 `.org` 未获注册管理机构许可。**以工信部页面 + 阿里云「限制条件」为准：`.org` 不可备案。**如选型涉及 `.org`，建议下单前向接入商工单确认。

### 1.5 「后缀无法备案」与「注册局未获工信部批复」是不是同一件事？

**不是同一件事，但结果相关。官方用三套不同措辞，对应三个独立门槛。**

| # | 门槛 | 官方措辞 | 官方出处 | 归谁管 |
| --- | --- | --- | --- | --- |
| 1 | **顶级域名本身**要获批 | 「域名后缀（**顶级域名**）**获得工信部批复**」；「**中国互联网域名体系**」 | [阿里云备案文档](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name)、[工信部域名体系页](https://domain.miit.gov.cn/) | 工信部公告的域名体系（工信部令第43号第五条：**中国互联网域名体系由工业和信息化部予以公告**） |
| 2 | **注册局**（域名注册管理机构）要获许可 | 「**尚未取得域名注册管理机构许可**的顶级域名」 | [阿里云限制条件](https://help.aliyun.com/zh/dws/product-overview/limits) | 工信部许可（第43号令第九条、第十一条） |
| 3 | **注册商**（域名注册服务机构）要获批复 | 「域名的**注册商为已批复机构**」；「**域名注册服务机构审批**情况」 | [阿里云备案文档](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name) | 省通信管理局许可（第43号令第九条、第十二条） |

三者的**法律关系**（工信部令第43号《互联网域名管理办法》，2017-11-01 施行）：

- 第九条：在境内设立域名根服务器运行机构、**域名注册管理机构**和**域名注册服务机构**的，应当取得工信部或省通信管理局的相应许可。
- 第十一条（设立注册管理机构条件之一）：**域名管理系统设置在境内，并且持有的顶级域名符合相关法律法规及域名系统安全稳定运行要求**。
- 第二十五条：**域名注册管理机构应当通过电信管理机构许可的域名注册服务机构开展域名注册服务。域名注册服务机构……不得为未经电信管理机构许可的域名注册管理机构提供域名注册服务。**
- 第五十条：为未经许可的域名注册管理机构提供域名注册服务的，责令限期改正、罚款并**向社会公告**。

来源：<https://www.gov.cn/gongbao/content/2017/content_5241917.htm>

**逻辑链（关键）**：
「后缀未获批」（门槛1）↔「运行该后缀的注册局未获许可」（门槛2）——这两者在**备案场景下的实际效果等价**，因为第43号令第二十五条禁止国内注册商为未获许可的注册局提供服务，所以：
未获批后缀 → 国内注册商不能注册/转入 → 门槛3 无法满足 → **备案必然失败**。

**但措辞不能混用**：「顶级域名批复」说的是**后缀**（工信部公告的域名体系），「注册管理机构许可」说的是**机构**（工信部许可的法人）。官方文本里两者是分开写的。

---

## 2. 在中国大陆注册/持有域名本身的合规要求

### 2.1 哪些后缀要求实名认证才能解析？未实名会怎样？

**结论：实名认证是「所有后缀」的普遍要求（工信部 2017 年全面实施），不是按后缀区分的。未实名 → 注册局暂停解析（Serverhold）。**

腾讯云官方原文：

> 根据工信部2017年全面实施域名实名认证的要求，**所有存量域名以及新注册域名均需进行实名认证**。若您的域名在规定时间内未通过实名审核，**注册局将暂停解析（Serverhold）**，您的域名将无法正常访问，待实名认证通过后方可恢复正常使用。

> .com / .net / .cn / .中国 域名被 Serverhold 是因为**注册成功后未在5天内完成实名认证**，导致域名被锁定……审核通过后将在 1 - 2 个工作日内恢复 OK 状态。

> 域名实名认证审核期间，域名状态会处于 Serverhold 状态，待审核通过后，1 - 2 个工作日恢复 OK 状态。

来源：<https://cloud.tencent.com/document/product/242/8580>

**法规依据**（工信部令第43号）：

- 第三十条：域名注册服务机构提供域名注册服务，应当要求域名注册申请者提供域名持有者**真实、准确、完整的身份信息**……申请者不补正或者提供不真实的域名注册信息的，域名注册服务机构**不得为其提供域名注册服务**。
- 第四十三条：域名持有者**提交虚假域名注册信息**的，域名注册服务机构应当予以注销。

来源：<https://www.gov.cn/gongbao/content/2017/content_5241917.htm>

**法规依据**（工信部信管〔2017〕264号《关于规范互联网信息服务使用域名的通知》，2018-01-01 施行）：

> 四、域名注册管理机构、域名注册服务机构应当进一步加强域名真实身份信息注册管理，**不得为未提供真实身份信息的域名提供解析服务**。

来源：<https://scca.miit.gov.cn/zwgk/wlaqgl/art/1970/art_87eb597ddc354e938168510e8ef04d11.html>

> ⚠️ **重要区分（回答你的问题）**：**「未实名 → Serverhold」这条规则的适用主体是「国内注册局/国内注册商代理的后缀」，不是「所有后缀」**。上述腾讯云文档点名的 `.com / .net / .cn / .中国` 都是国内已批复后缀。境外注册商处注册的 `.io` 域名**不受这条约束**——境外注册局没有向工信部报送义务，也不会因为「未做中国实名」而 Serverhold。
> 但这条**没有官方明文列举清单**，**「哪些后缀要求实名」的完整官方后缀级清单：未核实**。

### 2.2 `.cn` 域名的实名要求与 `.com` 的差异

**核实到的差异（有官方依据）：**

| 维度 | `.cn` | `.com` |
| --- | --- | --- |
| 管理归属 | 中国国家顶级域名（工信部令第43号第六条），CNNIC 管理 | 通用顶级域名，Verisign 管理 |
| 注册服务授权 | **CNNIC 授权**阿里云提供 `.cn/.中国/.公司/.网络` 注册服务 | 阿里云为已批复注册商，直接提供 |
| 注册地域/身份限制 | **有明确限制**。阿里云中国站：中国内地支持企业/个人注册；中国香港仅支持企业/组织（个人需去国际站）；**中国台湾及其他国家和地区不支持** | 无此类地域身份限制 |
| 实名认证 | **强制**（且 `.cn` 未实名会 Serverhold） | **强制**（腾讯云明确 `.com` 未在 5 天内实名同样 Serverhold） |
| 备案 | 可备案 | 可备案 |

阿里云官方原文：

> CNNIC授权阿里云提供“.cn/.中国/.公司/.网络”域名的注册服务，在阿里云中国站和国际站注册这几类后缀域名时，对注册用户分别有以下要求。
> （表1 中国站）中国台湾：**否，建议前往国际站注册**（企业/组织）；中国香港：**否，建议前往国际站注册**（个人）

来源：<https://help.aliyun.com/zh/dws/domain-name-suffixes-supported-for-registration>

**结论：主要差异在「注册主体的地域/身份限制」（`.cn` 更严，需中国内地主体或符合 CNNIC 规则），而「是否强制实名」两者相同（都强制）。**

> **未核实**：`.cn` 与 `.com` 在实名**审核时长、证件类型要求上的逐条差异**，未找到官方对照表。

### 2.3 「域名注册商需获工信部批复」的作用范围：只影响备案，还是也影响解析？

**核实结论：主要影响「备案」；对解析的影响限于「国内解析服务商代理的后缀范围」，不影响境外 DNS 解析。**

**（a）明确影响备案** —— 阿里云备案文档「要求二：域名的注册商为已批复机构」，未获批复时需转移至已获批复的注册商。
来源：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>

**（b）影响国内注册商/解析商的业务范围** —— 第43号令第二十五条+第五十条：不得为未经许可的注册管理机构提供服务。阿里云明确表示无法为「尚未取得域名注册管理机构许可的顶级域名」提供**注册、过户、转入、域名交易和账号间转移**服务。
来源：<https://help.aliyun.com/zh/dws/domain-name-suffixes-supported-for-registration>（见 1.2 引文）

**（c）不影响境外 DNS 解析** —— 未核实到任何官方规定禁止境外注册局/境外 DNS 服务商为未获批后缀提供解析。`.io` 域名在 Cloudflare/Namecheap 注册并解析到境外服务器，属于境外实体的服务，不受第43号令（适用「在中华人民共和国境内从事互联网域名服务」）直接约束。

> **未核实**：「国内公共 DNS（114DNS 等）是否对未批复后缀做拦截」——未找到官方说明，**不要采信网传说法**。

---

## 3. ICP 备案的主体与域名关系

### 3.1 备案以「主体 + 域名」还是「主体 + 网站」为单位？一个主体能否为多个域名备案？

**结论：以「主体 + 网站」为单位组织订单，但最终备案信息落到「每个网站对应的域名」；一个主体可以为多个域名备案。**

腾讯云官方原文：

> **备案主体**：一个腾讯云主账号只能为一个备案主体进行备案，且一个备案主体也只能在一个腾讯云主账号上进行备案，**一个备案主体下可以备案多个网站或 APP**。

> **服务（网站）数量**：单位备案，**每个订单最多可新增10个网站，每个网站只能包含1个域名**。个人备案，每个订单最多可新增1个网站，每个网站只能包含1个域名。

来源：<https://cloud.tencent.com/document/product/243/18911>

**子域名规则（阿里云官方原文）：**

> 在进行 ICP 备案时，**只需对主域名（如 `example.com`）进行备案**。备案完成后，其下的所有子域名（如 `www.example.com`）**无需额外备案**即可正常使用。

来源：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>

**对你的场景的直接含义**：未来若备案 `example.com`，则 `cdn.example.com`、`static.example.com` 等文件分发子域**自动被覆盖**，不需要为 CDN 域名单独备案。

### 3.2 备案时对「域名注册商」有要求吗（必须在国内注册商注册？）

**结论：有要求，且是硬要求——域名注册商必须是「已获批复」的机构。境外注册商不在其列。**

阿里云官方原文（要求二）：

> **要求二：域名的注册商为已批复机构**
> 前往工信部网站的**域名注册服务机构审批**情况页面，查询该注册商的批复状态。
> - 当域名注册商**未获批复**时，**需要将域名转移至已获批复的域名注册商**。
> - 当域名注册商获批复时，可直接进行备案。

来源：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>

**注意官方措辞是「注册商须为已获批复的机构」，不是「必须在国内注册」。** 但实际操作上，已获批复的注册商基本都是境内主体（如阿里云计算有限公司、烟台帝思普网络科技有限公司、广州云讯信息科技有限公司）。

### 3.3 境外注册商注册的域名能否用于中国大陆备案？官方口径是什么？

**结论：不能直接备案，必须先把域名转入中国境内有资质的注册商。这是本次调研中对你「选域名注册渠道」最关键的一条。**

腾讯云官方原文（最直接的口径）：

> **非中华人民共和国境内注册的域名可以在腾讯云备案吗？**
> **不能直接备案，需要您将域名转入到中国境内地区有资质的服务商，才可以进行备案。**
> 说明：如需将域名转入腾讯云，请参见域名转入腾讯云。

来源：<https://cloud.tencent.com/document/product/243/19631>

阿里云官方原文（同口径）：

> 阿里云国际站域名服务（alibabacloud.com）为**国际域名注册商**。在此站点注册的域名**需转入中国内地域名注册商**，并完成域名实名认证才可以进行 ICP 备案。

来源：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>

**对你场景的直接含义**：如果打算走 Cloudflare Registrar / Namecheap / Porkbun 注册，未来要备案就必须**转移注册商**（转入国内）。转入成本/风险：需注册满 60 天、距到期 ≥15 天、域名状态 OK、需转移密码；转入时**须在原期限上续费 1 年**。

来源：<https://cloud.tencent.com/document/product/242/18608>

**`.io` 的用户请注意**：`.io` 根本**无法转入国内注册商**（见 1.2 依据四），所以「先境外注册、以后再转回来备案」这条路对 `.io` **不成立**。

### 3.4 备案要求的服务器位置：是否绑定中国大陆境内的服务器/接入商？

**结论：是，强绑定。备案遵循「谁接入谁备案」，且必须使用境内接入商资源。若域名仅解析到非中国内地服务器，则无需备案。**

阿里云官方原文：

> **ICP备案的域名需同时满足以下要求，方可完成备案申请。若域名仅解析至非中国内地的服务器，则无需进行备案。**

来源：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>

腾讯云官方原文：

> 备案遵循 **“谁接入谁备案”** 的原则，您使用**哪个接入商的服务器就需要在哪里备案**。
> 不在腾讯云购买的服务器，能否在腾讯云进行备案？**不能。**

来源：<https://cloud.tencent.com/document/product/243/19631>

阿里云官方原文（接入商与注册商解耦）：

> 根据**备案应委托实际的接入商完成**，**备案平台必须与服务器所在厂商一致，与域名注册商无关**。因此即使您在阿里云完成域名注册，不代表您可以在阿里云完成备案。

来源：<https://help.aliyun.com/zh/icp-filing/what-scenarios-need-to-be-filed-in-aliyun>

腾讯云备案云资源门槛（官方原文）：

> 包年包月，购买包月 **3 个月及以上**（包含续费）且备案期间**剩余有效期需大于（含）1 个月**的云服务器才可以进行备案。按量计费的云服务器，**不支持备案**。服务器过期了**不能**备案。

来源：<https://cloud.tencent.com/document/product/243/19631>

**总结这两条的关系（对你的决策很重要）**：
- **备案 ≠ 必须在境内放网站**。「谁接入谁备案」意味着：**你要备案，就必须先买一个符合门槛的境内接入资源**（如境内 ECS 轻量服务器/包年包月 ≥3 个月），哪怕主站仍在境外。
- 备案成功后，若 CDN 加速区域选「含中国内地」，该域名即可使用境内节点加速；源站可仍在境外（但腾讯云提示可能「回源失败、回源速度慢」）。

---

## 4. 境外注册商 vs 国内注册商的实际差异

### 4.1 境外注册商（Cloudflare / Namecheap / Porkbun）用于「面向大陆用户的境外服务器站点」的风险

| 风险项 | 是否有官方依据 | 说明 |
| --- | --- | --- |
| **无法直接备案** | ✅ **有官方依据（硬风险）** | 腾讯云：「非中华人民共和国境内注册的域名……不能直接备案，需要您将域名转入到中国境内地区有资质的服务商」<br><https://cloud.tencent.com/document/product/243/19631> |
| **部分后缀无法转入国内（`.io` 等）** | ✅ **有官方依据（硬风险）** | 阿里云：未取得注册管理机构许可的顶级域名，无法提供注册、过户、**转入**、交易服务<br><https://help.aliyun.com/zh/dws/domain-name-suffixes-supported-for-registration> |
| **境外注册商不受工信部实名/Serverhold 规则约束** | ✅ 推断自法规适用范围 | 第43号令第二条：适用于「在中华人民共和国境内从事互联网域名服务」。境外注册局无报送义务 |
| **「被墙」（域名/IP 封锁）** | ⚠️ **未核实** | 未找到任何官方说明称境外注册商域名会被系统性封锁。**不要采信此说法** |
| **无法开具有关证明（如域名证书）** | ⚠️ **部分不成立** | 腾讯云：域名证书「注册购买成功后可以即时生成……**无需等域名实名认证审核通过**」。但这只说明国内注册商的证书政策；**境外注册商是否/如何出具可用于备案的证明，未核实** |

**核实到的「境外注册商实际可行」的证据**：境外注册商 + 境外服务器 + 境外 CDN 的组合，**在合规上不需要备案**（见 3.4 阿里云原文「若域名仅解析至非中国内地的服务器，则无需进行备案」）。

### 4.2 国内注册商（阿里云万网、腾讯云）注册域名的优缺点

**优点（有官方依据）：**

1. **备案前置条件天然满足**——注册商即已批复机构，域名实名信息与账号实名信息打通。
　来源：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>
2. **实名审核快**：腾讯云「域名关联实名认证模板：一般情况下可**立即完成审核**」；「提交资料：一般情况下需要 **1-3 个工作日**内完成审核」。
　来源：<https://cloud.tencent.com/document/product/242/8580>
3. **可获取域名证书**（备案/维权常用）：即时生成，无需等实名通过。
　来源：同 2
4. **转入门槛清晰可控**：转入免费，但需续费 1 年；条件为注册满 60 天、距到期 ≥15 天、状态 OK。
　来源：<https://cloud.tencent.com/document/product/242/18608>

**缺点 / 限制（有官方依据）：**

1. **后缀范围受限**——只能注册工信部已批复、且该注册商已获代理资格的后缀。`.io`、`.org` 等一律不行。
　来源：<https://docs.dnspod.cn/all/domains-tlds-list/>、<https://help.aliyun.com/zh/dws/product-overview/limits>
2. **`.cn` 类有主体地域限制**：阿里云中国站对 `.cn/.中国/.公司/.网络` 限制中国台湾及其他国家和地区用户注册。
　来源：<https://help.aliyun.com/zh/dws/domain-name-suffixes-supported-for-registration>
3. **强制实名，审核期即 Serverhold**：「域名实名认证审核期间，域名状态会处于 Serverhold 状态」。
　来源：<https://cloud.tencent.com/document/product/242/8580>
4. **域名注册不代表能在该厂商备案**——「备案平台必须与服务器所在厂商一致，与域名注册商无关」。
　来源：<https://help.aliyun.com/zh/icp-filing/what-scenarios-need-to-be-filed-in-aliyun>

---

## 5. CDN 加速域名与备案的绑定关系

### 5.1 阿里云 CDN 选「全球（不包含中国内地）」时，官方是否明确不要求备案？

**✅ 是，官方有明确原文。这是本次调研中对当前路线最直接的确认。**

阿里云 CDN「添加加速域名」官方原文：

> **重要**
> - 加速区域为**仅中国内地**或**全球**时，加速域名要求**必须备案**，您可以登录阿里云ICP代备案管理系统完成备案。由于工信部备案系统存在数据延迟，刚完成备案的域名请在 **8 小时**后再配置。
> - 加速区域为**全球（不包含中国内地）**时，**对加速域名备案不作要求**。

来源：<https://help.aliyun.com/zh/cdn/add-a-domain-name>

阿里云 CDN「加速区域」文档原文：

> **全球（不包含中国内地）**：如果选择全球（不包含中国内地），全球用户访问均会调度至中国香港、中国澳门、中国台湾以及其他国家和地区的加速节点进行服务（中国内地用户将会被调度至日本、新加坡和中国香港的 CDN 节点）。**该选项无需工信部备案。**

来源：<https://help.aliyun.com/zh/cdn/user-guide/change-the-accelerated-region>

腾讯云 CDN 口径一致（官方原文）：

> **中国境外**：所有用户均使用腾讯云中国境外节点就近提供加速服务，包括中国香港、中国澳门、中国台湾等地区；选择该区域时，对加速域名**备案不作要求**；
> **中国境内**：……选择该加速区域时，加速域名需为**已备案域名**；
> **全球**：……选择该加速区域时，加速域名需为**已备案域名**。
> 域名备案/合规要求：1. 如果加速区域为中国境内、全球加速，域名需要已经在工信部进行过备案；如果加速区域为境外，域名可以不需要备案；2. 域名备案同步有一定的延迟，预计需 **1-2 个小时**。

来源：<https://cloud.tencent.com/document/product/228/3149>

### 5.2 未来切换到含中国内地的加速区域，同一域名能否补备案？有无「接入后再备案」的操作路径？

**结论：域名合规时可以补备案；`.io` 不可以。且不是「先接入再备案」，而是「先备案才能接入含中国内地的区域」。**

**操作路径（阿里云，官方依据）：**

阿里云 CDN 支持**在线切换加速区域**（无需删除重建域名）：

> 介绍三种加速区域的区别以及如何选择适合自己的加速区域，当您需要变更加速域名的 CDN 服务范围时，您可以通过**切换加速区域**功能实现。
> 切换加速区域：域名管理 → 目标域名「管理」→ 基础信息区域「修改」→ 加速区域对话框选择 → 确定。

来源：<https://help.aliyun.com/zh/cdn/user-guide/change-the-accelerated-region>

**但是顺序是「先备案，后切换」**，因为「仅中国内地」和「全球」都要求**加速域名必须已备案**（来源同上及 <https://help.aliyun.com/zh/cdn/add-a-domain-name>）。

**完整的「未来上内地」路径（综合多份官方文档）：**

1. 新域名必须落在**工信部已批复后缀**（`.com`/`.net`/`.cn`/`.com.cn` 等）。
2. 在**境内接入商**购买符合门槛的云资源（如腾讯云包年包月 ≥3 个月、剩余有效期 ≥1 个月）。
　来源：<https://cloud.tencent.com/document/product/243/19631>
3. 域名**注册商须为已批复机构**；若在境外注册，需先**转入**国内注册商。
　来源：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>
4. 完成**域名实名认证**，且实名信息与备案主体一致；实名/过户后同步到工信部系统需 **2~3 天**（非阿里云注册的域名需满 3 个工作日）。
　来源：同上；<https://cloud.tencent.com/document/product/243/18911>
5. 域名剩余有效期**至少 >45 天**。
　来源：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>
6. 提交备案 → 管局审核 → 备案成功。
7. 备案数据同步有延迟：阿里云 CDN 提示「刚完成备案的域名请在 **8 小时**后再配置」；腾讯云提示「预计需 **1-2 个小时**」。
8. 在 CDN 控制台**切换加速区域**为「仅中国内地」或「全球」。
9. 注意切换后影响：**回源流量增加、缓存命中率下降**；且从内地切到「全球（不含内地）」时「客户端将无法访问中国内地的 CDN 节点……需要确保已经没有中国内地的流量（尤其需要注意本地 DNS 缓存的影响）」。
　来源：<https://help.aliyun.com/zh/cdn/user-guide/change-the-accelerated-region>

> **补充：源站位置的坑** —— 腾讯云提示「根据您的加速区域，在源站配置时建议源站设立位置与区域相同……如果设置在中国香港或其他境外区域，**可能因存在跨境访问出现回源失败、回源速度慢**等情况」。
> 来源：<https://cloud.tencent.com/document/product/228/3149>
> 这意味着：即使备案成功并切到内地 CDN，**源站仍在境外**会带来回源性能问题。若追求完整体验，最终可能还需把源站迁入境内。

> **补充：备案号码失效风险** —— 阿里云提示若域名备案信息在其他接入商被注销，将会被限制产品使用；备案信息过期会导致 CDN 报错。
> 来源：<https://help.aliyun.com/zh/icp-filing/what-scenarios-need-to-be-filed-in-aliyun>

---

## 6. 对选域名的直接影响（决策点）

> 最多 8 条。**硬约束 = 选错就报废，无法通过后续操作补救**；偏好 = 影响体验/成本但可调整。

| # | 决策点 | 类型 | 说明 |
| --- | --- | --- | --- |
| 1 | **新域名后缀必须在工信部已批复清单内** | **硬约束** | 若未来要上中国大陆 CDN，这是不可逆门槛。`.io`/`.im`/`.org` 等**永久无法备案**。推荐 `.com`/`.net`/`.cn`/`.com.cn`。依据：[工信部域名体系](https://domain.miit.gov.cn/indexd.html) |
| 2 | **`.qzz.io` 及任何 `.io` 域名不能作为未来的备案域名** | **硬约束** | `.io` 既不在批复清单、注册局也无工信部许可，且**无法转入国内注册商**，补救手段为零。文件分发域名**必须另选后缀**。依据：[工信部](https://domain.miit.gov.cn/indexd.html)、[阿里云](https://help.aliyun.com/zh/dws/domain-name-suffixes-supported-for-registration) |
| 3 | **不要因「传闻不能备案」而排除 `.me`/`.cc`/`.tv`/`.xyz`/`.top`/`.club`** | **偏好（信息纠偏）** | 这些后缀**实际可备案**，若因误信传闻而放弃，会不必要地缩窄选名空间。依据：[工信部域名体系](https://domain.miit.gov.cn/indexd.html)、[DNSPod](https://docs.dnspod.cn/all/domains-tlds-list/) |
| 4 | **注册渠道：优先国内注册商（阿里云/腾讯云）** | **硬约束（若保留备案可能性）** | 境外注册的域名**不能直接备案，必须转入境内注册商**，而转入有 60 天等待 + 强制续费 1 年 + 转出配合等摩擦。直接在国内注册可一次性消除该风险。依据：[腾讯云](https://cloud.tencent.com/document/product/243/19631)、[阿里云](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name) |
| 5 | **域名持有人实名信息必须与未来备案主体一致** | **硬约束（若保留备案可能性）** | 个人备案要求姓名/证件类型/证件号一致；单位备案要求名称或法定代表人一致。若先用个人身份注册、以后想企业备案，需过户并重新实名 + 等 2~3 天同步。**建议一次性用最终备案主体注册。**依据：[腾讯云](https://cloud.tencent.com/document/product/243/18911)、[阿里云](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name) |
| 6 | **备案需要额外的境内接入资源，不是纯线上动作** | **硬约束（成本前置）** | 「谁接入谁备案」：要备案就必须有符合门槛的境内云资源（如包年包月 ≥3 个月、剩余 ≥1 个月）。**这是备案的隐性成本，需提前纳入预算。**依据：[腾讯云](https://cloud.tencent.com/document/product/243/19631) |
| 7 | **CDN 域名不需要单独备案，主域名备案即可覆盖子域** | **偏好（省事）** | 未来备案主域名后，`cdn.`/`static.` 等子域自动可用，无需为分发域名重复备案。依据：[阿里云](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name) |
| 8 | **当前「海外 CDN」路线本身完全合规，可用 `.io`/任意后缀** | **偏好（现状确认）** | 只要加速区域选「全球（不包含中国内地）/中国境外」，官方明确**不作备案要求**，且「域名仅解析至非中国内地的服务器则无需备案」。**若彻底放弃上内地，则决策点 1/2/4/5 全部失效。**依据：[阿里云 CDN](https://help.aliyun.com/zh/cdn/add-a-domain-name)、[阿里云备案](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name)、[腾讯云 CDN](https://cloud.tencent.com/document/product/228/3149) |

**最低风险选型建议**：注册 `example.com`（或 `.cn`）于**阿里云/腾讯云**，持有人填写**最终备案主体**，仅作文件分发用。这样当前可用「全球（不含中国内地）」CDN，未来只需买一台境内小规格包年包月资源 + 提交备案 + 切换加速区域即可上内地，**无需迁移域名注册商、无需更换域名**。

---

## 7. 未核实项（明确列出）

以下条目**未能**找到官方或服务商官方来源，**不做结论，请勿采信网传说法**：

1. **工信部是否发布过「不予备案域名后缀」的否定名单**——未核实到任何形式的官方黑名单；仅核实到「正面批复清单」。**倾向于不存在**，但无法证明不存在。
2. **`.win` 后缀能否备案**——不在工信部清单、不在 DNSPod 注册商清单，但**未找到官方点名说明**。倾向不能，但标记为未核实。
3. **`.org` 后缀能否备案**——**存在官方来源冲突**：阿里云备案文档附录列有 `.ORG`，但工信部页面无独立 `.org` 顶级域，且阿里云「限制条件」文档点名 `.org` 未获注册管理机构许可。以阿里云「限制条件」为准判定不可备案，但**建议下单前向接入商工单二次确认**。
4. **「哪些后缀要求实名认证」的完整官方后缀级清单**——未核实。已核实的是「工信部 2017 年全面实施域名实名认证、未实名则 Serverhold」的**普遍规则**，但**缺少逐后缀的官方对照表**。
5. **`.cn` 与 `.com` 在实名审核时长、证件类型要求上的逐条差异**——未核实到官方对照表。已核实的差异仅为「注册主体地域限制」（`.cn` 更严）。
6. **境外注册商域名是否会被「系统性墙掉」**——未核实到任何官方说明支持此说法。**不应作为决策依据。**
7. **境外注册商能否开具用于备案的「域名证明/证书」**——未核实。已知腾讯云域名证书可即时生成（国内注册商），但不适用于境外注册商。
8. **国内公共 DNS（如 114DNS）是否拦截未批复后缀**——未核实到官方说明。
9. **工信部「域名注册管理机构审批情况」页面当前完整名单**——该页面为 JS 动态加载，`web_fetch` 未能取得列表内容（`https://domain.miit.gov.cn/` 仅返回 7 个栏目标题，`/chinayu.jsp` 仅返回域名体系）。**已批复后缀清单以「中国互联网域名体系」页面为准**（该页面内容已成功取得）。完整注册管理机构名单未核实。
10. **`.qzz.io` 免费二级域名的服务条款细节及其对文件分发/商用的限制**——未核实（本次调研聚焦备案合规，未调研该免费域名服务本身的条款）。

---

## 附：主要来源清单

**工信部 / 政府官方：**
- 工信部「中国互联网域名体系」（已批复顶级域名清单）：<https://domain.miit.gov.cn/chinayu.jsp>、<https://domain.miit.gov.cn/indexd.html>
- 工信部「域名服务」门户首页：<https://domain.miit.gov.cn/>
- 《互联网域名管理办法》（工信部令第43号，2017-11-01 施行）：<https://www.gov.cn/gongbao/content/2017/content_5241917.htm>
- 《工业和信息化部关于规范互联网信息服务使用域名的通知》（工信部信管〔2017〕264号）：<https://scca.miit.gov.cn/zwgk/wlaqgl/art/1970/art_87eb597ddc354e938168510e8ef04d11.html>
- 工信部备案系统：<https://beian.miit.gov.cn/>

**阿里云官方：**
- ICP备案「域名准备与检查」（含域名后缀列表附录）：<https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name>
- 域名「限制条件」（点名 `.org`）：<https://help.aliyun.com/zh/dws/product-overview/limits>
- 支持注册的域名后缀：<https://help.aliyun.com/zh/dws/domain-name-suffixes-supported-for-registration>
- 「什么场景下需要在阿里云备案」：<https://help.aliyun.com/zh/icp-filing/what-scenarios-need-to-be-filed-in-aliyun>
- CDN「添加加速域名」（备案要求原文）：<https://help.aliyun.com/zh/cdn/add-a-domain-name>
- CDN「加速区域」（切换路径与影响）：<https://help.aliyun.com/zh/cdn/user-guide/change-the-accelerated-region>

**腾讯云 / DNSPod 官方：**
- 「能否进行备案」（境外注册域名口径）：<https://cloud.tencent.com/document/product/243/19631>
- 「备案限制说明」（主体/域名/实名要求）：<https://cloud.tencent.com/document/product/243/18911>
- 域名「实名认证相关」（Serverhold 规则）：<https://cloud.tencent.com/document/product/242/8580>
- 域名「转入流程问题」（转入条件）：<https://cloud.tencent.com/document/product/242/18608>
- CDN「从零开始配置 CDN」（加速区域备案要求）：<https://cloud.tencent.com/document/product/228/3149>
- DNSPod「腾讯云代理域名注册服务机构后缀信息」：<https://docs.dnspod.cn/all/domains-tlds-list/>

**华为云官方：**
- ICP备案产品介绍（「顶级域必须是通过工信部批复的顶级域」）：<https://support.huaweicloud.com/icprb-icp/ICP备案产品介绍-pdf.pdf>
