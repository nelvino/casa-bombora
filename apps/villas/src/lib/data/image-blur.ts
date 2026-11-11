// Blur placeholders (16px WebP, base64) for local villa images.
// Regenerate with: node scripts/process-photos.mjs
const BLURS: Record<string, string> = {
  'hero': 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAsAA4BaJaAC7ACp97Th+AAA/Xg3QfkKEmAU7StYczpTiIEncWDxQvFRiMyDg/DDeildHzYahGHzPk2IRpBwRzNoblPgAAA=',
  'facade': 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADQAQCdASoQAAsAA4BaJQBOgBnVURXZAAD+6n5u+f7JY6niscNe1a75u8mPu1FomtpGfVPx6e687t74585kyrrzMIAlgMPTGacEFEULPibHJuPm9XJsQw+9m6lqc4x4AAA=',
  'pool-aerial': 'data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAAAQBACdASoQABgAPu1iqU2ppaOiMAgBMB2JQBOgAuKysn9R+dXIUMVMgAD+gXrWraP5bLLiMozlKAOzgno+dJsxuduBIKwm9jGi/PHnfKjBcCCswUdECyIxogXeT4LWXRMS7wmFn62btZO+aX95ikLWuavQHz+jQTtekdrgE4SUSuua3+FX/q5JbnafxSZeWUvBdli65vHQ/s8f0gAAAA==',
  'living': 'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAADQAQCdASoQAAsAA4BaJQBOgBX2FdCX+AD+Ve4hJoevu15OwyTMO0FRm6RcyfUY0ACtjGgkfe5C02dXISVYpOVo1dEFUrPSMvuXg5n/TEgllukROb5aYUprQfp7ex90df8CWAAA',
  'kitchen': 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQAgCdASoQAAsAA4BaJQBOgB8xkHXpEx9UAP6QwX7BLalCLHiTpj8B/1dOTvFO0h68HBGTxfrttG5zE4C/u4acfPcRu0/yWojpI21fCNbIotSROLkNbRgA',
  'dining': 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAwAgCdASoQAAsAA4BaJZgCdAEQ48PM0RcNAAD+8VAwjv4ezPFy/Q6rKxZB8Phohz2DZoARgc7nUN/RUWuiU16MeuG8CICmDl+VJoBRc9M0ae0BpkiphyKJ36VWSR7b4AA=',
  'stairs': 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAwAgCdASoQAAsAA4BaJagCdAEenIDHXPQekAD+9Hj/b6zH37ye+wuprxnKRZHA0iAkHTJzDUWLoudxfNm9gwGtGM8xFoymFT8ycs52XKBT9mOyo1svsLejRDfqBAAA',
  'bedroom-mezzanine': 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAQCdASoQAAsAA4BaJQBOgCGsZC3ZAAD4MzWyJ/e153OTHpSuGD8H3m5AoIAtD4uum7qI9Sn2u3BKJutvrl8EU0aJpY8we+RI9U9sXbkGrFZn9ouWtEtVAAA=',
  'bedroom': 'data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAADQAwCdASoQABgAPu1mqk2ppaQiMAgBMB2JQBOmUABqj1GmnEfiDtQA/hSJpKt4qSQzoYOQZP6Wq8VXLGo29ETVdRgVWQO2KVWczJ74jOHrh75gHD+FtTYuy5vffF8eodu0NwmbLQq2++W1HOFzc+I7PR5i3i1Yavdt4pva7lQ3VKpdCDnYwAAA',
  'bathroom': 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoQAAsAA4BaJZACdADDljIssADhLwY/tq490QKZ48XxcmmN7dUmiJhKmtrM61Q7jmvLJzf58lUguqVMrPF16tLcr9FgAA==',
  'terrace': 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAQCdASoQAAsAA4BaJZQAAxXs9pihYgD+8zZ269CtLvJlfVo9T1OUGy9GmiVm/pwXMYBf10jhGtt+vzmta1r7XZAAAA==',
  'night-bath': 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoQAAsAA4BaJagCdAEPAaAtn6AA/uxL2G2HfQbH6WdV8TO51m6B0hrp8WYcjd//DVavRvKIZDYRpEzk0qV9h00hPYUlB0GmtFRMoAAA',
  'living-alt': 'data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAADwAwCdASoQABgAPu1iqU2ppaOiMAgBMB2JYwCw+BAADisCKqSamdogAP59/MHNHKUTAxRoQNfJ0lEI4gDI9oknrxTsRfn8IO+JAdysc0zMSWgk07Gzf/YzrMJrExzGmnd3RuE4qjnbetHLfBIpOicmPe6Zp6csXZTAIe1dtU4x0s//RUk9nWGyXlwJjNUzzbnXgQqdB0DjhfpQPvEAAA==',
  'vanity': 'data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAABQBACdASoQABgAPu1iqU2ppaOiMAgBMB2JQBOmUGQQCEURV/3upnrirCDwAP7MGop1HGjPCkML6K2ISacL9A37jnixlUX/Lw0gvTKDSjpvL+luiPwW8TwIUF4vOUY8lvph0/FtNkNS801q0/i7yd3PspNsJ332/wGfjcmojTEJ5vKFINdKRB+W4AA=',
  'night-arches': 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAsAA4BaJagCdAEPADyADegA/vhNJFQ+Djtr9uIy2FyJAzIhR16svS/5Wh0bm4IQd7CSmHKupbXgAAA=',
  'night-pool': 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoQAAsAA4BaJbACdADwh2F251gA/u9ozWj+3L0N2DwybdXAKZLmnneWh+LajXNPInvvOrwpI94cp8ddmIXcgX/VR2X69bWGYm0rQAAA',
  'bamboo-night': 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAACwAQCdASoQAAsAA4BaJQBOgCHh2bUwAP71mCimCzDiFrSS+7zJmcP/GFmryJ5vYJiUKz40AAA=',
  'detail': 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoQAAsAA4BaJYgCdAECwCH1ugAA/ulX48IHw9vxcIFdPa0zuFMI3sb5hYNFOYBPe5aubx8NHZvV5A1iMwCsn72wWj8bV4RCCulkOaAA',
  'hero-night': 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAQAgCdASoQAAsAA4BaJbACdAEObyY0OPwIAP72yzN/YwRU+gqwcllO8vVo3h8ZUPQwb1XyCmG8RvcunY2WN8vSGPGLzbIMDFfdNeW+oCf/UEvVN3p+szFmhZqrO4AAAAA=',
  'hero-aerial': 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAsAA4BaJaAC7ACp97Th+AAA/Xg3QfkKEmAU7StYczpTiIEncWDxQvFRiMyDg/DDeildHzYahGHzPk2IRpBwRzNoblPgAAA=',
  'hero-interior': 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQAgCdASoQAAsAA4BaJQBOgBusv8PRHweAAP7b6Jle1rmDb0CwwagH/Fp5K/Rdzf3YAeO4n3ha831mRv+8D7UQF0jW4XweSQV6kINrT03Q8qcTSWAAAA==',
  'hero-bath': 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoQAAsAA4BaJagCdAEPAaAtn6AA/uxL2G2HfQbH6WdV8TO51m6B0hrp8WYcjd//DVavRvKIZDYRpEzk0qV9h00hPYUlB0GmtFRMoAAA',
  'process-sketch': 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAABwAQCdASoQAAwAA4BaJZycAABlYAD+81nt4ZhcL5W3+1XLNiiWv+tOk/9rPvfndm5hmxoYxGQAAA==',
  'process-render': 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoQAAsAA4BaJZwAAxPAv5tKAAD+tTRQghJPbSNJZ4xcb3a/PHICr1cbLiFD3SbjoNMU++g2fWAueTqQDukCqdIQUAA=',
  'process-built': 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABQAgCdASoQAAsAA4BaJQBOgMW+4KyEztr2K0AA/t+mniqTHuMFij9ZGgs+xd0YkrvkAWHrbH0n62fruHR5PcrnKfhKLHreMhXHG7W+XZJy244+b/ONhKGDBKDf1p9ZIAA=',
}

// Maps an image path like '/images/villa-teduh/hero.webp' to its blur data URL.
export function blurFor(src?: string): string | undefined {
  if (!src) return undefined
  const name = src.split('/').pop()?.replace(/\.[^.]+$/, '')
  return name ? BLURS[name] : undefined
}
