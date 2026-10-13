# 动物疾病与兽药查询系统（Veterinary Drug Decision Support System）

一个用于**动物医学学习与兽药信息查询**的 Web 项目，提供疾病资料查询、兽药资料查询、基于规则的候选药物筛选，以及禁忌与风险提示。

> ⚠️ **本系统仅供动物医学学习和临床辅助参考，不替代执业兽医诊断。**
> 本系统**不是在线诊断平台**，**不自动开处方**，**不根据疾病直接生成治疗方案**。

---

## 功能特性

- **疾病查询**：按名称/症状模糊搜索、按动物与分类筛选、分页、排序，查看疾病简介、病因、临床症状、诊断依据、治疗原则、推荐检查、推荐药物类别与注意事项。
- **药物查询**：按通用名/商品名搜索、按药物类别/适用动物/适应症筛选、分页，查看药物通用名、商品名、类别、适用动物、适应症、禁忌症、副作用、妊娠期警示、是否处方药、更新时间。
- **智能匹配（规则引擎）**：选择「动物 → 疾病 → 体重 → 年龄 → 妊娠状态」，系统按**纯规则**（不使用 AI）筛选候选药物并输出推荐原因、禁忌、风险提示与「是否需要兽医指导」。
  - 匹配规则依次为：**动物种类过滤 → 年龄过滤 → 体重限制 → 妊娠限制 → 禁忌症 → 药物相互作用**。
- **后台管理**：疾病与药物的新增/编辑/删除，以及「疾病-药物」关联管理。
- **全局体验**：模糊搜索、分页、排序、条件筛选、表单校验（React Hook Form + Zod）、404 页面、错误处理、Loading、Toast 提示。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | Next.js（App Router）、TypeScript、Tailwind CSS v4、shadcn/ui |
| 表单 | React Hook Form + Zod + @hookform/resolvers |
| 后端 | Next.js API Routes（Route Handlers） |
| 数据库 | SQLite + Prisma ORM |
| 图标/提示 | lucide-react、sonner |

## 目录结构

```
veterinary-drug-system/
├── app/                    # Next.js App Router 页面与 API
│   ├── api/                # API 路由（diseases/drugs/match/admin/meta）
│   ├── admin/              # 后台管理页
│   ├── diseases/           # 疾病列表 / 详情
│   ├── drugs/              # 药物列表 / 详情
│   ├── match/              # 智能匹配页
│   ├── error.tsx           # 全局错误边界
│   ├── globals.css         # Tailwind v4 + 蓝白医疗主题
│   ├── layout.tsx          # 根布局（导航/免责声明/页脚/Toast）
│   ├── not-found.tsx       # 404 页面
│   └── page.tsx            # 首页
├── components/             # 组件（ui 基础组件 / layout / 各页面组件）
├── hooks/                  # 自定义 Hook（use-debounce）
├── lib/                    # prisma 客户端、校验、API 辅助、cn 工具
├── prisma/                 # schema.prisma、migrations、seed.ts
├── services/               # 数据层：disease / drug / match（规则引擎）
├── types/                  # 共享类型定义
├── utils/                  # 格式化工具
└── public/                 # 静态资源（截图位置见下文）
```

## 环境要求

- Node.js ≥ 18.18（推荐 20+ / 22）
- npm（或 pnpm / yarn）

## 安装方式

```bash
# 1. 克隆/进入项目目录
cd veterinary-drug-system

# 2. 安装依赖（postinstall 会自动执行 prisma generate）
npm install

# 3. 配置环境变量
cp .env.example .env        # DATABASE_URL="file:./dev.db"
```

## 数据库初始化与 Prisma Migration

```bash
# 创建 SQLite 数据库并应用初始迁移（生成 prisma/dev.db）
npx prisma migrate dev --name init

# （可选）直接同步 schema 到数据库而不生成迁移文件
npx prisma db push

# 查看/管理数据
npx prisma studio
```

## 种子数据（演示数据）

```bash
# 写入演示数据：6 种动物、32 种疾病、52 种兽药、疾病-药物关联、禁忌规则、药物相互作用、参考资料
npx prisma db seed
# 或
npm run db:seed
```

> 所有疾病与药物均为**演示数据**（`isDemo = true`），页面与接口中均有「演示数据」标识，仅供学习，不代表真实临床用药依据。

## 运行方法

```bash
# 开发模式（http://localhost:3000）
npm run dev

# 生产构建 + 启动
npm run build
npm run start
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发模式 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务 |
| `npm run db:migrate` | 运行 Prisma 迁移 |
| `npm run db:push` | 同步 schema（不生成迁移） |
| `npm run db:seed` | 写入演示数据 |
| `npm run db:studio` | 打开 Prisma Studio |

## API 列表

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/diseases` | 疾病列表（search/species/category/page/pageSize/sort/order） |
| GET | `/api/diseases/:id` | 疾病详情（含推荐药物） |
| GET | `/api/drugs` | 药物列表（search/category/species/indication/page/pageSize） |
| GET | `/api/drugs/:id` | 药物详情 |
| POST | `/api/match` | 规则化候选药物匹配 |
| GET | `/api/meta` | 动物种类与分类（下拉数据） |
| POST | `/api/admin/diseases` | 新增疾病 |
| PUT/DELETE | `/api/admin/diseases/:id` | 编辑/删除疾病 |
| POST | `/api/admin/drugs` | 新增药物 |
| PUT/DELETE | `/api/admin/drugs/:id` | 编辑/删除药物 |
| POST | `/api/admin/links` | 建立/更新 疾病-药物关联 |
| DELETE | `/api/admin/links?diseaseId=&drugId=` | 删除关联 |

## 项目截图位置

项目运行截图可存放于 `public/screenshots/` 目录，并在文档中引用，例如：

```markdown
![首页](public/screenshots/home.png)
```

---

## 免责声明

本系统仅供动物医学学习和临床辅助参考，不替代执业兽医诊断，不自动开处方，不根据疾病直接生成治疗方案。所有数据均为演示数据，实际用药请遵执业兽医医嘱。
