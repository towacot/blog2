// 🔽【変更点1】require を import に変更
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

// 🔽【変更点2】ES Moduleで __dirname を使えるようにするための記述
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --- 設定項目 ---
const csvFilePath = './scripts/csv/posts.csv'; 
const outputDir = path.join(__dirname, '../src/content/blog');
// --- 設定はここまで ---

// 出力ディレクトリがなければ作成する
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // CSVの各行のデータ (row) を使って処理を行う

    // 1. ファイル名を生成 (idを使うのが確実)
    const fileName = `${row.id}.md`;
    
    // 2. 本文を 'description' カラムから取得
    const content = row.description || '';

    // 3. フロントマターを作成
    //    要約(description)には、本文の冒頭120文字を抜粋して設定
    const summary = content.substring(0, 120).replace(/\r?\n/g, ' ').trim() + '...';

    const frontmatter = `---
title: '${row.title.replace(/'/g, "''")}'
description: '${summary.replace(/'/g, "''")}'
pubDate: '${new Date(row.created_at).toISOString().split('T')[0]}'
updatedDate: '${new Date(row.updated_at).toISOString().split('T')[0]}'
heroImage: ''
---
`;

    // 4. ファイルを書き出す (フロントマターと本文を結合)
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, frontmatter + '\n' + content);

    console.log(`✅ Generated: ${fileName}`);
  })
  .on('end', () => {
    console.log('\n移行処理が完了しました。');
    console.log(`Markdownファイルは ${outputDir} に出力されました。`);
  });