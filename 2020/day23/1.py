from collections import deque

def main(numbers, rounds):
	cups = deque(map(int, numbers))

	while rounds:
		print('\nround', 101 - rounds)
		curr = cups[0]
		cups.rotate(-1)
		picked = [ cups.popleft() for i in range(3)]

		dest = curr - 1 if curr != 1 else 9
		while dest in picked:
			dest = dest - 1 if dest != 1 else 9

		while picked:
			cups.insert(cups.index(dest) +1, picked.pop())
		rounds -= 1
	
	print('res', ''.join(map(str, cups)))
	
	
startNumber = '589174263'
test = '389125467'

main(startNumber, 100)