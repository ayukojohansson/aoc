
def main1(numOfPlayer, rounds):
  circle = [0]
  scores = {}
  current = 0
  for turn in range(0,rounds):
    if turn % 10000 == 0:
      print(turn)
    marbleValue = turn + 1
    if marbleValue and marbleValue % 23 == 0:
      player = turn % numOfPlayer
      current = (current - 7) % len(circle)
      score = marbleValue + circle.pop(current)
      scores[player] = score + scores.get(player, 0)
      print(turn, f'{player} got {score}, {marbleValue} + {score-marbleValue}', )
    else:
      current = (current + 2) % len(circle)
      circle.insert(current, marbleValue)
  print(max(scores.values()))
	

#468 players; last marble is worth 71843 points
#10 players; last marble is worth 1618 points: high score is 8317
#13 players; last marble is worth 7999 points: high score is 146373
#17 players; last marble is worth 1104 points: high score is 2764
#21 players; last marble is worth 6111 points: high score is 54718
#30 players; last marble is worth 5807 points: high score is 37305

#468 players; last marble is worth 71843 points
#132: 385820
#147: 32279734
#main1(468, 71843)
#main1(468, 7184300)
		
from collections import deque, defaultdict

def optimised(max_players, last_marble):
    scores = defaultdict(int)
    circle = deque([0])

    for marble in range(1, last_marble + 1):
        if marble % 23 == 0:
            circle.rotate(7)
            scores[marble % max_players] += marble + circle.pop()
            circle.rotate(-1)
        else:
            circle.rotate(-1)
            circle.append(marble)

    return max(scores.values()) if scores else 0

print(optimised(468, 7184300))