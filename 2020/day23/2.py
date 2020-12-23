def prettyPrint(c):
	t = c[1]
	for x in range(len(c)):
		print(t, ',', end='')
		t=c[t]
	print()

def main(numbers, rounds):
	maxRound = rounds
	cups = list(map(int, numbers))
	start = cups[0]
	maxNr = 1000000
	cups.extend([x for x in range (10, maxNr+1)])

	# dict with next value
	cups = dict(zip(cups, cups[1:]+cups[:2]))

	curr = start
	while rounds:
		if rounds % 1000000 == 0:
			print('\nround', maxRound+1 - rounds)

		picked1 = cups[curr]
		picked2 = cups[picked1]
		picked3 = cups[picked2]
		picked = [picked1, picked2, picked3]

		dest = curr - 1 if curr != 1 else maxNr
		while dest in picked:
			dest = dest - 1 if dest != 1 else maxNr

		# curr -> picked1 -> picked2 -> picked3 -> next(cups[picked3])
		# dest -> X(cups[dest])
		# reconnect to
		# curr -> next
		# dest -> picked1 -> picked2 -> picked3 -> X
		cups[curr] = cups[picked3]
		cups[picked3] = cups[dest]
		cups[dest] = picked1

		curr = cups[curr]
		rounds -= 1

	print('res', cups[1], cups[cups[1]])
	print('res', cups[1] * cups[cups[1]])
	
	
startNumber = '589174263'
test = '389125467'

main(startNumber, 10000000)