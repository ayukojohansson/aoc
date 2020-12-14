import re
  
file = open("input.txt", "r")
text = file.read().split('\n')
file.close()

test = '''Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.'''.split('\n')

def parse(inputs):
	res = {}
	locked = {}
	for line in inputs:
		before, after = re.search('Step (.) must be finished before step (.) can begin.', line).groups()
		if before in res:
			res[before].append(after)
		else:
			res[before] = [after]

		if after in locked:
			locked[after].append(before)
		else:
			locked[after] = [before]
	return res, locked

def part1(inputs):
	dependency, locks = parse(inputs)
	order = []
	print(dependency)
	print(locks)
	while True:
		unlocked = set(dependency.keys()) - set(locks.keys())
		nextStep = min(unlocked)
		order.append(nextStep)
		if len(dependency.keys()) == 1:
			order.extend(dependency[nextStep])
			break

		for unblocked in dependency.pop(nextStep):
			locks[unblocked].remove(nextStep)
			if not locks[unblocked]:
				locks.pop(unblocked)
	return ''.join(order)

#print(part1(text))
def findNextWorker(workers):
	candidateName = None
	freeWorker = None
	for worker in workers:
		if not worker['job']:
			freeWorker = worker['name']
		elif candidateName == None or workers[candidateName]['until'] > worker['until']:
			candidateName = worker['name']
	return freeWorker, candidateName

def part2(inputs):
	dependency, locks = parse(inputs)
	order = []
	currentTime = 0
	workers = [ { 'job': '', 'name': x, 'until': 0 } for x in range(0,5)]
	unlocked = set(dependency.keys()) - set(locks.keys())
	print(dependency)
	print(locks)

	while True:
		
		print('worker status:', currentTime, workers )
		
		nextJob = min(unlocked) if unlocked else None
		print('next job', nextJob)
		print('waiting job', unlocked)
		freeWorkerName, earliestFinish = findNextWorker(workers)
		print('free: ', freeWorkerName, 'earliestFinish: ', earliestFinish)


		if nextJob and freeWorkerName != None:
			freeWorker = workers[freeWorkerName]
			unlocked.remove(nextJob)
			workers[freeWorkerName] = {
				'job': nextJob,
				'name': freeWorkerName,
				'unlock': dependency.pop(nextJob, []),
				'until': currentTime + ord(nextJob) - 64 + 60
			}

		elif earliestFinish != None:
			finishingWorker = workers[earliestFinish]
			currentTime = finishingWorker['until']
			order.append(finishingWorker['job'])
			for unblocked in finishingWorker['unlock']:
				locks[unblocked].remove(finishingWorker['job'])
				if not locks[unblocked]:
					unlocked.add(unblocked)
			workers[earliestFinish] = {
				'job': '',
				'name': earliestFinish
			}
		else:
			print(order)
			print(dependency)
			print(locks)
			print('time: ', currentTime)
			break

		print('worker status:', currentTime, workers )
		print('current order: ', order)
		print()


			





	return ''.join(order)

print(part2(text))