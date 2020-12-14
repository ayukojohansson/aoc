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
	schema = {}
	for offset in range(len(bus)):
		b = bus[offset]
		if b == 'x':
			continue
		schema[b.zfill(3)] = offset % int(b)
	print('\nschema', schema)

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

	def isValid(t):
		for busNr in sorted(schema.keys()):
			if t % int(busNr) != (schema[highest] - schema[busNr]) % min(int(busNr), int(highest)):
				return False
		return True
		
	interval = longestInterval
	time = firstMeet
	loop = 0
	cheat37 = 1
	cheat37_diff = 37 - (schema[highest] - schema['037'])
	cheat17 = 1
	cheat17_diff = schema[highest] - schema['017']
	cheat19 = 1
	cheat19_diff = 19 - (schema[highest] - schema['019'])
	cheat29 = 1
	cheat29_diff = schema[highest] - schema['029']
	print('\n ==> starting loop from', time, ', interval is', interval)
	while time < 825305207525500+10:
		if isValid(time):
			print('\nfound it', time)
			print('answer is', time - schema[highest])
			print('========> Loop was', loop, 'times')
			break
#		if cheat17 != 10 and time % 17 == cheat17_diff:
#			interval *= 17
#			cheat17 = 10
#			print('up 17', interval)
#			
		if cheat37 != 10 and time % 37 == cheat37_diff:
			interval *= 37
			cheat37 = 10
			print('up 37', interval)
#			
		if cheat19 != 10 and time % 19 == cheat19_diff:
			interval *= 19
			cheat19 = 10
			print('up 19', interval)
#			
#		if cheat29 != 10 and time % 29 == cheat29_diff:
#			interval *=299
#			cheat29 = 10
#			print('up', interval)
#		print(time, loop, time%19, time%29, time%37)
		time += interval
		loop += 1
	print('no result found')

#print(part2('17,x,13,19'), 'answer should be', 3417)
#print(part2('67,7,x,59,61'), 'answer should be', 1261476)
#print(part2('1789,37,47,1889'), 'answer should be', 1202161486)
print(part2('17,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,523,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,13,19,x,x,x,23,x,x,x,x,x,x,x,787,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,29'), 'answer should be', '825305207525452')

#firstHitAndInterval(29,17,9)

print()