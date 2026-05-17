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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <span className="h-6 w-24">Vercel</span>
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-10 after:from-sky-900 after:via-[#0141ff] after:opacity-40 before:lg:h-[360px] z-[-1]">
        <div className="relative drop-shadow-lg bg-white dark:bg-slate-950 rounded-full p-8">
          Welcome to Next.js 🚀
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>
      </div>
    </main>
  );
}
