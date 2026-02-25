export interface NoteArticle {
  title: string;
  url: string;
  pubDate: string;
  description?: string;
  isPaid: boolean;
}

export const NOTES: NoteArticle[] = [
  {
    title: '双子のヘルメット治療、重症診断からCVAI10.9%→1.6%まで改善した60日間の記録',
    url: 'https://note.com/milkmaccya2/n/nceab3762a3ee',
    pubDate: '2026-02-25',
    description:
      '双子の兄の「向き癖」が気になり始めたのは、生後1ヶ月半頃のことでした。自分たちなりに対策を続けましたが改善せず、大学病院の専門外来で斜頭「重症」と診断されました。そこからヘルメット治療（ベビーバンド）を開始し、CVAI（頭の非対称スコア）10.9%→1.6% まで改善し、約60日間（生後3ヶ月〜5ヶ月の間）で治療を完了しました。',
    isPaid: true,
  },
];
