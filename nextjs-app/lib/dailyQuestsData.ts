export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xp: number;
  current: number;
  goal: number;
  icon: string;
  type: "lesson" | "practice" | "challenge";
  completed: boolean;
}

export const DAILY_QUESTS: DailyQuest[] = [
  {
    id: "dq1",
    title: "เรียนรู้ 1 บทเรียน",
    description: "เริ่มหรือจบบทเรียน AI ประจำวันนี้",
    xp: 50,
    current: 1,
    goal: 1,
    icon: "📖",
    type: "lesson",
    completed: true,
  },
  {
    id: "dq2",
    title: "ฝึก Prompt Engineering",
    description: "เขียน prompt ที่ดี 3 ครั้ง",
    xp: 80,
    current: 1,
    goal: 3,
    icon: "✍️",
    type: "practice",
    completed: false,
  },
  {
    id: "dq3",
    title: "ทำ Daily Challenge",
    description: "ตอบคำถาม AI Quiz ประจำวัน",
    xp: 120,
    current: 0,
    goal: 1,
    icon: "⚔️",
    type: "challenge",
    completed: false,
  },
  {
    id: "dq4",
    title: "รักษา Streak",
    description: "เข้าเล่นเกมติดต่อกัน 5 วัน",
    xp: 200,
    current: 5,
    goal: 5,
    icon: "🔥",
    type: "lesson",
    completed: true,
  },
];
