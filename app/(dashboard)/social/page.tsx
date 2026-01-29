"use client";

import React from "react";
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Divider,
  Input,
  InputGroup,
  List,
  Panel,
  Tag,
  Stack
} from "rsuite";
import AttachmentIcon from "@rsuite/icons/Attachment";
import HeartIcon from "@rsuite/icons/Heart";
import ImageIcon from "@rsuite/icons/Image";
import MessageIcon from "@rsuite/icons/Message";
import MoreIcon from "@rsuite/icons/More";
import PlayOutlineIcon from "@rsuite/icons/PlayOutline";
import PlusIcon from "@rsuite/icons/Plus";
import SearchIcon from "@rsuite/icons/Search";
import SendIcon from "@rsuite/icons/Send";
import ShareOutlineIcon from "@rsuite/icons/ShareOutline";
import TimeIcon from "@rsuite/icons/Time";
import TrendIcon from "@rsuite/icons/Trend";

type Person = {
  name: string;
  role?: string;
  avatar: string;
};

type Comment = {
  id: string;
  user: Person;
  time: string;
  message: string;
};

type Post = {
  id: string;
  user: Person;
  time: string;
  audience: string;
  content: string;
  tags: string[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  comments: Comment[];
  media?: {
    title: string;
    subtitle: string;
    theme: string;
  };
};

type Story = {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
};

type Shortcut = {
  id: string;
  label: string;
  meta: string;
  tone: "blue" | "green" | "orange" | "violet";
};

type MarketPulse = {
  symbol: string;
  name: string;
  change: string;
  trend: "up" | "down";
};

type ChatContact = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  status: "online" | "offline";
  lastMessage: string;
  time: string;
  unread?: number;
};

const currentUser: Person = {
  name: "Olivia Martin",
  role: "Admin Investor",
  avatar: "https://i.pravatar.cc/100?u=inspire-admin"
};

const storyHighlights: Story[] = [
  {
    id: "story-1",
    title: "Q3 Portfolio",
    subtitle: "Apex Growth",
    theme: "from-blue-600 via-blue-700 to-slate-900"
  },
  {
    id: "story-2",
    title: "Impact Fund",
    subtitle: "Riverstone",
    theme: "from-emerald-500 via-teal-600 to-slate-900"
  },
  {
    id: "story-3",
    title: "Market Recap",
    subtitle: "Inspire Labs",
    theme: "from-amber-400 via-orange-500 to-rose-500"
  },
  {
    id: "story-4",
    title: "New Watchlist",
    subtitle: "Northwind",
    theme: "from-indigo-500 via-violet-600 to-slate-900"
  }
];

const shortcuts: Shortcut[] = [
  { id: "short-1", label: "Investor Lounge", meta: "2.1k members", tone: "blue" },
  { id: "short-2", label: "Growth Club", meta: "842 members", tone: "green" },
  { id: "short-3", label: "Dividend Digest", meta: "1.4k members", tone: "orange" },
  { id: "short-4", label: "Market Rooms", meta: "5 channels", tone: "violet" }
];

const shortcutToneStyles: Record<Shortcut["tone"], { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  violet: { bg: "bg-violet-50", text: "text-violet-600" }
};

const marketPulse: MarketPulse[] = [
  { symbol: "INFRA", name: "Inspire Infrastructure", change: "+4.3%", trend: "up" },
  { symbol: "SOLR", name: "Solar Equity", change: "+2.1%", trend: "up" },
  { symbol: "NOVA", name: "Nova Growth", change: "-1.4%", trend: "down" },
  { symbol: "ALT", name: "Alt Income", change: "+0.6%", trend: "up" }
];

