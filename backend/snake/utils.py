def action_encoder(action):
    if action == "straight":
        return [1, 0, 0]
    elif action == "right":
        return [0, 1, 0]
    elif action == "left":
        return [0, 0, 1]
