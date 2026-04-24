import copy

DEFAULT_DEPTH = 3

DEFAULT_STATE = {
    "player1": {"position": [2, 0], "orientation": "W"},
    "player2": {"position": [1, 3], "orientation": "E"},
    "neutral": [[0, 0], [3, 3]],
    "turn": 1,
    "move_count": 0,
    "last_player_move": None,
    "last_cpu_move": None,
    "result": None,
    "history": [],
}

ORIENTATIONS = {
    "N": {
        "E": [(0, 0), (-1, 0), (-2, 0), (0, -1)],
        "W": [(0, 0), (1, 0), (2, 0), (0, -1)],
    },
    "E": {
        "N": [(0, 0), (0, 1), (0, 2), (1, 0)],
        "S": [(0, 0), (0, -1), (0, -2), (1, 0)],
    },
    "S": {
        "E": [(0, 0), (-1, 0), (-2, 0), (0, 1)],
        "W": [(0, 0), (1, 0), (2, 0), (0, 1)],
    },
    "W": {
        "N": [(0, 0), (0, 1), (0, 2), (-1, 0)],
        "S": [(0, 0), (0, -1), (0, -2), (-1, 0)],
    },
}


def clone_state(state):
    return copy.deepcopy(state)


def new_game():
    state = clone_state(DEFAULT_STATE)
    state["history"] = opening_history(state)
    return state


def reset_game():
    return new_game()


def get_secondary_orientation(position, orientation):
    x, y = position
    if orientation in {"E", "W"}:
        return "N" if y in {0, 1} else "S"
    return "W" if x in {0, 1} else "E"


def build_board(state, bypass_player=None):
    board = [["." for _ in range(4)] for _ in range(4)]

    for player_key, marker in (("player1", "1"), ("player2", "2")):
        if bypass_player == player_key:
            continue
        position = tuple(state[player_key]["position"])
        orientation = state[player_key]["orientation"]
        secondary = get_secondary_orientation(position, orientation)
        for dx, dy in ORIENTATIONS[orientation][secondary]:
            x = position[0] + dx
            y = position[1] + dy
            if not (0 <= x < 4 and 0 <= y < 4) or board[y][x] != ".":
                raise ValueError("Invalid piece placement")
            board[y][x] = marker

    for x, y in state["neutral"]:
        if not (0 <= x < 4 and 0 <= y < 4) or board[y][x] != ".":
            raise ValueError("Invalid neutral placement")
        board[y][x] = "N"

    return board


def is_valid_l_move(position, orientation, board):
    secondary = get_secondary_orientation(position, orientation)
    for dx, dy in ORIENTATIONS[orientation][secondary]:
        x = position[0] + dx
        y = position[1] + dy
        if not (0 <= x < 4 and 0 <= y < 4):
            return False
        if board[y][x] != ".":
            return False
    return True


def get_neutral_moves(board, old_position):
    moves = []
    old_x, old_y = old_position
    for x in range(4):
        for y in range(4):
            if board[y][x] == "." or (x == old_x and y == old_y):
                moves.append((tuple(old_position), (x, y)))
    return moves


def sort_actions(actions):
    return sorted(
        actions,
        key=lambda action: (
            action[0][1],
            action[0][0],
            action[1],
            -1 if action[2] is None else action[2][1],
            -1 if action[2] is None else action[2][0],
            -1 if action[3] is None else action[3][1],
            -1 if action[3] is None else action[3][0],
        ),
    )


def get_legal_actions(state):
    player_key = "player1" if state["turn"] == 1 else "player2"
    player_position = tuple(state[player_key]["position"])
    player_orientation = state[player_key]["orientation"]
    neutral_positions = [tuple(position) for position in state["neutral"]]
    board = build_board(state, bypass_player=player_key)
    legal_actions = set()

    for x in range(4):
        for y in range(4):
            for orientation in ("N", "E", "S", "W"):
                if (x, y) == player_position and orientation == player_orientation:
                    continue
                if not is_valid_l_move((x, y), orientation, board):
                    continue

                candidate_state = clone_state(state)
                candidate_state[player_key]["position"] = [x, y]
                candidate_state[player_key]["orientation"] = orientation
                candidate_board = build_board(candidate_state)

                for neutral_position in neutral_positions:
                    for old_position, new_position in get_neutral_moves(
                        candidate_board, neutral_position
                    ):
                        if old_position == new_position:
                            legal_actions.add(((x, y), orientation, None, None))
                        else:
                            legal_actions.add(
                                ((x, y), orientation, old_position, new_position)
                            )

    return sort_actions(legal_actions)


