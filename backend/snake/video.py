import cv2
import numpy as np
import pygame as pg
from pygame import surfarray


def pg_to_cv2(cvarray: np.ndarray) -> np.ndarray:
    cvarray = cvarray.swapaxes(0, 1)  # rotate
    cvarray = cv2.cvtColor(cvarray, cv2.COLOR_RGB2BGR)  # RGB to BGR
    return cvarray


def save_frames(frames: list, average_dt: float | list, file_type: str = "mp4", name: str = "screen_recording"):
    if type(average_dt) is list:
        # force average_dt to be a float
        average_dt = sum(average_dt)/len(average_dt)
    size = frames[0].get_size()
    codec_dict = {
        "avi": 'DIVX',
        "mp4": 'mp4v',
    }
    codec = cv2.VideoWriter_fourcc(*codec_dict[file_type])
    # file_name, codec, average_fps, dimensions
    video = cv2.VideoWriter(name+"."+file_type, codec, 1000/average_dt, size)
    for frame in frames:
        try:
            # convert the surface to a np array. Only works with depth 24 or 32, not less
            pg_frame = surfarray.pixels3d(frame)
        except:
            # convert the surface to a np array. Works with any depth
            pg_frame = surfarray.array3d(frame)
        # then convert the np array so it is compatible with opencv
        cv_frame = pg_to_cv2(pg_frame)
        video.write(cv_frame)  # write the frame to the video using opencv
    video.release()  # release the video from opencv
    print(f"Video saved as {name}.{file_type}")
