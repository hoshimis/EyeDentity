import cv2
import os


def split_video_to_images(input_video, output_dir, num_frames=30):
    cap = cv2.VideoCapture(input_video)
    frame_count = 0

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        if frame_count % (cap.get(cv2.CAP_PROP_FRAME_COUNT) // num_frames) == 0:
            image_filename = os.path.join(output_dir, f'frame_{frame_count:04d}.jpg')
            cv2.imwrite(image_filename, frame)

    cap.release()
    cv2.destroyAllWindows()

def main():
  pass


if __name__ == '__main__':
  main()