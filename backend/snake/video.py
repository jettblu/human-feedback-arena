import imageio
import numpy as np


def save_animation(frames, file_name, fps=24):
    # add gif extension if not there
    if file_name[-4:] != ".gif":
        file_name += ".gif"
    print("Writing animation file")
    with imageio.get_writer(file_name, mode="I", fps=fps) as writer:
        for frame in frames:
            writer.append_data(frame)
    print(f"Animation saved as {file_name}")
    return file_name
