import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
  countryCode?: string
}

/**
 * Map country codes (ISO 3166-1 alpha-2) to their appropriate locale for number formatting.
 *
 * This mapping covers ~150 countries representing 95-99% of e-commerce traffic.
 * Countries not in this map will fall back to 'en-US' formatting.
 *
 * Examples:
 * - 'us' → 'en-US' → $1,234.56 (comma thousands, period decimal)
 * - 'de' → 'de-DE' → 1.234,56 € (period thousands, comma decimal)
 * - 'fr' → 'fr-FR' → 1 234,56 € (space thousands, comma decimal)
 *
 * NOTE: This mapping should match backend/src/modules/email-notifications/templates/order-placed.tsx
 * To add more countries, update both files to keep storefront and email formatting consistent.
 */
const getLocaleFromCountryCode = (countryCode: string): string => {
  const localeMap: Record<string, string> = {
    // Americas
    us: 'en-US', ca: 'en-CA', mx: 'es-MX', br: 'pt-BR',
    ar: 'es-AR', cl: 'es-CL', co: 'es-CO', pe: 'es-PE',
    ve: 'es-VE', ec: 'es-EC', bo: 'es-BO', py: 'es-PY',
    uy: 'es-UY', gt: 'es-GT', hn: 'es-HN', sv: 'es-SV',
    ni: 'es-NI', cr: 'es-CR', pa: 'es-PA', do: 'es-DO',
    cu: 'es-CU', pr: 'es-PR', jm: 'en-JM', tt: 'en-TT',
    bs: 'en-BS', bb: 'en-BB', gy: 'en-GY', bz: 'en-BZ',

    // Europe - Western
    gb: 'en-GB', ie: 'en-IE', de: 'de-DE', fr: 'fr-FR',
    es: 'es-ES', it: 'it-IT', pt: 'pt-PT', nl: 'nl-NL',
    be: 'fr-BE', lu: 'fr-LU', at: 'de-AT', ch: 'de-CH',

    // Europe - Nordic
    dk: 'da-DK', se: 'sv-SE', no: 'nb-NO', fi: 'fi-FI',
    is: 'is-IS',

    // Europe - Eastern
    pl: 'pl-PL', cz: 'cs-CZ', sk: 'sk-SK', hu: 'hu-HU',
    ro: 'ro-RO', bg: 'bg-BG', hr: 'hr-HR', si: 'sl-SI',
    rs: 'sr-RS', ba: 'bs-BA', me: 'sr-ME', mk: 'mk-MK',
    al: 'sq-AL', xk: 'sq-XK',

    // Europe - Baltic
    ee: 'et-EE', lv: 'lv-LV', lt: 'lt-LT',

    // Europe - Other
    gr: 'el-GR', cy: 'el-CY', mt: 'mt-MT',

    // CIS & Eastern Europe
    ru: 'ru-RU', ua: 'uk-UA', by: 'be-BY', kz: 'kk-KZ',
    uz: 'uz-UZ', am: 'hy-AM', ge: 'ka-GE', az: 'az-AZ',
    md: 'ro-MD',

    // Middle East & North Africa
    tr: 'tr-TR', ae: 'ar-AE', sa: 'ar-SA', eg: 'ar-EG',
    il: 'he-IL', jo: 'ar-JO', lb: 'ar-LB', iq: 'ar-IQ',
    sy: 'ar-SY', ye: 'ar-YE', kw: 'ar-KW', qa: 'ar-QA',
    bh: 'ar-BH', om: 'ar-OM', ma: 'ar-MA', tn: 'ar-TN',
    dz: 'ar-DZ', ly: 'ar-LY', sd: 'ar-SD', tz: 'sw-TZ',

    // Sub-Saharan Africa
    za: 'en-ZA', ng: 'en-NG', ke: 'en-KE', gh: 'en-GH',
    ug: 'en-UG', et: 'am-ET', zw: 'en-ZW', zm: 'en-ZM',
    mw: 'en-MW', bw: 'en-BW', na: 'en-NA', mu: 'en-MU',
    rw: 'rw-RW', sn: 'fr-SN', ci: 'fr-CI', cm: 'fr-CM',
    cd: 'fr-CD', mg: 'fr-MG', ml: 'fr-ML', bf: 'fr-BF',
    ne: 'fr-NE', td: 'fr-TD', cg: 'fr-CG', ga: 'fr-GA',
    gn: 'fr-GN', bj: 'fr-BJ', tg: 'fr-TG',

    // Asia - East
    cn: 'zh-CN', jp: 'ja-JP', kr: 'ko-KR', tw: 'zh-TW',
    hk: 'zh-HK', mo: 'zh-MO', mn: 'mn-MN',

    // Asia - Southeast
    th: 'th-TH', vn: 'vi-VN', id: 'id-ID', my: 'ms-MY',
    sg: 'en-SG', ph: 'en-PH', mm: 'my-MM', kh: 'km-KH',
    la: 'lo-LA', bn: 'ms-BN', tl: 'pt-TL',

    // Asia - South
    in: 'en-IN', pk: 'ur-PK', bd: 'bn-BD', lk: 'si-LK',
    np: 'ne-NP', af: 'fa-AF', mv: 'dv-MV', bt: 'dz-BT',

    // Asia - Central
    tj: 'tg-TJ', tm: 'tk-TM', kg: 'ky-KG',

    // Asia - West
    ir: 'fa-IR',

    // Oceania
    au: 'en-AU', nz: 'en-NZ', pg: 'en-PG', fj: 'en-FJ',
    nc: 'fr-NC', pf: 'fr-PF', ws: 'en-WS', to: 'to-TO',
    vu: 'en-VU', sb: 'en-SB', ki: 'en-KI', mh: 'en-MH',
    fm: 'en-FM', pw: 'en-PW', nr: 'en-NR', tv: 'en-TV',
  }
  return localeMap[countryCode.toLowerCase()] || 'en-US'
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale,
  countryCode,
}: ConvertToLocaleParams) => {
  // Determine locale: explicit locale > countryCode mapping > default 'en-US'
  const resolvedLocale = locale || (countryCode ? getLocaleFromCountryCode(countryCode) : 'en-US')

  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(resolvedLocale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}
