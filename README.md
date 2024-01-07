# EyeDentity

## アプリ概要(全体)

- 顔認証を用いたライブチケット転売防止システムです。
- チケットを購入をユーザが購入する際に、顔認証を行い、チケットの転売を防ぎます。

## アプリ概要(Registration)

- ライブ運営側がライブ情報を登録することで、ユーザがチケットを購入する際に顔認証を行うことができるようになります。
- ライブ運営側は、ライブ情報を登録する際に、ライブのタイトル、ライブの日時、ライブの場所、ライブの URL を登録します。
- ライブの URL は、ユーザがチケットを購入する際に、ユーザに伝える必要があります。

## アプリの流れ(Registration)

- ライブ運営側は、ライブ登録画面でライブ情報を登録します。
  - その際に生成されるライブ URL をユーザに伝えます。
- ユーザ側は運営から伝えられた URL にアクセスしユーザは名前と顔を撮影した動画（1 秒～ 6 秒程度）を送信します。
- 送信されたサーバ側で動画から顔を認識し、顔認識用のファイルを生成します。
- 生成されたファイルをスマートグラスにインストールし、ライブ会場でチケットをもぎる際に顔認証を行います。

## アプリ概要(Face Recognition)

- ユーザがライブ会場に来た際に、スマートグラスをかけて、顔認証を行います。
  - 同時に、認証者の名前や座席番号表示します。
- 顔認証に成功した場合、チケットをもぎることができます。
- 顔認証に失敗した場合、チケットをもぎることができません。
- チケットをもぎることができなかった場合、DB を照合し、顔写真等を確認し、チケットをもぎることができるか判断します。
- 同時に複数の人が顔認証を行うことができます。
- 現場スタッフ同士の連携をより円滑にするために、スマートグラスには、チャット機能を搭載しています。
- チャット機能を用いることで、現場スタッフ同士の連携を円滑にすることができます。

## アプリの流れ(Face Recognition)

- 最初のページで LiveID を入力します。
- 顔認証画面に遷移するので、スマートグラスをかけて、顔認証を行います。
- 同画面に、認証者の名前や座席番号、チャット機能が表示されます。

## 使用技術

- Registration
  - Node.js
  - Express
  - Fairebase Firestore
  - Firebase Storage
  - Python
  - OpenCV
- Face Recognition
  - Python
  - OpenCV
  - Flask
  - Firebase Firestore

## 開発までの流れ(Registration)

1. このリポジトリをクローンします

```bash
git clone https://github.com/hoshimis/EyeDentity.git
```

2. Node.js をインストールします

   1. https://nodejs.org/en/download より Node.js をインストールします

3. 以下のコマンドを実行して、Node.js のライブラリをインストールします

```bash
cd Registration/backend
npm i
```

4. 以下のコマンドを実行して、python の仮想環境を作成と有効化、必要なライブラリをインストールします

```bash
cd python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

5. 新たなライブラリをインストールした場合は、以下のコマンドを実行して、requirements.txt を更新します

```bash
pip freeze > requirements.txt
```

6. 以下のコマンドを実行して、サーバを起動します

```bash
cd ..
npm run start
```

---

## 開発までの流れ(Face Recognition)

１．このリポジトリをクローンします

```bash
git clone https://github.com/hoshimis/EyeDentity.git
```

2. 以下のコマンドを実行して、python の仮想環境を作成と有効化、必要なライブラリをインストールします

```bash
cd FaceRecognition
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

3. 以下のコマンドを実行して、サーバを起動します

```bash
python app.py
```

4. 新たなライブラリをインストールした場合は、以下のコマンドを実行して、requirements.txt を更新します

```bash
pip freeze > requirements.txt
```

### 参考記事

- [[超簡易] Python + Socket 通信で USB カメラから OpenCV キャプチャした映像をサーバーから送信してクライアントプログラムで受信して OpenCV 表示](https://zenn.dev/pinto0309/scraps/101f111b7f4deb)

- [【Python Flask】初心者プログラマーの Web アプリ#3 【Javascript 導入】【画像表示】【CSS 適用】](https://qiita.com/Bashi50/items/f4c2eb42b9cda9b91295)

- [Python×Flask で Socket 通信をする](https://bloom-t.co.jp/blog/article_9233/)
