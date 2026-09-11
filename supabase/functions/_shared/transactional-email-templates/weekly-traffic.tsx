import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
  Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Item {
  label: string
  count: number
}

interface WeeklyTrafficProps {
  periodLabel?: string
  visitors?: number
  pageviews?: number
  clicks?: number
  visitorsPrev?: number
  pageviewsPrev?: number
  topPages?: Item[]
  topSources?: Item[]
  topClicks?: Item[]
  statsUrl?: string
}

const text = { color: '#334155', fontSize: '14px', lineHeight: '22px', margin: '0 0 8px' }
const label = {
  color: '#64748b',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px',
}

function delta(now: number, prev: number) {
  if (!prev) return ''
  const pct = Math.round(((now - prev) / prev) * 100)
  return `${pct >= 0 ? '+' : ''}${pct}% vs previous week`
}

function List({ title, items }: { title: string; items: Item[] }) {
  return (
    <Section style={{ margin: '0 0 20px' }}>
      <Text style={label}>{title}</Text>
      {items.length === 0 ? (
        <Text style={text}>No data</Text>
      ) : (
        items.map((i) => (
          <Text key={i.label} style={text}>
            {i.label} - {i.count}
          </Text>
        ))
      )}
    </Section>
  )
}

export const WeeklyTraffic = ({
  periodLabel = 'last 7 days',
  visitors = 0,
  pageviews = 0,
  clicks = 0,
  visitorsPrev = 0,
  pageviewsPrev = 0,
  topPages = [],
  topSources = [],
  topClicks = [],
  statsUrl = 'https://conorbliss.com/stats',
}: WeeklyTrafficProps) => (
  <Html>
    <Head />
    <Preview>{`${visitors} visitors and ${pageviews} page views in the ${periodLabel}`}</Preview>
    <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '24px 0' }}>
      <Container style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '28px', maxWidth: '560px' }}>
        <Text style={label}>Weekly traffic</Text>
        <Heading style={{ color: '#0f172a', fontSize: '22px', margin: '0 0 20px' }}>
          conorbliss.com, {periodLabel}
        </Heading>

        <Row>
          <Column>
            <Text style={label}>Visitors</Text>
            <Text style={{ ...text, fontSize: '26px', color: '#0f172a' }}>{visitors}</Text>
            <Text style={{ ...text, fontSize: '12px' }}>{delta(visitors, visitorsPrev)}</Text>
          </Column>
          <Column>
            <Text style={label}>Page views</Text>
            <Text style={{ ...text, fontSize: '26px', color: '#0f172a' }}>{pageviews}</Text>
            <Text style={{ ...text, fontSize: '12px' }}>{delta(pageviews, pageviewsPrev)}</Text>
          </Column>
          <Column>
            <Text style={label}>Link clicks</Text>
            <Text style={{ ...text, fontSize: '26px', color: '#0f172a' }}>{clicks}</Text>
          </Column>
        </Row>

        <Hr style={{ borderColor: '#e2e8f0', margin: '24px 0' }} />

        <List title="Top pages" items={topPages} />
        <List title="Where visitors came from" items={topSources} />
        <List title="Link clicks" items={topClicks} />

        <Hr style={{ borderColor: '#e2e8f0', margin: '24px 0' }} />
        <Text style={{ ...text, fontSize: '12px' }}>
          <Link href={statsUrl} style={{ color: '#3b6ea5' }}>
            Open the full stats page
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WeeklyTraffic,
  displayName: 'Weekly traffic report',
  subject: (data: Record<string, any>) =>
    `conorbliss.com weekly traffic: ${data?.visitors ?? 0} visitors`,
  previewData: {
    periodLabel: 'last 7 days',
    visitors: 42,
    pageviews: 96,
    clicks: 7,
    visitorsPrev: 31,
    pageviewsPrev: 80,
    topPages: [{ label: '/', count: 80 }, { label: '/stats', count: 16 }],
    topSources: [{ label: 'linkedin.com', count: 22 }, { label: 'Direct', count: 18 }],
    topClicks: [{ label: 'email_click', count: 4 }, { label: 'linkedin_click', count: 3 }],
  },
} satisfies TemplateEntry