const feedPosts: Post[] = [
  {
    id: "post-1",
    user: {
      name: "Jackson Lee",
      role: "Portfolio Analyst",
      avatar: "https://i.pravatar.cc/100?u=jackson-lee"
    },
    time: "2h",
    audience: "Investors",
    content:
      "Updated our Q3 outlook after the rates pause. Watching energy, logistics, and emerging market debt for the next rebalancing window.",
    tags: ["Q3 Outlook", "Macro", "Rebalance"],
    stats: { likes: 284, comments: 34, shares: 18 },
    comments: [
      {
        id: "comment-1",
        user: {
          name: "Sofia Davis",
          avatar: "https://i.pravatar.cc/100?u=sofia-davis"
        },
        time: "1h",
        message: "Love the clarity here. Do you see any downside risk in EM debt?"
      },
      {
        id: "comment-2",
        user: {
          name: "William Kim",
          avatar: "https://i.pravatar.cc/100?u=william-kim"
        },
        time: "45m",
        message: "The energy note is spot on. We are tracking similar volatility."
      }
    ],
    media: {
      title: "Portfolio Heatmap",
      subtitle: "Risk weighted exposure",
      theme: "from-slate-900 via-blue-800 to-blue-500"
    }
  },
  {
    id: "post-2",
    user: {
      name: "Isabella Nguyen",
      role: "Community Lead",
      avatar: "https://i.pravatar.cc/100?u=isabella-nguyen"
    },
    time: "5h",
    audience: "Public",
    content:
      "Reminder: Investor town hall is tomorrow. Drop your questions on portfolio transparency and fee structure in the comments.",
    tags: ["Town Hall", "Community", "Transparency"],
    stats: { likes: 132, comments: 19, shares: 9 },
    comments: [
      {
        id: "comment-3",
        user: {
          name: "Olivia Martin",
          avatar: "https://i.pravatar.cc/100?u=olivia-martin"
        },
        time: "2h",
        message: "Submitted a few questions already. Excited to hear the roadmap."
      }
    ],
    media: {
      title: "Live Session",
      subtitle: "Tomorrow 4:00 PM",
      theme: "from-rose-500 via-orange-500 to-amber-400"
    }
  },
  {
    id: "post-3",
    user: {
      name: "Avery Patel",
      role: "Research Partner",
      avatar: "https://i.pravatar.cc/100?u=avery-patel"
    },
    time: "1d",
    audience: "Members",
    content:
      "Sharing a new ESG scorecard template. This helps track sustainability targets without losing performance momentum.",
    tags: ["ESG", "Templates", "Scorecards"],
    stats: { likes: 412, comments: 48, shares: 27 },
    comments: [
      {
        id: "comment-4",
        user: {
          name: "Maya Reyes",
          avatar: "https://i.pravatar.cc/100?u=maya-reyes"
        },
        time: "20h",
        message: "Could you share the baseline metrics you use?"
      }
    ]
  }
];

const chatContacts: ChatContact[] = [
  {
    id: "chat-1",
    name: "Brooklyn Simmons",
    title: "Angel Syndicate",
    avatar: "https://i.pravatar.cc/100?u=brooklyn-simmons",
    status: "online",
    lastMessage: "We can review allocation changes after lunch.",
    time: "5m",
    unread: 2
  },
  {
    id: "chat-2",
    name: "Cameron Brooks",
    title: "Macro Desk",
    avatar: "https://i.pravatar.cc/100?u=cameron-brooks",
    status: "online",
    lastMessage: "Sharing updated rate notes now.",
    time: "18m"
  },
  {
    id: "chat-3",
    name: "Ava Thompson",
    title: "Impact Fund",
    avatar: "https://i.pravatar.cc/100?u=ava-thompson",
    status: "offline",
    lastMessage: "Got it. Will send the model this evening.",
    time: "2h"
  },
  {
    id: "chat-4",
    name: "Drew Johnson",
    title: "Liquidity Ops",
    avatar: "https://i.pravatar.cc/100?u=drew-johnson",
    status: "online",
    lastMessage: "Liquidity review is scheduled for Friday.",
    time: "3h",
    unread: 1
  }
];

