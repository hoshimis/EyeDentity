# EyeDentity

## アプリ概要

- 顔認証を用いたライブチケット転売システムです。
- チケットを購入をユーザが購入する際に、顔認証を行い、チケットの転売を防ぎます。

## アプリの流れ

- ライブ運営側は、ライブ登録画面でライブ情報を登録します。
  - その際に生成されるライブ URL をユーザに伝えます。
- ユーザ側は運営から伝えられた URL にアクセスしユーザは名前と顔を撮影した動画（1 秒～ 6 秒程度）を送信します。
- 送信されたサーバ側で動画から顔を認識し、顔認識用のファイルを生成します。
- 生成されたファイルをスマートグラスにインストールし、ライブ会場でチケットをもぎる際に顔認証を行います。
-

## 使用技術

- pass

## 貢献方法（Web アプリ）

1. このリポジトリをクローンします

```bash
git clone https://github.com/hoshimis/EyeDentity.git
```

2. Node.js をインストールします

   1. https://nodejs.org/en/download より Node.js をインストールします

3. 以下のコマンドを実行して、Node.js のライブラリをインストールします

```bash
cd backend
npm i
```

4. 以下のコマンドを実行して、python の仮想環境を作成と有効化、必要なライブラリをインストールします

```bash
cd python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

5. 以下のコマンドを実行して、サーバを起動します

```bash
cd ..
npm run start
```

## 貢献方法（スマートグラスアプリ）

1. androidSDK をインストールします

   1. https://developer.android.com/studio/releases/platform-tools?hl=ja より androidSDK をインストールします

2. MoverioSDK を プロジェクトに組み込みます
3. 開発スタート
