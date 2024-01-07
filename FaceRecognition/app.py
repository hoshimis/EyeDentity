from flask import Flask, render_template
from flask_socketio import SocketIO, join_room
from flask_cors import CORS
import base64, os
import cv2
import numpy as np



basedir = os.path.abspath(os.path.dirname(__file__))


# FlaskとSocketIOのインスタンスを生成
app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SECRET_KEY='dev',
    JSON_AS_ASCII=False,
)
socketio = SocketIO(app, cors_allowed_origins="*")
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recognition')
def recognition():
    return render_template('recognition.html')


# クライアントとのコネクション確立
# クライアントのコールバック関数を指定してそのコールバック関数に第二引数のデータを渡す
@socketio.on('connect')
def handle_connect():
    socketio.emit('client_echo',{'msg': 'server connected!'})
    print('Client connected')

#クライアントからのメッセージを出力する関数
@socketio.on('server_echo')
def handle_server_echo(msg):
    print('echo: ' + str(msg))

# クライアントから切断されたときに出力される
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# クライアントから画像を受け取ったときに出力される
# 複数のクライアントからのリクエストを処理できるようにする
@socketio.on('image')
def handle_image(image_data):
    socketio.start_background_task(process_image, image_data)


# ここで顔認識などの画像処理を行う
def process_image(image_data):
    # Base64データをOpenCVの画像に変換
    image_decoded = base64.b64decode(image_data.split(',')[1])
    image_np = np.frombuffer(image_decoded, dtype=np.uint8)
    frame = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    # ここで顔認識などの画像処理を行う
    # 例: 顔認識
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = cv2.CascadeClassifier('haarcascade_frontalface_default.xml').detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    # 認識した顔に矩形を描画
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

    # 画像をBase64にエンコードしてクライアントに送信
    _, encoded_frame = cv2.imencode('.jpg', frame)
    result_image_data = 'data:image/jpeg;base64,' + base64.b64encode(encoded_frame).decode('utf-8')
    socketio.emit('result_image', result_image_data)

#ルーム作成
@socketio.on('join')
def join(msg):
    join_room(str(msg["room"]))

#ルームに参加しているクライアントへ送信
@socketio.on('send_room')
def send_room(data):
    print(data)
    #ここはクライアントから送られてくるデータを踏まえて、調整するべき部分
    # socketio.emit("from_room",{"msg":data["chat_info"]["user_name"] + ":" + data["chat_info"]["msg"]},to=str(data["to"]))
    message = data["chat_info"]["msg"]
    user = data["chat_info"]["user"]
    to = str(data["to"])
    socketio.emit("from_room",{"msg":message, "user": user},to=to)


if __name__ == '__main__':
    socketio.run(app, port=8088, debug=True)
