import re
from collections import deque, defaultdict
from itertools import combinations, product

file = open("input.txt", "r")
lines = file.read()
file.close()

def parse(rawInput):
	res = defaultdict(set)
	allIngredents = defaultdict(int)
	for line in rawInput.split('\n'):
		ingredents, allergies = line[:-1].split(' (contains ')
		
		ingSet = set(ingredents.split(' '))
		for i in ingSet:
			allIngredents[i] += 1
		for al in allergies.split(', '):
			res[al] = res[al].intersection(ingSet) if res[al] else ingSet	
	return res, allIngredents

def main(rawInput):
	print()
	foodDict, allIngredents = parse(rawInput)
	print(foodDict)

	notAllergy = set(allIngredents.keys()) - set.union(*foodDict.values())
	print('\npart 1', sum([ allIngredents[na] for na in notAllergy]))

	allergyDict = {}
	isDone = False
	while not isDone:
		isDone = True
		for allergy, foods in foodDict.items():
			if isinstance(foods, str):
				continue
			isDone = False
			if len(foods) == 1:
				found = list(foods)[0]
				allergyDict[found] = allergy
				foodDict[allergy] = found
			else:
				notFound = [ food for food in foods if not food in allergyDict]
				foodDict[allergy] = notFound
		
	print('part 2', ','.join([ foodDict[k] for k in sorted(foodDict.keys()) ]))
	
	
test = '''mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)'''

main(lines)
main(test)