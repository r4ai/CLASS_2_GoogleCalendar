# CLASS2GoogleCalendar

CLASS の学生時間割表の内容を GoogleCalendar に登録する。

## Prerequisites

- [Deno](https://deno.land/)

## QuickStart

### カレンダーデータ (iCalender) の作成

次のコマンドを実行する

```sh
deno run --allow-env --allow-read --allow-write https://raw.githubusercontent.com/r4ai/CLASS_2_GoogleCalendar/main/src/main.ts
```

以下のように質問が表示されるので、それぞれ入力し、カレンダーデータを生成する。

```
$ deno run --allow-env --allow-read --allow-write https://raw.githubusercontent.com/r4ai/CLASS_2_GoogleCalendar/main/src/main.ts
? 学生時間割表のHTMLファイルのパスを入力してください
  Edge ならば適当なところを右クリックし、"名前を付けて保存" から保存できる input.html
? 授業開始日を入力してください 2024-04-11
? 授業終了日を入力してください 2024-08-05
? カレンダーの名前を入力してください 時間割
? 出力形式を選択してください iCalender
? 出力ファイルのパスを指定してください output.ics

 Success! output.ics に時間割のカレンダーデータを出力しました。
```

### iCalender の GoogleCalendar へのインポート

"設定" → "インポート/エキスポート" → "インポート" → "パソコンからファイルを選択"
から生成した `output.ics` を選択し、インポートする。

CSV で出力した場合も同様にインポートできる。
