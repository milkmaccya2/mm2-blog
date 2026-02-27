# Privacy Policy & Terms of Use Pages — Design Doc

Date: 2026-02-25

## Background

Adding GTM and affiliate links (Amazon Associates + Rakuten Affiliate) to the blog requires:
- Privacy policy disclosing data collection and affiliate usage
- Terms of use page for general legal coverage
- Footer links for visibility

Relevant regulations:
- 個人情報保護法 (Japan Personal Information Protection Act)
- 景品表示法 ステルスマーケティング規制 (Stealth Marketing Regulations, Oct 2023)
- Amazon Associates Operating Agreement (requires disclosure text)

## Approach

Static Astro pages (Approach A) — same pattern as `about.astro`, using `BaseLayout.astro`.

## Pages to Create

### `/privacy` — プライバシーポリシー

Sections:
1. 個人情報の取得について — Cookie・アクセスログによるデータ収集の明示
2. アクセス解析ツールについて — GTM / Google Analytics 使用の開示
3. アフィリエイトについて — Amazon・楽天の説明 + 必須免責文
4. 広告配信について — 第三者Cookie（Googleなど）への言及
5. お問い合わせ — メールアドレス

### `/terms` — 利用規約

Sections:
1. 免責事項 — 情報の正確性・損害について
2. 著作権 — コンテンツの権利帰属
3. リンクについて — 外部リンクへの免責
4. 変更について — 規約変更の告知方法

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/privacy.astro` | Create |
| `src/pages/terms.astro` | Create |
| `src/components/Footer.astro` | Modify — add links |
| `src/layouts/BaseLayout.astro` | Modify — add `privacy`/`terms` to `SEGMENT_LABELS` |

## Footer Change

```
© 2025 milkmaccya. All rights reserved.
[SNS links]
[プライバシーポリシー] [利用規約]   ← add
```
