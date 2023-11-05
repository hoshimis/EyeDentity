import numpy as np
import cv2

#* 参考: https://www.hackster.io/mjrobot/real-time-face-recognition-an-end-to-end-project-a10826


# classifierの読み込み
faceCascade = cv2.CascadeClassifier('Cascades/haarcascade_frontalface_default.xml')

# 使用するカメラのデバイス番号を指定(デフォルトのカメラの場合は0)
cap = cv2.VideoCapture(0)
# set Width
cap.set(3,640)
# set Height
cap.set(4,480)

while(True):
    ret, frame = cap.read()
    # 向きの設定
    img = cv2.flip(frame, -1)
    # グレースケールに変換
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # 顔の検出設定
    faces = faceCascade.detectMultiScale(
        # グレースケール画像
        gray,
        # 画像縮小スケール
        scaleFactor=1.2,
        # 近傍の数
        minNeighbors=5,
        # 最小サイズ
        minSize=(20, 20)
    )

    # 顔の検出
    # * 参考: https://hackster.imgix.net/uploads/attachments/437984/coordinates_iFdFWEY0NK.png?auto=compress%2Cformat&w=740&h=555&fit=max
    for (x,y,w,h) in faces:
      cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
      roi_gray = gray[y:y+h, x:x+w]
      roi_color = img[y:y+h, x:x+w]

    cv2.imshow('video', img)

    k = cv2.waitKey(30) & 0xff
    # ESC キーで終了
    if k == 27:
        break
cap.release()
cv2.destroyAllWindows()