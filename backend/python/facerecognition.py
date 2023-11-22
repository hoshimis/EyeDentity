import cv2
import numpy as np
import os 

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read("C:\\Users\\s212098.TSITCL\\Desktop\\training\\trainer.yml")
faceCascade = cv2.CascadeClassifier('./Cascades/haarcascade_frontalface_default.xml')

font = cv2.FONT_HERSHEY_SIMPLEX

# idの初期化
id = 0

#  顔のIDに関連付けられた名前のリストを作成
names = ['None', 'Taiyo','masahiro']  

# 使用するカメラのデバイス番号を指定(デフォルトのカメラの場合は0)
cam = cv2.VideoCapture(0)
cam.set(3, 640) # set video widht
cam.set(4, 480) # set video height

minW = 0.1*cam.get(3)# 顔として認識される最小の幅を設定
minH = 0.1*cam.get(4)# 顔として認識される最小の高さを設定

while True:
    ret, img =cam.read()
    img = cv2.flip(img, 1) # 画像を垂直方向に反転
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    
    # 顔の検出
    faces = faceCascade.detectMultiScale( 
        gray,
        scaleFactor = 1.2,
        minNeighbors = 5,
        minSize = (int(minW), int(minH)),
)

    for(x,y,w,h) in faces:
        cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2) # 画面上に青い四角を顔の周りに描画
        id, confidence = recognizer.predict(gray[y:y+h,x:x+w])# 一致したidと信頼度の代入?
        
        # 顔の判定
        if (confidence < 60):
            id = names[id] # IDに関連付けられた名前を取得
        else:
            id = "unknown"
        
        cv2.putText(img, str(id), (x+5,y-5), font, 1, (255,255,255), 2) # 名前を表示
        
    cv2.imshow('camera',img) 
    
    # ESC キーで終了
    k = cv2.waitKey(10) & 0xff 
    if k == 27:
        break

cam.release()
cv2.destroyAllWindows()