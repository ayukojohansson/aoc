def main(a,b):
	subNr = 7
	loop = 0
	v = 1
	reminder = 0
	while v != a:
		prev = v
		loop += 1
		v *= 7
		v = v % 20201227
		if not loop % 1000000:
			print(loop)
	print('loop', loop)

	v = 1
	for _ in range(loop):
		v *= b
		v = v % 20201227
	print('res', v)



key1, key2 = 9717666, 20089533
#key1, key2 = 5764801, 17807724

main(key1,key2)