def apply_action(state, action):
    next_state = clone_state(state)
    player_key = "player1" if next_state["turn"] == 1 else "player2"

    (x, y), orientation, old_neutral, new_neutral = action
    next_state[player_key]["position"] = [x, y]
    next_state[player_key]["orientation"] = orientation

    if new_neutral is not None:
        neutral_positions = [tuple(position) for position in next_state["neutral"]]
        index = neutral_positions.index(tuple(old_neutral))
        next_state["neutral"][index] = [new_neutral[0], new_neutral[1]]

    next_state["turn"] = 2 if next_state["turn"] == 1 else 1
    return next_state


def is_terminal(state):
    return len(get_legal_actions(state)) == 0


def format_move(action):
    (x, y), orientation, old_neutral, new_neutral = action
    move = f"{x + 1} {y + 1} {orientation}"
    if new_neutral is not None:
        a, b = old_neutral
        c, d = new_neutral
        move += f" {a + 1} {b + 1} {c + 1} {d + 1}"
    return move


def parse_move(command):
    parts = command.strip().split()
    if len(parts) not in {3, 7}:
        raise ValueError(
            "Use `x y O` or `x y O a b c d`, with coordinates between 1 and 4."
        )

    try:
        x = int(parts[0]) - 1
        y = int(parts[1]) - 1
    except ValueError:
        raise ValueError("The L-piece coordinates must be integers between 1 and 4.")

    if not (0 <= x < 4 and 0 <= y < 4):
        raise ValueError("The L-piece coordinates must be between 1 and 4.")

    orientation = parts[2].upper()
    if orientation not in {"N", "E", "S", "W"}:
        raise ValueError("Orientation must be one of N, E, S, or W.")

    if len(parts) == 3:
        return ((x, y), orientation, None, None)

    try:
        a, b, c, d = [int(part) - 1 for part in parts[3:7]]
    except ValueError:
        raise ValueError("Neutral-piece coordinates must be integers between 1 and 4.")

    if not all(0 <= value < 4 for value in (a, b, c, d)):
        raise ValueError("Neutral-piece coordinates must be between 1 and 4.")

    return ((x, y), orientation, (a, b), (c, d))


def render_board(board):
    lines = ["    1 2 3 4", "  +---------+"]
    for index, row in enumerate(board):
        lines.append(f"{index + 1} | " + " ".join(row) + " |")
    lines.append("  +---------+")
    return "\n".join(lines)


def opening_history(state):
    board = build_board(state)
    return [
        render_board(board),
        "",
        "Player 1 to move...",
    ]


def append_history(state, *entries):
    history = state.setdefault("history", [])
    for entry in entries:
        if entry is None:
            continue
        history.append(entry)


def append_turn_snapshot(state):
    board = build_board(state)
    append_history(
        state,
        "",
        render_board(board),
        "",
        "Player 1 to move..." if state["turn"] == 1 else "Computer's turn...",
    )


def render_terminal(state):
    return "\n".join(state.get("history", []))


def transient_terminal(state, message, command=None, reprompt=True):
    preview_state = clone_state(state)
    if command is not None:
        append_history(preview_state, command)
    append_history(preview_state, message)
    if reprompt and preview_state["result"] is None and preview_state["turn"] == 1:
        append_history(preview_state, "", "Player 1 to move...")
    return render_terminal(preview_state)


def get_hint(state):
    legal_actions = get_legal_actions(state)
    if not legal_actions:
        raise ValueError("No legal moves are available.")
    return format_move(legal_actions[0])


def evaluate_state(state):
    current_player = state["turn"] % 2 + 1
    opponent = 1 if current_player == 2 else 2
    original_turn = state["turn"]

    state["turn"] = current_player
    current_moves = len(get_legal_actions(state))
    state["turn"] = opponent
    opponent_moves = len(get_legal_actions(state))
    state["turn"] = original_turn

    if opponent_moves == 0:
        return float("inf")
    if current_moves == 0:
        return float("-inf")
    return current_moves - opponent_moves


