import re
from collections import deque
import sys

test = '''F10
N3
F7
R90
F11'''.split('\n')

time=1008141
bus='17,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,523,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,13,19,x,x,x,23,x,x,x,x,x,x,x,787,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,29'

test = [939, '7,13,x,x,59,x,31,19']

res = [time * 100]
for bus in bus.split(','):
	if bus == 'x':
		continue
	busTime = int(bus)
	departure = (time // busTime +1 )* busTime
	if departure < res[0]:
		res = [departure, busTime]
#print('part1: ', (res[0] - time)*res[1])



#The earliest timestamp that matches the list 17,x,13,19 is 3417.
#67,7,59,61 first occurs at timestamp 754018.
#67,x,7,59,61 first occurs at timestamp 779210.
#67,7,x,59,61 first occurs at timestamp 1261476.
#1789,37,47,1889 first occurs at timestamp 1202161486.

import math
from functools import reduce

def lcm_base(x, y):
    return (x * y) // math.gcd(x, y)

def lcm_list(numbers):
    return reduce(lcm_base, numbers, 1)

def firstHitAndInterval(x, y, diff):
	for i in range(x * y):
		offset = x * i % y
#		print(i, x, y, offset)
		if offset == diff:
			res_lcm = lcm_base(x, y)
			res_first = x * i
			print('first hit at (x) ', x * i)
			print('next hit in (interval)', res_lcm)
			print('which is at', x * i + res_lcm)
			return res_first, res_lcm

def part2(string):
	bus = string.split(',')
	schema_ = {}
	for offset in range(len(bus)):
		b = bus[offset]
		if b == 'x':
			continue
		schema_[b.zfill(3)] = offset % int(b)
	print('\nschema', schema_)
	schema = {'17': 0, '41': 7, '523': 17, '13': 9, '19': 17, '23': 17, '787': 48, '37': 17, '29': 19}
	print(schema)

	sortedBusNr = sorted(schema.keys())
	highest = sortedBusNr.pop()
	firstMeet = 0
	longestInterval = 0
	busId=0
	while sortedBusNr:
		nextHighest = sortedBusNr.pop()
		diff = schema[highest] - schema[nextHighest]
		print('\n', highest, nextHighest, diff, diff % int(nextHighest))

		b_time, b_interval = firstHitAndInterval(int(highest), int(nextHighest), diff % int(nextHighest))
		if b_interval > longestInterval:
			longestInterval = b_interval
			firstMeet = b_time

#	schema = {'17': 0, '41': 7, '523': 17, '13': 35, '19': 36, '23': 40, '787': 48, '37': 54, '29': 77}
	def isValid(t):
		for busNr in sorted(schema.keys()):
			if t % int(busNr) != (schema[highest] - schema[busNr]) % min(int(busNr), int(highest)):
				return False
		return True
		
	interval = longestInterval
	time = firstMeet
	while True:
		if isValid(time):
			print('found it', time)
			print('answer is', time - schema[highest])
			break
		if not time%1000000:
			print(time)
		time += interval

#print(part2('17,x,13,19'), 'answer should be', 3417)
#print(part2('67,7,x,59,61'), 'answer should be', 1261476)
#print(part2('1789,37,47,1889'), 'answer should be', 1202161486)
print(part2('17,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,523,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,13,19,x,x,x,23,x,x,x,x,x,x,x,787,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,29'), 'answer should be', '825305207525452')

#firstHitAndInterval(29,17,9)

print()
# Takes 2h, need improvement