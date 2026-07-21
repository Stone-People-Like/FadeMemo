/**
 * content.ts - 页面内容数据集中管理
 * 包含导航链接、功能特性、平台支持、统计数据等静态数据
 * 便于统一维护和修改，实现数据与视图分离
 */

import {
  BookOpen,
  FolderTree,
  Search,
  Moon,
  Zap,
  Shield,
  type LucideIcon,
} from "lucide-react";

/**
 * Feature 接口定义
 * 功能特性数据结构：图标组件、标题、描述、强调色
 */
export interface Feature {
  icon: LucideIcon;        // 功能图标（使用 lucide-react 图标组件）
  title: string;           // 功能标题
  description: string;     // 功能描述
  accent: "amber" | "violet";  // 强调色：琥珀色或紫罗兰色
}

/**
 * Platform 接口定义
 * 平台支持数据结构：平台名称、图标标识、状态描述
 */
export interface Platform {
  name: string;      // 平台名称（如 Web、iOS、Android）
  icon: string;      // 图标标识（用于映射 emoji 或字符图标）
  status: string;    // 平台状态（如 App Store、桌面应用）
}

/**
 * 功能特性数据列表
 * 包含 FadeMemo 的 6 大核心功能：
 * 极简记录、智能分类、秒级检索、昼夜双主题、本地优先、隐私守护
 */
export const features: Feature[] = [
  {
    icon: BookOpen,
    title: "极简记录",
    description: "打开即写，无需多余操作。专注内容本身，让灵感即刻落笔，不被流程打断。",
    accent: "amber",
  },
  {
    icon: FolderTree,
    title: "智能分类",
    description: "自定义分类与颜色标签，让每一条笔记都有自己的归属，查找与整理一并从容。",
    accent: "violet",
  },
  {
    icon: Search,
    title: "秒级检索",
    description: "全文搜索覆盖标题与正文，无论笔记积累多少，所需内容总能在瞬间浮现。",
    accent: "amber",
  },
  {
    icon: Moon,
    title: "昼夜双主题",
    description: "精心调校的浅色与深色配色，跟随系统自动切换，在任何光线环境下都舒适自然。",
    accent: "violet",
  },
  {
    icon: Zap,
    title: "本地优先",
    description: "基于 Hive 的本地存储引擎，零延迟响应，离线可用，数据始终掌握在自己手中。",
    accent: "amber",
  },
  {
    icon: Shield,
    title: "隐私守护",
    description: "不依赖云端，不上传内容。你的笔记只属于你，从架构层面守护每一字每一句。",
    accent: "violet",
  },
];

/**
 * 平台支持数据列表
 * 展示 FadeMemo 支持的 6 大平台
 */
export const platforms: Platform[] = [
  { name: "Web", icon: "globe", status: "随时访问" },
  { name: "iOS", icon: "apple", status: "App Store" },
  { name: "Android", icon: "android", status: "Google Play" },
  { name: "Windows", icon: "windows", status: "桌面应用" },
  { name: "macOS", icon: "apple", status: "桌面应用" },
  { name: "Linux", icon: "terminal", status: "桌面应用" },
];

/**
 * 导航链接数据
 * 用于 Navbar 组件的导航菜单
 */
export const navLinks = [
  { label: "功能", href: "#features" },
  { label: "介绍", href: "#about" },
  { label: "平台", href: "#platforms" },
  { label: "预览", href: "#preview" },
  { label: "下载", href: "#download" },
];

/**
 * 统计数据
 * 用于 Hero 组件的核心数据展示
 */
export const stats = [
  { value: "6", label: "全平台覆盖" },
  { value: "0ms", label: "本地响应延迟" },
  { value: "100%", label: "隐私本地化" },
  { value: "∞", label: "笔记容量上限" },
];
