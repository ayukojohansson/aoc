from collections import deque
from itertools import islice

file = open("input.txt", "r")
lines = file.read()
file.close()

def main(rawInput):
	player1, player2 = rawInput.split('\n\n')
	player1 = deque(map(int, player1.split('\n')[1:]))
	player2 = deque(map(int, player2.split('\n')[1:]))
	
	def isP1Winner(p1,p2):
		if len(p1) > p1[0] and len(p2) > p2[0]:
#			print('playing mini game', p1, p2)
			return combat(
				deque(islice(p1, 1, p1[0]+1)),
				deque(islice(p2, 1, p2[0]+1)),
			)
		return p1[0] > p2[0]

	# True if p1 wins, else False
	def combat(p1, p2):
#		print('combat', p1,p2)
		roundHistory = set()
		while True:
			deck = ','.join(map(str,p1)) + ':' + ','.join(map(str,p2))
			if deck in roundHistory:
				# wins p1
				return True
			else:
				roundHistory.add(deck)
			winP1 = isP1Winner(p1, p2)
			winner = p1 if winP1 else p2
			loser = p2 if winP1 else p1
			winner.rotate(-1)
			winner.append(loser.popleft())

			if not p1 :
				return False
			if not p2 :
				return True

	player1Copy = player1.copy()
	player2Copy = player2.copy()
	winner = player1Copy if combat(player1Copy, player2Copy) else player2Copy
	size = len(winner)
	winner.reverse()
	print('winner score is', sum([ (f+1) * winner[f] for f in range(size)]))
	
	
test = '''Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10'''

test='''Player 1:
43
19

Player 2:
2
29
14'''
#main(test)
main(lines)