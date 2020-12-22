from collections import deque

file = open("input.txt", "r")
lines = file.read()
file.close()

def main(rawInput):
	player1, player2 = rawInput.split('\n\n')
	player1 = deque(map(int, player1.split('\n')[1:]))
	player2 = deque(map(int, player2.split('\n')[1:]))
	
	def isP1Winner(p1,p2):
		return p1 > p2

	def combat(player1, player2):
		while True:
			winP1 = isP1Winner(player1[0], player2[0])
			winner = player1 if winP1 else player2
			loser = player2 if winP1 else player1
			winner.rotate(-1)
			winner.append(loser.popleft())

			if not player1 :
				return player2
			if not player2 :
				return player1
			
	winner = combat(player1,player2)
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

main(lines)