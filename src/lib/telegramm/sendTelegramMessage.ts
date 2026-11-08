export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;
console.log("TOKEN:", token);
console.log("URL:", `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`)
  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    }
  );

  const data = await res.json();

  if (!data.ok) {
    console.error("Telegram API error:", data);
  }
}