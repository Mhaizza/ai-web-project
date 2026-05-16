export default function Home() {
  return (
    <>
      <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center glass">
        <div className="text-xl font-bold">AI Startup</div>
        <ul className="flex space-x-6">
          <li><a href="#" className="text-white hover:text-gray-300">หน้าแรก</a></li>
          <li><a href="#" className="text-white hover:text-gray-300">บริการ</a></li>
          <li><a href="#" className="text-white hover:text-gray-300">เกี่ยวกับเรา</a></li>
          <li><a href="#" className="neon-button">ติดต่อเรา</a></li>
        </ul>
      </nav>

      <section className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 animate-fade-in">เปิดโลกอนาคตด้วย AI</h1>
          <p className="text-lg mb-8">นวัตกรรมที่ทันสมัยที่สุดสำหรับธุรกิจของคุณ</p>
          <a href="#" className="neon-button">เริ่มต้นใช้งานฟรี</a>
        </div>
      </section>

      <div className="container mx-auto p-10">
        <h2 className="text-4xl font-bold text-center mb-10">คุณสมบัติของเรา</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="glowing-card p-6">
            <h3 className="text-2xl font-bold mb-2">โซลูชัน AI ที่ปรับเฉพาะ</h3>
            <p>มอบโซลูชันที่เหมาะสมสำหรับทุกธุรกิจ</p>
          </div>
          <div className="glowing-card p-6">
            <h3 className="text-2xl font-bold mb-2">การวิเคราะห์ข้อมูลอัจฉริยะ</h3>
            <p>เราทำให้การวิเคราะห์เป็นเรื่องง่ายและรวดเร็ว</p>
          </div>
          <div className="glowing-card p-6">
            <h3 className="text-2xl font-bold mb-2">ความปลอดภัยและความเป็นส่วนตัว</h3>
            <p>รักษาข้อมูลของคุณให้ปลอดภัยที่สุด</p>
          </div>
        </div>
      </div>
    </>
  );
}
