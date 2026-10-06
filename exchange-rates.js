let cached;
let pending;
const valid = data => data?.result === 'success' && data.base_code === 'USD' &&
  Number.isFinite(data.time_last_update_unix) && Number.isFinite(data.time_next_update_unix) &&
  data.rates?.USD === 1;
export async function getExchangeRate(from, to) {
  if (from === to) return { from, to, rate: 1, asOf: null, source: 'Same currency' };
  const now = Date.now() / 1000;
  if (!cached) {
    try { cached = JSON.parse(localStorage.getItem('aethel-exchange-rates')); } catch {}
  }
  if (!valid(cached) || cached.time_next_update_unix <= now) {
    if (!pending) pending = (async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
        if (!response.ok) throw new Error('Exchange-rate service is unavailable. Please retry.');
        const data = await response.json();
        if (!valid(data) || data.time_next_update_unix <= Date.now() / 1000) throw new Error('Current exchange rates are unavailable. Please retry later.');
        cached = data;
        try { localStorage.setItem('aethel-exchange-rates', JSON.stringify(data)); } catch {}
        return data;
      } finally { clearTimeout(timer); }
    })().finally(() => { pending = null; });
    await pending;
  }
  const fromRate = cached.rates[from], toRate = cached.rates[to];
  if (!(Number.isFinite(fromRate) && fromRate > 0 && Number.isFinite(toRate) && toRate > 0))
    throw new Error('Automatic conversion is unavailable for this currency pair. Choose another pair or use the same currency.');
  return { from, to, rate: toRate / fromRate, asOf: new Date(cached.time_last_update_unix * 1000).toISOString(), source: 'ExchangeRate-API' };
}
