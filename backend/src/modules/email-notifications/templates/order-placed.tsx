import { Text, Section, Hr } from '@react-email/components'
import * as React from 'react'
import { Base } from './base'
import { OrderDTO, OrderAddressDTO } from '@medusajs/framework/types'

export const ORDER_PLACED = 'order-placed'

interface OrderPlacedPreviewProps {
  order: OrderDTO & { display_id: string; summary: { raw_current_order_total: { value: number } } }
  shippingAddress: OrderAddressDTO
}

export interface OrderPlacedTemplateProps {
  order: OrderDTO & { display_id: string; summary: { raw_current_order_total: { value: number } } }
  shippingAddress: OrderAddressDTO
  preview?: string
}

export const isOrderPlacedTemplateData = (data: any): data is OrderPlacedTemplateProps =>
  typeof data.order === 'object' && typeof data.shippingAddress === 'object'

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
 * NOTE: This should match the mapping in storefront/src/lib/util/money.ts
 * To add more countries, add them to both files to keep formatting consistent.
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

export const OrderPlacedTemplate: React.FC<OrderPlacedTemplateProps> & {
  PreviewProps: OrderPlacedPreviewProps
} = ({ order, shippingAddress, preview = 'Your order has been placed!' }) => {
  // Use shipping address country code to determine locale formatting
  const locale = shippingAddress.country_code
    ? getLocaleFromCountryCode(shippingAddress.country_code)
    : 'en-US'

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
    }).format(amount)
  }

  return (
    <Base preview={preview}>
      <Section>
        <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 30px' }}>
          Order Confirmation
        </Text>

        <Text style={{ margin: '0 0 15px' }}>
          Dear {shippingAddress.first_name} {shippingAddress.last_name},
        </Text>

        <Text style={{ margin: '0 0 30px' }}>
          Thank you for your recent order! Here are your order details:
        </Text>

        <Text style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' }}>
          Order Summary
        </Text>
        <Text style={{ margin: '0 0 5px' }}>
          Order ID: {order.id}
        </Text>
        <Text style={{ margin: '0 0 5px' }}>
          Order Date: {new Date(order.created_at).toLocaleDateString()}
        </Text>
        <Text style={{ margin: '0 0 20px' }}>
          Total: {formatCurrency(Number(order.summary.current_order_total), order.currency_code)}
        </Text>

        <Hr style={{ margin: '20px 0' }} />

        <Text style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' }}>
          Shipping Address
        </Text>
        <Text style={{ margin: '0 0 5px' }}>
          {shippingAddress.address_1}
        </Text>
        <Text style={{ margin: '0 0 5px' }}>
          {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postal_code}
        </Text>
        <Text style={{ margin: '0 0 20px' }}>
          {shippingAddress.country_code}
        </Text>

        <Hr style={{ margin: '20px 0' }} />

        <Text style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 15px' }}>
          Order Items
        </Text>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
          margin: '10px 0'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Item</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Quantity</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {item.title} - {item.product_title}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>
                  {formatCurrency(Number(item.unit_price), order.currency_code)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </Base>
  )
}

OrderPlacedTemplate.PreviewProps = {
  order: {
    id: 'test-order-id',
    display_id: 'ORD-123',
    created_at: new Date().toISOString(),
    email: 'test@example.com',
    currency_code: 'USD',
    items: [
      { id: 'item-1', title: 'Item 1', product_title: 'Product 1', quantity: 2, unit_price: 10 },
      { id: 'item-2', title: 'Item 2', product_title: 'Product 2', quantity: 1, unit_price: 25 }
    ],
    shipping_address: {
      first_name: 'Test',
      last_name: 'User',
      address_1: '123 Main St',
      city: 'Anytown',
      province: 'CA',
      postal_code: '12345',
      country_code: 'US'
    },
    summary: { raw_current_order_total: { value: 45 } }
  },
  shippingAddress: {
    first_name: 'Test',
    last_name: 'User',
    address_1: '123 Main St',
    city: 'Anytown',
    province: 'CA',
    postal_code: '12345',
    country_code: 'US'
  }
} as OrderPlacedPreviewProps

export default OrderPlacedTemplate
