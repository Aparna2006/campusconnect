function ChatBubble({ text, sender }) {
  const userBubble =
    "ml-auto border border-teal-400/20 bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-lg shadow-cyan-900/20";
  const aiBubble =
    "mr-auto border border-slate-200 bg-white/90 text-slate-800 shadow-md shadow-slate-500/10";

  return (
    <div
      className={`mb-3 max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        sender === "user" ? userBubble : aiBubble
      }`}
    >
      {text}
    </div>
  );
}

export default ChatBubble;
