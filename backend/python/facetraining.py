import cv2
import numpy as np
from PIL import Image
import os
from google.cloud import storage

# Google Cloud Storageの資格情報ファイルへのパス
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./../serviceAccountKey.json"

# 写真が保存されている場所のパス
path = "C:\\Users\\s212098.TSITCL\\Desktop\\facefolder\\"

# 顔認識アルゴリズムを初期化
recognizer = cv2.face.LBPHFaceRecognizer_create()
# 分類器の読み込み
faceCascade = cv2.CascadeClassifier('Cascades/haarcascade_frontalface_default.xml')

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
recognizer.save("trainer.yml")

# YAMLファイルをGoogle Cloud Storageにアップロード
bucket_name = "eyedentity-af8b1.appspot.com/"
storage_client = storage.Client()
bucket = storage_client.bucket(bucket_name)
blob = bucket.blob("liveid/trainer.yml")
blob.upload_from_filename("trainer.yml")

# 成功メッセージを表示
print("モデルの保存とアップロードが完了しました。")