def minimax(state, depth, alpha, beta, maximizing_player, cache):
    board_key = (
        tuple(tuple(row) for row in build_board(state)),
        state["turn"],
        depth,
        maximizing_player,
    )
    if board_key in cache:
        return cache[board_key]

    legal_actions = get_legal_actions(state)
    if depth == 0 or not legal_actions:
        result = (evaluate_state(state), None)
        cache[board_key] = result
        return result

    best_action = None

    if maximizing_player:
        best_score = float("-inf")
        for action in legal_actions:
            score, _ = minimax(
                apply_action(state, action),
                depth - 1,
                alpha,
                beta,
                False,
                cache,
            )
            if score > best_score:
                best_score = score
                best_action = action
            alpha = max(alpha, score)
            if beta <= alpha:
                break
        result = (best_score, best_action)
    else:
        best_score = float("inf")
        for action in legal_actions:
            score, _ = minimax(
                apply_action(state, action),
                depth - 1,
                alpha,
                beta,
                True,
                cache,
            )
            if score < best_score:
                best_score = score
                best_action = action
            beta = min(beta, score)
            if beta <= alpha:
                break
        result = (best_score, best_action)

    cache[board_key] = result
    return result


def choose_cpu_action(state, depth=DEFAULT_DEPTH):
    legal_actions = get_legal_actions(state)
    if not legal_actions:
        return None

    _, action = minimax(
        state,
        depth,
        float("-inf"),
        float("inf"),
        maximizing_player=(state["turn"] == 1),
        cache={},
    )
    return action if action is not None else legal_actions[0]


def resolve_terminal_state(state):
    if not is_terminal(state):
        return None

    losing_player = state["turn"]
    winning_player = 2 if losing_player == 1 else 1
    return f"Player {losing_player} has run out of moves. Player {winning_player} wins."


def submit_command(state, command):
    text = command.strip()
    normalized = text.lower()

    if normalized == "":
        message = "Enter a move, `help`, or `reset`."
        return {
            "state": clone_state(state),
            "terminal_text": transient_terminal(state, message, command=""),
            "status": "awaiting_input",
        }

    if normalized == "reset":
        next_state = reset_game()
        return {
            "state": next_state,
            "terminal_text": render_terminal(next_state),
            "status": "awaiting_input",
        }

    if normalized == "help":
        hint = get_hint(state)
        message = (
            "Move format: `x y O` or `x y O a b c d`.\n"
            f"Example legal move: {hint}"
        )
        return {
            "state": clone_state(state),
            "terminal_text": transient_terminal(state, message, command=text),
            "status": "awaiting_input",
        }

    if state["turn"] != 1 or state["result"] is not None:
        message = "The game is over. Use `reset` to start again."
        return {
            "state": clone_state(state),
            "terminal_text": transient_terminal(
                state, message, command=text, reprompt=False
            ),
            "status": "game_over",
        }

    try:
        action = parse_move(text)
    except ValueError as error:
        return {
            "state": clone_state(state),
            "terminal_text": transient_terminal(
                state, f"Invalid input: {error}", command=text
            ),
            "status": "awaiting_input",
        }

    legal_actions = get_legal_actions(state)
    if action not in legal_actions:
        return {
            "state": clone_state(state),
            "terminal_text": transient_terminal(
                state,
                "Invalid move: that action is not legal in the current position.",
                command=text,
            ),
            "status": "awaiting_input",
        }

    next_state = apply_action(state, action)
    next_state["move_count"] = state["move_count"] + 1
    next_state["last_player_move"] = format_move(action)
    next_state["last_cpu_move"] = None
    append_history(
        next_state,
        text,
        "Computer's turn...",
        "",
        render_board(build_board(next_state)),
    )

    result = resolve_terminal_state(next_state)
    if result is not None:
        next_state["result"] = result
        append_history(next_state, "", result)
        return {
            "state": next_state,
            "terminal_text": render_terminal(next_state),
            "status": "game_over",
        }

    cpu_action = choose_cpu_action(next_state)
    if cpu_action is not None:
        append_history(
            next_state,
            "",
            "Computer's move:",
            format_move(cpu_action),
        )
        next_state = apply_action(next_state, cpu_action)
        next_state["move_count"] = state["move_count"] + 1
        next_state["last_player_move"] = format_move(action)
        next_state["last_cpu_move"] = format_move(cpu_action)

    result = resolve_terminal_state(next_state)
    if result is not None:
        next_state["result"] = result
        append_history(next_state, "", result)
        status = "game_over"
    else:
        append_turn_snapshot(next_state)
        status = "awaiting_input"

    return {
        "state": next_state,
        "terminal_text": render_terminal(next_state),
        "status": status,
    }
