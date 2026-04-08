import { NextResponse } from 'next/server';

import { formatOrderTelegramMessage, validateOrderPayload } from '@/lib/order';

const TELEGRAM_API_URL = 'https://api.telegram.org';

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Не удалось прочитать данные формы.' }, { status: 400 });
  }

  const validated = validateOrderPayload(payload);
  if (!validated.ok) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { ok: false, error: 'Сервис заявок временно недоступен. Попробуйте позже.' },
      { status: 500 }
    );
  }

  const createdAt = new Date().toISOString();
  const orderId = `TG-${Date.now().toString(36).toUpperCase()}`;
  const text = formatOrderTelegramMessage(validated.data, orderId, createdAt);

  try {
    const telegramResponse = await fetch(`${TELEGRAM_API_URL}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const telegramData = (await telegramResponse.json().catch(() => null)) as { ok?: boolean } | null;
    if (!telegramResponse.ok || !telegramData?.ok) {
      return NextResponse.json(
        { ok: false, error: 'Не удалось отправить заявку. Повторите попытку через минуту.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderId,
      createdAt
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Ошибка соединения с Telegram. Повторите попытку позже.' },
      { status: 503 }
    );
  }
}
