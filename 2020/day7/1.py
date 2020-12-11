import re
  
#file = open("test.txt", "r")
file = open("input.txt", "r")
lines = file.read().split("\n")
file.close()

def parse(line):
	m = re.search('(.*) bags contain (.*)$', line)
	inner = m.group(2).split(',')
	res = []
	for bag in inner:
		m_inner = re.search('(\d+) (.*) bag', bag)
		if m_inner:
			res.append([ m_inner[2], m_inner[1] ])

	# in: muted salmon bags contain 4 faded lavender bags, 4 posh magenta bags.
	# out: 'muted salmon', [[ 'faded lavender', 4 ], [ 'posh magenta', 4]]
	return m.group(1), res

def main1():
	dic = dict()
	for line in lines:
		color, formula = parse(line)
		for bag, count in formula:
			if bag in dic.keys():
				dic[bag].append(color)
			else:
				dic[bag] = [color]
	
	contains = set()
	toTest = dic['shiny gold']
	while toTest:
		color = toTest.pop(0)
		contains.add(color)
		if color in dic.keys():
			toTest.extend(dic[color])
	return len(contains)


def getBagCount(formulaList, dic):
	total = 0
	for name, factor in formulaList:
		if not dic[name]:
			total += 1 * int(factor)
		else:
			total += int(factor) * (getBagCount(dic[name], dic) +1)

	return total
		
def main2():
	dic = dict(list(map(parse, lines)))

	return getBagCount(dic['shiny gold'], dic)
	


print(main1())
print(main2())