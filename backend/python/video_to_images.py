import cv2
import argparse
import os

def detect_faces(video_path, save_image_path, face_id):
    """
    ビデオ内の顔を検出し、検出された顔の画像を保存します。

    Args:
        video_path (str): 動画ファイルへのパス
        save_image_path (str): 顔画像を保存するディレクトリのパス
        face_id (str): 顔を検出する対象者のID

    Returns:
        None
    """
    # classifierの読み込み
    # Path の開始地点はBackendのディレクトリ
    face_cascade = cv2.CascadeClassifier('./python/Cascades/haarcascade_frontalface_default.xml')
    # 使用する動画ファイルのパスを指定
    cap = cv2.VideoCapture(video_path)

    # カメラの設定（サイズなど）
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    # 保存先のディレクトリが存在しない場合は作成する
    if not os.path.exists(f'{save_image_path}/{face_id}'):
        os.makedirs(f'{save_image_path}/{face_id}')
        print(f'Created {save_image_path}/{face_id}')

    for i in range(30):
        ret, frame = cap.read()

        if not ret:
            print("Failed to capture video.")
            break

        # グレースケールに変換
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # 顔の検出設定
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.2,
            minNeighbors=5,
            minSize=(20, 20)
        )

        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]

            # 写真の保存場所
            cv2.imwrite(f"{save_image_path}/{face_id}/{face_id}.{i}.jpg", gray[y:y+h, x:x+w])
            print(f"Saved {save_image_path}/{face_id}/{face_id}.{i}.jpg")

        k = cv2.waitKey(30) & 0xff
        # ESC キーで終了
        if k == 27:
            break


    cap.release()
    cv2.destroyAllWindows()
    print('Done')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='呼び出し元のNodeから引数を受け取る')
    parser.add_argument('video_path', type=str, help='動画のパス')
    parser.add_argument('save_image_path', type=str, help='画像の保存先')
    parser.add_argument('face_id', type=str, help='顔を検出する対象者のID')

    # 引数の解析
    args = parser.parse_args()

    video_path = args.video_path
    save_image_path = args.save_image_path
    face_id = args.face_id


    detect_faces(video_path, save_image_path, face_id)
