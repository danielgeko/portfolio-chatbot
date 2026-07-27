import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  return (
    <div className="flex h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <ChatWindow />
    </div>
  );
}
