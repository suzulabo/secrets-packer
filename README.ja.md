# Secrets Packer

Github の Secrets に入れたいファイルや値が増えてしまったため、ひとまとめにしたくて作成しました。

以下のような機能があります。

- 複数のファイルをまとめて圧縮し、Base64 の文字列に変換
- ファイルの展開と配置
- set-output のワークフローコマンドで値を出力
- 設定ミス防止チェック

### 設定ミス防止チェック

別プロジェクト、本番・ステージング環境違いなど、別の設定を間違って Secrets に設定してしまっても、実行時にエラーになるようにする保護機能です。

## 使い方

作成中)

(参考)
https://github.com/suzulabo-pro/announcing/blob/main/scripts/secrets/index.ts
