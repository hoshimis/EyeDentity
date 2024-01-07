import cv2
import numpy as np
from PIL import Image
import io,sys, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer,encoding='utf-8')



# 写真が保存されている場所のパス
path = os.path.join(str(os.path.dirname(__file__)), './../downloads/123')

# 顔認識アルゴリズムを初期化
recognizer = cv2.face.LBPHFaceRecognizer_create()
print(str(os.path.dirname(__file__)))


# 分類器の読み込み
faceCascade = cv2.CascadeClassifier(os.path.join(str(os.path.dirname(__file__)), 'Cascades/haarcascade_frontalface_default.xml'))



# 画像とラベルデータを取得する関数
def getImagesAndLabels(path):
    imagePaths = [os.path.join(path, f) for f in os.listdir(path)]  
    faceSamples = []
    ids = []
    for imagePath in imagePaths:
        PIL_img = Image.open(imagePath).convert('L') 
        img_numpy = np.array(PIL_img, 'uint8') 
        id = int(os.path.split(imagePath)[-1].split(".")[0]) 
        faces = faceCascade.detectMultiScale(img_numpy) 
        for (x, y, w, h) in faces:
            faceSamples.append(img_numpy[y:y+h, x:x+w])
            ids.append(id)
    return faceSamples, ids

print("トレーニング中…")
faces, ids = getImagesAndLabels(path)
recognizer.train(faces, np.array(ids))

# トレーニングされたモデルをymlファイルに保存
recognizer.save(os.path.join(str(os.path.dirname(__file__)),"./../training/trainer.yml"))


# 成功メッセージを表示
print("アップロードが完了しました。")

