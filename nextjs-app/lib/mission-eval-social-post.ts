/**
 * Same scoring logic as legacy `/missions/social-post` — prompt checklist for IG posts.
 */

export function evaluateSocialPostWriting(text: string): {
  score: number;
  feedback: string;
} {
  const criteria = [
    {
      passed:
        /กลุ่มเป้าหมาย|target|audience|วัยรุ่น|คนทำงาน|นักศึกษา|ผู้ใช้|ลูกค้า|คน/i.test(
          text
        ),
      points: 20,
    },
    {
      passed: /instagram|ig|facebook|tiktok|twitter|โซเชียล|social|line/i.test(text),
      points: 15,
    },
    {
      passed:
        /emoji|อีโมจิ|🔥|✨|☕|💫|🌟|😊|🚀|❤️|👇|⚡|🎯|💥/.test(text),
      points: 15,
    },
    {
      passed: /#|hashtag|แฮชแท็ก|tag/i.test(text),
      points: 15,
    },
    {
      passed:
        /call.to.action|cta|คลิก|กด|ลองชิม|สั่ง|ซื้อ|ลงทะเบียน|follow|กดติดตาม|order|buy/i.test(
          text
        ),
      points: 20,
    },
    { passed: text.length >= 80, points: 15 },
  ];

  const score = criteria.reduce((sum, c) => sum + (c.passed ? c.points : 0), 0);

  let feedback = "";
  if (score >= 90) {
    feedback =
      "เยี่ยมมาก! คุณเป็น Prompt Engineer ระดับ Elite แล้ว! 🏆";
  } else if (score >= 75) {
    feedback =
      "ดีมาก! prompt มีองค์ประกอบครบ AI จะทำงานได้อย่างมีประสิทธิภาพ ⭐";
  } else if (score >= 55) {
    feedback =
      "ดี! มีส่วนที่พัฒนาได้อีก ลองเพิ่มรายละเอียดที่ขาด 💪";
  } else if (score >= 35) {
    feedback =
      "พอใช้ได้ แต่ prompt ยังไม่ชัดเจนพอ AI อาจสร้างไม่ตรงความต้องการ 🔧";
  } else {
    feedback =
      "ลองเพิ่มข้อมูล: กลุ่มเป้าหมาย, แพลตฟอร์ม, อีโมจิ, hashtag และ CTA 📚";
  }

  return { score, feedback };
}
