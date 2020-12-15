import re
from collections import deque, defaultdict
from itertools import combinations, product
	

def part1(startList, rounds):
	history = defaultdict(list)
	initialList = startList.split(',')
	initialList.reverse()
	prev = 0
	for turn in range(rounds):
		if initialList:
			prev = int(initialList.pop())
		else:
			if len(history[prev]) == 1:
				prev = 0
			else:
				prev = int(history[prev][-1]) - int(history[prev][-2])
		history[prev].append(turn+1)
		if (turn+1) % 1000000 == 0:
			print('turn', turn +1, prev)


part1('0,6,1,7,2,19,20', 30000000)
#part1('1,3,2', 20)