import copy
import sys
import random
import time
import heapq
import traceback

initial_state = {
    "player1": {"position": (2, 0), "orientation": "W"},
    "player2": {"position": (1, 3), "orientation": "E"},
    "neutral": [(0, 0), (3, 3)],
    "turn": 1,  # 1 for Player 1's turn, 2 for Player 2's turn
    "bypass_player": None,
}

global_vars = {
    "moves": 0,
    "cmd_args": None,
    "random_cpu": False,  # If player2 is a CPU, then it will play moves at random
    "execution_times": [],
    "game_mode": "PvP",
    "depth": 3,  # The max depth for the minimax algorithm
    "nodes_evaluated": 0,
    "debug": False,  # If true, then allows all debug statements to be printed.
    "priorityq": False,
    "stepbystep": False,
    "visited": set(),
    "cache": {},
}

orientations = {
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


def buildBoard(state):
    board = [["." for i in range(4)] for i in range(4)]

    """ 
    Build a 2D array game board based off the current game state and display it]
    
    Relative orientations for L-pieces with primary and secondary orientations
    Secondary orientations are determined by which half the piece is positioned on
    """

    # place player 1 onto the board
    if state["bypass_player"] != "player1":

        p1_pos = state["player1"]["position"]
        p1_orient = state["player1"]["orientation"]
        p1_secondary_orient = getSecondaryOrientation(p1_pos, p1_orient)
        for rx, ry in orientations[p1_orient][p1_secondary_orient]:
            x, y = p1_pos[0] + rx, p1_pos[1] + ry
            if 0 <= x < 4 and 0 <= y < 4 and board[y][x] == ".":
                board[y][x] = "1"
            else:
                print("x1:", x)
                print("y1:", y)
                print("pxo: ", p1_orient, " , ", p1_secondary_orient)
                raise Exception("Attempted to place P1 into invalid position")

    # place player 2 onto the board
    if state["bypass_player"] != "player2":
        p2_pos = state["player2"]["position"]
        p2_orient = state["player2"]["orientation"]
        p2_secondary_orient = getSecondaryOrientation(p2_pos, p2_orient)
        for rx, ry in orientations[p2_orient][p2_secondary_orient]:
            x, y = p2_pos[0] + rx, p2_pos[1] + ry
            if 0 <= x < 4 and 0 <= y < 4 and board[y][x] == ".":
                board[y][x] = "2"
            else:
                raise Exception("Attempted to place P2 into invalid position")

    # place neutral squares onto the board
    n_pos = state["neutral"]
    for x, y in n_pos:
        if 0 <= x < 4 and 0 <= y < 4 and board[y][x] == ".":
            board[y][x] = "N"
        else:
            raise Exception("Attempted to place Neutral 1x1 into invald position")

    return board


def getSecondaryOrientation(position, orientation):
    """
    Determine the secondary orientation of a piece based on its position
    and primary orientation
    """
    x, y = position

    if orientation == "E" or orientation == "W":
        if y == 0 or y == 1:
            secondary_orient = "N"
        else:
            secondary_orient = "S"
    if orientation == "N" or orientation == "S":
        if x == 0 or x == 1:
            secondary_orient = "W"
        else:
            secondary_orient = "E"

    return secondary_orient


def getLegalActions(state):
    """
    Returns all possible valid moves a player can make in the current game state.
    Each move is represented as a tuple: ((player_pos), 'Orientation', (oldNeutralPos), (newNeutralPos)).
    """

    # Get current player's data
    player = state["turn"]
    player_key = "player1" if player == 1 else "player2"
    other_player_key = "player2" if player == 1 else "player1"
    player_pos = state[player_key]["position"]
    player_orient = state[player_key]["orientation"]
    neutral1_pos = state["neutral"][0]
    neutral2_pos = state["neutral"][1]
    player_secondary_orient = getSecondaryOrientation(player_pos, player_orient)

    # Remove the current player's piece from the board (as they are "picking it up")
    state["bypass_player"] = player_key

    board = buildBoard(state)
    legal_actions = set()
    orientations = ["N", "E", "S", "W"]

    # Generate all possible L-piece moves
    for x in range(4):
        for y in range(4):
            for orient in orientations:

                if (
                    x == player_pos[0]
                    and y == player_pos[1]
                    and orient == player_orient
                ):
                    # Edge case: Can't place piece in the same spot as it was originally at
                    continue

                if isValidLMove((x, y), orient, board):
                    # Make a state with the new move
                    copied_state = copy.deepcopy(state)
                    copied_state[player_key]["position"] = x, y
                    copied_state[player_key]["orientation"] = orient
                    copied_state["bypass_player"] = None

                    new_board = buildBoard(copied_state)
                    new_secondary_orient = getSecondaryOrientation((x, y), orient)

                    # Get all possible neutral piece moves for each neutral piece
                    neutral_moves_1 = getNeutralMoves(new_board, neutral1_pos)
                    neutral_moves_2 = getNeutralMoves(new_board, neutral2_pos)
                    for oldpos, newpos in neutral_moves_1:
                        # Special format for when a neutral piece is not moved
                        if oldpos == newpos:
                            legal_actions.add(((x, y), orient, None, None))
                        else:
                            legal_actions.add(((x, y), orient, oldpos, newpos))
                    for oldpos, newpos in neutral_moves_2:
                        if oldpos == newpos:
                            legal_actions.add(((x, y), orient, None, None))
                        else:
                            legal_actions.add(((x, y), orient, oldpos, newpos))
    state["bypass_player"] = None

    return legal_actions


def isValidLMove(position, orientation, board):
    """
    Checks if placing the L-piece at a given position and orientation is valid.
    Ensures the placement go out of bounds.
    """

    secondary_orient = getSecondaryOrientation(position, orientation)

    for rx, ry in orientations[orientation][secondary_orient]:
        x, y = position[0] + rx, position[1] + ry

        if not (0 <= x < 4 and 0 <= y < 4):
            return False

        if board[y][x] != ".":  # Occupied by another piece
            return False

    return True


def getNeutralMoves(board, oldpos):
    """
    Generates all possible moves for a neutral piece.
    Neutral pieces can move to any empty space or stay in their current position.
    """

    moves = []

    for x in range(4):
        for y in range(4):
            if board[y][x] == "." or (x == oldpos[0] and y == oldpos[1]):
                moves.append((oldpos, (x, y)))
    return moves


def playerTurn(state):
    """
    Handles a player's turn.
    Displays the board, gets player input, validates the move, and updates the game state.
    """

    # Get current player's data
    player = state["turn"]
    player_key = "player1" if player == 1 else "player2"
    other_player_key = "player2" if player == 1 else "player1"
    player_pos = state[player_key]["position"]
    player_orient = state[player_key]["orientation"]
    neutral1_pos = state["neutral"][0]
    neutral2_pos = state["neutral"][1]
    player_secondary_orient = getSecondaryOrientation(player_pos, player_orient)
    legal_actions = getLegalActions(state)

    board = buildBoard(state)
    printBoard(board)

    if is_terminal(state):
        terminalState(player)
        return

    # Wait for player input
    while True:
        try:
            playerInput = getPlayerInput(player, state, board)

            # Check if its a valid move
            if playerInput in legal_actions:

                # Update player position
                player_pos, player_orient, old_neutral_pos, neutral_pos = playerInput
                state[player_key]["position"] = player_pos
                state[player_key]["orientation"] = player_orient

                # Update neutral positions
                if neutral_pos != None:
                    if state["neutral"][0] == old_neutral_pos:
                        state["neutral"][0] = neutral_pos
                    else:
                        state["neutral"][1] = neutral_pos

                # Update player turn
                state["turn"] = state["turn"] % 2 + 1

                break

            else:
                if global_vars["debug"]:
                    print(f"{playerInput} not in legalMoves")
                raise ValueError("Not a legal move")

        except ValueError as e:
            print(f"\nInvalid input: {e}. Please try again.\n")
            continue

    # Proceed to next turn
    if global_vars["game_mode"] == "PvP":
        playerTurn(state)
    elif global_vars["game_mode"] == "PvC":
        computerTurn(state)
    else:
        raise Exception("Something went wrong with the gamemode selection")
    return


def computerTurn(state):
    """
    Executes the computer's turn.
    Uses the minimax algorithm to determine the best move and updates the game state.
    """

    # Track the execution time of turn
    start_time = time.time()

    # Get current player's data
    player = state["turn"]

    player_key = "player1" if player == 1 else "player2"
    other_player_key = "player2" if player == 1 else "player1"
    player_pos = state[player_key]["position"]
    player_orient = state[player_key]["orientation"]
    neutral1_pos = state["neutral"][0]
    neutral2_pos = state["neutral"][1]
    player_secondary_orient = getSecondaryOrientation(player_pos, player_orient)
    legal_actions = getLegalActions(state)

    board = buildBoard(state)

    if player == 1:
        global_vars["moves"] += 1
        print("\n--------------------")
        print("Turn", global_vars["moves"])

    if global_vars["game_mode"] == "PvC":
        print("Computer's turn...")
    else:
        print(f"\nComputer {player}'s turn...")

    printBoard(board)

    if is_terminal(state):
        terminalState(player)
        return

    if player == 1:
        bool_player = True
    else:
        bool_player = False

    _, best_action = minimax(
        state, board, global_vars["depth"], float("-inf"), float("inf"), bool_player
    )

    global_vars["visited"] = set()  # reset visited set

    if global_vars["debug"]:
        # print("legal actions:", legal_actions)
        print("best_action:", best_action, "score:", _)

    # Player 2 is random
    if player == 2 and global_vars["random_cpu"] == True:
        best_action = random.choice(list(legal_actions))
    else:
        if (
            best_action is None and legal_actions
        ):  # When minimax fails to find an action, choose the best action based of evaluate_state()
            action_priority_queue = []
            for action in legal_actions:
                new_state = apply_action(state, action)
                heuristic_score = evaluate_state(new_state)
                priority = -heuristic_score
                heapq.heappush(
                    action_priority_queue,
                    (priority, len(action_priority_queue), action),
                )
            best_action = heapq.heappop(action_priority_queue)[2]

        elif best_action is None:
            terminalState(player)
            return

    # Update state with the best action
    state = apply_action(state, best_action)

    # Print the computer's move in the required format

    if global_vars["game_mode"] == "PvC":
        print("Computer's move:")
    else:
        print(f"Computer {player}'s move:")
    print(format_move(best_action))

    if global_vars["debug"]:
        print("Nodes evalutated:", global_vars["nodes_evaluated"])
        global_vars["nodes_evaluated"] = 0

        end_time = time.time()
        execution_time = end_time - start_time
        print(f"Execution Time: {round(execution_time, 2)} seconds")
        if (
            global_vars["random_cpu"] == True
            and player == 1
            and global_vars["game_mode"] == "CvC"
        ):
            global_vars["execution_times"].append(execution_time)
        elif global_vars["random_cpu"] == False or global_vars["game_mode"] == "PvC":
            global_vars["execution_times"].append(execution_time)

        numbers = global_vars.get("execution_times", [])

        if numbers:  # Check if the list is not empty
            avg = sum(numbers) / len(numbers)
            if global_vars["game_mode"] == "PvC":
                print(f"Avg execution time (computer): {round(avg, 2)} seconds")
            else:
                print(f"Avg execution time (per player): {round(avg, 2)} seconds")
            print(f"Total runtime: {round(sum(numbers), 2)} seconds")
        else:
            print(
                "No execution times recorded. Unable to compute averages or total runtime."
            )

    # Proceed to next turn
    if global_vars["stepbystep"] and global_vars["game_mode"] == "CvC":
        input()

    if global_vars["game_mode"] == "PvC":
        playerTurn(state)
    elif global_vars["game_mode"] == "CvC":
        computerTurn(state)
    else:
        raise Exception("Something went wrong with the gamemode selection")
    return


def evaluate_state(state):
    """
    Evaluates the game state to determine its heuristic value for the Minimax algorithm.
    Positive values favor the current player, while negative values favor the opponent.
    """

    player = state["turn"] % 2 + 1
    opponent = 1 if player == 2 else 2

    temp = state["turn"]

    """ player = 1 # maximizing player
    opponent = 2 # minimizing player"""

    # Any of these 14 predetermined states is a garenteed loss
    # against a optimal opponent and therefor avoided
    """standardized_loss_states = {"...N..212221.N11",
                                "..112221..21.NN.",
                                "...2.222N111.N.1",
                                "..2N..2.N221.111",
                                "..112221N.21..N.",
                                ".....222N21N111.",
                                "...N..212221N.11",
                                "...NN.212221..11",
                                ".....222N2.1N111",
                                "..112221..21.N.N",
                                "..112221..21..NN",
                                "..112221N.21.N..",
                                "...1N2N1.211.22.",
                                "...N222.21N..111",}

    # Check for loss states for player
    normal_board = normalize_board(buildBoard(state))
    if normal_board in standardized_loss_states:
        return float('-inf')"""

    # Get legal moves for both players
    state["turn"] = 1
    player_moves = len(getLegalActions(state))

    state["turn"] = 2
    opponent_moves = len(getLegalActions(state))

    state["turn"] = temp  # Reset turn

    # Check for terminal state
    if opponent_moves == 0:
        return float("inf")  # Winning state
    if player_moves == 0:
        return float("-inf")  # Losing state

    # Heuristic: difference in legal moves
    return player_moves - opponent_moves


def printBoard(board):
    for row in board:
        print(" ".join(row))
    print()


def build_symmetries(board):
    """
    Generates all eight symmetries of a 4x4 board, including rotations and reflections.
    Returns a list of all symmetric board configurations.
    """

    symmetries = []

    # Identity (original board)
    symmetries.append([row[:] for row in board])

    # 90° clockwise rotation
    rotated_90 = [["." for _ in range(4)] for _ in range(4)]
    for i in range(4):
        for j in range(4):
            rotated_90[j][3 - i] = board[i][j]
    symmetries.append(rotated_90)

    # 180° clockwise rotation
    rotated_180 = [["." for _ in range(4)] for _ in range(4)]
    for i in range(4):
        for j in range(4):
            rotated_180[3 - i][3 - j] = board[i][j]
    symmetries.append(rotated_180)

    # 270° clockwise rotation
    rotated_270 = [["." for _ in range(4)] for _ in range(4)]
    for i in range(4):
        for j in range(4):
            rotated_270[3 - j][i] = board[i][j]
    symmetries.append(rotated_270)

    # Horizontal reflection
    reflected_h = [["." for _ in range(4)] for _ in range(4)]
    for i in range(4):
        for j in range(4):
            reflected_h[3 - i][j] = board[i][j]
    symmetries.append(reflected_h)

    # Vertical reflection
    reflected_v = [["." for _ in range(4)] for _ in range(4)]
    for i in range(4):
        for j in range(4):
            reflected_v[i][3 - j] = board[i][j]
    symmetries.append(reflected_v)

    # Diagonal reflection (top-left to bottom-right)
    reflected_d1 = [["." for _ in range(4)] for _ in range(4)]
    for i in range(4):
        for j in range(4):
            reflected_d1[j][i] = board[i][j]
    symmetries.append(reflected_d1)

    # Anti-diagonal reflection (top-right to bottom-left)
    reflected_d2 = [["." for _ in range(4)] for _ in range(4)]
    for i in range(4):
        for j in range(4):
            reflected_d2[3 - j][3 - i] = board[i][j]
    symmetries.append(reflected_d2)

    # Print all boards for verification
    """for idx, sym_board in enumerate(symmetries):
        print(f"Symmetry {idx + 1}:")
        printBoard(sym_board)"""

    # lexicographical_strings = [board_to_lex_string(symmetry) for symmetry in symmetries]

    return [tuple(map(tuple, board)) for board in symmetries]


def normalize_board(board):
    """
    Generates all symmetries of a 4x4 board, sorts them lexicographically,
    and returns the lexicographically smallest representation of the board.
    """
    strings = build_symmetries(board)
    strings.sort()
    return strings[0]


def board_to_lex_string(board):
    """
    Convert a 4x4 board into a lexicographical string.
    Helper for build_symmetries()
    """
    return "".join("".join(row) for row in board)


def minimax(state, board, depth, alpha, beta, maximizing_player):
    """
    Implements the Minimax algorithm with alpha-beta pruning.
    Evaluates the best move for the current player given the game state.
    """

    if depth == 0:
        return evaluate_state(state), None

    board_tuple = tuple(map(tuple, board))
    if board_tuple in global_vars["visited"]:
        return global_vars["cache"][board_tuple]  # Return cached value if available

    legal_actions = getLegalActions(state)
    if not legal_actions:
        return evaluate_state(state), None

    best_action = None

    if maximizing_player:
        max_eval = float("-inf")
        if global_vars["priorityq"]:
            legal_actions = prioritize_actions(
                state, legal_actions, True
            )  # alpha-beta huerestic
        for action in legal_actions:
            global_vars["nodes_evaluated"] += 1
            new_state = apply_action(state, action)
            new_board = buildBoard(new_state)
            eval, _ = minimax(new_state, new_board, depth - 1, alpha, beta, False)
            if eval > max_eval:
                max_eval = eval
                best_action = action
            alpha = max(alpha, eval)
            if beta <= alpha:
                break  # Beta cut-off
        # Cache the result
        global_vars["visited"].add(board_tuple)
        global_vars["cache"][board_tuple] = (max_eval, best_action)
        return max_eval, best_action
    else:
        min_eval = float("inf")
        if global_vars["priorityq"]:
            legal_actions = prioritize_actions(
                state, legal_actions, False
            )  # alpha-beta huerestic
        for action in legal_actions:
            global_vars["nodes_evaluated"] += 1
            new_state = apply_action(state, action)
            new_board = buildBoard(new_state)
            eval, _ = minimax(new_state, new_board, depth - 1, alpha, beta, True)
            if eval < min_eval:
                min_eval = eval
                best_action = action
            beta = min(beta, eval)
            if beta <= alpha:
                break  # Alpha cut-off
        # Cache the result
        global_vars["visited"].add(board_tuple)
        global_vars["cache"][board_tuple] = (min_eval, best_action)
        return min_eval, best_action


def prioritize_actions(state, legal_actions, maximizing_player):
    """
    Assign priorities to legal actions based on a heuristic evaluation of the resulting state.
    CURRENTLY UNUSED
    """
    action_priority_queue = []
    for action in legal_actions:

        new_state = apply_action(state, action)
        heuristic_score = evaluate_state(new_state)
        # Use negative scores for maximizing player (to simulate max-heap behavior with min-heap)
        priority = -heuristic_score if maximizing_player else heuristic_score
        heapq.heappush(
            action_priority_queue, (priority, len(action_priority_queue), action)
        )
    return [
        heapq.heappop(action_priority_queue)[2]
        for _ in range(len(action_priority_queue))
    ]


def apply_action(state, action):
    """
    Applies a player's move to the game state, updating positions and orientations
    of pieces and switching turns. Returns the new game state.
    """

    new_state = copy.deepcopy(state)
    player = new_state["turn"]
    player_key = "player1" if player == 1 else "player2"

    # Unpack action
    (x, y), orient, old_neutral_pos, new_neutral_pos = action

    # Update player's L-piece
    new_state[player_key]["position"] = (x, y)
    new_state[player_key]["orientation"] = orient

    # Update neutral pieces
    if new_neutral_pos is not None:
        if new_state["neutral"][0] == old_neutral_pos:
            new_state["neutral"][0] = new_neutral_pos
        else:
            new_state["neutral"][1] = new_neutral_pos

    # Switch turn
    new_state["turn"] = 1 if player == 2 else 2

    return new_state


def is_terminal(state):
    """
    Checks if the game is in a terminal state, i.e., no legal moves are available.
    """

    legal_actions = getLegalActions(state)
    return len(legal_actions) == 0


def format_move(action):
    """
    Formats a player's action into a readable string representation.
    Includes coordinates, orientation, and optional neutral piece movement.
    """

    (x, y), orient, old_neutral_pos, new_neutral_pos = action
    move_str = f"{x + 1} {y + 1} {orient}"
    if new_neutral_pos is not None:
        a, b = old_neutral_pos
        c, d = new_neutral_pos
        move_str += f" {a + 1} {b + 1} {c + 1} {d + 1}"
    return move_str


def getPlayerInput(playerID, state, board):
    """
    Prompts the player for a move input. Validates the format of the input
    and ensures it adheres to the game rules. Returns a parsed move.
    """

    while True:
        try:
            user_input = "0"
            while user_input == "0" or user_input == "help()" or user_input == "save()":
                user_input = input("Player " + str(playerID) + " to move...\n").strip()

                # Debug command
                if user_input == "0":
                    printLegalActions(state, board)

                if user_input == "help()":
                    legal_actions = getLegalActions(state)
                    random_move = random.choice(list(legal_actions))
                    (x, y), orient = random_move[0], random_move[1]
                    if random_move[2]:
                        (a, b), (c, d) = random_move[2], random_move[3]
                        print(
                            f"\nTry the move: {x + 1} {y + 1} {orient} {a + 1} {b + 1} {c + 1} {d + 1}\n"
                        )
                    else:
                        print(f"\nTry the move: {x + 1} {y + 1} {orient}\n")

                if user_input == "save()":
                    (x1, y1) = state["player1"]["position"]
                    x1, y1 = x1 + 1, y1 + 1
                    (orient1) = state["player1"]["orientation"]
                    (x2, y2) = state["player2"]["position"]
                    x2, y2 = x2 + 1, y2 + 1
                    (orient2) = state["player2"]["orientation"]
                    [(a, b), (c, d)] = state["neutral"]
                    a, b, c, d = a + 1, b + 1, c + 1, d + 1
                    print(
                        f"\nUse this string to start from this game state: \n{x1} {y1} {orient1} {a} {b} {c} {d} {x2} {y2} {orient2}\n"
                    )

                if user_input == "quit()":
                    sys.exit()

            parts = user_input.split()

            # Validate length
            if not (len(parts) == 3 or len(parts) == 7):
                raise ValueError(
                    "Input must be 3 or 7 elements: 'x y orientation' or 'x y orientation a b c d'\n"
                    "where a neutral piece is moved from (a, b) to (c, d)"
                )

            # Validate player coords (x, y)
            try:
                x, y = (int(parts[0]) - 1, int(parts[1]) - 1)
            except ValueError:
                raise ValueError("Coordinates (x, y) must be integers between 1 and 4")

            if not (0 <= x < 4 and 0 <= y < 4):
                raise ValueError("Coordinates (x, y) must be between 1 and 4")

            # Validate orientation
            orient = parts[2].upper()
            if orient not in {"N", "E", "S", "W"}:
                raise ValueError("Orientation must be one of 'N', 'S', 'E', 'W'")

            # Validate neutral coordinates
            if len(parts) == 7:
                try:
                    a, b, c, d = map(int, parts[3:7])
                    a, b, c, d = (
                        a - 1,
                        b - 1,
                        c - 1,
                        d - 1,
                    )  # Adjust for 0-based indexing
                except ValueError:
                    raise ValueError(
                        "Neutral piece coordinates (a, b, c, d) must all be integers"
                    )

                if not (0 <= a < 4 and 0 <= b < 4 and 0 <= c < 4 and 0 <= d < 4):
                    raise ValueError(
                        "Both coordinates (a, b) and (c, d) must be between 1 and 4"
                    )

        except ValueError as e:
            print(f"\nInvalid input: {e}. Please try again.\n")
            continue

        if len(parts) == 3:
            return ((x, y), orient, None, None)
        else:
            return ((x, y), orient, (a, b), (c, d))


def terminalState(losingPlayer):
    """
    Displays the end-game message indicating which player lost.
    """

    winningPlayer = losingPlayer % 2 + 1

    print(f"Player {losingPlayer} has run out of moves. Player {winningPlayer} wins.\n")
    sys.exit()


def mainMenu():

    # Parse cmd line arguments
    arguments = set(sys.argv)
    if "--randomCPU" in arguments:
        global_vars["random_cpu"] = True
    if "--debug" in arguments:
        global_vars["debug"] = True
    if "--stepbystep" in arguments:
        global_vars["stepbystep"] = True

    while True:
        try:
            # Display the menu and get user input
            choice = input(
                "Main menu:\n"
                "   1) Player vs Player\n"
                "   2) Player vs Computer\n"
                "   3) Computer vs Computer\n"
                "   4) Set initial game state\n"
                "   5) Set minimax depth\n\n"
                "Enter a number to make a selection: "
            ).strip()

            # Validate and handle the input
            if choice == "1":
                print("Starting Player vs Player game...")
                global_vars["game_mode"] = "PvP"
                playerTurn(initial_state)  # Start Player vs Player game

            elif choice == "2":
                print("Starting Player vs Computer game...")
                start_pvc()

            elif choice == "3":
                print("Starting Computer vs Computer game...")
                start_cvc()
            elif choice == "4":
                setInitialGameState()
            elif choice == "5":
                chooseMinimaxDepth()
            else:
                raise ValueError(
                    "Invalid choice. Please enter a number between 1 and 5"
                )

        except ValueError as e:
            print("\n--------------------")
            print(f"Error: {e}.\n")

            if global_vars["debug"]:
                traceback.print_exc()


def start_pvc():
    while True:
        try:
            # Determine who has starting turn
            starting_choice = input(
                "\nSelect who makes the first move:\n"
                "   1) Player\n"
                "   2) Computer\n"
            ).strip()

            if not (starting_choice == "1" or starting_choice == "2"):
                raise ValueError("Invalid input")

            global_vars["game_mode"] = "PvC"

            if starting_choice == "1":
                playerTurn(copy.deepcopy(initial_state))
            elif starting_choice == "2":
                computerTurn(copy.deepcopy(initial_state))

        except ValueError as e:
            print("\n--------------------")
            print(f"Error: {e}. Please enter a number 1 or 2\n")
            continue


def start_cvc():
    global_vars["game_mode"] = "CvC"
    computerTurn(copy.deepcopy(initial_state))


def setInitialGameState():
    global initial_state

    while True:
        try:
            user_input = input("\nEnter new game state string: \n")
            parts = user_input.split()

            # Validate length
            if not (len(parts) == 10):
                raise ValueError("Input must be 10 elements")

            # Validate player1 coords (x, y)
            try:
                x1, y1 = (int(parts[0]) - 1, int(parts[1]) - 1)
            except ValueError:
                raise ValueError(
                    "Coordinates (x1, y1) must be integers between 1 and 4"
                )

            if not (0 <= x1 < 4 and 0 <= y1 < 4):
                raise ValueError("Coordinates (x1, y1) must be between 1 and 4")

            # Validate p1 orientation
            orient1 = parts[2].upper()
            if orient1 not in {"N", "E", "S", "W"}:
                raise ValueError("Orientations must be one of 'N', 'S', 'E', 'W'")

            # Validate neutral coords
            try:
                a, b, c, d = map(int, parts[3:7])
                a, b, c, d = a - 1, b - 1, c - 1, d - 1  # Adjust for 0-based indexing
            except ValueError:
                raise ValueError(
                    "Neutral piece coordinates (a, b, c, d) must all be integers"
                )

            if not (0 <= a < 4 and 0 <= b < 4 and 0 <= c < 4 and 0 <= d < 4):
                raise ValueError(
                    "Both coordinates (a, b) and (c, d) must be between 1 and 4"
                )

            # Validate player2 coords (x, y)
            try:
                x2, y2 = (int(parts[7]) - 1, int(parts[8]) - 1)
            except ValueError:
                raise ValueError(
                    "Coordinates (x2, y2) must be integers between 1 and 4"
                )

            if not (0 <= x2 < 4 and 0 <= y2 < 4):
                raise ValueError("Coordinates (x1, y1) must be between 1 and 4")

            # Validate p2 orientation
            orient2 = parts[9].upper()
            if orient2 not in {"N", "E", "S", "W"}:
                raise ValueError("Orientations must be one of 'N', 'S', 'E', 'W'")

        except ValueError as e:
            print(f"\nInvalid input: {e}. Please try again.\n")
            continue

        copied_state = copy.deepcopy(initial_state)

        # Update the initial state
        copied_state["player1"]["position"] = (x1, y1)
        copied_state["player1"]["orientation"] = orient1
        copied_state["player2"]["position"] = (x2, y2)
        copied_state["player2"]["orientation"] = orient2
        copied_state["neutral"] = [(a, b), (c, d)]

        try:
            buildBoard(copied_state)
        except Exception as e:
            print(f"Error: {e}. The initial state is invalid.")
            continue

        initial_state = copy.deepcopy(copied_state)
        print("\n--------------------")
        print("The initial state has been updated.\n")
        mainMenu()
        return


def printBoard(board):
    RED_BOLD = "\033[1;31m"
    BLUE_BOLD = "\033[1;34m"
    LIGHT_GRAY = "\033[1;30m"
    RESET = "\033[0m"

    print("\n    1 2 3 4")  # Column headers
    print("  +---------+")
    for i, row in enumerate(board):
        colored_row = [
            (
                f"{RED_BOLD}1{RESET}"
                if char == "1"
                else (
                    f"{BLUE_BOLD}2{RESET}"
                    if char == "2"
                    else f"{LIGHT_GRAY}.{RESET}" if char == "." else char
                )
            )
            for char in row
        ]
        print(
            f"{i + 1} | " + " ".join(colored_row) + " |"
        )  # Row headers with row content
    print("  +---------+")
    print("")


def printLegalActions(state, board):
    legal_actions = getLegalActions(state)
    list_of_actions = sorted(list(legal_actions), key=lambda x: (x[0], x[1]))
    print("Legal actions:")
    for action in list_of_actions:
        if action[3] == None:
            (x, y), orient, _, _ = action
            print(f"{x + 1} {y + 1} {orient}")
        else:
            (x, y), orient, (a, b), (c, d) = action
            print(f"{x + 1} {y + 1} {orient} {a + 1} {b + 1} {c + 1} {d + 1}")
    printBoard(board)


def parseInitialBoard():
    """CURRENTLY UNUSED"""

    loss_state_codes = [
        "1 4 N 1 2 4 4 2 3 E",
        "1 4 N 4 2 4 3 2 3 E",
        "1 2 N 3 1 4 2 1 3 S",
        "1 4 N 1 1 4 3 2 3 E",
        "1 4 N 3 1 4 3 2 3 E",
        "2 4 N 1 3 4 3 3 2 S",
        "1 4 N 1 1 4 4 2 3 E",
        "1 4 N 3 1 4 4 2 3 E",
        "1 4 N 4 3 4 4 3 2 S",
        "1 4 N 4 2 4 4 2 3 E",
        "1 4 N 4 3 4 4 2 3 E",
        "1 4 N 3 1 4 2 2 3 E",
        "2 4 N 3 1 3 3 1 2 S",
        "2 4 N 4 1 3 3 1 2 S",
    ]

    loss_states = []

    for i, state in enumerate(loss_state_codes):
        elements = state.split()

        # Update the initial state
        new_state = copy.deepcopy(initial_state)

        x1, y1, orient1, a, b, c, d, x2, y2, orient2 = map(str, elements)
        new_state["player1"]["position"] = (int(x1) - 1, int(y1) - 1)
        new_state["player1"]["orientation"] = orient1
        new_state["player2"]["position"] = (int(x2) - 1, int(y2) - 1)
        new_state["player2"]["orientation"] = orient2
        new_state["neutral"] = [(int(a) - 1, int(b) - 1), (int(c) - 1, int(d) - 1)]

        board = buildBoard(new_state)
        print(i + 1)
        printBoard(board)
        loss_states.append(normalize_board(board))

    return loss_states


def chooseMinimaxDepth():
    while True:
        try:
            # Prompt user for input and convert it to an integer
            depth = int(input("Enter new minimax depth: "))
            if depth <= 0:
                raise ValueError("Depth must be an integer greater than 0.")

            # Set the global depth variable
            global_vars["depth"] = depth
            print(f"Minimax depth set to {depth}.")
            break  # Exit loop once depth is successfully set

        except ValueError as e:
            print("\n--------------------")
            print(f"Error: {e}.\n")
            if global_vars.get("debug", False):  # Check if debug is enabled
                import traceback

                traceback.print_exc()


def tinymax(state, depth):
    if depth == 1:
        legal_actions = {((2, 1), "S", (0, 0), (2, 0))}
    else:
        legal_actions = None

    if not legal_actions:
        print("miniscore", evaluate_state(state))
        return evaluate_state(state), None

    max_eval = float("inf")

    for action in legal_actions:
        new_state = apply_action(state, action)
        print(new_state)
        eval, _ = tinymax(new_state, 0)
        # if eval > max_eval:
        if True:
            max_eval = eval
            best_action = action
    return (max_eval, best_action)


def main():

    mainMenu()


if __name__ == "__main__":
    main()
