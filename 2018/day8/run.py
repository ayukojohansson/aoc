import re
  
file = open("input.txt", "r")
text = file.read().split(' ')
file.close()

test = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'.split(' ')

def main1(inputs):
	pointer = 0
	metas = []
	nodes = []
	print(inputs)
	while pointer < len(inputs):
#		print(nodes, pointer)
		childCount = inputs[pointer]
		metaCount = inputs[pointer+1]
		pointer += 2
		if not childCount:
			metas.append(inputs[pointer:pointer+metaCount])
			print(metas)
			pointer += metaCount
			processing = nodes.pop()
			while processing and processing[0] == 1:
				metas.append(inputs[pointer:pointer+processing[1]])
				print(metas)
				pointer += processing[1]
				processing = nodes.pop() if len(nodes) else False
			if processing == False:
				break
			nodes.append([processing[0] - 1, processing[1]])
		else:
			nodes.append([childCount, metaCount])
#	print(sum(metas))
		
main1(list(map(int, test)))
		