const PostCard = ({ post }: { post: Post }) => (
  <Panel bordered className="!rounded-xl !border-slate-100 !bg-white !shadow-sm" bodyProps={{ className: "p-0" }}>
    <div className="p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2.5">
          <Avatar circle src={post.user.avatar} alt={post.user.name} />
          <div>
            <div className="text-[13px] font-semibold text-slate-900">{post.user.name}</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>{post.user.role || "Community Member"}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <TimeIcon className="w-3 h-3" />
                {post.time}
              </span>
              <Tag size="sm" color="blue" className="!text-[10px]">
                {post.audience}
              </Tag>
            </div>
          </div>
        </div>
        <Button appearance="subtle" size="sm" className="!px-2 !text-slate-500">
          <MoreIcon />
        </Button>
      </div>
      <div className="mt-3 text-[13px] text-slate-700 leading-relaxed">{post.content}</div>
      {post.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Tag key={tag} size="sm" color="violet" className="!text-[10px]">
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </div>

    {post.media && (
      <div className={`h-48 bg-gradient-to-br ${post.media.theme} px-4 py-3 text-white`}>
        <div className="flex h-full flex-col justify-between">
          <div className="text-xs uppercase tracking-wide text-white/70">Featured</div>
          <div>
            <div className="text-lg font-semibold">{post.media.title}</div>
            <div className="text-xs text-white/80">{post.media.subtitle}</div>
          </div>
        </div>
      </div>
    )}

    <div className="px-3 py-2 border-t border-slate-100">
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <HeartIcon className="w-3.5 h-3.5 text-rose-500" />
            {post.stats.likes}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageIcon className="w-3.5 h-3.5 text-blue-500" />
            {post.stats.comments} comments
          </span>
        </div>
        <span>{post.stats.shares} shares</span>
      </div>
      <Divider className="!my-2" />
      <div className="grid grid-cols-3 gap-2">
        <Button appearance="subtle" size="sm" className="!text-slate-600 !bg-slate-50 !border !border-slate-100">
          <span className="flex items-center justify-center gap-1 text-[11px]">
            <HeartIcon className="w-3.5 h-3.5" />
            Like
          </span>
        </Button>
        <Button appearance="subtle" size="sm" className="!text-slate-600 !bg-slate-50 !border !border-slate-100">
          <span className="flex items-center justify-center gap-1 text-[11px]">
            <MessageIcon className="w-3.5 h-3.5" />
            Comment
          </span>
        </Button>
        <Button appearance="subtle" size="sm" className="!text-slate-600 !bg-slate-50 !border !border-slate-100">
          <span className="flex items-center justify-center gap-1 text-[11px]">
            <ShareOutlineIcon className="w-3.5 h-3.5" />
            Share
          </span>
        </Button>
      </div>
    </div>

    <div className="px-3 pb-3">
      <div className="space-y-2">
        {post.comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-2">
            <Avatar circle src={comment.user.avatar} alt={comment.user.name} size="sm" />
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="text-[11px] font-semibold text-slate-800">{comment.user.name}</div>
              <div className="text-[11px] text-slate-600">{comment.message}</div>
              <div className="text-[10px] text-slate-400">{comment.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Avatar circle src={currentUser.avatar} alt={currentUser.name} size="sm" />
        <InputGroup inside className="flex-1">
          <Input placeholder="Write a comment..." className="!bg-slate-50 !text-[12px]" />
          <InputGroup.Button appearance="subtle" className="!text-slate-600">
            <SendIcon className="w-3.5 h-3.5" />
          </InputGroup.Button>
        </InputGroup>
      </div>
    </div>
  </Panel>
);

export default function SocialPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-base font-semibold text-slate-900">Social Hub</div>
          <div className="text-xs text-slate-500">Share updates, discuss investments, and stay connected.</div>
        </div>
        <Stack direction="row" spacing={10} className="flex-wrap">
          <InputGroup inside size="sm" className="w-full sm:w-64">
            <Input placeholder="Search the community" />
            <InputGroup.Addon className="!text-slate-400">
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
          <Button size="sm" appearance="primary" className="!bg-blue-600 !rounded-md">
            Create Post
          </Button>
        </Stack>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_300px] gap-4">
        <div className="space-y-3">
          <Panel bordered className="!rounded-xl !border-slate-100 !bg-white !shadow-sm" bodyProps={{ className: "p-3" }}>
            <div className="flex items-center gap-2">
              <Avatar circle size="md" src={currentUser.avatar} alt={currentUser.name} />
              <div>
                <div className="text-[13px] font-semibold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.role}</div>
              </div>
            </div>
            <Divider className="!my-3" />
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Connections</span>
              <span className="font-medium text-slate-900">1,428</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Groups</span>
              <span className="font-medium text-slate-900">12</span>
            </div>
            <Button size="sm" appearance="ghost" className="!mt-3 !w-full !border-slate-200 !text-slate-600">
              View profile
            </Button>
          </Panel>

          <Panel bordered className="!rounded-xl !border-slate-100 !bg-white !shadow-sm" bodyProps={{ className: "p-3" }}>
            <div className="text-[12px] font-semibold text-slate-900">Shortcuts</div>
            <List size="sm" className="mt-2" hover>
              {shortcuts.map((item) => {
                const toneStyle = shortcutToneStyles[item.tone];
                return (
                  <List.Item key={item.id} className="!px-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${toneStyle.bg} ${toneStyle.text} flex items-center justify-center`}>
                          <TrendIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[12px] font-medium text-slate-800">{item.label}</div>
                          <div className="text-[10px] text-slate-500">{item.meta}</div>
                        </div>
                      </div>
                      <Button size="xs" appearance="subtle" className="!text-slate-500">
                        View
                      </Button>
                    </div>
                  </List.Item>
                );
              })}
            </List>
          </Panel>

          <Panel bordered className="!rounded-xl !border-slate-100 !bg-white !shadow-sm" bodyProps={{ className: "p-3" }}>
            <div className="text-[12px] font-semibold text-slate-900">Market Pulse</div>
            <div className="mt-2 space-y-2">
              {marketPulse.map((item) => (
                <div key={item.symbol} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2">
                  <div>
                    <div className="text-[12px] font-semibold text-slate-800">{item.symbol}</div>
                    <div className="text-[10px] text-slate-500">{item.name}</div>
                  </div>
                  <Tag size="sm" color={item.trend === "up" ? "green" : "red"} className="!text-[10px]">
                    {item.change}
                  </Tag>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel bordered className="!rounded-xl !border-slate-100 !bg-white !shadow-sm" bodyProps={{ className: "p-3" }}>
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold text-slate-900">Stories</div>
              <Button size="xs" appearance="subtle" className="!text-slate-500">
                Manage
              </Button>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              <div className="min-w-[140px] rounded-xl border border-slate-100 bg-slate-900 text-white p-3 flex flex-col justify-between">
                <Button size="xs" appearance="primary" className="!w-7 !h-7 !p-0 !rounded-full !bg-blue-600">
                  <PlusIcon className="w-3.5 h-3.5" />
                </Button>
                <div>
                  <div className="text-[12px] font-semibold">Create story</div>
                  <div className="text-[10px] text-white/70">Share a quick update</div>
                </div>
              </div>
              {storyHighlights.map((story) => (
                <div
                  key={story.id}
                  className={`min-w-[140px] rounded-xl bg-gradient-to-br ${story.theme} text-white p-3 flex flex-col justify-between`}
                >
                  <Avatar circle size="sm" src="https://i.pravatar.cc/100?u=story" />
                  <div>
                    <div className="text-[12px] font-semibold">{story.title}</div>
                    <div className="text-[10px] text-white/70">{story.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel bordered className="!rounded-xl !border-slate-100 !bg-white !shadow-sm" bodyProps={{ className: "p-3" }}>
            <div className="flex items-center gap-2">
              <Avatar circle src={currentUser.avatar} alt={currentUser.name} />
              <Input
                placeholder="Share an investment update..."
                className="!flex-1 !bg-slate-50 !rounded-full !px-4"
              />
              <Button size="sm" appearance="primary" className="!bg-blue-600 !rounded-md">
                Post
              </Button>
            </div>
            <Divider className="!my-3" />
            <div className="grid grid-cols-3 gap-2">
              <Button appearance="subtle" size="sm" className="!text-slate-600 !bg-slate-50 !border !border-slate-100">
                <span className="flex items-center justify-center gap-1 text-[11px]">
                  <PlayOutlineIcon className="w-3.5 h-3.5 text-rose-500" />
                  Live
                </span>
              </Button>
              <Button appearance="subtle" size="sm" className="!text-slate-600 !bg-slate-50 !border !border-slate-100">
                <span className="flex items-center justify-center gap-1 text-[11px]">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                  Photo
                </span>
              </Button>
              <Button appearance="subtle" size="sm" className="!text-slate-600 !bg-slate-50 !border !border-slate-100">
                <span className="flex items-center justify-center gap-1 text-[11px]">
                  <AttachmentIcon className="w-3.5 h-3.5 text-indigo-500" />
                  Report
                </span>
              </Button>
            </div>
          </Panel>

          <Panel bordered className="!rounded-xl !border-slate-100 !bg-white !shadow-sm" bodyProps={{ className: "p-3" }}>
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold text-slate-900">Feed</div>
              <ButtonGroup size="sm">
                <Button appearance="subtle" className="!text-slate-600 !bg-slate-50 !border !border-slate-100">Top</Button>
                <Button appearance="subtle" className="!text-slate-600 !bg-slate-50 !border !border-slate-100">Latest</Button>
                <Button appearance="subtle" className="!text-slate-600 !bg-slate-50 !border !border-slate-100">Following</Button>
              </ButtonGroup>
            </div>
          </Panel>

          <div className="space-y-3">
            {feedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Panel bordered className="!rounded-xl !border-slate-100 !bg-white !shadow-sm" bodyProps={{ className: "p-3" }}>
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold text-slate-900">Chats</div>
              <Badge content={chatContacts.filter((contact) => contact.unread).length} className="!bg-blue-600" />
            </div>
            <InputGroup inside size="sm" className="mt-2">
              <Input placeholder="Search chats" />
              <InputGroup.Addon className="!text-slate-400">
                <SearchIcon />
              </InputGroup.Addon>
            </InputGroup>
            <List size="sm" className="mt-3" hover divider>
              {chatContacts.map((contact) => (
                <List.Item key={contact.id} className="!px-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar circle src={contact.avatar} alt={contact.name} size="sm" />
                        {contact.status === "online" && (
                          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-green-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-slate-800 truncate">{contact.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{contact.lastMessage}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">{contact.time}</div>
                      {contact.unread && (
                        <Badge content={contact.unread} className="!bg-blue-600 !text-[9px]" />
                      )}
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          </Panel>

          <Panel bordered className="!rounded-xl !border-slate-100 !bg-white !shadow-sm" bodyProps={{ className: "p-3" }}>
            <div className="text-[12px] font-semibold text-slate-900">Quick message</div>
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2">
                <Avatar circle size="sm" src="https://i.pravatar.cc/100?u=message-1" />
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                  Can you share the updated term sheet draft?
                </div>
              </div>
              <div className="flex items-start gap-2 justify-end">
                <div className="rounded-xl bg-blue-50 px-3 py-2 text-[11px] text-blue-700">
                  Sending it now with the latest fee notes.
                </div>
                <Avatar circle size="sm" src={currentUser.avatar} />
              </div>
            </div>
            <InputGroup inside className="mt-3">
              <Input placeholder="Message Brooklyn..." className="!bg-slate-50 !text-[12px]" />
              <InputGroup.Button appearance="primary" className="!bg-blue-600">
                <SendIcon className="w-3.5 h-3.5" />
              </InputGroup.Button>
            </InputGroup>
          </Panel>
        </div>
      </div>
    </div>
  );
}
