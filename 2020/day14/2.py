import re
from itertools import product

file = open("input.txt", "r")
lines = file.read()
file.close()

def addressMask(val, mask):
	val2 = list("{0:b}".format(val).zfill(len(mask)))
	res = val
	index = 0
	length = len(val2)
	while index < length:
		strIndex = -index-1
		m = mask[strIndex]
		if m != '0':
			val2[strIndex] = m
		index += 1
	return val2

# Check if test is included in mask
def isDuplicate(mask, test):
	for i in range(len(mask)):
		if mask[i] != 'X' and mask[i] != test[i]:
			return False
	return True

# All possible case without already added ones
def getVariations(completed, adding):
	countX = adding.count('X')
	if not completed:
		print('first case')
		return 2 ** countX

	counter = 0
	for variations in list(product(['0', '1'], repeat=countX)):
		test = adding.copy()
		for i in range(countX):
			# Replace X with variations
			test[test.index('X')] = variations[i]

		isDup = False
		for mask in completed:
			if isDuplicate(mask, test):
				isDup = True
				break
		if not isDup:
			counter += 1
			
	return counter

def part2(rawInputs):
	total = 0
	completed = []
	chunks = rawInputs.split('mask = ')
	completed = []
	while chunks:
		chunk = chunks.pop()
		if not chunk:
			continue
		mask, *comm = chunk.strip().split('\n')
		comm.reverse()
		for line in comm:
			com, value = line.split('= ')
			addr = re.search('\[(\d*)\]', com).group(1)
			maskedAddr = addressMask(int(addr), mask)
			variations = getVariations(completed, maskedAddr)
			completed.append(maskedAddr)
			total += variations * int(value)

	print('answer is', total)

part2(lines)