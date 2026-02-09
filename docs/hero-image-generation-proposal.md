# ブログ記事トップ画像生成の検討ドキュメント

作成日: 2026-02-09

## 現在の状況

### 既存の実装
- `heroImage`フィールドがContent Collectionのスキーマに定義済み（optional）
- [src/assets/](../src/assets/)に各記事用の画像を手動配置
- 現在は「nano banana pro」を使って手動で画像生成
- 画像形式: JPG/PNG混在
- ファイルサイズ: 51KB〜9MB（最適化の余地あり）

### 課題
- 画像生成が手動作業で時間がかかる
- ファイルサイズの最適化が不十分
- 画像がない記事のフォールバック処理が未定義

---

## 提案する選択肢

### 選択肢1: OGP画像自動生成（テンプレートベース）

#### 概要
`@vercel/og`または`satori`を使用し、記事のタイトル・説明文から自動的にOGP画像を生成する。

#### 技術スタック
- **@vercel/og**: Vercel公式のOGP画像生成ライブラリ
- **satori**: HTMLとCSSからSVGに変換し、PNG化
- **Astro Endpoint**: ビルド時またはリクエスト時に画像生成

#### 実装イメージ
```typescript
// src/pages/og/[slug].png.ts
export async function GET({ params }) {
  const post = await getEntry('blog', params.slug);
  return new ImageResponse(
    <div style={{...}}>
      <h1>{post.data.title}</h1>
      <p>{post.data.description}</p>
    </div>
  );
}
```

#### メリット
- ✅ 完全自動化（記事を書くだけで画像生成）
- ✅ コストゼロ
- ✅ デザインの一貫性が保てる
- ✅ ビルドサイズの削減（動的生成の場合）
- ✅ ファイルサイズが小さい（最適化済み）

#### デメリット
- ❌ デザインがテンプレート的で画一的
- ❌ 表現力が限定的
- ❌ 初期セットアップが必要

#### 推定工数
- 初回実装: 4〜8時間
- テンプレートデザイン調整: 2〜4時間

---

### 選択肢2: AI画像生成API統合

#### 概要
画像生成AIのAPIを使用し、記事の内容から自動的に画像を生成。

#### 技術スタック候補
- **Stable Diffusion API** (Replicate, Stability AI)
- **DALL-E API** (OpenAI)
- **Midjourney API** (Discord Bot経由)

#### 実装イメージ
```javascript
// scripts/generate-hero-images.js
const prompt = generatePromptFromArticle(article);
const image = await stableDiffusion.generate(prompt);
await sharp(image).resize(1200, 630).toFile(`src/assets/${slug}.jpg`);
```

#### メリット
- ✅ クリエイティブで多様な画像生成
- ✅ 記事内容に合わせたビジュアル
- ✅ プロンプト調整で品質向上可能

#### デメリット
- ❌ APIコストが発生（1画像あたり$0.01〜$0.10程度）
- ❌ 生成時間がかかる（5秒〜30秒/枚）
- ❌ 品質にバラつきがある
- ❌ API制限に注意が必要

#### 推定コスト
- 週1記事の場合: 月額$0.50〜$5程度
- ビルドごとに再生成する場合: コストが増加

#### 推定工数
- API統合: 4〜6時間
- プロンプトエンジニアリング: 継続的

---

### 選択肢3: 手動生成の改善＋自動化補助

#### 概要
現在の手動生成フローを維持しつつ、画像最適化とチェックを自動化。

#### 実装内容
1. **画像の自動最適化**
   - sharpを使ったリサイズ・圧縮（ビルド時）
   - WebP形式への変換
   - 目標サイズ: 200KB以下

2. **画像存在チェック**
   - GitHub ActionsでheroImageが存在するか確認
   - 欠落時は警告またはデフォルト画像設定

3. **画像生成ワークフローの文書化**
   - nano banana proの使用方法
   - 推奨サイズ・形式のガイドライン

#### 実装イメージ
```javascript
// scripts/optimize-images.js
const images = await glob('src/assets/*.{jpg,png}');
for (const img of images) {
  await sharp(img)
    .resize(1200, 630, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(img.replace(/\.(jpg|png)$/, '.webp'));
}
```

#### メリット
- ✅ クリエイティブな自由度を維持
- ✅ 既存の画像資産を活用
- ✅ 実装コストが最小
- ✅ ファイルサイズを大幅削減

#### デメリット
- ❌ 記事作成時に手動作業が必要
- ❌ 作業の属人化リスク

#### 推定工数
- 画像最適化スクリプト: 2〜3時間
- CI/CD統合: 1〜2時間
- ドキュメント作成: 1時間

---

### 選択肢4: ハイブリッド方式

#### 概要
デフォルトはテンプレート自動生成、重要な記事は手動で画像を差し替え可能にする。

#### 実装方針
- heroImageが指定されている場合: 手動画像を使用
- heroImageが未指定の場合: 自動生成画像を使用

#### 実装イメージ
```astro
---
const heroImage = post.data.heroImage
  ?? `/og/${post.slug}.png`; // 自動生成エンドポイント
---
<img src={heroImage} alt={post.data.title} />
```

#### メリット
- ✅ 柔軟性が高い
- ✅ 段階的な移行が可能
- ✅ 重要記事にはこだわれる

#### デメリット
- ❌ 実装が最も複雑
- ❌ 管理コストが増える

#### 推定工数
- 選択肢1 + 選択肢3の合計

---

## 推奨アプローチ

### 短期的推奨: **選択肢3（手動生成の改善）**
**理由**:
- 最小の工数で最大の効果（画像最適化で大幅なパフォーマンス改善）
- 既存の画像資産を無駄にしない
- nano banana proでの生成クオリティを維持

### 中長期的推奨: **選択肢4（ハイブリッド）**
**理由**:
- 選択肢3で基盤を整えた後、選択肢1を追加実装
- 将来的にAI生成も選択肢に入れやすい
- 最も柔軟で拡張性が高い

---

## 次のステップ

1. **方針決定**: 上記の選択肢から優先度を決定
2. **技術検証**: 選択した方法のPoC実装
3. **実装**: 本番環境への適用
4. **ドキュメント整備**: 運用ガイドの作成

---

## 参考リンク

- [@vercel/og Documentation](https://vercel.com/docs/functions/og-image-generation)
- [Satori GitHub](https://github.com/vercel/satori)
- [Astro Image Optimization](https://docs.astro.build/en/guides/images/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
