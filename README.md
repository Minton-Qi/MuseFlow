# MuseFlow 墨韵流光

<div align="center">

**一款专注于自我认知与内在探索的 AI 写作伴侣平台**

**An AI-powered writing companion platform focused on self-discovery and inner exploration**

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

</div>

---

## English Version

MuseFlow is a contemplative writing practice platform designed to deepen self-awareness through mindful expression and thoughtful AI guidance. Unlike typical writing tools, MuseFlow focuses on **introspection, self-reflection, and personal growth** through the therapeutic power of writing.

### Philosophy

We believe that writing is one of the most profound tools for self-discovery. MuseFlow creates a gentle, non-judgmental space where you can:

- **Explore your inner world** through carefully crafted writing prompts across five dimensions (imagination, emotion, reflection, creativity, philosophy)
- **Discover patterns in your thinking** through AI-powered multi-dimensional analysis (creativity, emotion, expression, logic, vocabulary)
- **Track your growth journey** with visual statistics and writing history
- **Receive nurturing guidance** from AI that acts as a compassionate writing mentor, not a critical judge

### Key Features

- **🌙 Curated Writing Prompts** - 12+ thoughtfully designed topics spanning imagination, emotional exploration, self-reflection, creative expression, and philosophical inquiry
- **✨ AI-Powered Insights** - Receive gentle, personalized feedback that highlights your strengths and offers thoughtful suggestions for growth
- **📊 Self-Awareness Analytics** - Track your writing patterns, creative evolution, and emotional expression over time
- **🔥 Writing Streaks** - Build a consistent writing habit with streak tracking and gentle encouragement
- **🌗 Dark Mode** - Beautiful violet-themed dark mode for comfortable night-time writing
- **💾 Auto-Save & Drafts** - Never lose your thoughts with automatic saving and draft management
- **📖 Writing History** - Revisit your past writings and reflect on your journey
- **🎯 Edit & Delete** - Full control over your writings with edit and delete functionality

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom theme
- **Backend**: Next.js API Routes
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
- **State Management**: Zustand
- **AI**: BigModel GLM-4 API for intelligent writing feedback
- **Fonts**: Geist Sans & Geist Mono, Kaiti SC (Chinese serif)

---

## 中文版本

墨韵流光是一款沉思型写作练习平台，通过正念表达和富有洞察力的 AI 指导，深化自我认知。与典型的写作工具不同，墨韵流光专注于通过写作的治疗力量来实现**内省、自我反思和个人成长**。

### 理念

我们相信，写作是自我探索最有力的工具之一。墨韵流光创造了一个温和、非评判的空间，让您能够：

- **探索内心世界** - 通过精心设计的写作提示，涵盖五个维度（想象、情感、反思、创意、哲学）
- **发现思维模式** - 通过 AI 驱动的多维度分析（创意、情感、表达、逻辑、词汇）
- **追踪成长旅程** - 通过可视化统计数据和写作记录
- **获得滋养指导** - AI 作为富有同情心的写作导师，而非严厉的评判者

### 核心功能

- **🌙 精选写作题目** - 12+ 个精心设计的主题，涵盖想象力探索、情感表达、自我反思、创意写作和哲学思考
- **✨ AI 智能反馈** - 获得温和、个性化的反馈，突出您的优势并提供深思熟虑的成长建议
- **📊 自我认知分析** - 追踪您的写作模式、创意演变和情感表达
- **🔥 写作连续记录** - 通过连续天数追踪和温和鼓励，建立持续的写作习惯
- **🌗 深色模式** - 美观的紫罗兰主题深色模式，舒适的夜间写作体验
- **💾 自动保存与草稿** - 自动保存和草稿管理，永不丢失您的思想
- **📖 写作历史** - 重温过去的作品，反思您的旅程
- **🎯 编辑与删除** - 完全控制您的作品，支持编辑和删除

### 技术栈

- **前端**: Next.js 16 (App Router), React 19, TypeScript
- **样式**: Tailwind CSS 4 自定义主题
- **后端**: Next.js API Routes
- **数据库与认证**: Supabase (PostgreSQL + 行级安全策略)
- **状态管理**: Zustand
- **AI**: BigModel GLM-4 API 智能写作反馈
- **字体**: Geist Sans & Geist Mono, 楷体 (中文衬线)

---

## Getting Started 开始使用

### Prerequisites 前置要求

- Node.js 18+ installed
- A Supabase account (free tier works)
- BigModel API key (智谱AI)

### Installation 安装

1. **Clone the repository 克隆仓库**

```bash
git clone https://github.com/yourusername/museflow.git
cd museflow
```

2. **Install dependencies 安装依赖**

```bash
npm install
```

3. **Set up environment variables 配置环境变量**

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# BigModel AI API Configuration
BIGMODEL_API_KEY=your_bigmodel_api_key
BIGMODEL_BASE_URL=https://open.bigmodel.cn/api/coding/paas/v4

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Supabase database 配置 Supabase 数据库**

Go to your Supabase project's SQL Editor and run the schema from `database/schema.sql`.

5. **Run the development server 启动开发服务器**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure 项目结构

```
museflow/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth layout group
│   ├── api/                 # API routes
│   ├── history/             # Writing history pages
│   ├── profile/             # User profile page
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── common/             # Shared components
│   ├── feedback/           # Feedback display
│   ├── history/            # History cards
│   ├── profile/            # Profile stats
│   ├── providers/          # Context providers
│   └── writing/            # Writing components
├── lib/                    # Core utilities
│   ├── store/             # Zustand stores
│   ├── supabase/          # Supabase client
│   ├── types.ts           # TypeScript types
│   ├── topics.ts          # Writing prompts
│   └── feedback.ts        # AI feedback generator
└── database/              # Database schema
```

---

## Development 开发

### Available Scripts 可用脚本

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### API Integration API 集成

The app integrates with **BigModel GLM-4 API** for intelligent writing feedback. The AI analyzes your writing across multiple dimensions and provides:

- Multi-dimensional scoring (creativity, emotion, expression, logic, vocabulary)
- Personalized encouragement
- Specific improvement suggestions
- Sentence refinement examples

---

## Contributing 贡献

Contributions, issues, and feature requests are welcome!

---

## License 许可证

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgments 致谢

- Built with [Next.js](https://nextjs.org)
- Auth & database powered by [Supabase](https://supabase.com)
- AI feedback powered by [BigModel](https://bigmodel.cn)
- UI components inspired by modern design principles
- Writing prompts curated from various contemplative traditions

---

<div align="center">

**Start your journey of self-discovery through writing**

**开始您通过写作进行的自我探索之旅**

 Made with ❤️ by the MuseFlow team

</div>
