# 动物疾病与兽药辅助决策系统

**Veterinary Drug Decision Support System**

一个基于规则（非 AI）的动物疾病与兽药辅助决策系统，用于动物医学学习与兽药信息查询。

> ⚠️ **本系统仅用于学习研究，不能替代专业兽医诊断。**

---

## 项目简介

这是一个动物疾病与兽药辅助决策系统，提供以下核心能力：

- **疾病查询**：按动物种类、分类与症状检索疾病资料（病因、症状、诊断、治疗原则、注意事项等）。
- **药物信息管理**：兽药通用名 / 商品名 / 类别 / 适用动物 / 适应症 / 禁忌 / 副作用等信息的维护与查询。
- **疾病-药物规则匹配**：基于**纯规则引擎**（不使用 AI）筛选候选药物。
- **风险提示**：输出禁忌、慎用、妊娠限制与药物相互作用提示。

系统不自动开处方，不根据疾病直接生成治疗方案，仅做候选药物筛选与风险提示。

## Features

- **疾病查询**：模糊搜索、动物 / 分类筛选、分页、排序，疾病详情含简介 / 病因 / 临床症状 / 诊断依据 / 治疗原则 / 推荐检查 / 推荐药物类别 / 注意事项。
- **药物查询**：通用名 / 商品名搜索、类别 / 动物 / 适应症筛选、分页，药物详情含禁忌（红色标签）、副作用（黄色标签）、妊娠警示、处方药标识。
- **智能匹配**：向导式「动物 → 疾病 → 体重 → 年龄 → 妊娠状态」，规则依次为 *动物种类过滤 → 年龄过滤 → 体重限制 → 妊娠限制 → 禁忌症 → 药物相互作用*，卡片化输出推荐原因、禁忌、注意事项与「是否需要兽医指导」。
- **后台管理**：疾病 / 药物 CRUD + 疾病-药物关联管理，含确认删除弹窗与 Toast 提示。
- **搜索体验**：首页实时搜索推荐（autocomplete + 键盘上下选择）。
- **首页 Dashboard**：数据库实时统计卡片（疾病数 / 药物数 / 动物数 / 关联数，Count Up 动画）。
- **工程质量**：表单校验（React Hook Form + Zod）、Toast、Skeleton Loading、404 页面、错误边界、响应式（手机 / 电脑）。
- **医疗蓝白配色**：基于 shadcn/ui 的现代医疗风格。

## Tech Stack

| 分类 | 技术 |
| --- | --- |
| Frontend | Next.js（App Router）、TypeScript、Tailwind CSS v4、shadcn/ui |
| Backend | Next.js API Routes |
| Database | Prisma ORM、SQLite |
| 表单 | React Hook Form + Zod + @hookform/resolvers |
| 其他 | lucide-react、sonner |

## Project Structure

```
.
├── app/          # Next.js App Router：页面 + API 路由
├── components/   # UI 组件（shadcn 基础组件 + 业务组件）
├── prisma/       # Prisma Schema、迁移、种子数据
├── services/     # 数据访问层 + 规则匹配引擎
├── types/        # 共享 TypeScript 类型
├── lib/          # Prisma 客户端、校验、工具
├── hooks/        # 自定义 Hooks（use-debounce、use-count-up）
└── utils/        # 格式化工具
```

## Installation

### 环境要求

- Node.js ≥ 18.18（推荐 20+ / 22）
- npm / pnpm / yarn

### 步骤

```bash
# 1. 克隆并进入项目目录
cd veterinary-drug-system

# 2. 安装依赖（postinstall 自动执行 prisma generate）
npm install

# 3. 配置环境变量
cp .env.example .env          # DATABASE_URL="file:./dev.db"

# 4. 初始化数据库（SQLite）并应用迁移
npx prisma migrate dev --name init

# 5. 填充演示数据（6 种动物 / 32 种疾病 / 52 种兽药 / 关联 / 禁忌 / 相互作用 / 参考资料）
npx prisma db seed

# 6. 启动开发服务器
npm run dev
```

访问 <http://localhost:3000>。

> 所有疾病与药物均为**演示数据**（`isDemo = true`），页面与接口中均有「演示数据」标识，仅供学习，不代表真实临床用药依据。

## Screenshots

> 截图请放置于 `public/screenshots/` 目录，然后在下方引用（取消注释即可）：

<!--
![首页](public/screenshots/home.png)
![疾病列表](public/screenshots/diseases.png)
![药物列表](public/screenshots/drugs.png)
![智能匹配](public/screenshots/match.png)
-->

## Deployment

### 本地 / 自托管（Node.js 服务器）

```bash
npm run build
npm run start
```

### Vercel 注意事项

本项目数据库为 **SQLite**，而 Vercel 为无服务器（serverless）环境，文件系统只读，SQLite 数据库文件无法持久化写入。因此：

- 适合在**本地或自有 Node.js 服务器**运行；
- 若需部署到 Vercel，建议将数据库替换为 **PostgreSQL**（修改 `prisma/schema.prisma` 的 `provider` 为 `postgresql`，并配置托管数据库的 `DATABASE_URL`），或选择带持久化磁盘的托管平台。

## API Reference

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/diseases` | 疾病列表（search/species/category/page/pageSize/sort/order） |
| GET | `/api/diseases/:id` | 疾病详情（含推荐药物） |
| GET | `/api/drugs` | 药物列表（search/category/species/indication/page/pageSize） |
| GET | `/api/drugs/:id` | 药物详情 |
| POST | `/api/match` | 规则化候选药物匹配 |
| GET | `/api/stats` | 首页实时统计数据 |
| GET | `/api/meta` | 动物种类与分类（下拉数据） |
| POST / PUT / DELETE | `/api/admin/diseases` | 疾病增删改 |
| POST / PUT / DELETE | `/api/admin/drugs` | 药物增删改 |
| POST / DELETE | `/api/admin/links` | 疾病-药物关联建立 / 删除 |

## Disclaimer

本系统**仅用于学习研究，不能替代专业兽医诊断**，不自动开处方，不根据疾病直接生成治疗方案。所有数据均为演示数据，实际用药请遵执业兽医医嘱。

## License

如需公开，建议添加 `LICENSE` 文件（例如 [MIT License](https://opensource.org/licenses/MIT)）。
