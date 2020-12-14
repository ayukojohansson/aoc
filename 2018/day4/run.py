import re
  
file = open("input.txt", "r")
lines = sorted(file.read().split('\n'))
file.close()

#print('\n'.join(lines))

#lines = '''[1518-11-01 00:00] Guard #10 begins shift
#[1518-11-01 00:05] falls asleep
#[1518-11-01 00:25] wakes up
#[1518-11-01 00:30] falls asleep
#[1518-11-01 00:55] wakes up
#[1518-11-01 23:58] Guard #99 begins shift
#[1518-11-02 00:40] falls asleep
#[1518-11-02 00:50] wakes up
#[1518-11-03 00:05] Guard #10 begins shift
#[1518-11-03 00:24] falls asleep
#[1518-11-03 00:29] wakes up
#[1518-11-04 00:02] Guard #99 begins shift
#[1518-11-04 00:36] falls asleep
#[1518-11-04 00:46] wakes up
#[1518-11-05 00:03] Guard #99 begins shift
#[1518-11-05 00:45] falls asleep
#[1518-11-05 00:55] wakes up'''.split('\n')


g_id = ''
shift = {}
sleep_start = 0
for line in lines:
	date, time, order = re.search('\[(.+) (.*)\] (.*)$', line).groups()
	m_start = re.search('Guard #(\d+) begins', order)
	m_sleep = re.search('falls asleep', order)
	m_wake = re.search('wakes up', order)
	if m_start:
		g_id = m_start.group(1)
		if not g_id in shift:
			shift[g_id] = [0 for x in range(0, 60)]
	elif m_sleep:
		sleep_start = int(time.split(':')[1])
	elif m_wake:
		sleep_end = int(time.split(':')[1])
		for t in range(sleep_start, sleep_end):
			shift[g_id][t] += 1
#print(shift)

part1 = [0,0,0]
part2 = [0,0,0]
for guard in shift.keys():
	total = sum(shift[guard])
	longest = max(shift[guard])
	if total > part1[0]:
		part1 = [total, guard, shift[guard].index(longest)]
	if longest > part2[0]:
		part2 = [longest, guard, shift[guard].index(longest)]
	
print()
print('part1=', part1[2] * int(part1[1]))
print('part2=', part2[2] * int(part2[1]))
